import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Box3,Vector3} from 'three';
test('GLB loads all separate assemblies with finite geometry and bounded draw count',async()=>{const f=readFileSync(new URL('../public/cabinet.glb',import.meta.url));const {scene}=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(f.buffer.slice(f.byteOffset,f.byteOffset+f.byteLength),'');for(const name of ['chassis','left_panel','right_panel','back_panel','crt','controls','coin','logic','power','speaker','ventilation','marquee','details','crt_screen','joystick','fan_rotor','travelling_coin'])assert.ok(scene.getObjectByName(name),name);let meshes=0;scene.traverse(o=>{if(o.isMesh){meshes++;const a=o.geometry.attributes.position.array;assert.ok(a.every(Number.isFinite),o.name);}});assert.ok(meshes<180,`${meshes} draw calls`);const s=new Box3().setFromObject(scene).getSize(new Vector3());assert.ok(s.y>3.2&&s.y<3.5);assert.ok(s.x>1.3&&s.x<1.6);assert.ok(f.length<2200000,'Compressed geometry budget');console.log(`Model: ${meshes} meshes, ${f.length} bytes, ${s.toArray().map(x=>x.toFixed(2)).join(' × ')} units`);});

import {cabinetRoot} from '../src/model.ts';
import {offsets} from '../src/data.ts';
test('runtime root exposes all animated assemblies directly, with unique explosion targets',async()=>{const f=readFileSync(new URL('../public/cabinet.glb',import.meta.url));const {scene}=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(f.buffer.slice(f.byteOffset,f.byteOffset+f.byteLength),'');const root=cabinetRoot(scene);assert.equal(root.children.length,13);for(const part of root.children)assert.ok(offsets[part.name],part.name);assert.ok(root.children.some(x=>x.name==='crt'));assert.ok(root.children.some(x=>x.name==='logic'));assert.notEqual(offsets.left_panel[0],offsets.right_panel[0]);});
