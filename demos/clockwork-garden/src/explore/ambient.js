import * as THREE from 'three';
import { Butterfly } from '../creatures/butterfly.js';
import { Dragonfly } from '../creatures/dragonfly.js';
import { Bird } from '../creatures/bird.js';
import { Bee } from '../creatures/bee.js';
import { APX9Bee } from '../creatures/apx9.js';
import { orient } from '../creatures/manager.js';
import { RNG } from '../core/rng.js';
import { clamp, lerp, smooth } from '../core/ease.js';
import { L } from '../world/layout.js';
import { groundHeight } from './bounds.js';

// Ambient life for the interactive modes, on the real-time clock.
//   butterflies  flutter between blooms and settle; scatter when the bee rushes them
//   dragonflies  hover and dart; one takes a liking to the bee and escorts it a while
//   hummingbirds visit the glass blossom and the lilies; turn to inspect the bee
//   skep bees    worker bees circle the hive; they dance after every deposit
//   songbird     sings on its copper bough, watches the bee, flies a loop if crowded

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;
const damp = (r, dt) => 1 - Math.exp(-r * dt);

export class Ambient {
  constructor({ world, mat, quality, bounds, audio, skep }) {
    this.world = world;
    this.bounds = bounds;
    this.audio = audio;
    this.skep = skep;
    this.group = new THREE.Group();
    this.group.name = 'ambient';
    this.rng = new RNG('ambient');
    this.t = 0;
    const low = quality.tier === 'low';
    const add = (c) => { this.group.add(c.group); return c; };
    const r = this.rng;
    // blooms the butterflies like (far-field tops and the hero-area props)
    this.perches = world.flora.flowers.map((f) => ({ p: f.top.clone().add(V(0, 1.2 * f.scale + 0.4, 0)), f }));

    this.butterflies = [];
    const nB = low ? 4 : 7;
    for (let i = 0; i < nB; i++) {
      const sp = i % 3 === 1 ? 'swallowtail' : 'monarch';
      const c = add(new Butterfly(mat, sp, { detail: 'mid' }));
      c.group.scale.setScalar(r.range(1.2, 1.6));
      const p = this.perches[Math.floor(r.float() * this.perches.length)];
      this.butterflies.push({ c, pos: p.p.clone(), vel: V(), state: 'perch', timer: r.range(1, 6), target: p, ph: r.range(0, TAU), freq: r.range(2.4, 3.3), yaw: r.range(0, TAU) });
    }
    this.dragonflies = [];
    for (let i = 0; i < (low ? 2 : 3); i++) {
      const c = add(new Dragonfly(mat, { palette: i % 2 ? 'sapphire' : 'teal' }));
      c.group.scale.setScalar(1.5);
      const home = [V(70, 22, -560), V(-20, 18, 30), V(60, 16, -60)][i];
      this.dragonflies.push({ c, pos: home.clone(), from: home.clone(), to: home.clone(), home, state: 'hover', timer: r.range(0.5, 2), dart: 0, escort: i === 1 ? 0 : -1, face: V(1, 0, 0) });
    }
    this.hummingbirds = [];
    for (let i = 0; i < (low ? 1 : 2); i++) {
      const c = add(new Bird(mat, 'hummingbird'));
      c.group.scale.setScalar(1.25);
      const p = V(-20 + i * 60, 30, -40 - i * 80);
      this.hummingbirds.push({ c, pos: p, vel: V(), state: 'travel', timer: 0, target: null, face: V(0, 0, 1), spot: null });
    }
    this.workers = [];
    const sk = world.skep.group.position;
    for (let i = 0; i < (low ? 2 : 4); i++) {
      const c = i < 2 ? add(new APX9Bee(mat, { detail: 'lod', quality })) : add(new Bee(mat, 'honey', { detail: 'mid' }));
      if (i >= 2) c.group.scale.setScalar(1.0);
      this.workers.push({ c, i, r: 7 + i * 1.8, h: 6 + i * 1.3, a: i * 1.7, speed: 0.55 + i * 0.1, apx: i < 2, c0: sk.clone() });
    }
    this.song = add(new Bird(mat, 'songbird'));
    this.songPerch = world.tree.perchWorld(0.72);
    const pt = world.tree.perchCurve.getTangentAt(0.72).applyQuaternion(world.tree.group.quaternion);
    this.songFace = V(-pt.z, 0, pt.x).normalize();
    if (this.songFace.dot(V(1, 0, 1)) < 0) this.songFace.negate();
    this.songState = { state: 'perch', timer: 0, nextSong: 3, yaw: 0, loopT: 0 };
    this.group.traverse((o) => { if (o.isMesh) o.castShadow = o.castShadow && !low; });
    this.celebrate = -100;
  }

  _flowerNear(p, rMin, rMax) {
    const r = this.rng;
    for (let k = 0; k < 30; k++) {
      const c = this.perches[Math.floor(r.float() * this.perches.length)];
      const d = Math.hypot(c.p.x - p.x, c.p.z - p.z);
      if (d > rMin && d < rMax) return c;
    }
    return this.perches[Math.floor(r.float() * this.perches.length)];
  }

  onDeposit() { this.celebrate = this.t; }

  update(dt, bee, camera, frustum) {
    this.t += dt;
    const t = this.t;
    const r = this.rng;
    const bp = bee.pos;
    const inView = (p) => frustum.containsPoint(p);
    // keep the sightline to APX-9 clear: nothing on the wing may hover in the
    // cone between the camera and the bee (chase and follow cameras look
    // through it). `size` is the creature's half-span, so wings and tails stay
    // clear too; anything inside is moved out sideways to the cone's edge.
    const cam = camera.position;
    const toBee = bp.clone().sub(cam);
    const len2 = toBee.lengthSq();
    const clearSight = (p, size) => {
      if (len2 < 1) return;
      const k = p.clone().sub(cam).dot(toBee) / len2;
      if (k <= 0.02 || k >= 0.97) return;
      const closest = cam.clone().addScaledVector(toBee, k);
      const off = p.clone().sub(closest);
      const need = 0.5 + 2.4 * k + size;
      const dd = off.length();
      if (dd >= need) return;
      if (dd < 1e-3) off.set(-toBee.z, 0, toBee.x);
      p.add(off.normalize().multiplyScalar(need - dd));
    };

    // ---- butterflies ---------------------------------------------------------
    for (const b of this.butterflies) {
      const d = b.pos.distanceTo(bp);
      // keep the cast near the action: far, unseen butterflies re-settle nearby
      if (d > 260 && !inView(b.pos)) {
        const p = this._flowerNear(bp, 50, 130);
        if (!inView(p.p)) { b.pos.copy(p.p); b.target = p; b.state = 'perch'; b.timer = r.range(2, 6); }
      }
      if ((d < 7 || (d < 13 && bee.speed > 6)) && b.state !== 'scatter') {
        b.state = 'scatter';
        b.timer = r.range(1.4, 2.2);
        b.vel.copy(b.pos).sub(bp).setY(0).normalize().multiplyScalar(11).add(V(0, 8, 0));
      }
      if (b.state === 'perch') {
        b.timer -= dt;
        b.pos.copy(b.target.p);
        if (b.target.f?.headOff) b.pos.add(b.target.f.headOff); // the bloom nods in the breeze
        const open = 0.5 + 0.45 * Math.sin(t * 0.9 + b.ph);
        b.c.group.position.copy(b.pos);
        b.c.group.rotation.set(0, b.yaw, 0);
        b.c.setPose({ t, open, flap: 0, grip: 1 });
        if (b.timer <= 0) { b.state = 'fly'; b.target = this._flowerNear(b.pos, 15, 90); b.vel.set(0, 4, 0); }
        continue;
      }
      if (b.state === 'scatter') {
        b.timer -= dt;
        b.vel.multiplyScalar(Math.exp(-dt * 0.4));
        if (b.timer <= 0) { b.state = 'fly'; b.target = this._flowerNear(b.pos, 30, 110); }
      } else {
        // fluttering flight toward the next bloom: weave and bob
        const to = b.target.p.clone().sub(b.pos);
        const dist = to.length();
        const want = to.multiplyScalar(Math.min(7, 1.5 + dist * 0.6) / Math.max(dist, 1e-3));
        if (dist > 6) want.y += 3 + Math.sin(t * 2.1 + b.ph) * 3;
        want.x += Math.sin(t * 1.7 + b.ph) * 2.5;
        want.z += Math.cos(t * 1.3 + b.ph) * 2.5;
        b.vel.lerp(want, damp(2.2, dt));
        if (dist < 0.8) { b.state = 'perch'; b.timer = r.range(4, 11); b.yaw = Math.atan2(b.vel.x, b.vel.z); }
      }
      b.pos.addScaledVector(b.vel, dt);
      b.pos.y += Math.sin(t * b.freq * TAU * 0.5 + b.ph) * 0.05;
      this.bounds.collide(b.pos, b.vel, 0.8, dt, { cushion: 0.8, stiffness: 25 });
      clearSight(b.pos, 4.5);
      b.c.group.position.copy(b.pos);
      orient(b.c.group, b.vel.clone().setY(b.vel.y * 0.3), clamp(-b.vel.x * 0.02, -0.4, 0.4));
      b.c.setPose({ t: t + b.ph, open: 0.6, flap: b.state === 'scatter' ? 1 : 0.85, freq: b.state === 'scatter' ? b.freq * 1.6 : b.freq, grip: 0 });
    }

    // ---- dragonflies ------------------------------------------------------------
    for (const df of this.dragonflies) {
      const d = df.pos.distanceTo(bp);
      if (df.escort >= 0) {
        if (df.escort === 0 && d < 30 && bee.speed > 8 && bee.flying) { df.escort = 0.0001; this._escortStart = t; }
        if (df.escort > 0) {
          df.escort += dt;
          if (df.escort > 14 || !bee.flying || d > 70) { df.escort = 0; df.station = null; df.home = df.pos.clone(); df.state = 'hover'; df.timer = 1; }
        }
      }
      df.timer -= dt;
      if (df.escort > 0) {
        // escort: hold a station beside and a little ahead of the bee, kept in
        // the bee's own frame every frame so it keeps pace at any speed (a
        // station picked from a stale bee position fell behind it, between
        // the bee and the camera). Every beat it darts to a new station.
        const fw = bee.vel.clone().setY(0);
        if (fw.lengthSq() < 1) fw.set(Math.sin(bee.yaw), 0, Math.cos(bee.yaw));
        fw.normalize();
        const sd = V(-fw.z, 0, fw.x);
        if (df.timer <= 0 || !df.station) {
          df.offFrom = df.pos.clone().sub(bp);
          // it is twice APX-9's size (13.5 long, 11 across the wings): fly well wide
          df.station = { side: (r.chance(0.5) ? 1 : -1) * r.range(13, 16), up: r.range(3, 5), ahead: r.range(6, 10) };
          df.dart = 0;
          df.dartDur = clamp(df.offFrom.length() / 40, 0.22, 0.9);
          df.timer = r.range(0.4, 0.9);
        }
        const st = df.station;
        const offTo = sd.multiplyScalar(st.side).add(V(0, st.up, 0)).addScaledVector(fw, st.ahead);
        df.dart = Math.min(1, df.dart + dt / df.dartDur);
        df.pos.copy(bp).add(df.offFrom.clone().lerp(offTo, smooth(df.dart)));
        df.from.copy(df.pos);
        df.to.copy(df.pos);
      } else {
        if (d < 6 && df.state !== 'flee') { df.state = 'flee'; df.from.copy(df.pos); df.to.copy(df.pos).add(df.pos.clone().sub(bp).setY(0).normalize().multiplyScalar(22)).add(V(0, 6, 0)); df.dart = 0; df.timer = 1.2; }
        if (df.timer <= 0) {
          df.state = df.state === 'hover' ? 'dart' : 'hover';
          if (df.state === 'dart') {
            const anchor = df.home.distanceTo(bp) > 200 ? bp.clone().add(V(r.range(-60, 60), 0, r.range(-60, 60))) : df.home;
            df.from.copy(df.pos);
            df.to.copy(anchor).add(V(r.range(-18, 18), r.range(-4, 8), r.range(-18, 18)));
            df.to.y = Math.max(df.to.y, groundHeight(df.to.x, df.to.z) + 8);
            df.dart = 0;
            df.timer = 0.35;
          } else df.timer = r.range(0.6, 2.4);
        }
        if (df.state === 'dart' || df.state === 'flee') { df.dart = Math.min(1, df.dart + dt / (df.state === 'flee' ? 0.5 : 0.35)); df.pos.lerpVectors(df.from, df.to, smooth(df.dart)); }
      }
      const jitter = V(Math.sin(t * 5.1 + df.home.x) * 0.06, Math.sin(t * 6.3) * 0.05, Math.cos(t * 4.7) * 0.06);
      clearSight(df.pos, 6.5);
      df.c.group.position.copy(df.pos).add(jitter);
      const mv = df.to.clone().sub(df.from).setY(0);
      if (mv.lengthSq() > 1) df.face.lerp(mv.normalize(), damp(6, dt));
      if (df.escort > 0) df.face.lerp(V(Math.sin(bee.yaw), 0, Math.cos(bee.yaw)), damp(3, dt));
      orient(df.c.group, df.face, clamp(Math.sin(t * 2) * 0.1, -0.3, 0.3));
      df.c.setPose({ t, flap: 1, glide: 0 });
    }

    // ---- hummingbirds ---------------------------------------------------------------
    for (const h of this.hummingbirds) {
      h.timer -= dt;
      const d = h.pos.distanceTo(bp);
      if (d < 14 && h.state !== 'curious' && h.state !== 'leave' && (h.cool ?? 0) < t) {
        h.state = 'curious';
        h.timer = r.range(3, 5);
        h.cool = t + 18;
      }
      let want, face;
      if (h.state === 'curious') {
        // hover at the bee's eye level, a few lengths off, watching it
        const off = h.pos.clone().sub(bp).setY(0);
        if (off.lengthSq() < 1) off.set(1, 0, 0);
        off.normalize().multiplyScalar(9);
        want = bp.clone().add(off).add(V(0, 1.2, 0));
        face = bp.clone().sub(h.pos);
        if (h.timer <= 0) { h.state = 'leave'; h.timer = 1.5; h.vel.copy(off).normalize().multiplyScalar(26).add(V(0, 10, 0)); }
      } else if (h.state === 'leave') {
        want = h.pos.clone().addScaledVector(h.vel, 0.3);
        face = h.vel.clone();
        if (h.timer <= 0) { h.state = 'travel'; h.target = null; }
      } else {
        if (!h.target || (h.state === 'sip' && h.timer <= 0)) {
          const roll = r.float();
          if (roll < 0.3) { const m = this.world.blossom.mouthWorld(); const ax = this.world.blossom.axisWorld(); h.target = { p: m.clone().addScaledVector(ax, 3.2), look: m.clone() }; }
          else { const p = this._flowerNear(bp.distanceTo(h.pos) > 200 ? bp : h.pos, 20, 140); h.target = { p: p.p.clone().add(V(2.5, 2.5, 0)), look: p.p.clone() }; }
          h.state = 'travel';
        }
        const to = h.target.p.clone().sub(h.pos);
        const dist = to.length();
        if (h.state === 'travel' && dist < 1) { h.state = 'sip'; h.timer = r.range(2.5, 4.5); }
        want = h.state === 'sip' ? h.target.p.clone().add(V(0, Math.sin(t * 5.3) * 0.08, 0)) : h.pos.clone().add(to.multiplyScalar(Math.min(1, 28 / Math.max(dist, 1)) * 0.6)).add(V(0, dist > 20 ? 4 : 0, 0));
        face = h.state === 'sip' ? h.target.look.clone().sub(h.pos) : to;
      }
      const prev = h.pos.clone();
      h.pos.lerp(want, damp(h.state === 'sip' ? 6 : h.state === 'curious' ? 2.5 : 2, dt));
      const vel = h.pos.clone().sub(prev).multiplyScalar(1 / Math.max(dt, 1e-3));
      this.bounds.collide(h.pos, vel, 1.2, dt, { cushion: 1, stiffness: 30 });
      face.y *= 0.2;
      if (face.lengthSq() > 1e-4) h.face.lerp(face.normalize(), damp(5, dt));
      if (h.state !== 'sip') clearSight(h.pos, 4.5);
      h.c.group.position.copy(h.pos);
      orient(h.c.group, h.face, clamp(-vel.x * 0.01, -0.3, 0.3), 0);
      const hover = h.state === 'sip' || h.state === 'curious';
      h.c.setPose({ t, spread: 1, flap: 1, freq: 17.3, tailSpread: 0.35 + (h.state === 'curious' ? 0.4 + Math.sin(t * 3) * 0.1 : 0), pitch: hover ? -0.5 : -0.15, headPitch: hover ? 0.5 : 0.15, headYaw: h.state === 'curious' ? Math.sin(t * 1.7) * 0.3 : 0, headTilt: h.state === 'curious' ? Math.sin(t * 2.3) * 0.2 : 0 });
    }

    // ---- worker bees round the skep ----------------------------------------------------
    const cel = t - this.celebrate;
    const dance = cel > 0 && cel < 5 ? Math.sin(Math.PI * clamp(cel / 5)) : 0;
    for (const w of this.workers) {
      w.a += dt * (w.speed + dance * 2.2);
      const rr = w.r * (1 - dance * 0.3);
      const y = w.h + Math.sin(t * 1.3 + w.i) * 1.6 + dance * Math.sin(w.a * 2) * 3;
      w.c.group.position.set(w.c0.x + Math.cos(w.a) * rr, y, w.c0.z + Math.sin(w.a) * rr);
      orient(w.c.group, V(-Math.sin(w.a), 0.1 * Math.cos(t * 1.3 + w.i), Math.cos(w.a)), -0.3 - dance * 0.3);
      if (w.apx) w.c.setPose({ t: t + w.i, flap: 1, fold: 0, fan: 0.3 });
      else w.c.setPose({ t: t + w.i * 0.37, flap: 1, freq: 24.7, fold: 0, grip: 0 });
    }

    // ---- songbird ------------------------------------------------------------------------
    const s = this.songState;
    const sb = this.song;
    const dSong = this.songPerch.distanceTo(bp);
    s.timer -= dt;
    if (s.state === 'perch') {
      if (dSong < 8 && bee.flying) { s.state = 'loop'; s.loopT = 0; this.audio?.chirp(0, 0.03); }
      s.nextSong -= dt;
      if (s.nextSong <= 0) { s.nextSong = r.range(5, 13); s.sing = 1.2; this.audio?.chirp(-0.3, dSong < 120 ? 0.02 * clamp(1 - dSong / 120) + 0.004 : 0.004); }
      s.sing = Math.max(0, (s.sing || 0) - dt);
      // watch the bee when it's about
      const toBee = bp.clone().sub(this.songPerch);
      const yawT = dSong < 60 ? clamp(Math.atan2(toBee.x, toBee.z) - Math.atan2(this.songFace.x, this.songFace.z), -0.8, 0.8) : Math.sin(t * 0.4) * 0.4;
      s.yaw += (Math.round(yawT * 4) / 4 - s.yaw) * damp(10, dt); // quick, discrete head turns
      sb.group.position.copy(this.songPerch).add(V(0, 0.95 * sb.S, 0));
      orient(sb.group, this.songFace, 0, 0);
      sb.setPose({ t, spread: 0, flap: 0, freq: 3, tailSpread: 0.2, headYaw: s.yaw, headTilt: Math.sin(t * 0.9) * 0.15 + (s.sing > 0 ? 0.2 : 0), perch: 1, ruffle: s.sing > 0 ? 0.3 : 0 });
    } else {
      // a loop round the tree and back to the bough
      s.loopT += dt;
      const k = clamp(s.loopT / 7);
      const tr = L.songbirdTree;
      const a = k * TAU + Math.atan2(this.songPerch.x - tr.x, this.songPerch.z - tr.z);
      const ring = V(tr.x + Math.sin(a) * 30, 45 + Math.sin(k * Math.PI) * 15, tr.z + Math.cos(a) * 30);
      const w = smooth(clamp(k * 5)) * smooth(clamp((1 - k) * 5));
      const p = this.songPerch.clone().add(V(0, 0.95 * sb.S, 0)).lerp(ring, w);
      const prev = sb.group.position.clone();
      sb.group.position.copy(p);
      const v = p.clone().sub(prev);
      orient(sb.group, v.lengthSq() > 1e-6 ? v : this.songFace, 0.3 * w, -0.1);
      sb.setPose({ t, spread: 1, flap: 1, freq: 3.4, tailSpread: 0.6, perch: 1 - w });
      if (k >= 1) { s.state = 'perch'; s.nextSong = 2; }
    }
  }
}
