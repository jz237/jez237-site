import * as T from 'three';
import {fitLeaf} from './TankSpace';

type Species='stem'|'rotala'|'sword'|'anubias'|'carpet'|'moss';
const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),up=V(0,1,0);
/** Modeled leaf blades, petioles and branching stems. Nothing faces the camera. */
export function buildBotanicalPlants(scene:T.Scene,height:(x:number,z:number)=>number,time:{value:number}){
 let seed=84237;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const batches=new Map<Species,{geometry:T.BufferGeometry;matrices:T.Matrix4[];colors:T.Color[]}>();
 const dummy=new T.Object3D();
 for(const species of ['stem','rotala','sword','anubias','carpet','moss'] as Species[]){
  const p:number[]=[],uv:number[]=[],idx:number[]=[];
  const rows=species==='sword'?24:species==='anubias'?14:species==='carpet'||species==='moss'?6:12,cols=species==='sword'?8:4;
  for(let i=0;i<=rows;i++){
   const t=i/rows,blade=Math.max(0,(t-.08)/.92);
   const outline=species==='anubias'?Math.pow(Math.sin(blade*Math.PI),.54):species==='sword'?Math.pow(Math.sin(blade*Math.PI),.9):Math.pow(Math.sin(blade*Math.PI),.67);
   const width=t<.08?.012:outline*.5;
   for(let j=0;j<=cols;j++){
    const u=j/cols,s=u*2-1;
    // Arched midrib, modest edge waviness and a rolled tip make a thin living blade.
    const edge=Math.abs(s),wave=Math.sin(t*22+s*3)*edge*edge*(species==='sword'?.03:.012);
    const curl=(species==='sword'?.25:.13)*t*t;
    p.push(s*width,t,-curl+edge*edge*.055*Math.sin(t*Math.PI)+wave);
    uv.push(u,t);
    if(i<rows&&j<cols){const n=i*(cols+1)+j;idx.push(n,n+1,n+cols+1,n+1,n+cols+2,n+cols+1);}
   }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();batches.set(species,{geometry:g,matrices:[],colors:[]});
 }
 const add=(species:Species,pos:T.Vector3,dir:T.Vector3,length:number,width:number,h:number,s:number,l:number,twist=0)=>{
  const batch=batches.get(species)!;dummy.position.copy(pos);dummy.quaternion.setFromUnitVectors(up,dir.normalize());dummy.rotateY(twist);dummy.scale.set(width,length,length);dummy.updateMatrix();fitLeaf(dummy,batch.geometry.getAttribute('position') as T.BufferAttribute);batch.matrices.push(dummy.matrix.clone());batch.colors.push(new T.Color().setHSL(h,s,l).convertSRGBToLinear());
 };
 const stems:{a:T.Vector3;b:T.Vector3;r:number;color:T.Color}[]=[];
 const stem=(a:T.Vector3,b:T.Vector3,r:number,color:number)=>stems.push({a,b,r,color:new T.Color(color)});
 // Clusters spread through depth; height varies gradually around each colony.
 const colonies=[[-4.1,-1.55,1.15,4.55,false],[-2.7,-1.7,.95,4.4,false],[-.65,-1.55,1.0,4.1,true],[.8,-1.65,.9,4.15,true],[2.2,-1.5,.95,3.65,true],[3.6,-1.55,1.1,4.45,false],[4.2,-.75,.6,3.5,false]] as const;
 for(const [cx,cz,spread,maxH,red] of colonies)for(let i=0;i<54;i++){
  const x=T.MathUtils.clamp(cx+(random()-.5)*spread*1.6,-4.85,4.85),z=T.MathUtils.clamp(cz+(random()-.5)*.8,-2.1,1.5),base=height(x,z),h=maxH*(.65+random()*.35),leanX=(random()-.5)*.5,leanZ=(random()-.5)*.25,phase=random()*6;
  const point=(t:number)=>V(x+leanX*t+Math.sin(t*3+phase)*.065*t,base+h*t,z+leanZ*t);
  const nodes=21+Math.floor(random()*7);let previous=point(0);
  for(let j=1;j<=nodes;j++){
   const t=j/nodes,at=point(t);stem(previous,at,.009*(1-t*.6),red?0x756239:0x617b30);previous=at;
   for(let side=0;side<2;side++){
    const a=j*Math.PI*.51+phase+side*Math.PI,length=(.23+random()*.15)*(1-t*.25);
    add(red?'rotala':'stem',at,V(Math.cos(a),.25+random()*.7,Math.sin(a)),length,length*(red?.28:.34),red?.012+random()*.035:.20+random()*.065,red?.63:.71,red?.22+random()*.10:.25+random()*.12,random()*.6);
   }
  }
 }
 // Sword rosettes use fewer, longer ribbon-like blades with different inclinations.
 for(const [cx,cz,count] of [[-4.1,-.2,7],[-3.6,-1.1,4],[3.95,-.35,6],[3.5,-1.05,4],[-1.35,-1.3,3]])for(let i=0;i<count;i++){
  const x=cx+(random()-.5)*.8,z=cz+(random()-.5)*.7,b=height(x,z);
  for(let j=0;j<11;j++){const a=j*2.399+i,l=.8+random()*1.65;add('sword',V(x,b,z),V(Math.cos(a)*.46,.55+random()*.5,Math.sin(a)*.5),l,.13+random()*.19,.20+random()*.045,.68,.24+random()*.095,random()*.65);}
 }
 // Oval epiphytes sit on petioles, with clear spaces between leaves.
 for(let i=0;i<140;i++){
  const x=-4.6+random()*4.9,z=-.5+random()*2.5,b=height(x,z)+.02;
  for(let j=0;j<5;j++){
   const a=j*2.399+i,l=.16+random()*.24,origin=V(x,b,z),tip=origin.clone().add(V(Math.cos(a)*.15,.08+random()*.15,Math.sin(a)*.15));stem(origin,tip,.007,0x425b24);
   add('anubias',tip,V(Math.cos(a)*.65,.2+random()*.5,Math.sin(a)*.65),l,l*.7,.22+random()*.025,.65,.18+random()*.07,random());
  }
 }
 // Fine fern pinnae grow along arching midribs.
 for(let i=0;i<65;i++){
  const x=-4+random()*3.2,z=-.6+random()*1.9,b=height(x,z)+.05;
  for(let j=0;j<4;j++){
   const a=j*2.4+i,len=.45+random()*.85,dir=V(Math.cos(a)*.6,.85,Math.sin(a)*.6),origin=V(x,b,z);let previous=origin;
   for(let k=1;k<=12;k++){
    const t=k/12,point=origin.clone().addScaledVector(dir,len*t);point.y-=t*t*.22;stem(previous,point,.004,0x496e2c);previous=point;
    for(const sign of [-1,1])add('stem',point,V(Math.cos(a+sign*1.1),.25,Math.sin(a+sign*1.1)),.14*(1-t*.7),.045*(1-t*.6),.23,.69,.24+random()*.10);
   }
  }
 }
 // Dense, irregular carpeting with rounded small blades and an open sand channel.
 for(let i=0;i<4800;i++){
  const x=(random()-.5)*9.85,z=(random()-.5)*4.4,path=1.5+Math.sin(z*1.05)*.65,width=.42+(z+2.2)*.16;
  if(Math.abs(x-path)<width+.10+random()*.08||z<-.75&&random()<.70)continue;
  const b=height(x,z)+.015;
  for(let j=0;j<4;j++){const a=random()*Math.PI*2,l=.06+random()*.10;add('carpet',V(x,b,z),V(Math.cos(a)*.8,.35+random()*.7,Math.sin(a)*.8),l,l*.73,.19+random()*.07,.70,.25+random()*.14);}
 }
 for(let i=0;i<1200;i++){
  const t=random(),x=-2.85+t*1.45+(random()-.5)*.42,y=1.2+t*2.5,z=-.1-t*.8+(random()-.5)*.4;
  const a=random()*6.28;add('moss',V(x,y,z),V(Math.cos(a)*.5,.7,Math.sin(a)*.5),.05+random()*.1,.018+random()*.035,.21+random()*.06,.73,.23+random()*.16);
 }
 for(const [species,batch] of batches){
  const material=new T.MeshStandardMaterial({color:0xffffff,roughness:species==='anubias'?.38:.62,side:T.DoubleSide});
  material.onBeforeCompile=shader=>{
   shader.uniforms.waterTime=time;shader.vertexShader='uniform float waterTime;varying vec2 botanicalUv;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>\nbotanicalUv=uv;vec3 root=instanceMatrix[3].xyz;transformed.z+=sin(waterTime*.8+root.x*1.2+root.z*2.)*.035*uv.y*uv.y;transformed.x+=sin(waterTime*.55+root.x*2.)*.016*uv.y*uv.y;`);
   shader.fragmentShader='varying vec2 botanicalUv;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
    float mid=exp(-abs(botanicalUv.x-.5)*160.);
    float veins=pow(max(0.,cos((botanicalUv.y-abs(botanicalUv.x-.5)*.32)*150.)),22.);
    float mottling=sin(botanicalUv.x*71.+sin(botanicalUv.y*33.)*2.)*sin(botanicalUv.y*119.);
    diffuseColor.rgb*=.80+.22*sin(botanicalUv.y*3.14159)+mid*.24+veins*.095+mottling*.035;
   `);
   // Soft transmitted green light prevents the paper-black backs of single-thickness leaves.
   shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`outgoingLight+=diffuseColor.rgb*.11;\n#include <opaque_fragment>`);
  };
  const leaves=new T.InstancedMesh(batch.geometry,material,batch.matrices.length);batch.matrices.forEach((m,i)=>{leaves.setMatrixAt(i,m);leaves.setColorAt(i,batch.colors[i]);});leaves.castShadow=true;leaves.receiveShadow=true;leaves.computeBoundingSphere();scene.add(leaves);
 }
 const stemsMesh=new T.InstancedMesh(new T.CylinderGeometry(1,1,1,5),new T.MeshStandardMaterial({roughness:.85}),stems.length);
 stems.forEach(({a,b,r,color},i)=>{dummy.position.copy(a).add(b).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());dummy.scale.set(r,a.distanceTo(b),r);dummy.updateMatrix();stemsMesh.setMatrixAt(i,dummy.matrix);stemsMesh.setColorAt(i,color);});stemsMesh.computeBoundingSphere();scene.add(stemsMesh);
}
