import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {FLAG,derbyFlag,disposeDerbyFlag,newFlagState,stepFlag,waveFlag} from '../src/derby-flag';
test('a derby flag is a whip with a pennant at its tip that can snap part way up',()=>{
 const flag=derbyFlag(0x16c95b),whip=flag.getObjectByName('flag_whip')!,top=flag.getObjectByName('flag_top')!,cloth=flag.getObjectByName('flag_cloth')! as T.Mesh;
 assert.ok(flag.name==='derby_flag'&&whip.parent===flag&&top.parent===whip&&cloth.parent===top);
 flag.updateMatrixWorld(true);assert.ok(Math.abs(cloth.getWorldPosition(new T.Vector3()).y-FLAG.pole)<1e-9,'the pennant flies from the tip');assert.ok(Math.abs(top.position.y-FLAG.pole*FLAG.snapAt)<1e-9);
 assert.equal((cloth.material as T.MeshStandardMaterial).color.getHex(),0x16c95b);
 const car=new T.Group();car.add(flag);disposeDerbyFlag(flag);assert.equal(car.children.length,0);
});
test('the whip leans off the acceleration, held to its bend, and settles',()=>{
 const run=(ax:number,az:number,t:number,s=newFlagState())=>{for(let i=0;i<t*60;i++)stepFlag(s,ax,az,1/60);return s;};
 assert.ok(Math.abs(run(5,0,8).bendX-FLAG.gain*5)<1e-3,'a steady pull settles at gain·a');assert.ok(Math.abs(run(0,-4,8).bendZ+FLAG.gain*4)<1e-3);
 const hard=run(400,0,.3);assert.ok(Math.hypot(hard.bendX,hard.bendZ)<=FLAG.maxBend+1e-9,'never past its bend');
 const s=run(5,0,8);run(0,0,10,s);assert.ok(Math.abs(s.bendX)<.01,'settles straight');
 const t=newFlagState();stepFlag(t,9,9,0);stepFlag(t,9,9,NaN);assert.ok(t.bendX===0&&t.bendZ===0);
});
test('on a moving car the pennant streams back and the whip leans back into the air; it snaps for good when the car is out',()=>{
 const car=new T.Group(),flag=derbyFlag(0xff4a12);car.add(flag);car.rotation.y=.8;const forward=new T.Vector3(0,0,1).applyQuaternion(car.quaternion);
 for(let i=0;i<600;i++){car.position.addScaledVector(forward,15/60);waveFlag(flag,car,1/60,false);}
 const s=flag.userData.wave,cloth=flag.getObjectByName('flag_cloth')!;car.updateMatrixWorld(true);
 assert.ok(Math.abs(s.bendZ-FLAG.gain*FLAG.drag*225)<.01,'leans back with the air at 15 m/s');
 const tip=new T.Vector3(FLAG.width,0,0).applyMatrix4(cloth.matrixWorld).sub(cloth.getWorldPosition(new T.Vector3()));assert.ok(tip.dot(forward)<-.2,'the pennant streams back from the way the car goes');
 const held={...s,velocity:s.velocity.clone()};for(let i=0;i<20;i++)waveFlag(flag,car,1/60,false);assert.ok(flag.userData.wave.bendZ===held.bendZ,'a frozen car holds its flag');
 car.position.x+=40;waveFlag(flag,car,1/60,false);waveFlag(flag,car,1/60,false);assert.ok(Math.abs(flag.userData.wave.rateX)<1,'a jump restarts it, no lash');
 waveFlag(flag,car,1/60,true);const top=flag.getObjectByName('flag_top')!;assert.ok(top.rotation.z===FLAG.snap&&flag.userData.wave.snapped,'out: the whip snaps and hangs');
 waveFlag(flag,car,1/60,false);assert.equal(top.rotation.z,FLAG.snap,'and stays snapped');
});
test('offline derby rivals carry a flag set on their roof skin, waved every frame, snapped when out or upside down, freed with the car',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
 assert.ok(main.includes("const hit=new T.Raycaster(from,down,0,1.6).intersectObjects([...car.panels,...car.glass],false)[0];")&&main.includes("if(hit){const flag=derbyFlag(FLAG_COLOURS[i%FLAG_COLOURS.length]);flag.position.copy(car.root.worldToLocal(hit.point.clone()));car.root.add(flag);}"));
 assert.ok(main.includes("if(state!=='paused')for(const c of cars){const f=c.root.children.find(o=>o.name==='derby_flag');if(f)waveFlag(f,c.root,dt,c.health<=0||c.inverted>.3,windy&&!online?.active?breeze:undefined);}"));
 assert.ok(main.includes("'roll_cage', 'derby_flag'].includes(o.name)"),'part of the dressing hook');
 assert.ok(vehicle.includes("{const flag=this.root.children.find(o=>o.name==='derby_flag');if(flag)disposeDerbyFlag(flag);}"));
});
