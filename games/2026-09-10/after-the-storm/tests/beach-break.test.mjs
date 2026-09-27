import test from 'node:test';import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {makeBeachBreak,scanShoreTile,beachBreakShaders,boreFront,boreTime,runup,NO_BEACH} from '../beach-break.js';
import {createRace,stepRace,aiInput,raceWeather} from '../race-core.js';
import {getCourse} from '../courses.js';
import {waterLevel} from '../simulation.js';

const ride=(venue,seaState,seconds,quality='high',beach=true)=>{
 const s=createRace({course:getCourse(venue),seaState}),r=s.racers[0],b=beach?makeBeachBreak(new T.Scene(),{mat:{uniforms:{}}}):null,heights=[];let peak=0;
 b?.reset(s.course);s.phase='running';
 for(let i=0;i<seconds*60;i++){stepRace(s,aiInput(s,r),1/60);if(b){b.update(s.time,raceWeather(s).storm,{x:r.x,y:1,z:r.z},quality,{x:Math.sin(r.heading),y:0,z:Math.cos(r.heading)});peak=Math.max(peak,b.stats.active);if(b.stats.emitted>heights.length)heights.push(b.stats.lastHeight);}}
 return {s,r,b,heights:heights.sort((x,y)=>x-y),peak};
};

test('waterline points face the land and carry a beach slope',()=>{
 const c=getCourse('greyhaven'),g=c.renderGround||c.ground;let points=[];
 for(let tz=-3;tz<3;tz++)for(let tx=-3;tx<3;tx++)points.push(...scanShoreTile(g,waterLevel.value,tx,tz,c.rocks||[]));
 assert.ok(points.length>40,`found ${points.length}`);
 for(const p of points){assert.ok(Math.abs(g(p.x,p.z)-waterLevel.value)<.25);assert.ok(g(p.x+p.nx*3,p.z+p.nz*3)>g(p.x-p.nx*3,p.z-p.nz*3));assert.ok(p.slope>=.02&&p.slope<=.5);}
});

test('whitewater bores run in and stop at the waterline, then swash up a bounded runup',()=>{
 for(const [up,slope,H] of [[20,.03,1],[5,.15,.6],[12,.06,2]]){
  const end=boreTime(up,slope,H);let last=Infinity;
  for(let t=0;t<=end;t+=end/20){const u=boreFront(up,slope,H,t);assert.ok(u<=last+1e-9);last=u;}
  assert.ok(Math.abs(boreFront(up,slope,H,0)-up)<1e-9&&boreFront(up,slope,H,end)<1e-6&&end>.5&&end<15);
  assert.ok(runup(H,slope)>=1.2&&runup(H,slope)<=12);
 }
});

test('exposed beaches break often, swell size sets breaker height, and walled venues stay calm',()=>{
 const calm=ride('greyhaven','course',40),surf=ride('greyhaven','surf',40),city=ride('neon','course',20);
 assert.ok(calm.b.stats.emitted>15&&surf.b.stats.emitted>15,`${calm.b.stats.emitted} ${surf.b.stats.emitted}`);
 const median=h=>h[h.length>>1];assert.ok(median(surf.heights)>median(calm.heights));
 assert.ok(surf.heights.every(h=>h>=.18&&h<=2.2));
 assert.ok(NO_BEACH.includes('city'));assert.equal(city.b.stats.emitted,0);
});

test('breakers sit on the waterline and quality bounds how many are active',()=>{
 const {b,peak}=ride('greyhaven','surf',30,'low');assert.ok(peak<=4&&peak>0);
 const g=getCourse('greyhaven').ground;let checked=0;
 for(const r of b.ribbons){if(!r.curl.visible)continue;const a=r.curl.geometry.attributes.colA.array,e=r.curl.geometry.attributes.colB.array;
  for(let c=0;c<=32;c++)if(e[c*4+3]>.2){checked++;assert.ok(Math.abs(g(a[c*4],a[c*4+1])-waterLevel.value)<.2);}}
 assert.ok(checked>10);
});

test('the beach break is visual only: racing is identical with or without it',()=>{
 const a=ride('greyhaven','surf',12,'high',true),b=ride('greyhaven','surf',12,'high',false);
 assert.deepEqual(a.s.racers.map(r=>[r.x,r.z,r.vx,r.vz,r.lap,r.misses]),b.s.racers.map(r=>[r.x,r.z,r.vx,r.vz,r.lap,r.misses]));
});

test('generated beach shaders never juxtapose a sign with a negative constant',()=>{
 for(const source of Object.values(beachBreakShaders))assert.equal(source.match(/--\d|\+\+\d|[-+*\/]\s*-\d/),null);
});
