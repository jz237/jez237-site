import test from 'node:test';
import {restoreWreckBytes} from './wreck-invariants';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadWorkyard,WORKYARD_PLACEMENTS} from '../src/scenery-workyard';
import {landscapeHeight,quarryColliderLayout} from '../src/quarry-layout';
import {captureArenaFloor} from '../tools/arena-floor-audit';
import {restoreWorkyardBytes} from './workyard-invariants';
const read=(p:string)=>fs.readFileSync(new URL('../'+p,import.meta.url));
const hash=(b:Uint8Array|string)=>createHash('sha256').update(b).digest('hex');
const parse=async()=>{const b=read('public/models/quarry-workyard.glb');return new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');};
test('actual workyard has six detailed prototypes with finite UV/normal/color buffers and cheaper distant LODs',async()=>{
  const model=await parse(),groups=new Map<string,{tri:number;lod:number;asset:string}>();
  model.scene.traverse(o=>{if(!(o instanceof T.Mesh))return;const match=/^(container|excavator|conveyor|workshop|silo|barrier)_LOD([01])_/.exec(o.name);assert.ok(match,o.name);
    const g=o.geometry;for(const attr of ['position','normal','uv','color']){assert.ok(g.attributes[attr],o.name+' '+attr);assert.ok(Array.from(g.attributes[attr].array).every(Number.isFinite));}
    assert.equal(g.attributes.normal.count,g.attributes.position.count);assert.equal(g.attributes.uv.count,g.attributes.position.count);
    const key=match[1]+match[2],group=groups.get(key)??{tri:0,lod:+match[2],asset:match[1]};group.tri+=(g.index?.count??g.attributes.position.count)/3;groups.set(key,group);
  });assert.equal(groups.size,12);for(const g of groups.values())if(g.lod===0){assert.ok(g.tri>300,g.asset);assert.ok(groups.get(g.asset+'1')!.tri<g.tri*.8,g.asset+' genuinely simplified');}
  const manifest=JSON.parse(read('source/models/quarry-workyard-manifest.json').toString());for(const f of manifest.files){assert.equal(read(f.path).length,f.bytes);assert.equal(hash(read(f.path)),f.sha256);}
  const photos=JSON.parse(read('public/assets/workyard/manifest.json').toString());assert.equal(photos.length,9);
  for(const p of photos){assert.equal(p.license,'CC0-1.0');assert.match(p.source,/^https:\/\/polyhaven.com\/a\//);assert.equal(hash(read('public/assets/workyard/'+p.file)),p.sha256);}
});
test('real workyard loader places all assets, LODs and arena barriers; surface dressing follows terrain',async()=>{
  const load=GLTFLoader.prototype.loadAsync,tex=T.TextureLoader.prototype.load,texAsync=T.TextureLoader.prototype.loadAsync;
  GLTFLoader.prototype.loadAsync=async()=>parse();T.TextureLoader.prototype.load=function(url){const t=new T.Texture();t.name=url;return t;};T.TextureLoader.prototype.loadAsync=async function(url){return this.load(url);};
  try{
    const parent=new T.Group(),barriers=new T.Group(),lods=await loadWorkyard(parent,barriers);assert.equal(lods.length,11);
    for(let i=0;i<lods.length;i++){const l=lods[i];assert.deepEqual(l.position.toArray(),WORKYARD_PLACEMENTS[i].p);assert.equal(l.levels.length,2);assert.ok(l.levels.every(level=>level.object.children.length>0));const c=new T.PerspectiveCamera();c.position.copy(l.position).add(new T.Vector3(0,0,100));c.updateMatrixWorld();parent.updateMatrixWorld(true);l.update(c);assert.equal(l.getCurrentLevel(),1);}
    assert.ok(barriers.children.length>=3);for(const b of barriers.children){assert.ok(b instanceof T.InstancedMesh);assert.equal(b.count,66);const m=new T.Matrix4(),p=new T.Vector3();for(let i=0;i<66;i++){b.getMatrixAt(i,m);p.setFromMatrixPosition(m);assert.ok(Math.abs(Math.hypot(p.x,p.z)-46)<1e-5);assert.equal(p.y,0);}}
    const ground=parent.children.filter(o=>o.name.startsWith('yard-ground-'));assert.equal(ground.length,4);
    for(const o of ground){const g=(o as T.Mesh).geometry,p=g.attributes.position,a=g.attributes.yardAlpha;for(let i=0;i<p.count;i++){assert.ok(Math.abs(p.getY(i)-landscapeHeight(p.getX(i),p.getZ(i))-.025)<.0001);assert.ok(a.getX(i)>=0&&a.getX(i)<=.6);if(Math.hypot(p.getX(i),p.getZ(i))<46.5)assert.equal(a.getX(i),0);}}
    const stones=parent.getObjectByName('yard-foundation-chips')as T.InstancedMesh;assert.ok(stones.count>180&&stones.count<=280);
    for(let i=0;i<stones.count;i++){const m=new T.Matrix4(),p=new T.Vector3(),q=new T.Quaternion(),s=new T.Vector3();stones.getMatrixAt(i,m);m.decompose(p,q,s);assert.ok(Math.hypot(p.x,p.z)>=49);assert.ok(Math.abs(p.y-landscapeHeight(p.x,p.z)+.012)<.001);assert.ok(s.y<=.1451);}
  }finally{GLTFLoader.prototype.loadAsync=load;T.TextureLoader.prototype.load=tex;T.TextureLoader.prototype.loadAsync=texAsync;}
});
test('current constructor preserves terrain, roads, arena, water, colliders and scenery random sequence',async()=>{
  const current=await captureArenaFloor(),previous=await captureArenaFloor({historicalWorkyard:true});
  assert.deepEqual(current.arena,previous.arena);
  // The subsequent reference pass intentionally changes water albedo/opacity.
  // Retain this milestone's full physical/shoreline audit, including buffers,
  // matrices, render order and both water/wet-ring geometry.
  const geometryOnly=({materials:_materials,...rest}:any)=>rest;
  assert.deepEqual(current.puddles.map(geometryOnly),previous.puddles.map(geometryOnly));assert.deepEqual(current.colliders,previous.colliders);assert.deepEqual(current.random,previous.random);
  const protectedMeshes=previous.objects.filter(o=>o.materials.some((m:any)=>/^(authored-asphalt-circuit|north-woodland-floor)/.test(m.name)||/^north-woodland-floor/.test(m.shader?.programKey)));
  assert.ok(protectedMeshes.length>=3);for(const mesh of protectedMeshes)assert.deepEqual(current.objects.find(o=>o.geometry.attributes.position.sha256===mesh.geometry.attributes.position.sha256),mesh);
  assert.ok(current.objects.some(o=>o.name.startsWith('workyard-fence')));assert.equal(current.colliders.length,quarryColliderLayout().length);
});
test('all 23 deployed simulation inputs remain byte-identical; previous source fixtures are recoverable',()=>{
  const record=JSON.parse(read('source/coupe-realism-physics.json').toString());assert.equal(Object.keys(record.sourceHashes).length,23);
  for(const [p,expected]of Object.entries(record.sourceHashes))assert.equal(hash(read(p)),expected,p);
  const revision=JSON.parse(read('source/workyard-revision.json').toString());assert.ok(Object.keys(revision.files).length>=6);
  for(const [p,entry]of Object.entries<any>(revision.files)){assert.equal(hash(restoreWreckBytes(p,read(p))),entry.after);assert.equal(hash(restoreWorkyardBytes(p,read(p))),entry.before);}
});
