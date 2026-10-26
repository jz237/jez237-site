import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {SCRAPE,finishPaint} from '../src/car-materials';
const compile=(contact:boolean)=>{const m=new T.MeshPhysicalMaterial();finishPaint(m,contact);const shader={uniforms:{} as Record<string,{value:unknown}>,vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};
  m.onBeforeCompile(shader as any,undefined as any);return {shader,key:m.customProgramCacheKey()};};
test('scraped paint wears through in layers: the clear coat scuffs first, then primer, then metal',()=>{
  assert.ok(SCRAPE.scuff[0]<SCRAPE.primer[0]&&SCRAPE.scuff[1]<SCRAPE.primer[1],'scuffs before it wears to primer');
  assert.ok(SCRAPE.pale>0&&SCRAPE.pale<1&&SCRAPE.cover>0&&SCRAPE.cover<=1&&SCRAPE.patch>0&&SCRAPE.patch<1);
  for(const contact of [false,true]){const {shader,key}=compile(contact),f=shader.fragmentShader;
    const scuff=f.indexOf('float scuff=smoothstep('),primer=f.indexOf('diffuseColor.rgb=mix(diffuseColor.rgb,primerColour,primer*'),metal=f.indexOf('diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.22,.24,.24),bareMetal*.9);');
    assert.ok(scuff>0&&primer>scuff&&metal>primer,'layered in that order, the metal on top');
    assert.ok(f.includes('*(1.-bareMetal);')&&f.includes(`vec3 primerColour=mix(vec3(${SCRAPE.grey}),vec3(${SCRAPE.oxide}),step(${SCRAPE.patch},`),'grey or red oxide, not where the metal shows');
    assert.ok(f.includes('roughnessFactor=mix(roughnessFactor,.7,max(scuff*.6,primer));')&&f.includes('metalnessFactor=mix(metalnessFactor,.04,primer);'),'worn paint is matte');
    assert.ok(f.includes('material.clearcoat *= 1.-clamp(crumpleCrack+crumpleAmt*.35+scuff*.6+primer,0.,1.);'),'and loses its clear coat');
    assert.ok(!/\d\.\d+\.[^0-9]/.test(f.split('Paint wears through in layers')[1]?.slice(0,1200)??''),'no malformed number literals');
    assert.ok(key.endsWith('-v3'),'programs rebuilt');}
});
