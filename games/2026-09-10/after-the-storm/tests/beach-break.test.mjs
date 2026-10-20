import test from 'node:test';import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {makeBeachBreak,scanShoreTile,beachBreakShaders,boreFront,boreTime,runup,NO_BEACH,createBeachWaterHistory,recordBeachWater} from '../beach-break.js';
import {createRace,stepRace,aiInput,raceWeather} from '../race-core.js';
import {getCourse} from '../courses.js';
import {waterLevel} from '../simulation.js';
import {captureRaceWater,setRaceWater} from '../race-water.js';
import {createNativeWaterSurface,nativeWaterSurfaceGLSL} from '../native-water-surface.js';
import {createNativeWaterField} from '../native-water-field.js';

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
 // Venue water is the original swell (amplitude 20 here): it breaks about every
 // three seconds; Big surf breaks far more often.
 assert.ok(calm.b.stats.emitted>=10&&surf.b.stats.emitted>2*calm.b.stats.emitted,`${calm.b.stats.emitted} ${surf.b.stats.emitted}`);
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
 for(const sea of ['course','surf']){const a=ride('greyhaven',sea,12,'high',true),b=ride('greyhaven',sea,12,'high',false);
 assert.deepEqual(a.s.racers.map(r=>[r.x,r.z,r.vx,r.vz,r.lap,r.misses]),b.s.racers.map(r=>[r.x,r.z,r.vx,r.vz,r.lap,r.misses]));
 if(sea==='course'){assert.deepEqual(captureRaceWater(a.s.raceWater),captureRaceWater(b.s.raceWater));assert.deepEqual(a.s.raceWater.field.velocityQ,b.s.raceWater.field.velocityQ);assert.equal(a.s.raceWater.field.phaseCounter,b.s.raceWater.field.phaseCounter);}}
});

test('generated beach shaders never juxtapose a sign with a negative constant',()=>{
 for(const source of Object.values(beachBreakShaders))assert.equal(source.match(/--\d|\+\+\d|[-+*\/]\s*-\d/),null);
});

test('native crest learning uses consecutive observed revisions and never invents past samples',()=>{
 const h=createBeachWaterHistory();recordBeachWater(h,0,0,0);recordBeachWater(h,.05,.3,1);recordBeachWater(h,.1,0,2);
 assert.equal(h.samples.length,3);assert.ok(Math.abs(h.mean-.1)<1e-12);assert.ok(Math.abs(h.pending.crest-.2)<1e-12);assert.equal(h.pending.time,.05);
 const paused=structuredClone(h);recordBeachWater(h,.1,10,3);assert.deepEqual(h,paused,'the same physical time cannot supply another crest sample');
 recordBeachWater(h,.2,10,2);assert.deepEqual(h,paused,'a held field revision cannot manufacture time history');
 const gap=createBeachWaterHistory();recordBeachWater(gap,0,0,0);recordBeachWater(gap,.05,.3,1);recordBeachWater(gap,.15,0,3);
 assert.equal(gap.pending,null,'unobserved intermediate source revisions cannot establish a local peak');
});

test('native history is bounded and a rewind discards old crest evidence',()=>{
 const h=createBeachWaterHistory();for(let i=0;i<=500;i++)recordBeachWater(h,i*.05,.12,i);
 assert.ok(h.samples.length<=241);assert.ok(h.samples[0][0]>=13);assert.equal(h.pending,null,'a static field has no crest');
 recordBeachWater(h,2,.8,4);assert.equal(h.samples.length,1);assert.equal(h.mean,.8);assert.equal(h.pending,null);
 recordBeachWater(h,2.05,.1,3);assert.equal(h.samples.length,1);assert.equal(h.mean,.1);assert.equal(h.pending,null,'a revision reset also clears the history');
});

test('paused or static native presentation snapshots do not emit breakers or advance their source',()=>{
 const s=createRace({course:getCourse('greyhaven'),seaState:'course'}),dto=captureRaceWater(s.raceWater),before=structuredClone(dto),field=structuredClone(s.raceWater.field);
 const b=makeBeachBreak(new T.Scene(),{mat:{uniforms:{}}});b.reset(s.course);setRaceWater(dto);
 try{
  const camera={x:0,y:1,z:0};for(let i=0;i<1200;i++)b.update(i/60,0,camera);
  const emitted=b.stats.emitted;for(let i=0;i<60;i++)b.update(1199/60,0,camera);
  assert.equal(emitted,0);assert.equal(b.stats.emitted,0);assert.equal(b.stats.active,0);
  b.update(1,0,camera);b.update(1.05,0,camera);assert.equal(b.stats.emitted,0);
  assert.deepEqual(dto,before);assert.deepEqual(s.raceWater.field,field);
 }finally{setRaceWater(null);}
});

test('curl and whitewater share the ocean native height uniforms with an explicit inactive fallback',()=>{
 const native=createNativeWaterSurface();native.sync(createNativeWaterField({datumNative:-150}));native.setEnabled(true);
 const uniforms={...native.uniforms},b=makeBeachBreak(new T.Scene(),{mat:{uniforms}}, {count:1});
 for(const material of [b.ribbons[0].curl.material,b.ribbons[0].carpet.material]){
  for(const name of ['nativeWaterActive','nativeWaterHeights','nativeWaterScale','nativeWaterInverseScale','nativeWaterDatumNative'])assert.equal(material.uniforms[name],uniforms[name]);
  // The actual program is compiled in the browser; shared sampling must not
  // depend on whether the helper uses early returns or an initialized result.
  assert.ok(material.vertexShader.includes(nativeWaterSurfaceGLSL));
  assert.ok(material.vertexShader.includes('beachWaterHeight('));
 }
 const fallback=makeBeachBreak(new T.Scene(),{mat:{uniforms:{}}},{count:1});
 assert.equal(fallback.ribbons[0].uniforms.nativeWaterActive.value,0);assert.equal(fallback.ribbons[0].uniforms.nativeWaterHeights.value,null);
 assert.equal(fallback.ribbons[0].uniforms.nativeWaterScale.value,.025);assert.equal(fallback.ribbons[0].uniforms.nativeWaterInverseScale.value,40);
 native.dispose();
});
