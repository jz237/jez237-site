import test from 'node:test';import assert from 'node:assert/strict';
import {createHydro,stepHydro} from '../hydrodynamics.js';
import {createRace,stepRace,aiInput,raceWeather} from '../race-core.js';
import {getCourse} from '../courses.js';
const craft={x:0,z:0,heading:0,vx:0,vz:0,speed:0,turn:0};
test('calm-water equilibrium floats without artificial vertical oscillation',()=>{const h=createHydro();for(let i=0;i<600;i++)stepHydro(h,craft,i/60,1/60,()=>0);assert.ok(Math.abs(h.y-.025)<.001);assert.ok(Math.abs(h.vy)<.001);assert.equal(h.airborne,false);assert.equal(h.landingId,0);});
test('unsupported hull falls under gravity then creates one measured landing',()=>{const h=createHydro();stepHydro(h,craft,0,1/60,()=>0);h.y=2;h.vy=0;stepHydro(h,craft,1/60,1/60,()=>0);assert.ok(Math.abs(h.vy+9.81/60)<1e-8);let peak=0;for(let i=2;i<200;i++){stepHydro(h,craft,i/60,1/60,()=>0);peak=Math.max(peak,h.impact);}assert.equal(h.landingId,1);assert.ok(peak>3);assert.ok(Math.abs(h.y-.025)<.03);});
test('rough-water race launches and lands on the shared wave surface',()=>{const s=createRace({course:getCourse('tempest'),seaState:'storm'});let airborne=0;for(let i=0;i<8000&&s.phase!=='results';i++){stepRace(s,aiInput(s,s.racers[0]),1/60);if(s.racers[0].hydro.airborne)airborne++;assert.ok(Number.isFinite(s.racers[0].hydro.y));}assert.ok(airborne>30);assert.ok(s.racers[0].hydro.landingId>2);});
test('custom sea conditions affect physics independently of venue progression',()=>{const s=createRace({course:getCourse('reed'),seaState:'storm'});assert.equal(raceWeather(s).storm,.95);s.seaState='calm';assert.equal(raceWeather(s).storm,0);s.seaState='course';assert.ok(raceWeather(s).storm<.1);});
