import * as T from 'three';
/** Deterministic seated crowd; compact instanced silhouettes for trackside viewing. */
export function createSpeedwaySpectators(){
 const root=new T.Group();root.name='elmsworth-spectators';
 const shapes={body:new T.BoxGeometry(1,1,1),head:new T.SphereGeometry(.5,6,4)};
 const colors=[0xb65942,0xd2ae63,0x587889,0x697357,0xc3b8a1,0x4c5161,0x7a586b,0x343c46,0xc18c69,0x785844,0xdfb38b];
 const materials=colors.map(color=>new T.MeshStandardMaterial({color,roughness:.94}));
 const batches=new Map<string,T.Matrix4[]>(),dummy=new T.Object3D();let seed=7381,count=0;
 const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 function part(shape:keyof typeof shapes,material:number,x:number,y:number,z:number,w:number,h:number,d:number,rz=0){dummy.position.set(x,y,z);dummy.rotation.set(0,0,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const key=shape+':'+material,list=batches.get(key)??[];list.push(dummy.matrix.clone());batches.set(key,list);}
 for(const side of [-1,1])for(let row=0;row<8;row++)for(let bench=-99;bench<=99;bench+=3)for(const seat of [-.63,.63]){
  if(random()<.34)continue;
  const x=bench+seat,z=side*(105+row*3),base=1+row*.65+.31,height=.9+random()*.18,shirt=Math.floor(random()*7),skin=8+Math.floor(random()*3),lean=(random()-.5)*.12;
  part('body',shirt,x,base+.36*height,z+lean,.42,.65*height,.25);
  part('head',skin,x,base+.82*height,z+lean,.29,.34,.29);
  // Bent thighs point toward the track; shins descend in front of the bench.
  for(const leg of [-1,1]){part('body',7,x+leg*.115,base+.04,z-side*.18,.17,.18,.53);part('body',7,x+leg*.115,base-.2,z-side*.40,.16,.49,.17);part('body',7,x+leg*.115,base-.43,z-side*.46,.18,.12,.31);}
  const cheering=random()<.16;
  for(const arm of [-1,1]){part('body',shirt,x+arm*(cheering?.30:.26),base+(cheering?.66:.34)*height,z,.12,cheering?.63:.48,.16,arm*(cheering?-.52:.1));part('head',skin,x+arm*(cheering?.45:.28),base+(cheering?.96:.1)*height,z,.14,.15,.14);}
  count++;
 }
 for(const[key,matrices]of batches){const[shape,material]=key.split(':');const mesh=new T.InstancedMesh(shapes[shape as keyof typeof shapes],materials[+material],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=false;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.spectators=count;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(shapes).forEach(g=>g.dispose());materials.forEach(m=>m.dispose());root.clear();}};
}
