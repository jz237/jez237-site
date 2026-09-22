import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import { prepareInBatches } from '../src/background-work.js';
import { canopySites, prepareCanopy } from '../src/canopy-layout.js';
import { woodlandIndex, prepareWoodland } from '../src/woodland.js';
import { createDiorama } from '../src/diorama.js';

const projection={widthM:2400,heightM:2400,metersPerDegLon:85000,metersPerDegLat:111000,
  lonToX:lon=>(lon+75.2)*85000,latToZ:lat=>(40-lat)*111000,
  xToLon:x=>x/85000-75.2,zToLat:z=>40-z/111000};
const ring=[[-75.22,39.98],[-75.18,39.98],[-75.18,40.02],[-75.22,40.02],[-75.22,39.98]];
const hole=[[-75.202,39.998],[-75.198,39.998],[-75.198,40.002],[-75.202,40.002]];
const doc={features:[{geometry:{type:'Polygon',coordinates:[ring,hole]}}]};

test('batch preparation yields repeatedly while preserving every crown and clearing', async () => {
  let clock=0,pauses=0;
  const options={now:()=>++clock,budget:2,pause:async()=>{pauses++;}};
  const coverage=await prepareWoodland(doc,options), original=woodlandIndex(doc);
  const a=canopySites(original,projection,()=>25);
  const b=await prepareCanopy(coverage,projection,()=>25,null,options);
  assert.ok(a.sizes.length>0); assert.deepEqual(b,a); assert.ok(pauses>2);
  assert.equal(coverage(-75.2,40),false,'Mapped clearing remains empty');
});

test('aborting background preparation closes the generator before another batch', async () => {
  const controller=new AbortController();let steps=0,closed=false;
  function* work(){try{for(let i=0;i<50;i++){steps++;yield;}}finally{closed=true;}}
  await assert.rejects(prepareInBatches(work(),{signal:controller.signal,budget:0,
    pause:async()=>controller.abort()}),{name:'AbortError'});
  assert.equal(steps,1); assert.equal(closed,true);
});

test('disposing a stage during woodland preparation never attaches late meshes', async () => {
  let notifications=0;
  const stage=createDiorama(THREE,{terrain:{uniforms:{uHeight:{value:new THREE.Texture()},
    uExag:{value:1}}},projection,sampleElevation:()=>25,onReady:()=>notifications++});
  const work=stage.setWoodland(doc);
  assert.equal(stage.setWoodland(doc),work,'One preparation per woodland document');
  stage.dispose(); await work;
  assert.equal(stage.group.children.length,2); assert.equal(notifications,0);
});

test('prepared woodland attaches the same complete crown count', async () => {
  const stage=createDiorama(THREE,{terrain:{uniforms:{uHeight:{value:new THREE.Texture()},
    uExag:{value:1}}},projection,sampleElevation:()=>25});
  await stage.setWoodland(doc);
  assert.equal(stage.group.children.at(-1).userData.total,
    canopySites(woodlandIndex(doc),projection,()=>25).sizes.length);
  stage.dispose();
});


test('incremental terrain decoding and shading grid preserve exact elevations and integrity probes', async () => {
  const {decodeHeightmap,prepareHeightmap,buildMacroGrid,prepareMacroGrid}=await import('../src/terrain.js');
  const width=256,height=256,data=new Uint8ClampedArray(width*height*4);
  for(let i=0;i<data.length;i++)data[i]=(i*7)%256;
  const meta={width,height,elevation:{min:-12,step:.25},probes:[{x:0,y:0,q:999}]};
  let time=0,pauses=0;
  const options={now:()=>++time,budget:0,pause:async()=>{pauses++;}};
  const decoded=await prepareHeightmap({data},meta,options);
  assert.deepEqual(decoded,decodeHeightmap({data},meta));
  assert.equal(decoded.probeFailures.length,1);
  assert.deepEqual(await prepareMacroGrid(decoded.grid,width,height,16,options),
    buildMacroGrid(decoded.grid,width,height,16));
  assert.ok(pauses>=18);
});
