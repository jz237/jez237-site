import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {LOOK,lookYaw,turnHead} from '../src/driver-look';
import {driverFigure} from '../src/driver-figure';
test('a driver watches their prey, looks into the turn and back over the shoulder the tail swings to when reversing',()=>{
 assert.ok(Math.abs(lookYaw({x:5,z:5},0,10)-Math.PI/4)<1e-9,'prey ahead to the +x side');assert.equal(lookYaw({x:-3,z:0},0,0),-LOOK.max,'prey square beside: as far round as a head turns');assert.ok(Math.abs(lookYaw({x:-3,z:3},0,0)+Math.PI/4)<1e-9);
 assert.equal(lookYaw({x:.5,z:-8},0,0),LOOK.max,'prey behind: watched from as far round as a head goes');assert.equal(lookYaw({x:-.5,z:-8},0,0),-LOOK.max);
 assert.equal(lookYaw(null,0,12),0,'straight on: eyes front');assert.ok(Math.abs(lookYaw(null,1,12)-LOOK.turn)<1e-9,'into the turn');assert.equal(lookYaw(null,99,12),LOOK.max);
 assert.equal(lookYaw(null,.8,-4),-LOOK.max,'reversing while yawing to +x: the tail swings to -x, look back that way');assert.equal(lookYaw(null,-.8,-4),LOOK.max);assert.equal(lookYaw(null,0,-4),LOOK.max);
 assert.equal(lookYaw({x:0,z:0},NaN,NaN),0,'nothing usable: eyes front');
});
test('the visor turns about the helmet towards the look at a head\'s pace',()=>{
 const figure=driverFigure(0xd23a2a),visor=figure.children[1] as T.Mesh,facing=()=>{visor.updateMatrix();const g=visor.geometry;g.computeBoundingBox();
  const c=g.boundingBox!.getCenter(new T.Vector3()).applyMatrix4(visor.matrix);return Math.atan2(c.x,c.z);};
 assert.ok(Math.abs(facing())<.05,'the visor faces forward (+z) at rest');
 turnHead(figure,1,1/60);assert.ok(Math.abs(figure.userData.look-LOOK.rate/60)<1e-9,'turns at LOOK.rate');
 for(let i=0;i<60;i++)turnHead(figure,1,1/60);assert.equal(figure.userData.look,1);assert.ok(Math.abs(facing()-1)<.05,'and the visor faces the look');
 turnHead(figure,-1,0);turnHead(figure,-1,NaN);assert.equal(figure.userData.look,1,'no time, no turn');
 const bare=new T.Group();turnHead(bare,1,1/60);assert.equal(bare.userData.look,undefined,'no visor, nothing to turn');
});
test('every driver looks each frame except while paused, at the target their driving brain holds',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes("if(state!=='paused')for(const c of cars){const d=c.root.children.find(o=>o.name==='driver');if(d)lookDriver(c,d,dt);}"));
 assert.ok(main.includes("const t=drivers.memory.get(c.id)?.target,prey=t!==undefined&&t>=0&&t!==c.id?cars.find(x=>x.id===t&&x.health>0):undefined;"));
});
