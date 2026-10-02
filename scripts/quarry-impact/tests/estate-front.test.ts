import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import * as T from 'three';
import {buildEstateAsset,buildPlayableEstateAsset} from '../src/estate-asset';import {loadCarWithoutImages} from '../tools/car-asset-audit';import {prepareWreckGeometry,dentGeometry,repairWreckGeometry} from '../src/wreck-geometry';import {WreckAttachments} from '../src/wreck-attachments';import {verifyEstateFrontRevision} from './estate-front-invariants';
const obj=readFileSync(new URL('../public/models/brightretro-muscle/FireGTO.obj',import.meta.url),'utf8');
const key=(p:T.Vector3)=>p.toArray().map(n=>n.toFixed(6)).join(',');
const points=(mesh:T.Mesh)=>{mesh.updateWorldMatrix(true,false);const p=mesh.geometry.getAttribute('position');return Array.from({length:p.count},(_,i)=>new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld));};
const authored=(name:string)=>/^panel_(?:hood_Estate|FrontValanceEstate|bumper_frontEstate)/.test(name);
test('estate hood has a continuous crown and shares the complete header seam, without donor scoop trim',()=>{
 const root=buildEstateAsset(obj),hood=root.getObjectByName('panel_hood_EstateStamping')as T.Mesh,header=root.getObjectByName('panel_FrontValanceEstateHeader')as T.Mesh;assert.ok(hood&&header);
 const edge=new Map<number,T.Vector3>();for(const p of points(hood))if(!edge.has(p.x)||edge.get(p.x)!.z<p.z)edge.set(p.x,p);
 const headerPoints=new Set(points(header).map(key));assert.ok(edge.size>=20);for(const p of edge.values())assert.ok(headerPoints.has(key(p)),`Unsealed hood edge ${key(p)}`);
 assert.equal(root.children.some(o=>o.name.startsWith('panel_hoodTrim')),false);
 for(const z of [.90,1.2,1.5,1.8,2.0]){
  const cast=(x:number)=>new T.Raycaster(new T.Vector3(x,2,z),new T.Vector3(0,-1,0)).intersectObject(root,true)[0];const centre=cast(0),shoulder=cast(.68);
  assert.equal(centre.object,hood);assert.equal(shoulder.object,hood);assert.ok(centre.point.y-shoulder.point.y>.015&&centre.point.y-shoulder.point.y<.04);
 }
});
test('front header is a closed section with actual lamp and grille apertures and finite detail geometry',()=>{
 const root=buildEstateAsset(obj),header=root.getObjectByName('panel_FrontValanceEstateHeader')as T.Mesh,p=header.geometry.getAttribute('position'),edges=new Map<string,number>();
 for(let i=0;i<p.count;i+=3)for(let j=0;j<3;j++){const k=[key(new T.Vector3().fromBufferAttribute(p,i+j)),key(new T.Vector3().fromBufferAttribute(p,i+(j+1)%3))].sort().join('|');edges.set(k,(edges.get(k)??0)+1);}
 assert.ok([...edges.values()].every(n=>n===2),'Header needs continuous returns around each opening');
 for(const x of [0,-.615,.615])assert.equal(new T.Raycaster(new T.Vector3(x,.755,3),new T.Vector3(0,0,-1)).intersectObject(header,false).length,0,'Paint must not fill the apertures');
 const face=root.children.filter(o=>o instanceof T.Mesh&&authored(o.name));
 for(const x of [-.75,-.615,-.5,0,.5,.615,.75])for(const y of [.595,.675,.755,.86])assert.ok(new T.Raycaster(new T.Vector3(x,y,3),new T.Vector3(0,0,-1)).intersectObjects(face,false).length,'The assembled nose must not have uncovered slots');
 for(const o of face){const g=(o as T.Mesh).geometry;for(const name of ['position','normal','uv'])assert.ok([...g.getAttribute(name).array].every(Number.isFinite));const a=g.getAttribute('position');for(let i=0;i<a.count;i+=3){const [x,y,z]=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(a,i+j));assert.ok(y.sub(x).cross(z.sub(x)).lengthSq()>1e-18,o.name+' degenerate triangle');}}
});
test('production front parts export exactly, dent locally, repair and keep hood and bumper hinges separate',async()=>{
 const source=buildPlayableEstateAsset(obj),root=(await loadCarWithoutImages('wagon')).scene;
 for(const o of source.children)if(o instanceof T.Mesh&&authored(o.name)){const exported=root.getObjectByName(o.name)as T.Mesh;assert.ok(exported,o.name);assert.deepEqual(Array.from(exported.geometry.attributes.position.array),Array.from(o.geometry.attributes.position.array));assert.ok(exported.matrixWorld.equals(o.matrixWorld));}
 prepareWreckGeometry(root);const attachments=new WreckAttachments(root,['FL','FR','RL','RR'].map(n=>root.getObjectByName('wheel_'+n)!),.914);
 const hood=attachments.assemblies.find(a=>a.name==='hood')!,bumper=attachments.assemblies.find(a=>a.name==='front-bumper')!;assert.ok(hood&&bumper);
 assert.ok(hood.members.some(m=>m.mesh.name==='panel_hood_EstateStamping'));for(const name of ['Chrome','Rubber','Plate'])assert.ok(bumper.members.some(m=>m.mesh.name==='panel_bumper_frontEstate'+name));
 const engine=root.getObjectByName('Structure_engine_block')as T.Mesh,before=engine.matrix.clone();attachments.hit(new T.Vector3(0,.9,1.4),new T.Vector3(0,-1,0),65);attachments.pose(.5,12);assert.ok(hood.members.some(m=>!m.mesh.matrix.equals(m.matrix)));assert.ok(engine.matrix.equals(before));
 for(const name of ['panel_hood_EstateStamping','panel_FrontValanceEstateHeader','panel_bumper_frontEstateChrome']){const mesh=root.getObjectByName(name)as T.Mesh,rest=Array.from(mesh.geometry.attributes.position.array);const at=new T.Box3().setFromBufferAttribute(mesh.userData.wreckRest).getCenter(new T.Vector3());assert.ok(dentGeometry(mesh,at,new T.Vector3(0,0,-1),35)>0);repairWreckGeometry(mesh);assert.deepEqual(Array.from(mesh.geometry.attributes.position.array),rest);}
 attachments.reset();for(const assembly of attachments.assemblies)for(const member of assembly.members)assert.ok(member.mesh.matrix.equals(member.matrix));
 let vertices=0;root.traverse(o=>{if(o instanceof T.Mesh)vertices+=o.geometry.attributes.position.count;});assert.ok(vertices<65000,`Fleet budget exceeded: ${vertices}`);
});
test('estate front refinement retains every preceding source hash',()=>verifyEstateFrontRevision());
