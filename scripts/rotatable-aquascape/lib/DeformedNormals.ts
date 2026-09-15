import {BufferAttribute,type BufferGeometry} from 'three';

/** Same area-weighted normals as computeVertexNormals, specialized for the
 * fixed Float32 fish meshes. Preserve every face, accumulation order and the
 * Float32 rounding before normalization; avoid temporary vectors and repeated
 * attribute access for thousands of vertices on every animal on every frame. */
export function createNormalUpdater(geometry:BufferGeometry){
 const positions=geometry.getAttribute('position');
 let normals=geometry.getAttribute('normal');
 if(!normals){normals=new BufferAttribute(new Float32Array(positions.count*3),3);geometry.setAttribute('normal',normals);}
 const p=positions.array as Float32Array,n=normals.array as Float32Array,index=geometry.index?.array;
 if(!(positions instanceof BufferAttribute)||!(normals instanceof BufferAttribute)||!(p instanceof Float32Array)||!(n instanceof Float32Array)||positions.itemSize!==3||normals.itemSize!==3)throw Error('Fish normal updater requires fixed Float32 XYZ attributes');
 return ()=>{
  if(index){
   n.fill(0);
   for(let i=0;i<index.length;i+=3){
    const a=index[i]*3,b=index[i+1]*3,c=index[i+2]*3;
    const cx=p[c]-p[b],cy=p[c+1]-p[b+1],cz=p[c+2]-p[b+2],ax=p[a]-p[b],ay=p[a+1]-p[b+1],az=p[a+2]-p[b+2];
    const x=cy*az-cz*ay,y=cz*ax-cx*az,z=cx*ay-cy*ax;
    n[a]+=x;n[a+1]+=y;n[a+2]+=z;n[b]+=x;n[b+1]+=y;n[b+2]+=z;n[c]+=x;n[c+1]+=y;n[c+2]+=z;
   }
   for(let i=0;i<n.length;i+=3){const x=n[i],y=n[i+1],z=n[i+2],inv=1/(Math.sqrt(x*x+y*y+z*z)||1);n[i]=x*inv;n[i+1]=y*inv;n[i+2]=z*inv;}
  }else{
   // All three membrane vertices share one face normal. Normalize once, with
   // the same intermediate float rounding as Three's general implementation.
   for(let a=0;a<p.length;a+=9){
    const b=a+3,c=a+6,cx=p[c]-p[b],cy=p[c+1]-p[b+1],cz=p[c+2]-p[b+2],ax=p[a]-p[b],ay=p[a+1]-p[b+1],az=p[a+2]-p[b+2];
    const x=Math.fround(cy*az-cz*ay),y=Math.fround(cz*ax-cx*az),z=Math.fround(cx*ay-cy*ax),inv=1/(Math.sqrt(x*x+y*y+z*z)||1);
    n[a]=n[b]=n[c]=x*inv;n[a+1]=n[b+1]=n[c+1]=y*inv;n[a+2]=n[b+2]=n[c+2]=z*inv;
   }
  }
  normals.needsUpdate=true;
 };
}
