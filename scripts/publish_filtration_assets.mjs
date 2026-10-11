import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {publishGeneratedAssets} from './publish_generated_assets.mjs';
const root=resolve(import.meta.dirname,'..'),source=resolve(root,'scripts/rotatable-aquascape/filtration-dist');
for(const path of ['demos/reef-filtration']){
 const target=resolve(root,path);mkdirSync(target,{recursive:true});publishGeneratedAssets(source,target);
 if(path.startsWith('demos/')){const entry=resolve(target,'index.html');writeFileSync(entry,readFileSync(entry,'utf8').replace('href="../reef/?showroom=hidden-reef"','href="../reef-aquarium/"'));}
}
console.log('Published filtration assets to the gallery demo.');
