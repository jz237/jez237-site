import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {PUDDLE_WATER,puddleWater} from '../src/world';
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),world=readFileSync(new URL('../src/world.ts',import.meta.url),'utf8');
test('a puddle is dark wet ground under a mirror of the sky, not a pale film',()=>{
  const m=puddleWater();assert.ok(m instanceof T.MeshPhysicalMaterial);
  const c=new T.Color(PUDDLE_WATER.color);assert.ok(Math.max(c.r,c.g,c.b)<.05,'dark: water hardly scatters light');
  assert.equal(m.ior,1.33);assert.equal(m.metalness,0);assert.equal(m.clearcoat,0,'one surface, not a lacquer over it');
  assert.ok(m.roughness<=.05&&m.transparent&&!m.depthWrite&&m.opacity>.8&&m.opacity<1,'smooth, and a little of the ground shows through');
});
test('the quarry puddles and the rain puddles share it',()=>{
  assert.ok(world.includes('const water = softShoreMaterial(puddleWater());'));
  assert.ok(main.includes('rainPuddles??=new RainPuddles(scene,puddleGeometry,softShoreMaterial(puddleWater()),'));
});
