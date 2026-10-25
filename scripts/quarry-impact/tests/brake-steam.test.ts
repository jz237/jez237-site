import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BRAKE_STEAM,brakeSteamRate} from '../src/brake-steam';
test('rain on a hot brake disc steams, the hotter the faster; cool discs do not',()=>{
  assert.equal(brakeSteamRate(BRAKE_STEAM.from),0);assert.equal(brakeSteamRate(0),0);assert.equal(brakeSteamRate(NaN),0);
  assert.equal(brakeSteamRate(1),BRAKE_STEAM.rate);assert.equal(brakeSteamRate(2),BRAKE_STEAM.rate);assert.ok(brakeSteamRate(.8)>brakeSteamRate(.5)&&brakeSteamRate(.5)>0);
});
test('main steams hot discs at their wheels in an offline rain event',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(eventLighting==='rain'&&(state==='playing'||state==='wrecked'))for(const c of cars){if(!c.extendedDamage)continue;"));
  assert.ok(main.includes("clocks[i]+=brakeSteamRate(c.discHeat[i])*dt;if(clocks[i]<1)continue;clocks[i]%=1;brakePuffs++;fx.emit(w.getWorldPosition(steamAt),1,5,.25);}}"),'at the wheel, not a lost one');
});
