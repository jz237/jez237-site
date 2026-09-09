import test from 'node:test';
import assert from 'node:assert/strict';
import {createSmoothSelector,SMOOTH_TRACKS,smoothAttackFrame,smoothVerticalOffset} from '../engine/painted-smooth.mjs';

const fighter=(id='jez',limb='punch')=>({def:{id},grounded:true,x:400,vx:0,facing:1,attackFrame:1,
 attacking:{kind:'light',limb,activeStartFrame:9,activeEndFrame:13,totalFrames:29}});

for(const id of ['jez','benny'])test(`${id}: eight distinct ordered preparation and recovery drawings for each standing normal`,()=>{
 for(const limb of ['punch','kick']){
  const f=fighter(id,limb),select=createSmoothSelector();
  const prep=[],recovery=[];
  for(let n=0;n<8;n++){f.attackFrame=1+n;prep.push(select(f,f,n,true));}
  for(let n=0;n<8;n++){f.attackFrame=13+n*2;recovery.push(select(f,f,20+n,true));}
  assert.deepEqual(prep,SMOOTH_TRACKS[limb+'Prep']);assert.deepEqual(recovery,SMOOTH_TRACKS[limb+'Return']);
  for(const track of [prep,recovery])assert.equal(new Set(track.map(p=>p.bank+':'+p.frame)).size,8);
 }
});

test('cold artwork cannot replace a move after its preparation has started',()=>{
 const f=fighter(),s=createSmoothSelector();assert.equal(s(f,f,1,false),null);
 f.attackFrame=5;assert.equal(s(f,f,5,true),null);
 f.attacking={...f.attacking};assert.ok(s(f,f,6,true));
});

test('standing contact, special moves, hit reactions and non-pilot fighters retain their authored poses',()=>{
 for(const change of [{attackFrame:9},{def:{id:'alan'}},{hitstunFrames:2},{cinematicFrame:0},{down:true}]){
  const f=Object.assign(fighter(),change);assert.equal(createSmoothSelector()(f,f,1,true),null);
 }
 for(const change of [{kind:'special'},{superMove:true},{animation:'uppercut'},{advanceSpeed:80}]){
  const f=fighter();Object.assign(f.attacking,change);assert.equal(createSmoothSelector()(f,f,1,true),null);
 }
});

test('low and air attacks extend once into contact and retract into guard in order',()=>{
 for(const air of [false,true])for(const limb of ['punch','kick']){
  const f=fighter('benny',limb),s=createSmoothSelector();f.grounded=!air;f.crouch=!air;
  const base=(air?8:0)+(limb==='kick'?4:0),out=[];
  for(const frame of [1,5,9,13,21]){f.attackFrame=frame;out.push(s(f,f,frame,true));}
  assert.deepEqual(out,[{bank:'smooth-approach',frame:base},{bank:'smooth-approach',frame:base+1},
   {bank:'smooth-contact',frame:base+1},{bank:'smooth-approach',frame:base+(limb==='kick'?2:1)},{bank:'smooth-approach',frame:base+3}]);
 }
});

test('render interpolation never mutates combat or crosses the contact boundary',()=>{
 const f=fighter(),before=structuredClone(f);f.attackFrame=4;
 const p={attack:f.attacking,frame:3,grounded:true};assert.equal(smoothAttackFrame(f,p,.5),3.5);assert.equal(f.attackFrame,4);
 f.attackFrame=9;p.frame=8;assert.equal(smoothAttackFrame(f,p,.25),9);
 f.attackFrame=13;p.frame=12;assert.equal(smoothAttackFrame(f,p,.25),13);
 p.attack={...f.attacking};assert.equal(smoothAttackFrame(f,p,.25),13);
 assert.deepEqual(f.attacking,before.attacking);
});

test('a landing or discontinuous frame does not interpolate the previous attack pose',()=>{
 const f=fighter();f.attackFrame=8;
 assert.equal(smoothAttackFrame(f,{attack:f.attacking,frame:7,grounded:false},.5),8);
 assert.equal(smoothAttackFrame(f,{attack:f.attacking,frame:3,grounded:true},.5),8);
});

test('footwork inserts distance-driven steps and resets on reversal',()=>{
 const f=fighter(),s=createSmoothSelector();f.attacking=null;f.vx=150;
 const seen=new Set();for(let tick=0;tick<50;tick++){f.x+=2.5;const p=s(f,f,tick,true);if(p)seen.add(p.frame);}
 assert.deepEqual([...seen].sort(),[0,1,2,3]);
 f.vx=-150;assert.equal(s(f,f,51,true),null);
});

test('new sprites have finite registration and airborne corrections ramp from planted feet',()=>{
 for(const id of ['jez','benny'])for(const bank of ['smooth-flow','smooth-footwork','smooth-approach','smooth-contact'])for(let n=0;n<16;n++){
  const floor=smoothVerticalOffset(id,bank,n,0),air=smoothVerticalOffset(id,bank,n,110);
  assert.ok(Number.isFinite(floor)&&Math.abs(floor)<=4);assert.ok(Number.isFinite(air)&&Math.abs(air)<120);
  assert.equal(smoothVerticalOffset(id,bank,n,55),(floor+air)/2);
 }
 assert.equal(smoothVerticalOffset('alan','smooth-flow',0),null);
});
