import {verificationInput} from '../race-verification.js';
import {polygonDistance} from '../classic-courses.js';
import {recoverToWater} from '../shore-recovery.js';
import {waterLevel} from '../simulation.js';
import {barrierCollision,barrierPiles} from '../course-barriers.js';
import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,aiInput,adjudicateGate} from '../race-core.js';
const map=(x,z)=>[(x-210)*.8,(z-325)*.8];
test('Southern Island has separate eastern land and western islet with open water between',()=>{
 const c=getCourse('tempest');assert.equal(c.name,'Southern Island');for(const p of [[117,287],[318,130],[320,510]])assert.ok(c.ground(...map(...p))>1);for(const p of [[210,300],[57,287],[399,422]])assert.ok(c.ground(...map(...p))< -1.5);assert.equal(c.crossbars.length,7);
});
test('the falling tide opens a physical passage beneath the southern pier',()=>{
 function cross(time){const s=createRace({mode:'time',course:getCourse('tempest'),seaState:'calm'}),r=s.racers[0];s.phase='running';s.time=time;[r.x,r.z]=map(250,515);r.heading=0;r.vx=0;r.vz=10;r.speed=10;let hit=false;for(let i=0;i<120;i++){stepRace(s,{throttle:.5},1/60);hit ||=r.collision>0;}return {r,hit};}
 const high=cross(0),low=cross(160);assert.equal(high.hit,true);assert.equal(low.hit,false);assert.ok(low.r.z>map(250,533)[1]);
});
test('All four classes complete the outer tide-safe route without misses',()=>{
 for(const difficulty of [0,1,2,3]){const s=createRace({course:getCourse('tempest',difficulty),difficulty}),r=s.racers[0];for(let i=0;i<36000&&s.phase!=='results';i++)stepRace(s,aiInput(s,r),1/60);assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.misses,0);}
});

test('pier piles stay solid below the deck while wide gaps remain navigable',()=>{
 const c=getCourse('tempest'),pier=c.crossbars[2],piles=barrierPiles(pier),p=piles[8];assert.ok(piles.length>10);assert.equal(barrierCollision([pier],p.x,-1,p.z),true);
 const next=piles[10],x=(p.x+next.x)/2,z=(p.z+next.z)/2;assert.equal(barrierCollision([pier],x,-1,z),false);
});
test('central timber platform has polygon collision and terrain below its deck',()=>{
 const c=getCourse('tempest'),p=c.crossbars.find(b=>b.outline&&!b.floating),[x,z]=map(316,355);assert.ok(c.ground(x,z)<p.bottom);assert.equal(barrierCollision([p],x,.7,z),true);assert.equal(barrierCollision([p],x,p.top+.01,z),false);
});

test('rescue rejects a saved point obstructed by a deck or supporting pile',()=>{
 const s=createRace({course:getCourse('tempest')}),r=s.racers[0],p=barrierPiles(s.course.crossbars[2])[8];r.x=p.x;r.z=p.z;r.lastWater={x:p.x,z:p.z,heading:0};assert.ok(recoverToWater(s,r));assert.equal(barrierCollision(s.course.crossbars,r.x,waterLevel.value,r.z),false);assert.ok(Math.hypot(r.x-p.x,r.z-p.z)>1);
});

test('the ship hull follows the tide and blocks a surface approach',()=>{
 const c=getCourse('tempest'),ship=c.crossbars.find(b=>b.kind==='ship'),[x,z]=map(227,142);
 for(const level of [.35,-1.05]){waterLevel.value=level;assert.equal(barrierCollision([ship],x,level,z),true);assert.equal(barrierCollision([ship],x,level+ship.top+.01,z),false);}
 createRace({course:c});
});
test('the boat jump clears the physical ship and lands at high and low tide',()=>{
 for(const time of [0,160]){const s=createRace({mode:'time',course:getCourse('tempest'),seaState:'calm'}),r=s.racers[0],a=s.course.ramps[0],ship=s.course.crossbars.find(b=>b.kind==='ship');s.phase='running';s.time=time;r.x=a.x-a.tx*9;r.z=a.z-a.tz*9;r.heading=Math.atan2(a.tx,a.tz);r.vx=a.tx*22;r.vz=a.tz*22;r.speed=22;r.power=5;let contact=false,over=0;
  for(let i=0;i<240;i++){stepRace(s,{throttle:.8,dampen:true},1/60);contact ||=r.hydro.onRamp;assert.equal(r.collision,0);if(polygonDistance(ship.outline,r.x,r.z)<0){over++;assert.ok(r.hydro.y>waterLevel.value+ship.top);}}
  assert.ok(contact);assert.ok(over>0);assert.ok(r.hydro.landingId>0);
 }
 const normal=getCourse('tempest'),reverse=getCourse('tempest',3);assert.deepEqual(reverse.ramps,normal.ramps);
});

// Outer green fringe stays navigable; the inner shoal still emerges at low tide.
test('original eastern yellow buoy approaches remain wet at low tide',()=>{
 const c=getCourse('tempest');
 for(const p of [[354,151],[361,488]])assert.ok(c.ground(...map(...p))< -1.45);
 assert.ok(c.ground(...map(344,450))> -1.05);
});

test('ship inspection rounds the island and earns three buoys before ramp contact',()=>{
 const s=createRace({course:getCourse('tempest')}),r=s.racers[0];s.verifyShipJump=true;
 let contact=false;
 for(let i=0;i<3600;i++){
  stepRace(s,verificationInput(s,r),1/60);
  assert.equal(r.misses,0);
  if(r.hydro.onRamp){contact=true;break;}
 }
 assert.ok(contact);assert.equal(r.power,3);assert.equal(r.next,4);
 // This verifies the entry only. A clean ship landing is still unproven.
});

test('grid-start ship jump clears the hull, lands cleanly and rejoins all three laps',()=>{
 const s=createRace({course:getCourse('tempest')}),r=s.racers[0],ship=s.course.crossbars.find(b=>b.kind==='ship');
 s.verifyShipJump=true;let contact=false,landed=false,over=0,landingId=0;
 for(let i=0;i<36000&&s.phase!=='results';i++){
  stepRace(s,verificationInput(s,r),1/60);
  if(r.hydro.onRamp&&!contact){contact=true;landingId=r.hydro.landingId;assert.equal(r.power,3);}
  if(contact&&!landed){
   assert.equal(r.collision,0);
   if(polygonDistance(ship.outline,r.x,r.z)<0){over++;assert.ok(r.hydro.y>waterLevel.value+ship.top);}
   if(r.hydro.landingId>landingId){landed=true;assert.ok(polygonDistance(ship.outline,r.x,r.z)>1);assert.ok(r.speed>10);}
  }
 }
 assert.ok(contact);assert.ok(over>10);assert.ok(landed);assert.equal(r.shipJumpStage,2);
 assert.equal(s.phase,'results');assert.equal(r.misses,0);assert.equal(r.dq,'');assert.equal(r.lap,4);
});

test('southern pier jump follows the map location and retains its direction in Reverse',()=>{
 const c=getCourse('tempest'),a=c.ramps.find(a=>a.id===151),[x,z]=map(189,477);
 assert.equal(a.x,x);assert.equal(a.z,z);assert.ok(a.tx>0&&a.tz>0);
 assert.deepEqual(getCourse('tempest',3).ramps.find(a=>a.id===151),a);
 const s=createRace({mode:'time',course:c,seaState:'calm'}),r=s.racers[0];s.phase='running';
 r.x=a.x-a.tx*15;r.z=a.z-a.tz*15;r.heading=Math.atan2(a.tx,a.tz);r.vx=a.tx*20;r.vz=a.tz*20;r.speed=20;r.power=5;
 let contact=false,airborne=false;
 for(let i=0;i<120;i++){stepRace(s,{throttle:1,dampen:true},1/60);contact ||=r.hydro.onRamp;airborne ||=contact&&r.hydro.airborne&&r.hydro.y-r.hydro.waterHeight>1;}
 assert.ok(contact);assert.ok(airborne);
});

test('a late dive clears the high-water southern deck while a surface landing hits it',()=>{
 function run(dive){
  const s=createRace({mode:'time',course:getCourse('tempest'),seaState:'calm'}),r=s.racers[0],a=s.course.ramps.find(a=>a.id===151);
  s.phase='running';r.x=a.x-a.tx*15;r.z=a.z-a.tz*15;r.heading=Math.atan2(a.tx,a.tz)-.08;r.vx=Math.sin(r.heading)*20;r.vz=Math.cos(r.heading)*20;r.speed=20;r.power=5;
  let hit=false,contact=false,under=0;
  for(let i=0;i<400;i++){
   const h=r.hydro;stepRace(s,{throttle:1,dampen:true,dive:dive&&h.airborne&&h.vy<0&&h.y-h.waterHeight<.6},1/60);
   hit ||=r.collision>0;contact ||=h.onRamp;
   if(r.z>map(0,521)[1]&&r.z<map(0,531)[1]&&h.y+1.1<.65)under++;
   if(r.z>map(0,533)[1])break;
  }
  return {hit,contact,under,passed:r.z>map(0,533)[1]};
 }
 const surface=run(false),dive=run(true);assert.ok(surface.contact&&surface.hit&&!surface.passed);
 assert.ok(dive.contact&&dive.passed&&!dive.hit);assert.ok(dive.under>5);
});
test('the southern checkpoint accepts both mapped routes and still rejects the wrong side',()=>{
 for(const difficulty of [0,1,2,3]){
  const c=getCourse('tempest',difficulty),index=c.gates.findIndex(g=>Math.abs(g.bx-map(151,544)[0])<2&&Math.abs(g.bz-map(151,544)[1])<2),g=c.gates[index];
  assert.ok(index>0);
  for(const lane of [0,g.side*65,-g.side*15]){
   const s=createRace({mode:'time',course:c,difficulty}),r=s.racers[0];r.next=index;
   const x=g.x-g.tz*lane,z=g.z+g.tx*lane;r.x=x+g.tx;r.z=z+g.tz;
   assert.ok(adjudicateGate(s,r,x-g.tx,z-g.tz));
   assert.equal(r.misses,lane===-g.side*15?1:0);
  }
 }
});

test('Normal Hard and Expert grid-start races take the first-lap pier dive and rejoin all buoys',()=>{
 for(const difficulty of [0,1,2]){
 const s=createRace({course:getCourse('tempest',difficulty),difficulty}),r=s.racers[0];s.verifyPierDive=true;let under=0,contact=false,clearedAt=0;
 for(let i=0;i<36000&&s.phase!=='results';i++){
  stepRace(s,verificationInput(s,r),1/60);
  if(r.pierDiveStage===1){
   contact ||=r.hydro.onRamp;assert.equal(r.collision,0);
   if(r.z>map(0,521)[1]&&r.z<map(0,531)[1]&&r.hydro.y+1.1<.65&&r.hydro.diveRemaining>0){under++;}
  }
  if(!clearedAt&&r.pierDiveStage===2){clearedAt=s.time;assert.equal(r.lap,1);}
 }
 assert.ok(contact&&under>10);assert.ok(clearedAt>0&&clearedAt<90);
 assert.equal(s.phase,'results');assert.equal(r.misses,0);assert.equal(r.dq,'');assert.equal(r.lap,4);
 }
});

test('all forward classes take the low-tide pier route on laps two and three without jumping or diving',()=>{
 for(const difficulty of [0,1,2]){
  const s=createRace({course:getCourse('tempest',difficulty),difficulty}),r=s.racers[0];s.verifyPierSurface=true;const under={2:0,3:0};
  for(let i=0;i<36000&&s.phase!=='results';i++){
   stepRace(s,verificationInput(s,r),1/60);
   if(r.pierSurface?.stage<4){
    assert.ok(r.lap>1);assert.equal(r.collision,0);assert.equal(r.hydro.onRamp,false);assert.equal(r.hydro.diveRemaining,0);
    if(r.z>map(0,521)[1]&&r.z<map(0,531)[1]&&r.hydro.y+1.1<.65)under[r.lap]++;
   }
  }
  assert.ok(under[2]>10&&under[3]>10);assert.equal(s.phase,'results');assert.equal(r.misses,0);assert.equal(r.dq,'');assert.equal(r.lap,4);
 }
});

test('Reverse keeps the outer first lap and clears the low-tide pier on both later laps',()=>{
 const s=createRace({course:getCourse('tempest',3),difficulty:3}),r=s.racers[0];s.verifyPierSurface=true;const under={2:0,3:0};let brakeFrames=0;
 for(let i=0;i<36000&&s.phase!=='results';i++){
  const input=verificationInput(s,r);stepRace(s,input,1/60);
  if(r.lap===1)assert.equal(r.pierSurface,undefined);
  if(r.pierSurface?.stage<8){
   assert.equal(r.collision,0);assert.equal(r.hydro.onRamp,false);assert.equal(r.hydro.diveRemaining,0);
   if(input.brake&&input.throttle===0)brakeFrames++;
   if(r.z>map(0,521)[1]&&r.z<map(0,531)[1]&&r.hydro.y+1.1<.65)under[r.lap]++;
  }
 }
 assert.ok(brakeFrames>0);assert.ok(under[2]>10&&under[3]>10);assert.equal(s.phase,'results');assert.equal(r.misses,0);assert.equal(r.dq,'');assert.equal(r.lap,4);
});
