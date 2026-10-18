import * as T from 'three';
/** Original club-circuit pit building (Westmere, also Alderwick's club paddock): six garages, a glazed hospitality floor,
 * roof terrace and a timing tower. Decorative, inside the reserved pit clearing. */
export function createWestmerePitPavilion(ground=0,title='WESTMERE MOTOR CLUB',subtitle='MEMBERS ONLY / BUMPERS NEGOTIABLE'){
 const root=new T.Group();root.name='westmere-pit-pavilion';
 const geometries={box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(.5,.5,1,12),cone:new T.ConeGeometry(.5,1,10)};
 const colors={render:0xe6e1d4,band:0xb33a2f,dark:0x2c3134,glass:0x4e7280,shutter:0x9aa3a6,interior:0x4b4a46,concrete:0xa29f97,steel:0x3a4145,lamp:0xfff1cc,white:0xf2efe6,navy:0x23344a,yellow:0xd9a72e,canvas:0xd8d2bf,rubber:0x1c1c1c};
 type Shape=keyof typeof geometries;type Finish=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.2:key==='steel'||key==='shutter'?.55:.88,metalness:key==='steel'||key==='shutter'?.4:key==='glass'?.15:0,...(key==='lamp'?{emissive:color,emissiveIntensity:1.5}:{})})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D();
 for(const g of Object.values(geometries))g.computeBoundingBox();
 function part(shape:Shape,f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(62+x,ground+y,-160+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=shape+':'+f,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);bounds.push(geometries[shape].boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0)=>part('box',f,x,y,z,w,h,d,rx,ry,rz);
 const round=(f:Finish,x:number,y:number,z:number,r:number,h:number,rx=0,rz=0)=>part('round',f,x,y,z,r*2,h,r*2,rx,0,rz);
 // Ground floor: rear block plus garage cross walls, so open bays show their interiors.
 const bays=[-25,-15,-5,5,15,25],open=new Set([0,2,3,5]);
 box('concrete',0,.1,0,68,.2,20);box('concrete',0,.06,10.95,66,.12,2.1);
 box('render',0,2.3,-6,66,4.6,8);
 for(let x=-30;x<=30;x+=10)box('render',x,2.3,3,1,4.6,10);for(const x of [-32.6,32.6])box('render',x,2.3,3,.8,4.6,10);
 box('render',0,4.9,3,66,.6,10);box('band',0,5.0,8.08,66.4,.8,.18);
 for(const [i,x]of bays.entries()){
  box('interior',x,2.3,-1.9,9,4.6,.1);box('interior',x,4.55,3,9,.08,10);
  if(!open.has(i)){box('shutter',x,2.3,7.7,9,4.4,.12);for(let y=.3;y<4.5;y+=.32)box('steel',x,y,7.78,9,.05,.06);continue;}
  box('lamp',x,4.48,1,6,.06,.25);box('lamp',x,4.48,5,6,.06,.25);
  // Tyre racks, a tool chest and a team car on stands, varied per garage.
  for(let t=0;t<4;t++)for(const dz of [-1.2,-.4])round('rubber',x-3.4,.33+t*.6,dz,.33,.25,Math.PI/2);
  box(i%2?'band':'navy',x+3.4,.6,-1.2,1.4,1.2,.7);box('steel',x+3.4,1.25,-1.2,1.45,.1,.75);
  const paint:Finish=i===0?'yellow':i===2?'navy':i===3?'band':'white';
  box(paint,x,.85,3.8,1.9,.6,4.1);box(paint,x,1.38,3.5,1.75,.48,2.1);box('glass',x,1.4,4.62,1.6,.38,.06,-.55,0,0);box('glass',x,1.4,2.43,1.6,.38,.06,.55,0,0);
  for(const dx of [-.89,.89])box('glass',x+dx,1.42,3.5,.05,.34,1.8);
  for(const dx of [-1,1])for(const dz of [-1.35,1.35])round('rubber',x+dx,.38,3.8+dz,.34,.26,0,Math.PI/2);
  box('white',x,.02,6.4,6,.04,.12);
 }
 // Garage numbers on the red band.
 for(const [i,x]of bays.entries())for(let bar=0;bar<=i;bar++)box('white',x-1+bar*.4,5.0,8.2,.16,.5,.05);
 // Upper hospitality floor: continuous glazing, slim mullions, a deep overhang.
 box('render',0,7.6,-3,64,4.6,14);
 box('glass',0,7.7,4.08,62,3.2,.12);for(let x=-31;x<=31;x+=2.4)box('white',x,7.7,4.16,.12,3.3,.12);
 box('white',0,6.0,4.2,64,.3,.3);box('white',0,9.4,4.2,64,.3,.3);
 for(const side of [-1,1]){box('glass',side*32.05,7.7,-3,.12,3.2,12);for(let z=-8.4;z<=2.4;z+=2.4)box('white',side*32.12,7.7,z,.12,3.3,.12);}
 // Interior glimpses through the glazing: ceiling lights and dining tables.
 for(let x=-28;x<=28;x+=8){box('lamp',x,9.75,0,3,.06,.4);box('white',x,6.6,1.6,2.2,.08,1.2);for(const dx of [-.8,.8])box('dark',x+dx,6.35,1.6,.08,.55,.08);}
 // Cantilevered roof with a red fascia, and a spectator terrace on top.
 box('dark',0,10.15,-1,68,.5,19);box('band',0,10.15,8.55,68.2,.55,.12);
 for(let x=-33;x<=33;x+=1.5)box('steel',x,11.1,8.3,.06,1.2,.06);box('steel',0,11.7,8.3,66,.08,.08);
 for(const side of [-1,1])for(let z=-10;z<=8;z+=1.5)box('steel',side*33.8,11.1,z,.06,1.2,.06);
 for(const x of [-24,-12,0,12,24]){round('steel',x,11.6,1.5,.05,2.4);part('cone',x%24?'canvas':'band',x,13.1,1.5,4.2,.9,4.2);
  box('white',x,10.85,1.5,1.4,.06,1.4);for(const dz of [-1.6,1.6])box('dark',x,10.7,1.5+dz,1.2,.5,.4);}
 // Timing tower at the east end: stacked position board with numbered bars.
 const tx=31;box('dark',tx,12.3,-6,4.2,8,4.2);box('render',tx,16.7,-6,5,.8,5);
 for(let row=0;row<6;row++){box('navy',tx,9.6+row*1.15,-3.85,3.6,.95,.1);box('yellow',tx-1.4,9.6+row*1.15,-3.77,.6,.7,.05);
  for(let bar=0;bar<=row%3;bar++)box('white',tx-.7+bar*.25,9.6+row*1.15,-3.77,.12,.6,.05);box('white',tx+.7,9.6+row*1.15,-3.77,1.4,.18,.05);}
 for(let i=0;i<5;i++)for(let j=0;j<3;j++)box((i+j)%2?'white':'dark',tx-1+i*.5,16.7,-3.45,.5,.5,.05);
 round('steel',tx-1.5,18.6,-7.5,.06,3);box('band',tx-.9,19.6,-7.5,1.2,.7,.04);
 // External stair at the west end and pit-lane lamp standards.
 for(let s=0;s<14;s++)box('concrete',-34.4,.2+s*.36,6-s*.55,1.4,.12,.55);for(const dx of [-.75,.75])box('steel',-34.4+dx,3.3,2.2,.08,.08,8.2,Math.atan2(5,7.7),0,0);
 for(const x of [-30,-10,10,30]){round('steel',x,3,11.2,.09,6);box('steel',x,6,10.7,.12,.12,1.2);box('lamp',x,5.9,10.2,.7,.1,.35);}
 // Pit boards and a fuel bowser parked by the apron.
 for(const [x,f]of [[-20,'yellow'],[-18.8,'navy'],[10,'band']]as const){box('steel',x,.9,10.4,.06,1.8,.06);box(f,x,1.55,10.42,.8,.55,.04);}
 box('band',22,.9,10.6,1.4,1.4,1);box('white',22,1.62,10.6,1.45,.08,1.05);round('dark',22.85,1,10.6,.05,1.2);
 let sign:{geometry:T.PlaneGeometry;material:T.MeshStandardMaterial;texture:T.CanvasTexture}|undefined;
 const canvas=typeof document==='undefined'?null:document.createElement('canvas'),ctx=canvas?.getContext('2d');
 if(canvas&&ctx){
  canvas.width=1024;canvas.height=128;ctx.fillStyle='#f2efe6';ctx.fillRect(0,0,1024,128);ctx.fillStyle='#b33a2f';ctx.fillRect(0,0,1024,10);ctx.fillRect(0,118,1024,10);
  ctx.fillStyle='#23344a';ctx.textAlign='center';ctx.font='900 58px sans-serif';ctx.fillText(title,512,74,1000);
  ctx.font='600 22px sans-serif';ctx.fillText(subtitle,512,104,1000);
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
  const material=new T.MeshStandardMaterial({map:texture,roughness:.85}),geometry=new T.PlaneGeometry(24,3);
  const mesh=new T.Mesh(geometry,material);mesh.name='westmere-pit-sign';mesh.position.set(62-8,ground+10.15,-160+8.63);root.add(mesh);sign={geometry,material,texture};
 }
 for(const [key,matrices]of batches){const [shape,finish]=key.split(':')as [Shape,Finish];const mesh=new T.InstancedMesh(geometries[shape],materials[finish],matrices.length);mesh.name='westmere-pits-'+key.replace(':','-');matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});if(sign){sign.geometry.dispose();sign.material.dispose();sign.texture.dispose();}Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
