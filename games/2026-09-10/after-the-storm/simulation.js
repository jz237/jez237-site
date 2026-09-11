import {wakeHeight} from './wake-field.js';
import {impactHeight} from './surface-impulses.js';
export const waterLevel={value:0};
export const DURATION=480, CAPACITY=3, DOCK={x:0,z:142};
export const JOBS=[{name:'Medical supplies',x:-66,z:46,weight:1,value:450,seconds:22,depth:1.9},{name:'Survey instruments',x:74,z:-46,weight:2,value:900,seconds:34,depth:2.8},{name:'Wreck strongbox',x:-32,z:-164,weight:2,value:1400,seconds:46,depth:3.5}];
export {WAVES} from './wave-model.js';
import {sampleSwell} from './wave-model.js';
export const craftField={x:10000,z:10000,heading:0,power:0};
export const craftFields=[craftField,...Array.from({length:3},()=>({x:10000,z:10000,heading:0,power:0}))];
export function jetWake(x,z){let result=0;for(const c of craftFields){if(c.power<=0)continue;const dx=x-c.x,dz=z-c.z,s=Math.sin(c.heading),co=Math.cos(c.heading),along=dx*s+dz*co,across=dx*co-dz*s;let h=Math.exp(-((along-1.1)**2*2.5+across*across*.9))*.075;const aft=-along;if(aft>1&&aft<36){const edge=Math.abs(across)-(.4+aft*.24);h+=Math.cos(edge*4.2)*Math.exp(-edge*edge*.9)*.095*Math.exp(-aft*.035);h-=Math.exp(-across*across*2-(aft-2.4)**2)*.08;}result+=h*c.power;}return result;}
export function wave(x,z,t,storm=0){return waterLevel.value+sampleSwell(x,z,t,storm)+jetWake(x,z)+impactHeight(x,z,t)+wakeHeight(x,z,t,storm);}
export function ground(x,z){const outer=Math.sqrt((x/1.04)**2+((z+15)/1.25)**2);let g=-7+Math.max(0,outer-125)*.22;g+=Math.sin(x*.04)*.5+Math.sin(z*.053+x*.025)*.65;g+=5.8*Math.exp(-((x+77)**2+(z-25)**2)/1500);g+=5.4*Math.exp(-((x-87)**2+(z+52)**2)/1350);g+=2.4*Math.exp(-((x+32)**2+(z+166)**2)/1600);if(z<-170)g-=Math.min(16,(-z-170)*.16)*Math.exp(-(x*x)/12500);if(g>5){const blend=Math.min(1,(g-5)/12);g+=blend*(Math.sin(x*.029+Math.cos(z*.019))*6+Math.sin(z*.028+x*.012)*4);g-=Math.max(0,outer-245)*.29;}return g;}
export const ROCKS=[{x:-84,z:28,r:9},{x:-63,z:16,r:5},{x:-90,z:51,r:6},{x:92,z:-44,r:8},{x:65,z:-65,r:4},{x:100,z:-80,r:6},{x:-43,z:-152,r:5}];
export function createState(){waterLevel.value=0;return {mode:'intro',x:0,z:139,heading:Math.PI,speed:0,turn:0,throttle:0,acceleration:0,hull:100,time:0,load:[],delivered:[],jobs:JOBS.map(j=>({...j,status:'waiting',progress:0})),recovery:null,dockProgress:0,collisionCooldown:0,event:'',eventId:0,departed:false};}
export function emit(s,message){s.event=message;s.eventId++;}
export const loadWeight=s=>s.load.reduce((a,i)=>a+s.jobs[i].weight,0);
export const stormLevel=s=>Math.min(1,Math.max(0,(s.time-60)/(DURATION-60)));
export const atDock=s=>Math.hypot(s.x-DOCK.x,s.z-DOCK.z)<12;
export function context(s){if(atDock(s)){if(Math.abs(s.speed)>1)return {text:'Slow below 2 knots to moor',type:'slow'};if(s.load.length)return {text:'Hold E · unload cargo',type:'dock'};return {text:s.delivered.length?'F · finish safely, or head out again':'Find the amber salvage buoys',type:'home'};}let best=-1,dist=Infinity;s.jobs.forEach((j,i)=>{const d=Math.hypot(j.x-s.x,j.z-s.z);if(j.status==='waiting'&&d<dist){dist=d;best=i;}});if(dist<11){const j=s.jobs[best];if(loadWeight(s)+j.weight>CAPACITY)return {text:'Hold full · return to dock',type:'full',job:best};if(Math.abs(s.speed)>1)return {text:'Slow below 2 knots to recover',type:'slow',job:best};return {text:'Hold E · recover '+j.name,type:'salvage',job:best};}return {text:'',type:'travel'};}
export function finish(s){if(s.mode==='playing'&&atDock(s)&&Math.abs(s.speed)<1&&s.delivered.length&&s.load.length===0){s.mode='success';emit(s,'Home before the storm');}}
export function step(s,input,dt){if(s.mode!=='playing')return;dt=Math.min(dt,.1);s.time+=dt;s.collisionCooldown=Math.max(0,s.collisionCooldown-dt);const storm=stormLevel(s),weight=loadWeight(s),ctx=context(s);const holding=input.interact&&(ctx.type==='salvage'||ctx.type==='dock');const throttle=holding?0:input.throttle||0;
 s.turn+=((input.steer||0)-s.turn)*Math.min(1,dt*5);s.throttle=throttle;const oldSpeed=s.speed;const max=8.2/(1+weight*.16);const target=throttle>=0?throttle*max:throttle*max*.42;s.speed+=(target-s.speed)*dt*(holding?2.1:.70/(1+weight*.15));if(input.brake)s.speed*=Math.exp(-2.8*dt);s.acceleration=(s.speed-oldSpeed)/dt;
 s.heading+=s.turn*dt*.80/(1+weight*.13)*Math.min(1,Math.abs(s.speed)/1.3)*(s.speed<0?-1:1);const ox=s.x,oz=s.z;
 if(!holding){s.x+=Math.sin(s.heading)*s.speed*dt+storm*.10*dt;s.z+=Math.cos(s.heading)*s.speed*dt-storm*.10*dt;}
 let collision=ground(s.x,s.z)>-(.43+weight*.10);for(const r of ROCKS)if(Math.hypot(s.x-r.x,s.z-r.z)<r.r+1.05)collision=true;
 // Pier piles and wreck remain solid; the approach is alongside the eastern pier.
 if(s.x>-10&&s.x<-4&&s.z>126&&s.z<160)collision=true;
 if(((s.x+36)/5)**2+((s.z+177)/15)**2<1)collision=true;
 if(collision){s.x=ox;s.z=oz;if(s.collisionCooldown<=0){const damage=2+Math.abs(s.speed)*5;s.hull-=damage;s.collisionCooldown=1.4;emit(s,'Hull strike · '+Math.round(damage)+' damage');}s.speed*=-.28;}
 if(Math.hypot(s.x,s.z)>360){s.x=ox;s.z=oz;s.speed*=.8;emit(s,'Open water is unsafe. Turn back into the cove.');}
 if(s.time>330&&!atDock(s))s.hull-=dt*storm*.13;if(s.hull<30&&!atDock(s))s.hull-=dt*.04;
 if(!atDock(s))s.departed=true;
 if(holding&&ctx.type==='salvage'){const j=s.jobs[ctx.job];s.recovery=ctx.job;j.progress+=dt;if(j.progress>=j.seconds){j.status='aboard';s.load.push(ctx.job);s.recovery=null;emit(s,j.name+' secured. Jet ski sits lower in the water.');}}
 else {if(s.recovery!==null)s.jobs[s.recovery].progress=Math.max(0,s.jobs[s.recovery].progress-dt*.22);s.recovery=null;}
 if(holding&&ctx.type==='dock'){s.dockProgress+=dt;if(s.dockProgress>=3){for(const i of s.load){s.jobs[i].status='delivered';s.delivered.push(i);}s.load=[];s.dockProgress=0;s.hull=Math.min(100,s.hull+12);emit(s,'Cargo delivered · dock crew patched the hull');if(s.delivered.length===3)s.mode='success';}}else s.dockProgress=0;
 if(input.finish)finish(s);
 if(s.hull<=0){s.hull=0;s.mode='failure';emit(s,'The hull gave way');}else if(s.time>=DURATION){s.time=DURATION;if(atDock(s)&&s.delivered.length&&!s.load.length){s.mode='success';emit(s,'Safe in harbour');}else{s.mode='failure';emit(s,'The harbour closed in the storm');}}
}
