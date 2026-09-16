import * as T from 'three';
/** Share only bit-identical vertices, including normals, UV seams and articulation
 * attributes. Triangle order/winding stays identical, including transparent fins.
 * No tolerance, rounding, simplification or removal of small features. */
export function indexExactVertices(geometry:T.BufferGeometry){
 if(geometry.index||Object.keys(geometry.morphAttributes).length)return geometry;
 const entries=Object.entries(geometry.attributes);
 if(!entries.length||entries.some(([,a])=>!(a instanceof T.BufferAttribute)||!(a.array instanceof Float32Array)||a.count!==geometry.attributes.position.count))return geometry;
 const attributes=entries.map(([name,a])=>({name,attribute:a as T.BufferAttribute,bits:new Uint32Array(a.array.buffer,a.array.byteOffset,a.array.length)}));
 const count=geometry.attributes.position.count,heads=new Map<number,number>(),next=new Int32Array(count).fill(-1),representatives=new Uint32Array(count),indices=new Uint32Array(count);
 let unique=0;
 for(let vertex=0;vertex<count;vertex++){
  let hash=2166136261;
  for(const {attribute,bits} of attributes)for(let k=0;k<attribute.itemSize;k++)hash=Math.imul(hash^bits[vertex*attribute.itemSize+k],16777619);
  let match=heads.get(hash)??-1;
  while(match>=0){
   const original=representatives[match];let equal=true;
   for(const {attribute,bits} of attributes){for(let k=0;k<attribute.itemSize;k++)if(bits[vertex*attribute.itemSize+k]!==bits[original*attribute.itemSize+k]){equal=false;break;}if(!equal)break;}
   if(equal)break;match=next[match];
  }
  if(match<0){match=unique++;representatives[match]=vertex;next[match]=heads.get(hash)??-1;heads.set(hash,match);}
  indices[vertex]=match;
 }
 for(const {name,attribute,bits} of attributes){
  const compact=new Uint32Array(unique*attribute.itemSize);
  for(let vertex=0;vertex<unique;vertex++)for(let k=0;k<attribute.itemSize;k++)compact[vertex*attribute.itemSize+k]=bits[representatives[vertex]*attribute.itemSize+k];
  const replacement=new T.BufferAttribute(new Float32Array(compact.buffer),attribute.itemSize,attribute.normalized);
  replacement.name=attribute.name;replacement.setUsage(attribute.usage);replacement.gpuType=attribute.gpuType;geometry.setAttribute(name,replacement);
 }
 geometry.setIndex(new T.BufferAttribute(unique<65536?new Uint16Array(indices):indices,1));
 return geometry;
}
