import * as T from 'three';
export const inspectionWindows = {value:0};
// Cylinders 1 and 3, leaving cylinders 5 and 7 assembled on the near bank.
export const inInspectionWindow=(z:number)=>Math.abs(z-2.09)<.57||Math.abs(z-.79)<.57;
export function windowClipping(material:T.Material,cap=false) {
  const previous=material.onBeforeCompile;
  material.onBeforeCompile=(shader,renderer)=>{
    previous.call(material,shader,renderer);
    shader.uniforms.inspectionWindows=inspectionWindows;
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying float inspectionZ;').replace('#include <project_vertex>','inspectionZ=(modelMatrix*vec4(transformed,1.0)).z;\n#include <project_vertex>');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying float inspectionZ; uniform float inspectionWindows;');
    const inside='(abs(inspectionZ-2.09)<0.57 || abs(inspectionZ-0.79)<0.57)';
    if(cap)shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`if(inspectionWindows>0.5 && !${inside}) discard;\n#include <clipping_planes_fragment>`);
    else shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`if(inspectionWindows<0.5 || ${inside}) {\n#include <clipping_planes_fragment>\n}`);
  };
  material.customProgramCacheKey=()=>`inspection-windows-${cap}`;
  material.needsUpdate=true;
}
