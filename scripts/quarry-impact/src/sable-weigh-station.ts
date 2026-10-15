import {url} from './assets';
import * as T from 'three';
import {SABLE} from './sable-course';
const accessLane=new T.CatmullRomCurve3([new T.Vector3(45,0,12),new T.Vector3(45,0,-20),new T.Vector3(34,0,-48),new T.Vector3(18,0,-77)]);
const laneSamples=Array.from({length:49},(_,i)=>accessLane.getPoint(i/48));
/** Reserve the compound and the actual curved access lane, including vegetation radius. */
export function weighStationReserved(x:number,z:number,radius=0){
 if(x>=27-radius&&x<=63+radius&&z>=12-radius&&z<=58+radius)return true;
 for(let i=1;i<laneSamples.length;i++){const a=laneSamples[i-1],b=laneSamples[i],dx=b.x-a.x,dz=b.z-a.z,t=T.MathUtils.clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1);if(Math.hypot(x-a.x-t*dx,z-a.z-t*dz)<7+radius)return true;}return false;
}
/** Quarry logistics compound. All dimensions in metres. */
export function createWeighStation(){
 const root=new T.Group();root.name='sable-weigh-station';
 const geometries={box:new T.BoxGeometry(1,1,1),cylinder:new T.CylinderGeometry(.5,.5,1,12),pipe:new T.CylinderGeometry(.5,.5,1,12,1,true)};
 const colors={steel:0x43494a,cream:0xc0bca1,rust:0x915339,red:0x823b2b,glass:0x374c53,wood:0x88765a,dark:0x35332d,concrete:0x8b8776};
 type Finish=keyof typeof colors;type Shape=keyof typeof geometries;
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.3:.92,metalness:key==='steel'?.25:0,side:key==='concrete'?T.DoubleSide:T.FrontSide})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,{shape:Shape;finish:Finish;matrices:T.Matrix4[]}>(),owned:T.Texture[]=[],extras:T.Mesh[]=[];
 if(typeof document!=='undefined')for(const [finish,file,repeat]of [['cream','cladding_diff',3],['rust','workyard/rusty_painted_metal-diff',2],['concrete','workyard/concrete_layers_02-diff',3],['dark','asphalt_diff',8]] as const){const texture=new T.TextureLoader().load(url('assets/'+file+'.jpg'));texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(repeat,repeat);texture.anisotropy=8;materials[finish].map=texture;materials[finish].color.set(0xd8cbb6);owned.push(texture);}
 const ox=45,oz=35,ground=Math.max(...[-18,18].flatMap(x=>[-23,23].map(z=>SABLE.height(ox+x,oz+z))))+.15,dummy=new T.Object3D();
 function part(shape:Shape,finish:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){const key=shape+finish,b=batches.get(key)??{shape,finish,matrices:[]};dummy.position.set(ox+x,ground+y,oz+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();b.matrices.push(dummy.matrix.clone());batches.set(key,b);}
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number)=>part('box',f,x,y,z,w,h,d);
 function beam(f:Finish,a:number[],b:number[],width=.12){const start=new T.Vector3(...a as [number,number,number]),end=new T.Vector3(...b as [number,number,number]),v=end.clone().sub(start),key='box'+f,batch=batches.get(key)??{shape:'box' as Shape,finish:f,matrices:[]};const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize());batch.matrices.push(new T.Matrix4().compose(start.add(end).multiplyScalar(.5).add(new T.Vector3(ox,ground,oz)),q,new T.Vector3(width,v.length(),width)));batches.set(key,batch);}
 function sign(text:string,sub:string,x:number,y:number,z:number,w:number,h:number){if(typeof document==='undefined')return;const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle='#b9ae89';ctx.fillRect(0,0,1024,256);ctx.fillStyle='#803c28';ctx.fillRect(0,0,1024,17);ctx.fillRect(0,239,1024,17);ctx.textAlign='center';ctx.fillStyle='#252e2b';ctx.font='900 72px sans-serif';ctx.fillText(text,512,114,985);ctx.font='bold 32px sans-serif';ctx.fillText(sub,512,190,985);for(let i=0;i<180;i++){ctx.fillStyle='#29241213';ctx.fillRect((i*127)%1024,(i*73)%256,8+i%33,1+i%3);}const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;owned.push(texture);const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:texture,roughness:1,side:T.FrontSide}));mesh.position.set(ox+x,ground+y,oz+z);root.add(mesh);extras.push(mesh);const back=mesh.clone();back.geometry=mesh.geometry.clone();back.material=(mesh.material as T.MeshStandardMaterial).clone();back.rotation.y=Math.PI;back.position.z-=.015;root.add(back);extras.push(back);}
 // Raised, retained service terrace follows the sloped quarry setting.
 box('concrete',0,-2.05,0,36,4,46);box('dark',0,-.025,0,35.5,.05,45.5);
 // Sunken scale deck, wheel guides and segmented concrete aprons.
 for(let z=-19;z<=19;z+=5)box('concrete',0,-.12,z,7,.3,4.8);
 box('dark',0,.08,0,6.5,.2,19);for(let z=-9;z<=9;z+=1.5)box('steel',0,.22,z,6.4,.06,.12);
 for(const x of [-3.3,3.3]){box('rust',x,.35,0,.18,.5,19);for(const z of [-9,-3,3,9])box('cream',x,.65,z,.35,1.1,.35);}
 // Braced inspection gantry with crosswalk, railings, ladder and overhead signal box.
 for(const x of [-5.8,5.8]){box('steel',x,4.8,0,.42,9.6,.42);box('concrete',x,.1,0,1.3,.4,1.3);beam('rust',[x,0,-3],[x,5,0],.24);beam('rust',[x,0,3],[x,5,0],.24);}
 box('steel',0,9.5,0,12,.4,2.4);for(const z of [-1.1,1.1]){box('cream',0,10.7,z,12,.12,.12);for(let x=-5.7;x<=6;x+=1.4)box('cream',x,10.1,z,.1,1.2,.1);}
 for(const x of [-6.5,-5.2])box('steel',x,4.8,1.8,.1,9.6,.1);for(let y=.3;y<9.7;y+=.35)box('rust',-5.85,y,1.8,1.4,.08,.08);
 box('dark',3.8,8,0,1.1,2.1,.7);for(const y of [7.45,8.5])part('cylinder',y<8?'red':'cream',3.8,y,.4,.5,.12,.5,Math.PI/2);
 sign('DEAD WEIGHT','EVERY DENT COUNTS',0,7.7,-.4,8.5,1.8);
 // Low scale office: corrugated siding, framed glazing, entrance canopy and desk.
 box('cream',11,1.7,4,7,3.4,9);box('red',11,3.6,4,8,.3,10);
 for(let z=-.5;z<9;z+=.4)box('steel',7.45,1.6,z,.06,3.1,.055);
 box('glass',7.4,2,3,.08,1.5,5.4);for(const z of [.3,2.1,3.9,5.7])box('cream',7.3,2,z,.14,1.7,.12);
 box('glass',14.6,2,3,.08,1.5,5.4);for(const z of [.3,2.1,3.9,5.7])box('cream',14.7,2,z,.14,1.7,.12);
 box('wood',8.2,1.25,3,1.4,.12,5.7);box('dark',8.1,1.7,2,.25,.7,.8);
 box('dark',10,1.3,-.55,1.6,2.6,.1);box('cream',10,1.3,-.64,.13,.15,.15);
 box('steel',10,2.95,-1.8,4,.15,3);for(const x of [8.2,11.8])box('rust',x,1.45,-3,.12,2.9,.12);
 sign('SCRAP ACCOUNTING','WEIGH IN. PAY OUT.',11,3.1,-.7,6,1);
 // Steel tube storage on timber cradles. Open tube mouths read as tubes, not solid logs.
 for(const z of [-10,-5])for(const x of [10,15])box('wood',x,.35,z,1,.7,2.4);
 for(let layer=0;layer<3;layer++)for(let i=0;i<4-layer;i++){const x=9.7+i*1.3+layer*.65,y=1+layer*1.15;part('pipe','rust',x,y,-7.5,1.2,8,1.2,Math.PI/2);part('pipe','dark',x,y,-7.5,1.05,8.03,1.05,Math.PI/2);}
 // A terrain-following service lane joins the terrace to its closed access gate.
 const lane=accessLane,roadPositions:number[]=[],roadUvs:number[]=[],roadIndices:number[]=[],bankPositions:number[]=[],bankIndices:number[]=[];
 for(let i=0;i<=48;i++){
  const t=i/48,p=lane.getPoint(t),tangent=lane.getTangent(t),nx=-tangent.z,nz=tangent.x,half=4.2+1.2*t;
  for(const side of [-1,1]){
   const x=p.x+nx*half*side,z=p.z+nz*half*side,h=SABLE.height(x,z)+.045,blend=T.MathUtils.smoothstep(t,0,.3),y=T.MathUtils.lerp(ground-.025,h,blend);
   roadPositions.push(x,y,z);roadUvs.push((side+1)/2,t*18);
   const bx=p.x+nx*(half+1.2)*side,bz=p.z+nz*(half+1.2)*side;bankPositions.push(x,y-.03,z,bx,SABLE.height(bx,bz)+.025,bz);
  }
  if(i<48){const n=i*2;roadIndices.push(n,n+2,n+1,n+1,n+2,n+3);for(const side of [0,2]){const b=i*4+side;bankIndices.push(b,b+4,b+1,b+1,b+4,b+5);}}
 }
 const roadGeometry=new T.BufferGeometry();roadGeometry.setAttribute('position',new T.Float32BufferAttribute(roadPositions,3));roadGeometry.setAttribute('uv',new T.Float32BufferAttribute(roadUvs,2));roadGeometry.setIndex(roadIndices);roadGeometry.computeVertexNormals();
 const roadMaterial=materials.dark.clone();roadMaterial.color.set(0xb9ad91);roadMaterial.side=T.DoubleSide;if(roadMaterial.map){roadMaterial.map=roadMaterial.map.clone();roadMaterial.map.repeat.set(1,1);owned.push(roadMaterial.map);}
 const road=new T.Mesh(roadGeometry,roadMaterial);road.name='weigh-station-access-lane';road.receiveShadow=true;root.add(road);extras.push(road);
 const bankGeometry=new T.BufferGeometry();bankGeometry.setAttribute('position',new T.Float32BufferAttribute(bankPositions,3));bankGeometry.setIndex(bankIndices);bankGeometry.computeVertexNormals();const banks=new T.Mesh(bankGeometry,new T.MeshStandardMaterial({color:0x9c825e,roughness:1,side:T.DoubleSide}));banks.name='weigh-station-ramp-banks';banks.receiveShadow=true;root.add(banks);extras.push(banks);
 // Closed gate clearly marks the lane as service access rather than another race route.
 const gateY=SABLE.height(18,-77)-ground;for(const x of [-33,-21])box('rust',x,gateY+1.1,-112,.22,2.2,.22);
 for(const y of [.45,1.2,1.95])box('cream',-27,gateY+y,-112,12,.1,.1);
 beam('rust',[-33,gateY+.45,-112],[-21,gateY+1.95,-112],.1);
 // Slatted pallets, bundled beams and a guarded storage edge.
 for(let stack=0;stack<3;stack++)for(let level=0;level<3;level++){const x=-10+stack*2.7,y=.2+level*.28;for(let slat=0;slat<5;slat++)box('wood',x-1+slat*.5,y,-6, .4,.14,2);for(const z of [-6.8,-5.2])box('wood',x,y-.1,z,2.4,.15,.16);}
 for(let i=0;i<7;i++)box('steel',-8+i*.35,.7,-11,.25,.25,9);
 for(let z=-18;z<=16;z+=3){box('steel',-16,1.25,z,.12,2.5,.12);if(z<16)for(const h of [.45,1.2,2.3])box('steel',-16,h,z+1.5,.06,.06,3);}
 for(const x of [-13,-7,7,13]){part('cylinder','rust',x,.55,-20,.55,1.1,.55);part('cylinder','cream',x,.8,-20,.57,.15,.57);}
 for(const [key,b]of batches){const mesh=new T.InstancedMesh(geometries[b.shape],materials[b.finish],b.matrices.length);b.matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='weigh-station-'+key;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());for(const e of extras){e.geometry.dispose();(e.material as T.Material).dispose();}owned.forEach(t=>t.dispose());root.clear();}};
}
