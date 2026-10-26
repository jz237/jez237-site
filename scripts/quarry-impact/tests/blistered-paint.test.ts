import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {BLISTER,WreckFinish} from '../src/wreck-finish';
const panel=(name:string)=>{const m=new T.Mesh(new T.BoxGeometry(),new T.MeshPhysicalMaterial({name}));m.name='panel_test';return m;};
const compile=(m:T.Material)=>{const s={uniforms:{} as Record<string,{value:unknown}>,vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};m.onBeforeCompile(s as any,undefined as any);return s.fragmentShader;};
test('the blister ring lies short of the char: rising, then falling, as the scorch deepens',()=>{
  const [a,b,c,d]=BLISTER.band;assert.ok(a<b&&b<=c&&c<d&&d<=.6,'a ring, gone where the char takes over');assert.ok(BLISTER.cells[0]<BLISTER.cells[1]&&BLISTER.size>40,'small cells');
});
test('painted panels blister in a ring by the fire, pale and dull; lamps and bare parts do not',()=>{
  const root=new T.Group(),paint=panel('paint_Paint 1 Test'),chrome=panel('Chrome'),lamp=panel('Headlight');root.add(paint,chrome,lamp);new WreckFinish(root,2.2);
  const p=compile(paint.material as T.Material),c=compile(chrome.material as T.Material),l=compile(lamp.material as T.Material);
  assert.ok(p.includes(`float blisterBand=smoothstep(${BLISTER.band[0]},${BLISTER.band[1]},scorch)*(1.-smoothstep(${BLISTER.band[2]},${BLISTER.band[3]},scorch));`),'the ring');
  assert.ok(p.includes('wreckBlister=smoothstep(')&&p.includes(`*blisterBand*(1.-wreckChar)*wreckBlisters;`)&&p.includes(`vec3(${BLISTER.pale}),.65),wreckBlister);`),'cells, pale, never over the char');
  assert.ok(p.includes('roughnessFactor=mix(roughnessFactor,.82,wreckBlister);'),'dull');
  for(const f of [c,l])assert.ok(!f.includes('blisterBand')&&f.includes('float wreckChip=0.,wreckChar=0.,wreckBlister=0.;'),'no blisters off the paint');
});
test('only offline cars blister: off until main turns it on for a car under the offline rules',()=>{
  const root=new T.Group(),paint=panel('paint_Paint 1 Test');root.add(paint);const finish=new WreckFinish(root,2.2);assert.equal(finish.blisters.value,0,'off by default');
  const s={uniforms:{} as Record<string,{value:unknown}>,vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};(paint.material as T.Material).onBeforeCompile(s as any,undefined as any);
  assert.ok(s.uniforms.wreckBlisters===finish.blisters,'live');
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');assert.ok(main.includes('car.wreckFinish.blisters.value=car.extendedDamage?1:0;'));
});
