import assert from 'node:assert/strict';
import {createSimulation,BOUNDS,R} from '../../demos/moving-bed-studio/simulation.js';
import {SCENARIOS} from '../../demos/moving-bed-studio/data.js';
const preset=id=>SCENARIOS.find(s=>s.id===id);
function advance(sim,state,seconds){for(let i=0;i<seconds*60;i++)sim.step(1/60,state);}
function validate(sim){
 const s=sim.snapshot();assert(s.finite);
 for(let i=0;i<sim.count;i++){const k=i*3;assert(Math.abs(sim.p[k])<=BOUNDS.x+1e-5);assert(Math.abs(sim.p[k+2])<=BOUNDS.z+1e-5);assert(sim.p[k+1]>=BOUNDS.bottom-1e-5&&sim.p[k+1]<=BOUNDS.top+1e-5);}
 let nearest=Infinity;for(let i=0;i<sim.count;i++)for(let j=i+1;j<sim.count;j++)nearest=Math.min(nearest,Math.hypot(...[0,1,2].map(k=>sim.p[i*3+k]-sim.p[j*3+k])));
 assert(nearest>R*1.5,`Excess overlap ${nearest}`);return {scenario:s,nearest};
}
const a=createSimulation(),b=createSimulation();advance(a,preset('normal'),8);advance(b,preset('normal'),8);assert.deepEqual(a.p,b.p);assert.deepEqual(a.angles,b.angles);validate(a);
const before=a.p.slice();advance(a,preset('normal'),12);assert(Math.abs(a.p[1]-before[1])>.2,'Vertical circulation');assert(Math.abs(a.p[2]-before[2])>.02,'Depth variation');
const results=[];for(const scenario of SCENARIOS){const sim=createSimulation();advance(sim,preset('normal'),3);advance(sim,scenario,12);results.push({id:scenario.id,...validate(sim)});}
const normal=results.find(x=>x.id==='normal').scenario,airOff=results.find(x=>x.id==='air-off').scenario,waterOff=results.find(x=>x.id==='water-off').scenario;
assert(airOff.air<1e-8);assert(airOff.meanSpeed<normal.meanSpeed*.35);assert(waterOff.meanSpeed>normal.meanSpeed*.7);assert(airOff.surfaceFraction>normal.surfaceFraction);
assert.equal(results.find(x=>x.id==='crowded').scenario.count,558);
a.reset();const fresh=createSimulation();assert.deepEqual(a.p,fresh.p);assert.deepEqual(a.angles,fresh.angles);assert.equal(a.snapshot().clock,0);
console.log(JSON.stringify({passed:true,scenarios:results.map(x=>({id:x.id,count:x.scenario.count,meanSpeed:x.scenario.meanSpeed,surfaceFraction:x.scenario.surfaceFraction,minDistance:x.nearest}))},null,2));
