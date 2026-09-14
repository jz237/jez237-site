import test from 'node:test';import assert from 'node:assert/strict';
import {rampDraw,rampChoiceInput,RAMP_USE_PROBABILITY} from '../ramp-choice.js';
import {characterAt,setWaterCharacter} from '../water-character.js';
import {sampleSwell,displacedSurface} from '../wave-model.js';
import {createHydro,stepHydro} from '../hydrodynamics.js';
import {riderMotion} from '../rider-motion.js';
import {contactHandling} from '../handling.js';
import {engineMix} from '../sample-sound.js';
import {sprayLaunch} from '../hull-spray.js';
import {retainedPool,shoreSites} from '../shoreline-life.js';
import {getCourse} from '../courses.js';
import {createDemoScene,demoInput,demoSceneDone} from '../demo-driver.js';
import {stepRace} from '../race-core.js';
import {makeCurlingBreakers} from '../curling-breakers.js';
import {brokenSurfHeight} from '../surf-waves.js';
import * as T from '../vendor/three.module.js';

test('ramp decisions are reproducible and choose 60 percent across independent opportunities',()=>{
 let use=0,total=0;for(let seed=0;seed<200;seed++)for(let id=0;id<4;id++)for(let lap=1;lap<=3;lap++){use+=rampDraw(seed,id,lap,100)<RAMP_USE_PROBABILITY;total++;}
 assert.ok(Math.abs(use/total-.60)<.025,`${use}/${total}`);assert.equal(rampDraw(17,2,3,121),rampDraw(17,2,3,121));
});
function rampFixture(seed){const g={x:0,z:70,tx:0,tz:1,side:0,width:40},r={id:0,lap:1,next:0,x:0,z:-35,heading:0,vx:0,vz:18,speed:18,out:0,hydro:{}};return {r,s:{mode:'race',time:1,waveSeed:seed,course:{ground:()=>-5,gates:[g,{...g,z:100}],ramps:[{id:100,x:0,z:0,tx:0,tz:1,width:10,length:14}]}}};}
test('chosen ramps commit, declined ramps route around the deck, without moving the racer',()=>{
 for(const use of [true,false]){let seed=0;while((rampDraw(seed,0,1,100)<.6)!==use)seed++;const {s,r}=rampFixture(seed),pose=[r.x,r.z,r.next];const c=rampChoiceInput(s,r,{});assert.equal(c.rampChoice,use?'jump':'bypass');assert.deepEqual([r.x,r.z,r.next],pose);const decision=JSON.stringify(r.rampChoices);for(let i=0;i<120;i++)rampChoiceInput(s,r,{});assert.equal(JSON.stringify(r.rampChoices),decision);assert.equal(r.rampPlan.use,use);assert.ok(use?Math.abs(r.rampPlan.entry.x)<1:Math.abs(r.rampPlan.entry.x)>8);}
});
test('unusable runups and reverse-side approaches do not create ramp opportunities',()=>{const {s,r}=rampFixture(1);s.course.ground=()=>2;assert.deepEqual(rampChoiceInput(s,r,{steer:.1}),{steer:.1});assert.equal(Object.keys(r.rampChoices).length,0);s.course.ground=()=>-5;r.heading=Math.PI;assert.deepEqual(rampChoiceInput(s,r,{}),{});});
test('coastal exposure shelters water and shallow shelves steepen surviving swell',()=>{
 setWaterCharacter({ground:(x,z)=>z<-20?5:-5});const shelter=characterAt(0,0)[0],open=characterAt(0,100)[0];assert.ok(shelter<open*.8);
 setWaterCharacter({ground:()=>-2});assert.ok(characterAt(0,0)[0]>1.1);
 for(let x=-40;x<=40;x+=8){const p=displacedSurface(x,10,3,.5);assert.ok(Math.abs(p.y-sampleSwell(p.x,p.z,3,.5))<.06);}
 setWaterCharacter(null);
});
test('rider anticipates a rising face before hull contact and braces without extra lift',()=>{
 const h=createHydro(),r={x:0,z:0,heading:0,vx:0,vz:20,speed:20,throttle:1};stepHydro(h,r,0,1/60,(x,z)=>z>3?1.5:0);assert.ok(h.anticipation>.5);
 const calm={},brace={};riderMotion(calm,0,0,{});riderMotion(brace,0,0,{});let a,b;for(let i=1;i<30;i++){a=riderMotion(calm,i/60,0,{});b=riderMotion(brace,i/60,0,{anticipation:h.anticipation});}assert.ok(b.compression>a.compression+.1);
});
test('stern grip releases gradually then catches; catch spray follows the loaded side',()=>{
 const r={heading:0,vx:6,vz:28,turn:1,throttle:1,hydro:{wet:1,portWet:1,starboardWet:1,y:0,vy:0,waterVelocity:0,impact:0}};
 let grip;for(let i=0;i<90;i++)grip=contactHandling(r,{},1/60);assert.ok(r.sternSlip>.5&&grip.grip<1);r.turn=0;contactHandling(r,{},1/60);assert.ok(r.gripCatch>0);const outward=sprayLaunch(r,'chine',1,()=>.5),inward=sprayLaunch(r,'chine',-1,()=>.5);assert.ok(outward.vx-r.vx*.48>-(inward.vx-r.vx*.48));
});
test('unloaded engine flares with throttle, then drops as intake catches and creates a jet surge',()=>{
 const wet=engineMix(12,1,1),dry=engineMix(12,0,1);assert.ok(dry.fastRate>wet.fastRate+.3);assert.ok(dry.cutoff>wet.cutoff);assert.equal(dry.water,0);assert.equal(engineMix(0,0,0).fastRate,engineMix(0,1,0).fastRate);
 const r={heading:0,x:0,z:0,vx:0,vz:20,throttle:1,hydro:{y:0,vy:0,wet:1,waterVelocity:0}},a=sprayLaunch(r,'jet',1,()=>.5);r.hydro.reengagement=1;assert.ok(sprayLaunch(r,'jet',1,()=>.5).vz<a.vz-5);
});
test('shoreline sites stay on real banks and basins retain water after a retreat',()=>{
 const c=getCourse('greyhaven'),sites=shoreSites(c);assert.ok(sites.length>0);assert.ok(sites.every(p=>p.y>.05&&p.y<1.7));let depth=retainedPool(0,1,.4,1/60);assert.ok(depth>.18);for(let i=0;i<600;i++)depth=retainedPool(depth,-1,.4,1/60);assert.ok(depth>.15);for(let i=0;i<6000;i++)depth=retainedPool(depth,-1,.4,1/60);assert.equal(depth,0);
});
test('a complete live race physically takes chosen ramps and clears declined ramps',()=>{
 const s=createDemoScene(),before=new Map();for(let i=0;i<9500&&!demoSceneDone(s);i++){stepRace(s,demoInput(s),1/60);for(const r of s.racers)if(r.rampChoices?.['1:210']&&!before.has(r.id))before.set(r.id,r.misses);}
 assert.ok(s.racers[0].lap>1);let jumps=0,bypasses=0;
 for(const r of s.racers){const decision=r.rampChoices['1:210'];assert.ok(decision);const hit=r.rampVisits?.some(p=>p.id===210&&p.lap===1);if(decision.use){jumps++;assert.ok(hit,`racer ${r.id} must actually reach the ramp`);}else{bypasses++;assert.ok(!hit,`racer ${r.id} must clear its declined ramp`);}assert.equal(r.misses,before.get(r.id),'ramp approach must not add a missed buoy');assert.equal(r.dq,'');}
 assert.equal(s.racers[0].misses,0);assert.ok(jumps>0&&bypasses>0);
});
test('offshore steep crests produce moving curled geometry and leave rough shared water',()=>{
 createDemoScene();const fx=makeCurlingBreakers(new T.Scene());fx.reset({ground:()=>-10});let offshore=0,turbulence=0;
 for(let i=0;i<400;i++){fx.update(i*.1,.3,{x:0,z:0},'high');offshore=Math.max(offshore,fx.stats.offshore||0);turbulence=Math.max(turbulence,Math.abs(brokenSurfHeight(-20,15,i*.1)));}
 assert.ok(offshore>0,'deep water must sometimes break');assert.ok(turbulence>.02,'the broken set must leave physical chop');fx.dispose();setWaterCharacter(null);
});
