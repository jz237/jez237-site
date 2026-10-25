import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {CAR_WET,WET_PAINT,finishPaint} from '../src/car-materials';
test('paint soaks in the rain: deeper colour, dark mud, a film of water and beads on the panels facing the sky',()=>{
 for(const contact of [false,true]){
  const material=new T.MeshPhysicalMaterial({clearcoat:1});finishPaint(material,contact);
  const shader={vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader,uniforms:{}} as unknown as T.WebGLProgramParametersWithUniforms;
  material.onBeforeCompile(shader,{} as T.WebGLRenderer);const f=shader.fragmentShader;
  assert.ok((shader.uniforms as Record<string,unknown>).carWet===CAR_WET,'one shared wetness for every car');
  assert.ok(f.includes('uniform float carWet;')&&f.includes(`diffuseColor.rgb*=1.-carWet*(${WET_PAINT.darken}+${WET_PAINT.mud}*dust);`)&&f.includes(`1.+carWet*${WET_PAINT.saturate}`),'darker, deeper paint and darker mud');
  assert.ok(f.includes('#ifdef FLAT_SHADED\nfloat wetSky=0.;'),'flat-shaded materials have no smooth normal to read');
  const bead=f.indexOf('float beadSize='),dust=f.indexOf('float dust='),rough=f.indexOf('roughnessFactor=mix(roughnessFactor,.03,bead);'),lights=f.indexOf('#include <lights_physical_fragment>'),film=f.indexOf('float wetTop=carWet*mix(.5,1.,');
  assert.ok(dust>=0&&dust<bead&&bead<rough&&lights<film,'beads after the dust and before the roughness; the film once the lighting normal is ready');
  assert.ok(f.includes(`material.roughness=mix(material.roughness,max(.05,material.roughness*${WET_PAINT.film}),wetTop);`)&&f.includes('material.clearcoatRoughness=mix(material.clearcoatRoughness,.02,wetTop);'));
  assert.ok(f.includes('*(1.-smoothstep(.35,.9,length(fwidth(beadCell))))'),'beads fade before they shrink below a pixel');
  material.dispose();
 }
 assert.equal(CAR_WET.value,0,'dry until told');
});
test('main soaks the cars in an offline rain event, not in the menu or the garage, with a QA override',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes("CAR_WET.value=carWetOverride??(eventLighting==='rain'&&state!=='menu'&&!garageOpen&&!online?.active?1:0);"));
 assert.ok(main.includes('carWet: (v?: number | null) => { if (v !== undefined) carWetOverride = v; return CAR_WET.value; },'));
});
