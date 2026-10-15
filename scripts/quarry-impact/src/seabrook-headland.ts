import * as T from 'three';
/** Seabrook keeper compound; original coastal architecture. */
export function createSeabrookCompound(){
 const root=new T.Group();root.name='seabrook-keepers-compound';
 const geometry=new T.BoxGeometry(1,1,1),colors={plaster:0xe1d5b6,stone:0x8a8c82,roof:0x586876,trim:0xeee3c6,door:0x37616b,glass:0x42616c,wood:0x81735a,metal:0x424e52};
 type F=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:k==='glass'?.3:.9})])) as Record<F,T.MeshStandardMaterial>;
 const batches=new Map<F,T.Matrix4[]>(),dummy=new T.Object3D(),bounds:T.Box3[]=[];
 geometry.computeBoundingBox();
 function box(f:F,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0){dummy.position.set(x-15,y,z);dummy.rotation.set(rx,ry,0);dummy.scale.set(w,h,d);dummy.updateMatrix();const b=batches.get(f)??[];b.push(dummy.matrix.clone());batches.set(f,b);bounds.push(geometry.boundingBox!.clone().applyMatrix4(dummy.matrix));}
 // Raised masonry terrace and approach, with open pedestrian gates.
 box('stone',215,-.15,110,36,.8,38);box('stone',215,.4,110,35,.3,37);
 for(const x of [198,232]){box('stone',x,1.15,110,.65,1.2,37);for(let z=92;z<=128;z+=3)box('trim',x,1.85,z,.8,.22,2.9);}
 for(const z of [92,128])for(const x of [203,227]){box('stone',x,1.15,z,10,1.2,.65);box('trim',x,1.85,z,10.3,.22,.8);}
 for(let i=0;i<4;i++)box('stone',215,.05+i*.15,89+i*.7,7,.2,.75);
 function cottage(cx:number,cz:number,w:number,d:number,h:number){
  box('plaster',cx,.55+h/2,cz,w,h,d);box('stone',cx,.85,cz,w+.15,.6,d+.15);
  const pitch=.52,run=d/2+.7,slant=run/Math.cos(pitch);
  for(const side of [-1,1])box('roof',cx,.55+h+Math.sin(pitch)*slant/2,cz+side*run/2,w+1.3,.24,slant,side*pitch);
  box('roof',cx,.55+h+Math.sin(pitch)*slant,cz,w+1.4,.25,.3);
  // Gable infill follows the pitched roof, rather than an empty triangular hole.
  for(let i=0;i<12;i++){const width=d*(1-i/12);box('plaster',cx,.55+h+(i+.5)*Math.tan(pitch)*d/24,cz,w-.05,Math.tan(pitch)*d/24,width);}
  box('stone',cx+w*.28,h+1.8,cz+1,1,3,1);box('trim',cx+w*.28,h+3.35,cz+1,1.3,.25,1.3);
  for(const side of [-1,1])for(const dx of [-w*.3,w*.3]){const z=cz+side*(d/2+.05);box('trim',cx+dx,3.15,z,2.1,2.5,.15);box('glass',cx+dx,3.15,z+side*.09,1.75,2.15,.08);box('trim',cx+dx,3.15,z+side*.15,.1,2.2,.1);box('trim',cx+dx,3.15,z+side*.15,1.8,.1,.1);box('stone',cx+dx,1.85,z,2.4,.2,.4);}
  box('trim',cx,2,cz-d/2-.1,1.9,3,.2);box('door',cx,1.95,cz-d/2-.22,1.6,2.8,.1);box('metal',cx+.55,1.9,cz-d/2-.3,.12,.12,.1);
  for(let i=0;i<3;i++)box('stone',cx,.55+i*.14,cz-d/2-1.2+i*.35,2.8,.15,.45);
 }
 cottage(216,111,22,10,5.5);cottage(224,122,10,6,3.7);
 // Courtyard benches, bollards and stacked harbour crates.
 for(const x of [202,227]){box('wood',x,1.25,98,4,.2,1);box('wood',x,1.9,98.5,4,1,.15);for(const dx of [-1.4,1.4])box('metal',x+dx,.85,98,.16,.8,.8);}
 for(const x of [210,220])box('metal',x,1.4,94,.22,1.8,.22);
 for(let i=0;i<7;i++){const x=201+(i%3)*1.4,z=119+Math.floor(i/3)*1.4;box('wood',x,1.1,z,1.2,1.1,1.2);for(const dz of [-.61,.61])for(const dy of [-.35,.35])box('metal',x,1.1+dy,z+dz,1.25,.08,.06);}
 for(const[f,ms]of batches){const mesh=new T.InstancedMesh(geometry,materials[f],ms.length);ms.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;root.userData.pieces=bounds.length;let disposed=false;
 return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});geometry.dispose();Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
