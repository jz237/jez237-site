// One travelling weather boundary for clouds, rain, wind and wave pressure.
export const frontEnabled={value:0};
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export function frontDistance(x,z,t){return x*.86-z*.51-(520-t*2.7);}
export function frontAt(x,z,t){return frontEnabled.value*smooth(-90,90,frontDistance(x,z,t));}
export function frontWave(x,z,t){return frontAt(x,z,t)*(.23*Math.sin(x*.28-z*.17-t*1.65)+.10*Math.sin(x*.61+z*.39-t*2.5));}
export const frontGLSL=`
#ifndef COAST_WEATHER_FRONT
#define COAST_WEATHER_FRONT
uniform float frontEnabled;
float frontDistance(vec2 p,float t){return dot(p,vec2(.86,-.51))-(520.-t*2.7);}
float frontAt(vec2 p,float t){return frontEnabled*smoothstep(-90.,90.,frontDistance(p,t));}
float frontWave(vec2 p,float t){return frontAt(p,t)*(.23*sin(p.x*.28-p.y*.17-t*1.65)+.10*sin(p.x*.61+p.y*.39-t*2.5));}
#endif
`;
