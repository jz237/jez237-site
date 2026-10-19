import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {prepareNativeEffectBatches as batch,makeNativeEffectRenderer} from '../native-effect-render.js';
const draw=(family='spray',textureFrame=0,depthTest=true)=>({family,textureFrame,depthTest,positions:[0,0,0,1,0,0,0,1,0],uvs:[0,0,1,0,0,1],colors:[.5,1,0,.5,1,0,.5,1,0],alphas:[1,.5,0]});
const maps=()=>Object.fromEntries(Object.entries({spray:4,splash:7,wake:4,droplet:1}).map(([k,n])=>[k,Array.from({length:n},()=>new T.Texture())]));

test('only adjacent compatible effect draws merge; texture, depth and alpha order remain intact',()=>{
 const draws=[draw(),draw(),draw('wake',2),draw(),draw('spray',0,false)],before=structuredClone(draws),b=batch({draws});
 assert.equal(b.length,4);assert.deepEqual(b.map(v=>[v.family,v.textureFrame,v.depthTest,v.positions.length]),[['spray',0,true,18],['wake',2,true,9],['spray',0,true,9],['spray',0,false,9]]);
 assert.deepEqual(b[0].colors.filter((_,i)=>i%4===3),[1,.5,0,1,.5,0]);assert.equal(b[0].colors[0],new T.Color(.5,1,0).convertSRGBToLinear().r);assert.deepEqual(draws,before);
});

test('GPU adapter keeps transparent source order, disables culling/fog and reuses correctly bounded buffers',()=>{
 const root=new T.Group(),textures=maps(),r=makeNativeEffectRenderer(root,{textures}),group=root.children[0];
 assert.deepEqual(r.update({draws:[draw(),draw(),draw('droplet',0,false)]}),{batches:2,triangles:3});
 const [a,b]=group.children,geometry=a.geometry;
 assert.equal(a.renderOrder,0);assert.equal(b.renderOrder,1);assert.equal(a.material.map,textures.spray[0]);assert.equal(b.material.map,textures.droplet[0]);
 assert.equal(a.material.depthTest,true);assert.equal(b.material.depthTest,false);assert.equal(a.material.depthWrite,false);assert.equal(a.material.fog,false);assert.equal(a.material.side,T.DoubleSide);assert.equal(a.material.forceSinglePass,true);assert.equal(a.geometry.getAttribute('color').itemSize,4);
 assert.equal(geometry.drawRange.count,6);assert.equal(a.frustumCulled,false);
 r.update({draws:[draw()]});assert.equal(a.geometry,geometry);assert.equal(a.geometry.drawRange.count,3);assert.equal(b.visible,false);
 r.update({draws:[]});assert.ok(group.children.every(v=>!v.visible));
 let disposal=0,textureDisposal=0;for(const mesh of group.children){mesh.geometry.addEventListener('dispose',()=>disposal++);mesh.material.addEventListener('dispose',()=>disposal++);}for(const ts of Object.values(textures))for(const t of ts)t.addEventListener('dispose',()=>textureDisposal++);
 r.dispose();r.dispose();assert.equal(root.children.length,0);assert.equal(disposal,4);assert.equal(textureDisposal,0);assert.throws(()=>r.update({draws:[]}),/disposed/);
});

test('invalid later draw cannot alter visible GPU data or visibility',()=>{
 const root=new T.Group(),r=makeNativeEffectRenderer(root,{textures:maps()});r.update({draws:[draw()]});const a=root.children[0].children[0],map=a.material.map,before=[...a.geometry.getAttribute('position').array];
 for(const bad of [
  {...draw(),alphas:[1,NaN,0]}, {...draw(),positions:[0,0,0,1e40,0,0,0,1,0]}, {...draw(),textureFrame:4}, {...draw(),uvs:[0,1]}, {...draw(),colors:Array(9).fill(2)}
 ]){assert.throws(()=>r.update({draws:[draw('wake',1),bad]}));assert.deepEqual([...a.geometry.getAttribute('position').array],before);assert.equal(a.material.map,map);assert.equal(a.visible,true);assert.equal(root.children[0].children.length,1);}
 r.dispose();
});
