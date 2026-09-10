import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('Blender export has valid geometry, articulated groups and the established hull footprint',()=>{
 const base=new URL('../assets/',import.meta.url),meta=JSON.parse(readFileSync(new URL('tideline-r01.json',base),'utf8'));
 const bytes=readFileSync(new URL('tideline-r01.bin',base)),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 assert.deepEqual(Object.keys(meta.groups).sort(),['bars','chassis','nozzle']);
 let triangles=0;
 for(const batch of meta.meshes){
  assert.ok(meta.materials[batch.material]);assert.equal(batch.vertices%3,0);triangles+=batch.vertices/3;
  assert.ok(batch.offset+batch.vertices*24<=bytes.length);
  for(let i=0;i<batch.vertices;i++){
   const off=batch.offset+i*24;
   for(let k=0;k<3;k++){const v=bytes.readFloatLE(off+k*4)+meta.groups[batch.group][k];assert.ok(Number.isFinite(v));min[k]=Math.min(min[k],v);max[k]=Math.max(max[k],v);}
   const n=Math.hypot(...[3,4,5].map(k=>bytes.readFloatLE(off+k*4)));assert.ok(Math.abs(n-1)<.001);
  }
 }
 assert.ok(triangles>20000&&triangles<100000);assert.ok(meta.meshes.length<=24);
 assert.ok(min[0]>-.9&&max[0]<.9);assert.ok(min[2]>-2.2&&max[2]<2.2);
 assert.ok(min[1]>-.6&&max[1]<1.4,'rider and physics anchors are unchanged');
 const glb=readFileSync(new URL('Tideline R-01.glb',base));assert.equal(glb.toString('ascii',0,4),'glTF');assert.equal(glb.readUInt32LE(8),glb.length);
});
