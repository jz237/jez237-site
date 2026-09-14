import * as T from './vendor/three.module.js';

// Periodic spectral slope texture. Mipmapping removes subpixel shimmer at distance.
// Blue stores focused refracted light obtained by splatting the same slope field.
const N=256,slopes=new Float32Array(N*N*2),flux=new Float32Array(N*N);
let seed=1729;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const bands=Array.from({length:30},(_,i)=>{const k=2+Math.floor(random()*19),a=random()*Math.PI*2;return [Math.round(Math.cos(a)*k),Math.round(Math.sin(a)*k),random()*6.283,(.8+random()*.4)/Math.sqrt(k)];});
for(let y=0;y<N;y++)for(let x=0;x<N;x++){let sx=0,sz=0;for(const[kx,kz,ph,a]of bands){const c=Math.cos((kx*x+kz*y)/N*Math.PI*2+ph)*a;sx+=c*kx;sz+=c*kz;}const i=(y*N+x)*2;slopes[i]=sx*.013;slopes[i+1]=sz*.013;}
for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=(y*N+x)*2,px=x+slopes[i]*12,pz=y+slopes[i+1]*12,ix=Math.floor(px),iz=Math.floor(pz),fx=px-ix,fz=pz-iz;for(let dz=0;dz<2;dz++)for(let dx=0;dx<2;dx++)flux[((iz+dz+N*2)%N)*N+(ix+dx+N*2)%N]+=(dx?fx:1-fx)*(dz?fz:1-fz);}
const data=new Uint8Array(N*N*4);for(let i=0;i<N*N;i++){data[i*4]=Math.round(T.MathUtils.clamp(slopes[i*2]*.5+.5,0,1)*255);data[i*4+1]=Math.round(T.MathUtils.clamp(slopes[i*2+1]*.5+.5,0,1)*255);data[i*4+2]=Math.round(Math.min(1,flux[i]/3)*255);data[i*4+3]=255;}
export const waterDetail=new T.DataTexture(data,N,N,T.RGBAFormat);waterDetail.wrapS=waterDetail.wrapT=T.RepeatWrapping;waterDetail.minFilter=T.LinearMipmapLinearFilter;waterDetail.magFilter=T.LinearFilter;waterDetail.generateMipmaps=true;waterDetail.needsUpdate=true;

