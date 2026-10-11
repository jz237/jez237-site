import {publishGeneratedAssets} from './publish_generated_assets.mjs';
import {resolve} from 'node:path';
import {installReefNavigation} from './reef_navigation.mjs';
import {checkAquariumSync} from './check_aquarium_sync.mjs';
const root=resolve(import.meta.dirname,'..');
publishGeneratedAssets(resolve(root,'scripts/rotatable-aquascape/dist'),resolve(root,'demos/rotatable-aquascape'));
installReefNavigation(root);checkAquariumSync(root);
console.log('Updated gallery aquarium only. Hidden Reef is maintained separately on Evo X2.');
