import * as T from 'three';

/** Close a regular terrain grid with walls that share its exact boundary vertices.
 * UVs use the same world scale as the top, rather than stretching one square map
 * over the entire long, shallow front face.
 */
export function substrateVolume(top:T.BufferGeometry,columns:number,rows:number,base=.02){
 const source=top.getAttribute('position');
 if(source.count!==(columns+1)*(rows+1))throw Error('Substrate grid dimensions do not match');
 const perimeter:number[]=[],stride=columns+1;
 for(let x=0;x<=columns;x++)perimeter.push(x);
 for(let z=1;z<=rows;z++)perimeter.push(z*stride+columns);
 for(let x=columns-1;x>=0;x--)perimeter.push(rows*stride+x);
 for(let z=rows-1;z>0;z--)perimeter.push(z*stride);
 const positions:number[]=[],uv:number[]=[],a=new T.Vector3(),b=new T.Vector3();
 const vertex=(p:T.Vector3,u:number,v:number)=>{positions.push(p.x,p.y,p.z);uv.push(u/2.2,v/2.2);};
 for(let i=0;i<perimeter.length;i++){
  a.fromBufferAttribute(source,perimeter[i]);b.fromBufferAttribute(source,perimeter[(i+1)%perimeter.length]);
  if(Math.min(a.y,b.y)<=base)throw Error('Substrate base must lie below the terrain');
  const lowA=new T.Vector3(a.x,base,a.z),lowB=new T.Vector3(b.x,base,b.z);
  const side=Math.abs(b.z-a.z)>Math.abs(b.x-a.x);
  for(const point of [a,b,lowA,b,lowB,lowA])vertex(point,side?point.z:point.x,point.y);
  // A segmented bottom fan avoids T-junctions along the wall's lower boundary.
  for(const point of [lowA,lowB,new T.Vector3(0,base,0)])vertex(point,point.x,point.z);
 }
 const shell=new T.BufferGeometry();shell.setAttribute('position',new T.Float32BufferAttribute(positions,3));shell.setAttribute('uv',new T.Float32BufferAttribute(uv,2));shell.computeVertexNormals();shell.computeBoundingBox();shell.computeBoundingSphere();return shell;
}
