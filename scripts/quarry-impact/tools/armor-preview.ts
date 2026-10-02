import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {attachVehicleArmor} from '../src/vehicle-armor';
import {CAR_KINDS,DEFINITIONS,type CarKind} from '../src/rules';
const scene=new T.Scene();scene.background=new T.Color(0x263940);scene.fog=new T.Fog(0x263940,20,50);
const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;document.body.append(renderer.domElement);
const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
const camera=new T.PerspectiveCamera(38,innerWidth/innerHeight,.05,100);camera.position.set(4.8,2.6,6);const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.8,0);controls.enableDamping=true;controls.minDistance=2.3;controls.maxDistance=16;controls.maxPolarAngle=Math.PI*.48;
const floor=new T.Mesh(new T.PlaneGeometry(100,100),new T.MeshStandardMaterial({color:0x354344,roughness:.87}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
const light=new T.DirectionalLight(0xffe7ca,3.2);light.position.set(4,7,6);light.castShadow=true;light.shadow.mapSize.set(2048,2048);Object.assign(light.shadow.camera,{left:-7,right:7,top:7,bottom:-7});light.shadow.normalBias=.018;scene.add(light,new T.HemisphereLight(0xd4e6ee,0x45493b,1.2));
const carSelect=document.getElementById('car')as HTMLSelectElement,levelSelect=document.getElementById('level')as HTMLSelectElement;
for(const kind of CAR_KINDS){const option=document.createElement('option');option.value=kind;option.textContent=DEFINITIONS[kind].name;carSelect.append(option);}carSelect.value='buggy';
let current:T.Group|undefined,serial=0;
async function show(){const request=++serial,kind=carSelect.value as CarKind,level=Number(levelSelect.value);document.getElementById('spec')!.textContent='Preparing fitted parts…';const gltf=await new GLTFLoader().loadAsync('/models/'+kind+'.glb');if(request!==serial)return;
 if(current){scene.remove(current);current.traverse(o=>{if(o instanceof T.Mesh&&!o.name.startsWith('panel_Reinforcement_')){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}
 current=gltf.scene;attachVehicleArmor(current,kind,level);current.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=!o.name.endsWith('_fasteners');o.receiveShadow=true;}});current.updateMatrixWorld(true);const tyres=new T.Box3();for(const name of ['FL','FR','RL','RR']){const w=current.getObjectByName('wheel_'+name);if(w)tyres.union(new T.Box3().setFromObject(w));}if(!tyres.isEmpty())current.position.y=-tyres.min.y;scene.add(current);
 let meshes=0,vertices=0;current.traverse(o=>{if(o instanceof T.Mesh&&o.name.startsWith('panel_Reinforcement_')){meshes++;vertices+=o.geometry.attributes.position.count;}});document.getElementById('spec')!.textContent=level?`${DEFINITIONS[kind].name} · ${['Stock','Club','Sport','Competition'][level]} fitted · ${meshes} reinforcement meshes / ${Math.round(vertices/3).toLocaleString()} triangles`:`${DEFINITIONS[kind].name} · Stock bodywork`;
}
carSelect.onchange=()=>void show();levelSelect.onchange=()=>void show();
document.getElementById('front')!.onclick=()=>{camera.position.set(4.8,2.6,6);controls.target.set(0,.8,0);};document.getElementById('rear')!.onclick=()=>{camera.position.set(-4.8,2.6,-6);controls.target.set(0,.8,0);};document.getElementById('side')!.onclick=()=>{camera.position.set(-6.6,1.7,.8);controls.target.set(0,.75,0);};
function resize(){camera.aspect=innerWidth/innerHeight;camera.fov=2*Math.atan(Math.tan(38*Math.PI/360)*Math.max(1,1.25/camera.aspect))*180/Math.PI;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}addEventListener('resize',resize);resize();void show();
function frame(){requestAnimationFrame(frame);controls.update();renderer.render(scene,camera);}frame();
