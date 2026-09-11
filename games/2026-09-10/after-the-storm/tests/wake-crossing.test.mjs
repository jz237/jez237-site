import test from 'node:test';
import assert from 'node:assert/strict';
import {clearWakeTrail,recordWake,wakeHeight} from '../wake-field.js';
import {createHydro,stepHydro} from '../hydrodynamics.js';
import {createRace,stepRace,COVE} from '../race-core.js';

// Isolated contact fixture: crossing a fixed wake train at measured speeds.
function cross(speed){
 clearWakeTrail();for(let z=-8;z<=8;z+=2)recordWake(0,z,-2,0,1.4);
 const h=createHydro(),r={x:-8,z:0,heading:Math.PI/2,vx:speed,vz:0,speed};let peak=0,air=0;
 for(let i=0;i<Math.ceil(18/speed*120);i++){stepHydro(h,r,i/120,1/120,wakeHeight);r.x+=speed/120;peak=Math.max(peak,h.y-h.waterHeight);air+=h.airborne/120;}
 return {peak,air};
}
test('wake pressure lifts a fast crossing hull while a slow hull stays in contact',()=>{
 const slow=cross(3),fast=cross(26);assert.equal(slow.air,0);assert.ok(fast.air>.15);assert.ok(fast.peak>slow.peak+.35);assert.ok(fast.peak<1.5,'bounded wake launch');clearWakeTrail();
});

// Two ordinary throttle streams on an isolated open-water crossing. The first
// craft accelerates for 60 metres before the crossing and must emit the wake through stepRace; the second uses identical controls.
function twoCrafts(leader,x=-65,z=60){
 const s=createRace({mode:'versus',seaState:'calm',course:{...COVE,ground:()=>-20,rocks:[],ramps:[],crossbars:[],passage:null}});s.phase='running';
 const [a,b]=s.racers;Object.assign(a,{x:leader?0:1000,z:0,heading:0,power:5});Object.assign(b,{x,z,heading:Math.PI/2,power:5});let peak=0,air=0;
 for(let i=0;i<360;i++){stepRace(s,[{throttle:1,dampen:true},{throttle:1,dampen:true}],1/60);if(b.x> -10&&b.x<10){peak=Math.max(peak,b.hydro.y-b.hydro.waterHeight);air+=b.hydro.airborne/60;}}
 return {peak,air};
}
test('a moving jet ski wake can launch another rider through the shared hull physics',()=>{
 const alone=twoCrafts(false),crossing=twoCrafts(true);assert.equal(alone.air,0);assert.ok(crossing.air>.15);assert.ok(crossing.peak>alone.peak+.4);clearWakeTrail();
});

test('crossing the earlier low-energy launch wake does not force a jump',()=>{const early=twoCrafts(true,-35,30);assert.equal(early.air,0);clearWakeTrail();});
