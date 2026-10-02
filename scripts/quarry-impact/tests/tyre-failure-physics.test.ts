import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import R from '@dimforge/rapier3d-compat';
import * as current from '../src/vehicle-physics';
import {kinds,trajectory,wheelParameters,trial,motionProbe,type PhysicsAPI} from './tyre-failure-scenarios';
import {withHistoricalHandbrakePolicy} from './historical-handbrake-policy';

const manifest=JSON.parse(readFileSync(new URL('./fixtures/tyre-failure/previous-kernel.json',import.meta.url),'utf8'));
const bytes=gunzipSync(readFileSync(new URL('./fixtures/tyre-failure/previous-kernel.mjs.gz',import.meta.url)));
assert.equal(manifest.revision,'2e641fea22272631c1dad949f8a14f5814c95b20');
assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest.bundleSHA256,'The independent baseline bundles every local dependency from the preceding revision');
const previous=await import('data:text/javascript;base64,'+bytes.toString('base64'));
// Keep the frozen bundle/hash intact, applying only the reviewed current rear
// handbrake policy to its powered-handbrake trajectory phases.
const previousWithHandbrake:PhysicsAPI={...previous,stepVehiclePhysics(...args:Parameters<typeof current.stepVehiclePhysics>){
 return withHistoricalHandbrakePolicy(args[1],args[2],args[4].input.handbrake,()=>previous.stepVehiclePhysics(...args));
}};
await R.init();

test('all eleven cars preserve exact intact and subthreshold trajectories under current handbrake policy except the explicit modern rim correction',t=>{
 const exceptions=new Set<string>();
 for(const kind of kinds)for(const tuned of [false,true])for(const damaged of [false,true]){
  const before=trajectory(previousWithHandbrake,kind,tuned,damaged);
  assert.ok(before.finite);
  for(const tyreDamage of [[0,0,0,0],[.64,.64,.64,.64]]){
   const after=trajectory(current,kind,tuned,damaged,tyreDamage);
   assert.deepEqual(after.bodyProperties,before.bodyProperties,`${kind}: no extra bodies/colliders or mass change`);
   if(damaged&&(kind==='sedan'||kind==='hatch')){
    // Their measured rims exceed the old mechanically damaged radius at .64.
    // Identify this intentional change explicitly; do not blur exact equality
    // for the other vehicles or enlarge trajectory tolerances.
    exceptions.add(kind+'/'+tuned);assert.notEqual(after.sha256,before.sha256,kind+' new-model rim floor intentionally changes the damaged stance');
   }else{
    assert.equal(after.sha256,before.sha256,`${kind} tuned=${tuned} wheelDamage=${damaged} tyreDamage=${tyreDamage[0]}: every fixed-step pose, velocity, drive/brake force and wheel radius remains exact`);
    assert.deepEqual(after.final,before.final);
   }
   assert.ok(after.finite);
  }
 }
 assert.deepEqual([...exceptions].sort(),['hatch/false','hatch/true','sedan/false','sedan/true']);
 t.diagnostic('Frozen kernel with only the documented rear handbrake engine-command adapter;44 traces:40 scenarios remain exact with present zero/subthreshold tyre state;4 sedan/hatch damaged stock/tuned scenarios receive the explicit rim-clearance correction. Both tyreDamage0 and.64 were checked.');
});

test('missing tyre condition preserves severe legacy wheel trauma under current handbrake policy for every drivetrain and setup',()=>{
 for(const kind of kinds)for(const tuned of [false,true]){
  const oldDamage=[1,.92,.85,.7],before=trajectory(previousWithHandbrake,kind,tuned,true,undefined,oldDamage),after=trajectory(current,kind,tuned,true,undefined,oldDamage);
  assert.equal(after.sha256,before.sha256,`${kind} tuned=${tuned}: old severely damaged corners retain their previous response`);
  assert.deepEqual(after.bodyProperties,before.bodyProperties);assert.ok(after.finite);
 }
});

test('modern rim clearance changes only radius before tyre failure, while undefined retains the old unsafe value',()=>{
 // Independently measured prepared metal sphere plus5mm, radial envelope
 // plus15mm, or70% intact radius, whichever is larger. The sphere includes
 // every rim vertex, so wheel spin/camber cannot expose an unsafe shortcut.
 for(const [kind,floor,damages]of [['coupe',.348084,[.8,1]],['sedan',.371979,[.35,.64,1]],['hatch',.374064,[.2,.55,1]]]as const)for(const damage of damages)for(const speed of [-12,0,12]){
  const original=[damage,0,0,0],before=wheelParameters(previous,kind,original,undefined,speed),legacy=wheelParameters(current,kind,original,undefined,speed);
  assert.deepEqual(legacy,before,kind+' absent model remains exact');assert.ok(before[0].radius!<floor,kind+' independently measured rim proves the previous penetration');
  for(const tyreDamage of [[0,0,0,0],[.64,0,0,0]]){
   const actual=wheelParameters(current,kind,original,tyreDamage,speed);
   assert.ok(Math.abs(actual[0].radius!-floor)<1e-7,kind+' new radius clears the measured metal');
   actual[0].radius=before[0].radius;assert.deepEqual(actual,before,kind+' suspension, drive/brake forces, grip, toe and undamaged corners stay exact');
  }
 }
});

test('isolated front and rear tyre failures change actual FWD/RWD acceleration, coasting, braking and turn response',t=>{
 for(const kind of ['tern','marten','buggy']as const){
  const trials=Object.fromEntries((['acceleration','coast','brake','turn']as const).map(scenario=>[scenario,(['intact','front-left','rear-left']as const).map((corner,i)=>trial(current,kind,corner,scenario,i===0?[0,0,0,0]:i===1?[1,0,0,0]:[0,0,1,0],[0,0,0,0]))]));
  for(const rows of Object.values(trials))for(const r of rows){assert.ok(r.finite);if(r.corner!=='intact')assert.ok(r.minUp>.95,`${kind} ${r.corner} ${r.scenario} remains upright`);}
  const [healthy,front,rear]=trials.acceleration;
  assert.ok(front.finalSpeed<healthy.finalSpeed-.25,kind+' undriven or driven front flat must resist motion under throttle');
  assert.ok(rear.finalSpeed<healthy.finalSpeed-2,kind+' rear flat cannot bypass rolling resistance when the engine is driving');
  if(kind!=='tern')assert.ok(rear.finalSpeed<front.finalSpeed-3,kind+' rear drive loses more launch performance at its driven corner');
  for(const r of trials.coast.slice(1))assert.ok(r.finalSpeed<trials.coast[0].finalSpeed-1,kind+' failed tyre dissipates motion without throttle');
  for(const r of trials.brake.slice(1)){assert.ok(r.finalSpeed<.5);assert.ok(r.seconds<2);assert.ok(Math.abs(r.headingRadians)>.04,kind+' asymmetric flat creates a measured braking deviation');}
  assert.ok(trials.turn[1].headingRadians<trials.turn[0].headingRadians-.06,kind+' front failure reduces measured turn response');
  assert.ok(trials.turn[2].finalSpeed<trials.turn[0].finalSpeed-.8,kind+' rear failure changes the real turn trajectory too');
  // At the same prescribed velocity, tyre condition changes traction/contact,
  // never the engine torque itself. This prevents an artificial power penalty.
  const stock=wheelParameters(current,kind,[0,0,0,0],[0,0,0,0]),flat=wheelParameters(current,kind,[0,0,0,0],[1,0,1,0]);
  assert.deepEqual(flat.map(w=>w.engineForce),stock.map(w=>w.engineForce));
  t.diagnostic(`${kind} 6s speeds intact/front/rear: ${healthy.finalSpeed.toFixed(3)}/${front.finalSpeed.toFixed(3)}/${rear.finalSpeed.toFixed(3)} m/s`);
 }
});

test('rolling resistance opposes reverse motion, remains calm at rest and applies no airborne impulse',()=>{
 for(const kind of ['tern','marten','buggy']as const){
  for(const initialSpeed of [-15,15]){
   const intact=motionProbe(current,kind,[0,0,0,0],initialSpeed,false),flat=motionProbe(current,kind,[1,1,1,1],initialSpeed,false);
   assert.ok(Math.abs(flat.velocity.z)<Math.abs(intact.velocity.z)-1,kind+' rolling loss acts in both directions');
   assert.ok(flat.velocity.z*initialSpeed>=0,kind+' rolling loss cannot propel the car in the opposite direction');
  }
  const resting=motionProbe(current,kind,[1,1,1,1],0,false);
  assert.ok(Math.hypot(resting.velocity.x,resting.velocity.z)<.02,kind+' failed tyres do not launch a parked car');
  for(const initialSpeed of [-15,0,15]){
   const intact=motionProbe(current,kind,[0,0,0,0],initialSpeed,true),flat=motionProbe(current,kind,[1,1,1,1],initialSpeed,true);
   assert.equal(flat.contacts,0);assert.deepEqual(flat.velocity,intact.velocity,kind+' airborne tyres add no force');assert.deepEqual(flat.position,intact.position);assert.deepEqual(flat.rotation,intact.rotation);
  }
 }
});
