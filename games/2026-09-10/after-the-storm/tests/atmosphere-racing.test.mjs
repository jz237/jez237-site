import test from 'node:test';import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {frontEnabled,frontAt,frontWave} from '../weather-front.js';
import {gustAt,gustHeight} from '../wind-gusts.js';
import {readWaveLanes,wavePilotInput} from '../wave-pilot.js';
import {landingResponse,landingPlume} from '../landing-response.js';
import {sprayLaunch} from '../hull-spray.js';
import {sheetPoint,makeSpraySheets} from '../spray-sheets.js';
import {riderMotion} from '../rider-motion.js';import {riderPose} from '../rider-pose.js';
import {createRace} from '../race-core.js';import {createState} from '../simulation.js';

test('a continuous front reaches different coast positions at different times and brings wind and physical chop',()=>{
 frontEnabled.value=1;assert.equal(frontAt(0,0,0),0);assert.ok(frontAt(250,0,140)>frontAt(-250,0,140)+.7);assert.ok(frontAt(0,0,270)>.99);
 for(let t=0;t<300;t+=.1)assert.ok(Math.abs(frontAt(0,0,t+.1)-frontAt(0,0,t))<.004);
 const wet=gustAt(0,0,270,.3),height=gustHeight(13,22,270,.3),extra=frontWave(13,22,270);frontEnabled.value=0;
 assert.ok(wet.speed>gustAt(0,0,270,.3).speed+6);assert.ok(Math.abs(height-gustHeight(13,22,270,.3)-extra)<1e-9);
});
test('venue conditions and returning to salvage disable the extra travelling front',()=>{createRace({seaState:'surf'});assert.equal(frontEnabled.value,1);createRace({seaState:'course'});assert.equal(frontEnabled.value,0);createRace({seaState:'storm'});assert.equal(frontEnabled.value,1);createState();assert.equal(frontEnabled.value,0);});
test('wave readers select smoother nearby water using future surface samples',()=>{
 const r={id:1,x:0,z:0,speed:24,heading:0};const surface=(x,z,t)=>Math.exp(-x*x/3)*Math.sin(z*.32-t)*1.6;
 const q=readWaveLanes(r,0,surface,()=>true);assert.ok(Math.abs(q.offset)>2);assert.ok(q.roughness<.1);assert.equal(q.launch,false);
 const launch=readWaveLanes({...r,id:0},0,surface,()=>true);assert.equal(launch.launch,true);
 const blocked=readWaveLanes(r,0,surface,(x)=>Math.abs(x)<1);assert.equal(blocked.offset,0);
});
test('wave reading cannot override a ramp, checkpoint approach, or airborne control',()=>{
 const s=createRace({seaState:'surf'}),r=s.racers[0],base={steer:.1,throttle:.8};r.speed=25;r.rampPlan={use:true};assert.strictEqual(wavePilotInput(s,r,base,()=>0),base);r.rampPlan=null;r.hydro.airborne=true;assert.strictEqual(wavePilotInput(s,r,base,()=>0),base);frontEnabled.value=0;
});
test('bow-first spray goes forward, stern-first spray goes aft, and side entries displace a wider fan',()=>{
 const r={x:0,z:0,vx:0,vz:20,heading:0,throttle:1,hydro:{y:0,wet:1,impact:9,vy:0,waterVelocity:0,entry:{style:'bow-first'}}};
 const bow=sprayLaunch(r,'impact',1,()=>.5);r.hydro.entry.style='stern-first';const stern=sprayLaunch(r,'impact',1,()=>.5);assert.ok(bow.vz>stern.vz+8);
 r.hydro.entry.style='sideways';const side=sprayLaunch(r,'impact',1,()=>.5);assert.ok(side.vx>bow.vx+2);assert.ok(side.vy<bow.vy);
 const clean=landingResponse({...r.hydro,pitch:0,roll:0},r),bad=landingResponse({...r.hydro,pitch:.5,roll:.6},r);assert.equal(clean.loss,0);assert.ok(bad.loss>.1);assert.equal(landingPlume({...r.hydro,entry:{style:'level'}}).carry,.6);
});
test('turning water sheets inherit world velocity, broaden with age and reset safely for replay',()=>{
 const q={x:0,y:1,z:0,vx:10,vy:4,vz:15,rx:1,rz:0,fan:6};const a=sheetPoint(q,.1,.5),b=sheetPoint(q,.4,.5);assert.ok(b[0]>a[0]+2);assert.ok(b[2]>a[2]+4);assert.ok(sheetPoint(q,.4,1)[0]-sheetPoint(q,.4,0)[0]>2);
 const sheet=makeSpraySheets(new T.Scene()),r={x:0,z:0,speed:20,vx:0,vz:20,heading:0,turn:1,throttle:1,hydro:{y:0,vy:0,wet:1,starboardWet:1,portWet:1,waterVelocity:0}};
 for(let i=0;i<30;i++){r.z=i*.5;sheet.update(r,i/30,.2);}assert.ok(sheet.mesh.visible);const positions=sheet.mesh.geometry.attributes.position.array.slice();sheet.update(r,29/30,.2);assert.deepEqual(sheet.mesh.geometry.attributes.position.array,positions);sheet.update(r,0,.2);assert.ok(sheet.mesh.visible);assert.ok(sheet.mesh.geometry.attributes.position.array.every(Number.isFinite));sheet.dispose();
});
test('head and shoulder reactions remain smooth while hands and boots keep their anchors',()=>{
 const m={};riderMotion(m,0,.8,{speed:25});let motion;for(let i=1;i<=60;i++)motion=riderMotion(m,i/60,.8,{speed:25,pitchVelocity:1,rollVelocity:1,waveLook:2.6});
 assert.ok(motion.cornerLean>.03);assert.ok(motion.headPitch<-.04);assert.ok(motion.headLook>.15);assert.ok(motion.shoulderLag<-.02);
 const ordinary=riderPose('',1,.8,{speed:25,steering:motion.steering}),active=riderPose('',1,.8,motion);for(const side of ['L','R']){assert.deepEqual(active.targets['hand'+side],ordinary.targets['hand'+side]);assert.deepEqual(active.targets['foot'+side],ordinary.targets['foot'+side]);}assert.ok(active.headYaw>ordinary.headYaw+.1);
});
