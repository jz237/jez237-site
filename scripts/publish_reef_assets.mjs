import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {publishGeneratedAssets} from './publish_generated_assets.mjs';
import {installReefNavigation} from './reef_navigation.mjs';
const root=resolve(import.meta.dirname,'..');
mkdirSync(resolve(root,'demos/reef-aquarium'),{recursive:true});
publishGeneratedAssets(resolve(root,'scripts/rotatable-aquascape/reef-dist'),resolve(root,'demos/reef-aquarium'));
installReefNavigation(root);
console.log('Updated gallery reef only.');
