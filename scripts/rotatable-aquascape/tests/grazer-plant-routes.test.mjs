import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {registerHooks} from 'node:module';
registerHooks({resolve(specifier,context,next){try{return next(specifier,context)}catch(e){if(specifier.startsWith('.'))return next(specifier+'.ts',context);throw e}},load(url,context,next){if(url.endsWith('/LeafSurface.ts'))return {format:'module',shortCircuit:true,source:`export function leafSurfaceMaps(){return {color:null,bump:null,roughness:null}}`};return next(url,context)}});
const T=await import('three');const {buildBotanicalPlants}=await import('../lib/BotanicalPlants.ts');const {calmSwordLeaves}=await import('../lib/SwordCurrent.ts');const {GrazerPlants,leafContact,deformPlantPoint}=await import('../lib/GrazerPlants.ts');
const height=(x,z)=>.3+.55*Math.exp(-((x+2.5)**2/6+(z+.8)**2/2))+.22*(1-(z+2.3)/4.6)+.035*Math.sin(x*2+z)*Math.cos(z*3);

const {addFernFixture,hardscapeObstacles}=await import('./cory-habitat-fixture.mjs');
const {Invertebrates}=await import('../lib/Invertebrates.ts');
const {grazerBody,bodiesOverlap}=await import('../lib/GrazerCollision.ts');
test('full planting supports climbing, swimming departures, landings and pause without teleporting',()=>{
 const scene=new T.Scene();buildBotanicalPlants(scene,height,{value:0});addFernFixture(scene);calmSwordLeaves(scene);scene.updateMatrixWorld();const life=new Invertebrates(scene,height);
 assert.equal(life.animals.filter(a=>a.trail).length,7,'all non-glass grazers need a plant surface');
 const initial=life.animals.map(a=>a.trail?.leaf),swimmers=new Set(),landed=new Set();let maxStep=0;
 for(let i=0;i<1800;i++){
  const before=life.animals.map(a=>a.position.clone());life.update(.1);
  const bodies=life.animals.map(a=>grazerBody(a.position,a.normal,new T.Vector3().setFromMatrixColumn(a.matrix,0).normalize(),a.kind==='snail',a.kind==='shrimp'?.80+a.id%3*.04:.84));for(let a=0;a<9;a++)for(let b=a+1;b<9;b++)assert.equal(bodiesOverlap(bodies[a],bodies[b],0),false,`grazer bodies overlap at ${i}: ${a}/${b}`);
  for(const a of life.animals){maxStep=Math.max(maxStep,a.position.distanceTo(before[a.id]));assert.ok(a.position.distanceTo(before[a.id])<.065,JSON.stringify({frame:i,id:a.id,before:before[a.id].toArray(),after:a.position.toArray(),flight:a.flight?.progress,distance:a.distance,length:a.length}));if(a.flight)swimmers.add(a.id);else if(a.trail?.leaf!==initial[a.id])landed.add(a.id);
   assert.ok(Number.isFinite(a.matrix.determinant())&&a.matrix.determinant()>0,'upright finite contact basis');
   if(a.trail&&!a.flight){const p=new T.Vector3(),n=new T.Vector3(),tr=a.trail,u=a.distance/a.length*tr.points.length,j=Math.floor(u)%tr.points.length,uv=tr.points[j].clone().lerp(tr.points[(j+1)%tr.points.length],u-j);leafContact(tr.leaf,uv.x,uv.y,(i+1)*.1,p,n);p.addScaledVector(n,.004);assert.ok(a.position.distanceTo(p)<1e-6,'feet follow the animated rendered surface');}
  }
 }
 assert.ok(swimmers.size>=4,'independent shrimp occasionally swim');assert.ok(landed.size>=3,'swimming must actually reach other leaves');assert.ok(maxStep<.065,`continuous contact transitions: ${maxStep}`);
 const matrices=life.root.children.map(o=>Array.from(o.instanceMatrix.array));life.update(0);assert.deepEqual(life.root.children.map(o=>Array.from(o.instanceMatrix.array)),matrices);life.dispose();
});
test('plant clearance checks a body volume against a neighboring leaf and stem',()=>{
 const scene=new T.Scene(),g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([-.5,0,0,.5,0,0,-.5,1,0,.5,1,0],3));g.setAttribute('uv',new T.Float32BufferAttribute([0,0,1,0,0,1,1,1],2));g.setIndex([0,1,2,1,3,2]);g.setAttribute('plantRoot',new T.InstancedBufferAttribute(new Float32Array([0,0,0]),3));g.setAttribute('plantFlex',new T.InstancedBufferAttribute(new Float32Array([0]),1));g.setAttribute('leafMotion',new T.InstancedBufferAttribute(new Float32Array([0,0,1]),3));
 const leaf=new T.InstancedMesh(g,new T.MeshBasicMaterial(),1);leaf.userData.plantSpecies='sword';leaf.setMatrixAt(0,new T.Matrix4().makeRotationX(-Math.PI/2).setPosition(0,1,0));scene.add(leaf);scene.updateMatrixWorld();const plants=new GrazerPlants(scene),p=new T.Vector3(0,.9,-.5),n=new T.Vector3(0,1,0),forward=new T.Vector3(1,0,0);
 assert.equal(plants.clear(p,n,forward,false,0),false,'body must not cross a thin leaf');assert.equal(plants.clear(p.clone().add(new T.Vector3(0,.5,0)),n,forward,false,0),true,'open water stays traversable');
 const stemGeometry=new T.CylinderGeometry(.01,.01,.7,5);stemGeometry.setAttribute('plantRoot',new T.InstancedBufferAttribute(new Float32Array([2,0,0]),3));stemGeometry.setAttribute('plantFlex',new T.InstancedBufferAttribute(new Float32Array([0]),1));const stem=new T.InstancedMesh(stemGeometry,new T.MeshBasicMaterial(),1);stem.setMatrixAt(0,new T.Matrix4().makeTranslation(2,1,0));scene.add(stem);scene.updateMatrixWorld();const withStem=new GrazerPlants(scene);assert.equal(withStem.clear(new T.Vector3(2,.9,0),n,forward,false,0),false,'stem blocks the body too');
 const contact=new T.Vector3(),normal=new T.Vector3();leafContact(plants.leaves[0],.5,.5,0,contact,normal);assert.ok(contact.distanceTo(new T.Vector3(0,1,-.5))<1e-6);assert.ok(normal.y>.999);
});

test('contact deformation matches the actual plant vertex shader at varied flow times',async()=>{
 const {plantCurrent}=await import('../lib/PlantCurrent.ts');const material=new T.MeshPhysicalMaterial(),shader={uniforms:{},vertexShader:'',fragmentShader:''};plantCurrent(material,{value:0},true);material.onBeforeCompile(shader,{});
 const helpers=shader.vertexShader.slice(shader.vertexShader.indexOf('vec4 leafBend'),shader.vertexShader.indexOf('vec3 bendPlantNormal'));
 const js=helpers.replace(/vec[34] (\w+)\(([^)]*)\)/g,(_,name,args)=>`function ${name}(${args.replace(/vec3 /g,'')})`).replace(/\b(?:float|vec4) (\w+)/g,'let $1').replace(/\b(sin|cos|max|abs)\(/g,'Math.$1(');
 const run=new Function('waterTime','leafMotion','plantRoot','plantFlex',`const vec3=(x,y,z)=>({x,y,z}),vec4=(x,y,z,w)=>({x,y,z,w}),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));${js};return {blade:animatedLeaf,stem:bendPlant};`);
 const leaf={motion:new T.Vector3(1.2,.12,.7),root:new T.Vector3(2,.4,1),flex:.6,matrix:new T.Matrix4().makeRotationX(-.6).setPosition(2,.7,1),mesh:{matrixWorld:new T.Matrix4()}};
 for(const time of [0,.3,2.7,10,33])for(const y of [0,.3,.7,1]){const p=new T.Vector3(.08,y,-y*y*.2),f=run(time,leaf.motion,leaf.root,leaf.flex),local=f.blade({...p}),world=new T.Vector3(local.x,local.y,local.z).applyMatrix4(leaf.matrix),expected=f.stem({...world}),actual=deformPlantPoint(p.clone(),leaf,time);assert.ok(actual.distanceTo(new T.Vector3(expected.x,expected.y,expected.z))<1e-10);}
});

 test('six dwarf cories travel through the full planting without crossing leaves, companions or grazers',async()=>{
 const {Corydoras,coryBody,coryForward}=await import('../lib/Corydoras.ts');const scene=new T.Scene();buildBotanicalPlants(scene,height,{value:0});addFernFixture(scene);calmSwordLeaves(scene);scene.updateMatrixWorld();const obstacles=await hardscapeObstacles(),grazers=new Invertebrates(scene,height,[],undefined,obstacles),life=new Corydoras(scene,height,obstacles,grazers.plants),distance=Array(6).fill(0),lateDistance=Array(6).fill(0);await life.prepareNavigation(JSON.parse(fs.readFileSync(new URL('../lib/CoryFloorRoutes.json',import.meta.url),'utf8')));let plantContacts=0;const bounds=[Infinity,-Infinity,Infinity,-Infinity];
 for(let i=0;i<1800;i++){const old=life.animals.map(a=>a.position.clone());life.update(.1,i*.1,[],grazers.animals);grazers.externalBodies=life.animals.map(a=>coryBody(a.position,coryForward(a),a.size,a.pitch));grazers.update(.1,i*.1);for(const a of life.animals){distance[a.id]+=a.position.distanceTo(old[a.id]);if(i>=1200)lateDistance[a.id]+=a.position.distanceTo(old[a.id]);bounds[0]=Math.min(bounds[0],a.position.x);bounds[1]=Math.max(bounds[1],a.position.x);bounds[2]=Math.min(bounds[2],a.position.z);bounds[3]=Math.max(bounds[3],a.position.z);for(const g of grazers.animals)assert.equal(bodiesOverlap(coryBody(a.position,coryForward(a),a.size,a.pitch),grazerBody(g.position,g.normal,new T.Vector3().setFromMatrixColumn(g.matrix,0).normalize(),g.kind==='snail',g.kind==='shrimp'?.80+g.id%3*.04:.84),0),false,'cory and grazer stay separate');assert.ok(a.position.distanceTo(old[a.id])<.04);if(!grazers.plants.clearBody(a.position,coryBody(a.position,coryForward(a),a.size,a.pitch),i*.1))plantContacts++;for(const b of life.animals)if(b.id>a.id)assert.equal(bodiesOverlap(coryBody(a.position,coryForward(a),a.size,a.pitch),coryBody(b.position,coryForward(b),b.size,b.pitch),0),false);}}
 assert.equal(plantContacts,0,'moving foliage must not penetrate cory envelopes');assert.ok(distance.every(d=>d>3),JSON.stringify(distance));assert.ok(bounds[0]<-3.5&&bounds[1]>3.5,'the group explores both ends of the tank');assert.ok(lateDistance.every(d=>d>1),'each cory keeps moving in the final minute: '+JSON.stringify(lateDistance));grazers.dispose();
 });
