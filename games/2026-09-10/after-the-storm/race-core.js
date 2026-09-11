import {courseResistance} from './classic-courses.js';
import {quickTurn,rocketStart,beginWipeout,stepWipeout,collideRiders} from './rider-actions.js';
import {clearWakeTrail,recordWake} from './wake-field.js';
import {shoreRecovery} from './shore-recovery.js';
import {lapComparison} from './race-feedback.js';
import {passageTarget,passageOpening,passageDistance,passageCollision} from './course-passages.js';
import {obstaclePosition} from './course-environment.js';
import {addImpact,clearImpacts} from './surface-impulses.js';
import {stuntCourse,createStunt,stepStunt,applyRamp} from './stunts.js';
import {createHydro,stepHydro} from './hydrodynamics.js';
import {getCourse,conditions} from './courses.js';
import {ground,ROCKS,wave,craftFields,waterLevel} from './simulation.js';

export const RIDERS=[
 {name:'Mara Vale',style:'Balanced · planted through turns',color:0xe69344,speed:24.7,accel:7.2,handling:1.65,grip:4.5,stability:3},
 {name:'Jonas Reed',style:'Top speed · deliberate handling',color:0x4eb9da,speed:27.3,accel:6.15,handling:1.30,grip:3.5,stability:4},
 {name:'Nia Sol',style:'Quick starts · forgiving steering',color:0xe96479,speed:23.14,accel:9.0,handling:1.90,grip:4.0,stability:2},
 {name:'Eli North',style:'Agile · loose and playful',color:0xb4d56b,speed:24.44,accel:7.2,handling:2.15,grip:2.8,stability:3}
];
const TAU=Math.PI*2;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const angleDelta=a=>Math.atan2(Math.sin(a),Math.cos(a));
export function makeCoveCourse(){return getCourse('greyhaven');}
export const COVE=makeCoveCourse();
export function settings(rider=0,tune={}){const r=RIDERS[rider];const engine=clamp(Number(tune.engine)||0,-1,1),grip=clamp(Number(tune.grip)||0,-1,1),handling=clamp(Number(tune.handling)||0,-1,1);return {...r,speed:r.speed+engine*1.4-grip*.7,accel:r.accel-engine*.8,grip:r.grip+grip*1.4,handling:r.handling+handling*.35};}
export function createRace({mode='race',rider=0,tune={},laps=3,difficulty=0,course=COVE,gridOrder=null,seaState='course',secondRider=1,secondTune={},handicap=false,swapColours=false}={}){
 clearImpacts();clearWakeTrail();waterLevel.value=conditions(course,0).seaLevel;
 if(mode==='stunt'||mode==='practice')course=stuntCourse(course,{freeRide:mode==='practice'});
 const ids=mode==='versus'?[rider,secondRider]:[rider,...RIDERS.map((_,i)=>i).filter(i=>i!==rider)],g=course.gates[0];
 const racers=ids.slice(0,mode==='versus'?2:['race','championship'].includes(mode)?4:1).map((id,i)=>{const grid=mode==='versus'?i:gridOrder?gridOrder.indexOf(id):i===0?3:i-1,lateral=(grid%2?1:-1)*2.4,back=7+Math.floor(grid/2)*5;return {id,grid,human:i===0||mode==='versus',player:i===0?0:mode==='versus'?1:null,stats:settings(id,i===0?tune:mode==='versus'?secondTune:{}),x:g.x-g.tx*back+g.tz*lateral,z:g.z-g.tz*back-g.tx*lateral,heading:Math.atan2(g.tx,g.tz),vx:0,vz:0,speed:0,turn:0,throttle:0,power:['practice','stunt'].includes(mode)?5:0,misses:0,next:1,passed:0,lap:1,lapStart:0,lapTimes:[],finishTime:null,dq:'',out:0,collision:0,recover:0,event:'',eventTime:0,previousWave:0,hydro:createHydro(),stunt:createStunt(),raceTime:0};});
 return {swapColours:!!swapColours,passageOpenedAt:Infinity,mode,seaState,handicap:!!handicap,phase:'countdown',countdown:3,time:0,course,racers,laps:mode==='stunt'?1:clamp(laps,3,9),difficulty,events:[],result:null,weather:conditions(course,0),finishWait:0};
}
export function gateCoordinates(g,x,z){return {forward:(x-g.x)*g.tx+(z-g.z)*g.tz,lateral:-(x-g.x)*g.tz+(z-g.z)*g.tx};}
function announce(r,s,text){r.event=text;r.eventTime=s.time;s.events.push({rider:r.id,text,time:s.time});if(s.events.length>20)s.events.shift();}
export function adjudicateGate(s,r,ox,oz){const p=s.course.passage,branch=p?.branchGates?.[r.next],useBranch=branch&&s.mode!=='stunt'&&passageOpening(p,s.time,s.passageOpenedAt)>.98&&Math.min(passageDistance(p,ox,oz),passageDistance(p,r.x,r.z))<p.width+3,g=useBranch?branch:s.course.gates[r.next],before=gateCoordinates(g,ox,oz),after=gateCoordinates(g,r.x,r.z);if(before.forward>0||after.forward<0||after.forward-before.forward<1e-7)return false;
 const f=-before.forward/(after.forward-before.forward),side=before.lateral+(after.lateral-before.lateral)*f;
 const correct=Math.abs(side)<g.width&&(g.side===0||(side+g.side*(g.offset??7))*g.side>1);
 if(s.mode==='stunt'){}else if(correct){if(g.side){r.power=Math.min(5,r.power+1);announce(r,s,r.power===5?'MAX POWER':'Clean buoy · power '+r.power);}}
 else{r.misses++;r.power=0;announce(r,s,'MISSED BUOY · '+r.misses+'/5');if(r.misses>=5)r.dq='Five missed buoys';}
 if(p&&r.next===p.first)r.passageRoute=passageOpening(p,s.time,s.passageOpenedAt)>.98?'open':'outer';if(p&&r.next===p.last)r.passageRoute=null;r.passed++;r.next=(r.next+1)%s.course.gates.length;
 if(r.next===1){const lap=s.time-r.lapStart;r.lapDelta=lapComparison(r.lapTimes,lap,r.referenceLap);r.lapDeltaTime=s.time;r.lapTimes.push(lap);r.lapStart=s.time;r.lap++;announce(r,s,'Lap '+(r.lap-1)+' · '+lap.toFixed(3)+' s');if(r.lap>s.laps&&!r.dq&&s.mode!=='stunt'){r.finishTime=s.time;announce(r,s,'FINISHED');}}
 return true;
}
export function courseDistance(course,x,z){let best=Infinity;for(let i=0;i<course.gates.length;i++){const a=course.gates[i],b=course.gates[(i+1)%course.gates.length],dx=b.x-a.x,dz=b.z-a.z,t=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1);best=Math.min(best,Math.hypot(x-a.x-dx*t,z-a.z-dz*t));}return best;}
export function aiInput(s,r){const g=passageTarget(s,r),d=Math.hypot(g.x-r.x,g.z-r.z),next=s.course.gates[(r.next+1)%s.course.gates.length];
 // Aim beyond the crossing plane. Steering toward the buoy itself causes last-moment stalls.
 const lane=-g.side*1.1+(r.id-1.5)*.5;let tx=g.x+g.tx*3+g.tz*lane,tz=g.z+g.tz*3-g.tx*lane;
 // Follow the authored bend between checkpoint planes rather than cutting a
 // chord across a projecting seawall. The final approach still targets the gate.
 if(s.course.layoutRevision&&s.course.route&&g===s.course.gates[r.next]&&d>14){const route=s.course.route,count=route.length,n=s.course.gates.length,end=(r.next||n)*count/n,start=end-count/n;let best=Math.floor(start),distance=Infinity;
  for(let i=Math.floor(start)-2;i<=Math.ceil(end);i++){const q=route[(i+count)%count],v=Math.hypot(q.x-r.x,q.z-r.z);if(v<distance){distance=v;best=i;}}
  const q0=route[(best+count)%count],q1=route[(best+1+count)%count],spacing=Math.max(1,Math.hypot(q1.x-q0.x,q1.z-q0.z)),ahead=Math.min(Math.ceil(end),best+Math.ceil((5+r.speed*.35)/spacing)),q=route[(ahead+count)%count];tx=q.x;tz=q.z;
 }
 // Plan a local detour around a solid obstacle that intersects the intended
 // line. Keep the original checkpoint; avoiding a post never grants progress.
 if(s.course.layoutRevision){const dx=tx-r.x,dz=tz-r.z,length=Math.max(1,Math.hypot(dx,dz)),ux=dx/length,uz=dz/length;
  const threats=(s.course.rocks||[]).map(q=>({...obstaclePosition(q,s.time),r:q.r})).filter(q=>{const ahead=(q.x-r.x)*ux+(q.z-r.z)*uz,side=(q.x-r.x)*uz-(q.z-r.z)*ux;return ahead>-.5&&ahead<Math.min(18,length)&&Math.abs(side)<q.r+1.8;}).sort((a,b)=>Math.hypot(a.x-r.x,a.z-r.z)-Math.hypot(b.x-r.x,b.z-r.z));
  if(threats.length){const q=threats[0],space=q.r+3.1,choices=[-1,1].map(side=>{const x=q.x+g.tz*side*space,z=q.z-g.tx*side*space,coords=gateCoordinates(g,x,z);let cost=Math.hypot(x-r.x,z-r.z)+Math.hypot(tx-x,tz-z);if(s.course.ground(x,z)>-.8)cost+=1000;for(const o of s.course.rocks)if(Math.hypot(x-o.x,z-o.z)<o.r+1.5)cost+=1000;if(Math.abs(coords.forward)<5&&g.side&&(coords.lateral+g.side*g.offset)*g.side<1)cost+=100;return {x,z,cost};}).sort((a,b)=>a.cost-b.cost);tx=choices[0].x;tz=choices[0].z;}
 }
 const desired=Math.atan2(tx-r.x-r.vx*.18,tz-r.z-r.vz*.18),error=angleDelta(desired-r.heading),bend=Math.abs(angleDelta(Math.atan2(next.tx,next.tz)-Math.atan2(g.tx,g.tz)));
 const cruise=clamp(.84+Math.min(2,s.difficulty)*.045-Math.abs(error)*.25-(d<28?bend*.2:0),.35,1);
 // Rivals use part throttle to preserve their safe course pace with the stronger engine.
 // Player controls retain the full power range, including in free ride and split screen.
 return {throttle:cruise*.53,steer:clamp(error*2.4-(r.yawVelocity||0)*.12,-1,1),brake:Math.abs(error)>1.1,dampen:true};
}
export function raceOrder(s){return [...s.racers].sort((a,b)=>{if(s.phase==='countdown'||s.time===0)return a.grid-b.grid;if(Boolean(a.dq)!==Boolean(b.dq))return a.dq?1:-1;if(a.finishTime!==null||b.finishTime!==null)return (a.finishTime??Infinity)-(b.finishTime??Infinity);if(a.passed!==b.passed)return b.passed-a.passed;const ga=s.course.gates[a.next],gb=s.course.gates[b.next];return Math.hypot(a.x-ga.x,a.z-ga.z)-Math.hypot(b.x-gb.x,b.z-gb.z);});}
// Catch-up assistance changes available power, never position or buoy progress.
export function handicapBoost(s,r){if(s.mode!=='versus'||!s.handicap)return 0;
 const progress=q=>{const g=s.course.gates[q.next],prev=s.course.gates[(q.next+s.course.gates.length-1)%s.course.gates.length];return q.passed-Math.hypot(g.x-q.x,g.z-q.z)/Math.max(1,Math.hypot(g.x-prev.x,g.z-prev.z));};
 const other=s.racers.find(q=>q!==r);if(!other||other.dq||other.finishTime!==null)return 0;return clamp((progress(other)-progress(r))*.075,0,.12);
}
export function raceWeather(s,time=s.time){const w=conditions(s.course,time,s.racers[0].lap);if(s.seaState!=='course')w.storm=({calm:0,chop:.45,storm:.95})[s.seaState]??w.storm;return w;}
export function stepRace(s,input,dt){if(s.phase==='paused'||s.phase==='results')return;dt=clamp(dt,0,1/30);
 if(s.phase==='countdown'){for(const r of s.racers)if(r.human){const c=Array.isArray(input)?input[r.player]||{}:input||{};rocketStart(r,c.throttle||0,-s.countdown);}s.countdown-=dt;if(s.countdown<=0){s.phase='running';s.racers.forEach(r=>announce(r,s,'GO'));}return;}
 s.time+=dt;if(s.course.passage?.enabled&&s.racers.some(r=>r.lap>1)&&s.passageOpenedAt===Infinity){s.passageOpenedAt=s.time;if(s.course.passage.kind==='gate')s.racers.forEach(r=>announce(r,s,'SLUICE OPENING · INNER CHANNEL AVAILABLE'));}s.weather=raceWeather(s);waterLevel.value=s.weather.seaLevel;
 craftFields.forEach((c,i)=>{const r=s.racers[i];Object.assign(c,r?{x:r.x,z:r.z,heading:r.heading,power:Math.min(1,r.speed/18)*r.hydro.wet}:{power:0});});
 for(const r of s.racers){if(r.finishTime!==null||r.dq)continue;let c=r.human?(Array.isArray(input)?input[r.player]||{}:r.player===0?input:{}):aiInput(s,r),stats=r.stats;const ox=r.x,oz=r.z,oldY=r.hydro.y;r.raceTime=s.time;if(r.human&&rocketStart(r,c.throttle||0,s.time))announce(r,s,'ROCKET START · MAX POWER');if(stepWipeout(r,c,dt,s.time))announce(r,s,'BACK ABOARD');if(r.wipeout)c={throttle:0};r.collision=Math.max(0,r.collision-dt);r.recover=Math.max(0,r.recover-dt);
 r.turn+=((c.steer||0)-r.turn)*(1-Math.exp(-dt*7));r.throttle=clamp(c.throttle||0,0,1);
 r.handicapBoost=handicapBoost(s,r);const maximum=stats.speed*1.10*(.64+r.power*.072)*(1+r.handicapBoost),velocity=Math.hypot(r.vx,r.vz),steering=stats.handling*r.turn*clamp(velocity/4,0,1);
 r.quickTurn=quickTurn(c,velocity,r.hydro.wet);r.yawVelocity??=0;const targetYaw=steering*(1+r.quickTurn*.65)*(c.slide?1.35:1)*(.78+.22*r.throttle);r.yawVelocity+=(targetYaw-r.yawVelocity)*(1-Math.exp(-dt*7*r.hydro.wet));r.yawVelocity*=Math.exp(-dt*.18*(1-r.hydro.wet));r.heading+=r.yawVelocity*dt;const fx=Math.sin(r.heading),fz=Math.cos(r.heading),forward=r.vx*fx+r.vz*fz;
 const acceleration=stats.accel*1.1*(1+r.handicapBoost)*r.throttle*r.hydro.intake-(forward/maximum)**2*stats.accel*(.08+.92*r.hydro.wet)-(c.brake?velocity*2*r.hydro.wet:0);r.vx+=fx*acceleration*dt;r.vz+=fz*acceleration*dt;
 const rx=fz,rz=-fx,lateral=r.vx*rx+r.vz*rz,grip=stats.grip*(1+r.quickTurn*.42)*(c.slide?.28:1)*(.04+.96*r.hydro.wet);r.vx-=rx*lateral*(1-Math.exp(-grip*dt));r.vz-=rz*lateral*(1-Math.exp(-grip*dt));
 if(!r.throttle){const coast=Math.exp(-(.015+.285*r.hydro.wet)*dt);r.vx*=coast;r.vz*=coast;}if(r.recover){r.vx*=Math.exp(-4*dt);r.vz*=Math.exp(-4*dt);}
 const waterResponse=stepHydro(r.hydro,r,s.time,dt,(x,z,t)=>wave(x,z,t,s.weather.storm),{dampen:!!c.dampen,lean:c.lean||0,dive:!!c.dive});
 r.weedDrag=courseResistance(s.course,r.x,r.z,r.hydro.wet);const hullDrag=Math.exp(-(r.hydro.drag+r.quickTurn*.1+r.weedDrag)*dt);r.vx*=hullDrag;r.vz*=hullDrag;r.vx+=waterResponse.slopeX*dt*3.5*r.hydro.wet;r.vz+=waterResponse.slopeZ*dt*3.5*r.hydro.wet;
 if(waterResponse.landing){addImpact(r.x,r.z,s.time,r.hydro.impact);const loss=Math.exp(-Math.max(0,r.hydro.impact-2)*.027);r.vx*=loss;r.vz*=loss;announce(r,s,r.hydro.impact>5?'HARD LANDING':'Wave landing');if(r.hydro.impact>8&&!c.dampen)r.recover=.65;}

 r.x+=r.vx*dt;r.z+=r.vz*dt;r.speed=Math.hypot(r.vx,r.vz);if(r.hydro.wet>.15&&r.speed>3&&s.time>=(r.nextWake||0)){recordWake(r.x-fx*1.9,r.z-fz*1.9,s.time,r.heading,Math.min(1.4,r.speed/18)*r.hydro.wet);r.nextWake=s.time+.24;}applyRamp(r,s.course.ramps,ox,oz,c.lean||0,s.time,s.weather.storm);
 const rock=(s.course.rocks||ROCKS).find(q=>{const p=obstaclePosition(q,s.time);return Math.hypot(r.x-p.x,r.z-p.z)<q.r+1&&r.hydro.y<r.hydro.waterHeight+(q.type==='ice'?2.5:1.1);});const bed=(s.course.ground||ground)(r.x,r.z),landHit=bed>waterLevel.value-.4&&r.hydro.y-.2<bed;if(landHit||rock||passageCollision(s.course.passage,r.x,r.hydro.y,r.z,s.time,s.passageOpenedAt)){if(rock&&!landHit){const p=obstaclePosition(rock,s.time),dx=r.x-p.x,dz=r.z-p.z,length=Math.hypot(dx,dz),nx=length>1e-6?dx/length:-fx,nz=length>1e-6?dz/length:-fz;r.x=p.x+nx*(rock.r+1.03);r.z=p.z+nz*(rock.r+1.03);const into=r.vx*nx+r.vz*nz;if(into<0){r.vx-=nx*into*1.25;r.vz-=nz*into*1.25;}}else{r.x=ox;r.z=oz;r.vx*=-.25;r.vz*=-.25;}if(!r.collision){r.collision=1;announce(r,s,'IMPACT');if(r.speed>12+stats.stability){beginWipeout(r,s.time,r.speed);announce(r,s,'WIPEOUT · TAP THROTTLE TO REMOUNT');}}}
 if(shoreRecovery(s,r,landHit,!!c.rescue,dt)){announce(r,s,'BACK IN THE WATER');continue;}
 if(s.mode==='stunt'||s.mode==='practice'){stepStunt(r.stunt,r,s.course,c,dt,ox,oz,oldY,s.weather.storm);if(r.stunt.crashes>(r.lastCrashes||0)){r.lastCrashes=r.stunt.crashes;beginWipeout(r,s.time,12);}if(r.stunt.eventId!==r.stuntEventId){r.stuntEventId=r.stunt.eventId;if(r.stunt.event){r.event=r.stunt.event;r.eventTime=s.time;}}}
 if(s.mode!=='practice'){adjudicateGate(s,r,ox,oz);const p=s.course.passage,insidePassage=p&&passageOpening(p,s.time,s.passageOpenedAt)>.98&&passageDistance(p,r.x,r.z)<p.width;r.out=courseDistance(s.course,r.x,r.z)>30&&!insidePassage?r.out+dt:0;if(r.out>=5){r.dq='Outside course for five seconds';announce(r,s,'DISQUALIFIED');}}
 }
 for(let i=0;i<s.racers.length;i++)for(let j=i+1;j<s.racers.length;j++){const a=s.racers[i],b=s.racers[j],impact=collideRiders(a,b);if(impact>9)for(const r of [a,b])if(impact>10+r.stats.stability*1.3&&beginWipeout(r,s.time,impact))announce(r,s,'WIPEOUT · TAP THROTTLE TO REMOUNT');}
 if(s.mode==='versus'){
  const finished=s.racers.filter(r=>r.finishTime!==null),disqualified=s.racers.filter(r=>r.dq);
  if(finished.length||disqualified.length){const winner=finished.length?finished.sort((a,b)=>a.finishTime-b.finishTime)[0]:s.racers.find(r=>!r.dq);s.phase='results';s.result={winner:winner?.player??null,position:winner?.player===0?1:2,time:winner?.finishTime??s.time,dq:disqualified.map(r=>'P'+(r.player+1)+': '+r.dq).join(' / '),lapTimes:[],players:s.racers.map(r=>({player:r.player,id:r.id,time:r.finishTime,misses:r.misses,passed:r.passed,dq:r.dq}))};}return;
 }
 const human=s.racers[0];if(human.dq||human.finishTime!==null){if(s.mode==='championship'&&s.racers.some(r=>!r.dq&&r.finishTime===null)){s.finishWait+=dt;if(s.finishWait<40)return;for(const r of s.racers)if(r.finishTime===null&&!r.dq)r.dq='Race time limit';}s.phase='results';s.result={position:raceOrder(s).indexOf(human)+1,time:human.finishTime,dq:human.dq,lapTimes:[...human.lapTimes]};}
}
