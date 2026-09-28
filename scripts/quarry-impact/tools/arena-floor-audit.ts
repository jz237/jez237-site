/** Exercise the real Quarry constructor without WebGL or image decoding. */
import {restoreWorkyardBytes} from '../tests/workyard-invariants';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { gunzipSync } from 'node:zlib';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';

const root=path.resolve(import.meta.dirname,'..');
export const arenaRead=(p:string)=>fs.readFileSync(path.join(root,p));
export const arenaHash=(data:Uint8Array|string)=>createHash('sha256').update(data).digest('hex');
const typedHash=(a:ArrayBufferView)=>arenaHash(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));
const jsonHash=(data:unknown)=>arenaHash(JSON.stringify(data));
function textureInfo(t:T.Texture|null){
  if(!t)return null;
  return {name:t.name,image:t.image?.auditDraws??null,wrapS:t.wrapS,wrapT:t.wrapT,repeat:t.repeat.toArray(),offset:t.offset.toArray(),rotation:t.rotation,flipY:t.flipY,colorSpace:t.colorSpace,minFilter:t.minFilter,magFilter:t.magFilter};
}
function materialInfo(m:T.Material){
  const mat=m as T.MeshPhysicalMaterial;
  const shader={vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader,uniforms:{}};
  mat.onBeforeCompile(shader as any,{} as T.WebGLRenderer);
  const uniforms=Object.fromEntries(Object.entries(shader.uniforms).map(([k,v])=>{
    const value=(v as {value:unknown}).value;return [k,value instanceof T.Texture?textureInfo(value):value];
  }));
  return {type:mat.type,name:mat.name,color:mat.color?.toArray(),emissive:mat.emissive?.toArray(),roughness:mat.roughness,metalness:mat.metalness,
    normalScale:mat.normalScale?.toArray(),clearcoat:mat.clearcoat,clearcoatRoughness:mat.clearcoatRoughness,ior:mat.ior,opacity:mat.opacity,
    side:mat.side,transparent:mat.transparent,depthTest:mat.depthTest,depthWrite:mat.depthWrite,blending:mat.blending,vertexColors:mat.vertexColors,
    polygonOffset:mat.polygonOffset,polygonOffsetFactor:mat.polygonOffsetFactor,polygonOffsetUnits:mat.polygonOffsetUnits,
    maps:Object.fromEntries(['map','normalMap','roughnessMap','metalnessMap','alphaMap'].map(k=>[k,textureInfo((mat as any)[k])])),
    shader:{vertexSHA256:arenaHash(shader.vertexShader),fragmentSHA256:arenaHash(shader.fragmentShader),programKey:mat.customProgramCacheKey(),uniforms}};
}
function geometryInfo(g:T.BufferGeometry){return {type:g.type,attributes:Object.fromEntries(Object.entries(g.attributes).map(([k,v])=>[k,{count:v.count,itemSize:v.itemSize,normalized:v.normalized,sha256:typedHash(v.array)}])),
  indices:g.index?{count:g.index.count,sha256:typedHash(g.index.array)}:null,groups:g.groups,drawRange:{start:g.drawRange.start,count:Number.isFinite(g.drawRange.count)?g.drawRange.count:null}};}

export async function captureArenaFloor(options:{historicalWorkyard?:boolean}={}){
  const bytes=arenaRead('src/world.ts');
  const worldSource=(options.historicalWorkyard?restoreWorkyardBytes('src/world.ts',bytes):bytes).toString();
  if(!worldSource.includes('let seed = 9311;')||!worldSource.includes('return seed / 4294967296;'))throw new Error('RNG audit hook no longer matches the real world source');
  const instrumented=worldSource.replace('let seed = 9311;','let seed = 9311; let __arenaAuditCalls=0;').replace('return seed / 4294967296;','__arenaAuditCalls++; return seed / 4294967296;')+'\nexport const __arenaAuditState=()=>({seed,calls:__arenaAuditCalls});\n';
  const bundled=await build({stdin:{contents:instrumented,loader:'ts',sourcefile:'world.ts',resolveDir:path.join(root,'src')},bundle:true,platform:'node',format:'esm',packages:'external',write:false,logLevel:'silent'});
  const moduleFile=path.join(root,'outputs',`.arena-audit-world-${process.pid}-${options.historicalWorkyard?'historical':'current'}.mjs`);fs.mkdirSync(path.dirname(moduleFile),{recursive:true});fs.writeFileSync(moduleFile,bundled.outputFiles[0].contents);
  const {Quarry,__arenaAuditState}=await import(pathToFileURL(moduleFile).href+'?audit='+Date.now());
  const originalDocument=globalThis.document,originalTextureLoad=T.TextureLoader.prototype.load,textures:T.Texture[]=[];
  const makeCanvas=()=>{
    const canvas={width:1,height:1,auditDraws:[] as unknown[],getContext:()=>context};
    const context=new Proxy({},{get:(_,k)=>k==='measureText'?(text:string)=>({width:text.length*8}):(...args:unknown[])=>canvas.auditDraws.push([k,...args]),set:(_,k,v)=>{canvas.auditDraws.push(['set',k,v]);return true;}});
    return canvas;
  };
  (globalThis as any).document={createElement:makeCanvas};
  T.TextureLoader.prototype.load=function(file:string){const t=new T.Texture();t.name=file;textures.push(t);return t;};
  await R.init();const physics=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene();
  try{
    const quarry=new Quarry(scene,physics);scene.updateMatrixWorld(true);
    const objects:any[]=[],puddles:any[]=[],surfaceFrames:{role:string;u:number[];v:number[];normal:number[];handedness:number}[]=[];let arena:any;
    scene.traverse(object=>{
      if(!(object instanceof T.Mesh)&&!(object instanceof T.LineSegments))return;
      const materials=Array.isArray(object.material)?object.material:[object.material],g=object.geometry;
      const role=g.type==='CircleGeometry'&&(g as T.CircleGeometry).parameters.radius===45?'arena':g.hasAttribute('shoreAlpha')?(materials[0] instanceof T.MeshPhysicalMaterial?'water':'wet'):'other';
      const entry={role,name:object.name,geometry:geometryInfo(g),matrix:object.matrixWorld.toArray(),castShadow:object.castShadow,receiveShadow:object.receiveShadow,visible:object.visible,
        instanceCount:object instanceof T.InstancedMesh?object.count:undefined,instanceMatrix:object instanceof T.InstancedMesh?typedHash(object.instanceMatrix.array):undefined,
        instanceColor:object instanceof T.InstancedMesh&&object.instanceColor?typedHash(object.instanceColor.array):undefined,materials:materials.map(materialInfo)};
      objects.push(entry);
      if(role!=='other'){
        const p=g.getAttribute('position'),uv=g.getAttribute('uv'),n=g.getAttribute('normal'),indices=g.index;
        for(let i=0;i<(indices?.count??p.count);i+=3){
          const ids=[0,1,2].map(k=>indices?indices.getX(i+k):i+k),a=new T.Vector3().fromBufferAttribute(p,ids[0]).applyMatrix4(object.matrixWorld),b=new T.Vector3().fromBufferAttribute(p,ids[1]).applyMatrix4(object.matrixWorld),c=new T.Vector3().fromBufferAttribute(p,ids[2]).applyMatrix4(object.matrixWorld);
          const x=b.sub(a),y=c.sub(a),du1=uv.getX(ids[1])-uv.getX(ids[0]),dv1=uv.getY(ids[1])-uv.getY(ids[0]),du2=uv.getX(ids[2])-uv.getX(ids[0]),dv2=uv.getY(ids[2])-uv.getY(ids[0]),det=du1*dv2-dv1*du2;
          if(Math.abs(det)<1e-10||x.clone().cross(y).lengthSq()<1e-12)continue;
          const u=x.clone().multiplyScalar(dv2).addScaledVector(y,-dv1).divideScalar(det).normalize(),v=y.clone().multiplyScalar(du1).addScaledVector(x,-du2).divideScalar(det).normalize();
          const normal=new T.Vector3().fromBufferAttribute(n,ids[0]).applyNormalMatrix(new T.Matrix3().getNormalMatrix(object.matrixWorld));
          surfaceFrames.push({role,u:u.toArray(),v:v.toArray(),normal:normal.toArray(),handedness:Math.sign(u.clone().cross(v).dot(normal))});break;
        }
      }
      if(role==='arena')arena=entry;
      if(role==='water'||role==='wet'){
        const position=g.getAttribute('position'),alpha=g.getAttribute('shoreAlpha'),rings=[];
        for(let start=0;start<position.count;start+=193){const points=[];for(let j=start;j<start+193;j++){const p=new T.Vector3().fromBufferAttribute(position,j).applyMatrix4(object.matrixWorld);points.push([p.x,p.y,p.z]);}rings.push({alpha:alpha.getX(start),points});}
        puddles.push({...entry,rings});
      }
    });
    if(!arena||puddles.filter(p=>p.role==='water').length!==12||puddles.filter(p=>p.role==='wet').length!==12)throw new Error('Actual arena/puddle meshes were not found');
    // Normal audits/tests must work from the published source checkout, which
    // deliberately excludes local deployment evidence under outputs/.
    const fixturePath='tests/fixtures/arena-floor-baseline.json';
    let deployedVersion:string,expectedInputs:{file:string;expected:string}[];
    if(fs.existsSync(path.join(root,fixturePath))){
      const frozen=JSON.parse(arenaRead(fixturePath).toString()) as {deployedVersion:string;workerInputs:{file:string;expected:string}[]};
      deployedVersion=frozen.deployedVersion;
      expectedInputs=frozen.workerInputs.map(({file,expected})=>({file,expected}));
    }else{
      if(!process.argv.includes('--capture'))throw new Error('Tracked arena baseline is missing; only the initial --capture may read local deployment evidence');
      const deployed=JSON.parse(arenaRead('outputs/backend-headwall-final.json').toString()) as {version:string;sourceHashes:Record<string,string>};
      deployedVersion=deployed.version;
      expectedInputs=Object.entries(deployed.sourceHashes).map(([file,expected])=>({file,expected}));
    }
    if(expectedInputs.length!==17||!deployedVersion)throw new Error('Arena baseline must identify the frozen deployment and all 17 Worker inputs');
    const rapierAdapter='multiplayer/.generated/rapier-worker.mjs';
    if(expectedInputs.some(({file})=>file===rapierAdapter)&&!fs.existsSync(path.join(root,rapierAdapter))){
      // npm ci at the project root installs the pinned sources/build tool. This
      // ignored local artifact is rebuilt, then checked against the frozen hash.
      await import(pathToFileURL(path.join(root,'multiplayer/prepare-rapier.mjs')).href);
    }
    const workerInputs=expectedInputs.map(({file,expected})=>({file,expected,current:arenaHash(arenaRead(file))}));
    const {quarryColliderLayout}=await import('../src/quarry-layout');
    const snapshot={capturedAt:new Date().toISOString(),worldSHA256:arenaHash(worldSource),deployedVersion,workerInputs,
      colliders:quarryColliderLayout().map(s=>({id:s.id,sha256:jsonHash(s)})),arena,puddles,objects,surfaceFrames,random:__arenaAuditState(),
      protectedFiles:Object.fromEntries(['public/models/coupe.glb','public/models/sedan.glb','public/models/hatch.glb','src/vehicle.ts','src/car-materials.ts','src/scenery-surfaces.ts','src/scenery-road-material.ts','src/scenery-roadside-material.ts'].map(p=>[p,arenaHash(arenaRead(p))])),
      counts:{objects:objects.length,water:12,wet:12,arena:1,materialInstances:new Set(objects.flatMap(o=>o.materials.map((m:unknown)=>jsonHash(m)))).size}};
    // Match the persisted fixture representation (omit undefined optional fields).
    return JSON.parse(JSON.stringify(snapshot)) as typeof snapshot;
  }finally{
    globalThis.document=originalDocument;T.TextureLoader.prototype.load=originalTextureLoad;physics.free();
    const materials=new Set<T.Material>();scene.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.LineSegments){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  }
}

if(process.argv.includes('--capture')){
  const fixture=path.join(root,'tests/fixtures/arena-floor-baseline.json'),handoff=path.join(root,'source/arena-floor-base.json');
  if(fs.existsSync(fixture)||fs.existsSync(handoff))throw new Error('Refusing to overwrite the pre-edit arena baseline');
  const capture=await captureArenaFloor();if(capture.workerInputs.length!==17||capture.workerInputs.some(i=>i.current!==i.expected))throw new Error('Deployed Worker inputs changed before capture');
  fs.writeFileSync(fixture,JSON.stringify(capture,null,2)+'\n');
  fs.writeFileSync(handoff,JSON.stringify({version:1,worldSHA256:capture.worldSHA256,coordinateSystem:'world X/Y/Z; mask U increases X, V increases Z',arena:{radius:45,y:.018},random:capture.random,puddles:capture.puddles.map((p,i)=>({id:Math.floor(i/2),kind:p.role,matrix:p.matrix,rings:p.rings}))}));
  console.log(JSON.stringify({fixture,handoff,colliders:capture.colliders.length,workerInputs:capture.workerInputs.length,counts:capture.counts,random:capture.random,handoffSHA256:arenaHash(fs.readFileSync(handoff))},null,2));
}

if(process.argv.includes('--audit')){
  const arg=process.argv.indexOf('--audit'),output=process.argv[arg+1]??'outputs/arena-floor/final/invariant-audit.json';
  const baseline=JSON.parse(arenaRead('tests/fixtures/arena-floor-baseline.json').toString()),current=await captureArenaFloor();
  const geometry=({materials:_materials,name:_name,...rest}:any)=>rest;
  const other=current.objects.filter(o=>o.role==='other'),before=baseline.objects.filter((o:any)=>o.role==='other');
  const changes=other.flatMap((item,i)=>jsonHash(item)===jsonHash(before[i])?[]:[{index:i,positionSHA256:item.geometry.attributes.position.sha256,beforeOpacity:before[i]?.materials.map((m:any)=>m.opacity),afterOpacity:item.materials.map((m:any)=>m.opacity),onlyOpacity:jsonHash({...item,materials:item.materials.map((m:any,j:number)=>({...m,opacity:before[i]?.materials[j]?.opacity}))})===jsonHash(before[i])}]);
  const gzip=arenaRead('public/assets/arena-floor-mask.rgba.gz'),decoded=gunzipSync(gzip),manifest=JSON.parse(arenaRead('source/arena-floor-mask-manifest.json').toString());
  if(manifest.asset.sha256!==arenaHash(gzip)||manifest.decoded.sha256!==arenaHash(decoded))throw new Error('Mask provenance does not match the actual bundled bytes');
  const files=['src/world.ts','src/scenery-arena-material.ts','src/scenery-arena-mask.ts','src/scenery-surfaces.ts','source/arena-floor-base.json','source/arena-floor-mask.json','source/arena-floor-mask-manifest.json','public/assets/arena-floor-mask.rgba.gz'];
  const report={verifiedAt:new Date().toISOString(),stage:'CPU invariant/mask audit; see separately executed tests and visual review',baseline:'tests/fixtures/arena-floor-baseline.json',baselineSHA256:arenaHash(arenaRead('tests/fixtures/arena-floor-baseline.json')),
    sourceHashes:Object.fromEntries(files.map(p=>[p,arenaHash(arenaRead(p))])),deployedVersion:current.deployedVersion,workerInputs:current.workerInputs,workerInputsUnchanged:current.workerInputs.length===17&&current.workerInputs.every(i=>i.current===i.expected),
    colliderCount:current.colliders.length,collidersUnchanged:jsonHash(current.colliders)===jsonHash(baseline.colliders),carHashes:Object.fromEntries(Object.entries(current.protectedFiles).filter(([p])=>p.startsWith('public/models/'))),
    arenaGeometryUnchanged:jsonHash(geometry(current.arena))===jsonHash(geometry(baseline.arena)),puddleGeometryUnchanged:jsonHash(current.puddles.map(geometry))===jsonHash(baseline.puddles.map(geometry)),waterMeshes:12,wetMeshes:12,
    renderObjects:current.objects.length,renderObjectCountUnchanged:current.objects.length===baseline.objects.length,otherMaterialChanges:changes,random:current.random,randomUnchanged:jsonHash(current.random)===jsonHash(baseline.random),surfaceFrames:current.surfaceFrames,
    mask:{compressedBytes:gzip.byteLength,compressedSHA256:arenaHash(gzip),decodedBytes:decoded.byteLength,decodedSHA256:arenaHash(decoded),width:1024,height:1024,bounds:[-48,-48,48,48],channels:['compaction','fineSediment','looseAggregate','wetness'],colorSpace:'linear data',flipY:false},backendDeploymentRequired:!current.workerInputs.every(i=>i.current===i.expected)};
  fs.mkdirSync(path.dirname(path.join(root,output)),{recursive:true});fs.writeFileSync(path.join(root,output),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({output,workerInputsUnchanged:report.workerInputsUnchanged,collidersUnchanged:report.collidersUnchanged,arenaGeometryUnchanged:report.arenaGeometryUnchanged,puddleGeometryUnchanged:report.puddleGeometryUnchanged,otherMaterialChanges:changes,mask:report.mask},null,2));
}
