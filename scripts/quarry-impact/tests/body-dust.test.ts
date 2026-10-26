import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BODY_DUST,bodyDustPuffs,bodyPoint} from '../src/body-dust';
test('a hard knock shakes dust off, more the harder and the dustier the car; light taps and wet cars none',()=>{
  assert.equal(bodyDustPuffs(BODY_DUST.damage-.1,1,false),0,'a tap');assert.equal(bodyDustPuffs(30,1,true),0,'wet dust stays put');assert.equal(bodyDustPuffs(NaN,1,false),0);
  assert.equal(bodyDustPuffs(BODY_DUST.full,1,false),BODY_DUST.puffs[1],'a full cloud off a filthy car');assert.equal(bodyDustPuffs(99,1,false),BODY_DUST.puffs[1],'no more past it');
  assert.ok(bodyDustPuffs(12,1,false)<bodyDustPuffs(24,1,false),'harder, more');
  assert.ok(bodyDustPuffs(24,0,false)>0&&bodyDustPuffs(24,0,false)<bodyDustPuffs(24,1,false),'any old banger has some; a dusty one more');
  assert.equal(bodyDustPuffs(24,NaN,false),bodyDustPuffs(24,0,false));
});
test('the dust comes off the sides and top of the body, outwards, never from under it',()=>{
  const seen=new Set<string>();
  for(let i=0;i<400;i++){const r=(k:number)=>((i*0.618+k*0.377)%1+1)%1,{p,n}=bodyPoint(.9,.6,2.2,r(1),r(2),r(3));seen.add(n.join());
    assert.ok(Math.abs(p[0])<=.9+1e-9&&Math.abs(p[1])<=.6+1e-9&&Math.abs(p[2])<=2.2+1e-9,'on the box');assert.ok(n[1]>=0,'not the underside');
    const axis=n.findIndex(v=>v!==0),half=[.9,.6,2.2][axis];assert.ok(Math.abs(p[axis]-n[axis]*half)<1e-9,'on the face it faces out of');}
  assert.equal(seen.size,5,'both sides, both ends and the top');
});
test('the vehicle reports its knocks offline and main shakes the dust off in a cloud round the body',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('      this.fx.impact?.(point, direction, damage);\n      if(this.extendedDamage)this.onHardKnock?.(damage);'),'with the impact effects');
  assert.ok(main.includes("if(car.extendedDamage)car.onHardKnock=damage=>{const dirt=car.surfaceFinish.coating.value,n=bodyDustPuffs(damage,Math.max(car.surfaceFinish.wakeLevel/.75,(dirt.z+dirt.w)/2),eventLighting==='rain'),box=n?bodyBox(car):null;if(!box)return;"),'by its dust and dirt, not in the rain');
  assert.ok(main.includes('const at=bodyPoint(box.half.x,box.half.y,box.half.z,Math.random(),Math.random(),Math.random());'),'all over the body');
  assert.ok(main.includes('roostBodies.length=0;if(gravelRoost.flying)for(const c of cars){if(!c.extendedDamage)continue;const box=bodyBox(c);if(!box)continue;'),'the same body box as the stones');
});
