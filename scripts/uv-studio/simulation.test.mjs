import assert from 'node:assert/strict';
import {defaults,physics,createSimulation,serviceWipe} from '../../demos/uv-studio/simulation.js';
import {createPerformanceGovernor} from '../../demos/uv-studio/performance.js';
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

function journey(settings){const s=createSimulation();s.startParcel();for(let i=0;i<6000&&!s.snapshot(settings).parcel.complete;i++)s.step(.01,settings);return s.snapshot(settings).parcel;}
const reference=journey({...defaults}),quick=journey({...defaults,flow:100}),gentle=journey({...defaults,flow:25});
assert(reference.complete);assert(Math.abs(reference.exposure-1)<1e-8);assert(quick.contact<reference.contact&&quick.exposure<reference.exposure);assert(gentle.contact>reference.contact&&gentle.exposure>reference.exposure);
assert.equal(journey({...defaults,lamp:false}).exposure,0);
const tracer=createSimulation();tracer.startParcel();for(let i=0;i<50;i++)tracer.step(.1,{...defaults});const start=tracer.snapshot(defaults).parcel;
for(let i=0;i<50;i++)tracer.step(.1,{...defaults,pump:false});assert.equal(tracer.snapshot(defaults).parcel.progress,start.progress);assert.equal(tracer.snapshot(defaults).parcel.exposure,start.exposure);assert(tracer.snapshot(defaults).parcel.contact>start.contact);
for(let i=0;i<10;i++)tracer.step(.1,{...defaults,lamp:false});const dark=tracer.snapshot(defaults).parcel;assert(dark.progress>start.progress);assert.equal(dark.exposure,start.exposure);
tracer.startService();assert(!tracer.snapshot(defaults).parcel.active);tracer.reset();assert.equal(tracer.snapshot(defaults).parcel.contact,0);
assert.equal(serviceWipe(13/24).coverage,0);assert.equal(serviceWipe(16/24).coverage,1);assert(serviceWipe(14/24).front<serviceWipe(15/24).front);assert(serviceWipe(14/24).active);assert(!serviceWipe(17/24).active);
const governor=createPerformanceGovernor();let changes=[];for(let i=0;i<360;i++){const change=governor.sample(.08);if(change)changes.push(change);}assert.deepEqual(changes,['light']);
for(let i=0;i<200;i++){const change=governor.sample(.14);if(change)changes.push(change);}assert.deepEqual(changes,['light','diagram']);
governor.choose('high');for(let i=0;i<300;i++)assert.equal(governor.sample(.2),null);assert.equal(governor.snapshot().tier,'high');
const fastGovernor=createPerformanceGovernor();for(let i=0;i<1200;i++)assert.equal(fastGovernor.sample(1/60),null);assert.equal(fastGovernor.snapshot().tier,'balanced');
console.log('Parcel integration, stopped-flow hold, lamp-off transport, spatial wipe and adaptive performance passed.');
