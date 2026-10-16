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

test('photo models retain identity, request a frame, remove distant cars and release their data source',()=>{
  let source,renders=0,removed;
  const entities={values:[],suspendEvents(){},resumeEvents(){},
    add(e){this.values.push(e);return e;},remove(e){this.values=this.values.filter(v=>v!==e);}};
  const C={CustomDataSource:class{entities=entities;},Cartesian3:class{
    static fromDegrees(lon,lat,height,_e,out){Object.assign(out,{lon,lat,height});return out;}},
    Quaternion:class{},HeadingPitchRoll:class{},Ellipsoid:{WGS84:{}},
    Transforms:{headingPitchRollQuaternion(_p,h,_e,_f,out){out.heading=h.heading;return out;}},
    HeightReference:{RELATIVE_TO_3D_TILE:4},ShadowMode:{DISABLED:0}};
  const viewer={dataSources:{add(s){source=s;},remove(s,destroy){removed={s,destroy};}},
    scene:{requestRender(){renders++;}}};
  const layer=createPhotoTraffic(C,viewer),car={id:1,lon:1,lat:2,angle:0,variant:5,van:false};
  layer.update([car]);const entity=entities.values[0];
  assert.equal(entity.model.heightReference,4);assert.match(entity.model.uri,/car-5.glb$/);
  layer.update([{...car,lon:3}]);assert.equal(entities.values.length,1);
  assert.equal(entity.position.lon,3);assert.equal(renders,2);
  layer.show(false);assert.equal(source.show,false);
  layer.update([]);assert.equal(entities.values.length,0);
  layer.dispose();assert.deepEqual(removed,{s:source,destroy:true});
  layer.update([car]);assert.equal(entities.values.length,0);
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
