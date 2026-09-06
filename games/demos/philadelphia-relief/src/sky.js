/**
 * Sky dome and sun.
 *
 * The horizon band is driven by the same colour the terrain shader fogs
 * toward, so distant ground dissolves into the sky instead of ending on a hard
 * silhouette. That single detail does most of the work of making the scene read
 * as atmosphere rather than as a model on a backdrop.
 */

import { hexToRgb, getTheme } from './themes.js?v=philly-2026090611';

const SKY_VERTEX = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    // Strip translation so the dome is always centred on the camera.
    mat4 rotOnly = modelViewMatrix;
    rotOnly[3].xyz = vec3(0.0);
    vec4 pos = projectionMatrix * rotOnly * vec4(position, 1.0);
    gl_Position = pos.xyww;   // force to the far plane
  }
`;

const SKY_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform vec3  uTop;
  uniform vec3  uHorizon;
  uniform vec3  uSunColor;
  uniform vec3  uSunDir;
  uniform float uSunAltitude;   // degrees
  uniform float uHaze;
  uniform float uNight;
  varying vec3  vDir;

  void main() {
    vec3 dir = normalize(vDir);
    float up = clamp(dir.y, -1.0, 1.0);

    // Horizon band tightens as the sun climbs, which is what separates a dawn
    // sky from a midday one more than hue does.
    float band = pow(1.0 - clamp(abs(up), 0.0, 1.0), mix(2.2, 6.0, clamp(uSunAltitude / 60.0, 0.0, 1.0)));
    vec3 color = mix(uTop, uHorizon, clamp(band + uHaze * 0.35, 0.0, 1.0));

    // Ground haze below the horizon so a pitched-down camera never sees a void.
    color = mix(color, uHorizon, (1.0 - smoothstep(-0.25, 0.0, up)));

    float toSun = max(0.0, dot(dir, normalize(uSunDir)));
    color += uSunColor * pow(toSun, 8.0) * 0.28;        // broad glow
    color += uSunColor * pow(toSun, 220.0) * 0.9;       // inner halo
    color += uSunColor * smoothstep(0.99955, 0.99985, toSun) * 2.2;  // disc

    color *= mix(1.0, 0.12, uNight);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createSky(THREE) {
  const uniforms = {
    uTop: { value: new THREE.Vector3(0.05, 0.09, 0.18) },
    uHorizon: { value: new THREE.Vector3(0.9, 0.65, 0.4) },
    uSunColor: { value: new THREE.Vector3(1, 0.85, 0.65) },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uSunAltitude: { value: 20 },
    uHaze: { value: 0.4 },
    uNight: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: SKY_VERTEX,
    fragmentShader: SKY_FRAGMENT,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
  });

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1000;
  mesh.name = 'sky';

  return {
    mesh,
    uniforms,
    setTheme(themeId) {
      const theme = getTheme(themeId);
      setVec3(uniforms.uTop.value, theme.skyTop);
      setVec3(uniforms.uHorizon.value, theme.skyHorizon);
      setVec3(uniforms.uSunColor.value, theme.sunColor);
    },
    dispose() {
      mesh.geometry.dispose();
      material.dispose();
    },
  };
}

function setVec3(target, hex) {
  const [r, g, b] = hexToRgb(hex, true);
  target.set(r, g, b);
}

/**
 * Convert azimuth/altitude in degrees to a world-space direction pointing
 * toward the sun. Azimuth is compass-style: 0 = north, 90 = east.
 */
export function sunDirection(azimuthDeg, altitudeDeg, out) {
  const az = azimuthDeg * (Math.PI / 180);
  const alt = altitudeDeg * (Math.PI / 180);
  const horizontal = Math.cos(alt);
  // North is -Z, east is +X.
  out.set(Math.sin(az) * horizontal, Math.sin(alt), -Math.cos(az) * horizontal);
  return out.normalize();
}
