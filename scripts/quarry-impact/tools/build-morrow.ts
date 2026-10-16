import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildMorrowAsset} from '../src/morrow-asset';
import {encodeVehicleGlb} from './vehicle-glb';
const root=buildMorrowAsset(),bytes=encodeVehicleGlb(root,()=>{throw Error('Original Morrow uses no external textures');},{generator:'Quarry Impact original Morrow 420',copyright:'Original Quarry Impact vehicle artwork, 2026'});
writeFileSync(new URL('../public/models/morrow.glb',import.meta.url),bytes);
let vertices=0,meshes=0;root.traverse((o:any)=>{if(o.isMesh){vertices+=o.geometry.attributes.position.count;meshes++;}});console.log(JSON.stringify({bytes:bytes.length,vertices,meshes,sha256:createHash('sha256').update(bytes).digest('hex')}));
