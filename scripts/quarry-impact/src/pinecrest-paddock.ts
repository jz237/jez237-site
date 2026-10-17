import * as T from 'three';
import {createVenueCrowd,type SpectatorPlace} from './venue-crowd';
/** Timber club facilities and occupied terraces beyond Pinecrest's south barrier. */
export function createPinecrestPaddock(){
 const root=new T.Group();root.name='pinecrest_paddock';
 const geometry=new T.BoxGeometry(),material=new T.MeshStandardMaterial({roughness:.9}),obj=new T.Object3D(),rows:{matrix:T.Matrix4;color:T.Color}[]=[];
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,color:number,roll=0)=>{obj.position.set(x,y,z);obj.rotation.set(0,0,roll);obj.scale.set(w,h,d);obj.updateMatrix();rows.push({matrix:obj.matrix.clone(),color:new T.Color(color)});};
 // Garage fronts: layered timber slats, shutter ribs and individual work stations.
 for(let i=0;i<6;i++){
  const x=-65+i*26;
  for(const dx of [-7,0,7]){
   for(let j=0;j<10;j++)box(x+dx,.25+j*.33,-143.78,4.8,.04,.06,0x58645a);
   box(x+dx,3.15,-143.7,4.5,.4,.08,0x2c4147);
   for(const side of [-1,1])box(x+dx+side*2.65,1.75,-143.65,.15,3.5,.25,0x9f8965);
  }
  box(x,4.9,-143.5,5,.7,.25,[0xb6a26b,0x637d77,0x9c614b][i%3]);
  box(x-8,.55,-141,2.5,1.1,.9,0x89573d);box(x-8,1.16,-141,2.8,.12,1.1,0xa9a18c);
  for(let j=0;j<3;j++)box(x-8,.25+j*.28,-140.5,2.2,.03,.08,0xd7cbb0);
  for(const dx of [7,9]){box(x+dx,.6,-141,.65,1.2,.65,0x36544f);box(x+dx,1.22,-141,.72,.08,.72,0x9a9c80);}
  box(x,4.8,-150,3,.4,5,0x42564f);
 }
 // A timber timing tower with cross-braced stilts, wraparound deck and glazing.
 for(const x of [94,102])for(const z of [-133,-141])box(x,3,z,.35,6,.35,0x776044);
 for(const z of [-133,-141])for(const sign of [-1,1])box(98,2.8,z,.18,8.6,.18,0x927454,sign*.94);
 box(98,5.8,-137,11,.35,11,0x8e7858);box(98,7.3,-137,8,2.8,7,0x64725b);
 box(98,7.7,-133.44,7.3,1.35,.08,0x263c44);for(const dx of [-2.5,0,2.5])box(98+dx,7.7,-133.35,.1,1.5,.1,0xd0c4a0);
 box(98,9,-137,11,.35,10,0x394d43);
 for(const dx of [-5,5])for(const dz of [-5,5])box(98+dx,6.5,-137+dz,.12,1.3,.12,0xb7a781);
 for(const z of [-132,-142])box(98,7,z,10,.12,.12,0xb7a781);
 // Roof speakers, low pit lighting and a freestanding awards podium.
 for(const x of [-65,-32,0,32,65]){box(x,5.1,-127,.7,1,.7,0x26332f);box(x,5.5,-127.5,.12,.3,1.2,0x7e8a78);}
 for(const x of [-90,90]){box(x,4,-121,.18,8,.18,0x58685b);box(x,8,-121,3,.15,.3,0x899080);for(const dx of [-1,1])box(x+dx,7.8,-120.8,.9,.6,.25,0xddd3a8);}
 for(const [x,h]of [[-106,.7],[-103,1.1],[-100,.45]])box(x,h/2,-138,2.8,h,2.5,0x6a7a52);
 for(const x of [-19,19])box(x,6.6,-127,.16,2,.16,0x776044);
 const mesh=new T.InstancedMesh(geometry,material,rows.length);mesh.name='pinecrest_club_details';rows.forEach((r,i)=>{mesh.setMatrixAt(i,r.matrix);mesh.setColorAt(i,r.color);});mesh.computeBoundingSphere();mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);
 const places:SpectatorPlace[]=[];for(let row=0;row<5;row++)for(let i=0;i<47;i++){if((i*7+row*11)%9===0)continue;places.push({x:-70+i*3,y:.6+row*.55,z:-127-row*2,yaw:0,seated:true});}
 const crowd=createVenueCrowd(places);root.add(crowd.root);crowd.root.children.forEach(o=>o.castShadow=false);
 const signs:{geometry:T.PlaneGeometry;material:T.MeshStandardMaterial;texture:T.CanvasTexture}[]=[];
 if(typeof document!=='undefined')for(const [text,x,y,z,width]of [['PINECREST / BRANCH MANAGERS OF CHAOS',0,7.6,-126.7,42],['TIMING / ROUNDING DOWN SINCE 1987',98,9.6,-131.8,15],['PITS / DENTS WHILE YOU WAIT',0,5.3,-143.2,28]]as const){
  const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=192;const ctx=canvas.getContext('2d');if(!ctx)continue;ctx.fillStyle='#304b3e';ctx.fillRect(0,0,1536,192);ctx.strokeStyle='#bbaa71';ctx.lineWidth=10;ctx.strokeRect(8,8,1520,176);ctx.fillStyle='#eee0b8';ctx.font='bold 68px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,768,96,1470);
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const geometry=new T.PlaneGeometry(width,width/12),material=new T.MeshStandardMaterial({map:texture,side:T.DoubleSide,roughness:1}),sign=new T.Mesh(geometry,material);sign.position.set(x,y,z);root.add(sign);signs.push({geometry,material,texture});
 }
 root.userData.spectatorCount=places.length;
 let disposed=false;return{root,update:crowd.update,dispose(){if(disposed)return;disposed=true;crowd.dispose();root.removeFromParent();mesh.dispose();geometry.dispose();material.dispose();signs.forEach(s=>{s.geometry.dispose();s.material.dispose();s.texture.dispose();});root.clear();}};
}
