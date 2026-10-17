import * as T from 'three';
/** Parked freight consists on the existing outer sidings, beyond the race walls. */
export function createRookvaleFreight(){
 const root=new T.Group();root.name='rookvale_freight';
 const geometries={box:new T.BoxGeometry(),wheel:new T.CylinderGeometry(1,1,1,12)},material=new T.MeshStandardMaterial({roughness:.84,metalness:.25});
 type Shape=keyof typeof geometries;const rows:Record<Shape,{matrix:T.Matrix4;color:T.Color}[]>={box:[],wheel:[]},object=new T.Object3D();
 const add=(shape:Shape,x:number,y:number,z:number,w:number,h:number,d:number,color:number,rz=0)=>{object.position.set(x,y,z);object.rotation.set(0,0,rz);object.scale.set(w,h,d);object.updateMatrix();rows[shape].push({matrix:object.matrix.clone(),color:new T.Color(color)});};
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,color:number)=>add('box',x,y,z,w,h,d,color);
 for(const side of [-1,1])for(let car=0;car<6;car++){
  const x=side*218,z=-124+car*26,steel=0x344344,rust=0x685045,wood=0x92795b,color=[0x855346,0x526c70,0x8e865e][(car+(side>0?1:0))%3];
  box(x,1.45,z,5.8,.4,23.5,steel);box(x,1.7,z,5.5,.16,22.8,wood);
  for(const dx of [-2.7,2.7]){box(x+dx,1.05,z,.22,.6,23,rust);for(let j=-10;j<=10;j+=2)box(x+dx,1.6,z+j,.28,.6,.18,steel);}
  for(const bogie of [-7.5,7.5]){
   box(x,.75,z+bogie,4.7,.35,4,steel);
   for(const axle of [-1.25,1.25]){
    add('wheel',x,.72,z+bogie+axle,.16,4.4,.16,steel,Math.PI/2);
    for(const dx of [-2,2]){add('wheel',x+dx,.72,z+bogie+axle,.55,.24,.55,0x242e2e,Math.PI/2);add('wheel',x+dx+Math.sign(dx)*.13,.72,z+bogie+axle,.24,.06,.24,rust,Math.PI/2);}
   }
  }
  for(const end of [-1,1]){box(x,1.05,z+end*12.2,.55,.35,1.4,steel);for(const dx of [-1.8,1.8])box(x+dx,1.1,z+end*11.9,.6,.35,.35,steel);}
  if(car%3!==2){
   // Corrugated container, corner castings, locking bars and door seams.
   box(x,3.8,z,5.1,4.1,21.8,color);box(x,5.9,z,5.25,.16,22,steel);
   for(const dx of [-2.61,2.61]){
    for(let j=-10.5;j<=10.5;j+=.75)box(x+dx,3.8,z+j,.1,3.8,.12,color);
    box(x+dx,2,z,.12,.22,22,rust);box(x+dx,4.7,z-5,.13,.6,5,0xb8b5a0);
    for(const dz of [-10.9,10.9])box(x+dx,3.8,z+dz,.18,4.1,.2,steel);
   }
   for(const dz of [-11,11]){box(x,3.8,z+dz,.06,3.9,.1,steel);for(const dx of [-1.8,-.5,.5,1.8])box(x+dx,3.8,z+dz,.09,3.8,.12,0x9a9d8e);}
  }else{
   // Open flatbed with bundled timber and retaining stakes.
   for(let layer=0;layer<4;layer++)for(let beam=0;beam<5;beam++)box(x-2+beam,2+layer*.48,z,.87,.42,18-(layer%2)*1.2,beam%2?wood:0xa58b65);
   for(const dz of [-8,-3,3,8]){box(x,3.72,z+dz,4.9,.07,.13,steel);for(const dx of [-2.6,2.6])box(x+dx,2.65,z+dz,.16,2,.16,steel);}
  }
 }
 const meshes:T.InstancedMesh[]=[];
 for(const shape of Object.keys(rows)as Shape[]){const mesh=new T.InstancedMesh(geometries[shape],material,rows[shape].length);mesh.name='rookvale_freight_'+shape;rows[shape].forEach((r,i)=>{mesh.setMatrixAt(i,r.matrix);mesh.setColorAt(i,r.color);});mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingBox();mesh.computeBoundingSphere();root.add(mesh);meshes.push(mesh);}
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();meshes.forEach(m=>m.dispose());Object.values(geometries).forEach(g=>g.dispose());material.dispose();root.clear();}};
}
