// VFX: pooled CPU particles (additive fire/sparks + alpha smoke/dust),
// instanced debris chunks, expanding shockwave rings, pooled flash lights,
// tread marks, and screen-shake trauma.

import * as THREE from 'three';
import { getHeight, getNormal } from './terrain.js';
import { SCATTER } from './config.js';

function softCircleTexture(hard = false) {
  const s = 64;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(hard ? 0.5 : 0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(cv);
}

class ParticlePool {
  constructor(scene, count, { additive }) {
    this.count = count;
    this.pos = new Float32Array(count * 3);
    this.col = new Float32Array(count * 3);
    this.sizeAttr = new Float32Array(count);
    this.vel = new Float32Array(count * 3);
    this.life = new Float32Array(count);
    this.maxLife = new Float32Array(count);
    this.grow = new Float32Array(count);
    this.drag = new Float32Array(count);
    this.grav = new Float32Array(count);
    this.baseSize = new Float32Array(count);
    this.startAlpha = new Float32Array(count);
    this.head = 0;
    this.activeCap = count;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(this.sizeAttr, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: softCircleTexture(additive) } },
      vertexShader: /* glsl */`
        attribute float size;
        varying vec3 vCol;
        void main() {
          vCol = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (220.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        uniform sampler2D map;
        varying vec3 vCol;
        void main() {
          vec4 t = texture2D(map, gl_PointCoord);
          gl_FragColor = vec4(vCol, 1.0) * t;
        }`,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    scene.add(this.points);
    this.life.fill(-1);
  }

  emit(x, y, z, vx, vy, vz, life, size, r, g, b, { grow = 0, drag = 0, grav = 0 } = {}) {
    const i = this.head;
    this.head = (this.head + 1) % this.activeCap;
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = vx; this.vel[i * 3 + 1] = vy; this.vel[i * 3 + 2] = vz;
    this.life[i] = life; this.maxLife[i] = life;
    this.baseSize[i] = size;
    this.col[i * 3] = r; this.col[i * 3 + 1] = g; this.col[i * 3 + 2] = b;
    this.startAlpha[i] = 1;
    this.grow[i] = grow; this.drag[i] = drag; this.grav[i] = grav;
  }

  update(dt) {
    const { pos, vel, life, maxLife, sizeAttr, baseSize, grow, drag, grav } = this;
    for (let i = 0; i < this.count; i++) {
      if (life[i] < 0) { sizeAttr[i] = 0; continue; }
      life[i] -= dt;
      if (life[i] < 0) { sizeAttr[i] = 0; continue; }
      const dragF = 1 - drag[i] * dt;
      vel[i * 3] *= dragF;
      vel[i * 3 + 1] = vel[i * 3 + 1] * dragF + grav[i] * dt;
      vel[i * 3 + 2] *= dragF;
      pos[i * 3] += vel[i * 3] * dt;
      pos[i * 3 + 1] += vel[i * 3 + 1] * dt;
      pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
      const t = life[i] / maxLife[i];
      sizeAttr[i] = baseSize[i] * (1 + grow[i] * (1 - t)) * Math.min(1, t * 4);
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.size.needsUpdate = true;
    this.points.geometry.attributes.color.needsUpdate = true;
  }
}

export class Effects {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.fire = new ParticlePool(scene, 700, { additive: true });
    this.smoke = new ParticlePool(scene, 900, { additive: false });
    this.trauma = 0;
    this.time = 0;
    this.particleScale = 1;

    // debris chunks
    this.debrisCount = 90;
    const dGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
    const dMat = new THREE.MeshStandardMaterial({ color: 0x6b5a43, roughness: 1 });
    this.debris = new THREE.InstancedMesh(dGeo, dMat, this.debrisCount);
    this.debris.frustumCulled = false;
    this.debris.castShadow = false;
    scene.add(this.debris);
    this.debrisData = [];
    for (let i = 0; i < this.debrisCount; i++) {
      this.debrisData.push({ alive: false, p: new THREE.Vector3(), v: new THREE.Vector3(), rot: new THREE.Euler(), rv: new THREE.Vector3(), life: 0, scale: 1 });
    }
    this.debrisHead = 0;
    this.dummy = new THREE.Object3D();

    // shockwave rings
    this.rings = [];
    const ringGeo = new THREE.RingGeometry(0.8, 1, 28);
    ringGeo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 6; i++) {
      const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
        color: 0xffe6b8, transparent: true, opacity: 0, depthWrite: false,
      }));
      m.visible = false;
      scene.add(m);
      this.rings.push({ mesh: m, t: 0, dur: 0.5, scale: 8, active: false });
    }

    // pooled flash lights
    this.lights = [];
    for (let i = 0; i < 3; i++) {
      const l = new THREE.PointLight(0xffc278, 0, 36, 1.8);
      scene.add(l);
      this.lights.push({ light: l, t: 0, dur: 0.001, peak: 0 });
    }

    // tread marks
    const tmGeo = new THREE.PlaneGeometry(0.46, 0.85);
    tmGeo.rotateX(-Math.PI / 2);
    const tmMat = new THREE.MeshBasicMaterial({
      color: 0x2e2a20, transparent: true, opacity: 0.32, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -2,
    });
    this.marks = new THREE.InstancedMesh(tmGeo, tmMat, SCATTER.treadMarks);
    this.marks.frustumCulled = false;
    scene.add(this.marks);
    this.markData = new Array(SCATTER.treadMarks).fill(null).map(() => ({ born: -1e9 }));
    this.markHead = 0;
    this.markLife = 22;
    const zeroM = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < SCATTER.treadMarks; i++) this.marks.setMatrixAt(i, zeroM);
  }

  setParticleScale(s) { this.particleScale = s; }

  shake(amount) { this.trauma = Math.min(1.2, this.trauma + amount); }

  flashLight(pos, color, intensity, dur) {
    let slot = this.lights[0];
    for (const l of this.lights) if (l.t >= l.dur) { slot = l; break; }
    slot.light.position.copy(pos);
    slot.light.color.set(color);
    slot.t = 0;
    slot.dur = dur;
    slot.peak = intensity;
  }

  ring(pos, scale = 8, dur = 0.5) {
    const r = this.rings.find(r => !r.active) || this.rings[0];
    r.active = true;
    r.t = 0;
    r.dur = dur;
    r.scale = scale;
    r.mesh.position.copy(pos);
    r.mesh.position.y = getHeight(pos.x, pos.z) + 0.25;
    r.mesh.visible = true;
  }

  spawnDebris(pos, count, power, color = null) {
    count = Math.floor(count * this.particleScale);
    for (let i = 0; i < count; i++) {
      const d = this.debrisData[this.debrisHead];
      this.debrisHead = (this.debrisHead + 1) % this.debrisCount;
      d.alive = true;
      d.p.copy(pos);
      const a = Math.random() * Math.PI * 2;
      const up = 4 + Math.random() * 7 * power;
      d.v.set(Math.cos(a) * (2 + Math.random() * 6) * power, up, Math.sin(a) * (2 + Math.random() * 6) * power);
      d.rv.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
      d.life = 1.4 + Math.random();
      d.scale = 0.6 + Math.random() * 1.3;
    }
    if (color) this.debris.material.color.set(color);
  }

  muzzleFlash(pos, dir) {
    const n = Math.floor(16 * this.particleScale);
    for (let i = 0; i < n; i++) {
      const sp = 14 + Math.random() * 22;
      const jx = (Math.random() - 0.5) * 6, jy = (Math.random() - 0.5) * 6, jz = (Math.random() - 0.5) * 6;
      this.fire.emit(pos.x, pos.y, pos.z,
        dir.x * sp + jx, dir.y * sp + jy, dir.z * sp + jz,
        0.1 + Math.random() * 0.12, 1.6 + Math.random() * 2.2,
        1, 0.78, 0.35, { drag: 6, grow: 1.5 });
    }
    const m = Math.floor(10 * this.particleScale);
    for (let i = 0; i < m; i++) {
      this.smoke.emit(
        pos.x + dir.x * 0.8, pos.y + dir.y * 0.8, pos.z + dir.z * 0.8,
        dir.x * 6 + (Math.random() - 0.5) * 2.5, dir.y * 6 + 1 + Math.random(), dir.z * 6 + (Math.random() - 0.5) * 2.5,
        0.7 + Math.random() * 0.5, 1.4 + Math.random() * 1.6,
        0.62, 0.6, 0.56, { drag: 2.5, grow: 2.6 });
    }
    this.flashLight(pos, 0xffc887, 90, 0.09);
  }

  explosion(pos, power = 1) {
    const ps = this.particleScale;
    // fireball
    const nf = Math.floor(26 * ps * power);
    for (let i = 0; i < nf; i++) {
      const a = Math.random() * Math.PI * 2;
      const el = Math.random() * Math.PI - Math.PI / 2;
      const sp = (3 + Math.random() * 11) * power;
      this.fire.emit(pos.x, pos.y + 0.3, pos.z,
        Math.cos(a) * Math.cos(el) * sp, Math.abs(Math.sin(el)) * sp + 3, Math.sin(a) * Math.cos(el) * sp,
        0.25 + Math.random() * 0.35, (2.2 + Math.random() * 3) * power,
        1, 0.55 + Math.random() * 0.3, 0.18, { drag: 3, grow: 2.2 });
    }
    // sparks
    const nk = Math.floor(14 * ps * power);
    for (let i = 0; i < nk; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = (9 + Math.random() * 18) * power;
      this.fire.emit(pos.x, pos.y + 0.4, pos.z,
        Math.cos(a) * sp, 5 + Math.random() * 12, Math.sin(a) * sp,
        0.4 + Math.random() * 0.4, 0.55,
        1, 0.85, 0.5, { grav: -22, drag: 0.4 });
    }
    // smoke column
    const ns = Math.floor(20 * ps * power);
    for (let i = 0; i < ns; i++) {
      const g = 0.18 + Math.random() * 0.2;
      this.smoke.emit(
        pos.x + (Math.random() - 0.5) * 1.6 * power, pos.y + Math.random() * 1.2, pos.z + (Math.random() - 0.5) * 1.6 * power,
        (Math.random() - 0.5) * 2.5, 2.5 + Math.random() * 4.5, (Math.random() - 0.5) * 2.5,
        1.1 + Math.random() * 1.3, (2.6 + Math.random() * 3.4) * power,
        g, g * 0.95, g * 0.88, { drag: 1.4, grow: 3.2 });
    }
    // dirt kicked up
    this.spawnDebris(pos, 8 * power, power);
    this.ring(pos, 7 * power, 0.45);
    this.flashLight(pos, 0xffb24f, 160 * power, 0.16);
    const d = this.camera.position.distanceTo(pos);
    this.shake(Math.min(0.7, 26 * power / Math.max(8, d)));
  }

  dustPuff(x, y, z, amount = 1) {
    const n = Math.floor(2 * amount * this.particleScale);
    for (let i = 0; i < n; i++) {
      const g = 0.52 + Math.random() * 0.1;
      this.smoke.emit(
        x + (Math.random() - 0.5) * 1.4, y + 0.2, z + (Math.random() - 0.5) * 1.4,
        (Math.random() - 0.5) * 1.8, 0.8 + Math.random() * 1.4, (Math.random() - 0.5) * 1.8,
        0.7 + Math.random() * 0.7, 1.1 + Math.random() * 1.4,
        g, g * 0.94, g * 0.8, { drag: 1.8, grow: 2.4 });
    }
  }

  shellTrail(pos) {
    if (Math.random() > 0.55 * this.particleScale) return;
    const g = 0.7;
    this.smoke.emit(pos.x, pos.y, pos.z, 0, 0.4, 0,
      0.35 + Math.random() * 0.25, 0.7,
      g, g, g, { grow: 1.8 });
  }

  treadMark(x, z, yaw) {
    const i = this.markHead;
    this.markHead = (this.markHead + 1) % this.marks.count;
    this.markData[i].born = this.time;
    const n = getNormal(x, z);
    this.dummy.position.set(x, getHeight(x, z) + 0.04, z);
    this.dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    this.dummy.rotateY(yaw);
    this.dummy.scale.setScalar(1);
    this.dummy.updateMatrix();
    this.marks.setMatrixAt(i, this.dummy.matrix);
    this.marks.instanceMatrix.needsUpdate = true;
  }

  burningWreck(pos) {
    // a few seconds of fire+smoke at a dead tank
    const n = Math.floor(3 * this.particleScale);
    for (let i = 0; i < n; i++) {
      this.fire.emit(pos.x + (Math.random() - 0.5), pos.y + 1.4, pos.z + (Math.random() - 0.5),
        (Math.random() - 0.5), 1.5 + Math.random() * 2, (Math.random() - 0.5),
        0.35, 1.6 + Math.random(), 1, 0.5, 0.15, { grow: 1.4, drag: 1 });
      const g = 0.16;
      this.smoke.emit(pos.x + (Math.random() - 0.5), pos.y + 2, pos.z + (Math.random() - 0.5),
        (Math.random() - 0.5) * 1.5, 2.4 + Math.random() * 2, (Math.random() - 0.5) * 1.5,
        1.6, 2.8, g, g, g, { grow: 3, drag: 1 });
    }
  }

  update(dt) {
    this.time += dt;
    this.fire.update(dt);
    this.smoke.update(dt);

    // debris
    for (let i = 0; i < this.debrisCount; i++) {
      const d = this.debrisData[i];
      if (!d.alive) {
        this.dummy.scale.setScalar(0);
        this.dummy.position.set(0, -100, 0);
      } else {
        d.life -= dt;
        d.v.y -= 22 * dt;
        d.p.addScaledVector(d.v, dt);
        const ground = getHeight(d.p.x, d.p.z);
        if (d.p.y < ground + 0.1) {
          d.p.y = ground + 0.1;
          d.v.y = Math.abs(d.v.y) * 0.3;
          d.v.x *= 0.7; d.v.z *= 0.7;
        }
        d.rot.x += d.rv.x * dt; d.rot.y += d.rv.y * dt; d.rot.z += d.rv.z * dt;
        if (d.life <= 0) d.alive = false;
        this.dummy.position.copy(d.p);
        this.dummy.rotation.copy(d.rot);
        this.dummy.scale.setScalar(Math.max(0, Math.min(1, d.life * 2)) * d.scale);
      }
      this.dummy.updateMatrix();
      this.debris.setMatrixAt(i, this.dummy.matrix);
    }
    this.debris.instanceMatrix.needsUpdate = true;

    // rings
    for (const r of this.rings) {
      if (!r.active) continue;
      r.t += dt;
      const t = r.t / r.dur;
      if (t >= 1) { r.active = false; r.mesh.visible = false; continue; }
      const s = 1 + t * r.scale;
      r.mesh.scale.set(s, 1, s);
      r.mesh.material.opacity = 0.55 * (1 - t);
    }

    // lights
    for (const l of this.lights) {
      l.t += dt;
      const t = Math.min(1, l.t / l.dur);
      l.light.intensity = l.peak * (1 - t) * (1 - t);
    }

    this.trauma = Math.max(0, this.trauma - dt * 1.6);
  }

  // camera shake offset, call after camera positioned
  applyShake(camera) {
    if (this.trauma <= 0) return;
    const t = this.time * 31;
    const s = this.trauma * this.trauma;
    camera.position.x += Math.sin(t * 1.1) * 0.25 * s;
    camera.position.y += Math.sin(t * 1.7 + 2) * 0.22 * s;
    camera.rotation.z += Math.sin(t * 1.4 + 4) * 0.012 * s;
  }
}
