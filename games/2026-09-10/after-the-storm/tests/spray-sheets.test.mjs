import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {makeSpraySheets} from '../spray-sheets.js';

function rider(t){return {x:3*t,z:18*t,vx:3,vz:18,speed:Math.hypot(3,18),heading:0,throttle:1,yawVelocity:0,
 hydro:{y:.1,vy:0,waterVelocity:0,pitch:0,roll:0,wet:1,portWet:1,starboardWet:1,airborne:false}};}
function sample(sheet,row,side=0){const a=sheet.mesh.geometry.attributes,i=side*22*6+row*6+2;return {
 age:a.uv.getY(i),position:[a.position.getX(i),a.position.getY(i),a.position.getZ(i)],load:a.load.getX(i)};}

test('the same emitted spray packet has the same breakup age and shape at sparse or dense refresh rates',()=>{
 const dense=makeSpraySheets(new T.Scene()),sparse=makeSpraySheets(new T.Scene());
 for(let i=0;i<=8;i++)dense.update(rider(i*.05),i*.05);
 for(const t of [0,.2,.4])sparse.update(rider(t),t);
 for(const side of [0,1]){
  const a=sample(dense,4,side),b=sample(sparse,1,side);
  assert.deepEqual(a,b);assert.ok(Math.abs(a.age-.2/.65)<1e-7);
  assert.ok(a.load>0);assert.ok(a.age>.25,'older spray must reach breakup even when only one row behind');
 }
 assert.equal(dense.mesh.geometry.attributes.position.count,264);
 assert.equal(sparse.mesh.geometry.index.count,dense.mesh.geometry.index.count);
 dense.dispose();sparse.dispose();
});

test('holding the render clock preserves spray age and positions; restarting clears the old trail',()=>{
 const sheet=makeSpraySheets(new T.Scene());
 for(const t of [0,.1,.2])sheet.update(rider(t),t);
 const attributes=()=>Object.fromEntries(['position','uv','load'].map(k=>[k,Array.from(sheet.mesh.geometry.attributes[k].array)]));
 const before=attributes();sheet.update(rider(.2),.2);assert.deepEqual(attributes(),before);
 sheet.update(rider(0),0);
 for(let side=0;side<2;side++)for(let row=0;row<22;row++)assert.equal(sample(sheet,row,side).age,0);
 sheet.dispose();
});

test('expired spray becomes transparent instead of retaining an intact old ribbon',()=>{
 const sheet=makeSpraySheets(new T.Scene());
 for(const t of [0,.2,.4])sheet.update(rider(t),t);
 const airborne=rider(1.2);airborne.hydro.airborne=true;sheet.update(airborne,1.2);
 assert.equal(sheet.mesh.visible,false);
 assert.ok([...sheet.mesh.geometry.attributes.load.array].every(v=>v===0));
 assert.equal(sample(sheet,1).age,1);sheet.dispose();
});
