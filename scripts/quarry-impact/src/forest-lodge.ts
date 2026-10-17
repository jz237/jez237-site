import * as T from 'three';
/** Original rally lodge, centered on the existing Hazelwood service building. */
export function createForestLodge(ground=0){
 const root=new T.Group();root.name='hazelwood-rally-lodge';
 const triangle=new T.Shape();triangle.moveTo(-.5,0);triangle.lineTo(.5,0);triangle.lineTo(0,1);triangle.closePath();
 const gable=new T.ExtrudeGeometry(triangle,{depth:1,bevelEnabled:false});gable.translate(0,0,-.5);
 const geometries={box:new T.BoxGeometry(1,1,1),gable};
 const colors={stone:0x8e8875,wood:0x72513a,beam:0x42382b,trim:0xc1b18c,roof:0x4e6260,glass:0x527582,red:0x9a4935,metal:0x454f4b};
 type Shape=keyof typeof geometries;type Finish=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.3:.9,metalness:key==='metal'?.4:0})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D();
 function part(shape:Shape,f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(52+x,ground+y,-158+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=shape+':'+f,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);const g=geometries[shape];g.computeBoundingBox();bounds.push(g.boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0)=>part('box',f,x,y,z,w,h,d,rx,ry,rz);
 box('stone',0,1,0,44,2,16);box('wood',0,4.5,0,43.5,5,15.5);
 // Individually coursed stone base and horizontal weatherboards.
 for(const side of [-1,1]){
  for(let row=0;row<4;row++)for(let i=0;i<28;i++)box('stone',-21.2+i*1.56+(row%2)*.25,.25+row*.48,side*8.04,1.46,.4,.16);
  for(let y=2.2;y<7;y+=.32)box('wood',0,y,side*7.82,43.4,.12,.15);
  for(let x=-21;x<=21;x+=7){box('beam',x,4.65,side*7.94,.42,5.1,.3);}
  for(const y of [2.1,4.6,7])box('beam',0,y,side*8,44,.25,.35);
  for(let x=-17.5;x<=17.5;x+=7)for(const y of [3.4,5.9]){
   box('trim',x,y,side*8.12,3.3,1.9,.18);box('glass',x,y,side*8.23,2.9,1.55,.09);
   box('trim',x,y,side*8.31,.1,1.65,.08);box('trim',x,y,side*8.31,3,.1,.08);
   for(const dx of [-2,2]){box('red',x+dx,y,side*8.18,.65,1.9,.2);for(const yy of [-.55,0,.55])box('beam',x+dx,y+yy,side*8.3,.68,.09,.08);}
  }
 }
 // End gables and the wide, standing-seam pitched roof.
 for(const side of [-1,1]){part('gable','wood',side*21.75,7,0,16,3,.3,0,Math.PI/2);box('beam',side*21.98,8.15,0,.25,2.3,.25);}
 const pitch=Math.atan2(3,8),roofLength=Math.hypot(8,3)+1;
 for(const side of [-1,1]){
  box('roof',0,8.5,side*4.2,47,.3,roofLength,side*pitch);
  for(let x=-23;x<=23;x+=1.15)box('metal',x,8.68,side*4.2,.06,.06,roofLength,side*pitch);
  for(const x of [-22.7,22.7])box('trim',x,8.42,side*4.2,.25,.35,roofLength,side*pitch);
 }
 box('metal',0,10.12,0,47,.18,.4);
 // Covered front veranda, upper deck and open entrance stairs.
 box('wood',0,.45,9.45,44,.35,2.8);box('wood',0,4.65,9.35,44,.25,2.5);
 for(let x=-21;x<=21;x+=3.5){box('beam',x,2.5,10.3,.25,4.7,.25);box('trim',x,5.3,10.3,.15,1.2,.15);}
 for(const y of [5,5.8])box('trim',0,y,10.3,44,.12,.12);
 for(let x=-21.8;x<=21.8;x+=.65)box('trim',x,5.4,10.3,.08,.8,.08);
 for(const x of [-10.5,10.5]){box('beam',x,2.6,8.12,2.2,3.6,.2);box('red',x,2.5,8.28,1.85,3.2,.12);box('trim',x+.6,2.3,8.4,.12,.12,.1);for(let i=0;i<3;i++)box('stone',x,.12+i*.12,10.85-i*.25,3,.24+i*.24,.4);}
 // Roof-mounted stone chimney, rainwater downpipes and workshop doors.
 box('stone',13,9,-2,2,6,2);box('trim',13,12.1,-2,2.4,.3,2.4);box('metal',13,12.35,-2,1.5,.2,1.5);
 for(const side of [-1,1]){box('metal',side*21.7,3.5,-8.2,.16,7,.16);box('beam',side*22.1,2.7,0,.18,4.5,5);box('red',side*22.23,2.65,0,.12,4.2,4.6);for(let z=-2;z<=2;z+=.4)box('wood',side*22.31,2.65,z,.08,4,.08);}
 for(const [key,matrices]of batches){const [shape,finish]=key.split(':') as [Shape,Finish];const mesh=new T.InstancedMesh(geometries[shape],materials[finish],matrices.length);mesh.name='forest-lodge-'+key;matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
