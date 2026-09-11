import {wave,waterLevel} from './simulation.js';
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const TRICKS={flip:'Backflip',left:'Left barrel roll',right:'Right barrel roll',stand:'Standing ride',handstand:'Handstand',backwards:'Backwards ride',somersault:'Rider somersault'};
// Moored platforms heave gently with the shared water. The visual deck and
// contact solver sample this exact function, including tide changes.
export function rampWaterOffset(ramp,time=0,storm=0){
 if(!ramp.floating)return 0;
 const d=ramp.length*.35;
 return waterLevel.value+((wave(ramp.x,ramp.z,time,storm)+wave(ramp.x+ramp.tx*d,ramp.z+ramp.tz*d,time,storm)+wave(ramp.x-ramp.tx*d,ramp.z-ramp.tz*d,time,storm))/3-waterLevel.value)*.55;
}
export function rampCameraHeight(position,course,time,storm){let minimum=-Infinity;
 for(const ramp of course.ramps||[]){const dx=position.x-ramp.x,dz=position.z-ramp.z,along=dx*ramp.tx+dz*ramp.tz,across=dx*ramp.tz-dz*ramp.tx;if(Math.abs(across)<ramp.width/2+2&&Math.abs(along)<ramp.length/2+4)minimum=Math.max(minimum,rampWaterOffset(ramp,time,storm)+ramp.height+1.5);}
 return minimum;
}
export function ringHeight(ring,course,time=0,storm=0){
 const ramp=ring.rampId===undefined?null:course.ramps?.find(r=>r.id===ring.rampId);
 return ring.y+(ramp?rampWaterOffset(ramp,time,storm):ring.floating?waterLevel.value+(wave(ring.x,ring.z,time,storm)-waterLevel.value)*.55:0);
}
export function stuntCourse(base,{freeRide=false}={}){
 const course={...base,stunt:!freeRide,freeStunts:freeRide,ramps:[],rings:[],checkpoints:[]},n=base.gates.length;
 for(let section=0;section<4;section++){
  const index=Math.floor(section*n/4);let g=base.gates[(index+2)%n];
  if(freeRide&&section===0){
   const start=base.gates[0],candidate={...start,x:start.x+start.tx*29,z:start.z+start.tz*29};
   const clear=[[-7,-6],[-7,6],[7,-6],[7,6],[22,0]].every(([along,across])=>base.ground(candidate.x+candidate.tx*along+candidate.tz*across,candidate.z+candidate.tz*along-candidate.tx*across)<-1.5);
   if(clear)g=candidate;
  }
  if(base.layoutRevision){const safe=q=>[[-7,-6],[-7,6],[7,-6],[7,6],[22,0],...(base.id==='citadel'?[[36,0],[48,0]]:[])].every(([along,across])=>base.ground(q.x+q.tx*along+q.tz*across,q.z+q.tz*along-q.tx*across)<-1.5);if(!safe(g)){const candidates=Array.from({length:Math.floor(n/4)-1},(_,j)=>base.gates[(index+1+j)%n]);g=candidates.find(safe)||g;}}
  const ramp={id:section,name:['KICKER','BIG AIR','STEP UP','COAST JUMP'][section],x:g.x,z:g.z,tx:g.tx,tz:g.tz,width:freeRide?11:9,length:14,height:freeRide?[3.6,4,3.2,3.8][section]:3.1,floating:true};course.ramps.push(ramp);
  course.rings.push({x:g.x+g.tx*18,z:g.z+g.tz*18,y:ramp.height+1.2,tx:g.tx,tz:g.tz,radius:2.6,type:'air',rampId:section});
  const water=base.id==='practice'?{x:g.x+g.tx*52,z:g.z+g.tz*52,tx:g.tx,tz:g.tz}:base.gates[(index+4)%n];course.rings.push({...water,y:1.35,radius:2.8,type:'water',floating:true});
  course.rings.push({x:g.x+g.tx*28,z:g.z+g.tz*28,y:-.45,tx:g.tx,tz:g.tz,radius:1.8,type:'dive',optional:true,floating:true});
  if(!freeRide){const finish=base.gates[Math.floor((section+1)*n/4)%n];course.checkpoints.push({...finish,width:21,limit:38,section});}
 }
 return course;
}
export function createStunt(){return {score:0,rings:0,chain:0,nextCheckpoint:0,remaining:38,ringStatus:[],ringCooldown:[],trick:null,angle:0,airDuration:0,pose:null,poseTime:0,poseAward:0,used:{},completedTricks:{},lastCommand:'',lastLanding:0,event:'',eventId:0,tricks:0,crashes:0,complete:false};}
function event(s,text){s.event=text;s.eventId++;}
function crossing(g,ox,oz,x,z){const before=(ox-g.x)*g.tx+(oz-g.z)*g.tz,after=(x-g.x)*g.tx+(z-g.z)*g.tz;if(before>0||after<0||after-before<1e-6)return null;const f=-before/(after-before);return {f,lateral:-(ox+(x-ox)*f-g.x)*g.tz+(oz+(z-oz)*f-g.z)*g.tx};}
export function stepStunt(s,r,course,input,dt,ox,oz,oldY,storm=0){if(s.complete)return;const free=!!course.freeStunts;if(!free)s.remaining-=dt;if(!free&&s.remaining<=0){r.dq='Stunt checkpoint time expired';event(s,'TIME UP');return;}const command=input.trick||'';
 if(r.hydro.airborne){s.airDuration+=dt;if(!s.trick&&['flip','left','right'].includes(command)){s.trick=command;s.angle=0;}if(s.trick&&command===s.trick)s.angle+=dt*6.0*(command==='right'?-1:1);}
 if(r.hydro.landingId!==s.lastLanding){s.lastLanding=r.hydro.landingId;if(s.trick){const turns=Math.round(Math.abs(s.angle)/TAU),error=Math.abs(Math.atan2(Math.sin(s.angle),Math.cos(s.angle))),clean=turns>0&&error<.55;if(clean)s.completedTricks[s.trick]=true;const points=Math.round(s.airDuration*240*(clean?1:.35));if(turns>0){s.score+=points;s.tricks++;event(s,(clean?'Clean ':'Rough ')+TRICKS[s.trick]+' +'+points);}if(!clean){r.recover=1.1;r.vx*=.6;r.vz*=.6;s.crashes++;event(s,'Wipeout · land upright');}s.trick=null;s.angle=0;}s.airDuration=0;}
 if(!r.hydro.airborne&&r.hydro.wet>.3&&r.speed>3){
  if(['stand','handstand','backwards'].includes(command)){if(s.pose!==command){s.pose=command;s.poseTime=0;s.poseAward=0;}s.poseTime+=dt;const available=Math.floor(Math.min(5,s.poseTime)*70/(1+(s.used[command]||0)));const add=available-s.poseAward;if(add>0){s.score+=add;s.poseAward=available;}}
  else if(command==='somersault'&&s.pose==='stand'&&s.lastCommand!=='somersault'){s.completedTricks.stand=true;s.pose='somersault';s.poseTime=0;}
  else if(s.pose==='somersault'){s.poseTime+=dt;if(s.poseTime>1.05){const points=Math.round(350/(1+(s.used.somersault||0)));s.score+=points;s.tricks++;s.used.somersault=(s.used.somersault||0)+1;s.completedTricks.somersault=true;s.pose=null;event(s,'Rider somersault +'+points);}}
  else if(s.pose&&command!==s.pose){if(s.poseTime>.7){s.used[s.pose]=(s.used[s.pose]||0)+1;s.completedTricks[s.pose]=true;s.tricks++;event(s,TRICKS[s.pose]+' +'+s.poseAward);}s.pose=null;s.poseTime=0;}
 }else if(s.pose){s.pose=null;s.poseTime=0;}
 if(r.hydro.diveRemaining>0&&r.hydro.y<r.hydro.waterHeight-.6)s.completedTricks.dive=true;s.lastCommand=command;
 for(let i=0;i<course.rings.length;i++){if(free&&s.ringStatus[i]&&r.raceTime>=(s.ringCooldown[i]||0))s.ringStatus[i]=null;if(s.ringStatus[i])continue;const ring=course.rings[i],hit=crossing(ring,ox,oz,r.x,r.z);if(!hit||Math.abs(hit.lateral)>25)continue;const y=oldY+(r.hydro.y-oldY)*hit.f+.85,through=Math.hypot(hit.lateral,y-ringHeight(ring,course,r.raceTime,storm))<ring.radius&&(ring.type!=='dive'||r.hydro.y<r.hydro.waterHeight-.45);
  s.ringStatus[i]=through?'hit':'miss';if(free)s.ringCooldown[i]=r.raceTime+(through?10:2);if(through){s.chain++;s.rings++;const points=50*s.chain;s.score+=points;event(s,'Ring '+s.chain+' +'+points);}else{s.chain=0;event(s,'Ring missed · chain reset');}
 }
 const cp=course.checkpoints[s.nextCheckpoint];if(cp){const hit=crossing(cp,ox,oz,r.x,r.z);if(hit&&Math.abs(hit.lateral)<cp.width){const bonus=Math.floor(Math.max(0,s.remaining)*10)*5;s.score+=bonus;s.nextCheckpoint++;s.used={};event(s,'Checkpoint '+s.nextCheckpoint+'/4 · time bonus +'+bonus);s.remaining=38;if(s.nextCheckpoint===4){s.complete=true;r.finishTime=r.raceTime;}}}
 if(!free&&s.remaining<=0&&!s.complete){r.dq='Stunt checkpoint time expired';event(s,'TIME UP');}
}
export function applyRamp(r,ramps,oldX,oldZ,lean=0,time=0,storm=0){let contact=false;for(const ramp of ramps||[]){const along=(r.x-ramp.x)*ramp.tx+(r.z-ramp.z)*ramp.tz,across=-(r.x-ramp.x)*ramp.tz+(r.z-ramp.z)*ramp.tx;const previous=(oldX-ramp.x)*ramp.tx+(oldZ-ramp.z)*ramp.tz,back=ramp.length/2+.65;
  // Authored ramps keep their world orientation in Reverse. Their raised rear
  // is a solid obstacle, but a hull flying above the deck clears it.
  if(ramp.solidBack&&Math.abs(across)<ramp.width/2+.65&&previous>=back&&along<back&&r.hydro.y<rampWaterOffset(ramp,time,storm)+ramp.height+.3){
   const depth=back-along;r.x+=ramp.tx*depth;r.z+=ramp.tz*depth;const into=r.vx*ramp.tx+r.vz*ramp.tz;
   if(into<0){r.vx-=ramp.tx*into*1.2;r.vz-=ramp.tz*into*1.2;}r.speed=Math.hypot(r.vx,r.vz);r.collision=1;continue;
  }
  if(Math.abs(across)>ramp.width/2||along< -ramp.length/2||along>ramp.length/2||previous>along)continue;const height=rampWaterOffset(ramp,time,storm)+.08+(along/ramp.length+.5)*ramp.height;
  if(r.hydro.y<height+.12&&r.speed>1){r.hydro.y=height+.12;r.hydro.vy=Math.max(0,(r.vx*ramp.tx+r.vz*ramp.tz))*ramp.height/ramp.length*(1-clamp(lean,-1,1)*.28)+(rampWaterOffset(ramp,time+.025,storm)-rampWaterOffset(ramp,time-.025,storm))/.05;r.hydro.pitch=-Math.atan2(ramp.height,ramp.length);r.hydro.pitchVelocity=0;r.hydro.wet=0;r.hydro.airborne=false;r.hydro.launched=true;contact=true;}
 }r.hydro.onRamp=contact;}
