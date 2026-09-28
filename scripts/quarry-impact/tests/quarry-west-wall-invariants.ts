import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import * as T from 'three';
import {cliffGeometry, overlapsQuarryWestWall, quarryWestWallGeometry, type ColliderSpec, type MeshData} from '../src/quarry-layout';
const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url));
export const westBefore=JSON.parse(read('tests/fixtures/quarry-west-wall-baseline.json').toString());
export const westBase=JSON.parse(read('source/models/quarry-west-wall-base.json').toString());
export const westData=()=>JSON.parse(read('src/quarry-west-wall-collision.json').toString());
export const westHash=(b:Uint8Array|string)=>createHash('sha256').update(b).digest('hex');
export const westArrayHash=(a:ArrayBufferView)=>westHash(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));
const edits=JSON.parse(read('source/west-wall-source-edits.json').toString());
/** Reverse only declared integration edits and require the frozen full-file SHA. */
export function stripWestSource(file:string,bytes:Buffer){
  if(!edits[file]||!bytes.includes(Buffer.from('WestWall'))&&!bytes.includes(Buffer.from('westWall')))return bytes;
  let source=bytes.toString();
  for(const {before,after} of [...edits[file]].reverse()){
    assert.ok(after.length>0);assert.equal(source.split(after).length,2,'unique west integration: '+file);
    source=source.replace(after,before);
  }
  const restored=Buffer.from(source);assert.equal(westHash(restored),westBefore.files[file],file+': every unrelated byte stays exact');return restored;
}
export function restoreWestWallCliffs<G extends MeshData>(g:G):G{
  assert.equal(westArrayHash(g.positions),westBefore.cliff.positions);
  if(westArrayHash(g.indices)===westBefore.cliff.indices)return g;
  assert.equal(westArrayHash(g.indices),westArrayHash(new Uint32Array(westBefore.cliff.retainedIndicesAfterReplacement)),'only western cells may be removed');
  const indices:number[]=[];
  for(let band=0;band<30;band++)for(let cell=0;cell<360;cell++){
    if((cell>=118&&cell<172)||cell>=350||cell<55)continue;
    const b=band*722+cell*2;indices.push(b,b+1,b+2,b+2,b+1,b+3);
  }
  assert.equal(westArrayHash(new Uint32Array(indices)),westBefore.cliff.indices);
  return {...g,indices:new Uint32Array(indices)};
}
let savedScatter:Map<string,ColliderSpec>;
export function assertWestWallEvolution(layout:ColliderSpec[]){
  if(!layout.some(s=>s.id==='quarry-west-wall'))return layout;
  const current=new Map(layout.map(s=>[s.id,s]));assert.equal(current.size,layout.length);
  const data=westData(),surface=quarryWestWallGeometry();
  assert.deepEqual(current.get('quarry-west-wall'),{id:'quarry-west-wall',shape:'mesh',p:{x:0,y:0,z:0},data:surface,friction:.85});
  const added=new Set(['quarry-west-wall']);
  for(const solid of data.solids){const id='quarry-west-wall-solid-'+solid.id;assert.ok(!added.has(id));added.add(id);assert.deepEqual(current.get(id),{id,shape:'hull',p:{x:0,y:0,z:0},points:new Float32Array(solid.points),friction:.85});}
  if(!savedScatter){const bytes=read(westBefore.frozenScatter.file);assert.equal(westHash(bytes),westBefore.frozenScatter.sha256);const decoded=gunzipSync(bytes);assert.equal(westHash(decoded),westBefore.frozenScatter.decodedSHA256);savedScatter=new Map(JSON.parse(decoded.toString()).map((s:any)=>[s.id,{...s,points:new Float32Array(s.points)}]));}
  const footprints=new Map<string,{x:number;z:number;padding:number}>();
  const rockBytes=read('tests/fixtures/quarry-west-wall-rock-placements.json');assert.equal(westHash(rockBytes),'3f4dbb35eb760bdd96872848c788739a552e8cece41db6c2720377784c08cefe');
  const rockSource=JSON.parse(rockBytes.toString());assert.equal(rockSource.sourceSHA256,westBefore.files['src/quarry-layout.ts']);
  for(const group of rockSource.rocks)for(const p of group.placements)footprints.set('scanned-rock-'+group.variant+'-'+p.colliderIndex,{...p,padding:Math.max(p.sx,p.sz)*.65});
  for(const p of westBase.scatter.scree)footprints.set('scree-'+p.colliderIndex,{...p,padding:Math.max(p.sx,p.sz)});
  const restored:ColliderSpec[]=[];let removed=0;
  for(const old of westBefore.colliders){let spec=current.get(old.id);
    if(old.id==='quarry-cliffs'){assert.ok(spec?.shape==='mesh');spec={...spec,data:restoreWestWallCliffs(spec.data)};}
    else if(footprints.has(old.id)){const p=footprints.get(old.id)!;assert.equal(!!spec,!overlapsQuarryWestWall(p.x,p.z,p.padding),old.id+': only intersecting legacy scatter may disappear');if(!spec){spec=savedScatter.get(old.id);removed++;}}
    assert.ok(spec,old.id);assert.equal(westHash(JSON.stringify(spec)),old.sha256,old.id+': exact previous collision');restored.push(spec);
  }
  assert.equal(layout.length,restored.length-removed+added.size);
  for(const id of current.keys())assert.ok(added.has(id)||westBefore.colliders.some((s:any)=>s.id===id));
  return restored;
}
/** Independently validate actual changed render buffers before restoring old descriptors. */
export function restoreWestWallObjects(objects:any[]){
  const restored=structuredClone(objects),old=westBefore.scene.objects;
  assert.equal(restored.length,old.length);
  const g=cliffGeometry(),mesh=new T.BufferGeometry();mesh.setAttribute('position',new T.BufferAttribute(g.positions,3));mesh.setIndex(new T.BufferAttribute(g.indices,1));mesh.computeVertexNormals();
  const matrixBytes=(items:any[])=>{const values:number[]=[],dummy=new T.Object3D();for(const p of items){dummy.position.set(p.x,p.y,p.z);dummy.scale.set(p.sx,p.sy,p.sz);dummy.rotation.set(p.rx,p.ry,p.rz);dummy.updateMatrix();values.push(...dummy.matrix.elements);}return new Float32Array(values);};
  const full=westBase.scatter.scree,keep=full.filter((p:any)=>!overlapsQuarryWestWall(p.x,p.z,Math.max(p.sx,p.sz)));
  const oldScreeHash=westArrayHash(matrixBytes(full));let wall=0,scree=0;
  for(let i=0;i<restored.length;i++){
    const next=restored[i],previous=old[i];
    if(previous.geometry.attributes.position.sha256===westBefore.cliff.positions){
      assert.equal(next.geometry.indices.sha256,westArrayHash(g.indices));assert.equal(next.geometry.indices.count,g.indices.length);
      assert.equal(next.geometry.attributes.normal.sha256,westArrayHash(mesh.attributes.normal.array));
      next.geometry.indices=structuredClone(previous.geometry.indices);next.geometry.attributes.normal=structuredClone(previous.geometry.attributes.normal);wall++;
    }
    if(previous.instanceMatrix===oldScreeHash){assert.equal(next.instanceCount,keep.length);assert.equal(next.instanceMatrix,westArrayHash(matrixBytes(keep)));next.instanceCount=previous.instanceCount;next.instanceMatrix=previous.instanceMatrix;scree++;}
    assert.deepEqual(next,previous,'all other constructor geometry/materials/RNG transforms remain exact at '+i);
  }
  mesh.dispose();assert.equal(wall,1);assert.equal(scree,1);return restored;
}
