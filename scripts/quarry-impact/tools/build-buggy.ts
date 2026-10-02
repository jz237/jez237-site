import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildBuggyAsset} from '../src/buggy-asset';
import {encodeVehicleGlb} from './vehicle-glb';
const root=buildBuggyAsset(),bytes=encodeVehicleGlb(root,()=>{throw Error('Original Ravine uses no external textures');},{generator:'Quarry Impact original Ravine 1800 open-frame buggy',copyright:'Original Quarry Impact vehicle artwork, 2026'});
for(const name of ['buggy.glb','buggy-candidate.glb'])writeFileSync(new URL('../public/models/'+name,import.meta.url),bytes);
let vertices=0,meshes=0;const materials=new Set();root.traverse((o:any)=>{if(o.isMesh){vertices+=o.geometry.attributes.position.count;meshes++;materials.add(o.material);}});console.log(JSON.stringify({bytes:bytes.length,vertices,meshes,materials:materials.size,sha256:createHash('sha256').update(bytes).digest('hex')}));
