import test from 'node:test';import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {Room,type Peer} from '../multiplayer/room';
import {Simulation} from '../multiplayer/simulation';
import {parseClientMessage,NEUTRAL,type ServerMessage,type Snapshot} from '../multiplayer/protocol';
import {DEFAULT_ONLINE_EVENT,OnlineEvent,validOnlineEventState,type OnlineEventRules} from '../src/online-events';
import {validOnlineSnapshot} from '../src/network-validation';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
import {onlineEventControls} from '../src/online-event-ui';
import {QuarryNetwork} from '../src/network';
import {landscapeHeight} from '../src/quarry-layout';
await R.init();
const rules:OnlineEventRules={...DEFAULT_ONLINE_EVENT,derby:'score-no-respawn',duration:60};
const peer=()=>{const messages:ServerMessage[]=[],closed:number[]=[];return{messages,closed,send:(m:ServerMessage)=>messages.push(structuredClone(m)),close:(code:number)=>closed.push(code)} satisfies Peer};
const hello=(modern=true,token?:string)=>JSON.stringify({type:'hello',protocol:1,name:'DRIVER',kind:'coupe',eventRules:1,...(modern?{noRespawnDerby:1}:{}),...(token?{token}:{})});
const start=(r:Room,p:Peer)=>r.receive(0,p,JSON.stringify({type:'start',mode:'derby',rules}));
test('handshake strictly negotiates no-respawn support and old messages still parse',()=>{
 assert.equal((parseClientMessage(hello()) as any).noRespawnDerby,1);assert.equal((parseClientMessage(hello(false)) as any).noRespawnDerby,undefined);
 for(const patch of [{noRespawnDerby:2},{noRespawnDerby:true},{noRespawnDerby:[1]},{eventRules:undefined}])assert.equal(parseClientMessage(JSON.stringify({...JSON.parse(hello()),...patch})),null);
});
test('rooms reject mixed-client starts and incompatible reconnects while preserving saved capability',()=>{
 const room=new Room('TESTAA',R),host=peer(),old=peer();let restored:Room|undefined;
 try{
  assert.equal(room.connect(host,hello()),0);assert.equal(room.connect(old,hello(false)),1);start(room,host);assert.equal(room.sim.phase,'lobby');assert.ok(host.messages.some(m=>m.type==='error'&&m.message.includes('All connected drivers')));
  const oldToken=room.sessions.get(1)!.token;room.disconnect(1,old);start(room,host);assert.equal(room.sim.phase,'countdown');
  const stale=peer();assert.equal(room.connect(stale,hello(false,oldToken)),null);assert.deepEqual(stale.closed,[1008]);
  const saved=room.save();assert.equal(saved.sessions[0].noRespawnDerby,1);assert.equal(saved.snapshot.noRespawnDerbySupport,true);
  restored=new Room('TESTAA',R);restored.restore(saved);assert.equal(restored.sim.event!.rules.derby,'score-no-respawn');assert.equal(restored.sessions.get(0)!.noRespawnDerby,1);
  const current=peer();assert.equal(restored.connect(current,hello(true,saved.sessions[0].token)),0);assert.equal(restored.sim.event!.respawns,false);
 }finally{room.sim.dispose();restored?.sim.dispose();}
});
test('authoritative physical impact wrecks stay out past the respawn delay and cannot recover',()=>{
 const sim=new Simulation(R,'derby',[],8,[],rules,23);sim.phase='playing';
 try{
  for(const id of [0,1]){const c=sim.cars[id],p={x:id*.65,z:(id?1:-1)*4};c.body.setTranslation({...p,y:landscapeHeight(p.x,p.z)+.9},true);c.body.setRotation({x:0,y:id?1:0,z:0,w:id?0:1},true);c.body.setLinvel({x:0,y:0,z:id?-22:22},true);c.state.p={...c.body.translation()};c.state.q={...c.body.rotation()};c.state.v={x:0,y:0,z:id?-22:22};c.state.health=3;sim.setInput(id,{...NEUTRAL,brake:0});}
  const human=new Set(Array.from({length:8},(_,i)=>i));for(let i=0;i<90;i++)sim.step(human);
  const dead=sim.cars.filter(c=>c.state.health<=0);assert.ok(dead.length>0,'Real collision caused a wreck');assert.ok(sim.event!.combat.get(0).damage+sim.event!.combat.get(1).damage>0);
  const epochs=dead.map(c=>c.state.repair);for(let i=0;i<300;i++)sim.step(human);
  dead.forEach((c,i)=>{assert.equal(c.state.health,0);assert.equal(c.state.repair,epochs[i]);assert.equal(sim.recover(c.state.id),false)});assert.equal(sim.phase,'playing');
  const snap={...sim.snapshot(true),eventSupport:true,noRespawnDerbySupport:true,members:[],ack:{}} as Snapshot;assert.ok(validOnlineSnapshot(snap));const wire=decodeSnapshotWire(encodeSnapshotWire(snap)) as Snapshot;assert.ok(validOnlineSnapshot(wire));assert.equal(wire.event?.rules.derby,'score-no-respawn');
  const saved=new Simulation(R);try{saved.restore(snap);assert.equal(saved.event!.score,true);assert.equal(saved.event!.respawns,false);for(const c of dead)assert.equal(saved.cars[c.state.id].state.health,0);}finally{saved.dispose()}
 }finally{sim.dispose()}
});
test('server ends at elimination or time and a wrecked high scorer outranks a survivor',()=>{
 for(const ending of ['elimination','time']){
  const sim=new Simulation(R,'derby',[],8,[],rules,24);sim.phase='playing';try{
   sim.event!.combat.hit(0,1,100,0,1);sim.cars[0].state.health=0;
   if(ending==='elimination')sim.cars.slice(2).forEach(c=>c.state.health=0);else sim.elapsed=59.999;
   sim.step(new Set(Array.from({length:8},(_,i)=>i)));assert.equal(sim.phase,'result');assert.equal(sim.ranking()[0],0);
  }finally{sim.dispose()}
 }
});
test('snapshots need explicit support and valid score state; old event variants remain valid',()=>{
 const room=new Room('TESTBB',R),host=peer();try{room.connect(host,hello());start(room,host);const snap=room.snapshot(true);assert.ok(validOnlineSnapshot(snap));
  const missing={...snap};delete missing.noRespawnDerbySupport;assert.equal(validOnlineSnapshot(missing),false);
  for(const v of [false,1,'true'])assert.equal(validOnlineSnapshot({...snap,noRespawnDerbySupport:v} as any),false);
  const bad=structuredClone(snap);bad.event!.combat![0].damage=Infinity;assert.equal(validOnlineSnapshot(bad),false);
  for(const derby of ['survival','score'] as const){const e=new OnlineEvent('derby',{...rules,derby},1);assert.equal(e.respawns,derby==='score');assert.ok(validOnlineEventState(e.snapshot(8),'derby',8));}
 }finally{room.sim.dispose()}
});
test('old servers disable the option and client refuses to silently strip new rules',()=>{
 assert.match(onlineEventControls(rules,false),/value="score-no-respawn" selected disabled/);assert.match(onlineEventControls(rules,true),/value="score-no-respawn" selected >/);
 const net=new QuarryNetwork(),sent:unknown[]=[],errors:unknown[]=[];(net as any).send=(m:unknown)=>sent.push(m);net.addEventListener('error',(e:any)=>errors.push(e.detail));
 net.snapshot={eventSupport:true} as Snapshot;net.start('derby',1,rules);assert.equal(sent.length,0);assert.equal(errors.length,1);
 net.snapshot={eventSupport:true,noRespawnDerbySupport:true} as Snapshot;net.start('derby',1,rules);assert.equal(sent.length,1);assert.equal((sent[0] as any).rules.derby,'score-no-respawn');
});
