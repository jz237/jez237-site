import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {ROOF_KNOCK,roofSignFate,foldRoofSign,roofSignBox} from '../src/roof-sign';
import {Effects} from '../src/effects';
await R.init();
test('a roof sign folds flat when the car goes over or the roof is crushed, and tears off on a second roll, a bad crush or a blow-up',()=>{
 assert.equal(roofSignFate('up',1,0,0,false),'up','upright and untouched');assert.equal(roofSignFate('up',.5,0,ROOF_KNOCK.flatRoof-1,false),'up','a lean or a light roof hit leaves it');
 assert.equal(roofSignFate('up',ROOF_KNOCK.side-.01,0,0,false),'flat','over on its side');assert.equal(roofSignFate('up',1,1,0,false),'flat','after a roll');
 assert.equal(roofSignFate('up',1,0,ROOF_KNOCK.flatRoof,false),'flat','a crushed roof');assert.equal(roofSignFate('flat',1,0,0,false),'flat','it never stands back up');
 assert.equal(roofSignFate('flat',1,ROOF_KNOCK.tearRolls,0,false),'torn');assert.equal(roofSignFate('up',1,0,ROOF_KNOCK.tearRoof,false),'torn');
 assert.equal(roofSignFate('up',1,0,0,true),'torn','blown off');assert.equal(roofSignFate('torn',1,0,0,false),'torn','gone for good');
});
test('the folded sign eases flat on its posts to the side it was pushed',()=>{
 const sign=new T.Group();for(let i=0;i<30;i++)foldRoofSign(sign,1,1/60);assert.ok(Math.abs(sign.rotation.z-ROOF_KNOCK.flat)<.01);
 const other=new T.Group();foldRoofSign(other,-1,1/60);assert.ok(other.rotation.z<0&&other.rotation.z>-ROOF_KNOCK.flat,'eases, does not snap');
 foldRoofSign(other,-1,0);foldRoofSign(other,-1,-1);const z=other.rotation.z;foldRoofSign(other,-1,NaN);assert.equal(other.rotation.z,z,'no time, no move');
 const box=roofSignBox();assert.ok(box.size.y>box.centre.y&&box.centre.y>0,'tumbles about the board, above the roof');
});
test('a torn-off prop leaves its car where it was, tumbles on its own body and is freed with the debris',()=>{
 const previous=globalThis.window;(globalThis as any).window={innerHeight:1440,performance:globalThis.performance};
 try{const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene(),fx=new Effects(scene,world);
 const car=new T.Group();car.position.set(4,1.2,-3);car.rotation.y=.7;scene.add(car);
 const prop=new T.Group();prop.name='roof_sign';prop.position.set(0,.6,.3);const board=new T.Mesh(new T.BoxGeometry(.03,.3,.62),new T.MeshBasicMaterial());board.position.y=.27;prop.add(board);car.add(prop);
 scene.updateMatrixWorld(true);const was=board.getWorldPosition(new T.Vector3());let released=0;const box=roofSignBox();
 fx.detachProp(prop,new T.Vector3(2,3,0),box.size,box.centre,()=>{released++;});
 assert.ok(prop.parent!==car&&prop.parent?.parent===scene&&prop.parent.name==='torn_roof_sign','out of the car, into the scene');
 scene.updateMatrixWorld(true);assert.ok(board.getWorldPosition(new T.Vector3()).distanceTo(was)<1e-6,'no jump at the moment it comes off');
 assert.equal(fx.debris.length,1);const body=fx.debris[0].body;assert.ok(body.isDynamic());
 for(let i=0;i<30;i++){world.step();fx.update(1/60);}assert.ok(fx.debris[0].mesh.position.x>4.5,'thrown with the car\'s speed');
 fx.reset();assert.equal(released,1,'freed once when the debris is cleared');assert.equal(fx.debris.length,0);
 world.free();
 }finally{(globalThis as any).window=previous;}
});
test('every frame each roof sign takes its car\'s knocks (except while paused)',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes("if(state!=='paused')for(const c of cars){const sign=c.root.children.find(o=>o.name==='roof_sign');if(sign)knockRoofSign(c,sign,dt);}"));
 assert.ok(main.includes("const fate=roofSignFate(was,signUp.y,c.rolls,c.damageZones.roof,c.blownUp);"));
 assert.ok(main.includes("fx.detachProp(sign,")&&main.includes("()=>disposeRoofSign(sign));return;}"),'the torn sign is freed with the debris, not the car');
});
