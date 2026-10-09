import {createCourseScenery,paintCourseGround} from './course-scenery';
import * as T from 'three';
import {MILLBROOK,GRANITE_PASS} from './canal-pass-courses';
import {freezeSceneryTransforms} from './render-work';
export function createCanalPassWorld(id:'millbrook-canal-v1'|'granite-pass-v1'){
 const paved=id==='millbrook-canal-v1',course=paved?MILLBROOK:GRANITE_PASS,root=new T.Group();root.name=id;
 const materials={concrete:new T.MeshStandardMaterial({color:paved?0xc9c3ac:0x9c9a84,roughness:.95}),stripe:new T.MeshStandardMaterial({color:paved?0xd99033:0xc28b37,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x344553,roughness:.7,metalness:.4}),grass:new T.MeshStandardMaterial({color:0x687858,roughness:1}),seat:new T.MeshStandardMaterial({color:0x687b48,roughness:.8}),blue:new T.MeshStandardMaterial({color:0x3e6c81,roughness:.85}),red:new T.MeshStandardMaterial({color:0x9f4b3e,roughness:.9})};
 const floorMaterial=new T.MeshStandardMaterial({color:paved?0x777771:0x999789,roughness:.98}),groundGeometry=new T.BufferGeometry(),boxGeometry=new T.BoxGeometry(1,1,1),textures:T.Texture[]=[];
 const {spanX,spanZ}=course.terrain;
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1676;const ctx=canvas.getContext('2d');
  if(ctx){
   paintCourseGround(ctx,canvas.width,canvas.height,paved?'canal':'pass');
   const scale=canvas.width/spanX,x=(v:number)=>(v+spanX/2)*scale,z=(v:number)=>(spanZ/2-v)*canvas.height/spanZ;
   const route=()=>{ctx.beginPath();course.samples.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));ctx.closePath();};
   ctx.lineJoin='round';route();ctx.strokeStyle=paved?'#a6a394':'#a98a5d';ctx.lineWidth=31*scale;ctx.stroke();
   route();ctx.strokeStyle='#dad6c7';ctx.lineWidth=25.5*scale;ctx.stroke();ctx.setLineDash([3*scale,3*scale]);ctx.strokeStyle=paved?'#d4933d':'#9b3e38';ctx.stroke();ctx.setLineDash([]);
   // The visible surface changes at the same z=35 boundary used by tyre physics.
   for(const roadPaved of [false,true]){
    if(!paved&&roadPaved)continue;
    ctx.save();ctx.beginPath();if(paved){const split=z(35);ctx.rect(0,roadPaved?split:0,canvas.width,roadPaved?canvas.height-split:split);}else ctx.rect(0,0,canvas.width,canvas.height);ctx.clip();
    route();ctx.strokeStyle=roadPaved?'#41494b':'#929082';ctx.lineWidth=24*scale;ctx.stroke();
    const grain=document.createElement('canvas');grain.width=grain.height=128;const g=grain.getContext('2d');
    if(g){let noise=1531;const rand=()=>((noise=(Math.imul(noise,1664525)+1013904223)>>>0)/4294967296);g.fillStyle=roadPaved?'#41494b':'#929082';g.fillRect(0,0,128,128);for(let n=0;n<8000;n++){const c=roadPaved?80+rand()*50:140+rand()*65;g.fillStyle=`rgba(${c},${c},${c},${roadPaved?.18:.25})`;g.fillRect(rand()*128,rand()*128,.6+rand()*1.5,.6+rand()*1.5);}if(roadPaved){g.strokeStyle='#292f3044';g.lineWidth=.65;for(let n=0;n<6;n++){g.beginPath();let xx=rand()*128,yy=rand()*128;g.moveTo(xx,yy);for(let k=0;k<5;k++){xx+=(rand()-.5)*16;yy+=rand()*12;g.lineTo(xx,yy);}g.stroke();}}const pattern=ctx.createPattern(grain,'repeat');if(pattern){route();ctx.strokeStyle=pattern;ctx.lineWidth=24*scale;ctx.stroke();}}
    ctx.strokeStyle=roadPaved?'#171e201b':'#584b3223';ctx.lineWidth=.55*scale;
    for(const offset of [-3,-1.5,1.5,3]){ctx.beginPath();course.samples.forEach((p,i)=>{const next=course.samples[(i+1)%course.samples.length],yaw=Math.atan2(next.x-p.x,next.z-p.z),xx=x(p.x+Math.cos(yaw)*offset),zz=z(p.z-Math.sin(yaw)*offset);if(i)ctx.lineTo(xx,zz);else ctx.moveTo(xx,zz);});ctx.closePath();ctx.stroke();}

    if(roadPaved){route();ctx.strokeStyle='#d4cda9';ctx.lineWidth=.18*scale;ctx.setLineDash([3*scale,9*scale]);ctx.stroke();ctx.setLineDash([]);}ctx.restore();
   }
   const start=course.point(0);for(let i=0;i<24;i++)for(let j=0;j<2;j++){ctx.fillStyle=(i+j)%2?'#e6e2d7':'#272f32';ctx.fillRect(x(start.x-1+j),z(start.z-12+i+1),scale,scale);}
   for(let row=1;row<12;row++)for(const lane of [-2.4,2.4]){const p=course.point(-row*7/course.length);ctx.fillStyle='#e1d7bb';ctx.fillRect(x(p.x-2),z(p.z+lane+1),.2*scale,2*scale);}
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);floorMaterial.map=texture;floorMaterial.color.set(0xffffff);
  }
 }
 const patch=course.terrainPatch();groundGeometry.setAttribute('position',new T.BufferAttribute(patch.positions,3));groundGeometry.setAttribute('uv',new T.BufferAttribute(patch.uv,2));groundGeometry.setIndex(new T.BufferAttribute(patch.indices,1));groundGeometry.computeVertexNormals();
 const ground=new T.Mesh(groundGeometry,floorMaterial);ground.name=id+'_ground';ground.receiveShadow=true;root.add(ground);
 const batches=new Map<keyof typeof materials,T.Matrix4[]>(),matrix=new T.Matrix4(),q=new T.Quaternion();
 function box(x:number,y:number,z:number,w:number,h:number,d:number,material:keyof typeof materials,yaw=0){q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const batch=batches.get(material)??[];batch.push(matrix.clone());batches.set(material,batch);}
 for(const s of course.solids)box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,s.material,s.yaw);
 if(paved){
  box(0,.05,-5,135,.1,19,'blue');
  for(const z of [-16,6])box(0,.7,z,141,1.4,2,'concrete');
  for(const x of [-62,62]){box(x,1,-5,2,2,20,'steel');box(x,2.4,-5,3,.5,23,'stripe');}
  for(const x of [-38,10,42]){box(x,.8,-5,20,1.4,6,'red');box(x+3,2,-5,8,1.5,5,'seat');}
 }
 const scenery=createCourseScenery(course,paved?'canal':'pass');root.add(scenery.root);

 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name=id+'_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=course.solids;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;scenery.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});groundGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
