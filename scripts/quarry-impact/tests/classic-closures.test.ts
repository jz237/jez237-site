import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {panelBacking} from '../src/classic-panel-backings';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {prepareWreckGeometry,dentGeometry,repairWreckGeometry} from '../src/wreck-geometry';
import {WreckAttachments} from '../src/wreck-attachments';
import {constructionRole} from '../src/vehicle-construction';
import {verifyClassicClosuresRevision} from './classic-closures-invariants';

const area=(g:T.BufferGeometry)=>{const p=g.attributes.position;let sum=0;for(let i=0;i<p.count;i+=3){const a=new T.Vector3().fromBufferAttribute(p,i),b=new T.Vector3().fromBufferAttribute(p,i+1),c=new T.Vector3().fromBufferAttribute(p,i+2);sum+=b.sub(a).cross(c.sub(a)).length()/2;}return sum;};
test('inner shell closes a transformed surface without adding caps at a T-junction',()=>{
 // A two-metre square whose left edge is split between triangles on one side.
 const data=[-1,0,-1, -1,0,1, 0,0,1, -1,0,-1, 0,0,1, 0,0,-1];
 const outline=[[0,-1],[0,0],[0,1],[1,1],[1,-1]];
 for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length];data.push(a[0],0,a[1],b[0],0,b[1],.5,0,0);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(data,3));g.computeVertexNormals();
 const mesh=new T.Mesh(g);mesh.position.set(3,2,-1);mesh.updateMatrixWorld(true);
 const backing=panelBacking([mesh],new T.Vector3(0,-.02,0));assert.ok(Math.abs(area(backing)-4.16)<1e-5,'Only the four perimeter edges get caps');
 const ray=new T.Raycaster(new T.Vector3(3,0,-1),new T.Vector3(0,1,0));assert.ok(ray.intersectObject(new T.Mesh(backing,new T.MeshBasicMaterial())).length,'Back of the skin must be visible from inside');
});

for(const kind of ['muscle','wagon']as const){
 test(kind+' keeps lower front bodywork fixed while the hood, inner skin and pressings lift together',async()=>{
  const root=(await loadCarWithoutImages(kind)).scene;prepareWreckGeometry(root);const parts=new WreckAttachments(root,['FL','FR','RL','RR'].map(n=>root.getObjectByName('wheel_'+n)!),.914),hood=parts.assemblies.find(a=>a.name==='hood')!;
  assert.ok(hood.bounds.min.y>.81,'The grille-surround and lower valance must not be hinged to the hood');
  for(const name of ['panel_hoodInnerShell','panel_hoodInnerRibs'])assert.ok(hood.members.some(p=>p.mesh.name===name));
  const fixed:T.Mesh[]=[];root.traverse(o=>{if(o instanceof T.Mesh&&o.name.startsWith('panel_FrontValance'))fixed.push(o);});assert.ok(fixed.length);const matrices=fixed.map(m=>m.matrix.clone());
  parts.hit(new T.Vector3(0,1,1.8),new T.Vector3(0,0,-1),80);parts.poseAt(1,12);assert.ok(hood.loose>0);assert.ok(hood.members.every(p=>!p.mesh.matrix.equals(p.matrix)));fixed.forEach((m,i)=>assert.ok(m.matrix.equals(matrices[i])));
  parts.reset();hood.members.forEach(p=>assert.ok(p.mesh.matrix.equals(p.matrix)));
 });
 test(kind+' inner door skins stay inside the outer profile and deform and repair with their doors',async()=>{
  const root=(await loadCarWithoutImages(kind)).scene;prepareWreckGeometry(root);const parts=new WreckAttachments(root,['FL','FR','RL','RR'].map(n=>root.getObjectByName('wheel_'+n)!),.914);
  for(const a of parts.assemblies.filter(a=>a.name.startsWith('door'))){
   const shell=a.members.find(p=>p.mesh.name.endsWith('InnerShell'))!.mesh;assert.ok(shell);const sb=new T.Box3().setFromBufferAttribute(shell.userData.wreckRest);
   assert.ok(sb.min.x>=a.bounds.min.x-1e-5&&sb.max.x<=a.bounds.max.x+1e-5);
   const before=Array.from(shell.geometry.attributes.position.array),contact=a.bounds.getCenter(new T.Vector3()),direction=new T.Vector3(a.name.endsWith('left')?1:-1,0,0);
   for(let i=0;i<4;i++)dentGeometry(shell,contact,direction,27);assert.notDeepEqual(Array.from(shell.geometry.attributes.position.array),before);assert.ok(Array.from(shell.geometry.attributes.position.array).every(Number.isFinite));
   repairWreckGeometry(shell);assert.deepEqual(Array.from(shell.geometry.attributes.position.array),before);
  }
 });
}
test('preceding classic sources remain recoverable without changing historical revisions',()=>verifyClassicClosuresRevision());

for(const kind of ['muscle','wagon']as const)test(kind+' wheelhouse closes the inner wing while clearing the production tire',async()=>{
 const root=(await loadCarWithoutImages(kind)).scene;root.updateMatrixWorld(true);
 const liner=root.getObjectByName('Structure_front_wheelhouses') as T.Mesh;assert.ok(liner);
 for(const side of [-1,1]){
  for(const z of [1.0,1.2,1.8]){const hit=new T.Raycaster(new T.Vector3(0,.87,z),new T.Vector3(side,0,0)).intersectObject(liner,false)[0];assert.ok(hit,'Upper inner wing must block see-through gap at '+z);assert.ok(Math.abs(hit.point.x)<.81);}
  const wheel=root.getObjectByName('wheel_F'+(side<0?'L':'R'))!;
  const hit=new T.Raycaster(wheel.position.clone(),new T.Vector3(0,1,0)).intersectObject(liner,false)[0];assert.ok(hit);assert.ok(hit.distance>.415&&hit.distance<.44,'Liner must clear the 375 mm tire');
 }
});

test('engine covers and air cleaners retain rigid engine response while wheelhouses remain deformable sheet metal',()=>{
 for(const name of ['Structure engine block','Structure engine valve cover -1','Structure valve cover 1','Structure engine air cleaner lid','Structure air cleaner','Structure engine casting rib 1 5'])assert.equal(constructionRole(name),'engine',name);
 for(const name of ['Structure front wheelhouses','Structure engine bay side -1'])assert.equal(constructionRole(name),'skin',name);
 assert.equal(constructionRole('Structure radiator top'),'radiator');
});
