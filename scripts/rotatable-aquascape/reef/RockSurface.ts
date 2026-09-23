import * as T from 'three';
/** A temporary X/Z triangle index for exact vertical attachment queries.
 * Built once and discarded after colony construction; no per-frame work. */
export function topSurfaceSampler(geometries:T.BufferGeometry[],cell=.14){
 const bins=new Map<string,number[]>(),triangles:number[][]=[];
 for(const geometry of geometries){const p=geometry.getAttribute('position'),index=geometry.index;
  for(let i=0;i<(index?.count??p.count);i+=3){const ids=[0,1,2].map(k=>index?index.getX(i+k):i+k),[a,b,c]=ids.map(k=>new T.Vector3().fromBufferAttribute(p,k)),normal=new T.Vector3().crossVectors(b.clone().sub(a),c.clone().sub(a)).normalize();if(normal.y<.00001)continue;
   const data=[a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z,normal.x,normal.y,normal.z],id=triangles.length;triangles.push(data);
   for(let x=Math.floor(Math.min(a.x,b.x,c.x)/cell);x<=Math.floor(Math.max(a.x,b.x,c.x)/cell);x++)for(let z=Math.floor(Math.min(a.z,b.z,c.z)/cell);z<=Math.floor(Math.max(a.z,b.z,c.z)/cell);z++){const key=x+','+z,list=bins.get(key);if(list)list.push(id);else bins.set(key,[id]);}
  }
 }
 return (x:number,top:number,z:number,depth=2.5)=>{
  let best=top-depth,normal:T.Vector3|null=null;
  for(const id of bins.get(Math.floor(x/cell)+','+Math.floor(z/cell))??[]){const [ax,ay,az,bx,by,bz,cx,cy,cz,nx,ny,nz]=triangles[id],den=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz),u=((bz-cz)*(x-cx)+(cx-bx)*(z-cz))/den,v=((cz-az)*(x-cx)+(ax-cx)*(z-cz))/den;if(u<0||v<0||u+v>1)continue;const y=u*ay+v*by+(1-u-v)*cy;if(y>top||y<best)continue;best=y;normal=new T.Vector3(nx,ny,nz);}
  return normal?{point:new T.Vector3(x,best,z),normal}:null;
 };
}
