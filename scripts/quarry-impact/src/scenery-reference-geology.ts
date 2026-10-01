import {quarryGeology} from './scenery-geology-material';
/** A distinct face palette and metre-scale fracture read for the arena walls.
 * The licensed photograph channels retain registered coordinates. */
export function referenceQuarryGeology(){
 const material=quarryGeology(),compile=material.onBeforeCompile;
 material.name='Reference quarry exposed strata';material.color.setHex(0xf1eee6);
 material.vertexColors=false;material.normalScale.setScalar(.82);
 material.onBeforeCompile=(shader,renderer)=>{
  compile.call(material,shader,renderer);
  shader.fragmentShader=shader.fragmentShader
   .replaceAll('/2.7','/4.3')
   .replace("geologyPosition.y*.013,0.0)))*.22","geologyPosition.y*.013,0.0)))*.52")
   .replace('geologyFace*.92','mix(geologyFace,vec3(dot(geologyFace,vec3(.2126,.7152,.0722))),.42)*1.02')
   .replace('geologyOld*vec3(.65,.48,.34)','geologyOld*vec3(.72,.73,.74)');
 };
 material.customProgramCacheKey=()=> 'reference-quarry-geology-v2';
 return material;
}
