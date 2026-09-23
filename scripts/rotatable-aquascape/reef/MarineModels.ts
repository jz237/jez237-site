import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import metadata from './assets/fish/model-info.json';
export type MarineSpecies='tang'|'yellow'|'clown'|'anthias'|'chromis'|'gramma';
const urls={
 tang:new URL('./assets/fish/tang.glb',import.meta.url).href,
 yellow:new URL('./assets/fish/yellow.glb',import.meta.url).href,
 clown:new URL('./assets/fish/clown.glb',import.meta.url).href,
 anthias:new URL('./assets/fish/anthias.glb',import.meta.url).href,
 chromis:new URL('./assets/fish/chromis.glb',import.meta.url).href,
 gramma:new URL('./assets/fish/gramma.glb',import.meta.url).href
};
/** Geometry and embedded textures are shared between inhabitants. Vertex waves,
 * fin pivots and respiration remain independent per animal at runtime. */
export async function loadMarineModels(){
 const loader=new GLTFLoader(),templates=new Map<MarineSpecies,T.Group>();
 await Promise.all((Object.keys(urls) as MarineSpecies[]).map(async species=>{
  const gltf=await loader.loadAsync(urls[species]);gltf.scene.updateMatrixWorld(true);
  const group=new T.Group(),eyes=new T.Group();eyes.name='eyes';group.add(eyes);
  gltf.scene.traverse(node=>{
   if(!(node instanceof T.Mesh))return;
   const label=node.name.split('__').at(-1)!,geometry=node.geometry.clone().applyMatrix4(node.matrixWorld);
   const material=(node.material as T.MeshPhysicalMaterial).clone();material.envMapIntensity=.38;
   // Submerged tissue has a much smaller optical contrast than a varnished object
   // in air. Keep the source scale/iris detail without the broad clearcoat glare.
   material.metalness=0;material.clearcoat=0;material.ior=1.16;
   material.roughness=label.startsWith('eye')?.25:label==='body'||label.startsWith('gill')?.52:.56;
   // Reference photos already contain studio lighting; calibrate reflected color
   // to retain orange chroma under the aquarium's intense overhead illumination.
   material.color.setScalar(species==='anthias'?.40:.72);
   if(material.map)material.map.anisotropy=8;
   const mesh=new T.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;
   if(label.startsWith('pectoral')){
    const pivot=new T.Group();pivot.name='pectoral';pivot.position.setFromMatrixPosition(node.matrixWorld);
    geometry.translate(-pivot.position.x,-pivot.position.y,-pivot.position.z);mesh.name='fin';mesh.userData.pectoral=true;material.side=T.DoubleSide;material.depthWrite=false;
    pivot.add(mesh);group.add(pivot);
   }else if(label.startsWith('eye')){mesh.name='eye';eyes.add(mesh);
   }else if(label.startsWith('gill')){mesh.name='gill';mesh.userData.side=label.endsWith('-1')?-1:1;material.side=T.DoubleSide;group.add(mesh);
   }else {mesh.name=label==='body'?'body':'fin';if(mesh.name==='fin'){material.side=T.DoubleSide;material.depthWrite=false;}group.add(mesh);}
  });
  // Fin flex grows from a pinned insertion to a freely moving margin.
  const edge=(points:number[][],x:number)=>{for(let i=1;i<points.length;i++)if(x<=points[i][0])return T.MathUtils.lerp(points[i-1][1],points[i][1],T.MathUtils.clamp((x-points[i-1][0])/(points[i][0]-points[i-1][0]),0,1));return points.at(-1)![1];};
  group.traverse(node=>{if(!(node instanceof T.Mesh)||node.name!=='fin')return;const p=node.geometry.getAttribute('position'),flex=new Float32Array(p.count);for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);flex[i]=node.userData.pectoral?T.MathUtils.clamp(Math.hypot(x,y,p.getZ(i))/.24,0,1):Math.max(T.MathUtils.clamp((-.47-x)/.30,0,1),T.MathUtils.clamp(Math.max(y-edge(metadata[species].upper,x),edge(metadata[species].lower,x)-y)/.12,0,1));}node.geometry.setAttribute('finFlex',new T.BufferAttribute(flex,1));});
  const mouth=new T.Group();mouth.name='mouth';mouth.position.fromArray(metadata[species].mouth);
  const aperture=new T.Mesh(new T.SphereGeometry(.012,14,10),new T.MeshStandardMaterial({color:'#25221c',roughness:.6}));aperture.scale.set(.25,1,1);mouth.add(aperture);group.add(mouth);
  group.userData.model='Blender 5.2 photographic reference study';group.userData.species=species;
  templates.set(species,group);
 }));
 return templates;
}
