import * as T from 'three';import {url} from './assets';
/** World-space texture detail on the far shore, retaining its authored mesh and tree layout. */
export function addReservoirShoreDetail(material:T.MeshStandardMaterial){
 const textures:T.Texture[]=[];
 const photo=(name:string)=>{const t=typeof document==='undefined'?new T.DataTexture(new Uint8Array([150,150,150,255]),1,1):new T.TextureLoader().load(url('assets/'+name+'.jpg'));t.name='reservoir-'+name;t.wrapS=t.wrapT=T.RepeatWrapping;t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;t.needsUpdate=true;textures.push(t);return t;};
 const rock=photo('geology_rock_diff'),soil=photo('forrest_ground_01_diff'),previousCompile=material.onBeforeCompile,previousKey=material.customProgramCacheKey;
 material.onBeforeCompile=(shader,renderer)=>{
  previousCompile.call(material,shader,renderer);shader.uniforms.reservoirRock={value:rock};shader.uniforms.reservoirSoil={value:soil};
  shader.vertexShader='varying vec3 reservoirWorld;varying vec3 reservoirNormal;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nreservoirWorld=(modelMatrix*vec4(transformed,1.0)).xyz;').replace('#include <defaultnormal_vertex>','#include <defaultnormal_vertex>\nreservoirNormal=inverseTransformDirection(transformedNormal,viewMatrix);');
  shader.fragmentShader=`varying vec3 reservoirWorld;varying vec3 reservoirNormal;
uniform sampler2D reservoirRock;uniform sampler2D reservoirSoil;
vec3 reservoirStone(vec3 p,vec3 w){return texture2D(reservoirRock,p.yz).rgb*w.x+texture2D(reservoirRock,p.xz).rgb*w.y+texture2D(reservoirRock,p.xy).rgb*w.z;}
`+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
vec3 shoreNormal=normalize(reservoirNormal),shoreWeights=pow(abs(shoreNormal),vec3(4.0));shoreWeights/=max(dot(shoreWeights,vec3(1.0)),.001);
vec3 shoreRock=mix(reservoirStone(reservoirWorld/9.0,shoreWeights),reservoirStone(reservoirWorld/23.0+vec3(.37,.19,.63),shoreWeights),.35);
vec3 shoreSoil=mix(texture2D(reservoirSoil,reservoirWorld.xz/8.0).rgb,texture2D(reservoirSoil,reservoirWorld.xz/21.0+vec2(.27,.61)).rgb,.35);
float shorePatch=.5+.5*sin(reservoirWorld.x*.027+sin(reservoirWorld.z*.041)*2.0)*sin(reservoirWorld.z*.019);
float shoreSlope=1.0-smoothstep(.66,.92,abs(shoreNormal.y));
float shoreExposed=max(shoreSlope,1.0-smoothstep(1.5,5.5+shorePatch*3.0,reservoirWorld.y));
vec3 shoreVegetation=diffuseColor.rgb*(.65+shoreSoil*.95)*(.87+shorePatch*.23);
vec3 shoreStoneColor=vec3(.43,.42,.34)*(.55+shoreRock*1.2);
float shoreWet=1.0-smoothstep(-.2,1.1,reservoirWorld.y);
diffuseColor.rgb=mix(shoreVegetation,shoreStoneColor,shoreExposed)*(1.0-shoreWet*.22);
`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(.96,.62,shoreWet);');
 };
 material.customProgramCacheKey=()=>previousKey.call(material)+'|reservoir-shore-detail-v1';material.needsUpdate=true;
 let disposed=false;return{textures,dispose(){if(disposed)return;disposed=true;textures.forEach(t=>t.dispose());material.onBeforeCompile=previousCompile;material.customProgramCacheKey=previousKey;material.needsUpdate=true;}};
}
