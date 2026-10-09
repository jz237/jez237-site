import * as T from 'three';
import {KINGSWELL,COPPERFIELD} from './park-dunes-courses';
import {freezeSceneryTransforms} from './render-work';
export function createParkDunesWorld(id:'kingswell-park-v1'|'copperfield-dunes-v1'){
 const paved=id==='kingswell-park-v1',course=paved?KINGSWELL:COPPERFIELD,root=new T.Group();root.name=id;
 const materials={concrete:new T.MeshStandardMaterial({color:paved?0xc9c3ac:0x9c9a84,roughness:.95}),stripe:new T.MeshStandardMaterial({color:paved?0xd99033:0xc28b37,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x344553,roughness:.7,metalness:.4}),grass:new T.MeshStandardMaterial({color:0x687858,roughness:1}),seat:new T.MeshStandardMaterial({color:0x687b48,roughness:.8}),blue:new T.MeshStandardMaterial({color:0x3e6c81,roughness:.85}),red:new T.MeshStandardMaterial({color:0x9f4b3e,roughness:.9})};
 const floorMaterial=new T.MeshStandardMaterial({color:paved?0x777771:0xc9af76,roughness:.98}),groundGeometry=new T.BufferGeometry(),boxGeometry=new T.BoxGeometry(1,1,1),textures:T.Texture[]=[];
 const {spanX,spanZ}=course.terrain;
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1676;const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.fillStyle=paved?'#676d64':'#c4a776';ctx.fillRect(0,0,canvas.width,canvas.height);let seed=paved?943:1852;
   for(let i=0;i<32000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%canvas.width;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=paved?(i%2?'#84817a':'#6b6e69'):(i%2?'#d3bc8b':'#bba16c');ctx.fillRect(x,seed%canvas.height,3,3);}
   const scale=canvas.width/spanX,x=(v:number)=>(v+spanX/2)*scale,z=(v:number)=>(spanZ/2-v)*canvas.height/spanZ;
   const route=()=>{ctx.beginPath();course.samples.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));ctx.closePath();};
   ctx.lineJoin='round';route();ctx.strokeStyle=paved?'#a6a394':'#a98a5d';ctx.lineWidth=31*scale;ctx.stroke();
   route();ctx.strokeStyle='#dad6c7';ctx.lineWidth=25.5*scale;ctx.stroke();ctx.setLineDash([3*scale,3*scale]);ctx.strokeStyle=paved?'#d4933d':'#9b3e38';ctx.stroke();ctx.setLineDash([]);
   // The park is paved throughout; the dune route uses loose dirt throughout.
   for(const roadPaved of [false,true]){
    if(paved!==roadPaved)continue;
    ctx.save();ctx.beginPath();ctx.rect(0,0,canvas.width,canvas.height);ctx.clip();
    route();ctx.strokeStyle=roadPaved?'#41494b':'#ad8b59';ctx.lineWidth=24*scale;ctx.stroke();
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
  // Parkland trees and a low clubhouse sit outside the racing/recovery corridor.
  for(let x=-185;x<=185;x+=23)for(let z=-55;z<=145;z+=26){
   if(!clear(x,z,37))continue;
   const h=5+((x*x+z*z)%4);box(x,h/2,z,1,h,1,'steel');
   box(x,h,z,9,7,9,'grass');box(x,h+3,z,6,4,6,'seat');
  }
  box(20,3,-158,62,6,18,'concrete');box(20,6.6,-158,65,1.2,21,'red');
  for(let x=-5;x<=45;x+=10)box(x,3.5,-148.8,5,3,.2,'blue');
  for(let x=-110;x<=-45;x+=13)for(let tier=0;tier<3;tier++)box(x,1+tier,-151-tier*3,12,2+tier*2,3,tier%2?'blue':'concrete');
 }else{
  // Dry scrub and survey markers make the rolling dune terrain legible.
  for(let x=-190;x<=190;x+=19)for(let z=-70;z<=145;z+=23){
   if(!clear(x,z,35))continue;
   const y=course.height(x,z),h=.5+((x*x+z*z)%5)*.12;
   box(x,y+h/2,z,2.4,h,2,'grass');
   if((x+z)%3===0)box(x+2,y+.6,z,2.5,1.2,1.8,'concrete');
  }
  for(const x of [-100,-65,65,100]){
   box(x,2.5,-155,25,5,14,'stripe');box(x,5.3,-155,28,.6,17,'steel');
   box(x,2.2,-147.8,9,3,.2,'blue');
  }
  for(const x of [-195,195])for(const z of [-100,-25,50,125]){box(x,3,z,.4,6,.4,'steel');box(x+2,5,z,4,2,.15,'red');}
 }

 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name=id+'_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=course.solids;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});groundGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
