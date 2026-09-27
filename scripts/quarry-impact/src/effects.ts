import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
type Particle = {
  p: T.Vector3;
  v: T.Vector3;
  life: number;
  max: number;
  size: number;
  type: number;
};
export class Effects {
  particles: Particle[] = [];
  cursor = 0;
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  alphas: Float32Array;
  geometry: T.BufferGeometry;
  points: T.Points;
  debris: { mesh: T.Mesh; body: R.RigidBody; age: number }[] = [];
  marks: T.InstancedMesh;
  markCursor = 0;
  constructor(
    public scene: T.Scene,
    public world: R.World,
  ) {
    const count = 1800;
    this.positions = new Float32Array(count * 3);
    this.colors = new Float32Array(count * 3);
    this.sizes = new Float32Array(count);
    this.alphas = new Float32Array(count);
    this.geometry = new T.BufferGeometry();
    for (const [name, array, size] of [
      ['position', this.positions, 3],
      ['color', this.colors, 3],
      ['size', this.sizes, 1],
      ['alpha', this.alphas, 1],
    ] as const)
      this.geometry.setAttribute(name, new T.BufferAttribute(array, size));
    const material = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      uniforms: { scale: { value: window.innerHeight } },
      vertexShader:
        'attribute float size; attribute float alpha; varying vec3 vColor; varying float vAlpha; uniform float scale; void main(){vColor=color;vAlpha=alpha;vec4 p=modelViewMatrix*vec4(position,1.);gl_PointSize=min(100.,size*scale/max(1.,-p.z));gl_Position=projectionMatrix*p;}',
      fragmentShader:
        'varying vec3 vColor; varying float vAlpha; void main(){float r=length(gl_PointCoord-.5)*2.;float a=smoothstep(1.,.05,r)*vAlpha;gl_FragColor=vec4(vColor,a);}',
    });
    this.points = new T.Points(this.geometry, material);
    this.points.frustumCulled = false;
    scene.add(this.points);
    for (let i = 0; i < count; i++)
      this.particles.push({
        p: new T.Vector3(),
        v: new T.Vector3(),
        life: 0,
        max: 1,
        size: 1,
        type: 0,
      });
    this.marks = new T.InstancedMesh(
      new T.PlaneGeometry(0.24, 1),
      new T.MeshBasicMaterial({
        color: 0x24221e,
        transparent: true,
        opacity: 0.23,
        depthWrite: false,
      }),
      1000,
    );
    this.marks.instanceMatrix.setUsage(T.DynamicDrawUsage);
    const mat = new T.Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < 1000; i++) this.marks.setMatrixAt(i, mat);
    this.marks.frustumCulled = false;
    scene.add(this.marks);
  }
  emit(p: T.Vector3, count: number, type = 0, force = 1) {
    for (let j = 0; j < count; j++) {
      const i = this.cursor++ % this.particles.length,
        s = this.particles[i];
      s.p
        .copy(p)
        .add(
          new T.Vector3(
            (Math.random() - 0.5) * 0.4,
            Math.random() * 0.3,
            (Math.random() - 0.5) * 0.4,
          ),
        );
      s.v.set(
        (Math.random() - 0.5) * force,
        (type === 1 ? 1 + Math.random() * 4 : 0.2 + Math.random()) * force,
        (Math.random() - 0.5) * force,
      );
      s.max = s.life =
        type === 1 ? 0.3 + Math.random() * 0.5 : 1.5 + Math.random() * 2;
      s.size = type === 1 ? 0.025 : 0.2 + Math.random() * 0.3;
      s.type = type;
      const col = new T.Color(
        type === 1 ? 0xffb954 : type === 2 ? 0x3c3b37 : 0xafa28b,
      );
      col.toArray(this.colors, i * 3);
    }
  }
  mark(p: T.Vector3, yaw: number, length: number) {
    const d = new T.Object3D();
    d.position.copy(p);
    d.position.y += 0.035;
    d.rotation.set(-Math.PI / 2, 0, -yaw);
    d.scale.set(1, length, 1);
    d.updateMatrix();
    this.marks.setMatrixAt(this.markCursor++ % 1000, d.matrix);
    this.marks.instanceMatrix.needsUpdate = true;
  }
  detach(source: T.Mesh, velocity: T.Vector3) {
    if (this.debris.length >= 36) this.removeDebris(0);
    source.updateWorldMatrix(true, false);
    const geometry = source.geometry.clone();
    geometry.computeBoundingBox();
    const center = geometry.boundingBox!.getCenter(new T.Vector3());
    geometry.translate(-center.x, -center.y, -center.z);
    const mesh = new T.Mesh(geometry, (source.material as T.Material).clone());
    source.matrixWorld.decompose(mesh.position, mesh.quaternion, mesh.scale);
    mesh.position.copy(center.applyMatrix4(source.matrixWorld));
    mesh.castShadow = true;
    this.scene.add(mesh);
    source.visible = false;
    const b = this.world.createRigidBody(
      R.RigidBodyDesc.dynamic()
        .setTranslation(mesh.position.x, mesh.position.y, mesh.position.z)
        .setRotation(mesh.quaternion)
        .setLinvel(velocity.x, velocity.y + 2, velocity.z)
        .setAngularDamping(0.4),
    );
    const bounds = new T.Box3()
      .setFromBufferAttribute(
        source.geometry.attributes.position as T.BufferAttribute,
      )
      .getSize(new T.Vector3())
      .multiply(mesh.scale);
    this.world.createCollider(
      R.ColliderDesc.cuboid(
        Math.max(0.08, bounds.x * 0.4),
        Math.max(0.06, bounds.y * 0.3),
        Math.max(0.08, bounds.z * 0.4),
      )
        .setMass(12)
        .setRestitution(0.3),
      b,
    );
    b.setAngvel({ x: 2, y: 1, z: 3 }, true);
    this.debris.push({ mesh, body: b, age: 0 });
  }
  removeDebris(i: number) {
    const d = this.debris[i];
    this.world.removeRigidBody(d.body);
    this.scene.remove(d.mesh);
    d.mesh.geometry.dispose();
    (d.mesh.material as T.Material).dispose();
    this.debris.splice(i, 1);
  }
  update(dt: number) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.life > 0) {
        p.life -= dt;
        p.p.addScaledVector(p.v, dt);
        p.v.y += (p.type === 1 ? -7 : 0.18) * dt;
        p.v.multiplyScalar(Math.exp(-dt * 0.6));
        this.positions.set(p.p.toArray(), i * 3);
        this.sizes[i] =
          p.size * (p.type === 1 ? 1 : 1 + (p.max - p.life) * 1.8);
        this.alphas[i] =
          Math.max(0, p.life / p.max) * (p.type === 1 ? 1 : 0.28);
      } else this.alphas[i] = 0;
    }
    for (const a of Object.values(this.geometry.attributes))
      a.needsUpdate = true;
    for (const d of this.debris) {
      d.age += dt;
      d.mesh.position.copy(d.body.translation());
      d.mesh.quaternion.copy(d.body.rotation());
    }
  }
  reset() {
    for (const p of this.particles) p.life = 0;
    while (this.debris.length) this.removeDebris(0);
    const mat = new T.Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < 1000; i++) this.marks.setMatrixAt(i, mat);
    this.marks.instanceMatrix.needsUpdate = true;
    this.markCursor = 0;
  }
}
