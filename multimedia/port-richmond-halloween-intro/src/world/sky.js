// Overcast Halloween night over Port Richmond: low cloud deck lit from below by the city's sodium/LED glow
// (warm orange-brown near the horizon, dark slate overhead), no stars. Deterministic: cloud drift = f(t).
import * as THREE from 'three';

const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize( ( modelMatrix * vec4( position, 0.0 ) ).xyz );
  vec4 p = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  gl_Position = p.xyww;
}`;

const SKY_FRAG = /* glsl */ `
uniform float uTime;
uniform float uBright;
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uGlow;
varying vec3 vDir;
float h12( vec2 p ) { vec3 p3 = fract( vec3( p.xyx ) * 0.1031 ); p3 += dot( p3, p3.yzx + 33.33 ); return fract( ( p3.x + p3.y ) * p3.z ); }
float vn( vec2 p ) { vec2 i = floor( p ), f = fract( p ); vec2 u = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( h12( i ), h12( i + vec2( 1, 0 ) ), u.x ), mix( h12( i + vec2( 0, 1 ) ), h12( i + vec2( 1, 1 ) ), u.x ), u.y ); }
float fbm( vec2 p ) { float a = 0.5, s = 0.0; for ( int i = 0; i < 5; i ++ ) { s += a * vn( p ); p = p * 2.02 + 11.7; a *= 0.5; } return s; }
void main() {
  vec3 d = normalize( vDir );
  float h = d.y;
  // city glow: strongest toward the river / Kensington (+x NE-ish) and low on the horizon all round
  float az = atan( d.z, d.x );
  float glowAz = 0.75 + 0.25 * sin( az * 1.3 + 0.8 );
  vec3 col = mix( uHorizon, uZenith, smoothstep( -0.02, 0.55, h ) );
  col += uGlow * glowAz * exp( - max( h, 0.0 ) * 7.0 );
  // cloud deck (projected on a plane), lit from below: brighter undersides near the horizon
  vec2 cp = d.xz / max( h + 0.12, 0.05 ) * 0.55 + vec2( uTime * 0.0045, uTime * 0.0018 );
  float c = fbm( cp * 1.4 );
  float c2 = fbm( cp * 4.1 + 3.3 );
  float cloud = smoothstep( 0.38, 0.75, c * 0.75 + c2 * 0.25 );
  vec3 under = uGlow * ( 0.35 + 0.65 * exp( - max( h, 0.0 ) * 3.0 ) ) * 0.9 + uZenith * 0.6;
  col = mix( col * 0.75, under, cloud * smoothstep( -0.02, 0.08, h ) * 0.8 );
  // below the horizon: dark haze (only seen through gaps at street level)
  col = mix( col, uHorizon * 0.55, smoothstep( 0.0, -0.08, h ) );
  gl_FragColor = vec4( col * uBright, 1.0 );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export const SKY_DEFAULTS = {
  zenith: new THREE.Color(0.0034, 0.0040, 0.0060),
  horizon: new THREE.Color(0.022, 0.0185, 0.0165),
  glow: new THREE.Color(0.036, 0.021, 0.0115),
  fog: new THREE.Color(0.0135, 0.0117, 0.0108),
};

export function makeSky({ bright = 1.0 } = {}) {
  const mat = new THREE.ShaderMaterial({
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    uniforms: {
      uTime: { value: 0 }, uBright: { value: bright },
      uZenith: { value: SKY_DEFAULTS.zenith.clone() }, uHorizon: { value: SKY_DEFAULTS.horizon.clone() },
      uGlow: { value: SKY_DEFAULTS.glow.clone() },
    },
    side: THREE.BackSide, depthWrite: false, depthTest: true, fog: false, toneMapped: true,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), mat);
  mesh.name = 'WitteSky';
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  mesh.userData.noReflectSkip = true;
  return mesh;
}

// PMREM environment: the same sky plus a few soft lamp glows at street-light height, so wet asphalt, car paint
// and window glass pick up believable night reflections even where no real light is near.
export function makeEnvironment(renderer, sky) {
  const envScene = new THREE.Scene();
  const s = sky.clone();
  s.material = sky.material.clone();
  s.material.uniforms.uBright.value = 1.0;
  s.material.toneMapped = false;
  envScene.add(s);
  const glowMat = (c, k) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide, toneMapped: false });
  const lamps = [[0, 8.5, -30, 0xdfe8ff, 2.2], [0, 8.5, 30, 0xdfe8ff, 2.2], [-20, 6, -60, 0xffc890, 1.2], [25, 5, 50, 0xffc890, 1.0],
    [40, 9, 0, 0xdfe8ff, 1.4], [-40, 9, 5, 0xdfe8ff, 1.4]];
  for (const [x, y, z, c, k] of lamps) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 8), glowMat(c, k));
    m.position.set(x, y, z);
    envScene.add(m);
  }
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.006, 0.0055, 0.005), toneMapped: false }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.6;
  envScene.add(ground);
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(envScene, 0.04, 0.1, 1000);
  pm.dispose();
  envScene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  return rt.texture;
}
