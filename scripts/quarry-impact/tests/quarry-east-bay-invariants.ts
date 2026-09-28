import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import type {ColliderSpec,MeshData} from '../src/quarry-layout';
import {createSurfaceSampler} from '../src/quarry-surface-sampler';
export const eastBayBefore=JSON.parse(readFileSync(new URL('./fixtures/quarry-east-bay-baseline.json',import.meta.url),'utf8'));
export const eastBayBase=JSON.parse(readFileSync(new URL('../source/models/quarry-east-bay-base.json',import.meta.url),'utf8'));
export const eastBayData=()=>JSON.parse(readFileSync(new URL('../src/quarry-east-bay-collision.json',import.meta.url),'utf8'));
/** Root npm ci provides pinned sources; this ignored build artifact is recreated
 * only when absent, then checked against the immutable released hash. */
export async function prepareEastBayInputs(){
  const file=new URL('../multiplayer/.generated/rapier-worker.mjs',import.meta.url);
  if(!existsSync(file))await import(new URL('../multiplayer/prepare-rapier.mjs',import.meta.url).href);
  assert.equal(eastBayBytesHash(readFileSync(file)),eastBayBefore.workerInputs['multiplayer/.generated/rapier-worker.mjs']);
}
export const eastBayHash=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
export const eastBayBytesHash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex');
export const eastBayArrayHash=(a:ArrayBufferView)=>eastBayBytesHash(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));
let legacyScatter:Map<string,ColliderSpec>|undefined;
function frozenScatter(){
  if(!legacyScatter){
    const bytes=gunzipSync(readFileSync(new URL('./fixtures/quarry-east-bay-legacy-scatter.json.gz',import.meta.url)));
    assert.equal(eastBayBytesHash(bytes),'b7fa5f141f539e6597b86c2868c634603832dc2140b4c76982c0d5175f6c60b3');
    legacyScatter=new Map(JSON.parse(bytes.toString()).map((s:any)=>{s.points=new Float32Array(s.points);return [s.id,s];}));
  }
  return legacyScatter;
}
export function restoreEastBayCliffs<T extends MeshData>(g:T):T{
  assert.equal(eastBayArrayHash(g.positions),eastBayBefore.cliff.positions,'all original ring vertices stay exact');
  assert.equal(eastBayArrayHash(g.indices),eastBayArrayHash(new Uint32Array(eastBayBefore.cliff.retainedIndicesAfterReplacement)),'only30 East Bay cells may be removed');
  const indices:number[]=[];
  for(let band=0;band<30;band++)for(let cell=0;cell<360;cell++){
    if((cell>=118&&cell<172)||cell>=350||cell<25)continue;
    const b=band*722+cell*2;indices.push(b,b+1,b+2,b+2,b+1,b+3);
  }
  const restored={...g,indices:new Uint32Array(indices)};
  assert.equal(eastBayArrayHash(restored.indices),eastBayBefore.cliff.indices);
  return restored;
}
/** Validate the complete bounded replacement before historical gates see the
 * reconstructed released state. No old fixture/hash is rewritten or omitted. */
export function assertEastBayEvolution(layout:ColliderSpec[]){
  const current=new Map(layout.map(s=>[s.id,s]));assert.equal(current.size,layout.length,'unique collider identities');
  const data=eastBayData(),surface={positions:new Float32Array(data.positions),indices:new Uint32Array(data.indices)},sample=createSurfaceSampler(surface);
  const wall=current.get('quarry-east-bay');assert.ok(wall?.shape==='mesh');assert.deepEqual(wall,{id:'quarry-east-bay',shape:'mesh',p:{x:0,y:0,z:0},data:surface,friction:.85});
  const added=new Set(['quarry-east-bay']);
  for(const solid of data.solids){const id='quarry-east-bay-solid-'+solid.id;assert.ok(!added.has(id));added.add(id);assert.deepEqual(current.get(id),{id,shape:'hull',p:{x:0,y:0,z:0},points:new Float32Array(solid.points),friction:.85});}
  const footprints=new Map<string,{x:number;z:number;padding:number}>();
  const scatter=JSON.parse(readFileSync(new URL('./fixtures/quarry-east-bay-scatter-placements.json',import.meta.url),'utf8'));assert.equal(scatter.sourceSHA256,eastBayBefore.workerInputs['src/quarry-layout.ts']);
  for(const group of scatter.rocks)for(const p of group.placements)footprints.set('scanned-rock-'+group.variant+'-'+p.colliderIndex,{...p,padding:Math.max(p.sx,p.sz)*.65});
  for(const p of scatter.scree)footprints.set('scree-'+p.colliderIndex,{...p,padding:Math.max(p.sx,p.sz)});
  const restored:ColliderSpec[]=[];let removed=0;
  for(const old of eastBayBefore.colliders){
    let spec=current.get(old.id);
    if(old.id==='quarry-cliffs'){assert.ok(spec?.shape==='mesh');spec={...spec,data:restoreEastBayCliffs(spec.data)};}
    else if(footprints.has(old.id)){
      const p=footprints.get(old.id)!,overlap=sample.overlaps(p.x,p.z,p.padding);
      assert.equal(!!spec,!overlap,`${old.id}: only exact padded footprint overlap may remove legacy scatter`);
      if(!spec){spec=frozenScatter().get(old.id);removed++;}
    }
    assert.ok(spec,`${old.id}: every other historical collider remains present`);assert.equal(eastBayHash(spec),old.sha256,`${old.id}: historical shape/transform stays exact`);restored.push(spec);
  }
  assert.equal(layout.length,restored.length-removed+added.size,'no unlisted solid changes');
  for(const id of current.keys())assert.ok(added.has(id)||eastBayBefore.colliders.some((s:any)=>s.id===id),'only declared wall/hulls may be added');
  return restored;
}
/** Exact source inverse. Each replacement is intentionally narrow and unique;
 * the result must recover the deployed layout SHA, including line endings. */
export function stripEastBayLayout(source:Buffer){
  let text=source.toString('utf8');const nl=text.includes('\r\n')?'\r\n':'\n';
  const remove=(lines:string[])=>{const token=lines.join(nl)+nl;assert.equal(text.split(token).length,2,'unique approved East Bay addition');text=text.replace(token,'');};
  remove(["import { sector as eastBaySector, positions as eastBayPositions, indices as eastBayIndices, solids as eastBaySolids } from './quarry-east-bay-collision.json';"]);
  remove(['export const QUARRY_EAST_BAY_SECTOR=eastBaySector;']);
  remove(['export function quarryEastBayGeometry():MeshData {return {positions:new Float32Array(eastBayPositions),indices:new Uint32Array(eastBayIndices)};}','let eastBaySampler:ReturnType<typeof createSurfaceSampler>|undefined;','const sampleEastBay=()=>eastBaySampler??=createSurfaceSampler(quarryEastBayGeometry());','export const quarryEastBayHeight=(x:number,z:number)=>sampleEastBay().height(x,z);','export const overlapsQuarryEastBay=(x:number,z:number,padding=0)=>sampleEastBay().overlaps(x,z,padding);']);
  remove(["  items.push({id:'quarry-east-bay',shape:'mesh',p:origin,data:quarryEastBayGeometry(),friction:.85});","  for(const solid of eastBaySolids)items.push({id:'quarry-east-bay-solid-'+solid.id,shape:'hull',p:origin,points:new Float32Array(solid.points),friction:.85});"]);
  for(const token of ['&&!overlapsQuarryEastBay(p.x,p.z,Math.max(p.sx,p.sz)*.65)','&&!overlapsQuarryEastBay(p.x,p.z,Math.max(p.sx,p.sz))']){assert.equal(text.split(token).length,2);text=text.replace(token,'');}
  remove(['                if(i>=QUARRY_EAST_BAY_SECTOR.startCell&&i<QUARRY_EAST_BAY_SECTOR.endCellExclusive)continue;']);
  const bytes=Buffer.from(text,'utf8');assert.equal(eastBayBytesHash(bytes),eastBayBefore.workerInputs['src/quarry-layout.ts'],'every other deployed source byte remains exact');return bytes;
}
