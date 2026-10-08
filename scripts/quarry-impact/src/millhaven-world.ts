import * as T from 'three';
import {MILLHAVEN} from './millhaven-course';
import {freezeSceneryTransforms} from './render-work';
export function createMillhavenWorld(){
 const id='millhaven-rally-v1',dock=false,course=MILLHAVEN,root=new T.Group();root.name=id;
 const materials={concrete:new T.MeshStandardMaterial({color:dock?0xc9c3ac:0xd2c5a1,roughness:.95}),stripe:new T.MeshStandardMaterial({color:dock?0xd99033:0x9b3e38,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x344553,roughness:.7,metalness:.4}),grass:new T.MeshStandardMaterial({color:0x687858,roughness:1}),seat:new T.MeshStandardMaterial({color:0xc7c0a4,roughness:.8}),blue:new T.MeshStandardMaterial({color:0x3e6c81,roughness:.85}),red:new T.MeshStandardMaterial({color:0x9f4b3e,roughness:.9})};
 const floorMaterial=new T.MeshStandardMaterial({color:dock?0x777771:0x847b53,roughness:.98}),groundGeometry=new T.BufferGeometry(),boxGeometry=new T.BoxGeometry(1,1,1),textures:T.Texture[]=[];
 const {spanX,spanZ}=course.terrain;
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1676;const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.fillStyle=dock?'#777771':'#888054';ctx.fillRect(0,0,canvas.width,canvas.height);let seed=dock?438:842;
   for(let i=0;i<32000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%canvas.width;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=dock?(i%2?'#84817a':'#6b6e69'):(i%2?'#918857':'#76804e');ctx.fillRect(x,seed%canvas.height,3,3);}
   const scale=canvas.width/spanX,x=(v:number)=>(v+spanX/2)*scale,z=(v:number)=>(spanZ/2-v)*canvas.height/spanZ;
   const route=()=>{ctx.beginPath();course.samples.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));ctx.closePath();};
   ctx.lineJoin='round';route();ctx.strokeStyle=dock?'#90918c':'#b09266';ctx.lineWidth=31*scale;ctx.stroke();
   route();ctx.strokeStyle='#dad6c7';ctx.lineWidth=25.5*scale;ctx.stroke();ctx.setLineDash([3*scale,3*scale]);ctx.strokeStyle=dock?'#d4933d':'#9b3e38';ctx.stroke();ctx.setLineDash([]);
   // The painted material boundary matches the tyre surface query at z=0.
   for(const paved of [false,true]){
    ctx.save();ctx.beginPath();ctx.rect(0,paved?z(0):0,canvas.width,canvas.height/2);ctx.clip();
    route();ctx.strokeStyle=paved?'#41494b':'#a78056';ctx.lineWidth=24*scale;ctx.stroke();
    if(paved){route();ctx.strokeStyle='#d4cda9';ctx.lineWidth=.18*scale;ctx.setLineDash([3*scale,9*scale]);ctx.stroke();ctx.setLineDash([]);}ctx.restore();
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
 // The sawmill and timber stacks sit in the enclosed infield, beyond the barriers.
 box(15,4,-28,66,8,34,'red');box(15,8.3,-28,70,.6,38,'steel');
 for(let x=-10;x<=42;x+=13){box(x,3,-10.8,9,6,.25,'blue');box(x,7,-10.5,9,.65,.3,'seat');}
 box(-25,12,-35,4,24,4,'concrete');box(-25,24.3,-35,5,.6,5,'steel');
 for(const x of [-70,-54,-38])for(let row=0;row<3;row++)box(x,1.2+row*1.4,-38,12-row*2,1.2,20,'seat');
 for(let row=0;row<5;row++){const z=-140-row*2,h=.6+row*.6;box(30,h/2,z,140,h,2,'concrete');for(let x=-35;x<=95;x+=3)box(x,h+.2,z,2.2,.2,.65,'blue');}
 // Instanced trees stay clear of the road, shoulders and start gantry.
 const trunk=new T.CylinderGeometry(.35,.55,1,6),crown=new T.ConeGeometry(1,1,7),trees:T.Matrix4[]=[],trunks:T.Matrix4[]=[];
 for(let i=0;i<190;i++){
  const x=-205+(i*67.13%410),z=-163+(i*41.71%323);
  if(course.distance(x,z)<27||(Math.abs(x-15)<85&&Math.abs(z+28)<60)||z< -130&&x> -50&&x<110)continue;
  const y=course.height(x,z),h=7+i%5;
  trunks.push(new T.Matrix4().makeScale(1,h*.6,1).setPosition(x,y+h*.3,z));
  trees.push(new T.Matrix4().makeScale(h*.38,h,h*.38).setPosition(x,y+h*.85,z));
 }
 for(const [geometry,finish,matrices]of [[trunk,materials.steel,trunks],[crown,materials.grass,trees]]as const){const mesh=new T.InstancedMesh(geometry,finish,matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name=id+'_trees';mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name=id+'_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=course.solids;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});groundGeometry.dispose();boxGeometry.dispose();trunk.dispose();crown.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
