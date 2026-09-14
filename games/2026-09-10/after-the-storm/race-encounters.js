const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const angle=a=>Math.atan2(Math.sin(a),Math.cos(a));
// Only used on the open, surveyed stretches accepted by the wave pilot.
export function encounterInput(s,r,input,clear){
 const fx=Math.sin(r.heading),fz=Math.cos(r.heading),rx=fz,rz=-fx;
 const relative=q=>{const dx=q.x-r.x,dz=q.z-r.z;return {ahead:dx*fx+dz*fz,side:dx*rx+dz*rz};};
 const traffic=s.racers.filter(q=>q!==r&&!q.dq&&q.finishTime==null&&!q.wipeout);
 let plan=r.passPlan,leader=plan&&traffic.find(q=>q.id===plan.id);
 if(plan&&(!leader||s.time>plan.until||relative(leader).ahead< -4)){r.passPlan=null;r.passCooldown=s.time+4;plan=null;}
 if(!plan&&s.time>=(r.passCooldown||0)){
  leader=traffic.filter(q=>{const p=relative(q);return p.ahead>10&&p.ahead<40&&Math.abs(p.side)<5&&r.speed>q.speed+1.5;}).sort((a,b)=>relative(a).ahead-relative(b).ahead)[0];
  if(leader){const p=relative(leader),sides=[p.side>0?-1:1,p.side>0?1:-1];
   for(const side of sides){const target={x:leader.x+rx*side*8+fx*12,z:leader.z+rz*side*8+fz*12};
    const laneClear=traffic.every(q=>{if(q===leader)return true;const b=relative(q);return b.ahead< -6||b.ahead>p.ahead+18||Math.abs(b.side-(p.side+side*8))>6;});
    const open=laneClear&&[.25,.5,.75,1].every(t=>{const x=r.x+(target.x-r.x)*t,z=r.z+(target.z-r.z)*t;return clear(x,z)&&traffic.every(q=>q===leader||Math.hypot(q.x+q.vx*t*.8-x,q.z+q.vz*t*.8-z)>7);});
    if(open){plan=r.passPlan={id:leader.id,side,until:s.time+4.5};r.passCount=(r.passCount||0)+1;break;}
   }
  }
 }
 if(plan&&leader){const target={x:leader.x+rx*plan.side*8+fx*12,z:leader.z+rz*plan.side*8+fz*12};
  if(!clear(target.x,target.z)){r.passPlan=null;r.passCooldown=s.time+2.5;return input;}
  const heading=Math.atan2(target.x-r.x,target.z-r.z),correction=clamp(angle(heading-r.heading)*.34,-.12,.12);
  return {...input,steer:clamp((input.steer||0)+correction,-1,1),passIntent:true};
 }
 // Bracing is brief and proportional to a real unsettled landing.
 if(r.hydro.impact>4&&Math.abs(r.hydro.roll)>.2)return {...input,dampen:true,steer:(input.steer||0)*.7};
 return input;
}
