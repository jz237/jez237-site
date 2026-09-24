import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from 'three';
const metadata=JSON.parse(fs.readFileSync(new URL('../assets/fish/model-info.json',import.meta.url)));
const species=['tang','yellow','clown','anthias','chromis','gramma','goby'];
let totalTriangles=0;
for(const s of species){
 const buffer=fs.readFileSync(new URL(`../assets/fish/${s}.glb`,import.meta.url));assert.equal(buffer.readUInt32LE(0),0x46546c67);assert.equal(buffer.readUInt32LE(4),2);
 const jsonLength=buffer.readUInt32LE(12),gltf=JSON.parse(buffer.subarray(20,20+jsonLength).toString()),binary=buffer.subarray(28+jsonLength);
 const read=id=>{const a=gltf.accessors[id],view=gltf.bufferViews[a.bufferView],components={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type],bytes={5126:4,5125:4,5123:2,5121:1}[a.componentType],offset=(view.byteOffset||0)+(a.byteOffset||0),stride=view.byteStride||bytes*components,result=[];for(let i=0;i<a.count;i++)for(let k=0;k<components;k++){const p=offset+i*stride+k*bytes;result.push(a.componentType===5126?binary.readFloatLE(p):a.componentType===5125?binary.readUInt32LE(p):a.componentType===5123?binary.readUInt16LE(p):binary.readUInt8(p));}return a.normalized?result.map(v=>v/(a.componentType===5121?255:65535)):result;};
 assert.ok(gltf.images.length>=2,'independent clean skin and fin reference textures');assert.ok(gltf.images.every(i=>i.bufferView!==undefined),'textures embedded; no broken external URLs');
 const bodyPrimitive=gltf.meshes.find(m=>m.name===s+'__body').primitives[0];
 const imageFor=primitive=>gltf.textures[gltf.materials[primitive.material].pbrMetallicRoughness.baseColorTexture.index].source;
 const bodyImage=imageFor(bodyPrimitive);
 const nodes=gltf.nodes.map(n=>n.name);assert.ok(nodes.includes(s+'__body'));assert.equal(nodes.filter(n=>n.startsWith(s+'__gill')).length,2);assert.equal(nodes.filter(n=>n.startsWith(s+'__pectoral')).length,2);
 for(const mesh of gltf.meshes)for(const primitive of mesh.primitives){
  const p=read(primitive.attributes.POSITION),n=read(primitive.attributes.NORMAL),uv=read(primitive.attributes.TEXCOORD_0),indices=read(primitive.indices);
  assert.ok([...p,...n,...uv].every(Number.isFinite));assert.ok(indices.every(i=>i>=0&&i<p.length/3));totalTriangles+=indices.length/3;
  if(mesh.name.startsWith(s+'__gill')||mesh.name.startsWith(s+'__eye')){const side=mesh.name.endsWith('-1')?-1:1;const outward=n.filter((_,i)=>i%3===2).reduce((sum,z)=>sum+z*side,0);assert.ok(outward>0,mesh.name+' outward surface normals');}
  if(mesh.name.startsWith(s+'__fin_'))assert.equal(imageFor(primitive),bodyImage,'continuous skin texture across median fin roots');
  if(mesh.name===s+'__body'){
   assert.ok(primitive.attributes.COLOR_0!==undefined,'cavity depth belongs to colored mesh tissue');
   const colors=read(primitive.attributes.COLOR_0);assert.ok(Math.min(...colors)<.1&&Math.max(...colors)>=1,'cavity shaded inward while flank retains full texture');
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setIndex(indices);
   const model=new T.Mesh(geo,new T.MeshBasicMaterial()),mouth=metadata[s].mouth;
   const ray=new T.Raycaster(new T.Vector3(.8,mouth[1],0),new T.Vector3(-1,0,0)),hit=ray.intersectObject(model)[0];
   assert.ok(hit&&hit.point.x<.495&&hit.point.x>.46,'mouth center opens into recessed tissue instead of a flat head cap');
   geo.dispose();model.material.dispose();

   const rearZ=[];for(let i=0;i<p.length;i+=3)if(p[i]<-.49999)rearZ.push(Math.abs(p[i+2]));assert.ok(Math.max(...rearZ)<.0006,'thin peduncle joins the caudal membrane without a thick rear cap');
   // Verify closed geometry after welding exporter UV/normal splits by position.
   const ids=[],weld=new Map();for(let i=0;i<p.length;i+=3){const key=p.slice(i,i+3).map(v=>v.toFixed(6)).join(',');if(!weld.has(key))weld.set(key,weld.size);ids.push(weld.get(key));}
   const edges=new Map();for(let i=0;i<indices.length;i+=3)for(const [a,b] of [[0,1],[1,2],[2,0]]){const u=ids[indices[i+a]],v=ids[indices[i+b]],key=u<v?`${u}:${v}`:`${v}:${u}`;edges.set(key,(edges.get(key)||0)+1);}assert.ok([...edges.values()].every(n=>n===2),s+' body is watertight');
   const xs=p.filter((_,i)=>i%3===0);assert.ok(Math.min(...xs)<-.49&&Math.max(...xs)>.49,'full volumetric body length');
  }
 }
}
console.log(`Blender fish geometry passed: seven species, closed bodies, paired gills/fins, embedded skin textures, ${totalTriangles} source triangles.`);
