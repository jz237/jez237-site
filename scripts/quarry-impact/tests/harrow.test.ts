import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {HARROW_ARENA,HARROW_BARRIERS,buildHarrowPhysics,harrowGround} from '../src/harrow-arena';
import {createHarrowWorld} from '../src/harrow-world';
import {ARENA_NAMES,arenaRecordKey,resolveArenaId} from '../src/arena-id';
import {CAR_KINDS} from '../src/rules';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
import {readEventOptions,derbyGridSlot,clearRespawnSlot} from '../src/event-rules';
import {readDemoOptions} from '../src/demo-session';
import {replayCourseId,encodeReplay,decodeReplay,type ReplayDocument,REPLAY_STRIDE} from '../src/replay-data';
import {stockSetup} from '../src/garage';
import {defaultReplayName} from '../src/replay-library';
import {exportSave,readSave,SAVE_KEYS} from '../src/save-backup';
await R.init();
test('Harrow supports stable full fields and a continuous collision wall matching the visible arena',()=>{
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
 try{
  buildHarrowPhysics(R,world);world.step();
  for(let i=0;i<192;i++){const a=i/192*Math.PI*2,hit=world.castRay(new R.Ray({x:0,y:1,z:0},{x:Math.sin(a),y:0,z:Math.cos(a)}),55,true);assert.ok(hit&&hit.timeOfImpact>47&&hit.timeOfImpact<49);}
  const cars=Array.from({length:24},(_,i)=>{const kind=CAR_KINDS[i%CAR_KINDS.length],spec=vehicleSpecification(kind),rig=createVehiclePhysics(R,world,kind,spec.mass),grid=derbyGridSlot(i,24,HARROW_ARENA);rig.body.setTranslation({x:grid.x,y:.89,z:grid.z},true);rig.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:1,steer:0,handbrake:false}};return{kind,spec,rig,grid,state};});
  for(let i=0;i<180;i++){for(const c of cars)stepVehiclePhysics(c.rig.body,c.rig.controller,c.kind,c.spec,c.state,1/60);world.step();}
  for(const c of cars){const p=c.rig.body.translation();assert.ok(Math.hypot(p.x-c.grid.x,p.z-c.grid.z)<.15);assert.ok(p.y>.5&&p.y<1.1);assert.equal(harrowGround.surface(p.x,p.z),'asphalt');}
  const field=cars.map((c,id)=>({id,current:c.rig.body.translation()}));const spawn=clearRespawnSlot(field,0,HARROW_ARENA);assert.ok(spawn);assert.ok(Math.hypot(spawn.x,spawn.z)<HARROW_ARENA.radius-8);
 }finally{world.free();}
 const art=createHarrowWorld(),matrices:T.Matrix4[]=[];art.root.traverse(o=>{if(o instanceof T.InstancedMesh)for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);matrices.push(m);}});
 for(const s of HARROW_BARRIERS){const expected=new T.Matrix4().compose(new T.Vector3(s.x,s.y,s.z),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),s.yaw),new T.Vector3(...s.half).multiplyScalar(2));assert.ok(matrices.some(m=>m.elements.every((v,i)=>Math.abs(v-expected.elements[i])<1e-5)));}
 art.dispose();art.dispose();assert.equal(art.root.children.length,0);
});
test('arena settings remain separate from circuits and old settings and record keys are unchanged',async()=>{
 assert.equal(resolveArenaId('missing'),'quarry-arena-v1');
 for(const arena of Object.keys(ARENA_NAMES)){
  const e=readEventOptions(JSON.stringify({version:1,course:'ashford-autodrome-v1',arena})),d=readDemoOptions(JSON.stringify({version:1,course:'redbank-jump-v1',arena}));assert.equal(e.arena,arena);assert.equal(d.arena,arena);assert.equal(e.course,'ashford-autodrome-v1');assert.equal(d.course,'redbank-jump-v1');
  const data=new Map(SAVE_KEYS.map(k=>[k,null]as const))as Map<string,string|null>;data.set('quarry-impact-events-v1',JSON.stringify(e));data.set('quarry-impact-demo-v1',JSON.stringify(d));const text=await exportSave({getItem:k=>data.get(k)??null});assert.equal(JSON.parse((await readSave(text)).entries['quarry-impact-events-v1']!).arena,arena);
 }
 assert.ok(!Object.hasOwn(readEventOptions(), 'arena'));assert.ok(!Object.hasOwn(readDemoOptions(), 'arena'));assert.ok(!Object.hasOwn(readDemoOptions(),'derby'));for(const derby of ['score','survival'])assert.equal(readDemoOptions(JSON.stringify({version:1,derby})).derby,derby);
 assert.equal(arenaRecordKey('derby',undefined),'derby');assert.notEqual(arenaRecordKey('derby','harrow-bowl-v1'),'derby');
});
test('replays round-trip arena identity and reject unsupported or cross-mode arena claims',()=>{
 const values=new Float32Array(REPLAY_STRIDE);values[6]=1;values[14]=100;for(let i=0;i<4;i++)values[21+i*8]=1;
 const doc:ReplayDocument={meta:{version:1,mode:'derby',arenaId:'harrow-bowl-v1',reverse:false,cars:[{id:0,kind:'coupe',setup:stockSetup('coupe')}],props:0,created:'2026-10-08T00:00:00Z'},frames:[{time:0,values},{time:1,values:values.slice()}],events:[],limited:false};
 const decoded=decodeReplay(encodeReplay(doc));assert.equal(decoded.meta.arenaId,'harrow-bowl-v1');assert.match(defaultReplayName(decoded),/^Harrow Breaker Bowl/);
 for(const meta of [{mode:'race',arenaId:'harrow-bowl-v1'},{mode:'derby',arenaId:'unknown'},{mode:'derby',arenaId:'harrow-bowl-v1',courseId:'redbank-jump-v1'}])assert.throws(()=>replayCourseId(meta as any));
 const old={...doc.meta};delete old.arenaId;assert.equal(replayCourseId(old),'quarry-v1');assert.ok(!Object.hasOwn(decodeReplay(encodeReplay({...doc,meta:old})).meta,'arenaId'));
});
