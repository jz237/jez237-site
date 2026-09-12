import test from 'node:test';import assert from 'node:assert/strict';
import {createRace,stepRace,aiInput} from '../race-core.js';import {COURSES,getCourse} from '../courses.js';import {createStunt,stepStunt,applyRamp} from '../stunts.js';import {createHydro,stepHydro} from '../hydrodynamics.js';import {verificationInput} from '../race-verification.js';
test('ramp trim trades a lower shorter jump against a higher longer jump',()=>{
 const peaks=[1,0,-1].map(lean=>{const r=createRace().racers[0];r.x=0;r.z=4.9;r.vx=0;r.vz=r.speed=15;applyRamp(r,[{x:0,z:0,tx:0,tz:1,width:7,length:10,height:2.3}],0,4.6,lean);return r.hydro.y+r.hydro.vy**2/(2*9.81);});
 assert.ok(peaks[0]<peaks[1]&&peaks[1]<peaks[2]);assert.ok(peaks[2]-peaks[0]>.5);
});
test('all nine venues complete four timed stunt checkpoints through real helm input',()=>{for(const base of COURSES){const race=createRace({mode:'stunt',course:getCourse(base.id)});for(let i=0;i<12000&&race.phase!=='results';i++)stepRace(race,aiInput(race,race.racers[0]),1/60);assert.equal(race.result.dq,'',base.id);assert.equal(race.racers[0].stunt.nextCheckpoint,4);assert.ok(race.racers[0].stunt.score>0);}});
test('a complete stunt routine performs real air rotations and rider poses',()=>{const race=createRace({mode:'stunt',course:getCourse('practice')});for(let i=0;i<12000&&race.phase!=='results';i++)stepRace(race,verificationInput(race,race.racers[0]),1/60);assert.equal(race.result.dq,'');assert.equal(race.racers[0].stunt.nextCheckpoint,4);assert.ok(race.racers[0].stunt.tricks>=2,JSON.stringify(race.racers[0].stunt));});
test('ring chains award 50 then 100, and a missed ring resets the chain',()=>{const r=createRace().racers[0],s=createStunt();r.hydro.y=.15;const course={rings:[{x:0,z:0,y:1,tx:0,tz:1,radius:2},{x:0,z:10,y:1,tx:0,tz:1,radius:2},{x:0,z:20,y:1,tx:0,tz:1,radius:2}],checkpoints:[]};for(const z of [0,10]){r.x=0;r.z=z+1;stepStunt(s,r,course,{},.016,0,z-1,.15);}assert.equal(s.score,150);assert.equal(s.chain,2);r.x=8;r.z=21;stepStunt(s,r,course,{},.016,8,19,.15);assert.equal(s.chain,0);assert.equal(s.rings,2);});
test('checkpoint timer requires the gate; timeout cannot be undone by crossing late',()=>{const s=createStunt(),r=createRace().racers[0],course={rings:[],checkpoints:[{x:0,z:0,tx:0,tz:1,width:10}]};r.x=20;r.z=1;stepStunt(s,r,course,{},.016,20,-1,0);assert.equal(s.nextCheckpoint,0);s.remaining=.005;r.x=0;r.z=1;stepStunt(s,r,course,{},.016,0,-1,0);assert.equal(s.nextCheckpoint,0);assert.match(r.dq,/time expired/);});
test('a ramp gives lift from forward speed and a dive must begin during descent',()=>{const r=createRace().racers[0];r.x=0;r.z=0;r.vx=0;r.vz=15;r.speed=15;applyRamp(r,[{x:0,z:0,tx:0,tz:1,width:7,length:10,height:2.3}],0,-1);assert.ok(r.hydro.vy>3&&r.hydro.y>1);const h=createHydro(),craft={...r,turn:0,heading:0};stepHydro(h,craft,0,1/60,()=>0,{dive:true});assert.equal(h.diveRemaining,0);h.y=2;h.vy=-2;h.airborne=true;stepHydro(h,craft,1,1/60,()=>0,{dive:true});assert.ok(h.diveRemaining>1);let deepest=0;for(let i=0;i<200;i++){stepHydro(h,craft,1+i/60,1/60,()=>0,{dive:false});deepest=Math.min(deepest,h.y);}assert.ok(deepest<-.45);assert.ok(h.y>-.1);});

test('a fixed race ramp blocks a backward approach without granting lift, but allows an airborne clearance',()=>{
 const ramp={x:0,z:0,tx:0,tz:1,width:12,length:17,height:2.1,solidBack:true};
 function approach(y,x=0){const r=createRace().racers[0];r.x=x;r.z=8.9;r.vx=0;r.vz=-18;r.speed=18;r.hydro.y=y;r.hydro.vy=-.2;applyRamp(r,[ramp],x,9.4);return r;}
 const hit=approach(0);assert.ok(hit.z>=9.15);assert.ok(hit.speed<5);assert.equal(hit.collision,1);assert.equal(hit.hydro.y,0);assert.equal(hit.hydro.vy,-.2);assert.equal(hit.hydro.onRamp,false);
 const flying=approach(4);assert.equal(flying.z,8.9);assert.equal(flying.vz,-18);assert.equal(flying.collision,0);
 const bypass=approach(0,8);assert.equal(bypass.z,8.9);assert.equal(bypass.vz,-18);assert.equal(bypass.collision,0);
});


test('authored stunt allowances apply at creation and reset to the next section without carryover',()=>{
 const course={rings:[],checkpoints:[20,15,11,9].map((limit,i)=>({x:0,z:i*10,tx:0,tz:1,width:10,limit}))};
 const s=createStunt(course),r=createRace().racers[0];
 assert.equal(s.remaining,20);s.remaining=2.016;r.x=0;r.z=1;
 stepStunt(s,r,course,{},.016,0,-1,0);
 assert.equal(s.nextCheckpoint,1);assert.equal(s.remaining,15);assert.equal(s.score,100);
 r.z=11;stepStunt(s,r,course,{},.016,0,9,0);
 assert.equal(s.remaining,11);assert.equal(s.nextCheckpoint,2);
 assert.equal(createStunt().remaining,38);
 const city=createRace({mode:'stunt',course:getCourse('neon')});
 assert.equal(city.racers[0].stunt.remaining,48);
 assert.deepEqual(city.course.checkpoints.map(c=>c.limit),[48,27,27,35]);
});
