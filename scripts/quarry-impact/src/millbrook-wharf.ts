import * as T from 'three';
/** Original Millbrook wharf: a three-storey brick canal warehouse with stacked
 * loading doors and a projecting hoist (west), and a brick engine house with a
 * tall chimney and timing balcony (east). Decorative, inside the two reserved
 * service clearings. */
export function createMillbrookWharf(groundWest=0,groundEast=0){
 const root=new T.Group();root.name='millbrook-wharf';
 const triangle=new T.Shape();triangle.moveTo(-.5,0);triangle.lineTo(.5,0);triangle.lineTo(0,1);triangle.closePath();
 const gable=new T.ExtrudeGeometry(triangle,{depth:1,bevelEnabled:false});gable.translate(0,0,-.5);
 // Half-cylinder rotated so the curve rises (+Y) and the depth runs along Z.
 const arch=new T.CylinderGeometry(.5,.5,1,12,1,false,0,Math.PI).rotateZ(Math.PI/2).rotateY(Math.PI/2);
 const geometries={box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(.5,.5,1,14),gable,arch};
 const colors={brick:0x8a4a37,brick2:0x7a3f2f,stone:0xc9bfa8,slate:0x3e464c,timber:0x5d4632,frame:0x2f3b3a,glass:0x3d5560,steel:0x30363a,cream:0xe4dcc6,teal:0x376e80,rope:0xcbbd96,lamp:0xfff0c8,soot:0x2b2a28};
 type Shape=keyof typeof geometries;type Finish=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.22:key==='steel'?.55:.9,metalness:key==='steel'?.45:key==='glass'?.12:0,...(key==='lamp'?{emissive:color,emissiveIntensity:1.4}:{})})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D();
 for(const g of Object.values(geometries))g.computeBoundingBox();
 let ox=0,oy=0,oz=-158;
 function part(shape:Shape,f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(ox+x,oy+y,oz+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=shape+':'+f,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);bounds.push(geometries[shape].boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0)=>part('box',f,x,y,z,w,h,d,rx,ry,rz);
 const round=(f:Finish,x:number,y:number,z:number,r:number,h:number,rx=0,rz=0)=>part('round',f,x,y,z,r*2,h,r*2,rx,0,rz);
 /** A segmental-arched window: stone sill, brick arch head, glazing bars. */
 function window(x:number,y:number,z:number,w:number,h:number){
  box('frame',x,y,z+.02,w,h,.08);box('glass',x,y,z+.07,w-.16,h-.16,.04);box('frame',x,y,z+.1,.06,h-.12,.03);for(const dy of [-h/6,h/6])box('frame',x,y+dy,z+.1,w-.12,.05,.03);
  box('stone',x,y-h/2-.07,z+.12,w+.3,.12,.24);part('arch','brick2',x,y+h/2-.02,z+.08,w+.3,.6,.14);
 }
 // ---- West: canal warehouse (48 x 16, three storeys + loft).
 ox=-77;oy=groundWest;
 const W=46,D=15,H=11.5;
 box('stone',0,.4,0,W+.6,.8,D+.6);box('brick',0,.8+H/2,0,W,H,D);
 for(let row=0;row<Math.floor(H/1.25);row++)box('brick2',0,1.5+row*1.25,D/2+.012,W,.06,.02);
 for(const side of [-1,1])box('stone',side*(W/2-.25),.8+H/2,D/2+.03,.6,H,.1);
 for(const fy of [4.1,7.6])box('stone',0,.8+fy,D/2+.04,W,.18,.12);
 for(let x=-W/2+3;x<=W/2-3;x+=3.6){if(Math.abs(x)<3)continue;for(const fy of [2.4,5.9,9.4])window(x,.8+fy,D/2,1.5,2.1);}
 // Central loading bay: stacked timber doors, cast-iron hoist housing and jib.
 for(const [i,fy]of [1.8,5.6,9.1].entries()){box('timber',0,.8+fy,D/2+.06,2.6,i?2.6:3.4,.12);for(const dx of [-.65,0,.65])box('frame',dx,.8+fy,D/2+.13,.05,i?2.5:3.3,.04);box('stone',0,.8+fy-(i?1.35:1.75),D/2+.25,3.2,.14,.6);}
 box('timber',0,.8+H+.6,D/2+.9,3.4,2.6,1.9);part('gable','slate',0,.8+H+1.9,D/2+.9,3.8,1.4,2.1,0,0,0);
 box('steel',0,.8+H+.3,D/2+2.0,.16,.16,1.2);round('steel',0,.8+H-1.2,D/2+2.45,.02,3);box('steel',0,.8+H-2.8,D/2+2.45,.3,.3,.3);
 for(const side of [-1,1])round('steel',side*(W/2-1.2),.8+H/2,D/2+.18,.07,H);
 // Slate roof, ridge, chimneys and a painted name band.
 const pitch=Math.atan2(3.4,D/2),slope=Math.hypot(D/2,3.4)+.6;
 for(const side of [-1,1]){box('slate',0,.8+H+1.7,side*D/4,W+.8,.28,slope,side*pitch,0,0);part('gable','brick',side*(W/2),.8+H,0,D,3.4,.4,0,Math.PI/2,0);}
 box('slate',0,.8+H+3.45,0,W+.9,.25,.5);
 for(const x of [-16,16]){box('brick2',x,.8+H+3.6,0,1.4,3,1.2);box('stone',x,.8+H+5.15,0,1.6,.2,1.4);for(const dz of [-.3,.3])round('soot',x,.8+H+5.5,dz,.15,.6);}
 box('teal',0,.8+H-.55,D/2+.07,26,.9,.06);for(let i=0;i<14;i++)box('cream',-11+i*1.7,.8+H-.55,D/2+.11,1.1,.55,.03);
 // Loading platform with crates and a sack barrow.
 box('timber',0,1.1,D/2+1.3,12,.25,2.4);for(const dx of [-5.5,5.5])box('steel',dx,.5,D/2+1.3,.2,1,2.2);
 for(const [x,z,s]of [[-4,9.0,1],[-2.8,9.2,.8],[3.6,9.0,1.1],[4.8,9.3,.7]])box('timber',x,1.25+s/2,z,s,s,s);
 box('steel',1.4,1.85,9.0,.06,1.2,.06);box('steel',1.4,1.3,9.2,.5,.06,.4);
 // ---- East: brick engine house with chimney and timing balcony (48 x 16).
 ox=65;oy=groundEast;
 const E=46,ED=14,EH=6;
 box('stone',0,.4,0,E+.6,.8,ED+.6);box('brick',0,.8+EH/2,0,E,EH,ED);
 for(let row=0;row<5;row++)box('brick2',0,1.5+row*1.2,ED/2+.012,E,.06,.02);
 for(let x=-E/2+3;x<=E/2-3;x+=4){if(Math.abs(x-10)<2.5)continue;window(x,.8+3.2,ED/2,2,3.4);}
 // Clerestory roof lantern with louvres.
 const ep=Math.atan2(2.4,ED/2),es=Math.hypot(ED/2,2.4)+.5;
 for(const side of [-1,1]){box('slate',0,.8+EH+1.2,side*ED/4,E+.8,.26,es,side*ep,0,0);part('gable','brick',side*(E/2),.8+EH,0,ED,2.4,.4,0,Math.PI/2,0);}
 box('cream',0,.8+EH+3.1,0,30,1.2,3);for(let x=-14.5;x<=14.5;x+=1)box('frame',x,.8+EH+3.1,1.52,.08,1.1,.05);box('slate',0,.8+EH+3.85,0,31,.2,3.6);
 // Tall tapered chimney with oversailing courses and a soot-stained cap.
 const cx=-17,cz=-2;box('stone',cx,1.5,cz,3.2,3,3.2);
 for(let i=0;i<8;i++){const w=2.4-i*.12;box(i%2?'brick2':'brick',cx,3+i*2.4+1.2,cz,w,2.4,w);}
 for(const dy of [0,.3])box('brick2',cx,22.4+dy,cz,1.9+dy,.3,1.9+dy);box('soot',cx,23.1,cz,1.5,.6,1.5);
 // Engine-house doors and a glazed timing balcony over them.
 box('timber',10,.8+1.9,ED/2+.06,3.4,3.8,.12);part('arch','brick2',10,.8+3.78,ED/2+.08,3.8,1.2,.16);
 box('timber',14,.8+3.4,ED/2+1.4,9,.22,2.6);for(let x=9.6;x<=18.4;x+=.55)box('steel',x,.8+4.0,ED/2+2.65,.05,1,.05);box('steel',14,.8+4.5,ED/2+2.68,9,.06,.06);
 box('glass',14,.8+5.0,ED/2+.2,7,1.6,.1);for(let x=10.6;x<=17.4;x+=1.15)box('frame',x,.8+5.0,ED/2+.27,.08,1.7,.05);
 box('teal',14,.8+6.1,ED/2+.15,8,.6,.08);for(let i=0;i<4;i++)box('cream',11.6+i*1.6,.8+6.1,ED/2+.2,1,.35,.03);
 for(const x of [-21,6,21]){round('steel',x,2.4,ED/2+1.3,.07,4.8);box('lamp',x,4.9,ED/2+1.3,.35,.35,.35);box('steel',x,5.15,ED/2+1.3,.5,.08,.5);}
 for(const [key,matrices]of batches){const [shape,finish]=key.split(':')as [Shape,Finish];const mesh=new T.InstancedMesh(geometries[shape],materials[finish],matrices.length);mesh.name='millbrook-wharf-'+key.replace(':','-');matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
