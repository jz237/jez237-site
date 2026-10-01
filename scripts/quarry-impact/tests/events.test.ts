import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {readEventOptions,DEFAULT_EVENT,circuitRoute,raceGridSlot,derbyGridSlot,checkRoute,lapProgress,CombatScoreboard,clearRespawnSlot,stepScoreRespawns} from '../src/event-rules';
import {DrivingBrain} from '../src/driving-brain';
import {DERBY_ARENA} from '../src/derby-arena';
import {settleRun,readProfile} from '../src/progression';
import {SessionTelemetry,emptyRun} from '../src/session-telemetry';
import {templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {verifyEventRevision} from './event-invariants';

test('event options reject corrupt saves and bound field size, lap count and duration',()=>{
  for(const s of ['[]','null','oops','{"version":2}'])assert.deepEqual(readEventOptions(s),DEFAULT_EVENT);
  assert.deepEqual(readEventOptions(JSON.stringify({version:1,field:100,laps:-3,direction:'sideways',duration:99999,derby:'x'})),{...DEFAULT_EVENT,field:24,laps:1,duration:1200});
  const options={...DEFAULT_EVENT,field:24,laps:20,direction:'reverse',derby:'score',duration:60};assert.deepEqual(readEventOptions(JSON.stringify(options)),options);
});
function noOverlap(a:{x:number;z:number;yaw:number},b:{x:number;z:number;yaw:number}){
  const axes=[a.yaw,b.yaw].flatMap(yaw=>[{x:Math.sin(yaw),z:Math.cos(yaw)},{x:Math.cos(yaw),z:-Math.sin(yaw)}]);
  const radius=(p:typeof a,u:{x:number;z:number})=>2.6*Math.abs(Math.sin(p.yaw)*u.x+Math.cos(p.yaw)*u.z)+1.05*Math.abs(Math.cos(p.yaw)*u.x-Math.sin(p.yaw)*u.z);
  return axes.some(u=>Math.abs((a.x-b.x)*u.x+(a.z-b.z)*u.z)>radius(a,u)+radius(b,u));
}
test('all 24 grid slots have distinct non-overlapping full-size chassis in both directions and derby',()=>{
  for(const direction of ['forward','reverse']as const){const grid=Array.from({length:24},(_,i)=>raceGridSlot(i,direction));for(let i=0;i<24;i++)for(let j=i+1;j<24;j++)assert.ok(noOverlap(grid[i],grid[j]),`${direction} ${i}/${j}`);}
  const grid=Array.from({length:24},(_,i)=>derbyGridSlot(i,24,DERBY_ARENA));for(let i=0;i<24;i++)for(let j=i+1;j<24;j++)assert.ok(noOverlap(grid[i],grid[j]));
});
test('tail grid cars follow every pre-line gate and complete the full lap in forward and reverse races',()=>{
  for(const direction of ['forward','reverse']as const)for(let id=0;id<24;id++){
    const route=circuitRoute(direction),spawn=raceGridSlot(id,direction);let passed=spawn.passed,next=spawn.next,steps=0;
    while(!lapProgress(passed,2).finished){
      const wrong=route[(next+7)%24];assert.equal(checkRoute(route,wrong.x,wrong.z,next,Infinity).passed,false);
      const p=route[next];assert.equal(checkRoute(route,p.x,p.z,next,Infinity).passed,true);passed++;next=(next+1)%24;steps++;
      if(steps===-spawn.passed)assert.equal(passed,0,'approaching the line cannot count a lap');assert.ok(steps<60);
    }
    assert.equal(steps,48-spawn.passed);assert.equal(next,1);assert.equal(lapProgress(passed,2).lap,3);
  }
});
test('reverse AI uses the reverse route and drives toward its next checkpoint',()=>{
  const route=circuitRoute('reverse'),spawn=raceGridSlot(0,'reverse'),brain=new DrivingBrain();
  const car={id:0,current:{...spawn,y:1},velocity:{x:0,y:0,z:0},forward:{x:Math.sin(spawn.yaw),y:0,z:Math.cos(spawn.yaw)},right:{x:Math.cos(spawn.yaw),y:0,z:-Math.sin(spawn.yaw)},speed:0,health:100,finished:false,nextCheckpoint:1,surface:'gravel'};
  const input=brain.update(car,[car],'race',.1,undefined,route);assert.ok(input.throttle>0);assert.ok(Math.abs(input.steer)<.6);assert.ok(car.forward.x*(route[1].x-spawn.x)+car.forward.z*(route[1].z-spawn.z)>0);
});
test('score derby counts real damage and repeat knockouts only after an opponent respawns',()=>{
  const board=new CombatScoreboard();board.hit(0,1,100,80,1);board.hit(0,1,80,0,2);board.hit(0,1,80,0,2);assert.equal(board.points(0),200);assert.equal(board.get(1).respawnAt,6);assert.equal(board.get(1).deaths,1);
  board.respawn(1);board.hit(2,1,100,0,8);assert.equal(board.points(2),200);assert.equal(board.get(1).deaths,2);
  const cars=[{id:2,health:50,inflicted:100},{id:0,health:70,inflicted:100},{id:1,health:0,inflicted:0}];assert.deepEqual(board.order(cars).map(c=>c.id),[0,2,1]);
  board.disable(0,10);board.disable(0,11);assert.equal(board.get(0).respawnAt,14);assert.equal(board.get(0).deaths,1);
  const telemetry=new SessionTelemetry();telemetry.impact(1,100,0);telemetry.impact(1,100,0);assert.equal(telemetry.stats.knockouts,1);telemetry.resetOpponent(1);telemetry.impact(1,100,0);assert.equal(telemetry.stats.knockouts,2);
});
test('a score winner can win while awaiting respawn at the time limit',()=>{const p=readProfile();settleRun(p,'score-win',{...emptyRun(),seconds:60,damage:100,completed:true,health:0,rank:1,won:true});assert.equal(p.wins,1);});
test('respawn chooses a clear space and defers when the ring is occupied',()=>{
  const cars=Array.from({length:24},(_,id)=>({id,current:derbyGridSlot(id,24,DERBY_ARENA)}));const spawn=clearRespawnSlot(cars,0,DERBY_ARENA);assert.ok(spawn);assert.ok(cars.slice(1).every(c=>Math.hypot(c.current.x-spawn.x,c.current.z-spawn.z)>=8));
  const packed=Array.from({length:64},(_,id)=>({id,current:derbyGridSlot(id,64,DERBY_ARENA)}));assert.equal(clearRespawnSlot(packed,999,DERBY_ARENA),null);
});
test('24 actual Rapier vehicles run together, remain finite and release their physics bodies',async()=>{
  await R.init();const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const wheel=new T.Group();wheel.name='wheel_'+name;model.add(wheel);}for(const kind of ['coupe','sedan','hatch']as const)templates.set(kind,model);
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
  const fx={emit(){},mark(){},detach(){}}as any,brain=new DrivingBrain(DERBY_ARENA);
  const cars=Array.from({length:24},(_,id)=>{const kind=(['coupe','sedan','hatch']as const)[id%3],c=new Vehicle(id,kind,0xffffff,scene,world,fx),p=derbyGridSlot(id,24,DERBY_ARENA);c.place(p.x,p.z,p.yaw);return c;});
  assert.equal(world.bodies.len(),24);
  for(let step=0;step<360;step++){for(const c of cars){c.input=brain.update(c,cars,'derby',1/60);c.preStep(1/60);}world.step();for(const c of cars)c.postStep(1/60,step/60);}
  for(const c of cars){assert.ok(c.current.toArray().every(Number.isFinite));assert.ok(c.current.y>-.1);assert.ok(c.velocity.length()<90);c.dispose();}assert.equal(world.bodies.len(),0);world.free();
});
test('custom events preserve recoverable exact prior sources',verifyEventRevision);
test('24-car AI fields make full laps on both ordered routes with real vehicle dynamics',async(t)=>{
  await R.init();const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const wheel=new T.Group();wheel.name='wheel_'+name;model.add(wheel);}for(const kind of ['coupe','sedan','hatch']as const)templates.set(kind,model);
  for(const direction of ['forward','reverse']as const){
    const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),route=circuitRoute(direction);world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
    const fx={emit(){},mark(){},detach(){}}as any,brain=new DrivingBrain();
    const cars=Array.from({length:24},(_,id)=>{const c=new Vehicle(id,(['coupe','sedan','hatch']as const)[id%3],0xffffff,scene,world,fx),p=raceGridSlot(id,direction);c.place(p.x,p.z,p.yaw);c.nextCheckpoint=p.next;c.passed=p.passed;return c;});
    for(let step=0;step<90;step++){for(const c of cars)c.preStep(1/60);world.step();for(const c of cars)c.postStep(1/60,0);}
    for(let step=0;step<120*60;step++){
      for(const c of cars){c.input=brain.update(c,cars,'race',1/60,undefined,route);c.preStep(1/60);}world.step();
      for(const c of cars){c.postStep(1/60,step/60);const gate=checkRoute(route,c.current.x,c.current.z,c.nextCheckpoint,c.checkpointDistance);c.checkpointDistance=gate.distance;if(gate.passed){c.nextCheckpoint=(c.nextCheckpoint+1)%24;c.checkpointDistance=Infinity;if(!c.finished){c.passed++;c.finished=lapProgress(c.passed,1).finished;}}}
    }
    const complete=cars.filter(c=>c.finished).length;t.diagnostic(`${direction}: ${complete}/24 completed within 120 simulated seconds on the unobstructed dynamics fixture`);assert.ok(complete===24,`${direction}: ${complete}/24 completed; progress ${cars.map(c=>c.passed)}`);
    for(const c of cars)c.dispose();world.free();
  }
});

test('score-derby lifecycle repairs a real wreck only after the delay and preserves scores',async()=>{
  await R.init();const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const wheel=new T.Group();wheel.name='wheel_'+name;model.add(wheel);}templates.set('coupe',model);
  const world=new R.World({x:0,y:-9.81,z:0}),car=new Vehicle(0,'coupe',0xffffff,new T.Scene(),world,{emit(){},mark(){},detach(){}}as any);car.place(0,0,0);
  const board=new CombatScoreboard();car.hit(new T.Vector3(0,1,1),new T.Vector3(0,0,-1),200,1);assert.equal(car.health,0);board.hit(1,0,100,car.health,1);
  let respawns=0;const respawn=()=>respawns++;
  stepScoreRespawns(board,[car],4.99,60,DERBY_ARENA,respawn);assert.equal(car.health,0);assert.equal(respawns,0);
  stepScoreRespawns(board,[car],5,60,DERBY_ARENA,respawn);assert.equal(car.health,100);assert.equal(respawns,1);assert.equal(board.points(1),200);assert.equal(board.get(0).deaths,1);assert.equal(board.get(0).respawnAt,0);
  assert.ok(Math.abs(Math.hypot(car.current.x-DERBY_ARENA.x,car.current.z-DERBY_ARENA.z)-DERBY_ARENA.spawnRadius)<.001);
  car.hit(car.current,new T.Vector3(0,0,-1),200,56);board.disable(0,56);stepScoreRespawns(board,[car],60,60,DERBY_ARENA,respawn);assert.equal(car.health,0);assert.equal(respawns,1,'no respawn after time expires');car.dispose();world.free();
});
