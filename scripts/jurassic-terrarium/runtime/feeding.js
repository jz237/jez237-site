// Feeding. "Feed" opens a little menu of four foods, one for each kind of animal:
//   - ferns (a bundle of fronds and red cycad seeds) for the Triceratops and Stegosaurus, calves too;
//   - a leafy branch, hung on a rope from the lid at the height the Brachiosaurus browses, which it
//     strips;
//   - a fish, tossed into the pool, flopping and splashing until a Pteranodon dives and snatches it;
//   - meat for the T. rex: it stalks over, sniffs it, then tears at it, head shaking.
// A quick click drops the food where you click. Press and hold to feed from your hand: the food stays in
// the hand and follows it, and the animals come to it there (the Brachiosaurus reaches for the branch
// held up, a Pteranodon swoops at the fish held over the water, the T. rex snatches the meat). Let go and
// what's left falls.
// Eating shows: jaws working between bites, bits dropping, the food shrinking, crop, chew and tear
// sounds; each animal's belly fills as it eats (skin.js) and a full one lies down to sleep it off.
import { Group, Mesh, SphereGeometry, CylinderGeometry, ConeGeometry, MeshStandardMaterial, Vector3, BufferAttribute, Color } from 'three';
import { plantGeometry } from './floragen.js';

const FOODS = {
  ferns: { label: 'Ferns', who: 'Triceratops and Stegosaurus', heldY: 0.3, bites: 6 },
  branch: { label: 'Branch', who: 'Brachiosaurus', bites: 8 },
  fish: { label: 'Fish', who: 'Pteranodons', heldY: 0.35, bites: 1 },
  meat: { label: 'Meat', who: 'T. rex', heldY: 0.32, bites: 7 },
};
const _v = new Vector3(), _w = new Vector3();

export class Feeding {
  constructor(mod, flora) {
    this.mod = mod;
    this.ctx = mod.ctx;
    this.flora = flora;
    this.foods = [];
    this.kind = null;
    const input = this.ctx.input;
    input?.addHandler?.({
      name: 'jt-feed', priority: 40, tools: ['hand'], cursor: 'copy', activeCursor: 'grabbing',
      hitTest: () => (this.kind ? { distance: 0 } : null),
      onDown: (hit, ptr) => this.press(ptr),
      onMove: (ptr) => this.moveHeld(ptr),
      onFrame: (ptr, dt) => this.press0 && (this.press0.t += dt),
      onUp: (ptr) => this.release(ptr),
    });
    window.addEventListener('keydown', (e) => e.key === 'Escape' && this.kind && this.choose(null));
  }

  // ------------------------------------------------------------------ the menu
  mount(btn, panel) {
    const menu = document.createElement('div');
    menu.className = 'jt-foods';
    menu.hidden = true;
    menu.innerHTML = Object.entries(FOODS).map(([k, f]) => `<button data-f="${k}" title="for the ${f.who}">${f.label}</button>`).join('') +
      '<div class="jt-hint">Click to drop it, or press and hold to feed from your hand</div>';
    btn.after(menu);
    for (const b of menu.querySelectorAll('button')) b.addEventListener('click', () => this.choose(this.kind === b.dataset.f ? null : b.dataset.f));
    btn.addEventListener('click', () => {
      menu.hidden = !menu.hidden;
      if (menu.hidden) this.choose(null);
    });
    this.menu = menu;
    this.btn = btn;
    const css = document.createElement('style');
    css.textContent = `.jt-foods{display:flex;flex-wrap:wrap;gap:5px;width:100%}
      .jt-foods button{flex:1;min-width:0}
      .jt-foods button.on{background:rgba(255,217,138,.35);color:#1a140c}`;
    document.head.appendChild(css);
    void panel;
  }

  choose(kind) {
    this.kind = kind;
    for (const b of this.menu?.querySelectorAll('button') || []) b.classList.toggle('on', b.dataset.f === kind);
    this.btn?.classList.toggle('on', !!kind);
    const ix = this.mod.interact;
    ix?.tip(kind ? (kind === 'fish' ? 'Click the pool to toss a fish in, or hold it over the water' : kind === 'branch' ? 'Click where to hang the branch, or hold it up' : `Click to drop the ${FOODS[kind].label.toLowerCase()}, or hold it out`) + ' (Esc to stop)' : '');
    this.ctx.input?.invalidateHover?.();
  }

  // ------------------------------------------------------------------ making the food
  make(kind) {
    const g = new Group();
    if (kind === 'ferns' || kind === 'branch') {
      const geo = plantGeometry('fernlet', 1);
      geo.setAttribute('aBend', new BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
      const mat = this.flora.material('fernlet');
      if (kind === 'ferns') {
        const fronds = new Mesh(geo, mat);
        fronds.scale.setScalar(2.2);
        fronds.rotation.x = Math.PI / 2.3;
        g.add(fronds);
        const seedM = new MeshStandardMaterial({ color: 0xc8341c, roughness: 0.35 });
        for (let i = 0; i < 9; i++) {
          const s = new Mesh(new SphereGeometry(0.012, 8, 6), seedM);
          s.position.set((Math.random() - 0.5) * 0.08, 0.012 + Math.random() * 0.03, (Math.random() - 0.5) * 0.08);
          g.add(s);
        }
      } else {
        // a stick with sprays of leaves along it, hanging level
        const bark = new MeshStandardMaterial({ color: 0x5a4030, roughness: 0.9 });
        const stick = new Mesh(new CylinderGeometry(0.008, 0.012, 0.42, 6), bark);
        stick.rotation.z = Math.PI / 2;
        g.add(stick);
        for (let i = 0; i < 6; i++) {
          const f = new Mesh(geo, mat);
          f.scale.setScalar(2.6 + Math.random());
          f.position.set(-0.18 + i * 0.07, 0, 0);
          f.rotation.set(Math.PI + (Math.random() - 0.5), Math.random() * 6.28, (Math.random() - 0.5) * 0.8);
          g.add(f);
        }
      }
    } else if (kind === 'fish') {
      const m = new MeshStandardMaterial({ color: 0xb9c7cc, metalness: 0.65, roughness: 0.28 });
      const body = new Mesh(new SphereGeometry(1, 12, 8), m);
      body.scale.set(0.014, 0.017, 0.055);
      const tail = new Mesh(new ConeGeometry(0.018, 0.03, 4), m);
      tail.rotation.x = -Math.PI / 2;
      tail.scale.set(1, 1, 0.25);
      tail.position.z = -0.065;
      g.add(body, tail);
      g.userData.tail = tail;
    } else if (kind === 'meat') {
      const flesh = new MeshStandardMaterial({ color: 0x7a1e18, roughness: 0.55 });
      const fat = new MeshStandardMaterial({ color: 0xe8d6c0, roughness: 0.6 });
      const chunk = new Mesh(new SphereGeometry(1, 14, 10), flesh);
      chunk.scale.set(0.055, 0.04, 0.07);
      const cap = new Mesh(new SphereGeometry(1, 12, 8), fat);
      cap.scale.set(0.05, 0.02, 0.06);
      cap.position.y = 0.025;
      const bone = new Mesh(new CylinderGeometry(0.009, 0.009, 0.09, 8), fat);
      bone.rotation.x = Math.PI / 2;
      bone.position.z = 0.08;
      const knob = new Mesh(new SphereGeometry(0.016, 8, 6), fat);
      knob.position.z = 0.125;
      g.add(chunk, cap, bone, knob);
    }
    g.traverse((o) => {
      o.frustumCulled = false;
      if (o.isMesh) o.castShadow = true;
    });
    this.ctx.scene.add(g);
    return g;
  }

  // where the food goes for a pointer: on the ground (or the water) under it
  aim(ptr) {
    const T = this.ctx.terrain, hit = T.raycast(ptr.ray, new Vector3());
    if (!hit) return null;
    const water = Math.max(T.lakeMask(hit.x, hit.z), T.riverMask(hit.x, hit.z)) > 0.4;
    return { p: hit, water, ground: T.height(hit.x, hit.z) };
  }

  // ------------------------------------------------------------------ dropping, holding, letting go
  press(ptr) {
    const a = this.aim(ptr);
    if (!a) return false;
    const k = this.kind;
    if (k === 'fish' && !a.water) return void this.mod.interact?.tip('Over the pool: the Pteranodons fish there') || true;
    if (k !== 'fish' && a.water) return void this.mod.interact?.tip('On the ground, not in the water') || true;
    this.press0 = { t: 0, x: ptr.x, y: ptr.y, a };
    return true;
  }

  // held a moment (or moved): it becomes food held in the hand
  moveHeld(ptr) {
    const P = this.press0;
    if (!P) return;
    if (!this.held && (P.t > 0.22 || Math.hypot(ptr.x - P.x, ptr.y - P.y) > 8)) {
      this.held = this.add(this.kind, P.a.p, { held: true });
    }
    const a = this.aim(ptr), f = this.held;
    if (!f || !a) return;
    if (f.kind === 'fish' && !a.water) return; // the fish stays over the water
    f.p.copy(a.p);
    f.p.y = this.heldY(f, a);
    f.g.position.copy(f.p);
  }

  heldY(f, a) {
    if (f.kind === 'branch') return a.ground + this.branchY();
    if (f.kind === 'fish') return Math.max(a.ground, this.ctx.world.lakeLevel ?? 0) + FOODS.fish.heldY;
    return a.ground + FOODS[f.kind].heldY;
  }

  // how high to hang a branch: where the Brachiosaurus's mouth comes in a browse
  branchY() {
    const b = (this.mod.walkers || []).find((d) => d.sp.tooBig && d.browseReach);
    return b ? b.browseReach.up * 0.97 : 1.6;
  }

  release(ptr) {
    const P = this.press0;
    this.press0 = null;
    if (!P) return;
    if (this.held) {
      // let go: what's left falls (a branch stays hung where it was held)
      const f = this.held;
      this.held = null;
      f.held = false;
      if (f.kind === 'branch') this.hang(f);
      else f.vy = 0;
    } else this.add(this.kind, P.a.p, {});
    this.choose(null);
    if (this.menu) this.menu.hidden = true;
    void ptr;
  }

  add(kind, at, { held = false } = {}) {
    const g = this.make(kind);
    const f = { kind, g, p: at.clone(), held, vy: 0, landed: false, bites: 0, maxBites: FOODS[kind].bites, eaters: [], age: 0, callT: 0 };
    const T = this.ctx.terrain, box = this.ctx.box;
    if (held) {
      f.p.y = this.heldY(f, { ground: T.height(at.x, at.z) });
      g.position.copy(f.p);
    } else if (kind === 'branch') this.hang(f);
    else g.position.set(at.x, box.topY - 0.3, at.z);
    this.foods.push(f);
    this.mod.voice.play('crop', at, 1);
    this.call(f);
    return f;
  }

  // a branch hangs on a rope from the lid, at browsing height
  hang(f) {
    const T = this.ctx.terrain, box = this.ctx.box;
    f.p.y = T.height(f.p.x, f.p.z) + this.branchY();
    f.g.position.copy(f.p);
    f.landed = true;
    f.swing = 0.3;
    if (!f.rope) {
      const len = box.topY - f.p.y;
      f.rope = new Mesh(new CylinderGeometry(0.003, 0.003, len, 4), new MeshStandardMaterial({ color: 0x8a7552, roughness: 0.9 }));
      f.rope.position.set(f.p.x, f.p.y + len / 2, f.p.z);
      this.ctx.scene.add(f.rope);
    }
    this.call(f);
  }

  // ------------------------------------------------------------------ who comes to eat
  call(f) {
    const mod = this.mod;
    f.callT = 1.2;
    if (f.kind === 'ferns') {
      const cand = (mod.walkers || []).filter((d) => !d.sp.predator && !d.sp.tooBig && d.actions.graze && d.state !== 'sleep' && !d.guarding && !/standoff|circle|social|drinking/.test(d.state));
      cand.sort((a, b) => a.pos.distanceTo(f.p) - b.pos.distanceTo(f.p));
      for (const d of cand) {
        if (f.eaters.length >= 3 || f.eaters.includes(d) || d.pos.distanceTo(f.p) > 7) continue;
        if (this.approach(d, f, d.length * 0.42 + 0.05, () => this.graze(d, f))) f.eaters.push(d);
      }
    } else if (f.kind === 'branch') {
      const d = (mod.walkers || []).find((x) => x.sp.tooBig && x.browseReach && x.state !== 'drinking');
      if (d && !f.eaters.includes(d)) {
        if (d.state === 'sleep') d.rest(0.5);
        if (this.approach(d, f, d.browseReach.fwd, () => this.browse(d, f))) f.eaters.push(d);
      }
    } else if (f.kind === 'meat') {
      const d = mod.predator;
      if (d && !f.eaters.includes(d) && !/standoff|circle/.test(d.state)) {
        if (d.state === 'sleep') (d.rest(0.5), mod.voice.play('boom', d.root.position, d.stepSize));
        d.prey = null;
        if (this.approach(d, f, d.length * 0.48, () => this.tear(d, f))) f.eaters.push(d);
      }
    } else if (f.kind === 'fish') {
      const birds = mod.dinos.filter((x) => x.sp.flyer && x.state === 'fly');
      birds.sort((a, b) => a.pos.distanceTo(f.p) - b.pos.distanceTo(f.p));
      for (const b of birds) {
        if (b.planDive?.({ x: f.p.x, z: f.p.z, y: f.held ? f.p.y : null, food: f })) {
          f.eaters = [b];
          break;
        }
      }
    }
  }

  // walk to a point `r` from the food on this side of it, and face it on arrival
  approach(d, f, r, then) {
    const a = Math.atan2(d.pos.x - f.p.x, d.pos.z - f.p.z);
    const t = d.layer.nearestOpen(f.p.x + Math.sin(a) * r, f.p.z + Math.cos(a) * r);
    if (!t) return false;
    if (Math.hypot(t.x - d.pos.x, t.z - d.pos.z) < 0.08) {
      d.heading = Math.atan2(f.p.x - d.pos.x, f.p.z - d.pos.z);
      then();
      return true;
    }
    f.target = f.target || new Map();
    f.target.set(d, { x: f.p.x, z: f.p.z });
    return d.goTo(t.x, t.z, () => {
      if (f.gone) return d.rest(0.5);
      d.heading = Math.atan2(f.p.x - d.pos.x, f.p.z - d.pos.z);
      then();
    }, d.pos.distanceTo(f.p) > 2.5 && !d.sp.noRun ? 'run' : 'walk');
  }

  near(d, f, k = 1) {
    return !f.gone && Math.hypot(d.pos.x - f.p.x, d.pos.z - f.p.z) < d.length * k;
  }

  bite(d, f, at, color, n, sound) {
    f.bites++;
    this.mod.voice.play(sound, at, 1);
    this.mod.effects.bits?.(at, color, n);
    d.full = Math.min(1.2, (d.full || 0) + (f.kind === 'meat' ? 0.16 : f.kind === 'branch' ? 0.1 : 0.14));
    d._chew = 1.6;
    const k = Math.max(0, 1 - f.bites / f.maxBites);
    f.g.scale.setScalar(0.3 + 0.7 * k);
    if (f.bites >= f.maxBites) this.finish(f);
  }

  // ferns: head down, a mouthful, chew, again
  graze(d, f) {
    if (f.gone || !this.near(d, f, 1.3)) return d.rest(0.6);
    d.oneShot('graze');
    d._eating = 'ferns';
    d.mod.later(0.9, () => {
      if (f.gone) return;
      _v.copy(f.g.position).add(_w.set(0, 0.03, 0));
      this.bite(d, f, _v.clone(), 0x4f7a2c, 4, 'crop');
      this.mod.effects?.leafBurst(_v.clone(), 2);
    });
    d.mod.later(2.6, () => {
      if (!f.gone && (d.state === 'oneshot' || d.state === 'idle') && this.near(d, f, 1.3)) this.graze(d, f);
      else d._eating = null;
    });
  }

  // the branch: browse it, a bite every second or so through the middle of the reach
  browse(d, f) {
    if (f.gone || !this.near(d, f, 1.2)) return d.rest(0.6);
    d._eating = 'branch';
    d.oneShot('browse');
    d.browseDip = 0;
    const len = d.actions.browse.getClip().duration;
    for (let t = 1.6; t < len - 1.2; t += 1.1 + Math.random() * 0.5)
      d.mod.later(t, () => {
        if (f.gone || d.currentName !== 'browse') return;
        f.swing = Math.min(1, (f.swing || 0) + 0.5);
        this.bite(d, f, f.g.position.clone(), 0x4f7a2c, 5, 'crop');
        this.mod.effects?.leafBurst(f.g.position.clone(), 3);
      });
    d.mod.later(len - 0.2, () => {
      if (!f.gone && this.near(d, f, 1.2)) this.browse(d, f);
      else d._eating = null;
    });
  }

  // meat: a sniff, then it bends to it and tears, head shaking
  tear(d, f) {
    if (f.gone) return d.rest(0.6);
    // held out, or lying where it couldn't quite get to: it takes it and pins it at its feet
    if (f.held || Math.hypot(d.pos.x - f.p.x, d.pos.z - f.p.z) > d.length * 0.62) {
      const wasHeld = f.held;
      // snatched out of the hand
      f.held = false;
      if (this.held === f) (this.held = null), (this.press0 = null), this.choose(null);
      const T = this.ctx.terrain;
      f.p.set(d.pos.x + Math.sin(d.heading) * d.length * 0.42, 0, d.pos.z + Math.cos(d.heading) * d.length * 0.42);
      f.p.y = T.height(f.p.x, f.p.z) + 0.02;
      f.g.position.copy(f.p);
      f.landed = true;
      if (wasHeld) this.mod.voice.play('roar', d.root.position, d.stepSize * 0.6);
    }
    d._eating = 'meat';
    d.oneShot('sniff') || d.rest(0.4);
    d.mod.later(1.6, () => {
      if (f.gone) return (d._eating = null);
      d.state = 'idle';
      d.timer = 99;
      d.play('idle', 0.4);
      d._tear = { f, t: 0, next: 0.8 };
    });
  }

  finish(f) {
    if (f.gone) return;
    f.gone = true;
    f.fade = 1;
    for (const d of f.eaters) if (d._tear?.f === f) (d._tear = null), (d._eating = null), d.rest(0.8);
  }

  // ------------------------------------------------------------------ each frame
  update(dt) {
    const T = this.ctx.terrain, t = (this.t = (this.t || 0) + dt);
    for (let i = this.foods.length - 1; i >= 0; i--) {
      const f = this.foods[i];
      // falling (not held, not hung)
      if (!f.held && !f.landed && f.kind !== 'branch') {
        f.vy -= 3.2 * dt;
        f.g.position.y += f.vy * dt;
        f.g.rotation.y += dt * 2;
        const floor = f.kind === 'fish' ? Math.max(T.height(f.p.x, f.p.z), this.ctx.world.lakeLevel ?? 0) : T.height(f.p.x, f.p.z);
        if (f.g.position.y <= floor) {
          f.g.position.y = floor;
          if (f.kind === 'fish') {
            f.landed = true;
            this.mod.effects.splash(f.p.x, f.p.z, floor, 0.5);
            this.mod.voice.play('splash', f.g.position, 0.6);
          } else if (f.vy < -0.6) f.vy = -f.vy * 0.25;
          else {
            f.landed = true;
            this.mod.voice.play('step', f.g.position, 0.4);
          }
          f.p.copy(f.g.position);
          this.call(f);
        }
      }
      // a fish flops and splashes; a held one wriggles
      if (f.kind === 'fish' && !f.gone) {
        f.g.rotation.z = Math.sin(t * (f.held ? 18 : 9)) * 0.5;
        if (f.g.userData.tail) f.g.userData.tail.rotation.y = Math.sin(t * 24) * 0.6;
        if (f.landed && !f.held && (f.flopT = (f.flopT || 0) - dt) <= 0) {
          f.flopT = 0.8 + Math.random() * 1.2;
          this.ctx.modules.water?.ripple?.(f.p.x, f.p.z, 0.03, 0.8);
        }
      }
      // a hung branch sways on its rope, more after a bite
      if (f.kind === 'branch' && f.rope) {
        f.swing = Math.max(0.05, (f.swing || 0) * Math.exp(-dt * 0.5));
        f.g.rotation.z = Math.sin(t * 1.7) * 0.12 * f.swing;
        f.g.rotation.y += dt * 0.15 * f.swing;
      }
      // held food the animals are walking to: when it moves far, they re-aim at it
      if (f.held && f.target && (f.callT -= dt) <= 0) {
        f.callT = 0.8;
        for (const [d, at] of f.target) {
          if (Math.hypot(at.x - f.p.x, at.z - f.p.z) > 0.35 && d.state === 'walk') {
            at.x = f.p.x;
            at.z = f.p.z;
            const r = f.kind === 'branch' ? d.browseReach.fwd : d.length * (f.kind === 'meat' ? 0.48 : 0.42) + 0.05;
            const a = Math.atan2(d.pos.x - f.p.x, d.pos.z - f.p.z), p = d.layer.nearestOpen(f.p.x + Math.sin(a) * r, f.p.z + Math.cos(a) * r);
            const then = d.then;
            if (p) d.goTo(p.x, p.z, then, d.gait);
          }
        }
      }
      if (!f.held && f.landed && !f.gone) {
        f.age += dt;
        if (f.bites === 0 && f.age > 8 && Math.floor(f.age / 8) !== Math.floor((f.age - dt) / 8)) this.call(f);
        if (f.age > 120) this.finish(f);
      }
      if (f.held && !f.eaters.length && (f.age += dt) > 1 && Math.floor(f.age / 3) !== Math.floor((f.age - dt) / 3)) this.call(f);
      if (f.gone) {
        f.fade -= dt;
        f.g.scale.multiplyScalar(Math.max(0.001, 1 - dt * 2));
        if (f.rope) f.rope.scale.x = f.rope.scale.z = Math.max(0.001, f.fade);
        if (f.fade <= 0) {
          f.g.removeFromParent();
          f.rope?.removeFromParent();
          this.foods.splice(i, 1);
        }
      }
    }
    // the T. rex at its meat: bending to it, tearing a mouthful every so often
    for (const d of this.mod.walkers || []) {
      const R = d._tear;
      if (!R) continue;
      const f = R.f;
      if (f.gone || d.state !== 'idle' || !this.near(d, f, 1.2)) {
        d._tear = null;
        d._eating = null;
        continue;
      }
      R.t += dt;
      d.timer = 99;
      d.heading += Math.atan2(Math.sin(Math.atan2(f.p.x - d.pos.x, f.p.z - d.pos.z) - d.heading), Math.cos(Math.atan2(f.p.x - d.pos.x, f.p.z - d.pos.z) - d.heading)) * Math.min(1, dt * 2);
      // the whole forequarters stoop until the jaws are down at the meat (main.js applies R.bow)
      // (measured at the snout's tip, where the jaws close)
      const tip = d.skinMesh?.geometry.userData.jtSkin?.snoutIdx ?? -1;
      const h = this.mod.weather?.vert(d, tip, _v) || d.headBone?.getWorldPosition(_v);
      if (h) R.bow = Math.max(0, Math.min(1.5, (R.bow || 0) + (h.y - (f.p.y + 0.02)) * dt * 2.2));
      // the meat ends up under its jaws: each wrench drags it a little closer
      if (h && R.bow > 0.4) {
        const k = Math.min(1, dt * ((R.shake || 0) > 0 ? 3 : 0.8));
        f.p.x += (h.x - f.p.x) * k;
        f.p.z += (h.z - f.p.z) * k;
        f.p.y = this.ctx.terrain.height(f.p.x, f.p.z) + 0.02;
        f.g.position.copy(f.p);
      }
      if ((R.next -= dt) <= 0) {
        R.next = 1.2 + Math.random() * 0.6;
        R.shake = 0.7;
        this.bite(d, f, f.g.position.clone().add(_w.set(0, 0.03, 0)), 0x8a2018, 5, 'tear');
      }
      R.shake = Math.max(0, (R.shake || 0) - dt);
    }
  }

  // for the documentary
  static caption(d) {
    return { ferns: 'feeding', branch: 'stripping a branch', meat: 'tearing at a meal' }[d._eating] || null;
  }
}
