import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import type {Obstacle} from './TankSpace';
const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
/** Free photogrammetric surfaces retain their scan UVs while wood bends into the composition. */
export async function buildScannedHardscape(scene:T.Scene,obstacles:Obstacle[],height:(x:number,z:number)=>number){
 const loader=new GLTFLoader();
 const [woodFile,rockFile]=await Promise.all([
  loader.loadAsync('./models/dead_tree_trunk_02/dead_tree_trunk_02_2k.gltf'),
  loader.loadAsync('./models/rock_moss_set_01/rock_moss_set_01_2k.gltf')
 ]);
 const wood=woodFile.scene.children[0] as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>;
 const woodMaterial=wood.material.clone();woodMaterial.color.set(0xc6ad8d);woodMaterial.roughness=.96;woodMaterial.normalScale.set(.85,.85);woodMaterial.side=T.FrontSide;
 for(const texture of [woodMaterial.map,woodMaterial.normalMap,woodMaterial.roughnessMap])if(texture)texture.anisotropy=8;
 const source=wood.geometry.getAttribute('position');wood.geometry.computeBoundingBox();const bounds=wood.geometry.boundingBox!;
 const length=bounds.max.x-bounds.min.x,centerY=(bounds.max.y+bounds.min.y)/2,centerZ=(bounds.max.z+bounds.min.z)/2;
 const branch=(points:number[][],thickness:number,roll:number,reverse=false)=>{
  const curve=new T.CatmullRomCurve3(points.map(p=>V(...p as [number,number,number]))),frames=curve.computeFrenetFrames(160,false);
  const geometry=wood.geometry.clone(),positions=geometry.getAttribute('position') as T.BufferAttribute;
  for(let i=0;i<source.count;i++){
   const fraction=(source.getX(i)-bounds.min.x)/length,t=reverse?1-fraction:fraction,step=Math.min(159,Math.floor(t*160)),f=t*160-step;
   const normal=frames.normals[step].clone().lerp(frames.normals[step+1],f).normalize(),binormal=frames.binormals[step].clone().lerp(frames.binormals[step+1],f).normalize();
   const y=(source.getY(i)-centerY)*thickness,z=(source.getZ(i)-centerZ)*thickness;
   const c=Math.cos(roll+t*.35),s=Math.sin(roll+t*.35),point=curve.getPointAt(t).addScaledVector(normal,y*c-z*s).addScaledVector(binormal,y*s+z*c);
   positions.setXYZ(i,point.x,point.y,point.z);
  }
  geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();
  const mesh=new T.Mesh(geometry,woodMaterial);mesh.castShadow=mesh.receiveShadow=true;scene.add(mesh);
  // Conservative chain of body-sized contact envelopes around the complete log, including the ends.
  for(let i=0;i<=24;i++)obstacles.push({center:curve.getPointAt(i/24),radius:thickness*.40+.025});
 };
 branch([[-3.1,.72,.45],[-2.6,1.3,.04],[-2.65,2.1,-.2],[-3.05,2.85,-.32],[-3.25,3.7,-.46]],1.2,.3);
 branch([[-2.72,1.35,.15],[-1.95,1.17,.38],[-1.1,1.05,.72],[-.1,.65,1.14],[.63,.49,1.4]],.8,1.4,true);
 branch([[-2.68,1.8,-.22],[-1.86,2.15,-.31],[-1.02,2.72,-.52],[.2,3.3,-.8],[1.4,3.55,-.99]],.63,.7,true);
 branch([[-2.63,2.05,-.28],[-2.15,2.74,-.56],[-1.6,3.65,-.68],[-.8,4.54,-.87]],.46,2.1);
 branch([[-1.02,2.7,-.51],[-.64,3.19,-.6],[-.12,3.52,-.69]],.28,.4,true);
 branch([[-3.04,.72,.47],[-3.64,.56,.92],[-4.3,.4,1.52]],.40,1.9);
 const sourceRocks=rockFile.scene.children.filter(o=>o instanceof T.Mesh) as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>[];
 const rockMaterial=sourceRocks[0].material.clone();rockMaterial.color.set(0xa1b0a1);rockMaterial.normalScale.set(.9,.9);rockMaterial.roughness=.92;
 for(const t of [rockMaterial.map,rockMaterial.normalMap,rockMaterial.roughnessMap])if(t)t.anisotropy=8;
 const placements=[
  [3,-3.58,.26,2.55,.55,-.25], [2,-2.85,-.85,1.34,1.45,.15], [0,-4.12,-1.38,1.3,.7,.1],
  [1,-2.83,1.27,1.18,-.7,.0], [4,-1.7,.50,.88,1.0,.1], [2,-.55,-.72,.95,-.8,.25],
  [5,3.74,-.7,1.23,.5,.1], [3,4.2,1.06,.78,-1.2,.12], [1,2.9,-1.77,.72,.1,.1]
 ];
 for(const [id,x,z,size,yaw,tilt] of placements){
  const geo=sourceRocks[id].geometry.clone();geo.computeBoundingBox();const box=geo.boundingBox!,center=box.getCenter(new T.Vector3());geo.translate(-center.x,-box.min.y,-center.z);const extent=box.getSize(new T.Vector3()),scale=size/Math.max(extent.x,extent.z);
  const mesh=new T.Mesh(geo,rockMaterial);mesh.scale.setScalar(scale);mesh.rotation.set(tilt,yaw,.15);mesh.position.set(x,height(x,z)-.12,z);mesh.castShadow=mesh.receiveShadow=true;scene.add(mesh);
  mesh.updateMatrixWorld();const worldBox=new T.Box3().setFromObject(mesh),sphere=worldBox.getBoundingSphere(new T.Sphere());obstacles.push({center:sphere.center,radius:sphere.radius*.81});
 }
}

/** Photographic fern fronds on curved fixed meshes, with restrained current movement. */
export async function buildScannedFerns(scene:T.Scene,height:(x:number,z:number)=>number,time:{value:number}){
 const [file,alpha]=await Promise.all([new GLTFLoader().loadAsync('./models/fern_02/fern_02_2k.gltf'),new T.TextureLoader().loadAsync('./models/fern_02/textures/fern_02_alpha_2k.png')]);
 alpha.flipY=false;alpha.anisotropy=8;
 const plants=file.scene.children as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>[];
 const material=plants[0].material.clone();material.alphaMap=alpha;material.alphaTest=.4;material.transparent=false;material.side=T.DoubleSide;material.color.set(0xc9e3a2);material.roughness=.7;material.normalScale.set(.55,.55);
 for(const t of [material.map,material.normalMap,material.roughnessMap])if(t)t.anisotropy=8;
 material.onBeforeCompile=shader=>{
  shader.uniforms.waterTime=time;shader.vertexShader='uniform float waterTime;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>\nfloat h=max(0.,position.y);transformed.x+=sin(waterTime*.7+position.x*2.+modelMatrix[3].x)*.035*h*h;transformed.z+=sin(waterTime*.5+position.z*3.)*.022*h*h;`);
 };
 const placements=[[0,-3.5,.92,1.6,1.0],[1,-2.65,1.55,1.1,.0],[2,-2.05,.73,1.35,2.2],[3,-1.1,.10,1.5,1.5],[0,-4.45,-.4,1.2,.8],[3,-3.48,-.95,1.4,2.1],[2,-.05,-1.2,1.05,.7],[1,3.0,-.5,1.3,2.5],[0,4.26,.45,1.0,1.5],[2,3.73,1.56,.8,1.6]];
 for(const [id,x,z,width,yaw] of placements){
  const geo=plants[id].geometry.clone();geo.computeBoundingBox();const box=geo.boundingBox!,center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());geo.translate(-center.x,-box.min.y,-center.z);
  const mesh=new T.Mesh(geo,material);mesh.scale.setScalar(width/Math.max(size.x,size.z));mesh.position.set(x,height(x,z)+.035,z);mesh.rotation.y=yaw;mesh.castShadow=mesh.receiveShadow=true;
  mesh.customDepthMaterial=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,alphaMap:alpha,alphaTest:.4,side:T.DoubleSide});scene.add(mesh);
 }
}
