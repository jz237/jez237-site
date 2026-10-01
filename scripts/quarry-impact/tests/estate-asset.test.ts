import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {buildEstateAsset,buildPlayableEstateAsset} from '../src/estate-asset';
import {partitionSurface} from '../src/surface-partition';
import {prepareWreckGeometry,dentGeometry} from '../src/wreck-geometry';
import {WreckAttachments} from '../src/wreck-attachments';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
const obj=readFileSync(new URL('../public/models/brightretro-muscle/FireGTO.obj',import.meta.url),'utf8');
const area=(g:T.BufferGeometry)=>{const p=g.getAttribute('position');let result=0;for(let i=0;i<p.count;i+=3){const [a,b,c]=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,i+j));result+=b.sub(a).cross(c.sub(a)).length()/2;}return result;};

test('surface partition preserves area, normals and UV interpolation across panel boundaries',()=>{
  const source=new T.PlaneGeometry(4,2).toNonIndexed();
  const parts=partitionSurface(source,[[0,-.3],[0,.8]],p=>p.x<-.3?'rear':p.x>.8?'front':'door');
  assert.equal(parts.length,3);assert.ok(Math.abs(parts.reduce((sum,p)=>sum+area(p.geometry),0)-area(source))<1e-6);
  for(const part of parts){const p=part.geometry.getAttribute('position'),uv=part.geometry.getAttribute('uv'),n=part.geometry.getAttribute('normal');
    for(let i=0;i<p.count;i++){assert.ok(Math.abs(uv.getX(i)-(p.getX(i)+2)/4)<1e-6);assert.ok(Math.abs(uv.getY(i)-(p.getY(i)+1)/2)<1e-6);assert.equal(n.getZ(i),1);}
    if(part.name==='door'){const b=new T.Box3().setFromBufferAttribute(p as T.BufferAttribute);assert.ok(b.min.x>=-.30001&&b.max.x<=.80001);}
  }
});

test('estate conversion has a closed crowned cargo roof, four door windows and finite geometry within budget',()=>{
  const car=buildEstateAsset(obj);let vertices=0;
  for(const name of ['FL','FR','RL','RR'])assert.ok(car.getObjectByName('wheel_'+name));
  for(const side of ['L','R'])for(const door of ['BodyDoor','BodyDoorRear'])assert.ok(car.getObjectByName('glass_'+door+side));
  assert.ok(car.getObjectByName('Interior Estate cargo floor'));
  const roof=car.getObjectByName('panel_BodyRoof') as T.Mesh,box=new T.Box3().setFromObject(roof);
  assert.ok(box.min.z< -2.1&&box.max.z>.22);assert.ok(box.max.y>1.45&&box.max.y<1.49);
  roof.updateWorldMatrix(true,false);
  const roofPoints=Array.from({length:roof.geometry.getAttribute('position').count},(_,i)=>new T.Vector3().fromBufferAttribute(roof.geometry.getAttribute('position'),i).applyMatrix4(roof.matrixWorld));
  const centre=roofPoints.filter(p=>Math.abs(p.x)<.02&&Math.abs(p.z+.965)<.05);
  const edge=roofPoints.filter(p=>Math.abs(p.x)>.68&&Math.abs(p.z+.965)<.05);
  assert.ok(centre.length&&edge.length);
  assert.ok(Math.max(...centre.map(p=>p.y))-Math.max(...edge.map(p=>p.y))>.025,'Roof needs a visible crown, not a flat cap');
  assert.ok(!roofPoints.some(p=>Math.abs(p.x)>.665&&p.z>.205),'Front roof corners must be rounded in plan');
  assert.ok(Math.max(...centre.map(p=>p.y))-Math.min(...centre.map(p=>p.y))>.025,'Roof retains a lower skin');
  car.traverse(o=>{if(!(o instanceof T.Mesh))return;const p=o.geometry.getAttribute('position');vertices+=p.count;
    for(const name of ['position','normal','uv']){const a=o.geometry.getAttribute(name);assert.equal(a.count,p.count);assert.ok([...a.array].every(Number.isFinite));}
    if(o.name.startsWith('glass_BodyDoor')||o.name.startsWith('glass_Cargo')){const n=o.geometry.getAttribute('normal');for(let i=0;i<p.count;i++)assert.ok(p.getX(i)*n.getX(i)>0,'Side glass must face outwards');}
  });assert.ok(vertices<65000,'Estate must remain substantially lighter than the old procedural model');
  for(const side of [-1,1])for(const z of [-.6,-.7])for(const y of [.90,.925,.95]){
    const hit=new T.Raycaster(new T.Vector3(side*2,y,z),new T.Vector3(-side,0,0),0,1.3).intersectObject(car,true)[0];
    assert.ok(hit);assert.ok((hit.object as T.Mesh).material instanceof T.MeshPhysicalMaterial,'Inner door cards must not protrude through the sculpted outer skin');
  }
});

test('all four estate doors have separate hinges and rear damage leaves front transforms intact when reset',()=>{
  const car=buildEstateAsset(obj);prepareWreckGeometry(car);
  const parts=new WreckAttachments(car,['FL','FR','RL','RR'].map(n=>car.getObjectByName('wheel_'+n)!),.914);
  for(const side of ['left','right']){
    const front=parts.assemblies.find(a=>a.name==='door-'+side)!,rear=parts.assemblies.find(a=>a.name==='door-rear-'+side)!;
    assert.ok(front&&rear);assert.ok(rear.bounds.max.z<=front.bounds.min.z+.00001);
    assert.ok(rear.members.some(m=>m.mesh.name.startsWith('glass_')));
    assert.ok(rear.members.some(m=>m.mesh.name.includes('Handle')));
  }
  const rear=parts.assemblies.find(a=>a.name==='door-rear-left')!,front=parts.assemblies.find(a=>a.name==='door-left')!;
  const hit=new T.Vector3(-.86,.77,-1.15);parts.hit(hit,new T.Vector3(1,0,0),60);parts.pose(.3,12);
  assert.ok(rear.loose>front.loose);assert.ok(rear.members.some(m=>!m.mesh.matrix.equals(m.matrix)));
  for(const member of rear.members)assert.ok(member.mesh.matrix.elements.every(Number.isFinite));
  const skin=rear.members.find(m=>m.mesh.name.startsWith('panel_BodyDoorRearL_'))!.mesh;
  assert.ok(dentGeometry(skin,hit,new T.Vector3(1,0,0),25)>0);
  parts.reset();for(const assembly of parts.assemblies)for(const member of assembly.members)assert.ok(member.mesh.matrix.equals(member.matrix));
});

test('embedded estate GLB retains the reviewed shape and four functional door assemblies',async()=>{
  const source=buildEstateAsset(obj),loaded=(await loadCarWithoutImages('estate-candidate')).scene;
  const a=new T.Box3().setFromObject(source),b=new T.Box3().setFromObject(loaded);
  assert.ok(a.min.distanceTo(b.min)<.00001&&a.max.distanceTo(b.max)<.00001);
  const roof=loaded.getObjectByName('panel_BodyRoof') as T.Mesh,original=source.getObjectByName('panel_BodyRoof') as T.Mesh;
  assert.deepEqual(Array.from(roof.geometry.getAttribute('position').array),Array.from(original.geometry.getAttribute('position').array));
  prepareWreckGeometry(loaded);
  const parts=new WreckAttachments(loaded,['FL','FR','RL','RR'].map(n=>loaded.getObjectByName('wheel_'+n)!),.914);
  assert.equal(parts.assemblies.filter(a=>a.name.startsWith('door')).length,4);
  for(const side of [-1,1])parts.hit(new T.Vector3(side*.86,.77,-1.15),new T.Vector3(-side,0,0),60);
  assert.ok(parts.assemblies.filter(a=>a.name.startsWith('door-rear')).every(a=>a.loose>0));
});

 test('estate hood damage exposes fixed inner structure without moving the engine',()=>{
  const car=buildEstateAsset(obj);prepareWreckGeometry(car);
  const parts=new WreckAttachments(car,['FL','FR','RL','RR'].map(n=>car.getObjectByName('wheel_'+n)!),.914);
  const engine=car.getObjectByName('Structure engine block') as T.Mesh,initial=engine.matrix.clone();
  assert.ok(car.getObjectByName('Structure firewall'));assert.ok(car.getObjectByName('Structure radiator'));
  const hood=parts.assemblies.find(a=>a.name==='hood')!;assert.ok(hood);
  parts.hit(new T.Vector3(0,.90,1.5),new T.Vector3(0,-1,0),80);parts.pose(.5,5);
  assert.ok(hood.loose>0);assert.ok(hood.members.some(m=>!m.mesh.matrix.equals(m.matrix)));
  assert.ok(engine.matrix.equals(initial));assert.ok(!hood.members.some(m=>m.mesh===engine));
  for(const side of [-1,1])assert.ok(new T.Box3().setFromObject(car.getObjectByName('Structure chassis rail '+side)!).min.y>.43,'Rails must stay above the sill lower edge');
  const engineBox=new T.Box3().setFromObject(engine);
  assert.ok(engineBox.max.y<.80&&engineBox.min.z>.77&&engineBox.max.z<2.02);
});

test('playable estate export preserves the body while matching measured suspension and tire radius',async()=>{
  const raw=buildEstateAsset(obj),source=buildPlayableEstateAsset(obj),loaded=(await loadCarWithoutImages('wagon')).scene;
  for(const label of ['FL','FR','RL','RR']){
    const wheel=loaded.getObjectByName('wheel_'+label)!;assert.ok(wheel);
    assert.equal(wheel.position.x,label.endsWith('L')?-.79:.79);
    assert.equal(wheel.position.z,label.startsWith('F')?1.41:-1.41);
    assert.equal(wheel.position.y,.3400195);
    const bounds=new T.Box3().setFromObject(wheel);assert.ok(Math.abs((bounds.max.y-bounds.min.y)/2-.375)<.001);
  }
  const roof=(r:T.Object3D)=>new T.Box3().setFromObject(r.getObjectByName('panel_BodyRoof')!);
  const before=roof(raw),after=roof(source),exported=roof(loaded);
  assert.ok(before.getSize(new T.Vector3()).distanceTo(after.getSize(new T.Vector3()))<.00001);
  assert.ok(Math.abs(after.min.z-before.min.z+.015)<.00001);
  assert.ok(after.min.distanceTo(exported.min)<.00001&&after.max.distanceTo(exported.max)<.00001);
});
