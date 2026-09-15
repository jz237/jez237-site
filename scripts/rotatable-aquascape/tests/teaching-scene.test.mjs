import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {TeachingScene} from '../lib/TeachingScene.ts';
import {reuseUnchangedTransforms} from '../lib/TransformReuse.ts';
const element=()=>({style:{},className:'',hidden:false,children:[],setAttribute(){},append(...x){this.children.push(...x)},replaceChildren(){this.children=[]}});
globalThis.document={createElement:tag=>tag==='canvas'?{width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},beginPath(){},moveTo(){},bezierCurveTo(){},quadraticCurveTo(){},stroke(){}})}:element()};
test('exploded layers reassemble exactly even while the aquarium is paused',()=>{
 const scene=new T.Scene(),plant=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial()),soil=plant.clone(),housing=plant.clone();scene.add(plant,soil,housing);soil.position.y=.3;
 const host={...element(),clientWidth:900,clientHeight:700};const teach=new TeachingScene(scene,host,[plant],[soil],new T.Texture(),[housing]);const camera=new T.PerspectiveCamera();camera.position.z=20;camera.updateMatrixWorld();
 reuseUnchangedTransforms(scene);
 teach.separation=1;teach.set('layers');for(let i=0;i<120;i++)teach.update(1/60,camera);assert.ok(plant.position.y>1);assert.ok(soil.position.y<0);assert.equal(housing.visible,false);scene.updateMatrixWorld();assert.equal(plant.matrixWorld.elements[13],plant.position.y);assert.equal(soil.matrixWorld.elements[13],soil.position.y);
 teach.separation=0;teach.update(1,camera);assert.equal(housing.visible,true);
 teach.set(null);teach.update(0,camera);assert.equal(plant.position.y,0);assert.equal(soil.position.y,.3);assert.equal(housing.visible,true);assert.equal(teach.root.visible,false);scene.updateMatrixWorld();assert.equal(plant.matrixWorld.elements[13],0);assert.equal(soil.matrixWorld.elements[13],.3);
});
test('filter cutaway hides the tank and leaving restores prior visibility',()=>{
 const scene=new T.Scene(),tank=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial()),hidden=tank.clone();hidden.visible=false;scene.add(tank,hidden);
 const teach=new TeachingScene(scene,{...element(),clientWidth:900,clientHeight:700},[],[],new T.Texture());
 teach.set('water',1);assert.equal(tank.visible,false);assert.ok(teach.root.children[0].children.some(o=>o instanceof T.InstancedMesh&&o.count===180));
 teach.set('water',4);assert.equal(tank.visible,true);assert.equal(hidden.visible,false);teach.set(null);assert.equal(teach.root.children[0].children.length,0);
});

test('stationary lesson labels avoid repeated DOM writes but track camera and viewport changes',()=>{
 const scene=new T.Scene(),host={...element(),clientWidth:900,clientHeight:700};
 const teach=new TeachingScene(scene,host,[],[],new T.Texture());const camera=new T.PerspectiveCamera(50,900/700,.1,100);camera.position.set(0,2.75,20);camera.updateMatrixWorld();
 teach.set('water',0);teach.update(1/60,camera);
 const buttons=host.children[0].children;let writes=0;
 for(const button of buttons)button.style=new Proxy(button.style,{set(target,key,value){writes++;target[key]=value;return true;}});
 for(let i=0;i<30;i++)teach.update(1/60,camera);assert.equal(writes,0);
 camera.position.x=1;teach.update(1/60,camera);assert.ok(writes>0);
 writes=0;host.clientWidth=390;teach.update(1/60,camera);assert.ok(writes>0);
 teach.set(null);writes=0;teach.update(1/60,camera);assert.equal(writes,0);
});

test('root cutaway batches full surface detail, owns its textures, and restores tank lighting',()=>{
 const scene=new T.Scene(),tank=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial()),lamp=new T.DirectionalLight(),hiddenLamp=new T.PointLight();hiddenLamp.visible=false;scene.add(tank,lamp,hiddenLamp);
 const teach=new TeachingScene(scene,{...element(),clientWidth:390,clientHeight:844},[],[],new T.Texture());teach.set('underground');assert.equal(tank.visible,false);assert.equal(lamp.visible,false);
 let roots=0,grains=0,textures=[],draws=0;teach.root.traverse(o=>{if(o instanceof T.InstancedMesh)grains+=o.count;if(o.isMesh||o.isLine)draws++;if(o.userData.rootTemplate)roots++;textures.push(...o.userData.ownedTextures??[]);});assert.ok(grains>5000&&draws<50);assert.equal(roots,2);
 let released=0;for(const t of textures)t.addEventListener('dispose',()=>released++);
 teach.set(null);assert.equal(tank.visible,true);assert.equal(lamp.visible,true);assert.equal(hiddenLamp.visible,false);assert.equal(released,3);assert.equal(teach.root.children[0].children.length,0);
});

test('layer slider responds while biological motion remains paused',()=>{
 const scene=new T.Scene(),plant=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial());scene.add(plant);
 const teach=new TeachingScene(scene,{...element(),clientWidth:900,clientHeight:700},[plant],[],new T.Texture());const camera=new T.PerspectiveCamera();
 teach.set('layers');teach.separation=1;for(let i=0;i<120;i++)teach.update(0,camera,65,1/60);
 assert.ok(plant.position.y>1.29);assert.equal(teach.phase,0);
 teach.separation=0;for(let i=0;i<120;i++)teach.update(0,camera,65,1/60);assert.ok(plant.position.y<.001);
});

test('shrimp and cory close-ups animate actual articulated geometry and release it on exit',()=>{
 const scene=new T.Scene(),tank=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial());scene.add(tank);
 const teach=new TeachingScene(scene,{...element(),clientWidth:900,clientHeight:700},[],[],new T.Texture(),[],new T.Texture());const camera=new T.PerspectiveCamera();
 teach.set('organisms',3);assert.equal(tank.visible,false);
 const shrimp=teach.shrimpStudy;assert.equal(shrimp.animals.length,1);assert.ok(shrimp.root.children.some(m=>m.count===6&&m.geometry.getAttribute('plateOffset')));
 for(const m of shrimp.root.children){assert.ok(Number.isFinite(m.count));assert.ok(Array.from(m.instanceMatrix.array.slice(0,m.count*16)).every(Number.isFinite));}
 const phase=shrimp.animals[0].phase;teach.update(.05,camera);assert.ok(shrimp.animals[0].phase>phase);
 const paused=shrimp.animals[0].phase;teach.update(0,camera);assert.equal(shrimp.animals[0].phase,paused);
 let disposed=false;shrimp.root.children[0].geometry.addEventListener('dispose',()=>disposed=true);
 teach.set('organisms',4);assert.equal(disposed,true);assert.equal(teach.shrimpStudy,null);assert.equal(teach.coryStudy.meshes.length,2);
 const cory=teach.coryStudy;const wave=cory.motion.getX(0);teach.update(.05,camera);assert.ok(cory.motion.getX(0)>wave);const held=cory.motion.getX(0);teach.update(0,camera);assert.equal(cory.motion.getX(0),held);
 teach.set(null);assert.equal(tank.visible,true);assert.equal(teach.coryStudy,null);assert.equal(teach.root.children[0].children.length,0);
});
