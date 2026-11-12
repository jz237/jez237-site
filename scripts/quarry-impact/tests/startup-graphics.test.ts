import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {LocalReflections} from '../src/rendering';
import {warmPostprocessing} from '../src/startup-graphics';

test('first local reflection uses six incremental faces, then filters and binds once',()=>{
 const calls:number[]=[], restored=new T.WebGLRenderTarget(1,1), texture=new T.Texture();
 const renderer={shadowMap:{autoUpdate:true,needsUpdate:true},getRenderTarget:()=>restored,getActiveCubeFace:()=>2,getActiveMipmapLevel:()=>1,setRenderTarget:()=>{},render:(_scene:unknown,camera:{face:number})=>calls.push(camera.face)};
 const reflection=Object.assign(Object.create(LocalReflections.prototype),{renderer,scene:new T.Scene(),cube:{texture:new T.Texture()},camera:{position:new T.Vector3(),children:Array.from({length:6},(_,face)=>({face})),updateMatrixWorld:()=>{},update:()=>calls.push(6)},generator:{fromCubemap:()=>({texture})},filtered:null,face:0,tick:0,player:null,initialized:false,updates:0,enabled:true,interval:3}) as LocalReflections;
 const material=new T.MeshStandardMaterial(),player=new T.Mesh(new T.BoxGeometry(),material);
 for(let i=0;i<5;i++){reflection.update(player);assert.equal(material.envMap,null);assert.equal(reflection.updates,0);}
 reflection.update(player);assert.deepEqual(calls,[0,1,2,3,4,5]);assert.equal(material.envMap,texture);assert.equal(reflection.updates,1);assert.equal(player.visible,true);assert.deepEqual(renderer.shadowMap,{autoUpdate:true,needsUpdate:true});
 reflection.update(player,true);assert.equal(calls.at(-1),6);assert.equal(reflection.updates,2);
 reflection.invalidate();reflection.update(player);assert.equal(calls.at(-1),0);assert.equal(reflection.updates,2);
 player.geometry.dispose();material.dispose();restored.dispose();texture.dispose();
});

test('fullscreen programs compile against their output targets and all finish before ready',async()=>{
 const original=new T.WebGLRenderTarget(1,1),buffer=new T.WebGLRenderTarget(1,1);let target: T.WebGLRenderTarget|null=original;
 const first=new T.ShaderMaterial(),last=new T.ShaderMaterial(),raw=new T.RawShaderMaterial();
 const seen:{target:T.WebGLRenderTarget|null;materials:T.Material[]}[]=[],finish:(()=>void)[]=[];
 const renderer={getRenderTarget:()=>target,setRenderTarget:(next:T.WebGLRenderTarget|null)=>{target=next;},compileAsync:(scene:T.Scene)=>{seen.push({target,materials:scene.children.map(o=>(o as T.Mesh).material as T.Material)});return new Promise<void>(resolve=>finish.push(resolve));}};
 const pending=warmPostprocessing(renderer as unknown as T.WebGLRenderer,{readBuffer:buffer,passes:[{material:first,quad:{material:first}},{material:raw},{materials:[last]}]} as any);
 assert.equal(target,original);assert.deepEqual(seen,[{target:buffer,materials:[first]},{target:null,materials:[last]}]);let ready=false;void pending.then(()=>{ready=true;});finish[0]();await Promise.resolve();assert.equal(ready,false);finish[1]();await pending;assert.equal(ready,true);assert.equal(target,original);
 original.dispose();buffer.dispose();first.dispose();last.dispose();raw.dispose();
});
