import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {FADE} from '../src/age-rust';
import {VehicleSurface} from '../src/vehicle-surface';
const panel=(name:string)=>{const g=new T.BufferGeometry(),a=new T.BufferAttribute(new Float32Array([0,0,0,1,0,0,0,1,0]),3);g.setAttribute('position',a.clone());g.setAttribute('wreckPosition',a);
  const m=new T.Mesh(g,new T.MeshPhysicalMaterial({name}));m.name='panel_test';m.userData.wreckRest=a;return m;};
const compile=(m:T.Material)=>{const s={uniforms:{} as Record<string,{value:unknown}>,vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};m.onBeforeCompile(s as any,undefined as any);return s.fragmentShader;};
test('the fade is the old car’s own: up to its strongest bleach, more lacquer lifted the older, within sane bounds',()=>{
  assert.ok(FADE.top[0]<FADE.top[1]&&FADE.top[1]<=1&&FADE.above[0]<FADE.above[1],'tops only, above the sills');
  assert.ok(FADE.bleach>0&&FADE.bleach<1&&FADE.peel>0&&FADE.peel<.5&&FADE.matte<1&&FADE.flake<1,'never pure white, never all peeled');
});
test('the steel paint’s own top bleaches chalky and its lacquer lifts in blotches, by the car’s age',()=>{
  const root=new T.Group(),steel=panel('paint_Paint 1 Test'),trim=panel('paint_Paint 2 Test');root.add(steel,trim);new VehicleSurface(root,4);
  const a=compile(steel.material as T.Material),b=compile(trim.material as T.Material);
  assert.ok(a.includes('vec3 restFacet=normalize(cross(dFdx(vCoatingRest),dFdy(vCoatingRest)));'),'its own top, from the rest frame (stays on the roof when rolled)');
  assert.ok(a.includes(`float sunTop=smoothstep(${FADE.top[0]},${FADE.top[1]},abs(restFacet.y))*smoothstep(carRust.y+${FADE.above[0]},carRust.y+${FADE.above[1]},vCoatingRest.y);`),'roof, bonnet and boot');
  assert.ok(a.includes('sunFade=sunTop*carRust.x*')&&a.includes(`vec3(${FADE.chalk}),.35),sunFade*${FADE.bleach});`),'bleached by age');
  assert.ok(a.includes(`peelEdge=1.-${FADE.peel}*carRust.x;`)&&a.includes(`diffuseColor.rgb=mix(diffuseColor.rgb,vec3(${FADE.flake}),lacquerFlake*.4);`),'blotches with flaking edges');
  assert.ok(a.includes('roughnessFactor=mix(roughnessFactor,.68,max(sunFade*.6,lacquerOff));')&&a.includes('max(sunFade*.7,lacquerOff)));'),'dull, lacquer gone');
  assert.ok(!b.includes('restFacet')&&b.includes('float ageRust=0.,rustStain=0.,sunFade=0.,lacquerOff=0.;'),'not the plastic trim');
});
