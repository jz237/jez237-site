import test from 'node:test';import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';import {Simulation} from '../multiplayer/simulation';
import {ContactScraping} from '../src/contact-scraping';import {Room} from '../multiplayer/room';
import {validOnlineSnapshot} from '../src/network-validation';import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
await R.init();
test('snapshot levels replace old contact audio and legacy/invalid levels cannot leave a loop playing',()=>{
 const audio=new ContactScraping();audio.receive([{id:0,contactScrape:.6},{id:1,contactScrape:1}]);assert.equal(audio.level(0),.6);
 audio.receive([{id:1,contactScrape:.3}]);assert.equal(audio.level(0),0);assert.equal(audio.level(1),.3);
 audio.receive([{id:1},{id:2,contactScrape:NaN},{id:3,contactScrape:2}]);for(const id of [1,2,3])assert.equal(audio.level(id),0);
 const room=new Room('ABCDEF',R);try{const snap=room.snapshot(true);snap.cars[0].contactScrape=.7;assert.ok(validOnlineSnapshot(snap));assert.deepEqual(JSON.parse(JSON.stringify(decodeSnapshotWire(encodeSnapshotWire(snap)))),JSON.parse(JSON.stringify(snap)));
 for(const n of [-1,1.1,NaN,Infinity]){snap.cars[0].contactScrape=n;assert.equal(validOnlineSnapshot(snap),false);}
 delete snap.cars[0].contactScrape;assert.ok(validOnlineSnapshot(snap));
 }finally{room.dispose();}
});
test('server derives sustained scraping from physical wall contact and clears it after separation',()=>{
 const s=new Simulation(R,'playground');try{
  s.course={...s.course,height:()=>0,outside:()=>false,surface:()=>'asphalt'};
  s.world.createCollider(R.ColliderDesc.cuboid(80,.5,150).setTranslation(1000,-.5,1000));
  s.world.createCollider(R.ColliderDesc.cuboid(.5,10,150).setTranslation(1002,1,1000).setFriction(.05));
  const c=s.cars[0];for(const other of s.cars.slice(1)){other.state.health=0;other.body.setTranslation({x:1100+other.state.id*10,y:2,z:1000},true);}
  c.body.setTranslation({x:1000.5,y:1,z:950},true);c.body.setRotation({x:0,y:0,z:0,w:1},true);s.phase='playing';let peak=0;
  for(let i=0;i<120;i++){c.body.applyImpulse({x:80,y:0,z:50},true);c.body.setLinvel({x:1,y:0,z:10},true);s.setInput(0,{throttle:0,brake:0,steer:0,handbrake:false});s.step(new Set([0]));peak=Math.max(peak,c.state.contactScrape??0);}
  assert.ok(peak>.05,`wall contact peak ${peak}`);
  c.body.setTranslation({x:980,y:2,z:950},true);c.body.setLinvel({x:0,y:0,z:0},true);s.step(new Set([0]));assert.equal(c.state.contactScrape,undefined);
 }finally{s.dispose();}
});
test('saved contact levels survive restoration but legacy saves clear previous sound',()=>{
 const room=new Room('ABCDEF',R),restored=new Room('ABCDEF',R);try{
  room.sim.cars[0].state.contactScrape=.45;const saved=room.save();restored.restore(saved);
  assert.equal(restored.snapshot().cars[0].contactScrape,.45);
  delete saved.snapshot.cars[0].contactScrape;restored.restore(saved);assert.equal(restored.snapshot().cars[0].contactScrape,undefined);
  saved.snapshot.cars[0].contactScrape=2;assert.throws(()=>restored.restore(saved),/contact scraping/);
 }finally{room.dispose();restored.dispose();}
});
