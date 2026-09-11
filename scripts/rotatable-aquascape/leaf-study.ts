import * as T from 'three';
import {buildBotanicalPlants} from './lib/BotanicalPlants';
// Local authoring view, excluded from the public Vite entry.
const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;document.body.append(renderer.domElement);
const scene=new T.Scene(),source=new T.Scene(),time={value:0};scene.background=new T.Color(0x080f12);buildBotanicalPlants(source,()=>.5,time);
scene.add(new T.HemisphereLight(0xc2e2e6,0x5b6a49,.9));const key=new T.DirectionalLight(0xe8f8ed,3.5);key.position.set(-1,4,5);scene.add(key);
const samples:T.Group[]=[];
for(const [index,species] of ['sword','bacopa','stem'].entries()){
 const leaf=source.children.find(o=>o.userData.plantSpecies===species) as T.InstancedMesh;
 const geometry=leaf.geometry.clone();for(const name of ['plantRoot','plantFlex','leafMotion']){const original=geometry.getAttribute(name);geometry.setAttribute(name,new T.InstancedBufferAttribute(new Float32Array(Array.from(original.array).slice(0,original.itemSize)),original.itemSize));}
 const matrix=new T.Matrix4();leaf.getMatrixAt(0,matrix);const position=new T.Vector3(),rotation=new T.Quaternion(),scale=new T.Vector3();matrix.decompose(position,rotation,scale);
 const mesh=new T.InstancedMesh(geometry,leaf.material,1),color=new T.Color();mesh.setMatrixAt(0,matrix);leaf.getColorAt(0,color);mesh.setColorAt(0,color);
 // Undo the placement orientation only; the actual blade/profile, texture and deformation stay intact.
 const sample=new T.Group(),placement=new T.Group();placement.quaternion.copy(rotation).invert();placement.scale.setScalar(2.5/scale.y);mesh.position.copy(position).negate();placement.add(mesh);sample.add(placement);sample.position.set((index-1)*2.8,-1.35,0);scene.add(sample);samples.push(sample);
}
const camera=new T.PerspectiveCamera(37,1,.1,100);camera.position.set(0,0,13);
const resize=()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();};resize();addEventListener('resize',resize);
let paused=false,back=false,last=0;
document.querySelector<HTMLButtonElement>('#pause')!.onclick=()=>{paused=!paused;document.querySelector('#pause')!.textContent=paused?'Resume motion':'Pause motion';};
document.querySelector<HTMLButtonElement>('#turn')!.onclick=()=>{back=!back;document.querySelector('#turn')!.textContent=back?'Show upper faces':'Show undersides';};
renderer.setAnimationLoop(now=>{const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(!paused)time.value+=dt;for(const sample of samples)sample.rotation.y=T.MathUtils.damp(sample.rotation.y,back?Math.PI:0,5,dt);renderer.render(scene,camera);});
