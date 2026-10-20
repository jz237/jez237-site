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
/** Tangent-space normals for small imbricate scales, laid out over the whole
 * reference plate at half resolution: offset rows of scales whose free rear
 * margin (toward the tail, -u) stands above the scale behind it. Relief fades
 * out ahead of headX (plate px), so a scaleless head stays smooth. */
function scaleNormalMap(plateW:number,plateH:number,scalePx:number,headX:[number,number]){
 const w=Math.round(plateW/2),h=Math.round(plateH/2),s=scalePx/2,height=new Float32Array(w*h);
 for(let y=0;y<h;y++){
  const row=Math.floor(y/s);
  for(let x=0;x<w;x++){
   let top=0;
   for(let r=row-1;r<=row+1;r++){
    const shift=(r&1)*.5,col=Math.floor(x/s-shift);
    for(let c=col-1;c<=col+1;c++){
     const dx=(x-(c+.5+shift)*s)/(s*.66),dy=(y-(r+.5)*s)/(s*.58),q=Math.hypot(dx,dy);
     if(q<1)top=Math.max(top,(1-q*q)*(.55-.45*dx));
    }
   }
   const px=x*2,fade=1-Math.min(1,Math.max(0,(px-headX[0])/(headX[1]-headX[0])));
   height[y*w+x]=top*fade*fade*(3-2*fade);
  }
 }
 const data=new Uint8Array(w*h*4),at=(i:number,j:number)=>height[Math.min(h-1,Math.max(0,j))*w+Math.min(w-1,Math.max(0,i))];
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  // glTF textures keep the plate's top-down rows (flipY false), so +v runs down
  // the plate and the slopes follow the derivative tangent frame directly.
  const nx=-(at(x+1,y)-at(x-1,y))*2.2,ny=-(at(x,y+1)-at(x,y-1))*2.2,l=Math.hypot(nx,ny,1),k=(y*w+x)*4;
  data[k]=Math.round((nx/l*.5+.5)*255);data[k+1]=Math.round((ny/l*.5+.5)*255);data[k+2]=Math.round((1/l*.5+.5)*255);data[k+3]=255;
 }
 const tex=new T.DataTexture(data,w,h);tex.flipY=false;
 tex.magFilter=T.LinearFilter;tex.minFilter=T.LinearMipmapLinearFilter;tex.generateMipmaps=true;tex.anisotropy=8;tex.needsUpdate=true;
 return tex;
}
let scaleNormals:T.DataTexture|undefined;
/** A seamless tile of the same imbricate scales (cells x cells per tile), for
 * species scaled all over; each use gets its own repeat. */
function scaleNormalTile(cells:number){
 const n=256,s=n/cells,height=new Float32Array(n*n),wrap=(d:number)=>((d%n)+n*1.5)%n-n/2;
 // Living scales are not a lattice: jitter each scale's centre, size and relief
 // (deterministic, so every load matches) to read as an organic reticulation.
 let seed=7;const rand=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
 const jitter=Array.from({length:cells*cells},()=>[(rand()-.5)*.36,(rand()-.5)*.3,.82+rand()*.3,.7+rand()*.5]);
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  let top=0;
  for(let r=0;r<cells;r++)for(let c=0;c<cells;c++){
   const [jx,jy,size,relief]=jitter[r*cells+c];
   const dx=wrap(x-(c+.5+(r&1)*.5+jx)*s)/(s*.66*size),dy=wrap(y-(r+.5+jy)*s)/(s*.58*size),q=Math.hypot(dx,dy);
   if(q<1)top=Math.max(top,(1-q*q)*(.55-.45*dx)*relief);
  }
  height[y*n+x]=top;
 }
 const data=new Uint8Array(n*n*4),at=(i:number,j:number)=>height[((j+n)%n)*n+(i+n)%n];
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const nx=-(at(x+1,y)-at(x-1,y))*2.2,ny=-(at(x,y+1)-at(x,y-1))*2.2,l=Math.hypot(nx,ny,1),k=(y*n+x)*4;
  data[k]=Math.round((nx/l*.5+.5)*255);data[k+1]=Math.round((ny/l*.5+.5)*255);data[k+2]=Math.round((1/l*.5+.5)*255);data[k+3]=255;
 }
 const tex=new T.DataTexture(data,n,n);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.flipY=false;
 tex.magFilter=T.LinearFilter;tex.minFilter=T.LinearMipmapLinearFilter;tex.generateMipmaps=true;tex.anisotropy=8;tex.needsUpdate=true;
 return tex;
}
/** The established display population. The page adds the black tang. */
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
   if(species==='cinctus'){
    if(label.startsWith('eye')){
     // A wet, glossy goby eye: a sharp highlight over the black pupil and
     // golden iris, with the plate's own fleshy yellow rim around it.
     material.color.setScalar(1);material.roughness=.1;material.clearcoat=1;material.clearcoatRoughness=.03;material.envMapIntensity=.6;
    }else if((label==='body'||label.startsWith('gill'))&&material.map){
     // Fine overlapping scales in relief, sized to the plate (about 30 px each).
     const {width,height}=material.map.image as {width:number;height:number};
     material.normalMap=scaleNormals??=scaleNormalMap(width,height,30,[1690,1790]);material.normalScale.set(.55,.55);material.roughness=.5;
    }
   }
   if(species==='strigosus'&&label.startsWith('eye')){
    // A wet eye whose golden ring catches the light.
    material.color.setScalar(1.15);material.roughness=.12;material.clearcoat=.5;material.clearcoatRoughness=.05;material.envMapIntensity=.28;
   }
   if(species==='strigosus'&&!label.startsWith('eye')){
    // Brown skin under blue reef light reads near black; lift it so the fine
    // iridescent lines and dots carry, with relief from the plate's own scales.
    // The plates are saturated at preparation (--saturation); a thin, deep-blue
    // sheen adds iridescence, and a softer reflection keeps the gray haze of
    // the water's light off the brown; a slightly warm lift keeps the brown
    // from turning lavender under the blue-white light.
    const skin=label==='body'||label.startsWith('gill');
    if(skin)material.color.setRGB(1.6,1.42,1.36);else material.color.setScalar(1.25);material.roughness=skin?.48:.55;
    if(skin&&material.map){material.bumpMap=material.map;material.bumpScale=1.1;material.sheen=.12;material.sheenRoughness=.35;material.sheenColor.set('#3f63ff');material.envMapIntensity=.14;material.specularIntensity=.7;}
   }
   if(species==='rostratum'&&label.startsWith('eye')){
    // A wet, rounded dark eye with a crisp highlight (a soft coat, not chrome).
    material.color.setScalar(1);material.roughness=.12;material.clearcoat=.55;material.clearcoatRoughness=.05;material.envMapIntensity=.28;
   }
   if(species==='rostratum'&&!label.startsWith('eye')){
    // A near-black plate needs more reflected light for its scales and rays to
    // read. Fine imbricate scales in relief (about 11 plate px each, the whole
    // body including the head) and a soft velvet sheen, kept low so the back
    // stays dark from above; no extra texture is downloaded.
    const skin=label==='body'||label.startsWith('gill');
    material.color.setScalar(skin?1.3:1.3);material.roughness=skin?.5:.56;
    if(skin&&material.map){
     const {width,height}=material.map.image as {width:number;height:number},tile=scaleNormalTile(16);
     tile.repeat.set(width/(16*11),height/(16*11));material.normalMap=tile;material.normalScale.set(.16,.16);
     material.sheen=.3;material.sheenRoughness=.4;material.sheenColor.set('#433d37');
    }
   }
   if(species==='vulpinus'){
    if(label.startsWith('eye')){
     // The same wet, rounded eye as the black tang: a crisp highlight over the
     // dark iris and its copper pupil ring.
     material.color.setScalar(1);material.roughness=.12;material.clearcoat=.55;material.clearcoatRoughness=.05;material.envMapIntensity=.28;
    }else if(label==='body'||label.startsWith('gill')){
     // Minute rabbitfish scales (about 7 plate px) give the velvety skin of the
     // living fish a fine relief, kept shallow on the bright yellow, with a
     // faint warm sheen.
     if(material.map){
      const {width,height}=material.map.image as {width:number;height:number},tile=scaleNormalTile(16);
      tile.repeat.set(width/(16*7),height/(16*7));material.normalMap=tile;material.normalScale.set(.06,.06);
      material.roughness=.55;material.sheen=.2;material.sheenRoughness=.45;material.sheenColor.set('#4d4630');
     }
    }
   }
   if(label.startsWith('fin')&&(species==='vulpinus'||species==='bispinosa'||species==='loricula'||species==='strigosus')){
    // Unpaired fins centred in the peduncle (finDepth 0): at the export's 0.9
    // opacity the dark water dimmed the tail fin against the body and left a
    // seam where they meet. They still draw after the body, as before.
    material.opacity=1;
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
