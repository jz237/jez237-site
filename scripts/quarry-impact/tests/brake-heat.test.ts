import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BRAKE_HEAT,brakeWork} from '../src/brake-heat';
import {discHeat,discFade,discGlow,BRAKE_FIRE} from '../src/damage-handling';
// Stop after stop: 2.5 s accelerating to 18 m/s, 1.6 s braking from it (speed falling linearly), cooling throughout.
const stops=(n:number,front:boolean)=>{let h=0;for(let s=0;s<n;s++){for(let i=0;i<150;i++)h=discHeat(h,0,0,1/60);for(let i=0;i<96;i++){const v=18*(1-i/96);h=discHeat(h,0,v,1/60);h=brakeWork(h,1,false,v,front,1/60);}}return h;};
test('braking heats the discs with speed, the fronts more than the rears, the handbrake the rears alone',()=>{
  assert.equal(brakeWork(.2,0,false,20,true,1),.2,'no pedal, no heat');assert.equal(brakeWork(.2,1,false,0,true,1),.2,'standing still, no work');
  assert.ok(Math.abs(brakeWork(0,1,false,10,true,1)-10*BRAKE_HEAT.rate*BRAKE_HEAT.front)<1e-9);
  assert.ok(brakeWork(0,1,false,20,true,1)>brakeWork(0,1,false,10,true,1),'faster, hotter');
  assert.ok(brakeWork(0,1,false,10,true,1)>brakeWork(0,1,false,10,false,1),'the fronts do more of the work');
  assert.ok(brakeWork(0,0,true,10,false,1)>0&&brakeWork(0,0,true,10,true,1)===0,'handbrake: rears only');
  assert.equal(brakeWork(.3,1,false,NaN,true,1),.3);assert.equal(brakeWork(.3,1,false,10,true,NaN),.3);
});
test('one hard stop warms them; stop after stop and they glow, then fade, but braking alone never sets a tyre alight',()=>{
  const one=stops(1,true),many=stops(12,true),rear=stops(12,false);
  assert.ok(one>.05&&one<.32,`one stop ${one}`);assert.ok(many>one*2&&discGlow(many)>0,'repeated hard stops: glowing');assert.ok(rear<many&&stops(1,false)<one*.6,'the rears less');
  assert.ok(brakeWork(BRAKE_HEAT.cap-.01,1,false,40,true,1)===BRAKE_HEAT.cap&&brakeWork(.9,1,false,40,true,1)===.9,'capped, and never adds past it');
  assert.ok(BRAKE_HEAT.cap<BRAKE_FIRE.heat&&discFade(BRAKE_HEAT.cap)<1,'can fade, cannot ignite');
});
test('the car heats its discs as it brakes, offline, on wheels it still has',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('if(this.extendedDamage&&!this.wreckParts.wheelLost[i])this.discHeat[i]=brakeWork(this.discHeat[i],this.input.brake,this.input.handbrake,this.speed,i<2,dt);'));
  assert.ok(vehicle.indexOf('this.discHeat[i]=brakeWork(')<vehicle.indexOf('if(this.discHeat[i]>.6)this.brakeBias[i]*=discFade(this.discHeat[i]);'),'before the fade is applied');
});
