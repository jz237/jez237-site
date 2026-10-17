import * as T from 'three';
/** Original waterworks architecture within the former control-house footprint. */
export function createReservoirPumphouse(ground=0){
 const root=new T.Group();root.name='bramblebrook-pumphouse';
 const geometries={box:new T.BoxGeometry(1,1,1),pipe:new T.CylinderGeometry(.5,.5,1,12),ring:new T.TorusGeometry(.5,.08,6,20)};
 const colors={brick:0x87634e,stone:0xb1ab91,steel:0x3c5355,glass:0x426a70,roof:0x586c68,rust:0xa75e40,yellow:0xd0b366};type Shape=keyof typeof geometries;type Finish=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.28:.88,metalness:key==='steel'?.35:0})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D();
 function part(shape:Shape,f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(90+x,ground+y,-163+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=shape+':'+f,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);const g=geometries[shape];g.computeBoundingBox();bounds.push(g.boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0)=>part('box',f,x,y,z,w,h,d,rx,ry,rz);
 box('stone',0,.4,0,46,.8,16);box('brick',0,4.1,0,44,7.4,14);
 for(const y of [.95,3,7.7])box('stone',0,y,0,44.6,.28,14.6);
 // Structural piers, lintels, recessed glazing and opening-light mullions.
 for(let x=-20;x<=20;x+=5){
  for(const side of [-1,1]){
   box('stone',x,4.4,side*7.2,.45,7,.5);
   if(x===-20||x===20)continue;
   box('steel',x+2.5,4.9,side*7.13,3.7,4.3,.12);box('glass',x+2.5,4.9,side*7.23,3.35,3.9,.08);
   for(const dx of [-.56,.56])box('stone',x+2.5+dx,4.9,side*7.3,.075,3.95,.1);
   for(const yy of [3.6,4.9,6.2])box('stone',x+2.5,yy,side*7.3,3.45,.08,.1);
   box('stone',x+2.5,2.85,side*7.4,3.9,.2,.5);
  }
 }
 // Repeated north-light roof bays make a readable sawtooth skyline.
 for(const x of [-16.5,-5.5,5.5,16.5]){
  box('roof',x,8.65,0,11.45,.25,15.8,0,0,.19);
  box('steel',x+5.4,8.8,0,.18,2.3,15.8);box('glass',x+5.29,8.8,0,.08,1.9,14.8);
  for(let z=-7;z<=7;z+=1.75)box('stone',x+5.18,8.8,z,.1,2.1,.08);
  for(let z=-7.5;z<=7.5;z+=1.25)box('steel',x,8.85,z,11.4,.05,.06,0,0,.19);
 }
 // End-wall roller doors and a shallow loading apron, no encroachment on track.
 for(const side of [-1,1]){
  box('stone',side*22.3,3.1,0,.4,6.2,6.3);box('steel',side*22.55,2.9,0,.1,5.6,5.7);
  for(let y=.5;y<5.8;y+=.4)box('roof',side*22.64,y,0,.1,.07,5.5);
  for(const z of [-3.5,3.5]){box('yellow',side*23,1,z,.25,2,.25);box('steel',side*23,1.1,z,.28,.3,.28);}
 }
 // Raised operator room and small service balcony at the rear.
 box('brick',0,11,-3,14,5,8);box('stone',0,13.6,-3,15,.3,9);
 for(const side of [-1,1]){box('stone',0,11.5,-3+side*4.1,13,2.8,.2);box('glass',0,11.5,-3+side*4.24,12.5,2.3,.08);for(let x=-6;x<=6;x+=2)box('steel',x,11.5,-3+side*4.32,.1,2.5,.08);}
 box('steel',0,9,-7.8,15,.2,1.2);for(const y of [9.6,10.3])box('yellow',0,y,-8.35,15,.08,.08);for(let x=-7.5;x<=7.5;x+=1.5)box('yellow',x,9.65,-8.35,.08,1.3,.08);
 // Cast-iron service pipes, flanged unions and red isolation wheels.
 for(const x of [-18,-12,12,18]){
  part('pipe','steel',x,2,7.95,.55,3.3,.55);part('pipe','rust',x,3.3,7.95,.85,.18,.85);
  part('ring','rust',x,2.4,8.3,1,1,1);box('rust',x,2.4,8.3,.9,.08,.08);box('rust',x,2.4,8.3,.08,.9,.08);
 }
 part('pipe','steel',0,.8,7.95,.55,38,.55,0,0,Math.PI/2);
 for(const x of [-19,-9,9,19])box('stone',x,.4,7.95,1.2,.8,1.2);
 for(const x of [-7,7]){part('pipe','steel',x,15.2,-5,.35,3,.35);part('pipe','roof',x,16.8,-5,1,.3,1);}
 for(const [key,matrices]of batches){const [shape,finish]=key.split(':') as [Shape,Finish];const mesh=new T.InstancedMesh(geometries[shape],materials[finish],matrices.length);mesh.name='pumphouse-'+key;matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
