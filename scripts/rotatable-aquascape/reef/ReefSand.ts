import * as T from 'three';
import {rubbleNodules} from './ReefRockMaterial.ts';

/** Aragonite sand at world scale: soft current ripples whose troughs fall into
 * a lavender-blue shade, a fine grain, and scattered coloured grit (coralline
 * fragments, shell and dark grains). Shader only; the bed's shape is unchanged. */
export function finishSandMaterial(material:T.MeshStandardMaterial){
 material.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 reefSandP;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nreefSandP=(modelMatrix*vec4(position,1.)).xyz;');
  shader.fragmentShader='varying vec3 reefSandP; uniform mat3 normalMatrix;\n'+rubbleNodules+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   vec2 sandXZ=reefSandP.xz;
   // Ripples run across the current, gently wandering, with uneven crests.
   float sandWarp=reefNodeField(vec3(sandXZ*.9,1.7))*2.2+reefNodeField(vec3(sandXZ*2.6,4.1))*.6;
   float sandPhase=dot(sandXZ,vec2(.32,.95))*15.+sandWarp*2.4;
   float sandRipple=sin(sandPhase)*(.55+.45*reefNodeField(vec3(sandXZ*1.3,8.)));
   float sandTrough=smoothstep(.15,-.85,sandRipple);
   // The grain is weighted by its fade; fully faded cells are not evaluated.
   float grainFade=reefDetailFade(vec3(sandXZ*95.,reefSandP.y*95.));
   vec3 grainTo=vec3(0.),grainId=vec3(0.);float grainF1=0.,grainF2=0.;
   if(grainFade>0.)reefNodules(vec3(sandXZ*95.,reefSandP.y*95.),grainF1,grainF2,grainTo,grainId);
   float grain=mix(.92,.78+.4*grainId.x-.22*smoothstep(.12,0.,grainF2-grainF1),grainFade);
   diffuseColor.rgb*=grain*mix(vec3(1.),vec3(.5,.55,.86),sandTrough*.8);
   // Coloured grit: pink and purple coralline, tan shell, dark grains.
   vec3 gritTo,gritId;float gritF1,gritF2;
   reefNodules(vec3(sandXZ*38.,reefSandP.y*38.+3.),gritF1,gritF2,gritTo,gritId);
   float grit=step(.8,gritId.z)*smoothstep(.4,.18,gritF1)*mix(.35,1.,reefDetailFade(vec3(sandXZ*38.,reefSandP.y*38.)));
   vec3 gritColor=gritId.x<.3?vec3(.78,.4,.6):gritId.x<.55?vec3(.5,.36,.72):gritId.x<.8?vec3(.8,.66,.5):vec3(.28,.27,.33);
   diffuseColor.rgb=mix(diffuseColor.rgb,gritColor,grit*.85);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
   // Ripple flanks tilt along the ripple direction; grains add a fine roughness.
   vec3 sandSlope=vec3(.32,0.,.95)*cos(sandPhase)*.55+vec3(grainTo.x,0.,grainTo.y)*.35*grainF1*grainFade;
   vec3 sandTilt=normalMatrix*sandSlope;
   normal=normalize(normal+sandTilt-normal*dot(sandTilt,normal));`);
 };
 material.customProgramCacheKey=()=>'reef-sand-ripples-grain-grit-v3';
 return material;
}
