import {restoreGarageBytes} from './garage-invariants';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {CHASE_VIEW,chaseComposition} from '../src/quarry-art-direction';
import {referenceCrestPlants} from '../src/scenery-reference-vegetation';
import {landscapeHeight} from '../src/quarry-layout';
import {trackPoint} from '../src/rules';
import {restoreReferenceBytes} from './reference-invariants';
const read=(p:string)=>fs.readFileSync(new URL('../'+p,import.meta.url));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const revision=JSON.parse(read('source/reference-overhaul-revision.json').toString());
async function model(file:string){const b=read('public/models/'+file+'.glb');return new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');}
test('reference construction leaves every prior model and deployed Worker input byte-identical',()=>{
 for(const [p,h]of Object.entries<string>(revision.protectedModels))assert.equal(hash(read('public/'+p)),h,p);
 for(const [p,h]of Object.entries<string>(revision.protectedWorker))assert.equal(hash(restoreGarageBytes(p,read(p))),h,p);
 for(const [p,e]of Object.entries<any>(revision.files)){assert.equal(hash(restoreGarageBytes(p,read(p))),e.after,p);assert.equal(hash(restoreReferenceBytes(p,read(p))),e.before,p);}
});
test('Blender escarpment includes complete near/far rock sections with bounded finite geometry',async()=>{
 const gltf=await model('arena-escarpment'),sections=new Map<string,Set<string>>();let triangles=0;
 gltf.scene.updateMatrixWorld(true);gltf.scene.traverse(o=>{if(!(o instanceof T.Mesh))return;const m=/ArenaRock_(\d+)_(near|far)/.exec(o.name);assert.ok(m);if(!sections.has(m[1]))sections.set(m[1],new Set());sections.get(m[1])!.add(m[2]);const p=o.geometry.attributes.position;assert.ok(Array.from(p.array).every(Number.isFinite));o.geometry.computeBoundingBox();const box=o.geometry.boundingBox!.clone().applyMatrix4(o.matrixWorld);assert.ok(box.min.y>-6&&box.max.y<70);triangles+=(o.geometry.index?.count??p.count)/3;});
 assert.equal(sections.size,15);assert.ok([...sections.values()].every(s=>s.size===2));assert.ok(triangles>100000&&triangles<500000);
});
test('shared Blender wheel machining and mast optics preserve their authoring hashes and sensible metre scale',async()=>{
 for(const name of ['arena-industrial','wheel-machining']){const manifest=JSON.parse(read('source/models/'+name+'-manifest.json').toString());assert.equal(hash(read('public/models/'+name+'.glb')),manifest.assetSha256);assert.equal(hash(read('source/models/'+name+'.blend')),manifest.blendSha256);const gltf=await model(name),bounds=new T.Box3().setFromObject(gltf.scene);assert.ok(bounds.getSize(new T.Vector3()).y<(name==='wheel-machining'?.3:10));assert.ok(bounds.getSize(new T.Vector3()).length()>.1);}
});
test('playable reference composition stays upright and places the car below the horizon across directions',()=>{
 for(const yaw of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const p=new T.Vector3(18,.843,-12),f=new T.Vector3(Math.sin(yaw),0,Math.cos(yaw)),view=chaseComposition(p,f,0),camera=new T.PerspectiveCamera(CHASE_VIEW.fov,16/9,.1,850);camera.position.copy(view.position);camera.lookAt(view.target);camera.updateMatrixWorld(true);const projected=p.clone().project(camera);assert.ok(Math.abs(projected.x)<.001);assert.ok(projected.y<-.1&&projected.y>-.75);assert.ok(Math.abs(camera.up.y-1)<.001);}
});
test('irregular crest conifers sit on quarry terrain and do not encroach on the circuit',()=>{
 const plants=referenceCrestPlants();assert.equal(plants.length,42);assert.deepEqual(plants,referenceCrestPlants());assert.ok(new Set(plants.map(p=>p.height)).size>35);
 for(const plant of plants){assert.equal(plant.ground,landscapeHeight(plant.x,plant.z));for(let i=0;i<120;i++){const road=trackPoint(i/120);assert.ok(Math.hypot(road.x-plant.x,road.z-plant.z)>20);}}
});
