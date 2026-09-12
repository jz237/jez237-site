/// <reference types="vite/client" />
import {Invertebrates} from './Invertebrates';
import {PlantPicker,trackFish,type Identification} from './Exploration';
import type {FishPoint} from './FishBrain';
import {TeachingScene} from './TeachingScene';
import {LearningModel} from './LearningModel';
import type {Lesson} from './LearningContent';
import {buildScannedHardscape,buildScannedFerns} from './ScannedHardscape';
import {AquariumWater} from './AquariumWater';
import {buildAquariumGlass} from './AquariumGlass';
import {ReflectionPool} from './ReflectionPool';
import {applyWaterDepth} from './WaterDepth';
import {applyBakedIrradiance} from './BakedIrradiance';
import {buildAquariumSubstrate} from './Substrate';
import {AquariumLighting} from './AquariumLighting';
import {buildAquariumPlumbing} from './AquariumPlumbing';
import canopy from './CanopyLighting.json';
import {aquariumFieldOfView,orbitToward} from './CameraFraming';
import * as T from 'three';
import {buildBotanicalPlants} from './BotanicalPlants';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {Tetra3D} from './Tetra3D';
import {calmSwordLeaves} from './SwordCurrent';
import {SchoolEyes} from './SchoolEyes';
import {optimizeLeafIndexOrder} from './LeafIndexOrder';
import {GpuFrameTimer} from './GpuFrameTimer';
import {createTetraSwim,advanceTetraSwim,startleTetra,tetraBehaviorLabel,type TetraSwim} from './TetraSwimming';
import {createSchoolRoute,advanceSchoolRoute,schoolActivity} from './SchoolRoute';
import {separateFish} from './FishCollisions';

import {fishPosition,fishCoordinates,clearHardscape,type Obstacle} from './TankSpace';

const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
const clamp=T.MathUtils.clamp;
export class Aquarium{
 readonly ready:Promise<void>;
 readonly learning=new LearningModel();
 teaching:TeachingScene|null=null;
 identifyMode=false;following:number|null=null;private followApproach=false;
 onIdentify:(info:Identification|null)=>void=()=>{};
 onLessonRequest:(mode:Lesson)=>void=()=>{};
 onExploreClose:()=>void=()=>{};
 private picker:PlantPicker|null=null;
 private browseSites:FishPoint[]=[];
 private pickBlockers:T.Object3D[]=[];
 private selection:Identification|null=null;
 private selectionRing:HTMLDivElement;

 private learningSubstrate:T.Object3D[]=[];
 private learningHousing:T.Object3D[]=[];
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
 private targetFov:number|null=null;
 private time=0;
 private currentTime=0;
 private last=0;
 private seed=237;
 private daylight=1;
 private canopyLights:T.SpotLight[]=[];
 private stripLight=new T.RectAreaLight(canopy.color,canopy.stripIntensity,8.7,.50);
 private ledMaterial=new T.MeshStandardMaterial({color:0xe0f9ee,emissive:0xe0f9ee,emissiveIntensity:3});
 private fill=new T.HemisphereLight(0xc2e2e6,0x74846a,.9);
 private swimShader={value:0};
 private waterIllumination={value:1};
 private invertebrates:Invertebrates|null=null;private inspectingAnimal:number|null=null;
 private fishes:{model:Tetra3D;swim:TetraSwim;size:number}[]=[];
 private school=createSchoolRoute();
 private schoolEyes:SchoolEyes|null=null;
 private gpuTimer:GpuFrameTimer|null=null;
 private texture=new T.Texture();
 private obstacles:Obstacle[]=[];
 private food:{mesh:T.Mesh;age:number}[]=[];
 private dust:T.Points;
 private bubbles:T.InstancedMesh;
 private water:AquariumWater;
 private reflections=new ReflectionPool();
 private frame=0;
 private diagnosticTime=0;private diagnosticFrames=0;
 private frameSamples:number[][]=[];
 private resizeObserver:ResizeObserver;
 private inspection:{scene:T.Scene;camera:T.Camera;material:T.MeshBasicMaterial}|null=null;
 constructor(private host:HTMLElement){
  this.renderer=new T.WebGLRenderer({antialias:false,depth:false,stencil:false,alpha:false,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));
  if(import.meta.env.DEV)this.gpuTimer=new GpuFrameTimer(this.renderer.getContext() as WebGL2RenderingContext,host);
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
  // Scene-linear backdrop radiance: ACES otherwise crushes the dark reference
  // blue-gray almost to black when a display-space swatch is used directly.
  this.scene.background=new T.Color(.0087,.0147,.0173);
  this.scene.fog=new T.FogExp2(this.scene.background,.008);
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
  this.controls.addEventListener('start',()=>{this.followApproach=false;this.targetCamera=null;this.targetFov=null;});
  this.camera.position.set(0,2.45,21.5);
  this.selectionRing=document.createElement('div');this.selectionRing.className='selection-ring';this.selectionRing.hidden=true;host.append(this.selectionRing);
  this.installGlassTap();
  RectAreaLightUniformsLib.init();
  this.stripLight.position.set(0,canopy.height,canopy.depth);this.stripLight.lookAt(0,0,canopy.depth);
  this.scene.add(this.fill,this.stripLight);
  // Three shadowed samples along the actual luminaire approximate a long emitter.
  // The area light supplies the continuous highlight between those samples.
  for(const x of canopy.samplePositions){
   const light=new T.SpotLight(canopy.color,canopy.sampleIntensity,canopy.distance,canopy.angle,canopy.penumbra,canopy.decay);
   light.position.set(x,canopy.height,canopy.depth);light.target.position.set(x*canopy.targetXScale,canopy.targetHeight,canopy.depth);
   light.castShadow=true;light.shadow.mapSize.set(1536,1536);light.shadow.camera.near=.1;light.shadow.camera.far=20;
   light.shadow.bias=-.00015;light.shadow.normalBias=.018;light.shadow.radius=3;
   this.canopyLights.push(light);this.scene.add(light,light.target);
  }
  const rim=new T.DirectionalLight(0xd2dfbf,.65);rim.position.set(-5,6,-3);this.scene.add(rim);
  const housingStart=this.scene.children.length;this.buildTank();this.learningHousing=this.scene.children.slice(housingStart).filter(o=>!(o instanceof T.Light));const substrateStart=this.scene.children.length;buildAquariumSubstrate(this.scene,(x,z)=>this.height(x,z),this.swimShader);this.learningSubstrate=this.scene.children.slice(substrateStart);buildBotanicalPlants(this.scene,(x,z)=>this.height(x,z),this.swimShader);
  this.water=this.buildWater();
  if(import.meta.env.DEV&&new URLSearchParams(location.search).get('inspect')==='reflection'){
   const scene=new T.Scene(),camera=new T.OrthographicCamera(-1,1,1,-1,0,1),material=new T.MeshBasicMaterial({map:this.water.reflectionTexture});
   scene.add(new T.Mesh(new T.PlaneGeometry(2,2),material));this.inspection={scene,camera,material};
  }
  this.dust=this.buildParticles();
  this.bubbles=new T.InstancedMesh(new T.SphereGeometry(.018,7,5),new T.MeshPhysicalMaterial({color:0xd2eee0,roughness:.05,metalness:.1,transparent:true,opacity:.36,depthWrite:false}),48);
  this.scene.add(this.bubbles);
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize();
  this.ready=Promise.all([buildScannedFerns(this.scene,(x,z)=>this.height(x,z),this.swimShader),this.loadFish(),buildScannedHardscape(this.scene,this.obstacles,(x,z)=>this.height(x,z),this.swimShader),new T.TextureLoader().loadAsync('./grazer-material-atlas.png').catch(error=>{console.warn('Grazer atlas unavailable; using procedural materials.',error);return undefined;})]).then(async results=>{
   if(!(import.meta.env.DEV&&new URLSearchParams(location.search).has('originalIndices')))optimizeLeafIndexOrder(this.scene);
   calmSwordLeaves(this.scene);
   this.scene.updateMatrixWorld();const contactSurfaces:T.Object3D[]=[];this.scene.traverse(o=>{if(o instanceof T.Mesh&&!(o instanceof T.InstancedMesh)&&(Array.isArray(o.material)?o.material:[o.material]).some(m=>m.userData.bakeDiffuse))contactSurfaces.push(o);});
   this.invertebrates=new Invertebrates(this.scene,(x,z)=>this.height(x,z),contactSurfaces,results[3]);
   applyWaterDepth(this.scene,this.waterIllumination);
   try{await applyBakedIrradiance(this.scene,this.waterIllumination,import.meta.env.DEV&&this.lightingInspection==='indirect');}
   catch(error){console.warn('Bounced lighting unavailable; using live illumination.',error);}
   // Prepare the final material variants before revealing the aquarium. The warm
   // frame also initializes shadow, reflection and postprocessing programs.
   this.controls.update();this.scene.updateMatrixWorld();this.schoolEyes?.update();
   this.water.update(this.currentTime,this.camera.position.y,this.daylight);
   await this.lighting.prepare(this.renderer);
   this.renderer.shadowMap.needsUpdate=true;this.lighting.render(this.renderer,this.lightingInspection);
   const plants=this.scene.children.filter(o=>o instanceof T.Mesh&&!!o.geometry.getAttribute('plantRoot'));
   this.teaching=new TeachingScene(this.scene,this.host,plants,this.learningSubstrate,this.texture,[...this.learningHousing,this.water]);this.learning.reset();
   this.picker=new PlantPicker(this.scene);
   this.scene.traverse(o=>{if(o instanceof T.Mesh&&!(o instanceof T.InstancedMesh)&&(Array.isArray(o.material)?o.material:[o.material]).some(m=>m.userData.bakeDiffuse))this.pickBlockers.push(o);});
   const seen=new Set<string>();this.scene.traverse(o=>{if(!(o instanceof T.InstancedMesh)||!o.userData.plantSpecies)return;const root=o.geometry.getAttribute('plantRoot');if(!root)return;for(let i=0;i<o.count;i++){const point=new T.Vector3().fromBufferAttribute(root,i),key=[point.x.toFixed(1),point.z.toFixed(1)].join(',');if(seen.has(key))continue;seen.add(key);point.y+=.35+(this.browseSites.length%4)*.3;clearHardscape(point,this.obstacles,.35);const p=fishCoordinates(point);if(p.x>670&&p.x<1200&&p.y>250&&p.y<500)this.browseSites.push({id:-100-this.browseSites.length,...p});}});
   this.frame=requestAnimationFrame(this.animate);
  });
  if(import.meta.env.DEV&&this.lightingInspection==='bake')this.ready.then(async()=>{const {installBakeExport}=await import('./BakeExport');installBakeExport(this.scene);});
  document.addEventListener('visibilitychange',()=>{this.last=0;});
 }
 private installGlassTap(){
  const canvas=this.renderer.domElement;
  let down:{x:number;y:number;at:number;id:number}|null=null;
  canvas.addEventListener('pointerdown',e=>{if(!e.isPrimary){down=null;return;}down={x:e.clientX,y:e.clientY,at:performance.now(),id:e.pointerId};});
  canvas.addEventListener('pointermove',e=>{if(!this.lighting.lens.enabled)return;const r=canvas.getBoundingClientRect();this.moveLens((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);});
  canvas.addEventListener('pointercancel',()=>{down=null;});
  canvas.addEventListener('pointerup',e=>{
   const tap=down;down=null;
   if(!tap||tap.id!==e.pointerId||performance.now()-tap.at>300||Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>6)return;
   const rect=canvas.getBoundingClientRect(),ray=new T.Raycaster();
   ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),this.camera);
   if(this.lighting.lens.enabled)return;
   if(this.identifyMode&&!this.teaching?.mode){this.pick(ray);return;}
   if(this.paused)return;
   const hit=ray.ray.intersectBox(new T.Box3(V(-5.05,.1,-2.35),V(5.05,5.4,2.35)),new T.Vector3());
   if(hit&&this.teaching?.mode){
    if(!this.studyView){
     const fish=this.fishes.find(f=>ray.ray.distanceSqToPoint(f.model.group.position)<.14);
     if(fish)this.teaching.onInspect(0);
    }
    return;
   }
   if(hit){this.fishes.forEach(({swim})=>startleTetra(swim));if(import.meta.env.DEV)this.host.dataset.glassTaps=String(Number(this.host.dataset.glassTaps??0)+1);}
  });
 }
 private pick(ray:T.Raycaster){
  let closest=Infinity,info:Identification|null=null;
  const plant=this.picker?.pick(ray);if(plant){closest=plant.distance;info=plant.info;}
  this.fishes.forEach(({model},id)=>{if(!model.group.visible)return;const hit=ray.intersectObjects(model.group.children,false).find(h=>!(h.object as T.Mesh).material||(h.object as T.Mesh).material&&!((h.object as T.Mesh).material as T.Material).transparent);if(hit&&hit.distance<closest){closest=hit.distance;info=this.fishInfo(id);}});
  const grazer=this.invertebrates?.pick(ray);if(grazer&&grazer.distance<closest){closest=grazer.distance;info=grazer.info;}
  const blocked=ray.intersectObjects(this.pickBlockers,false)[0];if(blocked&&blocked.distance<closest-.025)info=null;
  this.selection=info;this.onIdentify(info);
 }
 private fishInfo(id:number):Identification{const fish=this.fishes[id];return {kind:'fish',fishId:id,name:'Cardinal tetra '+(id+1),subtitle:'Paracheirodon axelrodi',needs:'Companions, sheltered planting, clean oxygenated water and suitably small food.',role:'A small predator that forages for tiny animal prey among leaves, roots and litter.',behavior:tetraBehaviorLabel(fish.swim),point:fish.model.group.position.clone()};}
 identifyFish(id:number){if(!this.fishes.length)return;id=Math.max(0,Math.min(this.fishes.length-1,id));this.selection=this.fishInfo(id);this.onIdentify(this.selection);}
 identifyAnimal(id:number){const info=this.invertebrates?.info(id);if(info){this.selection=info;this.onIdentify(info);}}
 inspectAnimal(){if(this.selection?.animalId===undefined)return;const a=this.invertebrates?.animals[this.selection.animalId];if(!a)return;this.follow(null);const p=a.position,side=new T.Vector3().setFromMatrixColumn(a.matrix,2),forward=new T.Vector3().setFromMatrixColumn(a.matrix,0),offset=side.multiplyScalar(a.kind==='shrimp'?(side.z<0?-1.15:1.15):1.1).addScaledVector(forward,.35).addScaledVector(a.normal,.8);this.controls.target.copy(p).addScaledVector(a.normal,.09);this.camera.position.copy(this.controls.target).add(offset);this.camera.fov=37;this.camera.updateProjectionMatrix();this.inspectingAnimal=a.id;this.controls.minDistance=.7;this.controls.minPolarAngle=0;this.controls.maxPolarAngle=Math.PI;this.controls.minAzimuthAngle=-Infinity;this.controls.maxAzimuthAngle=Infinity;this.targetCamera=null;this.targetFov=null;this.controls.update();}

 identifyPlant(species:string){const info=this.picker?.example(species);if(info){this.selection=info;this.onIdentify(info);}}
 get selectedFishStatus(){if(this.selection?.animalId!==undefined)return this.invertebrates?.info(this.selection.animalId)?.behavior??'';return this.selection?.fishId!==undefined?tetraBehaviorLabel(this.fishes[this.selection.fishId].swim):'';}
 follow(id:number|null){
  if(id!==null&&!this.fishes[id])return;
  this.inspectingAnimal=null;this.following=id;this.followApproach=id!==null;this.targetCamera=null;this.targetFov=null;this.controls.minDistance=id===null?10.8:4.5;
  if(id===null){this.controls.minPolarAngle=Math.PI*.31;this.controls.maxPolarAngle=Math.PI*.515;this.controls.minAzimuthAngle=-Math.PI*.42;this.controls.maxAzimuthAngle=Math.PI*.46;const offset=this.camera.position.clone().sub(this.controls.target);this.controls.target.set(0,2.75,0);this.camera.position.copy(this.controls.target).add(offset.setLength(Math.max(10.8,offset.length())));}
  this.controls.update();
 }
 setMagnifier(enabled:boolean){this.lighting.lens.enabled=enabled;this.controls.enableRotate=!enabled;this.controls.enableZoom=!enabled;this.host.classList.toggle('magnifier-on',enabled);this.moveLens(.5,.48);}
 moveLens(x:number,y:number){const w=this.host.clientWidth,h=this.host.clientHeight,r=Math.min(86,w*.23,h*.23);this.lighting.lens.center.set(T.MathUtils.clamp(x,r/w,1-r/w),1-T.MathUtils.clamp(y,r/h,1-r/h));this.lighting.lens.radius.set(r/w,r/h);this.host.style.setProperty('--lens-x',this.lighting.lens.center.x*w+'px');this.host.style.setProperty('--lens-y',(1-this.lighting.lens.center.y)*h+'px');this.host.style.setProperty('--lens-size',r*2+'px');}
 clearSelection(){this.selection=null;this.selectionRing.hidden=true;}
 private updateSelection(){
  const selected=this.selection;if(!selected||this.teaching?.mode){this.selectionRing.hidden=true;return;}
  if(selected.fishId!==undefined)selected.point.copy(this.fishes[selected.fishId].model.group.position);
  if(selected.animalId!==undefined){const animal=this.invertebrates?.animals[selected.animalId];if(animal)selected.point.copy(animal.position);}
  this.camera.updateMatrixWorld();const p=selected.point.clone().project(this.camera);this.selectionRing.hidden=p.z>1||p.z< -1||Math.abs(p.x)>1||Math.abs(p.y)>1;
  this.selectionRing.style.transform=`translate(${(p.x*.5+.5)*this.host.clientWidth}px,${(-p.y*.5+.5)*this.host.clientHeight}px) translate(-50%,-50%)`;
 }
 private random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 private mesh(g:T.BufferGeometry,m:T.Material,p:T.Vector3,shadow=true){const o=new T.Mesh(g,m);o.position.copy(p);o.castShadow=shadow;o.receiveShadow=shadow;this.scene.add(o);return o;}
 private box(w:number,h:number,d:number,material:T.Material,p:T.Vector3,shadow=true){return this.mesh(new T.BoxGeometry(w,h,d),material,p,shadow);}
 private buildTank(){
  const dark=new T.MeshStandardMaterial({color:0x111c1e,roughness:.35,metalness:.65});
  const floor=new T.MeshStandardMaterial({color:0x0a1219,roughness:.82,metalness:0});
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
  const roomBounce=new T.RectAreaLight(0xc1dcdd,.8,11,4);
  roomBounce.position.set(0,11,7);roomBounce.lookAt(0,2,0);this.scene.add(roomBounce);
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
  buildAquariumPlumbing(this.scene);
 }
 private height(x:number,z:number){return .3+.55*Math.exp(-((x+2.5)**2/6+(z+.8)**2/2))+.22*(1-(z+2.3)/4.6)+.035*Math.sin(x*2+z)*Math.cos(z*3);}
 private buildWater(){
  const water=new AquariumWater(this.reflections);this.scene.add(water);
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
   // Development-only A/B check of the former two-pass membrane rendering.
   if(import.meta.env.DEV&&new URLSearchParams(location.search).has('doubleFinPass'))model.group.traverse(o=>{if(o instanceof T.Mesh)(o.material as T.Material).forceSinglePass=false;});
   model.group.scale.setScalar(size);model.group.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=!(o.material as T.Material).transparent;o.receiveShadow=true;o.renderOrder=0;}});
   this.fishes.push({model,swim,size});this.scene.add(model.group);
  }
  this.schoolEyes=new SchoolEyes(this.scene,this.fishes.map(f=>f.model));
 }
 learn(mode:Lesson|null,step=0){
  this.onExploreClose();this.follow(null);this.setMagnifier(false);this.selection=null;this.teaching?.set(mode,step);this.learning.running=false;this.view('front');
 }
 feed(){
  if((this.teaching?.mode==='experiments'||this.teaching?.mode==='challenges'))this.learning.state.waste+=.5;
  if(this.food.length>12)return;
  for(let i=0;i<12;i++){const m=this.mesh(new T.IcosahedronGeometry(.028,0),new T.MeshStandardMaterial({color:0xbba471,roughness:1}),V(.65+(this.random()-.5)*1.6,5.12+this.random()*.13,.62+(this.random()-.5)*.3),false);m.scale.set(1,.35,.8);this.food.push({mesh:m,age:0});}
 }
 zoom(scale:number){this.followApproach=false;this.targetCamera=null;this.targetFov=null;const offset=this.camera.position.clone().sub(this.controls.target);offset.setLength(clamp(offset.length()*scale,this.controls.minDistance,this.controls.maxDistance));this.camera.position.copy(this.controls.target).add(offset);this.controls.update();}
 private studyFov(){return this.teaching?.mode==='underground'?Math.max(37,2*Math.atan(2.7/(10*this.host.clientWidth/this.host.clientHeight))*180/Math.PI):37;}
 get magnifierEnabled(){return this.lighting.lens.enabled;}
 private get studyView(){return this.teaching?.mode==='organisms'||this.teaching?.mode==='underground'||this.teaching?.mode==='water'&&this.teaching.step>0&&this.teaching.step<4;}
 view(name:string){this.follow(null);const dist=this.studyView?11.5:21.5,angle=name==='front'?0:name==='side'?1.28:.47;this.targetCamera=V(Math.sin(angle)*dist, name==='front'?(this.studyView?2.75:2.45):this.studyView?5:7.5,Math.cos(angle)*dist);this.targetFov=this.studyView?this.studyFov():aquariumFieldOfView(this.host.clientWidth,this.host.clientHeight,this.targetCamera);}
 private resize(){
  const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;this.camera.aspect=w/h;
  // Fit continuously across viewport shapes while retaining the user's zoom distance.
  const framingPosition=this.camera.position.clone().sub(this.controls.target).setLength(21.5).add(this.controls.target);
  this.camera.fov=this.studyView?this.studyFov():aquariumFieldOfView(w,h,framingPosition);
  if(this.targetCamera)this.targetFov=this.studyView?this.studyFov():aquariumFieldOfView(w,h,this.targetCamera);
  this.camera.updateProjectionMatrix();this.renderer.setSize(w,h);this.moveLens(this.lighting.lens.center.x,1-this.lighting.lens.center.y);
  const size=this.renderer.getDrawingBufferSize(new T.Vector2());this.lighting.resize(size.x,size.y);
 }
 private avoidSolid(s:TetraSwim){
  // Look ahead before contact and select the nearer open side of a branch.
  const ahead=fishPosition(s.x+s.vx*.8,s.y+s.vy*.8,s.z+s.vz*.8);
  if(s.avoidanceRemaining<=0)for(const obstacle of this.obstacles){
   if(ahead.distanceToSquared(obstacle.center)<(obstacle.radius+.34)**2){
    const center=fishCoordinates(obstacle.center),side=s.z>=center.z?1:-1;
    s.avoidanceZ=clamp(center.z+side*(obstacle.radius+.40)/2.52,-.26,1.26);s.avoidanceRemaining=2.5;break;
   }
  }
  const p=fishPosition(s.x,s.y,s.z),before=p.clone();clearHardscape(p,this.obstacles);
  if(p.distanceToSquared(before)>.000001){s.avoidanceZ=clamp(s.z+(p.z>=before.z?.27:-.27),-.26,1.26);s.avoidanceRemaining=2.5;s.depthTarget=Math.max(260,s.y-30);}
  Object.assign(s,fishCoordinates(p));
 }
 private animate=(now:number)=>{
  this.frame=requestAnimationFrame(this.animate);
  if(document.hidden){this.last=0;return;}
  const updateStart=performance.now();
  const elapsed=this.last?(now-this.last)/1000:0,wallDt=Math.min(elapsed,.05);this.last=now;
  const dt=this.paused||document.hidden?0:wallDt;this.time+=dt;this.currentTime+=dt*((this.teaching?.mode==='experiments'||this.teaching?.mode==='challenges')?.2+.8*this.learning.environment.flow/65:1);this.swimShader.value=this.currentTime;
  if(this.targetCamera){
   const ease=1-Math.exp(-wallDt*4);this.camera.position.copy(orbitToward(this.camera.position,this.targetCamera,ease));
   // Keep the intermediate diagonal silhouette in view too. Preserve a deliberate
   // close-up while its camera distance eases back toward the selected preset.
   const fittingPosition=this.camera.position.clone().sub(this.controls.target).setLength(this.targetCamera.distanceTo(this.controls.target)).add(this.controls.target);
   const required=this.studyView?this.studyFov():aquariumFieldOfView(this.host.clientWidth,this.host.clientHeight,fittingPosition);
   this.camera.fov=Math.max(required,T.MathUtils.lerp(this.camera.fov,this.targetFov??required,ease));this.camera.updateProjectionMatrix();
   if(this.camera.position.distanceTo(this.targetCamera)<.02){this.camera.position.copy(this.targetCamera);this.camera.fov=this.targetFov??this.camera.fov;this.camera.updateProjectionMatrix();this.targetCamera=null;this.targetFov=null;}
  }
  this.controls.update();
  this.learning.tick((this.teaching?.mode==='experiments'||this.teaching?.mode==='challenges')&&!this.paused?wallDt:0);
  const teachingMode=this.teaching?.mode;
  const lightTarget=(teachingMode==='experiments'||teachingMode==='challenges')?.27+.73*Math.min(1,this.learning.light):teachingMode==='day'?(this.teaching!.night?.27:1):this.evening?.27:1;
  this.daylight=T.MathUtils.lerp(this.daylight,lightTarget,1-Math.exp(-wallDt*1.4));
  this.waterIllumination.value=this.daylight;
  this.ledMaterial.emissiveIntensity=3*this.daylight;
  for(const light of this.canopyLights)light.intensity=canopy.sampleIntensity*this.daylight;
  this.stripLight.intensity=canopy.stripIntensity*this.daylight;this.fill.intensity=.18+this.daylight*.72;this.renderer.toneMappingExposure=(.8+.32*this.daylight)*(this.inspectingAnimal!==null?.80:1);
  const snapshot=this.fishes.map(({swim:s},id)=>({id,x:s.x,y:s.y,z:s.z,vx:s.vx,vy:s.vy,radius:25}));
  const goal=advanceSchoolRoute(this.school,dt,snapshot);
  const food=this.food.map(f=>({id:f.mesh.id,...fishCoordinates(f.mesh.position)}));
  this.fishes.forEach(({swim:s},i)=>{
   const activity=schoolActivity(this.school,goal,i);
   advanceTetraSwim(s,dt,false,(teachingMode==='experiments'||teachingMode==='challenges')&&this.learning.state.oxygen<3,{food:food.filter(f=>this.food.some(live=>live.mesh.id===f.id)),neighbors:snapshot.filter(n=>n.id!==i),schoolGoal:activity.goal,schoolAffinity:activity.affinity,daylight:this.daylight,browseSites:this.browseSites,depthBounds:[-.26,1.26]});
   if(dt)this.avoidSolid(s);
   if(s.brain.consumedFood!==null){const idx=this.food.findIndex(f=>f.mesh.id===s.brain.consumedFood);if(idx>=0){const f=this.food.splice(idx,1)[0];this.scene.remove(f.mesh);f.mesh.geometry.dispose();(f.mesh.material as T.Material).dispose();}s.brain.consumedFood=null;}
  });
  if(dt){const bodies=this.fishes.map(({swim:s},id)=>({id,x:s.x,y:s.y,z:s.z,radius:25}));separateFish(bodies,[-.40,1.40]);bodies.forEach((b,i)=>{Object.assign(this.fishes[i].swim,{x:b.x,y:b.y,z:b.z});this.avoidSolid(this.fishes[i].swim);});}
  this.fishes.forEach(({model,swim:s})=>{model.group.position.copy(fishPosition(s.x,s.y,s.z));model.group.rotation.set(0,s.yaw+s.depthHeading,s.pitch,'YXZ');model.update(this.time,s.effort,this.texture,.65,s.z,1,dt,s.pectoralEffort);});
  if(this.following!==null){if(this.followApproach){const offset=this.camera.position.clone().sub(this.controls.target),ease=1-Math.exp(-wallDt*2.2);offset.setLength(T.MathUtils.lerp(offset.length(),7.5,ease));this.camera.position.copy(this.controls.target).add(offset);this.camera.fov=T.MathUtils.lerp(this.camera.fov,37,ease);this.camera.updateProjectionMatrix();if(Math.abs(offset.length()-7.5)<.01)this.followApproach=false;}trackFish(this.camera,this.controls.target,this.fishes[this.following].model.group.position,wallDt);this.controls.update();}
  if(dt)this.invertebrates?.update(dt);
  if(this.inspectingAnimal!==null&&this.invertebrates){const a=this.invertebrates.animals[this.inspectingAnimal];trackFish(this.camera,this.controls.target,a.position.clone().addScaledVector(a.normal,.09),wallDt);this.controls.update();}
  this.updateSelection();
  this.status=this.food.length?'Foraging':this.fishes.length?tetraBehaviorLabel(this.fishes[0].swim):'Exploring';
  for(let i=this.food.length-1;i>=0;i--){const f=this.food[i];f.age+=dt;f.mesh.position.y-=dt*.07;f.mesh.rotation.y+=dt*.5;if(f.age>48){this.scene.remove(f.mesh);f.mesh.geometry.dispose();(f.mesh.material as T.Material).dispose();this.food.splice(i,1);}}
  this.bubbles.visible=!this.studyView&&((teachingMode!=='experiments'&&teachingMode!=='challenges')||this.learning.environment.co2>0);
  const d=new T.Object3D();for(let i=0;i<48;i++){const t=(this.time*(.11+(i%4)*.015)+i*.137)%1;d.position.set(4.36+Math.sin(t*8+i)*.045+t*.16,.85+t*4.46,-1.7+Math.cos(t*6+i)*.06);d.scale.setScalar(.4+(1-t)*.6);d.updateMatrix();this.bubbles.setMatrixAt(i,d.matrix);}this.bubbles.instanceMatrix.needsUpdate=true;
  const p=this.dust.geometry.getAttribute('position') as T.BufferAttribute;if(dt){for(let i=0;i<p.count;i++){let x=p.getX(i)+Math.sin(i+this.time*.2)*dt*.018,y=p.getY(i)+dt*.006;if(y>5.3)y=.7;p.setXY(i,x,y);}p.needsUpdate=true;}
  this.water.update(this.currentTime,this.camera.position.y,this.daylight);
  this.teaching?.update(dt,this.camera,(teachingMode==='experiments'||teachingMode==='challenges')?this.learning.environment.flow:65);
  // All passes share the same world transforms for this simulation frame.
  this.scene.updateMatrixWorld();this.scene.matrixWorldAutoUpdate=false;
  this.schoolEyes?.update();
  const renderStart=performance.now();
  if(import.meta.env.DEV){this.renderer.info.autoReset=false;this.renderer.info.reset();}
  this.gpuTimer?.begin();
  this.renderer.shadowMap.needsUpdate=true;
  const sceneTriangles=this.lighting.render(this.renderer,this.lightingInspection);
  if(this.inspection){this.inspection.material.map=this.water.reflectionTexture;this.renderer.render(this.inspection.scene,this.inspection.camera);}
  this.gpuTimer?.end();
  if(import.meta.env.DEV){
   this.frameSamples.push([elapsed*1000,renderStart-updateStart,performance.now()-renderStart,this.renderer.info.render.calls,this.renderer.info.render.triangles]);
   if(this.frameSamples.length>=240){const samples=this.frameSamples;const q=(column:number,p:number)=>{const sorted=samples.map(s=>s[column]).sort((a,b)=>a-b);return +sorted[Math.floor((sorted.length-1)*p)].toFixed(2);};this.host.dataset.frameProfile=JSON.stringify({frames:samples.length,frameMsP50:q(0,.5),frameMsP95:q(0,.95),updateMsP50:q(1,.5),updateMsP95:q(1,.95),renderCpuMsP50:q(2,.5),renderCpuMsP95:q(2,.95),drawCalls:q(3,.5),triangles:q(4,.5)});this.frameSamples=[];}
   this.diagnosticFrames++;this.diagnosticTime+=elapsed;if(this.diagnosticTime>=1){this.host.dataset.renderMs=(performance.now()-renderStart).toFixed(1);this.host.dataset.fps=String(Math.round(this.diagnosticFrames/this.diagnosticTime));this.host.dataset.triangles=String(sceneTriangles);this.host.dataset.fishBehavior=JSON.stringify(this.fishes.map(({swim:s})=>({speed:+s.speed.toFixed(1),behavior:s.behavior,intent:s.brain.intent.kind,energy:+s.brain.energy.toFixed(2)})));this.host.dataset.foodCount=String(this.food.length);this.host.dataset.fishPositions=JSON.stringify(this.fishes.map(f=>({x:+f.model.group.position.x.toFixed(2),y:+f.model.group.position.y.toFixed(2),z:+f.model.group.position.z.toFixed(2)})));this.diagnosticFrames=0;this.diagnosticTime=0;}}

 };
}
