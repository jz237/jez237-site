import assert from 'node:assert/strict';
import {sampleGrain} from '../../demos/sand-studio/grains.js';
const s={h:.998,r:.9,a:1.3,phase:.8,s:.04,speed:.8},a=[],b=[];
for(let t=0;t<150;t+=.017){sampleGrain(s,t,.9,2.1,50,a);sampleGrain(s,t+.00001,.9,2.1,50,b);assert(Math.hypot(a[0],a[2])<=.910001);assert(a[1]>1.13&&a[1]<3.3);assert(Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])<.0001);}
sampleGrain(s,0,0,1.18,50,a);sampleGrain(s,0,0,1.18,50,b);assert.deepEqual(a,b);
console.log('PASS: continuous turning trajectories, radial bounds, bed bounds and deterministic positions.');
