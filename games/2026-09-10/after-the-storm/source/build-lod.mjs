// Optional offline authoring tool; no dependency or build step is needed to play.
// npm install --no-save meshoptimizer@0.24.0, then node source/build-lod.mjs
import {readFileSync,writeFileSync} from 'node:fs';
const {MeshoptSimplifier}=await import(process.argv[2]||'meshoptimizer');
await MeshoptSimplifier.ready;
for(const name of ['tideline-r01','coastal-rider']){
 const root=new URL('../assets/',import.meta.url),meta=JSON.parse(readFileSync(new URL(name+'.json',root),'utf8')),data=readFileSync(new URL(name+'.bin',root));
 let offset=0,total=0,original=0;const chunks=[];
 const meshes=meta.meshes.map(part=>{
  const vertices=[],normals=[],indices=new Uint32Array(part.vertices),unique=new Map();
  for(let i=0;i<part.vertices;i++){
   const v=Array.from({length:6},(_,k)=>data.readFloatLE(part.offset+i*24+k*4));
   const key=v.map(x=>Math.round(x*1e6)).join(',');let id=unique.get(key);
   if(id===undefined){id=vertices.length/3;unique.set(key,id);vertices.push(...v.slice(0,3));normals.push(...v.slice(3));}indices[i]=id;
  }
  const positions=new Float32Array(vertices),attributes=new Float32Array(normals);
  const [simplified,error]=part.vertices>192?MeshoptSimplifier.simplifyWithAttributes(indices,positions,3,attributes,3,[.1,.1,.1],null,Math.max(144,Math.floor(part.vertices*.34/3)*3),.008):[indices,0];
  const chunk=Buffer.alloc(simplified.length*24);for(let i=0;i<simplified.length;i++)for(let k=0;k<3;k++){chunk.writeFloatLE(positions[simplified[i]*3+k],i*24+k*4);chunk.writeFloatLE(attributes[simplified[i]*3+k],i*24+12+k*4);}
  const result={...part,offset,vertices:simplified.length,error};offset+=chunk.length;chunks.push(chunk);total+=simplified.length/3;original+=part.vertices/3;return result;
 });
 writeFileSync(new URL(name+'-lod.bin',root),Buffer.concat(chunks));writeFileSync(new URL(name+'-lod.json',root),JSON.stringify({...meta,meshes,lod:{source:name,algorithm:'meshoptimizer 0.24.0 / attribute-aware edge collapse',originalTriangles:original,triangles:total}}));
 console.log(name+': '+original+' → '+total+' triangles');
}
