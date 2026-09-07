import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const sharp=createRequire(import.meta.url)(process.env.SHARP_PACKAGE || 'sharp');
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url)),repo=root;
const audit=JSON.parse(await readFile(`${root}/tools/painted-flow/old-atlas-audit.json`,'utf8'));
let checked=0;
for(const file of [...new Set(audit.repairs.map(r=>r.file))]){
 const before=await sharp(execFileSync('git',['show',`4990e7df82552cbc0104117ba8776f197db20b91:games/2026-08-20/final-blow/${file}`],{cwd:repo,maxBuffer:32*1024*1024})).ensureAlpha().raw().toBuffer();
 const {data,info}=await sharp(`${root}/${file}`).ensureAlpha().raw().toBuffer({resolveWithObject:true});const size=info.width/4;
 const fixed=new Set(audit.repairs.filter(r=>r.file===file).map(r=>r.frame));
 for(let f=0;f<info.height/size*4;f++){
  let count=0,border=0,diff=0;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const i=((Math.floor(f/4)*size+y)*info.width+(f%4*size+x))*4;
   if(data[i+3]>140)count++;
   if((x<4||x>=size-4||y<4||y>=size-4)&&data[i+3]>5)border++;
   if(!fixed.has(f))for(let c=0;c<4;c++)if(data[i+c]!==before[i+c]&&(data[i+3]||before[i+3]))diff++;
  }
  if(fixed.has(f)){if(count<500||border)throw Error(`${file}:${f} bad art / border ${border}`);checked++;}
  else if(diff)throw Error(`${file}:${f} untouched pixels changed (${diff})`);
 }
}
console.log(checked,'repaired cells verified; unaffected cells preserved');
