import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PNG} from 'pngjs';
let bytes=0;
for(const name of ['map','normalMap','roughnessMap']){
 const buffer=fs.readFileSync(new URL(`../assets/encrusting/${name}.png`,import.meta.url));bytes+=buffer.length;
 const {width:w,height:h,data}=PNG.sync.read(buffer);assert.equal(w,512);assert.equal(h,512);
 let seam=0,inside=0,samples=0,maxNormalError=0;
 const diff=(a,b)=>{let d=0;for(let k=0;k<3;k++)d+=Math.abs(data[a*4+k]-data[b*4+k]);return d/3;};
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=y*w+x;if(x<w-1){inside+=diff(i,i+1);samples++;}if(y<h-1){inside+=diff(i,i+w);samples++;}
  if(name==='normalMap'){const c=[0,1,2].map(k=>data[i*4+k]/255*2-1);maxNormalError=Math.max(maxNormalError,Math.abs(Math.hypot(...c)-1));assert.ok(c[2]>0,'relief normals face out');}
 }
 for(let i=0;i<w;i++)seam+=diff(i,(h-1)*w+i)+diff(i*w,i*w+w-1);
 seam/=w*2;inside/=samples;
 assert.ok(seam<inside*1.5+.1,`${name}: wrapped seam cannot introduce a hard border`);
 assert.ok(maxNormalError<.014,'quantized normals retain unit length');
 console.log(name,'edge/inside gradient',seam.toFixed(3),inside.toFixed(3),'normal error',maxNormalError.toFixed(4));
}
assert.ok(bytes<700000,'baked full-resolution coral detail stays within the reviewed download budget');
console.log('Encrusting maps passed:',bytes,'bytes; three512px maps.');
