// Shared look for falling water in the filter showrooms (Lab, Nov 11 2026): drops, drip threads and
// spray read as liquid instead of pale beads. A drop is clear where you look straight through it and
// bright at its edge, where it turns the studio light toward the eye. A look, not a fluid solution.
// Give it a MeshStandardMaterial or MeshPhysicalMaterial; it returns the same material.
export function liquify(material, {clear = .2, edge = .95, glow = .38} = {}) {
  material.transparent = true;
  material.depthWrite = false;
  const before = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    before?.call(material, shader, renderer);
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `{
      float hrEdge=pow(1.-abs(dot(normalize(normal),normalize(vViewPosition))),2.4);
      outgoingLight+=vec3(.74,.9,.92)*hrEdge*${glow.toFixed(3)};
      diffuseColor.a=mix(${clear.toFixed(3)},${edge.toFixed(3)},hrEdge);
    }
    #include <opaque_fragment>`);
  };
  const key = material.customProgramCacheKey?.bind(material);
  material.customProgramCacheKey = () => (key ? key() : '') + `|hr-liquid-1|${clear}|${edge}|${glow}`;
  material.needsUpdate = true;
  return material;
}
