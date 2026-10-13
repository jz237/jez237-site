// Field guide panel, click-to-select and the follow camera.
//
// The panel sits under Weatherglass's top-right buttons and uses its glass-panel styling (.wg-panel and
// the HUD's CSS variables). Selecting an animal (from the list, or by clicking it in the case) eases the
// camera onto it and keeps following; the usual drag/zoom still orbit around it.
import { Vector3 } from 'three';

const CSS = `
.jt-guide{right:calc(var(--gut,16px) + var(--sar,0px));top:calc(var(--gut,16px) + var(--sat,0px) + 54px);
  width:min(300px,calc(100vw - 32px));padding:10px 10px 8px;border-radius:18px;color:var(--ink,#f4efe6);
  font-family:var(--font,system-ui);max-height:calc(100vh - 240px);overflow:auto;transition:opacity .3s}
.jt-guide h3{margin:2px 6px 8px;font:400 15px/1 var(--serif,Georgia,serif);letter-spacing:.06em;
  display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.jt-guide h3 small{font:500 10px/1 var(--font,system-ui);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2,#cfc8bb)}
.jt-guide.closed .jt-list,.jt-guide.closed .jt-card,.jt-guide.closed .jt-actions{display:none}
.jt-guide h3 .jt-t{display:flex;align-items:center;gap:7px}
.jt-chev{display:inline-block;width:7px;height:7px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
  transform:rotate(45deg) translate(-2px,-2px);transition:transform .25s;opacity:.75}
.jt-guide.closed .jt-chev{transform:rotate(-45deg)}
.jt-guide h3:focus-visible{outline:2px solid var(--accent,#ffd98a);outline-offset:3px;border-radius:8px}
.jt-list{display:flex;flex-direction:column;gap:2px}
.jt-item{display:flex;align-items:center;gap:9px;padding:7px 8px;border:0;border-radius:12px;background:none;
  color:inherit;text-align:left;cursor:pointer;font:inherit;transition:background .2s}
.jt-item:hover{background:#ffffff14}.jt-item.on{background:#ffd98a24}
.jt-item i{width:9px;height:9px;border-radius:50%;flex:none;box-shadow:0 0 0 2px #0004}
.jt-item b{font-weight:600;font-size:13px}.jt-item em{font-size:11px;color:var(--ink-2,#cfc8bb);margin-left:auto}
.jt-item.soon{opacity:.45;cursor:default}
.jt-card{margin:8px 4px 2px;padding:10px 10px 8px;border-top:1px solid #ffffff1f;font-size:12px;line-height:1.45}
.jt-card .jt-latin{font:italic 400 14px var(--serif,Georgia,serif);color:var(--accent,#ffd98a)}
.jt-card .jt-era{color:var(--ink-2,#cfc8bb);margin:2px 0 6px}
.jt-card dl{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;margin:0 0 6px}
.jt-card dt{color:var(--ink-2,#cfc8bb)}.jt-card dd{margin:0}
.jt-card .jt-btns{display:flex;gap:6px;margin-top:8px}
.jt-card button{flex:1;padding:6px 8px;border:1px solid #ffffff2a;border-radius:999px;background:#ffffff10;color:inherit;
  font:600 11px var(--font,system-ui);letter-spacing:.04em;cursor:pointer}
.jt-card button:hover{background:#ffffff22}
body.no-ui .jt-guide{display:none}
@media (max-width:700px){.jt-guide{top:auto;bottom:calc(var(--gut,16px) + 150px);width:min(260px,calc(100vw - 24px));
    max-height:calc(100vh - 300px)}
  /* minimised: a small pill that stays out of the way of the case */
  .jt-guide.closed{width:auto;padding:9px 14px;border-radius:999px}
  .jt-guide.closed h3{margin:0;gap:10px}.jt-guide.closed h3 small{display:none}}
`;

export class Guide {
  constructor(mod, species) {
    this.mod = mod;
    this.species = species;
    this.follow = null;
    this.pickStart = null;
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.append(style);
    const host = document.querySelector('.wg-hud') || document.getElementById('ui') || document.body;
    const el = (this.el = document.createElement('div'));
    el.className = 'wg-panel jt-guide';
    el.innerHTML = `<h3 role="button" tabindex="0" aria-expanded="true"><span class="jt-t"><i class="jt-chev"></i>Field guide</span><small>Dinosaurs</small></h3><div class="jt-list"></div><div class="jt-card" hidden></div>`;
    host.append(el);
    // keep pointer events on the panel from reaching the scene's tools
    for (const ev of ['pointerdown', 'pointermove', 'pointerup', 'wheel', 'click'])
      el.addEventListener(ev, (e) => e.stopPropagation());
    // minimise / restore by tapping the heading; phones start minimised, and the choice is remembered
    const head = el.querySelector('h3');
    const setClosed = (c, save = true) => {
      el.classList.toggle('closed', c);
      head.setAttribute('aria-expanded', String(!c));
      if (save) try { localStorage.setItem('jt-guide-closed', c ? '1' : '0'); } catch {}
    };
    head.addEventListener('click', () => setClosed(!el.classList.contains('closed')));
    head.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') (e.preventDefault(), setClosed(!el.classList.contains('closed')));
    });
    let saved = null;
    try { saved = localStorage.getItem('jt-guide-closed'); } catch {}
    setClosed(saved != null ? saved === '1' : !!window.matchMedia?.('(max-width: 700px)').matches, false);
    this.list = el.querySelector('.jt-list');
    this.card = el.querySelector('.jt-card');
    this.render();
    const canvas = document.getElementById('scene');
    canvas.addEventListener('pointerdown', (e) => (this.pickStart = { x: e.clientX, y: e.clientY, t: performance.now() }), true);
    canvas.addEventListener(
      'pointerup',
      (e) => {
        const s = this.pickStart;
        this.pickStart = null;
        if (!s || e.button !== 0) return;
        if (Math.hypot(e.clientX - s.x, e.clientY - s.y) > 6 || performance.now() - s.t > 450) return;
        const d = this.pick(e.clientX, e.clientY);
        if (d) this.select(d);
      },
      true,
    );
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.follow) this.release();
    });
  }

  render() {
    const present = new Set(this.mod.dinos.map((d) => d.sp.id));
    this.list.innerHTML = '';
    for (const sp of this.species) {
      const b = document.createElement('button');
      b.className = 'jt-item' + (present.has(sp.id) ? '' : ' soon') + (this.follow?.sp.id === sp.id ? ' on' : '');
      b.innerHTML = `<i style="background:${sp.dot}"></i><b>${sp.common}</b><em>${present.has(sp.id) ? sp.badge : 'hatching soon'}</em>`;
      if (present.has(sp.id)) b.addEventListener('click', () => this.cycle(sp.id));
      this.list.append(b);
    }
  }

  cycle(id) {
    const all = this.mod.dinos.filter((d) => d.sp.id === id);
    if (!all.length) return;
    const i = this.follow && this.follow.sp.id === id ? (all.indexOf(this.follow) + 1) % all.length : 0;
    this.select(all[i]);
  }

  select(d) {
    this.follow = d;
    const rig = this.mod.ctx.cameraRig;
    const h = d.height;
    rig.goal.radius = Math.max(rig.limits.minRadius, Math.min(rig.goal.radius, d.followRadius));
    rig.goal.phi = Math.min(rig.goal.phi, 1.25);
    rig.poke?.();
    const sp = d.sp;
    const info = d.info;
    this.card.hidden = false;
    this.card.innerHTML = `<div class="jt-latin">${info.name}</div><div class="jt-era">${sp.era}</div>
      <dl><dt>Length</dt><dd>${sp.size || info.length + ' m'}</dd><dt>Weight</dt><dd>${sp.mass}</dd><dt>Diet</dt><dd>${sp.diet}</dd></dl>
      <div>${sp.fact}</div><div class="jt-btns"><button data-a="next">Next ${sp.common}</button><button data-a="stop">Stop following</button></div>`;
    this.card.querySelector('[data-a=next]').addEventListener('click', () => this.cycle(sp.id));
    this.card.querySelector('[data-a=stop]').addEventListener('click', () => this.release());
    this.render();
  }

  release() {
    this.follow = null;
    this.card.hidden = true;
    const rig = this.mod.ctx.cameraRig;
    rig.goalTarget.set(0, 1.7, 0);
    rig.goal.radius = Math.max(rig.goal.radius, 14);
    this.render();
  }

  pick(x, y) {
    const cam = this.mod.ctx.camera;
    const v = new Vector3();
    let best = null;
    let bd = Infinity;
    for (const d of this.mod.dinos) {
      for (const p of d.pickPoints()) {
        v.copy(p).project(cam);
        if (v.z > 1) continue;
        const sx = ((v.x + 1) / 2) * innerWidth;
        const sy = ((1 - v.y) / 2) * innerHeight;
        const dist = Math.hypot(sx - x, sy - y);
        // radius in pixels of the body at that depth
        const r = Math.max(14, (d.pickRadius / p.distanceTo(cam.position)) * innerHeight * 1.2);
        if (dist < r && dist / r < bd) (bd = dist / r), (best = d);
      }
    }
    return best;
  }

  update(dt) {
    const d = this.follow;
    if (!d) return;
    const rig = this.mod.ctx.cameraRig;
    const p = d.root.position;
    rig.goalTarget.set(p.x, p.y + d.height * 0.55, p.z);
    rig.idle = 0;
  }
}
