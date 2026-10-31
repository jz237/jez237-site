import assert from 'node:assert/strict';
import {createSimulation,defaults} from '../../demos/sand-studio/simulation.js';
import {stepJourney,addHistory,JOURNEY} from '../../demos/sand-studio/journey.js';
const g={index:0,elapsed:0,done:false};stepJourney(g,0);assert.equal(g.elapsed,0);for(let i=0;i<2700;i++)stepJourney(g,.01);assert(g.done);assert.equal(g.index,3);assert.equal(JOURNEY.length,4);
const h=[];for(let time=0;time<90;time+=.1)addHistory(h,{time,bedHeight:1.18});assert(h.length<=241);assert(h.at(-1).time-h[0].time<=60);assert(h.every(p=>p.height===1));
const sim=createSimulation(),p={...defaults,flow:100,size:30};for(let i=0;i<6000;i++)sim.step(1/60,p);let s=sim.snapshot(p);assert(s.loss>0);assert.equal(s.bedHeight,1.18*(1-s.loss)*s.expansion);const before=s.flowPhase;sim.step(.01,{...p,flow:0});s=sim.snapshot(p);assert(s.flowPhase>=before&&s.flowPhase-before<.03);const loss=s.loss;for(let i=0;i<1800;i++)sim.step(1/60,{...p,pump:false});s=sim.snapshot(p);assert(s.loss>=loss);assert(Math.abs(s.bedHeight-s.settledHeight)<.001);assert(s.settledHeight<1.18);
console.log('PASS: guide completion, bounded history, loss-aware bed volume, continuous flow phase and post-loss settling.');
