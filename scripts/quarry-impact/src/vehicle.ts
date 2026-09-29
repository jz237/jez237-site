import {ImpactResponse} from './impact-response';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { cloneCar } from './assets';
import {
  DEFINITIONS,
  clamp,
  surfaceAt,
  terrainHeight,
  type CarKind,
} from './rules';
import { Effects } from './effects';
import { landscapeHeight } from './quarry-layout';
import type { GlassState } from './car-materials';
import { repairCoupePanel } from './coupe-realism';
import { dentGeometry, repairWreckGeometry } from './wreck-geometry';
export type Input = {
  throttle: number;
  steer: number;
  brake: number;
  handbrake: boolean;
};
export class Vehicle {
  body: R.RigidBody;
  collider: R.Collider;
  roof: R.Collider;
  controller: R.DynamicRayCastVehicleController;
  root = new T.Group();
  model: T.Group;
  wheels: T.Object3D[] = [];
  panels: T.Mesh[] = [];
  readonly impactResponse = new ImpactResponse();
  impactEffects = {glass:false,debris:false};
  glass: T.Mesh[] = [];
  brakeLights = new Set<T.MeshStandardMaterial>();
  health = 100;
  inflicted = 0;
  speed = 0;
  rpm = 850;
  gear = 1;
  oldGear = 1;
  steering = 0;
  input: Input = { throttle: 0, steer: 0, brake: 0, handbrake: false };
  slip = 0;
  remoteGrounded?: boolean;
  surface = 'gravel';
  damageLeft = 0;
  damageRight = 0;
  stuck = 0;
  reverse = 0;
  target = 0;
  nextCheckpoint = 1;
  checkpointDistance = Infinity;
  passed = 0;
  lap = 1;
  finished = false;
  finishTime = 0;
  penalty = 0;
  lastHit = -100;
  lastDamage = 0;
  impactSerial = 0;
  lastFx = 0;
  rollTime = 0;
  offTrackTime = 0;
  previous = new T.Vector3();
  previousQ = new T.Quaternion();
  current = new T.Vector3();
  currentQ = new T.Quaternion();
  velocity = new T.Vector3();
  forward = new T.Vector3();
  right = new T.Vector3();
  wheelSpin = 0;
  aiPhase: number;
  constructor(
    public id: number,
    public kind: CarKind,
    color: number,
    public scene: T.Scene,
    public world: R.World,
    public fx: Effects,
  ) {
    const def = DEFINITIONS[kind];
    this.aiPhase = id * 1.79;
    this.model = cloneCar(kind, color);
    this.root.add(this.model);
    scene.add(this.root);
    this.body = world.createRigidBody(
      R.RigidBodyDesc.dynamic()
        .setLinearDamping(0.06)
        .setAngularDamping(0.65)
        .setCcdEnabled(true)
        .setCanSleep(true),
    );
    this.collider = world.createCollider(
      R.ColliderDesc.cuboid(def.halfWidth - 0.06, 0.25, def.halfLength - 0.12)
        .setMass(def.mass)
        .setFriction(0.45)
        .setRestitution(0.12)
        .setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS)
        .setContactForceEventThreshold(15000),
      this.body,
    );
    this.roof = world.createCollider(
      R.ColliderDesc.cuboid(0.65, 0.24, 0.65)
        .setTranslation(0, kind === 'coupe' ? .12 : .2, -0.1)
        .setMass(0)
        .setFriction(0.5)
        .setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS)
        .setContactForceEventThreshold(15000),
      this.body,
    );
    this.controller = world.createVehicleController(this.body);
    this.controller.indexUpAxis = 1;
    this.controller.setIndexForwardAxis = 2;
    for (const [name, x, z] of [
      ['FL', -1, 1],
      ['FR', 1, 1],
      ['RL', -1, -1],
      ['RR', 1, -1],
    ] as [string, number, number][]) {
      const i = this.controller.numWheels();
      const wheel = this.model.getObjectByName('wheel_' + name)!;
      this.wheels.push(wheel);
      this.controller.addWheel(
        { x: x * (def.halfWidth - 0.04), y: -0.12, z: (z * def.wheelbase) / 2 },
        { x: 0, y: -1, z: 0 },
        { x: -1, y: 0, z: 0 },
        0.36,
        0.375,
      );
      this.controller.setWheelSuspensionStiffness(i, 30);
      this.controller.setWheelSuspensionCompression(i, 4.4);
      this.controller.setWheelSuspensionRelaxation(i, 5.4);
      this.controller.setWheelMaxSuspensionTravel(i, 0.24);
      this.controller.setWheelMaxSuspensionForce(i, 13000);
      this.controller.setWheelFrictionSlip(i, 2.1);
      this.controller.setWheelSideFrictionStiffness(i, 1.1);
    }
    this.model.traverse((o) => {
      if (o instanceof T.Mesh) {
        if (o.name.startsWith('panel_')) this.panels.push(o);
        if (o.name.startsWith('glass_')) this.glass.push(o);
        const mat = o.material as T.MeshStandardMaterial;
        if (mat.name.includes('Brakelight')) this.brakeLights.add(mat);
      }
    });
  }
  place(x: number, z: number, yaw: number, repair = false) {
    const p = { x, y: landscapeHeight(x, z) + 0.89, z };
    const q = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), yaw);
    this.body.setTranslation(p, true);
    this.body.setRotation(q, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.previous.copy(p);
    this.current.copy(p);
    this.previousQ.copy(q);
    this.currentQ.copy(q);
    this.root.position.copy(p);
    this.root.quaternion.copy(q);
    this.rollTime = 0;
    this.stuck = 0;
    if (repair) this.repair();
  }
  repair() {
    this.impactResponse.reset();
    this.impactEffects = {glass:false,debris:false};
    this.health = 100;
    this.damageLeft = this.damageRight = 0;
    this.lastHit = -100;
    this.lastDamage = 0;
    this.impactSerial = 0;
    this.roof.setEnabled(true);
    this.collider.setHalfExtents({
      x: DEFINITIONS[this.kind].halfWidth - 0.06,
      y: 0.25,
      z: DEFINITIONS[this.kind].halfLength - 0.12,
    });
    for (const p of this.panels) {
      p.visible = true;
      p.userData.damage = 0;
      (p.geometry.attributes.position.array as Float32Array).set(
        p.userData.original,
      );
      p.geometry.attributes.position.needsUpdate = true;
      if (p.userData.originalNormals) {
        (p.geometry.attributes.normal.array as Float32Array).set(p.userData.originalNormals);
        p.geometry.attributes.normal.needsUpdate = true;
      } else p.geometry.computeVertexNormals();
      p.geometry.computeBoundingSphere();
      const wear = p.geometry.attributes.impactWear;
      if (wear) { (wear.array as Float32Array).fill(0); wear.needsUpdate = true; }
      repairCoupePanel(p);
      p.geometry.deleteAttribute('color');
      (p.material as T.MeshStandardMaterial).vertexColors = false;
      (p.material as T.Material).needsUpdate = true;
    }
    for (const g of this.glass) {
      repairWreckGeometry(g);
      g.visible = true;
      g.userData.damage = 0;
      (g.material as T.MeshStandardMaterial).opacity = this.kind === 'coupe' ? .24 : .28;
      const state = (g.material as T.Material).userData.glassState as GlassState | undefined;
      if (state) state.damage.value = 0;
    }
  }
  preStep(dt: number) {
    this.previous.copy(this.body.translation());
    this.previousQ.copy(this.body.rotation());
    this.velocity.copy(this.body.linvel());
    this.forward.set(0, 0, 1).applyQuaternion(this.previousQ);
    this.right.set(1, 0, 0).applyQuaternion(this.previousQ);
    this.speed = this.velocity.dot(this.forward);
    const lateral = this.velocity.dot(this.right);
    this.slip = Math.abs(lateral);
    this.surface = surfaceAt(this.previous.x, this.previous.z);
    const alive = this.health > 0;
    const steerTarget =
      (alive ? this.input.steer : 0) *
        (0.55 / (1 + Math.abs(this.speed) * 0.016)) +
      (this.damageRight - this.damageLeft) * 0.0007;
    this.steering = T.MathUtils.damp(this.steering, steerTarget, 8, dt);
    const def = DEFINITIONS[this.kind];
    const force = alive
      ? this.input.throttle *
        def.force *
        (0.45 + (0.55 * this.health) / 100) *
        clamp(1 - Math.max(0, Math.abs(this.speed) - 43) / 10, 0, 1)
      : 0;
    for (let i = 0; i < 4; i++) {
      this.controller.setWheelSteering(i, i < 2 ? this.steering : 0);
      this.controller.setWheelEngineForce(
        i,
        force * (this.kind === 'coupe' ? (i > 1 ? 0.5 : 0) : 0.25),
      );
      this.controller.setWheelBrake(
        i,
        !alive
          ? 18
          : this.input.brake * 90 + (this.input.handbrake && i > 1 ? 100 : 0),
      );
      this.controller.setWheelFrictionSlip(
        i,
        (this.surface === 'asphalt' ? 3.2 : 2.4) *
          (this.input.handbrake && i > 1 ? 0.6 : 1),
      );
      this.controller.setWheelSuspensionStiffness(
        i,
        30 - (i % 2 ? this.damageRight : this.damageLeft) * 0.06,
      );
    }
    this.controller.updateVehicle(
      dt,
      undefined,
      undefined,
      (c) => c.parent()?.handle !== this.body.handle,
    );
    // Gentle yaw damping avoids the perpetual spins of arcade steering while retaining slides.
    const up = new T.Vector3(0, 1, 0).applyQuaternion(this.previousQ);
    if (up.y > 0.5) {
      const av = this.body.angvel();
      this.body.applyTorqueImpulse(
        {
          x: -av.x * def.mass * 0.07 * dt,
          y:
            (clamp(
              (this.speed / def.wheelbase) * Math.tan(this.steering) * 0.72,
              -1.7,
              1.7,
            ) -
              av.y) *
            def.mass *
            2.6 *
            dt,
          z: -av.z * def.mass * 0.07 * dt,
        },
        true,
      );
    }
    this.oldGear = this.gear;
    this.gear =
      this.speed < -0.5
        ? 0
        : clamp(1 + Math.floor(Math.max(0, this.speed) / 9), 1, 5);
    this.rpm = alive
      ? 850 +
        ((Math.abs(this.speed) % 9) / 9) * 4600 +
        Math.abs(this.input.throttle) * 700
      : 0;
  }
  postStep(dt: number, time: number) {
    this.current.copy(this.body.translation());
    this.currentQ.copy(this.body.rotation());
    const up = new T.Vector3(0, 1, 0).applyQuaternion(this.currentQ);
    this.rollTime = up.y < 0.2 ? this.rollTime + dt : 0;
    this.root.position.copy(this.current);
    this.root.quaternion.copy(this.currentQ);
    if (time - this.lastFx > 0.06) {
      this.lastFx = time;
      for (let i = 0; i < 4; i++) {
        const point = this.controller.wheelContactPoint(i);
        if (!point || !this.controller.wheelIsInContact(i)) continue;
        const p = new T.Vector3().copy(point);
        if (Math.abs(this.speed) > 3 && this.surface === 'gravel')
          this.fx.emit(p, 1, 0, Math.abs(this.speed) * 0.04);
        if (this.slip > 2 || this.input.handbrake) {
          if (this.surface === 'asphalt')
            this.fx.mark(
              p,
              Math.atan2(this.forward.x, this.forward.z),
              Math.max(0.2, Math.abs(this.speed) * 0.09),
            );
          else this.fx.emit(p, 2, 0, 1);
        }
      }
    }
  }
  render(alpha: number) {
    this.root.position.lerpVectors(this.previous, this.current, alpha);
    this.root.quaternion.slerpQuaternions(this.previousQ, this.currentQ, alpha);
    for (const material of this.brakeLights) material.emissiveIntensity = this.input.brake > .05 || this.input.handbrake ? 3.5 : .8;
    for (let i = 0; i < 4; i++) {
      const w = this.wheels[i];
      if (!w) continue;
      w.position.y =
        -this.model.position.y - 0.12 - (this.controller.wheelSuspensionLength(i) ?? 0.36);
      const sideDamage = i % 2 ? this.damageRight : this.damageLeft;
      w.rotation.set(0, i < 2 ? this.steering : 0, (i % 2 ? -1 : 1) * Math.min(.19, sideDamage * .002));
      w.rotateX(-(this.controller.wheelRotation(i) ?? 0));
    }
  }
  hit(point: T.Vector3, direction: T.Vector3, damage: number, time: number, quiet = false) {
    this.impactEffects = {glass:false,debris:false};
    if (damage < 0.1 || this.health <= 0) return;
    this.health = Math.max(0, this.health - damage);
    this.lastHit = time;
    this.lastDamage = damage;
    this.impactSerial++;
    if (!quiet) this.impactResponse.kick(direction,damage,direction.dot(this.right),direction.dot(this.forward));
    this.root.updateMatrixWorld(true);
    const local = this.root.worldToLocal(point.clone());
    if (local.x < 0) this.damageLeft += damage;
    else this.damageRight += damage;
    const contact = this.model.worldToLocal(point.clone());
    const impactDirection = direction.clone().transformDirection(this.model.matrixWorld.clone().invert());
    const assemblies = new Map<string, { panels: T.Mesh[]; damage: number; weight: number }>();
    for (const panel of this.panels) {
      if (!panel.visible) continue;
      const maximum = dentGeometry(panel, contact, impactDirection, damage);
      panel.userData.damage = (panel.userData.damage || 0) + damage * maximum;
      const assembly = panel.userData.detachAssembly as string | null;
      if (assembly) {
        if (!assemblies.has(assembly)) assemblies.set(assembly, { panels: [], damage: 0, weight: 0 });
        const group = assemblies.get(assembly)!;
        group.panels.push(panel);
        group.damage = Math.max(group.damage, panel.userData.damage);
        group.weight = Math.max(group.weight, maximum);
      }
    }
    // Finish deforming every member before releasing any of them. Grilles,
    // mirror inserts and bonnet vents cannot remain suspended over a wreck.
    for (const [name, group] of assemblies) {
      const threshold = name === 'hood' ? 36 : name.startsWith('mirror') ? 22 : 28;
      if (group.damage <= threshold || damage <= 7 || group.weight <= .18) continue;
      for (const panel of group.panels) {
        if (quiet) panel.visible = false;
        else this.fx.detach(panel, this.velocity.clone().multiplyScalar(.65));
      }
      if (!quiet) this.impactEffects.debris = true;
    }
    for (const glass of this.glass) {
      if (!glass.visible) continue;
      dentGeometry(glass, contact, impactDirection, damage);
      const bounds = new T.Box3().setFromObject(glass);
      const distance = bounds.distanceToPoint(point);
      if (distance < 1.25 && damage > 3) {
        const before = glass.userData.damage || 0;
        glass.userData.damage = before + damage * (1 - distance / 1.25);
        if (before < 7 && glass.userData.damage >= 7 || before <= 24 && glass.userData.damage > 24) this.impactEffects.glass = true;
        const mat = glass.material as T.MeshPhysicalMaterial;
        const state = mat.userData.glassState as GlassState | undefined;
        if (state) {
          state.damage.value = Math.min(1, glass.userData.damage / 24);
          state.impact.value.copy(glass.worldToLocal(point.clone()));
        }
        const laminated = /Windshield|Rearwindow/.test(glass.name);
        // Laminated screens retain their shattered sheet. Tempered side glass
        // cracks first, then releases fragments on a second substantial blow.
        if (!laminated && glass.userData.damage > 24) glass.visible = false;
        if (!quiet) this.fx.emit(bounds.getCenter(new T.Vector3()), Math.ceil(damage * .55), 3, 1.7);
      }
    }
    const def = DEFINITIONS[this.kind];
    this.collider.setHalfExtents({
      x: def.halfWidth - 0.06 - (100 - this.health) * 0.0008,
      y: 0.25,
      z: def.halfLength - 0.12 - (100 - this.health) * 0.0015,
    });
    if (!quiet) {
      this.fx.impact?.(point, direction, damage);
    }
  }
  dispose() {
    this.world.removeVehicleController(this.controller);
    this.world.removeRigidBody(this.body);
    this.root.removeFromParent();
    const materials = new Set<T.Material>();
    this.model.traverse((o) => {
      if (o instanceof T.Mesh) {
        if (/^(panel_|glass_)/.test(o.name)) o.geometry.dispose();
        materials.add(o.material as T.Material);
      }
    });
    for (const material of materials) material.dispose();
  }
}
