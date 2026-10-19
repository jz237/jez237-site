import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {BARRIER_SPONSORS,barrierBoardMaterial,boardSeed,withBarrierBoards} from '../src/barrier-boards';
import {createCountyWorld} from '../src/county-world';
import {createMillhavenWorld} from '../src/millhaven-world';
import {createRidgeClubWorld} from '../src/ridge-club-world';
import {createStadiumReservoirWorld} from '../src/stadium-reservoir-world';
import {createParkDunesWorld} from '../src/park-dunes-world';
import {createCoastForestWorld} from '../src/coast-forest-world';
import {createPortFarmWorld} from '../src/port-farm-world';
import {createCanalPassWorld} from '../src/canal-pass-world';
import {createWillowbankWorld} from '../src/willowbank-world';
import {createSableWorld} from '../src/sable-world';
import {createElmsworthWorld} from '../src/elmsworth-world';
import {createFenwickWorld} from '../src/fenwick-world';
import {createAshfordWorld} from '../src/ashford-world';
import {createPinecrestWorld} from '../src/pinecrest-world';
import {createCinderbankWorld} from '../src/cinderbank-world';
import {createAshcombeWorld} from '../src/ashcombe-world';
const worlds:[string,()=>{root:T.Group;dispose():void}][]=[
 ...(['dockside-loop-v1','fairground-scramble-v1','alderwick-cross-v1','wrenford-mud-v1']as const).map(id=>[id,()=>createCountyWorld(id)]as [string,()=>any]),
 ['millhaven-rally-v1',createMillhavenWorld],
 ...(['westmere-club-v1','harrowstone-ridge-v1']as const).map(id=>[id,()=>createRidgeClubWorld(id)]as [string,()=>any]),
 ...(['holloway-stadium-v1','bramblebrook-reservoir-v1']as const).map(id=>[id,()=>createStadiumReservoirWorld(id)]as [string,()=>any]),
 ...(['kingswell-park-v1','copperfield-dunes-v1']as const).map(id=>[id,()=>createParkDunesWorld(id)]as [string,()=>any]),
 ...(['seabrook-coast-v1','hazelwood-forest-v1']as const).map(id=>[id,()=>createCoastForestWorld(id)]as [string,()=>any]),
 ...(['saltmarsh-port-v1','dunmere-farm-v1']as const).map(id=>[id,()=>createPortFarmWorld(id)]as [string,()=>any]),
 ...(['millbrook-canal-v1','granite-pass-v1']as const).map(id=>[id,()=>createCanalPassWorld(id)]as [string,()=>any]),
 ['willowbank-heath-v1',createWillowbankWorld],['sable-canyon-v1',()=>createSableWorld()],['elmsworth-speedway-v1',createElmsworthWorld],
 ...(['fenwick-oval-v1','fenwick-eight-v1']as const).map(id=>[id,()=>createFenwickWorld(id)]as [string,()=>any]),
 ['ashford-autodrome-v1',createAshfordWorld],['pinecrest-ridge-v1',createPinecrestWorld],['cinderbank-oval-v1',createCinderbankWorld],['ashcombe-lanes-v1',createAshcombeWorld],
];
for(const [id,create]of worlds)test(`${id}: every stripe barrier carries a sponsor board batch; records and disposal unchanged`,()=>{
 const world=create(),records=world.root.userData.solidRecords as {material:string}[],before=JSON.stringify(records);
 const meshes:T.InstancedMesh[]=[];world.root.traverse(o=>{if(o instanceof T.InstancedMesh)meshes.push(o);});
 const boards=meshes.filter(m=>m.name.endsWith('_boards'));
 const stripes=records.filter(s=>s.material==='stripe').length;
 assert.ok(stripes>0,'course has stripe barriers');assert.equal(boards.length,1);assert.equal(boards[0].count,stripes);
 const material=boards[0].material as T.MeshStandardMaterial;assert.match(material.name,/_boards$/);
 let disposed=false;material.addEventListener('dispose',()=>{disposed=true;});
 world.dispose();assert.ok(disposed,'board material disposed with the world');assert.equal(JSON.stringify(records),before);
});
test('sponsors are distinct and fill the 16-cell atlas; venue seeds are stable and in range',()=>{
 assert.equal(BARRIER_SPONSORS.length,16);assert.equal(new Set(BARRIER_SPONSORS.map(s=>s[0])).size,16);
 for(const id of ['ashcombe-lanes-v1','fenwick-eight-v1']){const s=boardSeed(id);assert.ok(Number.isInteger(s)&&s>=0&&s<16);assert.equal(boardSeed(id),s);}
 const stripe=new T.MeshStandardMaterial({color:0x9b3e38}),m=withBarrierBoards({stripe},3);assert.equal(m.stripe,stripe);assert.notEqual(m.boards,stripe);assert.equal(m.boards.color.getHex(),0x9b3e38);
});
test('with a canvas the board shader patches every chunk it relies on',()=>{
 const ctx=new Proxy({measureText:()=>({width:100})},{get:(t:any,k)=>k in t?t[k]:()=>{},set:()=>true});
 (globalThis as any).document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
 try{
  const material=barrierBoardMaterial(new T.MeshStandardMaterial(),5);
  const shader={uniforms:{} as Record<string,{value:unknown}>,vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader};
  material.onBeforeCompile(shader as any,undefined as any);
  assert.ok(shader.uniforms.boardAtlas&&shader.uniforms.boardSeed.value===5);
  assert.match(shader.vertexShader,/vBoardFace=step/);assert.match(shader.vertexShader,/gl_InstanceID/);
  assert.match(shader.fragmentShader,/uniform sampler2D boardAtlas/);assert.match(shader.fragmentShader,/diffuseColor\.rgb=board\.rgb/);
  assert.equal(material.customProgramCacheKey(),'barrier-boards-v1');
 }finally{delete (globalThis as any).document;}
});
