import * as T from 'three';
export const waterY=0, RX=9.3, RZ=6.6;
export function seeded(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
export function edge(a){const r=1+.13*Math.sin(a*3+.35)+.075*Math.cos(a*2)-.04*Math.cos(a*5);return new T.Vector3(Math.cos(a)*RX*r,0,Math.sin(a)*RZ*r);}
export function shoreDistance(x,z){const p=edge(Math.atan2(z/RZ,x/RX));return Math.hypot(x,z)-Math.hypot(p.x,p.z);}
export function inside(x,z,margin=0){return shoreDistance(x,z)<-margin;}
export function bottom(x,z){const d=shoreDistance(x,z),t=T.MathUtils.clamp(1+d/2.7,0,1);return -1.88+2.04*t*t*(3-2*t)+.08*Math.sin(x*.65)*Math.cos(z*.74)*(1-t);}
export function landHeight(x,z){const d=Math.max(0,shoreDistance(x,z)),blend=T.MathUtils.smoothstep(d,0,2.8);const hill=(cx,cz,r,h)=>h*Math.exp(-((x-cx)**2+(z-cz)**2)/(r*r));return .16+blend*(.22+.18*Math.sin(x*.39)*Math.cos(z*.36)+hill(-9,-9,5,1.7)+hill(7,-10,5.4,1.9)+hill(11,3,3.5,.65)+hill(-12,5,3.8,.75));}
export function pondShape(){const s=new T.Shape();for(let i=0;i<=256;i++){const p=edge(i/256*Math.PI*2);if(i)s.lineTo(p.x,-p.z);else s.moveTo(p.x,-p.z);}s.closePath();return s;}
export function waterGeometry(){const p=[],depth=[],index=[],rings=40,segments=192;for(let i=0;i<=rings;i++)for(let j=0;j<=segments;j++){const q=edge(j/segments*Math.PI*2).multiplyScalar(Math.max(.0001,i/rings));p.push(q.x,0,q.z);depth.push(Math.max(0,-bottom(q.x,q.z)));}for(let i=0;i<rings;i++)for(let j=0;j<segments;j++){const a=i*(segments+1)+j;index.push(a,a+1,a+segments+2,a,a+segments+2,a+segments+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('pondDepth',new T.Float32BufferAttribute(depth,1));g.setIndex(index);g.computeVertexNormals();return g;}
