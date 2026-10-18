import * as T from 'three';
/** Original Kingswell race control in a Victorian park palm house: arched glass
 * hall, two wings, palms inside, portico, clock and flower beds. Decorative only. */
export function createKingswellPalmHouse(ground=0){
 const root=new T.Group();root.name='kingswell-palm-house';
 const geometries={box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(.5,.5,1,12),cone:new T.ConeGeometry(.5,1,8)};
 const colors={iron:0xf1efe8,glass:0x9fc4c9,brick:0x8b5a45,stone:0xcfc7b4,trunk:0x6a5236,frond:0x4f7d3a,frond2:0x6c9446,red:0xb8402f,yellow:0xe0b33a,violet:0x7a5aa6,lawn:0x5e8a43,dark:0x2f3533,gold:0xc9a548,lamp:0xfff1cc,soil:0x4b3b2b};
 type Shape=keyof typeof geometries;type Finish=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.08:key==='gold'?.4:.85,metalness:key==='gold'?.6:key==='glass'?.1:0,...(key==='glass'?{transparent:true,opacity:.42,depthWrite:false}:{}),...(key==='lamp'?{emissive:color,emissiveIntensity:1.4}:{})})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D();
 for(const g of Object.values(geometries))g.computeBoundingBox();
 function part(shape:Shape,f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(38+x,ground+y,-158+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=shape+':'+f,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);bounds.push(geometries[shape].boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0)=>part('box',f,x,y,z,w,h,d,rx,ry,rz);
 const round=(f:Finish,x:number,y:number,z:number,r:number,h:number,rx=0,rz=0)=>part('round',f,x,y,z,r*2,h,r*2,rx,0,rz);
 /** Glazed hall: brick plinth, glazed walls with white mullions, and a barrel roof
  * of arched ribs along x with glass between them. */
 function hall(cx:number,length:number,depth:number,wall:number){
  box('brick',cx,.45,0,length+.4,.9,depth+.4);box('stone',cx,.95,0,length+.6,.12,depth+.6);
  for(const side of [-1,1]){box('glass',cx,.95+wall/2,side*depth/2,length,wall,.06);for(let x=cx-length/2;x<=cx+length/2+.01;x+=1.5)box('iron',x,.95+wall/2,side*depth/2,.12,wall,.14);}
  for(const end of [-1,1]){box('glass',cx+end*length/2,.95+wall/2,0,.06,wall,depth);for(let z=-depth/2;z<=depth/2+.01;z+=1.5)box('iron',cx+end*length/2,.95+wall/2,z,.14,wall,.12);}
  for(const side of [-1,1])box('iron',cx,.95+wall,side*depth/2,length+.2,.22,.22);
  const r=depth/2,top=.95+wall,steps=10;
  for(let i=0;i<steps;i++){
   const a0=Math.PI*i/steps,a1=Math.PI*(i+1)/steps,am=(a0+a1)/2,chord=2*r*Math.sin((a1-a0)/2);
   const z=-Math.cos(am)*r*.98,y=top+Math.sin(am)*r*.62;const tilt=Math.atan2(Math.cos(am)*.62,Math.sin(am));
   box('glass',cx,y,z,length,.05,chord*1.05,-tilt,0,0);
   for(let x=cx-length/2;x<=cx+length/2+.01;x+=1.5)box('iron',x,y+.02,z,.1,.1,chord*1.08,-tilt,0,0);
  }
  for(const end of [-1,1])for(let i=0;i<=steps;i++){const a=Math.PI*i/steps;box('iron',cx+end*length/2,top+Math.sin(a)*r*.62,-Math.cos(a)*r*.98,.16,.16,.16);}
  box('iron',cx,top+r*.62+.12,0,length+.3,.18,.3);
  for(let x=cx-length/2+1.5;x<cx+length/2;x+=3)part('cone','gold',x,top+r*.62+.5,0,.3,.6,.3);
 }
 hall(0,26,13,4.4);hall(-19.5,10,9,3.2);hall(19.5,10,9,3.2);
 // Lantern clerestory on the main hall with a gilded finial.
 box('glass',0,10.2,0,6,1.4,4);for(let x=-3;x<=3;x+=1)box('iron',x,10.2,0,.1,1.4,4.1);box('iron',0,11,0,6.4,.2,4.4);round('gold',0,11.7,0,.15,1.2);part('cone','gold',0,12.6,0,.5,.8,.5);
 // Raised soil beds either side of a gravel path, in the hall and both wings.
 for(const [cx,len,dep]of [[0,25,12],[-19.5,9,8],[19.5,9,8]]as const){box('stone',cx,1.03,0,len,.04,1.6);for(const side of [-1,1])box('soil',cx,1.1,side*(dep/4+.45),len,.3,dep/2-1);}
 // Palms and tree ferns inside, read through the glass.
 for(const [x,z,h]of [[-8,-2,7],[-3,2.5,8.5],[3,-2.5,7.5],[8,2,6.5],[-19.5,0,4.5],[19.5,0,4.5]]){
  round('trunk',x,.95+h/2,z,.22,h);for(let ring=1;ring<h;ring+=.8)round('trunk',x,.95+ring,z,.28,.12);
  for(let k=0;k<8;k++){const a=k/8*Math.PI*2;box(k%2?'frond':'frond2',x+Math.cos(a)*1.3,.95+h-.25,z+Math.sin(a)*1.3,2.8,.06,.55,0,-a,-.35);}
 }
 for(let i=0;i<14;i++){const x=-11+i*1.7,z=i%2?4.6:-4.6;part('cone',i%3?'frond':'frond2',x,1.6,z,1.1,1.4,1.1);}
 // Portico facing the circuit: columns, pediment, steps, clock.
 for(const x of [-3.6,-1.2,1.2,3.6]){round('stone',x,2.4,7.9,.28,3);box('stone',x,4,7.9,.7,.25,.7);}
 box('stone',0,4.35,7.9,8.6,.45,1.6);for(let k=0;k<6;k++)box('stone',0,4.75+k*.25,7.9,8.4-k*1.4,.25,1.4);
 for(let s=0;s<3;s++)box('stone',0,.15+s*.3,8.9+s*.45,9-s*.6,.3,.9);
 round('iron',0,5.6,8.66,.75,.12,Math.PI/2,0);round('dark',0,5.6,8.73,.66,.04,Math.PI/2,0);box('gold',0,5.75,8.77,.06,.38,.02);box('gold',.12,5.6,8.77,.3,.05,.02,0,0,.5);
 // Park noticeboard frame for the painted sign.
 box('dark',9,1.55,9.6,6.7,1.05,.1);for(const dx of [-3.1,3.1])box('dark',9+dx,.75,9.6,.12,1.5,.12);
 // Race control: the east wing gets a timing board and aerials on its roof.
 box('dark',19.5,9.6,0,6,1.6,.25);for(let row=0;row<3;row++){box('yellow',17.5,9.15+row*.45,.14,.5,.3,.04);box('iron',19.8,9.15+row*.45,.14,3.6,.12,.04);}
 for(const x of [17,22])round('iron',x,8.4,-1,.04,3);
 // Bedding plants, lawn edging and lamp standards along the frontage.
 for(let i=0;i<24;i++){const x=-26+i*2.25;if(Math.abs(x)<5)continue;box('lawn',x,.12,8.4,2.1,.24,1.4);for(let k=0;k<3;k++)part('cone',(['red','yellow','violet']as const)[(i+k)%3],x-.6+k*.6,.42,8.4,.42,.36,.42);}
 for(const x of [-25,-12,12,25]){round('iron',x,2.2,9.4,.07,4.4);round('dark',x,4.5,9.4,.2,.5);box('lamp',x,4.5,9.4,.32,.32,.32);part('cone','dark',x,4.95,9.4,.5,.35,.5);}
 let sign:{geometry:T.PlaneGeometry;material:T.MeshStandardMaterial;texture:T.CanvasTexture}|undefined;
 const canvas=typeof document==='undefined'?null:document.createElement('canvas'),ctx=canvas?.getContext('2d');
 if(canvas&&ctx){
  canvas.width=1024;canvas.height=128;ctx.fillStyle='#1f3a2c';ctx.fillRect(0,0,1024,128);ctx.strokeStyle='#c9a548';ctx.lineWidth=6;ctx.strokeRect(8,8,1008,112);
  ctx.fillStyle='#e8dfc4';ctx.textAlign='center';ctx.font='900 50px serif';ctx.fillText('KINGSWELL PARK · PALM HOUSE',512,66,980);
  ctx.font='italic 22px serif';ctx.fillText('Race Control · Please do not feed the marshals',512,102,980);
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
  const material=new T.MeshStandardMaterial({map:texture,roughness:.8}),geometry=new T.PlaneGeometry(6.4,.8);
  const mesh=new T.Mesh(geometry,material);mesh.name='kingswell-palm-house-sign';mesh.position.set(38+9,ground+1.55,-158+9.66);root.add(mesh);sign={geometry,material,texture};
 }
 for(const [key,matrices]of batches){const [shape,finish]=key.split(':')as [Shape,Finish];const mesh=new T.InstancedMesh(geometries[shape],materials[finish],matrices.length);mesh.name='kingswell-palm-'+key.replace(':','-');matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=finish!=='glass';mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});if(sign){sign.geometry.dispose();sign.material.dispose();sign.texture.dispose();}Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
