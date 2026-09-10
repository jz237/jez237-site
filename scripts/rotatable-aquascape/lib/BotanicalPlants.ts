import {leafSurfaceTexture} from './LeafSurface';
import * as T from 'three';
import {fitLeaf} from './TankSpace';
import {plantCurrent,setPlantRoots} from './PlantCurrent';
import {sandChannel} from './Substrate';

type Species='stem'|'bacopa'|'rotala'|'sword'|'anubias'|'carpet';
const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),up=V(0,1,0);
/** Modeled leaf blades, petioles and branching stems. Nothing faces the camera. */
export function buildBotanicalPlants(scene:T.Scene,height:(x:number,z:number)=>number,time:{value:number}){
 let seed=84237;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const batches=new Map<Species,{geometry:T.BufferGeometry;matrices:T.Matrix4[];colors:T.Color[];roots:number[];flex:number[]}>();
 const dummy=new T.Object3D();
 for(const species of ['stem','bacopa','rotala','sword','anubias','carpet'] as Species[]){
  const p:number[]=[],uv:number[]=[],idx:number[]=[];
  const rows=species==='sword'?20:species==='anubias'||species==='bacopa'?10:species==='rotala'?8:6,cols=species==='sword'?6:species==='carpet'?2:4;
  for(let i=0;i<=rows;i++){
   const t=i/rows,blade=Math.max(0,(t-.08)/.92);
   const profile=species==='bacopa'?Math.pow(blade,1.3):blade;
   const outline=species==='anubias'||species==='bacopa'?Math.pow(Math.sin(profile*Math.PI),.46):species==='sword'?Math.pow(Math.sin(blade*Math.PI),.9):Math.pow(Math.sin(blade*Math.PI),.67);
   const width=t<.08?.012:outline*.5;
   for(let j=0;j<=cols;j++){
    const u=j/cols,s=u*2-1;
    // Arched midrib, modest edge waviness and a rolled tip make a thin living blade.
    const edge=Math.abs(s),wave=Math.sin(t*22+s*3)*edge*edge*(species==='sword'?.03:.012);
    const curl=(species==='sword'?.25:species==='bacopa'?.055:.085)*t*t;
    p.push(s*width,t,-curl+edge*edge*.055*Math.sin(t*Math.PI)+wave);
    uv.push(u,t);
    if(i<rows&&j<cols){const n=i*(cols+1)+j;idx.push(n,n+1,n+cols+1,n+1,n+cols+2,n+cols+1);}
   }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();batches.set(species,{geometry:g,matrices:[],colors:[],roots:[],flex:[]});
 }
 let plantRoot=V(0,0,0),plantFlex=.35;
 const add=(species:Species,pos:T.Vector3,dir:T.Vector3,length:number,width:number,h:number,s:number,l:number,twist=0)=>{
  const batch=batches.get(species)!;dummy.position.copy(pos);dir.normalize();
  // Orient the upper lamina toward the light, instead of leaving leaf faces vertical.
  const across=dir.clone().cross(up);if(across.lengthSq()<.0001)across.set(1,0,0);across.normalize();
  const normal=across.clone().cross(dir).normalize();dummy.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(across,dir,normal));
  dummy.rotateY(twist-.35);dummy.scale.set(width,length,length);dummy.updateMatrix();fitLeaf(dummy,batch.geometry.getAttribute('position') as T.BufferAttribute);batch.matrices.push(dummy.matrix.clone());batch.colors.push(new T.Color().setHSL(h,s,l).convertSRGBToLinear());batch.roots.push(plantRoot.x,plantRoot.y,plantRoot.z);batch.flex.push(plantFlex);
 };
 const stems:{a:T.Vector3;b:T.Vector3;r:number;color:T.Color;root:T.Vector3;flex:number}[]=[];
 const stem=(a:T.Vector3,b:T.Vector3,r:number,color:number)=>stems.push({a,b,r,color:new T.Color(color),root:plantRoot.clone(),flex:plantFlex});
 // Uneven colonies overlap through depth, leaving lower growth and openings around the wood.
 const colonies=[
  [-4.2,-1.65,.55,.34,4.42,22,false],[-3.25,-1.7,.65,.30,4.65,24,false],[-2.18,-1.72,.50,.32,3.62,16,false],
  [-1.25,-1.68,.52,.32,3.65,18,true],[-.20,-1.60,.70,.38,3.96,29,true],[.92,-1.62,.53,.40,3.50,23,true],
  [2.1,-1.65,.55,.34,3.04,18,true],[3.18,-1.55,.62,.38,4.70,25,false],[4.28,-1.24,.37,.49,4.45,22,false],
  [-4.38,-.52,.28,.38,2.70,13,false],[-1.2,-.58,.38,.30,1.35,11,false],[2.88,-.45,.40,.33,2.27,15,false],
  [3.90,.10,.35,.39,1.57,13,false],[.05,-.20,.38,.28,1.15,9,false]
 ] as const;
 for(const [cx,cz,spreadX,spreadZ,maxH,count,red] of colonies)for(let i=0;i<count;i++){
  const radius=Math.sqrt(random()),angle=random()*Math.PI*2;
  const x=cx+Math.cos(angle)*radius*spreadX,z=cz+Math.sin(angle)*radius*spreadZ,base=height(x,z);
  const h=Math.min(5.15-base,maxH*(.78-.19*radius*radius+random()*.23)),phase=random()*Math.PI*2;
  plantRoot=V(x,base,z);plantFlex=.24+random()*.17;
  const leanX=Math.cos(angle)*(.12+random()*.33),leanZ=(random()-.5)*.40;
  const point=(t:number)=>V(T.MathUtils.clamp(x+leanX*t*t+Math.sin(t*4+phase)*.13*t,-4.65,4.65),base+h*t,T.MathUtils.clamp(z+leanZ*t*t,-1.95,1.9));
  const hue=red?.022+random()*.022:.205+random()*.035,light=.26+random()*.065;
  const roundLeaf=!red&&(cx< -3.8||cx>3.7||maxH<2.5)&&i%3!==0;
  const grow=(start:number,end:number,offset:T.Vector3)=>{
   const span=(end-start)*h,nodes=Math.max(7,Math.floor(span*(red?8.8:8.2))),nodeAngle=random()*6.28;
   let previous=point(start);
   for(let j=1;j<=nodes;j++){
    const growth=1-Math.pow(1-j/nodes,1.2),t=start+(end-start)*growth;
    const at=point(t).addScaledVector(offset,growth*growth);
    stem(previous,at,(red?.0055:.0065)*(1-growth*.60),red?0x6d4930:0x496124);previous=at;
    const leafCount=red||roundLeaf?2:(i%3===0?3:2);
    for(let side=0;side<leafCount;side++){
     const a=nodeAngle+j*1.71+side*Math.PI*2/leafCount+(random()-.5)*.30;
     const maturity=Math.sin(growth*Math.PI*.86),length=(red?.30:roundLeaf?.24:.30)*( .55+maturity*.65 )*(.8+random()*.4);
     const direction=V(Math.cos(a),.16+growth*.48+random()*.40,Math.sin(a));
     const leafHue=hue+(red?.14*Math.pow(1-t,1.4):0),leafLight=red?.27+t*.10+random()*.045:light+(random()-.5)*.055;
     add(red?'rotala':roundLeaf?'bacopa':'stem',at,direction,length,length*(red?.37:roundLeaf?.52:.29),leafHue,red?.43+t*.09:.67,leafLight,random()*.85);
    }
   }
  };
  grow(0,1,V(0,0,0));
  // Pruned shoots fork; each offshoot has its own growing tip and node rhythm.
  if(i%3===0)grow(.42,.82+random()*.13,V((random()-.5)*.58,0,(random()-.5)*.34));
 }
 // Sword rosettes use fewer, longer ribbon-like blades with different inclinations.
 for(const [cx,cz,count] of [[-4.1,-.2,7],[-3.6,-1.1,4],[3.95,-.35,6],[3.5,-1.05,4],[-1.35,-1.3,3]])for(let i=0;i<count;i++){
  const x=cx+(random()-.5)*.8,z=cz+(random()-.5)*.7,b=height(x,z);
  plantRoot=V(x,b,z);plantFlex=.7;
  for(let j=0;j<11;j++){const a=j*2.399+i,l=.8+random()*1.65+(cx<0?.30:0);add('sword',V(x,b,z),V(Math.cos(a)*.46,.55+random()*.5,Math.sin(a)*.5),l,.13+random()*.19,.20+random()*.045,.68,.24+random()*.095,random()*.65);}
 }
 // Low rosettes screen the bare lower nodes without closing the sand channel.
 for(const [cx,cz] of [[-.28,-.95],[2.05,-.82]])for(let i=0;i<5;i++){
  const x=cx+(random()-.5)*.68,z=cz+(random()-.5)*.40,b=height(x,z);
  plantRoot=V(x,b,z);plantFlex=.62;
  for(let j=0;j<8;j++){
   const a=j*2.399+i,length=.48+random()*.65;
   add('sword',V(x,b,z),V(Math.cos(a)*.54,.5+random()*.4,Math.sin(a)*.54),length,.10+random()*.11,.19+random()*.035,.59,.23+random()*.085,random()*.7);
  }
 }
 // Oval epiphytes sit on petioles, with clear spaces between leaves.
 for(let i=0;i<70;i++){
  const x=-4.6+random()*4.9,z=-.5+random()*2.5,b=height(x,z)+.02;
  plantRoot=V(x,b,z);plantFlex=.18;
  for(let j=0;j<5;j++){
   const a=j*2.399+i,l=.13+random()*.15,origin=V(x,b,z),tip=origin.clone().add(V(Math.cos(a)*.15,.04+random()*.08,Math.sin(a)*.15));stem(origin,tip,.007,0x425b24);
   add('anubias',tip,V(Math.cos(a)*.65,.2+random()*.5,Math.sin(a)*.65),l,l*.7,.22+random()*.025,.65,.18+random()*.07,random());
  }
 }
 // Dense, irregular carpeting with rounded small blades and an open sand channel.
 for(let i=0;i<4800;i++){
  const x=(random()-.5)*9.85,z=(random()-.5)*4.4,{left,right}=sandChannel(z);
  const inside=Math.min(x-left,right-x);
  if(inside>.10||inside>-.07&&random()<(inside+.07)/.17||z<-.75&&random()<.70)continue;
  const b=height(x,z)+.015;
  plantRoot=V(x,b,z);plantFlex=.4;
  for(let j=0;j<4;j++){const a=random()*Math.PI*2,l=.06+random()*.10;add('carpet',V(x,b,z),V(Math.cos(a)*.8,.35+random()*.7,Math.sin(a)*.8),l,l*.73,.19+random()*.07,.70,.25+random()*.14);}
 }
 const tissue=leafSurfaceTexture();
 for(const [species,batch] of batches){
  const material=new T.MeshPhysicalMaterial({color:0xffffff,map:tissue,bumpMap:tissue,bumpScale:species==='sword'?.012:.003,roughness:species==='anubias'||species==='bacopa'?.46:.61,ior:1.18,specularIntensity:.8,side:T.DoubleSide});
  plantCurrent(material,time,true);setPlantRoots(batch.geometry,batch.roots,batch.flex);
  const leaves=new T.InstancedMesh(batch.geometry,material,batch.matrices.length);batch.matrices.forEach((m,i)=>{leaves.setMatrixAt(i,m);leaves.setColorAt(i,batch.colors[i]);});leaves.castShadow=true;leaves.receiveShadow=true;leaves.computeBoundingSphere();
  leaves.customDepthMaterial=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,side:T.DoubleSide});plantCurrent(leaves.customDepthMaterial,time,true);scene.add(leaves);
 }
 const stemsMesh=new T.InstancedMesh(new T.CylinderGeometry(1,1,1,5),new T.MeshStandardMaterial({roughness:.85}),stems.length);
 stems.forEach(({a,b,r,color},i)=>{dummy.position.copy(a).add(b).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());dummy.scale.set(r,a.distanceTo(b),r);dummy.updateMatrix();stemsMesh.setMatrixAt(i,dummy.matrix);stemsMesh.setColorAt(i,color);});stemsMesh.computeBoundingSphere();scene.add(stemsMesh);
 setPlantRoots(stemsMesh.geometry,stems.flatMap(s=>s.root.toArray()),stems.map(s=>s.flex));plantCurrent(stemsMesh.material as T.Material,time);
}
