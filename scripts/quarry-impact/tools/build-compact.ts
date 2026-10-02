import {writeFileSync} from 'node:fs';
import {buildCompactAsset} from '../src/compact-asset';
import {encodeVehicleGlb} from './vehicle-glb';
const bytes=encodeVehicleGlb(buildCompactAsset(),()=>{throw new Error('The original compact uses no external textures');},{generator:'Quarry Impact original Rook 1100 pressing authoring',copyright:'Original Quarry Impact vehicle artwork, 2026'});
for(const file of ['compact.glb','compact-candidate.glb'])writeFileSync(new URL('../public/models/'+file,import.meta.url),bytes);
console.log(JSON.stringify({bytes:bytes.length}));
