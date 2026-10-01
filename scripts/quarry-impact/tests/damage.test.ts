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
  assert.ok(Array.from(front.geometry.attributes.position.array).some((v,i)=>i%3===2&&v<before[i]-.01),'contact region bends while the smaller early dent leaves its outer edge alone');
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

function sheetCar(duplicateVertices = false) {
  const model = new T.Group();
  for (const code of ['FL','FR','RL','RR']) {
    const wheel = new T.Group(); wheel.name = 'wheel_' + code; model.add(wheel);
  }
  let geometry = new T.PlaneGeometry(4,2,32,16);
  geometry.translate(0,.8,2);
  if (duplicateVertices) geometry = geometry.toNonIndexed() as T.PlaneGeometry;
  const material = new T.MeshPhysicalMaterial(); material.name = 'paint_test';
  const panel = new T.Mesh(geometry,material); panel.name = 'panel_front'; model.add(panel);
  templates.set('hatch',model);
  const world = new R.World({x:0,y:-9.81,z:0});
  const car = new Vehicle(0,'hatch',0xffffff,new T.Scene(),world,{emit(){},mark(){},detach(){}} as any);
  car.place(0,0,0); car.root.updateMatrixWorld(true);
  return {car, panel:car.panels[0], close(){car.dispose();world.free();}};
}
function strike(car: Vehicle, x: number, damage = 12, quiet = false) {
  const point = car.model.localToWorld(new T.Vector3(x,.8,2));
  car.hit(point,new T.Vector3(0,0,-1),damage,1,quiet);
}

test('a localized buckle follows the contact and does not form repeating corrugations',()=>{
  const a = sheetCar(), b = sheetCar();
  try {
    strike(a.car,-.25); strike(b.car,.25);
    const pa = a.panel.geometry.attributes.position, pb = b.panel.geometry.attributes.position;
    const oa = a.panel.userData.original as Float32Array;
    const ob = b.panel.userData.original as Float32Array;
    // The center row has exactly representable 0.125 m spacing. Moving a
    // contact 0.5 m should move its buckle four vertices, not leave it tied
    // to a world-space wave pattern.
    const row = 8 * 33;
    for (let x=9;x<=19;x++) {
      const ia=row+x, ib=ia+4;
      for (let axis=0;axis<3;axis++) {
        const da=pa.array[ia*3+axis]-oa[ia*3+axis];
        const db=pb.array[ib*3+axis]-ob[ib*3+axis];
        assert.ok(Math.abs(da-db)<1e-6,'buckle must move with contact');
      }
    }
    let last=0, signChanges=0;
    for (let x=6;x<=23;x++) {
      const i=row+x, delta=pa.getY(i)-oa[i*3+1];
      if (Math.abs(delta)<1e-5) continue;
      const sign=Math.sign(delta);
      if(last && sign!==last)signChanges++;
      last=sign;
    }
    assert.ok(signChanges<=2,`single local buckle, not ${signChanges} alternating folds`);
    assert.ok(Array.from(pa.array).some((v,i)=>Math.abs(v-oa[i])>.01));
  } finally {a.close();b.close();}
});

test('repeated impacts keep duplicate vertices welded, bound displacement and replay bitwise after repair',()=>{
  const {car,panel,close}=sheetCar(true);
  try {
    const original=panel.userData.original as Float32Array;
    const originalNormals=new Float32Array(panel.geometry.attributes.normal.array);
    const hits=[-.125,0,.125,0,-.125,0,.125,0,0];
    for(const x of hits)strike(car,x,10);
    assert.equal(car.health,10);
    assert.equal(car.damageLeft,20);assert.equal(car.damageRight,70);
    const position=panel.geometry.attributes.position;
    const dented=new Float32Array(position.array);
    const normals=new Float32Array(panel.geometry.attributes.normal.array);
    const wear=new Float32Array(panel.geometry.attributes.impactWear.array);
    const seen=new Map<string,number[]>();let maximum=0,duplicates=0;
    for(let i=0;i<position.count;i++) {
      const key=Array.from(original.slice(i*3,i*3+3)).join(',');
      const value=[position.getX(i),position.getY(i),position.getZ(i)];
      assert.ok(value.every(Number.isFinite));
      if(seen.has(key)){assert.deepEqual(value,seen.get(key));duplicates++;}
      else seen.set(key,value);
      const displacement=Math.hypot(...value.map((v,axis)=>v-original[i*3+axis]));
      maximum=Math.max(maximum,displacement);
      assert.ok(displacement<=.900001,'total displacement remains capped at 0.9 m');
      // Vertices beyond every contact radius must remain exactly untouched.
      if(Math.abs(original[i*3])>1.2)assert.deepEqual(value,Array.from(original.slice(i*3,i*3+3)));
    }
    assert.ok(duplicates>100,'fixture must exercise duplicated seam vertices');
    assert.ok(maximum>.5,'stationary repeated contacts must still produce a substantial dent');
    // Compression now follows the current sheet in small increments. A fixed
    // contact must not keep pushing rest vertices through their neighbours.
    for(let i=0;i<position.count;i+=3){
      const a=new T.Vector3().fromBufferAttribute(position,i),b=new T.Vector3().fromBufferAttribute(position,i+1),c=new T.Vector3().fromBufferAttribute(position,i+2);
      assert.ok(b.sub(a).cross(c.sub(a)).z>0,'repeated frontal impacts must not reverse sheet triangles');
    }
    car.repair();
    assert.deepEqual(new Float32Array(position.array),original);
    assert.deepEqual(new Float32Array(panel.geometry.attributes.normal.array),originalNormals);
    assert.ok(Array.from(panel.geometry.attributes.impactWear.array).every(v=>v===0));
    assert.equal(car.health,100);assert.equal(car.damageLeft,0);assert.equal(car.damageRight,0);
    for(const x of hits)strike(car,x,10,true);
    assert.deepEqual(new Uint8Array((position.array as Float32Array).buffer),new Uint8Array(dented.buffer));
    assert.deepEqual(new Float32Array(panel.geometry.attributes.normal.array),normals);
    assert.deepEqual(new Float32Array(panel.geometry.attributes.impactWear.array),wear);
  } finally {close();}
});
