import * as T from 'three';
export const inspectionWindows = {value:0};
// Cylinders 1 and 3, leaving cylinders 5 and 7 assembled on the near bank.
export const inInspectionWindow=(z:number)=>Math.abs(z-2.09)<.57||Math.abs(z-.79)<.57;
export function windowClipping(material:T.Material,cap=false) {
  if(material.userData.inspectionClipping)return;
  material.userData.inspectionClipping=true;
  const previous=material.onBeforeCompile;
  const previousKey=material.customProgramCacheKey();
  material.onBeforeCompile=(shader,renderer)=>{
    previous.call(material,shader,renderer);
    shader.uniforms.inspectionWindows=inspectionWindows;
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying float inspectionZ;').replace('#include <project_vertex>','inspectionZ=(modelMatrix*vec4(transformed,1.0)).z;\n#include <project_vertex>');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying float inspectionZ; uniform float inspectionWindows;');
    const inside='(abs(inspectionZ-2.09)<0.57 || abs(inspectionZ-0.79)<0.57)';
    if(cap)shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`if(inspectionWindows>0.5 && !${inside}) discard;\n#include <clipping_planes_fragment>`);
    else shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`if(inspectionWindows<0.5 || ${inside}) {\n#include <clipping_planes_fragment>\n}`);
  };
  material.customProgramCacheKey=()=>`${previousKey}-inspection-windows-${cap}`;
  material.needsUpdate=true;
}

// Register by engine ownership, not by part name or material family. This also
// covers newly added fasteners, accessories and moving components.
export function sectionEngine(root:T.Object3D,plane:T.Plane) {
  const materials=new Set<T.Material>();
  root.traverse(object=>{
    if(object.userData.sectionHelper || !(object instanceof T.Mesh || object instanceof T.Points))return;
    for(const material of Array.isArray(object.material)?object.material:[object.material]) {
      materials.add(material);
      material.clippingPlanes=[plane];
      material.clipShadows=true;
      windowClipping(material);
    }
    if(object instanceof T.Mesh && object.castShadow){
      const depth=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,clippingPlanes:[plane],clipShadows:true});
      windowClipping(depth);
      object.customDepthMaterial=depth;
    }
  });
  return materials;
}
