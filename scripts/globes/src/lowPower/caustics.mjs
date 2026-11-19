import * as T from 'three';
import { RIPPLE_HEIGHT, RIPPLE_SLOPE, RIPPLE_CURVATURE } from './ripples.mjs';
import { SURFACE_RADIUS, WATER_LEVEL } from './slosh.mjs';
import { GLASS_INNER } from '../render/scape/mesh.mjs';

// Project the existing height field along the refracted lamp rays. All receivers
// sample the same patch of water, with parallax from their depth below the film.
export function makeRippleLight(waves, bend, uvScale, lamp) {
  const toLiquid = { value: new T.Matrix4() }, lampSlope = { value: new T.Vector2() };
  const strength = { value: 1 }, direction = new T.Vector3(), target = new T.Vector3();
  const parameters = { waterWaves: waves, surfaceBend: bend, toLiquid, lampSlope, rippleLight: strength };

  function illuminate(material) {
    const previous = material.onBeforeCompile.bind(material);
    const key = material.customProgramCacheKey();
    material.customProgramCacheKey = () => key + '-ripple-light';
    material.onBeforeCompile = (shader, renderer) => {
      previous(shader, renderer);
      Object.assign(shader.uniforms, parameters);
      shader.vertexShader = 'uniform mat4 toLiquid; uniform vec2 lampSlope; varying vec3 vLightEntry;\n' +
        shader.vertexShader.replace('#include <logdepthbuf_vertex>', `
          // mvPosition includes the body wave and fin displacement. It stays in
          // physical view space even when the glass bends the displayed vertex.
          vec3 receiver = cameraPosition + mvPosition.xyz * mat3(viewMatrix);
          vec3 p = (toLiquid * vec4(receiver,1.)).xyz;
          float depth = ${WATER_LEVEL} - p.y;
          vLightEntry = vec3(p.xz + depth*lampSlope, depth);
          #include <logdepthbuf_vertex>`);
      shader.fragmentShader = `
        uniform sampler2D waterWaves;
        uniform float surfaceBend, rippleLight;
        uniform vec2 lampSlope;
        uniform mat4 toLiquid;
        varying vec3 vLightEntry;
        float focusedLight(vec3 viewNormal) {
          const float invR2 = ${1 / SURFACE_RADIUS ** 2};
          vec2 entry = vLightEntry.xy;
          float r2 = min(dot(entry,entry)*invR2,1.);
          vec4 wave = texture2D(waterWaves, .5 + entry*${uvScale});
          vec2 slope = (wave.rg*255.-128.) * ${RIPPLE_SLOPE / 127};
          slope += surfaceBend*(-8.+12.*r2)*entry*invR2;
          float rise = surfaceBend*(1.-r2)*(1.-3.*r2) + (wave.b*255.-128.)*${RIPPLE_HEIGHT / 127};
          float depth = max(0., vLightEntry.z + rise);
          // In water, a sloped patch deflects light by about (1 - 1/1.333)
          // times its slope. Backtrack once from the flat-film intersection.
          entry -= depth*.25*slope;
          float y = ${WATER_LEVEL} + rise;
          entry *= ${SURFACE_RADIUS} * inversesqrt(${GLASS_INNER**2} - y*y);
          r2 = dot(entry,entry)*invR2;
          float curvature = (texture2D(waterWaves,.5+entry*${uvScale}).a*255.-128.) * ${1 / (127 * RIPPLE_CURVATURE)};
          curvature += surfaceBend*(-16.+48.*min(r2,1.))*invR2;
          // Converging rays illuminate less area. Bound the peak for a lamp
          // with finite width, and feather the edge of the illuminated disk.
          float area = clamp(1. + .25*depth*curvature, .32, 2.6);
          // Even a broad, gently curved wave turns the lamp across a scale or
          // leaf. Compare the incident light on that facet before and after
          // refraction using the same ray deflection as the projected pattern.
          vec3 facet = mat3(toLiquid)*(viewNormal*mat3(viewMatrix));
          vec3 above = vec3(lampSlope.x,1.,lampSlope.y);
          float flatLight = dot(facet,normalize(above));
          float waveLight = dot(facet,normalize(above-.25*vec3(slope.x,0.,slope.y)));
          float tiltLight = (max(0.,waveLight)-max(0.,flatLight))/max(.25,flatLight);
          return ((1.+tiltLight)/area - 1.) * (1.-smoothstep(.93,1.,r2)) * rippleLight;
        }
      ` + shader.fragmentShader.replace('#include <lights_fragment_end>', `
        #include <lights_fragment_end>
        float caustic = focusedLight(normal);
        reflectedLight.directDiffuse *= 1. + caustic;
        reflectedLight.directSpecular *= 1. + caustic;
        // A little scattered light reaches the shade under leaves and fins.
        reflectedLight.indirectDiffuse *= 1. + .30*caustic;`);
    };
  }
  function update(liquid, intensity) {
    toLiquid.value.copy(liquid.matrixWorld).invert();
    lamp.getWorldPosition(direction).sub(lamp.target.getWorldPosition(target)).transformDirection(toLiquid.value);
    const eta = 1 / 1.333;
    const cosWater = Math.sqrt(1 - eta*eta*(1 - direction.y*direction.y));
    lampSlope.value.set(direction.x, direction.z).multiplyScalar(eta / cosWater);
    strength.value = intensity;
  }
  return { illuminate, update };
}
