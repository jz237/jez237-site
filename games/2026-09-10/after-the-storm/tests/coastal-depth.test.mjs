import test from 'node:test';
import assert from 'node:assert/strict';
import {coastalDepth,coastalBed,coastalHeight,depthLimitedHeight,setCoastalDepth} from '../coastal-depth.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {wave,waterLevel,createState} from '../simulation.js';
import {activeRaceWaterHeight} from '../race-water.js';

test('shallow troughs retain water, deep water and crests stay exact, and the transition is smooth',()=>{
 for(const level of [0,-2.5,-3.75])for(const depth of [.05,.5,1.25,8,30]){
  const bed=level-depth;
  for(let h=-12;h<=5;h+=.13){const result=depthLimitedHeight(level+h,bed,level);assert.ok(result>=level-.8*depth-1e-12);if(h>=-.4*depth)assert.equal(result,level+h);}
  const at=level-.4*depth,e=1e-6;
  assert.ok(Math.abs((depthLimitedHeight(at+e,bed,level)-depthLimitedHeight(at-e,bed,level))/(2*e)-1)<1e-4);
 }
});

test('depth envelope covers the rendered triangles at finite shelf edges without changing terrain',()=>{
 const ground=(x,z)=>x<0&&z<12?-1.25:-8,course={ground};setCoastalDepth(course);
 for(let x=-12;x<=12;x+=.19)for(let z=-10;z<=20;z+=.31){
  if(x<0&&z<12)assert.ok(coastalBed(x,z)>=-1.25001);
  assert.ok(coastalHeight(x,z,-10,0)>coastalBed(x,z));
 }
 assert.equal(ground(-2,0),-1.25);assert.equal(ground(2,0),-8);
 const version=coastalDepth.version;setCoastalDepth(course);assert.equal(coastalDepth.version,version);
 setCoastalDepth();assert.equal(coastalHeight(0,0,-10,0),-10);
});

test('reported Sunny Beach custom surf shelves remain wet across wave cycles',()=>{
 const course=getCourse('greyhaven');createRace({mode:'time',course,seaState:'surf',waveSeed:17});
 let sampled=0,min=Infinity;
 for(let t=0;t<90;t+=2.7)for(let x=130;x<190;x+=2.5)for(let z=-45;z<35;z+=2.5){
  const bed=course.ground(x,z);if(bed<-.5&&bed>=-1.25){const h=wave(x,z,t,.2);min=Math.min(min,h-bed);sampled++;assert.ok(h>bed,JSON.stringify({x,z,t,bed,h}));}
 }
 assert.ok(sampled>10000);assert.ok(min>0);
});

test('switching to original venue water and salvage clears custom depth treatment',()=>{
 const course=getCourse('greyhaven'),custom=createRace({mode:'time',course,seaState:'storm'});
 assert.equal(coastalDepth.active,true);
 const venue=createRace({mode:'time',course,seaState:'course'});assert.equal(coastalDepth.active,false);
 assert.equal(wave(100,20,0,1),activeRaceWaterHeight(100,20));
 stepRace(custom,{},1/60);assert.equal(coastalDepth.active,true);
 stepRace(venue,{},1/60);assert.equal(coastalDepth.active,false);
 createState();assert.equal(coastalDepth.active,false);assert.equal(waterLevel.value,0);
});
