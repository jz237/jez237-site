import * as T from 'three';
import {reefPickingBlocks} from './ReefPicking.ts';

export type SurfaceKind='rock'|'coral'|'other';
/** Short ray queries against the real reef meshes for the fish: the distance to
 * the first surface along a ray, and what that surface is. Uses the picking
 * blocks' bounds with a coarse cell grid, and tests triangles directly on the
 * typed arrays (both faces), returning no face, UV or intersection objects. */
export function reefSurfaceProbe(sources:{mesh:T.Mesh;kind:SurfaceKind}[]){
 const cell=.4;
 const parts=sources.flatMap(({mesh,kind})=>{
  const blocks=reefPickingBlocks.get(mesh),index=mesh.geometry.index,position=mesh.geometry.getAttribute('position');
  if(!blocks||!index||!(position instanceof T.BufferAttribute)||position.itemSize!==3||position.normalized)return [];
  const {bounds,blockSize,count}=blocks,box=new T.Box3();
  for(let b=0;b<count;b++){box.expandByPoint(new T.Vector3(bounds[b*6],bounds[b*6+1],bounds[b*6+2]));box.expandByPoint(new T.Vector3(bounds[b*6+3],bounds[b*6+4],bounds[b*6+5]));}
  const origin=box.min,size=box.getSize(new T.Vector3());
  const nx=Math.max(1,Math.ceil(size.x/cell)),ny=Math.max(1,Math.ceil(size.y/cell)),nz=Math.max(1,Math.ceil(size.z/cell));
  const at=(v:number,o:number,n:number)=>Math.min(n-1,Math.max(0,Math.floor((v-o)/cell)));
  const range=(b:number)=>[at(bounds[b*6],origin.x,nx),at(bounds[b*6+3],origin.x,nx),at(bounds[b*6+1],origin.y,ny),at(bounds[b*6+4],origin.y,ny),at(bounds[b*6+2],origin.z,nz),at(bounds[b*6+5],origin.z,nz)];
  const starts=new Uint32Array(nx*ny*nz+1);
  for(let b=0;b<count;b++){const [x0,x1,y0,y1,z0,z1]=range(b);for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)starts[(x*ny+y)*nz+z+1]++;}
  for(let c=0;c<nx*ny*nz;c++)starts[c+1]+=starts[c];
  const members=new Uint32Array(starts[nx*ny*nz]),fill=starts.slice(0,nx*ny*nz);
  for(let b=0;b<count;b++){const [x0,x1,y0,y1,z0,z1]=range(b);for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)members[fill[(x*ny+y)*nz+z]++]=b;}
  mesh.updateWorldMatrix(true,false);
  return [{kind,bounds,blockSize,indices:index.array,count:index.count,positions:position.array as ArrayLike<number>,origin,nx,ny,nz,starts,members,stamp:new Uint32Array(count),world:mesh.matrixWorld.clone(),inverse:mesh.matrixWorld.clone().invert()}];
 });
 let query=0;const o=new T.Vector3(),e=new T.Vector3(),d=new T.Vector3();
 /** First surface hit within far along a unit direction, or null. */
 return (from:T.Vector3,direction:T.Vector3,far:number)=>{
  let best=far,kind:SurfaceKind|null=null;
  for(const p of parts){
   o.copy(from).applyMatrix4(p.inverse);e.copy(from).addScaledVector(direction,far).applyMatrix4(p.inverse);d.copy(e).sub(o);
   const length=d.length();if(length<1e-9)continue;d.multiplyScalar(1/length);const scale=length/far;
   const minX=Math.min(o.x,e.x),maxX=Math.max(o.x,e.x),minY=Math.min(o.y,e.y),maxY=Math.max(o.y,e.y),minZ=Math.min(o.z,e.z),maxZ=Math.max(o.z,e.z);
   const cx=(v:number,a:number,n:number)=>Math.min(n-1,Math.max(0,Math.floor((v-a)/cell)));
   if(maxX<p.origin.x||maxY<p.origin.y||maxZ<p.origin.z||minX>p.origin.x+p.nx*cell||minY>p.origin.y+p.ny*cell||minZ>p.origin.z+p.nz*cell)continue;
   query=query+1>>>0||1;
   const limit=best*scale,B=p.bounds,I=p.indices,P=p.positions;let localBest=limit;
   for(let x=cx(minX,p.origin.x,p.nx);x<=cx(maxX,p.origin.x,p.nx);x++)for(let y=cx(minY,p.origin.y,p.ny);y<=cx(maxY,p.origin.y,p.ny);y++)for(let z=cx(minZ,p.origin.z,p.nz);z<=cx(maxZ,p.origin.z,p.nz);z++){
    const c=(x*p.ny+y)*p.nz+z;
    for(let m=p.starts[c];m<p.starts[c+1];m++){
     const b=p.members[m];if(p.stamp[b]===query)continue;p.stamp[b]=query;
     const k=b*6;if(B[k]>maxX||B[k+3]<minX||B[k+1]>maxY||B[k+4]<minY||B[k+2]>maxZ||B[k+5]<minZ)continue;
     for(let i=b*p.blockSize,end=Math.min(p.count,i+p.blockSize);i<end;i+=3){
      // Moller-Trumbore, both faces.
      const a=I[i]*3,b1=I[i+1]*3,c2=I[i+2]*3;
      const ax=P[a],ay=P[a+1],az=P[a+2],e1x=P[b1]-ax,e1y=P[b1+1]-ay,e1z=P[b1+2]-az,e2x=P[c2]-ax,e2y=P[c2+1]-ay,e2z=P[c2+2]-az;
      const px=d.y*e2z-d.z*e2y,py=d.z*e2x-d.x*e2z,pz=d.x*e2y-d.y*e2x,det=e1x*px+e1y*py+e1z*pz;
      if(det>-1e-12&&det<1e-12)continue;
      const inv=1/det,tx=o.x-ax,ty=o.y-ay,tz=o.z-az,u=(tx*px+ty*py+tz*pz)*inv;if(u<0||u>1)continue;
      const qx=ty*e1z-tz*e1y,qy=tz*e1x-tx*e1z,qz=tx*e1y-ty*e1x,w=(d.x*qx+d.y*qy+d.z*qz)*inv;if(w<0||u+w>1)continue;
      const t=(e2x*qx+e2y*qy+e2z*qz)*inv;if(t>=0&&t<localBest){localBest=t;}
     }
    }
   }
   if(localBest<limit){best=localBest/scale;kind=p.kind;}
  }
  return kind?{distance:best,kind}:null;
 };
}
