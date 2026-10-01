import {readFileSync,writeFileSync} from 'node:fs';
import * as T from 'three';
import {encodeVehicleGlb} from './vehicle-glb';
import {buildPlayableMuscleAsset,MUSCLE_TEXTURES} from '../src/muscle-asset';

// Deterministic, image-decoder-free GLB writer. Texture bytes are embedded
// unchanged; geometry and material construction use the same reviewed importer.
const folder=new URL('../public/models/brightretro-muscle/',import.meta.url);
const textures:Partial<Record<keyof typeof MUSCLE_TEXTURES,T.Texture>>={};
for(const [key,file]of Object.entries(MUSCLE_TEXTURES)){const t=new T.Texture();t.userData.file=file+'.png';textures[key as keyof typeof MUSCLE_TEXTURES]=t;}
const root=buildPlayableMuscleAsset(readFileSync(new URL('FireGTO.obj',folder),'utf8'),textures);
const bytes=encodeVehicleGlb(root,name=>readFileSync(new URL(name,folder)),{generator:'Quarry Impact muscle asset importer',copyright:'Muscle Car 3D Model by BrightRetro, CC-BY 3.0; adapted for Quarry Impact'});
writeFileSync(new URL('../public/models/muscle.glb',import.meta.url),bytes);
console.log(`muscle.glb: ${bytes.length} bytes`);
