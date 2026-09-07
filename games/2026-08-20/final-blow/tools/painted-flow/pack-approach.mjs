import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';const sharp=createRequire(import.meta.url)(process.env.SHARP_PACKAGE || 'sharp');
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const masters=process.argv[2];if(!masters)throw Error('Pass the generated-image master directory');
import {readFile,mkdir,writeFile} from 'node:fs/promises';
const root=fileURLToPath(new URL('../../',import.meta.url)),out=`${root}/assets/inbetweens`;
await mkdir(out,{recursive:true});const records=JSON.parse(await readFile(new URL('./approach-sources.json',import.meta.url),'utf8'));
function bounds(data,w,x0,y0,x1,y1){let l=x1,r=x0,t=y1,b=y0,n=0,sx=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(data[(y*w+x)*4+3]>140){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);n++;sx+=x;}return {l,r,t,b,n,cx:sx/n};}
const metrics={...(await import('../../engine/inbetween-scale.mjs')).INBETWEEN_SCALE};
for(const rec of records){
 if(process.argv[3]&&`${rec.fighter}-${rec.bank}`!==process.argv[3])continue;
 const {data,info}=await sharp(resolve(masters,rec.source)).ensureAlpha().raw().toBuffer({resolveWithObject:true});const {width:w,height:h}=info;
 for(let i=0;i<data.length;i+=4){const k=Math.min(data[i],data[i+2])-data[i+1];data[i+3]=Math.max(0,Math.min(255,(85-k)*255/55));if(data[i+3]>0&&k>30){data[i]=Math.min(data[i],data[i+1]+30);data[i+2]=Math.min(data[i+2],data[i+1]+30);}}
 const reference=rec.bank==='specials'?`${root}/assets/moves/${rec.fighter}-specials.webp`:`${root}/assets/unified/${rec.fighter}${rec.bank==='unified'?'':'-'+rec.bank.split('-')[1]}.webp`;
 const relative='games/2026-08-20/final-blow/'+reference.slice(root.length).replace(/^[/\\]+/,'');
 const baseline=execFileSync('git',['show',`4990e7df82552cbc0104117ba8776f197db20b91:${relative}`],{cwd:root,maxBuffer:32*1024*1024});
 const ref=await sharp(baseline).ensureAlpha().raw().toBuffer();const rows=Array(h).fill(0);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>140)rows[y]++;
 const cuts=[0];for(let r=1;r<4;r++){const c=h*r/4;let y0=Math.floor(c-55);for(let y=y0;y<Math.min(h,c+55);y++)if(rows[y]<rows[y0])y0=y;cuts.push(y0);}cuts.push(h);
 const composites=[],cells=[];
 const columnCuts=[];
 for(let row=0;row<4;row++){
  const sums=Array(w).fill(0);
  for(let y=cuts[row];y<cuts[row+1];y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>140)sums[x]++;
  const edges=[0];for(let c=1;c<4;c++){const mid=w*c/4;let best=Math.floor(mid-65);for(let x=best;x<Math.min(w,mid+65);x++)if(sums[x]<sums[best])best=x;edges.push(best);}edges.push(w);columnCuts.push(edges);
 }
 for(let f=0;f<16;f++){
  const row=Math.floor(f/4),col=f%4,box=bounds(data,w,columnCuts[row][col],cuts[row],columnCuts[row][col+1],cuts[row+1]);
  const old=bounds(ref,1280,col*320,row*320,(col+1)*320,(row+1)*320);
  if(!box.n||!old.n)throw Error('Empty '+rec.fighter+rec.bank+f);
  const cx=old.cx-col*320;
  let scale=Math.sqrt(old.n/box.n);
  scale=Math.min(scale,304/(box.b-box.t+1),304/(box.r-box.l+1));
  const width=Math.max(1,Math.round((box.r-box.l+1)*scale)),height=Math.max(1,Math.round((box.b-box.t+1)*scale));
  const x=Math.max(6,Math.min(314-width,Math.round(cx-(box.cx-box.l)*scale))),y=Math.max(6,Math.min(314-height,old.b-row*320+1-height));
  const image=await sharp(data,{raw:{width:w,height:h,channels:4}}).extract({left:box.l,top:box.t,width:box.r-box.l+1,height:box.b-box.t+1}).resize(width,height).png().toBuffer();
  composites.push({input:image,left:col*320+x,top:row*320+y});cells.push({frame:f,source:[box.l,box.t,box.r,box.b],rect:[x,y,width,height],scale,areaRatio:box.n*scale*scale/old.n});
 }
 await sharp({create:{width:1280,height:1280,channels:4,background:'#00000000'}}).composite(composites).webp({quality:94,alphaQuality:100,effort:6}).toFile(`${out}/${rec.fighter}-approach-v1.webp`);
 await writeFile(`${out}/${rec.fighter}-approach-v1.json`,JSON.stringify({cells,source:rec.source,prompt:rec.prompt},null,2));metrics[`${rec.fighter}-approach`]=cells.map(c=>Number((1/Math.sqrt(c.areaRatio)).toFixed(5)));
 console.log(rec.fighter,rec.bank,cells.length,'cells');
}

await writeFile(`${root}/engine/inbetween-scale.mjs`, `export const INBETWEEN_SCALE = ${JSON.stringify(metrics)};\n`);
