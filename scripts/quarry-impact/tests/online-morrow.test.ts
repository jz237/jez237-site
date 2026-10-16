import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {Room,type Peer} from '../multiplayer/room';import {parseClientMessage,type ServerMessage} from '../multiplayer/protocol';
import {stockOnlineSetup} from '../src/online-setup';import {onlineCarChoices} from '../src/online-roster';
import {validOnlineSnapshot} from '../src/network-validation';import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
import {QuarryNetwork} from '../src/network';
await R.init();
function peer(){const messages:ServerMessage[]=[],closed:number[]=[];return{messages,closed,send(m:ServerMessage){messages.push(structuredClone(m));},close(c:number){closed.push(c);}}satisfies Peer;}
const hello=(kind='coupe',morrow:number|null=1,token?:string)=>JSON.stringify({type:'hello',protocol:1,name:'TEST',kind,morrow:morrow??undefined,kite:1,roster:1,token,maxPlayers:24,eventRules:1});
const setup=(kind:'morrow'|'coupe')=>JSON.stringify({type:'setup',kind,setup:stockOnlineSetup(kind)});
test('Morrow requires its own negotiated capability and the UI preserves older rosters',()=>{
 assert.ok(parseClientMessage(hello('morrow')));for(const cap of [null,0,2])assert.equal(parseClientMessage(hello('morrow',cap)),null);
 assert.equal(parseClientMessage(hello('morrow').replace(',"roster":1','')),null);
 assert.equal(onlineCarChoices({}).length,3);assert.equal(onlineCarChoices({rosterSupport:true}).length,14);assert.equal(onlineCarChoices({rosterSupport:true,kiteSupport:true,morrowSupport:true}).length,16);
 const net=new QuarryNetwork();const errors:string[]=[];net.addEventListener('error',(e:any)=>errors.push(e.detail));net.setLoadout({kind:'morrow',setup:stockOnlineSetup('morrow')});assert.equal(errors.length,1);
});
test('mixed peers cannot select Morrow; leaving enables it; stale joins and reconnects cannot downgrade it',()=>{
 const room=new Room('ABCDEF',R),host=peer(),old=peer();try{
 assert.equal(room.connect(host,hello()),0);assert.equal(room.connect(old,hello('coupe',null)),1);assert.equal(room.snapshot().morrowSupport,undefined);
 room.receive(0,host,setup('morrow'));assert.equal(room.sessions.get(0)!.member.kind,'coupe');assert.match((host.messages.at(-1)as any).message,/update/);
 assert.equal(room.connect(peer(),hello('morrow')),null);
 room.disconnect(1,old);assert.equal(room.snapshot().morrowSupport,true);room.receive(0,host,setup('morrow'));assert.equal(room.sessions.get(0)!.member.kind,'morrow');
 assert.equal(room.connect(peer(),hello('coupe',null)),null);assert.equal(room.connect(peer(),hello('coupe',null,room.sessions.get(0)!.token)),null);assert.equal(room.sessions.get(0)!.member.connected,true);
 room.receive(0,host,JSON.stringify({type:'start',mode:'race'}));assert.ok(room.sim.cars.some(c=>c.state.kind==='morrow'));assert.equal(room.sim.cars[0].state.kind,'morrow');
 const snap=room.snapshot(true);assert.ok(validOnlineSnapshot(snap));assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire(snap)),snap);assert.equal(validOnlineSnapshot({...snap,morrowSupport:undefined}),false);
 }finally{room.dispose();}
});
test('Morrow physics, persisted car condition and reconnect survive room restoration',()=>{
 const room=new Room('ABCDEF',R),restored=new Room('ABCDEF',R),host=peer();try{
 room.connect(host,hello('morrow'));room.receive(0,host,JSON.stringify({type:'start',mode:'race'}));room.sim.phase='playing';room.sim.cars[0].state.health=68;
 const start=room.sim.cars[0].body.translation();for(let i=0;i<120;i++){room.sim.setInput(0,{throttle:.8,brake:0,steer:0,handbrake:false});room.sim.step(new Set([0]));}
 const end=room.sim.cars[0].body.translation();assert.ok(Math.hypot(end.x-start.x,end.z-start.z)>.5);
 const saved=room.save();assert.equal(saved.sessions[0].morrow,1);restored.restore(saved);assert.equal(restored.sim.cars[0].state.kind,'morrow');assert.equal(restored.sim.cars[0].state.health,room.sim.cars[0].state.health);
 assert.equal(restored.connect(peer(),hello('morrow',1,saved.sessions[0].token)),0);assert.ok(validOnlineSnapshot(restored.snapshot(true)));
 assert.equal(restored.connect(peer(),hello('coupe',null)),null);
 }finally{room.dispose();restored.dispose();}
});
test('older full-roster rooms never generate a Morrow AI',()=>{const room=new Room('ABCDEF',R),host=peer();try{room.connect(host,hello('coupe',null));room.receive(0,host,JSON.stringify({type:'start',mode:'race'}));assert.ok(room.sim.cars.every(c=>c.state.kind!=='morrow'));}finally{room.dispose();}});
test('Morrow capability requires Kite, rejects malformed snapshots and fills the modern AI roster',()=>{
 assert.equal(parseClientMessage(hello('morrow').replace(',"kite":1','')),null);
 assert.equal(onlineCarChoices({rosterSupport:true,kiteSupport:true}).length,15);
 const room=new Room('ABCDEF',R),host=peer();try{
  room.connect(host,hello());room.receive(0,host,JSON.stringify({type:'start',mode:'race'}));
  assert.ok(room.sim.cars.some(c=>c.state.kind==='morrow'));
  const snap=room.snapshot(true);assert.ok(validOnlineSnapshot(snap));
  for(const field of ['morrowSupport','kiteSupport','rosterSupport'])assert.equal(validOnlineSnapshot({...snap,[field]:undefined}),false);
  assert.equal(validOnlineSnapshot({...snap,morrowSupport:1}as any),false);
 }finally{room.dispose();}
});
