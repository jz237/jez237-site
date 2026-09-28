import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import * as T from 'three';
import { quarryCircuitSurface, prepareCircuitSurface } from '../src/scenery-circuit-material';
import { StaticQuarryShadows } from '../src/static-shadows';
import { circuitBase as base, circuitHash } from './circuit-surface-invariants';

const read=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
const manifest=()=>JSON.parse(read('source/circuit-surface-manifest.json').toString());
const compile=(material:T.Material)=>{
  const shader={uniforms:T.UniformsUtils.clone(T.ShaderLib.standard.uniforms),vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader};
  for(const key of ['map','normalMap','roughnessMap'])shader.uniforms[key].value=(material as any)[key];
  material.onBeforeCompile(shader,{} as T.WebGLRenderer);return shader;
};
const withMaterial=()=>{
  const original=T.TextureLoader.prototype.load;
  T.TextureLoader.prototype.load=function(file:string){const t=new T.Texture();t.name=file;return t;};
  try{return quarryCircuitSurface();}finally{T.TextureLoader.prototype.load=original;}
};

test('published circuit mask reproduces from tracked authoring data and remains confined to the original paved cells',async()=>{
  const m=manifest(),compressed=read(m.output),raw=gunzipSync(compressed),spec=JSON.parse(read(m.source).toString());
  assert.equal(circuitHash(compressed),m.gzipSha256);assert.equal(circuitHash(raw),m.rawSha256);
  assert.equal(compressed.length,m.gzipBytes);assert.equal(raw.length,2048*128*4);
  assert.equal(circuitHash(read(m.base)),m.baseSha256);assert.equal(circuitHash(read(m.source)),m.sourceSha256);
  const {generateCircuitSurface}=await import('../tools/generate-circuit-surface.mjs');
  const generated=generateCircuitSurface(spec,base);
  assert.equal(circuitHash(generated.data),m.rawSha256);assert.deepEqual(generated.stats,m.stats);
  const nonzero=[0,0,0,0];let cell=0,pavedColumns=0,gravelColumns=0,seamJump=0,largestInteriorJump=0;
  for(let x=0;x<2048;x++){
    const s=(x+.5)*base.lengthMetres/2048;
    while(cell<359&&s>=base.rows[cell+1].s)cell++;
    const paved=base.cells[cell].asphalt&&!base.cells[cell].authoredGravel;
    if(paved)pavedColumns++;else gravelColumns++;
    for(let y=0;y<128;y++)for(let c=0;c<4;c++){
      const i=(y*2048+x)*4+c,value=raw[i];
      if(!paved)assert.equal(value,0,'the authored gravel approach and original unpaved cells retain their materials');
      if(value)nonzero[c]++;
      if(x)largestInteriorJump=Math.max(largestInteriorJump,Math.abs(value-raw[i-4]));
      if(x===0)seamJump=Math.max(seamJump,Math.abs(value-raw[(y*2048+2047)*4+c]));
    }
  }
  assert.ok(pavedColumns>0&&gravelColumns>0);assert.deepEqual(nonzero,m.stats.map((s:any)=>s.nonzeroTexels));
  assert.ok(nonzero.every(n=>n>0));assert.ok(nonzero[1]<nonzero[0]/8&&nonzero[2]<nonzero[0]/8,'repair and rubber are finite features, not full-length repeated bands');
  assert.ok(seamJump<=largestInteriorJump,'periodic seam has no greater discontinuity than authored neighbouring texels');
  const photos=JSON.parse(read('public/assets/manifest.json').toString());
  for(const file of ['circuit_asphalt_diff.jpg','circuit_asphalt_nor_gl.jpg','circuit_asphalt_rough.jpg']){
    const photo=photos.find((p:any)=>p.file===file);assert.ok(photo);assert.equal(photo.scale_metres,3);assert.equal(photo.license,'CC0-1.0');assert.equal(circuitHash(read('public/assets/'+file)),photo.sha256);
  }
});

test('actual circuit loader validates decoded bytes, retries failure and shares one correctly oriented periodic mask',async()=>{
  const m=manifest(),original=globalThis.fetch;let calls=0;
  globalThis.fetch=async()=>{calls++;return calls===1?new Response('temporary',{status:503}):new Response(read(m.output));};
  const material=withMaterial();
  try{
    await assert.rejects(prepareCircuitSurface(),/503/);
    const first=prepareCircuitSurface(),second=prepareCircuitSurface();assert.equal(first,second);await first;await prepareCircuitSurface();assert.equal(calls,2);
    const shader=compile(material),mask=shader.uniforms.circuitMask.value as T.DataTexture;
    assert.equal(shader.uniforms.circuitReady.value,1);assert.equal(mask.image.width,2048);assert.equal(mask.image.height,128);
    assert.equal(circuitHash(mask.image.data as Uint8Array),m.rawSha256);
    assert.equal(mask.flipY,false);assert.equal(mask.colorSpace,T.NoColorSpace);assert.equal(mask.wrapS,T.RepeatWrapping);assert.equal(mask.wrapT,T.ClampToEdgeWrapping);
    assert.equal(mask.minFilter,T.LinearMipmapLinearFilter);assert.equal(mask.magFilter,T.LinearFilter);assert.equal(mask.generateMipmaps,true);assert.equal(mask.anisotropy,8);
    assert.equal(m.textureSettings.minFilter,'LinearMipmapLinearFilter');assert.equal(m.textureSettings.generateMipmaps,true);
  }finally{globalThis.fetch=original;material.dispose();}
});

test('real circuit shader registers color, relief and roughness in the same frame and composes with static sun shadows',()=>{
  const material=withMaterial(),shader=compile(material),fragment=shader.fragmentShader,key=material.customProgramCacheKey();
  assert.match(shader.vertexShader,/vCircuitMetres=circuitMetres; vCircuitEdge=circuitEdge;/);
  assert.ok(fragment.includes('float cGate=texture2D(circuitMask,vec2(cMaskUV.x,.5)).r*circuitReady;'));
  for(const name of ['circuitMicro','circuitNormal','circuitRough'])assert.ok(fragment.includes(`circuitPhoto(${name},cUV,cDx,cDy,cWeights,cA,cB,cC)`),'color/normal/roughness use identical stochastic transforms and explicit gradients');
  const normalGate=fragment.lastIndexOf('if(cGate>.001)');
  for(const name of ['asphaltFrame','looseFrame','fineFrame','groundFrame']){
    const declaration=fragment.indexOf(`mat3 ${name}=getTangentFrame`);assert.ok(declaration>0&&declaration<normalGate,'derivative frames are evaluated outside the mask branch');
  }
  assert.ok(fragment.indexOf('vec2 cDx=dFdx(cUV)')<fragment.indexOf('if(cGate>.001)'));
  for(const name of ['quarryDirt','quarryDirtNormal','quarryDirtRoughness'])assert.ok(fragment.includes(`textureGrad(${name},cFineUV,cFineDx,cFineDy)`),'the added fine sediment reuses registered color/normal/roughness maps at the same scale');
  const textures=new Set(Object.values(shader.uniforms).filter((u:any)=>u.value?.isTexture).map((u:any)=>u.value));assert.ok(textures.size<=12,'reserve headroom for lighting/shadow samplers; the real browser must still verify the compiled fragment program');
  assert.equal(shader.uniforms.circuitRock,undefined,'the independently proven zero-exposure circuit does not need the terrain bedrock sampler');
  const scene=new T.Scene(),geometry=new T.BoxGeometry(1,1,1),caster=new T.Mesh(geometry,new T.MeshStandardMaterial());caster.castShadow=true;scene.add(caster);
  const shadows=new StaticQuarryShadows(scene,new Set()),receiver=new T.Mesh(geometry,material);receiver.receiveShadow=true;
  try{
    shadows.bindReceivers(receiver);const final=compile(material);
    for(const part of fragment.split(/#include <(?:shadowmap_pars_fragment|lights_fragment_begin)>/))assert.ok(final.fragmentShader.includes(part),'new surface shading survives static-shadow composition');
    assert.ok(final.fragmentShader.includes('min(getShadow( directionalShadowMap[ i ]'));
    assert.ok(material.customProgramCacheKey().startsWith(key+'|'),'shadow composition extends the current material cache key');
    for(const [key,uniform]of Object.entries(shader.uniforms))if((uniform as any).value?.isTexture)assert.equal(final.uniforms[key].value,(uniform as any).value);
  }finally{shadows.dispose();geometry.dispose();caster.material.dispose();material.dispose();}
});
