import test from 'node:test';
import assert from 'node:assert/strict';
import {ROLL_BAR,rollBarSnaps,rollTorque,rollBarWarning} from '../src/damage-handling';
test('a bashed axle snaps its anti-roll bar on about half the cars; light knocks never do',()=>{
 const n=Array.from({length:40},(_,id)=>id).filter(id=>rollBarSnaps(0,[.3,0,0,0],id)).length;
 assert.ok(n>=14&&n<=30,`about half (${n}/40)`);
 assert.equal(Array.from({length:40},(_,id)=>id).filter(id=>rollBarSnaps(0,[ROLL_BAR.snap-.01,0,0,0],id)).length,0);
 assert.equal(Array.from({length:40},(_,id)=>id).filter(id=>rollBarSnaps(1,[.9,.9,0,0],id)).length,0,'the rear bar only cares about the rear wheels');
 const front=Array.from({length:40},(_,id)=>rollBarSnaps(0,[.3,.3,.3,.3],id)),rear=Array.from({length:40},(_,id)=>rollBarSnaps(1,[.3,.3,.3,.3],id));
 assert.ok(front.some((f,i)=>f!==rear[i]),'front and rear bars are decided separately');
 assert.equal(rollBarSnaps(0,[NaN,NaN,0,0],3),false);
});
test('with a snapped bar the body is pushed to lean out of the turn, more with both bars, never with none',()=>{
 const up={x:0,y:1,z:0},v={x:0,y:0,z:10};
 // ω_y>0 at +z: the turn centre is at +x, so the top should roll toward -x (positive torque about +z).
 const one=rollTorque(1200,up,v,.5,1),two=rollTorque(1200,up,v,.5,2);
 assert.ok(one.z>0&&Math.abs(one.x)<1e-9&&Math.abs(one.y)<1e-9);
 assert.ok(Math.abs(one.z-1200*5*ROLL_BAR.lift)<1e-6,'m·a·h');
 assert.ok(Math.abs(two.z-2*one.z)<1e-6);
 assert.ok(rollTorque(1200,up,v,-.5,1).z<0,'the other way round the other way');
 assert.deepEqual(rollTorque(1200,up,v,.5,0),{x:0,y:0,z:0});
 assert.deepEqual(rollTorque(1200,up,{x:NaN,y:0,z:0},.5,1),{x:0,y:0,z:0});
});
test('the cornering force behind the lean is capped, so a spin cannot fling the car over',()=>{
 const t=rollTorque(1000,{x:0,y:1,z:0},{x:0,y:0,z:30},3,1);
 assert.ok(Math.abs(Math.hypot(t.x,t.y,t.z)-1000*ROLL_BAR.lateral*ROLL_BAR.lift)<1e-6);
});
test('the HUD names a snapped bar',()=>{
 assert.equal(rollBarWarning([1,1]),'');assert.equal(rollBarWarning([1,0]),'ROLL BAR SNAPPED');
});
test('the mechanical report names snapped roll bars',async()=>{
 const {mechanicalReport}=await import('../src/wreck-report');
 assert.match(mechanicalReport({rollBars:1}),/roll bar snapped/);assert.match(mechanicalReport({rollBars:2}),/both roll bars snapped/);
 assert.equal(mechanicalReport({rollBars:0}),'');
});
test('the extra lean fades out as the body tilts, so a missing bar never tips the car by itself',()=>{
 const v={x:0,y:0,z:10},flat=rollTorque(1200,{x:0,y:1,z:0},v,.5,2).z;
 const s=Math.sin(.05),leaning=rollTorque(1200,{x:-s,y:Math.cos(.05),z:0},v,.5,2).z;
 assert.ok(leaning>0&&leaning<flat);
 const t=Math.sin(.2);assert.deepEqual(rollTorque(1200,{x:-t,y:Math.cos(.2),z:0},v,.5,2),{x:0,y:0,z:0});
});
