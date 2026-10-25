import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {CABIN_SMOKE,cabinSmoke} from '../src/cabin-smoke';
import {finishGlass} from '../src/car-materials';
test('a burning cabin fills with smoke, then clears to a sooty residue, never clean again',()=>{
 let s=0;for(let i=0;i<CABIN_SMOKE.fill*60;i++)s=cabinSmoke(s,true,1/60);assert.ok(Math.abs(s-CABIN_SMOKE.max)<1e-6,'full after fill seconds of fire');
 assert.equal(cabinSmoke(s,true,5),CABIN_SMOKE.max,'no fuller than max');
 for(let i=0;i<CABIN_SMOKE.clear*60+60;i++)s=cabinSmoke(s,false,1/60);assert.ok(Math.abs(s-CABIN_SMOKE.residue)<1e-6,'clears to the residue');
 assert.equal(cabinSmoke(.2,false,10),.2,'a short fire\'s haze stays');assert.equal(cabinSmoke(0,false,1),0,'a cabin that never burned stays clear');
 assert.equal(cabinSmoke(.3,true,0),.3);assert.equal(cabinSmoke(NaN,true,NaN),0);
});
test('glass shows the smoke murky and dark, and burning cars feed it each frame',()=>{
 const m=new T.MeshPhysicalMaterial(),state=finishGlass(m,new T.BoxGeometry(1,.5,.02));assert.equal(state.smoke.value,0);
 const shader={uniforms:{} as Record<string,unknown>,vertexShader:'#include <common>\n#include <begin_vertex>',fragmentShader:'#include <common>\n#include <color_fragment>\n#include <roughnessmap_fragment>'};
 m.onBeforeCompile(shader as any,{} as any);assert.equal(shader.uniforms.glassSmoke,state.smoke);assert.ok(shader.fragmentShader.includes('diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.11,.1,.09),murk*.85);'));
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes("const was=smokeIn.get(c)??0,now=cabinSmoke(was,c.onFire,dt);if(now===was)continue;smokeIn.set(c,now);")&&main.includes("if(st)st.smoke.value=now;"));
});
