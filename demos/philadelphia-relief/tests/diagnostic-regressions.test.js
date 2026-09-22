import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import {createNeighborhood} from '../src/neighborhood.js';
import {createMapSurfaces} from '../src/map-surface.js';
import {createMapLayers} from '../src/map-layers.js';
import {streetCell} from '../../../functions/demos/philadelphia-relief/street-detail.js';
import {onRequest as policy} from '../../../functions/demos/philadelphia-relief/_middleware.js';
const settle=()=>new Promise(resolve=>setImmediate(resolve));
const pose={lon:-75.16,lat:39.95,dist:1500};
const state={era:'present',layers:{roads:true,structures:true}};
const projection={lonToX:x=>x,latToZ:y=>y,contains:()=>true};

test('returning to loaded streets cancels a pending neighborhood and ignores its late response', async t=>{
  const requests=[],installed=[];
  t.mock.method(globalThis,'fetch',(url,{signal})=>new Promise(resolve=>requests.push({url,signal,resolve})));
  const layer=createNeighborhood(THREE,{projection,sampleElevation:()=>5,onData:doc=>installed.push(doc)});
  t.after(()=>layer.dispose());
  layer.consider(pose,state);layer.consider(pose,state);
  const documentFor=r=>({...streetCell(new URL(r.url,'https://example.test/').searchParams),elements:[]});
  requests[0].resolve(Response.json(documentFor(requests[0])));await settle();
  const away={...pose,lon:-75.10};layer.consider(away,state);layer.consider(away,state);
  assert.equal(requests.length,2);layer.consider(pose,state);
  assert.equal(requests[1].signal.aborted,true);
  requests[1].resolve(Response.json(documentFor(requests[1])));await settle();
  assert.equal(installed.length,1);assert.equal(layer.hasCoverage(pose),true);
});

test('stalled neighborhood requests time out and back off instead of staying pending forever', async t=>{
  t.mock.timers.enable({apis:['setTimeout','Date']});let calls=0,signal;
  t.mock.method(globalThis,'fetch',(_url,options)=>new Promise((_resolve,reject)=>{
    calls++;signal=options.signal;signal.addEventListener('abort',()=>reject(signal.reason));
  }));
  const layer=createNeighborhood(THREE,{projection,sampleElevation:()=>5,onData(){}});
  t.after(()=>layer.dispose());layer.consider(pose,state);layer.consider(pose,state);
  t.mock.timers.tick(55000);await settle();assert.equal(signal.aborted,true);
  layer.consider(pose,state);assert.equal(calls,1);
  t.mock.timers.tick(60001);layer.consider(pose,state);assert.equal(calls,2);
});

test('historical imagery retries a failed tile without moving the camera and preserves loaded tiles', async t=>{
  let clock=0,calls=0,closed=0;
  t.mock.method(globalThis,'fetch',async()=>{calls++;return new Response('image',{status:calls===1?503:200});});
  const old=globalThis.createImageBitmap;globalThis.createImageBitmap=async()=>({width:256,height:256,close(){closed++;}});
  t.after(()=>{globalThis.createImageBitmap=old;});
  const scene=new THREE.Scene();
  const surface=createMapSurfaces(THREE,{scene,projection,sampleElevation:()=>0,status(){},now:()=>clock});
  surface.setArchive('1996');surface.update(pose,1,true);await settle();await settle();
  const firstCount=calls,ready=scene.children[0].children.length;
  assert.equal(ready,firstCount-1);
  surface.update(pose,1,true);await settle();assert.equal(calls,firstCount,'No rapid retry loop');
  clock=30001;surface.update(pose,1,true);await settle();await settle();
  assert.equal(calls,firstCount+1);assert.equal(scene.children[0].children.length,ready+1);
  surface.dispose();assert.equal(closed,ready+1);assert.equal(scene.children.length,0);
});

class Element extends EventTarget {
  constructor(tag='div'){super();this.tagName=tag.toUpperCase();this.children=[];this.style={setProperty(){}};
    this.classList={add(){},remove(){},toggle(){}};this.value='';this._text='';}
  set textContent(text){this._text=text;this.children=[];}
  get textContent(){return this._text+this.children.map(e=>e.textContent??e).join('');}
  get firstChild(){return this.children[0];}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this._text='';this.children=nodes;}
  setAttribute(){} remove(){} querySelector(){return new Element();}
}
function mapDOM(t){
  const oldDocument=globalThis.document,oldWindow=globalThis.window;
  const nodes=new Map(),doc=new Element();doc.body=new Element();doc.createElement=tag=>new Element(tag);
  doc.getElementById=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
  doc.querySelectorAll=()=>[];globalThis.document=doc;globalThis.window={matchMedia:()=>({matches:false})};
  t.after(()=>{globalThis.document=oldDocument;globalThis.window=oldWindow;});
  return {doc,nodes};
}

test('timed-out property and gauge cards show a failure state instead of remaining Loading', async t=>{
  t.mock.timers.enable({apis:['setTimeout']});const {doc,nodes}=mapDOM(t);
  const gauge={id:'TEST',name:'Station',lon:-75.16,lat:39.95,observed:null,forecast:null,category:'',unit:'ft',forecastUnit:'ft'};
  t.mock.method(globalThis,'fetch',(url,{signal})=>url==='river-gauges'
    ?Promise.resolve(Response.json({gauges:[gauge],checkedAt:Date.now()}))
    :new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(signal.reason))));
  const layer=createMapLayers(THREE,{scene:new THREE.Scene(),stage:new Element(),projection,
    sampleElevation:()=>5,photographic:{},landmarks:{landmarks:[]},motion:{flyTo(){}},getPose:()=>pose});
  const pending=layer.inspect(pose.lon,pose.lat);t.mock.timers.tick(14000);await pending;
  const card=doc.body.children[0];assert.match(card.textContent,/records temporarily unavailable/);
  nodes.get('gaugesToggle').checked=true;nodes.get('gaugesToggle').onchange();await settle();
  nodes.get('gaugeSelect').onchange({target:{value:'TEST'}});t.mock.timers.tick(15000);await settle();
  assert.match(card.textContent,/trend unavailable/);layer.dispose();
});

test('an empty radar refresh hides the old image and disables playback', async t=>{
  t.mock.timers.enable({apis:['setTimeout']});const {nodes}=mapDOM(t);let polls=0;
  t.mock.method(globalThis,'fetch',async url=>url==='radar-frames'
    ?Response.json({frames:++polls===1?['2026-09-22T18:00:00Z']:[]}) :new Response('image'));
  const old=globalThis.createImageBitmap;globalThis.createImageBitmap=async()=>({width:256,height:256,close(){}});
  t.after(()=>{globalThis.createImageBitmap=old;});const scene=new THREE.Scene();
  const layer=createMapLayers(THREE,{scene,stage:new Element(),projection,
    sampleElevation:()=>5,photographic:{},landmarks:{landmarks:[]},motion:{},getPose:()=>pose});
  nodes.get('radarToggle').checked=true;nodes.get('radarToggle').onchange();
  await settle();await settle();const mesh=scene.children[0].children[0];assert.equal(mesh.visible,true);
  t.mock.timers.tick(300000);await settle();
  assert.equal(mesh.visible,false);assert.equal(nodes.get('radarPlay').disabled,true);
  assert.equal(nodes.get('radarFrame').disabled,true);
  assert.match(nodes.get('radarStatus').textContent,/No recent radar frames/);layer.dispose();
});

test('browser-restored map-layer checkboxes activate their data and controls', async t=>{
  const {doc,nodes}=mapDOM(t),requested=[];
  for(const id of ['shipsToggle','gaugesToggle','radarToggle','propertyToggle'])doc.getElementById(id).checked=true;
  t.mock.method(globalThis,'fetch',async url=>{requested.push(url);return Response.json({
    frames:[],vessels:[],gauges:[],checkedAt:Date.now(),configured:true,state:'connected'});});
  const layer=createMapLayers(THREE,{scene:new THREE.Scene(),stage:new Element(),projection,
    sampleElevation:()=>5,photographic:{},landmarks:{landmarks:[]},motion:{},getPose:()=>pose});
  await settle();assert.deepEqual(requested.sort(),['radar-frames','river-gauges','ships']);
  for(const id of ['shipsOptions','gaugesOptions','radarOptions','propertyOptions'])assert.equal(nodes.get(id).hidden,false);
  layer.dispose();
});

test('Philadelphia policy permits its actual analytics connections without allowing arbitrary hosts', async()=>{
  const response=await policy({next:async()=>new Response('map')});
  const connect=response.headers.get('Content-Security-Policy').split(';').find(v=>v.trim().startsWith('connect-src'));
  assert.match(connect,/https:\/\/analytics\.google\.com/);
  assert.match(connect,/https:\/\/www\.google\.com/);assert.ok(!connect.includes('https:;'));
});
