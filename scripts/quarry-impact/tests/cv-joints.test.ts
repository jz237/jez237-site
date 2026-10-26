import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CV,cvClicks,cvVolume,cvWear} from '../src/cv-joints';
test('a CV joint goes when its wheel is knocked about past the onset, or with great age',()=>{
  assert.equal(cvWear(0,0),0);assert.equal(cvWear(CV.onset,0),0);assert.equal(cvWear(1,0),1);assert.ok(cvWear(.6,0)>0&&cvWear(.6,0)<1);
  assert.equal(cvWear(0,CV.age-.01),0,'not yet worn');assert.ok(cvWear(0,1)>0&&cvWear(0,1)<=CV.worn,'worn, but not like a wrecked one');assert.equal(cvWear(1,1),1);
  assert.equal(cvWear(NaN,NaN),0);
});
test('it clicks turning on lock under power at low speed, a few a wheel turn, louder the worse',()=>{
  const r=.33,slow=cvClicks(1,1,1,3,r),fast=cvClicks(1,1,1,8,r);assert.ok(Math.abs(slow-3/(2*Math.PI*r)*CV.perTurn)<1e-9,'per wheel turn');assert.ok(fast>slow&&fast<=CV.max);
  assert.equal(cvClicks(1,CV.lock-.05,1,3,r),0,'not on a gentle turn');assert.equal(cvClicks(1,1,CV.throttle-.05,3,r),0,'not coasting');
  assert.equal(cvClicks(1,1,1,CV.speed[0]-.1,r),0);assert.equal(cvClicks(1,1,1,CV.speed[1]+1,r),0,'drowned out at speed');assert.equal(cvClicks(0,1,1,3,r),0,'a sound joint');
  assert.equal(cvClicks(1,-1,1,-3,r),slow,'either way');assert.equal(cvClicks(1,1,1,3,0),0);
  assert.ok(cvVolume(1)>cvVolume(.3)&&cvVolume(0)===CV.volume[0]);
});
test('main clicks the driven front wheels of offline cars with the recorded takes, with a QA count',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),manifest=JSON.parse(readFileSync(new URL('../public/audio/manifest.json',import.meta.url),'utf8')) as {id:string}[];
  assert.ok(CV.clips.every(id=>manifest.some(m=>m.id===id)),'the takes are recorded');
  assert.ok(main.includes("if(state==='playing')for(const c of cars){if(!c.extendedDamage||c.health<=0||!c.drivenWheels.includes(0))continue;"),'driven fronts, offline');
  assert.ok(main.includes('const wear=cvWear(c.wreckParts.wheelDamage[i],c.surfaceFinish.rustAge),rate=cvClicks(wear,c.input?.steer??0,c.input?.throttle??0,c.speed,vehicleWheelRadius(c.kind));'));
  assert.ok(main.includes('sound.clip(CV.clips[cvTake++%CV.clips.length],steamAt,cvVolume(wear),CV.duration);')&&main.includes('cvClicks: (id?: number) =>'));
});
