import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readHandbrakePrevious,restoreHandbrakePlayabilityBytes,verifyHandbrakePlayabilityRevision} from './handbrake-playability-invariants';
import {readChallengePlayabilityPrevious,restoreChallengePlayabilityBytes} from './challenge-playability-invariants';
const hash=(bytes:Uint8Array|string)=>createHash('sha256').update(bytes).digest('hex');
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
const revision=()=>JSON.parse(readFileSync(new URL('./fixtures/handbrake-playability/revision.json',import.meta.url)).toString());

test('handbrake correction adds one immutable leaf preserving all 755 previous fixtures and protected source/assets',()=>{
 verifyHandbrakePlayabilityRevision();
 assert.deepEqual(Object.keys(revision().files).sort(),[
  'src/vehicle-physics.ts','src/event-ui.ts','tests/handbrake-physics.test.ts',
  'tests/tyre-failure-physics.test.ts',
  'tests/buggy-physics.test.ts', 'tests/physics-sync.test.ts', 'tests/historical-handbrake-policy.ts',
  'tests/handbrake-playability-invariants.ts','tests/handbrake-playability-history.test.ts',
  'tests/challenge-playability-invariants.ts','tools/record-handbrake-playability-revision.py',
 ].sort());
});

test('actual shared physics changes only rear engine force while handbrake is engaged',()=>{
 const before="  controller.setWheelEngineForce(i,force*corner.power*(kind==='tern'?(i<2?front[i%2]:0):(kind==='coupe'||isClassicKind(kind))?(i>1?rear[i%2]:0):.5*(i<2?front:rear)[i%2]));";
 const after="  // Rapier ignores wheelBrake when engine force is nonzero. Disengage only\n  // the handbraked rear wheels so the brake works while front drive is retained.\n  controller.setWheelEngineForce(i,state.input.handbrake&&i>1&&kind!=='tern'?0:force*corner.power*(kind==='tern'?(i<2?front[i%2]:0):(kind==='coupe'||isClassicKind(kind))?(i>1?rear[i%2]:0):.5*(i<2?front:rear)[i%2]));";
 const current=source('src/vehicle-physics.ts').toString();assert.equal(current.split(after).length-1,1);
 const normalized=current.replace(after,before);
 assert.equal(normalized,readHandbrakePrevious('src/vehicle-physics.ts').toString(),'Every other kernel, collider, specification and helper byte remains published');
 assert.equal(hash(normalized),'f4ff63df9c4aafc755b4e71809637c0efccca9e0185bf56ef894b970b67713a4');
 assert.equal(hash(normalized),revision().normalizedSourceSha256['src/vehicle-physics.ts']);
});

test('event setup changes only the stale challenge venue explanation',()=>{
 const before='Course choice applies to solo circuit races. Derby, playground, challenges and online events use Blackridge Quarry.';
 const after='Course choice applies to solo circuit races. Challenges use their listed venue. Derby, playground and online events use Blackridge Quarry.';
 const current=source('src/event-ui.ts').toString();assert.equal(current.split(after).length-1,1);
 const normalized=current.replace(after,before);
 assert.equal(normalized,readHandbrakePrevious('src/event-ui.ts').toString(),'Event options, persistence, controls and callbacks remain published');
 assert.equal(hash(normalized),'18509d4cbea23a6410f23592141d25fe248ff7f5f1f3f2aa02c7d38f92953a4a');
 assert.equal(hash(normalized),revision().normalizedSourceSha256['src/event-ui.ts']);
});

test('the additive bridge restores whole predecessor bytes and passes unrecognized or corrupted bytes through',()=>{
 for(const file of Object.keys(revision().files))assert.deepEqual(restoreHandbrakePlayabilityBytes(file,source(file)),readHandbrakePrevious(file),file);
 for(const file of ['src/vehicle-physics.ts','src/event-ui.ts'])
  assert.deepEqual(restoreChallengePlayabilityBytes(file,source(file)),readHandbrakePrevious(file),'Predecessor protection sees published '+file);
 const bridge='tests/challenge-playability-invariants.ts';
 assert.deepEqual(restoreHandbrakePlayabilityBytes(bridge,source(bridge)),readHandbrakePrevious(bridge));
 assert.deepEqual(restoreChallengePlayabilityBytes(bridge,source(bridge)),readChallengePlayabilityPrevious(bridge),'Both release layers restore in order');
 for(const file of ['src/vehicle-physics.ts',bridge]){
  const damaged=Buffer.from(source(file));damaged[0]^=1;
  for(const bytes of [damaged,Buffer.from('unrecorded revision')]){
   assert.deepEqual(restoreHandbrakePlayabilityBytes(file,bytes),bytes);
   assert.deepEqual(restoreChallengePlayabilityBytes(file,bytes),bytes);
  }
 }
 const unknown=Buffer.from('unrecorded revision');assert.deepEqual(restoreHandbrakePlayabilityBytes('src/not-in-this-leaf.ts',unknown),unknown);
});

test('actual main retains the complete published camera, AI, timing, replay, input and event orchestration',()=>{
 const main=source('src/main.ts');
 assert.equal(hash(main),'b66c9e7153ab451feafb2aa1a17cf0b4b7c3e9f89fe8233f702699b2f58be81e');
 assert.equal(hash(main),revision().protected['src/main.ts']);
 assert.equal(main.toString().replaceAll('\r\n','').includes('\n'),false,'Main retains CRLF');
});


test('historical trajectory adapters leave every original scenario, assertion, tolerance and frozen bundle guard exact',()=>{
 const changes:Record<string,readonly (readonly [string,string])[]>={
  "tests/tyre-failure-physics.test.ts": [
    [
      "import {kinds,trajectory,wheelParameters,trial,motionProbe} from './tyre-failure-scenarios';\n",
      "import {kinds,trajectory,wheelParameters,trial,motionProbe,type PhysicsAPI} from './tyre-failure-scenarios';\nimport {withHistoricalHandbrakePolicy} from './historical-handbrake-policy';\n"
    ],
    [
      "",
      "// Keep the frozen bundle/hash intact, applying only the reviewed current rear\n// handbrake policy to its powered-handbrake trajectory phases.\nconst previousWithHandbrake:PhysicsAPI={...previous,stepVehiclePhysics(...args:Parameters<typeof current.stepVehiclePhysics>){\n return withHistoricalHandbrakePolicy(args[1],args[2],args[4].input.handbrake,()=>previous.stepVehiclePhysics(...args));\n}};\n"
    ],
    [
      "test('all eleven cars preserve exact intact and subthreshold trajectories except the explicit modern rim correction',t=>{\n",
      "test('all eleven cars preserve exact intact and subthreshold trajectories under current handbrake policy except the explicit modern rim correction',t=>{\n"
    ],
    [
      "  const before=trajectory(previous,kind,tuned,damaged);\n",
      "  const before=trajectory(previousWithHandbrake,kind,tuned,damaged);\n"
    ],
    [
      " t.diagnostic('44 frozen traces:40 scenarios remain exact with present zero/subthreshold tyre state;4 sedan/hatch damaged stock/tuned scenarios receive the explicit rim-clearance correction. Both tyreDamage0 and.64 were checked.');\n",
      " t.diagnostic('Frozen kernel with only the documented rear handbrake engine-command adapter;44 traces:40 scenarios remain exact with present zero/subthreshold tyre state;4 sedan/hatch damaged stock/tuned scenarios receive the explicit rim-clearance correction. Both tyreDamage0 and.64 were checked.');\n"
    ],
    [
      "test('missing tyre condition preserves severe legacy wheel trauma for every drivetrain and setup',()=>{\n",
      "test('missing tyre condition preserves severe legacy wheel trauma under current handbrake policy for every drivetrain and setup',()=>{\n"
    ],
    [
      "  const oldDamage=[1,.92,.85,.7],before=trajectory(previous,kind,tuned,true,undefined,oldDamage),after=trajectory(current,kind,tuned,true,undefined,oldDamage);\n",
      "  const oldDamage=[1,.92,.85,.7],before=trajectory(previousWithHandbrake,kind,tuned,true,undefined,oldDamage),after=trajectory(current,kind,tuned,true,undefined,oldDamage);\n"
    ]
  ],
  "tests/buggy-physics.test.ts": [
    [
      "",
      "import {withHistoricalHandbrakePolicy} from './historical-handbrake-policy';\n"
    ],
    [
      "test('all ten preceding vehicles keep exact physics trajectories with tuned, damaged and legacy engine states',()=>{\n",
      "// Apply only the later reviewed rear handbrake policy to the frozen reference;\n// all original trajectory inputs and exact state comparisons remain intact.\nconst previousStep=(...args:Parameters<typeof stepVehiclePhysics>)=>withHistoricalHandbrakePolicy(args[1],args[2],args[4].input.handbrake,()=>previous.stepVehiclePhysics(...args));\ntest('all ten preceding vehicles keep exact physics trajectories under current handbrake policy with tuned, damaged and legacy engine states',()=>{\n"
    ],
    [
      "  const runs=[{create:createVehiclePhysics,step:stepVehiclePhysics,spec:vehicleSpecification},{create:previous.createVehiclePhysics,step:previous.stepVehiclePhysics,spec:previous.vehicleSpecification}].map(api=>{const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));const spec=api.spec(kind,setup),car=api.create(R,world,kind,spec.mass);car.body.setTranslation({x:0,y:.89,z:0},true);return{api,world,spec,...car,s:state()};});\n",
      "  const runs=[{create:createVehiclePhysics,step:stepVehiclePhysics,spec:vehicleSpecification},{create:previous.createVehiclePhysics,step:previousStep,spec:previous.vehicleSpecification}].map(api=>{const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));const spec=api.spec(kind,setup),car=api.create(R,world,kind,spec.mass);car.body.setTranslation({x:0,y:.89,z:0},true);return{api,world,spec,...car,s:state()};});\n"
    ]
  ],
  "tests/physics-sync.test.ts": [
    [
      "",
      "import {withHistoricalHandbrakePolicy} from './historical-handbrake-policy';\n"
    ],
    [
      "test('shared physics preserves legacy health-based solo behavior for all cars, tunes, damaged wheels and variable steps',()=>{\n",
      "test('shared physics preserves legacy health-based solo behavior under current handbrake policy for all cars, tunes, damaged wheels and variable steps',()=>{\n"
    ],
    [
      "",
      "  // Only the frozen caller receives the later rear handbrake policy; its\n  // legacy component semantics and all motion assertions stay unchanged.\n"
    ],
    [
      "   for(const r of [old,fresh]){if(i===600){r.car.health=72;r.car.damageLeft=12;r.car.wreckParts.wheelDamage[0]=.65;r.car.wreckParts.wheelShift[0].set(.07,0,-.1);}r.world.timestep=dt;r.car.input=input;r.car.preStep(dt);r.world.step();r.car.postStep(dt,i/60);}\n",
      "   for(const r of [old,fresh]){if(i===600){r.car.health=72;r.car.damageLeft=12;r.car.wreckParts.wheelDamage[0]=.65;r.car.wreckParts.wheelShift[0].set(.07,0,-.1);}r.world.timestep=dt;r.car.input=input;if(r===old)withHistoricalHandbrakePolicy(r.car.controller,kind,input.handbrake,()=>r.car.preStep(dt));else r.car.preStep(dt);r.world.step();r.car.postStep(dt,i/60);}\n"
    ]
  ]
};
 const expectedHashes:Record<string,string>={
  "tests/tyre-failure-physics.test.ts": "ea98b6da1870a661435a653ccdd3442a46ae20434c0a13c1e4983e7d47d7d4b3",
  "tests/buggy-physics.test.ts": "60a3f0f7a24ff58f6f383da80a4f1a1859fc942a3033292e0cd286aaced3d021",
  "tests/physics-sync.test.ts": "c016702b9848a81eb56720b26162a5e9820fc65d395eca46a9f49098653d77ae"
};
 for(const [file,replacements]of Object.entries(changes)){
  let normalized=source(file).toString();
  for(const [before,after]of replacements){assert.equal(normalized.split(after).length-1,1,file+': reviewed adapter occurrence');normalized=normalized.replace(after,before);}
  assert.equal(normalized,readHandbrakePrevious(file).toString(),file+': unchanged scenarios/assertions/baseline bundle');
  assert.equal(hash(normalized),expectedHashes[file],file);
  assert.equal(hash(normalized),revision().normalizedHistoricalTestsSha256[file],file);
 }
});
