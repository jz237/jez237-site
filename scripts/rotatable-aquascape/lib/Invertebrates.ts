import * as T from 'three';
import type {Identification} from './Exploration.ts';

type Animal={id:number;kind:'shrimp'|'snail';position:T.Vector3;normal:T.Vector3;heading:number;distance:number;speed:number;remaining:number;grazing:boolean;phase:number;seed:number;route:T.Vector3[];normals:T.Vector3[];length:number;matrix:T.Matrix4;};
const UP=new T.Vector3(0,1,0);
const rand=(a:Animal)=>{a.seed=(Math.imul(a.seed,1664525)+1013904223)>>>0;return a.seed/4294967296;};
/** Speeds here are illustrative world units, not measured species kinematics. */
export function advanceGrazer(a:Animal,dt:number){
 if(dt<=0)return;
 a.remaining-=dt;
 if(a.remaining<=0){a.grazing=!a.grazing;a.remaining=a.kind==='snail'?8+rand(a)*18:a.grazing?3+rand(a)*9:2+rand(a)*5;}
 const target=a.kind==='snail'?(a.grazing?.0015:.006):(a.grazing?0:.035+.025*Math.sin(a.phase*.3)**2);
 a.speed+=(target-a.speed)*(1-Math.exp(-dt*4));a.distance=(a.distance+a.speed*dt)%a.length;a.phase+=dt;
}

/** Shared instanced parts: full articulation adds seven draws, not one draw per leg. */
export class Invertebrates{
 readonly root=new T.Group();readonly animals:Animal[]=[];
 private pools:T.InstancedMesh[]=[];private counts:number[]=[];private owners:number[][]=[];
 private dummy=new T.Object3D();private local=new T.Matrix4();private tangent=new T.Vector3();private binormal=new T.Vector3();private rotation=new T.Matrix4();private link=new T.Vector3();private end=new T.Vector3();
 constructor(scene:T.Scene,height:(x:number,z:number)=>number,surfaces:T.Object3D[]=[]){
  this.root.name='Shrimp and ramshorn snails';scene.add(this.root);
  const skin=new T.MeshPhysicalMaterial({color:0x702a22,roughness:.47,ior:1.15,specularIntensity:.45});
  skin.onBeforeCompile=shader=>{
   shader.vertexShader='varying vec3 grazerPoint;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ngrazerPoint=position;');
   shader.fragmentShader='varying vec3 grazerPoint;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float pigment=fract(sin(dot(floor(grazerPoint*85.),vec3(12.9898,78.233,42.734)))*43758.5453);
diffuseColor.rgb*=mix(.72,1.18,smoothstep(.12,.85,pigment));
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.25,.14,.08),smoothstep(.965,.99,pigment)*.6);
`);
  };skin.customProgramCacheKey=()=> 'dwarf-shrimp-pigment-v1';
  const pale=new T.MeshPhysicalMaterial({color:0x94745c,roughness:.55,ior:1.12,specularIntensity:.35});
  const dark=new T.MeshStandardMaterial({color:0x141813,roughness:.3});
  const flesh=new T.MeshPhysicalMaterial({color:0x8d7564,roughness:.5,ior:1.15,specularIntensity:.4});
  const shell=new T.MeshStandardMaterial({vertexColors:true,roughness:.43});
  const sphere=new T.SphereGeometry(1,24,16),rod=new T.CylinderGeometry(.75,1,1,6,1);
  for(const [g,m,n] of [[sphere,skin,130],[sphere,pale,180],[sphere,dark,60],[rod,pale,650],[sphere,flesh,45],[this.shell(),shell,3],[rod,skin,100]] as [T.BufferGeometry,T.Material,number][]){
   const mesh=new T.InstancedMesh(g,m,n);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.boundingSphere=new T.Sphere(new T.Vector3(0,2.7,0),6.4);mesh.castShadow=true;mesh.receiveShadow=true;this.pools.push(mesh);this.root.add(mesh);this.owners.push([]);
  }
  // Cache contact paths once. Hardscape is raycast at construction, never each frame.
  scene.updateMatrixWorld();const ray=new T.Raycaster(new T.Vector3(),new T.Vector3(0,-1,0));
  const centers=[[-3.8,1.8],[-2.2,1.72],[.1,1.7],[1.8,.9],[3.55,1.45],[-1.3,-.55],[3.6,0]];
  for(let id=0;id<9;id++){
   const kind=id<6?'shrimp':'snail',glass=id>=7,route:T.Vector3[]=[],normals:T.Vector3[]=[];
   for(let j=0;j<192;j++){
    const t=j/192*Math.PI*2;
    if(glass){route.push(new T.Vector3((id===7?-3.5:3.6)+Math.sin(t)*.5,(id===7?2:3.4)+Math.cos(t)*.55,2.321));normals.push(new T.Vector3(0,0,-1));}
    else {const [cx,cz]=centers[id],x=cx+Math.cos(t)*.43,z=cz+Math.sin(t)*.2;let y=height(x,z)+.03;const normal=new T.Vector3(- (height(x+.01,z)-height(x-.01,z))/.02,1,-(height(x,z+.01)-height(x,z-.01))/.02).normalize();
     ray.ray.origin.set(x,5,z);const hit=ray.intersectObjects(surfaces,false).find(h=>h.point.y>y&&h.face&&h.face.normal.clone().transformDirection(h.object.matrixWorld).y>.65);
     if(hit){y=hit.point.y+.014;normal.copy(hit.face!.normal).transformDirection(hit.object.matrixWorld);}route.push(new T.Vector3(x,y,z));normals.push(normal);
    }
   }
   // A route must never bridge a cliff between wood and the floor. Relocate those
   // paths to the open front margin instead of interpolating an airborne animal.
   if(!glass&&route.some((p,j)=>Math.abs(p.y-route[(j+1)%route.length].y)>.045)){
    for(let j=0;j<route.length;j++){const p=route[j];p.z=1.98+Math.sin(j/route.length*Math.PI*2)*.1;p.y=height(p.x,p.z)+.03;normals[j].set(-(height(p.x+.01,p.z)-height(p.x-.01,p.z))/.02,1,-(height(p.x,p.z+.01)-height(p.x,p.z-.01))/.02).normalize();}
   }
   // Uniform arc-length sampling prevents speed changes caused by ellipse curvature.
   const lengths=[0];for(let j=1;j<=route.length;j++)lengths.push(lengths[j-1]+route[j%route.length].distanceTo(route[j-1]));const length=lengths.at(-1)!;
   const points:T.Vector3[]=[],ns:T.Vector3[]=[];let k=0;for(let j=0;j<256;j++){const d=j/256*length;while(k<route.length-1&&lengths[k+1]<d)k++;const f=(d-lengths[k])/(lengths[k+1]-lengths[k]);points.push(route[k].clone().lerp(route[(k+1)%route.length],f));ns.push(normals[k].clone().lerp(normals[(k+1)%route.length],f).normalize());}
   this.animals.push({id,kind,position:new T.Vector3(),normal:new T.Vector3(),heading:0,distance:length*(id*.173%1),speed:0,remaining:2+id*.73,grazing:id%2===0,phase:id*2.7,seed:237+id*3571,route:points,normals:ns,length,matrix:new T.Matrix4()});
  }
  this.update(0);
 }
 private shell(){
  // Planispiral ramshorn shell: expanding whorls, recessed center, growth striae.
  const p:number[]=[],colors:number[]=[],indices:number[]=[],c=new T.Color();const turns=Math.PI*5.7;
  for(let i=0;i<=180;i++){const t=i/180*turns,r=.13*Math.exp(.19*(t-turns)),tube=r*.49;
   for(let j=0;j<=20;j++){const v=j/20*Math.PI*2,ridge=1+.012*Math.sin(t*22);p.push((r+Math.cos(v)*tube*ridge)*Math.cos(t),(r+Math.cos(v)*tube*ridge)*Math.sin(t)+.145,Math.sin(v)*tube*.92);
    c.setRGB(.19,.105,.048).multiplyScalar(.8+.14*Math.sin(t*22)+.14*Math.sin(t*2.1));colors.push(c.r,c.g,c.b);
    if(i<180&&j<20){const n=i*21+j;indices.push(n,n+21,n+1,n+1,n+21,n+22);}
   }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();return g;
 }
 private part(a:Animal,pool:number,x:number,y:number,z:number,sx:number,sy:number,sz:number,rz=0){
  this.dummy.position.set(x,y,z);this.dummy.rotation.set(0,0,rz);this.dummy.scale.set(sx,sy,sz);this.dummy.updateMatrix();this.local.multiplyMatrices(a.matrix,this.dummy.matrix);const n=this.counts[pool]++;this.pools[pool].setMatrixAt(n,this.local);this.owners[pool][n]=a.id;
 }
 private rod(a:Animal,pool:number,x:number,y:number,z:number,ex:number,ey:number,ez:number,r:number){
  this.link.set(ex-x,ey-y,ez-z);this.dummy.position.set((x+ex)/2,(y+ey)/2,(z+ez)/2);this.dummy.quaternion.setFromUnitVectors(UP,this.end.copy(this.link).normalize());this.dummy.scale.set(r,this.link.length(),r);this.dummy.updateMatrix();this.local.multiplyMatrices(a.matrix,this.dummy.matrix);const n=this.counts[pool]++;this.pools[pool].setMatrixAt(n,this.local);this.owners[pool][n]=a.id;
 }
 update(dt:number){
  if(!this.root.visible)return;
  this.counts=this.pools.map(()=>0);
  for(const a of this.animals){advanceGrazer(a,Math.min(.1,Math.max(0,dt)));const u=a.distance/a.length*a.route.length,i=Math.floor(u)%a.route.length,j=(i+1)%a.route.length;
   a.position.copy(a.route[i]).lerp(a.route[j],u-i);a.normal.copy(a.normals[i]).lerp(a.normals[j],u-i).normalize();this.tangent.copy(a.route[j]).sub(a.route[i]).normalize();this.binormal.crossVectors(this.tangent,a.normal).normalize();this.tangent.crossVectors(a.normal,this.binormal).normalize();this.rotation.makeBasis(this.tangent,a.normal,this.binormal);a.matrix.copy(this.rotation).setPosition(a.position);
   if(a.kind==='shrimp')this.shrimp(a);else this.snail(a);
  }
  this.pools.forEach((p,i)=>{p.count=this.counts[i];p.instanceMatrix.needsUpdate=true;});
 }
 private shrimp(a:Animal){
  const t=a.phase,walk=a.speed/.06;
  this.part(a,0,.07,.105,0,.107,.054,.043);this.part(a,1,.10,.135,0,.08,.024,.036); // carapace and dorsal saddle
  this.part(a,2,-.04,.108,0,.15,.008,.009); // digestive tract visible between shell segments
  for(let k=0;k<6;k++){const x=-.035-k*.034,y=.105-.025*(k/5)**2;this.part(a,0,x,y,0,.031,.046-k*.004,.041-k*.0035,.03*Math.sin(t*.8-k*.5));
   for(const side of [-1,1])this.part(a,1,x-.01,y-.045,side*.021,.025,.005,.017,.15*Math.sin(t*3-k*.85));
  }
  for(let k=-2;k<=2;k++)this.part(a,1,-.265,.064,k*.017,.047,.008,.020,k*.17);
  this.rod(a,6,.14,.14,0,.225,.145,0,.008);for(let k=0;k<6;k++)this.rod(a,6,.155+k*.01,.145,0,.15+k*.01,.155,0,.0025);
  for(const side of [-1,1]){
   this.rod(a,3,.137,.13,side*.035,.163,.152,side*.047,.004);this.part(a,2,.167,.153,side*.048,.011,.012,.011);
   for(let k=0;k<5;k++){const x=.11-k*.038,phase=t*(a.grazing?5.5:8)+k*1.1+side*1.5,pick=k<2&&a.grazing,swing=Math.sin(phase)*(pick?.027:.019*walk),lift=Math.max(0,Math.cos(phase))*(pick?.022:.013*walk);
    const kneeX=x-.025+swing,kneeY=.037+lift,kneeZ=side*.061,toeX=pick?.15+swing:x-.055+swing,toeY=.004+lift,toeZ=side*(pick?.028:.082);
    this.rod(a,3,x,.075,side*.032,kneeX,kneeY,kneeZ,.0038);this.rod(a,3,kneeX,kneeY,kneeZ,toeX,toeY,toeZ,.0027);
    if(pick){this.rod(a,3,toeX,toeY,toeZ,toeX+.01,toeY+.003,toeZ+side*.008,.0017);this.rod(a,3,toeX,toeY,toeZ,toeX+.012,toeY+.002,toeZ-side*.007,.0017);}
   }
   for(let antenna=0;antenna<2;antenna++){let x=.18,y=.126,z=side*.018;for(let k=1;k<=7;k++){const f=k/7,len=antenna?.16:.31,ex=.18+f*len,ey=.126+Math.sin(f*2.1)*.065+Math.sin(t*1.2+side+f*2)*.018*f,ez=side*(.018+f*(antenna?.07:.15)+Math.sin(t*.75+antenna+f)*.028*f);this.rod(a,3,x,y,z,ex,ey,ez,.0022*(1-f*.75));x=ex;y=ey;z=ez;}}
   this.part(a,1,.153,.078,side*.012,.014,.017,.009,.22*Math.sin(t*12+side));
  }
 }
 private snail(a:Animal){
  const t=a.phase;this.part(a,4,-.025,.062,0,.074,.068,.052);this.part(a,4,.025,.019,0,.19,.019,.072);this.part(a,4,.166,.042,0,.065,.038,.047);
  this.part(a,5,-.015,0,0,1,1,1); // foot remains at the sampled contact plane
  for(const side of [-1,1]){let x=.19,y=.05,z=side*.03;for(let k=1;k<=6;k++){const f=k/6,ex=.19+f*.10,ey=.05+f*.10+Math.sin(t*.8+side)*f*.014,ez=side*(.03+f*.046)+Math.sin(t*.6+f)*.01*f;this.rod(a,3,x,y,z,ex,ey,ez,.004*(1-f*.7));x=ex;y=ey;z=ez;}this.part(a,2,.191,.05,side*.034,.004,.004,.004);}
  // Small mouth movement is visible through the glass, independent of forward glide.
  this.part(a,4,.206,.008,0,.014+Math.sin(t*2.5)*.002,.005,.014);
 }
 info(id:number):Identification|null{const a=this.animals[id];if(!a)return null;return {kind:'invertebrate',animalId:id,name:a.kind==='shrimp'?`Dwarf shrimp ${id+1}`:`Ramshorn snail ${id-5}`,subtitle:a.kind==='shrimp'?'Neocaridina-like dwarf shrimp · representative model':'Planorbid ramshorn · representative model',needs:'Stable clean water, suitable mineral availability, food and safe grazing surfaces.',role:a.kind==='shrimp'?'Picks biofilm and small food particles with its front appendages. Its legs walk while its antennae explore.':'Grazes surface films using a radula. A muscular foot maintains contact with the glass or substrate.',behavior:a.kind==='shrimp'?(a.grazing?'Picking at a feeding patch.':'Walking to another feeding patch.'):'Slow surface crawling and grazing. These animals recycle material; they also produce waste.',point:a.position.clone()};}
 pick(ray:T.Raycaster){const hit=ray.intersectObjects(this.pools,false)[0];if(!hit||hit.instanceId===undefined)return null;const pool=this.pools.indexOf(hit.object as T.InstancedMesh);return {distance:hit.distance,info:this.info(this.owners[pool][hit.instanceId])!};}
 dispose(){const geometries=new Set(this.pools.map(p=>p.geometry)),materials=new Set(this.pools.map(p=>p.material as T.Material));geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());this.root.removeFromParent();}
}
