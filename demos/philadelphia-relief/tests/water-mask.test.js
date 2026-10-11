import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as THREE from '../vendor/three.module.min.js';
import { createProjection } from '../src/geo.js';
import { collectRings } from '../src/vectors.js';
import { waterMaskSteps,localWaterCell,projectWaterPolygons,createWaterMask } from '../src/water-mask.js';

const ring=(x,z,w,h)=>[[x,z],[x+w,z],[x+w,z+h],[x,z+h],[x,z]];
const polygon=(outer,holes=[])=>({rings:[outer,...holes],bounds:[Math.min(...outer.map(p=>p[0])),
  Math.min(...outer.map(p=>p[1])),Math.max(...outer.map(p=>p[0])),Math.max(...outer.map(p=>p[1]))]});
function raster(polygons,bounds,size){
  const work=waterMaskSteps(polygons,bounds,size);
  for(;;){const step=work.next();if(step.done)return step.value;}
}
test('water coverage preserves islands, coastlines and north-to-south orientation',()=>{
  const data=raster([polygon(ring(1,1,7,7),[ring(3,3,2,2)])],[0,0,10,10],10);
  assert.equal([...data].filter(Boolean).length,45);
  assert.equal(data[2*10+2],255);assert.equal(data[3*10+3],0);
  assert.equal(data[0*10+2],0);assert.equal(data[8*10+2],0);
  assert.deepEqual(raster([polygon(ring(1,1,7,7).reverse(),[ring(3,3,2,2).reverse()])],
    [0,0,10,10],10),data,'ring orientation does not change coverage');
});
test('offscreen polygons and holes clip without spilling into another raster row',()=>{
  const data=raster([polygon(ring(-5,-3,12,8),[ring(-1,-1,3,3)]),
    polygon(ring(12,0,8,8)),polygon(ring(8,7,5,5))],[0,0,10,10],10);
  assert.equal([...data].filter(Boolean).length,37);
  assert.equal(data[0],0);assert.equal(data[4*10+6],255);assert.equal(data[4*10+7],0);
  assert.equal(data[6*10+9],0);assert.equal(data[7*10+8],255);
});
test('local water coverage has stable bounded cells and two metre close-up sampling',()=>{
  const first=localWaterCell(0,0,200),near=localWaterCell(100,-100,200);
  assert.deepEqual(first,near);assert.equal((first.bounds[2]-first.bounds[0])/2048,2);
  assert.notEqual(localWaterCell(1800,0,200).key,first.key);
  assert.equal(localWaterCell(0,0,20000),null);
  for(const distance of [200,1000,4000,16000]){
    const cell=localWaterCell(-9800,8700,distance);
    assert.ok(cell.bounds[0]<-9800&&cell.bounds[2]>-9800);
    assert.ok(cell.bounds[1]<8700&&cell.bounds[3]>8700);
  }
});
test('real Delaware coverage follows the mapped shore while leaving both banks dry',async()=>{
  const meta=JSON.parse(await readFile(new URL('../data/terrain.json',import.meta.url)));
  const doc=JSON.parse(await readFile(new URL('../data/water.geojson',import.meta.url)));
  const projection=createProjection(meta),polygons=projectWaterPolygons(collectRings(doc),projection);
  const cell=localWaterCell(projection.lonToX(-75.135),projection.latToZ(39.954),1000);
  const size=512,data=raster(polygons,cell.bounds,size);
  const at=(lon,lat)=>{
    const x=Math.floor((projection.lonToX(lon)-cell.bounds[0])/(cell.bounds[2]-cell.bounds[0])*size);
    const z=Math.floor((projection.latToZ(lat)-cell.bounds[1])/(cell.bounds[3]-cell.bounds[1])*size);
    return data[z*size+x];
  };
  assert.equal(at(-75.132,39.955),255);
  assert.equal(at(-75.146,39.953),0);assert.equal(at(-75.119,39.956),0);
});
test('GPU masks share appearance uniforms and release resources on disposal',async()=>{
  const source=Object.fromEntries(['uOpacity','uTime','uColor','uShallow','uSpecColor','uIntensity']
    .map(key=>[key,{value:key==='uOpacity'?1:0}]));
  const projection={widthM:10,heightM:10,lonToX:x=>x,latToZ:z=>z};
  const surface=createWaterMask(THREE,{entries:[{ring:ring(-4,-4,8,8)}],projection,source,size:16});
  await surface.ready;
  assert.equal(surface.uniforms.uWaterReady.value,1);
  assert.equal(surface.uniforms.uWaterOpacity,source.uOpacity);
  assert.equal(surface.uniforms.uWaterGlobal.value.image.data.byteLength,256);
  let disposed=0;surface.uniforms.uWaterGlobal.value.addEventListener('dispose',()=>disposed++);
  surface.update({lon:0,lat:0,dist:200});surface.dispose();
  assert.equal(disposed,1);
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(surface.uniforms.uWaterLocalReady.value,0,'disposed asynchronous work cannot upload');
});
