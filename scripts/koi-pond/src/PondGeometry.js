import * as T from 'three';
export const waterY=0;
export function seeded(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
export function edge(a){const r=1+.065*Math.sin(a*3+.3)+.035*Math.cos(a*5);return new T.Vector3(Math.cos(a)*4.4*r,0,Math.sin(a)*3.05*r);}
export function inside(x,z,margin=0){const a=Math.atan2(z/3.05,x/4.4),p=edge(a);return Math.hypot(x/4.4,z/3.05)<Math.hypot(p.x/4.4,p.z/3.05)-margin/3.05;}
export function bottom(x,z){const a=Math.atan2(z/3.05,x/4.4),p=edge(a),r=Math.hypot(x/4.4,z/3.05)/Math.hypot(p.x/4.4,p.z/3.05);const t=T.MathUtils.clamp((r-.43)/.57,0,1);return -1.28+1.39*t*t*(3-2*t)+.025*Math.sin(x*1.9)*Math.cos(z*2.1)*(1-t);}
export function pondShape(){const s=new T.Shape();for(let i=0;i<=180;i++){const p=edge(i/180*Math.PI*2);if(i)s.lineTo(p.x,-p.z);else s.moveTo(p.x,-p.z);}s.closePath();return s;}
export function waterGeometry(){const g=new T.ShapeGeometry(pondShape(),64);g.rotateX(-Math.PI/2);return g;}
