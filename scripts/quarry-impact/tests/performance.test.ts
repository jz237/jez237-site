import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import {freezeSceneryTransforms} from '../src/render-work';
import {dentGeometry,prepareWreckGeometry,repairWreckGeometry} from '../src/wreck-geometry';
import * as coupe from '../src/coupe-realism';
import * as construction from '../src/vehicle-construction';
import {restorePerformanceBytes} from './performance-invariants';
import {restoreDriveFeelBytes} from './drive-feel-invariants';
import {Sound} from '../src/audio';
import {gunzipSync} from 'node:zlib';

test('the optimization preserves every preceding source snapshot',()=>{
 const read=(p:string)=>fs.readFileSync(new URL('../'+p,import.meta.url)),hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
 const manifest=JSON.parse(read('source/performance-revision.json').toString());
 for(const [p,e]of Object.entries<any>(manifest.files)){assert.equal(hash(restoreDriveFeelBytes(p,read(p))),e.after,p);assert.equal(hash(restorePerformanceBytes(p,read(p))),e.before,p);}
});

test('static transform reuse keeps world poses and LOD visibility while dynamic siblings move',()=>{
 const scene=new T.Scene(),root=new T.Group(),lod=new T.LOD(),dynamic=new T.Object3D();scene.add(root,dynamic);root.position.set(4,2,-3);root.rotation.y=.73;root.scale.set(2,1,3);
 lod.position.set(6,1,2);lod.autoUpdate=false;const near=new T.Mesh(new T.BoxGeometry(),new T.MeshBasicMaterial()),far=near.clone();near.rotation.x=.4;lod.addLevel(near,0);lod.addLevel(far,20);root.add(lod);
 scene.updateMatrixWorld(true);const expected=near.matrixWorld.clone();freezeSceneryTransforms(root);dynamic.position.x=12;scene.updateMatrixWorld(true);assert.deepEqual(near.matrixWorld.elements,expected.elements);assert.equal(dynamic.matrixWorld.elements[12],12);
 const camera=new T.PerspectiveCamera();camera.position.set(0,0,100);camera.updateMatrixWorld(true);lod.update(camera);assert.equal(far.visible,true);assert.equal(near.visible,false);assert.deepEqual(near.matrixWorld.elements,expected.elements);
});

test('impact bounds preserve exact dent results through transformed, repeated and repaired hits',()=>{
 // Compare the current construction model with its unculled counterpart;
 // preceding algorithms remain protected by the frozen snapshot test above.
 const source=fs.readFileSync(new URL('../src/wreck-geometry.ts',import.meta.url)).toString().replace(/if \(impactBounds\.copy\([^\n]+return 0;/,'');
 const exports:any={};runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:(name:string)=>name==='three'?T:name.includes('construction')?construction:coupe});
 for(let variant=0;variant<3;variant++){
  const make=()=>{const root=new T.Group(),mesh=new T.Mesh(new T.BoxGeometry(1.7,1.1,.1,20,12,2),new T.MeshStandardMaterial());mesh.name='panel_test';mesh.position.set(variant-1,.8,.2);mesh.rotation.set(.2,.3*variant,.1);mesh.scale.set(1.1,.8,1.3);root.add(mesh);prepareWreckGeometry(root);return mesh;};
  const actual=make(),expected=make();const direction=new T.Vector3(.1,0,-1).normalize();
  for(let round=0;round<2;round++){
   for(const point of [new T.Vector3(9,9,9),new T.Vector3(.3,1,.1),new T.Vector3(-.6,.8,.2),new T.Vector3(.2,1,-.2)]){
    assert.equal(dentGeometry(actual,point,direction,18),exports.dentGeometry(expected,point,direction,18));
    for(const attribute of ['position','normal','impactWear'])assert.deepEqual(actual.geometry.attributes[attribute].array,expected.geometry.attributes[attribute].array);
   }
   repairWreckGeometry(actual);exports.repairWreckGeometry(expected);
  }
 }
});

test('prefetched sound and concurrent starts share one decode, with no playback during preload',async()=>{
 const oldFetch=globalThis.fetch,oldContext=(globalThis as any).AudioContext;let requests=0,contexts=0,decoded=0,started=0;
 const gain=()=>({value:0});const node=()=>({gain:gain(),connect(){return this;}});
 class Context{destination=node();constructor(){contexts++;}resume(){return Promise.resolve();}createGain(){return node();}createDynamicsCompressor(){return {...node(),threshold:gain(),knee:gain(),ratio:gain()};}decodeAudioData(){decoded++;return Promise.resolve({duration:1});}createBufferSource(){return{...node(),start(){started++;}};}createPanner(){return node();}}
 (globalThis as any).AudioContext=Context;
 globalThis.fetch=async input=>{requests++;return String(input).endsWith('manifest.json')?new Response(JSON.stringify([{id:'ambience',file:'a.ogg'},{id:'impact',file:'b.ogg'}])):new Response(new Uint8Array([1,2,3]));};
 try{const sound=new Sound();await sound.preload();assert.equal(contexts,0);assert.equal(started,0);await Promise.all([sound.init(),sound.init()]);assert.equal(requests,3);assert.equal(contexts,1);assert.equal(decoded,2);assert.equal(started,1);assert.equal(sound.buffers.size,2);await sound.init();assert.equal(decoded,2);}
 finally{globalThis.fetch=oldFetch;(globalThis as any).AudioContext=oldContext;}
});

test('packed models retain every geometry buffer and exact photographic image bytes',()=>{
 const read=(p:string)=>fs.readFileSync(new URL('../'+p,import.meta.url)),hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
 const packing=JSON.parse(read('source/model-packing.json').toString());
 const parse=(data:Buffer)=>{const json=JSON.parse(data.subarray(20,20+data.readUInt32LE(12)).toString());const offset=20+data.readUInt32LE(12);return {json,bin:data.subarray(offset+8,offset+8+data.readUInt32LE(offset))};};
 for(const entry of Object.values<any>(packing.models)){
  const raw=read('public/'+entry.source),zipped=read('public/'+entry.file);assert.equal(hash(raw),entry.sourceSha256);assert.equal(hash(zipped),entry.sha256);
  const source=parse(raw),packed=parse(gunzipSync(zipped));assert.deepEqual(packed.json.nodes,source.json.nodes);assert.deepEqual(packed.json.materials,source.json.materials);
  const imageViews=new Set((source.json.images??[]).map((image:any)=>image.bufferView).filter((n:any)=>n!==undefined));
  const views=source.json.bufferViews.filter((_:any,i:number)=>!imageViews.has(i));assert.equal(packed.json.bufferViews.length,views.length);
  for(let i=0;i<views.length;i++){const a=views[i],b=packed.json.bufferViews[i];assert.equal(a.byteLength,b.byteLength);assert.deepEqual(source.bin.subarray(a.byteOffset??0,(a.byteOffset??0)+a.byteLength),packed.bin.subarray(b.byteOffset??0,(b.byteOffset??0)+b.byteLength));}
  for(const image of entry.images){const bytes=read('public/'+image.file);assert.equal(hash(bytes),image.sha256);assert.equal(bytes.length,image.bytes);}
 }
});
