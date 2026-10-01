import test from 'node:test';import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {Simulation} from '../multiplayer/simulation';import {Room,type Peer} from '../multiplayer/room';
import {parseClientMessage,NEUTRAL,type ServerMessage,type Snapshot} from '../multiplayer/protocol';
import {DEFAULT_ONLINE_EVENT,validOnlineEventRules,validOnlineEventState,OnlineEvent,type OnlineEventRules} from '../src/online-events';
import {validOnlineSnapshot} from '../src/network-validation';import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
import {circuitRoute,directionForCar,raceGridSlot} from '../src/event-rules';import {WAYPOINTS,waypointSequence,nearestRoad} from '../src/waypoint-race';
import {landscapeHeight} from '../src/quarry-layout';import {freshComponents} from '../src/component-damage';
import {verifyOnlineEventsRevision} from './online-events-invariants';
await R.init();
const rules=(v:Partial<OnlineEventRules>={}):OnlineEventRules=>({...DEFAULT_ONLINE_EVENT,...v});
const human=new Set(Array.from({length:24},(_,i)=>i));
const envelope=(s:Simulation):Snapshot=>({...s.snapshot(true),eventSupport:true,members:[],ack:{}});
const peer=()=>{const messages:ServerMessage[]=[],closed:number[]=[];return{messages,closed,send:(m:ServerMessage)=>messages.push(structuredClone(m)),close:(c:number)=>closed.push(c)} satisfies Peer;};
const hello=(modern=true,token?:string)=>JSON.stringify({type:'hello',protocol:1,name:'EVENT DRIVER',kind:'coupe',maxPlayers:24,...modern?{eventRules:1}:{},token});
const send=(r:Room,p:ReturnType<typeof peer>,m:unknown,id=0)=>r.receive(id,p,JSON.stringify(m));
function place(s:Simulation,id:number,p:{x:number;z:number},yaw=0){const c=s.cars[id];c.body.setTranslation({...p,y:landscapeHeight(p.x,p.z)+.9},true);c.body.setRotation({x:0,y:Math.sin(yaw/2),z:0,w:Math.cos(yaw/2)},true);c.body.setLinvel({x:0,y:0,z:0},true);c.body.setAngvel({x:0,y:0,z:0},true);Object.assign(c.state,{p:{...c.body.translation()},q:{...c.body.rotation()},v:{x:0,y:0,z:0}});s.setInput(id,{...NEUTRAL});}
function active(mode:'race'|'derby',r:OnlineEventRules,seed=19){const s=new Simulation(R,mode,[],24,[],r,seed);s.phase='playing';return s;}

test('event rules negotiate explicitly and reject malformed or unbounded client data',()=>{
 for(const r of [rules(),rules({race:'random',direction:'opposing',laps:20,derby:'score',duration:1200})]){assert.ok(validOnlineEventRules(r));assert.deepEqual(parseClientMessage(JSON.stringify({type:'start',mode:'race',rules:r,seed:999,score:999})),{type:'start',mode:'race',rules:r});}
 for(const patch of [{laps:0},{laps:21},{laps:1.2},{duration:59},{duration:1201},{direction:['forward']},{race:['laps']},{derby:'time'},{version:2},{laps:NaN},{duration:Infinity},{arbitrary:1}]){const r={...rules(),...patch};assert.equal(validOnlineEventRules(r),false);assert.equal(parseClientMessage(JSON.stringify({type:'start',mode:'race',rules:r})),null);}
 assert.equal(parseClientMessage(hello())?.type,'hello');assert.equal((parseClientMessage(hello())as any).eventRules,1);
 assert.equal(parseClientMessage(hello().replace('"eventRules":1','"eventRules":2')),null);
 assert.ok(Buffer.byteLength(JSON.stringify({type:'start',mode:'race',rounds:9,rules:rules()}))<1024);
 assert.equal(parseClientMessage(JSON.stringify({type:'start',mode:'race',rules:rules(),padding:'x'.repeat(1024)})),null);
});

test('forward, reverse and opposing server grids and gate scoring complete exactly the configured laps',()=>{
 for(const direction of ['forward','reverse','opposing']as const){const s=active('race',rules({direction,laps:2}));try{
  for(const c of s.cars){const grid=raceGridSlot(c.state.id,direction);assert.ok(Math.hypot(c.state.p.x-grid.x,c.state.p.z-grid.z)<1e-5);assert.equal(c.state.passed,grid.passed);assert.equal(c.state.nextCheckpoint,grid.next);}
  const id=direction==='opposing'?1:0;const c=s.cars[id],route=circuitRoute(directionForCar(direction,id));
  const skipped=route[(c.state.nextCheckpoint+2)%24];place(s,id,skipped);s.step(human);assert.equal(c.state.passed,raceGridSlot(id,direction).passed);
  let steps=0;while(!c.state.finished&&steps++<60){place(s,id,route[c.state.nextCheckpoint]);s.step(human);if(c.state.passed<48)assert.equal(c.state.finished,false);}
  assert.equal(c.state.passed,48);assert.equal(c.state.finished,true);assert.equal(c.state.nextCheckpoint,1);assert.ok(c.state.finishTime>0);assert.ok(validOnlineSnapshot(envelope(s)));
 }finally{s.dispose();}}
});

test('custom lap limits work for eight-driver rooms and racing wrecks cannot score gates',()=>{
 const s=new Simulation(R,'race',[],8,[],rules({laps:1,direction:'reverse'}));s.phase='playing';try{const c=s.cars[0];c.state.health=0;place(s,0,circuitRoute('reverse')[1]);s.step(human);assert.equal(c.state.passed+0,0);c.state.health=100;for(let i=0;i<24;i++){place(s,0,circuitRoute('reverse')[c.state.nextCheckpoint]);s.step(human);}assert.equal(c.state.finished,true);}finally{s.dispose();}
});

test('ordered, free and random waypoint authority rejects skips and duplicate collection, preserves rounds and ranks finishers',()=>{
 for(const race of ['ordered','free','random']as const){const s=active('race',rules({race,laps:2}),32);try{
  place(s,0,WAYPOINTS[0]);s.step(human);assert.equal(s.cars[0].state.passed,0);
  for(let round=0;round<2;round++){
   const sequence=race==='random'?waypointSequence(32,round):race==='free'?[5,2,4,1,3]:[1,2,3,4,5];
   if(race!=='free'){place(s,0,WAYPOINTS[sequence[1]]);s.step(human);assert.equal(s.cars[0].state.passed,round*6);}
   for(const id of [...sequence,0]){place(s,0,WAYPOINTS[id]);s.step(human);const passed=s.cars[0].state.passed;s.step(human);assert.equal(s.cars[0].state.passed,passed);assert.ok(validOnlineEventState(s.event!.snapshot(24),'race',24));}
  }
  assert.equal(s.cars[0].state.passed,12);assert.equal(s.cars[0].state.finished,true);assert.equal(s.ranking()[0],0);assert.ok(validOnlineSnapshot(envelope(s)));
 }finally{s.dispose();}}
});

test('recovery follows the driver direction and waypoint road without awarding stations',()=>{
 for(const r of [rules({direction:'opposing'}),rules({race:'random'})]){const s=active('race',r);try{const c=s.cars[1];c.state.nextCheckpoint=4;place(s,1,{x:80,z:80});const before=c.state.passed;assert.equal(s.recover(1),true);assert.equal(c.state.penalty,5);assert.equal(c.state.passed,before);assert.equal(s.recover(1),false);
 if(r.race==='laps'){const p=circuitRoute('reverse')[3];assert.ok(Math.hypot(c.state.p.x-p.x,c.state.p.z-p.z)<1e-4);}else{assert.ok(nearestRoad(c.state.p).distance<1e-4);assert.equal(s.event!.waypoints!.get(1).passed,0);}
 }finally{s.dispose();}}
});

test('score derby real impacts award actual health loss and one knockout, then repair and respawn without ending early',()=>{
 const s=active('derby',rules({derby:'score',duration:60}));s.cars[1].body.setEnabled(true);try{
  for(const id of [0,1]){place(s,id,{x:id*.65,z:(id?1:-1)*4},id?Math.PI:0);const c=s.cars[id];c.state.health=3;c.body.setLinvel({x:0,y:0,z:id?-22:22},true);c.state.v={x:0,y:0,z:id?-22:22};s.setInput(id,{throttle:0,steer:0,brake:0,handbrake:false});}
  for(let i=0;i<90;i++)s.step(human);
  const board=s.event!.combat;assert.ok(s.damage.length>0);assert.ok(board.get(0).knockouts+board.get(1).knockouts>=1);assert.equal(s.phase,'playing');
  for(const id of [0,1])assert.ok(Math.abs(board.get(id).damage-s.cars[id].state.inflicted)<1e-6);
  const dead=s.cars.find(c=>c.state.health===0)!;assert.ok(dead);const id=dead.state.id,ko=board.get(1-id).knockouts;assert.equal(s.recover(id),false);
  for(let i=0;i<270;i++)s.step(human);
  assert.equal(board.get(1-id).knockouts,ko);assert.equal(dead.state.repair,1);assert.equal(dead.state.health,100);assert.deepEqual(dead.state.components,freshComponents());assert.equal(dead.state.dents!.length,0);assert.equal(board.get(id).respawnAt,0);assert.ok(validOnlineSnapshot(envelope(s)));
  s.elapsed=59.999;s.step(human);assert.equal(s.phase,'result');assert.deepEqual(s.ranking(),board.order(s.cars.map(c=>c.state)).map(c=>c.id));
 }finally{s.dispose();}
});

test('survival derby retains elimination while custom time limits govern both variants',()=>{
 for(const derby of ['survival','score']as const){const s=active('derby',rules({derby,duration:120}));try{s.cars.slice(1).forEach(c=>c.state.health=0);s.step(human);assert.equal(s.phase,derby==='score'?'playing':'result');if(derby==='score'){s.elapsed=119.999;s.step(human);assert.equal(s.phase,'result');}}finally{s.dispose();}}
});

test('host-only event start, cup votes, host migration, and saved rooms preserve rules and fresh server seeds',()=>{
 let now=1000;const room=new Room('ABCDEF',R,()=>now),host=peer(),guest=peer(),r=rules({race:'random',derby:'score',laps:2,duration:120});try{
 room.connect(host,hello());room.connect(guest,hello());send(room,guest,{type:'start',mode:'race',rules:r},1);assert.equal(room.sim.phase,'lobby');
 send(room,host,{type:'start',mode:'race',rounds:3,rules:r});assert.deepEqual(room.sim.event!.rules,r);const seed=room.sim.event!.seed;assert.ok(Number.isInteger(seed));
 room.sim.phase='playing';const first=room.sim.event!.waypoints!.available(0)[0];place(room.sim,0,WAYPOINTS[first]);room.step();const passed=room.sim.cars[0].state.passed;assert.equal(passed,1);
 send(room,host,{type:'start',mode:'derby',rules:rules()});assert.deepEqual(room.sim.event!.rules,r);
 const saved=room.save(),restored=new Room('ABCDEF',R,()=>now);try{restored.restore(saved);assert.deepEqual(restored.sim.event!.snapshot(24),room.sim.event!.snapshot(24));assert.equal(restored.sim.cars[0].state.passed,passed);
 const token=(host.messages.find(m=>m.type==='welcome')as any).token,p=peer();assert.equal(restored.connect(p,hello(true,token)),0);assert.equal(restored.sim.cars[0].state.passed,passed);assert.ok(validOnlineSnapshot(restored.snapshot()));}finally{restored.dispose();}
 room.sim.phase='result';room.snapshot();send(room,guest,{type:'vote',mode:'derby'},1);room.disconnect(0,host);assert.equal(room.sessions.get(1)!.member.host,true);send(room,guest,{type:'next'},1);assert.equal(room.sim.mode,'derby');assert.deepEqual(room.sim.event!.rules,r);assert.equal(room.sim.event!.combat.points(0),0);assert.notEqual(room.sim.event!.seed,seed);
 }finally{room.dispose();}
});

test('legacy clients can play standard rules, but cannot silently join or start unsupported custom events',()=>{
 const room=new Room('ABCDEF',R),p=peer(),old=peer();try{room.connect(p,hello());room.connect(old,hello(false));send(room,p,{type:'start',mode:'race',rules:rules({direction:'reverse'})});assert.equal(room.sim.phase,'lobby');assert.equal(p.messages.at(-1)!.type,'error');
 send(room,p,{type:'start',mode:'race',rules:rules()});assert.equal(room.sim.phase,'countdown');room.sim.phase='result';room.disconnect(1,old);send(room,p,{type:'start',mode:'race',rules:rules({direction:'reverse'})});const late=peer();assert.equal(room.connect(late,hello(false)),null);assert.deepEqual(late.closed,[1008]);
 const saved=room.save();delete saved.snapshot.event;delete saved.snapshot.eventSupport;const restored=new Room('ABCDEF',R);try{restored.restore(saved);assert.equal(restored.sim.event,undefined);}finally{restored.dispose();}
 }finally{room.dispose();}
});

test('progress and respawn deadlines survive storage and binary wire; malformed event snapshots fail closed',()=>{
 const s=active('derby',rules({derby:'score',duration:90}));try{s.cars[0].state.health=0;s.event!.combat.hit(1,0,19,0,1);s.elapsed=2;const snap=envelope(s),restored=new Simulation(R,'derby',[],24);try{restored.restore(snap);assert.deepEqual(restored.event!.snapshot(24),s.event!.snapshot(24));assert.ok(validOnlineSnapshot(snap));const wire=JSON.parse(JSON.stringify(decodeSnapshotWire(encodeSnapshotWire(snap))));assert.deepEqual(wire,JSON.parse(JSON.stringify(snap)));assert.ok(validOnlineSnapshot(wire));
 for(const patch of [(v:Snapshot)=>v.event!.rules.duration=1,(v:Snapshot)=>v.event!.seed=-1,(v:Snapshot)=>v.event!.combat![0].damage=Infinity,(v:Snapshot)=>v.event!.combat!.pop(),(v:Snapshot)=>delete v.eventSupport]){const bad=structuredClone(snap);patch(bad);assert.equal(validOnlineSnapshot(bad),false);}
 restored.elapsed=4.9;restored.step(human);assert.equal(restored.cars[0].state.health,0);restored.elapsed=5.01;restored.step(human);assert.equal(restored.cars[0].state.health,100);
 }finally{restored.dispose();}}finally{s.dispose();}
 const e=new OnlineEvent('race',rules({race:'ordered',laps:2}),4);e.waypoints!.sample(0,WAYPOINTS[1]);const snap=e.snapshot(24);assert.ok(validOnlineEventState(snap,'race',24));for(const patch of [(v:typeof snap)=>v.waypoints![0].visited=[2],(v:typeof snap)=>v.waypoints![0].visited=[1,1],(v:typeof snap)=>v.waypoints![0].round=20,(v:typeof snap)=>v.waypoints![0].finished=true]){const bad=structuredClone(snap);patch(bad);assert.equal(validOnlineEventState(bad,'race',24),false);}
});
test('online event runtime preserves the exact earlier revision',verifyOnlineEventsRevision);

test('finished AI clears the finish lane without changing its score or recorded finish time',()=>{
 const s=active('race',rules({race:'ordered',laps:1}));try{const c=s.cars[0];c.state.finished=true;c.state.passed=6;c.state.finishTime=42;c.state.nextCheckpoint=1;place(s,0,circuitRoute('forward')[0],Math.PI/2);assert.ok(s.ai(c).throttle>0);place(s,0,circuitRoute('forward')[1]);s.step(human);assert.equal(c.state.nextCheckpoint,2);assert.equal(c.state.passed,6);assert.equal(c.state.finishTime,42);}finally{s.dispose();}
});
