import * as THREE from 'three/webgpu';
import { createBetta } from '../../../betta-atelier/src/fish.js';
import { TriangleBVH } from './triangleBVH.mjs';
import type { KoiEnv, KoiSense } from './Koi';

const SCALE = 0.25;

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
  private readonly drift = new THREE.Vector3();
  private time = 0;
  private loaded = false;
  active = false;
  flared = false;

  constructor() {
    this.rig.add(this.fish);
    this.rig.scale.setScalar(SCALE);
    this.rig.position.set(-0.08, -0.18, 0);
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
  }

  update(dt: number, sense: KoiSense | null, env: KoiEnv): void {
    if (!this.active || !this.loaded) {
      if (this.bvh.data[3]) { this.bvh.data[3] = 0; this.texture.needsUpdate = true; }
      return;
    }
    this.time += dt;
    // Mean of probes actually submerged. Currents are read from the fluid solver,
    // not an unrelated sinusoid. Limit extreme shake impulses before the fin solver.
    const target = new THREE.Vector3();
    let count = 0;
    if (sense) for (let i = 0; i < 16; i++) {
      if (sense.probes[i * 4 + 3] < env.iso) continue;
      target.x += sense.probes[i * 4]; target.y += sense.probes[i * 4 + 1]; target.z += sense.probes[i * 4 + 2]; count++;
    }
    if (count) target.multiplyScalar(1 / count);
    target.clampLength(0, 0.6);
    this.flow.lerp(target, 1 - Math.exp(-5 * dt));
    this.fish.userData.externalFlow = this.flow.clone().multiplyScalar(1 / SCALE).toArray();
    // The same one-second opening as the standalone specimen.
    this.fish.userData.display.requested = this.flared;
    this.fish.userData.update(this.time);
    this.drift.addScaledVector(this.flow, dt * 0.22).multiplyScalar(Math.exp(-dt * 1.4)).clampLength(0, 0.08);
    this.rig.position.set(-0.08 + this.drift.x, -0.18 + this.drift.y, this.drift.z);
    this.updateVertices();
    // Keep the entire animated silhouette between the settled bed and surface.
    // A conservative globe-space envelope also keeps fin tips away from glass.
    const d = this.bvh.data;
    const dy = Math.min(0, env.level - 0.06 - d[9]) + Math.max(0, env.sandLevel + 0.06 - d[5]);
    if (Math.abs(dy) > 1e-5) {
      for (let i = 1; i < this.vertices.length; i += 3) this.vertices[i] += dy;
      this.bvh.refit(this.vertices);
    }
    this.bvh.data[3] = 1;
    this.texture.needsUpdate = true;
    // Sixteen points covering the trunk and fins, in the same sim frame as the BVH.
    for (let i = 0; i < 16; i++) {
      const f = i / 15;
      this.probes.set([d[4] + (d[8] - d[4]) * f, (d[5] + d[9]) * 0.5, (d[6] + d[10]) * 0.5, 0], i * 4);
    }
  }

  probePoints(): Float32Array { return this.probes; }

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
