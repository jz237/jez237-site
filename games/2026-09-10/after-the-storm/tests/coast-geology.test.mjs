import test from 'node:test';import assert from 'node:assert/strict';
import {islandElevation,geologyNoise} from '../coast-geology.js';
test('eroded islands have submerged boundaries, bounded peaks and deterministic detail',()=>{
 for(const seed of [0,51,819]){
  let high=-Infinity;for(let z=-1;z<=1;z+=.025)for(let x=-1;x<=1;x+=.025){const h=islandElevation(x,z,seed);assert.ok(Number.isFinite(h)&&h>=-12&&h<170);high=Math.max(high,h);}
  assert.ok(high>65);for(let i=0;i<64;i++){const a=i/64*Math.PI*2;assert.equal(islandElevation(Math.cos(a)*1.1,Math.sin(a)*1.1,seed),-12);}
 }
 assert.equal(islandElevation(.13,.28,18),islandElevation(.13,.28,18));assert.notEqual(islandElevation(.13,.28,18),islandElevation(.13,.28,19));
});
test('geology noise is continuous across cells and supports negative coordinates',()=>{
 for(const x of [-2,-1,0,1,2]){const a=geologyNoise(x-1e-5,.37,4),b=geologyNoise(x+1e-5,.37,4);assert.ok(Math.abs(a-b)<1e-6);assert.ok(a>=0&&a<=1);}
});
