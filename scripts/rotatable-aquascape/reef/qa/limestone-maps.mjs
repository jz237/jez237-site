import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PNG} from 'pngjs';
let bytes=0;
for(const name of ['map','normalMap']){
 const buffer=fs.readFileSync(new URL(`../assets/limestone/${name}.png`,import.meta.url));bytes+=buffer.length;
 const {width:w,height:h,data}=PNG.sync.read(buffer);assert.equal(w,1024);assert.equal(h,1024);
 const channels=name==='normalMap'?4:3;
 const diff=(a,b)=>{let d=0;for(let k=0;k<channels;k++)d+=Math.abs(data[a*4+k]-data[b*4+k]);return d/channels;};
 let seam=0,inside=0,samples=0,maxNormalError=0,minAlpha=255,maxAlpha=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=y*w+x;if(x<w-1){inside+=diff(i,i+1);samples++;}if(y<h-1){inside+=diff(i,i+w);samples++;}
  if(name==='normalMap'){
   const v=[0,1,2].map(k=>data[i*4+k]/255*2-1);maxNormalError=Math.max(maxNormalError,Math.abs(Math.hypot(...v)-1));assert.ok(v[2]>.15,'surface normals must face outward without singular slopes');
   minAlpha=Math.min(minAlpha,data[i*4+3]);maxAlpha=Math.max(maxAlpha,data[i*4+3]);
  }
 }
 for(let i=0;i<w;i++)seam+=diff(i,(h-1)*w+i)+diff(i*w,i*w+w-1);
 seam/=w*2;inside/=samples;
 assert.ok(seam<inside*1.5+.1,`${name}: wrapped edges must not introduce a hard seam`);
 assert.ok(maxNormalError<.014,'normal quantization preserves unit length');
 if(name==='normalMap'){assert.ok(minAlpha>=175&&maxAlpha<=253,'packed roughness remains matte');assert.ok(maxAlpha-minAlpha>15,'alpha retains roughness detail instead of opaque fill');}
 console.log('Limestone',name,{seam,inside,maxNormalError,minAlpha,maxAlpha});
}
// Added shared-mask coralline color/relief increases lossless PNG entropy by
// 208,498 bytes over 3,318,140. Resolution, sampler count and GPU memory stay fixed.
assert.ok(bytes<3600000,'two full-resolution colonized rock maps stay within the reviewed 3.6 MB budget');
console.log('Limestone maps passed:',bytes,'bytes, two 1K maps; roughness shares normal alpha.');
