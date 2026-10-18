import * as T from 'three';
/** Original County Fair service big top: striped circus tent with king poles,
 * open entrance showing a car on a podium, ticket kiosk, a showman's wagon and
 * bunting. Decorative only, inside the reserved service clearing. */
export function createFairgroundBigTop(ground=0){
 const root=new T.Group();root.name='fair-service-big-top';
 const slices=16,wedge=Math.PI*2/slices;
 const geometries={box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(.5,.5,1,12),
  roof:new T.ConeGeometry(.5,1,3,1,true,0,wedge),wall:new T.CylinderGeometry(.5,.5,1,3,1,true,0,wedge),cone:new T.ConeGeometry(.5,1,10),
  arch:new T.CylinderGeometry(.5,.5,1,12,1,false,0,Math.PI)};
 const colors={red:0xc23b2e,cream:0xefe4c8,gold:0xd9a83a,blue:0x2f4f8a,green:0x3e6b42,timber:0x7a5a3c,dark:0x262626,steel:0x40464a,glass:0x4d6a72,rubber:0x1c1c1c,rope:0xd7cfb2,white:0xf4f1ea,lamp:0xfff0c8};
 type Shape=keyof typeof geometries;type Finish=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.22:key==='gold'?.45:.86,metalness:key==='gold'?.5:key==='steel'?.4:0,side:['red','cream','blue'].includes(key)?T.DoubleSide:T.FrontSide,...(key==='lamp'?{emissive:color,emissiveIntensity:1.5}:{})})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D();
 for(const g of Object.values(geometries))g.computeBoundingBox();
 function part(shape:Shape,f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(110+x,ground+y,-150+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=shape+':'+f,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);bounds.push(geometries[shape].boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0)=>part('box',f,x,y,z,w,h,d,rx,ry,rz);
 const round=(f:Finish,x:number,y:number,z:number,r:number,h:number,rx=0,rz=0)=>part('round',f,x,y,z,r*2,h,r*2,rx,0,rz);
 // Big top: striped canvas wall and roof wedges; the front wedges are left open.
 const cx=-4,r=7.6,wallH=3.4,roofH=5.2;
 for(let i=0;i<slices;i++){
  const a=i*wedge,f:Finish=i%2?'cream':'red';
  part('roof',f,cx,wallH+roofH/2,0,r*2,roofH,r*2,0,a,0);
  if(Math.cos(a+wedge/2)<=.82)part('wall',i%2?'red':'cream',cx,wallH/2,0,r*2,wallH,r*2,0,a,0);
 }
 // Scalloped valance around the eaves.
 for(let i=0;i<slices*2;i++){const a=(i+.5)*wedge/2;box(i%2?'gold':'blue',cx+Math.sin(a)*(r+.02),wallH-.15,Math.cos(a)*(r+.02),r*wedge/2*.95,.4,.06,0,a,0);}
 // King poles with pennants, quarter poles, guy ropes and pegs.
 for(const dx of [-2.2,2.2]){round('steel',cx+dx,(wallH+roofH)/2+1.2,0,.12,wallH+roofH+2.4);part('cone','gold',cx+dx,wallH+roofH+2.6,0,.35,.6,.35);box(dx<0?'red':'blue',cx+dx+.65,wallH+roofH+2.1,0,1.2,.6,.03);}
 for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8;if(Math.cos(a)>.82)continue;const x=cx+Math.sin(a)*(r+1.6),z=Math.cos(a)*(r+1.6);
  const top=new T.Vector3(cx+Math.sin(a)*r,wallH,Math.cos(a)*r),peg=new T.Vector3(x,.05,z),mid=top.clone().add(peg).multiplyScalar(.5),len=top.distanceTo(peg);
  dummy.position.set(110+mid.x,ground+mid.y,-150+mid.z);dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),top.clone().sub(peg).normalize());dummy.scale.set(.04,len,.04);dummy.updateMatrix();
  const list=batches.get('box:rope')??[];list.push(dummy.matrix.clone());batches.set('box:rope',list);bounds.push(geometries.box.boundingBox!.clone().applyMatrix4(dummy.matrix));dummy.quaternion.identity();
  box('timber',x,.15,z,.18,.3,.18);}
 // Entrance portal facing the circuit: arch sign, dark interior, car on a podium.
 box('gold',cx,4.1,r+.6,4.4,.5,.2);part('arch','red',cx,3.6,r+.55,4.4,.25,1.6,Math.PI/2,0,0);
 for(const dx of [-2.1,2.1])box('gold',cx+dx,1.9,r+.6,.22,3.8,.22);
 box('dark',cx,1.7,r-2.6,4.6,3.4,.1);
 round('gold',cx,.2,r-4,1.8,.4);box('blue',cx,.75,r-4,1.85,.6,3.9);box('blue',cx,1.28,r-4.25,1.7,.48,2);box('glass',cx,1.3,r-3.2,1.5,.38,.06,-.55,0,0);
 for(const dx of [-.95,.95])for(const dz of [-1.25,1.25])round('rubber',cx+dx,.62,r-4+dz,.32,.24,0,Math.PI/2);
 // Festoon lamps along the entrance and around the eaves.
 for(let i=0;i<12;i++){const a=i*Math.PI*2/12;box('lamp',cx+Math.sin(a)*(r+.15),wallH+.15,Math.cos(a)*(r+.15),.16,.16,.16);}
 // Ticket kiosk with a pointed roof.
 const kx=8,kz=5.5;box('red',kx,1.2,kz,2,2.4,2);box('cream',kx,1.6,kz+1.01,1.5,.8,.04);box('glass',kx,1.6,kz+1.04,1.2,.6,.02);box('gold',kx,2.5,kz,2.3,.2,2.3);part('cone','blue',kx,3.3,kz,2.6,1.4,2.6,0,Math.PI/4,0);
 // Showman's living wagon: arched roof, panelled sides, wheels, steps.
 const wx=9,wz=-4.5;box('green',wx,1.75,wz,6,2.2,2.4);part('arch','green',wx,2.85,wz,2.4,6,.9,0,0,Math.PI/2);
 for(let i=0;i<4;i++){box('gold',wx-2.25+i*1.5,1.75,wz+1.21,1.2,1.6,.04);box('cream',wx-2.25+i*1.5,1.95,wz+1.24,.8,.6,.02);}
 for(const dx of [-2,2])for(const s of [-1,1])round('timber',wx+dx,.55,wz+s*1.25,.55,.12,Math.PI/2,0);
 for(let s=0;s<3;s++)box('timber',wx+3.3+s*.3,.25+s*.3,wz,.35,.08,1);
 // Bunting from the king poles out to the kiosk and wagon.
 for(const [tx,tz]of [[kx,kz],[wx,wz]]){for(let i=1;i<12;i++){const t=i/12,x=cx+2.2+(tx-cx-2.2)*t,z=tz*t,y=wallH+roofH+1.6-(wallH+roofH-1.2)*t-Math.sin(t*Math.PI)*.8;box((['red','gold','blue','cream']as const)[i%4],x,y,z,.45,.45,.03,0,Math.atan2(tx-cx,tz),Math.PI/4);}}
 for(const [key,matrices]of batches){const [shape,finish]=key.split(':')as [Shape,Finish];const mesh=new T.InstancedMesh(geometries[shape],materials[finish],matrices.length);mesh.name='fair-big-top-'+key.replace(':','-');matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
