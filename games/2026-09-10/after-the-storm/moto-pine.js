import {loadBinary} from './asset-binary.js';
import * as T from './vendor/three.module.js';
// Repacked from this site's Mini Moto / Pine Ridge tree. Shared across venues.
// A procedural tree remains available if the optional asset cannot be loaded.
export const motoPine=await (async()=>{try{
 const url=name=>new URL('./assets/scenery/'+name,import.meta.url).href;
 const loader=new T.TextureLoader();
 const [metaResponse,bin,bark,bough]=await Promise.all([fetch(url('pine.json')),loadBinary('assets/scenery/pine.bin'),loader.loadAsync(url('pine-bark.jpg')),loader.loadAsync(url('pine-bough.webp'))]);if(!metaResponse.ok)throw Error('Pine asset unavailable');
 const meta=await metaResponse.json();
 const shapes=meta.meshes.map(part=>{const geometry=new T.BufferGeometry();for(const [name,a]of Object.entries(part)){const Type=a.type===5126?Float32Array:a.type===5125?Uint32Array:Uint16Array,attribute=new T.BufferAttribute(new Type(bin,a.offset,a.length),a.itemSize);if(name==='index')geometry.setIndex(attribute);else geometry.setAttribute({POSITION:'position',NORMAL:'normal',TEXCOORD_0:'uv'}[name],attribute);}geometry.applyQuaternion(new T.Quaternion(...meta.rotation));geometry.computeBoundingBox();return geometry;});
 const bounds=new T.Box3();shapes.forEach(g=>bounds.union(g.boundingBox));const scale=13/(bounds.max.y-bounds.min.y),center=bounds.getCenter(new T.Vector3());for(const g of shapes){g.translate(-center.x,-bounds.min.y,-center.z);g.scale(scale,scale,scale);g.setAttribute('color',new T.Float32BufferAttribute(new Float32Array(g.attributes.position.count*3).fill(1),3));g.computeBoundingSphere();}
 for(const texture of [bark,bough]){texture.colorSpace=T.SRGBColorSpace;texture.flipY=false;texture.anisotropy=4;}
 return {wood:shapes[0],leaf:shapes[1],bark,bough};
 }catch(error){console.warn('Using built-in pine scenery:',error.message);return null;}})();
