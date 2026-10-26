import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DRAFT,draftAccel,draftFactor} from '../src/slipstream';
const f={x:0,z:1};
test('tucked in close behind a car going its way at speed, a car gets the tow, strongest close and dead behind',()=>{
  const close=draftFactor({x:0,z:0},f,18,{x:0,z:DRAFT.near},f,18),mid=draftFactor({x:0,z:0},f,18,{x:0,z:(DRAFT.near+DRAFT.far)/2},f,18),off=draftFactor({x:0,z:0},f,18,{x:DRAFT.lateral*.5,z:DRAFT.near},f,18);
  assert.equal(close,1);assert.ok(mid>0&&mid<close&&off>0&&off<close,'less further back or off its line');
});
test('no tow alongside, ahead, too far back, off its line, across its path or slow',()=>{
  const at=(l:{x:number;z:number},lf=f,s=18,ls=18)=>draftFactor({x:0,z:0},f,s,l,lf,ls);
  assert.equal(at({x:0,z:DRAFT.near-.5}),0,'bumper to bumper');assert.equal(at({x:0,z:DRAFT.far+1}),0,'too far');assert.equal(at({x:0,z:-5}),0,'behind it');
  assert.equal(at({x:DRAFT.lateral+.1,z:6}),0,'off its line');assert.equal(at({x:0,z:6},{x:1,z:0}),0,'crossing');
  assert.equal(at({x:0,z:6},f,DRAFT.speed-1),0,'too slow');assert.equal(at({x:0,z:6},f,18,DRAFT.speed-1),0,'a slow car ahead');
  assert.equal(draftFactor({x:NaN,z:0},f,18,{x:0,z:6},f,18),0);
});
test('the push rises with the square of the speed, up to DRAFT.accel at DRAFT.ref m/s',()=>{
  assert.equal(draftAccel(1,DRAFT.ref),DRAFT.accel);assert.ok(Math.abs(draftAccel(1,DRAFT.ref/2)-DRAFT.accel/4)<1e-12);assert.equal(draftAccel(.5,DRAFT.ref),DRAFT.accel/2);
  assert.equal(draftAccel(3,DRAFT.ref),DRAFT.accel,'capped');assert.equal(draftAccel(NaN,20),0);assert.equal(draftAccel(-1,20),0);
});
test('main tows offline cars from the best car ahead, along their heading, and tells the player',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('for(const l of cars){if(l===c||l.health<=0)continue;const f=draftFactor(c.current,c.forward,c.speed,l.current,l.forward,l.speed);if(f>best)best=f;}'));
  assert.ok(main.includes('const push=draftAccel(best,c.speed);if(push<=0)continue;drafting+=dt;const k=c.body.mass()*push*dt*Math.sign(c.speed);c.body.applyImpulse({x:c.forward.x*k,y:0,z:c.forward.z*k},true);'));
  assert.ok(main.includes("if(c.id===0&&!demo&&clock-draftToast>DRAFT.toast){draftToast=clock;toast('SLIPSTREAM',1.2);}")&&main.includes('drafting: () =>'));
  assert.ok(main.includes("if(state==='playing')for(const c of cars){if(!c.extendedDamage||c.health<=0)continue;let best=0;"),'offline cars');
});
