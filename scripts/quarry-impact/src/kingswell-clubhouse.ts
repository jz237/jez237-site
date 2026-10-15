import * as T from 'three';
/** Original motor-club folly behind Kingswell's grid paddock. */
export function createKingswellClubhouse(){
 const root=new T.Group();root.name='kingswell-clubhouse';
 const geometry=new T.BoxGeometry(1,1,1),palette={stone:0xa59a7e,trim:0xd4c8a4,roof:0x45585b,glass:0x344a4f,wood:0x594b38,red:0x914838,metal:0x394844};type F=keyof typeof palette;
 const materials=Object.fromEntries(Object.entries(palette).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:k==='glass'?.3:.9})])) as Record<F,T.MeshStandardMaterial>;
 const batches=new Map<F,T.Matrix4[]>(),dummy=new T.Object3D(),bounds:T.Box3[]=[];
 const ox=0,oz=-211,base=5;
 function box(f:F,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(ox+x,base+y,oz+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const list=batches.get(f)??[];list.push(dummy.matrix.clone());batches.set(f,list);bounds.push(new T.Box3(new T.Vector3(-.5,-.5,-.5),new T.Vector3(.5,.5,.5)).applyMatrix4(dummy.matrix));}
 // Deep foundation can meet the existing landscaped bank without a floating edge.
 box('stone',0,-2,0,62,4,24);box('trim',0,.15,0,63,.3,25);
 for(const side of [-1,1]){
  const x=side*19;box('stone',x,5.2,0,24,10.4,20);box('trim',x,.5,0,24.6,.6,20.6);box('trim',x,5.2,0,24.5,.25,20.5);box('trim',x,10.3,0,25,.45,21);
  // Pitched roofs, gutters and regularly spaced standing seams.
  for(const half of [-1,1]){box('roof',x,12.6,half*5.5,26,.3,12.1,half*.4);for(let sx=-12;sx<=12;sx+=2)box('metal',x+sx,12.79,half*5.5,.08,.08,12.2,half*.4);}
  box('trim',x,15,0,26,.3,.5);
  for(const xx of [x-9,x+9]){box('stone',xx,15.6,-3,2,5,2.2);box('trim',xx,18.1,-3,2.5,.4,2.7);for(const dx of [-.55,.55])box('roof',xx+dx,18.7,-3,.55,1,.55);}
  for(const xx of [x-9,x-3,x+3,x+9])for(const yy of [2.8,7.8]){
   box('trim',xx,yy,10.12,3.7,3.7,.3);box('glass',xx,yy,10.32,3.1,3.1,.08);
   box('trim',xx,yy,10.39,.13,3.15,.12);box('trim',xx,yy,10.4,3.15,.13,.12);box('trim',xx,yy-1.95,10.4,4,.3,.7);
   for(const offset of [-1,1])box('stone',xx+offset*1.95,yy,10.2,.3,3.8,.4);
  }
  for(let y=.9;y<10;y+=.9){box('wood',x,y,10.04,23.8,.035,.04);for(let joint=-11+(Math.round(y/.9)%2)*1.5;joint<12;joint+=3)box('wood',x+joint,y-.45,10.05,.035,.86,.04);}
  for(let y=1;y<10;y+=.9)for(const xx of [x-11.8,x+11.8])box('trim',xx,y,10.1,.8,.4,.5);
 }
 // Central clock tower and a sheltered entrance.
 box('stone',0,9.5,0,13,19,19);for(const x of [-6.5,6.5])box('trim',x,10,9.5,.5,20,.5);
 box('wood',0,3,9.65,4.8,6,.3);box('glass',0,6.9,9.7,5,1.3,.2);box('trim',0,7.8,9.6,6,.5,.8);
 for(const x of [-5,5])box('trim',x,3.5,13,.4,7,.4);box('roof',0,7.1,11.8,12,.35,5);
 for(let step=0;step<8;step++){const top=base-step*.45;box('stone',0,top/2-base,14+step*.8,12+step*.4,top,1);}
 box('trim',0,19,0,14,.5,20);box('roof',0,20.7,0,15,.4,22,0,0,0);
 for(const side of [-1,1])box('roof',side*3.8,22.2,0,8.5,.3,22,0,0,-side*.4);
 box('metal',0,25,0,.16,4,.16);box('red',1.8,26,0,3.6,1.6,.08);
 // Clock face in geometric relief; hands deliberately avoid needing animation.
 box('roof',0,15.6,9.7,6.1,6.1,.2);box('trim',0,15.6,9.85,5.3,5.3,.1);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;box('metal',Math.sin(a)*2.05,15.6+Math.cos(a)*2.05,9.94,.12,.4,.08,0,0,-a);}
 box('metal',.5,16.2,10.02,.14,1.7,.1,0,0,-.68);box('metal',-.75,15.6,10.05,1.8,.12,.1);
 // Small race-day banners add color to the weathered building.
 for(const x of [-13,13]){box('metal',x,9,11,.1,7,.1);box('red',x,7.4,11,2.4,4,.12);box('trim',x,7.4,11.08,.18,3.4,.1);}
 // Close the roof ends with stone gables rather than leaving open triangles.
 const gablePositions:number[]=[];
 for(const wing of [-19,19])for(const end of [-1,1]){const x=wing+end*12.01;const points=[new T.Vector3(x,base+10.5,oz-10.6),new T.Vector3(x,base+14.9,oz),new T.Vector3(x,base+10.5,oz+10.6)];for(const p of points)gablePositions.push(p.x,p.y,p.z);bounds.push(new T.Box3().setFromPoints(points));}
 const gableGeometry=new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(gablePositions,3));gableGeometry.computeVertexNormals();const gableMaterial=materials.stone.clone();gableMaterial.side=T.DoubleSide;const gables=new T.Mesh(gableGeometry,gableMaterial);gables.castShadow=gables.receiveShadow=true;root.add(gables);
 for(const[f,ms]of batches){const mesh=new T.InstancedMesh(geometry,materials[f],ms.length);ms.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;root.userData.pieces=bounds.length;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});geometry.dispose();gableGeometry.dispose();gableMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
