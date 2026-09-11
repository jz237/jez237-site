import * as T from 'three';

/** Closed glass shell with two open bores: end faces are annuli, never disks. */
export function hollowTube(curve:T.Curve<T.Vector3>,radius:(t:number)=>number,wall=.011,segments=96,sides=32){
 const points=curve.getSpacedPoints(segments),frames=curve.computeFrenetFrames(segments,false);
 const p:number[]=[],uv:number[]=[],indices:number[]=[],stride=sides+1,offset=(segments+1)*stride;
 for(let shell=0;shell<2;shell++)for(let i=0;i<=segments;i++){
  const r=radius(i/segments)-shell*wall;
  if(!Number.isFinite(r)||r<=0)throw Error('Tube wall must leave an open bore');
  for(let j=0;j<=sides;j++){
   const angle=j/sides*Math.PI*2;
   const point=points[i].clone().addScaledVector(frames.normals[i],Math.cos(angle)*r).addScaledVector(frames.binormals[i],Math.sin(angle)*r);
   p.push(point.x,point.y,point.z);uv.push(j/sides,i/segments);
   if(i<segments&&j<sides){const a=shell*offset+i*stride+j,b=a+1,c=a+stride,d=c+1;
    indices.push(...(shell?[a,c,b,b,c,d]:[a,b,c,b,d,c]));
   }
  }
 }
 for(let j=0;j<sides;j++){
  const a=j,b=j+1,c=offset+j,d=c+1;
  indices.push(a,c,b,b,c,d);
  const e=segments*stride+j,f=e+1,g=offset+e,h=g+1;
  indices.push(e,f,g,f,h,g);
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(p,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
 // UV seams share a position and must also share their shading normal.
 const n=geometry.getAttribute('normal') as T.BufferAttribute;
 for(let shell=0;shell<2;shell++)for(let i=0;i<=segments;i++){
  const a=shell*offset+i*stride,b=a+sides;
  const normal=new T.Vector3().fromBufferAttribute(n,a).add(new T.Vector3().fromBufferAttribute(n,b)).normalize();
  n.setXYZ(a,normal.x,normal.y,normal.z);n.setXYZ(b,normal.x,normal.y,normal.z);
 }
 geometry.computeBoundingSphere();return geometry;
}
