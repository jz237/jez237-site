import * as T from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { STUDIO_DAY, STUDIO_NIGHT } from '../render/studio';
import { SURFACE_RADIUS, WATER_LEVEL } from './slosh.mjs';
import { RIPPLE_HEIGHT, RIPPLE_SLOPE } from './ripples.mjs';

export function makeWaterFilm(liquid, slosh, sand) {
  const field = slosh.ripples;
  const waves = new T.DataTexture(field.data, field.size, field.size, T.RGBAFormat);
  waves.minFilter = waves.magFilter = T.LinearFilter;
  waves.needsUpdate = true;
  // Sample texel centres so the normals, displaced mesh, and CPU floaters agree.
  const uvScale = ((field.size - 1) / field.size / (2 * SURFACE_RADIUS)).toFixed(8);
  const geometry = new T.RingGeometry(0, SURFACE_RADIUS, 96, 28);
  const mirror = new Reflector(geometry, { textureWidth: 320, textureHeight: 200, multisample: 0, clipBias: 0.001 });
  const target = mirror.getRenderTarget();
  target.texture.type = T.UnsignedByteType;
  const uniforms = {
    waves: { value: waves }, bend: slosh.bend, mirrorMap: { value: target.texture },
    mirrorProjection: { value: new T.Matrix4() }, night: { value: 0 }, filmNormal: { value: slosh.normal },
  };
  const material = new T.ShaderMaterial({
    name: 'Rippling water', uniforms, transparent: true, depthWrite: false, side: T.DoubleSide, forceSinglePass: true,
    vertexShader: `
      uniform sampler2D waves;
      uniform float bend;
      uniform mat4 mirrorProjection;
      varying vec2 pos;
      varying vec3 worldPos;
      varying vec4 mirrorCoord;
      void main() {
        pos = vec2(position.x, -position.y);
        float r2 = dot(pos,pos) / ${SURFACE_RADIUS ** 2};
        float ripple = (texture2D(waves, .5 + pos * ${uvScale}).b * 255. - 128.) * ${RIPPLE_HEIGHT}/127.;
        float height = bend * (1.-r2) * (1.-3.*r2) + ripple * clamp(24.*(1.-r2),0.,1.);
        vec4 world = modelMatrix * vec4(position.xy, height, 1.);
        worldPos = world.xyz;
        mirrorCoord = mirrorProjection * world;
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: `
      uniform sampler2D waves, mirrorMap;
      uniform float bend, night;
      uniform vec3 filmNormal;
      varying vec2 pos;
      varying vec3 worldPos;
      varying vec4 mirrorCoord;
      const vec3 dayWall = vec3(${STUDIO_DAY.wallCore});
      const vec3 darkWall = vec3(${STUDIO_NIGHT.wallCore});
      void main() {
        float r2 = dot(pos,pos) / ${SURFACE_RADIUS ** 2};
        vec2 slope = (texture2D(waves, .5 + pos * ${uvScale}).rg * 255. - 128.) * ${RIPPLE_SLOPE}/127.;
        slope += bend * (-8. + 12.*r2) * pos / ${SURFACE_RADIUS ** 2};
        // The curved meniscus catches the room at a different angle to the open film.
        slope += .50 * smoothstep(.945,1.,r2) * pos;
        // Tangents of the tilted film, from the same shortest-arc rotation as Slosh.
        vec3 n = filmNormal;
        vec2 spin = n.xz / (1.+n.y);
        vec3 tx = vec3(1.-n.x*spin.x, -n.x, -n.z*spin.x);
        vec3 tz = vec3(-n.x*spin.y, -n.z, 1.-n.z*spin.y);
        vec3 N = normalize(n - tx*slope.x - tz*slope.y);
        vec3 eye = normalize(cameraPosition-worldPos), ray = reflect(-eye,N);
        float angle = abs(dot(N,eye));
        float fresnel = .021 + .979 * pow(1.-min(angle,1.),5.);
        bool above = dot(n,eye) >= 0.;
        if (!above) fresnel = max(fresnel, 1.-smoothstep(.60,.72,angle));

        vec3 wall = mix(dayWall,darkWall,night);
        float horizon = 1.-smoothstep(.01,.13,abs(ray.y-.105));
        vec3 room = wall * (.18 + .52*smoothstep(-.1,.35,ray.y));
        room += mix(vec3(.042,.085,.115),vec3(.006,.015,.038),night) * horizon;
        // Two soft reflections where the lights meet the glass and the blue backdrop.
        float strip = (1.-smoothstep(.005,.032,abs(ray.y-.08-.11*ray.x))) *
                      (1.-smoothstep(.05,.28,abs(ray.x+.20)));
        float side = (1.-smoothstep(.012,.050,abs(ray.x-.23))) *
                     (1.-smoothstep(.07,.30,abs(ray.y-.17)));
        room += mix(vec3(.73,.79,.69),vec3(.08,.14,.32),night) * (.55*strip+.23*side);
        vec2 uv = mirrorCoord.xy / max(mirrorCoord.w,.001);
        uv += (mat3(viewMatrix) * (N-n)).xy * .058;
        vec4 scene = texture2D(mirrorMap,clamp(uv,0.,1.));
        float valid = step(0.,min(uv.x,uv.y))*step(max(uv.x,uv.y),1.)*step(.001,mirrorCoord.w);
        vec3 reflection = mix(room,scene.rgb,scene.a*valid);
        float back = smoothstep(-.1,.65,-dot(pos,vec2(dot(eye,tx),dot(eye,tz))));
        float lip = smoothstep(mix(.966,.88,back),.994,r2);
        reflection = mix(reflection,wall*.065,lip*(.65+.31*back));
        float opacity = clamp(.065 + .78*fresnel + .48*lip,.08,.98);
        gl_FragColor = vec4(reflection,opacity);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const film = new T.Mesh(geometry, material);
  film.rotation.x = -Math.PI/2;
  film.position.y = WATER_LEVEL;
  film.userData.topic = 'water';
  film.renderOrder = 3;
  liquid.add(film);

  // Reuse the ripple curvature for the lamp's moving patches on the sand.
  const toLiquid = { value: new T.Matrix4() };
  sand.onBeforeCompile = shader => {
    shader.uniforms.waterWaves = uniforms.waves;
    shader.uniforms.toLiquid = toLiquid;
    shader.vertexShader = 'uniform mat4 toLiquid; varying vec2 waterUV;\n' + shader.vertexShader.replace('#include <project_vertex>', `
      #include <project_vertex>
      vec3 p = (toLiquid * modelMatrix * vec4(transformed,1.)).xyz;
      waterUV = .5 + (p.xz + vec2(-.13,.06)*(${WATER_LEVEL}-p.y))*${uvScale};`);
    shader.fragmentShader = 'uniform sampler2D waterWaves; varying vec2 waterUV;\n' + shader.fragmentShader.replace('#include <opaque_fragment>', `
      float focus = (texture2D(waterWaves,waterUV).a * 255.-128.) / 127.;
      outgoingLight *= 1. + .36*focus;
      #include <opaque_fragment>`);
  };

  const flip = new T.Matrix4().makeRotationX(Math.PI), inverse = new T.Matrix4();
  const eye = new T.Vector3(), centre = new T.Vector3();
  let captureAt = -1, lastSide = 0;
  function update(renderer, scene, camera, t, night) {
    waves.needsUpdate = true;
    uniforms.night.value = night;
    film.updateWorldMatrix(true,false);
    toLiquid.value.copy(liquid.matrixWorld).invert();
    camera.updateMatrixWorld();
    centre.setFromMatrixPosition(film.matrixWorld);
    const side = eye.setFromMatrixPosition(camera.matrixWorld).sub(centre).dot(slosh.normal) >= 0 ? 1 : -1;
    if (t < captureAt && side === lastSide) return;
    const { width, height } = renderer.domElement;
    const scale = Math.min(0.45, 384 / Math.max(width,height));
    target.setSize(Math.max(1,Math.round(width*scale)),Math.max(1,Math.round(height*scale)));
    mirror.matrixWorld.copy(film.matrixWorld);
    if (side < 0) mirror.matrixWorld.multiply(flip);
    const reflectedCamera = mirror.getReflectionCamera(camera);
    reflectedCamera.layers.set(1);
    if (side < 0) reflectedCamera.layers.enable(2);
    const shadowPending = renderer.shadowMap.needsUpdate;
    renderer.shadowMap.needsUpdate = false;
    mirror.onBeforeRender(renderer,scene,camera);
    renderer.shadowMap.needsUpdate = shadowPending;
    uniforms.mirrorProjection.value.copy(mirror.material.uniforms.textureMatrix.value).multiply(inverse.copy(mirror.matrixWorld).invert());
    lastSide = side;
    captureAt = t + .105;
  }
  return { update };
}
