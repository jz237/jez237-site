import * as T from 'three';
/** Static aggregate conveyor with a common belt frame, so rollers, rails and drives follow its grade. */
export function createAggregateConveyor(start:T.Vector3,end:T.Vector3){
 const root=new T.Group();root.name='aggregate-discharge-conveyor';
 const forward=end.clone().sub(start),length=forward.length();
 if(length<1||!Number.isFinite(length))throw new Error('Conveyor endpoints must be finite and at least one metre apart');
 forward.normalize();const right=new T.Vector3(forward.z,0,-forward.x);if(right.length()<1e-6)throw new Error('Conveyor needs a horizontal run');right.normalize();
 const up=new T.Vector3().crossVectors(forward,right),rotation=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(right,up,forward));
 const geometry={box:new T.BoxGeometry(1,1,1),roller:new T.CylinderGeometry(.5,.5,1,12)},palette={steel:0x485659,belt:0x293534,yellow:0xc59b49,motor:0x8d4b39,concrete:0xaaa18b};type S=keyof typeof geometry;type F=keyof typeof palette;
 const materials=Object.fromEntries(Object.entries(palette).map(([f,color])=>[f,new T.MeshStandardMaterial({color,roughness:f==='belt'?.98:.83,metalness:f==='steel'?.35:0})])) as Record<F,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D();
 const point=(x:number,y:number,z:number)=>start.clone().addScaledVector(right,x).addScaledVector(up,y).addScaledVector(forward,z);
 function put(shape:S,finish:F,position:T.Vector3,scale:T.Vector3,q:T.Quaternion){dummy.position.copy(position);dummy.scale.copy(scale);dummy.quaternion.copy(q);dummy.updateMatrix();const key=shape+':'+finish,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);geometry[shape].computeBoundingBox();bounds.push(geometry[shape].boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:F,x:number,y:number,z:number,w:number,h:number,d:number)=>put('box',f,point(x,y,z),new T.Vector3(w,h,d),rotation);
 const roll=(f:F,x:number,y:number,z:number,width:number,diameter:number)=>put('roller',f,point(x,y,z),new T.Vector3(diameter,width,diameter),rotation.clone().multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),Math.PI/2)));
 function beam(a:T.Vector3,b:T.Vector3,width:number){const d=b.clone().sub(a);put('box','steel',a.clone().add(b).multiplyScalar(.5),new T.Vector3(width,d.length(),width),new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.normalize()));}
 // Separate upper transport and lower return belts, with exposed drums at both ends.
 box('belt',0,.25,length/2,2.8,.12,length);box('belt',0,-.45,length/2,2.8,.1,length);
 for(const z of [0,length]){roll('belt',0,-.1,z,3,.7);roll('steel',0,-.1,z,4,.16);for(const x of [-1.8,1.8])box('yellow',x,-.12,z,.4,.6,.8);}
 for(let z=1;z<length;z+=1.6){roll('steel',0,.03,z,3.4,.3);if(Math.round(z/1.6)%3===0)roll('steel',0,-.58,z,3.3,.24);}
 // Twin trusses and one-sided maintenance walk, with toe boards and two-height rails.
 for(const x of [-1.8,1.8])for(const y of [-.9,.05])box('steel',x,y,length/2,.16,.16,length);
 box('steel',2.65,-.12,length/2,1.2,.18,length);box('yellow',3.25,.08,length/2,.08,.3,length);
 for(const y of [.6,1.15])box('yellow',3.25,y,length/2,.08,.08,length);
 const panels=Math.ceil(length/3.5),step=length/panels;
 for(let i=0;i<=panels;i++){
  const z=i*step;box('yellow',3.25,.5,z,.09,1.3,.09);box('steel',0,-.9,z,4,.16,.16);
  if(i<panels)for(const x of [-1.8,1.8])beam(point(x,-.9,z),point(x,.05,z+step),.1);
 }
 // Frame-aligned legs extend below the local terrain; concrete shoes anchor their bases.
 for(let i=0;i<=6;i++)for(const x of [-1.8,1.8]){const z=length*i/6,p=point(x,-.9,z),foot=new T.Vector3(p.x,.3,p.z);beam(foot,p,.28);put('box','concrete',new T.Vector3(p.x,.15,p.z),new T.Vector3(1.2,.3,1.2),new T.Quaternion());if(i<6)beam(foot,point(x,-.9,z+length/6),.14);}
 // Gearbox, finned drive motor and coupling guard at the discharge end.
 box('steel',-2.8,-.6,length-.8,2,.25,2.2);box('yellow',-2.25,-.05,length,.8,.9,.9);
 roll('motor',-3,-.05,length,1,.72);for(let x=-3.4;x<=-2.6;x+=.13)roll('steel',x,-.05,length,.035,.82);
 box('steel',-3,.45,length,.45,.2,.4);box('yellow',-2.3,.55,length,.13,.1,1.4);
 for(const [key,ms]of batches){const[shape,finish]=key.split(':')as[S,F];const mesh=new T.InstancedMesh(geometry[shape],materials[finish],ms.length);mesh.name='conveyor-'+key;ms.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;root.userData.length=length;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometry).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
