import * as T from 'three';
/** Original Harrowstone rally HQ: a limestone engine shed turned service garage,
 * with a glazed race-control tower. Decorative, inside the reserved service clearing. */
export function createRidgeRallyHQ(ground=0){
 const root=new T.Group();root.name='harrowstone-rally-hq';
 const triangle=new T.Shape();triangle.moveTo(-.5,0);triangle.lineTo(.5,0);triangle.lineTo(0,1);triangle.closePath();
 const gable=new T.ExtrudeGeometry(triangle,{depth:1,bevelEnabled:false});gable.translate(0,0,-.5);
 const geometries={box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(.5,.5,1,10),gable};
 const colors={stone:0x8d897d,stone2:0x737168,slate:0x3b4146,timber:0x6e5239,beam:0x3b3127,steel:0x343a3d,glass:0x4b6c79,shadow:0x4a463f,lamp:0xfff2d0,concrete:0x9b988f,ochre:0xc28a2e,white:0xe0dbcd,rubber:0x1c1c1c,red:0x9e3b2d};
 type Shape=keyof typeof geometries;type Finish=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.25:key==='steel'?.55:.92,metalness:key==='steel'?.45:key==='glass'?.1:0,...(key==='lamp'?{emissive:color,emissiveIntensity:1.6}:{})})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D();
 for(const g of Object.values(geometries))g.computeBoundingBox();
 function part(shape:Shape,f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(80+x,ground+y,-160+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=shape+':'+f,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);bounds.push(geometries[shape].boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0)=>part('box',f,x,y,z,w,h,d,rx,ry,rz);
 const drum=(f:Finish,x:number,y:number,z:number,r:number,h:number,rx=0,rz=0)=>part('round',f,x,y,z,r*2,h,r*2,rx,0,rz);
 // Stone plinth buried into the slope, concrete apron in front of the bays.
 box('stone2',-6,-.6,0,29,2.2,17);box('stone2',14.5,-.6,0,12,2.2,13);box('concrete',-6,.08,9.4,29,.16,2.8);
 // Engine shed: coursed limestone with alternating stone tones and dressed quoins.
 const shed={x0:-20.5,x1:8.5,z:8,h:6.4};
 // Solid rear block; piers and a lintel band leave the three bays open to the apron.
 box('stone',-6,3.2,-2.4,28.6,6.4,10.8);box('stone',-6,5.65,5.4,28.6,1.5,4.8);
 for(const [a,b]of [[-20.3,-18.5],[-11.5,-9.5],[-2.5,-.5],[6.5,8.3]])box('stone',(a+b)/2,2.45,5.4,b-a,4.9,4.8);
 for(const side of [-1,1]){
  for(let row=0;row<9;row++)for(let x=shed.x0+.1+(row%2)*.7;x<shed.x1-.8;x+=1.45){
   if(side===1&&row<7&&[-15,-6,3].some(c=>Math.abs(x+.65-c)<3.9))continue;
   box(((row*7+Math.round(x*3))%3===0)?'stone2':'stone',x+.65,.38+row*.7,side*7.86,1.32,.6,.14);
  }
  for(const x of [shed.x0,shed.x1])for(let row=0;row<9;row++)box('white',x+(x<0?.35:-.35),.38+row*.7,side*7.9,row%2?.7:1.1,.62,.12);
 }
 for(const x of [shed.x0,shed.x1])for(let row=0;row<9;row++)for(let z=-7.2+(row%2)*.7;z<7;z+=1.45)box(((row+Math.round(z*5))%3===0)?'stone2':'stone',x+(x<0?-.08:.08),.38+row*.7,z+.6,.14,.6,1.32);
 // Three open service bays with timber lintels and visible workshop interiors.
 for(const [i,cx]of [-15,-6,3].entries()){
  box('shadow',cx,2.45,3.06,7,4.9,.1);box('shadow',cx,4.86,5.4,7,.08,4.8);box('beam',cx,5.15,7.95,8,.55,.45);
  for(const dx of [-3.65,3.65])box('white',cx+dx,2.5,7.95,.5,5,.42);
  box('concrete',cx,.05,5,7,.1,4);
  // Workbench, tool board, tyre rack and a two-post lift at the back of each bay.
  box('timber',cx-1.8,.9,4.1,3,.12,1);for(const dx of [-3.1,-.5])box('steel',cx+dx,.45,4.1,.1,.9,.9);
  box('timber',cx-1.8,2.2,3.7,3,1.4,.08);for(let t=0;t<5;t++)box('steel',cx-3+t*.6,2.2,3.75,.08,.6,.06);
  for(let t=0;t<3;t++)drum('rubber',cx+2.4,.35+t*.62,4.1,.36,.26,Math.PI/2,0);
  if(i!==1){for(const dx of [-1.6,1.6]){box('ochre',cx+dx,1.7,5.2,.28,3.4,.28);box('steel',cx+dx*.55,.8,5.2,1.6,.12,.25);}}
  else{
   // Rally hatch on stands mid-service: shell, glasshouse, bonnet raised, one wheel off.
   box('red',cx,.95,5.6,1.8,.62,3.8);box('red',cx,1.5,5.35,1.66,.5,2);box('glass',cx,1.5,6.37,1.5,.42,.06,-.5,0,0);box('glass',cx,1.5,4.33,1.5,.42,.06,.5,0,0);
   for(const dx of [-.84,.84])box('glass',cx+dx,1.52,5.35,.05,.36,1.7);box('white',cx,1.79,5.35,1.6,.05,1.9);
   box('red',cx,1.55,6.95,1.7,.06,1.1,-.9,0,0);box('shadow',cx,1.1,6.9,1.5,.35,.9);
   for(const dx of [-.95,.95])for(const dz of [-1.25,1.25]){if(dx>0&&dz>0){box('steel',cx+dx*.8,.45,5.6+dz,.3,.9,.3);continue;}drum('rubber',cx+dx,.46,5.6+dz,.33,.24,0,Math.PI/2);}
   drum('rubber',cx+2,.13,7.2,.33,.24);
  }
  box('lamp',cx,4.78,5.4,5.2,.07,.22);box('lamp',cx,4.78,4,5.2,.07,.22);
  box('ochre',cx,4.75,4.6,.14,.14,1.6);box('white',cx,4.6,3.8,1.2,.06,.3);
  // Bay numbers as raised bars on the lintel.
  for(let bar=0;bar<=i;bar++)box('white',cx-.4+bar*.4,5.15,8.2,.18,.36,.06);
 }
 // Slate roof with ridge cap, rooflights and two gable chimneys.
 const pitch=Math.atan2(3.2,8),slope=Math.hypot(8,3.2)+.8;
 for(const side of [-1,1]){
  box('slate',-6,6.4+1.6,side*4,30,.3,slope,side*pitch);
  for(let x=-20;x<=8;x+=.95)box('shadow',x,6.55+1.6,side*4,.05,.05,slope-.3,side*pitch);
  for(const x of [-13,1])box('glass',x,6.62+1.6,side*4,3.2,.1,2.6,side*pitch);
  part('gable','stone',side>0?shed.x1:shed.x0,6.4,0,16,3.2,.3,0,Math.PI/2);
 }
 box('slate',-6,9.75,0,30.2,.32,.55);
 // Roof-mounted venue board on a steel frame, facing the circuit.
 box('steel',-6,11.1,.98,14.3,2.4,.1);for(const dx of [-6,0,6]){box('steel',-6+dx,10,.9,.14,1.6,.14);box('steel',-6+dx,10.4,.2,.1,.1,1.5,.6,0,0);}
 for(const x of [shed.x0+1.2,shed.x1-1.2]){box('stone2',x,9.5,0,1.6,4,1.4);box('slate',x,11.55,0,1.9,.2,1.7);for(const dz of [-.3,.3])drum('red',x,11.95,dz,.18,.6);}
 // Two-storey race-control tower: stone below, wraparound glazing above.
 const tx=14.5;
 box('stone',tx,2.6,0,11,5.2,12);
 for(let row=0;row<7;row++)for(let z=-5.6+(row%2)*.7;z<5.6;z+=1.45)box(((row+Math.round(z*7))%3===0)?'stone2':'stone',tx+5.55,.38+row*.7,z+.6,.14,.6,1.32);
 for(let row=0;row<7;row++){for(let x=tx-5.2+(row%2)*.7;x<tx+5.1;x+=1.45)if(!(Math.abs(x+.65-(tx-2.5))<1.2&&row<5))box(((row*5+Math.round(x*3))%3===0)?'stone2':'stone',x+.65,.38+row*.7,6.06,1.32,.6,.14);
  for(let z=-5.6+(row%2)*.7;z<5.6;z+=1.45)box(((row*3+Math.round(z*7))%3===1)?'stone2':'stone',tx-5.55,.38+row*.7,z+.6,.14,.6,1.32);}
 box('timber',tx,5.45,0,11.4,.5,12.4);
 box('white',tx,7.4,0,10.4,3.4,11.4);
 for(const side of [-1,1]){
  box('glass',tx,7.5,side*5.75,10,2.4,.12);for(let x=tx-4.8;x<=tx+4.8;x+=1.6)box('white',x,7.5,side*5.82,.14,2.5,.12);
  box('glass',tx+side*5.25,7.5,0,.12,2.4,11);for(let z=-5;z<=5;z+=1.67)box('white',tx+side*5.32,7.5,z,.12,2.5,.14);
 }
 box('slate',tx,9.35,0,12.8,.35,14);box('ochre',tx,9.05,7.02,12.8,.4,.1);
 // Balcony over the bays side with railings; doors and windows below.
 box('timber',tx,5.6,7.6,11,.22,3);for(let x=tx-5.3;x<=tx+5.3;x+=.75)box('steel',x,6.2,9,.06,1.1,.06);box('steel',tx,6.75,9.05,11,.08,.08);
 for(const side of [-1,1])box('steel',tx+side*5.3,6.2,7.6,.06,1.1,3);
 box('shadow',tx-2.5,1.7,6.05,1.6,3.2,.12);box('timber',tx-2.5,1.7,6.1,1.4,3,.08);
 for(const x of [tx+1,tx+3.6]){box('white',x,2.8,6.08,1.8,1.5,.12);box('glass',x,2.8,6.14,1.5,1.2,.06);}
 // External steel stair to the balcony on the east end.
 for(let s=0;s<12;s++)box('steel',tx+6.4,.25+s*.46,6.2-s*.5,1.3,.08,.45);
 for(const dx of [-.7,.7]){box('steel',tx+6.4+dx,2.9,3.4,.08,.08,7.6,Math.atan2(5.5,6),0,0);box('steel',tx+6.4+dx,1.4,.6,.1,2.8,.1);}
 // Flag mast with a chequered flag on the tower roof.
 box('steel',tx+3.5,11.5,-3.5,.14,4.2,.14);
 for(let i=0;i<4;i++)for(let j=0;j<3;j++)box((i+j)%2?'white':'rubber',tx+3.5,12.9+j*.42,-3.25+i*.42,.04,.42,.42);
 // Lean-to log store against the west gable.
 box('timber',-21.8,1.6,0,2.4,.15,12,0,0,.2);
 for(const z of [-5.5,5.5])box('beam',-22.6,1.2,z,.2,2.4,.2);
 for(let row=0;row<4;row++)for(let i=0;i<7;i++)drum(row%2?'timber':'beam',-21.6,.22+row*.38,-4.6+i*1.5+(row%2)*.3,.2,1.3,Math.PI/2,0);
 // Dry-stone compound wall behind the buildings, with a timber gate.
 for(let x=-22;x<=21;x+=1.2){if(Math.abs(x-6)<2)continue;const h=1.1+((Math.round(x*3)%3)*.08);box(Math.round(x)%2?'stone':'stone2',x,h/2,-9.6,1.15,h,.7);box('stone2',x,h+.06,-9.6,1.2,.14,.85);}
 box('timber',6,.75,-9.55,3.6,.12,.1);box('timber',6,.25,-9.55,3.6,.12,.1);for(const dx of [-1.7,1.7])box('beam',6+dx,.7,-9.55,.18,1.4,.2);
 // Fuel drums, tyre stacks and a parked trailer inside the compound.
 for(const [x,z,f]of [[-17,-8.4,'red'],[-16,-8.6,'ochre'],[-15,-8.3,'red'],[-16.5,-7.6,'steel']]as const)drum(f,x,.5,z,.35,1);
 for(const x of [-11,-9.3,-7.6])for(let t=0;t<4;t++)drum('rubber',x,.2+t*.36,-8.6,.42,.32);
 box('steel',0,.7,-8.6,6,.15,1.6);box('ochre',0,1.15,-8.6,6,.75,1.6);for(const dx of [-1.6,1.6])drum('rubber',dx,.42,-8.6,.42,.3,0,Math.PI/2);box('steel',3.8,.6,-8.6,1.8,.1,.12);
 // Lamp posts at the apron corners.
 for(const x of [-21,9]){drum('steel',x,2.6,10.4,.08,5.2);box('steel',x,5.2,9.9,.12,.1,1.1);box('white',x,5.1,9.4,.5,.12,.32);}
 let sign:{geometry:T.PlaneGeometry;material:T.MeshStandardMaterial;texture:T.CanvasTexture}|undefined;
 const canvas=typeof document==='undefined'?null:document.createElement('canvas'),ctx=canvas?.getContext('2d');
 if(canvas&&ctx){
  canvas.width=1024;canvas.height=160;ctx.fillStyle='#e3dccb';ctx.fillRect(0,0,1024,160);ctx.fillStyle='#c28a2e';ctx.fillRect(0,0,1024,14);ctx.fillRect(0,146,1024,14);
  ctx.fillStyle='#2f2b25';ctx.textAlign='center';ctx.font='900 64px sans-serif';ctx.fillText('HARROWSTONE RALLY HQ',512,86,990);
  ctx.font='600 26px sans-serif';ctx.fillText('SERVICE · SCRUTINEERING · SHEEP RETURNED TO OWNERS',512,126,990);
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
  const material=new T.MeshStandardMaterial({map:texture,roughness:.85}),geometry=new T.PlaneGeometry(14,2.2);
  const mesh=new T.Mesh(geometry,material);mesh.name='ridge-hq-sign';mesh.position.set(80-6,ground+11.1,-160+1.05);root.add(mesh);sign={geometry,material,texture};
 }
 for(const [key,matrices]of batches){const [shape,finish]=key.split(':')as [Shape,Finish];const mesh=new T.InstancedMesh(geometries[shape],materials[finish],matrices.length);mesh.name='ridge-hq-'+key.replace(':','-');matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});if(sign){sign.geometry.dispose();sign.material.dispose();sign.texture.dispose();}Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
