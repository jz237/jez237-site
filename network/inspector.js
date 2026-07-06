/* ===================================================================
   inspector.js — device inspector panel (L2) and per-connection
   detail view (L3). Plain DOM so text is crisp, selectable, and
   restyled by the site theme automatically.
   =================================================================== */

(function () {
  'use strict';
  const NetMap = (window.NetMap = window.NetMap || {});

  const TYPE_ICON = {
    internet: '🌐', router: '🧭', nas: '💾', server: '🗄️', workstation: '🖥️',
    laptop: '💻', phone: '📱', tablet: '📲', tv: '📺', console: '🎮',
    printer: '🖨️', camera: '📷', speaker: '🔊', plug: '🔌',
    thermostat: '🌡️', switch: '🔀', ap: '📡'
  };
  const STATUS_LABEL = { online: 'Online', idle: 'Idle', asleep: 'Asleep' };

  NetMap.createInspector = function (opts) {
    const el = opts.el;
    const byId = opts.byId;
    let state = null;      // { level, node, connId }
    let sample = null;
    let sparkCtx = null;

    function esc(s) {
      return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }
    function classVar(cls) { return 'var(--nm-class-' + cls + ', #fff)'; }

    function metaRows(node) {
      const rows = [];
      if (node.ip) rows.push(['IP address', node.ip]);
      if (node.mac) rows.push(['MAC', node.mac]);
      rows.push(['Type', node.type]);
      if (node.model) rows.push(['Model', node.model]);
      if (node.uplink && byId[node.uplink]) {
        rows.push(['Uplink', byId[node.uplink].label + (node.media === 'wifi' ? ' · Wi-Fi' : ' · Ethernet')]);
      }
      if (node.linkMbps) rows.push(['Link speed', node.linkMbps >= 1000 ? (node.linkMbps / 1000) + ' Gbps' : node.linkMbps + ' Mbps']);
      if (node.notes) rows.push(['Notes', node.notes]);
      return rows.map(r => '<li><span class="k">' + esc(r[0]) + '</span><span class="v">' + esc(r[1]) + '</span></li>').join('');
    }

    function renderL2(node) {
      el.innerHTML =
        '<div class="insp-head">' +
          '<span class="insp-ico" aria-hidden="true">' + (TYPE_ICON[node.type] || '❓') + '</span>' +
          '<h2>' + esc(node.label) + '</h2>' +
          '<button type="button" class="netmap-btn insp-close" aria-label="Close inspector">✕</button>' +
        '</div>' +
        '<span class="insp-badge online" data-role="badge">Online</span>' +
        '<ul class="insp-meta">' + metaRows(node) + '</ul>' +
        '<div class="insp-section">Traffic — last 15 s</div>' +
        '<canvas class="insp-spark" width="10" height="10" aria-hidden="true"></canvas>' +
        '<p class="insp-rates"><span>▼ <b data-role="rx">—</b></span><span>▲ <b data-role="tx">—</b></span></p>' +
        '<div class="insp-section">Connections</div>' +
        '<ul class="insp-conns" data-role="conns"></ul>';
      el.querySelector('.insp-close').addEventListener('click', close);
      const spark = el.querySelector('.insp-spark');
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      spark.width = spark.clientWidth * dpr;
      spark.height = spark.clientHeight * dpr;
      sparkCtx = spark.getContext('2d');
      sparkCtx.scale(dpr, dpr);
      refresh();
    }

    function renderL3(node, conn) {
      el.innerHTML =
        '<button type="button" class="netmap-btn insp-back">← ' + esc(node.label) + '</button>' +
        '<div class="insp-head">' +
          '<span class="insp-ico" aria-hidden="true">🔗</span>' +
          '<h2>' + esc(conn.host) + '</h2>' +
          '<button type="button" class="netmap-btn insp-close" aria-label="Close inspector">✕</button>' +
        '</div>' +
        '<span class="conn-class-chip" style="--k:' + classVar(conn.cls) + '"><i></i>' +
          esc(NetMap.CLASS_LABELS[conn.cls] || conn.cls) + '</span>' +
        '<ul class="insp-meta" style="margin-top:14px">' +
          '<li><span class="k">Device</span><span class="v">' + esc(node.label) + '</span></li>' +
          '<li><span class="k">Protocol</span><span class="v">' + esc(conn.proto) + '</span></li>' +
          '<li><span class="k">Port</span><span class="v">' + esc(conn.port) + '</span></li>' +
        '</ul>' +
        '<div class="insp-section">Live rate</div>' +
        '<p class="insp-rates"><span>▼ <b data-role="rx">—</b></span><span>▲ <b data-role="tx">—</b></span></p>' +
        '<div class="conn-rate-bar" style="--k:' + classVar(conn.cls) + '"><i data-role="bar"></i></div>';
      el.querySelector('.insp-back').addEventListener('click', () => open(node));
      el.querySelector('.insp-close').addEventListener('click', close);
      refresh();
    }

    function drawSpark(history) {
      if (!sparkCtx) return;
      const c = sparkCtx.canvas;
      const w = c.clientWidth || 300, h = c.clientHeight || 56;
      const cs = getComputedStyle(document.documentElement);
      const rxCol = cs.getPropertyValue('--nm-class-streaming').trim() || '#29c9ff';
      const txCol = cs.getPropertyValue('--nm-class-browsing').trim() || '#8df14f';
      sparkCtx.clearRect(0, 0, w, h);
      if (!history || history.length < 2) return;
      const max = Math.max(10, ...history.map(p => Math.max(p.rx, p.tx))) * 1.15;
      const X = i => (i / (history.length - 1)) * (w - 6) + 3;
      const Y = v => h - 4 - (v / max) * (h - 10);

      // rx filled area
      sparkCtx.beginPath();
      sparkCtx.moveTo(X(0), h - 4);
      history.forEach((p, i) => sparkCtx.lineTo(X(i), Y(p.rx)));
      sparkCtx.lineTo(X(history.length - 1), h - 4);
      sparkCtx.closePath();
      sparkCtx.fillStyle = rxCol + '33';
      sparkCtx.fill();
      sparkCtx.beginPath();
      history.forEach((p, i) => i ? sparkCtx.lineTo(X(i), Y(p.rx)) : sparkCtx.moveTo(X(i), Y(p.rx)));
      sparkCtx.strokeStyle = rxCol;
      sparkCtx.lineWidth = 1.6;
      sparkCtx.stroke();
      // tx line
      sparkCtx.beginPath();
      history.forEach((p, i) => i ? sparkCtx.lineTo(X(i), Y(p.tx)) : sparkCtx.moveTo(X(i), Y(p.tx)));
      sparkCtx.strokeStyle = txCol;
      sparkCtx.lineWidth = 1.4;
      sparkCtx.setLineDash([3, 3]);
      sparkCtx.stroke();
      sparkCtx.setLineDash([]);
    }

    /* re-render live values from the latest sample without rebuilding DOM */
    function refresh() {
      if (!state || !sample) return;
      const dev = sample.devices[state.node.id];
      if (!dev) return;

      if (state.level === 2) {
        const badge = el.querySelector('[data-role="badge"]');
        if (badge) {
          badge.textContent = STATUS_LABEL[dev.status] || dev.status;
          badge.className = 'insp-badge ' + (dev.status === 'online' ? 'online' : dev.status === 'idle' ? 'idle' : 'asleep');
        }
        const rx = el.querySelector('[data-role="rx"]'), tx = el.querySelector('[data-role="tx"]');
        if (rx) rx.textContent = NetMap.fmtRate(dev.rx);
        if (tx) tx.textContent = NetMap.fmtRate(dev.tx);
        drawSpark(dev.history);

        const list = el.querySelector('[data-role="conns"]');
        if (list) {
          const key = dev.connections.map(c => c.id).join('|');
          if (list.dataset.key !== key) {
            list.dataset.key = key;
            list.innerHTML = '';
            dev.connections.forEach(c => {
              const li = document.createElement('li');
              const btn = document.createElement('button');
              btn.type = 'button';
              btn.innerHTML =
                '<span class="c-dot" style="--k:' + classVar(c.cls) + '"></span>' +
                '<span class="c-host">' + esc(c.host) + '</span>' +
                '<span class="c-rate" data-conn-rate></span>';
              btn.addEventListener('click', () => {
                state = { level: 3, node: state.node, connId: c.id };
                renderL3(state.node, c);
                if (opts.onLevelChange) opts.onLevelChange(state);
              });
              li.appendChild(btn);
              list.appendChild(li);
            });
          }
          const rates = list.querySelectorAll('[data-conn-rate]');
          dev.connections.forEach((c, i) => {
            if (rates[i]) rates[i].textContent = NetMap.fmtRate(c.rx + c.tx);
          });
        }
      } else if (state.level === 3) {
        const conn = dev.connections.find(c => c.id === state.connId);
        const rx = el.querySelector('[data-role="rx"]'), tx = el.querySelector('[data-role="tx"]');
        const bar = el.querySelector('[data-role="bar"]');
        if (!conn) {
          // connection rotated away in the sim — drop back to the device
          open(state.node);
          return;
        }
        if (rx) rx.textContent = NetMap.fmtRate(conn.rx);
        if (tx) tx.textContent = NetMap.fmtRate(conn.tx);
        if (bar) bar.style.width = Math.min(100, ((conn.rx + conn.tx) / (dev.rx + dev.tx + 1)) * 100) + '%';
      }
    }

    function open(node) {
      state = { level: 2, node, connId: null };
      el.hidden = false;
      renderL2(node);
      if (opts.onLevelChange) opts.onLevelChange(state);
    }

    function close() {
      state = null;
      sparkCtx = null;
      el.hidden = true;
      el.innerHTML = '';
      if (opts.onClose) opts.onClose();
      if (opts.onLevelChange) opts.onLevelChange(null);
    }

    /* Esc steps one level back; returns true if it consumed the key */
    function back() {
      if (!state) return false;
      if (state.level === 3) { open(state.node); return true; }
      close();
      return true;
    }

    return {
      open, close, back,
      get state() { return state; },
      setSample(s) { sample = s; refresh(); }
    };
  };
})();
