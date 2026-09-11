import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {tiledLeafIndices,optimizeLeafIndexOrder} from '../lib/LeafIndexOrder.ts';
import {AquariumLighting} from '../lib/AquariumLighting.ts';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
const faces=a=>{const list=[];for(let i=0;i<a.length;i+=3)list.push(`${a[i]},${a[i+1]},${a[i+2]}`);return list.sort();};
const misses=(indices,size)=>{const cache=[];let count=0;for(const v of indices){const i=cache.indexOf(v);if(i<0)count++;else cache.splice(i,1);cache.unshift(v);cache.length=Math.min(size,cache.length);}return count;};
test('leaf tiling preserves every oriented triangle and improves vertex reuse',()=>{
 for(const [rows,cols,tile] of [[20,8,3],[40,16,4]]){
  const original=tiledLeafIndices(rows,cols,Math.max(rows,cols)),tiled=tiledLeafIndices(rows,cols,tile);
  assert.deepEqual(faces(tiled),faces(original));assert.equal(tiled.length,original.length);
  for(const cache of [16,32])assert.ok(misses(tiled,cache)<=misses(original,cache));
  assert.ok(misses(tiled,16)<misses(original,16)*.8);
 }
});
test('fused output retains full-resolution AO, beauty multisampling and renderer state',()=>{
 const lighting=new AquariumLighting(new T.Scene(),new T.PerspectiveCamera());lighting.resize(390,844);
 assert.equal(lighting.beauty.samples,2);assert.ok(lighting.beauty.depthTexture);
 assert.equal(lighting.contact.gtaoRenderTarget.width,390);assert.equal(lighting.contact.pdRenderTarget.height,844);
 assert.equal(lighting.contact.gtaoRenderTarget.depthBuffer,false);assert.equal(lighting.contact.pdRenderTarget.depthBuffer,false);
 let target={name:'previous'},sceneRenders=0,contactRenders=0,outputRenders=0;const original=target;
 const renderer={getRenderTarget:()=>target,setRenderTarget:t=>target=t,render:()=>sceneRenders++,info:{render:{triangles:123}}};
 lighting.contact.render=()=>{assert.equal(lighting.contact.output,GTAOPass.OUTPUT.Off);contactRenders++;};
 lighting.output.render=(_renderer,_write,read)=>{assert.equal(read,lighting.beauty);assert.equal(lighting.output.uniforms.aquariumAO.value,lighting.contact.gtaoMap);outputRenders++;};
 assert.equal(lighting.render(renderer,null),123);assert.equal(target,original);assert.deepEqual([sceneRenders,contactRenders,outputRenders],[1,1,1]);
 lighting.render(renderer,'contact');assert.equal(lighting.output.uniforms.inspectionMode.value,1);
 lighting.render(renderer,'unshaded');assert.equal(lighting.output.uniforms.inspectionMode.value,2);
 lighting.output.render=()=>{throw Error('test failure');};assert.throws(()=>lighting.render(renderer,null),/test failure/);assert.equal(target,original);
 lighting.dispose();
});
