import * as THREE from 'three';

// Image-based lighting for the metals. We build small procedural "light
// rooms" (a graded sky dome with glowing greenhouse windows) and prefilter
// them with PMREM. One map per mood; shots pick the one that suits them.

function envScene({ top, horizon, bottom, windows, windowColor, sun, sunColor, sunDir }) {
  const scene = new THREE.Scene();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(50, 64, 32),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        top: { value: new THREE.Color(top) },
        horizon: { value: new THREE.Color(horizon) },
        bottom: { value: new THREE.Color(bottom) },
        sunDir: { value: sunDir.clone().normalize() },
        sunColor: { value: new THREE.Color(sunColor).multiplyScalar(sun) },
      },
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        uniform vec3 top, horizon, bottom, sunColor, sunDir; varying vec3 vDir;
        void main(){
          float y = vDir.y;
          vec3 c = y > 0.0 ? mix(horizon, top, pow(y, 0.6)) : mix(horizon, bottom, pow(-y, 0.45));
          float s = max(dot(normalize(vDir), sunDir), 0.0);
          c += sunColor * (pow(s, 900.0) * 40.0 + pow(s, 12.0) * 0.6);
          gl_FragColor = vec4(c, 1.0);
        }`,
    })
  );
  scene.add(dome);
  // greenhouse panes: tall emissive rectangles around the horizon and a
  // bright arched roof strip – they give brass long, architectural highlights
  const winMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(windowColor).multiplyScalar(windows), side: THREE.DoubleSide });
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const w = new THREE.Mesh(new THREE.PlaneGeometry(9, 20), winMat);
    w.position.set(Math.cos(a) * 40, 6, Math.sin(a) * 40);
    w.lookAt(0, 6, 0);
    scene.add(w);
  }
  for (let i = 0; i < 7; i++) {
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(80, 3), winMat);
    strip.position.set(0, 38, -30 + i * 10);
    strip.rotation.x = Math.PI / 2;
    scene.add(strip);
  }
  return scene;
}

export function createEnvironments(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const sunDir = new THREE.Vector3(-0.35, 0.62, -0.6);
  const moods = {
    night: envScene({ top: '#040c0f', horizon: '#173a3e', bottom: '#030605', windows: 1.3, windowColor: '#86b7b6', sun: 0.0, sunColor: '#9ec7c6', sunDir }),
    dawn: envScene({ top: '#0e2a30', horizon: '#6a5a44', bottom: '#0b0d0a', windows: 0.9, windowColor: '#d9b27a', sun: 0.6, sunColor: '#ffcf8a', sunDir }),
    gold: envScene({ top: '#3b5a5c', horizon: '#e1b577', bottom: '#1a150d', windows: 2.2, windowColor: '#ffdcaa', sun: 2.5, sunColor: '#ffd9a0', sunDir }),
  };
  const maps = {};
  for (const [k, scene] of Object.entries(moods)) {
    maps[k] = pmrem.fromScene(scene, 0.02).texture;
  }
  pmrem.dispose();
  return maps;
}
