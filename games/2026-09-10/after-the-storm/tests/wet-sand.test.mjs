import test from 'node:test';
import assert from 'node:assert/strict';
import {stepWetSand} from '../wet-sand.js';
const dry=(seconds,dt=1/60)=>{let s={moisture:1,film:1};for(let t=0;t<seconds-1e-8;t+=dt)s=stepWetSand(s.moisture,s.film,-1,Math.min(dt,seconds-t));return s;};
test('dry land stays dry until a wave reaches it',()=>{assert.deepEqual(stepWetSand(0,0,-.2,1),{moisture:0,film:0});assert.deepEqual(stepWetSand(0,0,.2,.1),{moisture:1,film:1});});
test('surface shine drains first and soaked sand gradually returns to fully dry',()=>{const early=dry(4),middle=dry(15),late=dry(35);assert.ok(early.film<.05&&early.moisture>.8);assert.ok(middle.moisture>.4&&middle.moisture<.6);assert.equal(late.moisture,0);assert.equal(late.film,0);});
test('drying follows elapsed time at 60, 15 and 2 fps',()=>{for(const dt of [1/15,.5]){const a=dry(18),b=dry(18,dt);assert.ok(Math.abs(a.moisture-b.moisture)<1e-10);assert.ok(Math.abs(a.film-b.film)<1e-10);}});
test('another wave rewets the footprint and pause freezes drying',()=>{const s=dry(12);assert.deepEqual(stepWetSand(s.moisture,s.film,.3,.1),{moisture:1,film:1});assert.deepEqual(stepWetSand(s.moisture,s.film,-1,0),s);});
test('lightly wetted edges and better draining sand dry earlier',()=>{const edge=stepWetSand(.15,.02,-1,5),center=stepWetSand(1,.5,-1,5),fast=stepWetSand(1,.5,-1,5,1.2);assert.equal(edge.moisture,0);assert.ok(center.moisture>fast.moisture);});
