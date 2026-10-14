import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {rosette, dryShrub, desertPlanting} from '../lib/DesertPlants';
import {plantFlexFor, type PlantContact} from '../lib/PlantFlex';
import {caveBackingGeometry} from '../lib/DesertDetails';
import {hardscape} from './locomotion-fixture';
import {TailContacts} from '../lib/TailContacts';

const distance = (p: THREE.Vector3, c: PlantContact) => {
  const scale = c.radius / (c.verticalRadius ?? c.radius), stretch = (v: THREE.Vector3) => v.clone().multiply(new THREE.Vector3(1, scale, 1));
  const point = stretch(p);
  return new THREE.Line3(stretch(c.a), stretch(c.b)).closestPointToPoint(point, true, new THREE.Vector3()).distanceTo(point);
};

test('aloe leaves flatten below an approaching body, keep their roots fixed, and recover after contact', () => {
  const group = rosette(0, 0, .13, 22), flex = plantFlexFor(group)!;
  const mesh = group.children[0] as THREE.Mesh, p = mesh.geometry.getAttribute('position');
  const rest = Float32Array.from(p.array), uv = mesh.geometry.getAttribute('uv');
  const contact = {a: new THREE.Vector3(-.17, group.position.y + .045, 0), b: new THREE.Vector3(.17, group.position.y + .045, 0), radius: .029};
  let before = 0;
  for (let i = 0; i < p.count; i++) if (distance(new THREE.Vector3().fromBufferAttribute(p, i).add(group.position), contact) < contact.radius) before++;
  assert.ok(before > 500, 'the resting leaves occupy the test body');
  for (let i = 0; i < 120; i++) flex.update(1 / 60, [contact]);
  let after = 0, rootMotion = 0;
  for (let i = 0; i < p.count; i++) {
    const point = new THREE.Vector3().fromBufferAttribute(p, i);
    if (distance(point.clone().add(group.position), contact) < contact.radius - .001) after++;
    if (uv.getY(i) === 0) rootMotion = Math.max(rootMotion, point.distanceTo(new THREE.Vector3().fromArray(rest, i * 3)));
    assert.ok(point.y >= .00099, 'the blade stays above the sand');
  }
  assert.ok(after < before * .05, `body intersections reduce from ${before} to ${after}`);
  assert.ok(rootMotion < .000001, 'root vertices remain anchored');
  const peak = Math.max(...flex.bends); flex.update(1 / 60, []);
  assert.ok(Math.max(...flex.bends) > peak * .9, 'release is gradual');
  for (let i = 0; i < 300; i++) flex.update(1 / 60, []);
  assert.equal(Math.max(...flex.bends), 0);
  let error = 0;
  for (let i = 0; i < p.count; i++) error = Math.max(error, new THREE.Vector3().fromBufferAttribute(p, i).distanceTo(new THREE.Vector3().fromArray(rest, i * 3)));
  assert.ok(error < .000001, 'the plant returns to its original shape');
});

test('plants ignore a dragon passing above or far away and bend shrubs only on contact', () => {
  const group = dryShrub(0, 0, .16, 62), flex = plantFlexFor(group)!;
  const above = {a: new THREE.Vector3(-.15, .6, 0), b: new THREE.Vector3(.15, .6, 0), radius: .035};
  flex.update(1 / 30, [above]);
  assert.equal(Math.max(...flex.bends), 0, 'overhead movement cannot press the shrub');
  const touch = {a: new THREE.Vector3(-.1, group.position.y + .055, 0), b: new THREE.Vector3(.1, group.position.y + .055, 0), radius: .030};
  for (let i = 0; i < 90; i++) flex.update(1 / 60, [touch]);
  assert.ok(Math.max(...flex.bends) > .5, 'stems yield under the body');
  for (const child of group.children) {
    const mesh = child as THREE.Mesh;
    for (const value of mesh.geometry.getAttribute('position').array) assert.ok(Number.isFinite(value));
    if (child instanceof THREE.InstancedMesh) for (const value of child.instanceMatrix.array) assert.ok(Number.isFinite(value), 'seed attachments remain stable');
  }
});

test('a broad shallow body depresses leaves without treating empty air below its belly as contact', () => {
  const group = rosette(0, 0, .10, 26), flex = plantFlexFor(group)!;
  const contact = {a: new THREE.Vector3(-.12, group.position.y + .033, 0), b: new THREE.Vector3(.12, group.position.y + .033, 0), radius: .036, verticalRadius: .018};
  for (let i = 0; i < 90; i++) flex.update(1 / 60, [contact]);
  const mesh = group.children[0] as THREE.Mesh, p = mesh.geometry.getAttribute('position');
  let penetrations = 0;
  for (let i = 0; i < p.count; i++) if (distance(new THREE.Vector3().fromBufferAttribute(p, i).add(group.position), contact) < contact.radius - .001) penetrations++;
  assert.equal(penetrations, 0, 'the leaves flatten beneath the belly');
  assert.ok(Math.max(...flex.bends) > .5, 'the upright inner leaves yield');
  assert.ok(Math.min(...flex.bends) < .3, 'low outer leaves already below the belly remain upright');
});

test('plant pressure and recovery are stable across render cadences', () => {
  const contact = {a: new THREE.Vector3(-.15, .12, 0), b: new THREE.Vector3(.15, .12, 0), radius: .025};
  const simulate = (fps: number) => {
    const flex = plantFlexFor(rosette(0, 0, .10, 26))!;
    for (let i = 0; i < fps; i++) flex.update(1 / fps, [contact]);
    for (let i = 0; i < fps; i++) flex.update(1 / fps, []);
    return flex.bends;
  };
  const a = simulate(30), b = simulate(120);
  assert.ok(a.some(x => x > .001), 'comparison includes recovering pressure bends');
  a.forEach((angle, i) => assert.ok(Math.abs(angle - b[i]) < .000001));
});

test('cave backings follow the rounded opening and fit inside the stone arch', () => {
  for (const [width, height] of [[.22, .112], [.218, .143]]) {
    const g = caveBackingGeometry(width, height), p = g.getAttribute('position');
    const radius = width / 2 + .015, top = height + .012;
    for (let i = 0; i < p.count; i++) {
      assert.ok((p.getX(i) / radius) ** 2 + (p.getY(i) / top) ** 2 <= 1.00001, 'no rectangular upper corners outside the opening');
      assert.ok(p.getZ(i) >= -.00001 && p.getZ(i) <= .00801, 'thin rear wall stays within the arch depth');
    }
  }
});

test('all habitat plants clear the rocks and log at rest and throughout a pressure/recovery sweep',()=>{
  const collision=new TailContacts(hardscape().hard.map(h=>h.mesh),()=>-Infinity,-Infinity);
  const p=new THREE.Vector3(),matrix=new THREE.Matrix4();let limited=0,checked=0;
  for(const group of desertPlanting()){
    const flex=plantFlexFor(group);
    if(flex){
      assert.equal(flex.constrainToHardscape((p,r)=>collision.overlapsSolid(p,r)),0,`${group.name} roots and resting shoots have clearance`);
      limited+=(flex as any).bendLimits.filter((v:number,i:number)=>v<flex.shoots[i].maxBend-.001).length;
    }
    const inspect=()=>{
      group.updateMatrixWorld(true);
      for(const child of group.children){
        const mesh=child as THREE.Mesh,positions=mesh.geometry.attributes.position;
        if(mesh instanceof THREE.InstancedMesh){
          for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,matrix);p.setFromMatrixPosition(matrix).applyMatrix4(mesh.matrixWorld);assert.equal(collision.overlapsSolid(p,.0001),false,'thorns and seed attachments clear solid scenery');checked++;}
        }else for(let i=0;i<positions.count;i++){
          p.fromBufferAttribute(positions,i).applyMatrix4(mesh.matrixWorld);
          assert.equal(collision.overlapsSolid(p,.0001),false,`${group.name} at ${group.position.toArray()} intersects scenery at ${p.toArray()}`);checked++;
        }
      }
    };
    inspect();
    if(flex){
      const contact={a:group.position.clone(),b:group.position.clone().add(new THREE.Vector3(0,.2,0)),radius:.3};
      for(let j=0;j<8;j++){flex.update(1/60,[contact]);inspect();}
      for(let j=0;j<8;j++){flex.update(.12,[]);inspect();}
    }
  }
  assert.ok(limited>0,'hardscape genuinely limits some shoots');assert.ok(checked>500000);
});
