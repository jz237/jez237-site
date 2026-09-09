import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Box3,Vector3} from 'three';
test('GLB loads all separate assemblies with finite geometry and bounded draw count',async()=>{const f=readFileSync(new URL('../public/cabinet.glb',import.meta.url));const {scene}=await new GLTFLoader().parseAsync(f.buffer.slice(f.byteOffset,f.byteOffset+f.byteLength),'');for(const name of ['chassis','left_panel','right_panel','back_panel','crt','controls','coin','logic','power','speaker','ventilation','marquee','details','crt_screen','joystick','fan_rotor','travelling_coin'])assert.ok(scene.getObjectByName(name),name);let meshes=0;scene.traverse(o=>{if(o.isMesh){meshes++;const a=o.geometry.attributes.position.array;assert.ok(a.every(Number.isFinite),o.name);}});assert.ok(meshes<110,`${meshes} draw calls`);const s=new Box3().setFromObject(scene).getSize(new Vector3());assert.ok(s.y>3.2&&s.y<3.5);assert.ok(s.x>1.3&&s.x<1.6);console.log(`Model: ${meshes} meshes, ${f.length} bytes, ${s.toArray().map(x=>x.toFixed(2)).join(' × ')} units`);});
