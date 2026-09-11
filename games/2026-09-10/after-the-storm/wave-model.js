import {surfHeight,surfGLSL} from './surf-waves.js';
import {waveTrainHeight,waveTrainGLSL} from './course-wave-train.js';
// Analytic trochoidal waves. CPU queries invert the horizontal displacement;
// GPU vertices use the forward map. Both operate in metres and real seconds.
export const WAVES=Array.from({length:14},(_,i)=>{const angle=.78+Math.sin(i*2.399)*1.05,k=.085*Math.pow(1.34,i)/(i<4?2.1:1);return [Math.cos(angle),Math.sin(angle),k,.18*Math.pow(.73,i)*(i<4?2.1:1),Math.sqrt(9.81*k),(i*2.39996323+.71)%(Math.PI*2)];});
export const CHOP=1.65;
export function displacedSurface(x,z,t,storm=0){let px=x,pz=z,y=0;const scale=1+storm*2.3;
 for(let i=0;i<WAVES.length;i++){const [dx,dz,k,a,w,ph]=WAVES[i],f=(x*dx+z*dz)*k-t*w+ph,A=a*scale;y+=(Math.sin(f)+.12*Math.sin(2*f))*A;if(i<6){const d=CHOP*A*Math.cos(f);px+=dx*d;pz+=dz*d;}}
 return {x:px,z:pz,y:y+waveTrainHeight(px,pz,t)+surfHeight(px,pz,t)};
}
export function sampleSwell(x,z,t,storm=0){let qx=x,qz=z;const scale=1+storm*2.3;
 for(let j=0;j<4;j++){let dx=0,dz=0;for(let i=0;i<6;i++){const [wx,wz,k,a,w,ph]=WAVES[i],f=(qx*wx+qz*wz)*k-t*w+ph,d=CHOP*a*scale*Math.cos(f);dx+=wx*d;dz+=wz*d;}qx=x-dx;qz=z-dz;}
 let y=0;for(const [dx,dz,k,a,w,ph] of WAVES){const f=(qx*dx+qz*dz)*k-t*w+ph;y+=(Math.sin(f)+.12*Math.sin(2*f))*a*scale;}return y+waveTrainHeight(x,z,t)+surfHeight(x,z,t);
}
const n=v=>v.toFixed(10);
const blocks=WAVES.map(([x,z,k,a,w,ph],i)=>`{vec2 d=vec2(${n(x)},${n(z)});float f=dot(q,d)*${n(k)}-time*${n(w)}+${n(ph)},A=${n(a)}*(1.+storm*2.3);h+=(sin(f)+.12*sin(2.*f))*A;${i<6?`shift+=d*${n(CHOP)}*A*cos(f);float j=-${n(CHOP*k)}*A*sin(f);J+=mat2(d.x*d.x,d.y*d.x,d.x*d.y,d.y*d.y)*j;`:''}grad+=d*(cos(f)+.24*cos(2.*f))*A*${n(k)};}`).join('\n');
const shifts=WAVES.slice(0,6).map(([x,z,k,a,w,ph])=>`shift+=vec2(${n(x)},${n(z)})*${n(CHOP*a)}*(1.+storm*2.3)*cos(dot(q,vec2(${n(x)},${n(z)}))*${n(k)}-time*${n(w)}+${n(ph)});`).join('\n');
export const swellGLSL=`
${waveTrainGLSL}
${surfGLSL}
vec2 swellShift(vec2 q){vec2 shift=vec2(0.);${shifts}return shift;}
void swellAt(vec2 q,out float h,out vec2 shift,out vec2 grad,out mat2 J){h=0.;shift=vec2(0.);grad=vec2(0.);J=mat2(1.);${blocks}}
vec3 displacedSurface(vec2 q){float h;vec2 d,g;mat2 J;swellAt(q,h,d,g,J);return vec3(q.x+d.x,h+waveTrainHeight(q+d)+surfSurface(q+d).x,q.y+d.y);}
vec3 waveSurface(vec2 p){vec2 q=p;float h;vec2 d,g;mat2 J;for(int j=0;j<4;j++){q=p-swellShift(q);}swellAt(q,h,d,g,J);float det=max(.12,J[0][0]*J[1][1]-J[1][0]*J[0][1]);vec2 slope=vec2(J[1][1]*g.x-J[0][1]*g.y,-J[1][0]*g.x+J[0][0]*g.y)/det;return vec3(h,slope)+waveTrainSurface(p)+surfSurface(p);}`;
