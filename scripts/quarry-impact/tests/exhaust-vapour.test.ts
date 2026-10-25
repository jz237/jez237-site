import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VAPOUR,vapourRate} from '../src/exhaust-vapour';
test('a cold engine puffs the most vapour, a warm one little, and the throttle adds more',()=>{
  assert.equal(vapourRate(0,0),VAPOUR.cold);assert.equal(vapourRate(VAPOUR.hot,0),VAPOUR.warm);assert.equal(vapourRate(1,0),VAPOUR.warm);
  assert.ok(vapourRate(.3,0)<vapourRate(0,0)&&vapourRate(.3,0)>vapourRate(.6,0),'fades as it warms');
  assert.ok(vapourRate(.3,1)>vapourRate(.3,0)&&vapourRate(0,1)-vapourRate(0,0)>vapourRate(1,1)-vapourRate(1,0),'the pedal adds, most when cold');
  assert.equal(vapourRate(0,-1),vapourRate(0,1));assert.equal(vapourRate(NaN,NaN),VAPOUR.cold);
});
test('main puffs vapour from running offline engines in cool damp air (rain or dusk), from the tailpipe, by engine heat',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if((state==='countdown'||state==='playing'||state==='wrecked')&&(eventLighting==='rain'||eventLighting==='dusk'))for(const c of cars){if(!c.extendedDamage||c.health<=0||c.engineStall!>0||c.engineOut||c.exhaustGone)continue;"));
  assert.ok(main.includes("vapourRate(bonnetHeats.get(c)??BONNET_STEAM.start,c.input?.throttle??0)*dt;"),'the engine heat from bonnet-steam');
  assert.ok(main.includes("steamAt.set(isRearEngineKind(c.kind)?.35:-.35,-.25,-DEFINITIONS[c.kind].halfLength-.1).applyQuaternion(c.root.quaternion).add(c.root.position);fx.emit(steamAt,1,5,.25);}"),'at the tailpipe');
  const at=main.indexOf("const heat=bonnetHeat(");assert.ok(at>0&&at<main.indexOf('vapourRate(bonnetHeats.get(c)'),'heat is updated first');
});
