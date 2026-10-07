import type R from '@dimforge/rapier3d-compat';

type TerrainMesh={positions:Float32Array;indices:Uint32Array};

/** Spatially partition the existing faces, without changing or duplicating any
 * triangle. Small meshes keep continuous collision queries local to the car. */
export function terrainCollisionTiles(mesh:TerrainMesh,size=32){
 const cells=new Map<string,number[]>(),{positions,indices}=mesh;
 for(let i=0;i<indices.length;i+=3){
  const a=indices[i]*3,b=indices[i+1]*3,c=indices[i+2]*3;
  const x=Math.floor((positions[a]+positions[b]+positions[c])/(3*size));
  const z=Math.floor((positions[a+2]+positions[b+2]+positions[c+2])/(3*size)),key=x+':'+z;
  let cell=cells.get(key);if(!cell){cell=[];cells.set(key,cell);}cell.push(indices[i],indices[i+1],indices[i+2]);
 }
 return [...cells].map(([key,source])=>{
  const remap=new Map<number,number>(),vertices:number[]=[],faces:number[]=[];
  for(const original of source){
   let index=remap.get(original);
   if(index===undefined){index=remap.size;remap.set(original,index);vertices.push(positions[original*3],positions[original*3+1],positions[original*3+2]);}
   faces.push(index);
  }
  return{key,positions:new Float32Array(vertices),indices:new Uint32Array(faces)};
 });
}

// A physical tile edge is not another object to crash into. Preserve the one
// logical terrain contact used by both health and cosmetic contact scheduling.
// Weak ownership lets unused/replay worlds be collected without a global leak.
const terrainContacts=new WeakMap<R.World,Map<number,number>>();
export function registerTerrainContacts(world:R.World,colliders:readonly R.Collider[]){
 if(!colliders.length)return;
 let aliases=terrainContacts.get(world);if(!aliases){aliases=new Map();terrainContacts.set(world,aliases);}
 const representative=colliders[0].handle;
 for(const collider of colliders)aliases.set(collider.handle,representative);
}
export function terrainContactHandle(world:R.World,handle:number){return terrainContacts.get(world)?.get(handle)??handle;}
