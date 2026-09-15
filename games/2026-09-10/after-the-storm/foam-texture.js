import * as T from './vendor/three.module.js';
// Seamless cellular films, baked once. Mipmaps integrate fine bubbles at distance
// instead of evaluating aliased high-frequency hash functions per water pixel.
const size=256,cells=16,data=new Uint8Array(size*size*4),points=[];
let seed=71231;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<cells*cells;i++)points.push([rand(),rand()]);
for(let y=0;y<size;y++)for(let x=0;x<size;x++){
 const px=x/size*cells,py=y/size*cells,ix=Math.floor(px),iy=Math.floor(py);let first=100,second=100;
 for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){
  const q=points[((iy+j+cells)%cells)*cells+(ix+i+cells)%cells],dx=ix+i+q[0]-px,dy=iy+j+q[1]-py,d=dx*dx+dy*dy;
  if(d<first){second=first;first=d;}else if(d<second)second=d;
 }
 const edge=Math.sqrt(second)-Math.sqrt(first),k=(y*size+x)*4;
 data[k]=Math.round(Math.exp(-edge*edge*180)*255);
 data[k+1]=Math.round(Math.min(1,Math.sqrt(first))*255);
 data[k+2]=Math.round(Math.exp(-edge*edge*45)*255);data[k+3]=255;
}
export const foamTexture=new T.DataTexture(data,size,size,T.RGBAFormat);
foamTexture.wrapS=foamTexture.wrapT=T.RepeatWrapping;
foamTexture.minFilter=T.LinearMipmapLinearFilter;foamTexture.magFilter=T.LinearFilter;
foamTexture.generateMipmaps=true;foamTexture.needsUpdate=true;
