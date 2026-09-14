// The forage as one instanced mesh: a small tapered body per fish, silver with an olive back,
// rolled by its swim phase so the school flashes the way a school of shiners does.
import * as T from './vendor/three.module.js';
export function makeForageMesh(forage){
 const total=forage.schools.reduce((n,s)=>n+s.fish.length,0);
 const geo=new T.SphereGeometry(1,7,5);geo.scale(.011,.014,.052);
 const pos=geo.attributes.position;const col=new Float32Array(pos.count*3);
 for(let i=0;i<pos.count;i++){const y=pos.getY(i)/.011;const back=y>.2?1:0;col[i*3]=back?.36:.86;col[i*3+1]=back?.42:.9;col[i*3+2]=back?.3:.92;}
 geo.setAttribute('color',new T.BufferAttribute(col,3));
 const mat=new T.MeshStandardMaterial({vertexColors:true,metalness:.55,roughness:.35});
 const mesh=new T.InstancedMesh(geo,mat,total);mesh.frustumCulled=false;mesh.castShadow=false;mesh.receiveShadow=false;
 const m=new T.Matrix4(),q=new T.Quaternion(),e=new T.Euler(),v=new T.Vector3(),sc=new T.Vector3(1,1,1);
 function update(){let i=0;for(const s of forage.schools)for(const f of s.fish){const yaw=Math.atan2(f.vx,f.vz),pitch=-Math.atan2(f.vy,Math.hypot(f.vx,f.vz)+.05);
   e.set(pitch,yaw,Math.sin(f.phase)*.55,'YXZ');q.setFromEuler(e);v.set(f.x,f.y,f.z);m.compose(v,q,sc);mesh.setMatrixAt(i++,m);}
  mesh.instanceMatrix.needsUpdate=true;}
 update();
 return {mesh,update};
}
