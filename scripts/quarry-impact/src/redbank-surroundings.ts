import * as T from 'three';
import {createVenueCrowd,type SpectatorPlace} from './venue-crowd';
import {REDBANK} from './redbank-course';
/** Red-earth fairground surroundings beyond the safety wall. Decorative geometry
 * never changes the shared road, jump, recovery boundary or collision records. */
export function createRedbankSurroundings(){
 const root=new T.Group();root.name='redbank_surroundings';
 const geometries={box:new T.BoxGeometry(),round:new T.IcosahedronGeometry(1,1),ridge:new T.CylinderGeometry(.45,1,2,24,8),cylinder:new T.CylinderGeometry(1,1,1,10),tire:new T.TorusGeometry(1,.34,5,10)};
 // Uneven stepped strata keep the bluff silhouette from reading as smooth dunes.
 const ridgePositions=geometries.ridge.attributes.position,ridgeColors=[];
 for(let i=0;i<ridgePositions.count;i++){
  const x=ridgePositions.getX(i),y=ridgePositions.getY(i),z=ridgePositions.getZ(i),a=Math.atan2(z,x),r=Math.hypot(x,z);
  const ripple=1+.065*Math.cos(y*23)+.09*Math.sin(a*5+.4);
  ridgePositions.setXYZ(i,x*ripple,y+Math.sin(a*3)*.09*r,z*ripple);
  const band=(Math.round((y+1)*4)%3===0)?.72:1;ridgeColors.push(band,band*.96,band*.88);
 }
 geometries.ridge.setAttribute('color',new T.Float32BufferAttribute(ridgeColors,3));geometries.ridge.computeVertexNormals();
 const material=new T.MeshStandardMaterial({roughness:.93}),ridgeMaterial=new T.MeshStandardMaterial({roughness:1,vertexColors:true,flatShading:true});
 type Shape=keyof typeof geometries;const batches=new Map<Shape,{matrix:T.Matrix4;color:T.Color}[]>(),object=new T.Object3D();
 let seed=40193;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 function add(shape:Shape,x:number,y:number,z:number,w:number,h:number,d:number,color:number,yaw=0,roll=0){
  object.position.set(x,y,z);object.rotation.set(0,yaw,roll);object.scale.set(w,h,d);object.updateMatrix();const rows=batches.get(shape)??[];
  rows.push({matrix:object.matrix.clone(),color:new T.Color(color).multiplyScalar(.88+rand()*.19)});batches.set(shape,rows);
 }
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,color:number,yaw=0)=>add('box',x,y,z,w,h,d,color,yaw);
 // Four non-overlapping outer aprons start beyond the existing 480 x 380 ground.
 for(const side of [-1,1]){box(side*420,1.65,0,360,.1,1100,0x8a7353);box(0,1.65,side*370,480,.1,360,0x8a7353);}
 // Weathered red bluffs, with offset ledges, form a continuous distant bowl.
 for(let i=0;i<26;i++){
  const a=i/26*Math.PI*2,x=Math.cos(a)*310,z=Math.sin(a)*255,h=24+rand()*34;
  add('ridge',x,-h*.25,z,65+rand()*22,h,45+rand()*18,[0x9d684a,0x95694f,0xac7850][i%3],a);
  add('ridge',x*.96,-h*.32,z*.96,55,h*.73,39,0xbd875c,a+.3);
 }
 const outerGround=(x:number,z:number)=>Math.abs(x)>240||Math.abs(z)>190?1.7:1.8;
 const treePositions:{x:number;z:number}[]=[];
 for(let i=0;i<170;i++){
  const a=i/170*Math.PI*2,r=1+rand()*.38,x=Math.cos(a)*190*r,z=Math.sin(a)*155*r,h=7+rand()*8,ground=outerGround(x,z);
  treePositions.push({x,z});add('cylinder',x,ground+h*.34,z,.22,h*.68,.22,0x68513b);
  for(let j=0;j<3;j++)add('round',x+(j-1)*1.5,ground+h*(.67+j*.08),z+(j%2)*1.8,2.7,h*.27,2.8,[0x657343,0x7a7b42,0x536b44,0x927844][i%4],rand()*6);
 }
 // Busy service row behind the existing containers: awnings, trailers and trucks.
 const propCenters:{x:number;z:number}[]=[];
 for(let i=0;i<7;i++){
  const x=-90+i*30,z=104+(i%2)*12,y=outerGround(x,z);propCenters.push({x,z});
  box(x,y+1.8,z,19,3.6,7,0xb4aa8d);box(x,y+3.7,z,19.6,.25,7.5,0x5c6158);
  for(const dx of [-6,0,6])box(x+dx,y+2.2,z-3.54,3,1.15,.09,0x354747);
  box(x+7,y+1.3,z-3.6,2,2.6,.12,0x85634d);
  box(x,y+3.4,z-8,19,.18,9,i%2?0xb75436:0xd0ad65);
  for(const dx of [-9,9])box(x+dx,y+1.7,z-12,.13,3.4,.13,0x5c5949);
  // A separate pickup silhouette includes a lowered cargo bed and four tires.
  const tx=x+5,tz=z+10;box(tx,y+.8,tz,2.6,1.15,5.7,[0x9d4d37,0x56777b,0xc1ac78][i%3]);box(tx,y+1.7,tz-1,2.4,1.2,2.3,0x465957);box(tx,y+1.35,tz+1.6,2.1,.2,2.4,0x3c443d);
  for(const dx of [-1.3,1.3])for(const dz of [-1.8,1.8])add('tire',tx+dx,y+.65,tz+dz,.52,.52,.52,0x292c28,Math.PI/2);
  for(let j=0;j<3;j++)add('cylinder',x-7,y+.5+j*.45,z-6,.7,.4,.7,0x30342c);
  box(x-5,y+.6,z-8,2.5,1.2,1,0x7d4934);box(x-5,y+1.3,z-8,2.7,.15,1.1,0x443c32);
 }
 // Water tower and scaffold scoreboard mark opposite turns at driving height.
 const tower={x:148,z:12},ty=outerGround(tower.x,tower.z);propCenters.push(tower);
 for(const dx of [-3.5,3.5])for(const dz of [-3.5,3.5]){
  box(tower.x+dx,ty+8,tower.z+dz,.35,16,.35,0x645e48);
  add('box',tower.x,ty+7,tower.z+dz,.18,11,.18,0x645e48,0,dx>0?-.7:.7);
 }
 add('cylinder',tower.x,ty+17,tower.z,5,5,5,0xb88f62);add('round',tower.x,ty+19.5,tower.z,5.2,1.1,5.2,0x6e6a50);
 const score={x:-143,z:0},sy=outerGround(score.x,score.z);propCenters.push(score);
 for(const dz of [-7,7])box(score.x,sy+7,dz,.45,14,.45,0x464c40);
 box(score.x,sy+12,0,1,8,20,0x34473f);
 for(let row=0;row<4;row++)for(let col=0;col<5;col++)box(score.x+.53,sy+9.5+row*1.6,-8+col*4,.08,.65,2.5,col?0xd2c38c:0xcb7546);
 // Tall floodlight frames, including housings and wiring crossbars.
 for(const x of [-120,120])for(const z of [-85,85]){
  const y=REDBANK.height(x,z);box(x,y+11,z,.35,22,.35,0x5c5e4e);box(x,y+21,z,9,.25,.3,0x4c5144);
  for(const dx of [-3,-1,1,3]){box(x+dx,y+21.3,z,1.5,1.1,1,0x3d4841);box(x+dx,y+21.3,z+(z>0?-.52:.52),1.25,.85,.07,0xd9d5ac);}
 }
 for(const x of [-14,14]){const y=REDBANK.height(x,91);box(x,(8+y)/2,91,.28,8-y,.28,0x5a5546);}box(0,8,91,28,.22,.25,0x5a5546);
 for(const [shape,rows]of batches){const mesh=new T.InstancedMesh(geometries[shape],shape==='ridge'?ridgeMaterial:material,rows.length);rows.forEach((r,i)=>{mesh.setMatrixAt(i,r.matrix);mesh.setColorAt(i,r.color);});mesh.name='redbank_surroundings_'+shape;mesh.receiveShadow=true;mesh.castShadow=shape==='box'||shape==='cylinder';mesh.computeBoundingSphere();root.add(mesh);}
 const places:SpectatorPlace[]=[];
 for(const center of [-44,44])for(let row=0;row<6;row++)for(let x=-32;x<=32;x+=3){if(rand()<.18)continue;places.push({x:center+x,y:.7+row*.5,z:-68-row*1.6,yaw:0,seated:true});}
 const crowd=createVenueCrowd(places);root.add(crowd.root);for(const mesh of crowd.root.children)mesh.castShadow=false;
 const textures:T.Texture[]=[],signMaterials:T.Material[]=[],signGeometry=new T.PlaneGeometry(26,3.2);
 if(typeof document!=='undefined')for(const [text,x,z,yaw,y]of [['REDBANK / AIR MAIL FOR CARS',0,91,Math.PI,8],['SUSPENSION: A SUGGESTION',-143,0,Math.PI/2,18],['DENT & BREAKFAST',148,6,0,17]]as const){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;const ctx=canvas.getContext('2d');if(!ctx)continue;
  ctx.fillStyle='#e2c997';ctx.fillRect(0,0,1024,128);ctx.fillStyle='#673d2c';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 58px sans-serif';ctx.fillText(text,512,64,995);
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;textures.push(map);const mat=new T.MeshStandardMaterial({map,roughness:.95,side:T.DoubleSide});signMaterials.push(mat);const mesh=new T.Mesh(signGeometry,mat);mesh.position.set(x,y,z);mesh.rotation.y=yaw;if(x===148)mesh.scale.set(.4,.8,1);root.add(mesh);
 }
 root.userData.treePositions=treePositions;root.userData.propCenters=propCenters;root.userData.spectatorCount=places.length;
 let disposed=false;return{root,update:crowd.update,dispose(){if(disposed)return;disposed=true;crowd.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());material.dispose();ridgeMaterial.dispose();signGeometry.dispose();textures.forEach(t=>t.dispose());signMaterials.forEach(m=>m.dispose());root.clear();}};
}
