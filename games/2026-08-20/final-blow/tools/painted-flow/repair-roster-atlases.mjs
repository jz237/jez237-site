import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const sharp=createRequire(import.meta.url)(process.env.SHARP_PACKAGE||'sharp');
const root=fileURLToPath(new URL('../../',import.meta.url));
const findings=JSON.parse(await readFile(new URL('./roster-findings.json',import.meta.url),'utf8'));
const inventory=JSON.parse(await readFile(new URL('./roster-inventory.json',import.meta.url),'utf8'));
const baseline='1a297c5e5c58979d0d12ce866182c6ab2d60a004';
const U='unified',A='unified-ext3',R='unified-ext4',T='unified-ext2',G='unified-ext5',S='specials';
const maps={
 motion:[[A,0],[A,1],[A,3],[A,9],[A,2],[U,9],[A,10],[G,1],[R,3],[R,9],[R,8],[R,6],[G,8],[G,11],[G,11],[A,5]],
 motion2:[[T,0],[T,2],[U,1],[U,2],[U,5],[G,3],[G,0],[U,8],[R,0],[R,1],[R,5],[R,6],[T,12],[A,6],[R,13],[U,5]],
 motion3:[[T,4],[U,9],[U,8],[G,5],[A,6],[G,1],[G,10],[G,7]],
 'unified-ext':[[U,0],[U,1],[U,2],[U,8],[G,7],[T,0],[T,2],[R,4]]
};
const base={
 alan:{},
 ali:{10:[S,2],11:[S,3],13:[S,9],14:[S,14],15:[R,3]},
 commissioner:{9:[A,0],10:[G,11],14:[G,8]},
 cyraxx:{0:[U,0],2:[U,0],3:[U,0],9:[A,0],14:[S,14]},
 deathblow:{8:[T,0],13:[S,9],14:[S,14]},
 devil:{9:[A,0],10:[A,3],13:[S,10],14:[S,2],15:[R,6]},
 donald:{5:[U,2],6:[U,3],8:[S,0],9:[S,1],10:[S,2],11:[S,3],14:[S,14]},
 post:{}
};
const fileFor=(id,bank)=>bank==='base'?`assets/atlases/${id}.webp`:bank==='hd-base'?`renderer/hd/${id}.webp`:bank==='hd-specials'?`renderer/hd/${id}-specials.webp`:bank==='specials'?`assets/moves/${id}-specials.webp`:bank==='legacy'?`assets/moves/legacy/${id}-specials.webp`:bank.startsWith('unified')?`assets/unified/${id}${bank===U?'':'-'+bank.split('-')[1]}.webp`:`assets/${bank}/${id}.webp`;
const repairs=[];
for(const[id,banks]of Object.entries(findings))for(const[bank,frames]of Object.entries(banks))for(const frame of frames){
 let src=bank==='base'||bank==='hd-base'?base[id][frame]:bank==='legacy'||bank==='hd-specials'?[S,frame]:maps[bank]?.[frame]||[bank,frame];
 if(!src)throw Error(`Missing donor ${id}:${bank}:${frame}`);
 repairs.push({id,file:fileFor(id,bank),frame,sourceBank:src[0],sourceFrame:src[1],why:'Visual audit: missing anatomy, cut extremity, or neighboring sprite/effect fragment.'});
}
for(const file of [...new Set(repairs.map(r=>r.file))]){
 if(process.argv[2]&&!file.includes(process.argv[2]))continue;
 const original=execFileSync('git',['show',`${baseline}:games/2026-08-20/final-blow/${file}`],{cwd:root,maxBuffer:32*1024*1024});
 const {data,info}=await sharp(original).ensureAlpha().raw().toBuffer({resolveWithObject:true});const size=info.width/4;
 for(const rep of repairs.filter(r=>r.file===file)){
  const input=await sharp(`${root}/assets/inbetweens/${rep.id}-${rep.sourceBank}-v1.webp`).extract({left:rep.sourceFrame%4*320,top:Math.floor(rep.sourceFrame/4)*320,width:320,height:320}).resize(size,size).ensureAlpha().raw().toBuffer();
  const left=rep.frame%4*size,top=Math.floor(rep.frame/4)*size;
  for(let y=0;y<size;y++)input.copy(data,((top+y)*info.width+left)*4,y*size*4,(y+1)*size*4);
 }
 await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).webp({lossless:true,effort:6}).toFile(`${root}/${file}`);
}
const reviewed=inventory.map(r=>({file:r.file,cells:r.file.includes('/fighters/')?1:r.file.includes('/walk/')?4:r.file.includes('/motion3/')||/-ext\.webp$/.test(r.file)?8:16}));
await writeFile(`${root}/tools/painted-flow/roster-atlas-audit.json`,JSON.stringify({version:'5.4.9',baseline,scope:Object.keys(findings),reviewed,repairs},null,2)+'\n');
console.log(repairs.length,'repaired cells in',new Set(repairs.map(r=>r.file)).size,'files;',reviewed.reduce((s,r)=>s+r.cells,0),'old cells reviewed');
