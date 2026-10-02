import * as T from 'three';

/** A closed pressing with a continuous outer skin, inner skin and edge return.
 * The same samples define both sides; none of the body panels are flat boxes. */
export function closedVehiclePressing(nx:number,ny:number,map:(u:number,t:number)=>T.Vector3,normal:T.Vector3,thickness=.018){
 nx=Math.max(4,Math.round(nx*.50));ny=Math.max(2,Math.round(ny*.50));
 const points:number[]=[],uv:number[]=[],indices:number[]=[],row=nx+1,count=row*(ny+1);
 for(let layer=0;layer<2;layer++)for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
  points.push(...map(i/nx,j/ny).addScaledVector(normal,-layer*thickness).toArray());uv.push(i/nx,j/ny);
 }
 const orientation=map(.51,.5).sub(map(.5,.5)).cross(map(.5,.51).sub(map(.5,.5))).dot(normal)>0;
 const quad=(a:number,b:number,c:number,d:number,reverse=false)=>indices.push(...(reverse?[a,c,b,a,d,c]:[a,b,c,a,c,d]));
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=j*row+i;quad(a,a+1,a+row+1,a+row,!orientation);quad(a+count,a+count+1,a+count+row+1,a+count+row,orientation);}
 for(let i=0;i<nx;i++){quad(i,i+count,i+count+1,i+1,!orientation);const a=ny*row+i;quad(a,a+1,a+count+1,a+count,!orientation);}
 for(let j=0;j<ny;j++){const a=j*row,b=a+nx;quad(a,a+row,a+row+count,a+count,!orientation);quad(b,b+count,b+row+count,b+row,!orientation);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g.toNonIndexed();
}
