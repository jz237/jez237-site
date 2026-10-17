import * as T from 'three';
/** Original showground landmark, outside the oval's continuous west barrier. */
export function createWrenfordWindpump(){
 const root=new T.Group();root.name='wrenford_windpump';
 const materials={steel:new T.MeshStandardMaterial({color:0x45524b,roughness:.72,metalness:.5}),cream:new T.MeshStandardMaterial({color:0xd9cda8,roughness:.8}),rust:new T.MeshStandardMaterial({color:0x9a573b,roughness:.92}),green:new T.MeshStandardMaterial({color:0x537365,roughness:.65,metalness:.25}),rubber:new T.MeshStandardMaterial({color:0x292e29,roughness:1})};
 const shapes={box:new T.BoxGeometry(),cylinder:new T.CylinderGeometry(1,1,1,16),cone:new T.ConeGeometry(1,1,16)};
 type Finish=keyof typeof materials;type Shape=keyof typeof shapes;
 const batches=new Map<string,T.Matrix4[]>(),dummy=new T.Object3D();
 function part(shape:Shape,finish:Finish,x:number,y:number,z:number,sx:number,sy:number,sz:number,rx=0,ry=0,rz=0){dummy.position.set(x,y,z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(sx,sy,sz);dummy.updateMatrix();const key=shape+':'+finish,rows=batches.get(key)??[];rows.push(dummy.matrix.clone());batches.set(key,rows);}
 function beam(finish:Finish,a:T.Vector3,b:T.Vector3,width:number){dummy.position.copy(a).add(b).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());dummy.scale.set(width,a.distanceTo(b),width);dummy.updateMatrix();const key='box:'+finish,rows=batches.get(key)??[];rows.push(dummy.matrix.clone());batches.set(key,rows);}
 const x=-145,z=0,height=19;
 // Tapering lattice legs, crossed bracing and concrete-colored footings.
 for(const sx of [-1,1])for(const sz of [-1,1]){
  beam('steel',new T.Vector3(x+sx*3,0,z+sz*3),new T.Vector3(x+sx*.8,height,z+sz*.8),.24);
  part('box','cream',x+sx*3,.25,z+sz*3,1.4,.5,1.4);
 }
 for(let tier=0;tier<4;tier++)for(const side of [-1,1]){
  const y=tier*4.5+.6,y2=y+4.5,r=3-y/height*2.2,r2=3-y2/height*2.2;
  for(const flip of [-1,1]){
   beam('rust',new T.Vector3(x+flip*r,y,side*r),new T.Vector3(x-flip*r2,y2,side*r2),.12);
   beam('steel',new T.Vector3(x+side*r,y,flip*r),new T.Vector3(x+side*r2,y2,-flip*r2),.12);
  }
 }
 // Ladder, service platform, guardrail and central pump rod.
 for(const side of [-1,1])part('box','steel',x+side*.42,9.3,3.2,.075,18.6,.075);
 for(let y=.5;y<18.7;y+=.45)part('box','cream',x,y,3.2,.9,.055,.08);
 part('box','steel',x,18.6,0,3.6,.18,3.6);
 for(const sx of [-1,1])for(const sz of [-1,1])part('box','cream',x+sx*1.7,19.1,sz*1.7,.08,1,.08);
 for(const side of [-1,1]){part('box','cream',x,19.6,side*1.7,3.5,.08,.08);part('box','cream',x+side*1.7,19.6,0,.08,.08,3.5);}
 part('cylinder','rust',x,9.2,0,.09,18.4,.09);
 part('box','green',x,20.5,0,1.4,1.2,2.5);
 // Rotor faces along the long straight. Slow rotation provides motion without strobing.
 const hub=new T.Vector3(x,21,1.5);
 part('cylinder','steel',hub.x,hub.y,hub.z,.48,.6,.48,Math.PI/2);
 const rotor=new T.InstancedMesh(shapes.box,materials.cream,24);rotor.name='wrenford_windpump_rotor';rotor.castShadow=true;rotor.frustumCulled=false;root.add(rotor);
 function update(time:number){
  for(let i=0;i<12;i++){
   const a=i*Math.PI/6+time*.15;
   dummy.position.set(x+Math.sin(a)*3.55,21+Math.cos(a)*3.55,1.5);dummy.rotation.set(0,.14,-a);dummy.scale.set(.86,2.5,.10);dummy.updateMatrix();rotor.setMatrixAt(i,dummy.matrix);
   dummy.position.set(x+Math.sin(a)*1.4,21+Math.cos(a)*1.4,1.5);dummy.rotation.set(0,0,-a);dummy.scale.set(.065,2.8,.09);dummy.updateMatrix();rotor.setMatrixAt(i+12,dummy.matrix);
  }
  rotor.instanceMatrix.needsUpdate=true;
 }
 // Riveted storage tank, pipework and a fenced maintenance plot.
 const tx=-156,tz=12;part('cylinder','green',tx,4.5,tz,4,8,4);part('cone','steel',tx,9,tz,4.3,1,4.3);
 for(let y=1;y<=8;y+=1.4)part('cylinder','rust',tx,y,tz,4.04,.09,4.04);
 for(let i=0;i<20;i++){const a=i*Math.PI/10;for(const y of [1,4,7])part('box','cream',tx+Math.sin(a)*4.03,y,tz+Math.cos(a)*4.03,.08,.08,.08);}
 beam('steel',new T.Vector3(x,1,0),new T.Vector3(tx,1,tz),.2);part('cylinder','rust',tx,1.2,tz-4.2,.65,.18,.65,Math.PI/2);
 for(const side of [-1,1])for(let i=0;i<7;i++){const px=-165+i*6,pz=side<0?-9:24;part('box','rust',px,1,pz,.12,2,.12);if(i<6)for(const y of [.6,1.4])part('box','steel',px+3,y,pz,6,.06,.06);}
 const signMaterial=new T.MeshStandardMaterial({color:0xeee0b5,roughness:.85,side:T.DoubleSide}),signGeometry=new T.PlaneGeometry(8,3);let texture:T.CanvasTexture|undefined;
 if(typeof document!=='undefined'){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=384;const ctx=canvas.getContext('2d');if(ctx){ctx.fillStyle='#263e33';ctx.fillRect(0,0,1024,384);ctx.strokeStyle='#c6a466';ctx.lineWidth=14;ctx.strokeRect(12,12,1000,360);ctx.fillStyle='#f0dfb4';ctx.textAlign='center';ctx.font='bold 78px sans-serif';ctx.fillText('DENT HARVEST',512,125);ctx.font='35px sans-serif';ctx.fillText('FARM-FRESH BODY DAMAGE',512,215);ctx.fillText('NO REFUNDS. NO STRAIGHT PANELS.',512,290);texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;signMaterial.map=texture;}}
 const sign=new T.Mesh(signGeometry,signMaterial);sign.name='wrenford_dent_harvest_sign';sign.position.set(-130,4,0);sign.rotation.y=Math.PI/2;root.add(sign);
 for(const dz of [-3,3])part('box','rust',-130,2,dz,.16,4,.16);
 for(const [key,rows]of batches){const [shape,finish]=key.split(':')as [Shape,Finish];const mesh=new T.InstancedMesh(shapes[shape],materials[finish],rows.length);mesh.name='wrenford_windpump_'+key;rows.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 update(0);let disposed=false;
 return{root,update,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(shapes).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());signGeometry.dispose();signMaterial.dispose();texture?.dispose();root.clear();}};
}
