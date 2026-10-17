import * as T from 'three';
/** Open-sided octagonal timber shelters; all positions remain inside the old pavilion footprint. */
export function createKingswellBandstands(sites:ReadonlyArray<{x:number;y:number;z:number}>){
 const root=new T.Group();root.name='kingswell-bandstands';
 const geometries={box:new T.BoxGeometry(1,1,1),base:new T.CylinderGeometry(1,1,1,8),roof:new T.ConeGeometry(1,1,8,1,true)};
 const colors={stone:0xa49d87,wood:0x81705a,cream:0xd7c9a5,roof:0x804b3c,metal:0x384d4e};type Shape=keyof typeof geometries;type Finish=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:.88,side:key==='roof'?T.DoubleSide:T.FrontSide})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),dummy=new T.Object3D(),bounds:T.Box3[]=[];
 function part(shape:Shape,finish:Finish,p:T.Vector3,scale:T.Vector3,q=new T.Quaternion()){
  dummy.position.copy(p);dummy.quaternion.copy(q);dummy.scale.copy(scale);dummy.updateMatrix();const key=shape+':'+finish,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);
  geometries[shape].computeBoundingBox();bounds.push(geometries[shape].boundingBox!.clone().applyMatrix4(dummy.matrix));
 }
 for(const site of sites){
  const origin=new T.Vector3(site.x,site.y,site.z),v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z).add(origin);
  const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,yaw=0)=>part('box',f,v(x,y,z),new T.Vector3(w,h,d),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),yaw));
  const beam=(f:Finish,a:T.Vector3,b:T.Vector3,w:number,d=w)=>{const delta=b.clone().sub(a);part('box',f,a.clone().add(b).multiplyScalar(.5),new T.Vector3(w,delta.length(),d),new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize()));};
  part('base','stone',v(0,.25,0),new T.Vector3(8.5,.5,8.5));
  part('base','wood',v(0,.62,0),new T.Vector3(7.8,.24,7.8));
  // Plank seams follow the octagonal platform without protruding past its sides.
  const apothem=7.8*Math.cos(Math.PI/8);
  for(let x=-6.9;x<=6.9;x+=.6){const extent=Math.min(apothem,(apothem-Math.abs(x)*Math.sin(Math.PI/4))/Math.cos(Math.PI/4));box('metal',x,.746,0,.018,.008,extent*2);}
  part('roof','roof',v(0,6.1,0),new T.Vector3(9.4,3,9.4));
  for(let i=0;i<8;i++){
   const a=i*Math.PI/4,b=(i+1)*Math.PI/4,px=Math.sin(a)*6,pz=Math.cos(a)*6,qx=Math.sin(b)*6,qz=Math.cos(b)*6;
   box('cream',px,2.7,pz,.34,4,.34);box('stone',px,.98,pz,.6,.5,.6);box('cream',px,4.55,pz,.65,.35,.65);
   beam('wood',v(px,4.5,pz),v(qx,4.5,qz),.28,.42);
   beam('wood',v(px,4.6,pz),v(0,7.5,0),.18,.25);
   beam('metal',v(Math.sin(a)*9.4,4.61,Math.cos(a)*9.4),v(0,7.62,0),.065);
   beam('cream',v(Math.sin(a)*9.35,4.6,Math.cos(a)*9.35),v(Math.sin(b)*9.35,4.6,Math.cos(b)*9.35),.18,.26);
   // Decorative corbels below the upper beams.
   for(const t of [.22,.78]){const xx=px+(qx-px)*t,zz=pz+(qz-pz)*t;beam('cream',v(t<.5?px:qx,3.6,t<.5?pz:qz),v(xx,4.45,zz),.14);}
   if(i===0||i===4)continue; // Opposite open entrances.
   for(const h of [1.05,1.9])beam('cream',v(px,h,pz),v(qx,h,qz),.12);
   for(let n=1;n<9;n++){const t=n/9;box('cream',px+(qx-px)*t,1.48,pz+(qz-pz)*t,.07,.85,.07);}
   const mid=a+Math.PI/8,r=5.1,cx=Math.sin(mid)*r,cz=Math.cos(mid)*r;
   box('wood',cx,1.15,cz,3.5,.18,.65,mid);box('wood',cx+Math.sin(mid)*.27,1.6,cz+Math.cos(mid)*.27,3.5,.55,.1,mid);
   for(const side of [-1,1])box('metal',cx+Math.cos(mid)*side*1.2,.91,cz-Math.sin(mid)*side*1.2,.12,.5,.55,mid);
  }
  for(const a of [Math.PI/8,Math.PI+Math.PI/8])for(let step=0;step<3;step++){const r=6.3+step*.8,h=.6-step*.2;box('stone',Math.sin(a)*r,h/2,Math.cos(a)*r,3.6,h,.85,a);}
  box('cream',0,7.95,0,.16,1,.16);box('metal',0,8.45,0,1.8,.12,.12);box('metal',.6,8.65,0,.5,.45,.08);
 }
 for(const [key,ms]of batches){const [shape,finish]=key.split(':') as [Shape,Finish];const mesh=new T.InstancedMesh(geometries[shape],materials[finish],ms.length);mesh.name='bandstand-'+key;ms.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;root.userData.sites=sites;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
