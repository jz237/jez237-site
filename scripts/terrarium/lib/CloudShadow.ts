import * as THREE from 'three';
import type {Clouds} from './Clouds';

const MAX = 7 * 27;

/**
 * Cloud shadows: every puff is drawn as a soft dark disc from the lamp's point
 * of view into a small texture, which the lamp then projects (SpotLight.map).
 * Anything lit by the lamp — ground, plants, rock, the lizard — darkens under a
 * passing cloud, more under a heavy grey one.
 */
export class CloudShadow {
  readonly target: THREE.WebGLRenderTarget;
  private scene = new THREE.Scene();
  private mesh: THREE.InstancedMesh;
  private alpha: Float32Array;

  constructor() {
    this.target = new THREE.WebGLRenderTarget(256, 256, {depthBuffer: false, type: THREE.UnsignedByteType});
    this.target.texture.colorSpace = THREE.NoColorSpace;
    const geo = new THREE.PlaneGeometry(1, 1);
    this.alpha = new Float32Array(MAX);
    geo.setAttribute('aAlpha', new THREE.InstancedBufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    this.mesh = new THREE.InstancedMesh(geo, new THREE.ShaderMaterial({
      transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide,
      blending: THREE.CustomBlending, blendSrc: THREE.ZeroFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      vertexShader: `attribute float aAlpha; varying float vA; varying vec2 vUv; void main(){ vA = aAlpha; vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying float vA; varying vec2 vUv; void main(){ vec2 c = (vUv - 0.5) * 2.0; float r2 = dot(c, c); float a = vA * pow(max(0.0, 1.0 - r2), 2.2); gl_FragColor = vec4(0.0, 0.0, 0.0, a); }`,
    }), MAX);
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    this.scene.add(this.mesh);
  }

  update(renderer: THREE.WebGLRenderer, clouds: Clouds, light: THREE.SpotLight) {
    light.shadow.updateMatrices(light);
    const cam = light.shadow.camera;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3();
    const toLight = new THREE.Vector3();
    let n = 0;
    for (const c of clouds.clouds) {
      const look = c.uniforms.uLook.value as THREE.Vector4;
      const f = Math.min(1.6, 0.55 + 0.6 * look.x + 0.8 * look.y) * c.fade * 0.45;
      for (const p of c.puffs) {
        if (p.rCur < 0.004 || n >= MAX) continue;
        toLight.subVectors(light.position, p.pos).normalize();
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), toLight);
        s.setScalar(p.rCur * 3.0);
        m.compose(p.pos, q, s);
        this.mesh.setMatrixAt(n, m);
        this.alpha[n] = Math.min(0.55, f * 0.7);
        n++;
      }
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
    (this.mesh.geometry.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
    const prev = renderer.getRenderTarget();
    const prevClear = renderer.getClearColor(new THREE.Color());
    const prevAlpha = renderer.getClearAlpha();
    renderer.setRenderTarget(this.target);
    renderer.setClearColor(0xffffff, 1);
    renderer.clear(true, false, false);
    if (n) renderer.render(this.scene, cam);
    renderer.setClearColor(prevClear, prevAlpha);
    renderer.setRenderTarget(prev);
  }
}
