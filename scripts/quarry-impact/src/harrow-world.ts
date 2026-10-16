import {createVenueCrowd,type SpectatorPlace} from './venue-crowd';
import {attachArenaGroundDetail} from './arena-ground-detail';
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
   for(let i=0;i<16000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed>>>22;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#515354':'#3d4143';ctx.fillRect(x,seed>>>22,2,2);}
   const scale=1024/180;ctx.strokeStyle='#b6b099';ctx.lineWidth=.15*scale;
   for(const radius of [12,34,46]){ctx.beginPath();ctx.arc(512,512,radius*scale,0,Math.PI*2);ctx.stroke();}
   for(let i=0;i<24;i++){const a=i/24*Math.PI*2;ctx.save();ctx.translate(512+Math.sin(a)*34*scale,512-Math.cos(a)*34*scale);ctx.rotate(a);ctx.strokeRect(-1.3*scale,-2.8*scale,2.6*scale,5.6*scale);ctx.restore();}
   ctx.fillStyle='#cfbda3';ctx.textAlign='center';ctx.font='bold 38px sans-serif';ctx.fillText('HARROW',512,503);ctx.font='16px sans-serif';ctx.fillText('BREAKER BOWL',512,529);
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);floorMaterial.map=texture;
  }
 }else floorMaterial.color.set(0x45484a);
 if(typeof document!=='undefined')attachArenaGroundDetail(floorMaterial,'harrow');
 const floor=new T.Mesh(floorGeometry,floorMaterial);floor.name='harrow_asphalt';floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;root.add(floor);
 const spectators:SpectatorPlace[]=[];
 const batches=new Map<keyof typeof materials,T.Matrix4[]>(),matrix=new T.Matrix4(),q=new T.Quaternion();
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,finish:keyof typeof materials,yaw=0)=>{q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const batch=batches.get(finish)??[];batch.push(matrix.clone());batches.set(finish,batch);};
 HARROW_BARRIERS.forEach((s,i)=>box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,i%12<6?'concrete':'orange',s.yaw));
 // Terraced stands outside the continuous collision wall, with four entry gaps.
 for(let i=0;i<48;i++){
  if(i%12<2)continue;const a=i/48*Math.PI*2;
  for(let row=0;row<5;row++){
   const radius=HARROW_ARENA.fenceRadius+row*2.3,y=.7+row*.8;
   box(Math.sin(a)*radius,y/2,Math.cos(a)*radius,6.5,y,2.1,'concrete',a);
   for(let seat=0;seat<5;seat++){
    const offset=(seat-2)*1.15,x=Math.sin(a)*radius+Math.cos(a)*offset,z=Math.cos(a)*radius-Math.sin(a)*offset;
    box(x,y+.25,z,.68,.18,.65,'seat',a);box(x+Math.sin(a)*.29,y+.6,z+Math.cos(a)*.29,.68,.65,.1,'seat',a);
    for(const side of [-1,1])box(x+Math.cos(a)*side*.24,y+.1,z-Math.sin(a)*side*.24,.07,.2,.45,'steel',a);
    if((i*7+row*3+seat)%7!==0)spectators.push({x,y:y-.14,z,yaw:a+Math.PI,seated:true});
   }
  }
  const r=57.6;
  if(i%5!==0){box(Math.sin(a)*r,6.9,Math.cos(a)*r,6.8,.25,13,'steel',a);box(Math.sin(a)*51.2,6.55,Math.cos(a)*51.2,6.8,.7,.18,'orange',a);}
  for(const radius of [51.5,63.5])for(const side of [-1,1])box(Math.sin(a)*radius+Math.cos(a)*side*3,3.4,Math.cos(a)*radius-Math.sin(a)*side*3,.14,6.8,.14,'steel',a);
  box(Math.sin(a)*51.5,1.5,Math.cos(a)*51.5,6.5,.09,.09,'steel',a);

  box(Math.sin(a)*52,2.25,Math.cos(a)*52,.12,4.5,.12,'steel',a);
 }
 for(const sign of [-1,1]){box(sign*74,3,0,12,6,23,'orange');box(sign*74,6.2,0,13,.3,24,'steel');}
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='harrow_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 const crowd=createVenueCrowd(spectators);crowd.root.name='harrow_spectators';for(const mesh of crowd.root.children)mesh.castShadow=false;root.add(crowd.root);
 root.userData.solidRecords=HARROW_BARRIERS;freezeSceneryTransforms(root);
 let disposed=false;return{root,update:crowd.update,dispose(){if(disposed)return;disposed=true;crowd.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});floorGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
