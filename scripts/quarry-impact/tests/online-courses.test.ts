import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {COURSE_NAMES,type CourseId} from '../src/course-id';import {getRaceCourse,courseGridSlot,courseRoute} from '../src/race-course';import {DEFAULT_ONLINE_EVENT,validOnlineEventRules,copyOnlineEventRules,onlineEventLabel} from '../src/online-events';
import {Simulation} from '../multiplayer/simulation';import {Room,type Peer} from '../multiplayer/room';import {parseClientMessage,type Snapshot,type ServerMessage} from '../multiplayer/protocol';import {validOnlineSnapshot} from '../src/network-validation';import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';import {QuarryNetwork} from '../src/network';
await R.init();
const rules=(course:CourseId)=>({...DEFAULT_ONLINE_EVENT,course,laps:1});
const hello=(courses=true,token?:string)=>JSON.stringify({type:'hello',protocol:1,kind:'coupe',name:'TRACK',maxPlayers:24,eventRules:1,roster:1,...(courses?{courses:1}:{}),token});
function peer(){const messages:ServerMessage[]=[],closed:number[]=[];return{messages,closed,send(m:ServerMessage){messages.push(structuredClone(m));},close(c:number){closed.push(c);}}satisfies Peer;}
test('all 32 circuits have validated online rules, authoritative worlds, grids and restorable snapshots',()=>{
 const ids=Object.keys(COURSE_NAMES)as CourseId[];assert.equal(ids.length,32);
 for(const id of ids){const r=rules(id);assert.ok(validOnlineEventRules(r));const canonical=copyOnlineEventRules(r);assert.equal(canonical.course,id==='quarry-v1'?undefined:id);assert.ok(onlineEventLabel('race',r).includes(COURSE_NAMES[id]));const s=new Simulation(R,'race',[],8,[],r);try{
 assert.equal(s.course.id,id);assert.equal(s.course.checkpoints.length,24);assert.ok(s.world.colliders.len()>16);s.cars.forEach((c,i)=>{const grid=courseGridSlot(getRaceCourse(id),i,'forward');assert.ok(Math.hypot(c.state.p.x-grid.x,c.state.p.z-grid.z)<.001);assert.ok(Math.abs(c.state.p.y-getRaceCourse(id).height(grid.x,grid.z)-.89)<.001);});
 s.phase='playing';for(let i=0;i<5;i++)s.step(new Set());const snap={...s.snapshot(true),eventSupport:true,courseSupport:true,members:[],ack:{}}as Snapshot;assert.ok(validOnlineSnapshot(snap),id);assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire(snap)),snap);
 const copy=new Simulation(R);try{copy.restore(snap);assert.equal(copy.course.id,id);assert.equal(copy.mode,'race');assert.deepEqual(copy.event!.rules,canonical);assert.deepEqual(copy.snapshot(true).cars.map(c=>c.kind),snap.cars.map(c=>c.kind));}finally{copy.dispose();}
 if(id!=='quarry-v1')assert.equal(validOnlineSnapshot({...snap,courseSupport:undefined}),false);
 }finally{s.dispose();}}
 for(const course of ['no-such-course','constructor',null,42])assert.equal(validOnlineEventRules({...rules('quarry-v1'),course}),false);assert.equal(parseClientMessage(hello().replace('"courses":1','"courses":2')),null);
});
test('ordered gates finish a selected course in forward and reverse only after all ordered gates',()=>{
 for(const direction of ['forward','reverse']as const){const s=new Simulation(R,'race',[],8,[],{...rules('ironfield-figure-eight-v1'),direction});s.phase='playing';try{
 const c=s.cars[0],route=courseRoute(s.course,direction);for(let i=0;i<24;i++){const p=route[c.state.nextCheckpoint];c.body.setTranslation({x:p.x,y:s.course.height(p.x,p.z)+.89,z:p.z},true);c.body.setLinvel({x:0,y:0,z:0},true);s.step(new Set([0]));}
 assert.equal(c.state.finished,true);assert.equal(c.state.passed,24);
 }finally{s.dispose();}}
});
test('room gates legacy peers, preserves the course across reconnect and cups, and returns derby to Quarry',()=>{
 const r=new Room('ABCDEF',R),host=peer(),old=peer();try{r.connect(host,hello());r.connect(old,hello(false));r.receive(0,host,JSON.stringify({type:'start',mode:'race',rules:rules('wrenford-mud-v1')}));assert.equal(r.sim.phase,'lobby');r.disconnect(1,old);
 r.receive(0,host,JSON.stringify({type:'start',mode:'race',rounds:3,rules:rules('wrenford-mud-v1')}));assert.equal(r.sim.course.id,'wrenford-mud-v1');assert.equal(r.connect(peer(),hello(false)),null);
 const saved=r.save(),copy=new Room('ABCDEF',R);try{copy.restore(saved);assert.equal(copy.sim.course.id,'wrenford-mud-v1');const p=peer();copy.connect(p,hello(true,saved.sessions[0].token));assert.equal(copy.sessions.get(0)!.courses,1);copy.sim.phase='result';copy.snapshot();copy.receive(0,p,JSON.stringify({type:'next'}));assert.equal(copy.sim.course.id,copy.sim.mode==='race'?'wrenford-mud-v1':'quarry-v1');}finally{copy.dispose();}
 }finally{r.dispose();}
});
test('client refuses a course unsupported by the server instead of stripping the selection',()=>{
 const net=new QuarryNetwork(),sent:unknown[]=[];(net as any).send=(m:unknown)=>sent.push(m);net.snapshot={eventSupport:true}as Snapshot;net.start('race',1,rules('wrenford-mud-v1'));assert.equal(sent.length,0);net.snapshot.courseSupport=true;net.start('race',1,rules('wrenford-mud-v1'));assert.equal((sent[0]as any).rules.course,'wrenford-mud-v1');
});
test('trapped circuit AI recovers only after repeated escapes, with penalty and no gate credit',()=>{
 const s=new Simulation(R,'race',[],8,[],rules('fenwick-oval-v1'));s.phase='playing';s.elapsed=40;
 try{const c=s.cars[0];c.state.passed=3;c.state.nextCheckpoint=4;c.state.speed=0;
 for(let i=0;i<1700;i++)s.ai(c);assert.equal(c.state.penalty,0);
 for(let i=0;i<200;i++)s.ai(c);
 assert.equal(c.state.penalty,5);assert.equal(c.state.passed,3);assert.equal(c.state.nextCheckpoint,4);assert.equal(c.escapeAttempts,0);
 assert.ok(Math.hypot(c.body.translation().x-s.course.checkpoints[3].x,c.body.translation().z-s.course.checkpoints[3].z)<20);
 }finally{s.dispose();}
});
