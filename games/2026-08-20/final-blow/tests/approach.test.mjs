import test from 'node:test';
import assert from 'node:assert/strict';
import {createApproachSelector,presentationPose} from '../engine/inbetweens.mjs';
import {INBETWEEN_FIGHTERS} from '../engine/inbetweens.mjs';
test('all fighters gain preparation/retraction without changing contact frames or canonical poses',()=>{
 for(const id of INBETWEEN_FIGHTERS) for(const grounded of [true,false]) for(const crouch of [true,false]) for(const kind of ['light','heavy']) for(const limb of ['punch','kick']) {
  const select=createApproachSelector(),a={kind,limb,activeStartFrame:10,activeEndFrame:15,totalFrames:30};
  const f={def:{id},attacking:a,grounded,crouch,attackFrame:4};
  const p={bank:'unified-ext2',frame:2};
  const q=select(f,p,true);
  assert.equal(q.artBank,'inbetween-approach');assert.equal(q.bank,p.bank);assert.equal(q.frame,p.frame);
  assert.equal(presentationPose(q).bank,'unified-ext3');
  for(let i=10;i<15;i++){f.attackFrame=i;assert.deepEqual(select(f,p,true),p);}
  f.attackFrame=20;
  const recovered=select(f,p,true);
  assert.equal(recovered.artBank,'inbetween-approach');
  if(!grounded || crouch) {
    assert.equal(recovered.artFrame,!grounded?8:12,'recovery settles instead of extending again');
    assert.notEqual(recovered.artFrame,q.artFrame);
    assert.equal(presentationPose(recovered).frame,recovered.artFrame);
  }
  f.attackFrame=29;assert.deepEqual(select(f,p,true),p);
 }
});

test('landings and defensive interruptions retain their own poses',()=>{
 const a={kind:'heavy',limb:'kick',cancelProfileId:'air-heavy',activeStartFrame:10,activeEndFrame:15,totalFrames:30};
 const f={def:{id:'jez'},attacking:a,grounded:false,attackFrame:20};
 const p={bank:'unified',frame:6};
 const select=createApproachSelector();
 assert.equal(select(f,p,true).artFrame,8);
 assert.deepEqual(select({...f,grounded:true},p,true),p,'touchdown cannot reinsert an airborne drawing');
 for(const patch of [{hitstunFrames:3},{blockstunFrames:3},{wakeupFrames:3},{dizzyFrames:3},{down:true},{grabbing:true},{grabbed:true}])
  assert.deepEqual(createApproachSelector()({...f,...patch},p,true),p);
 const crouched={...f,grounded:true,crouch:true,attacking:{...a,cancelProfileId:'crouch-heavy'}};
 const crouchSelect=createApproachSelector();
 assert.equal(crouchSelect(crouched,p,true).artFrame,12);
 assert.equal(crouchSelect({...crouched,crouch:false},p,true).artFrame,12,'releasing down cannot switch recovery into a standing swing');
});
test('late loading cannot change an attack halfway through; next attack may use new art',()=>{
 const select=createApproachSelector(),f={def:{id:'jez'},grounded:true,attackFrame:4,attacking:{kind:'light',activeStartFrame:10,activeEndFrame:15,totalFrames:30}},p={bank:'unified',frame:0};
 assert.deepEqual(select(f,p,false),p);assert.deepEqual(select(f,p,true),p);
 f.attacking={...f.attacking};assert.equal(select(f,p,true).artBank,'inbetween-approach');
 f.attacking={...f.attacking,animation:[]};assert.deepEqual(select(f,p,true),p);
});
