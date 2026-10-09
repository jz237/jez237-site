import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {FOUNDRY_OUTLINE,FOUNDRY_ARENA,FOUNDRY_BARRIERS,buildFoundryPhysics,foundryGround,foundryHeight,foundryPatch} from '../src/foundry-arena';
import {createFoundryWorld} from '../src/foundry-world';
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
test('Foundry supports stable full fields and a continuous collision wall matching the visible arena',()=>{
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
 try{
  buildFoundryPhysics(R,world);world.step();
  for(let i=0;i<360;i++){
   const angle=i/360*Math.PI*2,dx=Math.sin(angle),dz=Math.cos(angle);let distance=Infinity;
   for(let edge=0;edge<8;edge++){const a=FOUNDRY_OUTLINE[edge],b=FOUNDRY_OUTLINE[(edge+1)%8],ex=b.x-a.x,ez=b.z-a.z,den=dx*ez-dz*ex;if(Math.abs(den)<1e-9)continue;const t=(a.x*ez-a.z*ex)/den,u=(a.x*dz-a.z*dx)/den;if(t>0&&u>=0&&u<=1)distance=Math.min(distance,t);}
   assert.ok(Number.isFinite(distance));const hit=world.castRay(new R.Ray({x:0,y:foundryHeight(dx*distance,dz*distance)+1.2,z:0},{x:dx,y:0,z:dz}),70,true,undefined,undefined,undefined,undefined,c=>foundryGround.isDrivingObstacle(c));assert.ok(hit&&Math.abs(hit.timeOfImpact-distance)<1.5,'continuous wall '+i);
  }
  const cars=Array.from({length:24},(_,i)=>{const kind=CAR_KINDS[i%CAR_KINDS.length],spec=vehicleSpecification(kind),rig=createVehiclePhysics(R,world,kind,spec.mass),grid=derbyGridSlot(i,24,FOUNDRY_ARENA);rig.body.setTranslation({x:grid.x,y:.89,z:grid.z},true);rig.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'gravel',gear:1,rpm:850,input:{throttle:0,brake:1,steer:0,handbrake:false}};return{kind,spec,rig,grid,state};});
  for(let i=0;i<180;i++){for(const c of cars)stepVehiclePhysics(c.rig.body,c.rig.controller,c.kind,c.spec,c.state,1/60);world.step();}
  for(const c of cars){const p=c.rig.body.translation();assert.ok(Math.hypot(p.x-c.grid.x,p.z-c.grid.z)<.15);assert.ok(p.y>.5&&p.y<1.1);assert.equal(foundryGround.surface(p.x,p.z),Math.abs(p.z+.3*p.x)<12?'gravel':'asphalt');}
  const field=cars.map((c,id)=>({id,current:c.rig.body.translation()}));const spawn=clearRespawnSlot(field,0,FOUNDRY_ARENA);assert.ok(spawn);assert.ok(Math.hypot(spawn.x,spawn.z)<FOUNDRY_ARENA.radius-8);
 }finally{world.free();}
 const art=createFoundryWorld(),matrices:T.Matrix4[]=[];art.root.traverse(o=>{if(o instanceof T.InstancedMesh)for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);matrices.push(m);}});
 for(const s of FOUNDRY_BARRIERS){const expected=new T.Matrix4().compose(new T.Vector3(s.x,s.y,s.z),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),s.yaw),new T.Vector3(...s.half).multiplyScalar(2));assert.ok(matrices.some(m=>m.elements.every((v,i)=>Math.abs(v-expected.elements[i])<1e-5)));}
 art.dispose();art.dispose();assert.equal(art.root.children.length,0);
});
test('arena settings remain separate from circuits and old settings and record keys are unchanged',async()=>{
 assert.equal(resolveArenaId('missing'),'quarry-arena-v1');
 for(const arena of Object.keys(ARENA_NAMES)){
  const e=readEventOptions(JSON.stringify({version:1,course:'ashford-autodrome-v1',arena})),d=readDemoOptions(JSON.stringify({version:1,course:'redbank-jump-v1',arena}));assert.equal(e.arena,arena);assert.equal(d.arena,arena);assert.equal(e.course,'ashford-autodrome-v1');assert.equal(d.course,'redbank-jump-v1');
  const data=new Map(SAVE_KEYS.map(k=>[k,null]as const))as Map<string,string|null>;data.set('quarry-impact-events-v1',JSON.stringify(e));data.set('quarry-impact-demo-v1',JSON.stringify(d));const text=await exportSave({getItem:k=>data.get(k)??null});assert.equal(JSON.parse((await readSave(text)).entries['quarry-impact-events-v1']!).arena,arena);
 }
 assert.ok(!Object.hasOwn(readEventOptions(), 'arena'));assert.ok(!Object.hasOwn(readDemoOptions(), 'arena'));assert.ok(!Object.hasOwn(readDemoOptions(),'derby'));for(const derby of ['score','survival'])assert.equal(readDemoOptions(JSON.stringify({version:1,derby})).derby,derby);
 assert.equal(arenaRecordKey('derby',undefined),'derby');assert.notEqual(arenaRecordKey('derby','foundry-yard-v1'),'derby');
});
test('replays round-trip arena identity and reject unsupported or cross-mode arena claims',()=>{
 const values=new Float32Array(REPLAY_STRIDE);values[6]=1;values[14]=100;for(let i=0;i<4;i++)values[21+i*8]=1;
 const doc:ReplayDocument={meta:{version:1,mode:'derby',arenaId:'foundry-yard-v1',reverse:false,cars:[{id:0,kind:'coupe',setup:stockSetup('coupe')}],props:0,created:'2026-10-08T00:00:00Z'},frames:[{time:0,values},{time:1,values:values.slice()}],events:[],limited:false};
 const decoded=decodeReplay(encodeReplay(doc));assert.equal(decoded.meta.arenaId,'foundry-yard-v1');assert.match(defaultReplayName(decoded),/^Foundry Breaker Yard/);
 for(const meta of [{mode:'race',arenaId:'foundry-yard-v1'},{mode:'derby',arenaId:'unknown'},{mode:'derby',arenaId:'foundry-yard-v1',courseId:'redbank-jump-v1'}])assert.throws(()=>replayCourseId(meta as any));
 const old={...doc.meta};delete old.arenaId;assert.equal(replayCourseId(old),'quarry-v1');assert.ok(!Object.hasOwn(decodeReplay(encodeReplay({...doc,meta:old})).meta,'arenaId'));
});

test('loading banks share exact rendered/contact heights and do not obstruct AI sensors',()=>{
 const world=new R.World({x:0,y:0,z:0}),owned=buildFoundryPhysics(R,world);world.step();
 try{
  for(let x=-57;x<=57;x+=3.7)for(let z=-57;z<=57;z+=4.3){
   const hit=world.castRay(new R.Ray({x,y:20,z},{x:0,y:-1,z:0}),30,true,undefined,undefined,undefined,undefined,c=>c.parent()?.handle===owned[0]);
   assert.ok(hit);assert.ok(Math.abs(20-hit.timeOfImpact-foundryHeight(x,z))<1e-5);assert.equal(foundryGround.isDrivingObstacle(hit.collider),false);
  }
  const p=foundryPatch();for(let i=0;i<p.positions.length;i+=3)assert.ok(Math.abs(p.positions[i+1]-foundryHeight(p.positions[i],p.positions[i+2]))<1e-5);
  assert.equal(foundryHeight(0,0),0);assert.equal(foundryHeight(34,0),0);assert.ok(foundryHeight(56,0)>2.39);assert.equal(foundryGround.surface(0,0),'gravel');assert.equal(foundryGround.surface(0,30),'asphalt');
  const wall=world.getRigidBody(owned[1]);assert.equal(foundryGround.isDrivingObstacle(wall.collider(0)),true);
 }finally{world.free();}
 const failed=new R.World({x:0,y:0,z:0}),sentinel=failed.createRigidBody(R.RigidBodyDesc.fixed()),create=failed.createCollider.bind(failed);let count=0;
 failed.createCollider=((...args:Parameters<typeof create>)=>{if(++count===30)throw Error('allocation failed');return create(...args);})as typeof failed.createCollider;
 try{assert.throws(()=>buildFoundryPhysics(R,failed),/allocation failed/);assert.equal(failed.bodies.len(),1);assert.equal(failed.colliders.len(),0);assert.ok(failed.getRigidBody(sentinel.handle));}finally{failed.free();}
});
test('all thirteen vehicles traverse the mixed yard and climb both loading banks without recovery',t=>{
 const results=[];
 for(const kind of CAR_KINDS)for(const side of [-1,1]){
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;buildFoundryPhysics(R,world);
  const spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass),s:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:1,steer:0,handbrake:false}};
  const yaw=side*Math.PI/2;car.body.setTranslation({x:-34*side,y:.89,z:0},true);car.body.setRotation({x:0,y:Math.sin(yaw/2),z:0,w:Math.cos(yaw/2)},true);let minUp=1,ticks=0;const surfaces=new Set();
  try{
   for(let i=0;i<90;i++){stepVehiclePhysics(car.body,car.controller,kind,spec,s,1/60);world.step();}
   for(;ticks<1200&&car.body.translation().x*side<52;ticks++){
    const pos=car.body.translation(),f=rotateVehicleVector({x:0,y:0,z:1},car.body.rotation()),r=rotateVehicleVector({x:1,y:0,z:0},car.body.rotation()),dx=60*side-pos.x,dz=-pos.z;s.surface=foundryGround.surface(pos.x,pos.z);surfaces.add(s.surface);s.input={throttle:s.speed<12?1:0,brake:s.speed>13?.2:0,steer:Math.max(-1,Math.min(1,Math.atan2(dx*r.x+dz*r.z,dx*f.x+dz*f.z)*1.7)),handbrake:false};
    stepVehiclePhysics(car.body,car.controller,kind,spec,s,1/60);world.step();const p=car.body.translation(),q=car.body.rotation();
    assert.ok(p.y>foundryHeight(p.x,p.z)-.1,'no terrain penetration');assert.ok(Math.abs(p.z)<5,kind+' crosses yard');minUp=Math.min(minUp,1-2*(q.x*q.x+q.z*q.z));
   }
   assert.ok(car.body.translation().x*side>=52,kind+' reaches loading bank');assert.ok(car.body.translation().y>2.5,kind+' climbs bank');assert.ok(minUp>.8,kind+' stays upright');assert.deepEqual([...surfaces].sort(),['asphalt','gravel']);results.push({kind,side,seconds:ticks/60,minUp});
  }finally{world.removeVehicleController(car.controller);world.free();}
 }
 t.diagnostic(JSON.stringify(results));
});
