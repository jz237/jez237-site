import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {ANTI_TILE,antiTile} from '../src/anti-tile';
import {STREAK,createRain} from '../src/rain';
import {SPLASHES,createRainSplashes} from '../src/rain-splashes';
const read=(f:string)=>readFileSync(new URL('../src/'+f,import.meta.url),'utf8');
test('a tiled floor is read without its grid: three offset cells blended for map, normal and roughness, with broad patches',()=>{
  const m=antiTile(new T.MeshStandardMaterial()),shader={uniforms:{},vertexShader:'#include <worldpos_vertex>\n',fragmentShader:'#include <map_fragment>\n#include <roughnessmap_fragment>\n#include <normal_fragment_maps>\n'} as unknown as T.WebGLProgramParametersWithUniforms;
  m.onBeforeCompile(shader,{} as T.WebGLRenderer);const f=shader.fragmentShader;
  assert.ok(f.includes('vec4 sampledDiffuseColor = antiTile( map, vMapUv );')&&f.includes('vec3 mapN = antiTile( normalMap, vNormalMapUv )')&&f.includes('vec4 texelRoughness = antiTile( roughnessMap, vRoughnessMapUv );'));
  assert.ok(!f.includes('#include <map_fragment>')&&f.includes(`/${ANTI_TILE.cell.toFixed(2)}`)&&m.customProgramCacheKey().endsWith('|anti-tile'));
  assert.ok(read('moorfield-speedbowl-world.ts').includes('antiTile(floorMaterial);')&&read('wrenford-pit-world.ts').includes('antiTile(floorMaterial);'));
});
test('a rain streak fades from its falling head to nothing at its tail, and far streaks thin out',()=>{
  const scene=new T.Scene(),rain=createRain(scene),camera=new T.PerspectiveCamera();camera.position.set(0,5,0);rain.setActive(true);rain.update(camera,.1);
  const lines=scene.getObjectByName('rain') as T.LineSegments,c=lines.geometry.attributes.color.array as Float32Array,p=lines.geometry.attributes.position.array as Float32Array;
  assert.equal(lines.geometry.attributes.color.itemSize,4);assert.ok((lines.material as T.LineBasicMaterial).vertexColors);
  let near=0,far=0;for(let i=0;i<200;i++){assert.equal(c[i*8+7],0,'tail');const d=Math.hypot(p[i*6],p[i*6+1]-5,p[i*6+2]);if(d<STREAK.near)near=Math.max(near,c[i*8+3]);if(d>STREAK.far)far=Math.max(far,c[i*8+3]);}
  assert.ok(near===0||near===1);assert.ok(far===0||Math.abs(far-STREAK.farAlpha)<1e-6);rain.dispose();
});
test('raindrops land as soft ripples that fade away in the distance, not crisp circles',()=>{
  const scene=new T.Scene(),s=createRainSplashes(scene),m=s.mesh.material as T.ShaderMaterial;
  assert.ok(m.fragmentShader.includes('smoothstep(.72,.86,vBand)*(1.-smoothstep(.86,1.,vBand))*vNear')&&m.vertexShader.includes(`smoothstep(${SPLASHES.fade[0].toFixed(1)},${SPLASHES.reach.toFixed(1)},distance(p,cameraPosition))`));
  s.dispose();
});
