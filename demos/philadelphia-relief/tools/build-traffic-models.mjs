import {mkdir,writeFile} from 'node:fs/promises';
import * as THREE from '../vendor/three.module.min.js';

// Small self-contained glTF models: one vertex-colored draw primitive per car,
// no external textures or runtime mesh construction. Metres, Y up, +X forward.
const palette=[0xb3b7bb,0x293746,0xd6cdb6,0x813b30,0x3e586c,0xdcb646,0xdddeda];
const dir=new URL('../models/',import.meta.url);await mkdir(dir,{recursive:true});
for(const type of ['car','van','fixture'])for(let variant=0;variant<(type==='fixture'?1:palette.length);variant++){
  const van=type==='van';
  const positions=[],normals=[],colors=[];
  function box(x,y,z,l,h,w,tint){
    const g=new THREE.BoxGeometry(l,h,w).toNonIndexed(),c=new THREE.Color(tint);
    const p=g.attributes.position,n=g.attributes.normal;
    for(let i=0;i<p.count;i++){
      positions.push(p.getX(i)+x,p.getY(i)+y,p.getZ(i)+z);
      normals.push(n.getX(i),n.getY(i),n.getZ(i));
      const light=.72+Math.max(0,n.getY(i))*.28+Math.max(0,n.getZ(i))*.1;
      colors.push(c.r*light,c.g*light,c.b*light);
    }
    g.dispose();
  }
  if(type==='fixture'){
    box(0,29,0,180,2,80,0x667478);
    box(0,40,17,30,20,20,0xc9b69a);
  }else{
  const l=van?6.4:4.4,tint=palette[variant];
  box(0,van?1.15:.65,0,l,van?1.7:.75,1.85,tint);
  box(van?l*.5-.72:0,van?1.5:1.18,0,van?1.48:l*.52,.6,van?1.89:1.6,0x29424e);
  for(const side of [-1,1])for(const end of [-1,1])box(end*l*.31,.3,side*.9,.6,.55,.22,0x202221);
  for(const side of [-1,1]){
    box(l*.51,.65,side*.61,.12,.18,.38,0xffedba);
    box(-l*.51,.65,side*.61,.12,.18,.38,0xc73524);
  }
  box(van?l*.5-.72:0,van?1.83:1.51,0,van?1.2:l*.36,.09,van?1.65:1.4,tint);
  }
  const arrays=[positions,normals,colors].map(a=>new Float32Array(a));
  arrays.push(Uint16Array.from({length:positions.length/3},(_,i)=>i));
  const binary=Buffer.concat(arrays.map(a=>Buffer.from(a.buffer)));
  const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  positions.forEach((v,i)=>{min[i%3]=Math.min(min[i%3],v);max[i%3]=Math.max(max[i%3],v);});
  let offset=0;
  const gltf={asset:{version:'2.0',generator:'Philadelphia traffic models'},scene:0,
    extensionsUsed:['KHR_materials_unlit'],
    scenes:[{nodes:[0]}],nodes:[{mesh:0}],
    meshes:[{primitives:[{attributes:{POSITION:0,NORMAL:1,COLOR_0:2},indices:3,material:0}]}],
    materials:[{extensions:{KHR_materials_unlit:{}},
      pbrMetallicRoughness:{baseColorFactor:[1,1,1,1],metallicFactor:0,roughnessFactor:.8}}],
    buffers:[{byteLength:binary.length}],
    bufferViews:arrays.map((a,i)=>{const view={buffer:0,byteOffset:offset,byteLength:a.byteLength,
      target:i===3?34963:34962};
      offset+=a.byteLength;return view;}),
    accessors:arrays.map((a,i)=>({bufferView:i,componentType:i===3?5123:5126,
      count:i===3?a.length:a.length/3,type:i===3?'SCALAR':'VEC3',
      ...(i===0?{min,max}:{})}))};
  const raw=Buffer.from(JSON.stringify(gltf)),json=Buffer.alloc(Math.ceil(raw.length/4)*4,32);raw.copy(json);
  const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);
  header.writeUInt32LE(28+json.length+binary.length,8);header.writeUInt32LE(json.length,12);
  header.writeUInt32LE(0x4e4f534a,16);
  const chunk=Buffer.alloc(8);chunk.writeUInt32LE(binary.length);chunk.writeUInt32LE(0x004e4942,4);
  await writeFile(new URL(`traffic-${type}-${variant}.glb`,dir),Buffer.concat([header,json,chunk,binary]));
}
console.log('Built 14 traffic models and a local tile fixture.');
