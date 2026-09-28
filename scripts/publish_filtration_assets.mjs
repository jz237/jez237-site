import {cpSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),source=resolve(root,'scripts/rotatable-aquascape/filtration-dist');
for(const path of ['demos/reef-filtration','prototypes/hidden-reef/showroom/filtration','prototypes/hidden-reef-header-preview/showroom/filtration']){
 const target=resolve(root,path);mkdirSync(target,{recursive:true});cpSync(source,target,{recursive:true});
 if(path.startsWith('demos/')){const entry=resolve(target,'index.html');writeFileSync(entry,readFileSync(entry,'utf8').replace('href="../reef/?showroom=hidden-reef"','href="../reef-aquarium/"'));}
}
console.log('Published identical filtration assets to the demo and both showroom copies.');
