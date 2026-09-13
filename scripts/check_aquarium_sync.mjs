import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,relative,sep} from 'node:path';
import {pathToFileURL} from 'node:url';

export const aquariumCopies=['demos/rotatable-aquascape','prototypes/hidden-reef/showroom/aquarium','prototypes/hidden-reef-header-preview/showroom/aquarium'];
const hash=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
function files(directory,prefix=''){
 return readdirSync(directory,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(resolve(directory,e.name),prefix+e.name+'/'):[prefix+e.name]);
}
/** Check active bundles, plus every model/texture/public asset. Old hashed
 * bundles can remain for rollback; wrapper navigation may differ by site. */
export function checkAquariumSync(root=resolve(import.meta.dirname,'..')){
 const entries=aquariumCopies.map(p=>{
  const html=readFileSync(resolve(root,p,'index.html'),'utf8');
  const assets=[...html.matchAll(/(?:src|href)=["']\.\/assets\/([^"']+\.(?:js|css))["']/g)].map(m=>m[1]).sort();
  if(!assets.some(f=>f.endsWith('.js'))||!assets.some(f=>f.endsWith('.css')))throw Error(`Missing active aquarium bundle in ${p}`);
  return assets;
 });
 for(let i=1;i<entries.length;i++)if(JSON.stringify(entries[i])!==JSON.stringify(entries[0]))throw Error(`Aquarium bundle mismatch: ${aquariumCopies[i]}. Run npm run build:sites in scripts/rotatable-aquascape.`);
 const publicRoot=resolve(root,'scripts/rotatable-aquascape/public');
 const assets=[...entries[0].map(f=>['assets/'+f,resolve(root,aquariumCopies[0],'assets',f)]),...files(publicRoot).map(f=>[f,resolve(publicRoot,f)])];
 for(const [file,source] of assets){
  const expected=hash(source);
  for(const copy of aquariumCopies){
   const directory=resolve(root,copy),target=resolve(directory,file),rel=relative(directory,target);
   if(rel==='..'||rel.startsWith('..'+sep))throw Error('Aquarium asset escaped its directory.');
   if(hash(target)!==expected)throw Error(`Aquarium asset mismatch: ${copy}/${file}`);
  }
 }
 return assets.length;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{console.log(`Aquarium synchronization passed (${checkAquariumSync()} assets across all three copies).`);}
 catch(error){console.error(error.message);process.exitCode=1;}
}
