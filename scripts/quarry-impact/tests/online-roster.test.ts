import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {ONLINE_CARS,validOnlineCar} from '../src/online-roster';
import {Room,type Peer} from '../multiplayer/room';import {Simulation} from '../multiplayer/simulation';
import {parseClientMessage,type ServerMessage,type Snapshot} from '../multiplayer/protocol';
import {stockOnlineSetup,validOnlineLoadout} from '../src/online-setup';import {validSelectedLivery} from '../src/online-livery';
import {validOnlineSnapshot} from '../src/network-validation';import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
import {QuarryNetwork} from '../src/network';
await R.init();
function peer(){const messages:ServerMessage[]=[],closed:number[]=[];return{messages,closed,send(m:ServerMessage){messages.push(structuredClone(m));},close(c:number){closed.push(c);}}satisfies Peer;}
const hello=(kind='coupe',roster:number|undefined=1,token?:string)=>JSON.stringify({type:'hello',protocol:1,name:'TEST',kind,roster,token,maxPlayers:24,eventRules:1});
test('all fourteen cars validate without accepting arbitrary or prototype names',()=>{
 assert.equal(ONLINE_CARS.length,14);
 for(const kind of ONLINE_CARS){assert.ok(parseClientMessage(hello(kind)));assert.ok(validOnlineLoadout({kind,setup:stockOnlineSetup(kind)}));assert.ok(validSelectedLivery({kind,layers:[]}));for(const type of ['setup','livery'])assert.ok(parseClientMessage(JSON.stringify({type,kind,setup:stockOnlineSetup(kind),layers:[]})));}
 for(const kind of ['constructor','__proto__','toString','unknown',42,null])assert.equal(validOnlineCar(kind),false);
 assert.equal(parseClientMessage(hello('trail',2)),null);assert.equal(parseClientMessage(hello('trail').replace(',"roster":1','')),null);
});
test('mixed-version rooms reject unsupported selections and classic-only rooms still work',()=>{
 const room=new Room('ABCDEF',R),host=peer(),old=peer();try{
 assert.equal(room.connect(host,hello()),0);assert.equal(room.connect(old,hello().replace(',"roster":1','')),1);
 room.receive(0,host,JSON.stringify({type:'setup',kind:'trail',setup:stockOnlineSetup('trail')}));assert.equal(room.sessions.get(0)!.member.loadout!.kind,'coupe');assert.match((host.messages.at(-1)as any).message,/update/);
 const newcomer=peer();assert.equal(room.connect(newcomer,hello('trail')),null);
 room.receive(0,host,JSON.stringify({type:'start',mode:'race'}));assert.equal(room.sim.phase,'countdown');assert.ok(room.sim.cars.every(c=>['coupe','sedan','hatch'].includes(c.state.kind)));
 }finally{room.dispose();}
});
test('all cars physically advance, serialize and restore with authoritative components',()=>{
 const kinds=Array.from({length:24},(_,i)=>ONLINE_CARS[i%14]);const sim=new Simulation(R,'race',kinds,24);try{
 sim.phase='playing';const start=sim.cars.map(c=>c.body.translation());
 for(let t=0;t<120;t++){for(let i=0;i<24;i++)sim.setInput(i,{throttle:.7,brake:0,steer:0,handbrake:false});sim.step(new Set(kinds.map((_,i)=>i)));}
 const snap={...sim.snapshot(true),rosterSupport:true,members:[],ack:{}}as Snapshot;assert.ok(validOnlineSnapshot(snap));assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire(snap)),snap);assert.equal(validOnlineSnapshot({...snap,rosterSupport:undefined}),false);
 sim.cars.forEach((c,i)=>{assert.equal(c.state.kind,kinds[i]);const p=c.body.translation();assert.ok(Math.hypot(p.x-start[i].x,p.z-start[i].z)>1,kinds[i]+' moves');assert.ok(c.state.components);});
 const copy=new Simulation(R,'race',[],24);try{copy.restore(snap);assert.deepEqual(copy.cars.map(c=>c.state.kind),kinds);assert.deepEqual(copy.snapshot(true).cars.map(c=>c.components),snap.cars.map(c=>c.components));}finally{copy.dispose();}
 }finally{sim.dispose();}
});
test('full-roster selection, AI fill, cup continuation and saved capability survive reconnect',()=>{
 const room=new Room('ABCDEF',R),host=peer();try{
 room.connect(host,hello('trail'));room.receive(0,host,JSON.stringify({type:'start',mode:'race',rounds:3}));assert.equal(room.sim.cars[0].state.kind,'trail');assert.equal(new Set(room.sim.cars.map(c=>c.state.kind)).size,14);
 assert.ok(validOnlineSnapshot(room.snapshot(true)));const old=peer();assert.equal(room.connect(old,hello().replace(',"roster":1','')),null);assert.deepEqual(old.closed,[1008]);
 const saved=room.save();assert.equal(saved.sessions[0].roster,1);const copy=new Room('ABCDEF',R);try{copy.restore(saved);const p=peer();assert.equal(copy.connect(p,hello('trail',1,saved.sessions[0].token)),0);assert.equal(copy.sessions.get(0)!.roster,1);copy.sim.phase='result';copy.snapshot();copy.receive(0,p,JSON.stringify({type:'next'}));assert.equal(copy.sim.cars[0].state.kind,'trail');assert.equal(new Set(copy.sim.cars.map(c=>c.state.kind)).size,14);}finally{copy.dispose();}
 }finally{room.dispose();}
});
test('client refuses newer cars on older servers rather than silently losing selection',()=>{
 const net=new QuarryNetwork(),sent:unknown[]=[],errors:unknown[]=[];(net as any).send=(m:unknown)=>sent.push(m);net.addEventListener('error',(e:any)=>errors.push(e.detail));net.snapshot={setupSupport:true}as Snapshot;
 net.setLoadout({kind:'trail',setup:stockOnlineSetup('trail')});assert.equal(sent.length,0);assert.equal(errors.length,1);
 net.snapshot.rosterSupport=true;net.setLoadout({kind:'trail',setup:stockOnlineSetup('trail')});assert.equal(sent.length,1);assert.equal((sent[0]as any).kind,'trail');
});

import {newLayer} from '../src/livery-data';
test('newer cars keep their paint, decals and tuning across stock rules and room restoration',()=>{
 const room=new Room('ABCDEF',R),p=peer(),setup={...stockOnlineSetup('shuttle'),paint:0x123456,engine:3,tires:2,armor:1},layers=[newLayer('number','left'),newLayer('stripe','top')];
 try{room.connect(p,hello('shuttle'));room.receive(0,p,JSON.stringify({type:'setup',kind:'shuttle',setup}));room.receive(0,p,JSON.stringify({type:'livery',kind:'shuttle',layers}));
 room.receive(0,p,JSON.stringify({type:'start',mode:'race'}));assert.deepEqual(room.sim.cars[0].state.setup,setup);assert.deepEqual(room.save().liveries!.cars[0].layers,layers);
 const copy=new Room('ABCDEF',R);try{copy.restore(room.save());assert.deepEqual(copy.sessions.get(0)!.member.loadout,{kind:'shuttle',setup});assert.deepEqual(copy.save().liveries!.cars[0].layers,layers);const q=peer();copy.connect(q,hello('shuttle',1,room.save().sessions[0].token));copy.sim.phase='result';copy.receive(0,q,JSON.stringify({type:'setup-rule',rule:'stock'}));copy.receive(0,q,JSON.stringify({type:'start',mode:'race'}));assert.equal(copy.sim.cars[0].state.setup!.engine,0);assert.equal(copy.sim.cars[0].state.setup!.paint,setup.paint);assert.deepEqual(copy.save().liveries!.cars[0].layers,layers);}finally{copy.dispose();}
 }finally{room.dispose();}
});
