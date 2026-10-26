import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DUST_BEAMS,SMOKE_HAZE,dustAirStep,knockHaze} from '../src/dust-beams';
const run=(level:number,plumes:number[],seconds:number)=>{for(let i=0;i<seconds*60;i++)level=dustAirStep(level,plumes,1/60);return level;};
test('dust rises quickly into the air while the plumes rise and settles slowly once they stop',()=>{
  const up=run(0,[1,1,1],2);assert.ok(up>.95,'a full field of plumes fills the air in a couple of seconds');
  assert.ok(Math.abs(run(0,[1],10)-1/DUST_BEAMS.cars)<.01,'one plume, its share');
  const settling=run(1,[],2);assert.ok(settling>.5&&settling<1,'still hanging two seconds on');assert.ok(run(1,[],30)<.01,'gone in the end');
  assert.equal(run(.4,[0,0],5)<.4,true);assert.equal(dustAirStep(.5,[1],NaN),.5,'no time, no change');assert.equal(dustAirStep(NaN,[NaN],1/60),0);
  assert.ok(run(0,[5,5,5,5],3)<=1,'never past full');
});
test('main keeps the dust in the air from the plumes and shows the beams in it at dusk, offline',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("dustAir=dustAirStep(dustAir,[...cars.filter(c=>c.extendedDamage).map(c=>dustRate(c.speed,c.surface,eventLighting==='rain')/DUST.rate+(c.onFire?SMOKE_HAZE.fire:0)),knockDust],dt);"),'from the dust trails, the fires and the knocks');
  assert.ok(main.includes('dusk&&c.extendedDamage?DUST_BEAMS.strength*dustAir:0);}'),'beams at dusk by the dust in the air');
});
test('smoke and knocked-off dust thicken the air: a burning car more than a plume, a full knock cloud for a moment',()=>{
  const fire=run(0,[SMOKE_HAZE.fire],10);assert.ok(fire>.7,'one burning car hazes the air');
  assert.equal(knockHaze(0,40,40),SMOKE_HAZE.knock);assert.ok(Math.abs(knockHaze(.3,20,40)-(.3+SMOKE_HAZE.knock/2))<1e-9,'on top of what still hangs');
  assert.equal(knockHaze(1.9,40,40),2,'within reason');assert.equal(knockHaze(NaN,NaN,40),0);
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('knockDust*=Math.exp(-dt/SMOKE_HAZE.fade);')&&main.includes('bodyDusts++;knockDust=knockHaze(knockDust,n,BODY_DUST.puffs[1]);'),'knocks add a fading haze');
});
