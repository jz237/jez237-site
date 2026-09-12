import {loadCraftLOD,craftGeometryLOD} from './mesh-lod.js';
import * as T from './vendor/three.module.js';
import {riderPose} from './rider-pose.js';
let asset=null;
try{
 const [a,b]=await Promise.all([fetch(new URL('./assets/coastal-rider.json',import.meta.url)),fetch(new URL('./assets/coastal-rider.bin',import.meta.url))]);
 if(!a.ok||!b.ok)throw new Error('Rider asset request failed');
 const meta=await a.json(),buffer=await b.arrayBuffer();
 const meshes=meta.meshes.map(part=>{
  const geometry=new T.BufferGeometry(),values=new Float32Array(buffer,part.offset,part.vertices*6),data=new T.InterleavedBuffer(values,6);
  geometry.setAttribute('position',new T.InterleavedBufferAttribute(data,3,0));geometry.setAttribute('normal',new T.InterleavedBufferAttribute(data,3,3));
  const uv=new Float32Array(part.vertices*2);for(let i=0;i<part.vertices;i++){uv[i*2]=values[i*6]*9;uv[i*2+1]=values[i*6+1]*9;}
  geometry.setAttribute('uv',new T.BufferAttribute(uv,2));geometry.computeBoundingSphere();return {...part,geometry};
 });asset={meta,meshes};
}catch(error){console.warn('Blender rider unavailable; using the built-in rider.',error);}
const lodGeometry=await loadCraftLOD('coastal-rider');
const up=new T.Vector3(0,1,0),skinTones=[0xbf8967,0xd9a88a,0x815237,0xad7959];
let fabric=null;
function fabricTexture(){
 if(fabric)return fabric;const pixels=new Uint8Array(32*32*4);
 for(let y=0;y<32;y++)for(let x=0;x<32;x++){const i=(y*32+x)*4;pixels[i]=128+(x%2?5:-5);pixels[i+1]=128+(y%2?5:-5);pixels[i+2]=254;pixels[i+3]=255;}
 fabric=new T.DataTexture(pixels,32,32);fabric.wrapS=fabric.wrapT=T.RepeatWrapping;fabric.needsUpdate=true;return fabric;
}
export function makeBlenderRider(parent,{color=null,riderIndex=0}={}){
 if(!asset)return null;
 const root=new T.Group();root.name='Blender / adult coastal rider';parent.add(root);
 const groups=Object.fromEntries(Object.keys(asset.meta.bones).map(name=>{const g=new T.Group();g.name=name;root.add(g);return [name,g];}));
 const materials=Object.fromEntries(Object.entries(asset.meta.materials).map(([name,spec])=>{
  const m=new T.MeshPhysicalMaterial({...spec,side:T.DoubleSide});m.name=name;
  if(name==='Skin')m.color.setHex(skinTones[riderIndex%4]);
  if(name==='Skin shadow')m.color.setHex(skinTones[riderIndex%4]).multiplyScalar(.65);
  if(name==='Lips')m.color.setHex(skinTones[riderIndex%4]).lerp(new T.Color(0x8d4f4b),.35);
  if(color!==null&&name==='Vest livery')m.color.setHex(color);
  if(['Neoprene','Vest livery','Stretch panels'].includes(name)){m.normalMap=fabricTexture();m.normalScale=new T.Vector2(.24,.24);}
  return [name,m];
 }));
 for(const [partIndex,part] of asset.meshes.entries()){const m=new T.Mesh(part.geometry,materials[part.material]);craftGeometryLOD(m,lodGeometry?.[partIndex]);m.castShadow=true;m.receiveShadow=true;groups[part.bone].add(m);}
 const start=new T.Vector3(),end=new T.Vector3(),direction=new T.Vector3();
 function update(pose='',time=0,turn=0,motion={}){
  const p=riderPose(pose,time,turn,motion);root.rotation.y=p.yaw;
  for(const [name,[a,b]] of Object.entries(p.targets)){
   const g=groups[name];start.fromArray(a);end.fromArray(b);direction.subVectors(end,start);const length=direction.length();
   g.position.copy(start);g.quaternion.setFromUnitVectors(up,direction.normalize());g.scale.set(1,length/asset.meta.bones[name].length,1);
  }
  groups.head.rotateY(p.headYaw);
 }
 update();return {root,update};
}
export function installBlenderRider(v,{riderIndex=0}={}){
 const rider=makeBlenderRider(v.body,{riderIndex});if(!rider)return false;
 v.body.remove(v.rider);v.rider.traverse(o=>o.geometry?.dispose());v.rider=rider.root;
 v.updateRider=({time=0,turn=0,...motion}={})=>rider.update('',time,turn,motion);
 return true;
}
