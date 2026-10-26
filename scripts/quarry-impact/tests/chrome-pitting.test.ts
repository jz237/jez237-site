import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {PITTING,chromed} from '../src/age-rust';
import {VehicleSurface} from '../src/vehicle-surface';
const panel=(name:string)=>{const g=new T.BufferGeometry(),a=new T.BufferAttribute(new Float32Array([0,0,0,1,0,0,0,1,0]),3);g.setAttribute('position',a.clone());g.setAttribute('wreckPosition',a);
  const m=new T.Mesh(g,new T.MeshPhysicalMaterial({name,metalness:1,roughness:.08}));m.name='panel_test';m.userData.wreckRest=a;return m;};
const compile=(m:T.Material)=>{const s={uniforms:{} as Record<string,{value:unknown}>,vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};m.onBeforeCompile(s as any,undefined as any);return s.fragmentShader;};
test('the brightwork is the chrome, not the fitted hubcaps or the paint',()=>{
  assert.ok(chromed('Chrome')&&chromed('Estate Chrome')&&chromed('Classic Satin Chrome')&&chromed('Rook Brushed Chrome'));
  assert.ok(!chromed('Fitted hubcap chrome')&&!chromed('paint Estate Body')&&!chromed('Mirror'));
});
test('an old car’s chrome dulls and freckles with rust pits by its age; the paint and other parts do not pit',()=>{
  const root=new T.Group(),chrome=panel('Estate Chrome'),paint=panel('paint Estate Body'),glass=panel('Glass');root.add(chrome,paint,glass);const surface=new VehicleSurface(root,4);
  const c=compile(chrome.material as T.Material),p=compile(paint.material as T.Material);
  assert.ok(c.includes(`float pitEdge=1.-${PITTING.pits}*carRust.x;`)&&c.includes('chromePit=clamp(max(pits*.9,bloom*')&&c.includes('chromeDull=carRust.x;'),'pits and dulls by age');
  assert.ok(c.includes(`roughnessFactor=mix(roughnessFactor,${PITTING.dull},max(chromeDull*.7,chromePit));`)&&c.includes('metalnessFactor*=1.-chromePit;'),'duller, and rust is no metal');
  assert.ok(c.includes('metalnessFactor*=(1.-carDirt*.9)*(1.-wakeDust*.8)*(1.-ageRust);'),'the films as before');
  assert.ok(!p.includes('pitEdge')&&p.includes('float chromePit=0.,chromeDull=0.;'),'paint never pits');
  const keys=[chrome,paint].map(m=>(m.material as T.Material).customProgramCacheKey());assert.ok(keys[0].endsWith('-chrome')&&!keys[1].endsWith('-chrome'),'its own program');
  assert.equal(surface.rustAge,0,'and none until the car is fitted with an age');
});
