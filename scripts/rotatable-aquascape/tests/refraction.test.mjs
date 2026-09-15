import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {SceneRefraction} from '../lib/SceneRefraction.ts';

function fixture(){
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(),target=new T.WebGLRenderTarget(80,60,{type:T.HalfFloatType,samples:2});
 const solid=new T.MeshStandardMaterial(),glass=new T.MeshPhysicalMaterial({transmission:.96,thickness:.022,ior:1.5,transparent:true}),fin=new T.MeshStandardMaterial({transparent:true}),hidden=new T.MeshBasicMaterial({visible:false});
 const materials=[solid,glass,fin,hidden],geometry=new T.BoxGeometry();
 materials.forEach(m=>scene.add(new T.Mesh(geometry,m)));scene.background=new T.Color('green');
 const draws=[],copies=[],shadowVisibility=[];let bound=target;
 const renderer={autoClear:true,shadowMap:{enabled:true,autoUpdate:false,needsUpdate:true,render(){if(!this.needsUpdate)return;shadowVisibility.push(materials.map(m=>m.visible));this.needsUpdate=false;}},
  render(world,view){this.shadowMap.render([],world,view);draws.push({materials:materials.filter(m=>m.visible),camera:view,clear:this.autoClear,background:scene.background});},
  getRenderTarget:()=>bound,setRenderTarget:t=>{bound=t;},setTransparentSort(sort){this.sort=sort;},initRenderTarget(){},copyTextureToTexture(a,b){copies.push([a,b]);}};
 const pass=new SceneRefraction(renderer,scene);
 return {pass,renderer,scene,camera,target,materials,geometry,draws,copies,shadowVisibility};
}
test('physical glass reuses opaque color once per view without redrawing solid detail',()=>{
 const f=fixture(),[solid,glass,fin,hidden]=f.materials;f.renderer.render(f.scene,f.camera);
 assert.deepEqual(f.draws.map(d=>d.materials),[[solid],[glass,fin]]);
 assert.deepEqual(f.shadowVisibility,[[true,true,true,false]]);
 assert.deepEqual(f.draws.map(d=>d.clear),[true,false]);assert.equal(f.draws[1].background,null);
 assert.equal(f.copies.length,1);assert.equal(f.copies[0][0],f.target.texture);
 assert.equal(f.copies[0][1].type,T.HalfFloatType);assert.equal(f.copies[0][1].image.width,80);assert.equal(f.copies[0][1].generateMipmaps,true);
 assert.deepEqual(f.materials.map(m=>m.visible),[true,true,true,false]);assert.equal(f.renderer.autoClear,true);
 assert.equal(glass.transmission,0);assert.ok('USE_TRANSMISSION' in glass.defines);
 const shader={uniforms:{}};glass.onBeforeCompile(shader,f.renderer);
 assert.equal(shader.uniforms.transmission.value,.96);assert.equal(shader.uniforms.thickness.value,.022);assert.equal(glass.ior,1.5);
 assert.equal(f.scene.children[0].geometry,f.geometry);
 const item=(material,z)=>({material,z,groupOrder:0,renderOrder:0,id:1});assert.ok(f.renderer.sort(item(glass,1),item(fin,100))<0);
 f.pass.dispose();
});
test('camera copies stay independent and resize without lowering resolution',()=>{
 const f=fixture();f.renderer.render(f.scene,f.camera);const first=f.copies[0][1];
 f.renderer.render(f.scene,new T.PerspectiveCamera());assert.notEqual(f.copies[1][1],first);
 f.target.setSize(240,160);f.renderer.render(f.scene,f.camera);assert.equal(f.copies[2][1],first);assert.equal(first.image.width,240);assert.equal(first.image.height,160);f.pass.dispose();
});
test('a failed copy restores materials, clear state, background and framebuffer',()=>{
 const f=fixture(),background=f.scene.background;f.renderer.copyTextureToTexture=()=>{throw Error('copy failed');};
 assert.throws(()=>f.renderer.render(f.scene,f.camera),/copy failed/);
 assert.deepEqual(f.materials.map(m=>m.visible),[true,true,true,false]);assert.equal(f.renderer.autoClear,true);assert.equal(f.scene.background,background);assert.equal(f.renderer.getRenderTarget(),f.target);f.pass.dispose();
});


test('one frame collects materials once across every mirror and main camera, refreshing dynamic contents next frame',()=>{
 const f=fixture();let traversals=0;
 const original=f.scene.traverseVisible.bind(f.scene);
 f.scene.traverseVisible=fn=>{traversals++;original(fn);};
 f.pass.beginFrame();
 for(let view=0;view<4;view++)f.renderer.render(f.scene,new T.PerspectiveCamera());
 assert.equal(traversals,1);
 assert.equal(f.copies.length,4);
 assert.deepEqual(f.materials.map(m=>m.visible),[true,true,true,false]);
 f.pass.endFrame();
 const food=new T.MeshBasicMaterial();f.scene.add(new T.Mesh(f.geometry,food));
 f.materials[0].visible=false;
 f.pass.beginFrame();f.renderer.render(f.scene,f.camera);f.pass.endFrame();
 assert.equal(traversals,2);
 assert.equal(food.visible,true);assert.equal(f.materials[0].visible,false);
 // Original render fixture records only original materials; cached map must also
 // include newly created food, and remove it when its object is removed.
 f.pass.beginFrame();assert.equal(f.pass.frameMaterials.get(food),true);f.pass.endFrame();
 f.scene.remove(f.scene.children.at(-1));
 f.pass.beginFrame();assert.equal(f.pass.frameMaterials.has(food),false);f.pass.endFrame();
 f.pass.dispose();
});

test('frame material reuse restores visibility after a failed mirror copy and can render the following frame',()=>{
 const f=fixture(),copy=f.renderer.copyTextureToTexture;
 f.pass.beginFrame();f.renderer.copyTextureToTexture=()=>{throw Error('mirror failed');};
 assert.throws(()=>f.renderer.render(f.scene,f.camera),/mirror failed/);
 f.pass.endFrame();
 assert.deepEqual(f.materials.map(m=>m.visible),[true,true,true,false]);
 f.renderer.copyTextureToTexture=copy;
 f.pass.beginFrame();f.renderer.render(f.scene,f.camera);f.pass.endFrame();
 assert.equal(f.copies.length,1);f.pass.dispose();
});
