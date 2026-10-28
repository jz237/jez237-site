import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {GROUND,dullGround,dullSheen,groundArea,groundSheen,isDryGround,setGroundWet} from '../src/ground-sheen';
import {QUARRY_DAYLIGHT} from '../src/quarry-art-direction';
import {LIGHTING_PRESETS} from '../src/lighting-presets';
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),floor=readFileSync(new URL('../src/scenery-reference-floor.ts',import.meta.url),'utf8');
const plane=(w:number,d:number,m:T.Material)=>{const g=new T.PlaneGeometry(w,d);g.rotateX(-Math.PI/2);return new T.Mesh(g,m);};
test('dry ground is a large rough surface: not metal, glass, water or anything glossy',()=>{
  assert.ok(isDryGround(new T.MeshStandardMaterial({roughness:1}))&&isDryGround(new T.MeshPhysicalMaterial({roughness:.8})));
  assert.ok(!isDryGround(new T.MeshStandardMaterial({roughness:1,metalness:1})),'metal');
  assert.ok(!isDryGround(new T.MeshStandardMaterial({roughness:1,transparent:true})),'see-through');
  assert.ok(!isDryGround(new T.MeshPhysicalMaterial({roughness:.05})),'water');
  assert.ok(!isDryGround(new T.MeshBasicMaterial()));
  const big=plane(40,20,new T.MeshStandardMaterial());assert.ok(Math.abs(groundArea(big)-800)<1e-6);
  big.scale.set(.5,1,.5);const g=new T.Group();g.add(big);big.updateMatrixWorld(true);assert.ok(Math.abs(groundArea(big)-200)<1e-6,'in its own scale');
});
test('a large stretch is dulled once, keeping its own shader edits and a program key of its own',()=>{
  const own=new T.MeshStandardMaterial({roughness:1}),other=new T.MeshStandardMaterial({roughness:1}),small=new T.MeshStandardMaterial({roughness:1}),metal=new T.MeshStandardMaterial({roughness:1,metalness:1});
  own.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n//own edit');};
  const root=new T.Group();root.add(plane(30,30,own),plane(25,25,other),plane(10,10,small),plane(40,40,metal),plane(30,30,own));
  root.updateMatrixWorld(true);assert.equal(dullGround(root),2);assert.equal(dullGround(root),0,'only once');
  assert.ok(own.customProgramCacheKey()!==other.customProgramCacheKey(),'distinct programs stay distinct');
  assert.ok(own.customProgramCacheKey().endsWith('|dry-ground')&&!small.customProgramCacheKey().includes('dry-ground'));
  const shader={uniforms:{} as Record<string,T.IUniform>,fragmentShader:'#include <map_fragment>\n#include <lights_physical_fragment>\n',vertexShader:''} as unknown as T.WebGLProgramParametersWithUniforms;
  own.onBeforeCompile(shader,{} as T.WebGLRenderer);
  assert.ok(shader.fragmentShader.includes('//own edit')&&shader.fragmentShader.includes('material.specularColor*=groundSheen;material.specularF90*=groundSheen;'));
  assert.ok(shader.fragmentShader.startsWith('uniform float groundSheen;')&&shader.uniforms.groundSheen===groundSheen);
  assert.equal(dullSheen(own),false);
});
test('dry ground keeps a third of its sheen; rain gives it all back',()=>{
  setGroundWet(false);assert.equal(groundSheen.value,GROUND.specular);assert.ok(GROUND.specular>0&&GROUND.specular<.5);
  setGroundWet(true);assert.equal(groundSheen.value,1);setGroundWet(false);assert.equal(groundSheen.value,GROUND.specular);
});
test('midday: a strong sun over a modest fill; the afternoon follows; every venue is dulled as it is built',()=>{
  assert.ok(QUARRY_DAYLIGHT.sun/QUARRY_DAYLIGHT.ambient>15,'sunlit and shaded ground read apart');
  assert.equal(LIGHTING_PRESETS.midday.sky,QUARRY_DAYLIGHT.sky);assert.ok(LIGHTING_PRESETS.afternoon.sun/LIGHTING_PRESETS.afternoon.ambient>15);
  assert.ok(floor.includes('clearcoat:.03,'),'the derby floor is not lacquered');
  assert.ok(main.includes('      dullGround(artwork.root);arenaVenues[arenaId]=venue;return venue;')&&main.includes('    dullGround(artwork.root);raceVenues[id]=venue;return venue;')&&main.includes('  dullGround(quarryRoot);'));
  assert.ok(main.includes('applyWetLook(wetRoot,wet);setGroundWet(wet);}}'));
});
