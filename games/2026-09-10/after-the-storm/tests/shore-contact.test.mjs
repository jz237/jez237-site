import test from 'node:test';
import assert from 'node:assert/strict';
import {shoreLines,shoreContact,constrainShoreLines} from '../shore-contact.js';
import {createHydro} from '../hydrodynamics.js';
const make=reverse=>shoreLines([{id:'raised',sourceClosed:true,outline:(reverse?[[0,-10],[0,10],[10,10],[10,-10]]:[[0,-10],[10,-10],[10,10],[0,10]])}]);
test('shore normals face outside for either outline winding and collision ignores height',()=>{
 for(const reverse of [false,true]){
  const shores=make(reverse),edge=shores.edges.find(e=>e.a[0]===0&&e.b[0]===0);
  assert.equal(edge.normal.x,-1);
  for(const y of [-20,0,20])assert.ok(shoreContact(edge,{x:-.1,y,z:0},{x:.1,y,z:0}));
 }
});
test('the native shallow penetration band and supplemental finite sweep do not snap deep stationary points',()=>{
 const e=make(false).edges.at(-1);
 assert.equal(shoreContact(e,{x:2,z:0},{x:2.1,z:0}),null);
 assert.equal(shoreContact(e,{x:-1,z:20},{x:2,z:20}),null);
 assert.ok(shoreContact(e,{x:-1,z:0},{x:2,z:0}));
 assert.equal(shoreContact(e,{x:-1,z:0},{x:-.2,z:0}),null);
});
test('source shore response catches airborne hulls, removes approach and preserves along-edge speed',()=>{
 const shores=make(false);
 for(const y of [0,12]){
  const r={x:-.2,z:0,heading:0,vx:3,vz:2,yawVelocity:0,hydro:{...createHydro(),y,vy:0}};
  const hit=constrainShoreLines(shores,r,-.5,0,{heading:0,pitch:0,roll:0});
  assert.ok(hit>0);assert.ok(r.x<-.2);assert.ok(r.vx<3);assert.equal(r.vz,2);
 }
});
test('an outgoing hull is not pulled back or given a new shore impulse',()=>{
 const r={x:-.2,z:0,heading:0,vx:-3,vz:0,yawVelocity:0,hydro:{...createHydro(),y:0,vy:0}};
 assert.equal(constrainShoreLines(make(false),r,-.5,0,{heading:0,pitch:0,roll:0}),0);assert.equal(r.x,-.2);assert.equal(r.vx,-3);
});
