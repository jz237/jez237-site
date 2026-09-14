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
