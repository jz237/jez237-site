import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {loadCars,cloneCar,templates} from './assets';
import {CAR_KINDS} from './rules';
import {LiveryPaint} from './livery-paint';
import type {PublishedDesign} from './design-client';
import {createPMREMGenerator} from './rendering';
let loading:Promise<void>|undefined;
function ready(){if(CAR_KINDS.every(k=>templates.has(k)))return Promise.resolve();return loading??=loadCars(()=>{}).catch(e=>{loading=undefined;throw e})}
/** Uses race models and the same body-space livery shader. Renders on changes
 * only: no automatic orbit, animation loop, physics world or camera cuts. */
export function mountCarPreview(host:HTMLElement,design:PublishedDesign){
 let disposed=false,cleanup=()=>{};
 const status=document.createElement('p');status.setAttribute('role','status');status.textContent='Loading 3D vehicle…';host.append(status);
 const loaded=ready().then(()=>{
  if(disposed)return;
  const renderer=new T.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.domElement.setAttribute('aria-label','3D painted vehicle preview');renderer.domElement.style.touchAction='none';renderer.domElement.tabIndex=0;
  const scene=new T.Scene();scene.background=new T.Color(0x17221c);
  const camera=new T.PerspectiveCamera(36,1,.1,100),controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableDamping=false;controls.minPolarAngle=.18;controls.maxPolarAngle=Math.PI*.49;
  const pmrem=createPMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();
  scene.add(new T.HemisphereLight(0xffffff,0x586347,2));const light=new T.DirectionalLight(0xfff1db,3);light.position.set(-4,7,5);scene.add(light);
  const model=cloneCar(design.kind,design.paint);model.traverse(o=>{if(o instanceof T.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof T.MeshStandardMaterial&&m.name.startsWith('paint'))m.color.setHex(m.name.includes('Paint 2')?design.trim:design.paint)});
  const paint=new LiveryPaint(model);paint.set(design.layers);scene.add(model);
  const box=new T.Box3().setFromObject(model),center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3()),radius=size.length()/2;
  controls.target.copy(center);controls.minDistance=radius*1.2;controls.maxDistance=radius*5;
  const floor=new T.Mesh(new T.CircleGeometry(radius*1.7,64),new T.MeshStandardMaterial({color:0x344237,roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.set(center.x,box.min.y-.02,center.z);scene.add(floor);
  const draw=()=>{if(!disposed)renderer.render(scene,camera)};
  const view=(direction:T.Vector3)=>{const distance=radius/Math.sin(T.MathUtils.degToRad(camera.fov/2))*Math.max(1,1/camera.aspect)*1.08;camera.position.copy(center).add(direction.normalize().multiplyScalar(distance));controls.target.copy(center);controls.update();draw()};
  const resize=()=>{const width=Math.max(240,host.clientWidth),height=Math.round(width*.66);renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();draw()};
  const buttons=document.createElement('div');buttons.className='preview-views';
  for(const [name,direction]of [['LEFT',new T.Vector3(-1,.22,0)],['RIGHT',new T.Vector3(1,.22,0)],['FRONT',new T.Vector3(0,.25,1)],['REAR',new T.Vector3(0,.25,-1)],['TOP',new T.Vector3(0,1,.001)],['RESET VIEW',new T.Vector3(-1,.55,1)]] as const){const button=document.createElement('button');button.textContent=name;button.onclick=()=>view(direction.clone());buttons.append(button)}
  const key=(e:KeyboardEvent)=>{const offset=camera.position.clone().sub(controls.target),spherical=new T.Spherical().setFromVector3(offset);if(e.key==='ArrowLeft')spherical.theta-=.15;else if(e.key==='ArrowRight')spherical.theta+=.15;else if(e.key==='ArrowUp')spherical.phi=Math.max(.18,spherical.phi-.1);else if(e.key==='ArrowDown')spherical.phi=Math.min(Math.PI*.49,spherical.phi+.1);else return;e.preventDefault();camera.position.copy(controls.target).add(new T.Vector3().setFromSpherical(spherical));controls.update();draw()};
  renderer.domElement.addEventListener('keydown',key);controls.addEventListener('change',draw);
  const observer=new ResizeObserver(resize);observer.observe(host);host.append(renderer.domElement,buttons);status.textContent='Drag to rotate · scroll to zoom · arrow keys rotate when preview is focused';resize();view(new T.Vector3(-1,.55,1));
  cleanup=()=>{observer.disconnect();controls.removeEventListener('change',draw);controls.dispose();renderer.domElement.removeEventListener('keydown',key);paint.dispose();const materials=new Set<T.Material>();model.traverse(o=>{if(o instanceof T.Mesh){if(/^(panel_|glass_)/.test(o.name))o.geometry.dispose();for(const material of Array.isArray(o.material)?o.material:[o.material])materials.add(material)}});materials.forEach(m=>m.dispose());floor.geometry.dispose();(floor.material as T.Material).dispose();environment.dispose();renderer.dispose();renderer.forceContextLoss();host.replaceChildren()};
 }).catch(()=>{if(!disposed)status.textContent='3D preview unavailable. The painted surface preview below is still available.'});
 return {loaded,dispose(){if(disposed)return;disposed=true;cleanup();host.replaceChildren()}};
}
