import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const sharp=createRequire(import.meta.url)(process.env.SHARP_PACKAGE || 'sharp');
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const repairs=[];
const add=(id,file,frames,bank,why)=>{for(const frame of frames)repairs.push({id,file,frame,sourceBank:bank,sourceFrame:frame,why});};
const map=(id,file,mapping,why)=>{for(const [frame,[sourceBank,sourceFrame]]of Object.entries(mapping))repairs.push({id,file,frame:+frame,sourceBank,sourceFrame,why});};
const same={
 jez:{'unified-ext2':[7],'unified-ext3':[1,3,5,7,9,11,14,15],'unified-ext4':[3,12,15],'unified-ext5':[1,9,11,12],specials:[1,2,5,9,10,14,15]},
 benny:{unified:[15],'unified-ext2':[12,13,14,15],'unified-ext3':[0,3,5,8,9,13,14,15],'unified-ext4':[1,3,12,15],'unified-ext5':[0,8,9,11,12,15],specials:[9,10,12,15]}
};
for(const[id,banks]of Object.entries(same))for(const[bank,frames]of Object.entries(banks)){
 const file=bank==='specials'?`assets/moves/${id}-specials.webp`:`assets/unified/${id}${bank==='unified'?'':'-'+bank.split('-')[1]}.webp`;
 add(id,file,frames,bank,'Visually cropped head, hand, foot, effect, or edge-touching extremity; replace whole cell with reviewed complete drawing.');
}
const baseMap={0:['unified',0],1:['unified',0],2:['unified',0],3:['unified',7],4:['unified',1],5:['unified',2],9:['unified-ext3',0],10:['unified-ext3',2],11:['unified',7],13:['unified-ext3',14],14:['unified-ext4',3],15:['unified-ext5',11]};
for(const file of ['assets/atlases/benny.webp','renderer/hd/benny.webp'])map('benny',file,baseMap,'Detached neighboring boots/fists or missing extremities baked inside the cell.');
map('benny','assets/motion/benny.webp',{3:['specials',9],7:['unified-ext5',1]},'Raised fist/dash hand touches the cut edge.');
map('jez','assets/motion/jez.webp',{0:['unified-ext3',0],2:['unified-ext3',3],3:['unified-ext3',9],7:['unified-ext5',1],13:['unified-ext5',11],15:['unified-ext3',0]},'Clipped strike hands, erased torso region or raised fist.');
for(const id of ['jez','benny']){
 map(id,`assets/motion2/${id}.webp`,{12:['unified-ext5',14]},'Throw reach has a boot clipped at the left boundary.');
 map(id,`assets/motion3/${id}.webp`,{2:['unified',8],3:['unified-ext5',5],...(id==='benny'?{1:['unified-ext3',8]}:{})},'Head/cap or raised fingertips touch the top crop.');
}
map('benny','assets/unified/benny-ext.webp',{3:['unified',8]},'Jump pose has an erased face/neck inside its otherwise empty margin.');
for(const file of ['assets/moves/legacy/benny-specials.webp','renderer/hd/benny-specials.webp'])add('benny',file,[1,5,8,9,10,11,12,13,14,15],'specials','Clipped hand/head/boot or baked white separator bars.');
for(const file of ['assets/moves/legacy/jez-specials.webp','renderer/hd/jez-specials.webp'])add('jez',file,[1,2,5],'specials','Cross-cell blade tip or dash-effect fragment.');
// Originals remain in git history at the audited baseline.
const sourceBuffers=new Map();
for(const rep of repairs){const key=`${rep.id}-${rep.sourceBank}`;if(!sourceBuffers.has(key))sourceBuffers.set(key,await readFile(`${root}/assets/inbetweens/${key}-v1.webp`));}
for(const file of [...new Set(repairs.map(r=>r.file))]){
 const before=execFileSync('git',['show',`4990e7df82552cbc0104117ba8776f197db20b91:games/2026-08-20/final-blow/${file}`],{cwd:root,maxBuffer:32*1024*1024});
 const {data,info}=await sharp(before).ensureAlpha().raw().toBuffer({resolveWithObject:true});const size=info.width/4;
 const composites=[];
 for(const rep of repairs.filter(r=>r.file===file)){
  const left=rep.frame%4*size,top=Math.floor(rep.frame/4)*size;
  for(let y=top;y<top+size;y++)data.fill(0,(y*info.width+left)*4,(y*info.width+left+size)*4);
  const input=await sharp(sourceBuffers.get(`${rep.id}-${rep.sourceBank}`)).extract({left:rep.sourceFrame%4*320,top:Math.floor(rep.sourceFrame/4)*320,width:320,height:320}).resize(size,size).ensureAlpha().raw().toBuffer();
  for(let y=0;y<size;y++)input.copy(data,((top+y)*info.width+left)*4,y*size*4,(y+1)*size*4);
  composites.push(rep);
 }
 await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).webp({lossless:true,effort:6}).toFile(`${root}/${file}`);
 console.log(file,composites.length,'cells repaired');
}
const reviewed=[];
for(const id of ['jez','benny']){
 for(const dir of ['atlases','motion','motion2','motion3','walk','moves','moves/legacy'])reviewed.push({file:`assets/${dir}/${id}${dir.startsWith('moves')?'-specials':''}.webp`,cells:dir==='motion3'?8:dir==='walk'?4:16});
 for(const suffix of ['','-ext','-ext2','-ext3','-ext4','-ext5'])reviewed.push({file:`assets/unified/${id}${suffix}.webp`,cells:suffix==='-ext'?8:16});
 for(const suffix of ['','-specials'])reviewed.push({file:`renderer/hd/${id}${suffix}.webp`,cells:16});
 reviewed.push({file:`assets/fighters/${id}.webp`,cells:1,notes:'Portrait, not a fighting atlas; complete figure reviewed.'});
}
await writeFile(`${root}/tools/painted-flow/old-atlas-audit.json`,JSON.stringify({version:'5.4.8',scope:['jez','benny'],reviewed,repairs},null,2)+'\n');

console.log('TOTAL',repairs.length,'repairs;',reviewed.reduce((n,r)=>n+r.cells,0),'reviewed cells');
