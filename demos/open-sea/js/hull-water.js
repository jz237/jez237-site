import {glslFloat as F} from './vessels.js';
// The closed hull used by the Blender builder, evaluated in the moving boat
// frame. This is a water/solid boundary, not a full fluid collision solver.
import {canonicalSheer as sheer,canonicalBeam as halfBeam,SX,SY,SZ,imperial} from './vessels.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const hullBottom=x=>-3.15*Math.sqrt(Math.max(.05,1-(x/25.5)**2));
function rake(x,y){const b=hullBottom(x),v=Math.acos(clamp(1-(y-b)/(sheer(x)-b),0,1))*2/Math.PI;return 2.7*clamp((x-18.5)/5,0,1)**3*(1-v);}
function sectionBase(x,y){
 let station=clamp(x,-23.5,23.5);
 const maxStation=y<0?Math.min(23.5,25.5*Math.sqrt(Math.max(0,1-(y/3.15)**2))):23.5;
 const solve=start=>{let q=clamp(start,-23.5,maxStation);for(let i=0;i<8;i++){const r=rake(q,y),dr=(rake(q+.001,y)-rake(q-.001,y))/.002;const d=1-dr;q=clamp(q-(q-r-x)/(Math.abs(d)>.08?d:Math.sign(d||1)*.08),-23.5,maxStation);}return q;};
 if(x>16)station=solve(station);
 const width=q=>{const b=hullBottom(q),c=clamp(1-(y-b)/(sheer(q)-b),0,1);return halfBeam(q)*Math.pow(Math.sqrt(Math.max(0,1-c*c)),.78);};
 if(x>19&&y<-.9){const q=solve(maxStation-.08);if(Math.abs(q-rake(q,y)-x)<.01&&width(q)>width(station))station=q;}
 const bottom=hullBottom(station),top=sheer(station),c=clamp(1-(y-bottom)/(top-bottom),0,1);
 return{station,bottom,top,width:halfBeam(station)*Math.pow(Math.sqrt(Math.max(0,1-c*c)),.78),residual:x>16?Math.abs(station-rake(station,y)-x):0};
}
const houses=[[-10.8,9.2,6,2.1],[2.7,6.2,4.7,1.1],[12,3.8,3.2,.95]];
function boxGap(p,center,half,r){const q=p.map((v,i)=>Math.abs(v-center[i])-half[i]+r);return Math.hypot(...q.map(v=>Math.max(v,0)))+Math.min(Math.max(...q),0)-r;}
const quarterRise=x=>{const t=clamp((-x-29)/6,0,1);return imperial?3*t*t*(3-2*t):0;};
export function hullSection(x,y){const q=sectionBase(x/SX,y/SY);return{station:q.station*SX,bottom:q.bottom*SY,top:q.top*SY+quarterRise(x),width:q.width*SZ,residual:q.residual*SX};}
export function hullSolidGap([x,y,z]){x/=SX;y/=SY;z/=SZ;
 const s=sectionBase(x,y);let gap=Math.max(-23.5-x,x-23.5,s.residual>.01?s.residual:-1e3,Math.abs(z)-s.width,s.bottom-y,y-s.top-quarterRise(x*SX)/SY-.055*(1-(z/Math.max(halfBeam(s.station)*.995,.001))**2));
 for(const [cx,len,width,height] of (imperial?[]:houses)){const b=sheer(cx)+.10;gap=Math.min(gap,boxGap([x,y,z],[cx,b+height*.5,0],[len*.5,height*.5,width*.5],.15),boxGap([x,y,z],[cx,b+height+.065,0],[(len+.24)*.5,.065,(width+.22)*.5],.04));}
 return gap*Math.min(SX,SY,SZ);
}
export function bindHullWater(p,yacht,cam,enabled=true){
 p.v4('uHullCenter',yacht.x-cam.x,yacht.y-cam.y,yacht.z-cam.z,enabled?1:0)
  .v3('uHullBow',yacht.axes.bow).v3('uHullUp',yacht.axes.up).v3('uHullSide',yacht.axes.sb)
  .f('uHullSpeed',Math.min(14,Math.max(0,yacht.speed)));
}
export const HULL_WATER_GLSL=`
uniform vec4 uHullCenter;
uniform vec3 uHullBow,uHullUp,uHullSide;
uniform float uHullSpeed;
vec3 hullLocal(vec3 rel){vec3 d=rel-uHullCenter.xyz;return vec3(dot(d,uHullBow),dot(d,uHullUp),dot(d,uHullSide));}
float hullBeamBase(float x){
 if(x>=-2.0)return 4.65*pow(max(0.0,1.0-pow(max(0.0,(x+2.0)/25.5),2.1)),.7);
 return 4.65*(1.0-.4*pow(clamp((-2.0-x)/21.5,0.0,1.0),2.4));
}
float hullTopBase(float x){return 2.6+(x>0.0?.0018:.0007)*x*x;}
float hullBottomBase(float x){return -3.15*sqrt(max(.05,1.0-x*x/(25.5*25.5)));}
float hullRakeBase(float x,float y){
 float b=hullBottomBase(x),v=acos(clamp(1.0-(y-b)/(hullTopBase(x)-b),0.0,1.0))*2.0/PI;
 float r=clamp((x-18.5)/5.0,0.0,1.0);return 2.7*r*r*r*(1.0-v);
}
float hullWidthBase(float x,float y){float b=hullBottomBase(x),c=clamp(1.0-(y-b)/(hullTopBase(x)-b),0.0,1.0);return hullBeamBase(x)*pow(sqrt(max(0.0,1.0-c*c)),.78);}
float hullStationBase(float start,vec2 p,float upper){
 float x=clamp(start,-23.5,upper);
 for(int i=0;i<8;i++){
  float r=hullRakeBase(x,p.y),dr=(hullRakeBase(x+.001,p.y)-hullRakeBase(x-.001,p.y))/.002,d=1.0-dr;
  d=abs(d)>.08?d:(d<0.0?-.08:.08);x=clamp(x-(x-r-p.x)/d,-23.5,upper);
 }
 return x;
}
// width, bottom, station, inversion error. The lower bow can have two
// sections at the same X/Y; retain the outer skin, including its overhang.
vec4 hullSectionBase(vec2 p){
 float x=clamp(p.x,-23.5,23.5);
 float upper=p.y<0.0?min(23.5,25.5*sqrt(max(0.0,1.0-p.y*p.y/(3.15*3.15)))):23.5;
 if(p.x>16.0)x=hullStationBase(x,p,upper);
 if(p.x>19.0&&p.y<-.9){float q=hullStationBase(upper-.08,p,upper);if(abs(q-hullRakeBase(q,p.y)-p.x)<.01&&hullWidthBase(q,p.y)>hullWidthBase(x,p.y))x=q;}
 float bottom=hullBottomBase(x),c=clamp(1.0-(p.y-bottom)/(hullTopBase(x)-bottom),0.0,1.0);
 float width=hullBeamBase(x)*pow(sqrt(max(0.0,1.0-c*c)),.78);
 return vec4(width,bottom,x,p.x>16.0?abs(x-hullRakeBase(x,p.y)-p.x):0.0);
}
float hullBoxGap3(vec3 p,vec3 center,vec3 halfSize,float r){vec3 q=abs(p-center)-halfSize+r;return length(max(q,0.0))+min(max(max(q.x,q.y),q.z),0.0)-r;}
float hullSolidGapBase(vec3 p){
 vec4 s=hullSectionBase(p.xy);float beam=max(hullBeamBase(s.z)*.995,.001);
 float deck=hullTopBase(s.z)+.055*(1.0-p.z*p.z/(beam*beam));
 ${imperial?`float qt=clamp((-p.x*${F(SX)}-29.0)/6.0,0.0,1.0);deck+=${F(3/SY)}*qt*qt*(3.0-2.0*qt);`:''}
 float gap=max(max(max(-23.5-p.x,p.x-23.5),s.w>.01?s.w:-1000.0),max(abs(p.z)-s.x,max(s.y-p.y,p.y-deck)));
 for(int i=0;i<${imperial?0:3};i++){
  vec4 house=i==0?vec4(-10.8,9.2,6.0,2.1):i==1?vec4(2.7,6.2,4.7,1.1):vec4(12.0,3.8,3.2,.95);
  float b=hullTopBase(house.x)+.10;
  gap=min(gap,hullBoxGap3(p,vec3(house.x,b+house.w*.5,0),vec3(house.y*.5,house.w*.5,house.z*.5),.15));
  gap=min(gap,hullBoxGap3(p,vec3(house.x,b+house.w+.065,0),vec3((house.y+.24)*.5,.065,(house.z+.22)*.5),.04));
 }
 return gap;
}

const vec3 shipScale=vec3(${F(SX)},${F(SY)},${F(SZ)});
float hullBeam3(float x){return hullBeamBase(x/shipScale.x)*shipScale.z;}
float hullTop3(float x){return hullTopBase(x/shipScale.x)*shipScale.y;}
float hullBottom3(float x){return hullBottomBase(x/shipScale.x)*shipScale.y;}
vec4 hullSection3(vec2 p){vec4 s=hullSectionBase(p/shipScale.xy);return s*vec4(shipScale.z,shipScale.y,shipScale.x,shipScale.x);}
float hullSolidGap3(vec3 p){return hullSolidGapBase(p/shipScale)*min(min(shipScale.x,shipScale.y),shipScale.z);}
float hullRunup(vec3 rel){
 if(uHullCenter.w<.5||length(rel-uHullCenter.xyz)>${F(31*Math.max(SX,SY,SZ))})return 0.0;
 vec3 p=hullLocal(rel);float gap=hullSolidGap3(p);
 float contact=smoothstep(-.08,.03,gap)*smoothstep(1.8,.02,gap);
 return min(.38,.010*uHullSpeed*uHullSpeed)*contact*smoothstep(${F(6*SX)},${F(22*SX)},p.x)*smoothstep(${F(3.6*SY)},${F(2.6*SY)},p.y);
}
`;
