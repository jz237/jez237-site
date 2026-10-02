import {readFileSync,writeFileSync} from 'node:fs';import * as T from 'three';
import {encodeVehicleGlb} from './vehicle-glb';import {MUSCLE_TEXTURES} from '../src/muscle-asset';import {buildUtilityAsset} from '../src/utility-asset';
const folder=new URL('../public/models/brightretro-muscle/',import.meta.url),textures:Partial<Record<keyof typeof MUSCLE_TEXTURES,T.Texture>>={};
for(const [key,file]of Object.entries(MUSCLE_TEXTURES)){const t=new T.Texture();t.userData.file=file+'.png';textures[key as keyof typeof MUSCLE_TEXTURES]=t;}
const root=buildUtilityAsset(readFileSync(new URL('FireGTO.obj',folder),'utf8'),textures);
const bytes=encodeVehicleGlb(root,name=>readFileSync(new URL(name,folder)),{generator:'Quarry Impact coupe utility importer',copyright:'Muscle Car 3D Model by BrightRetro, CC-BY 3.0; original coupe utility conversion for Quarry Impact'});
writeFileSync(new URL('../public/models/utility-candidate.glb',import.meta.url),bytes);console.log('utility-candidate.glb',bytes.length,'wheelbase',root.userData.wheelbase);

root.name='IRONVALE UTILITY';
for(const label of ['FL','FR','RL','RR'])root.getObjectByName('wheel_'+label)!.position.set(label.endsWith('L')?-.79:.79,.3400195,label.startsWith('F')?1.525:-1.525);
root.updateMatrixWorld(true);
const playableBytes=encodeVehicleGlb(root,name=>readFileSync(new URL(name,folder)),{generator:'Quarry Impact playable utility importer',copyright:'Muscle Car 3D Model by BrightRetro, CC-BY 3.0; original coupe utility conversion for Quarry Impact'});
writeFileSync(new URL('../public/models/utility.glb',import.meta.url),playableBytes);console.log('utility.glb',playableBytes.length);
