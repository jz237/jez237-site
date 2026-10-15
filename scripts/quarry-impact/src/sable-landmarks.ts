import * as T from 'three';
import {SABLE} from './sable-course';
/** Original disused quarry plant: a different silhouette on each half of the lap. */
export function createSableLandmarks(){
 const root=new T.Group();root.name='sable-quarry-landmarks';
 const geometries={box:new T.BoxGeometry(1,1,1),cylinder:new T.CylinderGeometry(.5,.5,1,12)};
 const materials=[0x5b493b,0x8b4930,0x424d50,0xb59a64,0x31332f].map(color=>new T.MeshStandardMaterial({color,roughness:.92}));
 // World-space weathering avoids stretching a tiny texture over the large plant.
 for(const material of materials){material.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 plantPosition;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
vec4 plantPoint=vec4(transformed,1.0);
#ifdef USE_INSTANCING
plantPoint=instanceMatrix*plantPoint;
#endif
plantPosition=(modelMatrix*plantPoint).xyz;`);
  shader.fragmentShader='varying vec3 plantPosition;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float streak=sin(plantPosition.x*17.3+sin(plantPosition.z*13.7)*3.0);
float wear=sin(plantPosition.y*.55+sin(plantPosition.x*.7)+sin(plantPosition.z*.8));
float seam=pow(abs(sin(plantPosition.y*3.14159/2.8)),30.0);
diffuseColor.rgb*=.86+.08*streak+.08*wear-.12*seam;`);
 };material.customProgramCacheKey=()=> 'sable-plant-weathering-1';}
 const batches=new Map<string,{shape:keyof typeof geometries;finish:number;matrices:T.Matrix4[]}>();const dummy=new T.Object3D();
 function part(shape:keyof typeof geometries,finish:number,x:number,y:number,z:number,w:number,h:number,d:number,rz=0){const key=shape+finish,b=batches.get(key)??{shape,finish,matrices:[]};dummy.position.set(x,y,z);dummy.rotation.set(0,0,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();b.matrices.push(dummy.matrix.clone());batches.set(key,b);}
 const box=(f:number,x:number,y:number,z:number,w:number,h:number,d:number,rz=0)=>part('box',f,x,y,z,w,h,d,rz);
 function beam(f:number,a:T.Vector3,b:T.Vector3,width=.25){const delta=b.clone().sub(a),key='box'+f,batch=batches.get(key)??{shape:'box' as const,finish:f,matrices:[]};const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize());batch.matrices.push(new T.Matrix4().compose(a.clone().add(b).multiplyScalar(.5),q,new T.Vector3(width,delta.length(),width)));batches.set(key,batch);}
 // Eastern elevated belt: rollers, trestles, diagonal bracing, side rails and loading hopper.
 const floor=SABLE.height(223,0);
 for(let i=0;i<10;i++){
  const z=-35+i*9,y=floor+7+i*.65;
  box(4,231,y,z,7,.3,9.2);for(const x of [227.2,234.8]){
   box(1,x,(floor+y)/2,z,.45,y-floor,.45);box(3,x,y+1,z,.15,.15,9.2);
   beam(2,new T.Vector3(x,floor,z-4),new T.Vector3(x,y,z+4),.2);
  }
  for(let j=-3;j<=3;j+=2)part('cylinder',2,231,y+.25,z+j,.4,7,.4,Math.PI/2);
 }
 box(1,231,floor+15,58,12,5,12);box(2,231,floor+18,58,14,.4,14);
 for(const x of [226,236])for(const z of [53,63])box(2,x,floor+6,z,.5,12,.5);
 // Northern processing works: silo group, catwalks, ladders and pipe elbows.
 const north=SABLE.height(145,171);
 for(let i=0;i<3;i++){
  const x=130+i*15;part('cylinder',3,x,north+11,184,10,22,10);
  for(const y of [4,11,19])part('cylinder',1,x,north+y,184,10.3,.18,10.3);
  box(2,x,north+22.3,184,11,.3,11);
  for(const dx of [-.65,.65])box(2,x+dx,north+11,178.8,.1,22,.1);
  for(let y=1;y<22;y+=.65)box(2,x,north+y,178.65,1.4,.09,.09);
 }
 box(2,145,north+23,177,45,.3,2);for(let x=123;x<=167;x+=3){box(1,x,north+23.7,176,.1,1.4,.1);}box(1,145,north+24.4,176,45,.1,.1);
 // Western abandoned extraction crane with braced boom, cable and hanging bucket.
 const west=SABLE.height(-223,25);box(2,-236,west+.6,25,15,1.2,13);box(1,-236,west+4,25,8,6,7);
 for(const z of [22,28]){beam(3,new T.Vector3(-236,west+4,z),new T.Vector3(-215,west+30,z),.55);beam(3,new T.Vector3(-239,west+7,z),new T.Vector3(-218,west+32,z),.55);
  for(let i=0;i<7;i++){const t=i/7,u=(i+1)/7;beam(2,new T.Vector3(-236+21*t,west+4+26*t,z),new T.Vector3(-239+21*u,west+7+25*u,z),.22);beam(2,new T.Vector3(-236+21*t,west+4+26*t,z),new T.Vector3(-239+21*t,west+7+25*t,z),.22);}}
 for(let i=0;i<=7;i++){const t=i/7;beam(2,new T.Vector3(-236+21*t,west+4+26*t,22),new T.Vector3(-236+21*t,west+4+26*t,28),.25);}
 box(4,-231.95,west+4.8,25,.12,2.4,4.8);box(3,-231.8,west+3.5,25,.2,.12,5.2);
 for(const z of [19.8,30.2]){box(4,-236,west+.65,z,15,1.3,2);for(let x=-242;x<=-230;x+=1)box(2,x,west+1.34,z,.25,.12,2.1);}

 beam(4,new T.Vector3(-216,west+30,25),new T.Vector3(-216,west+8,25),.09);box(1,-216,west+6.5,25,5,3,4);
 for(const [key,b] of batches){const mesh=new T.InstancedMesh(geometries[b.shape],materials[b.finish],b.matrices.length);b.matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='quarry-plant-'+key;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());materials.forEach(m=>m.dispose());root.clear();}};
}
