import * as T from 'three';

// Body-space shading survives dents and detached parts without swimming UVs.
// Damage is separate from base color: exposed alloy reflects as metal while
// dusty paint gets rougher and loses its clearcoat highlights.
export function finishPaint(material: T.MeshPhysicalMaterial, contactWear = false) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec2 impactWear; varying vec3 vBodyPosition; varying vec2 vImpactWear;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBodyPosition = position; vImpactWear = impactWear;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec3 vBodyPosition; varying vec2 vImpactWear;
float bodyNoise(vec3 p) { return fract(sin(dot(floor(p),vec3(127.1,311.7,74.7)))*43758.5453); }
// Interpolate deposited dust across cell boundaries; unfiltered floor noise
// makes the lower body look like a coarse checkerboard at chase distance.
float bodySilt(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(
    mix(mix(bodyNoise(i),bodyNoise(i+vec3(1.,0.,0.)),f.x),
        mix(bodyNoise(i+vec3(0.,1.,0.)),bodyNoise(i+vec3(1.,1.,0.)),f.x),f.y),
    mix(mix(bodyNoise(i+vec3(0.,0.,1.)),bodyNoise(i+vec3(1.,0.,1.)),f.x),
        mix(bodyNoise(i+vec3(0.,1.,1.)),bodyNoise(i+vec3(1.,1.,1.)),f.x),f.y),f.z);
}
`)
      .replace('#include <color_fragment>', `#include <color_fragment>
float grain=bodyNoise(vBodyPosition*340.);
float silt=bodySilt(vBodyPosition*36.);
float lowBody=1.-smoothstep(.3,1.05,vBodyPosition.y);
float dust=clamp(lowBody*(.18+silt*.16)+vImpactWear.x*.18,0.,.56);
float scratch=clamp(vImpactWear.x,0.,1.);
float scrapeLines=smoothstep(.75,.96,abs(sin(vBodyPosition.y*235.+vBodyPosition.z*29.+sin(vBodyPosition.x*12.))));
float bareMetal=clamp(vImpactWear.y,0.,1.)*max(scrapeLines,smoothstep(.65,.92,grain)*.65);
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.19,.16,.12),dust);
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.22,.24,.24),bareMetal*.9);
diffuseColor.rgb*=1.-scratch*.15;
`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor=clamp(mix(roughnessFactor,.88,dust)+scratch*.35+grain*.016,.04,.98);
roughnessFactor=mix(roughnessFactor,.43,bareMetal);
`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>
metalnessFactor=mix(metalnessFactor,.02,dust);
metalnessFactor=mix(metalnessFactor,.95,bareMetal);
`);
    if (contactWear) {
      shader.vertexShader=shader.vertexShader
        .replace('attribute vec2 impactWear;', 'attribute vec2 impactWear; attribute vec3 restPosition; attribute vec3 impactAxis; varying vec3 vImpactAxis;')
        .replace('vBodyPosition = position;', 'vBodyPosition = restPosition; vImpactAxis = impactAxis;');
      shader.fragmentShader=shader.fragmentShader
        .replace('varying vec3 vBodyPosition;', 'varying vec3 vImpactAxis; varying vec3 vBodyPosition;')
        .replace('float grain=bodyNoise(vBodyPosition*340.);', 'float grain=mix(bodyNoise(vBodyPosition*340.),.5,clamp(length(fwidth(vBodyPosition))*340.,0.,1.));')
        .replace('float scrapeLines=smoothstep(.75,.96,abs(sin(vBodyPosition.y*235.+vBodyPosition.z*29.+sin(vBodyPosition.x*12.))));', `
float across=dot(vBodyPosition,vImpactAxis)*310.;
float alias=clamp(fwidth(across),0.,1.);
float scrapeLines=mix(smoothstep(.65,.92,abs(sin(across+bodySilt(vBodyPosition*21.)*2.))),.24,alias);`)
        .replace('#include <lights_physical_fragment>', '#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat *= 1.-clamp(bareMetal+scratch*.5+dust*.7,0.,1.);\n#endif');
    }
  };
  material.customProgramCacheKey = () => contactWear ? 'quarry-contact-paint-v1' : 'quarry-layered-paint-v3';
}

export type GlassState = { damage: { value: number }; impact: { value: T.Vector3 }; axes: { value: T.Vector3 }; };
export function finishGlass(material: T.MeshPhysicalMaterial, geometry: T.BufferGeometry): GlassState {
  geometry.computeBoundingBox();
  const size = geometry.boundingBox!.getSize(new T.Vector3());
  const state: GlassState = {
    damage: { value: 0 }, impact: { value: geometry.boundingBox!.getCenter(new T.Vector3()) },
    axes: { value: new T.Vector3(size.x < size.z ? 0 : 1, size.x < size.z || size.y > size.z ? 1 : 0, 0) },
  };
  material.userData.glassState = state;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.glassDamage = state.damage;
    shader.uniforms.glassImpact = state.impact;
    shader.uniforms.glassAxes = state.axes;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGlassPosition;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGlassPosition=position;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGlassPosition; uniform float glassDamage; uniform vec3 glassImpact; uniform vec3 glassAxes;')
      .replace('#include <color_fragment>', `#include <color_fragment>
vec3 d=vGlassPosition-glassImpact;
vec2 p=vec2(mix(d.z,d.x,glassAxes.x),mix(d.y,d.z,1.-glassAxes.y));
float radius=length(p); float angle=atan(p.y,p.x);
float branches=abs(sin(angle*10.5+sin(radius*19.)*.22));
float rings=abs(sin(radius*71.+sin(angle*9.)*.6));
float crack=(1.-smoothstep(.018,.052,branches))*(1.-smoothstep(.12,.86,radius));
crack=max(crack,(1.-smoothstep(.018,.065,rings))*.52*(1.-smoothstep(.04,.34,radius)));
crack*=smoothstep(0.,.16,glassDamage);
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.66,.75,.75),crack);
diffuseColor.a=clamp(diffuseColor.a+crack*.6+glassDamage*.1,0.,.94);
`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+crack*.72+glassDamage*.1,0.,1.);');
  };
  material.customProgramCacheKey = () => 'quarry-laminated-glass-v2';
  return state;
}
