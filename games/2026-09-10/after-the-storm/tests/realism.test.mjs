import test from 'node:test';import assert from 'node:assert/strict';
import {displacedSurface,sampleSwell} from '../wave-model.js';
import {createHydro,stepHydro,HULL_PATCHES} from '../hydrodynamics.js';
import {clearWakeTrail,recordWake,wakeHeight} from '../wake-field.js';
import {sprayLaunch} from '../hull-spray.js';
import {riderPose} from '../rider-pose.js';import {advanceSpray} from '../spray-physics.js';
const craft={x:0,z:0,heading:0,vx:0,vz:0,speed:0,turn:0};
test('CPU inverse height stays on the horizontally displaced rendered surface',()=>{
 let horizontal=0;for(const storm of [0,.45,.95])for(let t=0;t<30;t+=1.3)for(let x=-150;x<=150;x+=23){const p=displacedSurface(x,x*.41,t,storm);horizontal=Math.max(horizontal,Math.hypot(p.x-x,p.z-x*.41));assert.ok(Math.abs(sampleSwell(p.x,p.z,t,storm)-p.y)<.004);}
 assert.ok(horizontal>1);
});
test('independent hull pressures create roll and pitch from asymmetric wave contact',()=>{
 const flat=createHydro(),side=createHydro(),bow=createHydro();
 for(let i=0;i<90;i++){stepHydro(flat,craft,i/120,1/120,()=>0);stepHydro(side,craft,i/120,1/120,(x)=>x*.22);stepHydro(bow,craft,i/120,1/120,(_,z)=>z*.18);}
 assert.equal(HULL_PATCHES.length,12);assert.ok(Math.abs(flat.roll)<1e-5);assert.ok(side.roll>.12);assert.ok(bow.pitch<-.1);
 assert.ok(side.patches.some((p,i)=>Math.abs(p.force-flat.patches[i].force)>.001));
});
test('planing pressure raises the hull and a landing loads rider suspension',()=>{
 const idle=createHydro(),fast=createHydro();for(let i=0;i<360;i++){stepHydro(idle,craft,i/120,1/120,()=>0);stepHydro(fast,{...craft,vz:24,speed:24},i/120,1/120,()=>0);}
 assert.ok(fast.y>idle.y+.035);assert.ok(fast.pitch<idle.pitch);fast.y=3;fast.vy=0;let load=0,compression=0;for(let i=0;i<300;i++){stepHydro(fast,craft,3+i/120,1/120,()=>0);load=Math.max(load,fast.load);compression=Math.max(compression,fast.compression);}
 assert.ok(load>2);assert.ok(compression>.10);assert.ok(fast.landingId>0);
});
test('force integration remains close at 60 and 120 Hz',()=>{
 function run(dt){const h=createHydro();for(let t=0;t<5-dt*.5;t+=dt)stepHydro(h,craft,t,dt,(x,z,time)=>Math.sin(time*1.4+x*.15+z*.1)*.22);return h;}
 const a=run(1/60),b=run(1/120);assert.ok(Math.abs(a.y-b.y)<.035);assert.ok(Math.abs(a.roll-b.roll)<.03);assert.ok(Math.abs(a.pitch-b.pitch)<.03);
});
test('world-space wakes spread, decay and affect hull response after their emitter leaves',()=>{
 clearWakeTrail();recordWake(0,0,0,0,1);const near=wakeHeight(3.8,0,5,.0);assert.ok(Math.abs(near)>.01);assert.equal(wakeHeight(3.8,0,19),0);
 const h=createHydro();let roll=0,load=0;for(let i=0;i<180;i++){const t=1+i/120;stepHydro(h,{...craft,x:-3+i/30},t,1/120,(x,z,time)=>wakeHeight(x,z,time));roll=Math.max(roll,Math.abs(h.roll));load=Math.max(load,Math.abs(h.load-1));}
 assert.ok(roll>.01);assert.ok(load>.1);clearWakeTrail();assert.equal(wakeHeight(3.8,0,5),0);
});
test('rider IK holds grips and boots while preserving arm and leg lengths under load',()=>{
 const neutral=riderPose();for(const compression of [0,.15,.38])for(const turn of [-1,0,1]){const p=riderPose('',1,turn,{speed:26,compression,steering:turn*.3,pitch:.4,roll:-.2});
  for(const side of ['L','R']){assert.deepEqual(p.targets['foot'+side],neutral.targets['foot'+side]);for(const [bone,length] of [['upperArm',.382974],['forearm',.366647],['thigh',.537331],['shin',.510539]]){const [a,b]=p.targets[bone+side];assert.ok(Math.abs(Math.hypot(...a.map((v,i)=>v-b[i]))-length)<.0001);}}
 }
 assert.ok(riderPose('',0,0,{compression:.38}).targets.torso[1][1]<neutral.targets.torso[1][1]-.2);
});
test('fine mist follows wind more strongly than ballistic impact droplets',()=>{
 const mist={vx:15,vy:2,vz:0,size:.1,mist:true},drop={...mist,mist:false},a=new Float32Array([0,5,0]),b=new Float32Array([0,5,0]);for(let i=0;i<60;i++){advanceSpray(mist,a,0,1/60,1,()=>-100);advanceSpray(drop,b,0,1/60,1,()=>-100);}
 assert.ok(mist.vx<drop.vx*.5);assert.ok(mist.vz<drop.vz);assert.ok(mist.size>drop.size);assert.ok(a[1]>b[1]);
});

test('spray attachment follows hull pitch, roll and local vertical motion',()=>{
 const r={x:0,z:0,heading:0,vx:0,vz:20,speed:20,throttle:1,hydro:{y:1,vy:0,wet:1,sternWet:1,portWet:1,starboardWet:1,waterVelocity:0,impact:0,pitch:0,roll:0}};
 const level=sprayLaunch(r,'jet',1,()=>.5);r.hydro.pitch=-.2;const pitched=sprayLaunch(r,'jet',1,()=>.5);assert.ok(pitched.y<level.y-.3);
 r.hydro.roll=.2;const right=sprayLaunch(r,'chine',1,()=>.5),left=sprayLaunch(r,'chine',-1,()=>.5);assert.ok(right.y>left.y+.2);
});
