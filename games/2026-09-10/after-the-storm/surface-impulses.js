// Local landing disturbances, in metres/seconds. This exact field is evaluated
// both by hull support and by the water shader; it remains where the impact occurred.
export const impactWaves=Array.from({length:12},()=>({x:0,z:0,time:-100,amplitude:0}));
let cursor=0;
export function clearImpacts(){cursor=0;for(const w of impactWaves){w.time=-100;w.amplitude=0;}}
export function addImpact(x,z,time,velocity){const w=impactWaves[cursor++%impactWaves.length];Object.assign(w,{x,z,time,amplitude:Math.min(.16,Math.max(0,velocity-1.5)*.021)});}
export function impactHeight(x,z,time){let h=0;for(const w of impactWaves){const age=time-w.time;if(w.amplitude===0||age<0||age>7)continue;const radius=Math.hypot(x-w.x,z-w.z),front=radius-(.65+age*2.6);h+=w.amplitude*Math.sin(front*5)*Math.exp(-front*front*1.3-age*.65)*(1-Math.exp(-age*12));}return h;}
export const impactGLSL=`uniform vec4 impactWaves[12];
float impactHeight(vec2 p){float h=0.;for(int i=0;i<12;i++){vec4 w=impactWaves[i];float age=time-w.z;if(w.w<=0.||age<0.||age>7.)continue;float front=length(p-w.xy)-(.65+age*2.6);h+=w.w*sin(front*5.)*exp(-front*front*1.3-age*.65)*(1.-exp(-age*12.));}return h;}`;
