import * as T from 'three';
import { BOWL } from '../render/bowl';
import { WATER_LEVEL } from './slosh.mjs';
import { buildLensProfile, LENS_SIZE, MAX_INVERSE_DISTANCE } from './lensProfile.mjs';

const optics = `
  uniform highp sampler3D bowlProfile;
  uniform vec3 bowlCentre, bowlAxis, bowlUp, waterUp;
  uniform float inverseEye, lensStrength;
  vec4 throughBowl(vec4 p) {
    if (lensStrength <= 0.) return p;
    vec3 local = p.xyz - bowlCentre;
    float z = dot(local,bowlAxis);
    vec3 radial = local - z*bowlAxis;
    const vec3 size = vec3(${LENS_SIZE.map(v => v.toFixed(1)).join(',')});
    vec3 coord = clamp(vec3(length(radial),.5+.5*z,inverseEye/${MAX_INVERSE_DISTANCE}),0.,1.);
    vec2 gain = texture(bowlProfile,(coord*(size-1.)+.5)/size).rg;
    // Which part of the shell does this sightline enter? Above the free
    // surface there is only thin glass. Through the mouth there is no wall.
    vec3 sight = normalize(p.xyz);
    vec3 impact = sight*dot(sight,bowlCentre) - bowlCentre;
    vec3 entry = impact - sight*sqrt(max(0.,1.-dot(impact,impact)));
    float shell = 1.-smoothstep(${BOWL.mouth - 0.025},${BOWL.mouth + 0.025},dot(entry,bowlUp));
    float h = dot(entry,waterUp)-${WATER_LEVEL};
    float endH = dot(local,waterUp)-${WATER_LEVEL};
    float wetEntry = 1.-smoothstep(-.035,.035,h);
    float wetPath = 1.-smoothstep(-.05,.05,(h+endH)*.5);
    float wet = wetEntry*(.55+.45*wetPath);
    p.xyz += radial * ((mix(gain.y,gain.x,wet)-1.)*shell*lensStrength);
    return p;
  }
`;

const PICK_LAYER = 3;

export function createBowlOptics() {
  const half = Uint16Array.from(buildLensProfile(), T.DataUtils.toHalfFloat);
  const profile = new T.Data3DTexture(half, ...LENS_SIZE);
  profile.format = T.RGFormat;
  profile.type = T.HalfFloatType;
  profile.minFilter = profile.magFilter = T.LinearFilter;
  profile.needsUpdate = true;
  const uniforms = {
    bowlProfile: { value: profile }, bowlCentre: { value: new T.Vector3() }, bowlAxis: { value: new T.Vector3() },
    bowlUp: { value: new T.Vector3() }, waterUp: { value: new T.Vector3() },
    inverseEye: { value: 0 }, lensStrength: { value: 0 }, readLesson: { value: false },
  };
  const topics = [null], installed = new Set();
  const target = new T.WebGLRenderTarget(1, 1);
  const pixel = new Uint8Array(4);

  function install(mesh, { distort = true, topic = null, film = false } = {}) {
    const material = mesh.material;
    if (topic) {
      if (!topics.includes(topic)) topics.push(topic);
      const id = topics.indexOf(topic);
      const ids = new Uint8Array(mesh.geometry.attributes.position.count).fill(id);
      mesh.geometry.setAttribute('lessonId', new T.BufferAttribute(ids, 1));
      mesh.layers.enable(PICK_LAYER);
    }
    // A close view can see a displaced fin whose physical bounds lie offscreen.
    if (distort) mesh.frustumCulled = false;
    if (installed.has(material)) return;
    installed.add(material);
    const original = material.onBeforeCompile.bind(material);
    const key = material.customProgramCacheKey();
    material.customProgramCacheKey = () => key + '-bowl-' + Number(distort) + Number(!!topic);
    material.onBeforeCompile = (shader, renderer) => {
      original(shader, renderer);
      Object.assign(shader.uniforms, uniforms);
      if (distort) {
        // mvPosition already contains instance transforms and animated fins.
        // Keep physical positions for shadow, lighting and mirror coordinates.
        shader.vertexShader = optics + (film
          ? shader.vertexShader.replace('projectionMatrix * viewMatrix * world', 'projectionMatrix * throughBowl(viewMatrix * world)')
          : shader.vertexShader.replace('#include <logdepthbuf_vertex>',
            'gl_Position = projectionMatrix * throughBowl(mvPosition);\n#include <logdepthbuf_vertex>'));
      }
      if (topic) {
        shader.vertexShader = 'attribute float lessonId; varying float vLesson;\n' +
          shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvLesson = lessonId;');
        shader.fragmentShader = 'uniform bool readLesson; varying float vLesson;\n' +
          shader.fragmentShader.replace(/}\s*$/, 'if (readLesson) gl_FragColor = vec4(vLesson/255.,0.,0.,1.);\n}');
      }
    };
  }

  function update(camera, basin, shell, surface) {
    camera.updateMatrixWorld();
    const view = camera.matrixWorldInverse;
    const centre = uniforms.bowlCentre.value.copy(basin.position).applyMatrix4(view);
    const distance = centre.length();
    uniforms.bowlAxis.value.copy(centre).normalize().negate();
    uniforms.inverseEye.value = 1 / Math.max(1, distance);
    uniforms.lensStrength.value = T.MathUtils.smoothstep(distance, 1.05, 1.24);
    uniforms.bowlUp.value.set(0, 1, 0).applyQuaternion(shell.quaternion).transformDirection(view);
    uniforms.waterUp.value.copy(surface.normal).transformDirection(view);
  }

  // Shade only the tapped pixel using the same animated geometry and depth
  // test as the display. There is no ID buffer to refresh between taps.
  function pick(renderer, scene, camera, u, v) {
    if (u < 0 || v < 0 || u >= 1 || v >= 1) return null;
    const { width, height } = renderer.domElement;
    target.viewport.set(-Math.floor(u * width), Math.floor(v * height) + 1 - height, width, height);
    const previous = renderer.getRenderTarget(), layers = camera.layers.mask;
    const pending = renderer.shadowMap.needsUpdate;
    try {
      uniforms.readLesson.value = true;
      camera.layers.set(PICK_LAYER);
      renderer.shadowMap.needsUpdate = false;
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
      renderer.readRenderTargetPixels(target, 0, 0, 1, 1, pixel);
      return topics[pixel[0]] ?? null;
    } finally {
      renderer.setRenderTarget(previous);
      renderer.shadowMap.needsUpdate = pending;
      camera.layers.mask = layers;
      uniforms.readLesson.value = false;
    }
  }
  return { install, update, pick, uniforms, topics };
}
