import test from 'node:test';import assert from 'node:assert/strict';
import {createHydro,stepHydro} from '../hydrodynamics.js';
import {createRace,stepRace,aiInput,raceWeather} from '../race-core.js';
import {getCourse} from '../courses.js';
const craft={x:0,z:0,heading:0,vx:0,vz:0,speed:0,turn:0};
test('calm-water equilibrium floats without artificial vertical oscillation',()=>{const h=createHydro();for(let i=0;i<600;i++)stepHydro(h,craft,i/60,1/60,()=>0);assert.ok(Math.abs(h.y-.025)<.001);assert.ok(Math.abs(h.vy)<.001);assert.equal(h.airborne,false);assert.equal(h.landingId,0);});
test('unsupported hull falls under gravity then creates one measured landing',()=>{const h=createHydro();stepHydro(h,craft,0,1/60,()=>0);h.y=2;h.vy=0;stepHydro(h,craft,1/60,1/60,()=>0);assert.ok(Math.abs(h.vy+9.81/60)<1e-8);let peak=0;for(let i=2;i<200;i++){stepHydro(h,craft,i/60,1/60,()=>0);peak=Math.max(peak,h.impact);}assert.equal(h.landingId,1);assert.ok(peak>3);assert.ok(Math.abs(h.y-.025)<.03);});
test('rough-water race launches and lands on the shared wave surface',()=>{const s=createRace({course:getCourse('tempest'),seaState:'storm'});let airborne=0;for(let i=0;i<8000&&s.phase!=='results';i++){stepRace(s,aiInput(s,s.racers[0]),1/60);if(s.racers[0].hydro.airborne)airborne++;assert.ok(Number.isFinite(s.racers[0].hydro.y));}assert.ok(airborne>30);assert.ok(s.racers[0].hydro.landingId>2);});
test('custom sea conditions affect physics independently of venue progression',()=>{const s=createRace({course:getCourse('reed'),seaState:'storm'});assert.equal(raceWeather(s).storm,.95);s.seaState='calm';assert.equal(raceWeather(s).storm,0);s.seaState='course';assert.ok(raceWeather(s).storm<.1);});

function descent({speed=20,throttle=1}={}){const h=createHydro(),c={...craft,speed,vz:speed,throttle};stepHydro(h,c,0,1/60,()=>0);h.y=2;h.vy=-2;h.airborne=true;return {h,c};}

test('submarine entry requires a descending airborne hull, speed and held accelerator',()=>{
 for(const options of [{speed:16},{throttle:0}]){const {h,c}=descent(options);stepHydro(h,c,1/60,1/60,()=>0,{dive:true});assert.equal(h.diveRemaining,0);}
 const {h,c}=descent();h.vy=2;stepHydro(h,c,1/60,1/60,()=>0,{dive:true});assert.equal(h.diveRemaining,0);
 h.vy=-2;stepHydro(h,c,2/60,1/60,()=>0,{dive:true});assert.ok(h.diveRemaining>0);
});

test('holding the submarine input dives deeper than a tap and releasing resurfaces continuously',()=>{
 const held=descent(),tap=descent();let deepestHeld=0,deepestTap=0;
 for(let i=0;i<100;i++)for(const [fixture,active] of [[held,true],[tap,i<3]]){stepHydro(fixture.h,fixture.c,i/60,1/60,()=>0,{dive:active,dampen:true});if(fixture===held)deepestHeld=Math.min(deepestHeld,fixture.h.y);else deepestTap=Math.min(deepestTap,fixture.h.y);}
 assert.ok(deepestHeld<-.9);assert.ok(deepestHeld<deepestTap-.6);
 const previousY=held.h.y,previousVy=held.h.vy;stepHydro(held.h,held.c,100/60,1/60,()=>0,{dive:false,dampen:true});
 assert.equal(held.h.diveRemaining,0);assert.ok(Math.abs(held.h.y-previousY)<.1);assert.ok(Math.abs(held.h.vy-previousVy)<1.5);
 for(let i=101;i<300;i++)stepHydro(held.h,held.c,i/60,1/60,()=>0,{dive:false,dampen:true});
 assert.ok(held.h.y>-.1&&held.h.y<.2);assert.equal(held.h.diveUsed,false);assert.equal(held.h.diveRecovery,false);
});

test('a continuously held submarine exhausts its immersed allowance and cannot repeat while held',()=>{
 const {h,c}=descent();let submerged=false,expired=false,restarted=false;
 for(let i=0;i<360;i++){stepHydro(h,c,i/60,1/60,()=>0,{dive:true,dampen:true});submerged ||=h.y<-.8;if(submerged&&h.diveRemaining===0)expired=true;if(expired&&h.diveRemaining>0)restarted=true;}
 assert.ok(submerged&&expired);assert.equal(restarted,false);assert.equal(h.diveUsed,true);assert.ok(h.y>-.1);
 stepHydro(h,c,6,1/60,()=>0,{dive:false});assert.equal(h.diveUsed,false);
});
