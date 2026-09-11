import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Box3,Vector3} from 'three';
test('GLB loads all separate assemblies with finite geometry and bounded draw count',async()=>{const f=readFileSync(new URL('../public/cabinet.glb',import.meta.url));const {scene}=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(f.buffer.slice(f.byteOffset,f.byteOffset+f.byteLength),'');for(const name of ['chassis','left_panel','right_panel','back_panel','crt','controls','coin','logic','power','speaker','ventilation','marquee','details','crt_screen','joystick','travelling_coin'])assert.ok(scene.getObjectByName(name),name);let meshes=0;scene.traverse(o=>{if(o.isMesh){meshes++;const a=o.geometry.attributes.position.array;assert.ok(a.every(Number.isFinite),o.name);}});assert.ok(meshes<240,`${meshes} draw calls`);const s=new Box3().setFromObject(scene).getSize(new Vector3());assert.ok(s.y>3.2&&s.y<3.5);assert.ok(s.x>1.18&&s.x<1.28);assert.ok(f.length<6000000,'Compressed geometry budget');console.log(`Model: ${meshes} meshes, ${f.length} bytes, ${s.toArray().map(x=>x.toFixed(2)).join(' × ')} units`);});

import {cabinetRoot} from '../src/model.ts';
import {offsets} from '../src/data.ts';
test('curved CRT cover stays ahead of every phosphor vertex without changing the display shape',async()=>{
 const f=readFileSync(new URL('../public/cabinet.glb',import.meta.url));const {scene}=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(f.buffer.slice(f.byteOffset,f.byteOffset+f.byteLength),'');
 const screen=scene.getObjectByName('crt_screen'),cover=scene.getObjectByName('crt_cover_glass');
 assert(cover);assert.equal(cover.parent,screen.parent);assert(cover.position.z>screen.position.z);assert(cover.position.z-screen.position.z<.02);
 const a=screen.geometry.attributes.position,b=cover.geometry.attributes.position;assert.equal(a.count,b.count);
 for(let i=0;i<a.count;i++)assert(Math.abs(a.getZ(i)-b.getZ(i))<.0001);
 assert(cover.material.transparent);assert(cover.material.opacity<.1);
 const marquee=scene.getObjectByName('marquee_cover_glass');assert(marquee.position.z>scene.getObjectByName('marquee_print').position.z);
});
test('runtime root exposes all animated assemblies directly, with unique explosion targets',async()=>{const f=readFileSync(new URL('../public/cabinet.glb',import.meta.url));const {scene}=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(f.buffer.slice(f.byteOffset,f.byteOffset+f.byteLength),'');const root=cabinetRoot(scene);assert.equal(root.children.length,13);for(const part of root.children)assert.ok(offsets[part.name],part.name);assert.ok(root.children.some(x=>x.name==='crt'));assert.ok(root.children.some(x=>x.name==='logic'));assert.notEqual(offsets.left_panel[0],offsets.right_panel[0]);});

test('all seven control caps clear the rear bezel and remain inside the deck edges',async()=>{const f=readFileSync(new URL('../public/cabinet.glb',import.meta.url));const {scene}=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(f.buffer.slice(f.byteOffset,f.byteOffset+f.byteLength),'');for(let i=0;i<7;i++){const b=scene.getObjectByName('button_'+i);assert(b,`button ${i}`);const bounds=new Box3().setFromObject(b);const bezel=new Box3().setFromObject(scene.getObjectByName('monitor_bezel'));assert(!bounds.intersectsBox(bezel),'caps clear the remounted front bezel');assert(bounds.max.x<.55&&bounds.min.x>-.60,'caps clear side brackets');}for(const i of [5,6])assert.equal(scene.getObjectByName('button_'+i).material.name,'button_red');});
