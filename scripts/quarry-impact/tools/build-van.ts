import {writeFileSync} from 'node:fs';
import {buildVanAsset} from '../src/van-asset';
import {encodeVehicleGlb} from './vehicle-glb';
const b=encodeVehicleGlb(buildVanAsset(),()=>{throw Error('Original van uses no external textures');},{generator:'Quarry Impact original Rillford Carrier pressings',copyright:'Original Quarry Impact vehicle artwork, 2026'});
for(const name of ['van.glb','van-candidate.glb'])writeFileSync(new URL('../public/models/'+name,import.meta.url),b);
console.log(JSON.stringify({bytes:b.length}));
