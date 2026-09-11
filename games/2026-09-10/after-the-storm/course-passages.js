const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function coordinates(a,b,x,z){const dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);return {along:((x-a.x)*dx+(z-a.z)*dz)/length,across:((x-a.x)*dz-(z-a.z)*dx)/length,length};}
export function passageDistance(p,x,z){let d=Infinity;for(let i=1;i<p.path.length;i++){const a=p.path[i-1],b=p.path[i],q=coordinates(a,b,x,z);d=Math.min(d,Math.hypot(q.across,q.along-clamp(q.along,0,q.length)));}return d;}
export function passagePoint(path,f){const lengths=path.slice(1).map((b,i)=>Math.hypot(b.x-path[i].x,b.z-path[i].z)),total=lengths.reduce((a,b)=>a+b,0);let distance=clamp(f,0,1)*total;
 for(let i=0;i<lengths.length;i++){const length=lengths[i];if(distance<=length||i===lengths.length-1){const a=path[i],b=path[i+1],t=clamp(distance/length,0,1);return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,tx:(b.x-a.x)/length,tz:(b.z-a.z)/length};}distance-=length;}
}
export function configurePassage(course){
 if(!['citadel','port'].includes(course.id))return;
 // Select the same geographical bend in every sampling density and direction.
 const near=(x,z)=>course.gates.reduce((best,g,i)=>Math.hypot(g.x-x,g.z-z)<Math.hypot(course.gates[best].x-x,course.gates[best].z-z)?i:best,0);
 const authored=course.shortcut;let first=near(...(authored?.from||[50,108])),last=near(...(authored?.to||[85,-6]));if(course.reverse)[first,last]=[last,first];
 const a=course.gates[first],b=course.gates[last],via=(authored?.via||[]).map(([x,z])=>({x,z}));if(course.reverse)via.reverse();const path=[{x:a.x,z:a.z},...via,{x:b.x,z:b.z}];
 const p={kind:authored?.kind||(course.id==='citadel'?'gate':'tunnel'),first,last,path,width:authored?.width||(course.id==='citadel'?8:6),clearance:authored?.clearance||(course.id==='citadel'?5.5:4.3),enabled:course.difficulty>0,indices:[]};
 if(authored)p.structurePath=authored.structure.map(([x,z])=>({x,z}));
 let i=(first+1)%course.gates.length;
 while(i!==last){p.indices.push(i);const g=course.gates[i];g.side=0;if(!authored){g.tx=(b.x-a.x)/Math.hypot(b.x-a.x,b.z-a.z);g.tz=(b.z-a.z)/Math.hypot(b.x-a.x,b.z-a.z);g.width=65;}g.channel=true;g.bx=g.x;g.bz=g.z;i=(i+1)%course.gates.length;}
 if(authored){p.branchGates={};p.indices.forEach((index,i)=>p.branchGates[index]={...passagePoint(path,(i+1)/(p.indices.length+1)),side:0,width:p.width+2,channel:true});}
 course.passage=p;
 if(!authored)course.rocks=course.rocks.filter(q=>passageDistance(p,q.x,q.z)>p.width+4);
}
export function passageOpening(p,time,openedAt=Infinity){if(!p?.enabled)return 0;if(p.kind==='tunnel')return 1;return clamp((time-openedAt)/3,0,1);}
export function passageTarget(s,r){
 const g=s.course.gates[r.next],p=s.course.passage;
 if(s.mode==='stunt'||r.passageRoute==='outer'||!p||!(p.indices.includes(r.next)||r.next===p.first)||passageOpening(p,s.time,s.passageOpenedAt)<.98)return g;
 if(p.branchGates)return p.branchGates[r.next]||g;
 // Intersection with the original checkpoint plane: no progress is granted here.
 const a=p.path[0],b=p.path.at(-1),dx=b.x-a.x,dz=b.z-a.z,den=dx*g.tx+dz*g.tz;
 const t=clamp(((g.x-a.x)*g.tx+(g.z-a.z)*g.tz)/den,0,1),length=Math.hypot(dx,dz);
 return {...g,x:a.x+dx*t,z:a.z+dz*t,tx:dx/length,tz:dz/length,side:0};
}
export function passageCollision(p,x,y,z,time,openedAt=Infinity,radius=.85,hullHeight=1.1){
 if(!p)return false;
 const geometry=p.structurePath||p.path;for(let i=1;i<geometry.length;i++){
  const a=geometry[i-1],b=geometry[i],q=coordinates(a,b,x,z);
  // Structures occupy the central 50%, leaving open funnels at both ends.
  if(q.along<q.length*.32-radius||q.along>q.length*.82+radius)continue;
  if(y<8&&y> -3&&Math.abs(Math.abs(q.across)-(p.width+.55))<.55+radius)return true;
  if(Math.abs(q.across)<p.width+radius&&y+hullHeight>p.clearance&&y<8)return true;
  if(Math.abs(q.along-q.length*.36)<.25+radius&&Math.abs(q.across)<p.width+radius){
   const bottom=-1+passageOpening(p,time,openedAt)*(p.clearance+1.5);
   if(y+hullHeight>bottom&&y<bottom+5.5)return true;
  }
 }
 return false;
}
// Shorten the sight line before it crosses a wall, roof or moving gate.
export function passageCamera(p,target,desired,time,openedAt=Infinity){
 if(!p)return desired;
 let clear={x:target.x,y:target.y,z:target.z};
 for(let i=1;i<=64;i++){const t=i/64,q={x:target.x+(desired.x-target.x)*t,y:target.y+(desired.y-target.y)*t,z:target.z+(desired.z-target.z)*t};
  if(passageCollision(p,q.x,q.y,q.z,time,openedAt,.25,.25))return clear;
  clear=q;
 }
 return desired;
}


