import {createCourseScenery,paintCourseGround} from './course-scenery';
import {addCourseGroundDetail} from './course-materials';
import * as T from 'three';
import {DOCKSIDE,FAIRGROUND} from './county-courses';
import {freezeSceneryTransforms} from './render-work';
export function createCountyWorld(id:'dockside-loop-v1'|'fairground-scramble-v1'){
 const dock=id==='dockside-loop-v1',course=dock?DOCKSIDE:FAIRGROUND,root=new T.Group();root.name=id;
 const materials={concrete:new T.MeshStandardMaterial({color:dock?0xc9c3ac:0xd2c5a1,roughness:.95}),stripe:new T.MeshStandardMaterial({color:dock?0xd99033:0x9b3e38,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x344553,roughness:.7,metalness:.4}),grass:new T.MeshStandardMaterial({color:0x687858,roughness:1}),seat:new T.MeshStandardMaterial({color:0xc7c0a4,roughness:.8}),blue:new T.MeshStandardMaterial({color:0x3e6c81,roughness:.85}),red:new T.MeshStandardMaterial({color:0x9f4b3e,roughness:.9})};
 const floorMaterial=new T.MeshStandardMaterial({color:dock?0x777771:0x847b53,roughness:.98}),groundGeometry=new T.BufferGeometry(),boxGeometry=new T.BoxGeometry(1,1,1),textures:T.Texture[]=[];
 const {spanX,spanZ}=course.terrain;
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1676;const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.fillStyle=dock?'#777771':'#888054';ctx.fillRect(0,0,canvas.width,canvas.height);let seed=dock?438:842;
   for(let i=0;i<32000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%canvas.width;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=dock?(i%2?'#84817a':'#6b6e69'):(i%2?'#918857':'#76804e');ctx.fillRect(x,seed%canvas.height,3,3);}
   if(!dock)paintCourseGround(ctx,canvas.width,canvas.height,'fair');
   const scale=canvas.width/spanX,x=(v:number)=>(v+spanX/2)*scale,z=(v:number)=>(spanZ/2-v)*canvas.height/spanZ;
   const route=()=>{ctx.beginPath();course.samples.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));ctx.closePath();};
   ctx.lineJoin='round';route();ctx.strokeStyle=dock?'#90918c':'#b09266';ctx.lineWidth=31*scale;ctx.stroke();
   route();ctx.strokeStyle='#dad6c7';ctx.lineWidth=25.5*scale;ctx.stroke();ctx.setLineDash([3*scale,3*scale]);ctx.strokeStyle=dock?'#d4933d':'#9b3e38';ctx.stroke();ctx.setLineDash([]);
   route();ctx.strokeStyle=dock?'#3e4447':'#a78056';ctx.lineWidth=24*scale;ctx.stroke();
   if(dock){route();ctx.lineWidth=.18*scale;ctx.strokeStyle='#a9a995';ctx.setLineDash([3*scale,9*scale]);ctx.stroke();ctx.setLineDash([]);}
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
 // Decorations are beyond continuous collision barriers, never on the driveable road.
 if(dock){
  for(let x=-160;x<=160;x+=32)for(let row=0;row<2;row++){const z=-140-row*17;box(x,2.7,z,27,5.4,12,(x+row)%3?'blue':'red');for(let dx=-12;dx<=12;dx+=2)box(x+dx,2.7,z+6.1,.15,5.4,.15,'steel');}
  for(const x of [-180,145]){const z=150;for(const side of [-1,1]){box(x+side*15,12,z,1,24,1,'stripe');box(x+side*15,1,z,4,2,10,'steel');}box(x,24,z,34,1.3,2,'stripe');box(x,24,135,1,1,32,'steel');box(x,19,121,.16,10,.16,'steel');box(x,13.8,121,3,.5,1,'steel');}
  box(0,2.8,0,64,5.6,34,'blue');box(0,5.8,0,66,.4,36,'steel');for(let x=-26;x<=26;x+=13)box(x,2,17.1,9,4,.15,'seat');
  // Canal backdrop remains behind the outer safety wall.
  box(0,-.08,168,430,.08,18,'blue');
 }
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name=id+'_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 const scenery=dock?null:createCourseScenery(course,'fair');if(scenery)root.add(scenery.root);
 root.userData.solidRecords=course.solids;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;scenery?.dispose();surfaceDetail.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});groundGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
