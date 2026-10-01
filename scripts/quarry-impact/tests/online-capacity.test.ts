import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {Room,type Peer} from '../multiplayer/room';
import {Simulation} from '../multiplayer/simulation';
import {parseClientMessage,type Snapshot,type ServerMessage} from '../multiplayer/protocol';
import {validOnlineSnapshot} from '../src/network-validation';
import {newCup,beginCupRound,finishCupRound,validCup,cupPoints} from '../multiplayer/cup';
import {cupResultsMarkup} from '../src/cup-ui';
import {verifyOnlineCapacityRevision} from './online-capacity-invariants';
await R.init();
const hello=(i:number,token?:string,modern=true)=>JSON.stringify({type:'hello',protocol:1,kind:'coupe',name:'DRIVER '+i,token,...(modern?{maxPlayers:24}:{})});
const peer=()=>{const messages:ServerMessage[]=[],closed:{code:number;reason:string}[]=[];return{messages,closed,send:(s:ServerMessage)=>messages.push(s),close:(code:number,reason:string)=>closed.push({code,reason})}satisfies Peer&{messages:ServerMessage[];closed:{code:number;reason:string}[]};};
const welcome=(p:ReturnType<typeof peer>)=>{const m=p.messages.find(m=>m.type==='welcome');assert.ok(m?.type==='welcome');return m;};

test('24 distinct humans share authority, reject overflow, reconnect at capacity and retain host migration/cups',()=>{
 let now=1000;const room=new Room('ABCDEF',R,()=>now),peers=Array.from({length:24},peer);
 try{
  peers.forEach((p,i)=>assert.equal(room.connect(p,hello(i)),i));assert.equal(room.activeCount,24);assert.equal(room.sim.cars.length,24);assert.ok(validOnlineSnapshot(room.snapshot()));
  const extra=peer();assert.equal(room.connect(extra,hello(24)),null);assert.equal(extra.closed[0].code,4004);
  const old=peer();assert.equal(room.connect(old,hello(0,undefined,false)),null);assert.match(old.closed[0].reason,/Update/);
  const token=welcome(peers[23]).token,replacement=peer();assert.equal(room.connect(replacement,hello(23,token)),23);assert.equal(peers[23].closed.at(-1)!.code,4001);assert.equal(room.activeCount,24);peers[23]=replacement;
  room.receive(0,peers[0],JSON.stringify({type:'start',mode:'derby',rounds:3}));assert.equal(room.cup!.participants.length,24);assert.ok(validCup(room.cup));
  for(let i=0;i<190;i++)room.step();now+=500;room.receive(23,peers[23],JSON.stringify({type:'input',seq:9,controls:{throttle:.7,steer:.2,brake:0,handbrake:false}}));room.step();assert.equal(room.sim.cars[23].state.input.throttle,.7);
  room.disconnect(0,peers[0]);assert.equal(room.sessions.get(1)!.member.host,true);assert.equal(room.activeCount,23);assert.ok(!new Set([...room.sessions].filter(([,s])=>s.member.connected).map(([id])=>id)).has(0));
  room.sim.elapsed=300;room.step();const result=room.snapshot();assert.equal(result.cup!.completed,1);assert.ok(validOnlineSnapshot(result));assert.equal(result.cup!.entries.find(e=>e.id===room.sessions.get(0)!.cupId)!.lastPoints,0);
  room.receive(23,peers[23],JSON.stringify({type:'vote',mode:'race'}));assert.equal(room.cup!.votes[23],'race');room.receive(1,peers[1],JSON.stringify({type:'next'}));assert.equal(room.sim.mode,'race');assert.equal(room.sim.cars.length,24);assert.ok(validCup(room.cup));
  const restored=new Room('ABCDEF',R,()=>now);try{restored.restore(room.save());assert.equal(restored.sim.capacity,24);assert.ok(validCup(restored.cup));const p=peer();assert.equal(restored.connect(p,hello(23,token)),23);assert.equal(restored.sim.cars.length,24);}finally{restored.dispose();}
 }finally{room.dispose();}
});

test('legacy eight-seat rooms persist without expanding, while malformed capacity and snapshots are rejected',()=>{
 const room=new Room('ABCDEF',R);try{const old=peer();room.connect(old,hello(0,undefined,false));assert.equal(room.sim.capacity,8);room.connect(peer(),hello(1));assert.equal(room.sim.capacity,8);const legacy=room.save();delete legacy.snapshot.capacity;const restored=new Room('ABCDEF',R);try{restored.restore(legacy);assert.equal(restored.sim.capacity,8);assert.ok(validOnlineSnapshot(restored.snapshot()));}finally{restored.dispose();}
 for(const value of [8,25,0,'24',null])assert.equal(parseClientMessage(JSON.stringify({type:'hello',protocol:1,kind:'coupe',name:'TEST',maxPlayers:value})),null);
 const current=new Room('BCDEFG',R);try{current.connect(peer(),hello(0));const s=current.snapshot();assert.ok(validOnlineSnapshot(s));for(const mutate of [(v:Snapshot)=>{v.cars[23].id=0;},(v:Snapshot)=>{delete v.capacity;},(v:Snapshot)=>{v.ranking[23]=24;},(v:Snapshot)=>{v.members.push({id:24,name:'BAD',host:false,connected:true,kind:'coupe'});}]){const bad=structuredClone(s);mutate(bad);assert.equal(validOnlineSnapshot(bad),false);}}finally{current.dispose();}
 }finally{room.dispose();}
});

test('24-car race and derby grids avoid initial overlaps and tail-grid drivers owe the approach checkpoints',()=>{
 for(const mode of ['race','derby','playground']as const){const sim=new Simulation(R,mode,[],24);try{
  sim.world.step();let contacts=0;for(let i=0;i<24;i++)for(let j=i+1;j<24;j++)sim.world.contactPair(sim.cars[i].collider,sim.cars[j].collider,m=>contacts+=m.numContacts());assert.equal(contacts,0,mode+' cars must not start overlapping');
  if(mode==='race'){assert.ok(sim.cars[23].state.passed<0);assert.notEqual(sim.cars[23].state.nextCheckpoint,1);const tail=sim.cars[23];sim.phase='playing';
   // A tail starter crossing checkpoint0 once must still be on lap1.
   tail.state.nextCheckpoint=0;tail.state.passed=-1;const p=CHECKPOINTS[0];tail.body.setTranslation({x:p.x,y:.9,z:p.z},true);tail.body.setLinvel({x:0,y:0,z:0},true);for(const c of sim.cars.slice(0,23))c.body.setEnabled(false);sim.step(new Set(Array.from({length:24},(_,i)=>i)));assert.equal(tail.state.lap,1);assert.equal(tail.state.finished,false);
  }
 }finally{sim.dispose();}}
});
import {CHECKPOINTS} from '../src/rules';

test('all 24 cup places score, the full nine-round turnover is bounded, and high-slot votes survive validation',()=>{
 const cup=newCup(9,'derby');for(let r=0;r<9;r++){beginCupRound(cup,'derby',Array.from({length:24},(_,i)=>({id:`r${r}-${i}`,name:'DRIVER '+i,bot:false})));cup.votes[23]='race';assert.ok(validCup(cup));assert.equal(finishCupRound(cup,Array.from({length:24},(_,i)=>i),new Set(cup.participants)),true);assert.equal(cup.entries.at(-1)!.lastPoints,2);assert.equal(cup.entries.find(e=>e.id===`r${r}-0`)!.lastPoints,25);}
 assert.equal(cup.entries.length,216);assert.ok(validCup(cup));assert.equal(cupPoints(7,8),4);assert.equal(cupPoints(23,24),2);assert.match(cupResultsMarkup(cup,[],23),/twenty-fourth/);const bad=structuredClone(cup);bad.votes[24]='race';assert.equal(validCup(bad),false);
});

test('native peers share one encoded snapshot per broadcast without exposing private seat tokens',()=>{
 const room=new Room('ABCDEF',R);let last='';try{for(let i=0;i<24;i++){const p=peer();room.connect({...p,sendEncoded:s=>{last=s;}},hello(i));}room.broadcast();const payload=JSON.parse(last);assert.equal(payload.cars.length,24);assert.ok(validOnlineSnapshot(payload));for(const s of room.sessions.values())assert.ok(!last.includes(s.token));}finally{room.dispose();}
});
test('capacity changes retain exact prior source bytes',verifyOnlineCapacityRevision);

import {roomStorageEntries,readSavedRoom} from '../multiplayer/room-storage';
test('full 24-car visual histories persist in bounded atomic-batch entries and old room saves remain readable',async()=>{
 const room=new Room('ABCDEF',R);room.connect(peer(),hello(0));
 try{
  const small=room.save(),old=new Map(Object.entries(roomStorageEntries(small)));assert.deepEqual(await readSavedRoom({get:async <T>(key:string)=>old.get(key) as T}),small);
  for(const c of room.sim.cars)c.state.dents=Array.from({length:334},(_,i)=>({id:c.state.id*334+i+1,localPoint:{x:-1.1234567890123457,y:-.12345678901234567,z:2.1234567890123457},localDirection:{x:-.12345678901234567,y:-.12345678901234567,z:-.9123456789012346},damage:.10000000000000002,repair:0}));
  const full=room.save(),entries=roomStorageEntries(full),data=new Map(Object.entries(entries));assert.ok(Object.keys(entries).length>2);for(const value of Object.values(entries))assert.ok(Buffer.byteLength(JSON.stringify(value))<512*1024);
  const storage={get:async <T>(key:string)=>data.get(key) as T};assert.deepEqual(await readSavedRoom(storage),full);data.delete('room-history-0');await assert.rejects(()=>readSavedRoom(storage),/Incomplete/);
 }finally{room.dispose();}
});
