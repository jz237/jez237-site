import * as THREE from 'three/webgpu';
import { createBetta } from '../../../betta-atelier/src/fish.js';
import { TriangleBVH } from './triangleBVH.mjs';
import { BettaSwim, BETTA_SCALE as SCALE } from './bettaSwim.mjs';
import { BETTA_PROBES, readBettaWater } from './bettaWater.mjs';
import type { KoiEnv, KoiSense } from './Koi';

/** The actual Atelier specimen, evaluated on the CPU for the refracted rays.
 * No screenshot/billboard: skin, seven membranes, mouth, covers and both eye
 * sockets remain separate animated three-dimensional surfaces. */
export class Betta {
  readonly fish = createBetta({ compact: true });
  readonly rig = new THREE.Group();
  readonly atlas: THREE.CanvasTexture;
  readonly texture: THREE.DataTexture;
  readonly bvh: TriangleBVH;
  readonly ready: Promise<void>;
  private readonly meshes: { mesh: THREE.Mesh; offset: number }[] = [];
  private readonly vertices: Float32Array;
  private readonly probes = new Float32Array(16 * 4);
  private readonly flow = new THREE.Vector3();
  readonly swim = new BettaSwim();
  waterState: ReturnType<typeof readBettaWater> | null = null;
  private time = 0;
  private loaded = false;
  active = false;
  flared = false;

  constructor() {
    this.rig.add(this.fish);
    this.rig.scale.setScalar(SCALE);
    this.fish.userData.locomotion = this.locomotion();
    this.fish.userData.update(0);
    this.rig.updateMatrixWorld(true);
    const positions: number[] = [], indices: number[] = [], uv: number[] = [], materials: number[] = [];
    this.fish.traverse((object: THREE.Object3D) => {
      if (!(object as THREE.Mesh).isMesh) return;
      const mesh = object as THREE.Mesh, g = mesh.geometry;
      const offset = positions.length / 3;
      this.meshes.push({ mesh, offset });
      for (let i = 0; i < g.attributes.position.count; i++) {
        positions.push(g.attributes.position.getX(i), g.attributes.position.getY(i), g.attributes.position.getZ(i));
        uv.push(g.attributes.uv.getX(i), g.attributes.uv.getY(i));
      }
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      // 0: skin; 1: caudal; 2: other fins; 3: eye; 4: dark mouth/pupil.
      const material = !mat.map ? 4 : mesh.parent !== this.fish ? 3 : mesh.userData.kind === 0 ? 1 : mesh.userData.kind !== undefined ? 2 : 0;
      for (let i = 0; i < g.index!.count; i++) indices.push(g.index!.getX(i) + offset);
      for (let i = 0; i < g.index!.count / 3; i++) materials.push(material);
    });
    this.vertices = new Float32Array(positions);
    this.bvh = new TriangleBVH(this.vertices, new Uint32Array(indices), new Float32Array(uv), materials);
    this.texture = new THREE.DataTexture(this.bvh.data, this.bvh.width, this.bvh.height, THREE.RGBAFormat, THREE.FloatType);
    this.texture.minFilter = this.texture.magFilter = THREE.NearestFilter;
    this.texture.generateMipmaps = false;
    this.texture.needsUpdate = true;
    const canvas = document.createElement('canvas');
    canvas.width = 2048; canvas.height = 3072;
    this.atlas = new THREE.CanvasTexture(canvas);
    // Raw shader samples explicitly decode sRGB; no implicit colour-space node.
    this.atlas.colorSpace = THREE.NoColorSpace;
    this.atlas.flipY = false;
    this.atlas.generateMipmaps = true;
    this.ready = this.fish.userData.ready.then(() => {
      const body = this.meshes.find(({ mesh }) => mesh.name.startsWith('Arc-length'))!.mesh;
      const tail = this.meshes.find(({ mesh }) => mesh.userData.kind === 0)!.mesh;
      const macro = this.fish.userData.macroTextures;
      const textures = [(body.material as THREE.MeshPhysicalMaterial).map!, (tail.material as THREE.MeshPhysicalMaterial).map!, macro.head, macro.scales, macro.fin];
      const ctx = canvas.getContext('2d')!;
      textures.forEach((t, i) => ctx.drawImage(t.image, (i % 2) * 1024, Math.floor(i / 2) * 1024, 1024, 1024));
      this.atlas.needsUpdate = true;
      this.loaded = true;
    });
    this.updateVertices();
    this.updateProbes();
  }

  update(dt: number, sense: KoiSense | null, env: KoiEnv): void {
    if (!this.active || !this.loaded) {
      if (this.bvh.data[3]) { this.bvh.data[3] = 0; this.texture.needsUpdate = true; }
      return;
    }
    dt = Math.max(0, Math.min(dt, 0.07));
    this.time += dt;
    // Sample the actual current and its rotation across the moving anatomy.
    this.waterState = readBettaWater(sense, this.probes, env);
    const target = new THREE.Vector3().fromArray(this.waterState.flow);
    this.flow.lerp(target, 1 - Math.exp(-5 * dt));
    this.swim.advance(dt, this.flow.toArray(), env, this.waterState.submerged > 0.99, this.waterState);
    this.fish.userData.locomotion = this.locomotion();
    this.fish.userData.externalFlow = this.flow.clone().multiplyScalar(1 / SCALE).toArray();
    // The same one-second opening as the standalone specimen.
    this.fish.userData.display.requested = this.flared;
    this.fish.userData.update(this.time);
    this.updateVertices();
    // Contact against the glass and sampled bed, not a fixed waterline: sloshing
    // can carry the fish vertically and the density probes guide its recovery.
    for (let pass = 0; pass < 4; pass++) {
      let worst = 0, dx = 0, dy = 0, dz = 0, bottom = Infinity;
      for (let i = 0; i < this.vertices.length; i += 3) {
        const x = this.vertices[i], y = this.vertices[i + 1], z = this.vertices[i + 2];
        bottom = Math.min(bottom, y);
        const r = Math.hypot(x, y, z), excess = r - env.radius + 0.012;
        if (excess > worst) { worst = excess; dx = -x / r * excess; dy = -y / r * excess; dz = -z / r * excess; }
      }
      dy += Math.max(0, this.waterState.sand + 0.012 - bottom - dy);
      if (Math.hypot(dx, dy, dz) < 1e-6) break;
      const shift = [dx, dy, dz];
      for (let k = 0; k < 3; k++) {
        this.swim.position[k] += shift[k];
        this.fish.position.setComponent(k, this.fish.position.getComponent(k) + shift[k] / SCALE);
        if (shift[k] * this.swim.drift[k] < 0) this.swim.drift[k] = 0;
      }
      for (let i = 0; i < this.vertices.length; i++) this.vertices[i] += shift[i % 3];
    }
    this.bvh.refit(this.vertices);
    this.bvh.data[3] = 1;
    this.texture.needsUpdate = true;
    this.updateProbes();
  }

  private updateProbes(): void {
    this.rig.updateMatrixWorld(true);
    const scratch = [0, 0, 0, 0], p = new THREE.Vector3();
    for (let i = 0; i < 16; i++) {
      const local = BETTA_PROBES[i];
      this.fish.userData.bodyMotion.transform(local[0], local[1], local[2], scratch);
      p.set(scratch[0], scratch[1], scratch[2]).applyMatrix4(this.fish.matrixWorld);
      this.probes.set([p.x, p.y, p.z, 0], i * 4);
    }
  }

  probePoints(): Float32Array { return this.probes; }

  private locomotion() {
    return { ...this.swim, position: this.swim.position.map(v => v / SCALE), velocity: this.swim.velocity.map(v => v / SCALE) };
  }

  private updateVertices(): void {
    this.rig.updateMatrixWorld(true);
    const body = this.fish.userData.bodyMotion;
    const scratch = [0, 0, 0, 0], p = new THREE.Vector3();
    for (const { mesh, offset } of this.meshes) {
      const g = mesh.geometry, source = g.attributes.position;
      const deform = (mesh.material as THREE.Material).userData.bettaDeform;
      for (let i = 0; i < source.count; i++) {
        p.fromBufferAttribute(source, i);
        if (deform) {
          if (deform.operculum) p.z += g.attributes.coverLift.getX(i) * (body.gill * 0.046 + this.fish.userData.display.flare * 0.085);
          body.transform(p.x, p.y, p.z, scratch);
          p.set(scratch[0], scratch[1], scratch[2]);
          const fin = deform.dynamics;
          if (fin) {
            const x = g.attributes.finUV.getX(i) * (fin.columns - 1), y = g.attributes.finUV.getY(i) * (fin.rows - 1);
            const a = Math.floor(x), b = Math.floor(y), xx = Math.min(a + 1, fin.columns - 1), yy = Math.min(b + 1, fin.rows - 1);
            const u = x - a, v = y - b, data = fin.displacement;
            for (let k = 0; k < 3; k++) {
              const upper = data[(b * fin.columns + a) * 4 + k] * (1 - u) + data[(b * fin.columns + xx) * 4 + k] * u;
              const lower = data[(yy * fin.columns + a) * 4 + k] * (1 - u) + data[(yy * fin.columns + xx) * 4 + k] * u;
              p.setComponent(k, p.getComponent(k) + upper * (1 - v) + lower * v);
            }
          }
        }
        p.applyMatrix4(mesh.matrixWorld);
        p.toArray(this.vertices, (offset + i) * 3);
      }
    }
    this.bvh.refit(this.vertices);
  }
}
