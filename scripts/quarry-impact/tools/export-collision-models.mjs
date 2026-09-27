import {readFile,writeFile} from 'node:fs/promises';
import * as T from 'three';
// Positions only: no DOM, renderer, texture decode or network access.
const bytes=await readFile(new URL('../public/models/rocks-lod.glb',import.meta.url));
const jsonLength=bytes.readUInt32LE(12),doc=JSON.parse(bytes.toString('utf8',20,20+jsonLength));
const binStart=28+jsonLength;
const variants=[];
function walk(index,parent){const n=doc.nodes[index],matrix=n.matrix?new T.Matrix4().fromArray(n.matrix):new T.Matrix4().compose(new T.Vector3().fromArray(n.translation??[0,0,0]),new T.Quaternion().fromArray(n.rotation??[0,0,0,1]),new T.Vector3().fromArray(n.scale??[1,1,1]));matrix.premultiply(parent);
 if(n.mesh!==undefined)for(const primitive of doc.meshes[n.mesh].primitives){const a=doc.accessors[primitive.attributes.POSITION],v=doc.bufferViews[a.bufferView],stride=v.byteStride??12,points=[];const bounds=new T.Box3();
  for(let i=0;i<a.count;i++){const offset=binStart+(v.byteOffset??0)+(a.byteOffset??0)+i*stride;const p=new T.Vector3(bytes.readFloatLE(offset),bytes.readFloatLE(offset+4),bytes.readFloatLE(offset+8)).applyMatrix4(matrix);points.push(p);bounds.expandByPoint(p);}
  const size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3()),scale=1/Math.max(size.x,size.y,size.z);const unique=new Map();
  for(const p of points){const xyz=[(p.x-center.x)*scale,(p.y-bounds.min.y)*scale,(p.z-center.z)*scale].map(x=>+x.toFixed(7));unique.set(xyz.join(','),xyz);}
  variants.push({name:n.name??doc.meshes[n.mesh].name,points:[...unique.values()].flat()});
 }for(const child of n.children??[])walk(child,matrix);}
for(const n of doc.scenes[doc.scene??0].nodes)walk(n,new T.Matrix4());
await writeFile(new URL('../src/quarry-rock-hulls.json',import.meta.url),JSON.stringify(variants));
const scree=new T.IcosahedronGeometry(1,1);let seed=9311;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const positions=scree.attributes.position;
for(let i=0;i<positions.count;i++)positions.setXYZ(i,positions.getX(i)*(1+rand()*.35),positions.getY(i)*(1+rand()*.35),positions.getZ(i)*(1+rand()*.35));
await writeFile(new URL('../src/quarry-scree.json',import.meta.url),JSON.stringify({positions:Array.from(positions.array),uv:Array.from(scree.attributes.uv.array)}));scree.dispose();
console.log(`Exported ${variants.length} normalized scanned-rock collision point clouds.`);
