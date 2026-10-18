import * as T from 'three';
/** Original Copperfield race control: stacked site cabins, a weighbridge with a
 * parked dumper, block-walled aggregate bays and a lighting tower. Decorative only. */
export function createCopperfieldSiteOffice(ground=0){
 const root=new T.Group();root.name='copperfield-site-office';
 const pile=new T.SphereGeometry(.5,14,8,0,Math.PI*2,0,Math.PI/2);
 const geometries={box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(.5,.5,1,12),pile};
 const colors={cabin:0x5d7c63,cabin2:0xd2a43a,trim:0xe7e2d3,glass:0x46646f,steel:0x3b4145,deck:0x6f7377,block:0xa7a397,sand:0xc9a86a,gravel:0x8f877a,red:0xb7432f,white:0xf0ece2,rubber:0x1c1c1c,lamp:0xfff2cf,shadow:0x3d3b37};
 type Shape=keyof typeof geometries;type Finish=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.22:key==='steel'||key==='deck'?.55:.9,metalness:key==='steel'||key==='deck'?.45:key==='glass'?.12:0,...(key==='lamp'?{emissive:color,emissiveIntensity:1.6}:{})})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D();
 for(const g of Object.values(geometries))g.computeBoundingBox();
 function part(shape:Shape,f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(70+x,ground+y,-158+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=shape+':'+f,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);bounds.push(geometries[shape].boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0)=>part('box',f,x,y,z,w,h,d,rx,ry,rz);
 const round=(f:Finish,x:number,y:number,z:number,r:number,h:number,rx=0,rz=0)=>part('round',f,x,y,z,r*2,h,r*2,rx,0,rz);
 // A site cabin: ribbed walls, window strip facing the course, door, skids.
 function cabin(f:Finish,x:number,y:number,z:number,door:boolean){
  box(f,x,y+1.45,z,9.6,2.7,3);box('steel',x,y+.08,z,9.8,.16,3.1);box('steel',x,y+2.86,z,9.8,.14,3.1);
  for(let dx=-4.6;dx<=4.6;dx+=.6)for(const side of [-1,1])box(f,x+dx,y+1.45,z+side*1.53,.1,2.5,.06);
  for(const dx of door?[-2.6,.2]:[-2.6,0,2.6]){box('trim',dx+x,y+1.75,z+1.56,2.1,1.1,.08);box('glass',dx+x,y+1.75,z+1.6,1.85,.9,.05);}
  if(door){box('trim',x+3,y+1.2,z+1.56,1,2.1,.08);box('steel',x+3,y+1.2,z+1.6,.85,1.95,.05);}
  for(const side of [-1,1])box('steel',x+side*4.95,y+1.45,z,.12,2.7,.12);
 }
 // Two cabins below, one turned yellow above, with a railed viewing roof.
 const cz=-3.5;cabin('cabin',-9.8,0,cz,true);cabin('cabin',0,0,cz,false);cabin('cabin2',-4.9,3,cz,true);
 box('deck',-4.9,6.05,cz,9.8,.1,3.2);for(let x=-9.6;x<=-.2;x+=.6)for(const side of [-1,1])box('steel',x,6.6,cz+side*1.55,.05,1,.05);
 for(const x of [-9.75,-.05])box('steel',x,6.6,cz,.05,1,3.1);for(const side of [-1,1])box('steel',-4.9,7.1,cz+side*1.55,9.8,.06,.06);
 // Steel stair and landing to the upper cabin.
 box('deck',2.3,2.95,cz+2.4,4.2,.12,1.6);for(const dx of [.3,4.3])box('steel',dx,1.5,cz+3.15,.1,3,.1);
 for(let s=0;s<8;s++)box('deck',5.2+s*.5,2.65-s*.37,cz+2.4,.45,.08,1.2);for(const side of [-1,1])box('steel',7,1.9,cz+2.4+side*.62,4.4,.06,.06,0,0,-Math.atan2(2.8,4));
 // Race-control sign board on the roof rail; windsock mast.
 box('white',-4.9,7.85,cz+1.6,8.6,1.3,.1);box('red',-4.9,8.55,cz+1.62,8.6,.18,.06);box('red',-4.9,7.15,cz+1.62,8.6,.18,.06);
 for(let i=0;i<6;i++)box(i%2?'white':'red',-8+i*1.25,7.85,cz+1.66,.9,.55,.04);
 round('steel',-11.8,4.5,cz-.6,.06,9);for(let i=0;i<4;i++)part('round',i%2?'white':'red',-11.8+.35+i*.62,8.7-i*.05,cz-.6,.42-i*.06,.6,.42-i*.06,0,0,Math.PI/2);
 // Weighbridge: steel deck with ramps, kerb rails and a scale hut; a dumper sits on it.
 box('block',2,.12,5,16,.24,4);box('deck',2,.3,5,14,.12,3.4);for(let x=-5;x<=9;x+=1.75)box('steel',x,.37,5,.06,.02,3.4);
 for(const side of [-1,1])box('steel',2,.6,5+side*1.75,14,.1,.1);for(const x of [-6,10])box('block',x,.15,5,2,.3,3.4,0,0,x<0?.12:-.12);
 box('cabin2',12.6,1.3,1.8,2.4,2.4,2.2);box('glass',12.6,1.6,2.92,1.6,.8,.05);box('steel',12.6,2.6,1.8,2.7,.12,2.5);
 // Articulated dumper: front cab unit, pivot, tipping body, oversized tyres.
 const dx=1;box('cabin2',dx-3.4,1.6,5,2.4,1.4,2.2);box('glass',dx-3.6,2.7,5,1.6,1.1,1.9);box('steel',dx-3.6,3.3,5,1.8,.1,2.1);
 box('steel',dx-1.6,1.2,5,1.2,.5,.8);box('cabin2',dx+1.6,2.3,5,4.6,1.6,2.6,0,0,-.08);box('cabin2',dx+3.9,2.6,5,.15,1.8,2.6);
 part('pile','sand',dx+1.6,3.05,5,3.8,.9,2.1);
 for(const x of [dx-3.2,dx+.4,dx+2.6])for(const side of [-1,1])round('rubber',x,.75,5+side*1.35,.72,.6,Math.PI/2);
 // Concrete-block aggregate bays with heaps of sand and gravel.
 for(const wx of [-16.5,-12.5,-8.5])for(let row=0;row<3;row++)for(let k=0;k<4;k++)box('block',wx,.4+row*.8,2.2+k*1.6+(row%2)*.4,.8,.78,1.58);
 for(let row=0;row<3;row++)for(let k=0;k<5;k++)box('block',-14.5+k*1.6-(row%2)*.4,.4+row*.8,1.4,1.58,.78,.8);
 part('pile','sand',-14.5,0,4.6,3.6,3.1,4.6);part('pile','gravel',-10.5,0,4.4,3.4,3.3,4.2);
 for(const [x,z]of [[-5.5,6.6],[-6.6,7.1]])part('pile','gravel',x,0,z,1.4,.6,1.2);
 // Mobile lighting tower on a trailer.
 box('cabin2',15,.75,-4.5,2.6,1,1.4);for(const side of [-1,1])round('rubber',15,.35,-4.5+side*.8,.35,.25,Math.PI/2);
 round('steel',15,5,-4.5,.09,8.5);box('steel',15,9.2,-4.5,2.4,.12,.12);
 for(const dx of [-.9,-.3,.3,.9]){box('steel',15+dx,9.45,-4.3,.5,.4,.25,-.35,0,0);box('lamp',15+dx,9.45,-4.15,.42,.32,.05,-.35,0,0);}
 // Hazard-striped barrier planks and a site sign at the apron.
 for(let i=0;i<5;i++){box(i%2?'white':'red',-1.5+i*1.3,.7,8.2,1.3,.25,.12);}for(const x of [-2.2,4.3])box('steel',x,.45,8.2,.08,.9,.08);
 for(const [key,matrices]of batches){const [shape,finish]=key.split(':')as [Shape,Finish];const mesh=new T.InstancedMesh(geometries[shape],materials[finish],matrices.length);mesh.name='copperfield-office-'+key.replace(':','-');matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
