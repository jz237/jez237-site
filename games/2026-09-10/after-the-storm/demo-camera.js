const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const angle=v=>Math.atan2(Math.sin(v),Math.cos(v));
// Follow actual travel rather than every handlebar correction. Angular speed
// and acceleration are bounded, including across the +/- pi seam.
export function demoCameraFrame(memory,r,racers,dt,{orbit=0,zoom=19,pitch=.25}={}){
 dt=clamp(dt,0,.1);
 if(!memory.initialized){Object.assign(memory,{initialized:true,heading:r.heading,rate:0});}
 const travel=Math.hypot(r.vx,r.vz)>5?Math.atan2(r.vx,r.vz):memory.heading;
 const error=angle(travel-memory.heading);
 const wanted=clamp(error*1.1,-.45,.45);
 memory.rate+=clamp(wanted-memory.rate,-.65*dt,.65*dt);
 memory.heading=angle(memory.heading+memory.rate*dt);
 const heading=memory.heading+clamp(orbit,-.35,.35),fx=Math.sin(heading),fz=Math.cos(heading);
 let x=r.x,z=r.z,weight=1;
 for(const q of racers){if(q===r||q.dq)continue;const dx=q.x-r.x,dz=q.z-r.z,d=Math.hypot(dx,dz);if(d<38&&dx*fx+dz*fz>0){const w=.25*(1-d/38);x+=q.x*w;z+=q.z*w;weight+=w;}}
 x=x/weight+fx*3;z=z/weight+fz*3;
 const distance=clamp(zoom,17,24),water=Number.isFinite(r.hydro.waterHeight)?r.hydro.waterHeight:0;
 return {position:{x:r.x-fx*distance,y:water+3+Math.sin(clamp(pitch,.18,.35))*distance,z:r.z-fz*distance},target:{x,y:water+.8,z}};
}
