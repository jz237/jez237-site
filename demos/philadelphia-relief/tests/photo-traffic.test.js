import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as THREE from '../vendor/three.module.min.js';
import {createCityStreets} from '../src/city-streets.js';
import {createCityUniforms} from '../src/city-lighting.js';
import {defaults} from '../src/schema.js';
import {photoCarHeading,createPhotoTraffic} from '../src/photo-traffic.js';

test('photo simulation advances, pauses, and hands the same cars back to the diorama',async t=>{
  const oldFetch=globalThis.fetch;
  globalThis.fetch=async()=>({ok:true,json:async()=>({roads:[{id:1,oneway:1,width:10,
    points:[[1,0,0],[2,100,0],[3,100,100],[4,0,100],[1,0,0]]}]})});
  const streets=createCityStreets(THREE,{scene:new THREE.Scene(),
    projection:{lonToX:x=>x,latToZ:z=>z,xToLon:x=>x,zToLat:z=>z},sampleElevation:()=>4,
    lighting:{uniforms:createCityUniforms(THREE)}});
  t.after(()=>{streets.dispose();globalThis.fetch=oldFetch;});
  const params={camera:{position:new THREE.Vector3()},pose:{lon:50,lat:50,dist:350},
    state:{...defaults(),streetMotion:'on'},exaggeration:1,sunDir:new THREE.Vector3(0,1,0),
    dt:.05,quality:'performance',photo:true};
  streets.update(params);
  for(let i=0;i<100&&streets.stats().loading;i++)await new Promise(r=>setTimeout(r,10));
  streets.update(params);assert.ok(streets.photoCars.length>0);
  const first=streets.photoCars.map(c=>({...c}));
  for(let i=0;i<30;i++)streets.update(params);
  assert.ok(streets.photoCars.some((c,i)=>Math.hypot(c.lon-first[i].lon,c.lat-first[i].lat)>.1));
  params.state.streetMotion='off';streets.update(params);
  const stopped=streets.photoCars.map(c=>({...c}));streets.update(params);
  assert.deepEqual(streets.photoCars,stopped);assert.equal(streets.animating,false);
  const count=streets.stats().cars;streets.update({...params,photo:false});
  assert.equal(streets.stats().cars,count);
  params.state.streetLife=0;streets.update(params);assert.equal(streets.photoCars.length,0);
});

test('photo car headings include the authored glTF forward-axis correction',()=>{
  assert.equal(photoCarHeading(0),Math.PI);
  assert.equal(photoCarHeading(Math.PI/2),Math.PI/2);
  assert.equal(photoCarHeading(Math.PI),0);
});

function fixture(){
  let source,renders=0,removed,queries=0,height=30,time=0;
  const entities={values:[],suspendEvents(){},resumeEvents(){},
    add(e){this.values.push(e);return e;},remove(e){this.values=this.values.filter(v=>v!==e);}};
  const C={CustomDataSource:class{entities=entities;},Cartesian3:class{
    static fromDegrees(lon,lat,height,_e,out){Object.assign(out,{lon,lat,height});return out;}},
    Quaternion:class{},HeadingPitchRoll:class{},Ellipsoid:{WGS84:{}},
    Cartographic:class{static fromDegrees(lon,lat,height,out){Object.assign(out,{lon,lat,height});return out;}},
    Transforms:{headingPitchRollQuaternion(_p,h,_e,_f,out){out.heading=h.heading;return out;}},
    HeightReference:{NONE:0,CLAMP_TO_3D_TILE:3},ShadowMode:{DISABLED:0}};
  const viewer={dataSources:{add(s){source=s;},remove(s,destroy){removed={s,destroy};}},
    scene:{requestRender(){renders++;},getHeight(_position,reference){
      assert.equal(reference,3);queries++;return height;}}};
  const layer=createPhotoTraffic(C,viewer,{now:()=>time});
  return {layer,entities,get source(){return source;},get renders(){return renders;},
    get removed(){return removed;},get queries(){return queries;},
    set height(value){height=value;},set time(value){time=value;}};
}
const car={id:1,lon:1,lat:2,angle:0,variant:5,van:false};

test('photo models retain identity, request a frame, remove distant cars and release their data source',()=>{
  const f=fixture(),{layer,entities}=f;
  layer.update([car]);const entity=entities.values[0];
  assert.equal(entity.model.heightReference,0);assert.match(entity.model.uri,/car-5.glb$/);
  assert.equal(entity.position.height,30.12);assert.equal(entity.show,true);
  layer.update([{...car,lon:3}]);assert.equal(entities.values.length,1);
  assert.equal(entity.position.lon,3);assert.equal(f.renders,2);
  layer.show(false);assert.equal(f.source.show,false);
  layer.update([]);assert.equal(entities.values.length,0);
  assert.equal(f.renders,4); // Visibility and removing the last car both repaint.
  layer.dispose();assert.deepEqual(f.removed,{s:f.source,destroy:true});
  layer.update([car]);assert.equal(entities.values.length,0);
});

test('road sampling stays bounded and eventually grounds every car without per-frame recasts',()=>{
  const f=fixture(),cars=Array.from({length:100},(_,i)=>({...car,id:i,lon:1+i*.0001}));
  for(let frame=0;frame<25;frame++){
    const before=f.queries;f.layer.update(cars);assert.ok(f.queries-before<=4);
  }
  assert.equal(f.entities.values.filter(e=>e.show).length,100);
  const queries=f.queries,renders=f.renders;
  f.layer.update(cars);assert.equal(f.queries,queries);assert.equal(f.renders,renders);
  f.layer.update(cars.map(c=>({...c,lon:c.lon+.000001})));
  assert.ok(f.queries-queries<=4);assert.equal(f.renders,renders+1);
});

test('cars wait for loaded road geometry and refresh refined heights without a zero-height flash',()=>{
  const f=fixture();f.height=undefined;f.layer.update([car]);
  const entity=f.entities.values[0];assert.equal(entity.show,false);assert.equal(entity.position,undefined);
  f.height=30;f.time=1001;f.layer.update([car]);assert.equal(entity.show,true);
  assert.equal(entity.position.height,30.12);
  f.height=31;f.time=16002;f.layer.update([car]);assert.equal(entity.position.height,31.12);
  f.height=undefined;f.layer.update([{...car,lon:car.lon+.01}]);assert.equal(entity.show,false);
});

test('all photo vehicle variants are complete metre-scale self-contained GLB files',async()=>{
  for(const type of ['car','van'])for(let i=0;i<7;i++){
    const bytes=await readFile(new URL(`../models/traffic-${type}-${i}.glb`,import.meta.url));
    assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(8),bytes.length);
    const size=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+size).toString());
    assert.equal(doc.buffers[0].uri,undefined);const {min,max}=doc.accessors[0];
    assert.ok(min[1]>=0&&max[1]<2.1);assert.ok(max[0]-min[0]>4&&max[0]-min[0]<7);
  }
});
