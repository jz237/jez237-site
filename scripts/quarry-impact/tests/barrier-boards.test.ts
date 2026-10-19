import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {BARRIER_SPONSORS,barrierBoardMaterial,boardSeed,withBarrierBoards,withBarrierBoardsOf} from '../src/barrier-boards';
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
import {createRookvaleWorld} from '../src/rookvale-world';
import {createMerefieldWorld} from '../src/merefield-world';
import {createBrackenWorld} from '../src/bracken-world';
import {createRedbankWorld} from '../src/redbank-world';
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
type Pick=(s:{material?:string},i:number)=>boolean;const stripe:Pick=s=>s.material==='stripe';
const boardedWorlds:[string,()=>{root:T.Group;dispose():void},Pick][]=[...worlds.map(([id,create])=>[id,create,stripe]as [string,()=>any,Pick]),
 // Ironfield's world needs a DOM; its boards are checked in the browser.
 ['rookvale-yard-v1',createRookvaleWorld,(_,i)=>i%16>=8],['merefield-airfield-v1',createMerefieldWorld,(_,i)=>i%16>=8],['bracken-rallycross-v1',createBrackenWorld,stripe],['redbank-jump-v1',createRedbankWorld,stripe]];
for(const [id,create,boarded]of boardedWorlds)test(`${id}: every coloured barrier block carries a sponsor board batch; records and disposal unchanged`,()=>{
 const world=create(),records=world.root.userData.solidRecords as {material:string}[],before=JSON.stringify(records);
 const meshes:T.InstancedMesh[]=[];world.root.traverse(o=>{if(o instanceof T.InstancedMesh)meshes.push(o);});
 const boards=meshes.filter(m=>(m.material as T.Material).name.endsWith('_boards'));
 const stripes=records.filter(boarded).length;
 assert.ok(stripes>0,'course has stripe barriers');assert.equal(boards.length,1);assert.equal(boards[0].count,stripes);
 const material=boards[0].material as T.MeshStandardMaterial;assert.match(material.name,/_boards$/);
 let disposed=false;material.addEventListener('dispose',()=>{disposed=true;});
 world.dispose();assert.ok(disposed,'board material disposed with the world');assert.equal(JSON.stringify(records),before);
});
test('sponsors are distinct and fill the 16-cell atlas; venue seeds are stable and in range',()=>{
 assert.equal(BARRIER_SPONSORS.length,16);assert.equal(new Set(BARRIER_SPONSORS.map(s=>s[0])).size,16);
 for(const id of ['ashcombe-lanes-v1','fenwick-eight-v1']){const s=boardSeed(id);assert.ok(Number.isInteger(s)&&s>=0&&s<16);assert.equal(boardSeed(id),s);}
 const stripe=new T.MeshStandardMaterial({color:0x9b3e38}),m=withBarrierBoards({stripe},3);assert.equal(m.stripe,stripe);assert.notEqual(m.boards,stripe);assert.equal(m.boards.color.getHex(),0x9b3e38);
 const yellow=new T.MeshStandardMaterial({color:0xd6a344}),y=withBarrierBoardsOf({yellow},'yellow');assert.equal(y.yellow,yellow);assert.equal(y.boards.color.getHex(),0xd6a344);
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
