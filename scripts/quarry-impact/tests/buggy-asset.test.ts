import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {buildBuggyAsset} from '../src/buggy-asset';
import {BuggySuspension,buggyHub,buggyLinks} from '../src/buggy-suspension';
import {encodeVehicleGlb} from '../tools/vehicle-glb';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),key=(p:T.Vector3)=>p.toArray().map(x=>Number(x.toFixed(6))).join(',');

test('Ravine exports its original finite, outward geometry within the fleet asset budget',()=>{
 const root=buildBuggyAsset(),bytes=encodeVehicleGlb(root,()=>{throw Error('No external vehicle textures');},{generator:'Quarry Impact original Ravine 1800 open-frame buggy',copyright:'Original Quarry Impact vehicle artwork, 2026'});
 for(const name of ['buggy.glb','buggy-candidate.glb'])assert.deepEqual(bytes,readFileSync(new URL('../public/models/'+name,import.meta.url)));
 let vertices=0;const materials=new Set<T.Material>();
 root.traverse(o=>{if(!(o instanceof T.Mesh))return;const p=o.geometry.attributes.position,n=o.geometry.attributes.normal;vertices+=p.count;materials.add(o.material as T.Material);let volume=0;
  for(const a of Object.values(o.geometry.attributes))assert.ok([...a.array].every(Number.isFinite),o.name+' finite attributes');
  for(let i=0;i<p.count;i+=3){const q=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,i+j)),face=q[1].clone().sub(q[0]).cross(q[2].clone().sub(q[0]));assert.ok(face.lengthSq()>1e-18,o.name+' has no zero-area faces');volume+=q[0].dot(q[1].clone().cross(q[2]))/6;for(let j=0;j<3;j++)assert.ok(face.dot(new T.Vector3().fromBufferAttribute(n,i+j))>=-1e-10,o.name+' has outward shaded normals');}
  assert.ok(volume>0,o.name+' has outward winding');
 });
 assert.ok(vertices<65000,`Authored vertices ${vertices}`);assert.ok(materials.size<=16);
});

test('molded panels and roll cage are closed, with a genuinely open two-seat cockpit',()=>{
 const root=buildBuggyAsset();
 root.traverse(o=>{if(!(o instanceof T.Mesh)||!o.name.startsWith('panel_'))return;const p=o.geometry.attributes.position,edges=new Map<string,number>();for(let i=0;i<p.count;i+=3)for(let j=0;j<3;j++){const edge=[key(new T.Vector3().fromBufferAttribute(p,i+j)),key(new T.Vector3().fromBufferAttribute(p,i+(j+1)%3))].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}assert.ok([...edges.values()].every(n=>n===2),o.name+' has closed skins and ends');});
 const glass:T.Object3D[]=[];root.traverse(o=>{if(o.name.startsWith('glass_'))glass.push(o);});assert.equal(glass.length,0);assert.equal(root.getObjectByName('panel_RoofRavine'),undefined);
 const hits=new T.Raycaster(v(0,3,-.35),v(0,-1,0)).intersectObject(root,true);assert.ok(hits.length);assert.equal(hits[0].object.name,'Structure Ravine floor','No roof or invisible solid cockpit fills the cage');assert.ok(Math.abs(hits[0].point.y-.433)<1e-6);
 for(const side of [-1,1])assert.ok(root.getObjectByName('Interior Ravine bucket back '+side));
 assert.ok(root.getObjectByName('panel_CageFrontRavine'));assert.ok(root.getObjectByName('panel_CageMainRavine'));
});

test('all-terrain tyres, rear boxer and front fuel tank occupy the agreed physical locations',()=>{
 const root=buildBuggyAsset();
 for(const corner of ['FL','FR','RL','RR']as const){const wheel=root.getObjectByName('wheel_'+corner)!;assert.deepEqual(wheel.position.toArray(),buggyHub(corner).toArray());let maxRadius=0,maxWidth=0;
  wheel.updateMatrixWorld(true);const inverse=wheel.matrixWorld.clone().invert();wheel.traverse(o=>{if(!(o instanceof T.Mesh)||!o.name.startsWith('Tire_'))return;const toWheel=inverse.clone().multiply(o.matrixWorld),p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const q=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(toWheel);maxRadius=Math.max(maxRadius,Math.hypot(q.y,q.z));maxWidth=Math.max(maxWidth,Math.abs(q.x));}});
  assert.ok(Math.abs(maxRadius-.38)<1e-6,corner+' full tread matches wheel radius');assert.ok(maxWidth<=.15&&maxWidth>=.14,corner+' shoulder fits the track');
 }
 for(const name of ['Structure engine crankcase Ravine','Structure engine valve cover Ravine -1','Structure engine valve cover Ravine 1','Structure engine fan shroud Ravine','Structure engine air cleaner top Ravine']){const bounds=new T.Box3().setFromObject(root.getObjectByName(name)!);assert.ok(bounds.max.z<-.93,name+' remains behind the cockpit');assert.ok(bounds.max.y<1.0,name+' remains below the rear cage');}
 const tank=new T.Box3().setFromObject(root.getObjectByName('Structure Ravine front fuel tank')!);assert.ok(tank.min.z>.70&&tank.max.z<1.15);assert.ok(tank.max.y<.72);
});

test('each exposed suspension follows its wheel without stretching the other corners or shared geometry',()=>{
 const root=buildBuggyAsset(),other=buildBuggyAsset(),suspension=new BuggySuspension(root);suspension.update();
 const nodes:T.Object3D[]=[];root.traverse(o=>{if(o.name.startsWith('suspension_'))nodes.push(o);});const before=new Map(nodes.map(o=>[o.name,o.matrix.toArray()])),geometry=new Map(nodes.filter(o=>o instanceof T.Mesh).map(o=>[o.name,Array.from((o as T.Mesh).geometry.attributes.position.array)]));
 const wheel=root.getObjectByName('wheel_FL')!;wheel.position.y+=.18;wheel.quaternion.setFromEuler(new T.Euler(.7,.22,0,'YXZ'));suspension.update();root.updateMatrixWorld(true);
 assert.ok(nodes.filter(o=>o.name.startsWith('suspension_FL_')).every(o=>JSON.stringify(o.matrix.toArray())!==JSON.stringify(before.get(o.name))));
 for(const node of nodes.filter(o=>!o.name.startsWith('suspension_FL_')))assert.deepEqual(node.matrix.toArray(),before.get(node.name));
 for(const link of buggyLinks('FL'))if(!link.a.hub){const node=root.getObjectByName(link.name) as T.Mesh,p=node.geometry.attributes.position;let ymin=Infinity,ymax=-Infinity;for(let i=0;i<p.count;i++){ymin=Math.min(ymin,p.getY(i));ymax=Math.max(ymax,p.getY(i));}const fixed=v(0,ymin,0).applyMatrix4(node.matrixWorld);assert.ok(fixed.distanceTo(link.a.point)<1e-6,link.name+' fixed mount stays attached');assert.ok(ymax>ymin);}
 for(const [name,positions]of geometry)assert.deepEqual(Array.from((root.getObjectByName(name)as T.Mesh).geometry.attributes.position.array),positions);
 for(const corner of ['FR','RL','RR'])assert.deepEqual(root.getObjectByName('wheel_'+corner)!.position.toArray(),other.getObjectByName('wheel_'+corner)!.position.toArray());
 suspension.reset();for(const node of nodes)assert.deepEqual(node.matrix.toArray(),other.getObjectByName(node.name)!.matrix.toArray());
});
