import * as T from 'three';
const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);

/** Sample the scanned surfaces themselves so moss grows out of bark and rock crevices. */
export class EpiphyteMoss{
 private matrices:T.Matrix4[]=[];
 private colors:T.Color[]=[];
 private seed=74519;
 private random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 sample(mesh:T.Mesh,density:number,shootScale=1){
  mesh.updateMatrixWorld();
  const positions=mesh.geometry.getAttribute('position'),index=mesh.geometry.index;
  const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3(),normal=new T.Vector3(),ab=new T.Vector3(),ac=new T.Vector3(),dummy=new T.Object3D();
  const triangles=(index?index.count:positions.count)/3;
  for(let i=0;i<triangles&&this.matrices.length<2800;i++){
   a.fromBufferAttribute(positions,index?index.getX(i*3):i*3).applyMatrix4(mesh.matrixWorld);
   b.fromBufferAttribute(positions,index?index.getX(i*3+1):i*3+1).applyMatrix4(mesh.matrixWorld);
   c.fromBufferAttribute(positions,index?index.getX(i*3+2):i*3+2).applyMatrix4(mesh.matrixWorld);
   normal.crossVectors(ab.copy(b).sub(a),ac.copy(c).sub(a));const area=normal.length()*.5;normal.normalize();
   if(normal.y<.12||a.y<.45||a.y>3.3)continue;
   // Connected patches alternate with exposed bark rather than coating everything evenly.
   const patch=Math.sin(a.x*3.2+a.z*1.7)+Math.sin(a.y*5.3-a.z*4.1)*.65;
   if(patch<-.30||this.random()>Math.min(.8,area*density))continue;
   const u=Math.sqrt(this.random()),v=this.random();
   dummy.position.copy(a).multiplyScalar(1-u).addScaledVector(b,u*(1-v)).addScaledVector(c,u*v).addScaledVector(normal,-.006);
   const direction=normal.clone().multiplyScalar(.42).add(V(0,.58,0)).normalize();dummy.quaternion.setFromUnitVectors(V(0,1,0),direction);dummy.rotateY(this.random()*Math.PI*2);
   dummy.scale.setScalar((.65+this.random()*.80)*shootScale);dummy.updateMatrix();this.matrices.push(dummy.matrix.clone());
   this.colors.push(new T.Color().setHSL(.205+this.random()*.04,.55+this.random()*.12,.20+this.random()*.105).convertSRGBToLinear());
  }
 }
 build(scene:T.Scene){
  const positions:number[]=[],indices:number[]=[];
  const triangle=(a:T.Vector3,b:T.Vector3,c:T.Vector3)=>{const n=positions.length/3;positions.push(...a.toArray(),...b.toArray(),...c.toArray());indices.push(n,n+1,n+2);};
  // Three feathery shoots, each with paired pointed leaflets at staggered nodes.
  for(let shoot=0;shoot<3;shoot++){
   const angle=shoot*2.399,side=V(Math.cos(angle),0,Math.sin(angle)),front=V(-Math.sin(angle),0,Math.cos(angle));
   const at=(t:number)=>V(0,t*(.092+shoot*.011),0).addScaledVector(front,t*t*.048);
   for(let j=0;j<5;j++){
    const t=.12+j*.17,p=at(t),tip=at(t+.19),width=.003;
    triangle(p.clone().addScaledVector(side,-width),p.clone().addScaledVector(side,width),tip);
    for(const sign of [-1,1]){
     const end=p.clone().addScaledVector(side,sign*(.032-t*.015)).addScaledVector(front,.013).add(V(0,.013,0));
     const mid=p.clone().lerp(end,.45).addScaledVector(front,.008);
     triangle(p,mid,end);triangle(p,end,mid.clone().addScaledVector(front,-.012));
    }
   }
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  const material=new T.MeshStandardMaterial({roughness:.88,side:T.DoubleSide});
  const moss=new T.InstancedMesh(geometry,material,this.matrices.length);
  this.matrices.forEach((m,i)=>{moss.setMatrixAt(i,m);moss.setColorAt(i,this.colors[i]);});
  moss.receiveShadow=true;moss.castShadow=true;moss.computeBoundingSphere();scene.add(moss);
 }
}
