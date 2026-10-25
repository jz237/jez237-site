// The betta bowl page's backdrop (studio.ts): the backdrop and the room drawn behind everything,
// from where the camera really is, so the table under the bowl lies in true perspective; and the
// table itself drawn again over it with the bowl's mirror image in its lacquer (the scene rendered
// from under the table, at half the resolution, sharper near the bowl's foot than further off).

import * as THREE from 'three/webgpu';
import { cameraPosition, clamp, float, normalize, positionLocal, positionWorld, reflector, uniform, vec4, wgsl, wgslFn } from 'three/tsl';
import { STUDIO_TABLE_Y, STUDIO_WALL_Z, STUDIO_WGSL } from './studio';

/** How far the table reaches out to the sides and towards the viewer from the bowl (world). */
const TABLE_HALF_WIDTH = 12;
const TABLE_FRONT = 9;

export class StudioBackdrop {
  /** For scene.backgroundNode. */
  readonly background: ReturnType<typeof vec4>;
  /** For GlobeView's outside: the bowl's variant reads the studio itself (studio.ts), so nothing
   *  is in it. */
  readonly map: THREE.Texture;
  /** The table with the bowl's reflection, and the mirror's plane (both for the scene). */
  readonly table: THREE.Mesh;
  readonly mirror: THREE.Object3D;
  /** Where the bowl stands (its centre, world). */
  private readonly bowl = uniform(new THREE.Vector3());
  private readonly mirrorNode: ReturnType<typeof reflector>;

  constructor() {
    const includes = [wgsl(STUDIO_WGSL)];
    const background = wgslFn(
      `fn studio_background(dir: vec3f, cam: vec3f, bowl: vec3f) -> vec4f {
        studioBowl = bowl;
        return vec4f(studio_view(cam, normalize(dir), false), 1.0);
      }`,
      includes,
    );
    this.background = background({ dir: normalize(positionLocal), cam: cameraPosition, bowl: this.bowl }) as unknown as ReturnType<typeof vec4>;

    // (A texture of the same kind as the ocean's map, so the shader binds it the same way.)
    this.map = new THREE.RenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false }).texture;
    this.map.minFilter = THREE.LinearFilter;
    this.map.magFilter = THREE.LinearFilter;
    this.map.generateMipmaps = false;

    const mirror = reflector({ resolutionScale: 0.5, generateMipmaps: true, bounces: false });
    mirror.target.rotateX(-Math.PI / 2);
    mirror.target.position.y = STUDIO_TABLE_Y;
    this.mirror = mirror.target;
    this.mirrorNode = mirror;
    const tableShade = wgslFn(
      `fn studio_tableWithMirror(x: vec3f, cam: vec3f, bowl: vec3f, mirror: vec4f) -> vec4f {
        studioBowl = bowl;
        let d = normalize(x - cam);
        let cosI = clamp(-d.y, 0.0, 1.0);
        let F = 0.04 + 0.96 * pow(1.0 - cosI, 5.0);
        return vec4f(studio_table(x, d, false) + F * mirror.rgb, 1.0);
      }`,
      includes,
    );
    // (Its lacquer is not a perfect mirror: the image softens with distance from the bowl's foot.)
    const blur = clamp(positionWorld.xz.sub(this.bowl.xz).length().sub(0.5).mul(1.8), float(0), float(5));
    const material = new THREE.MeshBasicNodeMaterial();
    material.colorNode = tableShade({ x: positionWorld, cam: cameraPosition, bowl: this.bowl, mirror: mirror.level(blur) }) as unknown as typeof material.colorNode;
    material.depthTest = false;
    material.depthWrite = false;
    const depth = TABLE_FRONT - STUDIO_WALL_Z;
    const plane = new THREE.PlaneGeometry(2 * TABLE_HALF_WIDTH, depth);
    plane.rotateX(-Math.PI / 2);
    plane.translate(0, STUDIO_TABLE_Y, STUDIO_WALL_Z + depth / 2);
    this.table = new THREE.Mesh(plane, material);
    this.table.renderOrder = -1;
    this.table.frustumCulled = false;
  }

  /** What the camera sees on this layer, the mirror leaves out (it renders the scene again from
   *  under the table, half as sharp and softened further off: what is a blur there need not
   *  cost a pass). */
  leaveOut(camera: THREE.Camera, layer: number): void {
    this.mirrorNode.reflector.getVirtualCamera(camera).layers.disable(layer);
  }

  /** Follows the bowl (its centre, world). */
  update(center: THREE.Vector3): void {
    this.bowl.value.copy(center);
  }
}
