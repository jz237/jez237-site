import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';

await R.init();
const dt=1/60;

/** A tube on a rotating chassis can cross another body entirely between ticks.
 * Put the target on the exact circular path between discrete orientations;
 * neither translation nor initial penetration can hide missing angular CCD. */
function rotatingTube(spin:number,phase:number,clearance:number,fixed:boolean){
 const world=new R.World({x:0,y:0,z:0}),queue=new R.EventQueue(true);world.timestep=dt;
 const rotor=world.createRigidBody(R.RigidBodyDesc.dynamic().setCcdEnabled(true)
  .setAdditionalMassProperties(760,{x:0,y:0,z:0},{x:760,y:760,z:760},{x:0,y:0,z:0,w:1}));
 world.createCollider(R.ColliderDesc.capsule(.20,.026).setTranslation(2,0,0).setMass(0).setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS),rotor);
 rotor.setAngvel({x:0,y:spin,z:0},true);
 const angle=spin*(1.5+phase)*dt,radius=2+clearance;
 const target=world.createRigidBody((fixed?R.RigidBodyDesc.fixed():R.RigidBodyDesc.dynamic())
  .setTranslation(radius*Math.cos(angle),0,-radius*Math.sin(angle)).setCcdEnabled(true));
 world.createCollider(R.ColliderDesc.ball(.02).setMass(8).setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS),target);
 let contacts=0,impulse=0;
 try{
  for(let tick=0;tick<4;tick++){world.step(queue);queue.drainContactForceEvents(e=>{contacts++;impulse+=e.totalForceMagnitude()*dt;});}
  return{spin,phase,clearance,fixed,contacts,impulse,velocity:{...target.linvel()},position:{...target.translation()}};
 }finally{queue.free();world.free();}
}

for(const fixed of [false,true]){
 test(`angular CCD catches thin tube sweeps against ${fixed?'fixed':'dynamic CCD'} targets at every frame phase`,()=>{
  for(const spin of [8,20,40])for(const phase of [0,.17,.43]){
   const result=rotatingTube(spin,phase,0,fixed);
   assert.ok(result.contacts>0,JSON.stringify(result));
   assert.ok(result.impulse>100,JSON.stringify(result));
   assert.ok(Object.values(result.velocity).every(Number.isFinite));
   if(!fixed)assert.ok(Math.hypot(result.velocity.x,result.velocity.y,result.velocity.z)>1,'dynamic target must receive the impact');
  }
 });
 test(`angular CCD leaves a real 6 mm clear pass untouched for ${fixed?'fixed':'dynamic CCD'} targets`,()=>{
  // .026 m tube radius + .020 m target radius + .006 m empty space.
  for(const spin of [8,20,40])for(const phase of [0,.17,.43]){
   const result=rotatingTube(spin,phase,.052,fixed);
   assert.equal(result.contacts,0,JSON.stringify(result));assert.equal(result.impulse,0);
   assert.deepEqual(result.velocity,{x:0,y:0,z:0});
  }
 });
}
