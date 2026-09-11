import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import type {Obstacle} from './TankSpace';
import {EpiphyteMoss} from './EpiphyteMoss';
import {aquascapeBranches,bendScannedBranch} from './ScannedBranch';
import {rockPlacements,shapeScannedRock} from './ScannedRock';
/** Free photogrammetric surfaces retain their scan UVs while wood bends into the composition. */
export async function buildScannedHardscape(scene:T.Scene,obstacles:Obstacle[],height:(x:number,z:number)=>number){
 const loader=new GLTFLoader();
 const moss=new EpiphyteMoss();
 const [woodFile,rockFile]=await Promise.all([
  loader.loadAsync('./models/dead_tree_trunk_02/dead_tree_trunk_02_2k.gltf'),
  loader.loadAsync('./models/rock_moss_set_01/rock_moss_set_01_2k.gltf')
 ]);
 const wood=woodFile.scene.children[0] as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>;
 const woodMaterial=new T.MeshPhysicalMaterial({map:wood.material.map,normalMap:wood.material.normalMap,roughnessMap:wood.material.roughnessMap,color:0x9d805b,roughness:.9,normalScale:new T.Vector2(.95,.95),side:T.FrontSide,vertexColors:true,metalness:0,ior:1.22,specularIntensity:.65});
 for(const texture of [woodMaterial.map,woodMaterial.normalMap,woodMaterial.roughnessMap])if(texture)texture.anisotropy=8;
 for(const branch of aquascapeBranches){
  const {geometry,obstacles:contacts}=bendScannedBranch(wood.geometry,branch);
  const mesh=new T.Mesh(geometry,woodMaterial);mesh.castShadow=mesh.receiveShadow=true;scene.add(mesh);
  moss.sample(mesh,155);obstacles.push(...contacts);
 }
 const sourceRocks=rockFile.scene.children.filter(o=>o instanceof T.Mesh) as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>[];
 const rockSource=sourceRocks[0].material;
 const rockMaterial=new T.MeshPhysicalMaterial({map:rockSource.map,normalMap:rockSource.normalMap,roughnessMap:rockSource.roughnessMap,aoMap:rockSource.aoMap,color:0x7f9286,normalScale:new T.Vector2(.95,.95),roughness:.9,metalness:0,ior:1.22,specularIntensity:.75});
 rockMaterial.onBeforeCompile=shader=>{
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   float mineralLuma=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
   diffuseColor.rgb=mix(vec3(mineralLuma),diffuseColor.rgb,.34)*vec3(.68,.72,.76);
  `);
 };
 for(const t of [rockMaterial.map,rockMaterial.normalMap,rockMaterial.roughnessMap])if(t)t.anisotropy=8;
 for(const [id,x,z,size,yaw,tilt] of rockPlacements){
  const geo=shapeScannedRock(sourceRocks[id].geometry,size,yaw,tilt);
  const mesh=new T.Mesh(geo,rockMaterial);mesh.position.set(x,height(x,z)-.12,z);mesh.castShadow=mesh.receiveShadow=true;scene.add(mesh);
  mesh.updateMatrixWorld();const sphere=geo.boundingSphere!.clone().applyMatrix4(mesh.matrixWorld);obstacles.push({center:sphere.center,radius:sphere.radius});
  moss.sample(mesh,70,.7);
 }
 moss.build(scene);
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
