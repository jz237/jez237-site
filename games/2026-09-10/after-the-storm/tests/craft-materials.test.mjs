import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {craftSurface,craftUV} from '../craft-materials.js';

test('projected material UVs retain area on horizontal, vertical and side-facing triangles',()=>{
 for(const normal of [[1,0,0],[0,1,0],[0,0,1]]){
  const axes=[0,1,2].filter(i=>!normal[i]),a=[0,0,0],b=[0,0,0],c=[0,0,0];b[axes[0]]=1;c[axes[1]]=1;
  const geometry=new T.BufferGeometry();
  geometry.setAttribute('position',new T.Float32BufferAttribute([...a,...b,...c],3));
  geometry.setAttribute('normal',new T.Float32BufferAttribute([...normal,...normal,...normal],3));
  craftUV(geometry);const uv=geometry.attributes.uv;
  assert.equal(uv.count,3);assert.ok([...uv.array].every(Number.isFinite));
  const area=(uv.getX(1)-uv.getX(0))*(uv.getY(2)-uv.getY(0))-(uv.getX(2)-uv.getX(0))*(uv.getY(1)-uv.getY(0));
  assert.ok(Math.abs(area)>1,'the pattern is not collapsed to a stretched line');
  geometry.dispose();
 }
});

test('rider liveries share microstructure resources without sharing mutable materials',()=>{
 const a=craftSurface(new T.MeshPhysicalMaterial({color:0xff0000,roughness:.75}),'Vest livery');
 const b=craftSurface(new T.MeshPhysicalMaterial({color:0x0000ff,roughness:.8}),'Neoprene');
 assert.notEqual(a,b);assert.equal(a.normalMap,b.normalMap);assert.equal(a.roughnessMap,b.roughnessMap);
 assert.notEqual(a.normalScale,b.normalScale);a.roughness=.3;assert.equal(b.roughness,.8);
 assert.equal(a.userData.dryRoughness,.75);assert.equal(b.userData.dryRoughness,.8);
 for(const texture of [a.normalMap,a.roughnessMap]){
  assert.equal(texture.colorSpace,T.NoColorSpace);assert.equal(texture.wrapS,T.RepeatWrapping);assert.equal(texture.wrapT,T.RepeatWrapping);
  assert.equal(texture.generateMipmaps,true);assert.equal(texture.minFilter,T.LinearMipmapLinearFilter);
 }
 a.dispose();b.dispose();
});

test('skin and carbon use distinct bounded normal maps; polished hardware keeps its finish',()=>{
 const skin=craftSurface(new T.MeshPhysicalMaterial(),'Skin'),carbon=craftSurface(new T.MeshPhysicalMaterial(),'Carbon fibre'),metal=craftSurface(new T.MeshPhysicalMaterial({roughness:.2}),'Brushed titanium');
 assert.notEqual(skin.normalMap,carbon.normalMap);assert.equal(metal.normalMap,null);assert.equal(metal.roughnessMap,null);
 assert.equal(metal.roughness,.2);
 for(const material of [skin,carbon]){
  const data=material.normalMap.image.data;
  for(let i=0;i<data.length;i+=4){
   const length=Math.hypot((data[i]-128)/127,(data[i+1]-128)/127,(data[i+2]-128)/127);
   assert.ok(Math.abs(length-1)<.02);assert.ok(data[i+2]>128,'normal points out of the surface');
  }
  material.dispose();
 }
 metal.dispose();
});
