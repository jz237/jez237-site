import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as T from '../vendor/three.module.js';
import {updateCraftLOD} from '../mesh-lod.js';

// Exercise the production rig/loader with its real binary assets, without
// WebGL or a second browser stealing focus from the game playtest.
const originalFetch=globalThis.fetch;
let makeBlenderRider;
try{
 globalThis.fetch=async url=>{
  const path=new URL(url);
  assert.equal(path.protocol,'file:');assert.ok(path.pathname.includes('/after-the-storm/assets/'));
  try{return new Response(await readFile(path));}catch{return new Response('',{status:404});}
 };
 ({makeBlenderRider}=await import('../blender-rider.js'));
}finally{globalThis.fetch=originalFetch;}

function part(rider,bone,material){return rider.root.getObjectByName(bone).children.find(mesh=>mesh.material.name===material);}

test('real rider instances share full and LOD geometry but retain independent skin and wetness',()=>{
 const a=makeBlenderRider(new T.Group(),{riderIndex:0,color:0xe05030});
 const b=makeBlenderRider(new T.Group(),{riderIndex:2,color:0x3070e0});
 assert.ok(a&&b,'the real detailed models loaded');
 const skinA=part(a,'upperArmL','Skin'),skinB=part(b,'upperArmL','Skin');
 assert.ok(skinA&&skinB,'the exposed athletic arms are present');
 assert.equal(skinA.geometry,skinB.geometry);assert.notEqual(skinA.material,skinB.material);
 assert.notEqual(skinA.material.color.getHex(),skinB.material.color.getHex());
 assert.equal(skinA.material.normalMap,skinB.material.normalMap);
 const dryB=skinB.material.roughness;
 for(let tick=1;tick<=120;tick++)a.update('',tick/60,0,{speed:30,impact:8});
 assert.ok(skinA.material.roughness<skinB.material.roughness-.05);
 assert.equal(skinB.material.roughness,dryB,'wetness does not leak to another racer');
 const full=skinA.geometry,lod=skinA.userData.lodGeometry;
 assert.ok(lod&&lod.attributes.uv,'optional distant geometry has material UVs');
 updateCraftLOD(a.root,80,'high');assert.equal(skinA.geometry,lod);assert.equal(skinB.geometry,full);
 updateCraftLOD(a.root,5,'high');assert.equal(skinA.geometry,full);
 assert.equal(skinA.material.normalMap,skinB.material.normalMap,'LOD does not create texture copies');
});

test('stunt rig palms follow the real bars immediately while the body lean is spring filtered',()=>{
 const rider=makeBlenderRider(new T.Group());
 rider.update('handstand',0,0);
 rider.update('handstand',1/60,1);
 assert.ok(rider.root.userData.riderMotion.lean<.1,'body weight eases into the turn');
 for(const [side,x] of [['L',-.445],['R',.445]]){
  const hand=rider.root.getObjectByName('hand'+side).position;
  assert.ok(Math.abs(hand.x-(x*Math.cos(.3)+.044*Math.sin(.3)))<1e-9);
  assert.ok(Math.abs(hand.z-(-x*Math.sin(.3)+.044*Math.cos(.3)+.66))<1e-9);
 }
 rider.root.updateMatrixWorld(true);
 const held=rider.root.children.map(group=>group.matrix.clone());
 for(let i=0;i<30;i++)rider.update('handstand',1/60,1,{dt:0});
 rider.root.updateMatrixWorld(true);
 rider.root.children.forEach((group,i)=>assert.ok(group.matrix.equals(held[i])));
});
