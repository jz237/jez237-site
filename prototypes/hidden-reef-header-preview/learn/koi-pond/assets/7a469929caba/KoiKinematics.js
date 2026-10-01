// One head-pinned curve for skin, fins, contact sampling and underwater shadows.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function spineOffset(s,phase,amp,bend){
 const u=Math.max(0,(s-.20)/.8);
 return u*u*(amp*Math.sin(s*5.7-phase)+bend*.55);
}
export function spineSlope(s,phase,amp,bend){
 const u=Math.max(0,(s-.20)/.8);
 return 2*u/ .8*(amp*Math.sin(s*5.7-phase)+bend*.55)+u*u*amp*5.7*Math.cos(s*5.7-phase);
}
export const spineGLSL=`
float koiLat(float s){
 float u=max(0.0,(s-0.20)/0.8);
 return u*u*(aSwim.y*sin(s*5.7-aSwim.x)+aSwim.z*0.55);
}
float koiLatD(float s){
 float u=max(0.0,(s-0.20)/0.8);
 return 2.0*u/0.8*(aSwim.y*sin(s*5.7-aSwim.x)+aSwim.z*0.55)+u*u*aSwim.y*5.7*cos(s*5.7-aSwim.x);
}`;
export function limitAttitude(vy,speed){return clamp(Math.atan2(vy,Math.max(speed,.1))*.5,-.16,.16);}
export function advanceNeeds(f,dt,feeding){
 if(dt<=0)return;
 f.hunger=clamp(f.hunger+dt*.0012,0,1);
 f.energy=clamp(f.energy+dt*(f.bursting?-.011:.006),.2,1);
 if(f.memory){f.memory.age+=dt;if(f.memory.age>24)f.memory=null;}
 f.depthClock-=dt;
 if(f.depthClock<=0&&!feeding){
  // A different smooth target for every individual; avoid all rising together.
  f.depthPhase+=1.3+f.curiosity*.43;
  f.prefDepth=.22+.65*(.5+.5*Math.sin(f.depthPhase));
  f.depthClock=12+10*f.curiosity;
 }
}
export function depthTarget(f,time,floorDepth){
 const exploration=.085*Math.sin(time*.085+f.depthPhase)+.045*Math.sin(time*.137+f.depthPhase*2.1);
 return -clamp(f.prefDepth+exploration,.16,Math.max(.16,floorDepth-f.size*.17-.035));
}
