/* ===================================================================
   main.js — bootstraps the network map page:
   data → adapter (sim, or owner-only live via ?adapter=live&src=…) →
   map renderer → inspector → audio, plus the HUD (totals, clock, mode
   badge, legend filters, search, top talkers, day scrubber) and
   Escape-level navigation. Supports ?focus=<node-id> deep links.
   =================================================================== */

(function () {
  'use strict';

  function init() {
    const NetMap = window.NetMap;
    const data = window.NETMAP_DATA;
    const canvas = document.getElementById('netmap-canvas');
    if (!NetMap || !data || !canvas) return;

    const params = new URLSearchParams(location.search);
    const tooltip = document.getElementById('netmap-tooltip');
    const liveRegion = document.getElementById('netmap-live');
    const totalDown = document.getElementById('netmap-total-down');
    const totalUp = document.getElementById('netmap-total-up');
    const clockEl = document.getElementById('netmap-clock');
    const modeEl = document.getElementById('netmap-mode');

    /* ---------- adapter: sim by default; live is owner-only ---------- */
    // Live mode only works where the CSP allows the exporter origin —
    // i.e. locally on the LAN, never on the deployed site. See
    // network/exporter/README.md.
    let adapter;
    const liveSrc = params.get('src');
    if (params.get('adapter') === 'live' && liveSrc && NetMap.LiveAdapter) {
      adapter = NetMap.LiveAdapter(liveSrc);
    } else {
      adapter = NetMap.SimAdapter(data);
    }
    const isLive = adapter.kind === 'live';

    /* ---------- legend (click to isolate a traffic class) ---------- */
    const legend = document.getElementById('netmap-legend');
    let classFilter = null;
    const legendBtns = {};
    NetMap.TRAFFIC_CLASSES.forEach(cls => {
      const key = document.createElement('button');
      key.type = 'button';
      key.className = 'key';
      key.setAttribute('aria-pressed', 'false');
      key.title = 'Show only ' + NetMap.CLASS_LABELS[cls] + ' traffic';
      key.style.setProperty('--k', 'var(--nm-class-' + cls + ')');
      key.innerHTML = '<i></i>' + NetMap.CLASS_LABELS[cls];
      key.addEventListener('click', () => {
        classFilter = classFilter === cls ? null : cls;
        Object.keys(legendBtns).forEach(k => {
          legendBtns[k].setAttribute('aria-pressed', String(k === classFilter));
          legendBtns[k].classList.toggle('active', k === classFilter);
        });
        legend.classList.toggle('filtering', !!classFilter);
        map.setClassFilter(classFilter);
        liveRegion.textContent = classFilter
          ? 'Showing only ' + NetMap.CLASS_LABELS[classFilter] + ' traffic'
          : 'Showing all traffic';
      });
      legendBtns[cls] = key;
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
      onSelect(node) { selectNode(node); },
      onAnnounce(text) { liveRegion.textContent = text; }
    });

    function setFocusParam(id) {
      const p = new URLSearchParams(location.search);
      if (id) p.set('focus', id); else p.delete('focus');
      const qs = p.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }

    function selectNode(node) {
      map.setSelected(node.id);
      map.focusNode(node.id, 1.9);
      inspector.open(node);
      tooltip.hidden = true;
      setFocusParam(node.id);
    }

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
      onClose() {
        map.setSelected(null);
        setFocusParam(null);
        canvas.focus({ preventScroll: true });
      }
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

    /* ---------- zoom / reset ---------- */
    document.getElementById('netmap-zoom-in').addEventListener('click', () => map.zoomBy(1.3));
    document.getElementById('netmap-zoom-out').addEventListener('click', () => map.zoomBy(0.77));
    document.getElementById('netmap-reset').addEventListener('click', () => {
      inspector.close();
      map.resetView();
    });

    /* Escape steps back one level: L3 → L2 → close → overview */
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (document.activeElement === searchEl && searchEl.value) return; // let search clear itself
      if (inspector.back()) { e.preventDefault(); return; }
      map.resetView();
    });

    /* ---------- search ---------- */
    const searchEl = document.getElementById('netmap-search');
    function runSearch() {
      const q = searchEl.value.trim().toLowerCase();
      if (!q) { map.setHighlight(null); liveRegion.textContent = ''; return []; }
      const ids = map.nodes
        .filter(n => n.tier !== 0)
        .filter(n =>
          (n.label || '').toLowerCase().includes(q) ||
          (n.ip || '').toLowerCase().includes(q) ||
          (n.type || '').toLowerCase().includes(q) ||
          n.id.toLowerCase().includes(q))
        .map(n => n.id);
      map.setHighlight(ids);
      liveRegion.textContent = ids.length + ' device' + (ids.length === 1 ? '' : 's') + ' match';
      return ids;
    }
    searchEl.addEventListener('input', runSearch);
    searchEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const ids = runSearch();
        if (ids.length) selectNode(map.byId[ids[0]]);
      } else if (e.key === 'Escape' && searchEl.value) {
        e.stopPropagation();
        searchEl.value = '';
        runSearch();
      }
    });

    /* ---------- top talkers ---------- */
    const ttList = document.getElementById('netmap-toptalkers-list');
    const infraIds = new Set(map.nodes.filter(n => n.tier !== undefined && n.tier <= 2).map(n => n.id));
    let lastTT = 0;
    function updateTopTalkers(sample) {
      if (sample.ts - lastTT < 1000) return;
      lastTT = sample.ts;
      const rows = Object.keys(sample.devices)
        .filter(id => !infraIds.has(id))
        .map(id => ({ id, d: sample.devices[id] }))
        .sort((a, b) => (b.d.rx + b.d.tx) - (a.d.rx + a.d.tx))
        .slice(0, 5);
      ttList.innerHTML = '';
      rows.forEach(({ id, d }) => {
        const n = map.byId[id];
        if (!n || d.rx + d.tx < 1) return;
        let cls = 'browsing', best = -1;
        Object.keys(d.classes || {}).forEach(k => { if (d.classes[k] > best) { best = d.classes[k]; cls = k; } });
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML =
          '<i class="tt-dot" style="--k:var(--nm-class-' + cls + ')"></i>' +
          '<span class="tt-label"></span>' +
          '<span class="tt-rate">' + NetMap.fmtRate(d.rx + d.tx) + '</span>';
        btn.querySelector('.tt-label').textContent = n.label;
        btn.addEventListener('click', () => selectNode(n));
        li.appendChild(btn);
        ttList.appendChild(li);
      });
    }

    /* ---------- day scrubber (simulation only) ---------- */
    const scrubber = document.getElementById('netmap-scrubber');
    const scrubRange = document.getElementById('netmap-scrub-range');
    const scrubLabel = document.getElementById('netmap-scrub-label');
    const scrubNow = document.getElementById('netmap-scrub-now');
    let scrubbing = false;
    function fmtHour(h) {
      const hh = Math.floor(h) % 24, mm = Math.round((h - Math.floor(h)) * 60);
      const d = new Date(); d.setHours(hh, mm, 0, 0);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    function nowSlot() {
      const d = new Date();
      return Math.round((d.getHours() * 60 + d.getMinutes()) / 5);
    }
    if (isLive) {
      scrubber.hidden = true;
    } else {
      scrubRange.value = nowSlot();
      scrubRange.addEventListener('input', () => {
        scrubbing = true;
        const h = (scrubRange.value * 5) / 60;
        adapter.setHour(h);
        scrubLabel.textContent = 'Simulating ' + fmtHour(h);
        scrubNow.setAttribute('aria-pressed', 'false');
      });
      scrubNow.addEventListener('click', () => {
        scrubbing = false;
        adapter.setHour(null);
        scrubRange.value = nowSlot();
        scrubLabel.textContent = '';
        scrubNow.setAttribute('aria-pressed', 'true');
        liveRegion.textContent = 'Following the real clock';
      });
    }

    /* ---------- mode badge ---------- */
    function setMode(state) {
      modeEl.textContent = state;
      modeEl.className = 'netmap-mode' +
        (state === 'LIVE' ? ' is-live' : state.indexOf('OFFLINE') >= 0 ? ' is-offline' : '');
    }
    setMode(isLive ? 'LIVE · connecting…' : 'SIMULATED');

    /* ---------- sample intake ---------- */
    adapter.start(sample => {
      lastSample = sample;
      if (isLive) setMode(sample.error ? 'LIVE · OFFLINE' : 'LIVE');
      map.setSample(sample);
      inspector.setSample(sample);
      audio.setSample(sample, map.byId);
      updateTopTalkers(sample);

      let rx = 0, tx = 0;
      Object.keys(sample.devices).forEach(id => {
        // sum only leaf/edge devices so infra aggregation doesn't double-count
        if (!infraIds.has(id)) { rx += sample.devices[id].rx; tx += sample.devices[id].tx; }
      });
      totalDown.textContent = NetMap.fmtRate(rx);
      totalUp.textContent = NetMap.fmtRate(tx);
    });

    /* ---------- clock ---------- */
    function tickClock() {
      clockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (!isLive && !scrubbing) scrubRange.value = nowSlot();
    }
    tickClock();
    setInterval(tickClock, 30000);

    map.resetView();
    map.start();

    /* ---------- deep link: ?focus=<node-id> ---------- */
    const focusId = params.get('focus');
    if (focusId && map.byId[focusId] && map.byId[focusId].tier !== 0) {
      selectNode(map.byId[focusId]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
