import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from '../vendor/three.module.js';
import {makeNativeFishParts,NATIVE_FISH_SPECIES,nativeFishSpeciesForPart} from '../native-fish-model.js';
import {makeNativeFishRenderer} from '../native-fish-render.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const assets=Object.fromEntries([0,2].map(i=>[i,new Uint8Array(readFileSync(new URL('../assets/actor-animations/bank-'+i+'.bin',import.meta.url)))]));
const live=()=>{const frames=[];const s=createRace({mode:'practice',physics:'native',course:getCourse('practice'),nativeCourseActors:{assets,onDisplay:(p,r)=>frames.push({p,r})}});return {s,frames};};
// CPU copy of the shader's linear blend skinning for one vertex.
function skinned(model,pose,index){
 const g=model.part(NATIVE_FISH_SPECIES[model.species].parts.middle).geometry,p=new T.Vector3().fromBufferAttribute(g.getAttribute('position'),index),[wh,wt]=[g.getAttribute('fishWeights').getX(index),g.getAttribute('fishWeights').getY(index)];
 const h=p.clone().applyMatrix4(new T.Matrix4().fromArray(pose.head)),t=p.clone().applyMatrix4(new T.Matrix4().fromArray(pose.tail));
 return p.clone().multiplyScalar(1-wh-wt).addScaledVector(h,wh).addScaledVector(t,wt);
}

test('three species map to their original slice sets and slice lengths',()=>{
 assert.deepEqual([8,12,16,20,24,28,32,36,40].map(nativeFishSpeciesForPart),['clown','clown','clown','butterfly','butterfly','butterfly','tang','tang','tang']);
 assert.equal(nativeFishSpeciesForPart(44),undefined);assert.throws(()=>makeNativeFishParts('shark',{map:null}),/Unknown/);
 for(const species of Object.keys(NATIVE_FISH_SPECIES)){
  const m=makeNativeFishParts(species,{map:null}),spec=NATIVE_FISH_SPECIES[species],g=m.part(spec.parts.middle).geometry;g.computeBoundingBox();
  const [h,mid,t]=spec.lengths,box=g.boundingBox;
  // Nose at the head slice's x=0 and tail fin end at the tail slice's x=L, in the middle frame.
  assert.ok(Math.abs(box.min.x+h)<1.5&&Math.abs(box.max.x-(mid+t))<1.5,species+' length');assert.ok(box.max.y<=51&&box.min.y>=-51,species+' height');
  assert.ok(g.getAttribute('position').count>5000,'high-resolution body');assert.equal(m.part(spec.parts.head).geometry.drawRange.count,0);
  assert.throws(()=>m.part(4),/Unknown fish part/);m.dispose();assert.throws(()=>m.part(spec.parts.middle),/disposed/);
 }
});

test('live swimmer poses keep every skinned vertex continuous with the original slice transforms',()=>{
 const {s,frames}=live();for(let i=0;i<600;i++)stepRace(s,{throttle:1,steer:.3},1/60);
 const fishFrames=frames.filter(f=>f.p.draws.some(d=>d.resourceIndex===1));assert.ok(fishFrames.length>50);
 const models={};let checked=0;
 for(const {p}of fishFrames.slice(-40)){
  const groups={};for(const d of p.draws)if(d.resourceIndex===1)(groups[d.actorIndex]??=[]).push(d);
  for(const draws of Object.values(groups)){
   const species=nativeFishSpeciesForPart(draws[0].partOffset),m=models[species]??=makeNativeFishParts(species,{map:null}),spec=NATIVE_FISH_SPECIES[species],pose=m.preparePose(draws);
   const world=offset=>new T.Matrix4().fromArray(draws.find(d=>d.partOffset===offset).matrixWorld),middle=world(spec.parts.middle);
   // A nose vertex follows the head slice exactly, a tail-fin vertex the tail slice.
   const g=m.part(spec.parts.middle).geometry,pos=g.getAttribute('position'),w=g.getAttribute('fishWeights');
   let nose=0,fin=0;for(let i=0;i<pos.count;i++){if(pos.getX(i)<pos.getX(nose))nose=i;if(pos.getX(i)>pos.getX(fin))fin=i;}
   assert.equal(w.getX(nose),1);assert.equal(w.getY(fin),1);
   const expectNose=new T.Vector3(pos.getX(nose)+spec.lengths[0],pos.getY(nose),pos.getZ(nose)).applyMatrix4(world(spec.parts.head));
   const expectFin=new T.Vector3(pos.getX(fin)-spec.lengths[1],pos.getY(fin),pos.getZ(fin)).applyMatrix4(world(spec.parts.tail));
   assert.ok(skinned(m,pose,nose).applyMatrix4(middle).distanceTo(expectNose)<1e-4);assert.ok(skinned(m,pose,fin).applyMatrix4(middle).distanceTo(expectFin)<1e-4);
   // Adjacent slices meet: head x=L and tail x=0 land on the middle's edges.
   assert.ok(new T.Vector3(spec.lengths[0],0,0).applyMatrix4(world(spec.parts.head)).distanceTo(new T.Vector3(0,0,0).applyMatrix4(middle))<.02);
   assert.ok(new T.Vector3(0,0,0).applyMatrix4(world(spec.parts.tail)).distanceTo(new T.Vector3(spec.lengths[1],0,0).applyMatrix4(middle))<.02);
   checked++;
  }
 }
 assert.ok(checked>40);for(const m of Object.values(models))m.dispose();
 assert.deepEqual(new Set(Object.keys(models)),new Set(['clown','butterfly','tang']));
});

test('fish renderer validates all actors before posing and releases departed or respeciated models',()=>{
 const {s,frames}=live();for(let i=0;i<600;i++)stepRace(s,{throttle:1,steer:.3},1/60);
 const {p,r}=frames.findLast(f=>f.p.draws.some(d=>d.resourceIndex===1)),root=new T.Group(),view=makeNativeFishRenderer(root,{map:null});
 const result=view.update(p,r),fishDraws=p.draws.filter(d=>d.resourceIndex===1);
 assert.equal(result.parts,fishDraws.length);assert.equal(view.snapshot().actors,new Set(fishDraws.map(d=>d.actorIndex)).size);
 const meshes=root.children[0].children.filter(m=>m.visible);assert.equal(meshes.length,fishDraws.length);
 const before=view.snapshot();
 const broken={draws:p.draws.map(d=>d.resourceIndex===1&&d===fishDraws.at(-1)?{...d,partOffset:44}:d)};
 assert.throws(()=>view.update(broken,r));assert.deepEqual(view.snapshot(),before);
 assert.throws(()=>view.update(p,r.map((w,i)=>i===(0x44+44)/4?8:w)),/nine loaded geometry/);
 assert.deepEqual(view.update({draws:p.draws.filter(d=>d.resourceIndex!==1)},r),{parts:0,actors:0});assert.equal(view.snapshot().actors,0);
 view.dispose();assert.throws(()=>view.update(p,r),/disposed/);assert.equal(root.children.length,0);
});
