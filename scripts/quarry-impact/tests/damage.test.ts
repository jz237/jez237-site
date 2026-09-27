import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { templates } from '../src/assets.ts';
import { Vehicle } from '../src/vehicle.ts';

await R.init();
test('impact bends nearby sheet metal, leaves distant panels intact, and repair restores every vertex', () => {
  const model = new T.Group();
  for (const code of ['FL', 'FR', 'RL', 'RR']) { const w = new T.Group(); w.name = 'wheel_' + code; model.add(w); }
  for (const [name,z] of [['front', 2], ['rear', -2]] as const) {
    const geo = new T.PlaneGeometry(1.8,.7,24,12); geo.translate(0,.8,z);
    const material = new T.MeshPhysicalMaterial({ color: 0xbb2211 }); material.name = 'paint_test';
    const mesh = new T.Mesh(geo,material); mesh.name = 'panel_' + name; model.add(mesh);
  }
  templates.set('hatch',model);
  const world=new R.World({x:0,y:-9.81,z:0});
  let emitted=0;
  const fx={ emit(){emitted++;},mark(){},detach(){} } as any;
  const car=new Vehicle(0,'hatch',0xbb2211,new T.Scene(),world,fx);
  car.place(0,0,0);
  const front=car.panels.find(p=>p.name==='panel_front')!,rear=car.panels.find(p=>p.name==='panel_rear')!;
  const before = new Float32Array(front.geometry.attributes.position.array);
  car.hit(new T.Vector3(0,car.current.y,2),new T.Vector3(0,0,-1),12,1);
  assert.equal(car.health,88);
  assert.ok(front.geometry.attributes.position.getZ(100)<before[100*3+2]);
  assert.deepEqual(Array.from(rear.geometry.attributes.position.array),Array.from(rear.userData.original));
  assert.ok(Array.from(front.geometry.attributes.impactWear.array).some(v=>v>0));
  const dented = Array.from(front.geometry.attributes.position.array);
  car.repair();
  assert.equal(car.health,100);
  assert.deepEqual(Array.from(front.geometry.attributes.position.array),Array.from(before));
  assert.ok(Array.from(front.geometry.attributes.impactWear.array).every(v=>v===0));
  const emittedBeforeReplay = emitted;
  car.hit(new T.Vector3(0,car.current.y,2),new T.Vector3(0,0,-1),12,1,true);
  assert.deepEqual(Array.from(front.geometry.attributes.position.array),dented);
  assert.equal(emitted,emittedBeforeReplay,'history replay must not emit old crash effects');
  car.dispose();world.free();
});

test('laminated windshield cracks without disappearing after a substantial nearby impact',()=>{
  const model=templates.get('hatch')!.clone(true);
  const geometry=new T.PlaneGeometry(1.6,.6);geometry.translate(0,1,1);
  const glass=new T.Mesh(geometry,new T.MeshPhysicalMaterial());glass.name='glass_Windshield';model.add(glass);
  templates.set('sedan',model);
  const world=new R.World({x:0,y:-9.81,z:0});
  const car=new Vehicle(0,'sedan',0xffffff,new T.Scene(),world,{emit(){},mark(){},detach(){}} as any);
  car.place(0,0,0);
  car.hit(new T.Vector3(0,car.current.y+.2,1),new T.Vector3(0,0,-1),18,1);
  assert.equal(car.glass[0].visible,true);
  assert.ok(car.glass[0].userData.damage>0);
  assert.ok((car.glass[0].material as T.Material).userData.glassState.damage.value>0);
  car.repair();
  assert.equal((car.glass[0].material as T.Material).userData.glassState.damage.value,0);
  car.dispose();world.free();
});
