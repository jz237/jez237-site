import * as T from 'three';
/** Trackside aggregate works, authored as shared instanced geometry. */
export function createCopperfieldPlant(){
 const root=new T.Group();root.name='copperfield-aggregate-works';
 const geometries={box:new T.BoxGeometry(1,1,1),cylinder:new T.CylinderGeometry(.5,.5,1,16),cone:new T.ConeGeometry(.5,1,16),ring:new T.TorusGeometry(.5,.015,4,24)};
 const colors={steel:0x475455,cream:0xbab59d,red:0x884c3b,yellow:0xc59b49,dark:0x303d3d,glass:0x344f58,stone:0x8c8271};type S=keyof typeof geometries;type F=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:k==='glass'?.3:.88,metalness:k==='steel'?.3:0})])) as Record<F,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),dummy=new T.Object3D(),bounds:T.Box3[]=[],origin=new T.Vector3(-252,6,-92),extra:T.Mesh[]=[];
 function matrix(shape:S,finish:F,m:T.Matrix4){const key=shape+':'+finish,list=batches.get(key)??[];list.push(m.clone());batches.set(key,list);geometries[shape].computeBoundingBox();bounds.push(geometries[shape].boundingBox!.clone().applyMatrix4(m));}
 function part(shape:S,f:F,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(x+origin.x,y+origin.y,z+origin.z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();matrix(shape,f,dummy.matrix);}
 const box=(f:F,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0)=>part('box',f,x,y,z,w,h,d,rx,ry,rz);
 function beam(f:F,a:number[],b:number[],width=.2,depth=width){const p=new T.Vector3(...a as[number,number,number]).add(origin),q=new T.Vector3(...b as[number,number,number]).add(origin),v=q.clone().sub(p);dummy.position.copy(p.add(q).multiplyScalar(.5));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize());dummy.scale.set(width,v.length(),depth);dummy.updateMatrix();matrix('box',f,dummy.matrix);}
 // Concrete footings and exposed trestles support the screening hall.
 box('stone',0,-1.5,0,29,9,23);box('stone',21,-3,0,10,6,15);box('stone',15,-3,0,4,6,10);
 for(const x of [-12,0,12])for(const z of [-9,9]){box('steel',x,6,z,.6,12,.6);box('cream',x,.4,z,2,.8,2);}
 for(const z of [-9,9])for(const x of [-12,0]){beam('steel',[x,1,z],[x+12,11,z],.23);beam('steel',[x,11,z],[x+12,1,z],.23);}
 for(const x of [-12,12]){beam('steel',[x,1,-9],[x,11,9],.23);beam('steel',[x,11,-9],[x,1,9],.23);}
 box('red',0,17,0,25,11,19);box('steel',0,11.4,0,28,.6,22);box('cream',0,22.7,0,28,.4,22);
 for(let z=-9;z<=9;z+=1)box('cream',12.55,17,z,.08,10.8,.10);
 for(let x=-12;x<=12;x+=1)box('red',x,23,0,.08,.1,22);
 for(const z of [-6,0,6]){box('cream',12.7,19,z,.2,3.2,4.3);box('glass',12.84,19,z,.1,2.8,3.9);box('cream',12.93,19,z,.1,2.8,.12);}
 // Twin storage silos with bands, conical feed hoppers and access ladders.
 for(const z of [-12,12]){
  const x=-25;
  for(const dx of [-3.7,3.7])for(const dz of [-3.7,3.7]){box('steel',x+dx,7,z+dz,.4,14,.4);box('stone',x+dx,-.5,z+dz,2,5,2);}
  part('cylinder','cream',x,22,z,10,21,10);part('cone','red',x,9.5,z,10,5,10,Math.PI);part('cone','steel',x,33.5,z,10,2,10);
  for(const y of [12,17,22,27,32])part('ring','steel',x,y,z,10.1,10.1,10.1,Math.PI/2);
  for(const dx of [-.55,.55])box('steel',x+dx,22,z+5.15,.13,24,.13);
  for(let y=10;y<34;y+=.55)box('yellow',x,y,z+5.2,1.2,.1,.1);
  for(const y of [16,20,24,28,32])part('ring','steel',x,y,z+5.25,2.1,2.1,2.1,Math.PI/2);
  box('dark',x,5.5,z,1.8,3,1.8);
 }
 // Wraparound catwalk and prominent safety rails.
 for(const x of [-14.5,14.5]){box('steel',x,12,0,2,.2,23);for(const y of [12.65,13.3])box('yellow',x+(x>0?1:-1),y,0,.1,.1,23);for(let z=-11;z<=11;z+=2.75)box('yellow',x+(x>0?1:-1),12.65,z,.1,1.3,.1);}
 box('steel',0,12,11,31,.2,2);for(const y of [12.65,13.3])box('yellow',0,y,12,31,.1,.1);for(let x=-15;x<=15;x+=3)box('yellow',x,12.65,12,.1,1.3,.1);
 // Industrial stair flights; each tread has grounded steel stringers.
 for(let flight=0;flight<2;flight++){const x=19+flight*4,dir=flight?-1:1;for(let i=0;i<16;i++)box('steel',x,flight*6+i*.375,dir*(i*.7-5.25),3,.15,.75);for(const dx of [-1.5,1.5]){beam('steel',[x+dx,flight*6,-dir*5.25],[x+dx,flight*6+5.7,dir*5.25],.18);beam('yellow',[x+dx,flight*6+1.2,-dir*5.25],[x+dx,flight*6+6.9,dir*5.25],.1);}}
 box('steel',21,6,6,7,.2,2);box('steel',19,12,-6,10,.2,2);
 // Concrete access steps descend from the stair plinth to the yard.
 for(let i=0;i<11;i++){const top=5.5-i*.5;box('stone',26.5+i*.8,top/2-origin.y,0,.9,top,6);}
 // Discharge conveyor reaches toward the existing aggregate-yard equipment.
 const a=[0,13,12],b=[10,8,54];beam('dark',a,b,2.8,.35);
 for(const side of [-1,1]){beam('steel',[-2*side,13,12],[10-2*side,8,54],.25);for(let i=0;i<7;i++){const t=i/6,x=10*t-2*side,y=13-5*t,z=12+42*t;box('steel',x,(origin.y+y)/2-origin.y,z,.3,origin.y+y,.3);if(i<6)beam('steel',[x,1,z],[10*(t+1/6)-2*side,13-5*(t+1/6),z+7],.13);}}
 if(typeof document!=='undefined'){const c=document.createElement('canvas');c.width=1536;c.height=384;const ctx=c.getContext('2d')!;ctx.fillStyle='#c8b991';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#813f30';ctx.fillRect(0,0,c.width,30);ctx.fillStyle='#293638';ctx.textAlign='center';ctx.font='900 100px sans-serif';ctx.fillText('STONE COLD',768,155);ctx.font='bold 64px sans-serif';ctx.fillText('AGGREGATES',768,240);ctx.font='bold 34px sans-serif';ctx.fillText('WE CRUSH IT. YOU CRASH IT.',768,325);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(new T.PlaneGeometry(16,4),new T.MeshStandardMaterial({map:texture,roughness:.9}));mesh.position.copy(origin).add(new T.Vector3(12.95,15,0));mesh.rotation.y=Math.PI/2;root.add(mesh);extra.push(mesh);}
 for(const[key,ms]of batches){const[shape,finish]=key.split(':')as[S,F];const mesh=new T.InstancedMesh(geometries[shape],materials[finish],ms.length);ms.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;root.userData.pieces=bounds.length;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());extra.forEach(m=>{m.geometry.dispose();const mat=m.material as T.MeshStandardMaterial;mat.map?.dispose();mat.dispose();});root.clear();}};
}
