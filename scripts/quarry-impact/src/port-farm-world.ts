import {addCourseGroundDetail} from './course-materials';
import * as T from 'three';
import {SALTMARSH,DUNMERE} from './port-farm-courses';
import {freezeSceneryTransforms} from './render-work';
export function createPortFarmWorld(id:'saltmarsh-port-v1'|'dunmere-farm-v1'){
 const paved=id==='saltmarsh-port-v1',course=paved?SALTMARSH:DUNMERE,root=new T.Group();root.name=id;
 const materials={concrete:new T.MeshStandardMaterial({color:paved?0xc9c3ac:0x9c9a84,roughness:.95}),stripe:new T.MeshStandardMaterial({color:paved?0xd99033:0xc28b37,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x344553,roughness:.7,metalness:.4}),grass:new T.MeshStandardMaterial({color:0x687858,roughness:1}),seat:new T.MeshStandardMaterial({color:0x687b48,roughness:.8}),blue:new T.MeshStandardMaterial({color:0x3e6c81,roughness:.85}),red:new T.MeshStandardMaterial({color:0x9f4b3e,roughness:.9})};
 const floorMaterial=new T.MeshStandardMaterial({color:paved?0x777771:0x899467,roughness:.98}),groundGeometry=new T.BufferGeometry(),boxGeometry=new T.BoxGeometry(1,1,1),textures:T.Texture[]=[];
 const {spanX,spanZ}=course.terrain;
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1676;const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.fillStyle=paved?'#82857c':'#807545';ctx.fillRect(0,0,canvas.width,canvas.height);let seed=paved?438:842;
   for(let i=0;i<32000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%canvas.width;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=paved?(i%2?'#84817a':'#6b6e69'):(i%2?'#8a9b72':'#647650');ctx.fillRect(x,seed%canvas.height,3,3);}
   const scale=canvas.width/spanX,x=(v:number)=>(v+spanX/2)*scale,z=(v:number)=>(spanZ/2-v)*canvas.height/spanZ;
   const route=()=>{ctx.beginPath();course.samples.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));ctx.closePath();};
   ctx.lineJoin='round';route();ctx.strokeStyle=paved?'#a6a394':'#a98a5d';ctx.lineWidth=31*scale;ctx.stroke();
   route();ctx.strokeStyle='#dad6c7';ctx.lineWidth=25.5*scale;ctx.stroke();ctx.setLineDash([3*scale,3*scale]);ctx.strokeStyle=paved?'#d4933d':'#9b3e38';ctx.stroke();ctx.setLineDash([]);
   // The material boundary matches the tyre surface query exactly.
   for(const roadPaved of [false,true]){
    if(!paved&&roadPaved)continue;
    ctx.save();ctx.beginPath();ctx.rect(0,paved&&roadPaved?z(-25):0,canvas.width,paved?(roadPaved?canvas.height-z(-25):z(-25)):canvas.height);ctx.clip();
    route();ctx.strokeStyle=roadPaved?'#41494b':'#b09b72';ctx.lineWidth=24*scale;ctx.stroke();
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
 // Original dock/farm landmarks stay clear of the racing and recovery lanes.
 const clear=(x:number,z:number,r:number)=>course.distance(x,z)>r;
 if(paved){
  // Stacked containers, with raised crane booms framing the northern waterfront.
  for(let i=0;i<24;i++){
   const x=-135+(i%6)*48,z=-25+Math.floor(i/6)*39;
   if(!clear(x,z,36))continue;
   for(let layer=0;layer<2;layer++){box(x,1.5+layer*3,z,22,3,8,i%2?'red':'blue');for(let rib=-10;rib<=10;rib+=2)box(x+rib,1.5+layer*3,z-4.08,.18,2.7,.16,'steel');}
  }
  box(0,-.3,220,600,.3,90,'blue');box(0,.1,177,440,.4,9,'concrete');
  for(const x of [-115,105]){for(const side of [-1,1])box(x+side*13,12,166,1.2,24,1.2,'stripe');box(x,25,176,30,2,55,'stripe');box(x,15,192,.3,19,.3,'steel');box(x,5,192,5,1,2,'steel');}
 }else{
  // Barns and crop rows provide a recognizable working-farm setting.
  for(const x of [-200,200]){box(x,4,0,14,8,22,'red');box(x,8.2,0,17,1,25,'steel');box(x,2,-11.1,7,4,.2,'concrete');}
  for(let x=-100;x<=100;x+=9)for(let z=-50;z<=110;z+=16){if(!clear(x,z,32))continue;const y=course.height(x,z);box(x,y+.65,z,1.3,1.3,11,'seat');}
  for(let i=0;i<25;i++){const x=-190+i*16,z=151;if(clear(x,z,26)){box(x,course.height(x,z)+1,z,3,2,3,'stripe');}}
  for(const x of [-35,35]){box(x,6,-158,9,12,9,'concrete');box(x,12.4,-158,10,.8,10,'steel');}
 }
 // Service paddock and spectator terraces stay behind the southern wall.
 for(const x of [-65,0,65]){box(x,2,-157,45,4,14,'red');box(x,4.3,-157,47,.6,16,'steel');}
 for(const x of [-192,192]){box(x,7,-85,.6,14,.6,'steel');box(x,14,-85,5,.8,1,'seat');}
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name=id+'_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=course.solids;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;surfaceDetail.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});groundGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
