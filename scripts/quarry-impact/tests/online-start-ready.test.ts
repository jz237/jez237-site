import test from 'node:test';import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';import {Room,type Peer} from '../multiplayer/room';import {parseClientMessage} from '../multiplayer/protocol';import {validOnlineSnapshot} from '../src/network-validation';import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
await R.init();
function peer(){const messages:any[]=[],closed:number[]=[];return {messages,closed,p:{send(m){messages.push(m);},close(c){closed.push(c);}}as Peer};}
const hello=(ready=true,extra={})=>JSON.stringify({type:'hello',protocol:1,name:'DRIVER',kind:'coupe',...(ready?{startReady:1}:{}),...extra});
const start=(room:Room,p:Peer)=>room.receive(0,p,JSON.stringify({type:'start',mode:'race',rounds:3}));
const ack=(room:Room,p:Peer,id:number,round:string)=>room.receive(id,p,JSON.stringify({type:'start-ready',round}));
test('negotiated rooms hold physics and the full countdown until all initial players load',()=>{
 const room=new Room('ABCDEF',R),host=peer(),guest=peer();try{
 room.connect(host.p,hello());room.connect(guest.p,hello());start(room,host.p);
 const initial=room.sim.snapshot(true),wait=room.snapshot().startReadiness!;assert.deepEqual(wait.pending,[0,1]);assert.ok(validOnlineSnapshot(room.snapshot()));
 for(let i=0;i<240;i++)room.step();assert.deepEqual(room.sim.snapshot(true),initial);assert.ok(room.snapshot().startReadiness!.remainingMs<27000);
 ack(room,host.p,0,'stale');assert.deepEqual(room.snapshot().startReadiness!.pending,[0,1]);
 ack(room,host.p,0,wait.round);assert.deepEqual(room.snapshot().startReadiness!.pending,[1]);
 ack(room,host.p,0,wait.round);assert.deepEqual(room.snapshot().startReadiness!.pending,[1]);
 const late=peer();assert.equal(room.connect(late.p,hello(false)),null);assert.deepEqual(late.closed,[1008]);
 ack(room,guest.p,1,wait.round);assert.equal(room.snapshot().startReadiness,undefined);assert.equal(room.sim.countdown,3);
 for(let i=0;i<181;i++)room.step();assert.equal(room.sim.phase,'playing');
 room.sim.phase='result';room.snapshot();room.receive(0,host.p,JSON.stringify({type:'next'}));assert.notEqual(room.snapshot().startReadiness!.round,wait.round);ack(room,guest.p,1,wait.round);assert.deepEqual(room.snapshot().startReadiness!.pending,[0,1]);
 }finally{room.dispose();}
});
test('persisted room retains remaining wait and pending acknowledgments across reconnect',()=>{
 const room=new Room('ABCDEF',R),cold=new Room('ABCDEF',R),host=peer(),guest=peer();try{
 room.connect(host.p,hello());room.connect(guest.p,hello());start(room,host.p);const round=room.snapshot().startReadiness!.round;
 ack(room,host.p,0,round);for(let i=0;i<120;i++)room.step();const saved=room.save();cold.restore(saved);
 assert.deepEqual(cold.snapshot().startReadiness,saved.snapshot.startReadiness);assert.ok(cold.save().sessions.every(s=>s.startReady===1));
 const restoredHost=peer(),restoredGuest=peer();cold.connect(restoredHost.p,hello(true,{token:saved.sessions[0].token}));cold.connect(restoredGuest.p,hello(true,{token:saved.sessions[1].token}));
 assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire(cold.snapshot(true))),JSON.parse(JSON.stringify(cold.snapshot(true))));
 ack(cold,restoredGuest.p,1,round);cold.step();assert.equal(cold.sim.tick,1);assert.ok(cold.sim.countdown<3);
 }finally{room.dispose();cold.dispose();}
});
test('timeout and disconnects release loading but legacy rooms retain original countdown',()=>{
 for(const mode of ['timeout','disconnect','legacy']){
 const room=new Room('ABCDEF',R),host=peer(),guest=peer();try{
 room.connect(host.p,hello());room.connect(guest.p,hello(mode!=='legacy'));start(room,host.p);
 if(mode==='legacy'){assert.equal(room.snapshot().startReadiness,undefined);room.step();assert.equal(room.sim.tick,1);continue;}
 if(mode==='disconnect'){ack(room,host.p,0,room.snapshot().startReadiness!.round);room.disconnect(1,guest.p);room.step();}
 else for(let i=0;i<1801;i++)room.step();
 assert.equal(room.snapshot().startReadiness,undefined);assert.equal(room.sim.phase,'countdown');assert.ok(room.sim.countdown>2.9);
 }finally{room.dispose();}}
});
test('malformed acknowledgments and inconsistent readiness snapshots are rejected',()=>{
 for(const round of ['',null,[],3,'a'.repeat(65),'bad token'])assert.equal(parseClientMessage(JSON.stringify({type:'start-ready',round})),null);
 assert.equal(parseClientMessage(hello(true,{startReady:2})),null);
 const room=new Room('ABCDEF',R),p=peer();try{room.connect(p.p,hello());start(room,p.p);const snap=room.snapshot();assert.ok(validOnlineSnapshot(snap));for(const patch of [{phase:'playing'},{tick:1},{elapsed:1},{countdown:2},{startReadySupport:undefined},{startReadiness:{...snap.startReadiness,pending:[8]}}])assert.equal(validOnlineSnapshot({...snap,...patch}as any),false);}finally{room.dispose();}
});
