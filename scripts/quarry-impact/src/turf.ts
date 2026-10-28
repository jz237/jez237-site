import * as T from 'three';
/** Turf for venues' plain green: a flat colour on an island or apron reads as painted plastic. It takes the forest-floor
 * photograph the circuits use (projected from above at TURF.scale m, grey-ed and coloured by the material's own green),
 * with patchy clumps (darker, lusher) and dry streaks at metre and ten-metre scales. The photograph is shared by every
 * venue (loaded once, never disposed with a venue). */
export const TURF={scale:4.2,clumps:[.7,1.14],dry:[1.18,1.08,.7],saturation:.78,value:.8} as const;
let photo:T.Texture|null=null;
function turfPhoto(){
  if(photo)return photo;
  const load=(name:string,color:boolean)=>{const t=typeof document==='undefined'?new T.DataTexture(new Uint8Array(color?[150,150,150,255]:[128,128,255,255]),1,1):new T.TextureLoader().load((import.meta.env?.BASE_URL??'./')+'assets/'+name+'.jpg');
    t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;if(typeof document==='undefined')t.needsUpdate=true;return t;};
  return photo=load('forrest_ground_01_diff',true);
}
export function turf(material:T.MeshStandardMaterial){
  const p=turfPhoto(),compile=material.onBeforeCompile,key=material.customProgramCacheKey===T.Material.prototype.customProgramCacheKey?()=>compile.toString():material.customProgramCacheKey.bind(material);
  material.onBeforeCompile=function(shader,renderer){compile.call(this,shader,renderer);shader.uniforms.turfPhoto={value:p};
    shader.vertexShader='varying vec3 vTurf;\n'+shader.vertexShader.replace('#include <worldpos_vertex>',`#include <worldpos_vertex>
{vec4 turfAt=vec4(transformed,1.);
#ifdef USE_INSTANCING
turfAt=instanceMatrix*turfAt;
#endif
vTurf=(modelMatrix*turfAt).xyz;}`);
    shader.fragmentShader=`varying vec3 vTurf;uniform sampler2D turfPhoto;
float turfHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float turfNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(turfHash(i),turfHash(i+vec2(1,0)),f.x),mix(turfHash(i+vec2(0,1)),turfHash(i+1.),f.x),f.y);}
`+shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
{vec2 q=vTurf.xz;vec3 photo=texture2D(turfPhoto,q/${TURF.scale.toFixed(1)}).rgb;float luma=dot(photo,vec3(.2126,.7152,.0722));
 vec3 hue=diffuseColor.rgb/max(dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)),.03);
 float clump=turfNoise(q*.8)*.55+turfNoise(q*2.3+7.)*.45,dry=smoothstep(.55,.8,turfNoise(q*.07+3.)*.7+turfNoise(q*.23)*.3);
 vec3 grass=mix(vec3(luma),photo,.4)*hue*mix(${TURF.clumps[0].toFixed(2)},${TURF.clumps[1].toFixed(2)},clump);
 grass=mix(grass,grass*vec3(${TURF.dry.map(v=>v.toFixed(2)).join(',')}),dry);diffuseColor.rgb=mix(vec3(dot(grass,vec3(.2126,.7152,.0722))),grass,${TURF.saturation.toFixed(2)})*${TURF.value.toFixed(2)};}`);};
  material.customProgramCacheKey=()=>key()+'|turf';material.needsUpdate=true;return material;
}
