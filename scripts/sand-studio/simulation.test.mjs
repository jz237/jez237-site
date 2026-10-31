import assert from 'node:assert/strict';
import {createSimulation,defaults} from '../../demos/sand-studio/simulation.js';
function run(sim,p,seconds=30){for(let i=0;i<seconds*60;i++)sim.step(1/60,p);return sim.snapshot(p);}
const sim=createSimulation(),p={...defaults};
let s=run(sim,p);assert.equal(s.regime,'Fluidized');assert(s.expansion>1.5&&s.expansion<2.5);assert.equal(s.loss,0);
s=run(sim,{...p,pump:false});assert.equal(s.regime,'Settled');assert(s.expansion<1.001);assert(s.velocity<.01);
s=run(sim,p);assert.equal(s.regime,'Fluidized');assert(s.expansion>1.5);
const high={...p,flow:100,size:30};s=run(sim,high);assert.equal(s.regime,'Carryover risk');assert(s.loss>0);const loss=s.loss;
s=run(sim,p);assert(s.expansion<2.5);assert(s.loss>=loss);assert(s.loss<.22);sim.reset();assert.equal(sim.snapshot().loss,0);
const fine=createSimulation(),coarse=createSimulation();assert(run(fine,{...p,size:10}).expansion>run(coarse,{...p,size:90}).expansion);
assert.equal(run(sim,{...p,oxygen:0}).activity,0);assert.equal(run(sim,{...p,maturity:0}).activity,0);
s=run(sim,{...p,blocked:true});assert.equal(s.regime,'Packed bed');assert(s.expansion<1.01);
const before=sim.snapshot(p);sim.step(0,p);assert.deepEqual(sim.snapshot(p),before);
console.log('PASS: stable fluidization, settling, restart, carryover retention/reset, size response, oxygen/maturity limits, restricted feed and zero-step pause.');
