import assert from 'node:assert/strict';
import {bubblePosition,foamHeight} from '../../demos/skimmer-studio/refinements.js';
for(const level of [1.1,3.4,4.255,5.825])for(let i=0;i<200;i++){const seed={h:i/200,r:(i%50)/50,a:i*2.4,speed:.12};const p=bubblePosition(seed,7,level);assert(p.every(Number.isFinite));const limit=p[1]<3.25?1.08:p[1]<4.65?1.08-(p[1]-3.25)/1.4*.67:.41;assert(Math.hypot(p[0],p[2])<=limit*.95);}
for(const cup of [0,.5,1])for(let a=0;a<6.3;a+=.1)for(let r=0;r<.85;r+=.02){const y=foamHeight(r,a,{foamTop:5.9,cup,phase:4});assert(y>5.1&&y<6.25);assert(Math.abs(y-foamHeight(r,a,{foamTop:5.9,cup,phase:4.001}))<.005);}
console.log('Bubble containment and continuous foam envelope checks passed.');
