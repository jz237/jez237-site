import * as T from 'three';
import {getFenwickCourse,type FenwickId} from './fenwick-course';
import {freezeSceneryTransforms} from './render-work';
/** Both layouts share the fairground setting; each opens only its selected road. */
export function createFenwickWorld(id:FenwickId){
 const course=getFenwickCourse(id),root=new T.Group();root.name=id;
 const materials={concrete:new T.MeshStandardMaterial({color:0xc7bfa7,roughness:1}),stripe:new T.MeshStandardMaterial({color:0x953e34,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x3c4643,roughness:.7,metalness:.4}),timber:new T.MeshStandardMaterial({color:0x776146,roughness:1}),roof:new T.MeshStandardMaterial({color:0x526b5e,roughness:.9}),seat:new T.MeshStandardMaterial({color:0xaf8c52,roughness:.95})};
 const floorMaterial=new T.MeshStandardMaterial({color:0x817851,roughness:1}),floorGeometry=new T.PlaneGeometry(440,360),boxGeometry=new T.BoxGeometry(),textures:T.Texture[]=[];
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2200;canvas.height=1800;const ctx=canvas.getContext('2d');
  if(ctx){const scale=5,x=(v:number)=>1100+v*scale,z=(v:number)=>900-v*scale;ctx.fillStyle='#737849';ctx.fillRect(0,0,2200,1800);
   const draw=(width:number,color:string)=>{ctx.beginPath();course.samples.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));ctx.closePath();ctx.strokeStyle=color;ctx.lineWidth=width*scale;ctx.lineJoin='round';ctx.stroke();};
   draw(34,'#b19368');draw(29,'#987345');draw(23,'#a98250');
   // Parallel ruts give the loose clay a readable direction without extra meshes.
   for(const offset of [-8,-6,-3,0,3,6,8]){ctx.beginPath();course.samples.forEach((p,i)=>{const q=course.samples[(i+1)%course.samples.length],yaw=Math.atan2(q.x-p.x,q.z-p.z),px=x(p.x+Math.cos(yaw)*offset),pz=z(p.z-Math.sin(yaw)*offset);i?ctx.lineTo(px,pz):ctx.moveTo(px,pz);});ctx.closePath();ctx.strokeStyle=offset%2?'#b58e5b':'#947344';ctx.lineWidth=scale*.15;ctx.stroke();}
   let seed=9418;for(let i=0;i<65000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const px=seed%2200;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#423c2320':'#d7c5a51a';ctx.fillRect(px,seed%1800,2,2);}
   const p=course.point(0),q=course.point(.0001),yaw=Math.atan2(q.x-p.x,q.z-p.z);ctx.save();ctx.translate(x(p.x),z(p.z));ctx.rotate(yaw);for(let row=0;row<2;row++)for(let col=0;col<24;col++){ctx.fillStyle=(row+col)%2?'#e6d7b7':'#3a3429';ctx.fillRect((-12+col)*scale,(-1+row)*scale,scale,scale);}ctx.restore();
   ctx.fillStyle='#e5d3a8';ctx.textAlign='center';ctx.font='bold 52px sans-serif';ctx.fillText('FENWICK MOTOR CLUB',x(0),z(-125));
   const tex=new T.CanvasTexture(canvas);tex.flipY=false;tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;textures.push(tex);floorMaterial.map=tex;floorMaterial.color.set(0xffffff);
  }
 }
 const floor=new T.Mesh(floorGeometry,floorMaterial);floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.name='fenwick_clay_ground';root.add(floor);
 const batches=new Map<keyof typeof materials,T.Matrix4[]>();
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,finish:keyof typeof materials,yaw=0)=>{const list=batches.get(finish)??[];list.push(new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),yaw),new T.Vector3(w,h,d)));batches.set(finish,list);};
 for(const s of course.solids)box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,s.material,s.yaw);
 for(const x of [-90,0,90]){
  for(let row=0;row<6;row++){const y=.6+row*.6,z=-140-row*2;box(x,y/2,z,68,y,2,'timber');for(let seat=-30;seat<=30;seat+=3)box(x+seat,y+.2,z,2.2,.2,.7,'seat');}
  box(x,6.3,-146,72,.35,17,'roof');for(const dx of [-34,34])box(x+dx,3,-152,.3,6,.3,'steel');
 }
 for(const x of [-120,-40,40,120]){box(x,2.8,140,42,5.6,18,'timber');box(x,5.8,140,44,.4,20,'roof');for(const dx of [-12,0,12])box(x+dx,2,130.9,8,4,.2,'steel');}
 for(const [x,z]of [[-202,-110],[202,-110],[-202,110],[202,110]]){box(x,8,z,.4,16,.4,'steel');box(x,16,z,5,.7,1,'concrete');}
 for(const [finish,list]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],list.length);list.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='fenwick_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=course.solids;freezeSceneryTransforms(root);let disposed=false;
 return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});floorGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
