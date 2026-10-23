import test from 'node:test';
import assert from 'node:assert/strict';
import { createCameraLayer } from '../src/camera-layer.js';

class Element extends EventTarget {
  children=[];style={};attributes=new Map();hidden=false;className='';
  classList={add(){},remove(){},toggle(){}};
  constructor(tag='div'){super();this.tagName=tag.toUpperCase();}
  append(...nodes){for(const node of nodes){node.parent=this;this.children.push(node);}}
  replaceChildren(...nodes){this.children=[];this.append(...nodes);}
  get firstChild(){return this.children[0];}
  setAttribute(key,value){this.attributes.set(key,value);}
  removeAttribute(key){this.attributes.delete(key);delete this[key];}
  getAttribute(key){return this.attributes.get(key);}
  contains(node){return node===this||this.children.some(child=>child.contains(node));}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(node=>node!==this);}
  querySelector(selector){
    for(const node of this.children){
      if(selector.startsWith('.')?node.className.split(' ').includes(selector.slice(1))
        :node.tagName===selector.toUpperCase())return node;
      const nested=node.querySelector(selector);if(nested)return nested;
    }
    return null;
  }
  getBoundingClientRect(){return {left:100,right:300,top:100,bottom:300};}
}

async function fixture(t){
  t.mock.timers.enable({apis:['setTimeout','setInterval']});
  const old={document:globalThis.document,fetch:globalThis.fetch,getComputedStyle:globalThis.getComputedStyle};
  const doc=new EventTarget(),nodes=new Map(),listeners=new Set(),panel=new Element(),stage=new Element();
  doc.body=new Element();doc.hidden=false;doc.createElement=tag=>new Element(tag);
  doc.getElementById=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
  doc.querySelectorAll=()=>[panel];
  const add=doc.addEventListener.bind(doc),remove=doc.removeEventListener.bind(doc);
  doc.addEventListener=(type,fn,options)=>{listeners.add(type);add(type,fn,options);};
  doc.removeEventListener=(type,fn,options)=>{listeners.delete(type);remove(type,fn,options);};
  doc.getElementById('cameraLayerToggle').checked=true;
  globalThis.document=doc;globalThis.fetch=async()=>({ok:true,json:async()=>({cameras:[]})});
  globalThis.getComputedStyle=()=>({display:'block',visibility:'visible'});
  let projected=0;
  const photographic={active:true,projectLocation(item){
    projected++;
    return item.id==='philadelphia-webcam'?{x:200,y:200}
      :item.id==='camden-webcam'?{x:600,y:200}:null;
  }};
  const layer=createCameraLayer({Vector3:class{}},{stage,photographic,sampleElevation:()=>10,
    projection:{lonToX:n=>n,latToZ:n=>n},motion:{pause(){},flyTo(){}}});
  const ctx={pose:{lon:-75.16,lat:39.95,dist:10000,pitch:48,bearing:30,fov:42},
    width:1000,height:800,exaggeration:1};
  const root=stage.children[0],card=doc.body.children[0];
  const fire=(type,target)=>{
    const event=new Event(type);Object.defineProperty(event,'target',{value:target});
    doc.dispatchEvent(event);target.dispatchEvent(event);
  };
  const update=()=>layer.update({},ctx);
  t.after(()=>{layer.dispose();Object.assign(globalThis,old);});
  await new Promise(resolve=>setImmediate(resolve));update();
  return {layer,panel,root,card,doc,listeners,update,fire,tick:ms=>t.mock.timers.tick(ms),
    pins:()=>root.children.filter(node=>!node.hidden),get projected(){return projected;}};
}

test('camera markers recover uncovered space and avoid reopened panels without moving the map',async t=>{
  const f=await fixture(t);assert.equal(f.pins().length,1);
  f.panel.hidden=true;f.fire('click',f.panel);await Promise.resolve();f.update();
  assert.equal(f.pins().length,2,'the stationary map must reveal the newly uncovered camera');
  const work=f.projected;
  for(let i=0;i<120;i++)f.update();
  assert.equal(f.projected,work,'a stationary layout must not reproject its catalog every frame');
  f.panel.hidden=false;f.fire('toggle',f.panel);await Promise.resolve();f.update();
  assert.equal(f.pins().length,1,'markers must stop covering the reopened panel');
});

test('camera preview controls and scrolling keep their media mounted',async t=>{
  const f=await fixture(t),pin=f.pins()[0];
  f.fire('focus',pin);f.tick(350);
  assert.equal(f.card.hidden,false);const frame=f.card.querySelector('iframe');assert.ok(frame);
  const work=f.projected;
  for(const [type,target] of [['click',pin],['click',frame],['scroll',f.card],['input',frame]]){
    f.fire(type,target);f.update();
    assert.equal(f.card.hidden,false);assert.equal(f.card.querySelector('iframe'),frame);
  }
  assert.equal(f.projected,work,'preview interaction must not invalidate map placement');
});

test('camera placement follows completed panel transitions and window restores',async t=>{
  const f=await fixture(t);
  f.panel.hidden=true;f.fire('transitionend',f.panel);await Promise.resolve();f.update();
  assert.equal(f.pins().length,2);
  f.panel.hidden=false;f.fire('map-window-restore',f.panel);await Promise.resolve();f.update();
  assert.equal(f.pins().length,1);
  f.panel.hidden=true;f.fire('map-window-collapse',f.panel);await Promise.resolve();f.update();
  assert.equal(f.pins().length,2);
});

test('disposing the camera layer removes its document layout listeners',async t=>{
  const f=await fixture(t);assert.ok(f.listeners.has('toggle'));
  f.layer.dispose();assert.equal(f.listeners.size,0);
  const work=f.projected;f.fire('click',f.panel);f.update();assert.equal(f.projected,work);
});
