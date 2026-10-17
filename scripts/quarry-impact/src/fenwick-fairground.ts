import * as T from 'three';
import {createVenueCrowd,type SpectatorPlace} from './venue-crowd';
/** Shared fairground dressing stays outside both layouts' driving corridors. */
export function createFenwickFairground(){
 const root=new T.Group();root.name='fenwick_fairground';
 const boxGeometry=new T.BoxGeometry(),tubeGeometry=new T.CylinderGeometry(1,1,1,7),material=new T.MeshStandardMaterial({roughness:.82}),object=new T.Object3D();
 type Row={matrix:T.Matrix4;color:T.Color;motion?:'rim'|T.Vector3};let motion:Row['motion'];const boxes:Row[]=[],tubes:Row[]=[];
 const save=(rows:Row[],color:number)=>{object.updateMatrix();rows.push({matrix:object.matrix.clone(),color:new T.Color(color),motion});};
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,color:number)=>{object.position.set(x,y,z);object.quaternion.identity();object.scale.set(w,h,d);save(boxes,color);};
 const beam=(a:T.Vector3,b:T.Vector3,r:number,color:number)=>{object.position.copy(a).add(b).multiplyScalar(.5);object.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());object.scale.set(r,a.distanceTo(b),r);save(tubes,color);};
 const colors=[0xa94f3d,0x497c7c,0xc6a04d,0x697b47];
 // Wheel behind the pit buildings: rotating frame and independently upright cabins.
 const center=new T.Vector3(0,28,164),radius=23;
 for(const z of [160,168])for(const side of [-1,1])beam(new T.Vector3(side*15,0,z),new T.Vector3(0,28,z),.36,0xd0c7a7);
 for(const z of [162,166])for(let i=0;i<24;i++){
  const a=i*Math.PI/12,b=(i+1)*Math.PI/12;
  const p=new T.Vector3(Math.cos(a)*radius,28+Math.sin(a)*radius,z),q=new T.Vector3(Math.cos(b)*radius,28+Math.sin(b)*radius,z);
  motion='rim';beam(p,q,.2,0xb6b39e);beam(new T.Vector3(0,28,z),p,.09,0x778e8e);
  if(z===162&&i%2===0){motion=p.clone();const x=p.x,y=p.y;box(x,y-1.1,164,2.7,1.25,3.4,colors[(i/2)%4]);box(x,y+.9,164,3.2,.18,3.8,0xe0cfa6);for(const dx of [-1.2,1.2])for(const dz of [-1.5,1.5])beam(new T.Vector3(x+dx,y-.5,164+dz),new T.Vector3(x+dx,y+.9,164+dz),.045,0x333e3b);}
 }
 motion=undefined;
 beam(center.clone().add(new T.Vector3(0,0,-4)),center.clone().add(new T.Vector3(0,0,4)),.7,0xb98247);
 // Colorful stalls and striped awnings behind the grandstands, with counters and menu boards.
 for(let i=0;i<8;i++){const x=-112+i*32,z=-166,color=colors[i%4];
  box(x,1.8,z,12,3.6,7,color);box(x,2.35,z+3.54,9,1.8,.08,0x263c3c);box(x,1.25,z+4.1,10,.18,1.3,0xcebc8e);
  for(let j=0;j<10;j++)box(x-6.3+j*1.4,3.8,z+2.5,1.4,.22,7,j%2?color:0xe0d4ad);
  for(const dx of [-6.2,6.2])beam(new T.Vector3(x+dx,0,z+5.5),new T.Vector3(x+dx,3.8,z+5.5),.07,0x514e3d);
  for(let j=0;j<5;j++)box(x-3.4+j*1.7,1.55,z+4,.45,.4,.4,[0xb75e3a,0xd8b66c,0x8d9e78][j%3]);
  box(x+4.7,2.25,z+3.65,1,1.6,.08,0xd6cba8);
 }
 // Existing garage fronts gain ribbed shutters, glazing, work tables and roof vents.
 for(const x of [-120,-40,40,120])for(const dx of [-12,0,12]){
  for(let j=0;j<12;j++)box(x+dx,.25+j*.31,130.75,7.8,.045,.08,0x8c9184);
  box(x+dx,3.55,130.7,7,.5,.1,0x273e42);box(x+dx,.65,127.8,3.3,1.3,1.1,0x815b43);box(x+dx,1.35,127.8,3.6,.12,1.3,0xc0b491);
  box(x+dx,7.45,140,2,.7,2.7,0x7c8276);
 }
 const meshes:T.InstancedMesh[]=[],animated:{mesh:T.InstancedMesh;rows:Row[];first:number;last:number}[]=[];
 for(const [name,geometry,rows]of [['fenwick_fair_boxes',boxGeometry,boxes],['fenwick_fair_tubes',tubeGeometry,tubes]]as const){const mesh=new T.InstancedMesh(geometry,material,rows.length);mesh.name=name;rows.forEach((r,i)=>{mesh.setMatrixAt(i,r.matrix);mesh.setColorAt(i,r.color);});mesh.computeBoundingSphere();mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);meshes.push(mesh);
  const first=rows.findIndex(r=>r.motion!==undefined),last=rows.length-1-[...rows].reverse().findIndex(r=>r.motion!==undefined);
  if(first>=0){mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.boundingSphere!.union(new T.Sphere(center,28));animated.push({mesh,rows,first,last});}
 }
 const places:SpectatorPlace[]=[];for(const x of [-90,0,90])for(let row=0;row<6;row++)for(let seat=-30;seat<=30;seat+=3){if((seat+row*3+x)%21===0)continue;places.push({x:x+seat,y:.6+row*.6,z:-140-row*2,yaw:0,seated:true});}
 const crowd=createVenueCrowd(places);root.add(crowd.root);root.userData.spectatorCount=places.length;
 const rotation=new T.Matrix4(),transform=new T.Matrix4(),matrix=new T.Matrix4(),offset=new T.Vector3();
 let disposed=false;
 function update(time:number){
  if(disposed||!Number.isFinite(time))return;
  crowd.update(time);
  // Absolute time supports replay seeking without drift; one gentle revolution per 150 seconds.
  const angle=(time%150)*Math.PI*2/150,c=Math.cos(angle),s=Math.sin(angle);
  rotation.makeTranslation(center.x,center.y,center.z).multiply(transform.makeRotationZ(angle)).multiply(transform.makeTranslation(-center.x,-center.y,-center.z));
  for(const {mesh,rows,first,last}of animated){
   for(let i=first;i<=last;i++){const row=rows[i];if(row.motion===undefined)continue;
    if(row.motion==='rim')matrix.multiplyMatrices(rotation,row.matrix);
    else{const x=row.motion.x-center.x,y=row.motion.y-center.y;offset.set(c*x-s*y-x,s*x+c*y-y,0);matrix.copy(row.matrix);matrix.elements[12]+=offset.x;matrix.elements[13]+=offset.y;}
    mesh.setMatrixAt(i,matrix);
   }
   mesh.instanceMatrix.clearUpdateRanges();mesh.instanceMatrix.addUpdateRange(first*16,(last-first+1)*16);mesh.instanceMatrix.needsUpdate=true;
  }
 }
 return{root,update,dispose(){if(disposed)return;disposed=true;crowd.dispose();root.removeFromParent();meshes.forEach(m=>m.dispose());boxGeometry.dispose();tubeGeometry.dispose();material.dispose();root.clear();}};
}
