import * as T from 'three';
/** Original Willowbank Heath paddock: a corrugated Nissen-hut race office, an
 * open Dutch-barn service shed with team cars, and a tea van. Decorative only. */
export function createWillowbankPaddock(ground=0){
 const root=new T.Group();root.name='willowbank-heath-paddock';
 const half=new T.CylinderGeometry(.5,.5,1,20,1,true,0,Math.PI);
 const geometries={box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(.5,.5,1,12),half};
 const colors={iron:0x7b8478,rib:0x9aa196,timber:0x6b4e34,beam:0x3f3226,red:0x9d3a2c,cream:0xe5dcc3,glass:0x4d6a72,green:0x3f5b3a,purple:0x775a7c,straw:0xc9ae5c,rubber:0x1c1c1c,white:0xf0ece2,yellow:0xd7a83a,dark:0x2b2d2b,gravel:0x8d8778};
 type Shape=keyof typeof geometries;type Finish=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.22:key==='iron'||key==='rib'?.6:.9,metalness:key==='iron'||key==='rib'?.35:key==='glass'?.12:0,side:key==='iron'?T.DoubleSide:T.FrontSide})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D();
 for(const g of Object.values(geometries))g.computeBoundingBox();
 function part(shape:Shape,f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(65+x,ground+y,-160+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=shape+':'+f,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);bounds.push(geometries[shape].boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0)=>part('box',f,x,y,z,w,h,d,rx,ry,rz);
 const round=(f:Finish,x:number,y:number,z:number,r:number,h:number,rx=0,rz=0)=>part('round',f,x,y,z,r*2,h,r*2,rx,0,rz);
 // Gravel apron for the whole paddock.
 box('gravel',0,.04,1,44,.08,18);
 // Nissen hut (race office): half-cylinder corrugated shell along x, brick-red
 // end walls with door and windows, ribs, and a stovepipe.
 const nx=-12,nr=4.2,nl=16;
 part('half','iron',nx,0,-2,nr*2,nl,nr*2,0,0,Math.PI/2);
 for(let x=-nl/2;x<=nl/2;x+=.8)part('half','rib',nx+x,0,-2,nr*2+.12,.12,nr*2+.12,0,0,Math.PI/2);
 for(const end of [-1,1]){
  const ex=nx+end*(nl/2+.02);
  for(let i=0;i<9;i++){const yy=.25+i*.48,w=2*Math.sqrt(Math.max(0,nr*nr-yy*yy))-.1;box('red',ex,yy,-2,.12,.46,w);}
  if(end>0){box('timber',ex+.06,1.1,-2,.08,2.2,1.2);box('glass',ex+.06,2.9,-2,.06,.7,1.2);}
  for(const dz of [-2.4,2.4]){box('cream',ex+end*.06,1.8,-2+dz,.08,1.1,1.2);box('glass',ex+end*.09,1.8,-2+dz,.05,.9,1);}
 }
 // Front-facing windows cut into the shell with timber surrounds, and a porch.
 for(const x of [-4,0,4]){box('cream',nx+x,1.8,-2+3.72,1.6,1.1,.5,-.45,0,0);box('glass',nx+x,1.82,-2+3.95,1.3,.85,.12,-.45,0,0);}
 box('timber',nx+nl/2+1.4,.15,-2,2.4,.3,2.4);box('purple',nx+nl/2+1.4,2.7,-2,2.6,.12,2.6,0,0,-.12);for(const dz of [-1.1,1.1])box('beam',nx+nl/2+2.5,1.35,-2+dz,.12,2.5,.12);
 round('dark',nx-3,5.2,-3.2,.15,2.6);part('round','dark',nx-3,6.6,-3.2,.42,.15,.42);
 // Race-control board on the shell crown.
 box('white',nx,4.75,-2,7,1.1,.1);box('purple',nx,5.36,-2,7,.14,.12);for(let i=0;i<5;i++)box('dark',nx-2.6+i*1.3,4.72,-1.93,.8,.4,.04);
 // Dutch barn: steel posts, curved (gambrel) roof, open sides; three service bays.
 const bx=10,bw=22,bd=12,bh=5;
 for(let x=-bw/2;x<=bw/2+.01;x+=bw/3)for(const side of [-1,1])box('iron',bx+x,bh/2,side*bd/2-2,.3,bh,.3);
 const arc=[[-6,0,.0],[-4.6,1.55,.5],[-2.4,2.5,.25],[0,2.8,0],[2.4,2.5,-.25],[4.6,1.55,-.5],[6,0,0]];
 for(let i=0;i<arc.length-1;i++){const [z0,y0]=arc[i],[z1,y1]=arc[i+1],len=Math.hypot(z1-z0,y1-y0),tilt=Math.atan2(y1-y0,z1-z0);
  box('iron',bx,bh+(y0+y1)/2,(z0+z1)/2-2,bw+.6,.08,len+.05,-tilt,0,0);
  for(let x=-bw/2;x<=bw/2+.01;x+=bw/3)box('beam',bx+x,bh+(y0+y1)/2-.1,(z0+z1)/2-2,.16,.18,len,-tilt,0,0);}
 for(let x=-bw/2-.2;x<=bw/2+.2;x+=.5)box('rib',bx+x,bh+2.86,-2,.05,.05,.4);
 // Back wall of the barn: timber boards; bays separated by straw-bale walls.
 box('timber',bx,bh/2,-8,bw,bh,.2);for(let x=-bw/2+.4;x<bw/2;x+=.8)box('beam',bx+x,bh/2,-7.86,.06,bh,.06);
 for(const x of [-bw/6,bw/6])for(let row=0;row<3;row++)for(let k=0;k<4;k++)box('straw',bx+x,.35+row*.7,-6.6+k*2.6,1,.68,2.4);
 for(const [i,cx]of [-bw/3,0,bw/3].entries()){
  const paint:Finish=i===0?'green':i===1?'yellow':'red';
  box(paint,bx+cx,.85,-2.6,1.9,.62,4);box(paint,bx+cx,1.4,-2.85,1.75,.5,2.1);box('glass',bx+cx,1.42,-1.78,1.55,.4,.06,-.55,0,0);box('glass',bx+cx,1.42,-3.92,1.55,.4,.06,.55,0,0);
  for(const dx of [-.88,.88])box('glass',bx+cx+dx,1.44,-2.85,.05,.34,1.8);
  for(const dx of [-1,1])for(const dz of [-1.3,1.3])round('rubber',bx+cx+dx,.38,-2.6+dz,.34,.26,0,Math.PI/2);
  box('timber',bx+cx-2.6,.9,-6.6,2.2,.1,.9);for(let t=0;t<3;t++)round('rubber',bx+cx+2.6,.3+t*.5,-6.6,.33,.24,Math.PI/2);
 }
 // Tea van with serving hatch, awning and picnic benches.
 const tx=-1,tz=6.2;box('cream',tx,1.55,tz,4.2,2.3,2.2);box('purple',tx,2.85,tz,4.3,.35,2.3);box('dark',tx,1.85,tz+1.11,2.6,1,.06);box('timber',tx,1.3,tz+1.4,2.8,.08,.6);
 box('purple',tx,2.55,tz+1.8,3,.06,1.4,-.3,0,0);for(const dx of [-1.4,1.4])box('beam',tx+dx,1.3,tz+2.4,.06,1.6,.06);
 for(const side of [-1,1])round('rubber',tx+side*1.3,.4,tz,.4,.3,Math.PI/2);box('dark',tx-2.6,.55,tz,1.2,.12,.12);
 for(const [x,z]of [[-8,7.6],[-4.5,8.4],[3.5,8.2]]){box('timber',x,.75,z,2.4,.08,.8);for(const s of [-1,1])box('timber',x,.45,z+s*.75,2.4,.06,.32);for(const dx of [-.9,.9])box('beam',x+dx,.38,z,.08,.76,1.7);}
 // Bunting between the hut and barn.
 for(let i=0;i<14;i++){const x=nx+nl/2+1+i*1.15,y=5.2-Math.sin(i/13*Math.PI)*.7;box((['purple','yellow','white','red']as const)[i%4],x,y,1.2,.5,.5,.04,0,0,Math.PI/4);}
 for(const [key,matrices]of batches){const [shape,finish]=key.split(':')as [Shape,Finish];const mesh=new T.InstancedMesh(geometries[shape],materials[finish],matrices.length);mesh.name='willowbank-paddock-'+key.replace(':','-');matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
