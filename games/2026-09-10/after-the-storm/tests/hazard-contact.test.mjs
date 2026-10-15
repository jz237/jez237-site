import test from 'node:test';import assert from 'node:assert/strict';
import {hullHazardContact,resolveHazardContact} from '../hazard-contact.js';
import {createHydro} from '../hydrodynamics.js';
const block={x:0,y:0,z:0,r:1.25,probeRadius:.3};
const rider=()=>({x:0,z:4,heading:0,vx:0,vz:80,speed:80,hydro:{...createHydro(),y:0}});

test('swept hull probes stop a fast craft that would cross the entire ice block in one tick',()=>{
 const r=rider(),hit=hullHazardContact(block,r,0,-4,0);
 assert.ok(hit&&hit.t>0&&hit.t<1);assert.ok(hit.normal.z<-.9);
 resolveHazardContact(r,hit,0,-4,0);assert.ok(r.z< -2);assert.ok(r.vz<0);
});
test('a hull passing beside or above a fixed block has no contact',()=>{
 const r=rider();r.x=2.5;assert.equal(hullHazardContact(block,r,2.5,-4,0),null);
 r.x=0;r.hydro.y=4;assert.equal(hullHazardContact(block,r,0,-4,4),null);
});
test('overlapping hull probes separate without adding energy to a departing craft',()=>{
 const r=rider();r.z=-2;r.vz=-3;const hit=hullHazardContact(block,r,0,-2,0);
 assert.ok(hit&&hit.depth>0);resolveHazardContact(r,hit,0,-2,0);
 assert.ok(r.z< -2);assert.equal(r.vz,-3);
});
