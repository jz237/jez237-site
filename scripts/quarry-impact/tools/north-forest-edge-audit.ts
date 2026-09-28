/** CPU-only capture of the real forest renderer; GLB geometry is parsed normally.
 * Only image decoding is replaced. The immutable fixture predates this milestone.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { forestScenery } from '../src/scenery-vegetation';
import { quarryColliderLayout, nearTrees, saplingPlacements, terrainGeometry, seededRandom } from '../src/quarry-layout';
import { decodeDracoGLB } from './decode-north-draco.mjs';

export const projectRoot=fileURLToPath(new URL('../',import.meta.url));
export const readForestFile=(file:string)=>fs.readFileSync(path.join(projectRoot,file));
export const forestHash=(value:string|Uint8Array)=>createHash('sha256').update(value).digest('hex');
export const forestJSONHash=(value:unknown)=>forestHash(JSON.stringify(value));
const decodedAssets=new Map<string,Promise<Uint8Array>>();
/** Same shipped bytes share one CPU decode per audit process; source hashes are
 * the cache key, so a revised export never reuses an older geometry result. */
export function decodeForestGLB(bytes:Uint8Array){
  const key=forestHash(bytes);let result=decodedAssets.get(key);
  if(!result){result=decodeDracoGLB(bytes);decodedAssets.set(key,result);result.catch(()=>decodedAssets.delete(key));}
  return result;
}
const arrayHash=(array:ArrayBufferView)=>forestHash(new Uint8Array(array.buffer,array.byteOffset,array.byteLength));
export const forestAngle=(x:number,z:number)=>(Math.atan2(x/1.08,z)*180/Math.PI+360)%360;
export const inNorthForest=(x:number,z:number)=>{const a=forestAngle(x,z);return a>=350||a<=45;};
function textureInfo(t:T.Texture|null){return t?{name:t.name,flipY:t.flipY,colorSpace:t.colorSpace,repeat:t.repeat.toArray(),offset:t.offset.toArray(),wrapS:t.wrapS,wrapT:t.wrapT,anisotropy:t.anisotropy}:null;}
function materialInfo(material:T.Material){
  const m=material as T.MeshStandardMaterial,shader={vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader,uniforms:{}};
  m.onBeforeCompile(shader as any,{} as T.WebGLRenderer);
  return {name:m.name,type:m.type,color:m.color?.toArray(),roughness:m.roughness,metalness:m.metalness,envMapIntensity:m.envMapIntensity,
    opacity:m.opacity,transparent:m.transparent,alphaTest:m.alphaTest,depthWrite:m.depthWrite,side:m.side,vertexColors:m.vertexColors,
    maps:Object.fromEntries(['map','normalMap','alphaMap','roughnessMap'].map(k=>[k,textureInfo((m as any)[k])])),
    vertexShader:forestHash(shader.vertexShader),fragmentShader:forestHash(shader.fragmentShader),cacheKey:m.customProgramCacheKey()};
}
function geometryInfo(g:T.BufferGeometry){return {attributes:Object.fromEntries(Object.entries(g.attributes).map(([key,a])=>[key,{count:a.count,itemSize:a.itemSize,normalized:a.normalized,sha256:arrayHash(a.array)}])),indices:g.index?{count:g.index.count,sha256:arrayHash(g.index.array)}:null,groups:g.groups};}

/** Visitor runs before disposal, allowing tests to exercise the real LOD/caster trees. */
export async function captureNorthForest(visitor?:(parent:T.Group)=>void){
  const parent=new T.Group(),textureLoad=T.TextureLoader.prototype.load,gltfLoad=GLTFLoader.prototype.loadAsync,textures=new Set<T.Texture>();
  T.TextureLoader.prototype.load=function(file:string,onLoad?:(texture:T.Texture)=>void){const texture=new T.Texture();texture.name=file;textures.add(texture);if(onLoad)queueMicrotask(()=>onLoad(texture));return texture;};
  GLTFLoader.prototype.loadAsync=async function(file){
    const model=/\/models\/([^/?]+\.glb)/.exec(String(file));if(!model)throw new Error(`Unexpected forest GLB request: ${file}`);
    const loader=new GLTFLoader().register(parser=>({name:'FOREST_CPU_IMAGES',loadTexture:async(index:number)=>{
      const texture=new T.Texture();texture.name=`${model[1]}:texture:${index}:${parser.json.textures?.[index]?.source??''}`;textures.add(texture);return texture;
    }}));
    return loader.parseAsync((await decodeForestGLB(readForestFile(`public/models/${model[1]}`))).buffer,'');
  };
  let randomCalls=0;const sourceRandom=seededRandom(9311),random=()=>{randomCalls++;return sourceRandom();};
  // Same frozen Quarry sequence before forestScenery; separately verified by
  // the arena constructor audit so unrelated placement cannot silently drift.
  for(let i=0;i<170*7+290*8+12*37;i++)random();
  try{
    await forestScenery(parent,random);parent.updateMatrixWorld(true);
    const meshes:any[]=[],lods:any[]=[],cards:any[]=[];
    const instance=new T.Matrix4(),world=new T.Matrix4(),color=new T.Color();
    parent.traverse(object=>{
      if(object instanceof T.LOD)lods.push({name:object.name,matrix:object.matrixWorld.toArray(),autoUpdate:object.autoUpdate,levels:object.levels.map(l=>({distance:l.distance,hysteresis:l.hysteresis,visible:l.object.visible}))});
      if(!(object instanceof T.Mesh))return;
      const materials=(Array.isArray(object.material)?object.material:[object.material]).map(materialInfo),instances:any[]=[];
      if(object instanceof T.InstancedMesh)for(let i=0;i<object.count;i++){
        object.getMatrixAt(i,instance);world.multiplyMatrices(object.matrixWorld,instance);if(object.instanceColor)object.getColorAt(i,color);
        const entry={matrix:world.toArray(),color:object.instanceColor?color.toArray():null};instances.push(entry);
        const map=(Array.isArray(object.material)?object.material[0]:object.material) as T.MeshStandardMaterial;
        const kind=map.map?.name.match(/(pine|spruce|hemlock|maple)\.webp$/)?.[1];if(kind)cards.push({kind,...entry});
      }
      const parents:string[]=[];for(let p=object.parent;p&&p!==parent;p=p.parent)parents.unshift(p.name||p.type);
      meshes.push({name:object.name,parents,matrix:object.matrixWorld.toArray(),visible:object.visible,castShadow:object.castShadow,receiveShadow:object.receiveShadow,
        geometry:geometryInfo(object.geometry),materials,instances});
    });
    visitor?.(parent);
    return JSON.parse(JSON.stringify({cards,meshes,lods,random:{calls:randomCalls,next:random()},draws:meshes.length})) as {cards:any[];meshes:any[];lods:any[];random:{calls:number;next:number};draws:number};
  }finally{
    T.TextureLoader.prototype.load=textureLoad;GLTFLoader.prototype.loadAsync=gltfLoad;
    const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();
    parent.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);if(o instanceof T.InstancedMesh)o.dispose();}});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  }
}

export function currentNorthForestPhysics(){
  const mesh=terrainGeometry();
  return {colliders:quarryColliderLayout().map(c=>({id:c.id,sha256:forestJSONHash(c)})),terrain:{positions:arrayHash(mesh.positions),indices:arrayHash(mesh.indices)},
    nearTrees:[0,1,2].map(i=>nearTrees(`fir-${i}`)),saplings:[0,1,2].map(i=>saplingPlacements(i))};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)&&process.argv.includes('--capture')){
  const fixture='tests/fixtures/north-forest-edge-before.json';if(fs.existsSync(path.join(projectRoot,fixture)))throw new Error('Refusing to replace the pre-edit forest fixture');
  const old=JSON.parse(readForestFile('tests/fixtures/arena-floor-baseline.json').toString()),forest=await captureNorthForest(),physics=currentNorthForestPhysics();
  const workerInputs=old.workerInputs.map(({file,expected}:any)=>({file,expected,current:forestHash(readForestFile(file))}));
  if(workerInputs.length!==17||workerInputs.some((i:any)=>i.expected!==i.current))throw new Error('Deployed physics changed before forest baseline');
  const protectedFiles=['src/scenery-vegetation.ts','src/scenery-north-backdrop.ts','src/scenery-backdrop.ts','src/scenery-flora-placement.ts','src/quarry-layout.ts','src/world.ts','src/static-shadows.ts',
    'src/rules.ts','src/vehicle.ts','src/assets.ts','src/car-materials.ts','public/models/coupe.glb','public/models/sedan.glb','public/models/hatch.glb',
    'public/models/fir-medium-a.glb','public/models/fir-medium-b.glb','public/models/fir-medium-c.glb','public/models/fir-saplings-lod.glb'];
  const result={version:1,capturedAt:new Date().toISOString(),scope:'Before northern forest-edge milestone; actual renderer, unchanged deployed physics and all old flora',deployedVersion:old.deployedVersion,
    workerInputs,physics,forest,files:Object.fromEntries(protectedFiles.map(file=>[file,forestHash(readForestFile(file))]))};
  fs.writeFileSync(path.join(projectRoot,fixture),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({fixture,sha256:forestHash(readForestFile(fixture)),cards:forest.cards.length,localCards:forest.cards.filter(c=>inNorthForest(c.matrix[12],c.matrix[14])).length,meshes:forest.meshes.length,lods:forest.lods.length,random:forest.random,colliders:physics.colliders.length,workerInputs:workerInputs.length},null,2));
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)&&process.argv.includes('--audit')){
  const arg=process.argv.indexOf('--audit'),output=path.resolve(projectRoot,process.argv[arg+1]??'outputs/north-forest/final/physics-render-audit.json');
  const {assertNorthForestEvolution,assertNorthForestLayoutSource,northForestBaseline,northForestData}=await import('../tests/north-forest-invariants');
  assertNorthForestLayoutSource();assertNorthForestEvolution(quarryColliderLayout());
  const detail:any[]=[];
  const forest=await captureNorthForest(parent=>parent.traverse(o=>{
    if(!(o instanceof T.LOD)||!o.name.startsWith('north-forest-stand-'))return;
    detail.push({name:o.name,levels:o.levels.map(level=>{
      let draws=0,triangles=0,instances=0;level.object.traverse(mesh=>{if(mesh instanceof T.Mesh){draws++;const n=mesh instanceof T.InstancedMesh?mesh.count:1;instances+=n;triangles+=(mesh.geometry.index?.count??mesh.geometry.attributes.position.count)/3*n;}});
      return {distance:level.distance,hysteresis:level.hysteresis,draws,triangles,instances};
    })});
  }));
  const physics=currentNorthForestPhysics(),oldIds=new Set(northForestBaseline.physics.colliders.map((c:any)=>c.id)),data=northForestData();
  const adapter='multiplayer/.generated/rapier-worker.mjs';if(!fs.existsSync(path.join(projectRoot,adapter)))await import(new URL('../multiplayer/prepare-rapier.mjs',import.meta.url).href);
  const sourceHashes=Object.fromEntries([...northForestBaseline.workerInputs.map((i:any)=>i.file),'src/quarry-north-forest.json'].map(file=>[file,forestHash(readForestFile(file))]));
  for(const input of northForestBaseline.workerInputs)if(input.file!=='src/quarry-layout.ts'&&sourceHashes[input.file]!==input.expected)
    throw new Error(`Previously deployed Worker input changed outside this milestone: ${input.file}`);
  const treeManifest=JSON.parse(readForestFile('source/models/quarry-north-firs-manifest.json').toString());
  for(const entry of treeManifest.runtimeFiles){const bytes=readForestFile('public/'+entry.file);if(bytes.length!==entry.bytes||forestHash(bytes)!==entry.sha256)throw new Error(`Tree manifest differs from bundled asset ${entry.file}`);}
  const floorManifest=JSON.parse(readForestFile('source/north-forest-floor-manifest.json').toString());
  for(const entry of floorManifest.runtimeFiles){const bytes=readForestFile('public/'+entry.file);if(bytes.length!==entry.bytes||forestHash(bytes)!==entry.sha256)throw new Error(`Floor manifest differs from bundled asset ${entry.file}`);}
  for(const [file,expected]of [[floorManifest.source,floorManifest.sourceSha256],[floorManifest.placements,floorManifest.placementsSha256],[floorManifest.crest,floorManifest.crestSha256]])if(forestHash(readForestFile(file))!==expected)throw new Error(`Floor provenance differs from source ${file}`);
  const artifactFiles=[...new Set(['src/scenery-north-forest.ts','src/scenery-vegetation.ts','src/scenery-north-floor.ts','src/scenery-north-floor-mask.ts','src/scenery-north-crest.ts','src/scenery-north-mineral.ts','source/north-forest-floor.json','source/north-forest-crest.json','source/north-forest-floor-manifest.json','source/models/quarry-north-fir-proxies.json','source/models/quarry-north-firs-manifest.json',...[...treeManifest.runtimeFiles,...floorManifest.runtimeFiles].map((entry:any)=>'public/'+entry.file)])];
  const report={verifiedAt:new Date().toISOString(),stage:'CPU actual-renderer/physics audit; separate tests and GPU review provide pass evidence',baseline:'tests/fixtures/north-forest-edge-before.json',baselineSHA256:forestHash(readForestFile('tests/fixtures/north-forest-edge-before.json')),
    previousDeployedVersion:northForestBaseline.deployedVersion,sourceHashes,artifacts:Object.fromEntries(artifactFiles.map(file=>[file,{bytes:readForestFile(file).length,sha256:forestHash(readForestFile(file))}])),
    oldColliderCount:oldIds.size,colliderCount:physics.colliders.length,oldCollidersUnchanged:forestJSONHash(physics.colliders.filter(c=>oldIds.has(c.id)))===forestJSONHash(northForestBaseline.physics.colliders),
    addedColliders:physics.colliders.filter(c=>!oldIds.has(c.id)),terrainUnchanged:forestJSONHash(physics.terrain)===forestJSONHash(northForestBaseline.physics.terrain),
    originalMediumPlacementsUnchanged:forestJSONHash(physics.nearTrees)===forestJSONHash(northForestBaseline.physics.nearTrees),originalSaplingPlacementsUnchanged:forestJSONHash(physics.saplings)===forestJSONHash(northForestBaseline.physics.saplings),
    forest:{cards:forest.cards.length,approvedOriginalCardCount:northForestBaseline.forest.cards.filter((c:any)=>inNorthForest(c.matrix[12],c.matrix[14])).length,
      offSectorCardsUnchanged:forest.cards.every((c:any,i:number)=>{const old=northForestBaseline.forest.cards[i];return inNorthForest(old.matrix[12],old.matrix[14])||forestJSONHash(c)===forestJSONHash(old);}),
      allCardSpeciesColorsUnchanged:forest.cards.every((c:any,i:number)=>{const old=northForestBaseline.forest.cards[i];return c.kind===old.kind&&forestJSONHash(c.color)===forestJSONHash(old.color);}),
      random:forest.random,randomUnchanged:forestJSONHash(forest.random)===forestJSONHash(northForestBaseline.forest.random),meshBatches:forest.meshes.length,lods:forest.lods.length,addedStandLODs:detail,solidMatureTrees:data.trees.length,solidMediumTrees:data.mediumTrees.length,rootBands:data.trees.reduce((n,t)=>n+data.rootHulls.find(h=>h.variant===t.variant).parts.length,0),softUnderstory:data.understory.length},
    backendDeploymentRequired:true,reason:'Additive manifest-driven stem cylinders and compact root hulls; all original 1,547 collider shapes/transforms are preserved'};
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({output,colliders:report.colliderCount,oldCollidersUnchanged:report.oldCollidersUnchanged,terrainUnchanged:report.terrainUnchanged,workerInputs:Object.keys(sourceHashes).length,forest:report.forest},null,2));
}
