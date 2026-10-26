import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {OIL_BURN,burnOil,burner} from '../src/oil-burner';
const drive=(age:number,steps:[number,number][])=>{const s=burner();let n=0;for(const [pedal,seconds] of steps)for(let i=0;i<seconds*60;i++)n+=burnOil(s,age,pedal,1/60);return n;};
test('floored after coasting, an old engine coughs a blue puff, bigger the older; a young one none',()=>{
  assert.equal(drive(1,[[0,1],[1,1/60]]),OIL_BURN.puffs[1],'the oldest: the whole puff');
  const mid=drive(.7,[[0,1],[1,1/60]]);assert.ok(mid>OIL_BURN.puffs[0]&&mid<OIL_BURN.puffs[1],'in between');
  assert.equal(drive(OIL_BURN.age-.01,[[0,2],[1,3]]),0,'too young to burn oil');assert.equal(drive(NaN,[[0,2],[1,1]]),0);
});
test('only after a proper coast, only when floored, and only once per coast',()=>{
  assert.equal(drive(1,[[0,OIL_BURN.lift/2],[1,1/60]]),0,'a blip off the pedal');assert.equal(drive(1,[[0,1],[.4,1]]),0,'eased back on');
  assert.equal(drive(1,[[0,1],[.4,.2],[1,1/60]]),0,'part throttle first burns it off quietly');
  assert.equal(drive(1,[[0,1],[.8,1]]),OIL_BURN.puffs[1],'one puff, no haze short of flat out');
  assert.equal(drive(1,[[0,1],[.8,.5],[0,1],[.8,.5]]),OIL_BURN.puffs[1]*2,'again after the next coast');
});
test('flat out, an old engine trails a thin haze',()=>{
  const flat=drive(1,[[1,10]]),steady=drive(1,[[.85,10]]);assert.ok(Math.abs(flat-OIL_BURN.haze*10)<=1,'about OIL_BURN.haze a second');
  assert.equal(steady,0,'not short of flat out');assert.ok(drive(.7,[[1,10]])<flat,'thinner when less worn');
  const s=burner();assert.equal(burnOil(s,1,1,NaN),0);assert.equal(burnOil(s,1,NaN,1/60),0);
});
test('main burns it for offline cars by their age, out of the tailpipe, with a QA count',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(state==='playing')for(const c of cars){if(!c.extendedDamage||c.health<=0||c.exhaustGone)continue;let b=oilBurners.get(c);"),'offline, running, with a tailpipe');
  assert.ok(main.includes('const n=burnOil(b,c.surfaceFinish.rustAge,c.input.throttle,dt);')&&main.includes('dustTint.setHex(OIL_BURN.tint)'),'by its age, blue-grey');
  assert.ok(main.includes('oilBurns: (id?: number) =>'));
});
