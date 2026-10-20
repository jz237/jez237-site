import * as T from 'three';
import {rippleHeightShader,rippleSlopeShader} from '../lib/WaterRipples.ts';

// Stronger reef circulation: keep displaced geometry and its analytic normal
// on the same wave field. Preserve the narrow glass-contact meniscus.
function reefRipples(shader:string){
 return shader.replaceAll('*.011','*.018').replaceAll('*.012','*.020').replaceAll('*.007','*.011');
}

/** Match the reef's own luminaire and clear-water color without changing the
 * freshwater renderer. Preserve its Fresnel, meniscus and full depth tracing. */
export function configureReefWater(water:T.Group){
 water.traverse(object=>{
  if(!(object instanceof T.Mesh)||!(object.material instanceof T.ShaderMaterial))return;
  const material=object.material;
  // The underside shows only while the camera is below the waterline, and then
  // everything in the tank lies in front of it. Draw it first among transparent
  // surfaces: drawn after the fish, it painted over their fins (which write no
  // depth) wherever they crossed it on screen, so tails vanished near the top.
  if(material.uniforms.underside?.value===1)object.renderOrder=-1;
  material.vertexShader=material.vertexShader.replace(rippleHeightShader,reefRipples(rippleHeightShader));
  material.fragmentShader=material.fragmentShader.replace(rippleSlopeShader,reefRipples(rippleSlopeShader))
   .replace('(6.326-world.y)','(5.835-world.y)')
   .replace('4.375-aa.x,4.375+aa.x','4.675-aa.x,4.675+aa.x')
   .replace('float z=-.37+float(strip)*.2;', 'float z=-.4166667+float(strip)*.1666667;')
   .replace('.0525-aa.y,.0525+aa.y','.0833333-aa.y,.0833333+aa.y')
   .replace('vec3(.745,.947,.855)*3.3', 'vec3(.49,.68,1.)*3.3')
   .replace('reflection=attenuateWater(reflection,opticalDistance,illumination);',`vec3 transmission=exp(-opticalDistance*vec3(.024,.014,.007));
      reflection=reflection*transmission+vec3(.022,.042,.11)*(1.-transmission)*illumination;`)
   .replace('reflection*vec3(.96,1.,.97)+meniscus*vec3(.65,.84,.72)', 'reflection*(underside>.5?.95:1.)+meniscus*vec3(.47,.72,1.)+reefSheen')
   // Seen from below, tilted ripple faces catch the lamps above: a bright,
   // shimmering band along the top of the tank, as in the reference photo.
   .replace('float meniscus=', 'vec3 reefSheen=underside>.5?illumination*(vec3(.02,.06,.22)+vec3(.3,.55,1.)*1.05*pow(smoothstep(.1,.32,length(rippleNormal.xz)),3.)):vec3(0.);float meniscus=');
  material.needsUpdate=true;
 });
}
