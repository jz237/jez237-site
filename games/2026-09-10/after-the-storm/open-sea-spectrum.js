import {mulberry32,gaussian} from './open-sea-math.js';
import {seaParams,CASCADE_DEFS} from './open-sea-ocean.js';

// CPU mirror of the open-sea FFT ocean for craft physics. It regenerates the
// GPU's own initial spectrum (same seeded noise, JONSWAP plus swell, spreading,
// quantised dispersion and 400 s loop) and inverse-transforms it on a CPU grid,
// so the craft rides the same waves the screen shows. The two long-wave
// cascades, which carry the spectral peak, are mirrored completely (128-point
// grids); cascades 2-3 keep modes below index 32 (64-point grids), dropping only
// their few-centimetre high ends. The 4.7 m capillary cascade carries no weight.
const G=9.81,TLOOP=400,KM=370,TAU=Math.PI*2,SIZES=[128,128,64,64];

function jonswapScale(hs,tp,gamma){
 const wp=2*Math.PI/tp;let m=0;const n=4000,w0=wp*.2,w1=wp*40,lr=Math.log(w1/w0);
 for(let i=0;i<n;i++){const w=w0*Math.exp(lr*(i+.5)/n),dw=w*lr/n,sigma=w<=wp?.07:.09,r=Math.exp(-((w-wp)**2)/(2*sigma*sigma*wp*wp));
  m+=Math.pow(w,-5)*Math.exp(-1.25*Math.pow(wp/w,4))*Math.pow(gamma,r)*dw;}
 return {A:(hs/4)**2/m,wp};
}
const omega=k=>Math.sqrt(G*k*(1+k*k/(KM*KM)));
function jonswap(w,A,wp,gam){const sigma=w<=wp?.07:.09,r=Math.exp(-(w-wp)*(w-wp)/(2*sigma*sigma*wp*wp));return A*Math.pow(w,-5)*Math.exp(-1.25*Math.pow(wp/w,4))*Math.pow(gam,r);}
function spreadD(kx,ky,ang,w,wp,sp){const cosT=kx*Math.cos(ang)+ky*Math.sin(ang),mu=w>wp?-1.6:5,s=Math.min(300,Math.max(.4,sp*Math.pow(w/wp,mu)));
 return Math.sqrt(s+.25)/(2*Math.sqrt(Math.PI))*Math.pow(Math.max(.5*(1+cosT),0),s);}

// In-place radix-2 inverse transform (positive exponent), like the GPU butterflies.
const tables=new Map();
function twiddles(M){let t=tables.get(M);if(t)return t;
 const cos=new Float64Array(M/2),sin=new Float64Array(M/2),rev=new Int32Array(M);
 for(let i=0;i<M/2;i++){cos[i]=Math.cos(TAU*i/M);sin[i]=Math.sin(TAU*i/M);}
 for(let i=0,j=0;i<M;i++){rev[i]=j;let bit=M>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;}
 t={cos,sin,rev};tables.set(M,t);return t;}
function fft1(re,im,off,stride,M){
 const {cos,sin,rev}=twiddles(M);
 for(let i=0;i<M;i++){const j=rev[i];if(i<j){const a=off+i*stride,b=off+j*stride;let t=re[a];re[a]=re[b];re[b]=t;t=im[a];im[a]=im[b];im[b]=t;}}
 for(let size=2;size<=M;size<<=1){const hf=size>>1,step=M/size;
  for(let i=0;i<M;i+=size)for(let j=0;j<hf;j++){const wr=cos[j*step],wi=sin[j*step],a=off+(i+j)*stride,b=off+(i+j+hf)*stride;
   const xr=re[b]*wr-im[b]*wi,xi=re[b]*wi+im[b]*wr;re[b]=re[a]-xr;im[b]=im[a]-xi;re[a]+=xr;im[a]+=xi;}}
}
const ifft2=(re,im,M)=>{for(let y=0;y<M;y++)fft1(re,im,y*M,1,M);for(let x=0;x<M;x++)fft1(re,im,x,M,M);};

/** Build the mirror for one sea state; `seed`, N and cascades match OceanSim. */
export function createOpenSeaSpectrum({seaState=3.5,windDirection=.55,seed=20260929,N=256,cascades=5,shoal=null}={}){
 const c=seaParams(seaState),wind=jonswapScale(c.hs,c.tp,c.gamma),swell=jonswapScale(c.swellHs,c.swellTp,c.swellGamma);
 const count=Math.min(cascades,CASCADE_DEFS.length),idxHi=.1875*N;
 // Same noise texture as the GPU (layer-major rows of Gaussian pairs).
 const rng=mulberry32(seed),noise=new Float32Array(N*N*2*count);
 for(let i=0;i<noise.length;i++)noise[i]=gaussian(rng);
 const xi=(layer,x,y)=>{const o=((layer*N+y)*N+x)*2;return [noise[o],noise[o+1]];};
 const defs=[];let kLo=0;
 for(let i=0;i<count;i++){const d=CASCADE_DEFS[i],kHi=idxHi*TAU/d.L;defs.push({L:d.L,rot:d.rot,kLo,kHi});kLo=kHi;}
 const cascadesUsed=defs.slice(0,Math.min(4,count)).map((d,layer)=>{
  const M=SIZES[layer],limit=Math.min(M/2,Math.ceil(idxHi));
  const h0=(kx,ky,x1)=>{const kl=Math.hypot(kx,ky);if(kl<d.kLo||kl>=d.kHi||kl<1e-6)return [0,0];
   const w=omega(kl),dwdk=(G/(2*w))*(1+3*kl*kl/(KM*KM)),nx=kx/kl,ny=ky/kl;
   const S=jonswap(w,wind.A,wind.wp,c.gamma)*spreadD(nx,ny,windDirection-d.rot,w,wind.wp,c.spread)
    +jonswap(w,swell.A,swell.wp,c.swellGamma)*spreadD(nx,ny,windDirection+c.swellOffset-d.rot,w,swell.wp,c.swellSpread);
   const a=.5*Math.sqrt(S*dwdk/kl)*(TAU/d.L);return [x1[0]*a,x1[1]*a];};
  const modes=[];
  for(let my=-limit+1;my<limit;my++)for(let mx=-limit+1;mx<limit;mx++){
   const kx=mx*TAU/d.L,ky=my*TAU/d.L,kl=Math.hypot(kx,ky);if(kl<1e-6)continue;
   const px=(mx+N)%N,py=(my+N)%N,pm=[(N-px)%N,(N-py)%N];
   const a=h0(kx,ky,xi(layer,px,py)),b=h0(-kx,-ky,xi(layer,pm[0],pm[1]));
   // Modes below a tenth of a millimetre change no hull height; skip them.
   if(Math.hypot(a[0],a[1])+Math.hypot(b[0],b[1])<1e-4)continue;
   const n=Math.floor(omega(kl)/(TAU/TLOOP)+.5);modes.push({gx:(mx+M)%M,gy:(my+M)%M,kx,ky,kl,n,w:n*TAU/TLOOP,a,b});
  }
  return {...d,M,cs:Math.cos(d.rot),sn:Math.sin(d.rot),modes,h:new Float32Array(M*M),dx:new Float32Array(M*M),dz:new Float32Array(M*M),ht:new Float32Array(M*M),
   re:new Float64Array(M*M),im:new Float64Array(M*M),re2:new Float64Array(M*M),im2:new Float64Array(M*M)};
 });
 let fieldTime=NaN;
 function build(time){
  if(time===fieldTime)return;fieldTime=time;
  const tf=((time%TLOOP)+TLOOP)%TLOOP/TLOOP;
  for(const k of cascadesUsed){
   const {M,re,im,re2,im2}=k;re.fill(0);im.fill(0);re2.fill(0);im2.fill(0);
   for(const q of k.modes){
    const ph=TAU*((q.n*tf)%1),er=Math.cos(ph),ei=Math.sin(ph);
    // h = h0(k) e^{-i ph} + conj(h0(-k)) e^{+i ph}
    const Ar=q.a[0]*er+q.a[1]*ei,Ai=q.a[1]*er-q.a[0]*ei,Br=q.b[0]*er+q.b[1]*ei,Bi=q.b[0]*ei-q.b[1]*er,hr=Ar+Br,hi=Ai+Bi;
    const nx=q.kx/q.kl,ny=q.ky/q.kl,mr=hi,mi=-hr;// -i h
    const o=q.gy*M+q.gx;
    re[o]+=hr-nx*mi;im[o]+=hi+nx*mr;// h + i Dx
    // Dz, plus i times the height's time derivative w(-iA+iB) in the spare half.
    const tr=q.w*(Ai-Bi),ti=q.w*(Br-Ar);re2[o]+=ny*mr-ti;im2[o]+=ny*mi+tr;
   }
   ifft2(re,im,M);ifft2(re2,im2,M);
   for(let i=0;i<M*M;i++){k.h[i]=re[i];k.dx[i]=im[i];k.dz[i]=re2[i];k.ht[i]=im2[i];}
  }
 }
 const bilinear=(a,u,v,M)=>{
  const x=u*M,y=v*M,x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,i0=((x0%M)+M)%M,j0=((y0%M)+M)%M,i1=(i0+1)%M,j1=(j0+1)%M;
  return (a[j0*M+i0]*(1-fx)+a[j0*M+i1]*fx)*(1-fy)+(a[j1*M+i0]*(1-fx)+a[j1*M+i1]*fx)*fy;
 };
 // GPU texel centres sit half a 256-texel from the DFT sample points.
 const shift=.5/N;
 function displacement(x,z){
  let dx=0,h=0,dz=0,ht=0;
  for(const k of cascadesUsed){
   const u=(k.cs*x+k.sn*z)/k.L-shift,v=(-k.sn*x+k.cs*z)/k.L-shift;
   const cx=-c.chop*bilinear(k.dx,u,v,k.M),cz=-c.chop*bilinear(k.dz,u,v,k.M);
   h+=bilinear(k.h,u,v,k.M);ht+=bilinear(k.ht,u,v,k.M);dx+=k.cs*cx-k.sn*cz;dz+=k.sn*cx+k.cs*cz;
  }
  // Shallow water calms the open-sea waves exactly as the GPU surface does.
  const f=shoal?shoal(x,z):1;
  return {dx:dx*f,h:h*f,dz:dz*f,ht:ht*f};
 }
 function sample(x,z){let gx=x,gz=z;for(let i=0;i<3;i++){const d=displacement(gx,gz);gx=x-d.dx;gz=z-d.dz;}return displacement(gx,gz);}
 return Object.freeze({params:Object.freeze({...c}),windDirection,cascades:cascadesUsed.length,
  modeCount:cascadesUsed.reduce((n,k)=>n+k.modes.length,0),
  /** Prepare the wave field for a simulation time (seconds). */
  setTime:build,
  /** Surface height (m, about the mean) under world point x,z at the prepared time. */
  heightAt(x,z){return sample(x,z).h;},
  /** Height and its rate of change (m/s) of the surface particle now over x,z. */
  sample,
  displacement});
}
