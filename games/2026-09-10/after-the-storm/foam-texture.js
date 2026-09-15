import * as T from './vendor/three.module.js';
// Periodic multiscale density, not Voronoi cell edges. Three independent channels
// let the shader erode froth clumps and resolve granular bubbles without a net.
const size=256,data=new Uint8Array(size*size*4);
const fract=x=>x-Math.floor(x),mix=(a,b,t)=>a+(b-a)*t;
function noise(x,y,period,seed){
 const ix=Math.floor(x),iy=Math.floor(y);let u=fract(x),v=fract(y);u=u*u*(3-2*u);v=v*v*(3-2*v);
 const h=(a,b)=>fract(Math.sin(((a%period+period)%period)*127.1+((b%period+period)%period)*311.7+seed*17.3)*43758.5453);
 return mix(mix(h(ix,iy),h(ix+1,iy),u),mix(h(ix,iy+1),h(ix+1,iy+1),u),v);
}
for(let y=0;y<size;y++)for(let x=0;x<size;x++){
 const u=x/size,v=y/size,k=(y*size+x)*4;
 const a=noise(u*8,v*8,8,7),b=noise(u*16,v*16,16,19),c=noise(u*32,v*32,32,43),d=noise(u*64,v*64,64,71);
 data[k]=Math.round((a*.50+b*.28+c*.15+d*.07)*255);
 data[k+1]=Math.round((c*.35+d*.65)*255);
 data[k+2]=Math.round(noise(u*4,v*4,4,97)*255);data[k+3]=255;
}
export const foamTexture=new T.DataTexture(data,size,size,T.RGBAFormat);
foamTexture.wrapS=foamTexture.wrapT=T.RepeatWrapping;
foamTexture.minFilter=T.LinearMipmapLinearFilter;foamTexture.magFilter=T.LinearFilter;
foamTexture.generateMipmaps=true;foamTexture.needsUpdate=true;
