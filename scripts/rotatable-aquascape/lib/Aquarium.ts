import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {Tetra3D} from './Tetra3D';
import {createTetraSwim,advanceTetraSwim,tetraBehaviorLabel,type TetraSwim} from './TetraSwimming';
import {createSchoolRoute,advanceSchoolRoute,schoolLane} from './SchoolRoute';
import {separateFish} from './FishCollisions';

import {fishPosition,fishCoordinates,clearHardscape,fitLeaf,type Obstacle} from './TankSpace';

const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
const clamp=T.MathUtils.clamp;
const up=V(0,1,0);
export class Aquarium{
 readonly ready:Promise<void>;
 paused=false;
 evening=false;
 status='Exploring';
 private renderer:T.WebGLRenderer;
 private scene=new T.Scene();
 private camera=new T.PerspectiveCamera(37,1,.1,100);
 private controls:OrbitControls;
 private targetCamera:T.Vector3|null=null;
 private time=0;
 private last=0;
 private seed=237;
 private daylight=1;
 private key=new T.SpotLight(0xe8f8ed,200,26,.94,.65,1.1);
 private fill=new T.HemisphereLight(0xc2e2e6,0x283122,1.65);
 private swimShader={value:0};
 private fishes:{model:Tetra3D;swim:TetraSwim;size:number}[]=[];
 private school=createSchoolRoute();
 private texture=new T.Texture();
 private obstacles:Obstacle[]=[];
 private food:{mesh:T.Mesh;age:number}[]=[];
 private dust:T.Points;
 private bubbles:T.InstancedMesh;
 private water:T.Mesh;
 private frame=0;
 private resizeObserver:ResizeObserver;
 constructor(private host:HTMLElement){
  this.renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));
  this.renderer.outputColorSpace=T.SRGBColorSpace;
  this.renderer.toneMapping=T.ACESFilmicToneMapping;
  this.renderer.toneMappingExposure=1.12;
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFShadowMap;
  host.appendChild(this.renderer.domElement);
  this.renderer.domElement.tabIndex=0;
  this.renderer.domElement.setAttribute('aria-label','Aquarium. Drag to rotate, use the view and zoom buttons below.');
  this.scene.background=new T.Color(0x080f12);
  this.scene.fog=new T.FogExp2(0x0a161b,.023);
  const pmrem=new T.PMREMGenerator(this.renderer),environment=new RoomEnvironment();
  this.scene.environment=pmrem.fromScene(environment,.035).texture;this.scene.environmentIntensity=.18;
  environment.dispose();pmrem.dispose();
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);
  this.controls.target.set(0,2.75,0);
  this.controls.enableDamping=true;this.controls.dampingFactor=.07;this.controls.enablePan=false;
  this.controls.minAzimuthAngle=-Math.PI*.42;this.controls.maxAzimuthAngle=Math.PI*.46;
  this.controls.minPolarAngle=Math.PI*.31;this.controls.maxPolarAngle=Math.PI*.515;
  this.controls.minDistance=10.8;this.controls.maxDistance=29;
  this.controls.rotateSpeed=.55;this.controls.zoomSpeed=.7;
  this.controls.addEventListener('start',()=>this.targetCamera=null);
  this.camera.position.set(10,7.6,18.5);
  this.scene.add(this.fill,this.key);
  this.key.position.set(-1.5,8,1.7);this.key.target.position.set(0,1,-.5);this.scene.add(this.key.target);
  this.key.castShadow=true;this.key.shadow.mapSize.set(2048,2048);this.key.shadow.bias=-.0003;this.key.shadow.normalBias=.035;this.key.shadow.radius=3;
  const rim=new T.DirectionalLight(0xa1cbd5,.9);rim.position.set(-5,6,-3);this.scene.add(rim);
  const warm=new T.PointLight(0xffd9ad,7,18,2);warm.position.set(6,5,5);this.scene.add(warm);
  this.buildTank();this.buildLandscape();this.buildPlants();
  this.water=this.buildWater();
  this.dust=this.buildParticles();
  this.bubbles=new T.InstancedMesh(new T.SphereGeometry(.018,7,5),new T.MeshPhysicalMaterial({color:0xd2eee0,roughness:.05,metalness:.1,transparent:true,opacity:.36,depthWrite:false}),48);
  this.scene.add(this.bubbles);
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize();
  this.ready=this.loadFish();
  this.frame=requestAnimationFrame(this.animate);
  document.addEventListener('visibilitychange',()=>{this.last=0;});
 }
 private random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 private mesh(g:T.BufferGeometry,m:T.Material,p:T.Vector3,shadow=true){const o=new T.Mesh(g,m);o.position.copy(p);o.castShadow=shadow;o.receiveShadow=shadow;this.scene.add(o);return o;}
 private box(w:number,h:number,d:number,material:T.Material,p:T.Vector3,shadow=true){return this.mesh(new T.BoxGeometry(w,h,d),material,p,shadow);}
 private texturedMaterial(base:string,kind:'stone'|'soil'|'wood'){
  const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d')!;
  ctx.fillStyle=base;ctx.fillRect(0,0,512,512);
  for(let i=0;i<28000;i++){
   const x=this.random()*512,y=this.random()*512,v=this.random();
   ctx.fillStyle=v>.5?`rgba(205,201,167,${this.random()*.20})`:`rgba(5,11,9,${this.random()*.35})`;
   if(kind==='wood'){ctx.fillRect(x,y,.5+this.random()*2,7+this.random()*55);}
   else{const r=kind==='soil'?.7+this.random()*3:.5+this.random()*1.5;ctx.beginPath();ctx.ellipse(x,y,r,r*.65,0,0,Math.PI*2);ctx.fill();}
  }
  if(kind==='stone')for(let j=0;j<17;j++){ctx.strokeStyle='rgba(181,191,177,.19)';ctx.lineWidth=.5+this.random()*2;ctx.beginPath();let y=this.random()*512;ctx.moveTo(0,y);for(let x=0;x<520;x+=10){y+=this.random()*12-5;ctx.lineTo(x,y);}ctx.stroke();}
  const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(kind==='wood'?3:2,kind==='wood'?1:2);map.anisotropy=8;
  const material=new T.MeshStandardMaterial({map,bumpMap:map,bumpScale:kind==='wood'?.08:.055,roughness:kind==='stone'?.81:.94});
  this.caustics(material);return material;
 }
 private caustics(material:T.MeshStandardMaterial){
  material.onBeforeCompile=shader=>{
   shader.uniforms.waterTime=this.swimShader;
   shader.vertexShader='varying vec3 waterWorld;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nwaterWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
   shader.fragmentShader='uniform float waterTime;varying vec3 waterWorld;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <dithering_fragment>',`float ca=sin(waterWorld.x*7.+sin(waterWorld.z*5.+waterTime*.31)*1.9+waterTime*.42)*sin(waterWorld.z*8.-waterTime*.37+sin(waterWorld.x*4.)*1.6);float pool=pow(max(0.,ca),12.);gl_FragColor.rgb+=pool*.047*vec3(.68,1.,.83);\n#include <dithering_fragment>`);
  };
 }
 private buildTank(){
  const dark=new T.MeshStandardMaterial({color:0x111c1e,roughness:.35,metalness:.65});
  const floor=new T.MeshStandardMaterial({color:0x10191d,roughness:.48,metalness:.22});
  this.box(100,.2,100,floor,V(0,-1.1,0));
  this.box(10.45,.88,4.95,dark,V(0,-.51,0));
  this.box(10.7,.13,5.1,new T.MeshStandardMaterial({color:0x182123,metalness:.75,roughness:.28}),V(0,-.035,0));
  // Cabinet shadow seams and a fine metal lip give the glass a physical support.
  const seam=new T.MeshBasicMaterial({color:0x04090b});
  for(const x of [-2.6,0,2.6])this.box(.012,.7,.012,seam,V(x,-.53,2.479),false);
  const glass=new T.MeshPhysicalMaterial({color:0xabcfc8,metalness:0,roughness:.06,transparent:true,opacity:.055,transmission:.15,ior:1.5,thickness:.06,side:T.DoubleSide,depthWrite:false,envMapIntensity:.6});
  const pane=(w:number,h:number,p:T.Vector3,ry=0)=>{const m=this.mesh(new T.PlaneGeometry(w,h),glass,p,false);m.rotation.y=ry;m.renderOrder=8;};
  pane(10.2,5.55,V(0,2.8,2.36));pane(10.2,5.55,V(0,2.8,-2.36));pane(4.72,5.55,V(-5.1,2.8,0),Math.PI/2);pane(4.72,5.55,V(5.1,2.8,0),Math.PI/2);
  const edge=new T.MeshPhysicalMaterial({color:0x9dd1cb,transparent:true,opacity:.43,roughness:.16,metalness:.25,depthWrite:false});
  for(const x of [-5.1,5.1])for(const z of [-2.36,2.36])this.box(.025,5.6,.025,edge,V(x,2.8,z),false);
  for(const z of [-2.36,2.36])for(const y of [.06,5.59])this.box(10.2,.023,.025,edge,V(0,y,z),false);
  for(const x of [-5.1,5.1])for(const y of [.06,5.59])this.box(.025,.023,4.72,edge,V(x,y,0),false);
  this.box(9.2,.12,.65,dark,V(0,6.4,-.15));
  const led=new T.MeshStandardMaterial({color:0xe0f9ee,emissive:0xe0f9ee,emissiveIntensity:3});
  for(let i=0;i<3;i++)this.box(8.75,.018,.105,led,V(0,6.335,-.37+i*.2),false);
  for(const x of [-3.8,3.8]){this.box(.019,4,.019,dark,V(x,8.45,-.15),false);}
  // Transparent return pipe and intake, both physically outside the planting.
  const pipeMat=new T.MeshPhysicalMaterial({color:0xa9d9ce,transparent:true,opacity:.26,roughness:.13,metalness:.25,depthWrite:false});
  for(const x of [4.4,4.77]){
   const pts=[V(x,1.1,-1.99),V(x,5.1,-1.99),V(x,5.79,-1.99),V(x,5.84,-2.55),V(x,3.5,-2.62)];
   this.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),60,.085,10,false),pipeMat,V(0,0,0),false);
  }
 }
 private height(x:number,z:number){return .3+.55*Math.exp(-((x+2.5)**2/6+(z+.8)**2/2))+.22*(1-(z+2.3)/4.6)+.035*Math.sin(x*2+z)*Math.cos(z*3);}
 private buildLandscape(){
  const soil=this.texturedMaterial('#34332a','soil');
  const g=new T.PlaneGeometry(10.12,4.64,110,55);g.rotateX(-Math.PI/2);
  const p=g.getAttribute('position') as T.BufferAttribute;
  for(let i=0;i<p.count;i++)p.setY(i,this.height(p.getX(i),p.getZ(i))+(this.random()-.5)*.035);
  g.computeVertexNormals();this.mesh(g,soil,V(0,0,0));
  this.box(10.13,.32,4.64,soil,V(0,.17,0));
  // Pale sand bends between the planting islands; the surface follows the substrate.
  const pathPositions:number[]=[],uv:number[]=[],indices:number[]=[];
  for(let j=0;j<=65;j++){const z=2.29-j/65*4.5,cx=1.5+Math.sin(z*1.05)*.65,width=.42+(z+2.2)*.16;for(let k=0;k<=12;k++){const x=cx+(k/12-.5)*width*2;pathPositions.push(x,this.height(x,z)+.026,z);uv.push(k/5,j/10);if(j<65&&k<12){const a=j*13+k;indices.push(a,a+1,a+13,a+1,a+14,a+13);}}}
  const sandGeo=new T.BufferGeometry();sandGeo.setAttribute('position',new T.Float32BufferAttribute(pathPositions,3));sandGeo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));sandGeo.setIndex(indices);sandGeo.computeVertexNormals();
  const sand=this.texturedMaterial('#95866b','soil');sand.bumpScale=.025;this.mesh(sandGeo,sand,V(0,0,0));
  const rock=this.texturedMaterial('#383b33','stone');
  const rocks=[[-3.5,.6,.1,1.0,1.3,.83],[-2.2,.55,-.7,.9,.86,.72],[-4,.45,-1.45,.8,.9,.7],[-.8,.45,-1.25,.8,.9,.65],[-2.9,.4,1.1,.85,.5,.55],[.1,.33,.2,.55,.48,.47],[3.6,.43,-.9,.9,.62,.67],[4.3,.3,.9,.54,.52,.42],[2.8,.3,-1.8,.55,.6,.4]];
  for(const [x,y,z,sx,sy,sz] of rocks){
   const original=new T.IcosahedronGeometry(1,4);original.deleteAttribute('normal');const geo=mergeVertices(original,.001),pos=geo.getAttribute('position') as T.BufferAttribute;original.dispose();
   for(let i=0;i<pos.count;i++){const v=V(pos.getX(i),pos.getY(i),pos.getZ(i));const r=1+.22*Math.sin(v.x*4+v.y*3)*Math.cos(v.z*5)+.09*Math.sin(v.y*17+v.z*7);v.multiplyScalar(r);pos.setXYZ(i,v.x,Math.max(-.62,v.y),v.z);}
   geo.computeVertexNormals();const obj=this.mesh(geo,rock,V(x,y+sy*.35,z));obj.scale.set(sx,sy,sz);obj.rotation.set(.1, this.random()*3,.1);this.obstacles.push({center:obj.position.clone(),radius:Math.max(sx,sy,sz)*.82});
  }
  // Pebbles are actual small solids, with deterministic color and scale variation.
  const pebbles=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),rock,700),dummy=new T.Object3D();
  for(let i=0;i<700;i++){const x=(this.random()-.5)*10,z=(this.random()-.5)*4.5,s=.025+this.random()*.057;dummy.position.set(x,this.height(x,z)+s*.35,z);dummy.scale.set(s,s*.65,s*.8);dummy.rotation.set(this.random()*3,this.random()*3,this.random());dummy.updateMatrix();pebbles.setMatrixAt(i,dummy.matrix);pebbles.setColorAt(i,new T.Color().setHSL(.13,.12,.55+this.random()*.3));}pebbles.receiveShadow=true;this.scene.add(pebbles);
  const bark=this.texturedMaterial('#64523a','wood');
  const branches:[number[][],number][]=[
   [[[-3.3,.65,.35],[-2.8,1.15,.05],[-2.5,2,-.45],[-2,3.1,-.8],[-1.15,4.4,-1],[-.6,5.1,-.95]],.38],
   [[[-2.7,1.2,.1],[-1.8,1.18,.45],[-.75,.95,.85],[.15,.7,1.15],[.75,.55,1.6]],.27],
   [[[-2.6,2,-.4],[-1.45,2.5,-.5],[-.3,3,-.8],[.7,3.8,-1.1],[1.7,4.1,-1.4]],.22],
   [[[-2.4,2.3,-.4],[-3.05,3.2,-.8],[-3.25,4.25,-1.1],[-2.9,4.85,-.85]],.17],
   [[[-1.55,3.85,-.9],[-1.9,4.4,-.8],[-1.7,5.05,-1.1]],.11],
   [[[.2,3.4,-1],[.9,3.5,-.85],[1.9,3.55,-.8]],.085],
   [[[-2.1,1.6,-.1],[-1.6,1.8,-1],[-1.1,2.2,-1.7],[-.3,2.35,-2]],.15],
   [[[-3.3,.8,.35],[-3.8,.65,1],[-4.4,.45,1.8]],.18],
  ];
  for(const [points,r] of branches)this.wood(points,r,bark);
  for(let i=0;i<15;i++){
   const x=-3+this.random()*2.5,z=.25+this.random()*.7;
   this.wood([[x,.85,z],[x+.1,.62,z+.3],[x+.7,.45,z+.7]],.028+this.random()*.025,bark);
  }
 }
 private wood(points:number[][],radius:number,material:T.Material){
  const curve=new T.CatmullRomCurve3(points.map(p=>V(...p as [number,number,number]))),frames=curve.computeFrenetFrames(60,false),positions:number[]=[],uv:number[]=[],index:number[]=[];
  for(let i=0;i<=60;i++){
   const t=i/60,center=curve.getPointAt(t),r=radius*(.98-Math.pow(t,1.5)*.93);
   if(i%8===0&&t<.86)this.obstacles.push({center:center.clone(),radius:r+.04});
   for(let j=0;j<=14;j++){const a=j/14*Math.PI*2,furrow=1+.13*Math.sin(a*7+t*5)+.065*Math.sin(a*13-t*9),p=center.clone().addScaledVector(frames.normals[i],Math.cos(a)*r*furrow).addScaledVector(frames.binormals[i],Math.sin(a)*r*furrow);positions.push(p.x,p.y,p.z);uv.push(j/14,t*4);if(i<60&&j<14){const n=i*15+j;index.push(n,n+1,n+15,n+1,n+16,n+15);}}
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(index);geo.computeVertexNormals();this.mesh(geo,material,V(0,0,0));
 }
 private leafGeometry(){
  const p:number[]=[],uv:number[]=[],idx:number[]=[];
  for(let i=0;i<=12;i++){const t=i/12,w=Math.pow(Math.sin(t*Math.PI),.8)*.23;for(let j=0;j<=4;j++){const s=j/4*2-1;p.push(s*w,t,Math.sin(t*Math.PI)*.08+Math.abs(s)*w*.25-t*t*.42);uv.push(j/4,t);if(i<12&&j<4){const n=i*5+j;idx.push(n,n+1,n+5,n+1,n+6,n+5);}}}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
 }
 private buildPlants(){
  const material=new T.MeshStandardMaterial({color:0xffffff,roughness:.58,metalness:.025,side:T.DoubleSide});
  material.onBeforeCompile=shader=>{
   shader.uniforms.waterTime=this.swimShader;
   shader.vertexShader='uniform float waterTime;varying vec2 leafUv;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>\nleafUv=uv;vec3 root=instanceMatrix[3].xyz;transformed.z+=sin(waterTime*.85+root.x*1.7+root.z*2.3)*.065*uv.y*uv.y;transformed.x+=sin(waterTime*.61+root.z*3.)*.025*uv.y*uv.y;`);
   shader.fragmentShader='varying vec2 leafUv;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>\nfloat vein=exp(-abs(leafUv.x-.5)*100.);float fine=pow(max(0.,cos((leafUv.y+abs(leafUv.x-.5)*.45)*120.)),14.);diffuseColor.rgb*=.77+.2*sin(leafUv.y*3.14159)+vein*.2+fine*.035;`);
  };
  const leafGeometry=this.leafGeometry(),leafPositions=leafGeometry.getAttribute('position') as T.BufferAttribute;
  const matrices:T.Matrix4[]=[],colors:T.Color[]=[],dummy=new T.Object3D();
  const add=(pos:T.Vector3,dir:T.Vector3,len:number,width:number,hue:number,sat:number,light:number,twist=0)=>{
   dummy.position.copy(pos);dummy.quaternion.setFromUnitVectors(up,dir.normalize());dummy.rotateY(twist);dummy.scale.set(width,len,len);dummy.updateMatrix();fitLeaf(dummy,leafPositions);matrices.push(dummy.matrix.clone());colors.push(new T.Color().setHSL(hue,sat,light).convertSRGBToLinear());
  };
  // Back planting: branching Rotala stems, each leaf has a curved mesh and midrib.
  const stemPoints:number[]=[];
  for(let i=0;i<230;i++){
   const x=-4.7+this.random()*9.3,z=-1.6-this.random()*.53;
   const red=x>-.9&&x<2.65,height=(red?2.5:2.2)+this.random()*1.75,base=this.height(x,z),lean=(this.random()-.5)*.45;
   stemPoints.push(x,base,z,x+lean,base+height,z+.1);
   const nodes=11+Math.floor(this.random()*7);
   for(let j=1;j<=nodes;j++){
    const t=j/nodes,angle=j*2.39+i*.7;
    for(let s=0;s<2;s++){const a=angle+s*Math.PI,l=(.25+this.random()*.18)*(1-t*.35);add(V(x+lean*t,base+height*t,z+.1*t),V(Math.cos(a)*.75,.55+this.random()*.3,Math.sin(a)*.75),l,l*(red?.53:.7),red?.025+this.random()*.055:.21+this.random()*.08,red?.4:.52,red?.22+this.random()*.12:.18+this.random()*.11,this.random());}
   }
  }
  const stems=new T.BufferGeometry();stems.setAttribute('position',new T.Float32BufferAttribute(stemPoints,3));this.scene.add(new T.LineSegments(stems,new T.LineBasicMaterial({color:0x465632,transparent:true,opacity:.8})));
  // Broad sword leaves on the left and right banks.
  for(const [cx,cz,n] of [[-4,-.4,9],[-3.7,-1.25,8],[3.9,-1,7],[4.5,.1,5],[-1.1,-1.3,4]]){
   for(let k=0;k<n;k++){const x=cx+(this.random()-.5)*.7,z=cz+(this.random()-.5)*.6,b=this.height(x,z);
    for(let j=0;j<9;j++){const a=j*2.4+k,h=.7+this.random()*1.85;add(V(x,b,z),V(Math.cos(a)*.55,.5+this.random()*.55,Math.sin(a)*.6),h,h*(.25+this.random()*.2),.20+this.random()*.06,.53,.20+this.random()*.10,this.random()*.5);}
   }
  }
  // Anubias and low crypts nestle around the rocks and wood.
  for(let i=0;i<150;i++){
   const x=-4.6+this.random()*5.4,z=-.7+this.random()*2.7;if(x>-.6&&z>1)continue;
   const b=this.height(x,z)+.05;
   for(let j=0;j<5;j++){const a=j*2.4+i;const len=.22+this.random()*.45;add(V(x,b,z),V(Math.cos(a)*.75,.5+this.random()*.6,Math.sin(a)*.75),len,len*1.1,.23+this.random()*.07,.48,.15+this.random()*.09,this.random()*2);}
  }
  // Fern fronds: paired pinnae arranged along arched axes.
  for(let i=0;i<42;i++){
   const x=-3.9+this.random()*3,z=-.8+this.random()*1.5,b=this.height(x,z)+.08;
   for(let j=0;j<5;j++){const a=j*2.4+i,len=.55+this.random()*.85,dir=V(Math.cos(a)*.6,.7,Math.sin(a)*.6);
    for(let k=1;k<=9;k++){const t=k/10,p=V(x,b,z).addScaledVector(dir,len*t);for(const sign of [-1,1])add(p,V(Math.cos(a+sign*1.1),.45,Math.sin(a+sign*1.1)),.19*(1-t*.6),.095,.23,.55,.19+this.random()*.1);}
   }
  }
  // Foreground carpet with a deliberately open sand channel.
  for(let i=0;i<1550;i++){
   const x=(this.random()-.5)*9.8,z=(this.random()-.5)*4.4,path=1.5+Math.sin(z*1.05)*.65,width=.42+(z+2.2)*.16;if(Math.abs(x-path)<width+.14)continue;
   if(z<-.8&&this.random()<.65)continue;
   const b=this.height(x,z)+.018;
   for(let j=0;j<3;j++){const a=this.random()*Math.PI*2,len=.09+this.random()*.18;add(V(x,b,z),V(Math.cos(a)*.7,.7,Math.sin(a)*.7),len,len*.65,.20+this.random()*.07,.58,.18+this.random()*.14);}
  }
  // Epiphyte moss attached to the trunk, with real depth from individual sprigs.
  for(let i=0;i<380;i++){
   const t=this.random(),x=-2.85+t*1.45+(this.random()-.5)*.4,y=1.2+t*2.5,z=-.1-t*.8+(this.random()-.5)*.4;
   add(V(x,y,z),V(this.random()-.5,.7,this.random()-.5),.07+this.random()*.14,.09,.20+this.random()*.1,.63,.18+this.random()*.15);
  }
  const leaves=new T.InstancedMesh(leafGeometry,material,matrices.length);
  matrices.forEach((m,i)=>{leaves.setMatrixAt(i,m);leaves.setColorAt(i,colors[i]);});leaves.castShadow=true;leaves.receiveShadow=true;leaves.computeBoundingSphere();this.scene.add(leaves);
 }
 private buildWater(){
  const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:this.swimShader},vertexShader:`uniform float time;varying vec3 p;void main(){p=position;vec3 v=position;v.z+=sin(position.x*4.+time*.8)*sin(position.y*4.5-time*.65)*.012;gl_Position=projectionMatrix*modelViewMatrix*vec4(v,1.);}`,fragmentShader:`uniform float time;varying vec3 p;void main(){float a=sin(p.x*9.+sin(p.y*6.+time*.6)+time*.8)*sin(p.y*13.-time*.6+sin(p.x*5.)*.7);float ripple=pow(max(0.,a),18.);float light=exp(-pow(p.y+.2,2.)*45.)*.19;gl_FragColor=vec4(vec3(.31,.57,.54)+ripple*.35+light,.075+ripple*.17+light);}`});
  const water=this.mesh(new T.PlaneGeometry(10.08,4.6,100,45),material,V(0,5.36,0),false);water.rotation.x=-Math.PI/2;water.renderOrder=7;
  const line=new T.MeshBasicMaterial({color:0xaad5c9,transparent:true,opacity:.35,depthWrite:false});
  for(const z of [-2.3,2.3])this.box(10.08,.018,.012,line,V(0,5.36,z),false);
  return water;
 }
 private buildParticles(){
  const points:number[]=[];for(let i=0;i<180;i++)points.push((this.random()-.5)*9.8,.7+this.random()*4.5,(this.random()-.5)*4.4);
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));
  const m=new T.PointsMaterial({color:0xc0d9bc,size:.013,transparent:true,opacity:.32,depthWrite:false,sizeAttenuation:true});
  const obj=new T.Points(g,m);this.scene.add(obj);return obj;
 }
 private async loadFish(){
  const img=new Image();img.src='./living-species.png';await img.decode();
  const c=document.createElement('canvas');c.width=img.width/2;c.height=img.height/2;const ctx=c.getContext('2d')!;ctx.drawImage(img,0,0,c.width,c.height,0,0,c.width,c.height);
  const data=ctx.getImageData(0,0,c.width,c.height).data;let left=c.width,top=c.height,right=0,bottom=0;
  for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(data[(y*c.width+x)*4+3]>32){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  const trimmed=document.createElement('canvas');trimmed.width=right-left+1;trimmed.height=bottom-top+1;trimmed.getContext('2d')!.drawImage(c,left,top,trimmed.width,trimmed.height,0,0,trimmed.width,trimmed.height);
  this.texture=new T.CanvasTexture(trimmed);this.texture.colorSpace=T.SRGBColorSpace;this.texture.anisotropy=8;
  for(let i=0;i<16;i++){
   const model=new Tetra3D(this.texture,i*.83,false),swim=createTetraSwim(237+i*7919),size=.48+this.random()*.09;
   Object.assign(swim,{x:870+i%4*65,y:310+Math.floor(i/4)*33,z:.28+i%3*.19,elapsed:i*.7,remaining:2+i*.23});
   swim.brain.seed=723+i*3571;swim.brain.energy=.72+this.random()*.22;swim.brain.hunger=.45+this.random()*.22;
   model.group.scale.setScalar(size);model.group.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;o.renderOrder=0;}});
   this.fishes.push({model,swim,size});this.scene.add(model.group);
  }
 }
 feed(){
  if(this.food.length>12)return;
  for(let i=0;i<12;i++){const m=this.mesh(new T.IcosahedronGeometry(.028,0),new T.MeshStandardMaterial({color:0xbba471,roughness:1}),V(.65+(this.random()-.5)*1.6,5.12+this.random()*.13,.62+(this.random()-.5)*.3),false);m.scale.set(1,.35,.8);this.food.push({mesh:m,age:0});}
 }
 zoom(scale:number){this.targetCamera=null;const offset=this.camera.position.clone().sub(this.controls.target);offset.setLength(clamp(offset.length()*scale,this.controls.minDistance,this.controls.maxDistance));this.camera.position.copy(this.controls.target).add(offset);this.controls.update();}
 view(name:string){const portrait=this.host.clientWidth/this.host.clientHeight<.9,dist=portrait?23:21.5,angle=name==='front'?0:name==='side'?1.28:.47;this.targetCamera=V(Math.sin(angle)*dist, name==='front'?5.2:7.5,Math.cos(angle)*dist);}
 private resize(){
  const w=this.host.clientWidth,h=this.host.clientHeight;this.camera.aspect=w/h;
  // Widen vertical field of view on narrow screens to retain the entire tank.
  this.camera.fov=w/h<.8?65:w/h<1.1?48:33;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h);
 }
 private avoidSolid(s:TetraSwim){
  const p=fishPosition(s.x,s.y,s.z),before=p.clone();clearHardscape(p,this.obstacles);
  if(p.distanceToSquared(before)>.000001){s.targetZ=clamp(s.z+.1,.1,.9);s.depthTarget=Math.max(260,s.y-30);}
  Object.assign(s,fishCoordinates(p));
 }
 private animate=(now:number)=>{
  this.frame=requestAnimationFrame(this.animate);
  const wallDt=this.last?Math.min((now-this.last)/1000,.05):0;this.last=now;
  const dt=this.paused||document.hidden?0:wallDt;this.time+=dt;this.swimShader.value=this.time;
  if(this.targetCamera){this.camera.position.lerp(this.targetCamera,1-Math.exp(-wallDt*4));if(this.camera.position.distanceTo(this.targetCamera)<.02)this.targetCamera=null;}
  this.controls.update();
  this.daylight=T.MathUtils.lerp(this.daylight,this.evening?.27:1,1-Math.exp(-wallDt*1.4));
  this.key.intensity=95*this.daylight;this.fill.intensity=.35+this.daylight*.6;this.renderer.toneMappingExposure=.8+.32*this.daylight;
  const snapshot=this.fishes.map(({swim:s},id)=>({id,x:s.x,y:s.y,z:s.z,vx:s.vx,vy:s.vy,radius:25}));
  const goal=advanceSchoolRoute(this.school,dt,snapshot);
  const food=this.food.map(f=>({id:f.mesh.id,...fishCoordinates(f.mesh.position)}));
  this.fishes.forEach(({swim:s},i)=>{
   advanceTetraSwim(s,dt,false,false,{food,neighbors:snapshot.filter(n=>n.id!==i),schoolGoal:schoolLane(goal,i)});
   if(dt)this.avoidSolid(s);
   if(s.brain.consumedFood!==null){const idx=this.food.findIndex(f=>f.mesh.id===s.brain.consumedFood);if(idx>=0){const f=this.food.splice(idx,1)[0];this.scene.remove(f.mesh);f.mesh.geometry.dispose();(f.mesh.material as T.Material).dispose();}s.brain.consumedFood=null;}
  });
  if(dt){const bodies=this.fishes.map(({swim:s},id)=>({id,x:s.x,y:s.y,z:s.z,radius:25}));separateFish(bodies);bodies.forEach((b,i)=>Object.assign(this.fishes[i].swim,{x:b.x,y:b.y,z:b.z}));}
  this.fishes.forEach(({model,swim:s})=>{model.group.position.copy(fishPosition(s.x,s.y,s.z));model.group.rotation.set(0,s.yaw+s.depthHeading,s.pitch,'YXZ');model.update(this.time,s.effort,this.texture,.65,s.z,1,dt,s.pectoralEffort);});
  this.status=this.food.length?'Foraging':this.fishes.length?tetraBehaviorLabel(this.fishes[0].swim):'Exploring';
  for(let i=this.food.length-1;i>=0;i--){const f=this.food[i];f.age+=dt;f.mesh.position.y-=dt*.07;f.mesh.rotation.y+=dt*.5;if(f.age>48){this.scene.remove(f.mesh);f.mesh.geometry.dispose();(f.mesh.material as T.Material).dispose();this.food.splice(i,1);}}
  const d=new T.Object3D();for(let i=0;i<48;i++){const t=(this.time*(.11+(i%4)*.015)+i*.137)%1;d.position.set(4.36+Math.sin(t*8+i)*.045+t*.16,.85+t*4.46,-1.7+Math.cos(t*6+i)*.06);d.scale.setScalar(.4+(1-t)*.6);d.updateMatrix();this.bubbles.setMatrixAt(i,d.matrix);}this.bubbles.instanceMatrix.needsUpdate=true;
  const p=this.dust.geometry.getAttribute('position') as T.BufferAttribute;if(dt){for(let i=0;i<p.count;i++){let x=p.getX(i)+Math.sin(i+this.time*.2)*dt*.018,y=p.getY(i)+dt*.006;if(y>5.3)y=.7;p.setXY(i,x,y);}p.needsUpdate=true;}
  this.renderer.render(this.scene,this.camera);
 };
}
