import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {COLD_START,fireTime,coldStartPuffs,crankStarts} from '../src/cold-start';
test('every engine fires once in the first second or so of the countdown, each at its own moment',()=>{
  const times=Array.from({length:12},(_,id)=>fireTime(id));
  assert.ok(times.every(t=>t>=COLD_START.window[0]&&t<=COLD_START.window[1]),'in the window');
  assert.ok(new Set(times.map(t=>t.toFixed(3))).size===12,'all at different moments');assert.equal(fireTime(NaN),fireTime(0));
});
test('it cranks just before, then fires a burst of puffs over a moment, and only once',()=>{
  for(const id of [0,3,7]){let puffs=0,cranks=0;for(let i=0;i<Math.round(COLD_START.done*60);i++){puffs+=coldStartPuffs((i+1)/60,i/60,id);if(crankStarts((i+1)/60,i/60,id))cranks++;}
    assert.equal(puffs,COLD_START.puffs,`car ${id} puffs`);assert.equal(cranks,1,`car ${id} cranks`);}
  assert.equal(coldStartPuffs(1,1,0),0,'no time, no puffs');assert.equal(coldStartPuffs(.1,.5,0),0,'backwards, none');
  assert.ok(fireTime(4)-COLD_START.crank>0,'the crank begins within the countdown');
});
test('main starts the engines as the countdown begins, offline, and keeps the smoke moving while it runs',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("    state = countdown ? 'countdown' : 'playing';\n    coldStart = 0;\n"),'restarted each event');
  assert.ok(main.indexOf('let coldStart:number=COLD_START.done;')<main.indexOf('async function start('),'declared before start() can run');
  assert.ok(main.includes("  if(coldStart<COLD_START.done&&state==='countdown')fx.update(dt);"),'the smoke moves during the countdown');
  assert.ok(main.includes("if(crankStarts(coldStart,before,c.id))sound.clip('starter',tail(),COLD_START.volume,COLD_START.crank);")&&main.includes('for(const c of cars){if(!c.extendedDamage||c.health<=0||c.exhaustGone)continue;'),'offline cars with an exhaust');
});
