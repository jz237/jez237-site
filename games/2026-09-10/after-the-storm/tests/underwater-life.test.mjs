import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES,getCourse} from '../courses.js';
import {habitatSites,createSchool,stepSchool,sedimentStrength} from '../underwater-life.js';
test('every venue has separated submerged habitats without moving terrain or gates',()=>{
 for(const entry of COURSES){const c=getCourse(entry.id),sites=habitatSites(c),g=c.renderGround||c.ground;assert.ok(sites.length>=4,c.id);assert.deepEqual(sites,habitatSites(c));for(const [i,p] of sites.entries()){assert.ok(g(p.x,p.z)<=-2.7);for(const q of sites.slice(i+1))assert.ok(Math.hypot(p.x-q.x,p.z-q.z)>=24);}}
});
test('fish explore depth and stay upright, submerged and above the seabed',()=>{
 const home={x:0,y:-5,z:0},fish=createSchool(home,19),ground=(x,z)=>-5+Math.max(0,Math.hypot(x,z)-12)*.5,surface=()=>0;let ymin=Infinity,ymax=-Infinity;
 for(let i=0;i<1800;i++){stepSchool(fish,1/30,i/30,[],ground,surface);for(const f of fish){assert.ok(f.y>=ground(f.x,f.z)+.29);assert.ok(f.y<=-.64);assert.ok(Math.abs(f.pitch)<=.181);ymin=Math.min(ymin,f.y);ymax=Math.max(ymax,f.y);}}
 assert.ok(ymax-ymin>.8);assert.ok(new Set(fish.map(f=>Math.round(f.speed*100))).size>5);
});
test('approaching riders scatter fish and fear fades after departure',()=>{
 const fish=createSchool({x:0,y:-5,z:0},17);for(let i=0;i<60;i++)stepSchool(fish,1/30,i/30,[{x:0,z:0,speed:24}],()=>-5,()=>0);
 assert.ok(fish.some(f=>f.fear>.3));assert.ok(fish.some(f=>f.speed>1.7));
 for(let i=60;i<960;i++)stepSchool(fish,1/30,i/30,[],()=>-5,()=>0);
 assert.ok(fish.every(f=>f.fear===0));assert.ok(fish.every(f=>Math.hypot(f.x,f.z)<20));
});
test('sediment requires fast shallow water contact',()=>{
 assert.equal(sedimentStrength({speed:0},-2,0),0);assert.equal(sedimentStrength({speed:20},-8,0),0);assert.equal(sedimentStrength({speed:20,hydro:{wet:0}},-2,0),0);assert.ok(sedimentStrength({speed:20,hydro:{wet:1}},-2,0)>.2);
});
