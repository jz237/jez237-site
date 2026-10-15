import {url} from './assets';
import * as T from 'three';
import {WILLOWBANK as course} from './willowbank-course';
const hash=(n:number)=>{const x=Math.sin(n*127.1+37.7)*43758.5453;return x-Math.floor(x);};
export function createHeathVegetation(){
 const root=new T.Group();root.name='willowbank-heather-meadow';const geometries:T.BufferGeometry[]=[],materials:T.Material[]=[];
 const placements:{x:number;z:number;radius:number}[]=[];let total=0;
 for(const flowers of [false,true]){
  const vertices:number[]=[],colors:number[]=[];
  for(let blade=0;blade<18;blade++){
   const a=blade*2.39996,r=.48*Math.sqrt(hash(blade+7)),x=Math.cos(a)*r,z=Math.sin(a)*r,h=.32+hash(blade+31)*.62,w=flowers?.035:.022,dx=Math.cos(a),dz=Math.sin(a),sx=-dz*w,sz=dx*w;
   const tip=[x+dx*.23,h,z+dz*.23],points=[[x-sx,0,z-sz],[x+sx,0,z+sz],tip];
   for(const p of points){vertices.push(...p);colors.push(.16,.23,.09);}
   if(flowers)for(const turn of [0,Math.PI/2]){const ca=Math.cos(a+turn)*.055,sa=Math.sin(a+turn)*.055;for(const p of [[tip[0]-ca,h*.7,tip[2]-sa],[tip[0]+ca,h*.7,tip[2]+sa],[tip[0],h+.12,tip[2]]]){vertices.push(...p);colors.push(.36+hash(blade+5)*.1,.14+hash(blade+2)*.07,.29+hash(blade+3)*.08);}}
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();geometries.push(geometry);
  const material=new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:1});materials.push(material);
  const transforms:T.Matrix4[]=[],dummy=new T.Object3D();
  for(let cluster=0;cluster<170;cluster++){
   const x=-207+hash(cluster*7+101)*414,z=-86+hash(cluster*7+102)*250,radius=3+hash(cluster*7+103)*10;
   if(course.distance(x,z)<24+radius)continue;
   if([[-45,-10,25,20],[65,20,18,17],[65,-160,27,15]].some(([cx,cz,w,d])=>Math.abs(x-cx)<w+radius&&Math.abs(z-cz)<d+radius))continue;
   for(let i=0;i<(flowers?19:42);i++){
    const n=cluster*101+i+Number(flowers)*181,a=hash(n+23)*Math.PI*2,r=Math.sqrt(hash(n+71))*radius,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r,size=.5+hash(n+13)*(flowers?.9:1.3);
    if(course.distance(px,pz)<24+size)continue;
    dummy.position.set(px,course.height(px,pz),pz);dummy.rotation.set(0,hash(n+17)*Math.PI*2,0);dummy.scale.set(size,size*(flowers?1:.75),size);dummy.updateMatrix();transforms.push(dummy.matrix.clone());placements.push({x:px,z:pz,radius:size});
   }
  }
  const mesh=new T.InstancedMesh(geometry,material,transforms.length);transforms.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name=flowers?'heather-flowering-clumps':'heath-grass-tussocks';mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);total+=transforms.length;
 }
 root.userData.placements=placements;root.userData.instances=total;
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());root.clear();}};
}
/** Off-road tint applied after the existing road/material mask; road pixels remain unchanged. */
export function improveHeathGround(root:T.Group){
 const ground=root.getObjectByName('willowbank-heath-v1_ground') as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>,material=ground.material,compile=material.onBeforeCompile,key=material.customProgramCacheKey;
 material.onBeforeCompile=(shader,renderer)=>{compile.call(material,shader,renderer);shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`float heathPatch=.5+.5*sin(vCourseWorld.x*.043+sin(vCourseWorld.z*.029)*2.0)*sin(vCourseWorld.z*.052+sin(vCourseWorld.x*.023));
vec3 heathTint=mix(vec3(.50,.75,.29),vec3(.85,.78,.48),smoothstep(.30,.8,heathPatch));
diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*heathTint,1.0-courseWeights.g);
#include <roughnessmap_fragment>`);};material.customProgramCacheKey=()=>key.call(material)+'-heath-preview-1';material.needsUpdate=true;
 return()=>{material.onBeforeCompile=compile;material.customProgramCacheKey=key;material.needsUpdate=true;};
}

/** Replace the regular ring silhouette with broad, asymmetric heathland ridges. */
export function improveHeathHorizon(root:T.Group){
 const hills=root.getObjectByName('willowbank-heath-v1_surrounding_landscape') as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>;
 const previousGeometry=hills.geometry,previousMaterial=hills.material,geometry=previousGeometry.clone();
 const position=geometry.getAttribute('position'),color=geometry.getAttribute('color');
 for(let i=0;i<position.count;i++){
  const x=position.getX(i),z=position.getZ(i),a=Math.atan2(z,x),edge=1/Math.max(Math.abs(Math.cos(a))/220,Math.abs(Math.sin(a))/180),distance=Math.hypot(x,z)-edge;
  const blend=Math.min(1,distance/110),base=course.height(Math.cos(a)*edge,Math.sin(a)*edge);
  const ridge=18+29*Math.exp(-((x+260)**2+(z-300)**2)/105000)+37*Math.exp(-((x-340)**2+(z-360)**2)/125000);
  const folds=Math.sin(x*.019+Math.sin(z*.011)*1.4)*5+Math.cos(z*.027+x*.009)*3;
  position.setY(i,distance<1?base-.12:base+blend*(ridge+folds));
  const patches=.5+.5*Math.sin(x*.023+Math.sin(z*.017))*Math.cos(z*.018);
  const c=new T.Color().setRGB(.16+patches*.10,.22+patches*.08,.075+patches*.065);color.setXYZ(i,c.r,c.g,c.b);
 }
 geometry.computeVertexNormals();geometry.computeBoundingSphere();
 const uv=new Float32Array(position.count*2);for(let i=0;i<position.count;i++){uv[i*2]=position.getX(i)/18;uv[i*2+1]=position.getZ(i)/18;}geometry.setAttribute('uv',new T.BufferAttribute(uv,2));
 const texture=typeof document==='undefined'?null:new T.TextureLoader().load(url('assets/forrest_ground_01_diff.jpg'));
 if(texture){texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;}
 const material=new T.MeshStandardMaterial({map:texture,vertexColors:true,roughness:1,side:T.DoubleSide});
 hills.geometry=geometry;hills.material=material;
 hills.updateMatrixWorld(true);
 const ray=new T.Raycaster(),matrix=new T.Matrix4(),treeStates:{mesh:T.InstancedMesh;matrices:T.Matrix4[]}[]=[];
 root.traverse(o=>{if(!(o instanceof T.InstancedMesh)||!o.name.includes('_forest_'))return;
  const matrices:T.Matrix4[]=[];
  for(let i=0;i<o.count;i++){
   o.getMatrixAt(i,matrix);matrices.push(matrix.clone());const x=matrix.elements[12],z=matrix.elements[14];
   if(Math.abs(x)<=220&&Math.abs(z)<=180)continue;
   ray.set(new T.Vector3(x,300,z),new T.Vector3(0,-1,0));const hit=ray.intersectObject(hills,false)[0];
   if(hit){matrix.elements[13]=hit.point.y;o.setMatrixAt(i,matrix);}
  }
  o.instanceMatrix.needsUpdate=true;o.computeBoundingSphere();treeStates.push({mesh:o,matrices});
 });
 return()=>{for(const {mesh,matrices}of treeStates){matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}hills.geometry=previousGeometry;hills.material=previousMaterial;geometry.dispose();material.dispose();texture?.dispose();};
}
