import {cpSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {installReefNavigation} from './reef_navigation.mjs';
const root=resolve(import.meta.dirname,'..');
mkdirSync(resolve(root,'demos/reef-aquarium'),{recursive:true});
cpSync(resolve(root,'scripts/rotatable-aquascape/reef-dist'),resolve(root,'demos/reef-aquarium'),{recursive:true});
installReefNavigation(root);
console.log('Updated gallery reef only.');
