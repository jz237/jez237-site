/* ===================================================================
   live-adapter.js — OWNER-ONLY live traffic source for the map.

   The public site always runs the simulation. Live mode is for viewing
   the map on your own LAN, pointed at a local exporter (see
   network/exporter/). Activate it explicitly:

     /network/?adapter=live&src=http://<lan-host>:8321/sample.json

   Three things keep this owner-only by construction:
   · main.js only starts this adapter when the page itself is served
     from localhost or a private LAN address AND ?src= points at one.
     On the deployed site a crafted ?adapter=live link is ignored.
   · The production CSP (connect-src in /_headers) does not allow any
     exporter origin. Do NOT add one there — real-time rates broadcast
     when the house is occupied or asleep. (The CSP is not the guard:
     it allows hosts that anyone can publish a file to.)
   · The exporter itself should only listen on the LAN (see the README
     in network/exporter/) and never be port-forwarded.

   Expected payload (the adapter contract from traffic-sim.js):
     {
       "ts": 1730000000000,
       "devices": {
         "<nodeId>": {
           "rx": 1234.5, "tx": 67.8,        // kbps
           "online": true,                   // optional
           "status": "online|idle|asleep",  // optional
           "classes": { "streaming": 0.7 }, // optional rate shares
           "connections": [                  // optional
             { "host": "...", "proto": "TCP", "port": 443,
               "cls": "streaming", "rx": 1000, "tx": 50 }
           ]
         }
       },
       "events": [ { "kind": "spike", "nodeId": "...", "cls": "..." } ]
     }
   Node ids must match network/data.js. The adapter accumulates the
   sparkline history client-side, so the exporter only sends snapshots.
   =================================================================== */

(function () {
  'use strict';
  const NetMap = (window.NetMap = window.NetMap || {});

  const POLL_MS = 1000;
  const HISTORY_LEN = 60;

  // Samples arrive over the network, so nothing from them is trusted as
  // markup: classes and statuses are matched against known names.
  const STATUSES = { online: 1, idle: 1, asleep: 1 };
  function knownClass(cls) {
    return NetMap.CLASS_LABELS && Object.prototype.hasOwnProperty.call(NetMap.CLASS_LABELS, cls) ? cls : 'browsing';
  }
  function classShares(raw) {
    const out = {};
    Object.keys(raw && typeof raw === 'object' ? raw : {}).forEach(k => {
      const share = +raw[k];
      if (isFinite(share)) out[knownClass(k)] = (out[knownClass(k)] || 0) + share;
    });
    return Object.keys(out).length ? out : { browsing: 1 };
  }
  function text(value, fallback, max) {
    return value == null || typeof value === 'object' ? fallback : String(value).slice(0, max);
  }

  NetMap.LiveAdapter = function (src) {
    let timer = null, cb = null, inFlight = false;
    let consecutiveErrors = 0;
    const history = {};

    async function poll() {
      if (inFlight || !cb) return;
      inFlight = true;
      try {
        const r = await fetch(src, { cache: 'no-store' });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        consecutiveErrors = 0;

        const devices = {};
        Object.keys(j.devices || {}).forEach(id => {
          const d = j.devices[id] || {};
          const rx = +d.rx || 0, tx = +d.tx || 0;
          const h = (history[id] = history[id] || []);
          h.push({ rx, tx });
          if (h.length > HISTORY_LEN) h.shift();
          devices[id] = {
            rx, tx, total: rx + tx,
            online: d.online !== false,
            status: STATUSES[d.status] ? d.status : (d.online === false ? 'asleep' : 'online'),
            classes: classShares(d.classes),
            connections: (Array.isArray(d.connections) ? d.connections : []).slice(0, 50).map((c, i) => {
              c = c && typeof c === 'object' ? c : {};
              const host = text(c.host, 'unknown', 120) || 'unknown';
              return {
                id: id + ':' + host + ':' + i,
                host,
                proto: text(c.proto, '—', 12) || '—',
                port: Number.isInteger(+c.port) && c.port !== null && c.port !== '' ? +c.port : '—',
                cls: knownClass(c.cls),
                rx: +c.rx || 0, tx: +c.tx || 0
              };
            }),
            history: h
          };
        });
        if (cb) cb({ ts: j.ts || Date.now(), devices, events: j.events || [], live: true });
      } catch (e) {
        consecutiveErrors++;
        if (cb) cb({
          ts: Date.now(), devices: {}, events: [],
          live: true, error: String(e && e.message || e), consecutiveErrors
        });
      } finally {
        inFlight = false;
      }
    }

    return {
      kind: 'live',
      start(onSample) {
        cb = onSample;
        if (!timer) { poll(); timer = setInterval(poll, POLL_MS); }
      },
      stop() {
        if (timer) { clearInterval(timer); timer = null; }
        cb = null;
      },
      setHour() { /* live data has no synthetic clock to scrub */ }
    };
  };
})();
