import {writeFileSync} from 'node:fs';
import {buildTernAsset} from '../src/tern-asset';
import {encodeVehicleGlb} from './vehicle-glb';
const root=buildTernAsset(),b=encodeVehicleGlb(root,()=>{throw Error('Original Tern uses no external textures');},{generator:'Quarry Impact original Tern 1400 pressings',copyright:'Original Quarry Impact vehicle artwork, 2026'});
for(const name of ['tern.glb','tern-candidate.glb'])writeFileSync(new URL('../public/models/'+name,import.meta.url),b);
let vertices=0,meshes=0;root.traverse((o:any)=>{if(o.isMesh){vertices+=o.geometry.attributes.position.count;meshes++;}});console.log(JSON.stringify({bytes:b.length,vertices,meshes}));
