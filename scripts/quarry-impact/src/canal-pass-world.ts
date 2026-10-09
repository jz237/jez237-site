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
   ctx.fillStyle=paved?'#676d64':'#777d70';ctx.fillRect(0,0,canvas.width,canvas.height);let seed=paved?943:1852;
   for(let i=0;i<32000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%canvas.width;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=paved?(i%2?'#84817a':'#6b6e69'):(i%2?'#93988a':'#737869');ctx.fillRect(x,seed%canvas.height,3,3);}
   const scale=canvas.width/spanX,x=(v:number)=>(v+spanX/2)*scale,z=(v:number)=>(spanZ/2-v)*canvas.height/spanZ;
   const route=()=>{ctx.beginPath();course.samples.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));ctx.closePath();};
   ctx.lineJoin='round';route();ctx.strokeStyle=paved?'#a6a394':'#a98a5d';ctx.lineWidth=31*scale;ctx.stroke();
   route();ctx.strokeStyle='#dad6c7';ctx.lineWidth=25.5*scale;ctx.stroke();ctx.setLineDash([3*scale,3*scale]);ctx.strokeStyle=paved?'#d4933d':'#9b3e38';ctx.stroke();ctx.setLineDash([]);
   // The visible surface changes at the same z=35 boundary used by tyre physics.
   for(const roadPaved of [false,true]){
    if(!paved&&roadPaved)continue;
    ctx.save();ctx.beginPath();if(paved){const split=z(35);ctx.rect(0,roadPaved?split:0,canvas.width,roadPaved?canvas.height-split:split);}else ctx.rect(0,0,canvas.width,canvas.height);ctx.clip();
    route();ctx.strokeStyle=roadPaved?'#41494b':'#929082';ctx.lineWidth=24*scale;ctx.stroke();
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
 // Landmarks remain beyond the barrier and recovery corridors.
 const clear=(x:number,z:number,r:number)=>course.distance(x,z)>r;
 if(paved){
  // A narrow canal and lock sit in the protected infield, beyond the racing walls.
  box(0,.05,-5,135,.1,19,'blue');
  for(const z of [-16,6])box(0,.7,z,141,1.4,2,'concrete');
  for(const x of [-62,62]){box(x,1,-5,2,2,20,'steel');box(x,2.4,-5,3,.5,23,'stripe');}
  for(const x of [-38,10,42]){box(x,.8,-5,20,1.4,6,'red');box(x+3,2,-5,8,1.5,5,'seat');}
  for(const x of [-110,-55,0,55,110]){box(x,3,-157,38,6,16,'red');box(x,6.4,-157,40,.8,18,'steel');for(const dx of [-12,0,12])box(x+dx,3,-148.8,7,3,.2,'blue');}
  for(let x=-170;x<=170;x+=28)for(const z of [50,145]){if(!clear(x,z,37))continue;box(x,2,z,.5,4,.5,'steel');box(x,5,z,6,6,6,'grass');}
 }else{
  // Granite outcrops and tall pines frame the climb without obstructing recovery.
  for(let x=-192;x<=192;x+=24)for(let z=-40;z<=148;z+=27){
   if(!clear(x,z,39))continue;
   const y=course.height(x,z),h=4+((x*x+z*z)%5);
   if((x+z)%3===0){box(x,y+2,z,9,4,7,'concrete',.35);box(x+2,y+4,z,5,3,4,'seat',-.2);}
   else{box(x,y+h/2,z,.8,h,.8,'steel');box(x,y+h,z,7,6,7,'grass');box(x,y+h+3,z,4,4,4,'grass');}
  }
  for(const x of [-95,-45,45,95]){box(x,2.2,-157,30,4.4,14,'seat');box(x,4.8,-157,33,1,17,'red');box(x,2.5,-149.8,12,2.5,.2,'blue');}
  for(const x of [-196,196])for(const z of [-45,35,115]){const y=course.height(x,z);box(x,y+3,z,.4,6,.4,'steel');box(x+2,y+5,z,4,2,.15,'stripe');}
 }

 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name=id+'_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=course.solids;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});groundGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
