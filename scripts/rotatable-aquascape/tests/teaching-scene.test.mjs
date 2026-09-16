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

test('angelfish living close-up restores the tank without disposing its shared model',()=>{
 const scene=new T.Scene(),tank=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial());scene.add(tank);
 const prototype=new T.Group(),mesh=new T.Mesh(new T.SphereGeometry(.2),new T.MeshStandardMaterial());mesh.name='Body';prototype.add(mesh);
 const teach=new TeachingScene(scene,{...element(),clientWidth:900,clientHeight:700},[],[],new T.Texture());teach.angelPrototype=prototype;
 let disposed=false;mesh.geometry.addEventListener('dispose',()=>disposed=true);
 teach.set('organisms',5);assert.equal(tank.visible,false);assert.equal(teach.angelStudy.group.children[0].geometry,mesh.geometry);
 teach.update(.1,new T.PerspectiveCamera());teach.set(null);assert.equal(tank.visible,true);assert.equal(teach.angelStudy,null);assert.equal(disposed,false);
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


test('root leaf animation shares time and bend parameters with veins, pauses, and leaves the bed fixed',()=>{
 const teach=new TeachingScene(new T.Scene(),{...element(),clientWidth:900,clientHeight:700},[],[],new T.Texture());teach.set('underground');
 const moving=[],fixed=[];teach.root.traverse(o=>{if(o.geometry){if(o.geometry.getAttribute('rootMotion'))moving.push(o);else fixed.push([o,o.geometry.getAttribute('position').array.slice()]);}});
 assert.equal(moving.length,2);
 const specs=mesh=>{const a=mesh.geometry.getAttribute('rootMotion'),set=new Set();for(let i=0;i<a.count;i++)set.add([a.getX(i),a.getY(i),a.getZ(i),a.getW(i)].join(','));return [...set].sort();};
 assert.deepEqual(specs(moving[0]),specs(moving[1]));assert.equal(specs(moving[0]).length,28);
 const shaders=moving.map(o=>{const s={uniforms:{},vertexShader:'#include <beginnormal_vertex>\n#include <begin_vertex>'};o.material.onBeforeCompile(s);return s;});
 assert.equal(shaders[0].uniforms.rootStudyTime,shaders[1].uniforms.rootStudyTime);
 const camera=new T.PerspectiveCamera();teach.update(.5,camera);const time=shaders[0].uniforms.rootStudyTime.value;assert.ok(time>0);teach.update(0,camera,65,.5);assert.equal(shaders[0].uniforms.rootStudyTime.value,time);
 for(let i=0;i<120;i++)teach.update(1/60,camera,0);assert.ok(shaders[0].uniforms.rootStudyFlow.value<.003);
 for(const [mesh,before] of fixed)assert.deepEqual(mesh.geometry.getAttribute('position').array,before);
 teach.set(null);
});

test('root lesson steps retain detailed GPU resources and only replace their transport annotations',()=>{
 const scene=new T.Scene(),tank=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial()),light=new T.DirectionalLight();scene.add(tank,light);
 const host={...element(),clientWidth:900,clientHeight:700},teach=new TeachingScene(scene,host,[],[],new T.Texture()),camera=new T.PerspectiveCamera();
 teach.set('underground');
 const specimen=teach.content.children.find(o=>o.userData.reference),labels=[...host.children[0].children];
 assert.ok(specimen);const resources=new Set();specimen.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const t of o.userData.ownedTextures??[])resources.add(t);});
 let releases=0;for(const r of resources)r.addEventListener('dispose',()=>releases++);
 for(const step of [1,2,2,0,2,1]){
  teach.update(.05,camera);const time=teach.rootTime.value;teach.set('underground',step);
  assert.equal(teach.content.children.find(o=>o.userData.reference),specimen);assert.equal(teach.rootTime.value,time);assert.equal(releases,0);
  assert.deepEqual(host.children[0].children,labels);assert.equal(tank.visible,false);assert.equal(light.visible,false);
  assert.equal(teach.paths.length,step===2?2:0);assert.equal(teach.rootAnnotations.children.length,step===2?4:0);
 }
 teach.set('underground',2);const arrows=teach.paths[0].arrows;let arrowReleases=0;arrows.geometry.addEventListener('dispose',()=>arrowReleases++);
 teach.update(.1,camera);const phase=teach.paths[0].phase;teach.set('underground',2);assert.equal(teach.paths[0].phase,phase);
 teach.set(null);assert.equal(arrowReleases,1);assert.equal(releases,resources.size);assert.equal(tank.visible,true);assert.equal(light.visible,true);assert.equal(teach.rootAnnotations.children.length,0);
 teach.set('underground');assert.notEqual(teach.content.children.find(o=>o.userData.reference),specimen);assert.equal(releases,resources.size);assert.equal(arrowReleases,1);teach.set(null);
});
