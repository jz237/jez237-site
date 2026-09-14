import test from 'node:test';import assert from 'node:assert/strict';
import {createFishBrain,stepFishBrain,markEscape,decayAversion} from '../fish-brain.js';
import {SPECIES} from '../species.js';
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function fish(seed=7,boldness=.7){return createFishBrain({id:'t',species:SPECIES.largemouth,length:.42,home:{x:0,y:-1.5,z:0},boldness,random:rng(seed)});}
const lureAt=(x,z,extra={})=>({lure:{x,y:-.6,z,speed:.6,family:'topwater',technique:'walking the dog',inWater:true,onSurface:true,...extra},clarity:1,activity:1,kayak:{x:40,z:40},splash:null});
test('a fish holding on structure notices a worked lure, inspects it and eventually strikes',()=>{
 let struck=0,inspected=0;for(let seed=1;seed<=12;seed++){const f=fish(seed,.75);let t=0;for(let i=0;i<1200;i++){t+=1/30;stepFishBrain(f,1/30,t,lureAt(1.5,0));if(f.state==='INSPECT')inspected=1;if(f.state==='BITE'){struck++;break;}}}
 assert.equal(inspected,1);assert.ok(struck>=6,'strikes across seeds '+struck);
});
test('a spooked fish never strikes and flees the kayak',()=>{
 const f=fish(3,.9);let t=0;for(let i=0;i<300;i++){t+=1/30;stepFishBrain(f,1/30,t,{...lureAt(1,0),kayak:{x:1,z:1}});assert.notEqual(f.state,'BITE');}
 assert.ok(['FLEE','HOLD','CRUISE'].includes(f.state));assert.ok(Math.hypot(f.x-1,f.z-1)>2,'moved away from the kayak');
});
test('aversion to a lure family grows with escapes, decays over days and lowers strikes',()=>{
 const a=fish(5);markEscape(a,'topwater');markEscape(a,'topwater');assert.ok(Math.abs(a.aversion.topwater-.5)<1e-9);decayAversion(a,10);assert.ok(Math.abs(a.aversion.topwater-.3)<1e-9);
 let plain=0,wary=0;for(let seed=1;seed<=20;seed++){for(const [bag,av] of [[0,0],[1,.9]]){const f=fish(seed,.6);f.aversion.topwater=av;let t=0;for(let i=0;i<900;i++){t+=1/30;stepFishBrain(f,1/30,t,lureAt(1.2,0));if(f.state==='BITE'){if(bag)wary++;else plain++;break;}}}}
 assert.ok(plain>wary,'plain '+plain+' vs wary '+wary);
});
test('a dead-sticked lure on the bottom rarely draws a strike',()=>{
 let hits=0;for(let seed=1;seed<=20;seed++){const f=fish(seed,.6);let t=0;for(let i=0;i<900;i++){t+=1/30;stepFishBrain(f,1/30,t,lureAt(1.2,0,{speed:0,technique:'dead stick',onSurface:false,family:'soft'}));if(f.state==='BITE'){hits++;break;}}}
 assert.ok(hits<=6,'dead-stick strikes '+hits);
});
