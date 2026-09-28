import fs from 'node:fs';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { loadCarWithoutImages, sha256, readProject } from './car-asset-audit';
const baseline=JSON.parse(readProject('tests/fixtures/coupe-rear-baseline.json').toString());
const originalPath=process.argv[2];if(!originalPath)throw new Error('Pass a local original coupe GLB path');
const bytes=fs.readFileSync(originalPath);if(sha256(bytes)!==baseline.car.sha256)throw new Error('Original GLB does not match frozen baseline');
const loader=new GLTFLoader().register(()=>({name:'CPU_IMAGE_PLACEHOLDER',loadTexture:async()=>new T.Texture()}));
const original=await loader.parseAsync(new Uint8Array(bytes).buffer,''),current=await loadCarWithoutImages('coupe');original.scene.updateMatrixWorld(true);current.scene.updateMatrixWorld(true);
function points(scene:T.Object3D,name:string){const mesh=scene.getObjectByName(name) as T.Mesh,p=mesh.geometry.getAttribute('position'),map=new Map<string,number[]>();for(let i=0;i<p.count;i++){const point=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);if(point.z> -1.2){const values=point.toArray().map(Math.fround);map.set(values.join(','),values);}}return map;}
function compare(a:Map<string,number[]>,b:Map<string,number[]>){
  const unmatched=[...a].filter(([key])=>!b.has(key));let maximum=0;const worst:any[]=[];
  for(const [,point] of unmatched){let nearest=Infinity,other:number[]=[];for(const candidate of b.values()){const distance=Math.hypot(...point.map((n,i)=>n-candidate[i]));if(distance<nearest){nearest=distance;other=candidate;}}
    maximum=Math.max(maximum,nearest);worst.push({distance:nearest,from:point,to:other});
  }
  return {unmatched:unmatched.length,maximum,worst:worst.sort((x,y)=>y.distance-x.distance).slice(0,5)};
}
const result=baseline.car.panelIds.map((name:string)=>{const a=points(original.scene,name),b=points(current.scene,name);return {name,oldPoints:a.size,newPoints:b.size,oldToNew:compare(a,b),newToOld:compare(b,a)};}).filter((r:any)=>r.oldToNew.unmatched||r.newToOld.unmatched);
console.log(JSON.stringify({originalSHA256:baseline.car.sha256,currentSHA256:sha256(readProject('public/models/coupe.glb')),changed:result},null,2));
if(process.argv.includes('--capture-reference')){
  for(const name of ['panel_rear_quarter_L','panel_rear_quarter_R']){
    const reference=points(original.scene,name),old=baseline.car.meshes.find((m:any)=>m.name===name),keys=[...reference.keys()].sort();
    if(reference.size!==old.forwardRegion.vertices||sha256(Buffer.from(keys.join('|')))!==old.forwardRegion.positionsSHA256)throw new Error('Original reference points do not match frozen point count/hash');
    old.forwardRegion.positions=keys.flatMap(key=>key.split(',').map(Number));
  }
  baseline.forwardRegionRoundingTolerance={panels:['panel_rear_quarter_L','panel_rear_quarter_R'],euclideanMetres:2.5e-7,equalUniqueVertexCountsRequired:true,bijectiveCorrespondenceRequired:true,measuredRevisedMaximumMetres:1.884864366154897e-7,cause:'Float32 inner-sheet normal/export rounding; all other panel positions remain exact',referenceSHA256:baseline.car.sha256};
  fs.writeFileSync(new URL('../tests/fixtures/coupe-rear-baseline.json',import.meta.url),JSON.stringify(baseline,null,2)+'\n');
}
