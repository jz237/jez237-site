import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const textFile=/\.(html|js|json|css)$/;
const normalized=(data,path)=>textFile.test(path)?Buffer.from(data.toString('utf8').replaceAll('\r\n','\n')):data;
const digest=data=>createHash('sha256').update(data).digest('hex');
export function oceanFiles(repo){
 return ['demos/index.html',...readdirSync(resolve(repo,'demos/open-sea'),{recursive:true,withFileTypes:true})
  .filter(e=>e.isFile()).map(e=>'demos/open-sea/'+resolve(e.parentPath,e.name).slice(resolve(repo,'demos/open-sea').length+1).replaceAll('\\','/'))];
}
export function checkOceanSnapshot(repo,stage){
 for(const path of oceanFiles(repo)){
  if(!existsSync(resolve(stage,path))||!normalized(readFileSync(resolve(repo,path)),path).equals(normalized(readFileSync(resolve(stage,path)),path)))
   throw Error(`Stale ocean upload snapshot: ${path} differs from the current checkout.`);
 }
}
export async function checkOpenSeaLive(base,repo,fetcher=fetch){
 const entry='demos/open-sea/index.html',expected=readFileSync(resolve(repo,entry),'utf8');
 const imports=s=>s.match(/<script type="importmap">(.*?)<\/script>/s)?.[1];
 const version=expected.match(/name="ocean-release" content="([^"]+)"/)?.[1];
 if(!version)throw Error('Missing ocean release version.');
 const request=async path=>{
  const url=new URL(path,base);url.searchParams.set('v',version);
  const r=await fetcher(url,{cache:'no-store'});if(!r.ok)throw Error(`Ocean release returned ${r.status}: ${path}`);
  return Buffer.from(await r.arrayBuffer());
 };
 const html=(await request(entry)).toString();
 const moduleEntry=s=>s.match(/<script type="module" src="([^"]+)"/s)?.[1];
 if(imports(html)!==imports(expected)||moduleEntry(html)!==moduleEntry(expected))throw Error('Live ocean entry is an older or mixed release.');
 for(const path of oceanFiles(repo).filter(p=>p!==entry&&p!=='demos/index.html')){
  const actual=await request(path),local=readFileSync(resolve(repo,path));
  if(digest(normalized(actual,path))!==digest(normalized(local,path)))throw Error(`Live ocean asset differs from the tested release: ${path}`);
 }
 console.log(`Ocean entry, complete module graph and yacht assets verified (${version}).`);
}
