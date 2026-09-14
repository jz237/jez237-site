import test from 'node:test';import assert from 'node:assert/strict';
import {planNext,scoreRig,createExecutor,stepExecutor,fightControl,rng} from '../demo.js';
import {SPECIES} from '../species.js';
import {createRecognizer,recordSample,recordTwitch,classify} from '../technique.js';
import {LURES,RIGS} from '../tackle.js';
const spots=[{type:'laydown',x:10,z:10,r:8},{type:'dock',x:60,z:-20,r:9},{type:'weedbed',x:-40,z:30,r:70},{type:'riprap',x:120,z:-80,r:35}];
test('the plan favours topwater over vegetation at first light and the squarebill on rock at midday',()=>{
 const dawn=planNext({hour:6.8,activity:.95,spots,rigs:RIGS,kayak:{x:0,z:0},memory:{visits:{},refusals:0},random:rng(3)});
 assert.equal(dawn.rigIndex,1);assert.equal(dawn.technique,'walking the dog');assert.ok(dawn.reason.length>10);
 let rocks=0;for(let s=1;s<=10;s++){const noon=planNext({hour:13,activity:.35,spots:[spots[3],spots[1]],rigs:RIGS,kayak:{x:100,z:-60},memory:{visits:{},refusals:0},random:rng(s)});if(noon.rigIndex===2)rocks++;}
 assert.ok(rocks>=8,'squarebill picks '+rocks);
 const refused=planNext({hour:9,activity:.5,spots,rigs:RIGS,kayak:{x:0,z:0},memory:{visits:{},refusals:2},random:rng(5)});assert.equal(refused.rigIndex,0);assert.ok(/turning away/.test(refused.reason));
});
test('the plan names a species and reaches for the musky rig once the bass are in the book',()=>{
 const night=planNext({hour:21.5,activity:.3,spots:[{type:'riprap',x:20,z:0,r:30},{type:'stump',x:-30,z:10,r:12}],rigs:RIGS,kayak:{x:0,z:0},memory:{visits:{},refusals:0,caught:{},refusalsByRig:{}},random:rng(2)});
 assert.ok(['walleye','catfish','smallmouth','striper'].includes(night.target),'night target '+night.target);assert.ok(night.reason.includes(SPECIES[night.target].name.split(' ')[0])||/Cats|Hybrids/.test(night.reason),night.reason);
 let musky=0,mentions=0;for(let s=1;s<=12;s++){const dusk=planNext({hour:19.0,activity:.9,spots:[{type:'weedbed',x:15,z:10,r:40}],rigs:RIGS,kayak:{x:0,z:0},memory:{visits:{},refusals:0,caught:{largemouth:2,pickerel:1},refusalsByRig:{}},random:rng(s)});if(dusk.rigIndex===3){musky++;if(/bucktail/.test(dusk.reason)&&/musky/.test(dusk.reason))mentions++;}}
 assert.ok(musky>=6,'musky rig picked '+musky+'/12');assert.equal(mentions,musky);
 const fresh=planNext({hour:19.0,activity:.9,spots:[{type:'weedbed',x:15,z:10,r:40}],rigs:RIGS,kayak:{x:0,z:0},memory:{visits:{},refusals:0,caught:{},refusalsByRig:{}},random:rng(4)});assert.equal(fresh.rigIndex,1,'topwater for bass before any are caught');
 const sc=scoreRig('riprap',RIGS[2],LURES.squarebill,{hour:13,species:SPECIES});assert.ok(sc.value>0&&sc.target);
 const bitten=planNext({hour:7.5,activity:.9,spots:[{type:'weedbed',x:15,z:10,r:40},{type:'laydown',x:-10,z:20,r:8}],rigs:RIGS,kayak:{x:0,z:0},memory:{visits:{},refusals:0,caught:{},refusalsByRig:{},bittenOff:2},random:rng(9)});assert.equal(bitten.rigIndex,3);assert.ok(/teeth/.test(bitten.reason),bitten.reason);
});
test('the executor produces input the recognizer names as intended',()=>{
 for(const [tech,lure,onBottom] of [['walking the dog',LURES.walker,false],['stop & go',LURES.squarebill,false],['lift & drop',LURES.worm,true],['straight retrieve',LURES.squarebill,false],['dead stick',LURES.nightcrawler,false]]){
  const ex=createExecutor(tech,rng(7)),r=createRecognizer();let t=0;let label='';
  for(let i=0;i<600;i++){t+=1/60;const inp=stepExecutor(ex,1/60,rng(i));if(i%3===0)recordSample(r,t,inp.reeling);if(inp.twitch)recordTwitch(r,t);if(i%15===0)label=classify(r,t,lure,{inWater:true,onBottom});}
  assert.equal(label,tech,'technique '+tech+' read as '+label);}
});
test('the fight controller bows to jumps and leans on runs',()=>{
 assert.equal(fightControl({state:'JUMP'},1,null).rodUp,0);assert.equal(fightControl({state:'RUN'},1,null).sidePressure,1);assert.ok(fightControl({state:'HEADSHAKE'},1,null).reeling>.9);
 assert.equal(fightControl({state:'RUN'},1,'JUMP').rodUp,0,'a delayed read is what the angler reacts to');
});
