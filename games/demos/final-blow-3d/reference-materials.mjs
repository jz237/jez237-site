// Fine fabric relief in bind-space metres; fades below pixel resolution.
// Original colour, normal maps and silhouette remain the source of large detail.
export function referenceMaterial(material, character) {
  material.normalScale?.set(.85, .85);
  material.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 fabricPoint;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nfabricPoint = position;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 fabricPoint;
      float threadWave(float phase) {
        float footprint = fwidth(phase);
        return sin(phase) * (1.0 - smoothstep(1.0, 3.0, footprint));
      }
      vec3 reliefNormal(vec3 n, float height) {
        vec3 dx = dFdx(-vViewPosition), dy = dFdy(-vViewPosition);
        vec3 r1 = cross(dy, n), r2 = cross(n, dx);
        float determinant = dot(dx, r1);
        return normalize(abs(determinant) * n - sign(determinant) *
          (dFdx(height) * r1 + dFdy(height) * r2));
      }
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      float blueFabric = smoothstep(1.2, 1.8, diffuseColor.b / max(diffuseColor.r, .001));
      float neutralFabric = 1.0 - smoothstep(.035, .09, max(max(diffuseColor.r, diffuseColor.g), diffuseColor.b));
      float torso = smoothstep(.92, 1.02, fabricPoint.y) * (1.0 - smoothstep(1.48, 1.57, fabricPoint.y))
        * (1.0 - smoothstep(.30, .42, abs(fabricPoint.x)));
      float trousers = smoothstep(.17, .23, fabricPoint.y) * (1.0 - smoothstep(.91, 1.0, fabricPoint.y));
      float fabricMask = ${character === 'jez' ? 'blueFabric' : 'max(neutralFabric * torso, trousers)'};
      float warp = threadWave(fabricPoint.x * 4800.0);
      float weft = threadWave((fabricPoint.y + fabricPoint.z * .3) * 4800.0);
      float twill = threadWave((fabricPoint.x + fabricPoint.y + fabricPoint.z * .3) * 4200.0);
      float knit = threadWave(fabricPoint.x * 2800.0 + sin(fabricPoint.y * 2200.0))
        * threadWave(fabricPoint.y * 2200.0);
      float fabricHeight = ${character === 'jez' ? '.00010 * (warp * .55 + weft * .45)' : '.000075 * mix(twill, knit, torso)'};
      normal = reliefNormal(normal, fabricHeight * fabricMask);
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
      float blueCloth = smoothstep(1.15, 1.65, diffuseColor.b / max(diffuseColor.r, .001));
      float darkCloth = 1.0 - smoothstep(.05, .14, max(max(diffuseColor.r, diffuseColor.g), diffuseColor.b));
      roughnessFactor = mix(roughnessFactor, max(roughnessFactor, .78), max(blueCloth, darkCloth));
    `);
  };
  material.customProgramCacheKey = () => `reference-fabric-1-${character}`;
}
