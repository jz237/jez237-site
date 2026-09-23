import * as T from 'three';

/** Match the reef's own luminaire and clear-water color without changing the
 * freshwater renderer. Preserve its Fresnel, meniscus and full depth tracing. */
export function configureReefWater(water:T.Group){
 water.traverse(object=>{
  if(!(object instanceof T.Mesh)||!(object.material instanceof T.ShaderMaterial))return;
  const material=object.material;
  material.fragmentShader=material.fragmentShader
   .replace('(6.326-world.y)','(5.835-world.y)')
   .replace('4.375-aa.x,4.375+aa.x','4.675-aa.x,4.675+aa.x')
   .replace('float z=-.37+float(strip)*.2;', 'float z=-.4166667+float(strip)*.1666667;')
   .replace('.0525-aa.y,.0525+aa.y','.0833333-aa.y,.0833333+aa.y')
   .replace('vec3(.745,.947,.855)*3.3', 'vec3(.49,.68,1.)*3.3')
   .replace('reflection=attenuateWater(reflection,opticalDistance,illumination);',`vec3 transmission=exp(-opticalDistance*vec3(.038,.017,.007));
      reflection=reflection*transmission+vec3(.012,.047,.095)*(1.-transmission)*illumination;`)
   .replace('reflection*vec3(.96,1.,.97)+meniscus*vec3(.65,.84,.72)', 'reflection+meniscus*vec3(.47,.72,1.)');
  material.needsUpdate=true;
 });
}
