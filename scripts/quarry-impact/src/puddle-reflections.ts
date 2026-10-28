import * as T from 'three';
import {SOFT_OCCLUSION,SOFT_UNIFORMS,makeSoft,softUniforms} from './soft-particles';
/** Puddles reflect what stands round them: the water is drawn after the scene (in the soft particle pass), and its
 * mirror finds the cliffs, cars and barriers in the finished picture by marching the reflected ray across the screen
 * against the scene's depth (PUDDLE_SSR.steps steps growing by PUDDLE_SSR.growth from PUDDLE_SSR.first m, out to
 * PUDDLE_SSR.reach m, then PUDDLE_SSR.refine halvings). Where the ray leaves the picture or finds nothing, the sky
 * reflection stays; the match fades out towards the screen's edges. Only puddle pixels pay for it. */
export const PUDDLE_SSR={steps:24,first:.25,growth:1.32,reach:140,refine:5,thickness:[.6,.45],edge:.08} as const;
const MARCH=`
vec4 puddleMirror(vec3 origin,vec3 ray){
 if(softOn<.5||ray.z>.35)return vec4(0.);
 float t=${PUDDLE_SSR.first.toFixed(3)},last=0.;vec2 uv=vec2(0.);
 for(int i=0;i<${PUDDLE_SSR.steps};i++){
  vec3 q=origin+ray*t;vec4 clip=projectionMatrix*vec4(q,1.);if(clip.w<=0.)break;uv=clip.xy/clip.w*.5+.5;
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)break;
  float scene=-perspectiveDepthToViewZ(texture2D(sceneDepth,uv).x,cameraNear,cameraFar),depth=-q.z;
  if(depth>scene&&depth-scene<${PUDDLE_SSR.thickness[0].toFixed(2)}+t*${PUDDLE_SSR.thickness[1].toFixed(2)}){
   float lo=last,hi=t;
   for(int j=0;j<${PUDDLE_SSR.refine};j++){float mid=(lo+hi)*.5;vec3 m=origin+ray*mid;vec4 c=projectionMatrix*vec4(m,1.);vec2 u=c.xy/c.w*.5+.5;
    if(-m.z>-perspectiveDepthToViewZ(texture2D(sceneDepth,u).x,cameraNear,cameraFar)){hi=mid;uv=u;}else lo=mid;}
   vec2 border=min(uv,1.-uv);float fade=smoothstep(0.,${PUDDLE_SSR.edge.toFixed(2)},min(border.x,border.y))*(1.-smoothstep(${(PUDDLE_SSR.reach*.6).toFixed(1)},${PUDDLE_SSR.reach.toFixed(1)},t));
   return vec4(texture2D(sceneColor,uv).rgb,fade);
  }
  last=t;t*=${PUDDLE_SSR.growth.toFixed(3)};if(t>${PUDDLE_SSR.reach.toFixed(1)})break;
 }
 return vec4(0.);
}`;
/** Make a puddle water material reflect the picture (and hide behind what stands in front of it by hand). */
export function reflectivePuddles(material:T.MeshPhysicalMaterial){
  const compile=material.onBeforeCompile,key=material.customProgramCacheKey===T.Material.prototype.customProgramCacheKey?()=>compile.toString():material.customProgramCacheKey.bind(material);
  material.onBeforeCompile=function(shader,renderer){compile.call(this,shader,renderer);Object.assign(shader.uniforms,softUniforms);
    // After the shader's own depth helpers (packing), which the march and the hand depth test use.
    shader.fragmentShader=shader.fragmentShader
      .replace('#include <packing>','#include <packing>\n'+SOFT_UNIFORMS.replace('#include <packing>\n','')+'\nuniform mat4 projectionMatrix;\n'+SOFT_OCCLUSION+'\n'+MARCH)
      .replace('void main() {','void main() {\n\tif(softOccluded())discard;')
      .replace('#include <lights_fragment_maps>',`#include <lights_fragment_maps>
{vec4 mirror=puddleMirror(-vViewPosition,reflect(normalize(-vViewPosition),normal));radiance=mix(radiance,mirror.rgb,mirror.a);}`);};
  material.customProgramCacheKey=()=>key()+'|puddle-mirror';material.needsUpdate=true;return material;
}
/** A puddle's water drawn in the soft pass (on its layer). */
export const softPuddle=<O extends T.Object3D>(o:O)=>makeSoft(o);
