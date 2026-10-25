import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {CAGE,cageRuns,rollCage,bendCage,disposeRollCage} from '../src/roll-cage';
import {DRIVER} from '../src/driver-figure';
const seat={x:-.45,y:1.02,z:.1},half=.92;
test('the cage is a hoop behind the seat and an X of door bars each side, inside the body and clear of the helmet',()=>{
 const runs=cageRuns(seat,half),points=runs.flat();
 assert.ok(points.every(p=>Math.abs(p.x)<=half*CAGE.inset+1e-9),'inside the doors');assert.ok(points.every(p=>p.z>=seat.z-CAGE.back-1e-9),'nothing behind the hoop (beds, load bays)');
 const top=Math.max(...points.map(p=>p.y));assert.ok(top>seat.y+DRIVER.head&&top<seat.y+DRIVER.head+DRIVER.headroom,'the hoop clears the helmet and stays under the roof');
 const doors=runs.filter(([a,b])=>a.z!==b.z);assert.equal(doors.length,6,'an X and a top rail in each door');
 assert.ok(doors.every(([a,b])=>Math.max(a.y,b.y)<seat.y-DRIVER.head),'door bars below the helmet');assert.ok(doors.every(([a,b])=>Math.abs(a.x)===Math.abs(b.x)&&Math.abs(a.x)>Math.abs(seat.x)),'outboard of the driver, along the door');
 const cage=rollCage(seat,half);assert.ok(cage instanceof T.Mesh&&cage.name==='roll_cage','one merged mesh');
 cage.geometry.computeBoundingBox();const box=cage.geometry.boundingBox!;assert.ok(box.max.y<=top+CAGE.tube*2&&box.min.z>=seat.z-CAGE.back-CAGE.tube*3&&box.max.x<=half*CAGE.inset+CAGE.tube*2,'the tubes sit on their runs');
 const car=new T.Group();car.add(cage);disposeRollCage(cage);assert.equal(car.children.length,0);
});
test('a crushed roof bends the cage down about its floor bar, never flat',()=>{
 const cage=new T.Object3D(),floor=seat.y-CAGE.low,top=seat.y+CAGE.top,at=(y:number)=>y*cage.scale.y+cage.position.y;
 bendCage(cage,seat,0);assert.ok(cage.scale.y===1&&cage.position.y===0);
 bendCage(cage,seat,.2);assert.ok(Math.abs(at(top)-(top-.2))<1e-9&&Math.abs(at(floor)-floor)<1e-9,'the top comes down by the slump, the floor bar stays');
 bendCage(cage,seat,9);assert.ok(Math.abs(at(top)-floor-(CAGE.low+CAGE.top)*.4)<1e-9,'at most 60% bent');
 bendCage(cage,seat,NaN);assert.equal(cage.scale.y,1);
});
test('offline derby cars get a cage from the driver\'s seat, bent with the roof and freed with the car',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
 assert.ok(main.includes("if(!attract&&!online?.active&&mode==='derby')car.root.add(rollCage(figure.position,Math.abs(Math.min(min.x,max.x))));}"));
 assert.ok(main.includes("if(cage&&d?.userData.seatBase){const drop=d.userData.seatBase.y-d.userData.seat.y;if(drop!==(cage.userData.drop??0)){cage.userData.drop=drop;bendCage(cage,d.userData.seatBase,drop);}}"));
 assert.ok(vehicle.includes("{const cage=this.root.children.find(o=>o.name==='roll_cage');if(cage)disposeRollCage(cage);}"));
});
