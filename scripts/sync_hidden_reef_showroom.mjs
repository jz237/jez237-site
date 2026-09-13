// Run after npm --prefix scripts/rotatable-aquascape run build.
// Keeps both existing Hidden Reef variants on the same tested showroom bundle.
import {cpSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const site=resolve(root,'prototypes/hidden-reef');
const preview=resolve(root,'prototypes/hidden-reef-header-preview');
const dist=resolve(root,'scripts/rotatable-aquascape/dist');
cpSync(dist,resolve(site,'showroom/aquarium'),{recursive:true});
const entry=resolve(site,'showroom/aquarium/index.html');
writeFileSync(entry,readFileSync(entry,'utf8').replace('href="../living-aquascape/"','href="../"').replace('View the photographic aquarium','Return to the showroom'));
for(const file of ['assets/showroom.js','assets/showroom.css','assets/site/showroom-preview.jpg','assets/link-modal.js','assets/reef-background.js'])cpSync(resolve(site,file),resolve(preview,file));
mkdirSync(resolve(preview,'showroom'),{recursive:true});
cpSync(resolve(site,'showroom'),resolve(preview,'showroom'),{recursive:true});
writeFileSync(resolve(preview,'index.html'),readFileSync(resolve(site,'index.html'),'utf8').replace('site-masthead.css?v=20260906-animated"','site-masthead.css?v=20260906-animated-preview"').replace('reef-background.js?v=20260906-performance','reef-background.js?v=20260712-unified-nav'));
console.log('Synchronized the Living Showroom and aquarium build in both storefront variants.');
