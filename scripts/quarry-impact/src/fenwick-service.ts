import * as T from 'three';
/** Decorative service bays behind both layouts' barriers, not drivable obstacles. */
export function createFenwickService(){
 const root=new T.Group();root.name='fenwick_service';
 const geometry={box:new T.BoxGeometry(),round:new T.CylinderGeometry(1,1,1,12),tyre:new T.TorusGeometry(.36,.13,6,12)};
 const material=new T.MeshStandardMaterial({roughness:.78,metalness:.16}),object=new T.Object3D();
 type Shape=keyof typeof geometry;type Row={matrix:T.Matrix4;color:T.Color};const rows:Record<Shape,Row[]>={box:[],round:[],tyre:[]};
 const part=(shape:Shape,x:number,y:number,z:number,w:number,h:number,d:number,color:number,rx=0,ry=0,rz=0)=>{object.position.set(x,y,z);object.rotation.set(rx,ry,rz);object.scale.set(w,h,d);object.updateMatrix();rows[shape].push({matrix:object.matrix.clone(),color:new T.Color(color)});};
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,color:number,rx=0)=>part('box',x,y,z,w,h,d,color,rx);
 const cream=0xc6bfa3,dark=0x25302f,glass=0x304a50,steel=0x697772,rubber=0x282925,wood=0x89714b;
 for(const [i,x]of [-120,-40,40,120].entries()){
  const paint=[0x9f583f,0x456c75,0xb59e63,0x6c7960][i],vx=x+(i%2?10:-10),z=120;
  // Small service van: sill/chassis, cargo shell, bonnet, sloped screen and raised roof.
  box(vx,.62,z,2.1,.26,5.1,dark);box(vx,1.45,z+.65,2.25,1.9,3.6,paint);box(vx,2.45,z+.65,2.3,.16,3.65,cream);
  box(vx,1.05,z-1.75,2.18,.6,1.25,paint);box(vx,1.68,z-1.12,2.12,1.1,1.15,paint);
  box(vx,1.94,z-1.74,1.86,.8,.07,glass,-.32);box(vx,2.32,z-1.25,2.18,.12,1.25,cream);
  for(const side of [-1,1]){
   box(vx+side*1.08,1.94,z-1.07,.055,.66,.89,glass);box(vx+side*1.145,1.38,z+.45,.035,.035,2.8,cream);
   box(vx+side*1.15,1.35,z-.7,.045,.06,.23,dark);box(vx+side*1.28,1.72,z-1.6,.24,.25,.16,dark);
   for(const dz of [-1.7,1.7]){part('round',vx+side*1.13,.5,z+dz,.48,.26,.48,rubber,0,0,Math.PI/2);part('round',vx+side*1.28,.5,z+dz,.22,.035,.22,steel,0,0,Math.PI/2);}
   box(vx+side*.73,1.12,z-2.39,.5,.25,.08,0xd7cda5);box(vx+side*.92,1.1,z+2.48,.18,.45,.06,0x9c4230);
  }
  box(vx,.78,z-2.45,2.25,.2,.2,steel);box(vx,.78,z+2.48,2.25,.2,.18,steel);box(vx,1.55,z+2.49,.035,1.45,.04,dark);
  // Roof rack, ladder rails and strapped spare wheel give each van a service role.
  for(const dx of [-.8,.8])box(vx+dx,2.65,z+.65,.08,.18,3.25,steel);
  for(const dz of [-.6,.6,1.8])box(vx,2.76,z+dz,1.7,.07,.08,steel);
  part('tyre',vx,2.92,z+1.25,1,1,1,rubber,Math.PI/2);
  for(const dx of [-.24,.24])box(vx+dx,2.85,z-.05,.055,.06,2.6,cream);
  for(let rung=0;rung<7;rung++)box(vx,2.85,z-1.2+rung*.35,.5,.055,.045,cream);
  // Striped shelter faces the circuit; workbench, drawers, compressors and organised spares beneath it.
  for(const dx of [-4,4])for(const dz of [118,126])box(x+dx,1.7,dz,.1,3.4,.1,steel);
  for(let stripe=0;stripe<8;stripe++)box(x-3.5+stripe,3.48,122,1,.16,8.5,stripe%2?cream:paint);
  box(x,.9,125,4.1,.12,1.2,wood);for(const dx of [-1.8,1.8])box(x+dx,.44,125,.13,.88,.9,steel);
  box(x+2,.58,123,1.2,1.16,.75,paint);for(let drawer=0;drawer<4;drawer++)box(x+2,.2+drawer*.25,122.61,1.04,.04,.06,cream);
  part('round',x-2,.45,123,.32,1.1,.32,0x8f493a,Math.PI/2);for(const dx of [-2.4,-1.6])part('round',x+dx,.15,123,.12,.14,.12,rubber,0,0,Math.PI/2);
  for(let stack=0;stack<2;stack++)for(let layer=0;layer<3;layer++)part('tyre',x+3.1,layer*.27+.16,119+stack*1.3,1,1,1,rubber,Math.PI/2);
  for(let item=0;item<5;item++){box(x-1.5+item*.65,1.05,125,.28,.18,.3,[cream,steel,paint][item%3]);}
  for(const dx of [-3.3,3.3]){box(x+dx,.15,127.5,1.4,.3,1.2,wood);for(let slat=0;slat<5;slat++)box(x+dx-.55+slat*.27,.34,127.5,.18,.08,1.2,cream);}
 }
 const meshes:T.InstancedMesh[]=[];for(const shape of Object.keys(geometry)as Shape[]){const mesh=new T.InstancedMesh(geometry[shape],material,rows[shape].length);mesh.name='fenwick_service_'+shape;rows[shape].forEach((r,i)=>{mesh.setMatrixAt(i,r.matrix);mesh.setColorAt(i,r.color);});mesh.computeBoundingSphere();mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);meshes.push(mesh);}
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();meshes.forEach(m=>m.dispose());Object.values(geometry).forEach(g=>g.dispose());material.dispose();root.clear();}};
}
