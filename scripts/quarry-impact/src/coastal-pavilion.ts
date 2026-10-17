import * as T from 'three';
/** Original coastal motor-club pavilion, centered on the Seabrook service building. */
export function createCoastalPavilion(ground=0){
 const root=new T.Group();root.name='seabrook-club-pavilion';
 const geometries={box:new T.BoxGeometry(1,1,1)};
 const colors={stone:0x9d9c8e,white:0xe2dfc8,trim:0xc6c5b5,teal:0x347987,glass:0x527887,roof:0x678c82,wood:0x9a8464,metal:0x394a4b,ochre:0xd29e4b,leaf:0x5e7951};
 type Shape=keyof typeof geometries;type Finish=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.3:.9,metalness:key==='metal'?.4:0})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D();
 function part(shape:Shape,f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(52+x,ground+y,-158+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=shape+':'+f,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);const g=geometries[shape];g.computeBoundingBox();bounds.push(g.boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0)=>part('box',f,x,y,z,w,h,d,rx,ry,rz);
 box('stone',0,.4,0,49,.8,18);
 // Cream weatherboard wings and a taller central race-control hall.
 for(const x of [-16,16]){
  box('white',x,3.3,0,15,5.8,15);box('white',x,6.8,-1,13,1.2,12);
  for(const side of [-1,1])for(let y=1;y<6.2;y+=.34)box('trim',x,y,side*7.55,15,.055,.12);
  for(const dx of [-5,0,5])for(const side of [-1,1]){
   box('teal',x+dx,3.25,side*7.65,3.3,3.7,.16);box('glass',x+dx,3.25,side*7.76,2.9,3.3,.08);
   box('white',x+dx,3.25,side*7.83,.10,3.4,.07);box('white',x+dx,3.25,side*7.83,3,.10,.07);
  }
  // Long open upper viewing decks with balustrades.
  box('wood',x,6.35,7.75,15,.22,3.5);
  for(let dx=-7;dx<=7;dx+=.7)box('teal',x+dx,6.95,9.4,.075,1.15,.075);
  for(const y of [6.45,7.55])box('white',x,y,9.4,15,.12,.12);
  for(const dx of [-7,7])box('white',x+dx,6.95,7.75,.12,1.2,3.3);
  // Alternating fabric panels form an immediately readable seaside canopy.
  for(let dx=-7;dx<=7;dx+=1)box(dx%2?'white':'teal',x+dx,4.95,8.4,.97,.12,2.8,.16);
  for(const dx of [-7,0,7])box('teal',x+dx,2.65,9.6,.12,4.5,.12);
  box('teal',x,4.69,9.72,15,.28,.08);
  for(const side of [-1,1]){
   const pitch=Math.atan2(2.4,7.7),len=Math.hypot(7.7,2.4)+.6;
   box('roof',x,7.6,side*3.85,16,.22,len,side*pitch);
   for(let dx=-7.6;dx<=7.6;dx+=.8)box('metal',x+dx,7.73,side*3.85,.045,.045,len,side*pitch);
  }
  box('white',x,8.9,0,16,.15,.25);
 }
 box('white',0,4.55,0,16,8.3,16);
 for(const side of [-1,1]){
  box('teal',0,5.6,side*8.08,14,4.6,.16);box('glass',0,5.6,side*8.19,13.6,4.2,.08);
  for(let x=-6.8;x<=6.8;x+=1.7)box('white',x,5.6,side*8.27,.12,4.4,.08);
  for(const y of [3.5,5.6,7.7])box('white',0,y,side*8.28,13.8,.12,.08);
  for(const x of [-7.5,7.5])box('teal',x,4.6,side*8.18,.3,8,.3);
  box('teal',0,2.0,side*8.13,4.4,2.6,.18);
  for(const x of [-1,1]){box('glass',x,2.0,side*8.25,1.85,2.3,.08);box('white',x*.17,2.0,side*8.32,.08,2.4,.07);box('metal',x*.3,1.9,side*8.39,.08,.45,.08);}
  box('wood',0,.9,side*8.65,15,.25,1.2);
  for(let step=0;step<3;step++)box('stone',0,.15+step*.22,side*(9.8-step*.4),7,.3+step*.44,.45);
 }
 box('roof',0,8.85,0,17,.35,17);
 // Square clock tower: four visible dials, louvres and a stepped copper cap.
 box('white',0,10.7,0,5,3.7,5);box('teal',0,12.6,0,5.5,.24,5.5);
 for(const side of [-1,1]){
  box('teal',0,11,side*2.54,2.8,2.8,.12);box('white',0,11,side*2.62,2.55,2.55,.08);
  box('metal',0,11.35,side*2.69,.10,.85,.06);box('metal',.37,11,side*2.69,.85,.10,.06);
  for(const y of [-.95,.95])box('metal',0,11+y,side*2.69,.10,.22,.06);
  for(const x of [-.95,.95])box('metal',x,11,side*2.69,.22,.10,.06);
  box('teal',side*2.54,11,0,.12,2.8,2.8);box('white',side*2.62,11,0,.08,2.55,2.55);
  box('metal',side*2.69,11.35,0,.06,.85,.10);box('metal',side*2.69,11,.37,.06,.10,.85);
  for(let y=9.25;y<9.85;y+=.16)box('teal',0,y,side*2.57,3,.08,.12);
 }
 for(let tier=0;tier<5;tier++)box('roof',0,12.9+tier*.28,0,5.8-tier*.85,.32,5.8-tier*.85);
 box('metal',0,15,0,.10,2,.10);box('ochre',.55,15.7,0,1.1,.5,.06);
 // Boardwalk plank joints, parked benches and low planters beside the entrance.
 for(let x=-24;x<=24;x+=.5)box('wood',x,.87,10,.43,.10,1.6);
 for(const x of [-18,-11,11,18]){box('wood',x,1.55,10,3,.14,.6);box('wood',x,1.95,10.3,3,.7,.10);for(const dx of [-1,1])box('metal',x+dx,1.2,10,.10,.7,.5);}
 for(const x of [-24,24]){box('teal',x,1.1,8,1,.8,3);box('leaf',x,1.65,8,.95,.5,2.85);}
 for(const [key,matrices]of batches){const [shape,finish]=key.split(':') as [Shape,Finish];const mesh=new T.InstancedMesh(geometries[shape],materials[finish],matrices.length);mesh.name='coastal-pavilion-'+key;matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
