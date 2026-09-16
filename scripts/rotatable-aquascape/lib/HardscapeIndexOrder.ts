/*! Adapted from meshoptimizer src/vcacheoptimizer.cpp.
 * https://github.com/zeux/meshoptimizer
MIT License

Copyright (c) 2016-2026 Arseny Kapoulkine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import * as T from 'three';

/** Face-only JavaScript port of meshoptimizer's vertex-cache ordering.
 * Works under the site's strict CSP without WebAssembly compilation. Attributes,
 * oriented triangles and moss placement are unchanged; only draw order changes. */
export async function reorderedFaces(source:Uint16Array|Uint32Array){
 const result=source.slice();if(!source.length)return result;
 if(source.length%3)throw Error('Triangle indices must be a multiple of three');
 let vertices=0;for(const v of source)vertices=Math.max(vertices,v+1);
 const faces=source.length/3,counts=new Uint32Array(vertices),offsets=new Uint32Array(vertices),adjacent=new Uint32Array(source.length);
 for(const v of source)counts[v]++;
 for(let v=0,total=0;v<vertices;v++){offsets[v]=total;total+=counts[v];}
 for(let i=0;i<source.length;i++)adjacent[offsets[source[i]]++]=Math.floor(i/3);
 for(let v=0;v<vertices;v++)offsets[v]-=counts[v];
 const cacheScores=[0,.779,.791,.789,.981,.843,.726,.847,.882,.867,.799,.642,.613,.600,.568,.372,.234];
 const liveScores=[0,.995,.713,.450,.404,.059,.005,.147,.006];
 const score=(position:number,live:number)=>Math.fround(cacheScores[position+1]+liveScores[Math.min(live,8)]);
 const vertexScores=new Float32Array(vertices),triangleScores=new Float32Array(faces),emitted=new Uint8Array(faces);
 for(let v=0;v<vertices;v++)vertexScores[v]=score(-1,counts[v]);
 for(let i=0;i<faces;i++)triangleScores[i]=Math.fround(Math.fround(vertexScores[source[i*3]]+vertexScores[source[i*3+1]])+vertexScores[source[i*3+2]]);
 let cache=new Uint32Array(20),nextCache=new Uint32Array(20),cacheCount=0,current=0,cursor=1,output=0;
 while(current>=0){
  const a=source[current*3],b=source[current*3+1],c=source[current*3+2];
  result[output++]=a;result[output++]=b;result[output++]=c;emitted[current]=1;triangleScores[current]=0;
  let written=3;nextCache[0]=a;nextCache[1]=b;nextCache[2]=c;
  for(let i=0;i<cacheCount;i++){const v=cache[i];if(v!==a&&v!==b&&v!==c)nextCache[written++]=v;}
  const oldCache=cache;cache=nextCache;nextCache=oldCache;cacheCount=Math.min(written,16);
  for(let k=0;k<3;k++){
   const v=source[current*3+k],offset=offsets[v],count=counts[v];
   for(let j=0;j<count;j++)if(adjacent[offset+j]===current){adjacent[offset+j]=adjacent[offset+count-1];counts[v]--;break;}
  }
  let best=-1,bestScore=0;
  for(let i=0;i<written;i++){
   const v=cache[i];if(!counts[v])continue;
   const value=score(i<16?i:-1,counts[v]),delta=Math.fround(value-vertexScores[v]);vertexScores[v]=value;
   for(let j=offsets[v],end=j+counts[v];j<end;j++){
    const tri=adjacent[j],value=Math.fround(triangleScores[tri]+delta);triangleScores[tri]=value;
    if(value>bestScore){bestScore=value;best=tri;}
   }
  }
  current=best;
  if(current<0){while(cursor<faces&&emitted[cursor])cursor++;if(cursor<faces)current=cursor++;}
 }
 return result;
}
export async function optimizeHardscapeIndices(scene:T.Scene){
 const geometries=new Set<T.BufferGeometry>();
 scene.traverse(object=>{
  if(!(object instanceof T.Mesh)||object instanceof T.InstancedMesh)return;
  const materials=Array.isArray(object.material)?object.material:[object.material];
  // Only opaque scanned hardscape: transparent sorting and animated fish normal
  // accumulation must retain their existing order. Run after moss placement.
  if(materials.length!==1||!materials[0].userData.bakeDiffuse||materials[0].transparent)return;
  if(object.geometry.index&&object.geometry.groups.length===0)geometries.add(object.geometry);
 });
 // Cloned branches and repeated rocks share topology. Reorder each topology
 // once; compare all indices after hashing so collisions can never change a mesh.
 const cache=new Map<number,{source:Uint16Array|Uint32Array;ordered:Uint16Array|Uint32Array}[]>();
 for(const geometry of geometries){
  const source=geometry.index!.array;
  if(source instanceof Uint16Array||source instanceof Uint32Array){
   let hash=2166136261;for(const v of source)hash=Math.imul(hash^v,16777619);
   const bucket=cache.get(hash)||[],match=bucket.find(entry=>entry.source.constructor===source.constructor&&entry.source.length===source.length&&entry.source.every((v,i)=>v===source[i]));
   const ordered=match?match.ordered:await reorderedFaces(source);
   if(!match){bucket.push({source,ordered});cache.set(hash,bucket);}
   geometry.setIndex(new T.BufferAttribute(ordered.slice(),1));
  }
 }
 return geometries.size;
}
