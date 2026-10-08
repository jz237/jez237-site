import * as T from 'three';
import {HARROW_ARENA,HARROW_BARRIERS} from './harrow-arena';
import {freezeSceneryTransforms} from './render-work';
export function createHarrowWorld(){
 const root=new T.Group();root.name='harrow_breaker_bowl';
 const materials={concrete:new T.MeshStandardMaterial({color:0xbcb5a4,roughness:.98}),orange:new T.MeshStandardMaterial({color:0xb9582e,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x303539,roughness:.7,metalness:.3}),seat:new T.MeshStandardMaterial({color:0x557876,roughness:.85})};
 const floorMaterial=new T.MeshStandardMaterial({color:0xffffff,roughness:.93}),floorGeometry=new T.PlaneGeometry(180,180),boxGeometry=new T.BoxGeometry(),textures:T.Texture[]=[];
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.fillStyle='#45484a';ctx.fillRect(0,0,1024,1024);let seed=421;
   for(let i=0;i<16000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%1024;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#515354':'#3d4143';ctx.fillRect(x,seed%1024,2,2);}
   const scale=1024/180;ctx.strokeStyle='#b6b099';ctx.lineWidth=.15*scale;
   for(const radius of [12,34,46]){ctx.beginPath();ctx.arc(512,512,radius*scale,0,Math.PI*2);ctx.stroke();}
   for(let i=0;i<24;i++){const a=i/24*Math.PI*2;ctx.save();ctx.translate(512+Math.sin(a)*34*scale,512-Math.cos(a)*34*scale);ctx.rotate(a);ctx.strokeRect(-1.3*scale,-2.8*scale,2.6*scale,5.6*scale);ctx.restore();}
   ctx.fillStyle='#cfbda3';ctx.textAlign='center';ctx.font='bold 38px sans-serif';ctx.fillText('HARROW',512,503);ctx.font='16px sans-serif';ctx.fillText('BREAKER BOWL',512,529);
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);floorMaterial.map=texture;
  }
 }else floorMaterial.color.set(0x45484a);
 const floor=new T.Mesh(floorGeometry,floorMaterial);floor.name='harrow_asphalt';floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;root.add(floor);
 const batches=new Map<keyof typeof materials,T.Matrix4[]>(),matrix=new T.Matrix4(),q=new T.Quaternion();
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,finish:keyof typeof materials,yaw=0)=>{q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const batch=batches.get(finish)??[];batch.push(matrix.clone());batches.set(finish,batch);};
 HARROW_BARRIERS.forEach((s,i)=>box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,i%12<6?'concrete':'orange',s.yaw));
 // Terraced stands outside the continuous collision wall, with four entry gaps.
 for(let i=0;i<48;i++){
  if(i%12<2)continue;const a=i/48*Math.PI*2;
  for(let row=0;row<5;row++){const radius=HARROW_ARENA.fenceRadius+row*2.3,y=.7+row*.8;box(Math.sin(a)*radius,y/2,Math.cos(a)*radius,6.5,y,2.1,'concrete',a);box(Math.sin(a)*radius,y+.25,Math.cos(a)*radius,5.8,.3,.65,'seat',a);}
  box(Math.sin(a)*52,2.25,Math.cos(a)*52,.12,4.5,.12,'steel',a);
 }
 for(const sign of [-1,1]){box(sign*74,3,0,12,6,23,'orange');box(sign*74,6.2,0,13,.3,24,'steel');}
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='harrow_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=HARROW_BARRIERS;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});floorGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
