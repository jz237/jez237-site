import {leafSurfaceMaps} from './LeafSurface';
import * as T from 'three';
import {fitLeaf} from './TankSpace';
import {plantCurrent,setPlantRoots} from './PlantCurrent';
import {sandChannel} from './Substrate';

type Species='stem'|'bacopa'|'rotala'|'ludwigia'|'sword'|'anubias'|'carpet';
const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),up=V(0,1,0);
/** Modeled leaf blades, petioles and branching stems. Nothing faces the camera. */
export function buildBotanicalPlants(scene:T.Scene,height:(x:number,z:number)=>number,time:{value:number}){
 let seed=84237;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const batches=new Map<string,{species:Species;geometry:T.BufferGeometry;matrices:T.Matrix4[];colors:T.Color[];roots:number[];flex:number[];motion:number[]}>();
 const dummy=new T.Object3D();
 const variants=6;
 for(const species of ['stem','bacopa','rotala','ludwigia','sword','anubias','carpet'] as Species[])for(let variant=0;variant<variants;variant++){
  const form=variant/(variants-1),handedness=variant%2?1:-1;
  const p:number[]=[],uv:number[]=[],idx:number[]=[];
  const rows=species==='sword'?28:species==='carpet'?8:species==='bacopa'||species==='anubias'?32:24,cols=species==='carpet'?4:species==='sword'?16:12;
  for(let i=0;i<=rows;i++){
   const t=i/rows,blade=Math.max(0,(t-.08)/.92);
   const profile=species==='bacopa'?Math.pow(blade,1.2+form*.2):species==='ludwigia'?Math.pow(blade,.72+form*.18):species==='sword'?Math.pow(blade,.82+form*.24):Math.pow(blade,.78+form*.32);
   const outline=species==='anubias'||species==='bacopa'?Math.pow(Math.sin(profile*Math.PI),.46):species==='sword'?Math.pow(Math.sin(profile*Math.PI),.72):Math.pow(Math.sin(profile*Math.PI),species==='ludwigia'?.56:.82);
   // A continuous petiole-to-blade transition avoids the old abrupt shoulder.
   const width=t<.08?.008:T.MathUtils.lerp(.008,outline*.5,T.MathUtils.smoothstep(t,.08,.18));
   for(let j=0;j<=cols;j++){
    const u=j/cols,s=u*2-1;
    // Arched midrib, modest edge waviness and a rolled tip make a thin living blade.
    const edge=Math.abs(s),wave=Math.sin(t*22+s*3+variant*.9)*edge*edge*(species==='sword'?.018:.006)*Math.sin(t*Math.PI);
    const curl=(species==='sword'?.28:species==='bacopa'?.07:.18)*t*t*(.55+form*.95);
    const asymmetry=handedness*(.25+form*.75)*Math.sin(t*Math.PI);
    const arch=Math.sin(t*Math.PI)*(.018+form*.055);
    const bladeWeight=T.MathUtils.smoothstep(t,.08,.18)*Math.sin(t*Math.PI);
    const midrib=Math.exp(-s*s*90)*.010*bladeWeight;
    const ribbing=species==='sword'?Math.cos(s*Math.PI*6)*.0045*bladeWeight*(1-edge):0;
    p.push(s*width*(1+s*asymmetry*.14)+asymmetry*.035,t,arch-curl+midrib+ribbing+edge*edge*(.016+form*.027)*Math.sin(t*Math.PI)+wave+s*width*handedness*t*(.06+form*.18));
    uv.push(u,t);
    if(i<rows&&j<cols){const n=i*(cols+1)+j;idx.push(n,n+1,n+cols+1,n+1,n+cols+2,n+cols+1);}
   }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();batches.set(`${species}-${variant}`,{species,geometry:g,matrices:[],colors:[],roots:[],flex:[],motion:[]});
 }
 let plantRoot=V(0,0,0),plantFlex=.35;
 const add=(species:Species,pos:T.Vector3,dir:T.Vector3,length:number,width:number,h:number,s:number,l:number,twist=0)=>{
  const variant=Math.abs(Math.floor(pos.x*117+pos.y*83+pos.z*31+dir.x*7))%variants;
  const batch=batches.get(`${species}-${variant}`)!;dummy.position.copy(pos);dir.normalize();
  // Orient the upper lamina toward the light, instead of leaving leaf faces vertical.
  const across=dir.clone().cross(up);if(across.lengthSq()<.0001)across.set(1,0,0);across.normalize();
  const normal=across.clone().cross(dir).normalize();dummy.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(across,dir,normal));
  dummy.rotateY(twist-.35);dummy.scale.set(width,length,length);dummy.updateMatrix();fitLeaf(dummy,batch.geometry.getAttribute('position') as T.BufferAttribute);batch.matrices.push(dummy.matrix.clone());batch.colors.push(new T.Color().setHSL(h,s,l).convertSRGBToLinear());batch.roots.push(plantRoot.x,plantRoot.y,plantRoot.z);batch.flex.push(plantFlex);
  const phase=pos.x*13.7+pos.y*9.3+pos.z*17.1+dir.x*4.2;
  batch.motion.push(phase,Math.min(.085,.032/Math.max(length,.01)),.8+(Math.sin(phase*1.7)*.5+.5)*.75);
 };
 const stems:{a:T.Vector3;b:T.Vector3;r:number;color:T.Color;root:T.Vector3;flex:number}[]=[];
 const stem=(a:T.Vector3,b:T.Vector3,r:number,color:number)=>stems.push({a,b,r,color:new T.Color(color),root:plantRoot.clone(),flex:plantFlex});
 // Uneven colonies overlap through depth, leaving lower growth and openings around the wood.
 const colonies=[
  [-4.2,-1.65,.55,.34,4.42,12,false],[-3.25,-1.7,.65,.30,4.65,14,false],[-2.18,-1.72,.50,.32,3.62,8,false],
  [-1.25,-1.68,.52,.32,3.65,9,true],[-.20,-1.60,.70,.38,3.96,14,true],[.92,-1.62,.53,.40,3.50,12,true],
  [2.1,-1.65,.55,.34,3.04,9,true],[3.18,-1.55,.62,.38,4.70,14,false],[4.28,-1.24,.37,.49,4.45,12,false],
  [-4.38,-.52,.28,.38,2.70,7,false],[-1.2,-.58,.38,.30,.95,3,false],[2.88,-.45,.40,.33,2.27,8,false],
  [3.90,.10,.35,.39,1.57,7,false],[.05,-.20,.38,.28,.80,3,false]
 ] as const;
 for(const [cx,cz,spreadX,spreadZ,maxH,count,red] of colonies)for(let i=0;i<count;i++){
  const radius=Math.sqrt(random()),angle=random()*Math.PI*2;
  const x=cx+Math.cos(angle)*radius*spreadX,z=cz+Math.sin(angle)*radius*spreadZ,base=height(x,z);
  const h=Math.min(5.15-base,maxH*(.78-.19*radius*radius+random()*.23)),phase=random()*Math.PI*2;
  plantRoot=V(x,base,z);plantFlex=.24+random()*.17;
  const leanX=Math.cos(angle)*(.12+random()*.33),leanZ=(random()-.5)*.40;
  const point=(t:number)=>V(T.MathUtils.clamp(x+leanX*t*t+Math.sin(t*4+phase)*.13*t,-4.65,4.65),base+h*t,T.MathUtils.clamp(z+leanZ*t*t,-1.95,1.9));
  const hue=red?-.018+random()*.026:.205+random()*.035,light=.26+random()*.065;
  const roundLeaf=!red&&(maxH<2.5||(cx< -3.8||cx>3.7)&&i%5===0);
  const broadRed=red&&i%5===0;
  const grow=(start:number,end:number,offset:T.Vector3,vigor=1)=>{
   const span=(end-start)*h,nodes=Math.max(4,Math.floor(span*(red?5.2:5.0))),nodeAngle=random()*6.28,spiral=Math.PI*.5+(random()-.5)*.22;
   let previous=point(start);
   for(let j=1;j<=nodes;j++){
    const node=j===nodes?1:(j+Math.sin(j*2.4+phase)*.16)/nodes;
    const growth=1-Math.pow(1-node,1.34),t=start+(end-start)*growth;
    const at=point(t).addScaledVector(offset,Math.sin(growth*Math.PI*.5));
    at.x=T.MathUtils.clamp(at.x,-4.7,4.7);at.z=T.MathUtils.clamp(at.z,-2.05,2.05);
    stem(previous,at,(red?.0055:.0065)*(1-growth*.60),red?0x6d4930:0x496124);previous=at;
    const leafCount=2;
    for(let side=0;side<leafCount;side++){
     // Full-sized mature leaves persist below a compact tip; a sine profile made
     // every stem look like the same triangular miniature conifer.
     const a=nodeAngle+j*spiral+side*Math.PI+(random()-.5)*.35;
     const tip=T.MathUtils.smoothstep(growth,.77,1),length=(broadRed?.34:red?.38:roundLeaf?.29:.40)*(1-tip*.48)*(.78+random()*.40)*vigor;
     const direction=V(Math.cos(a),.42+tip*.50+random()*.60,Math.sin(a));
     const redGrowth=T.MathUtils.smoothstep(t,.25,.91);
     const leafHue=red?T.MathUtils.lerp(.18,hue,redGrowth):hue,leafLight=red?.29+redGrowth*.065+random()*.035:light+(random()-.5)*.045;
     add(broadRed?'ludwigia':red?'rotala':roundLeaf?'bacopa':'stem',at,direction,length,length*(broadRed?.60:red?.25:roundLeaf?.56:.27),leafHue,red?.49:.63,leafLight,(random()-.5)*.75+.35);
    }
   }
  };
  grow(0,1,V(0,0,0));
  // Pruned shoots fork; each offshoot has its own growing tip and node rhythm.
  if(i%3===1){
   const start=.28+random()*.26,a=angle+(random()-.5)*2.0,reach=.25+random()*.42;
   grow(start,.72+random()*.22,V(Math.cos(a)*reach,0,Math.sin(a)*reach*.65),.74+random()*.15);
  }
  if(i%11===2){
   const a=angle+Math.PI+random()*.8;
   grow(.18+random()*.20,.56+random()*.18,V(Math.cos(a)*.38,0,Math.sin(a)*.24),.70);
  }
 }
 // Sword rosettes use fewer, longer ribbon-like blades with different inclinations.
 for(const [cx,cz,count] of [[-4.25,-1.5,7],[-3.6,-1.5,4],[3.95,-.35,3],[3.5,-1.05,2]])for(let i=0;i<count;i++){
  const x=cx+(random()-.5)*.8,z=cz+(random()-.5)*.7,b=height(x,z);
  plantRoot=V(x,b,z);plantFlex=.7;
  for(let j=0;j<11;j++){
   const a=j*2.399+i,l=.8+random()*1.65+(cx<0?.30:0),direction=V(Math.cos(a)*.46,.55+random()*.5,Math.sin(a)*.5).normalize();
   const origin=V(x,b,z),petiole=l*(.16+(j%3)*.035),tip=origin.clone().addScaledVector(direction,petiole);
   tip.x=T.MathUtils.clamp(tip.x,-4.87,4.87);tip.z=T.MathUtils.clamp(tip.z,-2.1,2.1);
   stem(origin,tip,.006+l*.0015,0x52752d);
   add('sword',tip,direction,l-petiole,.13+random()*.19,.20+random()*.045,.68,.24+random()*.095,random()*.65);
  }
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
 const tissues={fine:leafSurfaceMaps('fine'),round:leafSurfaceMaps('round',2732),sword:leafSurfaceMaps('sword',2733)};
 for(const batch of batches.values()){
  const {species}=batch;
  const tissue=tissues[species==='sword'?'sword':species==='anubias'||species==='bacopa'||species==='ludwigia'?'round':'fine'];
  const material=new T.MeshPhysicalMaterial({color:0xffffff,map:tissue.color,bumpMap:tissue.bump,roughnessMap:tissue.roughness,bumpScale:species==='sword'?.011:.004,roughness:species==='anubias'||species==='bacopa'?.66:.79,ior:1.18,specularIntensity:.7,side:T.DoubleSide});
  plantCurrent(material,time,true);setPlantRoots(batch.geometry,batch.roots,batch.flex);
  batch.geometry.setAttribute('leafMotion',new T.InstancedBufferAttribute(new Float32Array(batch.motion),3));
  const leaves=new T.InstancedMesh(batch.geometry,material,batch.matrices.length);batch.matrices.forEach((m,i)=>{leaves.setMatrixAt(i,m);leaves.setColorAt(i,batch.colors[i]);});leaves.castShadow=true;leaves.receiveShadow=true;leaves.computeBoundingSphere();
  leaves.userData.plantSpecies=species;
  leaves.customDepthMaterial=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,side:T.DoubleSide});plantCurrent(leaves.customDepthMaterial,time,true);scene.add(leaves);
 }
 const stemsMesh=new T.InstancedMesh(new T.CylinderGeometry(1,1,1,5),new T.MeshStandardMaterial({roughness:.85}),stems.length);
 stems.forEach(({a,b,r,color},i)=>{dummy.position.copy(a).add(b).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());dummy.scale.set(r,a.distanceTo(b),r);dummy.updateMatrix();stemsMesh.setMatrixAt(i,dummy.matrix);stemsMesh.setColorAt(i,color);});stemsMesh.computeBoundingSphere();scene.add(stemsMesh);
 setPlantRoots(stemsMesh.geometry,stems.flatMap(s=>s.root.toArray()),stems.map(s=>s.flex));plantCurrent(stemsMesh.material as T.Material,time);
 stemsMesh.castShadow=stemsMesh.receiveShadow=true;
 stemsMesh.customDepthMaterial=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking});plantCurrent(stemsMesh.customDepthMaterial,time);
}
