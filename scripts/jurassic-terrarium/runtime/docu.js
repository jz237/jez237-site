// Documentary mode: a director and a camera crew, in place of the old drifting photo camera.
//
// Every second the director looks over the case for something worth filming and scores it: a hunt, a
// standoff, a stream crossing, hatchlings swimming or following their mother, a Pteranodon landing or
// fishing, a roar, a dust bath, browsing, drinking, sleep. It stays with a story for a while and cuts
// away early only for something much better. Each story is filmed in a few shots, cut between, chosen
// to suit it: a side tracking shot alongside a walker, a slow push-in, a low hero angle looking up, a slow
// orbit, a long-lens shot from across the case, a high crane shot, a chase behind a flier. Shallow focus,
// letterbox bars, and a caption in the corner naming the animal and what it is doing.
//
// While it runs it drives the camera itself (Weatherglass's orbit rig is set aside and given back after).
import { Vector3, Raycaster } from 'three';

const SHOTS = {
  // alongside, matching its pace, a little ahead, at eye level
  track: (s, k) => ({ side: 1.5, fwd: 0.35, up: 0.45, look: 0.25, fov: 34, follow: 1 }),
  // a slow push in from the front three-quarter
  push: (s, k) => ({ side: 1.1, fwd: 1.6 - 0.7 * k, up: 0.35, look: 0, fov: 30, follow: 0.6 }),
  // low and in front, looking up: the hero shot
  low: (s, k) => ({ side: 0.7, fwd: 1.7, up: -0.25, look: 0.1, fov: 38, follow: 0.5, ground: 0.16 }),
  // a slow orbit at middle distance
  orbit: (s, k) => ({ orbit: 0.9 + k * 0.9, dist: 2.1, up: 0.6, fov: 32, follow: 0.7 }),
  // the long lens: from far across the case, compressed, the background melting away
  tele: (s, k) => ({ side: 4.5, fwd: 1.5, up: 1.1, look: 0, fov: 13, follow: 0.35, abs: true }),
  // high and descending
  crane: (s, k) => ({ side: 1.6, fwd: -0.6, up: 2.6 - 1.4 * k, look: 0, fov: 34, follow: 0.6 }),
  // behind and above a flier
  chase: (s, k) => ({ side: 0.35, fwd: -1.6, up: 0.45, look: 0.6, fov: 40, follow: 1 }),
};

export class Docu {
  constructor(mod, ctx) {
    this.mod = mod;
    this.ctx = ctx;
    this.on = false;
    this.story = null;
    this.cam = new Vector3();
    this.look = new Vector3();
    this.camV = new Vector3();
  }

  // ------------------------------------------------------------ what's worth filming
  candidates() {
    const out = [], mod = this.mod;
    for (const d of mod.dinos || []) {
      if (!d.root.visible) continue;
      const name = d.sp.common, st = d.state, an = d.currentName, baby = !!d.parent;
      const add = (score, kind, caption, shots) => out.push({ d, score, kind, caption, shots });
      if (d.sp.flyer) {
        if (st === 'dive') add(d.dive?.leg >= 1 ? 10 : 9, 'dive', d.dive?.leg >= 1 ? `${name} — skimming for fish` : `${name} — fishing`, ['chase', 'tele', 'track']);
        else if (st === 'toPerch') add(8.5, 'land', `${name} — coming in to land`, ['tele', 'chase']);
        else if (st === 'perch') add(4.5, 'perch', `${name} — at rest`, ['orbit', 'low', 'push']);
        else if (st === 'takeoff') add(8, 'takeoff', `${name} — taking off`, ['tele', 'low']);
        else add(2.5, 'fly', `${name} — soaring`, ['chase', 'tele']);
        continue;
      }
      if (st === 'circle' || (st === 'standoff' && mod.duel)) continue; // filmed as a pair, below
      if (st === 'social' && d.soc) {
        const k = d.soc.kind;
        if (d !== d.soc.cast[0]) continue; // one story per scene
        if (k === 'play') add(9, 'play', 'Triceratops calves — at play', ['low', 'push', 'orbit']);
        else if (k === 'nuzzle') add(8.5, 'nuzzle', 'Triceratops — mother and calf', ['push', 'low', 'orbit']);
        else if (k === 'spar') add(9.5, 'spar', 'Stegosaurus — sparring', ['tele', 'low', 'orbit']);
        continue;
      }
      if (d.sp.tooBig && d._liftT > 0) add(8, 'lift', `${name} — letting a calf pass`, ['low', 'tele']);
      if (d._eating) add(d._eating === 'meat' ? 9.5 : 8.5, 'eat', `${name} — ${{ ferns: 'feeding', branch: 'stripping a branch', meat: 'tearing at a meal' }[d._eating]}`, ['low', 'push', 'orbit']);
      else if (st === 'sleep' && d._napT > 0) add(5.5, 'nap', `${name} — sleeping it off`, ['push', 'orbit']);
      else if (st === 'sleep' && d.sp.herd && d._huddled && !baby) add(4.5, 'sleep', `${name} — the herd asleep together`, ['crane', 'orbit', 'tele']);
      if (st === 'hunt') add(10, 'hunt', `${name} — on the hunt`, ['track', 'low', 'tele']);
      else if (st === 'standoff' || an === 'threat') add(9.5, 'standoff', `${name} — standing its ground`, ['low', 'push', 'tele']);
      else if (st === 'flee') add(8, 'flee', `${name} — running for cover`, ['track', 'tele']);
      else if (an === 'roar') add(8.5, 'roar', `${name}`, ['low', 'push']);
      else if (d.swimming) add(8.5, 'swim', `${name} hatchling — swimming`, ['track', 'push']);
      else if (d.inWater > 0.35 && d.speed > 0.03) add(7.5, 'cross', `${name} — crossing the stream`, ['track', 'low', 'tele']);
      else if (st === 'perform') {
        const what = { dustbath: 'a dust bath', rub: 'scratching on a tree', shake: 'shaking off the water', yawn: '', scratch: 'an itch' }[d.perf?.kind] ?? '';
        add(d.perf?.kind === 'yawn' ? 4 : 6.5, 'perform', what ? `${name} — ${what}` : name, ['push', 'orbit', 'low']);
      } else if (an === 'browse') add(6, 'browse', `${name} — browsing the canopy`, ['low', 'tele', 'crane']);
      else if (st === 'drinking') {
        // framed on the head down at the water (and its reflection), not the body high above
        const w = mod.weather, idx = d.skinMesh?.geometry.userData.jtSkin?.snoutIdx ?? -1;
        d._drinkSubj = d._drinkSubj || {
          sp: {}, info: d.info, height: 0.25, speed: 0,
          root: { visible: true, getWorldPosition: (v) => (w?.vert(d, idx, v) || d.headBone.getWorldPosition(v)).setY(Math.max(0.03, v.y - 0.1)) },
          get length() { return Math.max(0.8, d.length * 0.4); },
          get heading() { return d.heading; },
        };
        out.push({ d: d._drinkSubj, score: 8.5, kind: 'drink', caption: `${name} — drinking at the pool`, shots: ['low', 'push', 'tele'] });
      }
      else if (an === 'drink') add(5, 'drink', `${name} — at the water`, ['push', 'tele', 'low']);
      else if (baby && st === 'walk' && d.parent) out.push({ d: d.parent, score: 6, kind: 'follow', caption: `${name} — mother and young`, shots: ['track', 'crane', 'tele'] });
      else if (st === 'walk' && d.path && d._trailWalk) add(5.5, 'trail', `${name} — on the trail`, ['track', 'tele', 'crane']);
      else if (st === 'sleep') add(2.5, 'sleep', `${name} — asleep`, ['push', 'orbit']);
      else if (an === 'graze') add(3, 'graze', `${name} — grazing`, ['push', 'orbit', 'tele']);
      else if (st === 'walk') add(3, 'walk', name, ['track', 'tele']);
      else add(1.5, 'idle', name, ['orbit', 'push']);
    }
    // a standoff: both of them in the frame, filmed from the side of the line between them
    const duel = mod.duel;
    if (duel && duel.def.root.visible && duel.rex.root.visible && duel.t < duel.len + 3) {
      const a = duel.def, b = duel.rex;
      this.duelSubject = this.duelSubject?.duel === duel ? this.duelSubject : {
        duel, sp: {}, info: { name: 'Tyrannosaurus rex · Triceratops horridus' },
        root: { visible: true, getWorldPosition: (v) => v.copy(a.root.position).add(b.root.position).multiplyScalar(0.5) },
        get length() { return Math.max(1.2, Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z) * 0.8); },
        get height() { return Math.max(a.height, b.height); },
        get heading() { return Math.atan2(b.pos.x - a.pos.x, b.pos.z - a.pos.z) + Math.PI / 2; },
        speed: 0,
      };
      out.push({ d: this.duelSubject, score: 12, kind: 'standoff', caption: 'Tyrannosaurus and Triceratops — a standoff', shots: ['tele', 'low', 'orbit', 'push'] });
    }
    // a hatching: the nest itself
    if (mod.nest?.hatching) {
      const site = mod.nest.site, p = new Vector3(site.x, site.y, site.z);
      this.nestSubject = this.nestSubject || { root: { visible: true, getWorldPosition: (v) => v.copy(p) }, length: 0.6, height: 0.15, heading: 0.4, sp: {}, info: { name: 'Triceratops horridus' } };
      out.push({ d: this.nestSubject, score: 11, kind: 'hatch', caption: 'Triceratops — hatching', shots: ['push', 'orbit'] });
    }
    return out;
  }

  direct(dt) {
    const S = this.story;
    this.scan = (this.scan || 0) - dt;
    if (this.scan > 0 && S) return;
    this.scan = 1;
    const c = this.candidates();
    if (!c.length) return;
    // the same animal keeps its story fresh; stale stories score lower the longer they run
    for (const e of c) {
      if (S && e.d === S.d) e.score += 1.5 - Math.min(2.5, S.age / 12);
      if (S && e.d !== S.d && e.score < 4) e.score -= 0.5;
      e.score += Math.random() * 0.8;
      if (this.recent?.includes(e.d) && (!S || e.d !== S.d)) e.score -= 1.5;
    }
    c.sort((a, b) => b.score - a.score);
    const best = c[0];
    // hold a story at least a few seconds, unless something big happens
    const minHold = S ? (S.age < 7 ? (best.score >= 9 && S.score < 7 ? 1 : 99) : S.age < 14 ? 2.5 : 0) : -99;
    if (!S || best.d !== S.d && best.score > (S.score || 0) + minHold || S.age > 26) this.cutTo(best);
    else if (best.d === S.d) (S.kind = best.kind), (S.score = best.score), (S.caption = best.caption);
  }

  cutTo(e) {
    this.recent = [e.d, ...(this.recent || [])].slice(0, 3);
    this.story = { ...e, age: 0, shotIdx: 0, shotT: 0, shotLen: 0 };
    this.newShot(true);
    this.caption(e);
  }

  newShot(first = false) {
    const S = this.story, list = S.shots;
    // a different framing each time, one of those that suit the story
    let pick = list[Math.floor(Math.random() * list.length)];
    if (!first && list.length > 1) for (let i = 0; i < 4 && pick === S.shot; i++) pick = list[Math.floor(Math.random() * list.length)];
    S.shotT = 0;
    S.shotLen = 6 + Math.random() * 4;
    S.orbit0 = Math.random() * Math.PI * 2;
    S.cut = true; // jump, don't ease
    // the crew looks for a clear view: this framing from either side, a little higher, then the others
    const side0 = Math.random() < 0.5 ? -1 : 1, order = [pick, ...list.filter((x) => x !== pick), 'crane', 'tele'];
    for (const shot of order)
      for (const sign of [side0, -side0])
        for (const lift of [0, 0.3, 0.7]) {
          Object.assign(S, { shot, sideSign: sign, lift });
          if (this.clear(this.mark(0.5).cam)) return;
        }
    Object.assign(S, { shot: 'crane', sideSign: side0, lift: 0.8 }); // last resort: from above
  }

  // what stands between the camera and the animal: planting, rocks, the den, logs, the hills
  clear(cam) {
    const S = this.story, look = this.mark(0.5).look, mod = this.mod;
    const dir = look.clone().sub(cam), dist = dir.length();
    if (dist < 1e-3) return false;
    dir.divideScalar(dist);
    const T = this.ctx.terrain;
    for (let i = 1; i < 12; i++) {
      const q = cam.clone().addScaledVector(dir, (dist * i) / 12);
      if (T.height(q.x, q.z) > q.y - 0.02) return false;
    }
    // inside a tree's crown, or looking out through one close by (crowns are leaf cards: the raycast
    // below slips between them)
    if (!this.crowns)
      this.crowns = (mod.trunks || []).filter((t) => t.kind !== 'stand' && t.kind !== 'cabin').map((t) => {
        const top = t.top ?? t.y0 + (t.crownY - t.y0) / 0.3, low = t.leafY ?? t.crownY;
        return { x: t.x, z: t.z, low: low - 0.08, top: top + 0.08, r: Math.max(0.15, (top - t.y0) * 0.42) };
      });
    for (let i = 0; i <= 7; i++) if (this.inCrown(cam.clone().addScaledVector(dir, (dist * 0.6 * i) / 7))) return false;
    // other animals in the way (a cheap body sphere each)
    const c = new Vector3(), w = new Vector3();
    for (const o of mod.dinos || []) {
      if (o === S.d || o.sp.flyer || !o.root.visible) continue;
      o.root.getWorldPosition(c);
      c.y += (o.height || 0.4) * 0.5;
      const r = Math.max((o.length || 0.5) * 0.32, (o.height || 0.4) * 0.5);
      const u = Math.max(0, Math.min(dist, w.subVectors(c, cam).dot(dir)));
      if (u > 0.05 && u < dist * 0.92 && c.distanceTo(w.copy(cam).addScaledVector(dir, u)) < r) return false;
    }
    if (!this.blockers)
      this.blockers = [mod.flora?.group, mod.rocks?.group, mod.ground?.group, mod.aquatic?.group, mod.group.getObjectByName('den'), this.ctx.modules.vegetation?.group].filter(Boolean);
    this.ray = this.ray || new Raycaster();
    this.ray.set(cam, dir);
    this.ray.far = dist * 0.9;
    return !this.ray.intersectObjects(this.blockers, true).length;
  }

  inCrown(q) {
    for (const c of this.crowns || []) if (q.y > c.low && q.y < c.top && (q.x - c.x) ** 2 + (q.z - c.z) ** 2 < c.r * c.r) return true;
    return false;
  }

  caption(e) {
    const el = this.capEl;
    if (!el) return;
    const latin = e.d.info?.name || '';
    el.innerHTML = `<b>${e.caption}</b>${latin && !/hatchling/.test(e.caption) ? `<i>${latin}</i>` : ''}`;
    el.classList.remove('in');
    clearTimeout(this.capT);
    this.capT = setTimeout(() => {
      el.classList.add('in');
      this.capT = setTimeout(() => el.classList.remove('in'), 5200);
    }, 900);
  }

  // ------------------------------------------------------------ the camera
  // where the camera wants to be (and look) k of the way through the current shot
  mark(k) {
    const S = this.story, d = S.d, box = this.ctx.box, T = this.ctx.terrain;
    const sh = SHOTS[S.shot](d, k);
    const p = d.root.getWorldPosition(new Vector3());
    const L = Math.max(0.5, d.length || 0.6), H = d.sp.flyer ? 0.25 : d.height || 0.4;
    const h = d.heading ?? 0, fx = Math.sin(h), fz = Math.cos(h), sx = Math.cos(h) * S.sideSign, sz = -Math.sin(h) * S.sideSign;
    const cam = new Vector3();
    if (sh.orbit !== undefined) {
      const a = S.orbit0 + sh.orbit * k;
      cam.set(p.x + Math.sin(a) * L * sh.dist, p.y + H * 0.5 + L * sh.up, p.z + Math.cos(a) * L * sh.dist);
    } else {
      const sc = sh.abs ? 1 : L;
      cam.set(p.x + sx * sc * sh.side + fx * sc * sh.fwd, p.y + H * 0.5 + L * sh.up, p.z + sz * sc * sh.side + fz * sc * sh.fwd);
    }
    cam.y += (S.lift || 0) * L;
    // the crew stays inside the case, above the planting and out of the hills
    cam.x = Math.max(-box.halfW + 0.2, Math.min(box.halfW - 0.2, cam.x));
    cam.z = Math.max(-box.halfD + 0.15, Math.min(box.halfD - 0.15, cam.z));
    // (small subjects in the grass are filmed from a little higher, looking down into it)
    const floor = (d.height || 0.4) < 0.25 ? 0.32 : sh.ground ?? 0.22;
    cam.y = Math.min(box.topY - 0.2, Math.max(cam.y, Math.max(T.height(cam.x, cam.z), 0.02) + floor));
    const look = new Vector3(p.x + fx * L * (sh.look || 0), p.y + H * (d.sp.flyer ? 0 : 0.55), p.z + fz * L * (sh.look || 0));
    return { cam, look, sh };
  }

  frame(dt) {
    const S = this.story;
    if (!S) return;
    S.age += dt;
    S.shotT += dt;
    if (S.shotT > S.shotLen) this.newShot();
    const k = Math.min(1, S.shotT / S.shotLen), m = this.mark(k), want = m.cam, lookAt = m.look, sh = m.sh;
    // now and then, check the view hasn't been blocked (a tracking shot passing behind a tree)
    S.checkT = (S.checkT || 0) - dt;
    if (S.checkT <= 0 && S.shotT > 1.5) {
      S.checkT = 0.6;
      if (!this.clear(want)) return void this.newShot();
    }
    // the camera itself (lagging its mark) wandered into a tree: cut away
    if (S.shotT > 0.5 && (S.inT = (S.inT || 0) - dt) <= 0) {
      S.inT = 0.25;
      if (this.inCrown(this.cam)) return void this.newShot();
    }
    if (S.cut) {
      this.cam.copy(want);
      this.look.copy(lookAt);
      this.camV.set(0, 0, 0);
      S.cut = false;
    } else {
      // a fluid, slightly lagging operator: spring the camera towards its mark
      const f = sh.follow ?? 0.6, kk = 6 * f, damp = 2 * Math.sqrt(kk);
      this.camV.addScaledVector(want.clone().sub(this.cam), kk * dt).multiplyScalar(Math.max(0, 1 - damp * dt));
      this.cam.addScaledVector(this.camV, dt);
      this.look.lerp(lookAt, Math.min(1, dt * 4));
    }
    const cam = this.ctx.camera;
    cam.position.copy(this.cam);
    cam.position.y += Math.sin(S.age * 0.7) * 0.004; // a hand-held breath
    cam.lookAt(this.look);
    if (cam.fov !== sh.fov) {
      cam.fov += (sh.fov - cam.fov) * (S.shotT < 0.05 ? 1 : Math.min(1, dt * 2));
      cam.updateProjectionMatrix();
    }
    // focus on the subject: a narrow sharp band where it is on screen
    const ndc = this.look.clone().project(cam);
    this.ctx.post?.setTiltShift?.(0.5 + ndc.y * 0.5, 0.07, 1.6);
  }

  // ------------------------------------------------------------ in and out
  start() {
    if (this.on) return;
    const rig = this.ctx.cameraRig, cam = this.ctx.camera;
    this.on = true;
    this.fov0 = cam.fov;
    this.rigUpdate = rig.update.bind(rig);
    rig.update = (dt) => this.frame(dt);
    if (!this.capEl) {
      const css = document.createElement('style');
      css.textContent = `
.jt-cap{position:fixed;left:calc(6vw + var(--sal,0px));bottom:calc(9vh + 26px);z-index:35;pointer-events:none;color:#f6efe2;
  font:400 clamp(15px,2.1vw,24px)/1.25 var(--serif,Georgia,serif);letter-spacing:.02em;text-shadow:0 1px 8px #000a;
  opacity:0;transform:translateY(6px);transition:opacity 1.1s ease,transform 1.1s ease}
.jt-cap.in{opacity:1;transform:none}
.jt-cap b{display:block;font-weight:400}
.jt-cap i{display:block;font-size:.62em;letter-spacing:.06em;opacity:.8;margin-top:3px}`;
      document.head.appendChild(css);
      this.capEl = document.createElement('div');
      this.capEl.className = 'jt-cap';
      document.body.appendChild(this.capEl);
    }
    this.story = null;
    this.scan = 0;
    this.direct(0);
  }

  stop() {
    if (!this.on) return;
    this.on = false;
    const rig = this.ctx.cameraRig, cam = this.ctx.camera;
    rig.update = this.rigUpdate;
    cam.fov = this.fov0;
    cam.updateProjectionMatrix();
    this.capEl?.classList.remove('in');
    clearTimeout(this.capT);
    this.story = null;
  }

  update(dt) {
    if (!this.on) return;
    this.direct(dt);
  }
}
