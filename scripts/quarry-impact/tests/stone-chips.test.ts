import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {finishGlass} from '../src/car-materials';
import {CHIP,chipFor,chipPoint} from '../src/stone-chips';
const src=(f:string)=>readFileSync(new URL('../src/'+f,import.meta.url),'utf8');
const main=src('main.ts'),materials=src('car-materials.ts'),vehicle=src('vehicle.ts'),checkpoint=src('replay-checkpoint.ts');
test('a young car’s screen is clean; old ones carry a chip, each car its own corner, short of a blow’s crack',()=>{
  for(let id=0;id<40;id++)assert.equal(chipFor(id,CHIP.age-.01),null);
  let n=0;const sides=new Set<number>();
  for(let id=0;id<400;id++){const c=chipFor(id,.9);if(!c)continue;n++;sides.add(c.side);
    assert.ok(c.reach>=CHIP.reach[0]&&c.reach<=CHIP.reach[1]&&c.level>=CHIP.level[0]&&c.level<=CHIP.level[1]);}
  assert.ok(Math.abs(n/400-CHIP.share)<.08,`${n}`);assert.deepEqual([...sides].sort(),[-1,1]);
  assert.ok(CHIP.reach[1]<.6,'a chip’s cracks run a short way, not across the screen');
  assert.ok(CHIP.level[1]*24<7,'below the damage a blow sets the glass effects off at');
  assert.deepEqual(chipFor(5,.7),chipFor(5,.7));assert.equal(chipFor(Number.NaN,Number.NaN),null);
});
test('the chip sits on the glass, low in the corner on its side, whichever way the screen mesh was authored',()=>{
  const screen=new T.PlaneGeometry(1.4,.8,14,8);
  for(const turn of [0,Math.PI/2]){
    const toCar=new T.Matrix4().makeRotationZ(turn),inv=toCar.clone().invert();
    for(const side of [-1,1]){
      const p=chipPoint(screen,toCar,side),car=p.clone().applyMatrix4(toCar),box=new T.Box3().setFromBufferAttribute(screen.attributes.position as T.BufferAttribute).applyMatrix4(toCar);
      assert.ok(Math.sign(car.x)===side&&Math.abs(car.x)>(box.max.x-box.min.x)*.5*.4,`${turn} ${side} x ${car.x}`);assert.ok(car.y<box.min.y+(box.max.y-box.min.y)*.35,`y ${car.y}`);
      assert.ok(p.clone().applyMatrix4(toCar).applyMatrix4(inv).distanceTo(p)<1e-9&&Math.abs(p.z)<1e-9,'a vertex of the screen');
    }
  }
});
test('a crack’s reach only limits how far it runs; every crack so far (reach 1) draws exactly as before',()=>{
  const state=finishGlass(new T.MeshPhysicalMaterial(),new T.PlaneGeometry(1,1));assert.equal(state.reach.value,1);
  assert.ok(materials.includes('float radius=length(p); float reached=radius/max(glassReach,smoothstep(.16,.6,glassDamage));'),'grows back to a blow’s as the damage does');
  assert.ok(materials.includes('*(1.-smoothstep(.12,.86,reached));')&&materials.includes('*.52*(1.-smoothstep(.04,.34,reached)));'));
  assert.ok(materials.includes('float branches=abs(sin(angle*10.5+sin(radius*19.)*.22));')&&materials.includes('float rings=abs(sin(radius*71.+sin(angle*9.)*.6));'),'the pattern keeps its own spacing');
  assert.equal((materials.match(/uniform float glassReach;/g)??[]).length,1);
});
test('a real blow cracks the screen full size from where it lands; a repair or a replay seek keeps reach in step',()=>{
  assert.ok(vehicle.includes('state.impact.value.copy(glass.worldToLocal(point.clone()));state.reach.value=1;'));
  assert.ok(vehicle.includes('if (state) { state.damage.value = 0; state.reach.value = 1; }'));
  assert.ok(checkpoint.includes('reach:glass.reach.value}')&&checkpoint.includes('glass.reach.value=m.glass.reach??1;'));
});
test('main wires it to offline rivals only, on the windscreen, at the damage its level stands for',()=>{
  const at=main.indexOf('const chip=chipFor(car.id,startingRust(car.id))'),block=main.slice(main.lastIndexOf('\n',at),main.indexOf('\n',main.indexOf('\n',at)+1));
  assert.ok(block.includes('if(car.extendedDamage&&i!==0){'));assert.ok(block.includes('/windshield|^glass_front/i.test(g.name)'));
  assert.ok(block.includes('st.damage.value=chip.level;st.reach.value=chip.reach;screen.userData.damage=chip.level*24;'));
});
