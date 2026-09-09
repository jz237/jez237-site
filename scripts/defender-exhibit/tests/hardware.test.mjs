import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {boardLayouts} from '../hardware-layout.mjs';

test('selected April 1981 configuration retains 48 KiB DRAM and the empty red-label ROM position',()=>{
 const cpu=boardLayouts.cpu.chips;assert.equal(cpu.filter(c=>c.family==='4116').length,24);
 assert.equal(cpu.find(c=>c.ref==='2I').family,'6809E');assert.equal(cpu.find(c=>c.ref==='1E').family,'5101');
 assert.deepEqual(cpu.filter(c=>c.family==='7641').map(c=>c.ref).sort(),['3E','3K']);
 const rom=boardLayouts.rom.chips.filter(c=>c.socket);assert.equal(rom.filter(c=>!c.empty).length,11);assert.equal(rom.find(c=>c.empty).ref,'IC5');
 for(const layout of Object.values(boardLayouts)){assert.equal(new Set(layout.chips.map(c=>c.ref)).size,layout.chips.length,'No duplicate physical positions');assert(layout.chips.every(c=>Number.isFinite(c.u)&&Number.isFinite(c.v)&&c.u>0&&c.u<1&&c.v>0&&c.v<1));}
});

test('optimized GLB preserves distinct board label atlases and four individually inspectable boards',async()=>{
 const f=readFileSync(new URL('../public/cabinet.glb',import.meta.url));const {scene}=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(f.buffer.slice(f.byteOffset,f.byteOffset+f.byteLength),'');
 const names=new Set();scene.traverse(o=>{if(o.isMesh&&o.material.name.startsWith('hardware_labels_'))names.add(o.material.name)});
 assert.deepEqual([...names].sort(),['cpu','interface','power','rom','sound'].map(n=>'hardware_labels_'+n).sort());
 for(const id of ['cpu','rom','interface','sound']){const board=scene.getObjectByName('board_'+id);assert(board);assert(board.userData.inspectId);assert(board.children.length<25,'Board geometry must remain batched');}
 assert.equal(scene.getObjectByName('fan_rotor'),undefined,'No unsupported powered fan');
});
