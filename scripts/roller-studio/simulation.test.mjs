import assert from 'node:assert/strict';
import {createSimulation,defaults,rollRadii} from '../../demos/roller-studio/simulation.js';
const run=(s,p,seconds)=>{for(let t=0;t<seconds;t+=.05)s.step(.05,p);return s.snapshot(p);};
let s=createSimulation(),p={...defaults};let a=run(s,p,900);assert(a.cycles>10);assert(a.services>0);assert(a.remaining>0);assert(!a.bypass);assert(a.loading>=0&&a.loading<=1);
s=createSimulation();p={...defaults,jammed:true,flow:90,load:100,autoCare:false};a=run(s,p,90);assert(a.bypass);assert.equal(a.travel,0);assert.equal(a.cycles,0);
p.jammed=false;a=run(s,p,15);assert(a.travel>0);assert(!a.bypass);
s=createSimulation();p={...defaults,sump:100};a=run(s,p,90);assert(a.high);assert.equal(a.travel,0);assert.equal(a.cycles,0);
s=createSimulation();p={...defaults,pump:false};a=run(s,p,30);assert.equal(a.travel,0);assert(Math.abs(a.level-a.outside)<.02);
s=createSimulation();p={...defaults,autoCare:false,flow:100,load:100};s.seed({remaining:.008,loading:.9,level:3.1});a=run(s,p,30);assert.equal(a.remaining,0);assert(a.bypass);assert(!a.servicing);
s.replace();a=run(s,p,4.4);assert(a.remaining===0);a=run(s,p,.2);assert.equal(a.remaining,1);a=run(s,p,4.5);assert.equal(a.services,1);assert(!a.servicing);
s=createSimulation();p={...defaults};s.seed({remaining:.02});a=run(s,p,.1);assert(a.servicing);const before=s.snapshot(p);s.step(0,p);assert.deepEqual(s.snapshot(p),before);a=run(s,p,10);assert.equal(a.services,1);
for(const remaining of [0,.25,.5,.75,1]){let r=rollRadii(remaining);assert(Math.abs(r.clean**2+r.dirty**2-(.68**2+.19**2))<1e-10);}
s=createSimulation();p={...defaults,load:0};a=run(s,p,120);assert.equal(a.loading,.31);assert.equal(a.travel,0);
console.log('PASS: autonomous cycles and service, jam and recovery, high-water inhibit, inflow stop, manual exhaustion and midpoint replacement, zero-time pause, conserved roll area.');
