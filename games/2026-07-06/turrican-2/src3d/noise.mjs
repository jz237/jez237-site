// Deterministic noise helpers shared by terrain, backdrops and procedural textures.
import * as THREE from 'three';

export function rng(seed){let a=seed>>>0||1;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}

function hash3(x,y,z){let h=Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(z,2147483647);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}
const fade=t=>t*t*(3-2*t);
export function noise3(x,y,z){
  const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=fade(x-xi),yf=fade(y-yi),zf=fade(z-zi);
  const l=(a,b,t)=>a+(b-a)*t;
  return l(l(l(hash3(xi,yi,zi),hash3(xi+1,yi,zi),xf),l(hash3(xi,yi+1,zi),hash3(xi+1,yi+1,zi),xf),yf),
           l(l(hash3(xi,yi,zi+1),hash3(xi+1,yi,zi+1),xf),l(hash3(xi,yi+1,zi+1),hash3(xi+1,yi+1,zi+1),xf),yf),zf)*2-1;
}
export function fbm3(x,y,z,oct=3){let s=0,a=.5,f=1;for(let i=0;i<oct;i++){s+=a*noise3(x*f,y*f,z*f);f*=2.03;a*=.5;}return s;}
export function ridge3(x,y,z,oct=3){let s=0,a=.5,f=1;for(let i=0;i<oct;i++){s+=a*(1-Math.abs(noise3(x*f,y*f,z*f)));f*=2.1;a*=.5;}return s;}

// Tileable 2D value noise for textures (period p in lattice cells).
function tnoise(x,y,p,seed){
  const xi=Math.floor(x),yi=Math.floor(y),xf=fade(x-xi),yf=fade(y-yi);
  const h=(i,j)=>hash3(((i%p)+p)%p,((j%p)+p)%p,seed);
  const a=h(xi,yi),b=h(xi+1,yi),c=h(xi,yi+1),d=h(xi+1,yi+1);
  return a+(b-a)*xf+(c-a)*yf+(a-b-c+d)*xf*yf;
}
// Tileable Worley distance (F2-F1 gives crack lines).
function worley(x,y,p,seed){
  const xi=Math.floor(x),yi=Math.floor(y);let f1=9,f2=9;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){
    const cx=xi+i,cy=yi+j,wx=((cx%p)+p)%p,wy=((cy%p)+p)%p;
    const px=cx+hash3(wx,wy,seed),py=cy+hash3(wx,wy,seed+7);
    const d=Math.hypot(px-x,py-y);if(d<f1){f2=f1;f1=d;}else if(d<f2)f2=d;
  }
  return [f1,f2];
}

// 256^2 RGBA detail texture: R = fbm, G = crack lines, B = fine grain, A = broad noise.
let detailTexture=null;
export function getDetailTexture(){
  if(detailTexture)return detailTexture;
  const N=256,data=new Uint8Array(N*N*4);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    const u=x/N,v=y/N;let f=0,a=.5,per=8;
    for(let o=0;o<5;o++){f+=a*tnoise(u*per,v*per,per,11+o);a*=.5;per*=2;}
    const [f1,f2]=worley(u*10,v*10,10,3);const crack=Math.max(0,1-(f2-f1)*7);
    const grain=tnoise(u*128,v*128,128,5)*.6+tnoise(u*64,v*64,64,6)*.4;
    let broad=0;a=.5;per=2;for(let o=0;o<3;o++){broad+=a*tnoise(u*per,v*per,per,21+o);a*=.5;per*=2;}
    const i=(y*N+x)*4;data[i]=f*255;data[i+1]=crack*255;data[i+2]=grain*255;data[i+3]=broad/.875*255;
  }
  detailTexture=new THREE.DataTexture(data,N,N,THREE.RGBAFormat);
  detailTexture.wrapS=detailTexture.wrapT=THREE.RepeatWrapping;detailTexture.magFilter=THREE.LinearFilter;
  detailTexture.minFilter=THREE.LinearMipmapLinearFilter;detailTexture.generateMipmaps=true;detailTexture.needsUpdate=true;
  return detailTexture;
}

// Soft round sprite used by particles and glows.
let softSprite=null;
export function getSoftSprite(){
  if(softSprite)return softSprite;
  const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');
  const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.35,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=r;g.fillRect(0,0,64,64);softSprite=new THREE.CanvasTexture(c);softSprite.colorSpace=THREE.NoColorSpace;return softSprite;
}

// GLSL snippets.
export const GLSL_NOISE=/* glsl */`
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*vnoise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
`;
