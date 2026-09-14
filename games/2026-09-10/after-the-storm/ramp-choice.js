import {barrierPiles} from './course-barriers.js';
import {polygonDistance} from './classic-courses.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const angle=x=>Math.atan2(Math.sin(x),Math.cos(x));
// One seeded draw per racer, ramp and lap, never per animation frame.
export const RAMP_USE_PROBABILITY=.60;
export function racingStuntCourse(course){
 if(course.reverse||course.ramps?.length||!course.stuntLayout?.ramps?.length||!['greyhaven'].includes(course.id))return course;
 // Bring the venue's authored stunt ramp into otherwise ramp-free racing.
 // Use one clear platform, keeping room to choose the adjacent water line.
 const ramp=course.stuntLayout.ramps.find(q=>{
  const nearest=course.route?.reduce((best,p,i)=>{const d=Math.hypot(q.x-p.x,q.z-p.z);return d<best.d?{d,i}:best;},{d:Infinity,i:0});
  if(!nearest||nearest.d>16)return false;const a=course.route[nearest.i],b=course.route[(nearest.i+3)%course.route.length];
  return (b.x-a.x)*q.tx+(b.z-a.z)*q.tz>0&&[-18,0,24].every(t=>course.ground(q.x+q.tx*t,q.z+q.tz*t)<-1);
 });
 return ramp?{...course,ramps:[{...ramp,x:ramp.x+ramp.tx*25,z:ramp.z+ramp.tz*25,width:Math.min(12,ramp.width),optionalRace:true}]}:course;
}
export function rampDraw(seed,id,lap,ramp){let n=(seed^Math.imul(id+1,0x9e3779b9)^Math.imul(lap,0x85ebca6b)^Math.imul(ramp+1,0xc2b2ae35))>>>0;n=Math.imul(n^(n>>>16),0x7feb352d);n=Math.imul(n^(n>>>15),0x846ca68b);return ((n^(n>>>16))>>>0)/4294967296;}
const point=(q,along,side=0)=>({x:q.x+q.tx*along+q.tz*side,z:q.z+q.tz*along-q.tx*side});
function clear(course,a,b){
 const dx=b.x-a.x,dz=b.z-a.z,length2=Math.max(.001,dx*dx+dz*dz);
 for(const bar of course.crossbars||[])for(const p of barrierPiles(bar)){
  const t=clamp(((p.x-a.x)*dx+(p.z-a.z)*dz)/length2,0,1);
  if(Math.hypot(a.x+dx*t-p.x,a.z+dz*t-p.z)<p.radius+1.8)return false;
 }
 return [.2,.4,.6,.8,1].every(t=>{const x=a.x+dx*t,z=a.z+dz*t;return (!course.boundary||polygonDistance(course.boundary,x,z)<-1)&&course.ground(x,z)<-.65&&!(course.rocks||[]).some(o=>Math.hypot(x-o.x,z-o.z)<o.r+1.5);});
}
function legal(g,a,b){const f=p=>(p.x-g.x)*g.tx+(p.z-g.z)*g.tz,fa=f(a),fb=f(b);if(fa>0||fb<0)return true;const t=-fa/Math.max(.0001,fb-fa),x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t,side=-(x-g.x)*g.tz+(z-g.z)*g.tx;return side>(g.spanMin??-g.width)+1&&side<(g.spanMax??g.width)-1&&(!g.side||(side+g.side*(g.offset??7))*g.side>2);}
export function rampChoiceInput(s,r,base){
 if(!['race','championship'].includes(s.mode)||r.wipeout||r.out>.2||r.onIce){if(r.rampPlan&&(r.out>.2||r.wipeout))r.rampPlan=null;return base;}
 const g=s.course.gates[r.next],next=s.course.gates[(r.next+1)%s.course.gates.length],legalRoute=(a,b)=>legal(g,a,b)&&legal(next,a,b);if(g.channel||g.approach||s.course.requiredPassage||s.course.iceSheets?.length||['tempest','amber'].includes(s.course.id))return base;
 r.rampChoices??={};let plan=r.rampPlan;
 if(plan&&(plan.lap!==r.lap||s.time-plan.started>14)){r.rampPlan=null;plan=null;}
 if(!plan){
  const candidates=(s.course.ramps||[]).map(q=>({q,along:(r.x-q.x)*q.tx+(r.z-q.z)*q.tz,side:(r.x-q.x)*q.tz-(r.z-q.z)*q.tx})).filter(({q,along,side})=>along< -q.length/2-5&&along> -q.length/2-55&&Math.abs(side)<q.width/2+16&&Math.sin(r.heading)*q.tx+Math.cos(r.heading)*q.tz>.65).sort((a,b)=>b.along-a.along);
  for(const {q,side} of candidates){
   const key=r.lap+':'+q.id;if(r.rampChoices[key])continue;
   const entry=point(q,-q.length/2-8),exit=point(q,q.length/2+20),lip=point(q,q.length/2);
   // A ramp opportunity must have a usable run-up, landing corridor and legal
   // checkpoint crossing. Declined opportunities get an actual bypass line.
   if(!clear(s.course,r,entry)||!clear(s.course,entry,exit)||!legalRoute(r,entry)||!legalRoute(entry,exit))continue;
   const bypasses=[Math.sign(side)||1,-(Math.sign(side)||1)].map(sign=>({entry:point(q,-q.length/2-6,sign*(q.width/2+3.2)),exit:point(q,q.length/2+18,sign*(q.width/2+3.2))}));
   const bypass=bypasses.find(b=>clear(s.course,r,b.entry)&&clear(s.course,b.entry,b.exit)&&legalRoute(r,b.entry)&&legalRoute(b.entry,b.exit));if(!bypass)continue;
   const runup=-(r.x-q.x)*q.tx-(r.z-q.z)*q.tz-q.length/2,bypassShift=Math.abs((r.x-bypass.entry.x)*q.tz-(r.z-bypass.entry.z)*q.tx);
   if(runup<10+Math.max(Math.abs(side),bypassShift)*1.15+r.speed*.25)continue;
   const draw=rampDraw(s.waveSeed,r.id,r.lap,q.id),use=draw<RAMP_USE_PROBABILITY;
   r.rampChoices[key]={use,draw,time:s.time,ramp:q.id};
   plan=r.rampPlan={lap:r.lap,id:q.id,use,stage:0,started:s.time,entry:use?entry:bypass.entry,lip,exit:use?exit:bypass.exit,tx:q.tx,tz:q.tz};break;
  }
 }
 if(!plan)return base;
 if(!legal(g,r,plan.stage===0?plan.entry:plan.exit)){r.rampPlan=null;return base;}
 const target=plan.stage===0?plan.entry:plan.exit;
 if(plan.stage===0&&(Math.hypot(r.x-target.x,r.z-target.z)<3||((r.x-target.x)*plan.tx+(r.z-target.z)*plan.tz>0&&Math.abs((r.x-target.x)*plan.tz-(r.z-target.z)*plan.tx)<2)))plan.stage=1;
 if(plan.stage===1&&(r.x-plan.exit.x)*plan.tx+(r.z-plan.exit.z)*plan.tz>0){r.rampPlan=null;return base;}
 const aim=plan.stage===0?plan.entry:plan.exit;
 const cross=(r.x-aim.x)*plan.tz-(r.z-aim.z)*plan.tx,crossVelocity=r.vx*plan.tz-r.vz*plan.tx;
 const ahead=plan.stage===0?Math.max(7,Math.min(18,(aim.x-r.x)*plan.tx+(aim.z-r.z)*plan.tz)):12;
 const correction=clamp(cross+crossVelocity*.8,-24,24);
 const desiredHeading=Math.atan2(plan.tx*ahead-plan.tz*correction,plan.tz*ahead+plan.tx*correction),error=angle(desiredHeading-r.heading);
 const desired=plan.stage===0?12:plan.use?22:18,throttle=clamp(.55+(desired-r.speed)*.17,0,1);
 return {...base,steer:clamp(error*1.9-(r.yawVelocity||0)*.65,-1,1),throttle,brake:Math.abs(error)>.9||r.speed>desired+2,lean:plan.use?-.12:0,dampen:true,rampChoice:plan.use?'jump':'bypass'};
}
