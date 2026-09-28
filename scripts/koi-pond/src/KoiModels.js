import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {varieties} from './KoiMotion.js';
const base=import.meta.env.BASE_URL;
export async function buildKoi(scene,school){
 const loader=new T.TextureLoader();const [gltf,maps,bump]=await Promise.all([new GLTFLoader().loadAsync(base+'models/koi.glb'),Promise.all(varieties.map(v=>loader.loadAsync(base+'models/'+v.id+'.png'))),loader.loadAsync(base+'models/koi-scales.png')]);
 gltf.scene.updateMatrixWorld(true);for(const map of maps){map.colorSpace=T.SRGBColorSpace;map.flipY=false;map.anisotropy=8;}bump.flipY=false;bump.anisotropy=8;
 const templates=[];gltf.scene.traverse(o=>{if(o instanceof T.Mesh)templates.push({name:o.name,geometry:o.geometry.clone().applyMatrix4(o.matrixWorld),material:o.material});});
 const groups=[];
 for(const f of school.fish){const root=new T.Group();root.scale.setScalar(f.size);root.userData.fishId=f.id;const clock={value:f.phase},finClock={value:f.finPhase},gain={value:1},turn={value:0};const fins=[];let mouth;
  for(const source of templates){const material=source.material.clone();material.roughness=source.name==='body'?.44:.53;material.metalness=f.variety.id==='ogon'?.16:0;material.envMapIntensity=.60;
   if(source.name==='body'){material.map=maps[f.id];material.bumpMap=bump;material.bumpScale=.004;material.color.set(0xffffff);}
   const geo=source.geometry.clone(),isFin=/pectoral|pelvic|caudal|dorsal|anal/.test(source.name);material.side=isFin?T.DoubleSide:T.FrontSide;
   if(isFin&&!source.name.endsWith('_rays')){material.transparent=true;material.opacity=.84;material.depthWrite=false;material.color.set('#d5cbb2');}
   const mesh=new T.Mesh(geo,material);mesh.name=source.name;mesh.userData.fishId=f.id;mesh.castShadow=false;mesh.receiveShadow=true;root.add(mesh);
   if(source.name.startsWith('pectoral')||source.name.startsWith('pelvic')){const s=source.name.includes('_-1')?-1:1,pelvic=source.name.startsWith('pelvic'),origin=new T.Vector3(pelvic?-.09:.22,pelvic?-.10:-.055,s*(pelvic?.048:.08));const pivot=new T.Group();pivot.position.copy(origin);geo.translate(-origin.x,-origin.y,-origin.z);root.remove(mesh);pivot.add(mesh);root.add(pivot);fins.push({pivot,s,pelvic});}
   if(source.name==='mouth')mouth=mesh;
   // One continuous rear-body wave, with a pinned head. Derivative normals keep
   // scale lighting attached to the bending body instead of sliding over it.
   const stable=source.name.startsWith('eye')||source.name.startsWith('iris')||source.name==='mouth'||source.name==='oral_cavity'||source.name.startsWith('gill')||source.name.startsWith('barbel');
   if(!stable&&!source.name.startsWith('pectoral')&&!source.name.startsWith('pelvic')){
    material.onBeforeCompile=shader=>{shader.uniforms.koiPhase=clock;shader.uniforms.koiGain=gain;shader.uniforms.koiTurn=turn;shader.vertexShader=`uniform float koiPhase,koiGain,koiTurn;float bend(float x){float u=max(0.,(.24-x)/.85);return pow(u,2.)*(.049*koiGain*sin(koiPhase-u*5.7)+koiTurn*.095);}\n`+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nfloat slope=(bend(position.x+.001)-bend(position.x-.001))/.002;objectNormal.x-=slope*objectNormal.z;');shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.z+=bend(position.x);');};material.customProgramCacheKey=()=> 'original-koi-traveling-wave-1';
   }
  }
  scene.add(root);groups.push({root,f,clock,finClock,gain,turn,fins,mouth});
 }
 return {groups,update(){for(const a of groups){const f=a.f;a.root.position.copy(f.position);a.root.rotation.set(0,f.yaw,f.pitch,'YXZ');a.clock.value=f.phase;a.finClock.value=f.finPhase;a.gain.value=f.coast?.68:1.1;a.turn.value=f.turn;for(const fin of a.fins){fin.pivot.rotation.x=fin.s*(.18+Math.sin(f.finPhase+(fin.pelvic?1.2:0))* .24);fin.pivot.rotation.y=fin.s*Math.sin(f.finPhase*.63)*.13;}if(a.mouth)a.mouth.scale.y=.9+Math.sin(f.phase*1.45)*.10;}},triangles:templates.reduce((sum,s)=>sum+(s.geometry.index?.count??s.geometry.getAttribute('position').count)/3,0)};
}
