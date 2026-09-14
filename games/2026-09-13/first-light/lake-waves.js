// Fetch-limited wind waves for a lake as analytic trochoidal (Gerstner) bands, metres and seconds.
// Deep-water dispersion (omega^2 = g k) holds because every wavelength here (0.4-6 m) is far shorter
// than the water is deep. CPU queries invert the horizontal displacement so kayak, line and lure
// physics agree with the rendered surface; the GPU evaluates the same bands per vertex.
export const BANDS=Array.from({length:12},(_,i)=>{
 const t=i/11,lambda=6*Math.pow(.4/6,t),k=2*Math.PI/lambda,steep=.034+.026*t;
 return {k,a:steep/k,w:Math.sqrt(9.81*k),spread:Math.sin(i*2.399)*.61,phase:(i*2.39996323+.71)%(Math.PI*2)};
});
export const CHOP=.9;
// wind 0..1 spans calm to 8 m/s; fetch 0..1 is the local openness (sheltered coves stay glassy).
export function windAmplitude(wind,fetch=1){return Math.pow(Math.max(0,Math.min(1,wind)),1.8)*Math.max(0,Math.min(1,fetch));}
export function displacedSurface(x,z,t,amp,windDir=0){
 let px=x,pz=z,y=0;
 for(let i=0;i<BANDS.length;i++){const b=BANDS[i],dx=Math.cos(windDir+b.spread),dz=Math.sin(windDir+b.spread),f=(x*dx+z*dz)*b.k-t*b.w+b.phase,A=b.a*amp;
  y+=(Math.sin(f)+.12*Math.sin(2*f))*A;if(i<6){const d=CHOP*A*Math.cos(f);px+=dx*d;pz+=dz*d;}}
 return {x:px,z:pz,y};
}
export function sampleSwell(x,z,t,amp,windDir=0){
 let qx=x,qz=z;
 for(let j=0;j<4;j++){let sx=0,sz=0;for(let i=0;i<6;i++){const b=BANDS[i],dx=Math.cos(windDir+b.spread),dz=Math.sin(windDir+b.spread),f=(qx*dx+qz*dz)*b.k-t*b.w+b.phase,d=CHOP*b.a*amp*Math.cos(f);sx+=dx*d;sz+=dz*d;}qx=x-sx;qz=z-sz;}
 let y=0;for(const b of BANDS){const dx=Math.cos(windDir+b.spread),dz=Math.sin(windDir+b.spread),f=(qx*dx+qz*dz)*b.k-t*b.w+b.phase;y+=(Math.sin(f)+.12*Math.sin(2*f))*b.a*amp;}
 return y;
}
const n=v=>v.toFixed(10);
const blocks=BANDS.map((b,i)=>`{vec2 d=vec2(cos(windDir+${n(b.spread)}),sin(windDir+${n(b.spread)}));float f=dot(q,d)*${n(b.k)}-time*${n(b.w)}+${n(b.phase)},A=${n(b.a)}*amp;h+=(sin(f)+.12*sin(2.*f))*A;${i<6?`shift+=d*${n(CHOP)}*A*cos(f);float j=-${n(CHOP*b.k)}*A*sin(f);J+=mat2(d.x*d.x,d.y*d.x,d.x*d.y,d.y*d.y)*j;`:''}grad+=d*(cos(f)+.24*cos(2.*f))*A*${n(b.k)};}`).join('\n');
const shifts=BANDS.slice(0,6).map(b=>`{vec2 d=vec2(cos(windDir+${n(b.spread)}),sin(windDir+${n(b.spread)}));shift+=d*${n(CHOP*b.a)}*amp*cos(dot(q,d)*${n(b.k)}-time*${n(b.w)}+${n(b.phase)});}`).join('\n');
export const swellGLSL=`uniform float windDir;
vec2 swellShift(vec2 q,float amp){vec2 shift=vec2(0.);${shifts}return shift;}
void swellAt(vec2 q,float amp,out float h,out vec2 shift,out vec2 grad,out mat2 J){h=0.;shift=vec2(0.);grad=vec2(0.);J=mat2(1.);${blocks}}
vec3 waveSurface(vec2 p,float amp){vec2 q=p;float h;vec2 d,g;mat2 J;for(int j=0;j<4;j++){q=p-swellShift(q,amp);}swellAt(q,amp,h,d,g,J);float det=max(.12,J[0][0]*J[1][1]-J[1][0]*J[0][1]);vec2 slope=vec2(J[1][1]*g.x-J[0][1]*g.y,-J[1][0]*g.x+J[0][0]*g.y)/det;return vec3(h,slope);}`;
