import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {TeachingScene} from '../lib/TeachingScene.ts';
const element=()=>({style:{},className:'',hidden:false,children:[],setAttribute(){},append(...x){this.children.push(...x)},replaceChildren(){this.children=[]}});
globalThis.document={createElement:element};
test('exploded layers reassemble exactly even while the aquarium is paused',()=>{
 const scene=new T.Scene(),plant=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial()),soil=plant.clone(),housing=plant.clone();scene.add(plant,soil,housing);soil.position.y=.3;
 const host={...element(),clientWidth:900,clientHeight:700};const teach=new TeachingScene(scene,host,[plant],[soil],new T.Texture(),[housing]);const camera=new T.PerspectiveCamera();camera.position.z=20;camera.updateMatrixWorld();
 teach.separation=1;teach.set('layers');for(let i=0;i<120;i++)teach.update(1/60,camera);assert.ok(plant.position.y>1);assert.ok(soil.position.y<0);assert.equal(housing.visible,false);
 teach.separation=0;teach.update(1,camera);assert.equal(housing.visible,true);
 teach.set(null);teach.update(0,camera);assert.equal(plant.position.y,0);assert.equal(soil.position.y,.3);assert.equal(housing.visible,true);assert.equal(teach.root.visible,false);
});
test('filter cutaway hides the tank and leaving restores prior visibility',()=>{
 const scene=new T.Scene(),tank=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial()),hidden=tank.clone();hidden.visible=false;scene.add(tank,hidden);
 const teach=new TeachingScene(scene,{...element(),clientWidth:900,clientHeight:700},[],[],new T.Texture());
 teach.set('water',1);assert.equal(tank.visible,false);assert.ok(teach.root.children[0].children.some(o=>o instanceof T.InstancedMesh&&o.count===180));
 teach.set('water',4);assert.equal(tank.visible,true);assert.equal(hidden.visible,false);teach.set(null);assert.equal(teach.root.children[0].children.length,0);
});
