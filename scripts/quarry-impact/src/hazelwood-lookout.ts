import * as T from 'three';
/** Original timber lookout for the forest infield, outside the racing route. */
export function createHazelwoodLookout(){
 const root=new T.Group();root.name='hazelwood-timber-lookout';
 const shapes={box:new T.BoxGeometry(1,1,1),roof:new T.ConeGeometry(.5,1,4)};
 const colors={wood:0x806343,dark:0x504a39,stone:0xa5a38d,metal:0x4b5653,roof:0x6d7967,glass:0x527079,cream:0xc7b38c};type F=keyof typeof colors;type S=keyof typeof shapes;
 const materials=Object.fromEntries(Object.entries(colors).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:k==='glass'?.3:.9})])) as Record<F,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),dummy=new T.Object3D(),bounds:T.Box3[]=[],extras:T.Mesh[]=[];
 function add(shape:S,finish:F,m:T.Matrix4){const key=shape+':'+finish,b=batches.get(key)??[];b.push(m.clone());batches.set(key,b);shapes[shape].computeBoundingBox();bounds.push(shapes[shape].boundingBox!.clone().applyMatrix4(m));}
 function box(f:F,x:number,y:number,z:number,w:number,h:number,d:number){dummy.position.set(x,y,z);dummy.rotation.set(0,0,0);dummy.scale.set(w,h,d);dummy.updateMatrix();add('box',f,dummy.matrix);}
 function beam(f:F,a:number[],b:number[],width=.25){const p=new T.Vector3(...a as[number,number,number]),q=new T.Vector3(...b as[number,number,number]),v=q.clone().sub(p);dummy.position.copy(p.add(q).multiplyScalar(.5));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize());dummy.scale.set(width,v.length(),width);dummy.updateMatrix();add('box',f,dummy.matrix);}
 const cx=8,cz=-10;
 // Wide stone feet intersect terrain; the tapered legs rise to the viewing platform.
 for(const sx of [-1,1])for(const sz of [-1,1]){box('stone',cx+sx*6,2.5,cz+sz*6,2,5,2);beam('wood',[cx+sx*6,4,cz+sz*6],[cx+sx*4.2,29,cz+sz*4.2],.65);}
 for(let level=0;level<4;level++){
  const y=5+level*6,r=6-level*.45,next=r-.45;
  for(const side of [-1,1]){
   beam('dark',[cx-r,y,cz+side*r],[cx+next,y+6,cz+side*next],.24);
   beam('dark',[cx+r,y,cz+side*r],[cx-next,y+6,cz+side*next],.24);
   beam('dark',[cx+side*r,y,cz-r],[cx+side*next,y+6,cz+next],.24);
   beam('dark',[cx+side*r,y,cz+r],[cx+side*next,y+6,cz-next],.24);
   beam('wood',[cx-r,y,cz+side*r],[cx+r,y,cz+side*r],.3);
  }
 }
 for(let i=0;i<7;i++)box('wood',cx-1.5,3.1+i*.3,cz-7.4+i*.45,2.2,.16,.5);
 // Four six-metre stair flights alternate direction, each with a landing and handrail.
 for(let flight=0;flight<4;flight++){
  const y=5+flight*6,dir=flight%2? -1:1,x=cx+(flight%2?1.5:-1.5);
  for(let step=0;step<20;step++)box('wood',x,y+(step+.5)*.3,cz+dir*(-4.5+(step+.5)*.45),2.2,.12,.5);
  for(const side of [-1,1]){beam('dark',[x+side*1.05,y,cz-dir*4.5],[x+side*1.05,y+6,cz+dir*4.5],.2);beam('wood',[x+side*1.05,y+1.1,cz-dir*4.5],[x+side*1.05,y+7.1,cz+dir*4.5],.12);for(let i=0;i<=4;i++)box('wood',x+side*1.05,y+i*1.5+.55,cz+dir*(-4.5+i*2.25),.1,1.1,.1);}
  box('wood',cx,y+6,cz+dir*4.5,6,.2,2);
 }
 box('wood',cx,29,cz,13,.4,13);box('wood',cx,31.4,cz,8.5,4.4,8.5);
 for(const side of [-1,1]){
  box('glass',cx,32,cz+side*4.32,7.7,2.5,.1);box('glass',cx+side*4.32,32,cz,.1,2.5,7.7);
  for(const t of [-3.7,-1.85,0,1.85,3.7]){box('cream',cx+t,32,cz+side*4.4,.13,2.7,.13);box('cream',cx+side*4.4,32,cz+t,.13,2.7,.13);}
  for(let t=-6;t<=6;t+=1.5){box('wood',cx+t,29.8,cz+side*6,.1,1.4,.1);box('wood',cx+side*6,29.8,cz+t,.1,1.4,.1);}
  box('cream',cx,30.55,cz+side*6,12.2,.15,.15);box('cream',cx+side*6,30.55,cz,.15,.15,12.2);
  for(let y=29.5;y<30.9;y+=.22)box('dark',cx,y,cz+side*4.31,8.5,.035,.05);
 }
 box('dark',cx,30.4,cz-4.43,1.6,2.5,.13);box('cream',cx+1.0,30.4,cz-4.45,.12,2.7,.15);
 dummy.position.set(cx,36,cz);dummy.rotation.set(0,Math.PI/4,0);dummy.scale.set(16,5,16);dummy.updateMatrix();add('roof','roof',dummy.matrix);
 box('metal',cx+2,39.5,cz,.1,5,.1);box('cream',cx+2,40.8,cz,2.5,.15,.15);box('metal',cx+2,39.7,cz,1.6,.15,.15);
 if(typeof document!=='undefined'){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=192;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#c7b38c';ctx.fillRect(0,0,1024,192);ctx.fillStyle='#364b40';ctx.textAlign='center';ctx.font='bold 65px sans-serif';ctx.fillText('HAZELWOOD LOOKOUT',512,85);ctx.font='bold 37px sans-serif';ctx.fillText('WE SPOT FIRES. AND BAD DRIVING.',512,151);const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;const sign=new T.Mesh(new T.PlaneGeometry(11,2.06),new T.MeshStandardMaterial({map:t,roughness:.9}));sign.position.set(cx,27.8,cz-6.1);sign.rotation.y=Math.PI;root.add(sign);extras.push(sign);}
 for(const[key,ms]of batches){const[shape,finish]=key.split(':') as[S,F];const mesh=new T.InstancedMesh(shapes[shape],materials[finish],ms.length);ms.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;root.userData.pieces=bounds.length;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(shapes).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());extras.forEach(mesh=>{mesh.geometry.dispose();const m=mesh.material as T.MeshStandardMaterial;m.map?.dispose();m.dispose();});root.clear();}};
}
