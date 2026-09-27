import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ReefCleaners} from '../ReefCleaners.ts';
const bytes=await readFile(new URL('../assets/invertebrates/cleaner-shrimp.glb',import.meta.url));
const template=(await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'' )).scene;
const surface=(x,z)=>({point:new T.Vector3(x,.5+(x+2.5)*.12+(z-1.8)*.06,z),normal:new T.Vector3(-.12,1,-.06).normalize()});
const cleaners=new ReefCleaners(new T.Scene(),template,surface);
assert.equal(cleaners.animals.length,2);
let meshCount=0,vertices=0;template.traverse(o=>{if(o instanceof T.SkinnedMesh){meshCount++;vertices+=o.geometry.getAttribute('position').count;assert.ok(o.skeleton.bones.length>=100);}});
assert.equal(meshCount,1,'shared detailed skin keeps the pair to two draw calls');assert.ok(vertices>20000&&vertices<50000);
const before=cleaners.snapshot();cleaners.update(0,[]);assert.deepEqual(cleaners.snapshot(),before,'pause freezes every appendage and decision');
const visitors=[{position:cleaners.animals[0].home.clone().add(new T.Vector3(0,.45,0)),velocity:new T.Vector3(.1,0,0),species:'tang'}];
let grounded=0,maxJointGap=0,maxTipError=0;
for(let frame=0;frame<2400;frame++){
 cleaners.update(1/40,frame<600?visitors:[],frame>1600);
 for(const a of cleaners.animals){
  assert.equal(a.feet.length,10);assert.equal(a.joints.size,104);
  const planted=a.feet.filter(f=>f.step===1);assert.ok(planted.length>=9,'nine feet remain planted during each deliberate step');
  for(const foot of planted){assert.ok(Math.abs(foot.world.y-surface(foot.world.x,foot.world.z).point.y)<1e-5);grounded++;}
  for(const foot of a.feet)for(let k=0;k<3;k++){
   const len=foot.rest[k].distanceTo(foot.rest[k+1]);const end=foot.bones[k].localToWorld(new T.Vector3(0,len,0));
   if(k<2)maxJointGap=Math.max(maxJointGap,end.distanceTo(foot.bones[k+1].getWorldPosition(new T.Vector3())));
   else maxTipError=Math.max(maxTipError,end.distanceTo(foot.world));
  }
 }
 if(frame===599)assert.ok(cleaners.snapshot().animals.every(a=>a.attention>.9),'nearby fish elicit invitation');
}
const after=cleaners.snapshot();assert.notDeepEqual(after.animals[0].antennae,before.animals[0].antennae);assert.notDeepEqual(after.animals[0].antennae,after.animals[1].antennae,'independent timing');assert.ok(after.animals.every(a=>a.steps>20&&a.attention<.01));
assert.ok(maxJointGap<1e-5,`connected joints: ${maxJointGap}`);assert.ok(maxTipError<1e-5,`feet stay attached: ${maxTipError}`);
console.log(JSON.stringify({cleanerShrimp:true,vertices,bones:104,seconds:60,groundedFootSamples:grounded,maxJointGap,maxTipError}));
