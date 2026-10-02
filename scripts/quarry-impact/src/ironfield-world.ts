import * as T from 'three';
import {IRONFIELD,IRONFIELD_SOLIDS} from './ironfield-course';
import {createIronfieldGround} from './ironfield-ground';
import {freezeSceneryTransforms} from './render-work';

/** Original club-race venue. Reachable walls come only from the shared solid
 * records; grandstands, buildings and lighting sit beyond that enclosure. */
export function createIronfieldWorld(){
 const root=new T.Group();root.name='ironfield_world';
 const ground=createIronfieldGround();root.add(ground.ground);
 const materials={
  concrete:new T.MeshStandardMaterial({color:0xa6a495,roughness:.93}),
  steel:new T.MeshStandardMaterial({color:0x34494b,roughness:.73,metalness:.35}),
  ochre:new T.MeshStandardMaterial({color:0xab703c,roughness:.85}),
  seat:new T.MeshStandardMaterial({color:0x31575a,roughness:.87}),
  roof:new T.MeshStandardMaterial({color:0x797d72,roughness:.78,metalness:.22}),
  brick:new T.MeshStandardMaterial({color:0x775647,roughness:.97}),
  door:new T.MeshStandardMaterial({color:0x454d48,roughness:.91}),
  lamp:new T.MeshStandardMaterial({color:0xd6d5ba,roughness:.64,emissive:0x25281f}),
  hinterland:new T.MeshStandardMaterial({color:0x77745e,roughness:1}),
  foliage:new T.MeshStandardMaterial({color:0x58684d,roughness:1}),
 };
 type Finish=keyof typeof materials;
 const boxes=new Map<Finish,T.Matrix4[]>(),tubes=new Map<Finish,T.Matrix4[]>(),up=new T.Vector3(0,1,0),geometries:T.BufferGeometry[]=[],textures:T.Texture[]=[];
 const matrix=new T.Matrix4(),quaternion=new T.Quaternion();
 // An apron surrounds the textured floor without overlapping it. A second
 // full plane only15mm below the road caused distant depth-buffer striping.
 const apronPositions:number[]=[];
 for(const [x0,x1,z0,z1]of [[-280,-180,-210,210],[180,280,-210,210],[-180,180,-210,-135],[-180,180,135,210]])apronPositions.push(x0,0,z0,x0,0,z1,x1,0,z1,x0,0,z0,x1,0,z1,x1,0,z0);
 const farGroundGeometry=new T.BufferGeometry();farGroundGeometry.setAttribute('position',new T.Float32BufferAttribute(apronPositions,3));farGroundGeometry.computeVertexNormals();geometries.push(farGroundGeometry);const farGround=new T.Mesh(farGroundGeometry,materials.hinterland);farGround.receiveShadow=true;farGround.name='ironfield_outer_ground';root.add(farGround);
 function box(x:number,y:number,z:number,w:number,h:number,d:number,finish:Finish,yaw=0,pitch=0){
  quaternion.setFromEuler(new T.Euler(pitch,yaw,0));matrix.compose(new T.Vector3(x,y,z),quaternion,new T.Vector3(w,h,d));const batch=boxes.get(finish)||[];batch.push(matrix.clone());boxes.set(finish,batch);
 }
 function tube(a:T.Vector3,b:T.Vector3,radius:number,finish:Finish){
  const direction=b.clone().sub(a);quaternion.setFromUnitVectors(up,direction.clone().normalize());matrix.compose(a.clone().add(b).multiplyScalar(.5),quaternion,new T.Vector3(radius,direction.length(),radius));const batch=tubes.get(finish)||[];batch.push(matrix.clone());tubes.set(finish,batch);
 }
 for(const solid of IRONFIELD_SOLIDS)box(solid.x,solid.y,solid.z,solid.half[0]*2,solid.half[1]*2,solid.half[2]*2,solid.material,solid.yaw);

 // The north stand has three banks and open aisle breaks. Tier fronts, bench
 // backs, a thin pitched canopy and exposed roof trusses read at race distance.
 for(const x of [-62,0,62])for(let row=0;row<9;row++){
  const z=-104-row*1.8,top=.68+row*.55;
  box(x,top/2,z,55,top,1.8,'concrete');
  for(let seat=-25.2;seat<=25.2;seat+=1.8){box(x+seat,top+.25,z-.13,1.35,.16,.60,'seat');box(x+seat,top+.61,z-.46,1.3,.66,.10,'seat',0,-.13);}
  for(const end of [-1,1])tube(new T.Vector3(x+end*27.25,top,z+.75),new T.Vector3(x+end*27.25,top+1.0,z+.75),.035,'steel');
 }
 box(0,9.5,-113.5,188,.22,23,'roof',0,-.09);
 for(let x=-93;x<=93;x+=15.5){
  box(x,4.25,-122.5,.23,8.5,.23,'steel');box(x,5.2,-104,.20,10.4,.20,'steel');
  tube(new T.Vector3(x,8.5,-123),new T.Vector3(x,10.4,-102.2),.11,'steel');
  tube(new T.Vector3(x,7.9,-123),new T.Vector3(x,7.9,-103),.085,'steel');
  tube(new T.Vector3(x,7.9,-122.5),new T.Vector3(x,9.1,-116),.085,'steel');
  tube(new T.Vector3(x,9.1,-116),new T.Vector3(x,7.9,-109),.085,'steel');
  tube(new T.Vector3(x,7.9,-109),new T.Vector3(x,10.4,-102.2),.085,'steel');
 }
 for(const x of [-89.25,-34.75,-27.25,27.25,34.75,89.25])tube(new T.Vector3(x,1.68,-103.25),new T.Vector3(x,6.08,-117.65),.045,'steel');
 for(const x of [-31,31])for(let step=0;step<18;step++){const top=.4+step*.275;box(x,top/2,-103.45-step*.9,5.9,top,.9,'concrete');}
 for(let z=-123;z<-103;z+=2.6)box(0,9.5+(z+113.5)*.09,z,188,.07,.07,'steel');
 for(const x of [-94,94])tube(new T.Vector3(x,8.5,-123),new T.Vector3(x,10.4,-102.2),.10,'steel');
 // The smaller south bleachers keep the opposite horizon open. Every tier
 // starts beyond the continuous z=100 perimeter collision wall.
 for(const x of [-58,58])for(let row=0;row<5;row++){
  const top=.65+row*.55,z=104+row*1.7;
  box(x,top/2,z,72,top,1.7,'concrete');
  for(let seat=-33.3;seat<=33.3;seat+=1.8){if(Math.abs(seat)<2.5)continue;box(x+seat,top+.23,z+.10,1.35,.16,.58,'seat');box(x+seat,top+.55,z+.42,1.3,.60,.10,'seat',0,.13);}
 }
 for(const x of [-94,-61,-55,-22,22,55,61,94]){tube(new T.Vector3(x,1.6,103.2),new T.Vector3(x,3.8,110),.045,'steel');for(const z of [103.2,110])tube(new T.Vector3(x,0,z),new T.Vector3(x,z<105?1.6:3.8,z),.035,'steel');}
 for(const x of [-58,58])for(let step=0;step<10;step++){const top=.35+step*.275;box(x,top/2,103.45+step*.85,4.7,top,.85,'concrete');}
 // Eastern garages and a western timing house give each turn a distinctive
 // landmark without narrowing the road or hiding its central crossing.
 for(const z of [-37,0,37]){
  box(157,3,z,13,6,30,'concrete');box(157,6.25,z,14,.38,31,'roof');
  for(const offset of [-9,0,9]){
   box(150.46,2.15,z+offset,.06,4.3,6.8,'door');box(150.38,4.58,z+offset,.22,.22,7.25,'steel');
   for(const edge of [-1,1])box(150.38,2.2,z+offset+edge*3.55,.22,4.4,.18,'steel');
   for(let slat=.3;slat<4.2;slat+=.36)box(150.415,slat,z+offset,.06,.045,6.7,'roof');
   box(150.25,.075,z+offset,.6,.15,7.15,'concrete');
  }
  box(149.9,5.0,z,1.4,.18,30.5,'roof');
  for(const support of [-14.4,14.4]){box(149.35,2.48,z+support,.13,4.96,.13,'steel');tube(new T.Vector3(149.35,4.4,z+support),new T.Vector3(150.5,5.0,z+support),.05,'steel');}
  for(let rib=-14.5;rib<15;rib+=1.8)box(157,6.48,z+rib,13.5,.045,.08,'steel');
  for(let panel=-13;panel<=13;panel+=2.6)box(163.52,3,z+panel,.06,5.9,.055,'steel');
 }
 box(-158,3.5,0,14,7,28,'brick');box(-158,7.25,0,15,.45,30,'roof');
 for(const z of [-9,-3,3,9]){box(-150.94,5.3,z,.10,1.4,4.8,'door');box(-150.85,4.49,z,.25,.12,5.1,'concrete');}
 box(-150.85,1.65,0,.12,3.3,3.2,'door');
 box(-150.0,3.9,0,1.7,.16,10,'roof');for(const z of [-4.5,4.5])box(-149.3,1.95,z,.12,3.9,.12,'steel');
 for(const z of [-9,-3,3,9]){box(-150.87,5.3,z,.12,1.45,.07,'concrete');box(-150.86,5.3,z,.13,.07,4.8,'concrete');}
 // Distant remnants of the old works form an original industrial skyline.
 // They are outside both the enclosure and the playable out-of-bounds area.
 box(-196,6,-57,26,12,47,'brick');box(-196,12.3,-57,28,.45,49,'roof');
 for(const z of [-67,-47]){tube(new T.Vector3(-197,0,z),new T.Vector3(-197,29,z),2.1,'brick');tube(new T.Vector3(-197,27,z),new T.Vector3(-197,29,z),2.25,'concrete');}
 for(const side of [-1,1])for(const x of [-128,128]){
  const z=side*105;tube(new T.Vector3(x,0,z),new T.Vector3(x,16,z),.14,'steel');box(x,16,z,4,.55,.75,'steel');
  for(const dx of [-1.35,-.45,.45,1.35])box(x+dx,15.93,z-side*.43,.68,.32,.08,'lamp');
 }
 // Sparse boundary trees soften the former industrial site. Every trunk is
 // beyond the enclosure and playable recovery boundary, not on the run-off.
 const crowns:T.Matrix4[]=[],randomAt=(i:number)=>{let n=Math.imul(i+381,1103515245)+12345;n^=n>>>16;return(n>>>0)/4294967296;};
 for(let i=0;i<42;i++){
  const x=-165+i*8.1+(randomAt(i)-.5)*5,z=(i%2?1:-1)*(143+randomAt(i+80)*18),h=4.3+randomAt(i+120)*4.2,r=2.8+randomAt(i+200)*1.8;
  tube(new T.Vector3(x,0,z),new T.Vector3(x,h,z),.18,'brick');
  for(let part=0;part<3;part++){matrix.compose(new T.Vector3(x+(part-1)*r*.55,h+r*.45+(part===1?r*.35:0),z+(part===1?0:r*.15)),new T.Quaternion(),new T.Vector3(r*.86,r*(part===1?1.05:.74),r*.82));crowns.push(matrix.clone());}
 }
 const crownGeometry=new T.IcosahedronGeometry(1,1);geometries.push(crownGeometry);const canopy=new T.InstancedMesh(crownGeometry,materials.foliage,crowns.length);crowns.forEach((m,i)=>{canopy.setMatrixAt(i,m);canopy.setColorAt(i,new T.Color().setScalar(.85+randomAt(i+600)*.23));});canopy.name='ironfield_boundary_canopy';canopy.castShadow=canopy.receiveShadow=true;canopy.computeBoundingSphere();root.add(canopy);
 const signMaterials:T.Material[]=[];
 function sign(text:string,x:number,y:number,z:number,w:number,h:number,yaw=0){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=192;
  const ctx=canvas.getContext('2d')!;ctx.fillStyle='#22393b';ctx.fillRect(0,0,1024,192);ctx.fillStyle='#b98449';ctx.fillRect(0,166,1024,26);ctx.fillStyle='#e6e4d6';ctx.font='700 72px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,88,978);
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;textures.push(map);
  const material=new T.MeshStandardMaterial({map,roughness:.9,side:T.DoubleSide});signMaterials.push(material);
  const geometry=new T.PlaneGeometry(w,h);geometries.push(geometry);const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.rotation.y=yaw;mesh.receiveShadow=true;mesh.name='ironfield_sign_'+text.toLowerCase().replaceAll(' ','_');root.add(mesh);
 }
 sign('IRONFIELD RACEWAY',0,7.45,-102.0,46,2.3);
 sign('EAST PADDOCK',150.35,5.42,0,25,1.3,-Math.PI/2);
 sign('IRONFIELD MOTOR CLUB',-150.78,7.0,0,25,1.4,Math.PI/2);
 const start=IRONFIELD.point(0),ahead=IRONFIELD.point(.0001),yaw=Math.atan2(ahead.x-start.x,ahead.z-start.z);
 sign('START / FINISH',start.x+Math.sin(yaw)*.305,8.5,start.z+Math.cos(yaw)*.305,25,.62,yaw);
 for(const [i,z]of [-37,0,37].entries())sign(`PITS ${i*3+1}–${i*3+3}`,150.32,4.6,z,7,0.65,-Math.PI/2);

 const boxGeometry=new T.BoxGeometry(1,1,1),tubeGeometry=new T.CylinderGeometry(1,1,1,12);geometries.push(boxGeometry,tubeGeometry);
 for(const [shape,batches,geometry]of [['boxes',boxes,boxGeometry],['tubes',tubes,tubeGeometry]]as const)for(const [finish,instances]of batches){
  const mesh=new T.InstancedMesh(geometry,materials[finish],instances.length);instances.forEach((m,i)=>{mesh.setMatrixAt(i,m);mesh.setColorAt(i,new T.Color().setScalar(.91+randomAt(i+finish.length*71)*.12));});mesh.name='ironfield_'+shape+'_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);
 }
 root.userData.solidRecords=IRONFIELD_SOLIDS;
 freezeSceneryTransforms(root);let disposed=false;
 return{root,groundCoverage:ground.coverage,dispose(){
  if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});ground.dispose();for(const geometry of geometries)geometry.dispose();for(const material of Object.values(materials))material.dispose();for(const material of signMaterials)material.dispose();for(const texture of textures)texture.dispose();root.clear();
 }};
}
