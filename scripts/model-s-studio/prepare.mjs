import {NodeIO} from '@gltf-transform/core';
import {Matrix4,Matrix3,Vector3} from 'three';
const io=new NodeIO(), doc=await io.read(process.argv[2] ?? 'scene.gltf');
const root=doc.getRoot(), oldNodes=root.listNodes(), buckets=new Map();
for(const node of oldNodes){
 if(!node.getMesh())continue;
 const matrix=new Matrix4().fromArray(node.getWorldMatrix()),normalMatrix=new Matrix3().getNormalMatrix(matrix);
 for(const p of node.getMesh().listPrimitives()){
  const mat=p.getMaterial();if(!buckets.has(mat))buckets.set(mat,{pos:[],norm:[],uv:[],idx:[]});const b=buckets.get(mat),offset=b.pos.length/3;
  const ps=p.getAttribute('POSITION'),ns=p.getAttribute('NORMAL'),uv=p.getAttribute('TEXCOORD_0');
  for(let i=0;i<ps.getCount();i++){
   const v=new Vector3().fromArray(ps.getElement(i,[])).applyMatrix4(matrix); b.pos.push((v.x+102.8)/100,v.y/100,(v.z+641.2)/100);
   const n=ns?new Vector3().fromArray(ns.getElement(i,[])).applyMatrix3(normalMatrix).normalize():new Vector3(0,1,0); b.norm.push(...n.toArray());b.uv.push(...(uv?uv.getElement(i,[]):[0,0]));
  }
  const indices=p.getIndices();for(let i=0;i<(indices?.getCount()??ps.getCount());i++)b.idx.push(offset+(indices?indices.getScalar(i):i));
 }
}
const scene=doc.createScene('Model S exploded study'); const buffer=root.listBuffers()[0]; let total=0;
const stats=[];
for(const [material,b] of buckets){
 const n=b.pos.length/3,parent=new Int32Array(n),byPosition=new Map();
 const find=x=>{while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;};
 const union=(a,c)=>{a=find(a);c=find(c);if(a!==c)parent[c]=a;};
 for(let i=0;i<n;i++){parent[i]=i;const key=b.pos.slice(i*3,i*3+3).map(v=>Math.round(v*100000)).join(',');if(byPosition.has(key))union(i,byPosition.get(key));else byPosition.set(key,i);}
 for(let i=0;i<b.idx.length;i+=3){union(b.idx[i],b.idx[i+1]);union(b.idx[i],b.idx[i+2]);}
 const components=new Map();for(let i=0;i<b.idx.length;i+=3){const id=find(b.idx[i]);if(!components.has(id))components.set(id,[]);components.get(id).push(b.idx[i],b.idx[i+1],b.idx[i+2]);}
 const describe=indices=>{const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(const i of indices)for(let a=0;a<3;a++){min[a]=Math.min(min[a],b.pos[i*3+a]);max[a]=Math.max(max[a],b.pos[i*3+a]);}return {indices,min,max,center:min.map((v,i)=>(v+max[i])/2)};};
 const islands=[...components.values()].map(describe).sort((a,c)=>c.indices.length-a.indices.length);
 // Keep substantial connected surfaces. Attach tiny islands to the nearest surface
 // of the same material, preserving small fasteners without thousands of draw calls.
 const anchors=islands.filter(x=>x.indices.length>=750); if(!anchors.length)anchors.push(islands[0]);
 for(const island of islands){if(anchors.includes(island))continue;let nearest=anchors[0],distance=Infinity;for(const a of anchors){const d=a.center.reduce((v,c,i)=>v+(c-island.center[i])**2,0);if(d<distance){distance=d;nearest=a;}}nearest.indices.push(...island.indices);}
 for(const a of anchors){
  const bounds=describe(a.indices),center=bounds.center,remap=new Map(),pos=[],norm=[],uv=[],idx=[];
  for(const old of a.indices){if(!remap.has(old)){remap.set(old,pos.length/3);pos.push(...b.pos.slice(old*3,old*3+3).map((v,i)=>v-center[i]));norm.push(...b.norm.slice(old*3,old*3+3));uv.push(...b.uv.slice(old*2,old*2+2));}idx.push(remap.get(old));}
  const acc=(name,type,array)=>doc.createAccessor(name).setType(type).setArray(array).setBuffer(buffer);
  const p=doc.createPrimitive().setAttribute('POSITION',acc('position','VEC3',new Float32Array(pos))).setAttribute('NORMAL',acc('normal','VEC3',new Float32Array(norm))).setIndices(acc('indices','SCALAR',new Uint32Array(idx))).setMaterial(material);
  if(material.getBaseColorTexture())p.setAttribute('TEXCOORD_0',acc('uv','VEC2',new Float32Array(uv)));
  const name=`Surface_${String(++total).padStart(3,'0')}`;
  scene.addChild(doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(p)).setTranslation(center).setExtras({sourceMaterial:material.getName(),center,bounds:[bounds.min,bounds.max]}));
 }
 stats.push([material.getName().replace('M_2022_Tesla_Model_S_Plaid_',''),islands.length,anchors.length]);
}
for(const s of root.listScenes())if(s!==scene)s.dispose();for(const node of oldNodes)node.dispose();root.setDefaultScene(scene);
await io.write(process.argv[3] ?? 'prepared.glb',doc); console.log({total,stats});
