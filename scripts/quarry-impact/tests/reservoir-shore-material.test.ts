import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import {createHash} from 'node:crypto';
import {addReservoirShoreDetail} from '../src/reservoir-shore-material';import {createReservoirShore} from '../src/reservoir-shore';
test('shore texture pass preserves all existing terrain vertices and seeded trees',()=>{
 const s=createReservoirShore(),g=(s.root.children[0]as T.Mesh).geometry,h=createHash('sha256');for(const name of ['position','color','normal'])h.update(Buffer.from(g.attributes[name].array.buffer));h.update(Buffer.from(g.index!.array.buffer));h.update(JSON.stringify(s.root.userData.trees));assert.equal(h.digest('hex'),'53b8bb3f9049f24432a6a8982fc0a79586717919dd0ea1852087bc3acf0548bb');s.dispose();
});
test('shore material composes the existing shader and releases both photographs exactly once',()=>{
 const m=new T.MeshStandardMaterial(),original=m.onBeforeCompile,key=m.customProgramCacheKey,detail=addReservoirShoreDetail(m);let disposals=0;detail.textures.forEach(t=>{assert.equal(t.wrapS,T.RepeatWrapping);assert.equal(t.colorSpace,T.SRGBColorSpace);t.addEventListener('dispose',()=>disposals++);});
 const shader={uniforms:{},vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader} as any;m.onBeforeCompile(shader,{}as T.WebGLRenderer);assert.equal(shader.uniforms.reservoirRock.value,detail.textures[0]);assert.equal(shader.uniforms.reservoirSoil.value,detail.textures[1]);assert.ok(shader.fragmentShader.indexOf('float shoreWet=')<shader.fragmentShader.indexOf('roughnessFactor=mix(.96,.62,shoreWet)'));assert.ok(shader.vertexShader.includes('reservoirNormal=inverseTransformDirection'));assert.ok(m.customProgramCacheKey().endsWith('|reservoir-shore-detail-v1'));
 detail.dispose();detail.dispose();assert.equal(disposals,2);assert.equal(m.onBeforeCompile,original);assert.equal(m.customProgramCacheKey,key);m.dispose();
});
