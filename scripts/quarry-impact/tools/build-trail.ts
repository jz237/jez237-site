import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildTrailAsset} from '../src/trail-asset';
import {encodeVehicleGlb} from './vehicle-glb';
const root=buildTrailAsset(),bytes=encodeVehicleGlb(root,()=>{throw Error('Original trail uses no external textures');},{generator:'Quarry Impact original Birch Trail 4x4',copyright:'Original Quarry Impact vehicle artwork, 2026'});
writeFileSync(new URL('../public/models/trail.glb',import.meta.url),bytes);
let vertices=0,meshes=0;root.traverse((o:any)=>{if(o.isMesh){vertices+=o.geometry.attributes.position.count;meshes++;}});console.log(JSON.stringify({bytes:bytes.length,vertices,meshes,sha256:createHash('sha256').update(bytes).digest('hex')}));
