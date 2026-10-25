import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CABIN,cabinCutoff} from '../src/audio';
test('from inside a car the world outside is muffled, opening back up as the cabin is torn open',()=>{
  assert.equal(cabinCutoff(false,0),CABIN.open);assert.equal(cabinCutoff(false,1),CABIN.open);
  assert.equal(cabinCutoff(true,0),CABIN.closed);assert.ok(Math.abs(cabinCutoff(true,1)-CABIN.open)<1e-6);
  assert.ok(Math.abs(cabinCutoff(true,.5)-Math.sqrt(CABIN.closed*CABIN.open))<1e-6,'opens evenly by ear (geometric)');
  assert.equal(cabinCutoff(true,NaN),CABIN.closed);assert.equal(cabinCutoff(true,-1),CABIN.closed);assert.ok(Math.abs(cabinCutoff(true,3)-CABIN.open)<1e-6);
});
test('the ambience reaches the mix through the cabin low-pass; engines, effects and the roof rain do not',()=>{
  const audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(audio.includes('for (const b of [this.engineBus, this.fxBus])\n      b.connect(this.master);')&&audio.includes('this.ambientBus.connect(this.cabinFilter).connect(this.master);'));
  assert.ok(audio.includes("this.roofRain??=this.loop('roof-rain',this.fxBus!);"),'the drumming is inside the cabin');
  assert.ok(audio.includes('this.cabinFilter.frequency.setTargetAtTime(f,this.ctx.currentTime,.12);'),'eases between');
  assert.ok(main.includes("sound.cabin(!!p&&effectsActive&&!online?.active&&!demo&&drivingCamera!=='chase',p?.openness??0);}")&&main.includes('sound.cabin(false,0);}'),'offline in-car cameras; open in the garage');
});
