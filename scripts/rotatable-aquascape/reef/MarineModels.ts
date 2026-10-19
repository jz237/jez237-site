import * as T from 'three';
import {bodyEdge,finField} from './MarineFinFlex.ts';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import metadata from './assets/fish/model-info.json';
export type MarineSpecies='tang'|'rostratum'|'semilarvatus'|'clown'|'anthias'|'chromis'|'gramma'|'goby'|'strigosus'|'vulpinus'|'bispinosa'|'loricula'|'hexataenia'|'cinctus';
const urls:Record<MarineSpecies,string>={
 tang:new URL('./assets/fish/tang.glb',import.meta.url).href,
 rostratum:new URL('./assets/fish/rostratum.glb',import.meta.url).href,
 semilarvatus:new URL('./assets/fish/semilarvatus.glb',import.meta.url).href,
 clown:new URL('./assets/fish/clown.glb',import.meta.url).href,
 anthias:new URL('./assets/fish/anthias.glb',import.meta.url).href,
 chromis:new URL('./assets/fish/chromis.glb',import.meta.url).href,
 gramma:new URL('./assets/fish/gramma.glb',import.meta.url).href,
 goby:new URL('./assets/fish/goby.glb',import.meta.url).href,
 strigosus:new URL('./assets/fish/strigosus.glb',import.meta.url).href,
 vulpinus:new URL('./assets/fish/vulpinus.glb',import.meta.url).href,
 bispinosa:new URL('./assets/fish/bispinosa.glb',import.meta.url).href,
 loricula:new URL('./assets/fish/loricula.glb',import.meta.url).href,
 hexataenia:new URL('./assets/fish/hexataenia.glb',import.meta.url).href,
 cinctus:new URL('./assets/fish/cinctus.glb',import.meta.url).href
};
/** Gallery options, downloaded only when a visitor first adds one. */
export const optionalMarineSpecies:MarineSpecies[]=['strigosus','vulpinus','bispinosa','loricula','hexataenia','cinctus'];
/** The established display population. The black tang is gallery-only for now. */
export const baseMarineSpecies:MarineSpecies[]=['tang','semilarvatus','clown','anthias','chromis','gramma','goby'];
/** Geometry and embedded textures are shared between inhabitants. Vertex waves,
 * fin pivots and respiration remain independent per animal at runtime. */
export async function loadMarineModels(species:MarineSpecies[]=baseMarineSpecies){
 const loader=new GLTFLoader(),templates=new Map<MarineSpecies,T.Group>();
 await Promise.all(species.map(async species=>{
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
   // The vivid aquarium coral beauty: keep its orange luminous under blue light.
   if((species==='bispinosa'||species==='cinctus')&&!label.startsWith('eye'))material.color.setScalar(1.05);
   if(species==='strigosus'&&!label.startsWith('eye')){
    // Brown skin under blue reef light reads near black; lift it so the fine
    // iridescent lines and dots carry, with relief from the plate's own scales.
    const skin=label==='body'||label.startsWith('gill');
    material.color.setScalar(skin?1.45:1.25);material.roughness=skin?.48:.55;
    if(skin&&material.map){material.bumpMap=material.map;material.bumpScale=1.1;material.sheen=.35;material.sheenRoughness=.35;material.sheenColor.set('#6f86d8');}
   }
   if(species==='rostratum'&&!label.startsWith('eye')){
    // A near-black plate needs more reflected light for its scales and rays to
    // read. Velvet sheen and relief from the plate's own scale pattern stand in
    // for the soft skin of the living fish; no extra texture is downloaded.
    const skin=label==='body'||label.startsWith('gill');
    material.color.setScalar(skin?1.5:1.3);material.roughness=skin?.52:.56;
    if(skin&&material.map){material.bumpMap=material.map;material.bumpScale=1.4;material.sheen=.55;material.sheenRoughness=.45;material.sheenColor.set('#5b544c');}
   }
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
   const p=node.geometry.getAttribute('position'),flex=new Float32Array(p.count),gradient=new Float32Array(p.count*3),height=new Float32Array(p.count),profile=metadata[species];
   for(let i=0;i<p.count;i++){const [f,dx,dy,dz]=finField(profile,p.getX(i),p.getY(i),p.getZ(i),Boolean(node.userData.pectoral));flex[i]=f;gradient[i*3]=dx;gradient[i*3+1]=dy;gradient[i*3+2]=dz;
    // Signed membrane height beyond the dorsal or ventral body edge. Median
    // fins fold toward their insertion by this amount; tail and paired fins do not.
    const x=p.getX(i),y=p.getY(i);if(!node.userData.pectoral&&x>=-.5)height[i]=Math.max(0,y-bodyEdge(profile.upper,x))+Math.min(0,y-bodyEdge(profile.lower,x));}
   node.geometry.setAttribute('finFlex',new T.BufferAttribute(flex,1));node.geometry.setAttribute('finGradient',new T.BufferAttribute(gradient,3));node.geometry.setAttribute('finHeight',new T.BufferAttribute(height,1));
  });
  const mouth=new T.Group();mouth.name='mouth';mouth.position.fromArray(metadata[species].mouth);
  // The mouth group marks the bite target; lips and cavity now belong to the body.
  group.add(mouth);
  group.userData.model='Blender 5.2 photographic reference study';group.userData.species=species;
  templates.set(species,group);
 }));
 return templates;
}
