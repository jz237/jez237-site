import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {ARENA_NAMES,type ArenaId} from '../src/arena-id';import {onlineArena} from '../src/online-arena';import {DEFAULT_ONLINE_EVENT,validOnlineEventRules,copyOnlineEventRules,ONLINE_ARENA_IDS} from '../src/online-events';import {Simulation} from '../multiplayer/simulation';import {Room,type Peer} from '../multiplayer/room';import {parseClientMessage,type Snapshot} from '../multiplayer/protocol';import {validOnlineSnapshot} from '../src/network-validation';import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';import {ONLINE_CARS} from '../src/online-roster';
await R.init();const rules=(arena:ArenaId)=>({...DEFAULT_ONLINE_EVENT,arena,derby:'score' as const,duration:60});
for(const arena of ONLINE_ARENA_IDS)test(`${arena}: authoritative 24-car score event, ground, recovery, snapshot and restoration`,()=>{
 const r=rules(arena);assert.ok(validOnlineEventRules(r));const s=new Simulation(R,'derby',Array.from({length:24},(_,i)=>ONLINE_CARS[i%14]),24,[],r);s.phase='playing';
 try{assert.equal(s.arenaId,arena);assert.ok(s.world.colliders.len()>16);const layout=onlineArena(arena).layout;
 for(const c of s.cars){assert.ok(Math.abs(Math.hypot(c.state.p.x-layout.x,c.state.p.z-layout.z)-layout.spawnRadius)<.001);assert.ok(Math.abs(c.state.p.y-s.course.height(c.state.p.x,c.state.p.z)-.89)<.001);}
 for(let i=0;i<60*61&&s.phase==='playing';i++)s.step(new Set());assert.equal(s.phase,'result');assert.ok(s.cars.some(c=>c.state.health<100||c.state.repair>0),'physical impacts occur');assert.ok(s.cars.every(c=>Number.isFinite(c.state.p.y)));
 const snap={...s.snapshot(true),eventSupport:true,arenaSupport:true,rosterSupport:true,members:[],ack:{}} as Snapshot;assert.ok(validOnlineSnapshot(snap));assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire(snap)),snap);
 const restored=new Simulation(R,'derby',[],24);try{restored.restore(snap);assert.equal(restored.arenaId,arena);assert.deepEqual(restored.event!.rules,copyOnlineEventRules(r));assert.equal(restored.course.surface(0,0),s.course.surface(0,0));restored.phase='playing';const c=restored.cars.find(c=>c.state.health>0)!;assert.ok(restored.recover(c.state.id));assert.ok(!restored.course.outside(c.state.p.x,c.state.p.y,c.state.p.z));}finally{restored.dispose();}
 if(arena!=='quarry-arena-v1')assert.equal(validOnlineSnapshot({...snap,arenaSupport:undefined}),false);
 }finally{s.dispose();}
});
const hello=(arenas=true)=>JSON.stringify({type:'hello',protocol:1,name:'ARENA',kind:'coupe',maxPlayers:24,eventRules:1,roster:1,...arenas?{arenas:1}:{}});
function peer(){return {messages:[] as any[],closed:[] as number[],send(m:any){this.messages.push(m)},close(code:number){this.closed.push(code)}} satisfies Peer;}
test('arena negotiation gates legacy peers and persists across room restoration',()=>{
 const r=new Room('ABCDEF',R),host=peer(),old=peer();try{r.connect(host,hello());r.connect(old,hello(false));const msg=JSON.stringify({type:'start',mode:'derby',rules:rules('wrenford-pit-v1')});r.receive(0,host,msg);assert.equal(r.sim.phase,'lobby');r.disconnect(1,old);r.receive(0,host,msg);assert.equal(r.sim.arenaId,'wrenford-pit-v1');assert.equal(r.connect(peer(),hello(false)),null);const saved=r.save();assert.equal(saved.sessions[0].arenas,1);const copy=new Room('ABCDEF',R);try{copy.restore(saved);assert.equal(copy.sim.arenaId,'wrenford-pit-v1');assert.equal(copy.snapshot().arenaSupport,true);}finally{copy.dispose();}}finally{r.dispose();}
 assert.equal(parseClientMessage(hello().replace('"arenas":1','"arenas":2')),null);
 for(const arena of ['constructor',null,42,'missing'])assert.equal(validOnlineEventRules({...rules('quarry-arena-v1'),arena}),false);
 assert.equal(validOnlineSnapshot({event:{}}),false);
});
