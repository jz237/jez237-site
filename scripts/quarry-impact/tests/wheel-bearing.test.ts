import test from 'node:test';
import assert from 'node:assert/strict';
import {BEARING,bearingCracks,wearBearing,bearingGrowl,bearingShimmy,bearingDrag,bearingWarning} from '../src/damage-handling';
import {synthGrowl} from '../src/damage-rattle';
test('a knocked wheel cracks its bearing on some cars, decided per car and wheel; light knocks never do',()=>{
 const n=Array.from({length:50},(_,id)=>id).filter(id=>bearingCracks(0,.2,id)).length;assert.ok(n>=10&&n<=32,`${n}/50`);
 assert.equal(Array.from({length:50},(_,id)=>id).filter(id=>bearingCracks(1,BEARING.onset-.01,id)).length,0);
 assert.ok(Array.from({length:50},(_,id)=>bearingCracks(0,.3,id)!==bearingCracks(3,.3,id)).some(Boolean));
 assert.equal(bearingCracks(0,NaN,1),false);
});
test('a cracked bearing wears with distance and fails in a lap or so; a sound one never wears',()=>{
 assert.equal(wearBearing(0,5000),0);
 let w:number=BEARING.start,m=0;while(w<1&&m<10000){w=wearBearing(w,10);m+=10;}
 assert.ok(m>500&&m<1500,`seizes after ${m} m`);assert.equal(wearBearing(.5,NaN),.5);
});
test('the growl rises with wear and speed; parked it is silent',()=>{
 assert.equal(bearingGrowl(.8,0),0);assert.ok(bearingGrowl(.8,20)>bearingGrowl(.4,20)&&bearingGrowl(.8,20)>bearingGrowl(.8,5));assert.ok(bearingGrowl(1,99)<=1);
});
test('play brings a wobble and drag; seized, the hub all but locks',()=>{
 assert.equal(bearingShimmy(.5,Math.PI/2),0);assert.ok(bearingShimmy(.9,Math.PI/2)>0&&bearingShimmy(1,Math.PI/2)<=BEARING.shimmy+1e-12);
 assert.equal(bearingDrag(.5),0);assert.ok(bearingDrag(.8)>0&&bearingDrag(.8)<BEARING.drag);assert.equal(bearingDrag(1),BEARING.seize);
});
test('the HUD warns of a growl and of a seizure',()=>{
 assert.equal(bearingWarning([0,.1,0,0]),'');assert.equal(bearingWarning([0,.25,0,0]),'BEARING GROWLING');assert.equal(bearingWarning([1,.5,0,0]),'BEARING SEIZED');
});
test('the growl loop is a second long, finite, audible and unclipped, with no click at the seam',()=>{
 const g=synthGrowl(48000);assert.equal(g.length,48000);let peak=0;for(const v of g){assert.ok(Number.isFinite(v));peak=Math.max(peak,Math.abs(v));}
 assert.ok(peak>.1&&peak<=.5,`peak ${peak}`);assert.ok(Math.abs(g[0])<1e-6&&Math.abs(g[g.length-1])<1e-6);
});
test('the mechanical report names a growling or seized bearing',async()=>{
 const {mechanicalReport}=await import('../src/wreck-report');
 assert.match(mechanicalReport({bearing:'seized'}),/wheel bearing seized/);assert.match(mechanicalReport({bearing:'worn'}),/wheel bearing growling/);
});
