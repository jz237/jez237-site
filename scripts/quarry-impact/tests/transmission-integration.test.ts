import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {Simulation} from '../multiplayer/simulation';
import {parseClientMessage,releaseControls,NEUTRAL,STEP,type Snapshot,type Controls} from '../multiplayer/protocol';
import {validOnlineSnapshot} from '../src/network-validation';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
import {stockSetup} from '../src/garage';
import {Room} from '../multiplayer/room';
await R.init();const load=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=load;}
const controls=(mode:'manual'|'clutch'='manual'):Controls=>({...NEUTRAL,brake:0,transmission:{mode,up:false,down:false,clutch:0}});
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
const fx={emit(){},mark(){},detach(){},reset(){}}as any;
const snapshot=(s:Simulation):Snapshot=>({...s.snapshot(true),members:[],ack:{},transmissionSupport:true});
const humans=new Set([0,1,2,3,4,5,6,7]);

test('validated manual network packets, pending shifts and selected gear survive binary transport and a cold restore',()=>{
 const sim=new Simulation(R,'playground'),cold=new Simulation(R,'playground');
 try{sim.phase='playing';sim.cars.slice(1).forEach(c=>c.body.setEnabled(false));const c=sim.cars[0];c.body.setTranslation({x:0,y:10,z:0},true);sim.world.gravity={x:0,y:0,z:0};const input=controls('clutch');input.transmission!.up=true;input.transmission!.clutch=1;
  const parsed=parseClientMessage(JSON.stringify({type:'input',seq:1,controls:input}));assert.ok(parsed?.type==='input');sim.setInput(0,parsed.controls);sim.step(humans);assert.equal(c.state.transmission!.pending,2);
  const saved=snapshot(sim),wire=decodeSnapshotWire(encodeSnapshotWire(saved))as Snapshot;assert.ok(validOnlineSnapshot(wire));assert.deepEqual(wire,JSON.parse(JSON.stringify(saved)));cold.restore(wire);assert.deepEqual(cold.cars[0].state.transmission,c.state.transmission);
  cold.world.gravity={x:0,y:0,z:0};cold.cars.slice(1).forEach(c=>c.body.setEnabled(false));cold.setInput(0,parsed.controls);
  for(let i=0;i<20;i++){sim.step(humans);cold.step(humans);}assert.equal(c.state.gear,2);assert.equal(cold.cars[0].state.gear,2);close(c.state.rpm,cold.cars[0].state.rpm);
  for(const bad of [{mode:'invented'},{up:1},{clutch:2},{clutch:null}])assert.equal(parseClientMessage(JSON.stringify({type:'input',seq:2,controls:{...input,transmission:{...input.transmission,...bad}}})),null);
  for(const patch of [{delay:NaN},{pending:20},{notice:2}]){const invalid=structuredClone(saved);invalid.cars[0].transmission={...invalid.cars[0].transmission!,...patch};assert.equal(validOnlineSnapshot(invalid),false);}
  const neutral=releaseControls(parsed.controls);assert.equal(neutral.throttle,0);assert.equal(neutral.brake,1);assert.equal(neutral.transmission!.up,false);assert.equal(neutral.transmission!.clutch,1);assert.notEqual(neutral.transmission,parsed.controls.transmission);
  assert.ok(cold.recover(0));assert.equal(cold.cars[0].state.transmission,undefined);assert.equal(cold.cars[0].state.gear,1);
 }finally{sim.dispose();cold.dispose();}
});

test('a stopped online input preserves manual selection without continuing throttle or shift commands',()=>{
 let now=1000;const room=new Room('GEAR12',R,()=>now);const messages:any[]=[];const peer={send:(v:any)=>messages.push(v),close(){}};
 try{room.connect(peer,JSON.stringify({type:'hello',protocol:1,name:'Driver',kind:'coupe'}));assert.equal(messages.find(m=>m.type==='welcome').snapshot.transmissionSupport,true);room.sim.phase='playing';room.sim.cars.slice(1).forEach(c=>c.body.setEnabled(false));room.sim.world.gravity={x:0,y:0,z:0};room.sim.cars[0].body.setTranslation({x:0,y:10,z:0},true);
  const input=controls();room.receive(0,peer,JSON.stringify({type:'input',seq:1,controls:input}));room.step();room.sim.cars[0].state.gear=-1;now+=400;room.step();assert.equal(room.sim.cars[0].state.gear,-1);assert.equal(room.sim.cars[0].state.input.throttle,0);assert.equal(room.sim.cars[0].state.input.brake,1);
 }finally{room.sim.dispose();}
});

test('manual neutral, reverse, repair and shifted driving survive compressed replay and backwards seeks',async()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),car=new Vehicle(0,'coupe',0xff0000,scene,world,fx),recorder=new ReplayRecorder({version:1,mode:'playground',reverse:false,cars:[{id:0,kind:'coupe',setup:stockSetup('coupe')}],props:0,created:'2026-10-08T12:00:00Z'});
 let time=0;car.place(0,0,0);car.onVisualEvent=event=>recorder.event(0,time,event);const expected:{gear:number;rpm:number}[]=[];
 const capture=()=>{car.current.copy(car.body.translation());car.currentQ.copy(car.body.rotation());recorder.capture(time,()=>captureReplayFrame([car],[],[0]),true);expected.push({gear:car.gear,rpm:car.rpm});};
 try{
  car.input=controls();car.preStep(STEP);capture();
  for(const gear of [-1,0,3]){time++;car.gear=gear;car.input.throttle=.7;car.preStep(STEP);capture();}
  time++;car.repair();car.preStep(STEP);capture();
  const decoded=await readReplayFile(new File([await replayFile(recorder.document())],'manual.qir')),replay=new ReplayScene(decoded,scene,world,[]);
  try{for(const at of [0,1,2,3,4,2,0,4]){replay.seek(at);assert.equal(replay.cars[0].gear,expected[at].gear);assert.ok(Math.abs(replay.cars[0].rpm-expected[at].rpm)<.001);}}finally{replay.dispose();}
 }finally{car.dispose();world.free();}
});
