import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TRAMP,trampHop,trampKind,trampLevel} from '../src/axle-tramp';
test('only a classic driving its rear wheels on a live axle tramps',()=>{
  assert.ok(trampKind('muscle',true,[2,3]),'the muscle car');assert.ok(!trampKind('coupe',false,[2,3]),'not the modern coupe’s independent rear');
  assert.ok(!trampKind('tern',true,[0,1]),'not a front-driver');assert.ok(!trampKind('buggy',true,[2,3])&&!trampKind('trail',true,[2,3]),'not the buggies');
  assert.ok(!trampKind('morrow',true,[0,1,2,3]),'not four-wheel drive');
});
test('launched hard at the edge of grip it tramps, worst mid-band, slow, flat out, and harder the more worn',()=>{
  const mid=(TRAMP.slip[0]+TRAMP.slip[1])/2,sound=trampLevel(mid,2,1,0),worn=trampLevel(mid,2,1,1);
  assert.ok(sound>0&&worn>sound&&worn<=1,'harder when worn');assert.ok(Math.abs(sound/worn-TRAMP.worn[0]/TRAMP.worn[1])<1e-9);
  assert.ok(trampLevel(TRAMP.slip[0]+.3,2,1,1)<worn&&trampLevel(TRAMP.slip[1]-.3,2,1,1)<worn,'worst in the middle of the band');
  assert.equal(trampLevel(TRAMP.slip[0]-.1,2,1,1),0,'gripping');assert.equal(trampLevel(TRAMP.slip[1]+1,2,1,1),0,'a full burnout');
  assert.equal(trampLevel(mid,TRAMP.speed,1,1),0,'up to speed');assert.equal(trampLevel(mid,2,TRAMP.throttle-.1,1),0,'eased away');
  assert.ok(trampLevel(mid,8,1,1)<trampLevel(mid,1,1,1),'fading as it picks up speed');assert.equal(trampLevel(NaN,2,1,1),0);assert.equal(trampLevel(mid,2,1,NaN),sound,'no age, sound');
  assert.equal(trampLevel(-mid,-2,1,1),worn,'either way');
});
test('the rear wheels hop clear on the up-beat only, up to TRAMP.hop',()=>{
  assert.equal(trampHop(Math.PI/2,1),TRAMP.hop);assert.equal(trampHop(-Math.PI/2,1),0,'never into the ground');assert.equal(trampHop(Math.PI/2,.5),TRAMP.hop/2);
  assert.equal(trampHop(Math.PI/2,0),0);assert.equal(trampHop(NaN,1),0);assert.equal(trampHop(Math.PI/2,3),TRAMP.hop,'capped');
});
test('main tramps offline rear-driven classics at the axle, lifts the wheels after they are placed, with QA hooks',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(state==='playing')for(const c of cars){if(!c.extendedDamage||c.health<=0||!trampKind(c.kind,isClassicKind(c.kind),c.drivenWheels))continue;"));
  assert.ok(main.includes('const level=trampLevel((c.wheelSpins[2]+c.wheelSpins[3])/2,c.speed,c.input.throttle,c.surfaceFinish.rustAge);'),'from the driven wheels’ slip, by age');
  assert.ok(main.includes('c.body.applyImpulseAtPoint({x:0,y:Math.sin(t.phase)*level*TRAMP.kick*c.body.mass()*9.81*dt,z:0},{x:trampAt.x,y:trampAt.y,z:trampAt.z},true);'),'at the rear axle');
  const render=main.indexOf("for (const c of cars) c.render(state === 'wrecked' ? 1 : accumulator / (1 / 60));"),lift=main.indexOf('for (const c of cars){const t=trampState.get(c);if(!t?.lift)continue;');
  assert.ok(render>0&&lift>render&&lift-render<300,'after the wheels are placed each frame');assert.ok(main.includes('tramp: (id?: number) =>')&&main.includes('trampLift: (id = 0) =>'));
});
