import * as T from 'three';
import {FAIRGROUND as course} from './county-courses';
/** Original fairground wheel with double rims, triangulated spokes and enclosed cabins. */
export function createFairWheel(){
 const root=new T.Group();root.name='county-fair-wheel';const ox=-40,oz=0,ground=course.height(ox,oz);
 const geometries={box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(.5,.5,1,12),ring:new T.TorusGeometry(16,.16,6,96)};
 const colors={cream:0xe0d1a8,red:0xa74028,ochre:0xcb9638,steel:0x536062,dark:0x263934,glass:0x617f84,concrete:0x8b8877};
 type F=keyof typeof colors;type G=keyof typeof geometries;
 const mats=Object.fromEntries(Object.entries(colors).map(([f,color])=>[f,new T.MeshStandardMaterial({color,roughness:f==='glass'?.3:.85,metalness:f==='steel'?.35:0})])) as Record<F,T.MeshStandardMaterial>;
 const batches=new Map<string,{g:G;f:F;ms:T.Matrix4[]}>(),dummy=new T.Object3D(),bounds:T.Box3[]=[],extras:T.Mesh[]=[],textures:T.Texture[]=[];
 function add(g:G,f:F,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(ox+x,ground+y,oz+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=g+f,b=batches.get(key)??{g,f,ms:[]};b.ms.push(dummy.matrix.clone());batches.set(key,b);geometries[g].computeBoundingBox();bounds.push(geometries[g].boundingBox!.clone().applyMatrix4(dummy.matrix));}
 const box=(f:F,x:number,y:number,z:number,w:number,h:number,d:number)=>add('box',f,x,y,z,w,h,d);
 function beam(f:F,a:number[],b:number[],width=.18){const p=new T.Vector3(...a as[number,number,number]),q=new T.Vector3(...b as[number,number,number]),v=q.clone().sub(p);dummy.position.copy(p.add(q).multiplyScalar(.5)).add(new T.Vector3(ox,ground,oz));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize());dummy.scale.set(width,v.length(),width);dummy.updateMatrix();const key='box'+f,batch=batches.get(key)??{g:'box' as G,f,ms:[]};batch.ms.push(dummy.matrix.clone());batches.set(key,batch);bounds.push(new T.Box3(new T.Vector3(-.5,-.5,-.5),new T.Vector3(.5,.5,.5)).applyMatrix4(dummy.matrix));}
 // Trailer foundations and wide A-frame bearing supports.
 box('concrete',0,.1,0,28,.35,19);box('red',0,.65,0,26,.8,15);
 for(const z of [-5.4,5.4]){for(const side of [-1,1]){beam('steel',[side*9,1,z],[0,20,z],.65);box('cream',side*9,1,z,2.6,.7,2.2);beam('cream',[side*6,7,z],[0,10,z],.18);}beam('steel',[-9,2,z],[9,2,z],.28);}
 add('round','steel',0,20,0,1.9,13,1.9,Math.PI/2);
 // Paired rims and diagonal bracing retain an open silhouette.
 for(const z of [-2.2,2.2]){
  add('ring','cream',0,20,z,1,1,1);
  for(let i=0;i<16;i++){const a=i*Math.PI/8,x=Math.cos(a)*16,y=20+Math.sin(a)*16,b=a+Math.PI/8;
   beam(i%2?'cream':'ochre',[0,20,z],[x,y,z],.14);
   beam('steel',[Math.cos(a)*8,20+Math.sin(a)*8,z],[Math.cos(b)*16,20+Math.sin(b)*16,z],.09);
   beam('cream',[x,y,-2.2],[x,y,2.2],.14);
  }
 }
 // Sixteen upright gondolas: roofs, benches, windows, door frames and hangers.
 for(let i=0;i<16;i++){
  const a=i*Math.PI/8,x=Math.cos(a)*16,y=20+Math.sin(a)*16,f:F=i%2?'red':'ochre';
  box('steel',x,y-.55,0,.15,1.2,.15);box(f,x,y-2,0,2.65,1,3.6);box('dark',x,y-2.55,0,2.9,.16,3.8);box('cream',x,y-.75,0,3,.18,4);
  for(const z of [-1.75,1.75]){box('glass',x,y-1.25,z,2.35,.8,.04);for(const dx of [-1.25,0,1.25])box('cream',x+dx,y-1.2,z,.065,1.25,.07);box('cream',x,y-1.7,z,2.6,.08,.1);}
  for(const dx of [-1.28,1.28]){box('glass',x+dx,y-1.25,0,.04,.8,3.4);for(const z of [-1.7,1.7])box('cream',x+dx,y-1.25,z,.07,1.3,.07);}
 }
 // Loading platform, stairs, queue rails and the ticket hut.
 box('dark',0,1.1,7,13,.25,5);for(let i=0;i<4;i++)box('cream',0,.2+i*.22,11-i*.6,5,.25,.65);
 for(const x of [-6,6]){box('cream',x,1.7,7,.12,1.2,.12);box('cream',x,2.3,7,.12,.12,5);}
 for(const z of [13,16])for(let x=-12;x<=12;x+=3){box('steel',x,.75,z,.08,1.5,.08);if(x<12)box('cream',x+1.5,1.5,z,3,.09,.09);}
 box('red',20,1.7,7,5,3.4,4);box('cream',20,3.5,7,5.6,.25,4.6);box('dark',20,2.15,9.02,3.9,1.2,.06);box('cream',20,1.45,9.2,4.3,.15,.65);
 if(typeof document!=='undefined'){
  const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle='#913c2b';ctx.fillRect(0,0,1024,256);ctx.fillStyle='#ead5a0';ctx.font='bold 78px sans-serif';ctx.textAlign='center';ctx.fillText('THE SPARE WHEEL',512,107,980);ctx.font='bold 34px sans-serif';ctx.fillText('ALL THE THRILLS. FEWER INSURANCE CLAIMS.',512,184,975);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.push(t);
  for(const side of [-1,1]){const m=new T.Mesh(new T.PlaneGeometry(19,4.75),new T.MeshStandardMaterial({map:t,roughness:1}));m.position.set(ox,ground+5,side*6);m.rotation.y=side<0?Math.PI:0;root.add(m);extras.push(m);}
 }
 for(const b of batches.values()){const m=new T.InstancedMesh(geometries[b.g],mats[b.f],b.ms.length);b.ms.forEach((matrix,i)=>m.setMatrixAt(i,matrix));m.castShadow=m.receiveShadow=true;m.computeBoundingSphere();root.add(m);}
 root.userData.bounds=bounds;root.userData.pieces=bounds.length;
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(mats).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());extras.forEach(m=>{m.geometry.dispose();(m.material as T.Material).dispose();});root.clear();}};
}
