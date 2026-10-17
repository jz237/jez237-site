import * as T from 'three';
/** Freight-yard machinery outside the circuit and its open waypoint apron. */
export function createRookvaleTerminal(){
 const root=new T.Group();root.name='rookvale_terminal';
 const geometries={box:new T.BoxGeometry(),tube:new T.CylinderGeometry(1,1,1,10)},material=new T.MeshStandardMaterial({roughness:.85}),obj=new T.Object3D();
 type Row={matrix:T.Matrix4;color:T.Color};const rows:{box:Row[];tube:Row[]}={box:[],tube:[]};
 const push=(shape:keyof typeof rows,color:number)=>{obj.updateMatrix();rows[shape].push({matrix:obj.matrix.clone(),color:new T.Color(color)});};
 function box(x:number,y:number,z:number,w:number,h:number,d:number,color:number){obj.position.set(x,y,z);obj.quaternion.identity();obj.scale.set(w,h,d);push('box',color);}
 function beam(a:T.Vector3,b:T.Vector3,r:number,color:number){obj.position.copy(a).add(b).multiplyScalar(.5);obj.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());obj.scale.set(r,a.distanceTo(b),r);push('tube',color);}
 const steel=0x48585a,cream=0xc7c0a7,rust=0x87513a,yellow=0xc49b45;
 // Loading bays: shutter ribs, glass transoms, dock cushions, safety bollards and roof ductwork.
 for(const x of [-150,-90,-30,30,90,150]){
  for(const dx of [-15,0,15]){for(let j=0;j<14;j++)box(x+dx,.3+j*.42,170.7,9.6,.06,.12,0x84918c);
   box(x+dx,5.9,170.6,8.8,.65,.16,0x283f46);for(const side of [-1,1]){box(x+dx+side*5,1.3,170.4,.45,2.6,.6,0x292d2b);box(x+dx+side*6.1,.9,169.2,.22,1.8,.22,yellow);}
   box(x+dx,7.7,170.6,2.2,.9,.15,cream);box(x+dx,7.75,170.45,1.3,.3,.1,steel);
  }
  box(x,11.95,186,28,.8,2,0x83918d);for(const dx of [-12,12]){box(x+dx,12.5,186,3,1.5,4,steel);for(let j=0;j<5;j++)box(x+dx-1+j*.5,13.28,186,.12,.05,3,cream);}
  for(const dx of [-23,23]){beam(new T.Vector3(x+dx,0,170.5),new T.Vector3(x+dx,11,170.5),.1,rust);box(x+dx,7.5,170.3,.7,.25,.7,cream);}
 }
 // Stationary flatcars on the existing east/west rails, loaded with ribbed containers.
 for(const side of [-1,1])for(let i=0;i<5;i++){
  const x=side*218,z=-56+i*28,color=[0x7c4f3f,0x5a7777,0x9b864f][(i+(side+1)/2)%3];
  box(x,1.3,z,5.8,.5,24,steel);box(x,1.65,z,5.6,.2,23,rust);
  for(const dz of [-8,8])for(const dx of [-2.45,2.45])beam(new T.Vector3(x+dx-.25,.7,z+dz),new T.Vector3(x+dx+.25,.7,z+dz),.65,0x292d2d);
  box(x,4.15,z,5.2,5,21,color);for(let j=0;j<23;j++)for(const dx of [-2.65,2.65])box(x+dx,4.15,z-10+j*.9,.12,4.8,.12,cream);
  for(const dx of [-2.65,2.65])for(const y of [1.8,6.5])box(x+dx,y,z,.18,.18,21.4,steel);
  for(const dx of [-1.1,1.1])beam(new T.Vector3(x+dx,1.8,z+10.55),new T.Vector3(x+dx,6.5,z+10.55),.07,cream);
  for(const dz of [-12.5,12.5])box(x,.9,z+dz,1,.4,1.3,steel);
 }
 // Crane mast lattice, cab, cable drum and counterweight behind each existing jib.
 for(const side of [-1,1])for(const z of [-85,85]){
  const x=side*218;
  for(const dz of [-1.6,1.6])for(const dx of [-1.6,1.6])beam(new T.Vector3(x+dx,0,z+dz),new T.Vector3(x+dx,25,z+dz),.13,cream);
  for(let j=0;j<6;j++)for(const dz of [-1.6,1.6])for(const dir of [-1,1])beam(new T.Vector3(x+dir*1.6,j*4,z+dz),new T.Vector3(x-dir*1.6,j*4+4,z+dz),.08,yellow);
  box(x,23.5,z,6,.25,6,steel);box(x+side*3.2,25,z,3.5,3,4,yellow);box(x+side*5,25.4,z,.12,1.5,3.3,0x29444c);
  box(x+side*6,26,z,12,.8,2,yellow);beam(new T.Vector3(x,29,z),new T.Vector3(x+side*12,27.9,z),.12,cream);
  box(x+side*10,26.4,z,4,3,4,0x777d72);beam(new T.Vector3(x,27.6,z-1.5),new T.Vector3(x,27.6,z+1.5),1,steel);
  for(let j=0;j<7;j++)beam(new T.Vector3(x-side*24+j*4,26.8,z),new T.Vector3(x-side*22+j*4,29,z),.08,cream);
  beam(new T.Vector3(x-side*24,29,z),new T.Vector3(x+side*4,29,z),.12,cream);
 }
 const meshes:T.InstancedMesh[]=[];for(const shape of ['box','tube']as const){const mesh=new T.InstancedMesh(geometries[shape],material,rows[shape].length);mesh.name='rookvale_terminal_'+shape;rows[shape].forEach((r,i)=>{mesh.setMatrixAt(i,r.matrix);mesh.setColorAt(i,r.color);});mesh.computeBoundingSphere();mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);meshes.push(mesh);}
 // Recessed apron under the peripheral buildings and railway, leaving the original terrain untouched.
 const apronGeometry=new T.PlaneGeometry(700,520),apronMaterial=new T.MeshStandardMaterial({color:0x8a8271,roughness:1}),apron=new T.Mesh(apronGeometry,apronMaterial);apron.rotation.x=-Math.PI/2;apron.position.y=-.05;apron.receiveShadow=true;apron.name='rookvale_outer_apron';root.add(apron);
 const signs:{geometry:T.PlaneGeometry;material:T.MeshBasicMaterial;texture:T.CanvasTexture}[]=[];
 if(typeof document!=='undefined')for(const [label,x,z]of [['ROOKVALE / MISPLACED FREIGHT SPECIALISTS',0,169.9],['BEND IT. SEND IT.',-120,-174.9],['NO CLAIMS. NO BRAKES.',120,-174.9]]as const){
  const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=192;const ctx=canvas.getContext('2d');if(!ctx)continue;ctx.fillStyle='#263e46';ctx.fillRect(0,0,1536,192);ctx.strokeStyle='#c8a354';ctx.lineWidth=10;ctx.strokeRect(8,8,1520,176);ctx.fillStyle='#eadfbd';ctx.font='bold 70px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,768,96,1470);
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const geometry=new T.PlaneGeometry(38,4.75),material=new T.MeshBasicMaterial({map:texture,side:T.DoubleSide}),sign=new T.Mesh(geometry,material);sign.position.set(x,z>0?9.3:4,z);if(z>0)sign.rotation.y=Math.PI;root.add(sign);signs.push({geometry,material,texture});
 }
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();meshes.forEach(m=>m.dispose());Object.values(geometries).forEach(g=>g.dispose());material.dispose();apronGeometry.dispose();apronMaterial.dispose();signs.forEach(s=>{s.geometry.dispose();s.material.dispose();s.texture.dispose();});root.clear();}};
}
