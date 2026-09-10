const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const TRICKS={flip:'Backflip',left:'Left barrel roll',right:'Right barrel roll',stand:'Standing ride',handstand:'Handstand',backwards:'Backwards ride',somersault:'Rider somersault'};
export function stuntCourse(base){const course={...base,stunt:true,ramps:[],rings:[],checkpoints:[]},n=base.gates.length;
 for(let section=0;section<4;section++){const index=Math.floor(section*n/4),g=base.gates[(index+2)%n],ramp={id:section,x:g.x,z:g.z,tx:g.tx,tz:g.tz,width:7,length:10,height:2.3};course.ramps.push(ramp);
  course.rings.push({x:g.x+g.tx*15,z:g.z+g.tz*15,y:3.2,tx:g.tx,tz:g.tz,radius:2.0,type:'air'});
  const water=base.gates[(index+4)%n];course.rings.push({...water,y:1.0,radius:2.2,type:'water'});
  // Diving rings are an optional high-skill line beneath the surface.
  course.rings.push({x:g.x+g.tx*28,z:g.z+g.tz*28,y:-.45,tx:g.tx,tz:g.tz,radius:1.5,type:'dive',optional:true});
  const finish=base.gates[Math.floor((section+1)*n/4)%n];course.checkpoints.push({...finish,width:21,limit:38,section});
 }
 return course;
}
export function createStunt(){return {score:0,rings:0,chain:0,nextCheckpoint:0,remaining:38,ringStatus:[],trick:null,angle:0,airDuration:0,pose:null,poseTime:0,poseAward:0,used:{},lastCommand:'',lastLanding:0,event:'',eventId:0,tricks:0,crashes:0,complete:false};}
function event(s,text){s.event=text;s.eventId++;}
function crossing(g,ox,oz,x,z){const before=(ox-g.x)*g.tx+(oz-g.z)*g.tz,after=(x-g.x)*g.tx+(z-g.z)*g.tz;if(before>0||after<0||after-before<1e-6)return null;const f=-before/(after-before);return {f,lateral:-(ox+(x-ox)*f-g.x)*g.tz+(oz+(z-oz)*f-g.z)*g.tx};}
export function stepStunt(s,r,course,input,dt,ox,oz,oldY){if(s.complete)return;s.remaining-=dt;if(s.remaining<=0){r.dq='Stunt checkpoint time expired';event(s,'TIME UP');return;}const command=input.trick||'';
 if(r.hydro.airborne){s.airDuration+=dt;if(!s.trick&&['flip','left','right'].includes(command)){s.trick=command;s.angle=0;}if(s.trick&&command===s.trick)s.angle+=dt*6.0*(command==='right'?-1:1);}
 if(r.hydro.landingId!==s.lastLanding){s.lastLanding=r.hydro.landingId;if(s.trick){const turns=Math.round(Math.abs(s.angle)/TAU),error=Math.abs(Math.atan2(Math.sin(s.angle),Math.cos(s.angle))),clean=turns>0&&error<.55;const points=Math.round(s.airDuration*240*(clean?1:.35));if(turns>0){s.score+=points;s.tricks++;event(s,(clean?'Clean ':'Rough ')+TRICKS[s.trick]+' +'+points);}if(!clean){r.recover=1.1;r.vx*=.6;r.vz*=.6;s.crashes++;event(s,'Wipeout · land upright');}s.trick=null;s.angle=0;}s.airDuration=0;}
 if(!r.hydro.airborne&&r.hydro.wet>.3&&r.speed>3){
  if(['stand','handstand','backwards'].includes(command)){if(s.pose!==command){s.pose=command;s.poseTime=0;s.poseAward=0;}s.poseTime+=dt;const available=Math.floor(Math.min(5,s.poseTime)*70/(1+(s.used[command]||0)));const add=available-s.poseAward;if(add>0){s.score+=add;s.poseAward=available;}}
  else if(command==='somersault'&&s.pose==='stand'&&s.lastCommand!=='somersault'){s.pose='somersault';s.poseTime=0;}
  else if(s.pose==='somersault'){s.poseTime+=dt;if(s.poseTime>1.05){const points=Math.round(350/(1+(s.used.somersault||0)));s.score+=points;s.tricks++;s.used.somersault=(s.used.somersault||0)+1;s.pose=null;event(s,'Rider somersault +'+points);}}
  else if(s.pose&&command!==s.pose){if(s.poseTime>.7){s.used[s.pose]=(s.used[s.pose]||0)+1;s.tricks++;event(s,TRICKS[s.pose]+' +'+s.poseAward);}s.pose=null;s.poseTime=0;}
 }else if(s.pose){s.pose=null;s.poseTime=0;}
 s.lastCommand=command;
 for(let i=0;i<course.rings.length;i++){if(s.ringStatus[i])continue;const ring=course.rings[i],hit=crossing(ring,ox,oz,r.x,r.z);if(!hit||Math.abs(hit.lateral)>25)continue;const y=oldY+(r.hydro.y-oldY)*hit.f+.85,through=Math.hypot(hit.lateral,y-ring.y)<ring.radius&&(ring.type!=='dive'||r.hydro.y<r.hydro.waterHeight-.45);
  s.ringStatus[i]=through?'hit':'miss';if(through){s.chain++;s.rings++;const points=50*s.chain;s.score+=points;event(s,'Ring '+s.chain+' +'+points);}else{s.chain=0;event(s,'Ring missed · chain reset');}
 }
 const cp=course.checkpoints[s.nextCheckpoint];if(cp){const hit=crossing(cp,ox,oz,r.x,r.z);if(hit&&Math.abs(hit.lateral)<cp.width){const bonus=Math.floor(Math.max(0,s.remaining)*10)*5;s.score+=bonus;s.nextCheckpoint++;s.used={};event(s,'Checkpoint '+s.nextCheckpoint+'/4 · time bonus +'+bonus);s.remaining=38;if(s.nextCheckpoint===4){s.complete=true;r.finishTime=r.raceTime;}}}
 if(s.remaining<=0&&!s.complete){r.dq='Stunt checkpoint time expired';event(s,'TIME UP');}
}
export function applyRamp(r,ramps,oldX,oldZ,lean=0){let contact=false;for(const ramp of ramps||[]){const along=(r.x-ramp.x)*ramp.tx+(r.z-ramp.z)*ramp.tz,across=-(r.x-ramp.x)*ramp.tz+(r.z-ramp.z)*ramp.tx;if(Math.abs(across)>ramp.width/2||along< -ramp.length/2||along>ramp.length/2)continue;const previous=(oldX-ramp.x)*ramp.tx+(oldZ-ramp.z)*ramp.tz;if(previous>along)continue;const height=.08+(along/ramp.length+.5)*ramp.height;
  if(r.hydro.y<height+.12&&r.speed>1){r.hydro.y=height+.12;r.hydro.vy=Math.max(0,(r.vx*ramp.tx+r.vz*ramp.tz))*ramp.height/ramp.length*(1-clamp(lean,-1,1)*.28);r.hydro.pitch=-Math.atan2(ramp.height,ramp.length);r.hydro.pitchVelocity=0;r.hydro.wet=0;r.hydro.airborne=false;r.hydro.launched=true;contact=true;}
 }r.hydro.onRamp=contact;}
