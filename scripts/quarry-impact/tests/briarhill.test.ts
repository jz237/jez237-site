import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {BRIARHILL_ARENA,BRIARHILL_BARRIERS,buildBriarhillPhysics,briarhillGround,briarhillHeight,briarhillPatch} from '../src/briarhill-arena';
import {createBriarhillWorld} from '../src/briarhill-world';
import {ARENA_NAMES,arenaRecordKey,resolveArenaId} from '../src/arena-id';
import {CAR_KINDS} from '../src/rules';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,rotateVehicleVector,type PhysicsState} from '../src/vehicle-physics';
import {readEventOptions,derbyGridSlot,clearRespawnSlot} from '../src/event-rules';
import {readDemoOptions} from '../src/demo-session';
import {replayCourseId,encodeReplay,decodeReplay,type ReplayDocument,REPLAY_STRIDE} from '../src/replay-data';
import {stockSetup} from '../src/garage';
import {defaultReplayName} from '../src/replay-library';
import {exportSave,readSave,SAVE_KEYS} from '../src/save-backup';
await R.init();
test('Briarhill supports stable full fields and a continuous collision wall matching the visible arena',()=>{
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
 try{
  buildBriarhillPhysics(R,world);world.step();
  for(let i=0;i<192;i++){const a=i/192*Math.PI*2,hit=world.castRay(new R.Ray({x:0,y:5.5,z:0},{x:Math.sin(a),y:0,z:Math.cos(a)}),65,true);assert.ok(hit&&hit.timeOfImpact>57&&hit.timeOfImpact<59);}
  const cars=Array.from({length:24},(_,i)=>{const kind=CAR_KINDS[i%CAR_KINDS.length],spec=vehicleSpecification(kind),rig=createVehiclePhysics(R,world,kind,spec.mass),grid=derbyGridSlot(i,24,BRIARHILL_ARENA);rig.body.setTranslation({x:grid.x,y:.89,z:grid.z},true);rig.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'gravel',gear:1,rpm:850,input:{throttle:0,brake:1,steer:0,handbrake:false}};return{kind,spec,rig,grid,state};});
  for(let i=0;i<180;i++){for(const c of cars)stepVehiclePhysics(c.rig.body,c.rig.controller,c.kind,c.spec,c.state,1/60);world.step();}
  for(const c of cars){const p=c.rig.body.translation();assert.ok(Math.hypot(p.x-c.grid.x,p.z-c.grid.z)<.15);assert.ok(p.y>.5&&p.y<1.1);assert.equal(briarhillGround.surface(p.x,p.z),'gravel');}
  const field=cars.map((c,id)=>({id,current:c.rig.body.translation()}));const spawn=clearRespawnSlot(field,0,BRIARHILL_ARENA);assert.ok(spawn);assert.ok(Math.hypot(spawn.x,spawn.z)<BRIARHILL_ARENA.radius-8);
 }finally{world.free();}
 const art=createBriarhillWorld(),matrices:T.Matrix4[]=[];art.root.traverse(o=>{if(o instanceof T.InstancedMesh)for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);matrices.push(m);}});
 for(const s of BRIARHILL_BARRIERS){const expected=new T.Matrix4().compose(new T.Vector3(s.x,s.y,s.z),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),s.yaw),new T.Vector3(...s.half).multiplyScalar(2));assert.ok(matrices.some(m=>m.elements.every((v,i)=>Math.abs(v-expected.elements[i])<1e-5)));}
 art.dispose();art.dispose();assert.equal(art.root.children.length,0);
});
test('arena settings remain separate from circuits and old settings and record keys are unchanged',async()=>{
 assert.equal(resolveArenaId('missing'),'quarry-arena-v1');
 for(const arena of Object.keys(ARENA_NAMES)){
  const e=readEventOptions(JSON.stringify({version:1,course:'ashford-autodrome-v1',arena})),d=readDemoOptions(JSON.stringify({version:1,course:'redbank-jump-v1',arena}));assert.equal(e.arena,arena);assert.equal(d.arena,arena);assert.equal(e.course,'ashford-autodrome-v1');assert.equal(d.course,'redbank-jump-v1');
  const data=new Map(SAVE_KEYS.map(k=>[k,null]as const))as Map<string,string|null>;data.set('quarry-impact-events-v1',JSON.stringify(e));data.set('quarry-impact-demo-v1',JSON.stringify(d));const text=await exportSave({getItem:k=>data.get(k)??null});assert.equal(JSON.parse((await readSave(text)).entries['quarry-impact-events-v1']!).arena,arena);
 }
 assert.ok(!Object.hasOwn(readEventOptions(), 'arena'));assert.ok(!Object.hasOwn(readDemoOptions(), 'arena'));assert.ok(!Object.hasOwn(readDemoOptions(),'derby'));for(const derby of ['score','survival'])assert.equal(readDemoOptions(JSON.stringify({version:1,derby})).derby,derby);
 assert.equal(arenaRecordKey('derby',undefined),'derby');assert.notEqual(arenaRecordKey('derby','briarhill-bowl-v1'),'derby');
});
test('replays round-trip arena identity and reject unsupported or cross-mode arena claims',()=>{
 const values=new Float32Array(REPLAY_STRIDE);values[6]=1;values[14]=100;for(let i=0;i<4;i++)values[21+i*8]=1;
 const doc:ReplayDocument={meta:{version:1,mode:'derby',arenaId:'briarhill-bowl-v1',reverse:false,cars:[{id:0,kind:'coupe',setup:stockSetup('coupe')}],props:0,created:'2026-10-08T00:00:00Z'},frames:[{time:0,values},{time:1,values:values.slice()}],events:[],limited:false};
 const decoded=decodeReplay(encodeReplay(doc));assert.equal(decoded.meta.arenaId,'briarhill-bowl-v1');assert.match(defaultReplayName(decoded),/^Briarhill Dirt Bowl/);
 for(const meta of [{mode:'race',arenaId:'briarhill-bowl-v1'},{mode:'derby',arenaId:'unknown'},{mode:'derby',arenaId:'briarhill-bowl-v1',courseId:'redbank-jump-v1'}])assert.throws(()=>replayCourseId(meta as any));
 const old={...doc.meta};delete old.arenaId;assert.equal(replayCourseId(old),'quarry-v1');assert.ok(!Object.hasOwn(decodeReplay(encodeReplay({...doc,meta:old})).meta,'arenaId'));
});

test('the dirt crest and bank share exact rendered/contact heights and do not obstruct AI sensors',()=>{
 const world=new R.World({x:0,y:0,z:0}),owned=buildBriarhillPhysics(R,world);world.step();
 try{
  for(let x=-57;x<=57;x+=3.7)for(let z=-57;z<=57;z+=4.3){
   const hit=world.castRay(new R.Ray({x,y:20,z},{x:0,y:-1,z:0}),30,true,undefined,undefined,undefined,undefined,c=>c.parent()?.handle===owned[0]);
   assert.ok(hit);assert.ok(Math.abs(20-hit.timeOfImpact-briarhillHeight(x,z))<1e-5);assert.equal(briarhillGround.isDrivingObstacle(hit.collider),false);
  }
  const p=briarhillPatch();for(let i=0;i<p.positions.length;i+=3)assert.ok(Math.abs(p.positions[i+1]-briarhillHeight(p.positions[i],p.positions[i+2]))<1e-5);
  assert.equal(briarhillHeight(0,0),Math.fround(2.2));assert.equal(briarhillHeight(34,0),0);assert.equal(briarhillHeight(56,0),4.5);
  const wall=world.getRigidBody(owned[1]);assert.equal(briarhillGround.isDrivingObstacle(wall.collider(0)),true);
 }finally{world.free();}
 const failed=new R.World({x:0,y:0,z:0}),sentinel=failed.createRigidBody(R.RigidBodyDesc.fixed()),create=failed.createCollider.bind(failed);let count=0;
 failed.createCollider=((...args:Parameters<typeof create>)=>{if(++count===30)throw Error('allocation failed');return create(...args);})as typeof failed.createCollider;
 try{assert.throws(()=>buildBriarhillPhysics(R,failed),/allocation failed/);assert.equal(failed.bodies.len(),1);assert.equal(failed.colliders.len(),0);assert.ok(failed.getRigidBody(sentinel.handle));}finally{failed.free();}
});
test('all thirteen cars drive over the central dirt crest and onto the bank without recovery',t=>{
 const results=[];
 for(const kind of CAR_KINDS){
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;buildBriarhillPhysics(R,world);
  const spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass),s:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'gravel',gear:1,rpm:850,input:{throttle:0,brake:1,steer:0,handbrake:false}};
  car.body.setTranslation({x:0,y:.89,z:-34},true);let crest=0,minUp=1,ticks=0;
  try{
   for(let i=0;i<90;i++){stepVehiclePhysics(car.body,car.controller,kind,spec,s,1/60);world.step();}
   s.input={throttle:1,brake:0,steer:0,handbrake:false};
   for(;ticks<900&&car.body.translation().z<47;ticks++){
    const pos=car.body.translation(),f=rotateVehicleVector({x:0,y:0,z:1},car.body.rotation()),r=rotateVehicleVector({x:1,y:0,z:0},car.body.rotation());s.input.steer=Math.max(-1,Math.min(1,Math.atan2(-pos.x*r.x+(60-pos.z)*r.z,-pos.x*f.x+(60-pos.z)*f.z)*1.7));
    stepVehiclePhysics(car.body,car.controller,kind,spec,s,1/60);world.step();const p=car.body.translation(),q=car.body.rotation();
    assert.ok(p.y>briarhillHeight(p.x,p.z)-.1,'no terrain penetration');assert.ok(Math.abs(p.x)<6,kind+' crosses central driving area');minUp=Math.min(minUp,1-2*(q.x*q.x+q.z*q.z));if(Math.abs(p.z)<3)crest=Math.max(crest,p.y);
   }
   assert.ok(car.body.translation().z>=47,kind+' crosses crest and reaches bank');assert.ok(crest>2.4,kind+' actually climbs crest');assert.ok(minUp>.7,kind+' stays upright');results.push({kind,seconds:ticks/60,crest,minUp});
  }finally{world.removeVehicleController(car.controller);world.free();}
 }
 t.diagnostic(JSON.stringify(results));
});
