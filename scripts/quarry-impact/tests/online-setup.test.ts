import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {Room,type Peer} from '../multiplayer/room';
import {Simulation} from '../multiplayer/simulation';
import {parseClientMessage,type ServerMessage,type Snapshot} from '../multiplayer/protocol';
import {stockOnlineSetup,copyOnlineSetup,validOnlineSetup} from '../src/online-setup';
import {vehicleSpecification} from '../src/vehicle-physics';
import {validOnlineSnapshot} from '../src/network-validation';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
import {verifyOnlineSetupRevision} from './online-setup-invariants';
await R.init();
const custom=()=>({...stockOnlineSetup('coupe'),paint:0x36aa88,trim:0xcccccc,engine:3,tires:2,armor:3,tune:{gearing:.65,suspension:-.4,steering:.3,brakeBias:-.5,differential:.7}});
const peer=()=>{const messages:ServerMessage[]=[],closed:number[]=[];return{messages,closed,send:(m:ServerMessage)=>messages.push(m),close:(code:number)=>closed.push(code)} satisfies Peer;};
const hello=(setup=custom(),token?:string)=>JSON.stringify({type:'hello',protocol:1,name:'TUNER',kind:'coupe',setup,token,maxPlayers:24});
const send=(r:Room,p:ReturnType<typeof peer>,m:unknown,id=0)=>r.receive(id,p,JSON.stringify(m));

test('strict bounded setup protocol rejects impossible values and discards derived coefficients',()=>{
 const s=custom();assert.ok(validOnlineSetup(s));const parsed=parseClientMessage(JSON.stringify({type:'setup',kind:'hatch',setup:{...s,mass:1,force:1e30,livery:[{arbitrary:true}],tune:{...s.tune,extra:999}}}));assert.deepEqual(parsed,{type:'setup',kind:'hatch',setup:s});
 for(const [key,value]of [['engine',4],['armor',-1],['tires',.5],['paint',0x1000000],['trim','blue'],['tune',[]]]as const){const bad={...s,[key]:value};assert.equal(validOnlineSetup(bad),false);assert.equal(parseClientMessage(hello(bad as any)),null);}
 for(const value of [Infinity,NaN,2,-1.01,'1',null]){const bad={...s,tune:{...s.tune,gearing:value}};assert.equal(validOnlineSetup(bad),false);assert.equal(parseClientMessage(JSON.stringify({type:'setup',kind:'coupe',setup:bad})),null);}
 assert.equal(parseClientMessage(JSON.stringify({type:'setup-rule',rule:'boost'})),null);
 assert.ok(Buffer.byteLength(hello({...s,tune:Object.fromEntries(Object.keys(s.tune).map(k=>[k,-.9999999999999999])) as any},'a'.repeat(64)))<1024);
});

test('loadouts affect authoritative physics only at event boundaries; stock rules and host migration preserve choices',()=>{
 let now=1000;const room=new Room('ABCDEF',R,()=>now),host=peer(),guest=peer();try{
 room.connect(host,hello());room.connect(guest,hello());assert.deepEqual(room.sessions.get(0)!.member.loadout!.setup,custom());assert.equal(room.sim.cars[0].specification.force,vehicleSpecification('coupe').force);
 send(room,guest,{type:'setup-rule',rule:'stock'},1);assert.equal(room.setupRule,'open');assert.equal(guest.messages.at(-1)!.type,'error');
 send(room,host,{type:'start',mode:'derby',rounds:3});assert.deepEqual(room.sim.cars[0].specification,vehicleSpecification('coupe',custom()));assert.ok(Math.abs(room.sim.cars[0].body.mass()-vehicleSpecification('coupe',custom()).mass)<.01);
 const active=structuredClone(room.sim.cars[0].state.setup);send(room,host,{type:'setup',kind:'sedan',setup:stockOnlineSetup('sedan')});send(room,host,{type:'setup-rule',rule:'stock'});assert.deepEqual(room.sim.cars[0].state.setup,active);assert.equal(room.setupRule,'open');
 room.sim.phase='result';now+=500;send(room,host,{type:'setup-rule',rule:'stock'});now+=500;send(room,guest,{type:'setup',kind:'hatch',setup:custom()},1);send(room,host,{type:'next'});assert.equal(room.sim.cars[1].state.kind,'hatch');assert.deepEqual(room.sim.cars[1].specification,vehicleSpecification('hatch'));assert.equal(room.sim.cars[1].state.setup!.paint,custom().paint);assert.equal(room.sessions.get(1)!.member.loadout!.setup.engine,3);
 room.disconnect(0,host);assert.equal(room.sessions.get(1)!.member.host,true);room.sim.phase='result';now+=500;send(room,guest,{type:'setup-rule',rule:'open'},1);send(room,guest,{type:'next'},1);assert.deepEqual(room.sim.cars[1].specification,vehicleSpecification('hatch',custom()));assert.ok(validOnlineSnapshot(room.snapshot()));
 }finally{room.dispose();}
});

test('mid-event takeover preserves active build and damage; reconnect, storage and next event retain selected build',()=>{
 const room=new Room('ABCDEF',R),p=peer();try{
 room.connect(p,hello());send(room,p,{type:'start',mode:'playground'});room.sim.phase='playing';room.sim.cars[1].state.health=61;const before=copyOnlineSetup(room.sim.cars[1].state.setup!);
 const joiner=peer();assert.equal(room.connect(joiner,hello()),1);assert.equal(room.sim.cars[1].state.health,61);assert.deepEqual(room.sim.cars[1].state.setup,before);
 const token=(joiner.messages.find(m=>m.type==='welcome')as any).token,saved=room.save(),restored=new Room('ABCDEF',R);
 try{restored.restore(saved);assert.deepEqual(restored.sim.cars[0].specification,room.sim.cars[0].specification);const next=peer();restored.connect(next,hello(stockOnlineSetup('coupe'),token));assert.equal(restored.sim.cars[1].state.health,61);assert.deepEqual(restored.sessions.get(1)!.member.loadout!.setup,custom());restored.sim.phase='result';send(restored,next,{type:'start',mode:'playground'},1);assert.deepEqual(restored.sim.cars[1].state.setup,custom());}finally{restored.dispose();}
 const standalone=new Simulation(R,'playground',[],24);try{standalone.restore(saved.snapshot);assert.deepEqual(standalone.cars[0].specification,room.sim.cars[0].specification);assert.ok(Math.abs(standalone.cars[0].body.mass()-room.sim.cars[0].body.mass())<.001);}finally{standalone.dispose();}
 }finally{room.dispose();}
});

test('legacy saves remain stock, new snapshots survive binary transport, and invalid replicated setups are rejected',()=>{
 const room=new Room('ABCDEF',R);try{const p=peer();room.connect(p,hello());send(room,p,{type:'start',mode:'race'});const s=room.snapshot();assert.deepEqual(JSON.parse(JSON.stringify(decodeSnapshotWire(encodeSnapshotWire(s)))),JSON.parse(JSON.stringify(s)));assert.ok(validOnlineSnapshot(s));
 for(const mutate of [(v:Snapshot)=>{v.cars[0].setup!.engine=99;},(v:Snapshot)=>{v.members[0].loadout!.setup.tune.suspension=NaN;},(v:Snapshot)=>{v.setupRule='cheat' as any;}]){const bad=structuredClone(s);mutate(bad);assert.equal(validOnlineSnapshot(bad),false);}
 const old=room.save();delete old.setupRule;delete old.snapshot.setupRule;delete old.snapshot.setupSupport;old.snapshot.cars.forEach(c=>delete c.setup);old.sessions.forEach(s=>delete s.member.loadout);const restored=new Room('ABCDEF',R);try{restored.restore(old);assert.deepEqual(restored.sim.cars[0].specification,vehicleSpecification('coupe'));assert.equal(restored.setupRule,'open');}finally{restored.dispose();}
 }finally{room.dispose();}
});
test('online setup changes retain exact preceding source bytes',verifyOnlineSetupRevision);
