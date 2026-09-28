import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import * as T from 'three';
import { quarryRock } from '../src/scenery-surfaces';
import { northForestRock } from '../src/scenery-north-crest';
import { StaticQuarryShadows } from '../src/static-shadows';

const read=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
const hash=(bytes:Uint8Array,algorithm='sha256')=>createHash(algorithm).update(bytes).digest('hex');
const compile=(material:T.MeshStandardMaterial)=>{
  const shader={uniforms:T.UniformsUtils.clone(T.ShaderLib.standard.uniforms),vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader};
  for(const key of ['map','normalMap','roughnessMap'])shader.uniforms[key].value=(material as any)[key];
  material.onBeforeCompile(shader,{} as T.WebGLRenderer);return shader;
};

test('geology photographs remain exact licensed source bytes with one registered physical scale',()=>{
  const manifest=JSON.parse(read('public/assets/manifest.json').toString());let bytes=0;
  for(const file of ['geology_rock_diff.jpg','geology_rock_nor_gl.jpg','geology_rock_rough.jpg']){
    const record=manifest.filter((m:any)=>m.file===file);assert.equal(record.length,1);const m=record[0],data=read('public/assets/'+file);
    assert.equal(hash(data),m.sha256);assert.equal(hash(data,'md5'),m.source_md5);assert.equal(data.length,m.bytes);bytes+=data.length;
    assert.equal(m.source,'https://polyhaven.com/a/rock_face_03');assert.equal(m.license,'CC0-1.0');assert.equal(m.scale_metres,2.7);
    assert.ok(m.source_dimensions_mm.every((v:number)=>Math.abs(v/1000-m.scale_metres)<1e-5));
  }
  assert.equal(bytes,8926508,'no unreviewed resampling or replacement source bytes');
});

test('actual rock shader registers each projected DNR frame, retains instance transforms, and composes with crest and sun shadows',()=>{
  const original=T.TextureLoader.prototype.load;T.TextureLoader.prototype.load=function(file:string){const t=new T.Texture();t.name=file;return t;};
  let material:T.MeshStandardMaterial|undefined,base:T.MeshStandardMaterial|undefined,shadows:StaticQuarryShadows|undefined;
  const geometry=new T.BoxGeometry(1,1,1),casterMaterial=new T.MeshStandardMaterial();
  try{
    base=quarryRock();material=northForestRock();const shader=compile(material),plain=compile(base),s=shader.fragmentShader;
    assert.equal(material.name,'quarry-photographic-geology');assert.equal(material.map!.colorSpace,T.SRGBColorSpace);
    assert.equal(material.normalMap!.colorSpace,T.NoColorSpace);assert.equal(material.roughnessMap!.colorSpace,T.NoColorSpace);
    assert.ok(shader.vertexShader.includes('geologyWorldPosition=instanceMatrix*geologyWorldPosition;'));
    assert.ok(shader.vertexShader.includes('vQuarryPosition=(modelMatrix*geologyWorldPosition).xyz;'));
    assert.ok(shader.vertexShader.includes('inverseTransformDirection(transformedNormal,viewMatrix)'));
    for(const [axis,swizzle]of [['X','zy'],['Y','xz'],['Z','xy']]){
      assert.ok(s.includes(`geology${axis}=geologyPosition.${swizzle}/2.7`),'the primary colour, relief and roughness source uses its documented metres');
      for(const map of ['map','normalMap','roughnessMap'])assert.ok(s.includes(`geologyPhoto(${map},geology${axis},geology${axis}dx,geology${axis}dy)`),'primary DNR maps use identical translated coordinates and explicit gradients');
      assert.ok(s.includes(`geologyOld${axis}=geologyPosition.${swizzle}/1.8+vec2(.173,.419)`));
      for(const map of ['geologyWeatheredColor','geologyWeatheredNormal','geologyWeatheredRough'])assert.ok(s.includes(`textureGrad(${map},geologyOld${axis},geologyOld${axis}dx,geologyOld${axis}dy)`));
      assert.ok(s.includes(`geology${axis}frame=getTangentFrame(-vViewPosition,nonPerturbedNormal,geology${axis})`),'each projected normal uses its own derivative frame and unperturbed normal');
      assert.ok(s.includes(`geology${axis}frame[0]*=faceDirection;geology${axis}frame[1]*=faceDirection;`),'back faces keep a correctly oriented tangent frame');
    }
    for(const [key,u]of Object.entries(plain.uniforms))if((u as any).value?.isTexture)assert.equal(shader.uniforms[key].value,(u as any).value);
    assert.equal(compile(quarryRock()).fragmentShader,plain.fragmentShader,'crest wrapping does not mutate the base factory');
    const textures=new Set(Object.values(shader.uniforms).filter((u:any)=>u.value?.isTexture).map((u:any)=>u.value));
    assert.equal(textures.size,10,'ten surface samplers reserve the remaining units for environment and both shadow maps');
    const scene=new T.Scene(),caster=new T.Mesh(geometry,casterMaterial);caster.castShadow=true;scene.add(caster);
    shadows=new StaticQuarryShadows(scene,new Set());const receiver=new T.Mesh(geometry,material);receiver.receiveShadow=true;const key=material.customProgramCacheKey();
    shadows.bindReceivers(receiver);const final=compile(material);
    for(const part of s.split(/#include <(?:shadowmap_pars_fragment|lights_fragment_begin)>/))assert.ok(final.fragmentShader.includes(part),'every geology/crest instruction survives shadow composition');
    assert.ok(final.fragmentShader.includes('min(getShadow( directionalShadowMap[ i ]'));assert.ok(material.customProgramCacheKey().startsWith(key+'|'));
    for(const [key,u]of Object.entries(shader.uniforms))if((u as any).value?.isTexture)assert.equal(final.uniforms[key].value,(u as any).value);
  }finally{shadows?.dispose();material?.dispose();base?.dispose();geometry.dispose();casterMaterial.dispose();T.TextureLoader.prototype.load=original;}
});
