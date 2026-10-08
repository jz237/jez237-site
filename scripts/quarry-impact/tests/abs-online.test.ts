import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {Room} from '../multiplayer/room';import {parseClientMessage,releaseControls,NEUTRAL} from '../multiplayer/protocol';
import {validOnlineSnapshot} from '../src/network-validation';import {QuarryNetwork} from '../src/network';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
await R.init();
test('ABS is capability-gated and survives authority wire, restore and expired inputs',()=>{
 let now=1000;const room=new Room('ASST12',R,()=>now),messages:any[]=[],peer={send:(v:any)=>messages.push(v),close(){}};
 try{room.connect(peer,JSON.stringify({type:'hello',protocol:1,name:'Driver',kind:'coupe'}));assert.equal(messages.find(m=>m.type==='welcome').snapshot.absSupport,true);
  room.sim.phase='playing';const controls={...NEUTRAL,brake:0,throttle:1,assists:{traction:1 as const,stability:.5 as const,abs:1 as const}};
  const message=parseClientMessage(JSON.stringify({type:'input',seq:1,controls}));assert.ok(message?.type==='input');room.receive(0,peer,JSON.stringify(message));room.step();assert.deepEqual(room.sim.cars[0].state.input.assists,controls.assists);
  const wire:any=decodeSnapshotWire(encodeSnapshotWire(room.snapshot(true)));assert.ok(validOnlineSnapshot(wire));assert.deepEqual(wire.cars[0].input.assists,controls.assists);
  const cold=new Room('COLD12',R,()=>now);try{cold.sim.restore(wire);assert.deepEqual(cold.sim.cars[0].state.input.assists,controls.assists);assert.equal(cold.sim.cars[0].state.input.throttle,0);}finally{cold.sim.dispose();}
  now+=400;room.step();assert.deepEqual(room.sim.cars[0].state.input.assists,controls.assists);assert.equal(room.sim.cars[0].state.input.throttle,0);assert.equal(room.sim.cars[0].state.input.brake,1);
  const neutral=releaseControls(controls);assert.deepEqual(neutral.assists,controls.assists);assert.notEqual(neutral.assists,controls.assists);
  for(const assists of [{traction:2,stability:1},{traction:1,stability:'1'},null]){assert.equal(parseClientMessage(JSON.stringify({type:'input',seq:2,controls:{...controls,assists}})),null);const bad=structuredClone(wire);bad.cars[0].input.assists=assists;assert.equal(validOnlineSnapshot(bad),false);}
  const bad=structuredClone(wire);bad.absSupport='true';assert.equal(validOnlineSnapshot(bad),false);
  const network=new QuarryNetwork();network.snapshot=wire;network.setInput(controls);assert.deepEqual((network as any).controls.assists,controls.assists);delete network.snapshot!.absSupport;network.setInput(controls);assert.deepEqual((network as any).controls.assists,{traction:1,stability:.5});assert.equal(controls.assists.abs,1);delete network.snapshot!.assistsSupport;network.setInput(controls);assert.equal((network as any).controls.assists,undefined);
 }finally{room.sim.dispose();}
});
