import * as T from 'three';
/** Dry ground: soil, gravel, rock and old asphalt are rough and dusty, and hardly shine. The standard shading gives every
 * surface a glassy sheen of the sky at grazing angles, which washes a sunlit floor out to near white in the chase camera's
 * view. Large rough surfaces of a venue (at least GROUND.area m² across the ground, not metal, not see-through, not
 * glossy) reflect GROUND.specular of that; in the rain (setGroundWet) the wet ground keeps its full shine. Applied once
 * to a venue as it is built, before its shaders are compiled. */
export const GROUND={specular:.3,area:300,metal:.05,rough:.5} as const;
/** How much of its sheen dry ground keeps (one value shared by every dulled material). */
export const groundSheen={value:GROUND.specular as number};
/** Rain on the event: the ground is wet and shines in full; dry again: dulled. */
export function setGroundWet(wet:boolean){groundSheen.value=wet?1:GROUND.specular;}
/** Whether a material is dry ground (by its own settings; the mesh decides by size). */
export function isDryGround(m:T.Material):m is T.MeshStandardMaterial{
  const s=m as T.MeshStandardMaterial;
  return !!s.isMeshStandardMaterial&&!s.transparent&&s.metalness<=GROUND.metal&&s.roughness>=GROUND.rough;
}
/** How much ground a mesh covers (m², its box across x and z in its own scale). */
export function groundArea(mesh:T.Mesh){
  const g=mesh.geometry;if(!g)return 0;if(!g.boundingBox)g.computeBoundingBox();const b=g.boundingBox;if(!b||b.isEmpty())return 0;
  const s=mesh.getWorldScale(new T.Vector3());return Math.abs((b.max.x-b.min.x)*s.x*(b.max.z-b.min.z)*s.z);
}
const dulled=new WeakSet<T.Material>();
/** Dull the sheen of one material (it keeps its own shader edits; the change is part of its program key). */
export function dullSheen(m:T.MeshStandardMaterial){
  if(dulled.has(m))return false;dulled.add(m);
  // The default program key is the shader hook's source: keep the old hook's, or every wrapped material would share one.
  const compile=m.onBeforeCompile,key=m.customProgramCacheKey===T.Material.prototype.customProgramCacheKey?()=>compile.toString():m.customProgramCacheKey.bind(m);
  m.onBeforeCompile=function(shader,renderer){compile.call(this,shader,renderer);shader.uniforms.groundSheen=groundSheen;
    shader.fragmentShader='uniform float groundSheen;\n'+shader.fragmentShader.replace('#include <lights_physical_fragment>','#include <lights_physical_fragment>\nmaterial.specularColor*=groundSheen;material.specularF90*=groundSheen;');};
  m.customProgramCacheKey=()=>key()+'|dry-ground';
  m.needsUpdate=true;return true;
}
/** Dull every large stretch of dry ground under a root; returns how many materials changed. */
export function dullGround(root:T.Object3D){
  let n=0;
  root.traverse(o=>{const mesh=o as T.Mesh;if(!mesh.isMesh||(mesh as unknown as T.InstancedMesh).isInstancedMesh)return;
    const materials=([] as T.Material[]).concat(mesh.material);if(!materials.some(m=>isDryGround(m)&&!dulled.has(m)))return;
    if(groundArea(mesh)<GROUND.area)return;for(const m of materials)if(isDryGround(m)&&dullSheen(m))n++;});
  return n;
}
