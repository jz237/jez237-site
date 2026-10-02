// Selection, hover, isolate and x-ray state. Drives the post-pass flags, per-part visibility and the focus dimming.
import * as THREE from 'three';

const _cloud = [];

export class Selection {
  constructor({ bee, post, rig, invalidate }) {
    this.bee = bee;
    this.post = post;
    this.rig = rig;
    this.invalidate = invalidate;
    this.selected = [];
    this.hovered = null;
    this.isolate = false;
    this.xray = false;
    this.focus = 0;
    this.listeners = new Set();
    this.ghosts = new Map();
    this.shellParts = bee.parts.filter((p) => p.tag === 'shell');
    this.furMeshes = [];
    for (const p of bee.parts) for (const m of p.meshes) if (m.userData.fur) this.furMeshes.push({ m, p });
    this.dirtyFlags = true;
    this.onVisibility = null;
  }

  get primary() { return this.selected.length ? this.selected[this.selected.length - 1] : null; }
  get needsId() { return this.selected.length > 0 || !!this.hovered; }
  on(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  _emit(kind) { for (const fn of this.listeners) fn(kind, this); }

  /** Part plus every descendant. */
  subtree(part) { return [...part.walk()]; }
  isSelected(part) { return this.selected.some((s) => s === part || this._within(part, s)); }
  _within(part, anc) { for (let p = part; p && p.parent; p = p.parent) if (p === anc) return true; return false; }

  select(part, { additive = false, toggle = false } = {}) {
    if (!part) return this.clear();
    const had = this.selected.indexOf(part);
    if (toggle && had >= 0) this.selected.splice(had, 1);
    else if (additive || toggle) { if (had < 0) this.selected.push(part); }
    else this.selected = [part];
    this._changed();
  }

  clear() {
    if (!this.selected.length) return;
    this.selected = [];
    this._changed();
  }

  setHover(part) {
    if (part === this.hovered) return;
    this.hovered = part;
    this.dirtyFlags = true;
    this.invalidate();
    this._emit('hover');
  }

  setIsolate(on) {
    if (this.isolate === on) return;
    this.isolate = on;
    this._applyVisibility();
    this._changed(true);
  }

  setXray(on) {
    if (this.xray === on) return;
    this.xray = on;
    this._applyXray();
    this._changed(true);
    this.invalidate(true);
  }

  _changed(skipEmit = false) {
    this.dirtyFlags = true;
    if (this.isolate) this._applyVisibility();
    this.invalidate();
    if (!skipEmit) this._emit('select');
    else this._emit('mode');
  }

  /** Push flag state to the post pass; call before each render. */
  sync() {
    if (!this.dirtyFlags) return;
    this.dirtyFlags = false;
    const sel = [];
    for (const p of this.selected) for (const q of p.walk()) sel.push(q.index);
    const hov = [];
    if (this.hovered && !this.isSelected(this.hovered)) for (const q of this.hovered.walk()) hov.push(q.index);
    this.post.setFlags(sel, hov);
  }

  /** Ease the focus dimming; returns true while it is still moving. */
  update(dt) {
    const target = this.selected.length && !this.isolate ? 1 : 0;
    if (Math.abs(this.focus - target) < 0.003) {
      if (this.focus !== target) { this.focus = target; return true; }
      return false;
    }
    this.focus += (target - this.focus) * (1 - Math.exp(-dt * 11));
    return true;
  }

  frame(ms = 800, margin = 1.55, quat = null, band = null) {
    const parts = [];
    for (const p of this.selected) for (const q of p.walk()) parts.push(q);
    if (!parts.length) return false;
    this.bee.worldCorners(parts, _cloud);
    if (!_cloud.length) return false;
    this.rig.frameCorners(_cloud, { ms, margin: 1 + (margin - 1) * 0.55, quat, band });
    this.invalidate();
    return true;
  }

  _applyVisibility() {
    const keep = new Set();
    if (this.isolate && this.selected.length) for (const p of this.selected) for (const q of p.walk()) keep.add(q);
    for (const p of this.bee.parts) {
      const v = !(this.isolate && this.selected.length) || keep.has(p);
      if (p.ownVisible !== v) p.setOwnVisible(v);
    }
    this._refreshFur();
    this.bee.guideOpacity = this.isolate && this.selected.length ? 0 : 1;
    this.bee.setExplode(this.bee.explode, true);
    this.onVisibility?.();
  }

  _ghostFor(mat) {
    let g = this.ghosts.get(mat);
    if (!g) {
      g = new THREE.MeshPhysicalMaterial({
        color: mat.color ? mat.color.clone().lerp(new THREE.Color(0xdfe9f4), 0.45) : 0xdfe9f4,
        transparent: true, opacity: 0.17, depthWrite: false, roughness: 0.28, metalness: 0.0,
        clearcoat: 1.0, clearcoatRoughness: 0.12, side: THREE.DoubleSide, envMapIntensity: 0.9,
      });
      g.userData.noShadow = true;
      this.ghosts.set(mat, g);
    }
    return g;
  }

  _applyXray() {
    const on = this.xray;
    for (const p of this.shellParts) {
      for (const m of p.meshes) {
        const u = m.userData;
        if (m.userData.fur) continue;
        if (on && !u.xrayOrig) {
          u.xrayOrig = { material: m.material, mask: m.layers.mask, cast: m.castShadow, noPick: !!u.noPick };
          m.material = this._ghostFor(m.material);
          m.layers.disableAll(); m.layers.enable(3);
          m.castShadow = false;
          u.noPick = true;
        } else if (!on && u.xrayOrig) {
          const o = u.xrayOrig;
          m.material = o.material;
          m.layers.mask = o.mask;
          m.castShadow = o.cast;
          u.noPick = o.noPick;
          u.xrayOrig = null;
        }
      }
    }
    this._refreshFur();
    this.onVisibility?.();
  }

  _refreshFur() {
    for (const { m, p } of this.furMeshes) m.visible = p.ownVisible && !this.xray;
  }
}
