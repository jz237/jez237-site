import { createRequire } from 'node:module';
const sharp = createRequire(process.env.SHARP_PACKAGE || import.meta.url)('sharp');
import {mkdir,writeFile} from 'node:fs/promises';
const out=process.argv[3] || 'assets/painted-flow';
await mkdir(out,{recursive:true});
for(const [id,file] of [['jez','exec-f2074836-e3f2-47b0-89aa-d7078dfef673.png'],['benny','exec-84e1a269-e068-4cb5-a41f-6a8a1e35d3b9.png']]){
 const source=`${process.argv[2]}/${file}`;
 const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const {width:w,height:h}=info;
 for(let i=0;i<data.length;i+=4){const key=Math.min(data[i],data[i+2])-data[i+1]; const a=Math.max(0,Math.min(255,(85-key)*255/55)); data[i+3]=a; if(a>0&&key>30){data[i]=Math.min(data[i],data[i+1]+30);data[i+2]=Math.min(data[i+2],data[i+1]+30);}}
 const rows=Array(h).fill(0);for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>140)rows[y]++;
 const cuts=[0];for(let r=1;r<4;r++){const mid=h*r/4;let best=Math.floor(mid-55);for(let y=best;y<Math.min(h,mid+55);y++)if(rows[y]<rows[best])best=y;cuts.push(best);} cuts.push(h);
 const composites=[],report=[];
 for(let frame=0;frame<16;frame++){
  const row=Math.floor(frame/4),col=frame%4, x0=Math.floor(w*col/4),x1=Math.floor(w*(col+1)/4);
  let left=w,right=0,top=h,bottom=0;
  for(let y=cuts[row];y<cuts[row+1];y++)for(let x=x0;x<x1;x++)if(data[(y*w+x)*4+3]>140){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  let footLeft=right;for(let y=bottom-9;y<=bottom;y++)for(let x=left;x<=right;x++)if(data[(y*w+x)*4+3]>140)footLeft=Math.min(footLeft,x);
  const anchor=footLeft+14, targetAnchor=82;
  let scale=Math.min((id==='benny'?254:286)/(bottom-top+1), (310-targetAnchor)/Math.max(1,right-anchor),(targetAnchor-9)/Math.max(1,anchor-left));
  let width=Math.round((right-left+1)*scale),height=Math.round((bottom-top+1)*scale);
  const image=await sharp(data,{raw:{width:w,height:h,channels:4}}).extract({left,top,width:right-left+1,height:bottom-top+1}).resize(width,height).png().toBuffer();
  const dx=Math.round(targetAnchor-(anchor-left)*scale),dy=315-height;
  if(dx<5||dx+width>315||dy<5)throw Error('unsafe cell '+id+frame);
  composites.push({input:image,left:col*320+dx,top:row*320+dy});report.push({frame,source:[left,top,right,bottom],rect:[dx,dy,width,height],anchor:targetAnchor});
 }
 await sharp({create:{width:1280,height:1280,channels:4,background:'#00000000'}}).composite(composites).webp({lossless:true}).toFile(`${out}/${id}-v1.webp`);
 await writeFile(`${out}/${id}-v1.json`,JSON.stringify({source:file,cuts,frames:report},null,2));console.log(id,report.map(r=>r.rect));
}
