import * as T from 'three';
/** An original canal-side industrial mill, outside the racing corridor. */
export function createMillbrookMill(){
 const root=new T.Group();root.name='millbrook-brick-mill';const geo={box:new T.BoxGeometry(1,1,1),ring:new T.TorusGeometry(.5,.015,6,40),cylinder:new T.CylinderGeometry(.5,.5,1,12)};
 const colors={brick:0x955e48,mortar:0x66584b,stone:0xc0b394,roof:0x475351,glass:0x344d51,wood:0x69513b,metal:0x394541};type F=keyof typeof colors;type S=keyof typeof geo;
 const mats=Object.fromEntries(Object.entries(colors).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:k==='glass'?.3:.93})])) as Record<F,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),dummy=new T.Object3D(),bounds:T.Box3[]=[],extras:T.Mesh[]=[];let wheelActive=false;const wheelBounds=new T.Box3();
 function add(shape:S,f:F,m:T.Matrix4){const k=shape+':'+f,list=batches.get(k)??[];list.push(m.clone());batches.set(k,list);geo[shape].computeBoundingBox();const b=geo[shape].boundingBox!.clone().applyMatrix4(m);bounds.push(b);if(wheelActive)wheelBounds.union(b);}
 function part(shape:S,f:F,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(x,y,z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();add(shape,f,dummy.matrix);}
 const box=(f:F,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0)=>part('box',f,x,y,z,w,h,d,rx,ry,rz);
 function beam(f:F,a:number[],b:number[],width=.18){const p=new T.Vector3(...a as[number,number,number]),q=new T.Vector3(...b as[number,number,number]),v=q.clone().sub(p);dummy.position.copy(p.add(q).multiplyScalar(.5));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize());dummy.scale.set(width,v.length(),width);dummy.updateMatrix();add('box',f,dummy.matrix);}
 box('stone',0,.45,26,50,.9,24);box('brick',0,7.5,26,48,14,22);
 for(const y of [1,5.3,10.1,14.4])box('stone',0,y,26,49,.25,22.5);
 // Masonry joints retain readable block sizes from the infield view.
 for(let y=1.3;y<14.3;y+=.65){box('mortar',0,y,14.96,47.8,.035,.04);for(let x=-23+(Math.round(y/.65)%2)*1.5;x<24;x+=3)box('mortar',x,y-.31,14.95,.035,.6,.04);}
 for(const x of [-20,-12,-4,4,12,20])for(const y of [3.2,7.8,12.3]){
  box('stone',x,y,14.85,3.8,3.3,.28);box('glass',x,y,14.66,3.2,2.7,.08);box('stone',x,y,14.58,.12,2.8,.12);box('stone',x,y,14.57,3.3,.12,.12);box('stone',x,y-1.8,14.7,4.2,.25,.7);
 }
 for(const side of [-1,1]){box('roof',0,16.8,26+side*5.8,51,.32,12.7,side*.4);for(let x=-24;x<=24;x+=2)box('metal',x,16.97,26+side*5.8,.06,.07,12.7,side*.4);}
 box('stone',0,19.25,26,51,.3,.4);
 const gp:number[]=[];for(const x of [-24.02,24.02])for(const p of [[x,14.5,15],[x,19.2,26],[x,14.5,37]])gp.push(...p);
 const gg=new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(gp,3));gg.computeVertexNormals();const gm=mats.brick.clone();gm.side=T.DoubleSide;const gables=new T.Mesh(gg,gm);gables.castShadow=gables.receiveShadow=true;root.add(gables);extras.push(gables);
 // Lower wheelhouse connects to the north bank without blocking the lock channel.
 box('stone',-26,.4,12,12,.8,14);box('brick',-26,3.5,12,10,6.5,13);box('roof',-26,7.1,12,12,.35,15);
 box('wood',-26,2.7,5.4,5.6,4.6,.2);for(const x of [-28,-26,-24])box('metal',x,2.7,5.22,.09,4.4,.12);
 // The wheel occupies the canal, with the axle entering the bank-side wheelhouse.
 const wx=-27,wy=5.5,wz=2.8;wheelActive=true;
 for(const z of [wz-1.3,wz+1.3]){
  part('ring','wood',wx,wy,z,12,12,12);part('ring','metal',wx,wy,z,10.7,10.7,10.7);
  for(let i=0;i<12;i++){const a=i*Math.PI/6;beam('wood',[wx,wy,z],[wx+Math.cos(a)*5.9,wy+Math.sin(a)*5.9,z],.23);}
 }
 for(let i=0;i<24;i++){const a=i*Math.PI/12;box('wood',wx+Math.cos(a)*5.9,wy+Math.sin(a)*5.9,wz,1.3,.3,3.1,0,0,a+Math.PI/2);}
 wheelActive=false;part('cylinder','metal',wx,wy,5,.6,7,.6,Math.PI/2);
 // Tall banded chimney and iron tie rods complete the industrial silhouette.
 part('cylinder','brick',19,15,32,4,30,4);for(const y of [2,8,14,20,26,30])part('ring','stone',19,y,32,4.2,4.2,4.2,Math.PI/2);part('cylinder','stone',19,30.4,32,4.7,.8,4.7);part('cylinder','metal',19,30.84,32,3.2,.08,3.2);
 for(const x of [-22,22])for(const y of [6,11]){box('metal',x,y,14.65,1.3,.13,.12,0,0,.65);box('metal',x,y,14.64,1.3,.13,.12,0,0,-.65);}
 // Hoist, covered loading platform and crates face the waterside paddock.
 box('stone',10,.5,10,22,1,8);for(const x of [1,19])box('metal',x,4.6,7,.25,8,.25);box('roof',10,8.6,10,23,.3,9);
 box('metal',10,11,11,.25,5,.25);box('metal',10,13.5,8,.25,.3,6);box('metal',10,10.7,5.2,.08,5,.08);part('ring','metal',10,8.2,5.2,.9,.9,.9);
 for(const[x,z]of [[3,8],[6,8],[16,10],[18,11]]){box('wood',x,1.6,z,2.5,2.2,2.5);for(const dy of [-.7,.7])box('metal',x,1.6+dy,z,2.55,.12,2.55);}
 if(typeof document!=='undefined'){const c=document.createElement('canvas');c.width=1536;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle='#c6b99a';ctx.fillRect(0,0,1536,256);ctx.fillStyle='#354540';ctx.textAlign='center';ctx.font='900 90px sans-serif';ctx.fillText('MILLBROOK MOTOR MILL',768,112);ctx.font='bold 42px sans-serif';ctx.fillText('FINE GRAIN. COARSE DRIVING.',768,202);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(30,4),new T.MeshStandardMaterial({map:t,roughness:.9}));m.position.set(0,16,14.4);m.rotation.y=Math.PI;root.add(m);extras.push(m);}
 for(const[key,ms]of batches){const[shape,f]=key.split(':')as[S,F];const mesh=new T.InstancedMesh(geo[shape],mats[f],ms.length);ms.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.wheelBounds=wheelBounds;root.userData.bounds=bounds;root.userData.pieces=bounds.length;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geo).forEach(g=>g.dispose());Object.values(mats).forEach(m=>m.dispose());extras.forEach(m=>{m.geometry.dispose();const mat=m.material as T.MeshStandardMaterial;mat.map?.dispose();mat.dispose();});root.clear();}};
}
