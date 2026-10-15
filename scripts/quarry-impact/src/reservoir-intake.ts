import * as T from 'three';
/** A waterworks intake tower and shore access bridge, beyond the racing corridor. */
export function createReservoirIntake(){
 const root=new T.Group();root.name='bramblebrook-intake-tower';
 const geometries={box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(.5,.5,1,20),roof:new T.ConeGeometry(.5,1,4)};
 const colors={stone:0xaaa48b,brick:0x84604b,metal:0x3b5155,glass:0x4e7076,roof:0x536960,yellow:0xc5a54e,red:0x9c5741};type F=keyof typeof colors;type G=keyof typeof geometries;
 const materials=Object.fromEntries(Object.entries(colors).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:k==='glass'?.3:.9,metalness:k==='metal'?.4:0})])) as Record<F,T.MeshStandardMaterial>;
 const batches=new Map<string,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D(),extras:T.Mesh[]=[];
 function part(shape:G,f:F,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(x,y,z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=shape+':'+f,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);const geo=geometries[shape];geo.computeBoundingBox();bounds.push(geo.boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:F,x:number,y:number,z:number,w:number,h:number,d:number,rz=0)=>part('box',f,x,y,z,w,h,d,0,0,rz);
 // Deep plinth meets the modelled reservoir bed, beneath the visible water surface.
 box('stone',70,-1,265,18,14,18);box('brick',70,15,265,14,18,14);
 for(const y of [6.2,12,18,24])box('stone',70,y,265,14.6,.5,14.6);
 for(const side of [-1,1])for(const y of [9,15,21])for(const offset of [-4,0,4]){
  box('stone',70+offset,y,265+side*7.08,2.5,3.5,.3);box('glass',70+offset,y,265+side*7.26,1.9,2.9,.08);box('metal',70+offset,y,265+side*7.32,.1,3,.08);
  box('stone',70+side*7.08,y,265+offset,.3,3.5,2.5);box('glass',70+side*7.26,y,265+offset,.08,2.9,1.9);
 }
 // Pyramidal copper roof, ventilator and weather vane.
 part('roof','roof',70,27,265,24,6,24,0,Math.PI/4);part('round','metal',70,31,265,2,3,2);part('roof','roof',70,33,265,4,1.8,4,0,Math.PI/4);box('metal',70,35.2,265,.12,4,.12);box('yellow',70,36,265,3,.18,.12);
 // Perimeter service platform, hoist and exposed intake pipes.
 box('stone',70,5,265,22,.8,22);
 for(const side of [-1,1]){
  for(let x=60;x<=80;x+=2.5)if(side>0||Math.abs(x-70)>2.5)box('metal',x,6.2,265+side*10.5,.1,1.6,.1);
  for(const y of [5.8,6.9]){if(side>0)box('metal',70,y,275.5,21,.1,.1);else for(const x of [63.5,76.5])box('metal',x,y,254.5,8,.1,.1);}
  for(let z=257;z<=273;z+=2.5)box('metal',70+side*10.5,6.2,z,.1,1.6,.1);
  for(const y of [5.8,6.9])box('metal',70+side*10.5,y,265,.1,.1,21);
 }
 for(const x of [64,76]){part('round','metal',x,0,275,1.6,12,1.6);part('round','yellow',x,5.8,275,2,.3,2);}
 box('yellow',78,9.2,272,.4,8,.4);box('yellow',75,13.3,272,6.5,.4,.4);box('metal',72,10.8,272,.08,5,.08);
 // Shore bridge with repeated piers, two handrails and open side trusses.
 box('stone',70,3.8,217,5, .6,76);
 for(const z of [180,194,208,222,236,250]){for(const x of [68.3,71.7])box('stone',x,-1,z,.7,9,.9);box('metal',70,3.3,z,5,.5,1);}
 for(const side of [-1,1]){
  const x=70+side*2.3;
  for(let z=180;z<=254;z+=3.7)box('metal',x,4.8,z,.12,1.7,.12);
  for(const y of [4.5,5.65])box('metal',x,y,217,.12,.12,76);
  for(let z=180;z<254;z+=7.4){
   const beam=new T.Object3D(),a=new T.Vector3(x,3.4,z),b=new T.Vector3(x,5.5,z+7.4),v=b.clone().sub(a);beam.position.copy(a.add(b).multiplyScalar(.5));beam.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize());beam.scale.set(.12,v.length(),.12);beam.updateMatrix();const key='box:metal',list=batches.get(key)??[];list.push(beam.matrix.clone());batches.set(key,list);bounds.push(new T.Box3(new T.Vector3(-.5,-.5,-.5),new T.Vector3(.5,.5,.5)).applyMatrix4(beam.matrix));
  }
 }
 for(let i=0;i<6;i++)box('stone',70,2.9+i*.2,177+i*.5,4,.3,.55);
 // Gentle platform steps connect bridge height to the tower landing.
 for(let i=0;i<5;i++)box('stone',70,4.1+i*.22,253+i*.6,4,.3,.65);
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#d3c6a1';ctx.fillRect(0,0,1024,256);ctx.fillStyle='#355157';ctx.font='bold 65px sans-serif';ctx.textAlign='center';ctx.fillText('BRAMBLEBROOK WATER',512,100);ctx.font='bold 41px sans-serif';ctx.fillText('REFILL YOUR RADIATOR. NOT THE LAKE.',512,190);const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;const sign=new T.Mesh(new T.PlaneGeometry(13,3.25),new T.MeshStandardMaterial({map:tex,roughness:.9}));sign.position.set(70,24.8,257.5);sign.rotation.y=Math.PI;root.add(sign);extras.push(sign);
 }
 for(const[key,ms]of batches){const[shape,f]=key.split(':') as [G,F];const mesh=new T.InstancedMesh(geometries[shape],materials[f],ms.length);ms.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;root.userData.pieces=bounds.length;let disposed=false;
 return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());for(const mesh of extras){mesh.geometry.dispose();const m=mesh.material as T.MeshStandardMaterial;m.map?.dispose();m.dispose();}root.clear();}};
}
