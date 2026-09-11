import * as T from 'three';

/** Draw the same oriented triangles in small neighboring tiles for vertex reuse. */
export function tiledLeafIndices(rows:number,columns:number,tile:number){
 const indices:number[]=[];
 for(let y0=0;y0<rows;y0+=tile)for(let x0=0;x0<columns;x0+=tile)
  for(let y=y0;y<Math.min(rows,y0+tile);y++)for(let x=x0;x<Math.min(columns,x0+tile);x++){
   const n=y*(columns+1)+x;indices.push(n,n+1,n+columns+1,n+1,n+columns+2,n+columns+1);
  }
 return indices;
}
export function optimizeLeafIndexOrder(scene:T.Scene){
 scene.traverse(object=>{
  if(!(object instanceof T.InstancedMesh))return;
  const species=object.userData.plantSpecies;
  const grid=species==='sword'?[40,16,4]:species==='stem'||species==='rotala'?[20,8,3]:null;
  if(!grid)return;
  const [rows,columns,tile]=grid,geometry=object.geometry;
  if(geometry.getAttribute('position').count!==(rows+1)*(columns+1)||geometry.index?.count!==rows*columns*6)throw Error('Leaf grid changed; update its index-order recipe.');
  geometry.setIndex(tiledLeafIndices(rows,columns,tile));
 });
}
