import {cpSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {installReefNavigation} from './reef_navigation.mjs';
const root=resolve(import.meta.dirname,'..');
mkdirSync(resolve(root,'demos/reef-aquarium'),{recursive:true});
cpSync(resolve(root,'scripts/rotatable-aquascape/reef-dist'),resolve(root,'demos/reef-aquarium'),{recursive:true});
installReefNavigation(root);
// User authorized showroom integration on September 24. Reuse the tested build.
for(const site of ['hidden-reef','hidden-reef-header-preview']){
 const target=resolve(root,'prototypes',site,'showroom/reef');mkdirSync(target,{recursive:true});
 cpSync(resolve(root,'scripts/rotatable-aquascape/reef-dist'),target,{recursive:true});
 const entry=resolve(target,'index.html');
 writeFileSync(entry,readFileSync(entry,'utf8').replaceAll('../rotatable-aquascape/','../aquarium/'));
}
for(const file of ['showroom/index.html','assets/showroom.js','assets/showroom.css','assets/site/reef-showroom-preview.webp']){
 cpSync(resolve(root,'prototypes/hidden-reef',file),resolve(root,'prototypes/hidden-reef-header-preview',file));
}
console.log('Prepared the same reef build for jez237 and both Hidden Reef showrooms.');
