import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {varieties} from './KoiMotion.js';
import {createSpine,updateSpine,sampleSpine,spineShader} from './KoiSpine.js';
import {addCaustics} from './Caustics.js';
import {bottom} from './PondGeometry.js';
const base=import.meta.env.BASE_URL;
export async function buildKoi(scene,school,pondClock){
 const loader=new T.TextureLoader();const [gltf,maps,bump]=await Promise.all([new GLTFLoader().loadAsync(base+'models/koi.glb'),Promise.all(varieties.map(v=>loader.loadAsync(base+'models/'+v.id+'.png'))),loader.loadAsync(base+'models/koi-scales.png')]);
 gltf.scene.updateMatrixWorld(true);for(const map of maps){map.colorSpace=T.SRGBColorSpace;map.flipY=false;map.anisotropy=8;}bump.flipY=false;bump.anisotropy=8;
 const templates=[];gltf.scene.traverse(o=>{if(o instanceof T.Mesh)templates.push({name:o.name,geometry:o.geometry.clone().applyMatrix4(o.matrixWorld),material:o.material});});
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const cx=shadowCanvas.getContext('2d'),gradient=cx.createRadialGradient(64,64,4,64,64,64);gradient.addColorStop(0,'#142927b3');gradient.addColorStop(.4,'#14292760');gradient.addColorStop(1,'#14292700');cx.fillStyle=gradient;cx.fillRect(0,0,128,128);const shadowMap=new T.CanvasTexture(shadowCanvas);shadowMap.colorSpace=T.SRGBColorSpace;
 const groups=[];
 for(const f of school.fish){const root=new T.Group();root.scale.setScalar(f.size);root.userData.fishId=f.id;const spine={value:createSpine()},finClock={value:f.finPhase},gain={value:.7};const fins=[];let mouth;
  for(const source of templates){const material=source.material.clone();material.roughness=source.name==='body'?.36:.47;material.metalness=f.variety.id==='ogon'?.16:0;material.envMapIntensity=.7;
   if(source.name==='body'){material.map=maps[f.id];material.bumpMap=bump;material.bumpScale=.009;material.color.set(0xffffff);}
   const geo=source.geometry.clone(),isFin=/pectoral|pelvic|caudal|dorsal|anal/.test(source.name),paired=/^(pectoral|pelvic)/.test(source.name);material.side=isFin?T.DoubleSide:T.FrontSide;
   if(isFin&&!source.name.endsWith('_rays')){material.transparent=true;material.opacity=.77;material.depthWrite=false;material.color.set('#e0d8bd');}
   const mesh=new T.Mesh(geo,material);mesh.name=source.name;mesh.userData.fishId=f.id;mesh.receiveShadow=true;root.add(mesh);
   if(paired){const s=source.name.includes('_-1')?-1:1,pelvic=source.name.startsWith('pelvic'),origin=new T.Vector3(pelvic?-.09:.22,pelvic?-.10:-.055,s*(pelvic?.048:.08)),pivot=new T.Group();pivot.position.copy(origin);geo.translate(-origin.x,-origin.y,-origin.z);root.remove(mesh);pivot.add(mesh);root.add(pivot);fins.push({pivot,s,pelvic,origin});
    material.onBeforeCompile=shader=>{shader.uniforms.finTime=finClock;shader.uniforms.finGain=gain;shader.vertexShader='uniform float finTime,finGain;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>\nfloat freeEdge=clamp(abs(position.z)/.18,0.,1.);transformed.y+=sin(finTime+freeEdge*2.6+${(s*.55).toFixed(2)})*freeEdge*freeEdge*(.025+.025*finGain);`);};material.customProgramCacheKey=()=> 'flexible-paired-fin-'+s;
   }else{const stable=/^(eye|iris|gill|barbel)/.test(source.name)||['mouth','oral_cavity'].includes(source.name);
    if(!stable){material.onBeforeCompile=shader=>{shader.uniforms.koiSpine=spine;shader.vertexShader=spineShader+'\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nobjectNormal=skinNormal(objectNormal,position.x);');shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed=skinPoint(position);');};material.customProgramCacheKey=()=> 'arc-length-koi-spine-v2';}
   }
   if(source.name==='mouth')mouth=mesh;
   addCaustics(material,pondClock,.38);
  }
  const shadow=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false,opacity:.28}));shadow.rotation.x=-Math.PI/2;scene.add(root,shadow);groups.push({root,shadow,f,spine,finClock,gain,fins,mouth});
 }
 return {groups,update(){for(const a of groups){const f=a.f,floor=bottom(f.position.x,f.position.z),height=Math.max(0,f.position.y-floor),spread=1+height*.32;a.shadow.position.set(f.position.x,floor+.025,f.position.z);a.shadow.rotation.set(-Math.PI/2,0,f.yaw);a.shadow.scale.set(f.size*spread,f.size*.48*spread,1);a.shadow.material.opacity=.34*Math.exp(-height*.6);a.root.position.copy(f.position);a.root.rotation.set(0,f.yaw,f.pitch,'YXZ');updateSpine(a.spine.value,f.phase,f.effort,f.turn);a.finClock.value=f.finPhase;a.gain.value=f.effort;
  for(const fin of a.fins){const o=fin.origin,q=sampleSpine(a.spine.value,o.x),s=fin.s;fin.pivot.position.set(q.x+o.z*Math.sin(q.z),o.y,q.y+o.z*Math.cos(q.z));fin.pivot.rotation.set(s*(.12+Math.sin(f.finPhase+s*.55+(fin.pelvic?1.2:0))*(.24+f.effort*.15)),q.z+s*Math.sin(f.finPhase*.72+s)*.13,0,'YXZ');}if(a.mouth)a.mouth.scale.y=.94+Math.sin(f.phase*1.25)*.08;}},triangles:templates.reduce((sum,s)=>sum+(s.geometry.index?.count??s.geometry.attributes.position.count)/3,0)};
}
