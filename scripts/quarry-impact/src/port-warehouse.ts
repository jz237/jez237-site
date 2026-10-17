import * as T from 'three';
/** Original Saltmarsh freight depot. Decorative, behind the existing course boundary. */
export function createPortWarehouse(ground=0){
 const root=new T.Group();root.name='saltmarsh-freight-depot';
 const geometry=new T.BoxGeometry(1,1,1);geometry.computeBoundingBox();
 const colors={wall:0x708787,rib:0x98a29a,roof:0x465859,brick:0x7d5846,cream:0xddd2b4,glass:0x376373,steel:0x303b3c,yellow:0xd6a02d,wood:0x95724d,rust:0x9b4835};
 type Finish=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.25:.86,metalness:['steel','roof','wall','rib'].includes(key)?.35:0})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<Finish,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D();
 function box(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(62+x,ground+y,-158+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const list=batches.get(f)??[];list.push(dummy.matrix.clone());batches.set(f,list);bounds.push(geometry.boundingBox!.clone().applyMatrix4(dummy.matrix));}
 box('brick',0,.65,0,49,1.3,19);box('wall',0,4.6,0,48,6.6,18);
 // Ribbed cladding; repeated dark loading doors break up the broad facade.
 for(const side of [-1,1]){
  for(let x=-23.5;x<=23.5;x+=.7)box('rib',x,4.6,side*9.06,.08,6.5,.12);
  box('cream',0,7.8,side*9.15,48,.25,.18);
  for(const x of [-17,-5,7]){
   box('steel',x,3.9,side*9.17,8,5.6,.25);
   box('roof',x,3.9,side*9.34,7.2,5.1,.12);
   for(let y=1.65;y<=6.3;y+=.35)box('rib',x,y,side*9.43,7.1,.045,.07);
   for(const dx of [-4,4])box('yellow',x+dx,2.4,side*9.6,.18,2.5,.18);
   box('cream',x,7.05,side*9.25,3.2,.7,.10);
   // A three-bar bay identifier stays readable as geometry at a distance.
   for(let bar=0;bar<1+(x+17)/12;bar++)box('steel',x-.6+bar*.6,7.05,side*9.32,.18,.45,.06);
   box('steel',x,1.4,side*9.65,8,.25,.8);
  }
 }
 // Sloping roof, standing seams, rooflights, extraction cowls.
 const pitch=Math.atan2(3,9.8),slope=Math.hypot(9.8,3);
 for(const side of [-1,1]){
  box('roof',0,9.4,side*4.9,50,.28,slope,side*pitch);
  for(let x=-24;x<=24;x+=1.2)box('rib',x,9.57,side*4.9,.06,.06,slope,side*pitch);
  for(const x of [-16,0,16])box('glass',x,9.64,side*4.9,5,.10,3,side*pitch);
 }
 for(const x of [-24,24])for(let z=-8.75;z<=8.75;z+=.5){const h=3*(1-Math.abs(z)/9.8);box('wall',x,7.9+h/2,z,.18,h,.5);}
 box('cream',0,11,0,50,.22,.3);
 for(const x of [-10,10]){box('steel',x,11.4,0,1.6,1.1,1.6);box('rib',x,12.1,0,2.3,.25,2.3);}
 // Glazed dispatch office at the east end, with overhang and exterior stairs.
 box('brick',19,3.3,0,9,5.4,18);box('cream',19,6.7,0,9,1.4,18);
 for(const side of [-1,1]){
  box('glass',19,5.7,side*9.16,7.8,2.8,.12);
  for(const x of [15.2,17.1,19,20.9,22.8])box('cream',x,5.7,side*9.25,.12,2.9,.12);
  box('cream',19,5.7,side*9.25,7.8,.1,.12);
  box('steel',19,2.4,side*9.2,2.4,3,.15);box('glass',19,2.8,side*9.3,1.9,1.5,.08);
  box('yellow',19,4.2,side*9.8,4,.16,1.5);
  for(let i=0;i<3;i++)box('brick',19,.2+i*.25,side*(10.6-i*.35),3,.4+i*.5,.4);
 }
 for(const z of [-5,0,5]){box('glass',24.16,4.8,z,.12,3.5,3.5);box('cream',24.25,4.8,z,.08,3.6,.12);}
 // Shipping crates, pallet feet and steel corner straps along the west wall.
 for(const z of [-5,0,5]){
  box('wood',-25,.25,z,2.2,.4,3.5);
  box('wood',-25,1.4,z,2,1.9,3);
  for(const dy of [.7,2.1])box('rust',-26.04,dy,z,.08,.14,3);
  for(const dz of [-1.3,1.3])box('steel',-26.06,1.4,z+dz,.08,1.9,.10);
 }
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(geometry,materials[finish],matrices.length);mesh.name='port-warehouse-'+finish;matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});geometry.dispose();Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
