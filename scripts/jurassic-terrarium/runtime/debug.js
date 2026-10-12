// ?debug: a small panel of switches for each part of the scene, to find which one misbehaves on a given
// machine (e.g. flicker that does not show up here). Untick until the problem goes away.
export function debugPanel(ctx, mod) {
  const S = ctx.scene;
  const byName = (re) => {
    const list = [];
    S.traverse((o) => re.test(o.name || '') && list.push(o));
    return list;
  };
  const vis = (re) => ({ get: () => byName(re).some((o) => o.visible), set: (v) => byName(re).forEach((o) => (o.visible = v)) });
  const post = ctx.post || ctx.modules?.post;
  let grade = null;
  const seen = new Set();
  const walk = (o, d) => {
    if (!o || typeof o !== 'object' || seen.has(o) || d > 4 || grade) return;
    seen.add(o);
    if (o.uniforms?.uGrain) return void (grade = o);
    for (const k of Object.keys(o)) if (!['parent', 'children', 'scene'].includes(k)) try { walk(o[k], d + 1); } catch { /* */ }
  };
  walk(ctx, 0);
  const grain0 = grade?.uniforms.uGrain.value ?? 0;
  const items = [
    ['Planting (ferns, tree ferns)', vis(/^jurassic-flora$/)],
    ['Dinosaurs', { get: () => mod.dinos.every((d) => d.root.visible), set: (v) => mod.dinos.forEach((d) => (d.root.visible = v)) }],
    ['Lid lamps + halos', vis(/^lid-lamps$/)],
    ['Lid lamp lights', { get: () => !!mod.lamps?.spots[0]?.visible, set: (v) => mod.lamps?.spots.forEach((s) => (s.visible = v)) }],
    ['Jetty lantern', vis(/^jetty-lantern$/)],
    ['Room backdrop', vis(/^glassBackdrop$/)],
    ['Steam, dust, splashes', vis(/^effects$/)],
    ['Pool: eelgrass, stones', vis(/^aquatic$/)],
    ['Nest', vis(/^nest$/)],
    ['Weatherglass vegetation', vis(/^vegetation$/)],
    ['Weatherglass water', vis(/^water$/)],
    ['Weatherglass clouds', vis(/^clouds$/)],
    ['Weatherglass fog', vis(/^fog-/)],
    ['Weatherglass life (cabin, fireflies...)', vis(/^life$/)],
    ['Rain & snow', vis(/^precip-/)],
    ['Shadows', { get: () => ctx.renderer.shadowMap.enabled, set: (v) => { ctx.renderer.shadowMap.enabled = v; S.traverse((o) => o.material && ([].concat(o.material).forEach((m) => (m.needsUpdate = true)))); } }],
    ['Glow (bloom)', { get: () => !!post?.bloom?.enabled, set: (v) => post?.bloom && (post.bloom.enabled = v) }],
    ['Soft focus (tilt-shift)', { get: () => !!post?.tiltX?.enabled, set: (v) => post?.tiltX && (post.tiltX.enabled = post.tiltY.enabled = v) }],
    ['Film grain', { get: () => (grade?.uniforms.uGrain.value ?? 0) > 0, set: (v) => grade && (grade.uniforms.uGrain.value = v ? grain0 : 0) }],
    ['Camera drift', { get: () => ctx.cameraRig.enabledDrift !== false, set: (v) => (ctx.cameraRig.enabledDrift = v) }],
  ];
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;left:12px;top:70px;z-index:60;background:rgba(20,16,12,.88);color:#f4ead8;font:13px/1.5 system-ui,sans-serif;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,217,138,.35);max-height:80vh;overflow:auto';
  box.innerHTML = '<div style="font-weight:600;margin-bottom:6px">Diagnostics — untick until the flicker stops</div>';
  for (const [label, it] of items) {
    const row = document.createElement('label');
    row.style.cssText = 'display:flex;gap:8px;align-items:center;cursor:pointer;white-space:nowrap';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = it.get();
    cb.onchange = () => it.set(cb.checked);
    row.append(cb, document.createTextNode(label));
    box.append(row);
  }
  const fps = document.createElement('div');
  fps.style.cssText = 'margin-top:6px;opacity:.75';
  box.append(fps);
  let n = 0, t0 = performance.now();
  const tick = () => {
    n++;
    const now = performance.now();
    if (now - t0 > 1000) {
      fps.textContent = `${Math.round((n * 1000) / (now - t0))} fps · resolution ${ctx.renderer.getPixelRatio().toFixed(2)}x`;
      n = 0;
      t0 = now;
    }
    requestAnimationFrame(tick);
  };
  tick();
  document.body.append(box);
}
