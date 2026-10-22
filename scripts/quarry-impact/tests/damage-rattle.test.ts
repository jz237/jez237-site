import test from 'node:test';
import assert from 'node:assert/strict';
import {RATTLE,rattleRate,thumpRate,EventClock,synthClank,synthThump} from '../src/damage-rattle';
test('loose parts rattle more the looser they are, the faster the car and on rough ground; intact cars are silent',()=>{
 assert.equal(rattleRate(0,30),0);assert.equal(rattleRate(RATTLE.onset,30),0);
 assert.ok(rattleRate(.5,20)>rattleRate(.3,20)&&rattleRate(.5,20)>rattleRate(.5,5));
 assert.ok(rattleRate(.5,10,1)>rattleRate(.5,10,0),'gravel shakes them more');
 assert.ok(rattleRate(1,40,1)<=RATTLE.maxRate*1.6+1e-9);
 assert.ok(rattleRate(.6,0)>0,'a hanging part still clanks now and then at a standstill');
 assert.equal(rattleRate(NaN,NaN),0);
});
test('a bent wheel thumps once per revolution; straight wheels and slow cars do not',()=>{
 assert.equal(thumpRate(.1,20,.37),0);assert.equal(thumpRate(.5,1,.37),0);
 assert.ok(Math.abs(thumpRate(.5,10,.37)-10/(2*Math.PI*.37))<1e-9);
});
test('the event clock fires at the requested rate with jitter, and stops when the rate drops to zero',()=>{
 const clock=new EventClock();let n=0;for(let i=0;i<600;i++)n+=clock.step('a',5,1/60);
 assert.ok(n>=45&&n<=55,`about 50 events in 10 s (got ${n})`);
 let gaps:number[]=[],last=0;for(let i=1;i<=1200;i++){if(clock.step('b',4,1/60)){gaps.push(i-last);last=i;}}
 assert.ok(new Set(gaps.slice(2)).size>2,'not a metronome');
 assert.equal(clock.step('a',0,1/60),0);
});
test('synthesized clanks and thumps are short, finite, bounded and decay to silence',()=>{
 for(const data of [...Array.from({length:RATTLE.variants},(_,k)=>synthClank(48000,k)),synthThump(48000)]){
  assert.ok(data.length>4000&&data.length<14000);
  let peak=0;for(const v of data){assert.ok(Number.isFinite(v));peak=Math.max(peak,Math.abs(v));}
  assert.ok(peak>.2&&peak<=1,'audible and unclipped');
  let tail=0;for(let i=data.length-200;i<data.length;i++)tail=Math.max(tail,Math.abs(data[i]));
  assert.ok(tail<.05,'decays');
 }
 assert.notDeepEqual(synthClank(48000,0).slice(0,500),synthClank(48000,1).slice(0,500),'variants differ');
});
test('a crushed front shorts the horn on about a third of the cars; the horn is a loud, bounded two-tone loop',async()=>{
 const {HORN,hornStuck,synthHorn}=await import('../src/damage-rattle');
 const n=Array.from({length:24},(_,i)=>i).filter(i=>hornStuck(.7,i)).length;assert.ok(n>=5&&n<=12,`about a third (${n}/24)`);
 assert.equal(Array.from({length:24},(_,i)=>i).filter(i=>hornStuck(HORN.onset,i)).length,0);
 const h=synthHorn(48000);let peak=0;for(const v of h){assert.ok(Number.isFinite(v));peak=Math.max(peak,Math.abs(v));}assert.ok(h.length===48000&&peak>.2&&peak<=.36);
});
