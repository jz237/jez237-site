import test from 'node:test';
import assert from 'node:assert/strict';
import {FINISHER_CHOREOGRAPHY,directProjectileFinisher,sampleFinisher,spaceFinisherPose,finisherLens} from '../engine/finisher-scripts.mjs';
const beats=s=>{const a=s.impacts[0],b=s.impacts.find(x=>x.sound==='special'&&x.t>a.t)||s.impacts.find(x=>x.sound==='special')||s.impacts.at(-2),c=s.impacts.find(x=>x.final);return [a,{...b,t:Math.min(b.t,a.t+.36)},c]};
test('every finisher has ordered three-beat choreography and no premature reactions',()=>{
 for(const [id,s] of Object.entries(FINISHER_CHOREOGRAPHY)){
  const impacts=beats(s),keys=directProjectileFinisher(s,impacts);
  for(let i=1;i<keys.length;i++)assert.ok(keys[i].t>keys[i-1].t,id+' ordered keys');
  for(const impact of impacts.slice(1)){
   assert.equal(sampleFinisher(keys,impact.t-.001).v,'ext4:5',id+' waits for actual contact');
   assert.notEqual(sampleFinisher(keys,impact.t).v,'ext4:5',id+' reacts on contact');
  }
  for(let t=0;t<=s.duration;t+=1/120){
   const p=spaceFinisherPose(sampleFinisher(keys,t));
   assert.ok(p.vx-p.ax>=170,id+' keeps bodies apart');assert.ok(p.vy>=0&&p.vy<=38.001,id+' bounded height');
   for(const value of [p.ax,p.vx,p.vy,p.vr])assert.ok(Number.isFinite(value));
  }
  assert.equal(sampleFinisher(keys,s.duration).vPlain,'ext4:15');
 }
});
test('lens movement is continuous, restrained and reduced-motion aware for every finisher',()=>{
 for(const s of Object.values(FINISHER_CHOREOGRAPHY))for(const reduced of [false,true]){
  const end=beats(s)[2].t;let prior=finisherLens(0,end,reduced);
  for(let t=0;t<s.duration;t+=1/120){const z=finisherLens(t,end,reduced);assert.ok(z>=1.2&&z<=1.331);assert.ok(Math.abs(z-prior)<.0015,'no zoom jump');if(reduced)assert.ok(z<=1.276);prior=z;}
 }
});
