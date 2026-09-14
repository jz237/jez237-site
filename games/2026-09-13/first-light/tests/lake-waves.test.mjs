import test from 'node:test';import assert from 'node:assert/strict';
import {BANDS,displacedSurface,sampleSwell,windAmplitude} from '../lake-waves.js';
test('bands obey deep-water dispersion and stay below the steepness limit',()=>{for(const b of BANDS){assert.ok(Math.abs(b.w*b.w-9.81*b.k)<1e-9);assert.ok(b.a*b.k<.09);}});
test('a calm dawn is glassy: amplitude under 3 mm at wind 0.1',()=>{
 const amp=windAmplitude(.1);let peak=0;for(let i=0;i<400;i++){const y=sampleSwell(i*1.7,i*.9,i*.13,amp,.7);peak=Math.max(peak,Math.abs(y));}assert.ok(peak<.003,'peak '+peak);
});
test('full wind gives visible chop under 12 cm',()=>{const amp=windAmplitude(1);let peak=0;for(let i=0;i<400;i++)peak=Math.max(peak,Math.abs(sampleSwell(i*1.3,i*2.1,i*.07,amp,2.2)));assert.ok(peak>.03&&peak<.12,'peak '+peak);});
test('the CPU inverse agrees with the forward displacement to a millimetre',()=>{
 const amp=windAmplitude(1);for(let i=0;i<200;i++){const x=(i*37)%300-150,z=(i*91)%300-150,t=i*.31;
  let qx=x,qz=z;for(let j=0;j<4;j++){const d=displacedSurface(qx,qz,t,amp,1.1);qx+=x-d.x;qz+=z-d.z;}
  const d=displacedSurface(qx,qz,t,amp,1.1);assert.ok(Math.hypot(d.x-x,d.z-z)<.001);assert.ok(Math.abs(d.y-sampleSwell(x,z,t,amp,1.1))<.002);}
});
test('sheltered water (fetch 0) is flat',()=>{assert.equal(windAmplitude(1,0),0);assert.equal(sampleSwell(3,4,5,0,0),0);});
