import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { quarryColliderLayout } from '../src/quarry-layout';

export const projectRoot=fileURLToPath(new URL('../',import.meta.url));
export const sha256=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
export const readProject=(relative:string)=>fs.readFileSync(path.join(projectRoot,relative));
export function readGlbContainer(relative:string){
  const bytes=readProject(relative);if(bytes.readUInt32LE(0)!==0x46546c67||bytes.readUInt32LE(4)!==2||bytes.readUInt32LE(8)!==bytes.length)throw new Error('Invalid GLB header');
  let json:any,binary=Buffer.alloc(0);
  for(let cursor=12;cursor<bytes.length;){const length=bytes.readUInt32LE(cursor),kind=bytes.readUInt32LE(cursor+4),chunk=bytes.subarray(cursor+8,cursor+8+length);
    if(kind===0x4e4f534a)json=JSON.parse(chunk.toString('utf8'));if(kind===0x004e4942)binary=chunk;cursor+=8+length;
  }
  return {bytes,json,binary};
}

/** Use the real GLTF parser for geometry, transforms and material values. Only
 * image decoding is replaced: CPU tests need no DOM, WebGL or GPU allocation.
 */
export async function loadCarWithoutImages(kind:string){
  const {bytes}=readGlbContainer(`public/models/${kind}.glb`);
  const loader=new GLTFLoader().register(()=>({name:'CPU_IMAGE_PLACEHOLDER',loadTexture:async()=>new T.Texture()}));
  const gltf=await loader.parseAsync(new Uint8Array(bytes).buffer,'');gltf.scene.updateMatrixWorld(true);return gltf;
}
function values(attribute:T.BufferAttribute|T.InterleavedBufferAttribute){
  const result=new Float32Array(attribute.count*attribute.itemSize);
  for(let i=0;i<attribute.count;i++)for(let k=0;k<attribute.itemSize;k++)result[i*attribute.itemSize+k]=attribute.getComponent(i,k);
  return result;
}
function hashArray(a:Float32Array|Uint32Array){return sha256(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));}
export async function describeCar(kind:string){
  const relative=`public/models/${kind}.glb`,{bytes,json,binary}=readGlbContainer(relative),gltf=await loadCarWithoutImages(kind);
  const meshes:any[]=[],wheels:any[]=[],names=new Set<string>(),duplicateNames:string[]=[],overall=new T.Box3();
  gltf.scene.traverse(o=>{
    if(o.name){if(names.has(o.name))duplicateNames.push(o.name);names.add(o.name);}
    if(o.name.startsWith('wheel_'))wheels.push({name:o.name,parent:o.parent?.name??'',position:o.position.toArray(),quaternion:o.quaternion.toArray(),scale:o.scale.toArray(),worldMatrix:o.matrixWorld.toArray()});
    if(!(o instanceof T.Mesh))return;
    const geometry=o.geometry,p=geometry.getAttribute('position'),position=values(p),index=geometry.getIndex(),indices=index?Uint32Array.from({length:index.count},(_,i)=>index.getX(i)):Uint32Array.from({length:p.count},(_,i)=>i);
    const world=new T.Box3().setFromObject(o),local=new T.Box3().setFromBufferAttribute(p as T.BufferAttribute);overall.union(world);
    const attrs=Object.fromEntries(Object.entries(geometry.attributes).map(([name,attribute])=>[name,{components:attribute.itemSize,count:attribute.count,sha256:hashArray(values(attribute))}]));
    const forwardPoints=new Set<string>(),worldPoint=new T.Vector3();
    for(let i=0;i<p.count;i++){worldPoint.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);if(worldPoint.z> -1.2)forwardPoints.add(worldPoint.toArray().map(Math.fround).join(','));}
    const sortedForward=[...forwardPoints].sort();
    const forwardRegion={minimumWorldZ:-1.2,vertices:forwardPoints.size,positionsSHA256:sha256(Buffer.from(sortedForward.join('|'))),
      ...(/^panel_rear_quarter_[LR]$/.test(o.name)?{positions:sortedForward.flatMap(key=>key.split(',').map(Number))}:{})};
    let finite=true,maxIndex=-1,degenerate=0;for(const a of Object.values(geometry.attributes))for(const v of values(a))if(!Number.isFinite(v))finite=false;
    const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();for(let i=0;i<indices.length;i+=3){maxIndex=Math.max(maxIndex,indices[i],indices[i+1],indices[i+2]);a.fromArray(position,indices[i]*3);b.fromArray(position,indices[i+1]*3);c.fromArray(position,indices[i+2]*3);if(b.sub(a).cross(c.sub(a)).lengthSq()<1e-20)degenerate++;}
    meshes.push({name:o.name,parent:o.parent?.name??'',vertices:p.count,triangles:indices.length/3,materials:(Array.isArray(o.material)?o.material:[o.material]).map(m=>m.name),position:o.position.toArray(),quaternion:o.quaternion.toArray(),scale:o.scale.toArray(),worldMatrix:o.matrixWorld.toArray(),localBounds:{min:local.min.toArray(),max:local.max.toArray()},worldBounds:{min:world.min.toArray(),max:world.max.toArray()},attributes:attrs,indicesSHA256:hashArray(indices),forwardRegion,finite,maxIndex,degenerateTriangles:degenerate});
  });
  const images=(json.images??[]).map((image:any,index:number)=>{const view=json.bufferViews?.[image.bufferView];return {index,name:image.name??'',mimeType:image.mimeType,uri:image.uri??null,bytes:view?.byteLength??0,sha256:view?sha256(binary.subarray(view.byteOffset??0,(view.byteOffset??0)+view.byteLength)):null};});
  return {kind,file:relative,bytes:bytes.length,sha256:sha256(bytes),nodes:json.nodes.length,rawPanelIds:json.nodes.filter((n:any)=>n.name?.startsWith('panel_')).map((n:any)=>n.name).sort(),rawGlassIds:json.nodes.filter((n:any)=>n.name?.startsWith('glass_')).map((n:any)=>n.name).sort(),meshes:meshes.sort((a,b)=>a.name.localeCompare(b.name)),meshCount:meshes.length,triangles:meshes.reduce((n,m)=>n+m.triangles,0),vertices:meshes.reduce((n,m)=>n+m.vertices,0),bounds:{min:overall.min.toArray(),max:overall.max.toArray()},panelIds:meshes.filter(m=>m.name.startsWith('panel_')).map(m=>m.name).sort(),glassIds:meshes.filter(m=>m.name.startsWith('glass_')).map(m=>m.name).sort(),wheels:wheels.sort((a,b)=>a.name.localeCompare(b.name)),duplicateNames,materials:json.materials,images};
}
export function currentPhysicsInvariants(){
  const frozenPath='tests/fixtures/coupe-rear-baseline.json';
  const frozen=fs.existsSync(path.join(projectRoot,frozenPath))?JSON.parse(readProject(frozenPath).toString()):null;
  // The fixture carries publication provenance so a fresh source checkout need
  // not contain local release reports. The generated WASM adapter is optional
  // until multiplayer's build preparation runs; release audits require it.
  const deployed=frozen?{version:frozen.physics.deployedVersion,sourceHashes:Object.fromEntries(frozen.physics.workerInputs.map((i:any)=>[i.file,i.expected]))}:JSON.parse(readProject('outputs/backend-extension-final.json').toString());
  return {deployedVersion:deployed.version,workerInputs:Object.entries(deployed.sourceHashes).map(([file,expected])=>{const available=fs.existsSync(path.join(projectRoot,file)),current=available?sha256(readProject(file)):null;return {file,expected,current,available,unchanged:current===expected};}),colliders:quarryColliderLayout().map(s=>({id:s.id,sha256:sha256(Buffer.from(JSON.stringify(s)))}))};
}
export async function productionCarStats(kind:string){
  const {loadCars,templates}=await import('../src/assets');const previous=new Map(templates),original=GLTFLoader.prototype.loadAsync;
  GLTFLoader.prototype.loadAsync=async url=>{const match=/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url));if(!match)throw new Error(`Unexpected car URL ${url}`);return loadCarWithoutImages(match[1]);};
  try{
    await loadCars(()=>{});const scene=templates.get(kind as 'coupe')!,materials=new Set<T.Material>();let meshes=0,triangles=0;
    scene.traverse(o=>{if(o instanceof T.Mesh){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;for(const material of Array.isArray(o.material)?o.material:[o.material])materials.add(material);}});
    return {meshes,triangles,materials:materials.size};
  }finally{GLTFLoader.prototype.loadAsync=original;templates.clear();for(const [key,value]of previous)templates.set(key,value);}
}
async function capture(){
  const out=path.join(projectRoot,'tests/fixtures/coupe-rear-baseline.json');if(fs.existsSync(out))throw new Error('Refusing to overwrite the frozen coupe baseline');
  const car=await describeCar('coupe'),physics=currentPhysicsInvariants();
  if(!physics.workerInputs.every(i=>i.unchanged))throw new Error('Deployed Worker inputs have changed before baseline capture');
  const protectedFiles=['public/models/sedan.glb','public/models/hatch.glb','source/models/sedan.blend','source/models/hatch.blend','source/models-refined/sedan.blend','source/models-refined/hatch.blend','src/vehicle.ts','src/assets.ts','src/car-materials.ts','multiplayer/simulation.ts','multiplayer/protocol.ts','src/rules.ts'];
  const result={version:1,capturedAt:new Date().toISOString(),scope:'Coupe rear appearance only; no physics, handling or other vehicle changes',car,physics,protectedFiles:Object.fromEntries(protectedFiles.map(file=>[file,sha256(readProject(file))]))};
  fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({file:out,coupeSHA256:car.sha256,bytes:car.bytes,meshes:car.meshCount,triangles:car.triangles,vertices:car.vertices,panels:car.panelIds.length,glass:car.glassIds.length,materials:car.materials.length,images:car.images.length,wheels:car.wheels,workerInputs:physics.workerInputs.length,colliders:physics.colliders.length},null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)&&process.argv.includes('--capture'))await capture();
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)&&process.argv.includes('--capture-forward-region')){
  const out=path.join(projectRoot,'tests/fixtures/coupe-rear-baseline.json'),baseline=JSON.parse(fs.readFileSync(out,'utf8')),car=await describeCar('coupe');
  if(car.sha256!==baseline.car.sha256||sha256(readProject(car.file))!==baseline.car.sha256)throw new Error('Original coupe changed; cannot add frozen region from a newer asset');
  for(const old of baseline.car.meshes)old.forwardRegion=car.meshes.find(m=>m.name===old.name)!.forwardRegion;
  fs.writeFileSync(out,JSON.stringify(baseline,null,2)+'\n');console.log('Captured exact forward-region position sets from the original hash; no prior invariant changed.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)&&process.argv.includes('--capture-runtime')){
  const out=path.join(projectRoot,'tests/fixtures/coupe-rear-baseline.json'),baseline=JSON.parse(fs.readFileSync(out,'utf8'));
  if(sha256(readProject(baseline.car.file))!==baseline.car.sha256)throw new Error('Original coupe changed; runtime baseline cannot be recaptured');
  const runtime=await productionCarStats('coupe');
  if(sha256(readProject(baseline.car.file))!==baseline.car.sha256)throw new Error('Original coupe changed during runtime capture');
  baseline.car.runtime=runtime;fs.writeFileSync(out,JSON.stringify(baseline,null,2)+'\n');console.log(JSON.stringify(runtime));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)&&process.argv.includes('--audit')){
  const baseline=JSON.parse(readProject('tests/fixtures/coupe-rear-baseline.json').toString()),car=await describeCar('coupe'),runtime=await productionCarStats('coupe'),physics=currentPhysicsInvariants();
  const oldByName=new Map<string,any>(baseline.car.meshes.map((m:any)=>[m.name,m]));
  const changes=car.meshes.filter(m=>{const old=oldByName.get(m.name);return !old||JSON.stringify(m.attributes)!==JSON.stringify(old.attributes)||m.indicesSHA256!==old.indicesSHA256||JSON.stringify(m.worldMatrix)!==JSON.stringify(old.worldMatrix)||JSON.stringify(m.materials)!==JSON.stringify(old.materials);}).map(m=>({name:m.name,triangles:m.triangles,previousTriangles:oldByName.get(m.name)?.triangles??0,materials:m.materials,bounds:m.worldBounds,forwardRegionPreserved:oldByName.has(m.name)?JSON.stringify(m.forwardRegion)===JSON.stringify(oldByName.get(m.name).forwardRegion):null}));
  const protectedFiles=Object.entries(baseline.protectedFiles).map(([file,expected])=>({file,expected,current:sha256(readProject(file)),unchanged:sha256(readProject(file))===expected,authorizedException:file==='src/car-materials.ts'?'Existing paint silt noise now uses trilinear interpolation':null}));
  const imageSignature=(images:any[])=>images.map(i=>({name:i.name,mimeType:i.mimeType,sha256:i.sha256,bytes:i.bytes})).sort((a,b)=>a.name.localeCompare(b.name));
  const report={verifiedAt:new Date().toISOString(),baselineSHA256:baseline.car.sha256,currentSHA256:car.sha256,bytes:car.bytes,triangles:car.triangles,triangleDelta:car.triangles-baseline.car.triangles,runtime,baselineRuntime:baseline.car.runtime,budgets:{maximumTriangles:baseline.car.triangles+15000,maximumDrawMeshes:baseline.car.runtime.meshes+2,maximumFileBytes:25*1024*1024},budgetPassed:car.triangles<=baseline.car.triangles+15000&&runtime.meshes<=baseline.car.runtime.meshes+2&&car.bytes<25*1024*1024,panelIdsPreserved:JSON.stringify(car.panelIds)===JSON.stringify(baseline.car.panelIds),glassIdsPreserved:JSON.stringify(car.glassIds)===JSON.stringify(baseline.car.glassIds),wheelPivotsPreserved:JSON.stringify(car.wheels)===JSON.stringify(baseline.car.wheels),imagesByteIdentical:JSON.stringify(imageSignature(car.images))===JSON.stringify(imageSignature(baseline.car.images)),changedMeshes:changes,removedMeshNames:baseline.car.meshes.filter((old:any)=>!car.meshes.some(m=>m.name===old.name)).map((m:any)=>m.name),protectedFiles,workerInputs:physics.workerInputs,allWorkerInputsUnchanged:physics.workerInputs.every(i=>i.available&&i.unchanged),colliderCount:physics.colliders.length,allCollidersUnchanged:JSON.stringify(physics.colliders)===JSON.stringify(baseline.physics.colliders),backendDeploymentRequired:false};
  const argument=process.argv[process.argv.indexOf('--audit')+1],out=path.resolve(projectRoot,argument&&!argument.startsWith('--')?argument:'outputs/coupe-rear/asset-audit.json');
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({output:out,currentSHA256:report.currentSHA256,triangles:report.triangles,triangleDelta:report.triangleDelta,runtime,budgetPassed:report.budgetPassed,imagesByteIdentical:report.imagesByteIdentical,changedMeshes:changes.length,allWorkerInputsUnchanged:report.allWorkerInputsUnchanged,allCollidersUnchanged:report.allCollidersUnchanged},null,2));
}
