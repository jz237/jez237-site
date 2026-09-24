import * as T from 'three';
import {finField} from './MarineFinFlex.ts';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import metadata from './assets/fish/model-info.json';
export type MarineSpecies='tang'|'yellow'|'clown'|'anthias'|'chromis'|'gramma'|'goby';
const urls={
 tang:new URL('./assets/fish/tang.glb',import.meta.url).href,
 yellow:new URL('./assets/fish/yellow.glb',import.meta.url).href,
 clown:new URL('./assets/fish/clown.glb',import.meta.url).href,
 anthias:new URL('./assets/fish/anthias.glb',import.meta.url).href,
 chromis:new URL('./assets/fish/chromis.glb',import.meta.url).href,
 gramma:new URL('./assets/fish/gramma.glb',import.meta.url).href,
 goby:new URL('./assets/fish/goby.glb',import.meta.url).href
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
   const material=(node.material as T.MeshPhysicalMaterial).clone();material.envMapIntensity=.24;
   material.userData.marineSourceMaterial=(node.material as T.Material).uuid;
   // Submerged tissue has a much smaller optical contrast than a varnished object
   // in air. Keep the source scale/iris detail without the broad clearcoat glare.
   material.metalness=0;material.clearcoat=0;material.ior=1.16;
   material.roughness=label.startsWith('eye')?.25:label==='body'||label.startsWith('gill')?.65:.60;
   // Reference photos already contain studio lighting; calibrate reflected color
   // to retain orange chroma under the aquarium's intense overhead illumination.
   material.color.setScalar(species==='anthias'?.40:.72);
   if(species==='anthias'&&!label.startsWith('eye'))material.color.setRGB(.68,.34,.17);
   if(material.map)material.map.anisotropy=8;
   const mesh=new T.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;
   if(label.startsWith('pectoral')||label.startsWith('pelvic')){
    const pivot=new T.Group();pivot.name='pectoral';pivot.position.setFromMatrixPosition(node.matrixWorld);
    geometry.translate(-pivot.position.x,-pivot.position.y,-pivot.position.z);mesh.name='fin';mesh.userData.pectoral=true;material.side=T.DoubleSide;material.depthWrite=false;
    pivot.userData.restZ=pivot.position.z;pivot.userData.pelvic=label.startsWith('pelvic');pivot.add(mesh);group.add(pivot);
   }else if(label.startsWith('eye')){mesh.name='eye';eyes.add(mesh);
   }else if(label.startsWith('gill')){
    // Pin the anterior insertion; only the trailing opercular margin opens.
    geometry.computeBoundingBox();const bounds=geometry.boundingBox!,pivot=new T.Group();
    pivot.name='gill';pivot.userData.side=label.endsWith('-1')?-1:1;
    pivot.position.set(bounds.max.x,(bounds.min.y+bounds.max.y)*.5,(bounds.min.z+bounds.max.z)*.5);
    pivot.userData.restZ=pivot.position.z;geometry.translate(-pivot.position.x,-pivot.position.y,-pivot.position.z);
    // The leading and upper/lower insertions stay attached. A uniform rigid
    // hinge lifted a rectangular patch off the cheek at large breathing poses.
    const positions=geometry.getAttribute('position'),rows=new Map<number,number[]>();
    for(let i=0;i<positions.count;i++){const y=Math.round(positions.getY(i)*1e5),x=positions.getX(i),row=rows.get(y);if(row){row[0]=Math.min(row[0],x);row[1]=Math.max(row[1],x);}else rows.set(y,[x,x]);}
    const height=bounds.max.y-bounds.min.y,flex=new Float32Array(positions.count),gradient=new Float32Array(positions.count*3);
    for(let i=0;i<positions.count;i++){
     const x=positions.getX(i),y=positions.getY(i),row=rows.get(Math.round(y*1e5))!,width=row[1]-row[0];
     const t=T.MathUtils.clamp((row[1]-x)/width,0,1),u=T.MathUtils.clamp((y+height*.5)/height,0,1),end=Math.sin(Math.PI*u),weight=t*t*(3-2*t);
     flex[i]=weight*end*end;
     gradient[i*3]=-6*t*(1-t)/width*end*end;
     gradient[i*3+1]=weight*2*end*Math.cos(Math.PI*u)*Math.PI/height;
    }
    geometry.setAttribute('gillFlex',new T.BufferAttribute(flex,1));geometry.setAttribute('gillGradient',new T.BufferAttribute(gradient,3));
    mesh.userData.side=pivot.userData.side;mesh.name='operculum';material.side=T.DoubleSide;pivot.add(mesh);group.add(pivot);
   }else {mesh.name=label==='body'?'body':'fin';if(mesh.name==='fin'){material.side=T.DoubleSide;material.depthWrite=false;}group.add(mesh);}
  });
  // Fin flex grows from a pinned insertion to a freely moving margin.
  group.traverse(node=>{if(!(node instanceof T.Mesh)||node.name!=='fin')return;
   const p=node.geometry.getAttribute('position'),flex=new Float32Array(p.count),gradient=new Float32Array(p.count*3);
   for(let i=0;i<p.count;i++){const [f,dx,dy,dz]=finField(metadata[species],p.getX(i),p.getY(i),p.getZ(i),Boolean(node.userData.pectoral));flex[i]=f;gradient[i*3]=dx;gradient[i*3+1]=dy;gradient[i*3+2]=dz;}
   node.geometry.setAttribute('finFlex',new T.BufferAttribute(flex,1));node.geometry.setAttribute('finGradient',new T.BufferAttribute(gradient,3));
  });
  const mouth=new T.Group();mouth.name='mouth';mouth.position.fromArray(metadata[species].mouth);
  // The mouth group marks the bite target; lips and cavity now belong to the body.
  group.add(mouth);
  group.userData.model='Blender 5.2 photographic reference study';group.userData.species=species;
  templates.set(species,group);
 }));
 return templates;
}
