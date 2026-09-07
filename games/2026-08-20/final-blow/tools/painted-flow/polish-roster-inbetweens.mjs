import {createRequire} from 'node:module';import {readFile,writeFile} from 'node:fs/promises';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const sharp=createRequire(import.meta.url)(process.env.SHARP_PACKAGE||'sharp');const root=fileURLToPath(new URL('../../',import.meta.url));
const {INBETWEEN_SCALE:metrics}=await import('../../engine/inbetween-scale.mjs');
// Reject defective generated cells and correct a few reversed fall orientations.
const fixes=[
 ['alan','unified-ext3',9,'specials',9],
 ['ali','unified-ext2',13,'unified-ext2',13,false,true],
 ['ali','unified-ext4',14,'unified-ext4',6,true],
 ['deathblow','unified-ext4',11,'unified-ext4',11,true],
 ['deathblow','unified-ext4',15,'unified-ext4',15,true],
 ['devil','unified-ext4',14,'unified-ext4',6],
 ['devil','unified-ext4',15,'unified-ext4',15,false,true],
 ['post','unified-ext4',14,'unified-ext4',6],
 ['post','unified-ext4',15,'unified',15]
];
function box(d,w,x0=0,y0=0,x1=w,y1=w){let l=x1,r=x0,t=y1,b=y0,n=0,sx=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(d[(y*w+x)*4+3]>140){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);n++;sx+=x;}return{l,r,t,b,n,cx:sx/n};}
const old=(id,bank)=>execFileSync('git',['show',`1a297c5e5c58979d0d12ce866182c6ab2d60a004:games/2026-08-20/final-blow/${bank==='specials'?`assets/moves/${id}-specials.webp`:`assets/unified/${id}${bank==='unified'?'':'-'+bank.split('-')[1]}.webp`}`],{cwd:root,maxBuffer:32*1024*1024});
for(const[id,bank,frame,sourceBank,sourceFrame,flop,original]of fixes){
 const path=`${root}/assets/inbetweens/${id}-${bank}-v1.webp`;
 const source=original?old(id,sourceBank):await readFile(`${root}/assets/inbetweens/${id}-${sourceBank}-v1.webp`);
 let img=sharp(source).extract({left:sourceFrame%4*320,top:Math.floor(sourceFrame/4)*320,width:320,height:320});if(flop)img=img.flop();
 const raw=await img.ensureAlpha().raw().toBuffer();const b=box(raw,320);
 const ref=await sharp(old(id,bank)).ensureAlpha().raw().toBuffer();const col=frame%4,row=Math.floor(frame/4),a=box(ref,1280,col*320,row*320,(col+1)*320,(row+1)*320);
 const scale=Math.min(Math.sqrt(a.n/b.n),304/(b.r-b.l+1),304/(b.b-b.t+1));const w=Math.round((b.r-b.l+1)*scale),h=Math.round((b.b-b.t+1)*scale);
 const x=Math.max(8,Math.min(312-w,Math.round(a.cx-col*320-(b.cx-b.l)*scale))),y=Math.max(8,Math.min(312-h,a.b-row*320+1-h));
 const piece=await sharp(raw,{raw:{width:320,height:320,channels:4}}).extract({left:b.l,top:b.t,width:b.r-b.l+1,height:b.b-b.t+1}).resize(w,h).ensureAlpha().raw().toBuffer();
 const dst=await sharp(await readFile(path)).ensureAlpha().raw().toBuffer();for(let yy=0;yy<320;yy++)dst.fill(0,((row*320+yy)*1280+col*320)*4,((row*320+yy)*1280+(col+1)*320)*4);
 for(let yy=0;yy<h;yy++)piece.copy(dst,((row*320+y+yy)*1280+col*320+x)*4,yy*w*4,(yy+1)*w*4);
 await writeFile(path,await sharp(dst,{raw:{width:1280,height:1280,channels:4}}).webp({lossless:true}).toBuffer());
 metrics[`${id}-${bank}`][frame]=Number((Math.sqrt(a.n/(b.n*scale*scale))).toFixed(5));
 const metaPath=path.replace('.webp','.json'),meta=JSON.parse(await readFile(metaPath,'utf8'));meta.cells[frame].reviewOverride={sourceBank,sourceFrame,flop:!!flop,original:!!original,rect:[x,y,w,h]};await writeFile(metaPath,JSON.stringify(meta,null,2));
}
await writeFile(`${root}/engine/inbetween-scale.mjs`,`export const INBETWEEN_SCALE = ${JSON.stringify(metrics)};\n`);
console.log(fixes.length,'review corrections applied');
