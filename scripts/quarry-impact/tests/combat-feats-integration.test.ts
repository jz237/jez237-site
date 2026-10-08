import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {Simulation} from '../multiplayer/simulation';
import {DEFAULT_ONLINE_EVENT} from '../src/online-events';
import {landscapeHeight} from '../src/quarry-layout';
import {validOnlineSnapshot} from '../src/network-validation';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
import type {Snapshot} from '../multiplayer/protocol';
await R.init();
const humans=new Set(Array.from({length:24},(_,i)=>i));
const snapshot=(s:Simulation):Snapshot=>({...s.snapshot(true),members:[],ack:{},eventSupport:true});
test('real authoritative moving impacts pay tiers, preserve actual damage and survive binary transport plus cold restore',()=>{
 const rules={...DEFAULT_ONLINE_EVENT,derby:'score' as const,duration:60},s=new Simulation(R,'derby',[],24,[],rules,4),cold=new Simulation(R,'derby',[],24,[],rules,4);
 try{s.phase='playing';s.cars.slice(2).forEach(c=>c.body.setEnabled(false));
  for(const id of [0,1]){const c=s.cars[id],p={x:id*.65,y:landscapeHeight(id*.65,(id?1:-1)*4)+.9,z:(id?1:-1)*4},q={x:0,y:id?1:0,z:0,w:id?0:1},v={x:0,y:0,z:id?-22:22};c.body.setTranslation(p,true);c.body.setRotation(q,true);c.body.setLinvel(v,true);Object.assign(c.state,{p,q,v});s.setInput(id,{throttle:0,steer:0,brake:0,handbrake:false});}
  for(let i=0;i<100;i++)s.step(humans);
  assert.ok(s.event!.combat.get(0).bonus!>0);assert.ok(s.event!.combat.get(1).bonus!>0);
  for(const id of [0,1])assert.ok(Math.abs(s.event!.combat.get(id).damage-s.cars[id].state.inflicted)<1e-6);
  const state=snapshot(s);assert.ok(validOnlineSnapshot(state));const wire=decodeSnapshotWire(encodeSnapshotWire(state)) as Snapshot;assert.deepEqual(wire.event,state.event);assert.equal(JSON.stringify(wire),JSON.stringify(state));cold.restore(wire);assert.deepEqual(cold.event!.snapshot(24),s.event!.snapshot(24));assert.deepEqual(cold.ranking(),s.ranking());
  s.elapsed=59.999;s.step(humans);assert.equal(s.phase,'result');assert.ok(validOnlineSnapshot(snapshot(s)));assert.deepEqual(s.ranking(),s.event!.combat.order(s.cars.map(c=>c.state)).map(c=>c.id));
 }finally{s.dispose();cold.dispose();}
});
