import * as T from 'three';

// The moving 150m sun map resolves vehicles. This fixed map resolves the quarry
// beyond it, including occluders outside the moving map. Both attenuate the SAME
// sun using min(near, static), rather than adding a second light or multiplying
// two partially filtered shadows. Geometry and collision data are never changed.
// Bright-tail centroid of the bundled HDR after its existing 1.9-radian yaw.
// Matching the key to this solar disk keeps shadows, reflections and sky coherent
// without tilting the photographed horizon. tools/daylight-qa.mjs reproduces it.
export const DAYLIGHT_DIRECTION = new T.Vector3(.17808175630589612, .7416666663831829, -.6466973357352447).normalize();
export const DAYLIGHT_DISTANCE = Math.hypot(70, 65, 45);

export function staticCasterScene(source: T.Object3D, excluded: ReadonlySet<T.Object3D>) {
  source.updateMatrixWorld(true);
  const scene = new T.Scene();
  const materials = new Map<T.Material, T.MeshDepthMaterial>();
  const visit = (object: T.Object3D, selectedLOD = false) => {
    if (excluded.has(object) || (!object.visible && !selectedLOD)) return;
    if (object instanceof T.LOD) {
      // A fixed highest-detail caster prevents stale camera-selected LOD shadows.
      if (object.levels.length) visit(object.levels[0].object, true);
      return;
    }
    if (object instanceof T.Mesh && object.castShadow) {
      const originals = Array.isArray(object.material) ? object.material : [object.material];
      const depth = originals.map(original => {
        if (!materials.has(original)) {
          const surface = original as T.MeshStandardMaterial;
          const material = new T.MeshDepthMaterial({
            depthPacking: T.RGBADepthPacking,
            side: original.shadowSide ?? (original.side === T.FrontSide ? T.BackSide
              : original.side === T.BackSide ? T.FrontSide : T.DoubleSide),
            // Scanned branch cards have fixed vertices and alpha masks. Camera-
            // facing distant tree cards already have castShadow=false.
            map: surface.alphaTest > 0 ? surface.map : null,
            alphaMap: surface.alphaMap,
            alphaTest: surface.alphaTest,
            visible: original.visible && (!original.transparent || original.alphaTest > 0),
          });
          materials.set(original, material);
        }
        return materials.get(original)!;
      });
      if (depth.some(material => material.visible)) {
        const mesh = object.clone(false) as T.Mesh;
        mesh.material = Array.isArray(object.material) ? depth : depth[0];
        mesh.matrix.copy(object.matrixWorld);
        mesh.matrixAutoUpdate = false;
        mesh.visible = true;
        mesh.castShadow = mesh.receiveShadow = false;
        // Use shared immutable geometry, including the authored highest LOD. An
        // InstancedMesh clone preserves instance transforms without reparenting.
        scene.add(mesh);
      }
    }
    for (const child of object.children) visit(child);
  };
  visit(source);
  scene.updateMatrixWorld(true);
  return { scene, materials: [...materials.values()] };
}

export function fitStaticShadowCamera(bounds: T.Box3) {
  const center = bounds.getCenter(new T.Vector3());
  const camera = new T.OrthographicCamera();
  camera.position.copy(center).addScaledVector(DAYLIGHT_DIRECTION, bounds.getSize(new T.Vector3()).length() + 20);
  camera.lookAt(center);
  camera.updateMatrixWorld(true);
  const lightBounds = new T.Box3();
  for (const x of [bounds.min.x, bounds.max.x])
    for (const y of [bounds.min.y, bounds.max.y])
      for (const z of [bounds.min.z, bounds.max.z])
        lightBounds.expandByPoint(new T.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse));
  camera.left = lightBounds.min.x - 4; camera.right = lightBounds.max.x + 4;
  camera.bottom = lightBounds.min.y - 4; camera.top = lightBounds.max.y + 4;
  camera.near = Math.max(.1, -lightBounds.max.z - 4); camera.far = -lightBounds.min.z + 4;
  camera.updateProjectionMatrix();
  return camera;
}

const vertexDeclarations = `
#if defined(USE_SHADOWMAP) && NUM_DIR_LIGHT_SHADOWS > 0
uniform mat4 quarryStaticMatrix;
uniform float quarryStaticNormalBias;
varying vec4 vQuarryStaticCoord;
#endif
`;
const vertexCoordinate = `
#if defined(USE_SHADOWMAP) && NUM_DIR_LIGHT_SHADOWS > 0
vQuarryStaticCoord = quarryStaticMatrix * (worldPosition + vec4(shadowWorldNormal * quarryStaticNormalBias, 0.0));
#endif
`;
const fragmentDeclarations = `
#if defined(USE_SHADOWMAP) && NUM_DIR_LIGHT_SHADOWS > 0
uniform sampler2D quarryStaticMap;
uniform vec2 quarryStaticSize;
uniform float quarryStaticEnabled;
uniform float quarryStaticBias;
varying vec4 vQuarryStaticCoord;
float quarryStaticVisibility() {
  if (quarryStaticEnabled < 0.5 || vQuarryStaticCoord.z < 0.0) return 1.0;
  return getShadow(quarryStaticMap, quarryStaticSize, 1.0, quarryStaticBias, 1.0, vQuarryStaticCoord);
}
#endif
`;
const nearShadowExpression = 'getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] )';

export class StaticQuarryShadows {
  readonly casterScene: T.Scene;
  readonly camera: T.OrthographicCamera;
  readonly bounds: T.Box3;
  private depthMaterials: T.MeshDepthMaterial[];
  private target: T.WebGLRenderTarget | null = null;
  private size = 0;
  private dirty = true;
  private materials = new WeakSet<T.Material>();
  private roots = new WeakSet<T.Object3D>();
  private uniforms = {
    quarryStaticMatrix: { value: new T.Matrix4() },
    quarryStaticMap: { value: null as T.Texture | null },
    quarryStaticSize: { value: new T.Vector2() },
    quarryStaticEnabled: { value: 0 },
    quarryStaticNormalBias: { value: .10 },
    quarryStaticBias: { value: -.00008 },
  };
  captures = 0;
  lastCaptureMs = 0;
  lastCaptureDraws = 0;
  lastCaptureTriangles = 0;
  enabled = true;

  constructor(source: T.Object3D, excluded: ReadonlySet<T.Object3D>) {
    const casters = staticCasterScene(source, excluded);
    this.casterScene = casters.scene; this.depthMaterials = casters.materials;
    this.bounds = new T.Box3().setFromObject(this.casterScene);
    if (this.bounds.isEmpty()) throw new Error('The static quarry shadow scene has no casters');
    this.camera = fitStaticShadowCamera(this.bounds);
    this.uniforms.quarryStaticMatrix.value.set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1)
      .multiply(this.camera.projectionMatrix).multiply(this.camera.matrixWorldInverse);
    this.setQuality('ultra');
  }

  bindReceivers(root: T.Object3D) {
    if (this.roots.has(root)) return;
    this.roots.add(root);
    root.traverse(object => {
      if (!(object instanceof T.Mesh)) return;
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        if (!(material instanceof T.MeshStandardMaterial) || this.materials.has(material)) continue;
        this.materials.add(material);
        const compile = material.onBeforeCompile;
        const key = material.customProgramCacheKey();
        material.onBeforeCompile = (shader, renderer) => {
          compile.call(material, shader, renderer);
          Object.assign(shader.uniforms, this.uniforms);
          shader.vertexShader = vertexDeclarations + shader.vertexShader;
          shader.vertexShader = shader.vertexShader.replace('#include <shadowmap_vertex>', '#include <shadowmap_vertex>\n' + vertexCoordinate);
          shader.fragmentShader = shader.fragmentShader.replace('#include <shadowmap_pars_fragment>', '#include <shadowmap_pars_fragment>\n' + fragmentDeclarations);
          // The quarry deliberately has one directional sun. Restrict the merge
          // to its index so future non-solar directional lights stay independent.
          const lights = T.ShaderChunk.lights_fragment_begin.replace(nearShadowExpression,
            'min(' + nearShadowExpression + ', (UNROLLED_LOOP_INDEX == 0 ? quarryStaticVisibility() : 1.0))');
          shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', lights);
        };
        material.customProgramCacheKey = () => key + '|quarry-static-shadow-v1';
        material.needsUpdate = true;
      }
    });
  }

  setQuality(quality: string) {
    const size = quality === 'ultra' ? 4096 : quality === 'high' ? 2048 : 0;
    if (size === this.size) return;
    this.target?.dispose(); this.target = null;
    this.uniforms.quarryStaticMap.value = null;
    this.uniforms.quarryStaticEnabled.value = 0;
    this.size = size; this.dirty = true;
    if (size) {
      this.target = new T.WebGLRenderTarget(size, size, { minFilter: T.NearestFilter, magFilter: T.NearestFilter,
        depthBuffer: true, stencilBuffer: false });
      this.target.texture.name = 'quarry-static-sun-depth';
      this.uniforms.quarryStaticSize.value.set(size, size);
      this.uniforms.quarryStaticNormalBias.value = .65 * Math.max(
        this.camera.right - this.camera.left, this.camera.top - this.camera.bottom) / size;
    }
  }

  invalidate() {
    this.dirty = true;
    this.uniforms.quarryStaticEnabled.value = 0;
  }

  prepare(renderer: T.WebGLRenderer) {
    this.uniforms.quarryStaticEnabled.value = this.enabled && this.target && !this.dirty ? 1 : 0;
    if (!this.enabled || !this.target || !this.dirty) return;
    const start = performance.now(), draws = renderer.info.render.calls, triangles = renderer.info.render.triangles;
    const oldTarget = renderer.getRenderTarget(), face = renderer.getActiveCubeFace(), mip = renderer.getActiveMipmapLevel();
    const clear = renderer.getClearColor(new T.Color()), alpha = renderer.getClearAlpha();
    const shadowEnabled = renderer.shadowMap.enabled, autoClear = renderer.autoClear;
    const scissor = renderer.getScissorTest();
    try {
      renderer.shadowMap.enabled = false;
      renderer.autoClear = true;
      renderer.setScissorTest(false);
      renderer.setClearColor(0xffffff, 1);
      renderer.setRenderTarget(this.target);
      renderer.render(this.casterScene, this.camera);
      this.uniforms.quarryStaticMap.value = this.target.texture;
      this.uniforms.quarryStaticEnabled.value = 1;
      this.dirty = false; this.captures++;
      this.lastCaptureDraws = renderer.info.render.calls - draws;
      this.lastCaptureTriangles = renderer.info.render.triangles - triangles;
      this.lastCaptureMs = performance.now() - start;
    } finally {
      renderer.shadowMap.enabled = shadowEnabled; renderer.autoClear = autoClear;
      renderer.setClearColor(clear, alpha);
      renderer.setRenderTarget(oldTarget, face, mip);
      renderer.setScissorTest(scissor);
    }
  }

  get stats() {
    return { enabled: this.enabled, size: this.size, captures: this.captures, captureCpuMs: this.lastCaptureMs,
      captureDraws: this.lastCaptureDraws, captureTriangles: this.lastCaptureTriangles,
      casters: this.casterScene.children.length, bounds: [this.bounds.min.toArray(), this.bounds.max.toArray()],
      camera: { position: this.camera.position.toArray(), left: this.camera.left, right: this.camera.right,
        top: this.camera.top, bottom: this.camera.bottom, near: this.camera.near, far: this.camera.far },
      mapAllocated: !!this.target, ready: !this.dirty && !!this.target };
  }
  dispose() {
    this.target?.dispose(); this.target = null;
    for (const material of this.depthMaterials) material.dispose();
    for (const mesh of this.casterScene.children) if (mesh instanceof T.InstancedMesh) mesh.dispose();
    // Shared source geometries, maps and live materials belong to the quarry.
    this.casterScene.clear(); this.uniforms.quarryStaticEnabled.value = 0;
  }
}
