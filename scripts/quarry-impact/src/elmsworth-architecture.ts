import * as T from 'three';
/** Track-scale spectator architecture around the existing Elmsworth stands. */
export function createSpeedwayArchitecture(){
 const root=new T.Group();root.name='elmsworth-grandstand-architecture';const geometry=new T.BoxGeometry(1,1,1),colors={steel:0x4b5c60,roof:0xaeb7b0,cream:0xd3c7a7,blue:0x326577,glass:0x344d59,dark:0x263235,ochre:0xbd8a34};type F=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([f,color])=>[f,new T.MeshStandardMaterial({color,roughness:f==='glass'?.3:.85,metalness:f==='steel'?.3:0})])) as Record<F,T.MeshStandardMaterial>;
 const batches=new Map<F,T.Matrix4[]>(),dummy=new T.Object3D(),bounds:T.Box3[]=[],extras:T.Mesh[]=[],textures:T.Texture[]=[];
 function addMatrix(f:F,m:T.Matrix4){const list=batches.get(f)??[];list.push(m.clone());batches.set(f,list);bounds.push(new T.Box3(new T.Vector3(-.5,-.5,-.5),new T.Vector3(.5,.5,.5)).applyMatrix4(m));}
 function box(f:F,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(x,y,z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();addMatrix(f,dummy.matrix);}
 function beam(f:F,a:number[],b:number[],w=.2){const p=new T.Vector3(...a as[number,number,number]),q=new T.Vector3(...b as[number,number,number]),v=q.clone().sub(p);dummy.position.copy(p.add(q).multiplyScalar(.5));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize());dummy.scale.set(w,v.length(),w);dummy.updateMatrix();addMatrix(f,dummy.matrix);}
 function sign(title:string,sub:string,x:number,y:number,z:number,w:number,h:number,back=false){if(typeof document==='undefined')return;const c=document.createElement('canvas');c.width=2048;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle='#28596b';ctx.fillRect(0,0,2048,256);ctx.fillStyle='#d7aa59';ctx.fillRect(0,0,2048,20);ctx.fillStyle='#eee0b9';ctx.textAlign='center';ctx.font='900 100px sans-serif';ctx.fillText(title,1024,128,1990);ctx.font='bold 40px sans-serif';ctx.fillText(sub,1024,210,1990);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.push(t);const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:t,roughness:1}));m.position.set(x,y,z);if(back)m.rotation.y=Math.PI;root.add(m);extras.push(m);}
 // Two wide roofs with open-front cantilevers keep the original seating usable.
 for(const side of [-1,1]){
  const z=side*118;
  box('roof',0,14,z,212,.3,34,-side*.09);box('blue',0,12.5,side*101,212,1.2,.25);box('cream',0,15.5,side*135,212,.8,.25);
  for(let x=-100;x<=100;x+=20){
   box('steel',x,7.5,side*131,.35,15,.35);box('cream',x,.35,side*131,1.6,.7,1.6);
   beam('steel',[x,14.8,side*132],[x,11.9,side*101],.25);beam('steel',[x,12,side*132],[x,11.9,side*101],.18);
   for(let bay=0;bay<5;bay++){const a=101+bay*6,b=a+6;beam('steel',[x,11.9,side*a],[x,12+(b-101)*.09,side*b],.10);}
   if(x<100){beam('steel',[x,8,side*131],[x+20,14.7,side*131],.13);beam('steel',[x,14.7,side*131],[x+20,8,side*131],.13);}
  }
  for(let x=-105;x<=105;x+=3)box('cream',x,14.22,z,.055,.08,34,-side*.09);
  // Stairs and safety handrails at the outer ends of each seating block.
  for(const x of [-105,105]){for(let step=0;step<12;step++)box('steel',x,.3+step*.48,side*(103+step*2),3.8,.18,2.1);beam('cream',[x-1.8,1.4,side*102],[x-1.8,7.2,side*127],.1);beam('cream',[x+1.8,1.4,side*102],[x+1.8,7.2,side*127],.1);}
  sign('ELMSWORTH SPEEDWAY','CONTACT IS A TEAM SPORT',0,12.5,side*100.7,82,2.7,side>0);
 }
 // Glazed race-control and commentary box stands above the southern roofline.
 box('blue',0,16.5,-144,66,7,13);box('cream',0,20.2,-144,69,.5,15);box('steel',0,12.7,-144,68,.4,15);
 for(let x=-30;x<=30;x+=10){box('steel',x,6.5,-144,.65,13,.65);box('cream',x,.35,-144,2,.7,2);}
 box('glass',0,17.2,-137.4,62,4.2,.14);for(let x=-30;x<=30;x+=5)box('cream',x,17.2,-137.25,.13,4.5,.18);box('cream',0,15,-137.15,64,.2,.4);
 for(const x of [-31,31]){box('glass',x,17.2,-144,.14,4,10);box('cream',x,17.2,-144,.18,4.2,.15);}
 sign('RACE CONTROL','WE SAW THAT. PROBABLY.',0,22,-136.9,44,3.5);
 for(const x of [-26,26]){box('steel',x,23.5,-144,.1,7,.1);box('ochre',x+1.6,26,-144,3.2,1.4,.07);}
 // Roof plant and radio aerials give the control box a working profile.
 for(const x of [-18,18]){box('dark',x,21,-145,6,1.3,4);for(let i=-2;i<=2;i++)box('cream',x+i,21.7,-145,.12,.12,3.5);}
 box('steel',9,24.5,-146,.1,8,.1);for(const y of [23,25,27])box('cream',9,y,-146,2.4,.08,.08);
 for(const [f,ms]of batches){const m=new T.InstancedMesh(geometry,materials[f],ms.length);ms.forEach((matrix,i)=>m.setMatrixAt(i,matrix));m.castShadow=m.receiveShadow=true;m.computeBoundingSphere();root.add(m);}
 root.userData.bounds=bounds;root.userData.pieces=bounds.length;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});geometry.dispose();Object.values(materials).forEach(m=>m.dispose());for(const m of extras){m.geometry.dispose();(m.material as T.Material).dispose();}textures.forEach(t=>t.dispose());root.clear();}};
}
