import {addCourseGroundDetail} from './course-materials';
import * as T from 'three';
import {HOLLOWAY,BRAMBLEBROOK} from './stadium-reservoir-courses';
import {freezeSceneryTransforms} from './render-work';
export function createStadiumReservoirWorld(id:'holloway-stadium-v1'|'bramblebrook-reservoir-v1'){
 const paved=id==='holloway-stadium-v1',course=paved?HOLLOWAY:BRAMBLEBROOK,root=new T.Group();root.name=id;
 const materials={concrete:new T.MeshStandardMaterial({color:paved?0xc9c3ac:0x9c9a84,roughness:.95}),stripe:new T.MeshStandardMaterial({color:paved?0xd99033:0xc28b37,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x344553,roughness:.7,metalness:.4}),grass:new T.MeshStandardMaterial({color:0x687858,roughness:1}),seat:new T.MeshStandardMaterial({color:0x687b48,roughness:.8}),blue:new T.MeshStandardMaterial({color:0x3e6c81,roughness:.85}),red:new T.MeshStandardMaterial({color:0x9f4b3e,roughness:.9})};
 const floorMaterial=new T.MeshStandardMaterial({color:paved?0x777771:0x899467,roughness:.98}),groundGeometry=new T.BufferGeometry(),boxGeometry=new T.BoxGeometry(1,1,1),textures:T.Texture[]=[];
 const {spanX,spanZ}=course.terrain;
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1676;const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.fillStyle=paved?'#676d64':'#708066';ctx.fillRect(0,0,canvas.width,canvas.height);let seed=paved?943:1852;
   for(let i=0;i<32000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%canvas.width;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=paved?(i%2?'#84817a':'#6b6e69'):(i%2?'#8a9b72':'#647650');ctx.fillRect(x,seed%canvas.height,3,3);}
   const scale=canvas.width/spanX,x=(v:number)=>(v+spanX/2)*scale,z=(v:number)=>(spanZ/2-v)*canvas.height/spanZ;
   const route=()=>{ctx.beginPath();course.samples.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));ctx.closePath();};
   ctx.lineJoin='round';route();ctx.strokeStyle=paved?'#a6a394':'#a98a5d';ctx.lineWidth=31*scale;ctx.stroke();
   route();ctx.strokeStyle='#dad6c7';ctx.lineWidth=25.5*scale;ctx.stroke();ctx.setLineDash([3*scale,3*scale]);ctx.strokeStyle=paved?'#d4933d':'#9b3e38';ctx.stroke();ctx.setLineDash([]);
   // Paved stadium ring; reservoir's tarmac dam approach ends exactly at z=-35.
   for(const roadPaved of [false,true]){
    if(paved&&!roadPaved)continue;
    ctx.save();ctx.beginPath();ctx.rect(0,paved?0:(roadPaved?z(-35):0),canvas.width,paved?canvas.height:(roadPaved?canvas.height-z(-35):z(-35)));ctx.clip();
    route();ctx.strokeStyle=roadPaved?'#41494b':'#ad9470';ctx.lineWidth=24*scale;ctx.stroke();
    if(roadPaved){route();ctx.strokeStyle='#d4cda9';ctx.lineWidth=.18*scale;ctx.setLineDash([3*scale,9*scale]);ctx.stroke();ctx.setLineDash([]);}ctx.restore();
   }
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
 // Landmarks remain beyond the barrier and recovery corridors.
 const clear=(x:number,z:number,r:number)=>course.distance(x,z)>r;
 if(paved){
  // Stepped spectator stands enclose the ring, with open corners and a central scoreboard.
  for(const z of [-145,117])for(const x of [-110,-55,0,55,110])for(let tier=0;tier<5;tier++){
   const offset=(z<0?-1:1)*tier*3;
   box(x,1+tier*1.2,z+offset,50,2+tier*2.4,3,'concrete');
   box(x,2.2+tier*2.4,z+offset,48,.4,2.5,tier%2?'blue':'red');
  }
  for(const x of [-197,197])for(let tier=0;tier<4;tier++)box(x+Math.sign(x)*tier*3,1+tier*1.2,-25,3,2+tier*2.4,85,tier%2?'blue':'concrete');
  box(0,8,-5,34,15,1.5,'steel');box(0,8,-6,31,11,.2,'blue');
  for(let i=0;i<5;i++)box(-11+i*5.5,8,-6.2,3.5,6,.2,'stripe');
  for(const x of [-184,184])for(const z of [-119,92]){box(x,17,z,1,34,1,'steel');box(x,34,z,9,2,2,'concrete');}
 }else{
  // A visible reservoir beyond the north shore and a dam spillway below the access road.
  box(0,-.4,229,600,.4,105,'blue');box(0,1.3,176,440,3,9,'concrete');
  for(let x=-200;x<=200;x+=22)box(x,3.5,178,3,4,11,'concrete');
  box(90,4,-163,45,8,15,'concrete');box(90,8.4,-163,47,.8,17,'steel');
  for(let x=-185;x<=185;x+=23)for(let z=-35;z<=150;z+=29){
   if(!clear(x,z,36))continue;
   const y=course.height(x,z),h=6+((x*x+z*z)%5);
   box(x,y+h/2,z,1.1,h,1.1,'steel');box(x,y+h,z,7,7,7,'grass');box(x,y+h+3,z,4,4,4,'seat');
  }
  for(const x of [-75,-30]){box(x,2,-162,30,4,15,'red');box(x,4.4,-162,32,.8,17,'steel');}
 }
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name=id+'_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=course.solids;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;surfaceDetail.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});groundGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
