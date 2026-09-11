/// <reference types="vite/client" />
import {buildScannedHardscape,buildScannedFerns} from './ScannedHardscape';
import {AquariumWater} from './AquariumWater';
import {buildAquariumGlass} from './AquariumGlass';
import {ReflectionPool} from './ReflectionPool';
import {applyWaterDepth} from './WaterDepth';
import {buildAquariumSubstrate} from './Substrate';
import {AquariumLighting} from './AquariumLighting';
import * as T from 'three';
import {buildBotanicalPlants} from './BotanicalPlants';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {Tetra3D} from './Tetra3D';
import {createTetraSwim,advanceTetraSwim,tetraBehaviorLabel,type TetraSwim} from './TetraSwimming';
import {createSchoolRoute,advanceSchoolRoute,schoolLane} from './SchoolRoute';
import {separateFish} from './FishCollisions';

import {fishPosition,fishCoordinates,clearHardscape,type Obstacle} from './TankSpace';

const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
const clamp=T.MathUtils.clamp;
export class Aquarium{
 readonly ready:Promise<void>;
 paused=false;
 evening=false;
 status='Exploring';
 private renderer:T.WebGLRenderer;
 private lighting:AquariumLighting;
 private lightingInspection=import.meta.env.DEV?new URLSearchParams(location.search).get('inspect'):null;
 private scene=new T.Scene();
 private camera=new T.PerspectiveCamera(37,1,.1,100);
 private controls:OrbitControls;
 private targetCamera:T.Vector3|null=null;
 private time=0;
 private last=0;
 private seed=237;
 private daylight=1;
 private canopyLights:T.SpotLight[]=[];
 private stripLight=new T.RectAreaLight(0xf3ffe9,20,8.7,.50);
 private ledMaterial=new T.MeshStandardMaterial({color:0xe0f9ee,emissive:0xe0f9ee,emissiveIntensity:3});
 private fill=new T.HemisphereLight(0xc2e2e6,0x74846a,.9);
 private swimShader={value:0};
 private waterIllumination={value:1};
 private fishes:{model:Tetra3D;swim:TetraSwim;size:number}[]=[];
 private school=createSchoolRoute();
 private texture=new T.Texture();
 private obstacles:Obstacle[]=[];
 private food:{mesh:T.Mesh;age:number}[]=[];
 private dust:T.Points;
 private bubbles:T.InstancedMesh;
 private water:AquariumWater;
 private reflections=new ReflectionPool();
 private frame=0;
 private diagnosticTime=0;private diagnosticFrames=0;
 private resizeObserver:ResizeObserver;
 private inspection:{scene:T.Scene;camera:T.Camera;material:T.MeshBasicMaterial}|null=null;
 constructor(private host:HTMLElement){
  this.renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));
  this.renderer.outputColorSpace=T.SRGBColorSpace;
  this.renderer.toneMapping=T.ACESFilmicToneMapping;
  this.renderer.toneMappingExposure=1.12;
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFShadowMap;
  // Refresh once before the main view; reflection captures share the same maps.
  this.renderer.shadowMap.autoUpdate=false;
  this.lighting=new AquariumLighting(this.scene,this.camera);
  host.appendChild(this.renderer.domElement);
  this.renderer.domElement.tabIndex=0;
  this.renderer.domElement.setAttribute('aria-label','Aquarium. Drag to rotate, use the view and zoom buttons below.');
  this.scene.background=new T.Color(0x080f12);
  this.scene.fog=new T.FogExp2(0x0a161b,.008);
  const pmrem=new T.PMREMGenerator(this.renderer),environment=new RoomEnvironment();
  this.scene.environment=pmrem.fromScene(environment,.035).texture;this.scene.environmentIntensity=.10;
  environment.dispose();pmrem.dispose();
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);
  this.controls.target.set(0,2.75,0);
  this.controls.enableDamping=true;this.controls.dampingFactor=.07;this.controls.enablePan=false;
  this.controls.minAzimuthAngle=-Math.PI*.42;this.controls.maxAzimuthAngle=Math.PI*.46;
  this.controls.minPolarAngle=Math.PI*.31;this.controls.maxPolarAngle=Math.PI*.515;
  this.controls.minDistance=10.8;this.controls.maxDistance=29;
  this.controls.rotateSpeed=.55;this.controls.zoomSpeed=.7;
  this.controls.addEventListener('start',()=>this.targetCamera=null);
  this.camera.position.set(0,3.3,21.5);
  RectAreaLightUniformsLib.init();
  this.stripLight.position.set(0,6.29,-.15);this.stripLight.lookAt(0,0,-.15);
  this.scene.add(this.fill,this.stripLight);
  // Three shadowed samples along the actual luminaire approximate a long emitter.
  // The area light supplies the continuous highlight between those samples.
  for(const x of [-2.8,0,2.8]){
   const light=new T.SpotLight(0xf3ffe9,36,20,.94,.72,1.1);
   light.position.set(x,6.29,-.15);light.target.position.set(x*.8,.6,-.15);
   light.castShadow=true;light.shadow.mapSize.set(1536,1536);light.shadow.camera.near=.1;light.shadow.camera.far=20;
   light.shadow.bias=-.00015;light.shadow.normalBias=.018;light.shadow.radius=3;
   this.canopyLights.push(light);this.scene.add(light,light.target);
  }
  const rim=new T.DirectionalLight(0xd2dfbf,.65);rim.position.set(-5,6,-3);this.scene.add(rim);
  const warm=new T.PointLight(0xffd9ad,7,18,2);warm.position.set(6,5,5);this.scene.add(warm);
  this.buildTank();buildAquariumSubstrate(this.scene,(x,z)=>this.height(x,z),this.swimShader);buildBotanicalPlants(this.scene,(x,z)=>this.height(x,z),this.swimShader);
  this.water=this.buildWater();
  if(import.meta.env.DEV&&new URLSearchParams(location.search).get('inspect')==='reflection'){
   const scene=new T.Scene(),camera=new T.OrthographicCamera(-1,1,1,-1,0,1),material=new T.MeshBasicMaterial({map:this.water.reflectionTexture});
   scene.add(new T.Mesh(new T.PlaneGeometry(2,2),material));this.inspection={scene,camera,material};
  }
  this.dust=this.buildParticles();
  this.bubbles=new T.InstancedMesh(new T.SphereGeometry(.018,7,5),new T.MeshPhysicalMaterial({color:0xd2eee0,roughness:.05,metalness:.1,transparent:true,opacity:.36,depthWrite:false}),48);
  this.scene.add(this.bubbles);
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize();
  this.ready=Promise.all([buildScannedFerns(this.scene,(x,z)=>this.height(x,z),this.swimShader),this.loadFish(),buildScannedHardscape(this.scene,this.obstacles,(x,z)=>this.height(x,z))]).then(()=>{applyWaterDepth(this.scene,this.waterIllumination);});
  this.frame=requestAnimationFrame(this.animate);
  document.addEventListener('visibilitychange',()=>{this.last=0;});
 }
 private random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 private mesh(g:T.BufferGeometry,m:T.Material,p:T.Vector3,shadow=true){const o=new T.Mesh(g,m);o.position.copy(p);o.castShadow=shadow;o.receiveShadow=shadow;this.scene.add(o);return o;}
 private box(w:number,h:number,d:number,material:T.Material,p:T.Vector3,shadow=true){return this.mesh(new T.BoxGeometry(w,h,d),material,p,shadow);}
 private buildTank(){
  const dark=new T.MeshStandardMaterial({color:0x111c1e,roughness:.35,metalness:.65});
  const floor=new T.MeshStandardMaterial({color:0x141e21,roughness:.56,metalness:.12});
  floor.onBeforeCompile=shader=>{
   shader.uniforms.roomBackground={value:this.scene.background};
   shader.fragmentShader='uniform vec3 roomBackground;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
    // Soft footprint of the stationary cabinet, independent of camera angle.
    vec3 floorWorld=cameraPosition-inverseTransformDirection(normalize(vViewPosition),viewMatrix)*length(vViewPosition);
    vec2 cabinetDistance=abs(floorWorld.xz)-vec2(5.225,2.475);
    float cabinetEdge=length(max(cabinetDistance,0.))+min(max(cabinetDistance.x,cabinetDistance.y),0.);
    outgoingLight*=mix(.16,1.,smoothstep(-.05,.72,cabinetEdge));
    float studioFade=1.-exp(-pow(max(0.,length(vViewPosition)-23.)*.075,2.));
    outgoingLight=mix(outgoingLight,roomBackground,studioFade);
    #include <opaque_fragment>`);
  };
  const ground=this.mesh(new T.PlaneGeometry(180,180),floor,V(0,-1.0,0),false);
  ground.rotation.x=-Math.PI/2;
  // Keep the studio softbox above the viewing axis: a low emitter reflected as
  // an artificial horizontal bar through the middle of the clear front pane.
  const roomBounce=new T.RectAreaLight(0xc1dcdd,3.6,11,4);
  roomBounce.position.set(0,8,7);roomBounce.lookAt(0,-1,5);this.scene.add(roomBounce);
  this.box(10.45,.88,4.95,dark,V(0,-.51,0));
  this.box(10.7,.13,5.1,new T.MeshStandardMaterial({color:0x182123,metalness:.75,roughness:.28}),V(0,-.035,0));
  // Cabinet shadow seams and a fine metal lip give the glass a physical support.
  const seam=new T.MeshBasicMaterial({color:0x04090b});
  for(const x of [-2.6,0,2.6])this.box(.012,.7,.012,seam,V(x,-.53,2.479),false);
  buildAquariumGlass(this.scene,this.reflections);
  // A matte aquarium backing sits outside the rear pane. Unlike a black scene
  // void it catches the canopy light and the plants' shadows through the water.
  const backing=new T.MeshStandardMaterial({color:0x172224,roughness:.94,metalness:0});
  this.box(10.12,5.48,.018,backing,V(0,2.79,-2.407));
  this.box(9.2,.12,.65,dark,V(0,6.4,-.15));
  for(let i=0;i<3;i++)this.box(8.75,.018,.105,this.ledMaterial,V(0,6.335,-.37+i*.2),false);
  for(const x of [-3.8,3.8]){this.box(.019,4,.019,dark,V(x,8.45,-.15),false);}
  // Transparent return pipe and intake, both physically outside the planting.
  const pipeMat=new T.MeshPhysicalMaterial({color:0xe5f0e9,transparent:true,opacity:1,transmission:.96,thickness:.035,ior:1.5,roughness:.025,metalness:0,depthWrite:false,envMapIntensity:1.2});
  for(const x of [4.4,4.77]){
   const pts=[V(x,1.1,-1.99),V(x,5.1,-1.99),V(x,5.79,-1.99),V(x,5.84,-2.55),V(x,3.5,-2.62)];
   this.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),96,.065,24,false),pipeMat,V(0,0,0),false);
  }
 }
 private height(x:number,z:number){return .3+.55*Math.exp(-((x+2.5)**2/6+(z+.8)**2/2))+.22*(1-(z+2.3)/4.6)+.035*Math.sin(x*2+z)*Math.cos(z*3);}
 private buildWater(){
  const water=new AquariumWater(this.reflections);this.scene.add(water);
  const line=new T.MeshBasicMaterial({color:0xc5e3d1,transparent:true,opacity:.5,depthWrite:false});
  for(const z of [-2.3,2.3])this.box(10.08,.015,.012,line,V(0,5.36,z),false);
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
   model.group.scale.setScalar(size);model.group.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=!(o.material as T.Material).transparent;o.receiveShadow=true;o.renderOrder=0;}});
   this.fishes.push({model,swim,size});this.scene.add(model.group);
  }
 }
 feed(){
  if(this.food.length>12)return;
  for(let i=0;i<12;i++){const m=this.mesh(new T.IcosahedronGeometry(.028,0),new T.MeshStandardMaterial({color:0xbba471,roughness:1}),V(.65+(this.random()-.5)*1.6,5.12+this.random()*.13,.62+(this.random()-.5)*.3),false);m.scale.set(1,.35,.8);this.food.push({mesh:m,age:0});}
 }
 zoom(scale:number){this.targetCamera=null;const offset=this.camera.position.clone().sub(this.controls.target);offset.setLength(clamp(offset.length()*scale,this.controls.minDistance,this.controls.maxDistance));this.camera.position.copy(this.controls.target).add(offset);this.controls.update();}
 view(name:string){const portrait=this.host.clientWidth/this.host.clientHeight<.9,dist=portrait?23:21.5,angle=name==='front'?0:name==='side'?1.28:.47;this.targetCamera=V(Math.sin(angle)*dist, name==='front'?3.3:7.5,Math.cos(angle)*dist);}
 private resize(){
  const w=this.host.clientWidth,h=this.host.clientHeight;this.camera.aspect=w/h;
  // Widen vertical field of view on narrow screens to retain the entire tank.
  this.camera.fov=w/h<.8?52:w/h<1.1?48:33;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h);
  const size=this.renderer.getDrawingBufferSize(new T.Vector2());this.lighting.resize(size.x,size.y);
 }
 private avoidSolid(s:TetraSwim){
  const p=fishPosition(s.x,s.y,s.z),before=p.clone();clearHardscape(p,this.obstacles);
  if(p.distanceToSquared(before)>.000001){s.targetZ=clamp(s.z+.1,.1,.9);s.depthTarget=Math.max(260,s.y-30);}
  Object.assign(s,fishCoordinates(p));
 }
 private animate=(now:number)=>{
  this.frame=requestAnimationFrame(this.animate);
  const elapsed=this.last?(now-this.last)/1000:0,wallDt=Math.min(elapsed,.05);this.last=now;
  const dt=this.paused||document.hidden?0:wallDt;this.time+=dt;this.swimShader.value=this.time;
  if(this.targetCamera){this.camera.position.lerp(this.targetCamera,1-Math.exp(-wallDt*4));if(this.camera.position.distanceTo(this.targetCamera)<.02)this.targetCamera=null;}
  this.controls.update();
  this.daylight=T.MathUtils.lerp(this.daylight,this.evening?.27:1,1-Math.exp(-wallDt*1.4));
  this.waterIllumination.value=this.daylight;
  this.ledMaterial.emissiveIntensity=3*this.daylight;
  for(const light of this.canopyLights)light.intensity=36*this.daylight;
  this.stripLight.intensity=20*this.daylight;this.fill.intensity=.18+this.daylight*.72;this.renderer.toneMappingExposure=.8+.32*this.daylight;
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
  this.water.update(this.time,this.camera.position.y);
  const renderStart=performance.now();
  this.renderer.shadowMap.needsUpdate=true;
  const sceneTriangles=this.lighting.render(this.renderer,this.lightingInspection);
  if(this.inspection){this.inspection.material.map=this.water.reflectionTexture;this.renderer.render(this.inspection.scene,this.inspection.camera);}
  if(import.meta.env.DEV){this.diagnosticFrames++;this.diagnosticTime+=elapsed;if(this.diagnosticTime>=1){this.host.dataset.renderMs=(performance.now()-renderStart).toFixed(1);this.host.dataset.fps=String(Math.round(this.diagnosticFrames/this.diagnosticTime));this.host.dataset.triangles=String(sceneTriangles);this.host.dataset.fishPositions=JSON.stringify(this.fishes.map(f=>({x:+f.model.group.position.x.toFixed(2),y:+f.model.group.position.y.toFixed(2),z:+f.model.group.position.z.toFixed(2)})));this.diagnosticFrames=0;this.diagnosticTime=0;}}

 };
}
