import {withBarrierBoards,boardSeed} from './barrier-boards';
import {createAshfordLandscape} from './ashford-landscape';
import {createAshfordPaddock} from './ashford-paddock';
import * as T from 'three';
import {ASHFORD,ASHFORD_SOLIDS} from './ashford-course';
import {freezeSceneryTransforms} from './render-work';
/** Original technical asphalt course. All reachable barriers share the physics records. */
export function createAshfordWorld(){
 const root=new T.Group();root.name='ashford_autodrome';
 const materials=withBarrierBoards({concrete:new T.MeshStandardMaterial({color:0xb9b9af,roughness:.96}),stripe:new T.MeshStandardMaterial({color:0x304e75,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x313b44,roughness:.7,metalness:.35}),grass:new T.MeshStandardMaterial({color:0x6f7551,roughness:1}),seat:new T.MeshStandardMaterial({color:0x9da6b2,roughness:.8})},boardSeed('ashford-autodrome-v1'));
 const groundMaterial=new T.MeshStandardMaterial({color:0xffffff,roughness:.92}),groundGeometry=new T.PlaneGeometry(340,300),boxGeometry=new T.BoxGeometry(1,1,1),textures:T.Texture[]=[];
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1808;const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.fillStyle='#73764d';ctx.fillRect(0,0,canvas.width,canvas.height);let seed=917;
   for(let i=0;i<35000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%2048;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#7b7c54':'#656d49';ctx.fillRect(x,seed%1808,3,3);}
   const scale=canvas.width/340,x=(v:number)=>(v+170)*scale,z=(v:number)=>(150-v)*canvas.height/300;
   const route=()=>{ctx.beginPath();ASHFORD.samples.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));ctx.closePath();};
   ctx.lineJoin='round';route();ctx.strokeStyle='#a39574';ctx.lineWidth=30*scale;ctx.stroke();
   route();ctx.strokeStyle='#e3ddd0';ctx.lineWidth=25.5*scale;ctx.stroke();ctx.setLineDash([3*scale,3*scale]);ctx.strokeStyle='#30517a';ctx.stroke();ctx.setLineDash([]);
   route();ctx.strokeStyle='#393e40';ctx.lineWidth=24*scale;ctx.stroke();
   // Baked road wear is clipped to asphalt, leaving painted curbs and grass clean.
   const wearCanvas=document.createElement('canvas');wearCanvas.width=canvas.width;wearCanvas.height=canvas.height;const wear=wearCanvas.getContext('2d');
   if(wear){
    let wearSeed=90171;const random=()=>((wearSeed=(Math.imul(wearSeed,1664525)+1013904223)>>>0)/4294967296);
    for(let i=0;i<170000;i++){wear.fillStyle=i%3?'rgba(9,14,17,.1)':'rgba(130,132,125,.07)';wear.fillRect(random()*2048,random()*1808,.5+random()*.75,.5+random()*.75);}
    // Uneven repaired patches and sealed cracks align with the route, never form obstacles.
    for(let i=0;i<70;i++){
     const t=random(),p=ASHFORD.point(t),a=ASHFORD.point(t-.0001),b=ASHFORD.point(t+.0001),yaw=Math.atan2(b.z-a.z,b.x-a.x),offset=(random()-.5)*17;
     wear.save();wear.translate(x(p.x-Math.sin(yaw)*offset),z(p.z+Math.cos(yaw)*offset));wear.rotate(-yaw);
     const w=(1.5+random()*5)*scale,h=(1+random()*2.8)*scale;
     wear.fillStyle=i%2?'rgba(21,27,29,.22)':'rgba(130,132,121,.13)';wear.fillRect(-w/2,-h/2,w,h);
     wear.strokeStyle='rgba(14,20,23,.3)';wear.lineWidth=.07*scale;wear.beginPath();wear.moveTo(-w/2,-h/2);wear.lineTo(-w*.1,-h*.27);wear.lineTo(w*.16,h*.1);wear.lineTo(w/2,h/2);wear.stroke();wear.restore();
    }
    // Paired rubber arcs through bends add braking/drifting history, with varied lengths.
    for(let i=0;i<115;i++){
     const t=random(),offset=(random()-.5)*14,duration=(5+random()*20)/ASHFORD.length;
     for(const side of [-1,1]){wear.beginPath();for(let j=0;j<=12;j++){const u=t+duration*j/12,p=ASHFORD.point(u),a=ASHFORD.point(u-.0001),b=ASHFORD.point(u+.0001),yaw=Math.atan2(b.x-a.x,b.z-a.z),lane=offset+side*.8+Math.sin(j/12*Math.PI)*.4,px=x(p.x+Math.cos(yaw)*lane),pz=z(p.z-Math.sin(yaw)*lane);if(j)wear.lineTo(px,pz);else wear.moveTo(px,pz);}wear.strokeStyle='rgba(10,16,19,.16)';wear.lineWidth=(.16+random()*.1)*scale;wear.stroke();}
    }
    // destination-in retains existing detail only beneath this full asphalt stroke.
    const mask=document.createElement('canvas');mask.width=canvas.width;mask.height=canvas.height;const mc=mask.getContext('2d');
    if(mc){mc.beginPath();ASHFORD.samples.forEach((p,i)=>i?mc.lineTo(x(p.x),z(p.z)):mc.moveTo(x(p.x),z(p.z)));mc.closePath();mc.lineJoin='round';mc.strokeStyle='#fff';mc.lineWidth=23.8*scale;mc.stroke();wear.globalCompositeOperation='destination-in';wear.drawImage(mask,0,0);ctx.drawImage(wearCanvas,0,0);}
   }
   const start=ASHFORD.point(0);for(let i=0;i<24;i++)for(let j=0;j<2;j++){ctx.fillStyle=(i+j)%2?'#deddd3':'#25292c';ctx.fillRect(x(start.x-1+j),z(start.z-12+i+1),scale,scale);}
   for(let row=1;row<12;row++)for(const lane of [-2.4,2.4]){const p=ASHFORD.point(-row*7/ASHFORD.length);ctx.fillStyle='#b6b7b1';ctx.fillRect(x(p.x-2),z(p.z+lane+1),.2*scale,2*scale);}
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);groundMaterial.map=texture;
  }
 }else groundMaterial.color.set(0x66704e);
 const floor=new T.Mesh(groundGeometry,groundMaterial);floor.name='ashford_ground';floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;root.add(floor);
 const batches=new Map<keyof typeof materials,T.Matrix4[]>();
 const matrix=new T.Matrix4(),q=new T.Quaternion();
 function box(x:number,y:number,z:number,w:number,h:number,d:number,material:keyof typeof materials,yaw=0){q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const batch=batches.get(material)??[];batch.push(matrix.clone());batches.set(material,batch);}
 for(const s of ASHFORD_SOLIDS)box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,s.material==='stripe'?'boards':s.material,s.yaw);
 // Spectator terraces and pit garages stay outside the continuous barrier.
 for(let row=0;row<5;row++){const h=.6+row*.55,z=-107-row*2;box(0,h/2,z,150,h,2,'concrete');for(let x=-70;x<=70;x+=3)box(x,h+.2,z,2.2,.2,.65,'seat');}
 box(0,5.6,-113,158,.25,14,'steel');for(const x of [-75,-25,25,75])box(x,2.8,-118,.2,5.6,.2,'steel');
 for(let x=-65;x<=65;x+=26){box(x,2.2,-135,23,4.4,12,'stripe');box(x,4.5,-135,24,.2,13,'steel');for(const dx of [-7,0,7])box(x+dx,1.8,-128.9,5,3.4,.15,'seat');}
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='ashford_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 const landscape=createAshfordLandscape();root.add(landscape.root);
 const paddock=createAshfordPaddock();root.add(paddock.root);
 root.userData.solidRecords=ASHFORD_SOLIDS;freezeSceneryTransforms(root);
 let disposed=false;return{root,update:paddock.update,dispose(){if(disposed)return;disposed=true;landscape.dispose();paddock.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});groundGeometry.dispose();boxGeometry.dispose();groundMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
