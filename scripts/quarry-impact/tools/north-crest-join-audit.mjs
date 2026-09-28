// CPU-only diagnostic of the saved forest-mineral-join view. No renderer/GPU.
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { tsImport } from 'tsx/esm/api';

const { terrainGeometry, cliffGeometry } = await tsImport('../src/quarry-layout.ts', import.meta.url);
const spec = JSON.parse(await fs.readFile('source/north-forest-floor.json'));
const crest = JSON.parse(await fs.readFile('source/north-forest-crest.json'));
const compressed = await fs.readFile('dist/assets/north-forest-floor.rgba.gz');
const weights = gunzipSync(compressed), sha = bytes => createHash('sha256').update(bytes).digest('hex');
const smooth = (a,b,v) => { const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t); };
function mask(x,z) {
  const [w,h]=spec.size,[x0,z0,x1,z1]=spec.bounds, px=(x-x0)/(x1-x0)*w-.5,pz=(z-z0)/(z1-z0)*h-.5;
  const ix=Math.floor(px),iz=Math.floor(pz),u=px-ix,v=pz-iz;
  const at=(i,j,c)=>weights[(Math.max(0,Math.min(h-1,j))*w+Math.max(0,Math.min(w-1,i)))*4+c]/255;
  return [0,1,2,3].map(c=>(at(ix,iz,c)*(1-u)+at(ix+1,iz,c)*u)*(1-v)+(at(ix,iz+1,c)*(1-u)+at(ix+1,iz+1,c)*u)*v);
}
function crestDistance(x,z) {
  let best={distance:Infinity};
  for(let i=1;i<crest.points.length;i++) {
    const a=crest.points[i-1],b=crest.points[i],dx=b[0]-a[0],dz=b[2]-a[2];
    const t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[2])*dz)/(dx*dx+dz*dz)));
    const distance=Math.hypot(x-a[0]-t*dx,z-a[2]-t*dz);
    if(distance<best.distance)best={distance,segment:i-1,point:a.map((n,k)=>n+t*(b[k]-n))};
  }return best;
}
function mesh(data,name) {
  const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(data.positions,3));g.setIndex(new T.BufferAttribute(data.indices,1));g.computeVertexNormals();
  const m=new T.Mesh(g,new T.MeshBasicMaterial({side:T.DoubleSide}));m.name=name;m.updateMatrixWorld();return m;
}
const terrain=mesh(terrainGeometry(),'terrain'),ring=mesh(cliffGeometry(),'ring');
const bytes=await fs.readFile('dist/models/quarry-headwall.glb');
const gltf=await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'');gltf.scene.updateMatrixWorld(true);
const near=[],far=[];
gltf.scene.traverse(o=>{if(o instanceof T.Mesh&&/^HeadwallRock_/.test(o.name)) {
  o.material.side=T.DoubleSide;(/_near$/.test(o.name)?near:far).push(o);
}});
// Match the current inspect-mode OrbitControls clamp, which still runs when its
// interactive input handling is disabled. Recorded intended pose is unchanged.
const intended=new T.Vector3(65,42,144),target=new T.Vector3(83,31,220),offset=intended.clone().sub(target);
const spherical=new T.Spherical().setFromVector3(offset);spherical.radius=Math.min(22,Math.max(2.5,spherical.radius));
spherical.phi=Math.min(Math.PI*.48,spherical.phi);
const camera=new T.PerspectiveCamera(52,2560/1440,.1,850);camera.position.copy(target).add(new T.Vector3().setFromSpherical(spherical));camera.lookAt(target);camera.updateMatrixWorld();
const ray=new T.Raycaster(), report={maskSha256:sha(compressed),headwallSha256:sha(bytes),intendedCamera:intended.toArray(),actualClampedCamera:camera.position.toArray(),target:target.toArray(),rays:[],vertical:[],notes:[]};
function describe(hit) {
  const p=hit.point,paint=mask(p.x,p.z),face=hit.face.normal.clone().transformDirection(hit.object.matrixWorld),nearest=crestDistance(p.x,p.z);
  return {mesh:hit.object.name,p:p.toArray(),distance:hit.distance,faceNormal:face.toArray(),smoothNormal:hit.normal?.toArray(),paint,
    geometricSlopeGate:smooth(.55,.88,Math.abs(face.y)),crestBlend:paint[2]*smooth(.55,.88,Math.abs(face.y)),crest:nearest};
}
for(const x of [160,480,800,1120,1440,1760,2080,2400]) {
  let previous;
  for(let y=540;y<=1370;y+=10) {
    ray.setFromCamera(new T.Vector2(x/1280-1,1-y/720),camera);
    const hits=ray.intersectObjects([terrain,ring,...near],false);if(!hits.length)continue;
    const first=describe(hits[0]), kind=first.mesh==='terrain'?'terrain':'rock';
    if(previous&&kind!==previous.kind)report.rays.push({x,y,above:previous.hit,below:first});
    previous={kind,hit:first};
  }
}
const down=new T.Vector3(0,-1,0);
for(const index of [22,24,26,28,30,32]) {
  const p=crest.points[index];if(!p)continue;
  ray.set(new T.Vector3(p[0],100,p[2]),down);const hits=ray.intersectObject(terrain,false);
  if(hits[0])report.vertical.push({index,crest:p,terrain:describe(hits[0]),verticalGap:p[1]-hits[0].point.y});
}
report.notes.push('Mask lookup is bilinear at mip0; a distant GPU sample may average nearby texels. It cannot turn a strong spatial discrepancy into agreement.');
const output=process.env.QUARRY_JOIN_AUDIT_OUTPUT||'outputs/forest-edge/dense-crest/mineral-join-audit.json';
await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,camera:report.actualClampedCamera,rays:report.rays.map(r=>({x:r.x,y:r.y,above:{mesh:r.above.mesh,p:r.above.p,B:r.above.paint[2],gate:r.above.geometricSlopeGate,crestDistance:r.above.crest.distance},below:{mesh:r.below.mesh,p:r.below.p,B:r.below.paint[2],gate:r.below.geometricSlopeGate,crestDistance:r.below.crest.distance}})),vertical:report.vertical.map(p=>({index:p.index,gap:p.verticalGap}))},null,2));
