import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
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
 async build(scene:T.Scene,time:{value:number}){
  const [file,alpha]=await Promise.all([new GLTFLoader().loadAsync('./models/moss_01/moss_01_2k.gltf'),new T.TextureLoader().loadAsync('./models/moss_01/textures/moss_01_alpha_2k.png')]);
  alpha.flipY=false;alpha.anisotropy=8;
  const shoots=file.scene.children.filter(o=>o instanceof T.Mesh) as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>[];
  const material=shoots[0].material.clone();material.alphaMap=alpha;material.alphaTest=.32;material.alphaToCoverage=true;material.transparent=false;material.depthWrite=true;material.side=T.DoubleSide;material.color.set(0xe0e9cb);material.roughness=.88;material.normalScale.set(.65,.65);
  for(const map of [material.map,material.normalMap,material.roughnessMap])if(map)map.anisotropy=8;
  const current=(surface:T.Material)=>{
   surface.onBeforeCompile=shader=>{
    shader.uniforms.mossTime=time;
    shader.vertexShader=`uniform float mossTime;attribute float mossPhase;
vec3 mossBend(vec3 p){float h=max(0.,p.y);p.x+=sin(mossTime*.8+mossPhase+h*8.)*h*h*.35;p.z+=sin(mossTime*.65+mossPhase)*h*h*.2;return p;}
`+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed=mossBend(transformed);');
    shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
float h=max(0.,position.y),phase=mossTime*.8+mossPhase+h*8.;
objectNormal.y-=(2.*h*sin(phase)+h*h*8.*cos(phase))*.35*objectNormal.x+2.*h*sin(mossTime*.65+mossPhase)*.2*objectNormal.z;
`);
   };surface.customProgramCacheKey=()=>`scanned-moss-current-v1-${surface.type}`;
  };
  current(material);
  const batches=shoots.map(source=>({geometry:source.geometry.clone(),matrices:[] as T.Matrix4[],colors:[] as T.Color[],phases:[] as number[]}));
  const shootTransform=new T.Object3D();
  this.matrices.forEach((anchor,i)=>{
   for(let j=0;j<3;j++){
    const batch=batches[(i*7+j*3)%batches.length],angle=i*2.399+j*2.1;
    shootTransform.position.set(Math.cos(angle)*.009,0,Math.sin(angle)*.009);shootTransform.rotation.set(Math.sin(angle)*.16,angle,Math.cos(angle)*.16);shootTransform.scale.setScalar(.78+(Math.sin(i*1.3+j)*.5+.5)*.44);shootTransform.updateMatrix();
    batch.matrices.push(new T.Matrix4().multiplyMatrices(anchor,shootTransform.matrix));batch.colors.push(this.colors[i].clone().lerp(new T.Color(0xffffff),.9));batch.phases.push(i*.71+j*1.83);
   }
  });
  for(const batch of batches){
   const geometry=batch.geometry;geometry.computeBoundingBox();const bounds=geometry.boundingBox!,center=bounds.getCenter(new T.Vector3()),height=bounds.max.y-bounds.min.y;
   geometry.translate(-center.x,-bounds.min.y,-center.z);geometry.scale(.13/height,.13/height,.13/height);geometry.computeBoundingSphere();
   geometry.setAttribute('mossPhase',new T.InstancedBufferAttribute(new Float32Array(batch.phases),1));
   const moss=new T.InstancedMesh(geometry,material,batch.matrices.length);batch.matrices.forEach((matrix,i)=>{moss.setMatrixAt(i,matrix);moss.setColorAt(i,batch.colors[i]);});
   const depth=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,alphaMap:alpha,alphaTest:.32,side:T.DoubleSide});current(depth);moss.customDepthMaterial=depth;
   moss.castShadow=moss.receiveShadow=true;moss.computeBoundingSphere();moss.boundingSphere!.radius+=.03;scene.add(moss);
  }
 }
}
