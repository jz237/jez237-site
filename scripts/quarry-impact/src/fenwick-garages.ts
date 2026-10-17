import * as T from 'three';
/** Metre-scale sheet metal on purpose-built geometry, separate from spectator timber. */
export function createFenwickGarages(){
 const root=new T.Group();root.name='fenwick_garages';const textures:T.Texture[]=[];
 const map=(file:string,color=false)=>{const t=typeof document==='undefined'?new T.DataTexture(new Uint8Array([128,128,255,255]),1,1):new T.TextureLoader().load((import.meta.env?.BASE_URL??'./')+'assets/'+file+'.jpg');t.name=file;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;if(color)t.colorSpace=T.SRGBColorSpace;textures.push(t);return t;};
 const wallMaterial=new T.MeshStandardMaterial({color:0xc2c5ac,map:map('cladding_diff',true),normalMap:map('cladding_nor_gl'),roughnessMap:map('cladding_arm'),roughness:.95,metalness:.2});wallMaterial.normalScale.setScalar(.45);
 const roofMaterial=new T.MeshStandardMaterial({color:0x869486,map:map('workyard/rusty_painted_metal-diff',true),normalMap:map('workyard/rusty_painted_metal-normal'),roughnessMap:map('workyard/rusty_painted_metal-arm'),roughness:.94,metalness:.25});roofMaterial.normalScale.setScalar(.28);
 const trimMaterial=new T.MeshStandardMaterial({color:0x667568,roughness:.85,metalness:.2});
 function sheet(w:number,h:number,d:number){const g=new T.BoxGeometry(w,h,d),p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);uv.setXY(i,(Math.abs(n.getX(i))>.5?z:x)/2.7,(Math.abs(n.getY(i))>.5?z:y)/2.7);}return g;}
 const slope=Math.atan2(1.3,10),geometry={wall:sheet(42,5.85,18),roof:sheet(44,.18,Math.hypot(10,1.3)),trim:new T.BoxGeometry()};
 const gable=new T.BufferGeometry(),points:number[]=[],gableUV:number[]=[];
 for(const side of [-1,1])for(const [y,z]of (side<0?[[5.85,-9],[5.85,9],[7,0]]:[[5.85,-9],[7,0],[5.85,9]])){points.push(side*21,y,z);gableUV.push(z/2.7,y/2.7);}
 gable.setAttribute('position',new T.Float32BufferAttribute(points,3));gable.setAttribute('uv',new T.Float32BufferAttribute(gableUV,2));gable.computeVertexNormals();
 const ends=new T.InstancedMesh(gable,wallMaterial,4);ends.name='fenwick_garage_gables';
 const walls=new T.InstancedMesh(geometry.wall,wallMaterial,4),roofs=new T.InstancedMesh(geometry.roof,roofMaterial,8),trimRows:T.Matrix4[]=[],object=new T.Object3D();
 walls.name='fenwick_garage_cladding';roofs.name='fenwick_garage_roofs';
 const trim=(x:number,y:number,z:number,w:number,h:number,d:number)=>{object.position.set(x,y,z);object.rotation.set(0,0,0);object.scale.set(w,h,d);object.updateMatrix();trimRows.push(object.matrix.clone());};
 for(const [i,x]of [-120,-40,40,120].entries()){
  object.position.set(x,2.925,140);object.rotation.set(0,0,0);object.scale.setScalar(1);object.updateMatrix();walls.setMatrixAt(i,object.matrix);walls.setColorAt(i,new T.Color([0xc4b39a,0x9aaba7,0xb6ba9d,0xa5adb0][i]));
  object.position.set(x,0,140);object.updateMatrix();ends.setMatrixAt(i,object.matrix);ends.setColorAt(i,new T.Color([0xc4b39a,0x9aaba7,0xb6ba9d,0xa5adb0][i]));
  for(const [side,z]of [135,145].entries()){object.position.set(x,6.45,z);object.rotation.set(side===0?-slope:slope,0,0);object.updateMatrix();roofs.setMatrixAt(i*2+side,object.matrix);}
  trim(x,7.13,140,44.2,.16,.28);
  for(const z of [129.9,150.1]){trim(x,5.76,z,44.3,.2,.24);for(const dx of [-20,20])trim(x+dx,2.85,z,.14,5.7,.16);}
  for(const dx of [-20.9,20.9])trim(x+dx,2.8,130.92,.16,5.6,.18);
  for(const dx of [-12,0,12]){trim(x+dx,4.15,130.72,8.5,.22,.28);for(const sign of [-1,1])trim(x+dx+sign*4.1,2.0,130.72,.18,4,.28);}
 }
 const trims=new T.InstancedMesh(geometry.trim,trimMaterial,trimRows.length);trims.name='fenwick_garage_trim';trimRows.forEach((m,i)=>trims.setMatrixAt(i,m));
 const meshes=[walls,roofs,trims,ends];meshes.forEach(m=>{m.computeBoundingSphere();m.castShadow=m.receiveShadow=true;root.add(m);});
 let disposed=false;return{root,textures,dispose(){if(disposed)return;disposed=true;root.removeFromParent();meshes.forEach(m=>m.dispose());gable.dispose();Object.values(geometry).forEach(g=>g.dispose());[wallMaterial,roofMaterial,trimMaterial,...textures].forEach(r=>r.dispose());root.clear();}};
}
