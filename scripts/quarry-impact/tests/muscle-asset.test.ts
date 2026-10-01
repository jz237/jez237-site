import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {buildMuscleAsset,buildPlayableMuscleAsset} from '../src/muscle-asset';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {prepareWreckGeometry,dentGeometry} from '../src/wreck-geometry';
import {WreckAttachments} from '../src/wreck-attachments';
const obj=readFileSync(new URL('../public/models/brightretro-muscle/FireGTO.obj',import.meta.url),'utf8');
const area=(root:T.Object3D)=>{let area=0;root.updateMatrixWorld(true);root.traverse(o=>{if(!(o instanceof T.Mesh))return;const p=o.geometry.getAttribute('position');for(let i=0;i<p.count;i+=3){const v=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,i+j).applyMatrix4(o.matrixWorld));area+=v[1].sub(v[0]).cross(v[2].sub(v[0])).length()/2;}});return area;};

test('candidate preserves the source surface and silhouette while separating damage panels',()=>{
  const source=new OBJLoader().parse(obj),car=buildMuscleAsset(obj);source.rotation.y=Math.PI;
  assert.ok(Math.abs(area(car)-area(source))<.0001,'Clipping must not remove or duplicate faces');
  const a=new T.Box3().setFromObject(source),b=new T.Box3().setFromObject(car);
  assert.ok(a.min.distanceTo(b.min)<.00001);assert.ok(a.max.distanceTo(b.max)<.00001);
  let vertices=0,doors=0;car.traverse(o=>{if(!(o instanceof T.Mesh))return;const g=o.geometry,p=g.getAttribute('position');vertices+=p.count;
    for(const name of ['position','normal','uv']){const attr=g.getAttribute(name);assert.equal(attr.count,p.count);assert.ok([...attr.array].every(Number.isFinite));}
    if(o.name.startsWith('panel_BodyDoor')){doors++;const bounds=new T.Box3().setFromObject(o);assert.ok(bounds.min.z>=-.82001&&bounds.max.z<=.72001,'Door faces cannot span fixed fenders');}
  });assert.ok(doors>=2);assert.ok(vertices<30000,'Candidate should not need the procedural model geometry budget');
});

test('four independent wheel groups retain measured pivots and every tire face',()=>{
  const car=buildMuscleAsset(obj),wheels=car.children.filter(o=>o.name.startsWith('wheel_'));
  assert.deepEqual(wheels.map(o=>o.name).sort(),['wheel_FL','wheel_FR','wheel_RL','wheel_RR']);
  for(const w of wheels){assert.ok(Math.abs(Math.abs(w.position.x)-.79)<.0001);assert.ok(Math.abs(w.position.y-.3400195)<.0001);
    const bounds=new T.Box3().setFromObject(w);assert.ok(bounds.max.y-bounds.min.y>.679);assert.ok(bounds.max.y-bounds.min.y<.681);
    let tires=0;w.traverse(o=>{if(o instanceof T.Mesh&&(o.material as T.Material).name==='Classic Tire')tires++;});assert.ok(tires>0);
  }
  const fl=car.getObjectByName('wheel_FL')!,fr=car.getObjectByName('wheel_FR')!;
  const rightBounds=new T.Box3().setFromObject(fr);fl.rotation.x=1.2;car.updateMatrixWorld(true);
  assert.ok(new T.Box3().setFromObject(fr).equals(rightBounds),'Left wheel steering/spin cannot move the right wheel');
});

test('candidate doors and hood participate in existing damage and hinge restoration',()=>{
  const car=buildMuscleAsset(obj);prepareWreckGeometry(car);
  const wheels=['FL','FR','RL','RR'].map(n=>car.getObjectByName('wheel_'+n)!);
  const parts=new WreckAttachments(car,wheels,.91);
  for(const name of ['hood','door-left','door-right'])assert.ok(parts.assemblies.some(a=>a.name===name),name);
  const door=parts.assemblies.find(a=>a.name==='door-left')!,contact=door.bounds.getCenter(new T.Vector3());
  const members=door.members.map(m=>({mesh:m.mesh,matrix:m.mesh.matrix.clone()}));
  const mesh=members.find(m=>m.mesh.name.startsWith('panel_'))!.mesh;
  const before=Array.from(mesh.geometry.getAttribute('position').array);
  assert.ok(dentGeometry(mesh,contact,new T.Vector3(1,0,0),30)>0);
  assert.notDeepEqual(Array.from(mesh.geometry.getAttribute('position').array),before);
  parts.hit(contact,new T.Vector3(1,0,0),60);parts.pose(.2,8);
  assert.ok(members.some(m=>!m.mesh.matrix.equals(m.matrix)),'Impact must move door assembly');
  parts.reset();for(const m of members)assert.ok(m.mesh.matrix.equals(m.matrix),'Reset must restore each hinge transform');
});

test('production GLB preserves geometry and transforms while converting OBJ texture orientation',async()=>{
  const source=buildPlayableMuscleAsset(obj),loaded=(await loadCarWithoutImages('muscle')).scene;
  const a=new T.Box3().setFromObject(source),b=new T.Box3().setFromObject(loaded);
  assert.ok(a.min.distanceTo(b.min)<.00001&&a.max.distanceTo(b.max)<.00001);
  assert.ok(Math.abs(area(source)-area(loaded))<.0001);
  let samples=0;source.traverse(o=>{if(!(o instanceof T.Mesh)||!/^detail_\d+$/.test(o.name))return;
    const converted=loaded.getObjectByName(o.name) as T.Mesh;assert.ok(converted);
    const uv=o.geometry.getAttribute('uv'),result=converted.geometry.getAttribute('uv');assert.equal(uv.count,result.count);
    for(let i=0;i<uv.count;i++){assert.ok(Math.abs(uv.getX(i)-result.getX(i))<1e-6);assert.ok(Math.abs(1-uv.getY(i)-result.getY(i))<1e-6);samples++;}
  });assert.ok(samples>100);
});
