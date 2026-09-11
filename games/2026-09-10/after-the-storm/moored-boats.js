import {floatingPose} from './course-environment.js';
import {polygonDistance} from './classic-courses.js';
import {wave} from './simulation.js';
export function mooredBoatOutline(b){return [[0,-.5],[.36,-.36],[.5,-.12],[.48,.45],[-.48,.45],[-.5,-.12],[-.36,-.36]].map(([x,z])=>[x*b.width,z*b.length]);}
export function mooredBoatPose(b,time,storm){return floatingPose(b.x,b.z,time,(x,z,t)=>wave(x,z,t,storm),b.length*.4,b.heading||0);}
export function mooredBoatCollision(boats,x,y,z,time,storm,radius=.85,height=1.1){
 for(const b of boats||[]){if(Math.hypot(x-b.x,z-b.z)>b.length+radius)continue;const p=mooredBoatPose(b,time,storm),a=b.heading||0,dx=x-b.x,dz=z-b.z,dy=y-p.y;
  const xx=Math.cos(a)*dx-Math.sin(a)*dz,zz=Math.sin(a)*dx+Math.cos(a)*dz,yy=Math.cos(p.pitch)*dy+Math.sin(p.pitch)*zz,lz=-Math.sin(p.pitch)*dy+Math.cos(p.pitch)*zz,lx=Math.cos(p.roll)*xx+Math.sin(p.roll)*yy,ly=-Math.sin(p.roll)*xx+Math.cos(p.roll)*yy;
  if(ly<.85&&ly+height>-.45&&polygonDistance(mooredBoatOutline(b),lx,lz)<radius)return true;
  if(ly<2.35&&ly+height>.85&&Math.abs(lx)<b.width*.45+radius&&lz> -1.3-radius&&lz<3+radius)return true;
 }return false;
}

export function mooredBoatCamera(boats,target,desired,time,storm){let clear={...target};for(let i=1;i<=48;i++){const t=i/48,p={x:target.x+(desired.x-target.x)*t,y:target.y+(desired.y-target.y)*t,z:target.z+(desired.z-target.z)*t};if(mooredBoatCollision(boats,p.x,p.y,p.z,time,storm,.25,.25))return clear;clear=p;}return desired;}
