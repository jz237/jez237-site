import {writeFileSync} from 'node:fs';
import {buildMartenAsset} from '../src/marten-asset';
import {encodeVehicleGlb} from './vehicle-glb';
const root=buildMartenAsset(),bytes=encodeVehicleGlb(root,()=>{throw Error('Original Marten uses no external textures');},{generator:'Quarry Impact original Marten 1600 rear-engine coupe',copyright:'Original Quarry Impact vehicle artwork, 2026'});
for(const name of ['marten.glb','marten-candidate.glb'])writeFileSync(new URL('../public/models/'+name,import.meta.url),bytes);
let vertices=0,meshes=0;root.traverse((o:any)=>{if(o.isMesh){vertices+=o.geometry.attributes.position.count;meshes++;}});console.log(JSON.stringify({bytes:bytes.length,vertices,meshes}));
