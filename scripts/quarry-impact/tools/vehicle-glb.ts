import * as T from 'three';

/** Embed source PNG bytes unchanged and convert texture coordinates to glTF. */
export function encodeVehicleGlb(root:T.Object3D,readTexture:(name:string)=>Buffer,metadata:{generator:string;copyright:string}){
const document:any={asset:{version:'2.0',generator:metadata.generator,copyright:metadata.copyright},scene:0,scenes:[{nodes:[0]}],nodes:[],meshes:[],materials:[],textures:[],images:[],samplers:[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}],buffers:[],bufferViews:[],accessors:[],extensionsUsed:['KHR_materials_clearcoat']};
const chunks:Buffer[]=[];let length=0;
function view(bytes:Buffer,target?:number){const padding=(4-length%4)%4;if(padding){chunks.push(Buffer.alloc(padding));length+=padding;}const i=document.bufferViews.length;document.bufferViews.push({buffer:0,byteOffset:length,byteLength:bytes.length,...(target?{target}:{})});chunks.push(bytes);length+=bytes.length;return i;}
const materialIds=new Map<T.Material,number>(),textureIds=new Map<T.Texture,number>();
function texture(t:T.Texture){if(textureIds.has(t))return textureIds.get(t);const id=document.textures.length;textureIds.set(t,id);document.images.push({bufferView:view(readTexture(t.userData.file)),mimeType:'image/png'});document.textures.push({source:document.images.length-1,sampler:0});return id;}
function material(m:T.MeshStandardMaterial){if(materialIds.has(m))return materialIds.get(m);const id=document.materials.length;materialIds.set(m,id);const p=m as T.MeshPhysicalMaterial;document.materials.push({name:m.name,pbrMetallicRoughness:{baseColorFactor:[m.color.r,m.color.g,m.color.b,m.opacity],metallicFactor:m.metalness,roughnessFactor:m.roughness,...(m.map?{baseColorTexture:{index:texture(m.map)}}:{})},...(m.transparent?{alphaMode:'BLEND'}:{}),doubleSided:m.side===T.DoubleSide,...(p.clearcoat?{extensions:{KHR_materials_clearcoat:{clearcoatFactor:p.clearcoat,clearcoatRoughnessFactor:p.clearcoatRoughness}}}:{})});return id;}
function accessor(attribute:T.BufferAttribute,position=false){const array=Float32Array.from(attribute.array);
  // OBJ/TextureLoader uses bottom-origin UVs; glTF images use top-origin UVs.
  // Invert V instead of altering the original, attributed texture pixels.
  if(attribute.itemSize===2)for(let i=1;i<array.length;i+=2)array[i]=1-array[i];
  const id=document.accessors.length;const value:any={bufferView:view(Buffer.from(array.buffer),34962),componentType:5126,count:attribute.count,type:attribute.itemSize===2?'VEC2':'VEC3'};if(position){const box=new T.Box3().setFromBufferAttribute(attribute);value.min=box.min.toArray();value.max=box.max.toArray();}document.accessors.push(value);return id;}
function node(o:T.Object3D){const id=document.nodes.length,n:any={name:o.name,translation:o.position.toArray(),rotation:o.quaternion.toArray(),scale:o.scale.toArray()};document.nodes.push(n);
  if(o instanceof T.Mesh){const g=o.geometry;if(g.index||Array.isArray(o.material))throw new Error('Importer must supply non-indexed, single-material meshes');n.mesh=document.meshes.length;document.meshes.push({name:o.name,primitives:[{attributes:{POSITION:accessor(g.getAttribute('position') as T.BufferAttribute,true),NORMAL:accessor(g.getAttribute('normal') as T.BufferAttribute),TEXCOORD_0:accessor(g.getAttribute('uv') as T.BufferAttribute)},material:material(o.material as T.MeshStandardMaterial)}]});}
  if(o.children.length)n.children=o.children.map(node);return id;
}
node(root);document.buffers.push({byteLength:length});
const bin=Buffer.concat(chunks),rawJson=Buffer.from(JSON.stringify(document)),json=Buffer.concat([rawJson,Buffer.alloc((4-rawJson.length%4)%4,32)]),binary=Buffer.concat([bin,Buffer.alloc((4-bin.length%4)%4)]);
const header=Buffer.alloc(12);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(12+8+json.length+8+binary.length,8);
const chunkHeader=(n:number,type:number)=>{const b=Buffer.alloc(8);b.writeUInt32LE(n);b.writeUInt32LE(type,4);return b;};
return Buffer.concat([header,chunkHeader(json.length,0x4e4f534a),json,chunkHeader(binary.length,0x004e4942),binary]);
}
