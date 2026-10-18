import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildSaberAsset} from '../src/saber-asset';
import {encodeVehicleGlb} from './vehicle-glb';
const root=buildSaberAsset(),bytes=encodeVehicleGlb(root,()=>{throw Error('Original Saber uses no external textures');},{generator:'Quarry Impact original Saber 2.0 GT',copyright:'Original Quarry Impact vehicle artwork, 2026'});
writeFileSync(new URL('../public/models/saber.glb',import.meta.url),bytes);
let vertices=0,meshes=0;root.traverse((o:any)=>{if(o.isMesh){vertices+=o.geometry.attributes.position.count;meshes++;}});console.log(JSON.stringify({bytes:bytes.length,vertices,meshes,sha256:createHash('sha256').update(bytes).digest('hex')}));
