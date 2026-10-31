import assert from 'node:assert/strict';
import {defaults,physics,createSimulation} from '../../demos/uv-studio/simulation.js';
const normal=physics(defaults),fast=physics({...defaults,flow:100}),slow=physics({...defaults,flow:25});
assert(fast.flow>normal.flow&&fast.exposure<normal.exposure);
assert(slow.flow<normal.flow&&slow.exposure>normal.exposure);
for(const change of [{clarity:20},{fouling:85},{output:20}])assert(physics({...defaults,...change}).exposure<normal.exposure);
for(const change of [{pump:false},{flow:0},{lamp:false},{clarity:0},{output:0}])assert.equal(physics({...defaults,...change}).exposure,0);
assert.equal(physics({...defaults,lamp:false}).flow,normal.flow);
for(let f=0;f<=100;f++)assert(Number.isFinite(physics({...defaults,flow:f}).exposure));
const state={...defaults,fouling:75,output:25},sim=createSimulation();sim.startService();let sawRefill=false;
for(let i=0;i<2399;i++){sim.step(.01,state);const s=sim.snapshot(state);assert(s.service);assert(!s.lamp);if(s.servicePhase<5)assert.equal(s.flow,0);else {assert(s.flow>0);sawRefill=true;}}
sim.step(.02,state);assert(!sim.snapshot(state).service);assert(sim.snapshot(state).lamp);assert.equal(state.fouling,0);assert.equal(state.output,100);assert(sawRefill);assert.equal(sim.snapshot(state).completed,1);
sim.startService();sim.step(.1,state);sim.cancelService();assert(!sim.snapshot(state).service);sim.reset();assert.equal(sim.snapshot(state).time,0);assert.equal(sim.snapshot(state).completed,0);
console.log('UV physics: throughput/contact tradeoff, independent attenuation, zero-flow/zero-output, power isolation, refill-before-UV and service completion passed.');
