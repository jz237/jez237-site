import * as T from 'three';

/** One aquarium shares unchanged PBR settings; breathing remains per geometry.
 * Close-up specimens get their own set so scene-specific lighting stays isolated. */
export function createTetraMaterials(texture:T.Texture){
  // A submerged wet surface has far less interface contrast than a metallic,
  // clear-coated object in air. Keep the painted scale detail and colored band.
  const skin=new T.MeshPhysicalMaterial({map:texture,color:0xd4dfd9,roughness:.49,metalness:0,ior:1.16,specularIntensity:.65,clearcoat:.06,clearcoatRoughness:.42,bumpMap:texture,bumpScale:.00065});
  skin.onBeforeCompile=s=>{
   s.vertexShader='attribute vec3 tetraRest; attribute float tetraBreath; varying vec3 tetraAnatomy; varying float tetraGill;\n'+s.vertexShader;
   s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntetraAnatomy=tetraRest; tetraGill=tetraBreath;');
   s.fragmentShader='varying vec3 tetraAnatomy; varying float tetraGill;\n'+s.fragmentShader;
   s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float coverLine=.335+.035*pow(clamp(abs(tetraAnatomy.y+.035)/.075,0.,1.),2.);
float seam=(1.-smoothstep(.002,.005,abs(tetraAnatomy.x-coverLine)))*smoothstep(.012,.024,abs(tetraAnatomy.z));
diffuseColor.rgb*=1.-seam*(.18+.28*tetraGill);
if(tetraAnatomy.x>.489)diffuseColor.rgb=vec3(.018,.009,.008);
`);
  };
  skin.customProgramCacheKey=()=> 'tetra-ventilation-shared-v2';
  const fin=new T.MeshPhysicalMaterial({map:texture,color:0xa5beb3,transparent:true,opacity:.27,alphaTest:.015,side:T.DoubleSide,depthWrite:false,roughness:.62,metalness:0,ior:1.12,specularIntensity:.5});
  const pectoral=fin.clone();pectoral.map=null;pectoral.color.set(0x819e91);pectoral.opacity=.18;pectoral.alphaTest=0;
  // Preserve the pigmented tissue where the red tail root meets its clear rays.
  fin.onBeforeCompile=shader=>{
   shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
float finPigment=smoothstep(1.2,2.,diffuseColor.r/(max(diffuseColor.g,diffuseColor.b)+.003))*smoothstep(.015,.06,diffuseColor.r);
diffuseColor.a*=mix(1.,3.15,finPigment);
`);
  };
  fin.customProgramCacheKey=()=> 'tetra-pigmented-fin-root-v1';
 return {skin,fin,pectoral,references:0};
}
export type TetraMaterials=ReturnType<typeof createTetraMaterials>;
