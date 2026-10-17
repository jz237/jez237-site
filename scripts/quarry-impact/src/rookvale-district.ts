import * as T from 'three';
/** District-scale backdrop: distinct working yards frame each side of the lap. */
export function createRookvaleDistrict(){
 const root=new T.Group();root.name='rookvale_district';
 const geometries={box:new T.BoxGeometry(),tube:new T.CylinderGeometry(1,1,1,16),dome:new T.SphereGeometry(1,16,8)},material=new T.MeshStandardMaterial({roughness:.88});
 type Shape=keyof typeof geometries;type Row={matrix:T.Matrix4;color:T.Color};const rows:Record<Shape,Row[]>={box:[],tube:[],dome:[]},obj=new T.Object3D();
 const part=(shape:Shape,x:number,y:number,z:number,w:number,h:number,d:number,color:number,yaw=0)=>{obj.position.set(x,y,z);obj.rotation.set(0,yaw,0);obj.scale.set(w,h,d);obj.updateMatrix();rows[shape].push({matrix:obj.matrix.clone(),color:new T.Color(color)});};
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,color:number)=>part('box',x,y,z,w,h,d,color);
 const beam=(a:T.Vector3,b:T.Vector3,r:number,color:number)=>{obj.position.copy(a).add(b).multiplyScalar(.5);obj.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());obj.scale.set(r,a.distanceTo(b),r);obj.updateMatrix();rows.tube.push({matrix:obj.matrix.clone(),color:new T.Color(color)});};
 const steel=0x59696b,cream=0xb8b8a3,rust=0x89563f,yellow=0xc2a05a,dark=0x334548;
 // West tank farm: unequal silos, domed caps, external bands and connected pipe rack.
 for(let i=0;i<6;i++){
  const x=-272-(i%2)*32,z=-96+Math.floor(i/2)*76,h=20+(i%3)*7,r=10+(i%2)*2;
  part('tube',x,h/2,z,r,h,r,i%2?0x9daaa4:0xc2bb9d);part('dome',x,h,z,r,3,r,cream);
  for(const y of [1,h*.5,h-1])part('tube',x,y,z,r+.15,.22,r+.15,steel);
  for(let j=0;j<22;j++){const y=.5+j*(h/22);box(x+r+.4,y,z,1,.08,.08,steel);}
  for(const dz of [-.5,.5])beam(new T.Vector3(x+r+.4,0,z+dz),new T.Vector3(x+r+.4,h+1,z+dz),.065,steel);
  beam(new T.Vector3(x,2,z+r),new T.Vector3(-248,2,z+r),.32,rust);
 }
 for(const z of [-110,-60,-10,40,90]){for(const x of [-248,-240])box(x,3.5,z,.3,7,.3,steel);box(-244,7,z,9,.3,.3,cream);}
 for(const x of [-247,-244,-241])beam(new T.Vector3(x,7.5,-125),new T.Vector3(x,7.5,115),.32,x===-244?yellow:rust);
 // North warehouses form a connected skyline behind the existing loading sheds.
 for(const [x,w,h,z]of [[-155,85,19,250],[-48,95,25,255],[68,95,17,248],[170,70,22,250]]){
  box(x,h/2,z,w,h,46,0x77868a);box(x,h+.4,z,w+2,.8,48,dark);
  for(let dx=-w/2+3;dx<w/2;dx+=4)box(x+dx,h/2,z-23.2,.14,h,.15,cream);
  for(let dx=-w/2+8;dx<w/2-5;dx+=12){box(x+dx,h-4,z-23.3,8,2.5,.12,0x304b55);box(x+dx,3,z-23.4,7,6,.2,dark);box(x+dx,h+1.3,z,4,1.8,5,steel);}
  box(x,h*.6,z-23.5,w*.65,.7,.15,yellow);
 }
 // East power house: roof exhausts, glazed upper floor and electrical gantries.
 box(292,11,20,68,22,98,0x786e60);box(292,22.5,20,71,1,101,dark);
 for(let z=-20;z<=60;z+=10){box(257.8,17,z,.15,4,7,0x314b52);box(257.7,7,z,.3,10,.2,cream);}
 for(const z of [-10,25,60]){part('tube',302,32,z,2.6,22,2.6,0x87968f);part('tube',302,43,z,3,.4,3,rust);}
 for(const z of [-105,-75]){for(const x of [260,280,300]){box(x,7,z,.3,14,.3,steel);for(const y of [10,13])box(x,y,z,12,.25,.25,cream);for(const dx of [-4,0,4])part('tube',x+dx,13.6,z,.3,1,.3,0x566a62);}}
 // South freight stacks: offset groups, doors and ribs, leaving a central service gate.
 for(const side of [-1,1])for(let group=0;group<3;group++)for(let tier=0;tier<2+(group%2);tier++){
  const x=side*(65+group*50),z=-238-tier*.7,color=[0x745d49,0x59777b,0x885247][(group+tier)%3];
  box(x,2.6+tier*5.2,z,42,5,15,color);
  for(let dx=-20;dx<=20;dx+=1.5)box(x+dx,2.6+tier*5.2,z+7.6,.1,4.7,.12,cream);
  for(const dx of [-21,21])box(x+dx,2.6+tier*5.2,z,.2,5.2,15.2,steel);
 }
 // Perimeter lamps and warning rails connect the compounds rather than scatter props.
 for(const side of [-1,1])for(const z of [-145,-45,55,145]){box(side*238,8,z,.2,16,.2,steel);box(side*238,16,z,4,.3,.7,cream);}
 const meshes:T.InstancedMesh[]=[];for(const shape of Object.keys(rows)as Shape[]){const mesh=new T.InstancedMesh(geometries[shape],material,rows[shape].length);mesh.name='rookvale_district_'+shape;rows[shape].forEach((r,i)=>{mesh.setMatrixAt(i,r.matrix);mesh.setColorAt(i,r.color);});mesh.computeBoundingSphere();mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);meshes.push(mesh);}
 const groundGeometry=new T.PlaneGeometry(1800,1600),groundMaterial=new T.MeshStandardMaterial({color:0x8a8271,roughness:1}),ground=new T.Mesh(groundGeometry,groundMaterial);ground.name='rookvale_district_ground';ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;root.add(ground);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();meshes.forEach(m=>m.dispose());Object.values(geometries).forEach(g=>g.dispose());material.dispose();groundGeometry.dispose();groundMaterial.dispose();root.clear();}};
}
