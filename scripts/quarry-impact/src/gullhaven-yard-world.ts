import {createVenueCrowd,type SpectatorPlace} from './venue-crowd';
import {attachArenaGroundDetail} from './arena-ground-detail';
import {withBarrierBoardsOf,boardSeed} from './barrier-boards';
import * as T from 'three';
import {GULLHAVEN_OUTLINE,GULLHAVEN_SOLIDS} from './gullhaven-yard-arena';
import {freezeSceneryTransforms} from './render-work';
/** Gullhaven Container Yard: a painted concrete yard walled by barriers, with container
 * stacks across the corners, a quayside gantry crane, stacked boxes, floodlights and a crowd
 * standing on the outer container rows. */
export function createGullhavenWorld(){
 const root=new T.Group();root.name='gullhaven_container_yard';
 const containerColors=[0x8a3b2e,0x2f5d7c,0x3f6e3c,0xb7832f,0x6d6f72,0x7a2f4f,0xa65a26,0x2d4752];
 const materials=withBarrierBoardsOf({concrete:new T.MeshStandardMaterial({color:0xbab4a4,roughness:.97}),yellow:new T.MeshStandardMaterial({color:0xd2a33f,roughness:.88}),steel:new T.MeshStandardMaterial({color:0x2f3639,roughness:.7,metalness:.35}),crane:new T.MeshStandardMaterial({color:0xc8862c,roughness:.75,metalness:.25}),water:new T.MeshStandardMaterial({color:0x34505a,roughness:.25,metalness:.1}),lamp:new T.MeshStandardMaterial({color:0xfff2cc,emissive:0xfff2cc,emissiveIntensity:1.3,roughness:.4}),...Object.fromEntries(containerColors.map((c,i)=>['box'+i,new T.MeshStandardMaterial({color:c,roughness:.8,metalness:.2})]))} as Record<string,T.MeshStandardMaterial>&{yellow:T.MeshStandardMaterial},'yellow',boardSeed('gullhaven-yard-v1'));
 const floorMaterial=new T.MeshStandardMaterial({color:0xffffff,roughness:.95}),floorGeometry=new T.PlaneGeometry(200,200),apronGeometry=new T.PlaneGeometry(2400,2400),apronMaterial=new T.MeshStandardMaterial({color:0x6b6e66,roughness:1}),boxGeometry=new T.BoxGeometry(),textures:T.Texture[]=[];
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.fillStyle='#8d8a82';ctx.fillRect(0,0,1024,1024);let seed=517;
   for(let i=0;i<16000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed>>>22;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#98958c':'#7f7c75';ctx.fillRect(x,seed>>>22,2,2);}
   const scale=1024/200,X=(v:number)=>512+v*scale,Z=(v:number)=>512+v*scale;
   // Slab joints, faded bay numbers and yellow lane paint.
   ctx.strokeStyle='#6f6c66';ctx.lineWidth=1.5;for(let v=-96;v<=96;v+=8){ctx.beginPath();ctx.moveTo(X(v),0);ctx.lineTo(X(v),1024);ctx.stroke();ctx.beginPath();ctx.moveTo(0,Z(v));ctx.lineTo(1024,Z(v));ctx.stroke();}
   ctx.strokeStyle='#d7b54ccc';ctx.lineWidth=.3*scale;for(const z of [-24,24]){ctx.beginPath();ctx.moveTo(X(-50),Z(z));ctx.lineTo(X(50),Z(z));ctx.stroke();}
   ctx.fillStyle='#d9d3c1aa';ctx.font=`bold ${Math.round(5*scale)}px sans-serif`;ctx.textAlign='center';for(const [i,x] of [-36,-12,12,36].entries())ctx.fillText('B'+(i+1),X(x),Z(-30));
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);floorMaterial.map=texture;
  }
 }else floorMaterial.color.set(0x8d8a82);
 if(typeof document!=='undefined')attachArenaGroundDetail(floorMaterial,'harrow');
 const floor=new T.Mesh(floorGeometry,floorMaterial);floor.name='gullhaven_concrete';floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;root.add(floor);
 const apron=new T.Mesh(apronGeometry,apronMaterial);apron.name='gullhaven_apron';apron.rotation.x=-Math.PI/2;apron.position.y=-.03;apron.receiveShadow=true;root.add(apron);
 const batches=new Map<string,T.Matrix4[]>(),matrix=new T.Matrix4(),q=new T.Quaternion(),up=new T.Vector3(0,1,0);
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,finish:string,yaw=0)=>{q.setFromAxisAngle(up,yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const b=batches.get(finish)??[];b.push(matrix.clone());batches.set(finish,b);};
 let seed=29;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const container=(x:number,y:number,z:number,yaw:number,len=12.2)=>{box(x,y,z,len,2.6,2.44,'box'+Math.floor(rand()*containerColors.length),yaw);box(x,y+1.31,z,len-.1,.04,2.38,'steel',yaw);};
 // Solids: barriers (yellow blocks carry sponsor boards) and the corner container stacks.
 for(const s of GULLHAVEN_SOLIDS){
  if(s.material==='container'){for(const level of [0,1])container(s.x,1.3+level*2.6,s.z,s.yaw);continue;}
  box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,s.material==='yellow'?'boards':'concrete',s.yaw);
 }
 // Outer container rows: two and three high, with spectators along the tops.
 const spectators:SpectatorPlace[]=[];
 for(const side of [-1,1]){
  for(let x=-48;x<=48;x+=13){const high=(Math.abs(x)%26<13)?3:2;for(let level=0;level<high;level++)container(x,1.3+level*2.6,side*54,0);
   for(let p=0;p<4;p++){if((x+p)%3===0)continue;spectators.push({x:x-4.5+p*3,y:high*2.6,z:side*54-side*.3,yaw:side>0?Math.PI:0,seated:false});}}
  for(let z=-30;z<=30;z+=13){for(let level=0;level<2;level++)container(side*68,1.3+level*2.6,z,Math.PI/2);for(let p=0;p<3;p++)spectators.push({x:side*68-side*.3,y:5.2,z:z-3+p*3,yaw:side>0?-Math.PI/2:Math.PI/2,seated:false});}
 }
 // Quayside: water strip and a gantry crane beyond the north rows.
 box(0,-.2,92,320,.2,30,'water');box(0,.6,76,320,1.2,4,'concrete');
 for(const x of [-14,14]){for(const z of [64,82])box(x,15,z,1.2,30,1.2,'crane');box(x,30.6,73,1.6,1.2,20,'crane');}
 box(0,31.8,73,32,1.6,2.2,'crane');box(0,32,60,6,2.4,30,'crane');box(0,27,64,4,3,4,'steel');
 // Dockside sheds on the skyline beyond the stacks.
 for(let i=0;i<14;i++){const a=i/14*Math.PI*2+.2,r=150+rand()*60,x=Math.sin(a)*r,z=Math.cos(a)*r;if(z>60&&Math.abs(x)<170)continue;const w=30+rand()*25,h=9+rand()*8,d=18+rand()*12,yaw=-a;box(x,h/2,z,w,h,d,i%3?'concrete':'box'+(i%containerColors.length),yaw);box(x,h+.4,z,w+1,.8,d+1,'steel',yaw);}
 // Floodlight masts.
 for(const [x,z] of [[-64,-50],[64,-50],[-64,50],[64,50]]){box(x,10,z,.45,20,.45,'steel');box(x,20.3,z,4.4,1.3,.5,'steel',Math.atan2(-x,-z));for(const d of [-1.4,0,1.4])box(x+d*Math.cos(Math.atan2(-x,-z)),20.3,z-d*Math.sin(Math.atan2(-x,-z)),1.1,1,.12,'lamp',Math.atan2(-x,-z));}
 const signGeometry=new T.PlaneGeometry(20,4.4),signMaterial=new T.MeshStandardMaterial({color:0xeee6cc,roughness:.85,side:T.DoubleSide});
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=224;const ctx=canvas.getContext('2d');
  if(ctx){ctx.fillStyle='#1d2f3d';ctx.fillRect(0,0,1024,224);ctx.strokeStyle='#e0b24a';ctx.lineWidth=10;ctx.strokeRect(8,8,1008,208);ctx.fillStyle='#f3e8c6';ctx.textAlign='center';ctx.font='bold 70px sans-serif';ctx.fillText('GULLHAVEN CONTAINER YARD',512,108);ctx.font='28px sans-serif';ctx.fillText('MIND THE CORNERS. MIND THE BOXES.',512,170);const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;textures.push(t);signMaterial.map=t;}
 }
 const sign=new T.Mesh(signGeometry,signMaterial);sign.name='gullhaven_sign';sign.position.set(0,11,-54.5);root.add(sign);
 for(const [finish,list]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],list.length);list.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='gullhaven_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 const crowd=createVenueCrowd(spectators);root.add(crowd.root);
 root.userData.solidRecords=GULLHAVEN_SOLIDS;root.userData.outline=GULLHAVEN_OUTLINE;freezeSceneryTransforms(root);
 let disposed=false;return{root,update:crowd.update,dispose(){if(disposed)return;disposed=true;crowd.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});[floorGeometry,apronGeometry,boxGeometry,signGeometry].forEach(g=>g.dispose());[floorMaterial,apronMaterial,signMaterial,...Object.values(materials)].forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
