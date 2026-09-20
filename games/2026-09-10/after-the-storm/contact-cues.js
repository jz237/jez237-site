const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
// Presentation uses measured motion and the pressure solver's wet patches.
// Steering alone must not throw a sheet while stationary or in the air.
export function carveLoad(r,side){
 const h=r.hydro,wet=clamp(side>0?(h.starboardWet??h.wet??0):(h.portWet??h.wet??0));
 if(h.airborne||wet===0)return 0;
 const speed=Math.hypot(r.vx||0,r.vz||0),lateral=(r.vx||0)*Math.cos(r.heading)-(r.vz||0)*Math.sin(r.heading);
 const outward=Math.max(0,-side*(r.yawVelocity||0))*speed/9.81;
 return clamp(outward*.60+Math.max(0,side*lateral)/9)*wet*clamp(speed/8);
}
// Smooth, bounded expansion continues through the extended racing speed range.
// Both views and the demo use this lens; no roll, shake or simulation speedup.
export function speedLens(speed){const u=clamp((speed-3)/45);return 58+12*u*u*(3-2*u);}
