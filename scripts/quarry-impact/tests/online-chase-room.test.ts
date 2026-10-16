import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {Room,type Peer} from '../multiplayer/room';import {parseClientMessage,type ServerMessage} from '../multiplayer/protocol';
import {DEFAULT_ONLINE_EVENT} from '../src/online-events';import {validOnlineSnapshot} from '../src/network-validation';import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';import {QuarryNetwork} from '../src/network';
await R.init();
const rules={...DEFAULT_ONLINE_EVENT,laps:1,chase:{version:1 as const,runners:[0,1],duration:60}};
function peer(){const messages:ServerMessage[]=[],closed:number[]=[];return{messages,closed,send(m:ServerMessage){messages.push(structuredClone(m));},close(c:number){closed.push(c);}}satisfies Peer;}
const hello=(chase:number|undefined=1,token?:string,capacity=24)=>JSON.stringify({type:'hello',protocol:1,name:'TEST',kind:'coupe',eventRules:1,chase,token,maxPlayers:capacity===24?24:undefined});
const start=(room:Room,p:Peer,r=rules,mode='race',rounds=1)=>room.receive(0,p,JSON.stringify({type:'start',mode,rounds,rules:r}));
test('Chase capability is explicit and malformed negotiation is rejected',()=>{
 assert.equal((parseClientMessage(hello())as any).chase,1);
 for(const cap of [0,2,-1])assert.equal(parseClientMessage(hello(cap)),null);
 assert.equal(parseClientMessage(hello().replace(',"eventRules":1','')),null);
 const net=new QuarryNetwork(),errors:string[]=[];net.addEventListener('error',(e:any)=>errors.push(e.detail));net.start('race',1,rules);assert.match(errors[0],/Chase support/);
});
test('mixed clients block Chase; legacy joins and token reconnects cannot downgrade an active round',()=>{
 const room=new Room('ABCDEF',R),host=peer(),old=peer();try{
 room.connect(host,hello());room.connect(old,hello(undefined).replace(',"chase":1',''));assert.equal(room.snapshot().chaseSupport,undefined);
 start(room,host);assert.equal(room.sim.phase,'lobby');assert.match((host.messages.at(-1)as any).message,/update/);
 room.disconnect(1,old);assert.equal(room.snapshot().chaseSupport,true);start(room,host);assert.equal(room.sim.phase,'countdown');assert.ok(room.sim.event?.chase);
 const legacy=hello().replace(',"chase":1','');assert.equal(room.connect(peer(),legacy),null);assert.equal(room.connect(peer(),legacy.slice(0,-1)+',"token":"'+room.sessions.get(0)!.token+'"}'),null);assert.equal(room.sessions.get(0)!.member.connected,true);
 const snap=room.snapshot(true);assert.ok(validOnlineSnapshot(snap));assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire(snap)),snap);assert.equal(validOnlineSnapshot({...snap,chaseSupport:undefined}),false);const corrupt=structuredClone(snap);corrupt.event!.chase!.results[0].outcome='escaped';assert.equal(validOnlineSnapshot(corrupt),false);assert.equal(validOnlineSnapshot({...snap,phase:'result'}),false);
 }finally{room.dispose();}
});
test('host-only valid single-round Chase starts cannot dispose a room through invalid team slots or mode',()=>{
 const room=new Room('ABCDEF',R),host=peer(),guest=peer();try{room.connect(host,hello(1,undefined,8));room.connect(guest,hello(1,undefined,8));
 room.receive(1,guest,JSON.stringify({type:'start',mode:'race',rules}));assert.equal(room.sim.phase,'lobby');
 start(room,host,{...rules,chase:{...rules.chase,runners:[23]}});assert.equal(room.sim.phase,'lobby');
 start(room,host,rules,'derby');assert.equal(room.sim.phase,'lobby');start(room,host,rules,'race',3);assert.equal(room.sim.phase,'lobby');assert.equal(room.cup,undefined);
 start(room,host);assert.equal(room.sim.phase,'countdown');
 room.sim.phase='result';room.receive(0,host,JSON.stringify({type:'start',mode:'derby'}));assert.equal(room.sim.mode,'derby');assert.equal(room.sim.event?.chase,null);
 }finally{room.dispose();}
});
test('room persistence and reconnect preserve teams, damage, progress and terminal results',()=>{
 for(const terminal of [false,true]){const room=new Room('ABCDEF',R),restored=new Room('ABCDEF',R),host=peer(),guest=peer();try{
 room.connect(host,hello());room.connect(guest,hello());start(room,host);room.sim.phase='playing';room.sim.cars[1].state.health=57;room.sim.cars[1].state.passed=5;
 if(terminal){room.sim.cars[0].state.health=0;room.sim.cars[1].state.health=0;}
 room.step();const saved=room.save();assert.equal(saved.sessions[1].chase,1);restored.restore(saved);
 assert.equal(restored.connect(peer(),hello(1,saved.sessions[1].token)),1);assert.deepEqual(restored.sim.event?.chase?.snapshot(),room.sim.event?.chase?.snapshot());assert.equal(restored.sim.cars[1].state.health,room.sim.cars[1].state.health);assert.equal(restored.sim.cars[1].state.passed,5);
 assert.equal(restored.sim.phase,terminal?'result':'playing');assert.ok(validOnlineSnapshot(restored.snapshot(true)));
 }finally{room.dispose();restored.dispose();}}
});
