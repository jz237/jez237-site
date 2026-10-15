import * as T from 'three';
import {SABLE} from './sable-course';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {GLTFLoader} from './model-loader';
/** Venue scenery: original rally compound, clustered equipment and spectators. */
export function createSablePaddock(){
 const root=new T.Group();root.name='sable-detailed-paddock';
 const geometry={box:new T.BoxGeometry(1,1,1),round:new T.CylinderGeometry(.5,.5,1,10),head:new T.SphereGeometry(.5,8,6),tire:new T.TorusGeometry(.38,.14,6,10)};
 const colors={cladding:0xb3b7a4,steel:0x39454b,rust:0x75412c,cream:0xc6bc9e,red:0x8d382a,ochre:0xb88737,dark:0x272725,glass:0x314550,wood:0x78644a,skin:0x9b7657,blue:0x415d6b};
 type Finish=keyof typeof colors;type Shape=keyof typeof geometry;
 const materials=Object.fromEntries(Object.entries(colors).map(([k,c])=>[k,new T.MeshStandardMaterial({color:c,roughness:k==='glass'?.3:.89,metalness:k==='steel'?.35:0})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<string,{shape:Shape;finish:Finish;matrices:T.Matrix4[]}>(),owned:T.Texture[]=[],signs:T.Mesh[]=[];
 if(typeof document!=='undefined'){for(const [slot,file]of [['map','cladding_diff'],['normalMap','cladding_nor_gl']] as const){const t=new T.TextureLoader().load((import.meta.env?.BASE_URL??'./')+'assets/'+file+'.jpg');t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(4,2);if(slot==='map')t.colorSpace=T.SRGBColorSpace;owned.push(t);materials.cladding[slot]=t;}materials.cladding.normalScale.setScalar(.35);}
 const matrix=new T.Matrix4(),q=new T.Quaternion();let sequence=0;
 function part(shape:Shape,finish:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){
  const key=shape+'_'+finish,b=batches.get(key)??{shape,finish,matrices:[]};q.setFromEuler(new T.Euler(rx,ry,rz));matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));b.matrices.push(matrix.clone());batches.set(key,b);
 }
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rz=0)=>part('box',f,x,y,z,w,h,d,0,0,rz);
 function beam(f:Finish,a:number[],b:number[],width=.15){const start=new T.Vector3(...a as [number,number,number]),end=new T.Vector3(...b as [number,number,number]),v=end.clone().sub(start),key='box_'+f,batch=batches.get(key)??{shape:'box' as Shape,finish:f,matrices:[]};q.setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize());matrix.compose(start.add(end).multiplyScalar(.5),q,new T.Vector3(width,v.length(),width));batch.matrices.push(matrix.clone());batches.set(key,batch);}
 function sign(text:string,sub:string,x:number,y:number,z:number,w:number,h:number){
  if(typeof document==='undefined')return;const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;
  ctx.fillStyle='#c2b695';ctx.fillRect(0,0,1024,256);ctx.fillStyle='#873923';ctx.fillRect(0,0,1024,18);ctx.fillRect(0,238,1024,18);ctx.fillStyle='#292d2a';ctx.textAlign='center';ctx.font='900 68px sans-serif';ctx.fillText(text,512,116,980);ctx.font='bold 32px sans-serif';ctx.fillText(sub,512,190,980);
  for(let i=0;i<240;i++){const n=Math.sin(++sequence*71.13)*43758.54,r=n-Math.floor(n);ctx.fillStyle=i%3?'#2f281b18':'#f9ecc320';ctx.fillRect(r*1024,(i*73)%256,2+(i%17)*5,.5+i%3);}
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;owned.push(texture);const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:texture,roughness:.95,side:T.DoubleSide}));m.position.set(x,y,z);root.add(m);signs.push(m);
 }
 function tire(x:number,y:number,z:number){part('tire','dark',x,y,z,1.5,1.5,1.5,Math.PI/2);}
 function barrel(x:number,z:number,f:Finish){part('round',f,x,.65,z,1,1.3,1);for(const y of [.2,1.1])part('round','steel',x,y,z,1.03,.06,1.03);}
 function person(x:number,y:number,z:number,i:number){
  const shirt:Finish[]=['red','cream','blue','ochre'];part('round',shirt[i%4],x,y+.98,z,.42,.65,.3);part('head','skin',x,y+1.51,z,.32,.37,.32);box('dark',x-.12,y+.38,z,.16,.75,.18);box('dark',x+.12,y+.38,z,.16,.75,.18);
  beam('skin',[x-.22,y+1.18,z],[x-.35,y+.68+(i%5===0?.8:0),z+.06],.12);beam('skin',[x+.22,y+1.18,z],[x+.36,y+.73,z+.09],.12);
 }
 // Three open service bays: floor, back wall, partitions, exposed trusses and roof seams.
 for(const cx of [28,48,68]){
  box('dark',cx,.05,-158,19,.1,18);box('cladding',cx,2.6,-167,19,5.2,.25);
  for(const x of [cx-9.6,cx+9.6]){box('cladding',x,2.6,-158,.3,5.2,18);box('rust',x,2.6,-148.8,.45,5.2,.45);}
  box('red',cx,5.4,-158,20,.35,20);box('ochre',cx,4.9,-148.6,19,1.2,.25);
  for(let x=cx-9;x<cx+10;x+=.7)box('steel',x,5.65,-158,.09,.1,20);
  for(const z of [-164,-154]){beam('steel',[cx-9,4.6,z],[cx,5.3,z]);beam('steel',[cx,5.3,z],[cx+9,4.6,z]);beam('steel',[cx-9,4.6,z],[cx+9,4.6,z]);}
  // Workbench, drawers, compressor, shelf, spare wheels and tool silhouettes.
  box('wood',cx,1.2,-165,10,.25,1.4);for(const x of [cx-4,cx+4])box('steel',x,.6,-165,.2,1.2,1.2);
  box('red',cx+6,1,-164,2,2,1.2);for(let y=.3;y<1.9;y+=.3)box('cream',cx+6,y,-163.35,1.5,.06,.04);
  part('round','blue',cx-7,.7,-164,1,1.4,1);for(let i=0;i<4;i++){box('steel',cx-3+i*2,3.3,-166.7,.12,1.1,.08);box('steel',cx-3+i*2,3.7,-166.6,.5,.1,.1);}
  for(let i=0;i<3;i++)tire(cx-6,.3+i*.4,-152);barrel(cx+7,-151,'red');
  person(cx-2,0,-154,Math.round(cx));
 }
 sign('BENT & SENT','REPAIRS WHILE YOU WAIT • REGRET WHILE YOU RACE',48,6.9,-148.4,42,2.6);
 for(const x of [26,70])box('steel',x,6.4,-148.5,.2,2.2,.2);
 // Timing booth with window mullions, balcony rails, stairs and communications aerial.
 box('cream',97,4.5,-158,13,9,13);box('glass',97,7,-151.4,12,2.6,.15);for(let x=92;x<=102;x+=2.5)box('steel',x,7,-151.25,.1,2.9,.15);
 box('steel',97,9.3,-158,15,.4,15);box('steel',97,4.7,-148,17,.35,6);
 for(let x=89;x<=105;x+=2){box('cream',x,5.6,-145,.1,1.8,.1);}box('cream',97,6.5,-145,16,.1,.1);
 for(let i=0;i<12;i++)box('steel',107,.2+i*.4,-166+i*.8,3,.18,.85);
 box('steel',99,12,-158,.13,6,.13);beam('steel',[97,14,-158],[101,14,-158],.08);
 sign('RACE CONTROL','NO CLAIM TOO OPTIMISTIC',97,2.8,-151.35,11,2.2);
 // Covered spectator terrace and fence along the start straight.
 for(let row=0;row<5;row++){
  const z=-149-row*1.8,y=.6+row*.65;box('steel',-75,y-.2,z,66,.3,1.7);
  for(let col=0;col<43;col++){if((col*7+row*11)%9<2)continue;person(-106+col*1.48,y,z,col+row);}
 }
 for(const x of [-109,-87,-65,-43]){box('rust',x,4.1,-159,.25,8.2,.25);beam('steel',[x,7.6,-159],[x,8.3,-146],.2);}
 box('cream',-76,8.3,-153,70,.35,17);
 for(let x=-112;x< -38;x+=3){box('steel',x,1.3,-143,.1,2.6,.1);for(const h of [.6,1.4,2.4])box('steel',x+1.5,h,-143,3,.045,.045);}
 sign('DENTAL PLAN','COVERS THE CAR. NOT YOU.',-78,3,-142.8,22,3);
 // Paddock equipment and parked recovery truck, with recognizable chassis and cabin details.
 box('steel',137,.85,-158,3,.4,10);box('ochre',137,2,-154.4,3.2,2.8,3.2);box('glass',137,2.6,-152.75,2.8,1,.1);box('cream',137,1.1,-152.5,3.3,.3,.3);
 box('rust',137,1.25,-160,3.4,.3,6);for(const x of [135.4,138.6])for(const z of [-154,-161])part('tire','dark',x,.7,z,1.5,1.5,1.5,0,Math.PI/2);
 beam('steel',[137,1.5,-159],[137,5,-163],.35);beam('steel',[137,5,-163],[137,5,-166],.25);beam('steel',[137,5,-166],[137,2,-166],.07);
 for(let i=0;i<10;i++){barrel(116+(i%5)*1.5,-165-Math.floor(i/5)*1.6,i%2?'ochre':'steel');}
 for(let i=0;i<12;i++)tire(-20+i%4*1.6,.3+Math.floor(i/4)*.4,-159);
 for(const x of [-30,-8,12]){box('wood',x,.3,-166,3,.6,2);for(let j=-1;j<=1;j++)box('cream',x+j,.65,-166,.15,.1,2);}
 // All geometry remains behind the course barrier and outside recovery space.
 for(const [key,b]of batches){const mesh=new T.InstancedMesh(geometry[b.shape],materials[b.finish],b.matrices.length);b.matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='sable-paddock-'+key;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.instanceCount=[...batches.values()].reduce((n,b)=>n+b.matrices.length,0);
 let disposed=false;const imported=new Set<T.BufferGeometry|T.Material|T.Texture>();
 const ready=typeof document==='undefined'?Promise.resolve():Promise.all(['coupe','hatch','sedan'].map(async(kind,i)=>{
  const gltf=await new GLTFLoader().loadAsync((import.meta.env?.BASE_URL??'./')+'models/scenery/'+kind+'-parked.glb'),car=gltf.scene;
  const resources=new Set<T.BufferGeometry|T.Material|T.Texture>();
  const groups=new Map<string,{material:T.Material;parts:T.BufferGeometry[]}>();car.updateMatrixWorld(true);
  car.traverse(o=>{if(o instanceof T.Mesh){
   resources.add(o.geometry);const mats=Array.isArray(o.material)?o.material:[o.material];
   for(const m of mats){resources.add(m);for(const v of Object.values(m))if(v instanceof T.Texture)resources.add(v);}
   // Keep multi-material meshes intact; merge ordinary static pieces by appearance.
   if(mats.length!==1)return;
   const m=mats[0] as T.MeshStandardMaterial;
   if(m.name.startsWith('paint_')){m.metalness=.25;m.roughness=.65;}
   const key=JSON.stringify([m.type,m.color?.getHex(),m.roughness,m.metalness,m.opacity,m.transparent,m.side,m.map?.uuid,m.normalMap?.uuid,m.emissive?.getHex()]);
   const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(o.matrixWorld);
   for(const attr of Object.keys(g.attributes))if(!['position','normal','uv'].includes(attr))g.deleteAttribute(attr);
   if(!g.attributes.normal)g.computeVertexNormals();if(!g.attributes.uv)g.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));
   const group=groups.get(key)??{material:m,parts:[]};group.parts.push(g);groups.set(key,group);
  }});
  const combined=new T.Group();for(const group of groups.values()){const g=mergeGeometries(group.parts)!;group.parts.forEach(p=>p.dispose());resources.add(g);const mesh=new T.Mesh(g,group.material);mesh.castShadow=mesh.receiveShadow=true;combined.add(mesh);}
  car.traverse(o=>{if(o instanceof T.Mesh&&Array.isArray(o.material)&&o.material.length>1){const copy=o.clone();copy.matrix.copy(o.matrixWorld);copy.matrixAutoUpdate=false;combined.add(copy);}});
  car.clear();car.add(combined);
  if(disposed){for(const resource of resources)resource.dispose();return;}
  for(const resource of resources)imported.add(resource);
  const bounds=new T.Box3().setFromObject(car),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
  const scale=4.7/Math.max(size.x,size.z);car.scale.setScalar(scale);car.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
  const parked=new T.Group();parked.name='parked-'+kind;parked.add(car);parked.rotation.y=size.x>size.z?Math.PI/2:0;parked.position.set(28+i*20,.05,-156);root.add(parked);parked.updateMatrixWorld(true);const footprint=new T.Box3().setFromObject(parked);let clearance=Infinity;for(let x=footprint.min.x;x<=footprint.max.x+.5;x+=.5)for(let z=footprint.min.z;z<=footprint.max.z+.5;z+=.5)clearance=Math.min(clearance,SABLE.distance(x,z)-Math.SQRT1_2);parked.userData.clearance=clearance;if(clearance<20)throw new Error('Parked car intrudes into racing corridor');
 }));
 return{root,ready,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometry).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());for(const m of signs){m.geometry.dispose();(m.material as T.Material).dispose();}owned.forEach(t=>t.dispose());for(const resource of imported)resource.dispose();root.clear();}};
}
