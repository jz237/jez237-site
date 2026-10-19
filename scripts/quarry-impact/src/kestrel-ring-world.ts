import {createVenueCrowd,type SpectatorPlace} from './venue-crowd';
import {attachArenaGroundDetail} from './arena-ground-detail';
import * as T from 'three';
import {KESTREL_RING_ARENA,KESTREL_RING_BARRIERS} from './kestrel-ring-arena';
import {freezeSceneryTransforms} from './render-work';
/** Kestrel Ring: painted asphalt around a grass island with a tyre wall and a
 * four-faced scoreboard tower; covered stands and floodlights outside. */
export function createKestrelRingWorld(){
 const root=new T.Group();root.name='kestrel_ring';
 const materials={concrete:new T.MeshStandardMaterial({color:0xbcb5a4,roughness:.98}),blue:new T.MeshStandardMaterial({color:0x2f5a86,roughness:.85}),steel:new T.MeshStandardMaterial({color:0x303539,roughness:.7,metalness:.3}),seat:new T.MeshStandardMaterial({color:0x8a3a32,roughness:.85}),cream:new T.MeshStandardMaterial({color:0xd8ccad,roughness:.9}),rubber:new T.MeshStandardMaterial({color:0x1b1c1d,roughness:.95}),white:new T.MeshStandardMaterial({color:0xe9e6dc,roughness:.8}),lamp:new T.MeshStandardMaterial({color:0xfff2cc,emissive:0xfff2cc,emissiveIntensity:1.3,roughness:.4}),pine:new T.MeshStandardMaterial({color:0x2f4a2a,roughness:1}),oak:new T.MeshStandardMaterial({color:0x4a6232,roughness:1})};
 const floorMaterial=new T.MeshStandardMaterial({color:0xffffff,roughness:.93}),floorGeometry=new T.PlaneGeometry(180,180),boxGeometry=new T.BoxGeometry(),tyreGeometry=new T.CylinderGeometry(.42,.42,.3,14),trunkGeometry=new T.CylinderGeometry(.5,.6,1,6),crownGeometry=new T.ConeGeometry(1,1,7),textures:T.Texture[]=[];
 const island=KESTREL_RING_ARENA.island!;
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.fillStyle='#46494b';ctx.fillRect(0,0,1024,1024);let seed=733;
   for(let i=0;i<16000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed>>>22;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#525556':'#3c4042';ctx.fillRect(x,seed>>>22,2,2);}
   const scale=1024/180;
   // Darker racing groove around the middle of the ring, then painted lines.
   ctx.strokeStyle='#36393acc';ctx.lineWidth=9*scale;ctx.beginPath();ctx.arc(512,512,30*scale,0,Math.PI*2);ctx.stroke();
   ctx.strokeStyle='#d8d2bc';ctx.lineWidth=.18*scale;for(const radius of [island+1.6,KESTREL_RING_ARENA.radius-1.6]){ctx.beginPath();ctx.arc(512,512,radius*scale,0,Math.PI*2);ctx.stroke();}
   ctx.setLineDash([3*scale,3*scale]);ctx.beginPath();ctx.arc(512,512,KESTREL_RING_ARENA.spawnRadius*scale,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);floorMaterial.map=texture;
  }
 }else floorMaterial.color.set(0x46494b);
 if(typeof document!=='undefined')attachArenaGroundDetail(floorMaterial,'harrow');
 const floor=new T.Mesh(floorGeometry,floorMaterial);floor.name='kestrel_ring_asphalt';floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;root.add(floor);
 // Mown grass apron beyond the asphalt pad.
 const apronMaterial=new T.MeshStandardMaterial({color:0x6a7d45,roughness:1}),apronGeometry=new T.PlaneGeometry(700,700);
 const apron=new T.Mesh(apronGeometry,apronMaterial);apron.name='kestrel_ring_apron';apron.rotation.x=-Math.PI/2;apron.position.y=-.03;apron.receiveShadow=true;root.add(apron);
 // Grass island inside its wall.
 const grassMaterial=new T.MeshStandardMaterial({color:0x5e7a3c,roughness:1}),islandGeometry=new T.CylinderGeometry(island-.45,island-.2,.7,48);
 const grass=new T.Mesh(islandGeometry,grassMaterial);grass.name='kestrel_ring_island';grass.position.y=.35;grass.receiveShadow=true;root.add(grass);
 const spectators:SpectatorPlace[]=[];
 const batches=new Map<string,{geometry:T.BufferGeometry;finish:keyof typeof materials;list:T.Matrix4[]}>(),matrix=new T.Matrix4(),q=new T.Quaternion(),up=new T.Vector3(0,1,0);
 const put=(geometry:T.BufferGeometry,key:string,finish:keyof typeof materials,x:number,y:number,z:number,w:number,h:number,d:number,yaw=0)=>{q.setFromAxisAngle(up,yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const batch=batches.get(key)??{geometry,finish,list:[]};batch.list.push(matrix.clone());batches.set(key,batch);};
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,finish:keyof typeof materials,yaw=0)=>put(boxGeometry,'box:'+finish,finish,x,y,z,w,h,d,yaw);
 const tyre=(x:number,y:number,z:number,finish:'rubber'|'white'='rubber')=>put(tyreGeometry,'tyre:'+finish,finish,x,y,z,1,1,1);
 KESTREL_RING_BARRIERS.forEach((s,i)=>box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,i<KESTREL_RING_ARENA.segments?(i%10<5?'concrete':'blue'):(i%6<3?'concrete':'blue'),s.yaw));
 // Tyre stacks ring the island just inside its wall; every fourth stack is painted.
 for(let i=0;i<40;i++){const a=i/40*Math.PI*2,r=island-1.4;for(let h=0;h<3;h++)tyre(Math.sin(a)*r,.85+h*.3,Math.cos(a)*r,i%4===0&&h===1?'white':'rubber');}
 // Four-faced scoreboard tower on a concrete plinth with a flag mast.
 box(0,1.2,0,5,1,5,'concrete');for(const [x,z]of [[-1.6,-1.6],[1.6,-1.6],[-1.6,1.6],[1.6,1.6]])box(x,4.7,z,.3,6,.3,'steel');
 box(0,8.6,0,4.6,2.4,4.6,'blue');box(0,9.95,0,5.2,.3,5.2,'steel');
 box(0,13,0,.16,6,.16,'steel');box(.9,15.3,0,1.6,.9,.04,'seat');
 // Covered stands beyond the outer wall, with four service gates.
 for(let i=0;i<40;i++){
  if(i%10<2)continue;const a=i/40*Math.PI*2;
  for(let row=0;row<4;row++){
   const r=55+row*2.3,y=.7+row*.8;box(Math.sin(a)*r,y/2,Math.cos(a)*r,8.4,y,2.1,'concrete',a);box(Math.sin(a)*r,y+.25,Math.cos(a)*r,7.7,.3,.65,'seat',a);
   for(let person=0;person<5;person++){if((i+row+person)%3===0)continue;const offset=(person-2)*1.4,x=Math.sin(a)*r+Math.cos(a)*offset,z=Math.cos(a)*r-Math.sin(a)*offset;spectators.push({x,y,z,yaw:a+Math.PI,seated:(i+person)%6!==0});}
  }
  box(Math.sin(a)*59.5,6.7,Math.cos(a)*59.5,8.6,.24,10.5,'steel',a);
  for(const r of [53.6,64.5])box(Math.sin(a)*r,3.3,Math.cos(a)*r,.18,6.6,.18,'steel',a);
 }
 // Floodlight masts at the gates and between stands.
 for(let i=0;i<8;i++){const a=(i+.5)/8*Math.PI*2,r=68,x=Math.sin(a)*r,z=Math.cos(a)*r;box(x,9,z,.4,18,.4,'steel');box(x,18.2,z,4.4,1.4,.5,'steel',a);for(const dx of [-1.4,0,1.4])box(x+Math.cos(a)*dx-Math.sin(a)*.3,18.2,z-Math.sin(a)*dx-Math.cos(a)*.3,1.1,1,.1,'lamp',a);}
 // A loose tree belt around the grounds.
 let seed=91;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<90;i++){const a=i/90*Math.PI*2+rand()*.05,r=105+rand()*45,x=Math.sin(a)*r,z=Math.cos(a)*r,h=7+rand()*7;put(trunkGeometry,'tree:steel','steel',x,h*.2,z,.5,h*.4,.5);put(crownGeometry,'tree:'+(i%3?'pine':'oak'),i%3?'pine':'oak',x,h*.4+h*.35,z,h*.42,h*.7,h*.42,rand()*6);}
 // Pit huts at two gates.
 for(const a of [0,Math.PI]){const x=Math.sin(a)*72,z=Math.cos(a)*72;box(x,1.6,z,10,3.2,5,'cream',a);box(x,3.35,z,11,.3,6,'blue',a);}
 const signGeometry=new T.PlaneGeometry(4.4,2.1),signMaterial=new T.MeshStandardMaterial({color:0xeee6cc,roughness:.85});
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const ctx=canvas.getContext('2d');
  if(ctx){ctx.fillStyle='#16283a';ctx.fillRect(0,0,512,256);ctx.strokeStyle='#e0c26e';ctx.lineWidth=10;ctx.strokeRect(8,8,496,240);ctx.fillStyle='#f3e7c3';ctx.textAlign='center';ctx.font='bold 62px sans-serif';ctx.fillText('KESTREL',256,104);ctx.fillText('RING',256,172);ctx.font='24px sans-serif';ctx.fillText('KEEP LEFT. OR RIGHT.',256,224);const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;textures.push(t);signMaterial.map=t;}
 }
 for(let i=0;i<4;i++){const a=i*Math.PI/2,sign=new T.Mesh(signGeometry,signMaterial);sign.position.set(Math.sin(a)*2.32,8.6,Math.cos(a)*2.32);sign.rotation.y=a;sign.name='kestrel_ring_scoreboard_'+i;root.add(sign);}
 for(const [key,{geometry,finish,list}]of batches){const mesh=new T.InstancedMesh(geometry,materials[finish],list.length);list.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='kestrel_ring_'+key.replace(':','_');mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 const crowd=createVenueCrowd(spectators);root.add(crowd.root);
 root.userData.solidRecords=KESTREL_RING_BARRIERS;freezeSceneryTransforms(root);
 let disposed=false;return{root,update:crowd.update,dispose(){if(disposed)return;disposed=true;crowd.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});[floorGeometry,apronGeometry,boxGeometry,tyreGeometry,trunkGeometry,crownGeometry,islandGeometry,signGeometry].forEach(g=>g.dispose());[floorMaterial,apronMaterial,grassMaterial,signMaterial,...Object.values(materials)].forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
