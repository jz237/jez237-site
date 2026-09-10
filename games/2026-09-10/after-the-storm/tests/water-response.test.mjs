import test from 'node:test';import assert from 'node:assert/strict';
import {addImpact,clearImpacts,impactHeight} from '../surface-impulses.js';
import {wave,craftFields} from '../simulation.js';
import {createHydro,stepHydro} from '../hydrodynamics.js';
import {createRace,stepRace} from '../race-core.js';
import {sprayLaunch} from '../hull-spray.js';
test('landing rings affect buoyancy, expand from a fixed position, and decay',()=>{
 clearImpacts();craftFields.forEach(c=>c.power=0);const baseline=wave(2,0,10.4);addImpact(0,0,10,7);
 assert.ok(Math.abs(wave(2,0,10.4)-baseline)>.001);assert.equal(impactHeight(2,0,9),0);
 assert.equal(impactHeight(2,0,18),0);assert.ok(Math.abs(impactHeight(2,0,10.4))>Math.abs(impactHeight(20,0,10.4)));
 clearImpacts();assert.equal(wave(2,0,10.4),baseline);
});
test('a lifted stern ventilates the intake, then progressively regains water',()=>{
 const h=createHydro(),craft={x:0,z:0,heading:0,speed:10,vx:0,vz:10,turn:0};
 stepHydro(h,craft,0,1/60,()=>0);h.pitch=.6;
 for(let i=0;i<5;i++)stepHydro(h,craft,i/60,1/60,()=>0);
 assert.ok(h.sternWet<h.bowWet);assert.ok(h.intake<.5);
 for(let i=0;i<180;i++)stepHydro(h,craft,i/60,1/60,()=>0);
 assert.ok(h.intake>.95);
});
test('throttle and water brake cannot redirect an airborne craft',()=>{
 function fly(input){const s=createRace({mode:'practice'});s.phase='running';const r=s.racers[0];r.vx=0;r.vz=10;r.heading=0;
  Object.assign(r.hydro,{initialized:true,y:10,vy:0,wet:0,intake:0,airborne:true});
  stepRace(s,input,1/60);return r;
 }
 const neutral=fly({}),braking=fly({brake:true}),throttle=fly({throttle:1});
 assert.ok(Math.abs(neutral.vz-braking.vz)<1e-8);
 assert.ok(Math.abs(neutral.vz-throttle.vz)<.003);
 assert.ok(neutral.hydro.vy<0);
});
test('nozzle spray inherits hull velocity; sideways slip strengthens the loaded fan',()=>{
 const r={x:0,z:0,heading:0,vx:0,vz:18,throttle:1,hydro:{y:0,vy:0,waterVelocity:0,wet:1,portWet:1,starboardWet:1,impact:6}},rand=()=>.5;
 const jet=sprayLaunch(r,'jet',1,rand);assert.equal(jet.vz,-2);assert.ok(jet.vy>0);
 const chine=sprayLaunch(r,'chine',1,rand);assert.ok(chine.vz>5);
 r.vx=4;const outer=sprayLaunch(r,'chine',1,rand),inner=sprayLaunch(r,'chine',-1,rand);
 assert.ok(outer.vx-r.vx*.48>Math.abs(inner.vx-r.vx*.48));
});
