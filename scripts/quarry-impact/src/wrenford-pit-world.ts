import {createWrenfordPitLandmarks} from './wrenford-pit-landmarks';
import * as T from 'three';
import {WRENFORD_PIT_BARRIERS} from './wrenford-pit-arena';
import {freezeSceneryTransforms} from './render-work';
export function createWrenfordPitWorld(){
 const root=new T.Group();root.name='wrenford_mud_pit';
 const materials={concrete:new T.MeshStandardMaterial({color:0xbcb5a4,roughness:.98}),orange:new T.MeshStandardMaterial({color:0xb9582e,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x303539,roughness:.7,metalness:.3}),seat:new T.MeshStandardMaterial({color:0x557876,roughness:.85}),hay:new T.MeshStandardMaterial({color:0x998254,roughness:1}),skin:new T.MeshStandardMaterial({color:0xbb967b,roughness:1}),cream:new T.MeshStandardMaterial({color:0xd4c7a5,roughness:.9})};
 const floorMaterial=new T.MeshStandardMaterial({color:0x82705a,roughness:.91}),floorGeometry=new T.PlaneGeometry(480,480),boxGeometry=new T.BoxGeometry(),textures:T.Texture[]=[];
 if(typeof document!=='undefined'){
  const loader=new T.TextureLoader(),base=import.meta.env.BASE_URL+'assets/';
  for(const [name,color]of [['mud_diff',true],['mud_nor_gl',false]]as const){const t=loader.load(base+name+'.jpg');t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(120,120);t.anisotropy=8;t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;textures.push(t);if(color)floorMaterial.map=t;else floorMaterial.normalMap=t;}floorMaterial.normalScale.setScalar(.6);
 }
 const floor=new T.Mesh(floorGeometry,floorMaterial);floor.name='wrenford_pit_mud';floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;root.add(floor);
 const batches=new Map<keyof typeof materials,T.Matrix4[]>(),matrix=new T.Matrix4(),q=new T.Quaternion();
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,finish:keyof typeof materials,yaw=0)=>{q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const batch=batches.get(finish)??[];batch.push(matrix.clone());batches.set(finish,batch);};
 WRENFORD_PIT_BARRIERS.forEach((s,i)=>box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,i%12<6?'concrete':'orange',s.yaw));
 // Covered fairground stands surround the bowl, interrupted by four service gates.
 for(let i=0;i<32;i++){
  if(i%8<2)continue;const a=i/32*Math.PI*2;
  for(let row=0;row<4;row++){
   const r=46+row*2.3,y=.7+row*.8;box(Math.sin(a)*r,y/2,Math.cos(a)*r,8.6,y,2.1,'concrete',a);box(Math.sin(a)*r,y+.25,Math.cos(a)*r,7.9,.3,.65,'seat',a);
   for(let person=0;person<5;person++){if((i+row+person)%4===0)continue;const offset=(person-2)*1.4,x=Math.sin(a)*r+Math.cos(a)*offset,z=Math.cos(a)*r-Math.sin(a)*offset;box(x,y+.83,z,.48,.9,.4,(i+person)%2?'orange':'cream',a);box(x,y+1.43,z,.3,.3,.3,'skin',a);}
  }
  box(Math.sin(a)*51,6.7,Math.cos(a)*51,9.2,.24,11,'steel',a);
  for(const r of [44.5,56])box(Math.sin(a)*r,3.3,Math.cos(a)*r,.18,6.6,.18,'steel',a);
 }
 // Food stalls, stacked bales, workshop awnings and floodlight gantries beyond the wall.
 for(let i=0;i<8;i++){
  const a=i/8*Math.PI*2,r=69,x=Math.sin(a)*r,z=Math.cos(a)*r;
  box(x,1.4,z,8,2.8,5,i%2?'cream':'orange',a);box(x,3,z,9,.25,6,'seat',a);
  box(x-Math.cos(a)*2,1.5,z+Math.sin(a)*2,2,.9,5.04,'steel',a);
  for(let b=0;b<3;b++)box(Math.sin(a)*62+Math.cos(a)*(b-1)*2.2,.6,Math.cos(a)*62-Math.sin(a)*(b-1)*2.2,2,1.2,1.1,'hay',a);
  box(Math.sin(a)*59,7,Math.cos(a)*59,.25,14,.25,'steel');box(Math.sin(a)*59,14,Math.cos(a)*59,4,.6,.5,'cream',a);
 }
 const signGeometry=new T.PlaneGeometry(17,4),signMaterial=new T.MeshStandardMaterial({color:0xeee0ba,roughness:.85,side:T.DoubleSide});
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d');
  if(ctx){ctx.fillStyle='#172c26';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#d2af68';ctx.lineWidth=12;ctx.strokeRect(10,10,1004,236);ctx.fillStyle='#f0dfb4';ctx.textAlign='center';ctx.font='bold 66px sans-serif';ctx.fillText('WRENFORD MUD PIT',512,105);ctx.font='30px sans-serif';ctx.fillText('FRESH MUD. SECOND-HAND EXCUSES.',512,173);const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;textures.push(t);signMaterial.map=t;}
 }
 for(const z of [-59,59]){const sign=new T.Mesh(signGeometry,signMaterial);sign.position.set(0,8,z);if(z>0)sign.rotation.y=Math.PI;root.add(sign);for(const x of [-8,8])box(x,4,z,.3,8,.3,'steel');}
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='wrenford_pit_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 const landmarks=createWrenfordPitLandmarks();root.add(landmarks.root);
 root.userData.solidRecords=WRENFORD_PIT_BARRIERS;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;landmarks.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});floorGeometry.dispose();boxGeometry.dispose();signGeometry.dispose();floorMaterial.dispose();signMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
