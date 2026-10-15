import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {riderPose} from '../rider-pose.js';

// Deliberately fail every asset through a local response fixture: the actual
// makeJetSki fallback must remain usable even when detailed loading fails.
const oldFetch=globalThis.fetch,oldWarn=console.warn,warnings=[];let makeJetSki;
try{
 globalThis.fetch=async url=>{assert.equal(new URL(url).protocol,'file:');return new Response('',{status:404});};
 console.warn=(...args)=>warnings.push(args.join(' '));
 ({makeJetSki}=await import('../jetski.js'));
}finally{globalThis.fetch=oldFetch;console.warn=oldWarn;}
function create(){
 const previous=globalThis.document;
 globalThis.document={createElement(name){assert.equal(name,'canvas');return {width:0,height:0,getContext(){return {fillRect(){},fillText(){}};}};}};
 try{return makeJetSki(new T.Group());}finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
const nearPoint=(a,b)=>a.toArray().forEach((n,i)=>assert.ok(Math.abs(n-b[i])<1e-9,`${n} != ${b[i]}`));

test('failed asset loading preserves the old artwork and lazily gives all fallback limbs actual target poses',()=>{
 assert.ok(warnings.some(s=>s.includes('Blender rider unavailable')));
 const v=create(),root=v.rider,staticMeshes=[...root.children];assert.equal(staticMeshes.length,31);assert.equal(typeof v.updateRider,'function');
 root.updateMatrixWorld(true);const rest=staticMeshes.map(m=>m.matrix.clone());
 v.updateRider({time:99,turn:1,speed:30});assert.equal(root.children.length,31);assert.ok(staticMeshes.every(m=>m.visible));
 const p=riderPose();p.targets.upperArmL=[[-.29,1.67,.08],[-.41,1.36,.37]];p.targets.forearmL=[[-.41,1.36,.37],[-.48,1.19,.72]];
 const invalid=structuredClone(p);delete invalid.targets.head;
 assert.throws(()=>v.updateRider({targetPose:invalid}),/head/);assert.equal(root.children.length,31);assert.ok(staticMeshes.every(m=>m.visible));
 v.updateRider({time:100,turn:-1,targetPose:p});root.updateMatrixWorld(true);
 assert.equal(root.userData.nativePhysical,true);assert.equal(root.userData.riderMotion.nativePhysical,true);assert.ok(staticMeshes.every(m=>!m.visible));
 const rig=root.getObjectByName('Built-in / physical rider targets');assert.ok(rig&&rig.visible);assert.equal(rig.children.length,15);
 const physical=[];rig.traverse(m=>{if(m.isMesh)physical.push(m);});assert.equal(physical.length,31);
 for(const m of physical){
  assert.ok(staticMeshes.some(q=>q.geometry===m.geometry&&q.material===m.material),'original detailed fallback parts are reused');
  assert.equal(m.castShadow,true);assert.equal(m.receiveShadow,true);
 }
 for(const [name,pair]of Object.entries(p.targets))nearPoint(rig.getObjectByName(name).position,pair[0]);
 // The actual pre-existing cylinders must end at the target joints, not only
 // their group's origin. This checks the lazy rest-matrix rebasing and length.
 for(const name of ['upperArmL','forearmL','thighL','shinL','upperArmR','forearmR','thighR','shinR']){
  const limb=rig.getObjectByName(name).children.find(m=>m.geometry.type==='CylinderGeometry'),half=limb.geometry.parameters.height*.5;
  nearPoint(limb.localToWorld(new T.Vector3(0,-half,0)),p.targets[name][0]);
  nearPoint(limb.localToWorld(new T.Vector3(0,half,0)),p.targets[name][1]);
 }
 const held=rig.children.map(g=>g.matrix.clone());for(let i=0;i<100;i++)v.updateRider({targetPose:p,time:1000+i,turn:1,impact:100});
 root.updateMatrixWorld(true);rig.children.forEach((g,i)=>assert.ok(g.matrix.equals(held[i])));
 v.updateRider({targetPose:null});root.updateMatrixWorld(true);assert.equal(rig.visible,false);assert.ok(staticMeshes.every(m=>m.visible));
 assert.equal(root.userData.nativePhysical,false);assert.equal(root.userData.riderMotion,undefined);
 staticMeshes.forEach((m,i)=>assert.ok(m.matrix.equals(rest[i]),'modern static fallback artwork changed'));
});
