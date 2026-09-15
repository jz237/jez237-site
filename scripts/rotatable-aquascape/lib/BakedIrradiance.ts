import {assetURL} from './AssetPaths';
import * as T from 'three';
import {packIrradiance} from './BakedFieldPacking';

/** Static, single-bounce L1 irradiance field. Objects sample it at their current
 * position/normal, so animation and camera rotation remain genuinely three-dimensional.
 */
export async function applyBakedIrradiance(scene:T.Scene,illumination:{value:number},study=false){
 const [metadataResponse,dataResponse]=await Promise.all([fetch(assetURL('./lighting/diffuse-probes.json')),fetch(assetURL('./lighting/diffuse-probes.bin'))]);
 if(!metadataResponse.ok||!dataResponse.ok)throw Error('Indirect-light field could not be loaded');
 const metadata=await metadataResponse.json(),data=new Float32Array(await dataResponse.arrayBuffer());
 const [nx,ny,nz]=metadata.dimensions;
 if(metadata.version!==1||![nx,ny,nz].every(n=>Number.isInteger(n)&&n>1&&n<128)||data.length!==nx*ny*nz*16||!data.every(Number.isFinite))throw Error('Invalid indirect-light field');
 const texture=new T.Data3DTexture(packIrradiance(data,nx,ny,nz),nx*3,ny,nz);
 texture.type=T.HalfFloatType;texture.format=T.RGBAFormat;texture.minFilter=texture.magFilter=T.LinearFilter;texture.unpackAlignment=1;texture.needsUpdate=true;
 const strength={value:study?0:1},minimum=new T.Vector3().fromArray(metadata.minimum),span=new T.Vector3().fromArray(metadata.maximum).sub(minimum),dimensions=new T.Vector3(nx,ny,nz);
 const seen=new Set<T.Material>();
 scene.traverse(object=>{
  if(!(object instanceof T.Mesh))return;
  for(const material of Array.isArray(object.material)?object.material:[object.material]){
   if(!(material instanceof T.MeshStandardMaterial)||seen.has(material)||material.userData.skipWaterDepth||material instanceof T.MeshPhysicalMaterial&&material.transmission>0)continue;
   seen.add(material);const compile=material.onBeforeCompile,key=material.customProgramCacheKey();
   material.onBeforeCompile=(shader,renderer)=>{
    compile.call(material,shader,renderer);
    Object.assign(shader.uniforms,{bakedField:{value:texture},bakedMin:{value:minimum},bakedSpan:{value:span},bakedDimensions:{value:dimensions},bakedStrength:strength,bakedDaylight:illumination});
    shader.fragmentShader=`uniform highp sampler3D bakedField;
uniform vec3 bakedMin,bakedSpan,bakedDimensions;
uniform float bakedStrength,bakedDaylight;
vec3 indirectProbe(vec3 point,vec3 normal){
 vec3 uv=(clamp((point-bakedMin)/bakedSpan,0.,1.)*(bakedDimensions-1.)+.5)/bakedDimensions;
 vec4 red=texture(bakedField,vec3(uv.x/3.,uv.yz));
 vec4 green=texture(bakedField,vec3((uv.x+1.)/3.,uv.yz));
 vec4 blue=texture(bakedField,vec3((uv.x+2.)/3.,uv.yz));
 vec3 c0=vec3(red.x,green.x,blue.x),cx=vec3(red.y,green.y,blue.y);
 vec3 cy=vec3(red.z,green.z,blue.z),cz=vec3(red.w,green.w,blue.w);
 return max(vec3(0.),c0+cx*normal.x+cy*normal.y+cz*normal.z);
}
`+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_maps>',`#include <lights_fragment_maps>
#if defined(RE_IndirectDiffuse)
 vec3 probeWorld=cameraPosition-(vec4(vViewPosition,0.)*viewMatrix).xyz;
 if(abs(probeWorld.x)<5.1&&abs(probeWorld.z)<2.35&&probeWorld.y>.1&&probeWorld.y<5.36){
  vec3 probeNormal=inverseTransformDirection(geometryNormal,viewMatrix);
  irradiance+=indirectProbe(probeWorld,probeNormal)*bakedStrength*bakedDaylight;
 }
#endif
`);
   };
   material.customProgramCacheKey=()=>key+'-diffuse-probe-l1-rgb-v2';material.needsUpdate=true;
  }
 });
 if(study){const label=document.createElement('label'),toggle=document.createElement('input');toggle.type='checkbox';toggle.onchange=()=>strength.value=toggle.checked?1:0;label.append(toggle,' Bounced light comparison');Object.assign(label.style,{position:'fixed',top:'150px',left:'24px',zIndex:'100',padding:'12px',background:'#172224',color:'white'});document.body.appendChild(label);}
 return {strength,texture,metadata};
}
