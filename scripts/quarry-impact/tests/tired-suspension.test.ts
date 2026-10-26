import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TIRED,tiredCorner,tiredDamper,tiredSag} from '../src/age-rust';
import {sagBias,springBias} from '../src/damage-handling';
test('an old banger’s dampers are worn in step with its age; a new car’s are not',()=>{
  assert.equal(tiredDamper(0),1);assert.equal(tiredDamper(1),1-TIRED.damper);assert.equal(tiredDamper(.5),1-TIRED.damper/2);
  assert.equal(tiredDamper(4),1-TIRED.damper,'capped');assert.equal(tiredDamper(NaN),1);assert.equal(tiredDamper(-1),1);
});
test('one spring has sagged, its own corner and most often a rear one; the others stand',()=>{
  const corners=Array.from({length:400},(_,id)=>tiredCorner(id));assert.ok(corners.every(c=>Number.isInteger(c)&&c>=0&&c<=3));
  const rear=corners.filter(c=>c>1).length/corners.length;assert.ok(Math.abs(rear-TIRED.rear)<.08,`rear ${rear}`);
  assert.ok([0,1,2,3].every(c=>corners.includes(c)),'every corner turns up');assert.equal(tiredCorner(7),tiredCorner(7));assert.ok(tiredCorner(NaN)>=0);
  assert.equal(tiredSag(1,2,2),1-TIRED.sag);assert.equal(tiredSag(1,2,3),1);assert.equal(tiredSag(0,2,2),1);assert.ok(tiredSag(.5,1,1)>1-TIRED.sag&&tiredSag(.5,1,1)<1);
});
test('the sag check for a corner down on its bump stops still means a snapped spring, not a tired one',()=>{
  for(let d=0;d<=1;d+=.01)assert.equal(springBias(d)<1,sagBias(d)<1,`wheel damage ${d}`);
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('if(this.extendedDamage&&this.springBias[i]<1&&Math.abs(this.speed)>3&&(this.controller.wheelSuspensionLength(i)??1)<.16){'),'snapped springs drag the belly');
  assert.ok(vehicle.includes('if(this.extendedDamage&&this.surfaceFinish.rustAge>0){const age=this.surfaceFinish.rustAge;this.damperBias[i]*=tiredDamper(age);this.sagBias[i]*=tiredSag(age,tiredCorner(this.id),i);}'),'offline, by its age');
  const at=vehicle.indexOf('this.damperBias[i]*=tiredDamper(age)'),set=vehicle.lastIndexOf('this.springBias[i]=spring;this.sagBias[i]=sagBias(d);this.driveBias[i]=drive;',at);assert.ok(set>0&&at-set<300,'on top of the damage, every step');
});
