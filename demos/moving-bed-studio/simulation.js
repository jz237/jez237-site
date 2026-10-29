// Deterministic kinematic flow field + conservative sphere contacts.
// A readable circulation study, not CFD, calibrated buoyancy or rib-level rigid bodies.
import {conditions} from './data.js?v=3';
export const MAX=660,R=.15,BOUNDS={x:1.65,z:1.13,bottom:.52,top:3.08};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function createSimulation(){
 let seed=8219;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const p=new Float32Array(MAX*3),v=new Float32Array(MAX*3),angles=new Float32Array(MAX*3),spin=new Float32Array(MAX*3),phase=new Float32Array(MAX);
 const slots=Array.from({length:11*8*9},(_,i)=>i);for(let i=slots.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[slots[i],slots[j]]=[slots[j],slots[i]];}
 for(let i=0;i<MAX;i++){const slot=slots[i],x=slot%11,z=Math.floor(slot/11)%8,y=Math.floor(slot/88);p.set([-1.6+x*.32+(random()-.5)*.012,.56+y*.31+(random()-.5)*.012,-1.08+z*.308+(random()-.5)*.012],i*3);phase[i]=random()*Math.PI*2;for(let j=0;j<3;j++){angles[i*3+j]=random()*6.28;spin[i*3+j]=(random()-.5)*2;}}
 const originalPositions=p.slice(),originalAngles=angles.slice();
 let clock=0,air=0,count=354,meanSpeed=0,contacts=0;
 function reset(){p.set(originalPositions);angles.set(originalAngles);v.fill(0);clock=0;air=0;count=354;meanSpeed=contacts=0;}
 function constrain(i){const k=i*3;for(const [j,lo,hi] of [[0,-BOUNDS.x,BOUNDS.x],[1,BOUNDS.bottom,BOUNDS.top],[2,-BOUNDS.z,BOUNDS.z]]){if(p[k+j]<lo){p[k+j]=lo;v[k+j]=Math.abs(v[k+j])*.15;}if(p[k+j]>hi){p[k+j]=hi;v[k+j]=-Math.abs(v[k+j])*.15;}}}
 function step(dt,s){
  const h=conditions(s);count=Math.min(MAX,h.count);clock+=dt;air+=(h.air-air)*Math.min(1,dt*2.2);const strength=air/(.55+h.load*1.5),grid=new Map(),cell=R*2;
  for(let i=0;i<count;i++){
   const k=i*3,x=p[k],y=p[k+1],z=p[k+2],f=clamp((y-BOUNDS.bottom)/(BOUNDS.top-BOUNDS.bottom),0,1),ph=phase[i];
   const targetX=strength*.82*Math.tanh(x*3)*Math.sin((f-.5)*Math.PI)+strength*.11*Math.sin(clock*.83+ph+z*2);
   const targetY=strength*1.35*Math.cos(x/BOUNDS.x*Math.PI)*Math.sin(f*Math.PI)+.055+strength*.13*Math.sin(clock*1.2+ph+x*3);
   const targetZ=strength*.30*Math.sin(clock*.51+x*2.8+ph*.12)*Math.cos(z/BOUNDS.z*Math.PI/2)+h.water*.035;
   const drag=1-Math.exp(-dt*2.8);for(let j=0;j<3;j++){v[k+j]+=([targetX,targetY,targetZ][j]-v[k+j])*drag;p[k+j]+=v[k+j]*dt;angles[k+j]+=spin[k+j]*dt*(strength*.85+Math.hypot(v[k],v[k+1],v[k+2])*.3);}
   constrain(i);
  }
  contacts=0;
  // Three position-based sweeps prevent large overlaps without an O(n²) search.
  for(let pass=0;pass<3;pass++){
   grid.clear();for(let i=0;i<count;i++){const k=i*3,key=`${Math.floor(p[k]/cell)},${Math.floor(p[k+1]/cell)},${Math.floor(p[k+2]/cell)}`;if(!grid.has(key))grid.set(key,[]);grid.get(key).push(i);}
   for(let i=0;i<count;i++){const k=i*3,cx=Math.floor(p[k]/cell),cy=Math.floor(p[k+1]/cell),cz=Math.floor(p[k+2]/cell);
    for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++)for(const j of grid.get(`${cx+dx},${cy+dy},${cz+dz}`)||[]){if(j<=i)continue;const l=j*3;let ax=p[k]-p[l],ay=p[k+1]-p[l+1],az=p[k+2]-p[l+2],d=Math.hypot(ax,ay,az);if(d>=cell)continue;if(d<1e-6){ax=1;ay=az=0;d=1;}const overlap=(cell-d)*.505;ax/=d;ay/=d;az/=d;p[k]+=ax*overlap;p[k+1]+=ay*overlap;p[k+2]+=az*overlap;p[l]-=ax*overlap;p[l+1]-=ay*overlap;p[l+2]-=az*overlap;const closing=(v[k]-v[l])*ax+(v[k+1]-v[l+1])*ay+(v[k+2]-v[l+2])*az;if(closing<0){for(const [q,a] of [[0,ax],[1,ay],[2,az]]){v[k+q]-=closing*a*.40;v[l+q]+=closing*a*.40;}}if(pass===0)contacts++;}
    constrain(i);
   }
  }
  meanSpeed=0;for(let i=0;i<count;i++)meanSpeed+=Math.hypot(v[i*3],v[i*3+1],v[i*3+2]);meanSpeed/=count;
 }
 function snapshot(){let minY=Infinity,maxY=-Infinity,surface=0,finite=true;for(let i=0;i<count;i++){const k=i*3;minY=Math.min(minY,p[k+1]);maxY=Math.max(maxY,p[k+1]);if(p[k+1]>2.75)surface++;for(let j=0;j<3;j++)finite&&=Number.isFinite(p[k+j]);}return {clock,count,air,meanSpeed,contacts,minY,maxY,surfaceFraction:surface/count,finite,tracked:[...p.slice(0,3)],trackedAngles:[...angles.slice(0,3)]};}
 return {p,v,angles,phase,step,reset,snapshot,get count(){return count;}};
}
