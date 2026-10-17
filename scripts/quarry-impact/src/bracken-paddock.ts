import * as T from 'three';
import {createVenueCrowd,type SpectatorPlace} from './venue-crowd';
/** Original club paddock behind Bracken's closed southern safety wall. */
export function createBrackenPaddock(){
 const root=new T.Group();root.name='bracken_paddock';
 const geometries={box:new T.BoxGeometry(),post:new T.CylinderGeometry(1,1,1,8),tent:new T.ConeGeometry(1,1,4),tire:new T.TorusGeometry(1,.35,5,10)};
 const material=new T.MeshStandardMaterial({roughness:.91});
 type Shape=keyof typeof geometries;const batches=new Map<Shape,{matrix:T.Matrix4;color:T.Color}[]>(),object=new T.Object3D();
 let seed=91231;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 function add(shape:Shape,x:number,y:number,z:number,w:number,h:number,d:number,color:number,yaw=0){object.position.set(x,y,z);object.rotation.set(0,yaw,0);object.scale.set(w,h,d);object.updateMatrix();const rows=batches.get(shape)??[];rows.push({matrix:object.matrix.clone(),color:new T.Color(color).multiplyScalar(.9+rand()*.15)});batches.set(shape,rows);}
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,color:number,yaw=0)=>add('box',x,y,z,w,h,d,color,yaw);
 const centers:{x:number;z:number}[]=[];
 // Distinct team bays: riveted trailers, open awnings, tool chests and tire racks.
 for(let i=0;i<7;i++){
  const x=-84+i*28,z=-153-(i%2)*8,color=[0x486e58,0xb49156,0x985b44,0x536f7b][i%4];centers.push({x,z});
  box(x,1.9,z,17,3.8,6.5,0xc1b9a0);box(x,3.9,z,17.5,.24,7,color);
  for(const dx of [-6,-2,2,6]){box(x+dx,2.1,z+3.3,2.6,1,.08,0x334e48);box(x+dx,3.4,z+3.31,.08,.6,.08,0x7b8071);}
  box(x,3.2,z+7.5,18,.18,8,color);for(const dx of [-8.5,8.5])box(x+dx,1.6,z+11,.13,3.2,.13,0x4f594b);
  box(x-5,.6,z+7,3,1.2,1.2,0x92513c);for(let row=0;row<3;row++)box(x-5,.3+row*.3,z+7.64,2.7,.035,.025,0xd3b78a);
  for(let row=0;row<3;row++)for(const dx of [2,3.5])add('post',x+dx,.25+row*.48,z+8,.65,.45,.65,0x30352d);
  // Pit pickup: separate bonnet, cab, windshield and open bed.
  const px=x+5,pz=z-8;box(px,.9,pz,2.6,1.2,5.5,color);box(px,1.75,pz+1,2.3,1.1,2.2,0x3a5350);box(px,1.2,pz-1.4,2.1,.12,2.4,0x3f483c);
  for(const dx of [-1.3,1.3])for(const dz of [-1.7,1.7])add('tire',px+dx,.65,pz+dz,.5,.5,.5,0x262c29,Math.PI/2);
  box(px,.8,pz+2.8,2.4,.22,.2,0xa6aaa0);for(const dx of [-.8,.8])box(px+dx,1,pz+2.81,.55,.35,.06,0xd7cd9d);
 }
 // Food tents and service kiosks flank the paddock, clear of the racing bounds.
 for(const side of [-1,1]){
  const x=side*119,z=-151;centers.push({x,z});
  for(const dx of [-5,5])for(const dz of [-5,5])box(x+dx,2,z+dz,.15,4,.15,0x5d6552);
  add('tent',x,5,z,8,2.5,8,side>0?0xb39a61:0x8c5b40,Math.PI/4);
  box(x,1,z+3,9,2,2,0x5b6f55);box(x,2.1,z+3,9.4,.18,2.4,0xd6c59c);
  for(let j=-1;j<=1;j++){add('post',x+j*2.5,2.5,z+3,.25,.7,.25,0x84654c);box(x+j*2.5,2.95,z+3,.65,.2,.65,0xc8ab71);}
  box(x,2,-171,10,4,6,0x758b79);box(x,4.15,-171,10.6,.25,6.5,0x465f53);
  for(const dx of [-3,0,3]){box(x+dx,1.7,-167.95,2.3,3.2,.1,0x3d5c4a);box(x+dx+.7,1.7,-167.85,.1,.2,.1,0xd2c39a);}
 }
 // Existing race-control cabin gains glazing, trim, roof equipment and a balcony.
 for(const z of [-73,-67,-61])box(128.86,3.4,z,.07,1.15,4.6,0x253c3a);
 for(const z of [-75,-59])box(128.72,3.4,z,.18,1.8,.14,0xb6ac83);
 box(128.5,2.5,-67,1,.2,17,0x96947e);box(135,5.6,-67,3,.8,5,0x6b7866);
 for(const x of [130,140]){add('post',x,7,-67,.08,3.5,.08,0x4b5b4e);box(x,8.4,-67,1.5,.08,.08,0x4b5b4e);}
 // Roof-mounted speaker clusters and rear stairway handrails add close detail.
 for(const x of [-57,0,57]){box(x,4.8,-106.4,.9,1.3,.7,0x293e36);for(const y of [4.5,5])add('post',x,y,-105.99,.2,.08,.2,0x1d2924,Math.PI/2);}
 for(const x of [-66,66])for(let row=0;row<6;row++){box(x,.2+row*.23,-109-row*1.1,3,.4+row*.46,1.1,0x898c76);box(x,1.2+row*.46,-109-row*1.1,.09,1.8,.09,0x53644e);}
 const flagBases=[-112,-72,-24,24,72,112].map(x=>({x,y:8,z:-134}));
 for(const p of flagBases)add('post',p.x,p.y/2,p.z,.09,p.y,.09,0x76816a);
 for(const x of [-12,12])box(x,8,-107,.2,4.4,.2,0x4c5c47);
 for(const [shape,rows]of batches){const mesh=new T.InstancedMesh(geometries[shape],material,rows.length);rows.forEach((r,i)=>{mesh.setMatrixAt(i,r.matrix);mesh.setColorAt(i,r.color);});mesh.name='bracken_paddock_'+shape;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 const flagGeometry=new T.PlaneGeometry(2.7,1.1,3,1);flagGeometry.translate(1.35,0,0);
 const flagMaterial=new T.MeshStandardMaterial({roughness:1,side:T.DoubleSide}),flags=new T.InstancedMesh(flagGeometry,flagMaterial,flagBases.length);flags.name='bracken_club_flags';flags.instanceMatrix.setUsage(T.DynamicDrawUsage);
 function poseFlags(time:number){flagBases.forEach((p,i)=>{object.position.set(p.x,p.y-.7,p.z);object.rotation.set(.04*Math.sin(time*.8+i),.55+.12*Math.sin(time*.65+i*.7),.05);object.scale.set(1,1,1);object.updateMatrix();flags.setMatrixAt(i,object.matrix);});flags.instanceMatrix.needsUpdate=true;}
 flagBases.forEach((_,i)=>flags.setColorAt(i,new T.Color(i%2?0xc1ae78:0x3b725b)));poseFlags(0);flags.computeBoundingSphere();if(flags.boundingSphere)flags.boundingSphere.radius+=3;root.add(flags);
 const places:SpectatorPlace[]=[];
 for(const center of [-35,35])for(let row=0;row<5;row++)for(let x=-25;x<=25;x+=2.5){if(rand()<.13)continue;places.push({x:center+x,y:.5+row*.48,z:-108-row*1.6-.12,yaw:0,seated:true});}
 const crowd=createVenueCrowd(places);root.add(crowd.root);for(const mesh of crowd.root.children)mesh.castShadow=false;
 const textures:T.Texture[]=[],signMaterials:T.Material[]=[],signGeometry=new T.PlaneGeometry(22,2.4);
 if(typeof document!=='undefined')for(const [text,x,z,y]of [['BRACKEN / GRIP IS A RUMOUR',0,-107,10],['LAST LAP LUNCHES',-119,-145.2,4],['WE BRAKE FOR CAKE',119,-145.2,4]]as const){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;const ctx=canvas.getContext('2d');if(!ctx)continue;ctx.fillStyle='#d8c59a';ctx.fillRect(0,0,1024,128);ctx.fillStyle='#294e3c';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 60px sans-serif';ctx.fillText(text,512,64,990);
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;textures.push(map);const mat=new T.MeshStandardMaterial({map,roughness:1,side:T.DoubleSide});signMaterials.push(mat);const sign=new T.Mesh(signGeometry,mat);sign.position.set(x,y,z);if(x)sign.scale.x=.5;root.add(sign);
 }
 root.userData.paddockCenters=centers;root.userData.spectatorCount=places.length;
 let disposed=false,lastTick=-1;return{root,update(time:number){crowd.update(time);if(disposed||!Number.isFinite(time)||time<0)return;const tick=Math.floor(time*20);if(tick===lastTick)return;lastTick=tick;poseFlags(tick/20);},dispose(){if(disposed)return;disposed=true;crowd.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());material.dispose();flagGeometry.dispose();flagMaterial.dispose();signGeometry.dispose();textures.forEach(t=>t.dispose());signMaterials.forEach(m=>m.dispose());root.clear();}};
}
