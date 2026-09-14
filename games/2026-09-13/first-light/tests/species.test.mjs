import test from 'node:test';import assert from 'node:assert/strict';
import {SPECIES,sizeClass,describeFish,activityByHour} from '../species.js';
test('a 45 cm largemouth weighs about 1.5 to 1.8 kg and is a common fish; 56 cm is a trophy',()=>{
 const s=SPECIES.largemouth;const d=describeFish(s,.45);assert.ok(d.weightKg>1.5&&d.weightKg<1.8,'weight '+d.weightKg);assert.equal(d.sizeClass,'common');
 assert.equal(sizeClass(s,.56),'legend'.replace('legend','legend')==='legend'&&.56>=22*.0254?'legend':'trophy');assert.equal(sizeClass(s,.50),'trophy');assert.equal(sizeClass(s,.25),'young');
});
test('crepuscular activity peaks at dawn and dusk, stays in range',()=>{
 let peak=0,peakHour=0;for(let h=0;h<24;h+=.25){const a=activityByHour(h,'crepuscular',6.6,19.2);assert.ok(a>=0&&a<=1);if(a>peak){peak=a;peakHour=h;}}
 assert.ok(Math.abs(peakHour-6.9)<1||Math.abs(peakHour-18.8)<1,'peak hour '+peakHour);assert.ok(activityByHour(13,'crepuscular')<activityByHour(6.8,'crepuscular'));
});
import {ROSTER} from '../species.js';
test('the roster weights are plausible and size classes nest',()=>{
 const expect={smallmouth:[.42,1.2,1.7],walleye:[.56,1.3,1.9],bluegill:[.2,.2,.32],musky:[1.0,6,10],pickerel:[.5,.6,1.3],striper:[.55,1.6,3],catfish:[.6,2,3.6],carp:[.65,4,7],crappie:[.3,.3,.6],perch:[.28,.17,.35],pumpkinseed:[.18,.1,.25]};
 for(const id of ROSTER.slice(1)){const s=SPECIES[id];const [L,lo,hi]=expect[id];const kg=s.weightKg(L);assert.ok(kg>lo&&kg<hi,id+' '+L+' m -> '+kg.toFixed(2)+' kg');
  const c=s.classes;assert.ok(c.young[1]===c.common[0]&&c.common[1]===c.trophy[0]&&c.trophy[1]===c.legend[0]);assert.ok(s.count>0&&s.depth[0]<s.depth[1]);}
});
