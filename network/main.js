/* ===================================================================
   main.js — bootstraps the network map page:
   data → sim adapter → map renderer → inspector → audio, plus the
   HUD (totals, clock, legend, controls) and Escape-level navigation.
   =================================================================== */

(function () {
  'use strict';

  function init() {
    const NetMap = window.NetMap;
    const data = window.NETMAP_DATA;
    const canvas = document.getElementById('netmap-canvas');
    if (!NetMap || !data || !canvas) return;

    const tooltip = document.getElementById('netmap-tooltip');
    const liveRegion = document.getElementById('netmap-live');
    const totalDown = document.getElementById('netmap-total-down');
    const totalUp = document.getElementById('netmap-total-up');
    const clockEl = document.getElementById('netmap-clock');

    /* ---------- legend ---------- */
    const legend = document.getElementById('netmap-legend');
    NetMap.TRAFFIC_CLASSES.forEach(cls => {
      const key = document.createElement('span');
      key.className = 'key';
      key.style.setProperty('--k', 'var(--nm-class-' + cls + ')');
      key.innerHTML = '<i></i>' + NetMap.CLASS_LABELS[cls];
      legend.appendChild(key);
    });

    /* ---------- map ---------- */
    let inspector = null;
    const map = NetMap.createMap({
      canvas,
      data,
      onHover(node, pos) {
        if (!node || !pos) { tooltip.hidden = true; return; }
        showTooltip(node, pos);
      },
      onHoverMove(node, pos) {
        if (!tooltip.hidden) positionTooltip(pos);
      },
      onSelect(node) {
        map.setSelected(node.id);
        map.focusNode(node.id, Math.max(1.4, 1.9));
        inspector.open(node);
        tooltip.hidden = true;
      },
      onAnnounce(text) { liveRegion.textContent = text; }
    });

    let lastSample = null;
    function showTooltip(node, pos) {
      const dev = lastSample && lastSample.devices[node.id];
      let html = '<div class="tt-name">' + node.label + '</div>';
      if (node.ip) html += '<div class="tt-meta">' + node.ip + '</div>';
      if (dev) {
        html += '<div class="tt-rate tt-meta">▼ <b>' + NetMap.fmtRate(dev.rx) + '</b> · ▲ <b>' + NetMap.fmtRate(dev.tx) + '</b></div>';
      } else if (node.tier === 0) {
        html += '<div class="tt-meta">' + (node.notes || 'Upstream') + '</div>';
      }
      tooltip.innerHTML = html;
      tooltip.hidden = false;
      positionTooltip(pos);
    }
    function positionTooltip(pos) {
      const stage = canvas.parentElement.getBoundingClientRect();
      const x = Math.max(70, Math.min(stage.width - 70, pos.x));
      const y = Math.max(58, pos.y);
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }

    /* ---------- inspector ---------- */
    inspector = NetMap.createInspector({
      el: document.getElementById('netmap-inspector'),
      byId: map.byId,
      onClose() { map.setSelected(null); canvas.focus({ preventScroll: true }); }
    });

    /* ---------- audio ---------- */
    const audio = NetMap.createAudio();
    const audioBtn = document.getElementById('netmap-audio-toggle');
    audioBtn.addEventListener('click', () => {
      const on = audio.toggle();
      audioBtn.setAttribute('aria-pressed', String(on));
      audioBtn.querySelector('.ico').textContent = on ? '🔊' : '🔇';
      liveRegion.textContent = on ? 'Network sound on' : 'Network sound off';
    });

    /* ---------- controls ---------- */
    document.getElementById('netmap-zoom-in').addEventListener('click', () => map.zoomBy(1.3));
    document.getElementById('netmap-zoom-out').addEventListener('click', () => map.zoomBy(0.77));
    document.getElementById('netmap-reset').addEventListener('click', () => {
      inspector.close();
      map.resetView();
    });

    /* Escape steps back one level: L3 → L2 → close → overview */
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (inspector.back()) { e.preventDefault(); return; }
      map.resetView();
    });

    /* ---------- adapter (sim now; ?adapter=live reserved) ---------- */
    // A future live adapter can be selected with ?adapter=live&src=<url>;
    // see the contract in traffic-sim.js. For now, always simulate.
    const adapter = NetMap.SimAdapter(data);
    adapter.start(sample => {
      lastSample = sample;
      map.setSample(sample);
      inspector.setSample(sample);
      audio.setSample(sample, map.byId);

      let rx = 0, tx = 0;
      Object.keys(sample.devices).forEach(id => {
        const n = map.byId[id];
        // sum only leaf/edge devices so infra aggregation doesn't double-count
        if (n && n.tier !== 1 && n.tier !== 2) { rx += sample.devices[id].rx; tx += sample.devices[id].tx; }
      });
      totalDown.textContent = NetMap.fmtRate(rx);
      totalUp.textContent = NetMap.fmtRate(tx);
    });

    /* ---------- clock ---------- */
    function tickClock() {
      clockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    tickClock();
    setInterval(tickClock, 30000);

    map.resetView();
    map.start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
