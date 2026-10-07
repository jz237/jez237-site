import * as T from 'three';

/** The same area-weighted normals as BufferGeometry, using the packed float
 * arrays already owned by prepared bodywork. Keep each Float32 accumulation
 * and operation order so old damage/replay appearance is preserved. */
export function computeWreckNormals(g:T.BufferGeometry){
 const position=g.attributes.position,normal=g.attributes.normal,index=g.index;
 if(!(position instanceof T.BufferAttribute)||!(normal instanceof T.BufferAttribute)||
    !(position.array instanceof Float32Array)||!(normal.array instanceof Float32Array)||
    position.itemSize!==3||normal.itemSize!==3||position.normalized||normal.normalized||index?.normalized){
  g.computeVertexNormals();return;
 }
 const p=position.array,n=normal.array,indices=index?.array;n.fill(0);
 const count=index?index.count:position.count;
 for(let i=0;i<count;i+=3){
  const a=(indices?indices[i]:i)*3,b=(indices?indices[i+1]:i+1)*3,c=(indices?indices[i+2]:i+2)*3;
  const cx=p[c]-p[b],cy=p[c+1]-p[b+1],cz=p[c+2]-p[b+2];
  const ax=p[a]-p[b],ay=p[a+1]-p[b+1],az=p[a+2]-p[b+2];
  const x=cy*az-cz*ay,y=cz*ax-cx*az,z=cx*ay-cy*ax;
  if(indices){
   // Read all three before writing, including repeated indices in a face.
   const xa=n[a]+x,ya=n[a+1]+y,za=n[a+2]+z;
   const xb=n[b]+x,yb=n[b+1]+y,zb=n[b+2]+z;
   const xc=n[c]+x,yc=n[c+1]+y,zc=n[c+2]+z;
   n[a]=xa;n[a+1]=ya;n[a+2]=za;n[b]=xb;n[b+1]=yb;n[b+2]=zb;n[c]=xc;n[c+1]=yc;n[c+2]=zc;
  }else{n[a]=n[b]=n[c]=x;n[a+1]=n[b+1]=n[c+1]=y;n[a+2]=n[b+2]=n[c+2]=z;}
 }
 for(let i=0;i<n.length;i+=3){const x=n[i],y=n[i+1],z=n[i+2],inverse=1/(Math.sqrt(x*x+y*y+z*z)||1);n[i]=x*inverse;n[i+1]=y*inverse;n[i+2]=z*inverse;}
 normal.needsUpdate=true;
}

/** Bounds and sphere share their first pass instead of scanning the same
 * positions twice for the same center. Other attribute layouts retain Three's
 * general implementation. */
export function computeWreckBounds(g:T.BufferGeometry){
 const position=g.attributes.position;
 if(!(position instanceof T.BufferAttribute)||!(position.array instanceof Float32Array)||position.itemSize!==3||position.normalized||g.morphAttributes.position){
  g.computeBoundingBox();g.computeBoundingSphere();return;
 }
 const p=position.array,box=g.boundingBox??(g.boundingBox=new T.Box3()),sphere=g.boundingSphere??(g.boundingSphere=new T.Sphere());
 let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity;
 for(let i=0;i<p.length;i+=3){minX=Math.min(minX,p[i]);minY=Math.min(minY,p[i+1]);minZ=Math.min(minZ,p[i+2]);maxX=Math.max(maxX,p[i]);maxY=Math.max(maxY,p[i+1]);maxZ=Math.max(maxZ,p[i+2]);}
 box.min.set(minX,minY,minZ);box.max.set(maxX,maxY,maxZ);box.getCenter(sphere.center);
 const {x,y,z}=sphere.center;let radiusSquared=0;
 for(let i=0;i<p.length;i+=3){const dx=x-p[i],dy=y-p[i+1],dz=z-p[i+2];radiusSquared=Math.max(radiusSquared,dx*dx+dy*dy+dz*dz);}
 sphere.radius=Math.sqrt(radiusSquared);
}
