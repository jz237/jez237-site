import test from 'node:test';
import assert from 'node:assert/strict';
import {createOpenSeaSpectrum} from '../open-sea-spectrum.js';
import {createOpenSeaField,OPEN_SEA_STATES} from '../open-sea-field.js';
import {stepOpenSeaCraft} from '../open-sea-craft.js';
import {createHydro} from '../hydrodynamics.js';
import {createRace,stepRace,raceWeather} from '../race-core.js';
import {getCourse} from '../courses.js';
import {wave} from '../simulation.js';

const flat={level:0,sample:()=>({h:0,ht:0})};
const craft=()=>({x:0,z:0,heading:0,vx:0,vz:0,speed:0,turn:0,hydro:createHydro(),stunt:{}});
function ride(input,seconds,sea=flat){const r=craft();for(let i=0;i<seconds*60;i++){const t=(i+1)/60;stepOpenSeaCraft(r,typeof input==='function'?input(t):input,1/60,t,sea);}return r;}

test('the CPU mirror reports each wave height\'s own rate of change',()=>{
 const s=createOpenSeaSpectrum({seaState:3.5,cascades:3}),dt=.002;let error=0,size=0;
 for(let i=0;i<24;i++){const x=i*17.3-150,z=i*9.1+20,t=30+i;
  s.setTime(t-dt);const a=s.displacement(x,z).h;s.setTime(t+dt);const b=s.displacement(x,z).h;s.setTime(t);
  const rate=(b-a)/(2*dt);error+=(rate-s.displacement(x,z).ht)**2;size+=rate*rate;}
 assert.ok(Math.sqrt(error/size)<1e-3,`relative error ${Math.sqrt(error/size)}`);
});

test('the physics field extrapolates between rebuilds within millimetres',()=>{
 const field=createOpenSeaField({seaState:OPEN_SEA_STATES.surf}),fresh=createOpenSeaField({seaState:OPEN_SEA_STATES.surf});
 field.setTime(20);field.setTime(20.04);fresh.setTime(20.04);
 let worst=0;for(let i=0;i<40;i++){const x=i*11-200,z=i*5;worst=Math.max(worst,Math.abs(field.height(x,z)-fresh.height(x,z)));}
 assert.ok(worst<.02,`worst ${worst}`);
});

test('the craft floats at its draft, planes trimmed bow-up past 85 km/h and steers under power',()=>{
 const rest=ride({},4);
 assert.ok(Math.abs(rest.hydro.y)<.04&&rest.speed<.01,'floats at its draft at rest');
 assert.ok(-rest.hydro.pitch>.02,'sits slightly stern-down with its rider');
 const run=ride({throttle:1},10);
 assert.ok(run.speed*3.6>85&&run.speed*3.6<100,`top speed ${run.speed*3.6}`);
 assert.ok(run.hydro.y>.15&&run.hydro.sternWet>run.hydro.bowWet,'planes on its aft bottom');
 assert.ok(-run.hydro.pitch>.015&&-run.hydro.pitch<.07,`running trim ${-run.hydro.pitch*57.3} degrees`);
 const turn=ride(t=>({throttle:1,steer:t>8?1:0}),14);
 assert.ok(turn.openSea.yawRate>.5,'full lock turns hard at speed');
 assert.ok(turn.hydro.roll<-.4,'the rider leans well into a right turn');
 const lateral=turn.speed*turn.openSea.yawRate/9.81;assert.ok(lateral>.9&&lateral<1.7,`lateral ${lateral} g`);
 const coast=ride(t=>({throttle:t<8?1:0,steer:t>8?1:0}),10);
 assert.ok(coast.openSea.yawRate<turn.openSea.yawRate*.4,'off throttle the nozzle cannot turn the craft');
 assert.ok(coast.speed<turn.speed*1.1&&coast.speed*3.6<70,'the idling pump drags it off the plane');
});

test('planing on flat water is steady: no porpoising at any speed',()=>{
 for(const U of [8,14,20,25]){const r=craft();r.vz=U;const trims=[];
  for(let i=0;i<10*60;i++){stepOpenSeaCraft(r,{},1/60,(i+1)/60,flat);r.vx=0;r.vz=U;r.heading=0;r.openSea.yawRate=0;if(i>8*60)trims.push(-r.hydro.pitch);}
  const mean=trims.reduce((a,b)=>a+b)/trims.length,spread=Math.max(...trims)-Math.min(...trims);
  assert.ok(spread<.004,`U ${U}: trim spread ${spread*57.3} degrees`);assert.ok(mean>.01&&mean<.09,`U ${U}: trim ${mean*57.3}`);}
});

test('waves launch the craft and its landings give up their energy',()=>{
 const field=createOpenSeaField({seaState:OPEN_SEA_STATES.surf}),r=craft();let air=0,landings=0,longest=0,flight=0,peak=0;
 for(let i=0;i<40*60;i++){const t=(i+1)/60;field.setTime(t);const q=stepOpenSeaCraft(r,{throttle:1},1/60,t,field);
  if(r.hydro.airborne){air++;flight+=1/60;}else{longest=Math.max(longest,flight);flight=0;}if(q.landing)landings++;
  peak=Math.max(peak,r.hydro.y-r.hydro.waterHeight);
  assert.ok(Number.isFinite(r.x+r.z+r.hydro.y+r.hydro.pitch+r.hydro.roll),'state stays finite');}
 assert.ok(air>60&&landings>10,`air frames ${air}, landings ${landings}`);
 assert.ok(longest<2&&peak<4,`no runaway launches: longest flight ${longest} s, peak ${peak} m`);
 assert.ok(r.speed*3.6>40&&r.speed*3.6<110,`speed ${r.speed*3.6}`);
});

test('open sea is a modern solo Free ride whose waves replace the venue water',()=>{
 assert.throws(()=>createRace({mode:'time',course:getCourse('tempest',0),openSea:3.5}),RangeError);
 assert.throws(()=>createRace({mode:'practice',physics:'native',course:getCourse('practice',0),openSea:3.5}),RangeError);
 const s=createRace({mode:'practice',course:getCourse('tempest',0),openSea:OPEN_SEA_STATES.chop,seaState:'surf'});
 assert.equal(s.seaState,'calm');assert.equal(s.openSea.seaState,OPEN_SEA_STATES.chop);assert.equal(s.raceWater,null);
 assert.ok(!(s.course.ramps?.length),'no ramps float on the open sea');
 const r=s.racers[0];
 for(let i=0;i<8*60;i++)stepRace(s,{throttle:1},1/60);
 assert.ok(r.speed>15,`speed ${r.speed}`);
 assert.ok(Math.abs(wave(r.x+3,r.z,s.time)-s.openSea.height(r.x+3,r.z))<.5,'wave() reports the open-sea surface');
 // The race's own collisions still apply: Tempest's coral reef stops the ski.
 const reef=createRace({mode:'practice',course:getCourse('tempest',0),openSea:OPEN_SEA_STATES.chop,seaState:'surf'});
 for(let i=0;i<5*60;i++)stepRace(reef,{throttle:1,steer:.3},1/60);
 assert.ok(reef.events.some(e=>e.text==='IMPACT'),'the reef is solid');assert.ok(reef.racers[0].x>60,'the ski stops at the reef');
 const storm=createRace({mode:'practice',course:getCourse('tempest',0),openSea:OPEN_SEA_STATES.storm,seaState:'storm'});
 assert.equal(raceWeather(storm).storm,.95,'a storm sea brings storm weather');
 assert.equal(raceWeather(createRace({mode:'practice',course:getCourse('tempest',0),openSea:OPEN_SEA_STATES.calm,seaState:'calm'})).storm,0);
 const plain=createRace({mode:'practice',course:getCourse('tempest',0)});
 assert.equal(plain.openSea,undefined);
});
