import test from 'node:test';
import assert from 'node:assert/strict';
import {KoiSchool} from '../src/KoiMotion.js';
import {inside,bottom} from '../src/PondGeometry.js';
import {PondChemistry,ammoniaFraction,oxygenSaturation} from '../src/PondChemistry.js';

test('koi explore height and depth, stay upright, and remain inside the pond',()=>{
 const school=new KoiSchool(2917),ranges=school.fish.map(()=>({y:[Infinity,-Infinity],z:[Infinity,-Infinity],speed:[Infinity,-Infinity]}));
 for(let n=0;n<7200;n++){
  school.update(1/60);
  school.fish.forEach((f,i)=>{
   assert.ok(f.position.toArray().every(Number.isFinite));
   assert.ok(inside(f.position.x,f.position.z,.45));
   assert.ok(f.position.y>=bottom(f.position.x,f.position.z)+.14,'body must clear the sloping floor');
   assert.ok(f.position.y<=-.08,'unfed koi stay under the surface');
   assert.ok(Math.abs(f.pitch)<=.131,'turns stay upright');
   for(const [key,value]of [['y',f.position.y],['z',f.position.z],['speed',f.velocity.length()]]){ranges[i][key][0]=Math.min(ranges[i][key][0],value);ranges[i][key][1]=Math.max(ranges[i][key][1],value);}
  });
 }
 for(const r of ranges){assert.ok(r.y[1]-r.y[0]>.25,'each koi changes depth');assert.ok(r.z[1]-r.z[0]>1,'each koi explores front to back');assert.ok(r.speed[1]-r.speed[0]>.15,'bursts and glides vary speed');}
 assert.equal(new Set(school.fish.map(f=>f.phase.toFixed(2))).size,7,'fish do not share identical phases');
});

test('pause freezes motion, physiology and existing food',()=>{
 const school=new KoiSchool(31);school.feed();school.update(.016);const before=JSON.stringify(school.snapshot());
 for(let n=0;n<30;n++)school.update(0);
 assert.equal(JSON.stringify(school.snapshot()),before);
});

test('food is consumed at an actual mouth position, and satiated fish stop eating',()=>{
 const school=new KoiSchool(7);school.feed();let consumed=0;
 for(let n=0;n<2400;n++){
  const previous=school.food.slice();school.update(1/60);
  for(const food of previous.filter(f=>!f.alive&&f.age<42)){
   assert.ok(school.fish.some(f=>school.mouth(f).distanceTo(food.position)<.09),'no remote pellet disappearance');consumed++;
  }
 }
 assert.ok(consumed>=10,'multiple fish find and eat food');assert.equal(school.bites,consumed);
 const satiated=new KoiSchool(9);satiated.fish.forEach(f=>f.hunger=0);satiated.feed();
 for(let n=0;n<600;n++)satiated.update(1/60);
 assert.equal(satiated.bites,0);
});

test('ammonia speciation responds to both pH and temperature',()=>{
 assert.ok(ammoniaFraction(25,8)>ammoniaFraction(25,7)*8);
 assert.ok(ammoniaFraction(30,8)>ammoniaFraction(15,8));
 assert.ok(Math.abs(ammoniaFraction(25,8)-.0537)<.001);
 assert.ok(oxygenSaturation(30)<oxygenSaturation(15));
});

test('nitrogen conversions conserve mass after modeled input and plant uptake',()=>{
 const lab=new PondChemistry(),total=s=>s.ammonia+s.nitrite+s.nitrate+s.organic;
 const before=total(lab.state);lab.advance(1);
 assert.ok(Math.abs(total(lab.state)-(before+.0025-.003))<1e-10);
 assert.ok(lab.state.alkalinity<110,'nitrification consumes alkalinity');
});

test('filter and aeration comparisons produce meaningful teaching outcomes',()=>{
 const working=new PondChemistry(),failed=new PondChemistry();failed.filter=false;
 working.feed();failed.feed();working.advance(24);failed.advance(24);
 assert.ok(failed.state.ammonia>working.state.ammonia*5);
 const air=new PondChemistry(),still=new PondChemistry();air.state.temperature=still.state.temperature=30;still.aeration=false;air.advance(24);still.advance(24);
 assert.ok(still.state.oxygen<5);assert.ok(air.state.oxygen>5);
});

test('water changes dilute waste and long scenarios remain finite and nonnegative',()=>{
 const lab=new PondChemistry();lab.filter=false;lab.feed();lab.advance(24);const before={...lab.state};lab.waterChange();
 for(const key of ['ammonia','nitrite','nitrate','organic'])assert.ok(Math.abs(lab.state[key]-before[key]*.75)<1e-10);
 lab.state.temperature=32;lab.aeration=false;lab.filter=true;lab.advance(720);
 for(const value of Object.values(lab.state)){assert.ok(Number.isFinite(value));assert.ok(value>=0);}
 lab.reset();assert.equal(lab.hours,0);assert.equal(lab.state.oxygen,8);assert.equal(lab.history.length,1);
});

import {createSpine,updateSpine,SPINE_LENGTH,HEAD_PIN,sampleSpine} from '../src/KoiSpine.js';
test('strong body waves retain spine length, pin the head, and travel into the tail',()=>{
 const points=createSpine(),tail=[],mid=[];
 for(let n=0;n<120;n++){
  updateSpine(points,n/120*Math.PI*2,.9,.2);
  assert.deepEqual(points[0].toArray(),[HEAD_PIN,0,0]);
  let length=0;for(let j=1;j<points.length;j++)length+=Math.hypot(points[j].x-points[j-1].x,points[j].y-points[j-1].y);
  assert.ok(Math.abs(length-SPINE_LENGTH)<1e-10,'flex does not stretch the spine');
  tail.push(points.at(-1).y);mid.push(sampleSpine(points,-.08).y);
 }
 assert.ok(Math.max(...tail)-Math.min(...tail)>.16,'tail sweeps visibly');
 assert.ok(Math.max(...mid)-Math.min(...mid)>.035,'flex reaches the body, not only the tail');
 assert.ok(Math.max(...mid)-Math.min(...mid)<Math.max(...tail)-Math.min(...tail),'wave amplitude grows toward the tail');
 const midPeak=mid.indexOf(Math.max(...mid)),tailPeak=tail.indexOf(Math.max(...tail));
 assert.ok(Math.abs(midPeak-tailPeak)>8,'the wave travels instead of bending as a rigid paddle');
});
