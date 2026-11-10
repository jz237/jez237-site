/* Chapter 7 — gradient descent on a two-weight loss surface. Real gradients,
   real updates; click anywhere to start from different "random" weights. */
(function () {
  'use strict';
  const L = Lab, cv = L.$('#trainCanvas');
  if (!cv) return;
  const C = L.C, R = 3.2;
  const loss = (x, y) => {
    const v = y - 0.3 - 0.25 * Math.sin(1.3 * x);
    return 0.06 + 0.12 * (x - 1.2) * (x - 1.2) + 0.9 * v * v - 0.9 * Math.exp(-((x + 1.9) * (x + 1.9) + (y - 0.15) * (y - 0.15)) / 0.45);
  };
  const grad = (x, y) => { const e = 1e-3; return [(loss(x + e, y) - loss(x - e, y)) / (2 * e), (loss(x, y + e) - loss(x, y - e)) / (2 * e)]; };

  // paint the landscape once into an offscreen bitmap
  const map = document.createElement('canvas');
  map.width = 360; map.height = 225;
  (function () {
    const g = map.getContext('2d'), img = g.createImageData(360, 225);
    for (let j = 0; j < 225; j++) for (let i = 0; i < 360; i++) {
      const x = -R + i / 359 * 2 * R, y = -R + j / 224 * 2 * R;
      const l = Math.log(1 + loss(x, y) * 3), band = l * 3.4, fr = band - Math.floor(band);
      const t = L.clamp(l / 3.4), edge = Math.floor(band) % 2 ? 1 : 0.84; void fr;
      const o = (j * 360 + i) * 4;
      img.data[o] = (14 + 150 * t * t) * edge;
      img.data[o + 1] = (70 + 90 * (1 - t) - 40 * t) * edge * (1 - 0.55 * t);
      img.data[o + 2] = (120 + 90 * (1 - t)) * edge * (1 - 0.35 * t);
      img.data[o + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  })();

  const lrEl = L.$('#trainLR'), note = L.$('#trainNote');
  let pos = [2.7, -2.5], trail = [], hist = [], step = 0, running = false, acc = 0, verdict = '';
  let view = null;
  const sx = x => (x + R) / (2 * R) * view.w, sy = y => (y + R) / (2 * R) * view.h;

  function drop(x, y) {
    pos = [x, y]; trail = [[x, y]]; hist = [loss(x, y)]; step = 0; acc = 0; verdict = '';
    running = !L.reduce;
    if (L.reduce) { for (let i = 0; i < 300 && advance(); i++); }
    readout(); L.kick();
  }
  function advance() {
    const lr = Number(lrEl.value), g = grad(pos[0], pos[1]);
    pos = [pos[0] - lr * g[0], pos[1] - lr * g[1]];
    step++;
    const l = loss(pos[0], pos[1]);
    trail.push(pos.slice()); hist.push(l);
    if (Math.abs(pos[0]) > R * 1.6 || Math.abs(pos[1]) > R * 1.6 || !isFinite(l)) { verdict = 'diverged'; running = false; return false; }
    if (Math.hypot(g[0], g[1]) < 0.012) { verdict = Math.hypot(pos[0] + 1.9, pos[1] - 0.15) < 0.8 ? 'local' : 'done'; running = false; return false; }
    if (step >= 400) { verdict = 'slow'; running = false; return false; }
    return true;
  }
  function readout() {
    const l = hist[hist.length - 1], lr = Number(lrEl.value);
    L.$('#trainStep').textContent = step;
    L.$('#trainLoss').textContent = isFinite(l) && l < 999 ? l.toFixed(3) : 'off the chart';
    L.$('#trainProb').textContent = isFinite(l) ? L.pct(Math.exp(-Math.max(0, l)), 0) : '0%';
    L.$('[data-for="trainLR"]').textContent = lr.toFixed(2);
    note.innerHTML =
      verdict === 'diverged' ? '<strong>It blew up.</strong> The step size was so large that each update jumped clean over the valley and landed higher on the far wall. Lower the learning rate and drop again.' :
        verdict === 'local' ? '<strong>Stuck in a dip.</strong> Downhill in every direction looks flat from here, but this is not the deepest point on the map. Real training uses noise and momentum to shake out of dips like this. Click somewhere else to try again.' :
          verdict === 'done' ? '<strong>Settled after ' + step + ' steps.</strong> The slope is now nearly flat: no small nudge to either weight makes the prediction noticeably better. This is what “trained” means.' :
            verdict === 'slow' ? '<strong>Still crawling after 400 steps.</strong> The steps are too small to get anywhere soon. Raise the learning rate.' :
              lr > 0.95 ? '<strong>Large steps.</strong> Watch it zig-zag across the valley instead of rolling down it.' :
                '<strong>Predict, measure, nudge.</strong> At each step the model measures which way is downhill for its current weights and moves a small step that way. It never sees the whole map — only the slope under its feet.';
  }

  function draw(dt) {
    if (running && dt) {
      acc += dt;
      while (acc > 70 && running) { acc -= 70; advance(); readout(); }
    }
    const v = L.fit(cv), ctx = v.ctx;
    view = v;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(map, 0, 0, v.w, v.h);
    // trail
    ctx.lineWidth = 2; ctx.strokeStyle = L.rgba(C.gold, 0.9); ctx.beginPath();
    trail.forEach((p, i) => { if (i) ctx.lineTo(sx(p[0]), sy(p[1])); else ctx.moveTo(sx(p[0]), sy(p[1])); });
    ctx.stroke();
    ctx.fillStyle = L.rgba(C.gold, 0.9);
    trail.forEach((p, i) => { if (i % 2 === 0) { ctx.beginPath(); ctx.arc(sx(p[0]), sy(p[1]), 2, 0, 6.2832); ctx.fill(); } });
    // downhill arrow + ball
    const g = grad(pos[0], pos[1]), gl = Math.hypot(g[0], g[1]) || 1, bx = sx(pos[0]), by = sy(pos[1]);
    if (isFinite(bx) && isFinite(by)) {
      const al = Math.min(46, 14 + gl * 14), ax = bx - g[0] / gl * al, ay = by - g[1] / gl * al, an = Math.atan2(ay - by, ax - bx);
      ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ax, ay); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - 8 * Math.cos(an - 0.45), ay - 8 * Math.sin(an - 0.45));
      ctx.lineTo(ax - 8 * Math.cos(an + 0.45), ay - 8 * Math.sin(an + 0.45)); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(bx, by, 8, 0, 6.2832); ctx.fillStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 18; ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = '#10202b'; ctx.lineWidth = 2; ctx.stroke();
    }
    // labels
    ctx.font = '700 11px ui-monospace,Menlo,Consolas,monospace'; ctx.textBaseline = 'middle';
    ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.fillText('lowest loss', sx(1.2), sy(0.55) + 22);
    ctx.fillText('shallow dip', sx(-1.9), sy(0.15) + 24);
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,.6)';
    ctx.fillText('weight A →', 10, v.h - 12);
    ctx.save(); ctx.translate(12, v.h - 30); ctx.rotate(-Math.PI / 2); ctx.fillText('weight B →', 0, 0); ctx.restore();
    // loss curve inset
    const iw = Math.min(190, v.w * 0.36), ih = 78, ix = v.w - iw - 10, iy = 10;
    L.rr(ctx, ix, iy, iw, ih, 8); ctx.fillStyle = 'rgba(2,8,18,.82)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = C.muted; ctx.textAlign = 'left'; ctx.font = '700 10px ui-monospace,Menlo,Consolas,monospace';
    ctx.fillText('LOSS OVER TIME', ix + 8, iy + 12);
    const hm = Math.max.apply(null, hist.slice(0, 400).map(x => (isFinite(x) ? Math.min(x, 30) : 30)).concat([0.5]));
    ctx.strokeStyle = C.rose; ctx.lineWidth = 2; ctx.beginPath();
    hist.forEach((l, i) => {
      const x = ix + 8 + (iw - 16) * (hist.length > 1 ? i / (hist.length - 1) : 0);
      const y = iy + ih - 8 - (ih - 30) * L.clamp((isFinite(l) ? Math.min(l, 30) : 30) / hm);
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    });
    ctx.stroke();
  }

  let seen = false;
  L.scene(cv, dt => { if (!seen) { seen = true; drop(2.7, -2.5); } draw(dt); });
  cv.addEventListener('click', ev => {
    const r = cv.getBoundingClientRect();
    drop(-R + (ev.clientX - r.left) / r.width * 2 * R, -R + (ev.clientY - r.top) / r.height * 2 * R);
  });
  L.$('#trainDrop').addEventListener('click', () => drop(-2.9 + Math.random() * 5.8, -2.9 + Math.random() * 5.8));
  lrEl.addEventListener('input', readout);
  // keyboard route onto the map: named starting points
  L.$$('[data-train-start]').forEach(b => b.addEventListener('click', () => { const p = b.dataset.trainStart.split(','); drop(Number(p[0]), Number(p[1])); }));
  hist = [loss(pos[0], pos[1])]; trail = [pos.slice()];
  readout();

  // the same idea at full size: every weight of the page's real model, trained live
  const live = L.$('#trainLive');
  if (live && L.trainer) L.trainer.mount(live, { data: 'corpus', fresh: true });
})();
