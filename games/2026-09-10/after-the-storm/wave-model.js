import {characterAt,characterHeight,characterGLSL} from './water-character.js';
import {surfHeight,surfGLSL,surfStrength} from './surf-waves.js';
import {waveTrainHeight,waveTrainGLSL} from './course-wave-train.js';
// Analytic trochoidal waves. CPU queries invert the horizontal displacement;
// GPU vertices use the forward map. Both operate in metres and real seconds.
export const WAVES=Array.from({length:14},(_,i)=>{const angle=.78+Math.sin(i*2.399)*1.05,k=.085*Math.pow(1.34,i)/(i<4?2.1:1);return [Math.cos(angle),Math.sin(angle),k,.18*Math.pow(.73,i)*(i<4?2.1:1),Math.sqrt(9.81*k),(i*2.39996323+.71)%(Math.PI*2)];});
export const CHOP=1.65,DISPLACED=6;
// Wind sea, enabled by the Wind chop and Storm swell sea states: the 5-23 m
// bands gain height with the square of the wind, as a fetch-limited sea does,
// so storms add short steep crests. Venue conditions and Big Surf keep the
// calibrated bands that course routes, timed crossings and records rely on.
export const windSea={value:0};
export const WIND_SEA=WAVES.map((_,i)=>[0,0,0,0,2.4,3,3.3,2.9,2,.95][i]??0);
export const bandAmplitude=(i,storm)=>WAVES[i][3]*(1+storm*2.3+windSea.value*storm*storm*WIND_SEA[i]);
// Wind-sea crests lean forward (steeper leading face); the calibrated bands keep
// their original harmonic. Bands without trochoidal displacement add the Stokes
// second-order term, so wind-sea crests sharpen and troughs flatten.
export const SWELL_LEAN=-.12,WIND_LEAN=.08;
export const bandLean=i=>i<4?SWELL_LEAN:SWELL_LEAN+(WIND_LEAN-SWELL_LEAN)*windSea.value;
export const stokesTerm=(i,A)=>i<DISPLACED?0:windSea.value*Math.min(.2,.5*WAVES[i][2]*A);
const profile=(s,c,kappa,lean)=>s-kappa*(1-2*s*s)-2*lean*s*c;
const sampledCharacter=[];
// Without the wind sea the CPU path is the calibrated original, operation for
// operation: scripted routes and championships are chaotic, so even rounding
// differences change which rider clips a shoal.
export function displacedSurface(x,z,t,storm=0){let px=x,pz=z,y=0;const wind=windSea.value,scale=1+storm*2.3;
 for(let i=0;i<WAVES.length;i++){const [dx,dz,k,a,w,ph]=WAVES[i],f=(x*dx+z*dz)*k-t*w+ph;let A;if(wind){A=bandAmplitude(i,storm);y+=profile(Math.sin(f),Math.cos(f),stokesTerm(i,A),bandLean(i))*A;}else{A=a*scale;y+=(Math.sin(f)+.12*Math.sin(2*f))*A;}if(i<DISPLACED){const d=CHOP*A*Math.cos(f);px+=dx*d;pz+=dz*d;}}
 const c=characterAt(px,pz,sampledCharacter);return {x:px,z:pz,y:(y+surfHeight(px,pz,t))*(1+(c[0]-1)*surfStrength.value)+waveTrainHeight(px,pz,t)+characterHeight(px,pz,t,c)*storm*surfStrength.value};
}
// The wind sea displaces the surface further, so it inverts q+shift(q)=p with
// Newton iterations, which converge quadratically (0.003 mm worst case).
export function sampleSwell(x,z,t,storm=0){let qx=x,qz=z;const scale=1+storm*2.3;
 if(windSea.value)for(let j=0;j<3;j++){let dx=0,dz=0,a=1,b=0,d=1;for(let i=0;i<DISPLACED;i++){const [wx,wz,k,,w,ph]=WAVES[i],f=(qx*wx+qz*wz)*k-t*w+ph,A=CHOP*bandAmplitude(i,storm),m=A*Math.cos(f),g=-A*k*Math.sin(f);dx+=wx*m;dz+=wz*m;a+=g*wx*wx;b+=g*wx*wz;d+=g*wz*wz;}
  const rx=qx+dx-x,rz=qz+dz-z,det=Math.max(.12,a*d-b*b);qx-=(d*rx-b*rz)/det;qz-=(a*rz-b*rx)/det;}
 else for(let j=0;j<4;j++){let dx=0,dz=0;for(let i=0;i<6;i++){const [wx,wz,k,a,w,ph]=WAVES[i],f=(qx*wx+qz*wz)*k-t*w+ph,d=CHOP*a*scale*Math.cos(f);dx+=wx*d;dz+=wz*d;}qx=x-dx;qz=z-dz;}
 const c=characterAt(x,z,sampledCharacter);let y=0;
 if(windSea.value)for(let i=0;i<WAVES.length;i++){const [dx,dz,k,,w,ph]=WAVES[i],f=(qx*dx+qz*dz)*k-t*w+ph,A=bandAmplitude(i,storm);y+=profile(Math.sin(f),Math.cos(f),stokesTerm(i,A),bandLean(i))*A;}
 else for(const [dx,dz,k,a,w,ph] of WAVES){const f=(qx*dx+qz*dz)*k-t*w+ph;y+=(Math.sin(f)+.12*Math.sin(2*f))*a*scale;}
 return (y+surfHeight(x,z,t))*(1+(c[0]-1)*surfStrength.value)+waveTrainHeight(x,z,t)+characterHeight(x,z,t,c)*storm*surfStrength.value;
}
const n=v=>v.toFixed(10);
// Bands shorter than about two mesh cells are faded where the far mesh cannot
// resolve them; swellCell stays 0 for physics-matched GPU queries.
export const bandFade=i=>{const L=2*Math.PI/WAVES[i][2];return `(1.-smoothstep(${n(L/2.8)},${n(L/2)},swellCell))`;};
export const amp=i=>`${n(WAVES[i][3])}*(1.+storm*2.3+windSea*storm*storm*${n(WIND_SEA[i])})`;
export const leanGLSL=i=>i<4?`(${n(SWELL_LEAN)})`:`(${n(SWELL_LEAN)}+${n(WIND_LEAN-SWELL_LEAN)}*windSea)`;
export const stokesGLSL=i=>i<DISPLACED?'0.':`windSea*min(.2,${n(.5*WAVES[i][2])}*A)`;
const blocks=WAVES.map(([x,z,k,a,w,ph],i)=>`{vec2 d=vec2(${n(x)},${n(z)});float f=dot(q,d)*${n(k)}-time*${n(w)}+${n(ph)},A=${amp(i)}*${bandFade(i)},s=sin(f),c=cos(f),kap=${stokesGLSL(i)};h+=(s-kap*(1.-2.*s*s)-2.*${leanGLSL(i)}*s*c)*A;${i<DISPLACED?`shift+=d*${n(CHOP)}*A*c;float j=-${n(CHOP*k)}*A*s;J+=mat2(d.x*d.x,d.y*d.x,d.x*d.y,d.y*d.y)*j;`:''}grad+=d*(c+4.*kap*s*c-2.*${leanGLSL(i)}*(c*c-s*s))*A*${n(k)};}`).join('\n');
const shifts=WAVES.slice(0,DISPLACED).map(([x,z,k,a,w,ph],i)=>`{vec2 d=vec2(${n(x)},${n(z)});float f=dot(q,d)*${n(k)}-time*${n(w)}+${n(ph)},A=${n(CHOP)}*${amp(i)};shift+=d*A*cos(f);J+=mat2(d.x*d.x,d.y*d.x,d.x*d.y,d.y*d.y)*(-${n(k)}*A*sin(f));}`).join('\n');
export const swellGLSL=`
uniform float windSea;float swellCell=0.;
${waveTrainGLSL}
${surfGLSL}
${characterGLSL}
vec2 swellShift(vec2 q){vec2 shift=vec2(0.);mat2 J=mat2(1.);${shifts}return shift;}
vec2 swellInverse(vec2 p){vec2 q=p;for(int j=0;j<3;j++){vec2 shift=vec2(0.);mat2 J=mat2(1.);${shifts}float det=max(.12,J[0][0]*J[1][1]-J[1][0]*J[0][1]);vec2 r=q+shift-p;q-=vec2(J[1][1]*r.x-J[1][0]*r.y,J[0][0]*r.y-J[0][1]*r.x)/det;}return q;}
void swellAt(vec2 q,out float h,out vec2 shift,out vec2 grad,out mat2 J){h=0.;shift=vec2(0.);grad=vec2(0.);J=mat2(1.);${blocks}}
vec3 displacedSurface(vec2 q){float h;vec2 d,g;mat2 J;swellAt(q,h,d,g,J);return vec3(q.x+d.x,(h+surfSurface(q+d).x)*(1.+(characterAt(q+d).x-1.)*surfStrength)+waveTrainHeight(q+d)+characterHeight(q+d),q.y+d.y);}
vec3 waveSurface(vec2 p){vec2 q=swellInverse(p);float h;vec2 d,g;mat2 J;swellAt(q,h,d,g,J);float det=max(.12,J[0][0]*J[1][1]-J[1][0]*J[0][1]);vec2 slope=vec2(J[1][1]*g.x-J[0][1]*g.y,-J[1][0]*g.x+J[0][0]*g.y)/det;return coastalSurface(p,vec3(h,slope)+surfSurface(p))+waveTrainSurface(p);}`;
