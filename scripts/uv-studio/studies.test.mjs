import assert from 'node:assert/strict';
import {createComparison,servicePose,createInvestigation} from '../../demos/uv-studio/studies.js';
import {defaults,createSimulation} from '../../demos/uv-studio/simulation.js';
function completed(kind,step=.01){const c=createComparison();c.reset(kind);for(let i=0;i<3000&&!c.snapshot().lanes.every(l=>l.complete);i++)c.step(step,defaults);return c.snapshot();}
const dirty=completed('sleeve');assert(dirty.lanes.every(l=>l.complete));assert.equal(dirty.lanes[0].contact,dirty.lanes[1].contact);assert(dirty.lanes[0].exposure>dirty.lanes[1].exposure*2);
const lamp=completed('lamp');assert.equal(lamp.lanes[0].contact,lamp.lanes[1].contact);assert(Math.abs(lamp.lanes[1].exposure/lamp.lanes[0].exposure-.35)<1e-10);
const flow=completed('flow');assert(flow.lanes[1].contact<flow.lanes[0].contact);assert(flow.lanes[1].exposure<flow.lanes[0].exposure);assert(Math.abs(flow.lanes[0].exposure-1)<1e-8);
for(const kind of ['sleeve','lamp','flow']){const a=completed(kind,.02),b=completed(kind,.1);for(let i=0;i<2;i++)assert(Math.abs(a.lanes[i].exposure-b.lanes[i].exposure)<1e-9);}
const pair=createComparison();pair.step(.1,defaults);const a=pair.snapshot();pair.step(.1,{...defaults,lamp:false});const b=pair.snapshot();assert(b.lanes[0].progress>a.lanes[0].progress);assert.equal(b.lanes[0].exposure,a.lanes[0].exposure);pair.step(.1,{...defaults,pump:false});assert.equal(pair.snapshot().lanes[0].progress,b.lanes[0].progress);pair.reset('flow');assert.equal(pair.snapshot().elapsed,0);assert.equal(pair.snapshot().lanes[0].exposure,0);
// By connector release, the lamp clears the body. Sleeve seating precedes lamp
// alignment, connector seating, axial insertion and the final cap rotation.
assert(servicePose(3/24).capAngle<0);assert(servicePose(9/24).socketX-servicePose(9/24).lampX>.49);assert(servicePose(9/24).lampX>5);
assert(servicePose(14/24).sleeveX>5);assert.equal(servicePose(16.7/24).sleeveX,0);assert(servicePose(16.7/24).lampZ>1);
assert.equal(servicePose(17.1/24).lampZ,0);assert.equal(servicePose(17.5/24).socketX,servicePose(17.5/24).lampX);assert(servicePose(17.5/24).lampX>5);
assert.equal(Math.abs(servicePose(20/24).capAngle),0);assert.equal(servicePose(20/24).capX,0);
for(let i=0;i<=240;i++)for(const v of Object.values(servicePose(i/240)))if(typeof v==='number')assert(Number.isFinite(v));
const sim=createSimulation(),state={...defaults,fouling:80,output:20};sim.seekService(.6);assert(sim.snapshot(state).service);assert(!sim.snapshot(state).lamp);sim.seekService(23.9/24);sim.step(.1,state);sim.step(.01,state);assert(!sim.snapshot(state).service);assert(sim.snapshot(state).lamp);assert.equal(state.fouling,0);
const investigation=createInvestigation();for(const fault of ['sleeve','lamp','pump','flow']){investigation.start();assert(!investigation.diagnose('unknown'));assert.equal(investigation.repair(),null);for(const k of ['flow','sleeve','lamp'])assert(investigation.inspect(k));assert(investigation.diagnose(fault));assert(investigation.repair());investigation.markFixed();assert(investigation.snapshot().fixed);}investigation.clear();assert(!investigation.snapshot().active);
console.log('PASS: integrated comparisons, timestep consistency, power controls, ordered mechanical service, service scrubbing and four evidence-based repairs.');

for(const task of ['lamp','sleeve']){const state={...defaults,fouling:80,output:25,serviceTask:task},sim=createSimulation();sim.seekService(23.9/24);sim.step(.1,state);sim.step(.01,state);assert.equal(state.fouling,task==='lamp'?80:0);assert.equal(state.output,task==='sleeve'?25:100);}
console.log('Targeted challenge service changes only the diagnosed condition.');
