import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {makeShoreWash} from '../shore-wash.js';
import {createRaceWater,setRaceWater} from '../race-water.js';
import {waterLevel} from '../simulation.js';

test('shore film distinguishes submerged ground from retained runoff after the sea retreats',()=>{
 const water=createRaceWater({crafts:[{x:0,z:0,heading:0,hydro:{y:0}}],baseAmplitudeNative:0,initialNoise:false,datumNative:16});
 const wash=makeShoreWash(new T.Scene()),camera=new T.Vector3(0,2,0),oldLevel=waterLevel.value;
 setRaceWater(water);waterLevel.value=.4;
 try{
  wash.reset({ground:()=>.2,rocks:[]});wash.update(0,0,camera,1);wash.update(.1,0,camera,1);
  const a=wash.mesh.geometry.attributes,center=24*49+24;
  assert.ok(a.washDepth.getX(center)>.19,'the rising sea wets the bank');
  assert.ok(a.washClearance.getX(center)<-.19,'wet submerged ground must not render a separate film');
  water.field.datumNative=0;waterLevel.value=0;
  const source=water.field.heightQ.slice(),frames=water.frames;
  wash.update(.2,0,camera,1);
  assert.ok(a.washDepth.getX(center)>.19,'retained runoff remains after the sea retreats');
  assert.ok(a.washClearance.getX(center)>.19,'exposed wet ground is eligible for film');
  assert.deepEqual(water.field.heightQ,source);assert.equal(water.frames,frames,'presentation must not evolve source water');
  const held=Object.fromEntries(['position','washDepth','washClearance'].map(k=>[k,Array.from(a[k].array)]));
  wash.update(.2,0,camera,1);
  for(const [key,value] of Object.entries(held))assert.deepEqual(Array.from(a[key].array),value);
  assert.equal(a.position.count,2401,'retain the existing film geometry');
  wash.reset({ground:()=>4,rocks:[]});
  assert.ok(a.washDepth.array.every(v=>v===0),'old shore film clears immediately on course changes');
  assert.ok(a.washClearance.array.every(v=>v<0));assert.equal(wash.stats.wetCells,0);
 }finally{wash.dispose();setRaceWater(null);waterLevel.value=oldLevel;}
});
