// Forage: schools of shiners and young shad. Not catchable; they are what the predators eat and
// what the surface shows. Each school lives on a piece of cover, rides the wind to the downwind
// bank, comes up at dawn and dusk (dimpling the surface) and sinks through the bright hours, and
// scatters in a boil when a predator or a lure comes through it. Pure module; the instanced mesh
// lives in forage-mesh.js. Positions are metres in lake space, y negative below the surface.
import {activityByHour} from './species.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
const HOME_BASE={weedbed:1,pads:.9,dock:.85,riprap:.8,laydown:.7,stump:.6};
// Homes: cover the bait likes, pushed toward whichever bank the wind blows onto.
export function chooseHomes(features,windDir,windMs,random,count=5){
 const wx=Math.cos(windDir),wz=Math.sin(windDir);const push=clamp(windMs/6,0,1);
 const cands=features.filter(f=>HOME_BASE[f.type]);if(!cands.length)return [];
 let cx=0,cz=0;for(const f of cands){cx+=f.x;cz+=f.z;}cx/=cands.length;cz/=cands.length;
 const scored=cands.map(f=>{const down=((f.x-cx)*wx+(f.z-cz)*wz)/120;return {f,v:HOME_BASE[f.type]*(1+push*clamp(down,-1,1))*(1+(random()-.5)*.3)};}).sort((a,b)=>b.v-a.v);
 const out=[];for(let i=0;i<count;i++)out.push(scored[i%scored.length].f);return out;
}
// Depth below the surface the school wants: shallow in low light, deeper when the sun is up.
export function schoolDepth(hour,sunrise=6.5,sunset=19.5){const a=activityByHour(hour,'crepuscular',sunrise,sunset);return .18+(1-a)*2.0;}
export function createForage({features,random=rng(7),count=5,perSchool=36,windDir=0,windMs=0}){
 const homes=chooseHomes(features,windDir,windMs,random,count);
 const schools=homes.map((home,i)=>{const r=Math.max(3,Math.min(9,(home.r||6)*.5));const x=home.x+(random()-.5)*r,z=home.z+(random()-.5)*r;
  const fish=[];for(let k=0;k<perSchool;k++)fish.push({x:x+(random()-.5)*2.4,y:-.4-random()*.4,z:z+(random()-.5)*2.4,vx:0,vy:0,vz:0,phase:random()*6.28,roll:0});
  return {id:i,home,r,x,z,y:-.4,vx:0,vz:0,heading:random()*6.28,phase:random()*6.28,fish,flee:0,fleeX:0,fleeZ:0,depthTarget:.4};});
 return {schools,nextRehome:180,signClock:0};
}
export function rehome(st,features,windDir,windMs,random){const homes=chooseHomes(features,windDir,windMs,random,st.schools.length);st.schools.forEach((s,i)=>{if(homes[i])s.home=homes[i];});}
// One step. threats: [{x,z}] predators or the lure; bed(x,z) → bed height (negative). Returns surface signs.
export function stepForage(st,dt,{t=0,hour=7,sunrise=6.5,sunset=19.5,wind={ms:0,dir:0},bed=null,threats=[],features=null,random=Math.random}={}){
 const signs=[];if(!(dt>0))return signs;const depth=schoolDepth(hour,sunrise,sunset);
 st.nextRehome-=dt;if(st.nextRehome<=0){st.nextRehome=180;if(features)rehome(st,features,wind.dir,wind.ms,random);}
 for(const s of st.schools){
  // where the school wants to be: a slow loop around its home, shallower or deeper by the light
  const tx=s.home.x+Math.cos(t*.04+s.phase)*s.r,tz=s.home.z+Math.sin(t*.031+s.phase*1.7)*s.r;
  let ax=(tx-s.x)*.08,az=(tz-s.z)*.08;
  // threats: scatter away from the nearest one inside 4 m, and show it on top
  let nearest=null,nd=16;for(const th of threats){const d2=(th.x-s.x)**2+(th.z-s.z)**2;if(d2<nd){nd=d2;nearest=th;}}
  if(nearest){const d=Math.sqrt(nd)||.01;s.fleeX=(s.x-nearest.x)/d;s.fleeZ=(s.z-nearest.z)/d;if(s.flee<=0&&s.y>-.7)signs.push({x:s.x,z:s.z,kind:'boil'});s.flee=2.2;}
  if(s.flee>0){s.flee-=dt;ax+=s.fleeX*3.5;az+=s.fleeZ*3.5;}
  s.vx=(s.vx+ax*dt)*.96;s.vz=(s.vz+az*dt)*.96;const sp=Math.hypot(s.vx,s.vz),maxSp=s.flee>0?2.4:.55;if(sp>maxSp){s.vx*=maxSp/sp;s.vz*=maxSp/sp;}
  s.x+=s.vx*dt;s.z+=s.vz*dt;if(sp>.05)s.heading=Math.atan2(s.vx,s.vz);
  let floor=bed?bed(s.x,s.z):-6;
  // bait does not beach itself: a centre that has wandered into water shallower than 60 cm backs off toward home
  if(floor>-.6){s.x-=s.vx*dt*2;s.z-=s.vz*dt*2;s.vx=(s.home.x-s.x)*.25;s.vz=(s.home.z-s.z)*.25;floor=bed?bed(s.x,s.z):-6;}
  s.depthTarget=depth+(s.flee>0?.5:0);const wantY=Math.min(-.12,Math.max(floor+.25,-s.depthTarget));s.y+=(wantY-s.y)*Math.min(1,dt*.6);
  // the fish: a loose cloud around the centre, each with its own wobble; they align to the school's motion
  for(const f of s.fish){const dx=s.x-f.x,dy=s.y-f.y,dz=s.z-f.z;const d=Math.hypot(dx,dz);const pull=d>1.6?1.4:.35;
   f.vx+=(dx*pull+s.vx*1.2+Math.sin(t*1.7+f.phase)*.5)*dt;f.vz+=(dz*pull+s.vz*1.2+Math.cos(t*1.3+f.phase*1.3)*.5)*dt;f.vy+=(dy*1.2+Math.sin(t*2.1+f.phase)*.08)*dt;
   const v=Math.hypot(f.vx,f.vy,f.vz),vmax=s.flee>0?2.8:.9;if(v>vmax){f.vx*=vmax/v;f.vy*=vmax/v;f.vz*=vmax/v;}
   f.vx*=.985;f.vy*=.97;f.vz*=.985;f.x+=f.vx*dt;f.y+=f.vy*dt;f.z+=f.vz*dt;
   const fl=bed?bed(f.x,f.z):-6;if(f.y<fl+.15)f.y=fl+.15;if(f.y>-.05)f.y=-.05;f.phase+=dt*(6+v*6);}
  // nervous water: a shallow school dimples the surface now and then
  if(s.y>-.4&&random()<dt*1.2){const f=s.fish[Math.floor(random()*s.fish.length)];signs.push({x:f.x,z:f.z,kind:'dimple'});}
 }
 return signs;
}
// How much bait is at a point, 0..1: the demo planner and the predators read this.
export function baitAt(st,x,z,radius=8){let best=0;for(const s of st.schools){const d=Math.hypot(s.x-x,s.z-z);best=Math.max(best,clamp(1-d/radius,0,1));}return best;}
export function forageInfo(st){return st.schools.map(s=>({id:s.id,x:+s.x.toFixed(2),z:+s.z.toFixed(2),y:+s.y.toFixed(2),n:s.fish.length,home:s.home.type,flee:+s.flee.toFixed(2)}));}
