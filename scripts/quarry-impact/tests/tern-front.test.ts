import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {buildTernAsset} from '../src/tern-asset';
import {constructionRole} from '../src/vehicle-construction';
import {dentGeometry} from '../src/wreck-geometry';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCars} from '../src/assets';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {Vehicle} from '../src/vehicle';
await R.init();const originalLoad=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|wheel-machining)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=originalLoad;}

const root=buildTernAsset();root.updateMatrixWorld(true);
const mesh=(name:string)=>root.getObjectByName(name) as T.Mesh;
const ray=(x:number,y:number)=>new T.Raycaster(new T.Vector3(x,y,2.4),new T.Vector3(0,0,-1));

test('Tern grille and lamps occupy real openings, with recessed lenses and no exposed gaps',()=>{
 const skin=mesh('panel_FrontValanceTern');
 for(const x of [-.60,-.525,-.44,0,.44,.525,.60]){
  assert.equal(ray(x,.8025).intersectObject(skin).length,0,`paint must not fill aperture at ${x}`);
  const hit=ray(x,.8025).intersectObject(root,true)[0];assert.ok(hit);
  assert.match(hit.object.name,x===0?/FrontGrilleTern/:/HeadlightTern/);
  assert.ok(hit.point.z<1.81+.026*(1-(x/.737)**2)+.006,'lamp surface sits inside the nose');
 }
 // Scan the intact fitted nose, including its trim-to-paint interfaces.
 for(let x=-.72;x<=.72;x+=.018)for(let y=.62;y<=.94;y+=.013){
  const hit=ray(x,y).intersectObject(root,true)[0];
  assert.ok(hit&&hit.point.z>1.74,`uncovered nose at ${x},${y}`);
 }
});

test('Tern shaped engine castings and added fittings clear the closed bonnet',()=>{
 const hood=mesh('panel_hoodTern');
 const parts=root.children.filter(o=>/^Structure engine |^Structure Tern (transaxle|battery|coolant|suspension turret|strut top|brake reservoir)/.test(o.name)) as T.Mesh[];
 assert.ok(parts.length>15);
 for(const part of parts){const p=part.geometry.attributes.position;
  for(let i=0;i<p.count;i++){
   const point=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(part.matrixWorld);
   const hit=new T.Raycaster(new T.Vector3(point.x,2,point.z),new T.Vector3(0,-1,0)).intersectObject(hood)[0];
   assert.ok(hit,part.name+' is inside the bonnet footprint');assert.ok(hit.point.y-point.y>.018,part.name+' has bonnet clearance');
  }
 }
 for(const name of ['Structure engine cover oil cap Tern','Structure engine cover timing Tern','Structure engine block alternator Tern'])assert.equal(constructionRole(name),'engine');
});

test('new engine castings use bounded rigid damage and restore their original vertices',()=>{
 const world=new R.World({x:0,y:0,z:0}),car=new Vehicle(0,'tern',0x9b4d38,new T.Scene(),world,{emit(){},mark(){},detach(){}} as any);
 try{
  const castings=car.panels.filter(m=>m.userData.constructionRole==='engine');assert.ok(castings.length>=3);
  const before=castings.map(m=>Array.from(m.geometry.attributes.position.array));
  for(const [j,casting]of castings.entries()){
   for(let i=0;i<5;i++)dentGeometry(casting,new T.Vector3(0,.64,1.3),new T.Vector3(0,0,-1),40);
   const after=Array.from(casting.geometry.attributes.position.array);assert.notDeepEqual(after,before[j]);assert.ok(after.every(Number.isFinite));
   const shift=new T.Vector3().fromArray(after).sub(new T.Vector3().fromArray(before[j]));assert.ok(shift.length()<=.16001);
   for(let i=0;i<after.length;i+=3){const d=new T.Vector3().fromArray(after,i).sub(new T.Vector3().fromArray(before[j],i));assert.ok(d.distanceTo(shift)<1e-6,'casting retains its shape');}
  }
  car.repair();for(const [j,casting]of castings.entries())assert.deepEqual(Array.from(casting.geometry.attributes.position.array),before[j]);
 }finally{car.dispose();world.free();}
});

import {verifyTernRevision} from './tern-invariants';
test('Tern front refinements preserve the published ninth-car revision',verifyTernRevision);
