import test from 'node:test';
import assert from 'node:assert/strict';
import {HULL_INERTIA,projectSolidContact} from '../solid-contact.js';
import {createHydro} from '../hydrodynamics.js';
import {HULL_PROBES,hullProbeOffset} from '../hull-probes.js';
import {facetedSurface} from '../faceted-surfaces.js';
import {constrainIceFloors} from '../ice-surfaces.js';

const close=(a,b,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
const rider=()=>({x:0,z:0,heading:0,vx:0,vz:20,yawVelocity:0,hydro:{...createHydro(),initialized:true,y:1,vy:-2}});
function energy(r){
 const h=r.hydro,pose={heading:r.heading,pitch:h.pitch,roll:h.roll},sh=Math.sin(r.heading),ch=Math.cos(r.heading),sp=Math.sin(h.pitch),cp=Math.cos(h.pitch);
 const omega={x:h.pitchVelocity*ch+h.rollVelocity*sh*cp,y:r.yawVelocity-h.rollVelocity*sp,z:-h.pitchVelocity*sh+h.rollVelocity*ch*cp};
 const component=axis=>{const p=hullProbeOffset(axis,pose);return omega.x*p.x+omega.y*p.y+omega.z*p.z;};
 return (r.vx*r.vx+r.vz*r.vz+h.vy*h.vy+HULL_INERTIA.pitch*component({x:1,y:0,z:0})**2+HULL_INERTIA.yaw*component({x:0,y:1,z:0})**2+HULL_INERTIA.roll*component({x:0,y:0,z:1})**2)/2;
}

test('interim inertia follows equally weighted source contact points',()=>{
 close(HULL_INERTIA.pitch,.51125);close(HULL_INERTIA.yaw,.51);close(HULL_INERTIA.roll,.12125);
});
test('an inelastic nose contact removes approach velocity without increasing kinetic energy',()=>{
 const r=rider(),before=energy(r),offset={x:0,y:-.175,z:.9};
 close(projectSolidContact(r,{x:0,y:1,z:0},offset,0),2);
 close(r.hydro.vy-r.hydro.pitchVelocity*.9,0);
 assert.ok(r.hydro.pitchVelocity<0,'nose contact raises the bow');
 assert.ok(r.hydro.vy<0,'one nose contact does not project the entire centre velocity');
 assert.ok(energy(r)<before);close(r.vz,20);
});
test('depenetration is position-only for an already separating contact',()=>{
 const r=rider();r.hydro.vy=2;const velocity=[r.vx,r.hydro.vy,r.vz],before=energy(r);
 assert.equal(projectSolidContact(r,{x:0,y:1,z:0},{x:0,y:-.175,z:.9},.1),0);
 assert.deepEqual([r.vx,r.hydro.vy,r.vz],velocity);close(energy(r),before);
 assert.ok(r.hydro.y>1);assert.ok(r.hydro.pitch<0);
});
test('oblique contact dissipates energy for rotated hulls and keeps finite angular rates',()=>{
 const r=rider();Object.assign(r,{heading:1.1,vx:8,vz:14,yawVelocity:.2});Object.assign(r.hydro,{pitch:.13,roll:-.2,pitchVelocity:.3,rollVelocity:-.1,vy:-5});
 const offset=hullProbeOffset(HULL_PROBES[3],{heading:r.heading,pitch:r.hydro.pitch,roll:r.hydro.roll});
 const length=Math.hypot(.2,1,-.3),normal={x:.2/length,y:1/length,z:-.3/length},before=energy(r);
 assert.ok(projectSolidContact(r,normal,offset,0)>0);assert.ok(energy(r)<=before+1e-9);
 assert.ok([r.vx,r.vz,r.hydro.vy,r.yawVelocity,r.hydro.pitchVelocity,r.hydro.rollVelocity].every(Number.isFinite));
});
test('inelastic contact stops the actual Euler-rotated probe, including pitched and banked poses',()=>{
 for(const angle of [.5,.8]){
  const r=rider();Object.assign(r,{heading:.5,vx:0,vz:0});Object.assign(r.hydro,{pitch:angle,roll:angle});
  const probe=HULL_PROBES[0],pose={heading:r.heading,pitch:r.hydro.pitch,roll:r.hydro.roll},offset=hullProbeOffset(probe,pose),before=energy(r);
  projectSolidContact(r,{x:0,y:1,z:0},offset,0);
  const dt=1e-6,after=hullProbeOffset(probe,{heading:r.heading+r.yawVelocity*dt,pitch:r.hydro.pitch+r.hydro.pitchVelocity*dt,roll:r.hydro.roll+r.hydro.rollVelocity*dt});
  close(r.hydro.vy+(after.y-offset.y)/dt,0,2e-5);assert.ok(energy(r)<before);
 }
});
test('a submerged facet preserves wet hull samples rather than disabling all water contact',()=>{
 const floor=facetedSurface('mixed',[[[-10,-.2,-10],[10,-.2,-10],[-10,-.2,10]],[[10,-.2,-10],[10,-.2,10],[-10,-.2,10]]]);
 const r=rider();r.hydro.y=-.05;r.hydro.vy=-1;r.hydro.wet=.7;r.hydro.intake=.6;
 const contact=constrainIceFloors({iceSheets:[floor]},r,0,0,0,null,()=>0);
 assert.ok(contact);assert.ok(r.sourceWetCount>0);assert.equal(r.staticFloorExposed,false);assert.equal(r.onIce,'');
 assert.equal(r.hydro.wet,.7);assert.equal(r.hydro.intake,.6);
});
test('floor contact never snaps a deeply submerged hull upward or catches one outside its footprint',()=>{
 const floor=facetedSurface('finite',[[[-1,.75,-1],[1,.75,-1],[-1,.75,1]],[[1,.75,-1],[1,.75,1],[-1,.75,1]]]);
 const r=rider();r.hydro.y=-2;const before=r.hydro.y;
 assert.equal(constrainIceFloors({iceSheets:[floor]},r,0,0,-2,null,()=>0),null);assert.equal(r.hydro.y,before);
 r.x=5;r.hydro.y=.7;assert.equal(constrainIceFloors({iceSheets:[floor]},r,5,0,.7,null,()=>0),null);
});
