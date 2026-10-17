import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {rookvaleWearAt,createRookvaleWearTexture,ROOKVALE_WEAR_SIZE} from '../src/rookvale-wear';
import {addRookvaleGroundDetail} from '../src/rookvale-ground';
test('wear follows service areas, varies across the apron and repeats deterministically',()=>{
 let low=1,high=0;for(let z=-170;z<=170;z+=5)for(let x=-210;x<=210;x+=5){const p=rookvaleWearAt(x,z);for(const value of Object.values(p))assert.ok(value>=0&&value<=1);low=Math.min(low,p.variation);high=Math.max(high,p.variation);assert.deepEqual(p,rookvaleWearAt(x,z));}
 assert.ok(high-low>.45);assert.equal(rookvaleWearAt(0,0).oil,0);assert.equal(rookvaleWearAt(0,0).tracks,0);
 assert.ok(rookvaleWearAt(-150+3*Math.sin(-150),151).oil>.3);
 assert.ok(Array.from({length:100},(_,i)=>rookvaleWearAt(190.85,i-50).tracks).some(v=>v>.5));
 const texture=createRookvaleWearTexture();assert.deepEqual([texture.image.width,texture.image.height],ROOKVALE_WEAR_SIZE);assert.ok(texture.image.data.every(Number.isFinite));texture.dispose();
});
test('yard shader keeps authored paint above wear and releases its texture once',()=>{
 const material=new T.MeshStandardMaterial(),detail=addRookvaleGroundDetail(material);
 const shader={uniforms:{},vertexShader:'#include <begin_vertex>',fragmentShader:'#include <alphamap_fragment>\n#include <roughnessmap_fragment>\n#include <metalnessmap_fragment>\n#include <normal_fragment_maps>'} as any;
 material.onBeforeCompile(shader,{} as any);assert.ok(shader.uniforms.rookvaleWear.value);
 assert.ok(shader.fragmentShader.indexOf('courseFinish*=1.0-yardBare')<shader.fragmentShader.indexOf('diffuseColor.rgb=mix(courseFinish,coursePaint,courseMark)'));
 assert.ok(shader.fragmentShader.includes('yardWear.b*yardBare*(1.0-courseMark)'));
 let released=0;shader.uniforms.rookvaleWear.value.addEventListener('dispose',()=>released++);detail.dispose();detail.dispose();assert.equal(released,1);material.dispose();
});
