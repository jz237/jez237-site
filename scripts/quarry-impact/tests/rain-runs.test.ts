import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {RUNS,CAR_TIME,CAR_WET,finishPaint} from '../src/car-materials';
const compile=()=>{const m=new T.MeshPhysicalMaterial();finishPaint(m);const shader={uniforms:{} as Record<string,{value:unknown}>,vertexShader:new T.MeshPhysicalMaterial().type&&T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};m.onBeforeCompile(shader as never,undefined as never);return shader;};
test('runs of rain crawl down the panels facing sideways, by the shared clock, only when wet',()=>{
  const s=compile();assert.ok(s.uniforms.carTime===CAR_TIME&&s.uniforms.rainWet===CAR_WET,'the shared clock and wetness');
  assert.ok(s.fragmentShader.includes('uniform float carTime;'),'declared');
  assert.ok(s.fragmentShader.includes('float wetSide=rainWet*(1.-smoothstep(.15,.5,abs(dot(normalize(vNormal)')&&s.fragmentShader.includes('float run=wetSide*step('),'side panels, wet only');
  assert.ok(s.fragmentShader.includes(`carTime*${RUNS.speed}*(.6+.8*runPick)`),'each at its own pace');
  assert.ok(s.fragmentShader.includes('diffuseColor.rgb*=1.-run*.2;'),'a darker wet trail');
  assert.ok(!/\d\.\d+\.[^0-9]/.test(s.fragmentShader.split('Runs of rain')[1]?.slice(0,900)??''),'no malformed number literals');
  assert.ok(RUNS.share>0&&RUNS.share<1&&RUNS.speed>0);
});
test('main runs the clock for them every frame',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');assert.ok(main.includes('  CAR_TIME.value=clock%1000;\n'));
});
