import {frontAt,frontWave,frontGLSL} from './weather-front.js';
const clamp=x=>Math.max(0,Math.min(1,x));
// Travelling fronts share position and time across water, foliage, spray and riding.
export function gustAt(x,z,t,storm=0){
 const phase=(x*.86-z*.51-t*(4+storm*4))*.022;
 const band=(Math.sin(phase)*.5+.5)**6;
 const variation=.42+.58*(Math.sin(z*.009+x*.004+t*.013)*.5+.5);
 const strength=clamp(band*variation),speed=2+storm*10+strength*(5+storm*6)+frontAt(x,z,t)*7;
 return {x:speed*.86,z:-speed*.51,strength,speed};
}
export function gustHeight(x,z,t,storm=0){const g=gustAt(x,z,t,storm);return frontWave(x,z,t)+g.strength*(.028+storm*.055)*Math.sin(x*.8+z*.45-t*4.5)*Math.cos(x*.23-z*.51-t*1.8);}
export const gustGLSL=`${frontGLSL}
vec3 gustAt(vec2 p,float t,float s){
 float phase=(p.x*.86-p.y*.51-t*(4.+s*4.))*.022;
 float band=pow(sin(phase)*.5+.5,6.);
 float strength=clamp(band*(.42+.58*(sin(p.y*.009+p.x*.004+t*.013)*.5+.5)),0.,1.);
 float speed=2.+s*10.+strength*(5.+s*6.)+frontAt(p,t)*7.;return vec3(speed*.86,-speed*.51,strength);
}
float gustHeightAt(vec2 p,float t,float s){return frontWave(p,t)+gustAt(p,t,s).z*(.028+s*.055)*sin(p.x*.8+p.y*.45-t*4.5)*cos(p.x*.23-p.y*.51-t*1.8);}
vec3 gustSurface(vec2 p,float t,float s){float e=.12;return vec3(gustHeightAt(p,t,s),(gustHeightAt(p+vec2(e,0.),t,s)-gustHeightAt(p-vec2(e,0.),t,s))/(2.*e),(gustHeightAt(p+vec2(0.,e),t,s)-gustHeightAt(p-vec2(0.,e),t,s))/(2.*e));}
`;
