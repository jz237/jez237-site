import {readFileSync,writeFileSync} from 'node:fs';
import * as T from 'three';
import {encodeVehicleGlb} from './vehicle-glb';
import {MUSCLE_TEXTURES} from '../src/muscle-asset';
import {buildEstateAsset,buildPlayableEstateAsset} from '../src/estate-asset';

// Deterministic, image-decoder-free GLB writer. Texture bytes are embedded
// unchanged; geometry and material construction use the same reviewed importer.
const folder=new URL('../public/models/brightretro-muscle/',import.meta.url);
const textures:Partial<Record<keyof typeof MUSCLE_TEXTURES,T.Texture>>={};
for(const [key,file]of Object.entries(MUSCLE_TEXTURES)){const t=new T.Texture();t.userData.file=file+'.png';textures[key as keyof typeof MUSCLE_TEXTURES]=t;}
const root=buildEstateAsset(readFileSync(new URL('FireGTO.obj',folder),'utf8'),textures);
const bytes=encodeVehicleGlb(root,name=>readFileSync(new URL(name,folder)),{generator:'Quarry Impact estate asset importer',copyright:'Muscle Car 3D Model by BrightRetro, CC-BY 3.0; original estate conversion for Quarry Impact'});
writeFileSync(new URL('../public/models/estate-candidate.glb',import.meta.url),bytes);
console.log(`estate-candidate.glb: ${bytes.length} bytes`);

const playable=buildPlayableEstateAsset(readFileSync(new URL('FireGTO.obj',folder),'utf8'),textures);
const playableBytes=encodeVehicleGlb(playable,name=>readFileSync(new URL(name,folder)),{generator:'Quarry Impact playable estate importer',copyright:'Muscle Car 3D Model by BrightRetro, CC-BY 3.0; original estate conversion for Quarry Impact'});
writeFileSync(new URL('../public/models/wagon.glb',import.meta.url),playableBytes);
console.log(`wagon.glb: ${playableBytes.length} bytes`);
