// APX-9 HUD controller: header, tools, dock, blueprint callouts, inspector, directory, specs, detail views, guided tour.
import { h, icon, button, clamp, loadCSS } from './dom.js';
import { TITLE, SUBTITLE, TAGLINES, GROUPS, DETAILS, VIEW_BUTTONS, TOUR } from './data.js';
import { Inspector, Directory } from './inspector.js';
import { Callouts } from './callouts.js';
import { createSpecs, createHelp, createDetail, createTour } from './panels.js';
import { VIEWS } from './rig.js';

const VIEW_KEYS = ['hero', 'side', 'top', 'front', 'rear', 'under'];
const CYCLE_MS = 2600;
const CYCLE_HOLD = 1500;
const isSmall = () => matchMedia('(max-width: 680px)').matches;
const rectOf = (el) => (el && !el.hidden ? el.getBoundingClientRect() : null);

export async function initUI(app) {
  const { bee, rig, selection, stage, state, Q } = app;
  const root = document.getElementById('ui');
  const labelsHost = document.getElementById('labels');
  const leadersSvg = document.getElementById('leaders');
  if (!root || !labelsHost || !leadersSvg) return null;
  await loadCSS('css/hud.css');

  const params = Q.params;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qa = params.has('qa');
  const ui = { autoCycle: false, tour: -1, detail: null, labelsOn: !isSmall() && params.get('labels') !== '0', pinned: false };
  if (params.get('labels') === '1') ui.labelsOn = true;

  /* ------------------------------------------------------------------ header */
  const tagSpan = h('span', null, TAGLINES[0]);
  const tag = h('p', { class: 'brand-tag', 'aria-hidden': 'true' }, tagSpan);
  const head = h('header', { class: 'hud-head' },
    h('a', { class: 'brand-back', href: '/demos/' }, icon('back'), 'Back to workbench'),
    h('div', { class: 'brand' },
      h('h1', { class: 'brand-title' }, 'APX', h('span', null, '-'), '9'),
      h('p', { class: 'brand-sub' }, SUBTITLE)),
    tag);
  let tagI = 0;
  if (!reduced && !qa) {
    setInterval(() => {
      if (document.hidden) return;
      tag.classList.add('swap');
      setTimeout(() => { tagI = (tagI + 1) % TAGLINES.length; tagSpan.textContent = TAGLINES[tagI]; tag.classList.remove('swap'); }, 720);
    }, 6500);
  }

  /* ------------------------------------------------------------------ tool buttons (top right) */
  const btnDir = button('', 'list', { class: 'icon-btn', title: 'Parts directory (P)', 'aria-label': 'Parts directory', 'aria-pressed': 'false', onclick: () => toggleDirectory() });
  const btnSpecs = button('', 'specs', { class: 'icon-btn', title: 'Specifications (S)', 'aria-label': 'Specifications', 'aria-pressed': 'false', onclick: () => toggleSpecs() });
  const btnTour = button('', 'tour', { class: 'icon-btn', title: 'Guided tour (T)', 'aria-label': 'Guided tour', 'aria-pressed': 'false', onclick: () => (ui.tour >= 0 ? endTour() : startTour()) });
  const btnHelp = button('', 'help', { class: 'icon-btn sep', title: 'Controls (? or H)', 'aria-label': 'Controls', onclick: () => setHelp(true) });
  const top = h('div', { class: 'panel hud-top', role: 'toolbar', 'aria-label': 'Panels' }, btnDir, btnSpecs, btnTour, btnHelp);

  /* ------------------------------------------------------------------ dock */
  const endLo = h('button', { type: 'button', class: 'dock-end hot', onclick: () => app.setExplode(0, 2200) }, 'Assembled');
  const endHi = h('button', { type: 'button', class: 'dock-end', onclick: () => app.setExplode(1, 2200) }, 'Exploded');
  const range = h('input', { type: 'range', min: '0', max: '1000', step: '1', value: '0', 'aria-label': 'Explode', 'aria-valuetext': 'Assembled' });
  const setFill = (v) => {
    range.style.setProperty('--p', `${(v * 100).toFixed(1)}%`);
    const pct = Math.round(v * 100);
    range.setAttribute('aria-valuetext', v < 0.02 ? 'Assembled' : v > 0.98 ? 'Fully exploded' : `${pct}% exploded`);
  };
  range.addEventListener('input', () => {
    stopCycle();
    const v = clamp(+range.value / 1000, 0, 1);
    setFill(v);
    app.setExplode(v, 0);
  });
  const play = button('', 'play', { class: 'icon-btn play', title: 'Auto-cycle the explode animation (C)', 'aria-label': 'Auto-cycle explode', 'aria-pressed': 'false', onclick: () => (ui.autoCycle ? stopCycle() : startCycle()) });
  const dockExplode = h('div', { class: 'dock-explode' }, endLo, h('div', { class: 'dock-slider' }, range), endHi, play);

  const btnRotate = button('', 'rotate', { class: 'icon-btn', title: 'Auto-rotate (A)', 'aria-label': 'Auto-rotate', 'aria-pressed': 'false', onclick: () => setRotate(!rig.autoRotate) });
  const btnXray = button('', 'xray', { class: 'icon-btn', title: 'X-ray shells (X)', 'aria-label': 'X-ray shells', 'aria-pressed': 'false', onclick: () => setXray(!selection.xray) });
  const btnLabels = button('', 'labels', { class: 'icon-btn', title: 'Callout labels (L)', 'aria-label': 'Callout labels', 'aria-pressed': 'false', onclick: () => setLabels(!ui.labelsOn) });
  const viewBtns = VIEW_BUTTONS.map((v, i) => h('button', { type: 'button', class: 'view-btn', 'data-view': v.key, title: `${v.label} view (${i + 1})`, onclick: () => setView(v.key) }, v.label));
  const btnReset = button('', 'reset', { class: 'icon-btn', title: 'Reset the view (R)', 'aria-label': 'Reset the view', onclick: () => resetView() });
  const btnShot = button('', 'camera', { class: 'icon-btn', title: 'Save a PNG screenshot', 'aria-label': 'Save a screenshot', onclick: () => screenshot() });
  const btnFull = button('', 'fullscreen', { class: 'icon-btn', title: 'Full screen', 'aria-label': 'Full screen', onclick: () => toggleFullscreen() });
  const canFull = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
  const dock = h('div', { class: 'panel dock', role: 'toolbar', 'aria-label': 'View controls' },
    dockExplode,
    h('div', { class: 'dock-group' }, btnRotate, btnXray, btnLabels),
    h('div', { class: 'dock-group group-views', role: 'group', 'aria-label': 'Camera views' }, viewBtns),
    h('div', { class: 'dock-group' }, btnReset, btnShot, canFull ? btnFull : null));

  /* ------------------------------------------------------------------ floating bits */
  const tip = h('div', { class: 'tip', role: 'presentation' });
  const toastEl = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' });
  let toastT = 0;
  function toast(msg, ms = 2200) {
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('on'), ms);
  }

  /* ------------------------------------------------------------------ panels */
  const actions = {
    clear: () => { selection.clear(); },
    select: (part, frame = false) => selectPart(part, { frame }),
    hover: (part) => { selection.setHover(part || null); setCalloutHover(part); app.invalidate(); },
    isolate: (on) => { selection.setIsolate(on); refresh(); },
    xray: (on) => setXray(on),
    frame: () => app.frameSelection(),
    layout: () => relayout(),
    detail: (key) => (ui.detail === key ? closeDetail() : openDetail(key)),
    toggleDirectory: (on) => toggleDirectory(on),
  };
  const inspector = new Inspector(app, { host: root, actions });
  const directory = new Directory(app, { host: root, actions });
  const specs = createSpecs({ onClose: () => toggleSpecs(false) });
  const help = createHelp({ onClose: () => setHelp(false) });
  const detail = createDetail({
    onClose: () => closeDetail(),
    onItemHover: (part) => { selection.setHover(part || null); app.invalidate(); },
    onItemPick: (part) => selectPart(part, { frame: true }),
  });
  const tourCard = createTour({ onPrev: () => tourGo(ui.tour - 1), onNext: () => tourGo(ui.tour + 1), onExit: () => endTour() });
  root.append(head, top, dock, specs.el, detail.el, tourCard.el, tip, toastEl);
  document.body.append(help.el);

  /* ------------------------------------------------------------------ callouts */
  const callouts = new Callouts(app, {
    labels: labelsHost,
    leaders: leadersSvg,
    insets: () => calloutInsets(),
    onHover: (item) => {
      selection.setHover(item ? item.part : null);
      app.invalidate();
    },
    onPick: (item, e) => {
      const additive = !!(e && (e.shiftKey || e.ctrlKey || e.metaKey));
      selectPart(item.parts[0], { frame: true, additive });
    },
  });
  const calloutDefs = () => {
    const list = [];
    for (const [key, g] of Object.entries(GROUPS)) {
      if (g.card === false) continue;
      const parts = (g.anchors || []).map((id) => bee.get(id)).filter(Boolean);
      if (!parts.length) continue;
      list.push({ key, title: g.title, bullets: g.bullets, parts, order: g.order });
    }
    return list.sort((a, b) => a.order - b.order);
  };
  callouts.setItems(calloutDefs());
  callouts.setEnabled(ui.labelsOn);

  // true when the viewport can hold both card columns plus a usable model area beside any open panels
  function labelsFit() {
    if (!ui.labelsOn || isSmall()) return ui.labelsOn;
    const W = stage.size.x;
    const dr = rectOf(directory.el), ins = rectOf(inspector.el), sp = rectOf(specs.el);
    const panelL = dr ? dr.right + 12 : 12;
    const panelR = Math.max(ins ? W - ins.left + 12 : 12, sp ? W - sp.left + 12 : 12);
    return W - panelL - panelR >= 2 * (callouts.cardWidth(W) + 26) + 400;
  }

  function calloutInsets() {
    const W = stage.size.x, H = stage.size.y;
    const hd = rectOf(head.querySelector('.brand'));
    const tp = rectOf(top);
    const dk = rectOf(dock);
    const ins = rectOf(inspector.el), dr = rectOf(directory.el), sp = rectOf(specs.el), dt = rectOf(detail.el), tr = rectOf(tourCard.el);
    const small = isSmall();
    const topL = Math.max(small ? 92 : 150, (hd ? hd.bottom : 0) + 14);
    const topR = Math.max(small ? 60 : 70, (tp ? tp.bottom : 0) + 14);
    let left = small ? 8 : 16, right = small ? 8 : 16;
    let bottom = Math.max(70, H - (dk ? dk.top : H - 70) + 14);
    if (!small) {
      if (dr) left = Math.max(left, dr.right + 14);
      if (ins) right = Math.max(right, W - ins.left + 14);
      if (sp) right = Math.max(right, W - sp.left + 14);
      if (tr) bottom = Math.max(bottom, H - tr.top + 10);
    }
    const bottomL = dt && !small ? Math.max(bottom, H - dt.top + 10) : bottom;
    return { top: Math.min(topL, topR), topL, topR, right, bottom, bottomL, bottomR: bottom, left };
  }

  /* ------------------------------------------------------------------ framing band */
  function bandRect() {
    const W = stage.size.x, H = stage.size.y;
    const small = isSmall();
    const hd = rectOf(head.querySelector('.brand'));
    const tp = rectOf(top);
    const dk = rectOf(dock);
    const ins = rectOf(inspector.el), dr = rectOf(directory.el), sp = rectOf(specs.el), tr = rectOf(tourCard.el), dt = rectOf(detail.el);
    let left = 0, right = W, t = 0, b = H;
    if (small) {
      t = Math.max(hd ? hd.bottom : 0, tp ? tp.bottom : 0) + 6;
      b = dk ? dk.top - 6 : H;
      const sheet = [ins, dr, sp, tr, dt].filter(Boolean).reduce((m, r) => Math.min(m, r.top), Infinity);
      if (Number.isFinite(sheet)) b = Math.min(b, sheet - 6);
    } else {
      // the callout columns sit between the side panels and the model, so they add to the panel footprint
      const cw = labelsFit() && callouts.items.length ? callouts.cardWidth(W) + 26 : 0;
      left = Math.max(12, dr ? dr.right + 12 : 0) + cw;
      right = W - (Math.max(12, ins ? W - ins.left + 12 : 0, sp ? W - sp.left + 12 : 0) + cw);
      t = Math.max(54, (tp ? tp.bottom : 0) + 8);
      b = dk ? dk.top - 8 : H - 70;
      if (tr) b = Math.min(b, tr.top - 8);
      if (dt && !dr) left = Math.max(left, dt.right + 12);
    }
    const w = Math.max(160, right - left), hh = Math.max(160, b - t);
    return { w, h: hh, cx: (left + w / 2) - W / 2, cy: (t + hh / 2) - H / 2 };
  }
  app.fitBand = () => {
    if (qa && !params.has('band')) return null;
    return bandRect();
  };

  let layoutRaf = 0;
  function relayout() {
    if (layoutRaf) return;
    layoutRaf = requestAnimationFrame(() => {
      layoutRaf = 0;
      callouts.setSuppressed(!labelsFit());
      callouts.moving = true;
      app.invalidate();
    });
  }

  /* ------------------------------------------------------------------ view / selection helpers */
  function setView(name, ms = 900) {
    if (ui.tour < 0) stopCycle();
    rig.autoRotate = false;
    app.setView(name, ms);
    markViews(name);
    app.invalidate();
  }
  function markViews(active) {
    for (const b of viewBtns) b.classList.toggle('on', b.dataset.view === active);
    ui.view = active;
  }
  function resetView() {
    stopCycle();
    closeDetail(true);
    app.resetView(900);
    markViews('hero');
  }
  function selectPart(part, { frame = false, additive = false } = {}) {
    if (!part) return;
    selection.select(part, { additive });
    if (frame) app.frameSelection();
    refresh();
  }
  function setXray(on) {
    selection.setXray(on);
    btnXray.classList.toggle('on', selection.xray);
    btnXray.setAttribute('aria-pressed', String(selection.xray));
    refresh();
    toast(selection.xray ? 'X-ray on: outer shells ghosted' : 'X-ray off', 1400);
  }
  function setRotate(on) {
    rig.autoRotate = on;
    rig.lastMove = performance.now() - 5000;
    btnRotate.classList.toggle('on', on);
    btnRotate.setAttribute('aria-pressed', String(on));
    app.invalidate();
  }
  function setLabels(on) {
    ui.labelsOn = on;
    callouts.setEnabled(on);
    btnLabels.classList.toggle('on', on);
    btnLabels.setAttribute('aria-pressed', String(on));
    app.invalidate();
    toast(on ? 'Labels on' : 'Labels off', 1200);
  }
  function setCalloutHover(part) {
    const it = part ? callouts.itemForPart(part) : null;
    callouts.setHoverKey(it ? it.key : null);
  }
  function selectedCalloutKeys() {
    const keys = new Set();
    for (const p of selection.selected) { const it = callouts.itemForPart(p); if (it) keys.add(it.key); }
    return [...keys];
  }

  /* ------------------------------------------------------------------ panels open/close */
  function toggleDirectory(on = !directory.open) {
    directory.setOpen(on);
    btnDir.classList.toggle('on', directory.open);
    btnDir.setAttribute('aria-pressed', String(directory.open));
    if (directory.open && isSmall()) { toggleSpecs(false); inspector.hide(); }
    if (directory.open) directory.sync();
    onPanelsChanged();
  }
  function toggleSpecs(on = !specs.open) {
    specs.setOpen(on);
    btnSpecs.classList.toggle('on', specs.open);
    btnSpecs.setAttribute('aria-pressed', String(specs.open));
    if (specs.open && selection.selected.length) { inspector.hide(); }
    else if (!specs.open && selection.selected.length) inspector.render();
    if (specs.open && isSmall()) toggleDirectory(false);
    onPanelsChanged();
  }
  function setHelp(on) {
    help.setOpen(on);
    if (on) { stopCycle(); }
  }
  function onPanelsChanged() {
    relayout();
    if (ui.panelTimer) clearTimeout(ui.panelTimer);
    ui.panelTimer = setTimeout(() => { if (state.framed && selection.selected.length) app.frameSelection(450); }, 60);
  }

  /* ------------------------------------------------------------------ detail views */
  function openDetail(key) {
    const def = DETAILS[key];
    if (!def) return;
    stopCycle();
    const rootPart = bee.get(def.root);
    if (!rootPart) { toast('That detail view is not available'); return; }
    ui.detail = key;
    detail.show(def, (child) => bee.get(`${def.root}/${child}`));
    if (app.state.explode < 0.55) app.setExplode(1, 1600);
    selection.select(rootPart);
    app.frameSelection(900, 1.5, (VIEWS[def.view] || VIEWS.hero)());
    refresh();
    onPanelsChanged();
  }
  function closeDetail(quiet = false) {
    if (!ui.detail) return;
    ui.detail = null;
    detail.hide();
    if (!quiet) onPanelsChanged();
  }

  /* ------------------------------------------------------------------ auto-cycle explode */
  let cycleT = 0;
  function startCycle() {
    if (ui.tour >= 0) return;
    ui.autoCycle = true;
    play.setAttribute('aria-pressed', 'true');
    play.replaceChildren(icon('pause'));
    const hi = () => {
      if (!ui.autoCycle) return;
      app.setExplode(1, CYCLE_MS);
      cycleT = setTimeout(lo, CYCLE_MS + CYCLE_HOLD);
    };
    const lo = () => {
      if (!ui.autoCycle) return;
      app.setExplode(0, CYCLE_MS);
      cycleT = setTimeout(hi, CYCLE_MS + CYCLE_HOLD * 0.6);
    };
    rig.autoRotate = true;
    rig.autoSpeed = 0.2;
    btnRotate.classList.add('on');
    btnRotate.setAttribute('aria-pressed', 'true');
    app.getExplode() > 0.5 ? lo() : hi();
  }
  function stopCycle() {
    if (!ui.autoCycle) return;
    ui.autoCycle = false;
    clearTimeout(cycleT);
    play.setAttribute('aria-pressed', 'false');
    play.replaceChildren(icon('play'));
  }

  /* ------------------------------------------------------------------ guided tour */
  function startTour() {
    stopCycle();
    closeDetail(true);
    toggleSpecs(false);
    toggleDirectory(false);
    selection.clear();
    ui.tour = 0;
    btnTour.classList.add('on');
    btnTour.setAttribute('aria-pressed', 'true');
    tourCard.show();
    tourGo(0);
  }
  function tourGo(i) {
    if (i < 0) return;
    if (i >= TOUR.length) { endTour(); return; }
    ui.tour = i;
    const s = TOUR[i];
    tourCard.set(i, TOUR);
    rig.autoRotate = false;
    app.setExplode(s.explode, i === 0 ? 900 : 1700);
    const part = s.id ? bee.get(s.id) : null;
    if (part) {
      selection.select(part);
      app.frameSelection(1400, 1.7, (VIEWS[s.view] || VIEWS.hero)());
    } else {
      selection.clear();
      app.setView(s.view, 1400);
      markViews(s.view);
    }
    refresh();
    relayout();
  }
  function endTour() {
    if (ui.tour < 0) return;
    ui.tour = -1;
    tourCard.hide();
    btnTour.classList.remove('on');
    btnTour.setAttribute('aria-pressed', 'false');
    selection.clear();
    app.resetView(900);
    markViews('hero');
    relayout();
  }

  /* ------------------------------------------------------------------ screenshot / fullscreen */
  function screenshot() {
    try {
      app.draw();
      app.canvas.toBlob((blob) => {
        if (!blob) { toast('Screenshot failed'); return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `apx-9-${selection.primary ? selection.primary.id.replace(/[^\w-]+/g, '-') : 'exploded-view'}.png`;
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        toast('Screenshot saved');
      }, 'image/png');
    } catch (e) {
      console.warn('[apx9] screenshot failed', e);
      toast('Screenshot is unavailable in this browser');
    }
  }
  function toggleFullscreen() {
    const el = document.documentElement;
    if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
  }
  document.addEventListener('fullscreenchange', () => { document.body.classList.toggle('is-fs', !!document.fullscreenElement); relayout(); });

  /* ------------------------------------------------------------------ hash sync */
  function writeHash() {
    const p = selection.primary;
    const next = p && selection.selected.length === 1 ? `#p=${encodeURIComponent(p.id)}` : '';
    if (location.hash !== next && (next || location.hash)) history.replaceState(null, '', next || `${location.pathname}${location.search}`);
  }
  window.addEventListener('hashchange', () => {
    const id = decodeURIComponent((location.hash.match(/^#p=(.+)$/) || [])[1] || '');
    const p = id ? bee.get(id) : null;
    if (p && selection.primary !== p) { selection.select(p); app.frameSelection(600); refresh(); }
  });

  /* ------------------------------------------------------------------ refresh (selection -> UI) */
  function refresh() {
    const sel = selection.selected;
    if (sel.length) {
      if (specs.open && !isSmall()) toggleSpecs(false);
      inspector.render();
    } else inspector.hide();
    directory.sync();
    detail.mark(sel);
    callouts.setSelectedKeys(selectedCalloutKeys());
    btnXray.classList.toggle('on', selection.xray);
    btnXray.setAttribute('aria-pressed', String(selection.xray));
    if (ui.detail && !sel.length) closeDetail();
    writeHash();
    app.invalidate();
  }

  /* ------------------------------------------------------------------ hover tooltip */
  let tipPart = null;
  function showTip(part, e) {
    if (!part || !e || e.pointerType === 'touch' || !part.name) { tip.classList.remove('on'); tipPart = null; return; }
    if (part !== tipPart) {
      tipPart = part;
      tip.replaceChildren(part.name, h('small', null, GROUPS[part.group]?.short || part.group || 'APX-9'));
    }
    const r = tip.getBoundingClientRect();
    const W = stage.size.x, H = stage.size.y;
    const x = clamp(e.clientX + 14, 8, W - r.width - 8);
    const y = clamp(e.clientY + 18, 8, H - r.height - 8);
    tip.style.transform = `translate3d(${x.toFixed(0)}px,${y.toFixed(0)}px,0)`;
    tip.classList.add('on');
  }

  /* ------------------------------------------------------------------ hooks called by main.js */
  app.onExplode = (v) => {
    const q = Math.round(v * 1000);
    if (+range.value !== q && document.activeElement !== range) range.value = String(q);
    setFill(v);
    endLo.classList.toggle('hot', v < 0.5);
    endHi.classList.toggle('hot', v >= 0.5);
    callouts.moving = true;
  };
  app.onInteract = () => {
    if (ui.autoCycle) stopCycle();
    btnRotate.classList.remove('on');
    btnRotate.setAttribute('aria-pressed', 'false');
    tip.classList.remove('on');
    markViews(null);
    callouts.moving = true;
  };
  app.onHover = (part, e) => {
    selection.hovered !== part && selection.setHover(part);
    setCalloutHover(part);
    showTip(part, e);
    canvasCursor(!!part);
  };
  app.onTap = () => { tip.classList.remove('on'); };
  app.onSelect = () => { refresh(); };
  app.afterRender = () => { fpsGovernor(); };
  app.tick = (dt, now) => {
    let again = false;
    if (callouts.active && callouts.update(dt)) again = true;
    else if (callouts.active && callouts.moving) again = true;
    return again;
  };

  function canvasCursor(on) { app.canvas.style.cursor = on ? 'pointer' : ''; }

  /* ------------------------------------------------------------------ adaptive resolution governor */
  const gov = { t: performance.now(), n: 0, low: 0, cooldown: 0 };
  function fpsGovernor() {
    if (qa || params.has('dpr')) return;
    gov.n++;
    const now = performance.now();
    if (now - gov.t < 1500) return;
    const fps = (gov.n * 1000) / (now - gov.t);
    gov.t = now; gov.n = 0;
    if (state.tween || rig.drag || rig.tween || rig.autoRotate || ui.autoCycle || ui.tour >= 0) {
      if (fps < 26 && now > gov.cooldown) {
        gov.low++;
        if (gov.low >= 2 && Q.dpr > 0.8) {
          Q.dpr = Math.max(0.8, Q.dpr * 0.8);
          gov.low = 0;
          gov.cooldown = now + 2500;
          app.resize();
        }
      } else gov.low = 0;
    }
  }

  /* ------------------------------------------------------------------ keyboard (capture so panels do not eat shortcuts) */
  window.addEventListener('keydown', (e) => {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) {
      if (e.key === 'Escape' && e.target === directory.input) { directory.input.value = ''; directory.search(''); directory.input.blur(); e.stopPropagation(); }
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (help.open) {
      if (e.key === 'Escape' || e.key === '?' || e.key === 'h' || e.key === 'H') { e.preventDefault(); setHelp(false); }
      else if (e.key === 'Tab') { e.preventDefault(); help.ok.focus({ preventScroll: true }); }
      e.stopPropagation();
      return;
    }
    const k = e.key;
    const n = VIEW_KEYS[+k - 1];
    if (n && +k >= 1 && +k <= 6) { e.preventDefault(); e.stopPropagation(); setView(n); return; }
    if (ui.tour >= 0) {
      if (k === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); tourGo(ui.tour + 1); return; }
      if (k === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); tourGo(ui.tour - 1); return; }
      if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); endTour(); return; }
    }
    switch (k) {
      case 'Escape':
        if (specs.open) { toggleSpecs(false); e.stopPropagation(); }
        else if (ui.detail) { closeDetail(); e.stopPropagation(); }
        else if (directory.open && !selection.selected.length) { toggleDirectory(false); e.stopPropagation(); }
        return;
      case 'i': case 'I': if (selection.selected.length) { selection.setIsolate(!selection.isolate); refresh(); } else toast('Select a part first, then press I to isolate it', 1800); break;
      case 'x': case 'X': setXray(!selection.xray); break;
      case 'l': case 'L': setLabels(!ui.labelsOn); break;
      case 'a': case 'A': setRotate(!rig.autoRotate); break;
      case 'c': case 'C': ui.autoCycle ? stopCycle() : startCycle(); break;
      case '[': inspector.step(-1); break;
      case ']': inspector.step(1); break;
      case 'p': case 'P': toggleDirectory(); break;
      case 's': case 'S': toggleSpecs(); break;
      case 't': case 'T': ui.tour >= 0 ? endTour() : startTour(); break;
      case '?': case 'h': case 'H': setHelp(true); break;
      default: return;
    }
    e.preventDefault();
    e.stopPropagation();
    app.invalidate();
  }, true);

  /* ------------------------------------------------------------------ resize + labels policy */
  let lastSmall = isSmall();
  const syncHead = () => root.style.setProperty('--dir-top', `${Math.round(head.getBoundingClientRect().bottom + 10)}px`);
  syncHead();
  const ro = new ResizeObserver(() => {
    syncHead();
    const s = isSmall();
    if (s !== lastSmall) {
      lastSmall = s;
      if (s) { setLabels(false); }
      else if (params.get('labels') !== '0') setLabels(true);
    }
    relayout();
  });
  ro.observe(root);
  ro.observe(head);

  btnLabels.classList.toggle('on', ui.labelsOn);
  btnLabels.setAttribute('aria-pressed', String(ui.labelsOn));
  markViews('hero');
  app.onExplode(app.getExplode());

  // dragging hides leader clutter on phones only; desktop keeps cards live (they glide with the model)
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopCycle(); });

  const api = {
    refresh,
    toast,
    setLabels,
    setHelp,
    toggleSpecs,
    toggleDirectory,
    startTour,
    endTour,
    openDetail,
    closeDetail,
    callouts,
    inspector,
    directory,
    get state() { return { ...ui, small: isSmall(), band: bandRect() }; },
  };
  app.uiApi = api;
  callouts.moving = true;
  app.invalidate();
  return api;
}
