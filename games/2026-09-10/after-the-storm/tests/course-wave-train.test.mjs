import test from 'node:test';import assert from 'node:assert/strict';
import {courseWaveTrain,setCourseWaveTrain,waveTrainHeight} from '../course-wave-train.js';
import {getCourse} from '../courses.js';import {createRace,stepRace} from '../race-core.js';
import {barrierPiles} from '../course-barriers.js';import {createState} from '../simulation.js';
import {displacedSurface,sampleSwell} from '../wave-model.js';import {createHydro,stepHydro} from '../hydrodynamics.js';
test('Sunset has three localized ordered crests after its jump on every class',()=>{
 for(let d=0;d<4;d++){const c=getCourse('amber',d),train=c.waveTrain;setCourseWaveTrain(train);try{
  const [x,z,spacing]=train,ramp=c.ramps[0];assert.ok(z>ramp.z+ramp.length/2);assert.ok(z+spacing*2<c.crossbars[1].z);
  let peaks=0,previous=waveTrainHeight(x,z-10,0),rising=false;
  for(let p=z-9.9;p<z+spacing*2+10;p+=.1){const y=waveTrainHeight(x,p,0);if(rising&&y<previous&&previous>.5)peaks++;rising=y>previous;previous=y;}assert.equal(peaks,3);
  for(let i=0;i<3;i++)assert.ok(waveTrainHeight(x,z+spacing*i,0)>.89);
  assert.equal(waveTrainHeight(x+29,z,0),0);assert.ok(Math.abs(waveTrainHeight(x,z-30,0))<1e-8);
 }finally{setCourseWaveTrain();}}
});
test('forward mesh displacement and inverted buoyancy queries include the same rollers',()=>{
 setCourseWaveTrain(getCourse('amber').waveTrain);try{for(const t of [0,7,31])for(const z of [-43,-39,-25,-11,0]){const p=displacedSurface(-86.25,z,t,.22);assert.ok(Math.abs(p.y-sampleSwell(p.x,p.z,t,.22))<.025);}}finally{setCourseWaveTrain();}
});
test('three rollers produce hull airtime and loaded landings; forward lean reduces impact load',()=>{
 const train=getCourse('amber').waveTrain;setCourseWaveTrain(train);try{
  function traverse(lean){const h=createHydro(),r={x:train[0],z:train[1]-20,heading:0,speed:15,vx:0,vz:15,turn:0};let load=0,air=0;
   for(let i=0;i<300;i++){r.z+=15/60;stepHydro(h,r,i/60,1/60,waveTrainHeight,{lean,dampen:true});load=Math.max(load,h.load);air+=h.airborne;}return {load,air,landings:h.landingId};}
  const neutral=traverse(0),forward=traverse(1);assert.ok(neutral.landings>=2);assert.ok(neutral.air>60);assert.ok(neutral.load>3);assert.ok(forward.load<neutral.load);assert.ok(forward.air<=neutral.air);
 }finally{setCourseWaveTrain();}
});
test('switching courses and returning to salvage clear the local wave train',()=>{
 createRace({course:getCourse('amber')});assert.ok(courseWaveTrain.value[3]>0);createRace({course:getCourse('reed')});assert.equal(waveTrainHeight(-86.25,-39,0),0);
 createRace({course:getCourse('amber')});createState();assert.deepEqual([...courseWaveTrain.value],[0,0,0,0]);
});

test('a hull overlapping a pier support separates and can power away',()=>{
 const c=getCourse('amber'),s=createRace({mode:'time',course:c}),r=s.racers[0],p=barrierPiles(c.crossbars[1])[6];s.phase='running';r.x=p.x;r.z=p.z-.9;r.heading=Math.PI;
 stepRace(s,{throttle:1},1/60);assert.ok(Math.hypot(r.x-p.x,r.z-p.z)>=p.radius+.85);assert.ok(r.collision>0);
 for(let i=0;i<240;i++)stepRace(s,{throttle:1},1/60);assert.ok(Math.hypot(r.x-p.x,r.z-p.z)>5);
 setCourseWaveTrain();
});
