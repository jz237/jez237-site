import test from 'node:test';
import assert from 'node:assert/strict';
import {triangleWalls,wallContact,constrainTriangleWalls} from '../triangle-walls.js';
import {createHydro} from '../hydrodynamics.js';

const rows=[{vertices:[[-2,-1,0],[2,-1,0],[-2,2,0]],normal:[0,0,-1]},{vertices:[[2,-1,0],[2,2,0],[-2,2,0]],normal:[0,0,-1]}];
const walls=triangleWalls(rows),a={x:0,y:0,z:-1};
const contact=(b,start=a)=>[...walls.query(start,b)].map(face=>wallContact(face,start,b)).find(Boolean);

test('a finite vertical face catches incoming hull points even across its whole contact band',()=>{
 assert.equal(contact({x:0,y:0,z:.2}).penetration,.2);
 assert.equal(contact({x:0,y:0,z:3}).penetration,3);
 assert.equal(contact({x:3,y:0,z:3},{x:3,y:0,z:-1}),undefined,'crossing outside the finite triangle stays clear');
 assert.equal(contact({x:0,y:3,z:3},{x:0,y:3,z:-1}),undefined,'craft above the side face stays clear');
 assert.ok(contact({x:3,y:0,z:3}),'a diagonal that crosses inside the face still collides');
 assert.equal(contact({x:0,y:1.8,z:.6},{x:0,y:2.2,z:-.2}),undefined,'a deep endpoint below the top does not collide when the sweep crossed above it');
});
test('side walls do not snap points already deep behind a face or on its open side',()=>{
 const b={x:0,y:0,z:3},faces=[...walls.query(a,b)];
 for(const face of faces)assert.equal(wallContact(face,{x:0,y:0,z:2},b),null);
 assert.equal(contact({x:0,y:0,z:-.2}),undefined);
});
test('hull wall contact removes approach speed while retaining tangential momentum',()=>{
 const r={x:0,z:-.7,heading:0,vx:2,vz:12,yawVelocity:0,hydro:{...createHydro(),y:.3,vy:0}};
 const impact=constrainTriangleWalls(walls,r,0,-1.2,.3,{heading:0,pitch:0,roll:0});
 assert.ok(impact>0);assert.ok(r.z<-.7);assert.ok(r.vz<12);assert.equal(r.vx,2);
 assert.ok([r.z,r.vz,r.hydro.pitch,r.hydro.pitchVelocity].every(Number.isFinite));
});
