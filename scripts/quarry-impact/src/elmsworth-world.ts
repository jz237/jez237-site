import {addCourseGroundDetail} from './course-materials';
import * as T from 'three';
import {ELMSWORTH} from './elmsworth-course';
import {freezeSceneryTransforms} from './render-work';
export function createElmsworthWorld(){
 const id='elmsworth-speedway-v1',course=ELMSWORTH,root=new T.Group();root.name=id;
 const materials={concrete:new T.MeshStandardMaterial({color:0xc9c3ac,roughness:.95}),stripe:new T.MeshStandardMaterial({color:0xd99033,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x344553,roughness:.7,metalness:.4}),grass:new T.MeshStandardMaterial({color:0x687858,roughness:1}),seat:new T.MeshStandardMaterial({color:0xc7c0a4,roughness:.8}),blue:new T.MeshStandardMaterial({color:0x3e6c81,roughness:.85}),red:new T.MeshStandardMaterial({color:0x9f4b3e,roughness:.9})};
 const floorMaterial=new T.MeshStandardMaterial({color:0x75855e,roughness:.98}),groundGeometry=new T.BufferGeometry(),boxGeometry=new T.BoxGeometry(1,1,1),textures:T.Texture[]=[];
 const {spanX,spanZ}=course.terrain;
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1676;const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.fillStyle='#75855e';ctx.fillRect(0,0,canvas.width,canvas.height);let seed=438;
   for(let i=0;i<32000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%canvas.width;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#829467':'#687a52';ctx.fillRect(x,seed%canvas.height,3,3);}
   const scale=canvas.width/spanX,x=(v:number)=>(v+spanX/2)*scale,z=(v:number)=>(spanZ/2-v)*canvas.height/spanZ;
   const route=()=>{ctx.beginPath();course.samples.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));ctx.closePath();};
   ctx.lineJoin='round';route();ctx.strokeStyle='#90918c';ctx.lineWidth=31*scale;ctx.stroke();
   route();ctx.strokeStyle='#dad6c7';ctx.lineWidth=25.5*scale;ctx.stroke();ctx.setLineDash([3*scale,3*scale]);ctx.strokeStyle='#d4933d';ctx.stroke();ctx.setLineDash([]);
   route();ctx.strokeStyle='#737876';ctx.lineWidth=24*scale;ctx.stroke();
   for(const offset of [-4,4]){ctx.beginPath();course.samples.forEach((p,i)=>{const q=course.point(i/course.samples.length+.0001),yaw=Math.atan2(q.x-p.x,q.z-p.z),px=x(p.x+Math.cos(yaw)*offset),pz=z(p.z-Math.sin(yaw)*offset);i?ctx.lineTo(px,pz):ctx.moveTo(px,pz);});ctx.closePath();ctx.lineWidth=.18*scale;ctx.strokeStyle='#d7d3b9';ctx.setLineDash([3*scale,6*scale]);ctx.stroke();ctx.setLineDash([]);}
   const start=course.point(0);for(let i=0;i<24;i++)for(let j=0;j<2;j++){ctx.fillStyle=(i+j)%2?'#e6e2d7':'#272f32';ctx.fillRect(x(start.x-1+j),z(start.z-12+i+1),scale,scale);}
   for(let row=1;row<12;row++)for(const lane of [-2.4,2.4]){const p=course.point(-row*7/course.length);ctx.fillStyle='#e1d7bb';ctx.fillRect(x(p.x-2),z(p.z+lane+1),.2*scale,2*scale);}
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);floorMaterial.map=texture;floorMaterial.color.set(0xffffff);
  }
 }
 const surfaceDetail=addCourseGroundDetail(floorMaterial,course);
 const patch=course.terrainPatch();groundGeometry.setAttribute('position',new T.BufferAttribute(patch.positions,3));groundGeometry.setAttribute('uv',new T.BufferAttribute(patch.uv,2));groundGeometry.setIndex(new T.BufferAttribute(patch.indices,1));groundGeometry.computeVertexNormals();
 const ground=new T.Mesh(groundGeometry,floorMaterial);ground.name=id+'_ground';ground.receiveShadow=true;root.add(ground);
 const batches=new Map<keyof typeof materials,T.Matrix4[]>(),matrix=new T.Matrix4(),q=new T.Quaternion();
 function box(x:number,y:number,z:number,w:number,h:number,d:number,material:keyof typeof materials,yaw=0){q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const batch=batches.get(material)??[];batch.push(matrix.clone());batches.set(material,batch);}
 for(const s of course.solids)box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,s.material,s.yaw);
 // Grandstands and pit buildings stay behind the continuous safety walls.
 for(const side of [-1,1])for(let row=0;row<8;row++){
  const z=side*(105+row*3),h=1+row*.65;
  box(0,h/2,z,205,h,3,'concrete');
  for(let x=-99;x<=99;x+=3)box(x,h+.18,z,2.4,.25,.8,row%2?'blue':'seat');
 }
 for(const x of [-85,-45,-5,35,75]){
  box(x,2,-20,32,4,13,'blue');box(x,4.3,-20,34,.6,15,'steel');
  for(const dx of [-10,0,10])box(x+dx,1.5,-26.6,7,3,.15,'seat');
 }
 // Inner paddock is separated from racing by the inner barrier.
 box(0,.05,0,215,.1,58,'grass');
 for(const x of [-195,195])for(const z of [-70,70]){box(x,9,z,.65,18,.65,'steel');box(x,18,z,6,1.2,1,'seat');}
 box(-70,7,8,1.2,14,1.2,'steel');box(-70,13,8,18,8,1,'steel');
 for(let row=0;row<4;row++)for(let col=0;col<5;col++)box(-77+col*3.5,10.2+row*1.6,8.6,2.2,.65,.2,'stripe');
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name=id+'_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=course.solids;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;surfaceDetail.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});groundGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
