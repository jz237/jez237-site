import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {Simulation} from '../multiplayer/simulation';import {Room,type Peer} from '../multiplayer/room';import {parseClientMessage,NEUTRAL,type ServerMessage} from '../multiplayer/protocol';
import {DEFAULT_ONLINE_EVENT,validOnlineEventRules,copyOnlineEventRules,defaultOnlineEvent,onlineEventLabel} from '../src/online-events';
import {validOnlineSnapshot} from '../src/network-validation';import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';import {circuitRoute,directionForCar} from '../src/event-rules';import {landscapeHeight} from '../src/quarry-layout';
await R.init();const rules={...DEFAULT_ONLINE_EVENT,laps:1,raceDuration:60};const human=new Set(Array.from({length:24},(_,i)=>i));
function peer(){const messages:ServerMessage[]=[],closed:number[]=[];return{messages,closed,send(m:ServerMessage){messages.push(structuredClone(m));},close(code:number){closed.push(code);}}satisfies Peer;}
const hello=(timed=true,token?:string)=>JSON.stringify({type:'hello',protocol:1,name:'TIMER',kind:'coupe',maxPlayers:24,eventRules:1,...(timed?{timedRace:1}:{}),token});
function gate(s:Simulation,id=0){const c=s.cars[id],p=circuitRoute(directionForCar(s.event!.rules.direction,id))[c.state.nextCheckpoint];c.body.setTranslation({x:p.x,y:landscapeHeight(p.x,p.z)+.9,z:p.z},true);c.body.setLinvel({x:0,y:0,z:0},true);c.body.setAngvel({x:0,y:0,z:0},true);s.setInput(id,{...NEUTRAL});s.step(human);}

test('timed rules are bounded, copied, labelled and explicitly negotiated',()=>{
 assert.ok(validOnlineEventRules(rules));assert.equal(defaultOnlineEvent({...DEFAULT_ONLINE_EVENT,raceDuration:60}),false);assert.deepEqual(copyOnlineEventRules(rules),rules);assert.match(onlineEventLabel('race',rules),/Timed circuit.*finish current lap/);
 for(const patch of [{raceDuration:0},{raceDuration:59},{raceDuration:1201},{raceDuration:60.5},{raceDuration:NaN},{raceDuration:'60'},{race:'random'},{extra:1}])assert.equal(validOnlineEventRules({...rules,...patch}),false);
 assert.equal(parseClientMessage(hello())?.type,'hello');assert.equal(parseClientMessage(hello().replace('"timedRace":1','"timedRace":2')),null);assert.equal(parseClientMessage(hello().replace('"eventRules":1,','')),null);
});
test('timed authority completes a whole gate-validated lap after expiry in every direction',()=>{
 for(const direction of ['forward','reverse','opposing']as const){const s=new Simulation(R,'race',[],24,[],{...rules,direction});s.phase='playing';try{
 const id=direction==='opposing'?1:0,c=s.cars[id];for(let i=0;i<24;i++)gate(s,id);assert.equal(c.state.passed,24);assert.equal(c.state.finished,false,'configured lap count cannot end a timed race');
 s.elapsed=60;for(let i=0;i<23;i++)gate(s,id);assert.equal(c.state.finished,false,'expiry itself and intermediate gates cannot finish');c.state.penalty=5;gate(s,id);assert.equal(c.state.passed,48);assert.equal(c.state.finished,true);assert.equal(c.state.finishTime,s.elapsed+5);
 assert.equal(s.recover(id),false,'classified drivers cannot recover');const passed=c.state.passed;gate(s,id);assert.equal(c.state.passed,passed,'finished cars circulate without adding laps');
 const snap={...s.snapshot(true),eventSupport:true as const,timedRaceSupport:true as const,members:[],ack:{}};assert.ok(validOnlineSnapshot(snap));assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire(snap)),snap);assert.equal(validOnlineSnapshot({...snap,timedRaceSupport:undefined}),false);
 const restored=new Simulation(R,'race',[],24);try{restored.restore(snap);assert.deepEqual(restored.event!.rules,s.event!.rules);assert.equal(restored.cars[id].state.finishTime,c.state.finishTime);assert.equal(restored.elapsed,s.elapsed);}finally{restored.dispose();}
 }finally{s.dispose();}}
});
test('timed ranking prioritizes completed laps then penalties, with honest grace-period DNFs',()=>{
 const s=new Simulation(R,'race',[],8,[],rules);s.phase='playing';try{
 Object.assign(s.cars[0].state,{finished:true,passed:48,finishTime:75});Object.assign(s.cars[1].state,{finished:true,passed:24,finishTime:61});Object.assign(s.cars[2].state,{finished:true,passed:48,finishTime:72});Object.assign(s.cars[3].state,{finished:false,passed:70,health:0});
 assert.deepEqual(s.ranking().slice(0,3),[2,0,1]);s.elapsed=179.9;s.step(human);assert.equal(s.phase,'playing');s.elapsed=180;s.step(human);assert.equal(s.phase,'result');assert.equal(s.cars[4].state.finished,false);assert.equal(s.cars[4].state.finishTime,0);
 }finally{s.dispose();}
});
test('rooms reject legacy starts and joins, preserve timed capability on reconnect and carry rules across cups',()=>{
 const r=new Room('ABCDEF',R),host=peer(),legacy=peer();try{
 assert.equal(r.connect(host,hello()),0);assert.equal(r.connect(legacy,hello(false)),1);
 r.receive(0,host,JSON.stringify({type:'start',mode:'race',rounds:3,rules}));assert.equal(r.sim.phase,'lobby');assert.match((host.messages.at(-1)as any).message,/update.*timed races/);
 r.disconnect(1,legacy);r.receive(0,host,JSON.stringify({type:'start',mode:'race',rounds:3,rules}));assert.equal(r.sim.phase,'countdown');assert.equal(r.sim.event!.rules.raceDuration,60);assert.equal(r.snapshot().timedRaceSupport,true);
 const rejected=peer();assert.equal(r.connect(rejected,hello(false)),null);assert.deepEqual(rejected.closed,[1008]);
 const saved=r.save(),token=saved.sessions.find(s=>s.member.id===0)!.token;assert.equal(saved.sessions[0].timedRace,1);
 const restored=new Room('ABCDEF',R);try{restored.restore(saved);const reconnect=peer();assert.equal(restored.connect(reconnect,hello(true,token)),0);assert.equal(restored.sim.event!.rules.raceDuration,60);
 restored.sim.phase='result';restored.snapshot();restored.receive(0,reconnect,JSON.stringify({type:'next'}));assert.equal(restored.sim.phase,'countdown');assert.equal(restored.sim.event!.rules.raceDuration,60);
 }finally{restored.dispose();}
 }finally{r.dispose();}
});

import {QuarryNetwork} from '../src/network';
import {onlineEventControls} from '../src/online-event-ui';
import type {Snapshot} from '../multiplayer/protocol';
test('old servers disable timed selection and the client never silently starts a lap race',()=>{
 assert.match(onlineEventControls(rules,false,false),/value="timed" selected disabled/);
 assert.match(onlineEventControls(rules,false,true),/value="timed" selected >/);
 const net=new QuarryNetwork(),sent:unknown[]=[],errors:unknown[]=[];
 (net as any).send=(m:unknown)=>sent.push(m);net.addEventListener('error',(e:any)=>errors.push(e.detail));
 net.snapshot={eventSupport:true} as Snapshot;net.start('race',1,rules);
 assert.equal(sent.length,0);assert.equal(errors.length,1);
 net.snapshot={eventSupport:true,timedRaceSupport:true} as Snapshot;net.start('race',1,rules);
 assert.equal(sent.length,1);assert.equal((sent[0] as any).rules.raceDuration,60);
});
