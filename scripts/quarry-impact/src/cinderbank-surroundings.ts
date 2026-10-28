import * as T from 'three';
import {createVenueCrowd,type SpectatorPlace} from './venue-crowd';
import {createPhotoTrees,type PhotoTree} from './photo-trees';
/** Speedway fairground behind the existing safety walls; no driving geometry. */
export function createCinderbankSurroundings(){
 const root=new T.Group();root.name='cinderbank_surroundings';
 const geometries={box:new T.BoxGeometry(1,1,1),hill:new T.SphereGeometry(1,16,8)};
 const material=new T.MeshStandardMaterial({roughness:.94});
 type Shape=keyof typeof geometries;
 const batches=new Map<Shape,{matrix:T.Matrix4;color:T.Color}[]>(),q=new T.Quaternion(),m=new T.Matrix4();
 let seed=45123;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 function add(shape:Shape,x:number,y:number,z:number,w:number,h:number,d:number,color:number,yaw=0){
  q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);m.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));
  const rows=batches.get(shape)??[];rows.push({matrix:m.clone(),color:new T.Color(color).multiplyScalar(.9+rand()*.16)});batches.set(shape,rows);
 }
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,color:number,yaw=0)=>add('box',x,y,z,w,h,d,color,yaw);
 // Extend only beyond the existing ground apron; avoid coplanar road overlays.
 for(const side of [-1,1]){box(side*430,-.07,0,340,.1,920,0x777956);box(0,-.07,side*325,520,.1,270,0x777956);}
 // Overlapping wooded ridges replace the bare horizon, beyond the recovery bounds.
 for(let i=0;i<26;i++){
  const a=i/26*Math.PI*2,x=Math.cos(a)*355,z=Math.sin(a)*280,h=22+rand()*35;
  add('hill',x,-9,z,80+rand()*45,h,65+rand()*40,i%2?0x667153:0x7b805b,a);
 }
 const trees:{x:number;z:number}[]=[],belt:PhotoTree[]=[];
 for(let i=0;i<240;i++){
  const a=i/240*Math.PI*2,r=1+rand()*.35,x=Math.cos(a)*205*r,z=Math.sin(a)*157*r,h=7+rand()*10;
  // Photographed trees; the old trunk and three cone tiers each took a colour draw, still taken to keep the rest in place.
  trees.push({x,z});belt.push({kind:i%4===0?'maple':i%2?'spruce':'pine',x,y:0,z,height:h*1.15,tint:.9+(i%5)*.04});for(let k=0;k<4;k++)rand();
 }
 // Rear paddock: service trailers, awnings, parked cars, tire piles and vendors.
 for(let i=0;i<9;i++){
  const x=-104+i*26,z=124+(i%2)*15;
  box(x,1.9,z,15,3.8,6,0xc2b899);box(x,4,z,15.5,.22,6.5,0x53636a);
  box(x,2.3,z-3.04,5,1.1,.08,0x34464a);box(x+5,1.3,z-3.05,2,2.6,.1,0x897b59);
  box(x,3,z-7,15,.17,7,i%2?0xa7543f:0xc3a25a);
  for(const dx of [-7,7])box(x+dx,1.5,z-10,.12,3,.12,0x3b4544);
  for(let j=0;j<3;j++){const cx=x-5+j*5,cz=z+8;
   box(cx,.65,cz,2,1.1,4,[0x975247,0x496b75,0xc2b38b][(i+j)%3]);box(cx,1.3,cz-.3,1.75,.65,1.8,0x52666a);
   for(const dx of [-1,1])for(const dz of [-1.3,1.3])box(cx+dx,.4,cz+dz,.27,.7,.7,0x292d2b);
  }
  for(let j=0;j<3;j++)box(x+9,.3+j*.4,z-4,1.1,.4,1.1,0x303430);
 }
 // Concession windows and a tall scoreboard give the ends distinct landmarks.
 for(const side of [-1,1]){
  const x=side*171;box(x,2.4,0,12,4.8,26,0xa16b47);box(x,5,0,13,.35,28,0x455550);
  for(const z of [-8,0,8]){box(x-side*6.05,2.7,z,.1,1.6,5,0x273c40);box(x-side*7,1.6,z,2,.2,6,0xc6b797);}
  box(x,2.2,22,8,4.4,5,0x8f9e9a);box(x,4.5,22,9,.2,6,0xa64b36);
 }
 for(const x of [-10,10])box(x,7,108,.6,14,.6,0x414b45);
 box(0,12,108,25,8,1,0x253a36);
 for(let row=0;row<4;row++)for(let col=0;col<6;col++)box(-10+col*4,9.5+row*1.6,107.46,2.4,.65,.08,col?0xc7bd85:0xb96b37);
 for(const [shape,rows]of batches){const mesh=new T.InstancedMesh(geometries[shape],material,rows.length);rows.forEach((r,i)=>{mesh.setMatrixAt(i,r.matrix);mesh.setColorAt(i,r.color);});mesh.name='cinderbank_surroundings_'+shape;mesh.receiveShadow=true;mesh.castShadow=shape==='box';mesh.computeBoundingSphere();root.add(mesh);}
 const forest=createPhotoTrees(belt,'cinderbank_trees');root.add(forest.root);
 const places:SpectatorPlace[]=[];
 for(const center of [-38,38])for(let row=0;row<6;row++)for(let x=-30;x<=30;x+=2){if(rand()<.28)continue;places.push({x:center+x,y:.6+row*.55,z:-85-row*1.65,yaw:0,seated:true});}
 const crowd=createVenueCrowd(places);root.add(crowd.root);for(const mesh of crowd.root.children)mesh.castShadow=false;
 const signTextures:T.Texture[]=[],signMaterials:T.Material[]=[],signGeometry=new T.PlaneGeometry(23,3);
 if(typeof document!=='undefined')for(const [text,x,z,yaw]of [['BENT & BREAKFAST',-171,-13,0],['DENTAL PLAN: OPTIONAL',171,-13,0],['CINDERBANK / NO REFUNDS',0,107.4,Math.PI]]as const){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;const ctx=canvas.getContext('2d');if(!ctx)continue;
  ctx.fillStyle='#ead9a9';ctx.fillRect(0,0,1024,128);ctx.fillStyle='#473d32';ctx.font='bold 59px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,64,990);
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;signTextures.push(map);const mat=new T.MeshStandardMaterial({map,roughness:.9,side:T.DoubleSide});signMaterials.push(mat);const sign=new T.Mesh(signGeometry,mat);sign.position.set(x,x===0?17:6.5,z);sign.rotation.y=yaw;root.add(sign);
 }
 root.userData.treePositions=trees;root.userData.spectatorCount=places.length;
 let disposed=false;return{root,update:crowd.update,dispose(){if(disposed)return;disposed=true;forest.dispose();crowd.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());material.dispose();signGeometry.dispose();signTextures.forEach(t=>t.dispose());signMaterials.forEach(m=>m.dispose());root.clear();}};
}
