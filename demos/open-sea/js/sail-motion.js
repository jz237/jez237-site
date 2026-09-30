import {clamp,smoothstep} from './math.js';

// Bounded displacement in metres and angular frequency in radians/second.
// Cloth phase advances with the bounded yacht step. Changing wind must change
// phase velocity, never multiply a new rate by the whole age of the page.
export function sailWind(wind,reef){
  const U=clamp(wind,0,35),breeze=smoothstep(.2,5,U),strong=smoothstep(5,22,U);
  return {amplitude:(.018+.44*breeze+.16*strong)*(1-.35*reef),rate:3.4+2.5*breeze+2.0*strong};
}

export function advanceSailPhases(phases,rate,dt){
  const step=clamp(dt,0,.1),tau=Math.PI*2;
  for(let i=0;i<phases.length/2;i++){
    const speed=rate*(.90+.06*i);
    phases[i*2]=(phases[i*2]+speed*step)%tau;
    phases[i*2+1]=(phases[i*2+1]+speed*1.71*step)%tau;
  }
}

export const SAIL_MOTION_GLSL=`
uniform vec3 uSailWind; // traveling phase, ripple phase, independent sail seed
float clothFlutter(vec2 uv,float time,float amplitude,float headsail){
  const float PI=3.141592653589793,TAU=6.283185307179586;
  float u=clamp(uv.x,0.0,1.0),v=clamp(uv.y,0.0,1.0),phase=uSailWind.z;
  float span=max(sin(PI*v),0.0),across=max(sin(PI*u),0.0);
  // Fixed luff and three corners. The mainsail foot is held by its boom;
  // a headsail has a free foot between its fixed tack and sheeted clew.
  float leech=pow(u,1.5)*span;
  float freeFoot=max(headsail,0.0)*across*(1.0-v)*(1.0-v)*.65;
  float body=across*span;
  float gust=.72+.28*sin(time*.61+phase+.35*sin(time*.17+phase));
  float travel=sin(TAU*(1.45*u-.36*v)-uSailWind.x+phase+.3*sin(time*.43+phase));
  float ripple=sin(TAU*(3.4*u+.75*v)-uSailWind.y+phase*1.93);
  float breathe=sin(time*1.13+phase-TAU*u+v);
  return amplitude*gust*((leech+freeFoot)*(.84*travel+.22*ripple)+.35*body*breathe);
}`;
