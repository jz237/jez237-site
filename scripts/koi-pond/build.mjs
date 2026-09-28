import {cp,mkdir,readFile,writeFile,readdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=import.meta.dirname;
const dist=path.resolve(root,'dist');
if(path.dirname(dist)!==root||path.basename(dist)!=='dist')throw new Error('Build output must stay in this project.');
const hash=createHash('sha256');
for(const file of (await readdir(path.join(root,'src'))).sort())hash.update(file).update(await readFile(path.join(root,'src',file)));
const assetPath=`assets/${hash.digest('hex').slice(0,12)}`;
await mkdir(dist,{recursive:true});
for(const name of await readdir(dist)){
 const output=path.resolve(dist,name);
 if(path.dirname(output)!==dist)throw new Error('Invalid build output path');
 await rm(output,{recursive:true,force:true});
}
await cp(path.join(root,'public'),dist,{recursive:true});
await cp(path.join(root,'src'),path.join(dist,assetPath),{recursive:true});
const html=await readFile(path.join(root,'index.html'),'utf8');
await writeFile(path.join(dist,'index.html'),html.replaceAll('./src/',`./${assetPath}/`));
console.log('Built Hidden Reef Stillwater v3: static, self-hosted, no remote assets.');
