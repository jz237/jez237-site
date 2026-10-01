import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {Room,type Peer} from './room';
import {newCup,beginCupRound,finishCupRound,nextCupMode,cupStandings,validCup} from './cup';
import {parseClientMessage,type ServerMessage} from './protocol';
import {validOnlineSnapshot} from '../src/network-validation';
import {cupResultsMarkup} from '../src/cup-ui';
await R.init();
const peer=()=>{const messages:ServerMessage[]=[],closed:number[]=[];return{messages,closed,peer:{send:(m:ServerMessage)=>messages.push(structuredClone(m)),close:(c:number)=>closed.push(c)} as Peer};};
const hello=(name='DRIVER',token?:string)=>JSON.stringify({type:'hello',protocol:1,name,kind:'coupe',token});
const send=(room:Room,id:number,p:ReturnType<typeof peer>,m:unknown)=>room.receive(id,p.peer,JSON.stringify(m));
function finish(room:Room){room.sim.phase='playing';room.sim.elapsed=room.sim.mode==='derby'?300:900;for(const c of room.sim.cars)c.state.health=100-c.state.id*5;room.step();room.broadcast();assert.equal(room.sim.phase,'result');}
const drivers=()=>Array.from({length:8},(_,id)=>({id:'driver-'+id,name:'DRIVER '+id,bot:id>1}));
test('bounded protocol accepts optional cups, rejects hostile counts and never accepts client scoring',()=>{
 assert.deepEqual(parseClientMessage('{"type":"start","mode":"race"}'),{type:'start',mode:'race'});
 for(const rounds of [0,10,2.5,'3',null])assert.equal(parseClientMessage(JSON.stringify({type:'start',mode:'race',rounds})),null);
 assert.equal(parseClientMessage('{"type":"start","mode":"playground","rounds":3}'),null);
 assert.equal(parseClientMessage('{"type":"vote","mode":"playground"}'),null);assert.equal(parseClientMessage('{"type":"cupPoints","points":999}'),null);
 assert.deepEqual(parseClientMessage('{"type":"next"}'),{type:'next'});
});
test('cup points settle once, disconnected entries score zero, ties remain shared and vote ties rotate',()=>{
 const cup=newCup(3,'race');beginCupRound(cup,'race',drivers());const eligible=new Set(drivers().slice(1).map(d=>d.id));
 assert.equal(finishCupRound(cup,[0,1,2,3,4,5,6,7],eligible),true);assert.equal(cup.entries[0].points,0);assert.equal(cup.entries[1].points,18);assert.equal(finishCupRound(cup,[0,1,2,3,4,5,6,7],eligible),false);
 cup.votes={0:'race',1:'derby'};assert.equal(nextCupMode(cup,new Set([0,1])),'derby');assert.equal(nextCupMode(cup,new Set([0])),'race');assert.ok(validCup(cup));
 const bad=structuredClone(cup);bad.participants[1]=bad.participants[0];assert.equal(validCup(bad),false);
 const markup=cupResultsMarkup({...cup,entries:cup.entries.map(e=>({...e,name:'<img onerror=x>',points:0,wins:0}))},[],0);assert.ok(!markup.includes('<img'));assert.match(markup,/&lt;img/);assert.ok(cupStandings(cup)[0].points>=cupStandings(cup)[1].points);
});
test('actual room completes a three-round cup with votes, fresh physics, host enforcement and no double settlement',()=>{
 const room=new Room('ABCDEF',R),host=peer(),guest=peer();room.connect(host.peer,hello('HOST'));room.connect(guest.peer,hello('GUEST'));
 send(room,1,guest,{type:'start',mode:'derby',rounds:3});assert.equal(room.sim.phase,'lobby');send(room,0,host,{type:'start',mode:'derby',rounds:3});assert.equal(room.cup?.round,1);
 send(room,1,guest,{type:'vote',mode:'race'});assert.deepEqual(room.cup?.votes,{});
 finish(room);const totals=room.cup!.entries.map(e=>e.points);for(let n=0;n<3;n++){room.step();room.snapshot();}assert.deepEqual(room.cup!.entries.map(e=>e.points),totals);
 send(room,1,guest,{type:'vote',mode:'race'});send(room,0,host,{type:'vote',mode:'race'});send(room,1,guest,{type:'next'});assert.equal(room.cup?.round,1);send(room,0,host,{type:'start',mode:'derby'});assert.equal(room.cup?.round,1);
 send(room,0,host,{type:'next'});assert.equal(room.sim.mode,'race');assert.equal(room.sim.phase,'countdown');assert.ok(room.sim.cars.every(c=>c.state.health===100));assert.equal(room.cup?.round,2);assert.deepEqual(room.cup?.votes,{});
 finish(room);send(room,0,host,{type:'next'});assert.equal(room.sim.mode,'derby');finish(room);assert.equal(room.cup?.completed,3);assert.ok(validOnlineSnapshot(room.snapshot()));const final=structuredClone(room.cup);send(room,0,host,{type:'next'});assert.deepEqual(room.cup,final);
 send(room,0,host,{type:'start',mode:'playground'});assert.equal(room.cup,undefined);assert.equal(room.sim.mode,'playground');room.dispose();
});
test('disconnect migrates host, removes votes and awards zero without transferring identity to a replacement',()=>{
 let now=1000;const room=new Room('ABCDEF',R,()=>now),host=peer(),guest=peer();room.connect(host.peer,hello('HOST'));room.connect(guest.peer,hello('GUEST'));send(room,0,host,{type:'start',mode:'derby',rounds:3});
 const original=room.cup!.participants[0];room.disconnect(0,host.peer);assert.equal(room.snapshot().members.find(m=>m.id===1)?.host,true);finish(room);assert.equal(room.cup!.entries.find(e=>e.id===original)?.points,0);
 send(room,1,guest,{type:'vote',mode:'race'});room.disconnect(1,guest.peer);assert.deepEqual(room.cup!.votes,{});now+=61000;const replacement=peer();assert.equal(room.connect(replacement.peer,hello('NEWCOMER')),0);send(room,0,replacement,{type:'next'});const next=room.cup!.participants[0];assert.notEqual(next,original);assert.equal(room.cup!.entries.find(e=>e.id===next)?.points,0);assert.ok(room.cup!.entries.some(e=>e.id===original));room.dispose();
});
test('save/restore keeps cup identities, votes and points; token reconnect resumes without exposing token in cup',()=>{
 const room=new Room('ABCDEF',R),host=peer();room.connect(host.peer,hello());const welcome=host.messages.find(m=>m.type==='welcome');assert.ok(welcome?.type==='welcome');send(room,0,host,{type:'start',mode:'race',rounds:3});finish(room);send(room,0,host,{type:'vote',mode:'race'});const saved=room.save();assert.ok(!JSON.stringify(saved.snapshot.cup).includes(welcome.token));
 const restored=new Room('ABCDEF',R);restored.restore(saved);const reconnect=peer();assert.equal(restored.connect(reconnect.peer,hello('RESUMED',welcome.token)),0);assert.deepEqual(restored.cup,room.cup);send(restored,0,reconnect,{type:'next'});assert.equal(restored.sim.mode,'race');assert.equal(restored.cup?.round,2);assert.equal(restored.cup?.participants[0],room.cup?.participants[0]);room.dispose();restored.dispose();
});
test('late arrivals score only from the next round, and older room saves remain usable',()=>{
 const room=new Room('ABCDEF',R),host=peer();room.connect(host.peer,hello());send(room,0,host,{type:'start',mode:'race',rounds:3});const original=room.cup!.participants[1],late=peer();room.connect(late.peer,hello('LATE'));finish(room);assert.equal(room.cup!.participants[1],original);send(room,0,host,{type:'next'});assert.notEqual(room.cup!.participants[1],original);assert.equal(room.cup!.entries.find(e=>e.id===room.cup!.participants[1])?.points,0);
 const old=room.save();delete old.snapshot.cup;delete old.snapshot.cupSupport;for(const s of old.sessions)delete s.cupId;const migrated=new Room('ABCDEF',R);migrated.restore(old);assert.equal(migrated.cup,undefined);assert.ok(validOnlineSnapshot(migrated.snapshot()));migrated.dispose();room.dispose();
});

test('maximum cup remains bounded through full roster turnover and totals stay valid',()=>{
 const cup=newCup(9,'race');
 for(let round=0;round<9;round++){
  const roster=drivers().map(d=>({...d,id:d.id+'-'+round}));beginCupRound(cup,round%2?'derby':'race',roster);finishCupRound(cup,[0,1,2,3,4,5,6,7],new Set(roster.map(d=>d.id)));assert.ok(validCup(cup));
 }
 assert.equal(cup.entries.length,72);assert.equal(cup.completed,9);assert.ok(JSON.stringify(cup).length<16000);assert.throws(()=>beginCupRound(cup,'race',drivers()),/Invalid cup round/);
});
