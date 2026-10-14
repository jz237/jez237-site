// Things to do in the case:
//   - Feed: the button opens the food menu (feeding.js).
//   - Tap the glass (Weatherglass's own glass tap): animals near the tap startle: heads snap round, the
//     closest shy away, sleepers wake, the Pteranodons flap off, and the T. rex may roar back.
//   - Documentary mode (docu.js): the interface hides, the view letterboxes, and a director picks what is
//     happening and films it in cuts, with captions. Esc or a click leaves it.
import { Docu } from './docu.js';
import { Group, Mesh, SphereGeometry, MeshStandardMaterial, Vector3, BufferAttribute } from 'three';
import { plantGeometry } from './floragen.js';

const UP = new Vector3(0, 1, 0);

export class Interact {
  constructor(mod, flora) {
    this.mod = mod;
    this.ctx = mod.ctx;
    this.flora = flora;
    this.foods = [];
    this.mode = null;
    this.photo = null;
    const ev = this.ctx.events;
    ev?.on?.('tap', (e) => this.onTap(e));
    ev?.on?.('glass:tap', (e) => this.onGlassTap(e));
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.photo) this.exitPhoto();
      if (e.key === 'Escape' && this.mode) this.setMode(null);
    });
  }

  // ------------------------------------------------------------------ UI (in the field guide panel)
  mountButtons(panel) {
    const row = document.createElement('div');
    row.className = 'jt-actions';
    row.innerHTML = `<button data-a="feed">Feed</button><button data-a="photo">Documentary</button>
      <div class="jt-hint">Tap the glass to startle them</div>`;
    row.querySelector('[data-a=photo]').addEventListener('click', () => this.enterPhoto());
    panel.appendChild(row);
    this.feedBtn = row.querySelector('[data-a=feed]');
    const css = document.createElement('style');
    css.textContent = `
      .jt-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,217,138,.18)}
      .jt-actions button{flex:1;font:inherit;font-size:12px;color:#f4ead8;background:rgba(255,217,138,.1);border:1px solid rgba(255,217,138,.35);border-radius:8px;padding:6px 8px;cursor:pointer}
      .jt-actions button.on{background:rgba(255,217,138,.35);color:#1a140c}
      .jt-hint{width:100%;font-size:11px;opacity:.7}
      .jt-tip{position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:40;background:rgba(20,16,12,.85);color:#f4ead8;font:13px system-ui,sans-serif;padding:7px 14px;border-radius:999px;border:1px solid rgba(255,217,138,.35);pointer-events:none}
      .jt-bar{position:fixed;left:0;right:0;height:9vh;background:#000;z-index:30;transition:transform .8s ease;pointer-events:none}
      .jt-bar.t{top:0;transform:translateY(-100%)} .jt-bar.b{bottom:0;transform:translateY(100%)}
      body.jt-photo .jt-bar{transform:none} body.jt-photo .jt-guide{display:none}`;
    document.head.appendChild(css);
  }

  tip(text) {
    if (!this.tipEl) {
      this.tipEl = document.createElement('div');
      this.tipEl.className = 'jt-tip';
      document.body.appendChild(this.tipEl);
    }
    this.tipEl.textContent = text;
    this.tipEl.hidden = !text;
  }

  setMode(m) {
    this.mode = m;
    this.feedBtn?.classList.toggle('on', m === 'feed');
    this.tip(m === 'feed' ? 'Click on the ground to drop food (Esc to cancel)' : '');
  }

  // ------------------------------------------------------------------ feeding
  onTap({ ray } = {}) {
    if (this.photo) return this.exitPhoto();
    if (this.mode !== 'feed' || !ray) return;
    const p = this.ctx.terrain.raycast(ray, new Vector3());
    if (!p) return;
    const T = this.ctx.terrain;
    if (Math.max(T.lakeMask(p.x, p.z), T.riverMask(p.x, p.z)) > 0.3) return this.tip('Not in the water: click on the ground');
    this.drop(p);
    this.setMode(null);
  }

  makeBundle() {
    const g = new Group();
    const geo = plantGeometry('fernlet', 1);
    geo.setAttribute('aBend', new BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
    const fronds = new Mesh(geo, this.flora.material('fernlet'));
    fronds.scale.setScalar(2.2);
    fronds.rotation.x = Math.PI / 2.3;
    g.add(fronds);
    const seedM = new MeshStandardMaterial({ color: 0xc8341c, roughness: 0.35 });
    for (let i = 0; i < 9; i++) {
      const s = new Mesh(new SphereGeometry(0.012, 8, 6), seedM);
      s.position.set((Math.random() - 0.5) * 0.08, 0.012 + Math.random() * 0.03, (Math.random() - 0.5) * 0.08);
      s.castShadow = true;
      g.add(s);
    }
    g.traverse((o) => (o.frustumCulled = false));
    return g;
  }

  drop(p) {
    const g = this.makeBundle();
    const box = this.ctx.box;
    g.position.set(p.x, box.topY - 0.3, p.z);
    this.ctx.scene.add(g);
    const food = { g, p: p.clone(), vy: 0, landed: false, bites: 0, maxBites: 6, eaters: [] };
    this.foods.push(food);
    this.mod.voice.play('crop', p, 1);
  }

  // the nearest plant-eaters that can graze come and eat; the T. rex comes to sniff
  call(food) {
    const mod = this.mod;
    const cand = (mod.walkers || []).filter((d) => !d.parent && !d.sp.predator && d.state !== 'sleep' && !d.guarding && d.actions.graze);
    cand.sort((a, b) => a.pos.distanceTo(food.p) - b.pos.distanceTo(food.p));
    for (const d of cand.slice(0, 3)) {
      if (d.pos.distanceTo(food.p) > 6) continue;
      const a = Math.atan2(d.pos.x - food.p.x, d.pos.z - food.p.z);
      const r = d.length * 0.42 + 0.05;
      const t = d.layer.nearestOpen(food.p.x + Math.sin(a) * r, food.p.z + Math.cos(a) * r);
      if (!t) continue;
      const ok = d.goTo(t.x, t.z, () => {
        d.heading = Math.atan2(food.p.x - d.pos.x, food.p.z - d.pos.z);
        if (d.sp.predator) d.oneShot('sniff') || d.rest(0.6);
        else this.eat(d, food);
      }, d.pos.distanceTo(food.p) > 2.5 && !d.sp.noRun ? 'run' : 'walk');
      if (ok) food.eaters.push(d);
    }
  }

  eat(d, food) {
    if (food.gone) return d.rest(0.6);
    d.oneShot('graze');
    d.mod.later(0.9, () => {
      if (food.gone) return;
      food.bites++;
      this.mod.voice.play('crop', food.g.position, 1);
      this.mod.effects?.leafBurst(food.g.position.clone().add(new Vector3(0, 0.03, 0)), 3);
      const k = Math.max(0, 1 - food.bites / food.maxBites);
      food.g.scale.setScalar(0.3 + 0.7 * k);
      if (food.bites >= food.maxBites) this.finish(food);
    });
    // keep eating while there is food and it hasn't wandered off
    d.mod.later(2.4, () => {
      const still = d.state === 'oneshot' || d.state === 'idle';
      if (!food.gone && still && d.pos.distanceTo(food.p) < d.length) this.eat(d, food);
    });
  }

  finish(food) {
    food.gone = true;
    food.fade = 1;
  }

  // ------------------------------------------------------------------ tapping the glass
  onGlassTap({ point } = {}) {
    if (!point) return;
    const mod = this.mod, rand = Math.random;
    for (const d of mod.walkers || []) {
      const dist = Math.hypot(d.pos.x - point.x, d.pos.z - point.z);
      if (dist > 3) continue;
      const delay = 0.12 + dist * 0.08 + rand() * 0.1;
      mod.later(delay, () => {
        if (d.state === 'sleep') {
          if (dist < 2) d.rest(0.4); // woken
          else return;
        }
        // the head snaps to the sound
        d.glance = { pos: point, height: 0.3 };
        d.glanceUntil = 2.5;
        d.glanceT = 4;
        if (d.sp.predator) {
          if (rand() < 0.4 && d.state !== 'hunt') {
            d.heading = Math.atan2(point.x - d.pos.x, point.z - d.pos.z);
            d.oneShot('roar');
          }
          return;
        }
        if (dist < 1.4 && !d.sp.tooBig) {
          // shy away from the glass
          const k = 1.6 / Math.max(dist, 0.1);
          const t = d.layer.nearestOpen(d.pos.x + (d.pos.x - point.x) * k, d.pos.z + (d.pos.z - point.z) * k);
          if (t && d.goTo(t.x, t.z, null, 'run')) d.state = 'flee';
          if (d.sp.sounds?.alert) mod.voice.play(d.sp.sounds.alert, d.root.position, d.stepSize);
        } else if (d.actions.alert && (d.state === 'idle' || d.state === 'walk')) d.oneShot('alert');
      });
    }
    // the pterosaurs start and flap hard
    for (const f of mod.dinos.filter((x) => x.sp.flyer)) {
      if (f.root.position.distanceTo(point) < 4) {
        f.flapT = 2.5;
        mod.voice.play('croak', f.root.position, 1);
      }
    }
  }

  // ------------------------------------------------------------------ documentary mode
  enterPhoto() {
    if (!(this.mod.dinos || []).length) return;
    this.setMode(null);
    this.photo = { wasUi: document.body.classList.contains('no-ui') };
    if (!this.bars) {
      this.bars = ['t', 'b'].map((c) => {
        const el = document.createElement('div');
        el.className = `jt-bar ${c}`;
        document.body.appendChild(el);
        return el;
      });
    }
    document.body.classList.add('no-ui', 'jt-photo');
    this.tip('Documentary — Esc or click to leave');
    setTimeout(() => this.photo && this.tip(''), 2500);
    this.mod.guide?.release?.();
    this.docu = this.docu || new Docu(this.mod, this.ctx);
    this.docu.start();
  }

  exitPhoto() {
    if (!this.photo) return;
    this.docu?.stop();
    if (!this.photo.wasUi) document.body.classList.remove('no-ui');
    document.body.classList.remove('jt-photo');
    this.photo = null;
    this.tip('');
    window.__wg?.camera?.('front');
  }

  update(dt) {
    // food falling, landing, being eaten, fading
    const T = this.ctx.terrain;
    for (let i = this.foods.length - 1; i >= 0; i--) {
      const f = this.foods[i];
      if (!f.landed) {
        f.vy -= 3.2 * dt;
        f.g.position.y += f.vy * dt;
        f.g.rotation.y += dt * 2;
        const gy = T.height(f.p.x, f.p.z);
        if (f.g.position.y <= gy) {
          f.g.position.y = gy;
          if (f.vy < -0.6) f.vy = -f.vy * 0.25; // a small bounce
          else {
            f.landed = true;
            this.mod.voice.play('step', f.g.position, 0.4);
            this.call(f);
          }
        }
      }
      if (f.landed && !f.gone) {
        f.age = (f.age || 0) + dt;
        // nobody came: call again now and then; uneaten food withers after a while
        if (f.bites === 0 && f.age > 10 && Math.floor(f.age / 10) !== Math.floor((f.age - dt) / 10)) this.call(f);
        if (f.age > 90) this.finish(f);
      }
      if (f.gone) {
        f.fade -= dt;
        f.g.scale.setScalar(Math.max(0.001, 0.3 * f.fade));
        if (f.fade <= 0) {
          f.g.removeFromParent();
          this.foods.splice(i, 1);
        }
      }
    }
    this.docu?.update(dt);
  }
}
