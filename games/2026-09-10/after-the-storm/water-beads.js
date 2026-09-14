import {stepBeads} from './bead-motion.js';
// Each craft owns uniforms and cloned finish materials. Shared Blender assets
// must never let the wetness of the last rendered racer affect every rider.
const finishes=new Set(['Pearl ceramic','Rider livery','Graphite composite','Carbon fibre','Helmet shell','Helmet graphic','Goggle lens','Lens']);
const shader=`uniform float beadWet,beadFlow,beadSpeed,beadVisor;varying vec3 beadPosition;
float beadHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 beadUV(){return mix(beadPosition.xz,beadPosition.xy,beadVisor);}
float beadShape(vec2 uv){
 vec2 q=uv*38.;q.y+=beadFlow*(1.+beadVisor*.6);vec2 cell=floor(q),f=fract(q)-.5;
 float seed=beadHash(cell),stretch=1.+min(2.,beadSpeed*.035)*step(.58,seed);
 f-=vec2(beadHash(cell+7.)-.5,beadHash(cell-4.)-.5)*.36;
 float r2=dot(f/vec2(.14, .14*stretch),f/vec2(.14,.14*stretch));
 return pow(max(0.,1.-r2),2.)*smoothstep(seed,seed+.13,beadWet);
}
`;
export function makeCraftBeads(root){
 const s={wet:0,flow:0,landing:0,speed:0},uniforms={beadWet:{value:0},beadFlow:{value:0},beadSpeed:{value:0}},seen=new WeakSet(),copies=new Map();let scans=0;
 function install(){root.traverse(o=>{if(!o.isMesh||seen.has(o))return;seen.add(o);if(!finishes.has(o.material?.name))return;const original=o.material;
  if(!copies.has(original)){const m=original.clone(),prior=original.onBeforeCompile,key=original.customProgramCacheKey();
   m.onBeforeCompile=shaderObject=>{prior.call(m,shaderObject);Object.assign(shaderObject.uniforms,uniforms,{beadVisor:{value:/lens/i.test(m.name)?1:0}});
    shaderObject.vertexShader=shaderObject.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 beadPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nbeadPosition=position;');
    shaderObject.fragmentShader=shaderObject.fragmentShader.replace('#include <common>','#include <common>\n'+shader).replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
     vec2 dropUV=beadUV();float drop=beadShape(dropUV);
     float wetFilm=beadWet*(.35+.65*beadHash(floor(dropUV*9.)));
     roughnessFactor=mix(roughnessFactor,max(.075,roughnessFactor*.42),wetFilm);
     roughnessFactor=mix(roughnessFactor,.055,drop);`).replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
     // Derivative tangent frame keeps millimetre domes attached to the finish.
     vec3 dpX=dFdx(-vViewPosition),dpY=dFdy(-vViewPosition);
     vec2 duX=dFdx(dropUV),duY=dFdy(dropUV);
     vec3 R1=cross(dpY,normal),R2=cross(normal,dpX);
     float det=dot(dpX,R1),eps=.0003;
     vec2 slope=vec2(beadShape(dropUV+vec2(eps,0.))-drop,beadShape(dropUV+vec2(0.,eps))-drop)*(.0007/eps);
     vec3 grad=sign(det)*(dot(slope,duX)*R1+dot(slope,duY)*R2);
     normal=normalize(abs(det)*normal-grad+normal*1.e-12);`);
   };m.onBeforeCompile.cloudPatch=!!prior.cloudPatch;m.customProgramCacheKey=()=>key+'-beads-2';copies.set(original,m);
  }o.material=copies.get(original);
 });}
 return {state:s,update(r,storm,dt,recorded){if(scans++%30===0)install();if(recorded)Object.assign(s,recorded);else stepBeads(s,r,storm,dt);uniforms.beadWet.value=s.wet;uniforms.beadFlow.value=s.flow;uniforms.beadSpeed.value=s.speed;},reset(){Object.assign(s,{wet:0,flow:0,landing:0,speed:0});},get count(){return copies.size;}};
}
