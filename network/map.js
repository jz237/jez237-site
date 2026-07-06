/* ===================================================================
   map.js — canvas renderer for the network map.
   Deterministic radial layout (no physics), pan/zoom camera with
   semantic LOD, traffic particles, hover/click hit-testing, and
   keyboard navigation. Colors are read live from CSS variables so
   the site theme toggle re-palettes the scene.
   =================================================================== */

(function () {
  'use strict';
  const NetMap = (window.NetMap = window.NetMap || {});

  const WORLD_W = 2000, WORLD_H = 1400;
  const CX = WORLD_W / 2, CY = WORLD_H / 2 + 60;
  const R_INFRA = 300;          // router → switch/AP ring
  const R_LEAF = 210;           // infra → device fan
  const MAX_PARTICLES = 400;
  const MIN_SCALE = 0.4, MAX_SCALE = 4;

  const NODE_R = { internet: 40, router: 48, switch: 32, ap: 32, leaf: 26 };
  const TYPE_ICON = {
    nas: '💾', server: '🗄️', workstation: '🖥️', laptop: '💻', phone: '📱',
    tablet: '📲', tv: '📺', console: '🎮', printer: '🖨️', camera: '📷',
    speaker: '🔊', plug: '🔌', thermostat: '🌡️', switch: '🔀', ap: '📡'
  };

  const rad = deg => (deg * Math.PI) / 180;
  /* cluster angles are "0° = east, counterclockwise"; canvas y grows down */
  const dirOf = deg => ({ x: Math.cos(rad(deg)), y: -Math.sin(rad(deg)) });

  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function fmtRate(kbps) {
    if (!isFinite(kbps) || kbps < 0.05) return '0 kbps';
    if (kbps < 1000) return kbps.toFixed(kbps < 10 ? 1 : 0) + ' kbps';
    return (kbps / 1000).toFixed(kbps < 10000 ? 1 : 0) + ' Mbps';
  }
  NetMap.fmtRate = fmtRate;

  /* ---------------- layout ---------------- */

  function layout(data) {
    const nodes = data.nodes.map(n => Object.assign({}, n));
    const byId = {};
    nodes.forEach(n => { byId[n.id] = n; });

    const internet = nodes.find(n => n.tier === 0);
    const router = nodes.find(n => n.tier === 1);
    internet.x = CX; internet.y = CY - 480;
    router.x = CX; router.y = CY;
    internet.r = NODE_R.internet; router.r = NODE_R.router;

    const clusters = data.clusters || {};

    // infrastructure ring
    nodes.filter(n => n.tier === 2).forEach(n => {
      const c = clusters[n.cluster] || { angle: 0 };
      const d = dirOf(c.angle);
      n.x = router.x + d.x * R_INFRA;
      n.y = router.y + d.y * R_INFRA;
      n.r = NODE_R[n.type] || NODE_R.leaf;
    });

    // leaf fan around each parent, seeded jitter so it never moves
    const children = {};
    nodes.forEach(n => {
      if (!n.uplink) return;
      (children[n.uplink] = children[n.uplink] || []).push(n);
    });
    Object.keys(children).forEach(pid => {
      const parent = byId[pid];
      // fan leaves per cluster so districts stay spatially coherent even
      // when one AP serves devices from different clusters
      const groups = {};
      children[pid]
        .filter(n => n.x === undefined)
        .sort((a, b) => a.id < b.id ? -1 : 1)
        .forEach(n => { (groups[n.cluster || ''] = groups[n.cluster || ''] || []).push(n); });
      Object.keys(groups).forEach(gkey => {
        const leaves = groups[gkey];
        const cl = clusters[gkey];
        // fan out along the cluster's own direction; fall back to
        // "away from the router" for unclustered leaves
        const baseA = cl ? rad(-cl.angle)
          : Math.atan2(parent.y - router.y, parent.x - router.x);
        const spread = rad(Math.min(96, 34 * leaves.length));
        // leaves from a different district than their parent's own get a
        // longer run so the two fans don't overlap
        const stretch = cl && parent.cluster && gkey !== parent.cluster ? 1.4 : 1;
        leaves.forEach((n, i) => {
          const rand = mulberry32(hashStr(n.id) ^ 0x9e37);
          const t = leaves.length === 1 ? 0.5 : i / (leaves.length - 1);
          const a = baseA - spread / 2 + spread * t + (rand() - 0.5) * rad(10);
          const rr = R_LEAF * stretch * (0.86 + rand() * 0.3);
          n.x = parent.x + Math.cos(a) * rr;
          n.y = parent.y + Math.sin(a) * rr;
          n.r = NODE_R.leaf;
        });
      });
    });

    // links: uplink tree + implicit WAN trace
    const links = [];
    nodes.forEach(n => {
      if (n.uplink && byId[n.uplink]) links.push(makeLink(byId[n.uplink], n));
    });
    links.push(makeLink(internet, router, true));

    // cluster label anchors at the centroid of where members actually
    // landed, pushed a little outward so the label clears the nodes
    const clusterAnchors = Object.keys(clusters).map(key => {
      const c = clusters[key];
      const members = nodes.filter(n => n.cluster === key);
      let mx = 0, my = 0;
      members.forEach(n => { mx += n.x; my += n.y; });
      mx /= members.length || 1; my /= members.length || 1;
      const dx = mx - router.x, dy = my - router.y;
      const dist = Math.hypot(dx, dy) || 1;
      let spreadR = 0;
      members.forEach(n => {
        spreadR = Math.max(spreadR, Math.hypot(n.x - mx, n.y - my));
      });
      return {
        key, label: c.label, color: c.color,
        cx: mx, cy: my, glowR: spreadR + 160,
        x: mx + (dx / dist) * (spreadR + 70),
        // keep labels out of the internet-beacon / HUD band at the top
        y: Math.max(CY - 400, my + (dy / dist) * (spreadR + 70))
      };
    });

    return { nodes, byId, links, internet, router, clusterAnchors };
  }

  function makeLink(from, to, wan) {
    // quadratic bezier bowing gently away from the board center
    const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
    const dx = mx - CX, dy = my - CY;
    const dist = Math.hypot(dx, dy) || 1;
    const bow = wan ? 0 : Math.min(46, dist * 0.16);
    const cx = mx + (dx / dist) * bow, cy = my + (dy / dist) * bow;
    // arc-length LUT for even particle motion
    const N = 24, pts = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, u = 1 - t;
      pts.push({
        x: u * u * from.x + 2 * u * t * cx + t * t * to.x,
        y: u * u * from.y + 2 * u * t * cy + t * t * to.y
      });
    }
    let len = 0;
    const lens = [0];
    for (let i = 1; i <= N; i++) {
      len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      lens.push(len);
    }
    return { from, to, cx, cy, wan: !!wan, pts, lens, len, rate: 0, rxRate: 0, txRate: 0, cls: 'browsing', spawnAcc: 0 };
  }

  function pointAt(link, t) {
    const target = t * link.len;
    const { lens, pts } = link;
    let lo = 0, hi = lens.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (lens[mid] < target) lo = mid; else hi = mid;
    }
    const f = (target - lens[lo]) / ((lens[hi] - lens[lo]) || 1);
    return {
      x: pts[lo].x + (pts[hi].x - pts[lo].x) * f,
      y: pts[lo].y + (pts[hi].y - pts[lo].y) * f
    };
  }

  /* ---------------- map ---------------- */

  NetMap.createMap = function (opts) {
    const canvas = opts.canvas;
    const ctx = canvas.getContext('2d');
    const data = opts.data;
    const L = layout(data);

    let palette = {};
    let dpr = 1, vw = 0, vh = 0;
    const cam = { x: CX, y: CY - 60, scale: 1 };
    let camAnim = null;
    let sample = null;
    const subtree = {};            // nodeId -> {rx, tx, classes}
    const particles = [];
    let hoverNode = null, selectedId = null, focusIdx = -1;
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let running = false, visible = true, rafId = 0;
    let lastFrame = 0, fps = 0;
    const debug = /[?&]debug=1/.test(location.search);
    let boardCache = null;

    const leafNodes = L.nodes
      .filter(n => n.tier !== 0)
      .sort((a, b) => (a.cluster || '') < (b.cluster || '') ? -1 : (a.cluster || '') > (b.cluster || '') ? 1 : a.id < b.id ? -1 : 1);

    /* ---------- palette from CSS variables ---------- */
    function refreshPalette() {
      const cs = getComputedStyle(document.documentElement);
      const v = name => cs.getPropertyValue(name).trim();
      palette = {
        board: v('--nm-board'), grid: v('--nm-board-grid'), vignette: v('--nm-board-vignette'),
        trace: v('--nm-trace'), face: v('--nm-node-face'), edge: v('--nm-node-edge'),
        text: v('--nm-node-text'), sub: v('--nm-node-sub'), offline: v('--nm-offline'),
        glow: parseFloat(v('--nm-glow-strength')) || 1,
        light: document.documentElement.getAttribute('data-theme') === 'light',
        cls: {}
      };
      NetMap.TRAFFIC_CLASSES.forEach(c => { palette.cls[c] = v('--nm-class-' + c); });
      const wb = { blue: v('--wb-blue') || '#29c9ff', leaf: v('--wb-leaf') || '#8df14f', pink: v('--wb-pink') || '#8c63ff', gold: v('--wb-gold') || '#2f91ff' };
      palette.clusterColor = key => {
        const c = (data.clusters[key] || {}).color;
        return wb[c] || wb.blue;
      };
      boardCache = null;
    }
    refreshPalette();
    new MutationObserver(refreshPalette)
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    try {
      window.matchMedia('(prefers-reduced-motion: reduce)')
        .addEventListener('change', e => { reducedMotion = e.matches; });
    } catch (_) { /* older Safari */ }

    /* ---------- sizing ---------- */
    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      vw = canvas.clientWidth; vh = canvas.clientHeight;
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      boardCache = null;
    }
    window.addEventListener('resize', resize);
    resize();

    function worldToScreen(wx, wy) {
      return { x: (wx - cam.x) * cam.scale + vw / 2, y: (wy - cam.y) * cam.scale + vh / 2 };
    }
    function screenToWorld(sx, sy) {
      return { x: (sx - vw / 2) / cam.scale + cam.x, y: (sy - vh / 2) / cam.scale + cam.y };
    }

    /* ---------- traffic sample intake ---------- */
    function setSample(s) {
      sample = s;
      // subtree rates: every node's rate = its own + all descendants'
      L.nodes.forEach(n => { subtree[n.id] = { rx: 0, tx: 0, classes: {} }; });
      L.nodes.forEach(n => {
        const d = s.devices[n.id];
        if (!d) return;
        let cur = n;
        while (cur) {
          const agg = subtree[cur.id];
          agg.rx += d.rx; agg.tx += d.tx;
          Object.keys(d.classes).forEach(k => {
            agg.classes[k] = (agg.classes[k] || 0) + d.classes[k] * (d.rx + d.tx);
          });
          cur = cur.uplink ? L.byId[cur.uplink] : (cur.tier === 1 ? L.internet : null);
          if (cur && cur.tier === 0) {
            const ia = subtree[cur.id];
            ia.rx += d.rx; ia.tx += d.tx;
            break;
          }
        }
      });
      L.links.forEach(link => {
        const agg = subtree[link.to.id] || { rx: 0, tx: 0, classes: {} };
        link.rxRate = agg.rx; link.txRate = agg.tx;
        link.rate = agg.rx + agg.tx;
        let best = 'browsing', bestV = -1;
        Object.keys(agg.classes).forEach(k => {
          if (agg.classes[k] > bestV) { bestV = agg.classes[k]; best = k; }
        });
        link.cls = best;
        link.clsMix = agg.classes;
      });
    }

    /* ---------- particles ---------- */
    function spawnParticles(dt) {
      if (reducedMotion) { particles.length = 0; return; }
      L.links.forEach(link => {
        if (link.rate < 2) return;
        // spawn rate grows with log of link traffic
        const rate = Math.min(26, Math.log10(link.rate + 1) * 6.5);
        link.spawnAcc += rate * dt;
        while (link.spawnAcc >= 1 && particles.length < MAX_PARTICLES) {
          link.spawnAcc -= 1;
          const down = Math.random() < (link.rxRate + 1) / (link.rate + 2);
          const mix = link.clsMix || {};
          let cls = link.cls, r = Math.random() * (link.rate || 1), acc = 0;
          for (const k in mix) { acc += mix[k]; if (r <= acc) { cls = k; break; } }
          particles.push({
            link, cls,
            t: down ? 0 : 1,
            dir: down ? 1 : -1,
            speed: (90 + Math.random() * 120) / link.len,   // world-units/s → t/s
            size: 1.6 + Math.random() * 1.8
          });
        }
        if (link.spawnAcc > 4) link.spawnAcc = 0;
      });
    }
    function updateParticles(dt) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.t += p.dir * p.speed * dt;
        if (p.t < 0 || p.t > 1) {
          particles[i] = particles[particles.length - 1];
          particles.pop();
        }
      }
    }

    /* ---------- board background (cached) ---------- */
    function drawBoard() {
      if (!boardCache) {
        boardCache = document.createElement('canvas');
        boardCache.width = canvas.width; boardCache.height = canvas.height;
        const b = boardCache.getContext('2d');
        b.scale(dpr, dpr);
        b.fillStyle = palette.board;
        b.fillRect(0, 0, vw, vh);
        const g = b.createRadialGradient(vw / 2, vh / 2, Math.min(vw, vh) * 0.2, vw / 2, vh / 2, Math.max(vw, vh) * 0.75);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, palette.vignette);
        b.fillStyle = g;
        b.fillRect(0, 0, vw, vh);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(boardCache, 0, 0);

      // PCB grid in world space (drawn live so it pans/zooms)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.save();
      ctx.translate(vw / 2, vh / 2);
      ctx.scale(cam.scale, cam.scale);
      ctx.translate(-cam.x, -cam.y);
      const step = 100;
      const tl = screenToWorld(0, 0), br = screenToWorld(vw, vh);
      ctx.strokeStyle = palette.grid;
      ctx.lineWidth = 1 / cam.scale;
      ctx.beginPath();
      for (let x = Math.floor(tl.x / step) * step; x < br.x; x += step) {
        ctx.moveTo(x, tl.y); ctx.lineTo(x, br.y);
      }
      for (let y = Math.floor(tl.y / step) * step; y < br.y; y += step) {
        ctx.moveTo(tl.x, y); ctx.lineTo(br.x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    /* ---------- scene ---------- */
    function drawClusterGlows() {
      L.clusterAnchors.forEach(a => {
        const col = palette.clusterColor(a.key);
        const g = ctx.createRadialGradient(a.cx, a.cy, 20, a.cx, a.cy, a.glowR);
        g.addColorStop(0, hexA(col, 0.07 * palette.glow + 0.02));
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(a.cx, a.cy, a.glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '600 15px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = hexA(col, 0.85);
        ctx.fillText(a.label.toUpperCase(), a.x, a.y);
      });
    }

    function hexA(hex, a) {
      if (!hex || hex[0] !== '#') return hex;
      let r, g, b;
      if (hex.length === 4) { r = parseInt(hex[1] + hex[1], 16); g = parseInt(hex[2] + hex[2], 16); b = parseInt(hex[3] + hex[3], 16); }
      else { r = parseInt(hex.slice(1, 3), 16); g = parseInt(hex.slice(3, 5), 16); b = parseInt(hex.slice(5, 7), 16); }
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }

    function linkPath(link) {
      ctx.beginPath();
      ctx.moveTo(link.from.x, link.from.y);
      ctx.quadraticCurveTo(link.cx, link.cy, link.to.x, link.to.y);
    }

    function drawLinks(now) {
      L.links.forEach(link => {
        const intensity = Math.min(1, Math.log10(link.rate + 1) / 4.2);
        const col = palette.cls[link.cls] || palette.trace;
        const wifi = link.to.media === 'wifi';
        const offline = sample && sample.devices[link.to.id] && !sample.devices[link.to.id].online && !subtree[link.to.id].rx;

        if (wifi) {
          ctx.setLineDash([7, 7]);
          if (!reducedMotion) ctx.lineDashOffset = -(now / 90) % 14;
        }
        // base trace
        ctx.strokeStyle = offline ? hexA2(palette.offline, 0.5) : palette.trace;
        ctx.lineWidth = link.wan ? 5 : 2.5;
        linkPath(link); ctx.stroke();
        // traffic glow pass
        if (intensity > 0.03 && !offline) {
          ctx.strokeStyle = hexA(col, (0.14 + intensity * 0.5) * Math.min(1, palette.glow + 0.25));
          ctx.lineWidth = (link.wan ? 5 : 2.5) + intensity * 7;
          linkPath(link); ctx.stroke();
          if (reducedMotion) {
            // static intensity core instead of particles
            ctx.strokeStyle = hexA(col, 0.35 + intensity * 0.5);
            ctx.lineWidth = 1.4 + intensity * 2.4;
            linkPath(link); ctx.stroke();
          }
        }
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;

        // per-link rate captions at close zoom
        if (cam.scale > 1.8 && link.rate > 1) {
          const m = pointAt(link, 0.5);
          ctx.font = '500 10px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = palette.sub;
          ctx.fillText(fmtRate(link.rate), m.x, m.y - 7);
        }
      });
    }

    function hexA2(c, a) { return c && c[0] === '#' ? hexA(c, a) : c; }

    function drawParticles() {
      if (!particles.length) return;
      ctx.save();
      ctx.globalCompositeOperation = palette.light ? 'source-over' : 'lighter';
      particles.forEach(p => {
        const pos = pointAt(p.link, p.t);
        const col = palette.cls[p.cls] || '#fff';
        ctx.fillStyle = hexA(col, palette.light ? 0.75 : 0.9);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    function drawNodes(now) {
      const showLabels = cam.scale >= 0.62;
      const showRates = cam.scale > 1.8;
      L.nodes.forEach(n => {
        const dev = sample && sample.devices[n.id];
        const agg = subtree[n.id] || { rx: 0, tx: 0 };
        const activity = Math.min(1, Math.log10(agg.rx + agg.tx + 1) / 4.2);
        const isFocus = leafNodes[focusIdx] === n;
        const isSel = selectedId === n.id;
        const isHover = hoverNode === n;
        const online = !dev || dev.online;
        const col = n.cluster ? palette.clusterColor(n.cluster) : (palette.cls.streaming || '#29c9ff');

        if (n.tier === 0) { drawInternet(n, now, activity); }
        else if (n.tier === 1) { drawRouter(n, now, activity); }
        else {
          // module chip
          const r = n.r;
          ctx.save();
          if (!online) ctx.globalAlpha = 0.55;
          ctx.fillStyle = palette.face;
          ctx.strokeStyle = isSel || isHover || isFocus ? col : palette.edge;
          ctx.lineWidth = isSel ? 2.6 : 1.4;
          roundRect(n.x - r, n.y - r * 0.82, r * 2, r * 1.64, 9);
          if (activity > 0.05 && online && palette.glow > 0.5) {
            ctx.shadowColor = hexA(col, 0.55);
            ctx.shadowBlur = 6 + activity * 16;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.stroke();

          // icon glyph
          ctx.font = Math.round(r * 0.95) + 'px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(TYPE_ICON[n.type] || '❓', n.x, n.y + 1);
          ctx.textBaseline = 'alphabetic';

          // status LED
          const led = !online ? palette.offline : (dev && dev.status === 'idle') ? (palette.cls.iot || '#ffb347') : (palette.cls.browsing || '#8df14f');
          ctx.fillStyle = led;
          ctx.beginPath();
          ctx.arc(n.x + r - 7, n.y - r * 0.82 + 7, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (showLabels && n.tier !== 0) {
          ctx.font = (n.tier === 1 ? '650 14px' : '500 12px') + ' system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = online ? palette.text : palette.sub;
          const ly = n.y + (n.tier === 1 ? n.r + 24 : n.r * 0.82 + 16);
          ctx.fillText(n.label, n.x, ly);
          if (showRates && dev) {
            ctx.font = '500 10px system-ui, sans-serif';
            ctx.fillStyle = palette.sub;
            ctx.fillText('▼' + fmtRate(dev.rx) + '  ▲' + fmtRate(dev.tx), n.x, ly + 13);
          }
        }

        // focus ring for keyboard nav
        if (isFocus && document.activeElement === canvas) {
          ctx.strokeStyle = palette.cls.streaming || '#29c9ff';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(n.x, n.y, (n.r || 26) + 9, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function drawInternet(n, now, activity) {
      const pulse = reducedMotion ? 0.5 : (Math.sin(now / 800) + 1) / 2;
      const col = palette.cls.streaming || '#29c9ff';
      for (let i = 2; i >= 0; i--) {
        ctx.strokeStyle = hexA(col, (0.08 + activity * 0.1) * (3 - i) * palette.glow * (0.4 + pulse * 0.6));
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 8 + i * 12, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = palette.face;
      ctx.strokeStyle = palette.edge;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      if (palette.glow > 0.5) { ctx.shadowColor = hexA(col, 0.5); ctx.shadowBlur = 16 + activity * 18; }
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.font = Math.round(n.r * 1.05) + 'px system-ui, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🌐', n.x, n.y + 2);
      ctx.textBaseline = 'alphabetic';
      ctx.font = '650 13px system-ui, sans-serif';
      ctx.fillStyle = palette.sub;
      ctx.fillText('INTERNET', n.x, n.y - n.r - 14);
    }

    function drawRouter(n, now, activity) {
      const col = palette.clusterColor('wireless');
      const spin = reducedMotion ? 0 : now / 6000;
      // rotating hex ring
      ctx.strokeStyle = hexA(col, 0.5);
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const a = spin + (i / 6) * Math.PI * 2;
        const px = n.x + Math.cos(a) * (n.r + 12), py = n.y + Math.sin(a) * (n.r + 12);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = palette.face;
      ctx.strokeStyle = palette.edge;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      if (palette.glow > 0.5) { ctx.shadowColor = hexA(col, 0.6); ctx.shadowBlur = 14 + activity * 26; }
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.stroke();
      // concentric core
      ctx.strokeStyle = hexA(col, 0.8);
      ctx.lineWidth = 2;
      [0.28, 0.52, 0.76].forEach((f, i) => {
        const wob = reducedMotion ? 1 : 1 + Math.sin(now / 500 + i) * 0.04 * (activity + 0.2);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * f * wob, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.fillStyle = hexA(col, 0.9);
      ctx.beginPath();
      ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    /* ---------- frame loop ---------- */
    function frame(now) {
      rafId = running && visible ? requestAnimationFrame(frame) : 0;
      const dt = Math.min(0.1, (now - lastFrame) / 1000 || 0.016);
      lastFrame = now;
      fps = fps * 0.9 + (1 / dt) * 0.1;

      if (camAnim) {
        camAnim.t = Math.min(1, camAnim.t + dt / camAnim.dur);
        const e = 1 - Math.pow(1 - camAnim.t, 3);
        cam.x = camAnim.x0 + (camAnim.x1 - camAnim.x0) * e;
        cam.y = camAnim.y0 + (camAnim.y1 - camAnim.y0) * e;
        cam.scale = camAnim.s0 + (camAnim.s1 - camAnim.s0) * e;
        if (camAnim.t >= 1) camAnim = null;
      }

      spawnParticles(dt);
      updateParticles(dt);

      drawBoard();
      ctx.save();
      ctx.translate(vw / 2, vh / 2);
      ctx.scale(cam.scale, cam.scale);
      ctx.translate(-cam.x, -cam.y);
      drawClusterGlows();
      drawLinks(now);
      drawParticles();
      drawNodes(now);
      ctx.restore();

      if (debug) {
        ctx.font = '600 12px monospace';
        ctx.textAlign = 'right';
        ctx.fillStyle = palette.sub;
        ctx.fillText(Math.round(fps) + ' fps · ' + particles.length + ' particles · ×' + cam.scale.toFixed(2), vw - 12, vh - 12);
      }

      if (hoverNode && opts.onHoverMove) {
        opts.onHoverMove(hoverNode, worldToScreen(hoverNode.x, hoverNode.y - (hoverNode.r || 26)));
      }
    }

    /* ---------- camera ---------- */
    function animateTo(x, y, scale, dur) {
      if (reducedMotion || dur === 0) {
        cam.x = x; cam.y = y; cam.scale = scale; camAnim = null;
        return;
      }
      camAnim = { x0: cam.x, y0: cam.y, s0: cam.scale, x1: x, y1: y, s1: scale, t: 0, dur: dur || 0.55 };
    }
    function clampScale(s) { return Math.max(MIN_SCALE, Math.min(MAX_SCALE, s)); }
    function zoomAt(sx, sy, factor) {
      const before = screenToWorld(sx, sy);
      cam.scale = clampScale(cam.scale * factor);
      const after = screenToWorld(sx, sy);
      cam.x += before.x - after.x;
      cam.y += before.y - after.y;
      camAnim = null;
    }

    /* ---------- hit testing ---------- */
    function nodeAt(sx, sy) {
      const w = screenToWorld(sx, sy);
      let best = null, bestD = Infinity;
      L.nodes.forEach(n => {
        const d = Math.hypot(n.x - w.x, n.y - w.y);
        const hitR = (n.r || 26) + 12;
        if (d < hitR && d < bestD) { best = n; bestD = d; }
      });
      return best;
    }
    function clusterAt(sx, sy) {
      const w = screenToWorld(sx, sy);
      return L.clusterAnchors.find(a => Math.hypot(a.x - w.x, a.y - w.y) < 70) || null;
    }

    /* ---------- pointer input ---------- */
    const pointers = new Map();
    let dragStart = null, pinchDist = 0, moved = false;

    canvas.addEventListener('pointerdown', e => {
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
      moved = false;
      if (pointers.size === 1) {
        dragStart = { x: e.offsetX, y: e.offsetY, camX: cam.x, camY: cam.y };
        canvas.classList.add('dragging');
      } else if (pointers.size === 2) {
        const pts = [...pointers.values()];
        pinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        dragStart = null;
      }
    });
    canvas.addEventListener('pointermove', e => {
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
      if (pointers.size === 2) {
        const pts = [...pointers.values()];
        const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (pinchDist) zoomAt((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2, d / pinchDist);
        pinchDist = d;
        moved = true;
        return;
      }
      if (dragStart && pointers.size === 1) {
        const dx = e.offsetX - dragStart.x, dy = e.offsetY - dragStart.y;
        if (Math.hypot(dx, dy) > 5) moved = true;
        if (moved) {
          cam.x = dragStart.camX - dx / cam.scale;
          cam.y = dragStart.camY - dy / cam.scale;
          camAnim = null;
        }
        return;
      }
      // plain hover
      const n = nodeAt(e.offsetX, e.offsetY);
      if (n !== hoverNode) {
        hoverNode = n;
        canvas.style.cursor = n || clusterAt(e.offsetX, e.offsetY) ? 'pointer' : 'grab';
        if (opts.onHover) opts.onHover(n, n ? worldToScreen(n.x, n.y - (n.r || 26)) : null);
      }
    });
    function endPointer(e) {
      pointers.delete(e.pointerId);
      canvas.classList.remove('dragging');
      if (pointers.size < 2) pinchDist = 0;
      if (!moved && e.type === 'pointerup') {
        const n = nodeAt(e.offsetX, e.offsetY);
        if (n && n.tier !== 0) {
          selectedId = n.id;
          focusIdx = leafNodes.indexOf(n);
          if (opts.onSelect) opts.onSelect(n);
        } else if (!n) {
          const c = clusterAt(e.offsetX, e.offsetY);
          if (c) focusCluster(c.key);
        }
      }
      dragStart = null;
    }
    canvas.addEventListener('pointerup', endPointer);
    canvas.addEventListener('pointercancel', endPointer);
    canvas.addEventListener('pointerleave', () => {
      if (hoverNode) { hoverNode = null; if (opts.onHover) opts.onHover(null, null); }
    });
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      zoomAt(e.offsetX, e.offsetY, Math.pow(1.0015, -e.deltaY));
    }, { passive: false });

    /* ---------- keyboard ---------- */
    canvas.addEventListener('keydown', e => {
      const k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'ArrowLeft' || k === 'ArrowUp') {
        e.preventDefault();
        const dir = (k === 'ArrowRight' || k === 'ArrowDown') ? 1 : -1;
        focusIdx = (focusIdx + dir + leafNodes.length) % leafNodes.length;
        const n = leafNodes[focusIdx];
        animateTo(n.x, n.y, Math.max(cam.scale, 1.1), 0.4);
        if (opts.onAnnounce) {
          const dev = sample && sample.devices[n.id];
          opts.onAnnounce(n.label + (dev ? ', ' + dev.status + ', down ' + fmtRate(dev.rx) + ', up ' + fmtRate(dev.tx) : ''));
        }
        if (opts.onHover) opts.onHover(n, worldToScreen(n.x, n.y - (n.r || 26)));
      } else if (k === 'Enter' && focusIdx >= 0) {
        e.preventDefault();
        const n = leafNodes[focusIdx];
        selectedId = n.id;
        if (opts.onSelect) opts.onSelect(n);
      } else if (k === '+' || k === '=') {
        e.preventDefault(); zoomAt(vw / 2, vh / 2, 1.25);
      } else if (k === '-' || k === '_') {
        e.preventDefault(); zoomAt(vw / 2, vh / 2, 0.8);
      }
    });

    /* ---------- visibility / lifecycle ---------- */
    document.addEventListener('visibilitychange', () => {
      visible = !document.hidden;
      if (visible && running && !rafId) { lastFrame = performance.now(); rafId = requestAnimationFrame(frame); }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        const on = entries[0].isIntersecting;
        if (on && running && !rafId) { lastFrame = performance.now(); rafId = requestAnimationFrame(frame); }
        visible = on && !document.hidden;
      }).observe(canvas);
    }

    function focusCluster(key) {
      const members = L.nodes.filter(n => n.cluster === key);
      if (!members.length) return;
      let mx = 0, my = 0;
      members.forEach(n => { mx += n.x; my += n.y; });
      animateTo(mx / members.length, my / members.length, 1.5, 0.6);
    }

    return {
      resize,
      setSample,
      refreshPalette,
      focusNode(id, scale) {
        const n = L.byId[id];
        if (n) animateTo(n.x, n.y, scale || 1.9, 0.55);
      },
      focusCluster,
      resetView() {
        selectedId = null;
        animateTo(CX, CY - 60, Math.min(1, (vh - 40) / WORLD_H * 1.45), 0.6);
      },
      setSelected(id) { selectedId = id; },
      zoomBy(f) { zoomAt(vw / 2, vh / 2, f); },
      nodes: L.nodes,
      byId: L.byId,
      start() {
        if (running) return;
        running = true;
        lastFrame = performance.now();
        rafId = requestAnimationFrame(frame);
      },
      stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };
  };
})();
