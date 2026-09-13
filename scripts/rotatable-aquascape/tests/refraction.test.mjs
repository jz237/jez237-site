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
