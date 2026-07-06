/* ===================================================================
   traffic-sim.js — simulated traffic engine for the network map.

   ADAPTER CONTRACT — how the map gets traffic data.
   The map talks to any object with this shape:

     {
       start(onSample),  // begin producing samples (~4 Hz)
       stop(),           // stop producing
     }

   onSample receives:

     {
       ts: <ms timestamp>,
       devices: {
         [nodeId]: {
           rx, tx,           // current smoothed rates in kbps (down/up)
           online: true,     // reachable at all
           status: "online" | "idle" | "asleep",
           classes: { streaming: 0.6, browsing: 0.4, ... },  // rate share
           connections: [    // live flows, rates sum ≈ device rate
             { id, host, proto, port, cls, rx, tx }
           ]
         }
       },
       events: [ { kind: "spike"|"join"|"sleep"|"backup", nodeId, cls } ]
     }

   NetMap.SimAdapter (below) implements the contract with a seeded,
   time-of-day-aware simulation. To feed REAL data instead, implement
   a LiveAdapter that polls a JSON endpoint on your router/Pi and emits
   the same sample shape — and remember the endpoint's origin must be
   added to connect-src in /_headers before the browser will fetch it.
   =================================================================== */

(function () {
  'use strict';
  const NetMap = (window.NetMap = window.NetMap || {});

  /* ------------ seeded PRNG (mulberry32) ------------ */
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

  /* ------------ built-in behavior profiles ------------
     base rates in kbps; diurnal = activity multiplier per hour 0-23;
     classMix = share of traffic per class; bursts = random surges;
     idleProb = chance (per scheduling window) the device naps. */
  const DIURNAL_HOME = [0.15,0.1,0.08,0.08,0.1,0.2,0.5,0.8,0.7,0.5,0.45,0.5,0.6,0.5,0.45,0.5,0.7,1.0,1.2,1.3,1.25,1.0,0.6,0.3];
  const DIURNAL_FLAT = new Array(24).fill(1);

  const PROFILES = {
    infra: { base: { rx: 30, tx: 30 }, diurnal: DIURNAL_FLAT, classMix: { browsing: 1 }, bursts: { ratePerHour: 0, magnitude: 0, durSec: 0 }, idleProb: 0,
      dests: [{ host: 'lan.local', proto: 'ARP/mDNS', port: 5353, cls: 'browsing' }] },
    workstation: { base: { rx: 1800, tx: 400 }, diurnal: [0.05,0.03,0.03,0.03,0.05,0.1,0.3,0.8,1.2,1.3,1.25,1.1,0.9,1.1,1.25,1.3,1.2,1.0,0.8,0.7,0.6,0.4,0.2,0.1], classMix: { browsing: 0.55, streaming: 0.2, backup: 0.15, voip: 0.1 }, bursts: { ratePerHour: 6, magnitude: 9000, durSec: 25 }, idleProb: 0.25,
      dests: [
        { host: 'cdn.pages.example', proto: 'TLS', port: 443, cls: 'browsing' },
        { host: 'api.code.example', proto: 'TLS', port: 443, cls: 'browsing' },
        { host: 'video.meet.example', proto: 'SRTP', port: 3478, cls: 'voip' },
        { host: 'sync.cloud.example', proto: 'TLS', port: 443, cls: 'backup' },
        { host: 'music.stream.example', proto: 'TLS', port: 443, cls: 'streaming' }
      ] },
    server: { base: { rx: 600, tx: 900 }, diurnal: DIURNAL_FLAT, classMix: { backup: 0.4, browsing: 0.4, iot: 0.2 }, bursts: { ratePerHour: 3, magnitude: 12000, durSec: 40 }, idleProb: 0,
      dests: [
        { host: 'registry.oci.example', proto: 'TLS', port: 443, cls: 'backup' },
        { host: 'api.llm.example', proto: 'TLS', port: 443, cls: 'browsing' },
        { host: 'nas.lan', proto: 'SMB', port: 445, cls: 'backup' },
        { host: 'metrics.lan', proto: 'HTTP', port: 9090, cls: 'iot' }
      ] },
    nas: { base: { rx: 120, tx: 350 }, diurnal: [4,6,6,2,0.5,0.4,0.4,0.5,0.6,0.6,0.6,0.6,0.6,0.6,0.6,0.6,0.7,0.8,1.0,1.2,1.2,1.0,0.8,2], classMix: { backup: 0.7, streaming: 0.3 }, bursts: { ratePerHour: 2, magnitude: 30000, durSec: 90 }, idleProb: 0,
      dests: [
        { host: 'workstation.lan', proto: 'SMB', port: 445, cls: 'backup' },
        { host: 'offsite.vault.example', proto: 'TLS', port: 443, cls: 'backup' },
        { host: 'tv.lan', proto: 'DLNA', port: 8200, cls: 'streaming' }
      ] },
    streamer: { base: { rx: 6000, tx: 120 }, diurnal: [0.1,0.05,0.02,0.02,0.02,0.05,0.15,0.3,0.25,0.2,0.2,0.3,0.4,0.35,0.3,0.35,0.5,0.9,1.3,1.5,1.5,1.2,0.7,0.3], classMix: { streaming: 0.92, browsing: 0.08 }, bursts: { ratePerHour: 4, magnitude: 12000, durSec: 60 }, idleProb: 0.35,
      dests: [
        { host: 'cdn.video.example', proto: 'TLS', port: 443, cls: 'streaming' },
        { host: 'cdn2.video.example', proto: 'QUIC', port: 443, cls: 'streaming' },
        { host: 'ads.telemetry.example', proto: 'TLS', port: 443, cls: 'browsing' }
      ] },
    phone: { base: { rx: 900, tx: 250 }, diurnal: DIURNAL_HOME, classMix: { browsing: 0.5, streaming: 0.3, voip: 0.2 }, bursts: { ratePerHour: 10, magnitude: 4000, durSec: 12 }, idleProb: 0.4,
      dests: [
        { host: 'social.feed.example', proto: 'TLS', port: 443, cls: 'browsing' },
        { host: 'clips.video.example', proto: 'QUIC', port: 443, cls: 'streaming' },
        { host: 'msg.chat.example', proto: 'TLS', port: 5223, cls: 'voip' },
        { host: 'photos.cloud.example', proto: 'TLS', port: 443, cls: 'backup' }
      ] },
    tablet: { base: { rx: 1200, tx: 150 }, diurnal: [0.3,0.15,0.05,0.02,0.02,0.05,0.3,0.6,0.5,0.4,0.4,0.5,0.6,0.5,0.5,0.6,0.8,1.1,1.3,1.4,1.3,1.0,0.7,0.5], classMix: { streaming: 0.6, browsing: 0.35, gaming: 0.05 }, bursts: { ratePerHour: 5, magnitude: 6000, durSec: 20 }, idleProb: 0.45,
      dests: [
        { host: 'cdn.video.example', proto: 'TLS', port: 443, cls: 'streaming' },
        { host: 'books.reader.example', proto: 'TLS', port: 443, cls: 'browsing' },
        { host: 'game.casual.example', proto: 'TLS', port: 443, cls: 'gaming' }
      ] },
    console: { base: { rx: 2500, tx: 400 }, diurnal: [0.1,0.05,0.02,0.02,0.02,0.02,0.05,0.1,0.1,0.1,0.15,0.2,0.3,0.3,0.3,0.4,0.7,1.2,1.5,1.6,1.5,1.1,0.6,0.2], classMix: { gaming: 0.85, streaming: 0.1, browsing: 0.05 }, bursts: { ratePerHour: 1, magnitude: 60000, durSec: 300 }, idleProb: 0.5,
      dests: [
        { host: 'match.game.example', proto: 'UDP', port: 3074, cls: 'gaming' },
        { host: 'cdn.patch.example', proto: 'TLS', port: 443, cls: 'gaming' },
        { host: 'party.voice.example', proto: 'UDP', port: 3480, cls: 'voip' }
      ] },
    speaker: { base: { rx: 320, tx: 40 }, diurnal: [0.05,0.02,0.02,0.02,0.02,0.1,0.6,1.1,1.0,0.8,0.7,0.8,0.9,0.8,0.7,0.7,0.9,1.2,1.3,1.1,0.8,0.5,0.2,0.1], classMix: { streaming: 0.9, iot: 0.1 }, bursts: { ratePerHour: 3, magnitude: 500, durSec: 15 }, idleProb: 0.4,
      dests: [
        { host: 'music.stream.example', proto: 'TLS', port: 443, cls: 'streaming' },
        { host: 'assistant.cloud.example', proto: 'TLS', port: 443, cls: 'iot' }
      ] },
    camera: { base: { rx: 20, tx: 1400 }, diurnal: DIURNAL_FLAT, classMix: { iot: 1 }, bursts: { ratePerHour: 8, magnitude: 2500, durSec: 30 }, idleProb: 0,
      dests: [
        { host: 'nvr.cloud.example', proto: 'SRTP', port: 443, cls: 'iot' },
        { host: 'homeserver.lan', proto: 'RTSP', port: 554, cls: 'iot' }
      ] },
    'iot-sensor': { base: { rx: 4, tx: 8 }, diurnal: DIURNAL_FLAT, classMix: { iot: 1 }, bursts: { ratePerHour: 12, magnitude: 60, durSec: 4 }, idleProb: 0.1,
      dests: [
        { host: 'hub.smarthome.example', proto: 'MQTT', port: 8883, cls: 'iot' },
        { host: 'homeserver.lan', proto: 'MQTT', port: 1883, cls: 'iot' }
      ] },
    printer: { base: { rx: 3, tx: 2 }, diurnal: DIURNAL_FLAT, classMix: { browsing: 1 }, bursts: { ratePerHour: 1, magnitude: 800, durSec: 8 }, idleProb: 0.7,
      dests: [{ host: 'workstation.lan', proto: 'IPP', port: 631, cls: 'browsing' }] }
  };

  const TYPE_PROFILE = {
    internet: 'infra', router: 'infra', switch: 'infra', ap: 'infra',
    nas: 'nas', server: 'server', workstation: 'workstation', laptop: 'workstation',
    phone: 'phone', tablet: 'tablet', tv: 'streamer', console: 'console',
    printer: 'printer', camera: 'camera', speaker: 'speaker',
    plug: 'iot-sensor', thermostat: 'iot-sensor'
  };

  NetMap.TRAFFIC_CLASSES = ['streaming', 'browsing', 'gaming', 'backup', 'iot', 'voip'];
  NetMap.CLASS_LABELS = { streaming: 'Streaming', browsing: 'Browsing', gaming: 'Gaming', backup: 'Backups', iot: 'IoT', voip: 'Calls' };
  NetMap.PROFILES = PROFILES;

  const TICK_MS = 250;         // 4 Hz
  const EMA_ALPHA = 0.2;
  const HISTORY_LEN = 60;      // ~15 s of samples for sparklines

  function dayOfYear(d) {
    return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
  }

  /* Ornstein-Uhlenbeck-ish noise: mean-reverting wander around 1. */
  function makeNoise(rand) {
    let v = 1;
    return function () {
      v += 0.15 * (1 - v) + (rand() - 0.5) * 0.3;
      if (v < 0.05) v = 0.05;
      return v;
    };
  }

  function SimAdapter(data) {
    const profiles = {};
    Object.keys(PROFILES).forEach(k => {
      profiles[k] = Object.assign({}, PROFILES[k], (data.profileOverrides || {})[k] || {});
    });

    const now0 = new Date();
    const daySalt = dayOfYear(now0) + now0.getFullYear() * 366;
    const devices = [];
    (data.nodes || []).forEach(node => {
      if (node.tier === 0) return; // internet endpoint carries, not generates
      const profKey = node.profile || TYPE_PROFILE[node.type] || 'iot-sensor';
      const prof = profiles[profKey] || profiles['iot-sensor'];
      const rand = mulberry32(hashStr(node.id) ^ ((data.meta && data.meta.seed) || 0) ^ daySalt);
      devices.push({
        node, prof, rand,
        noiseRx: makeNoise(rand), noiseTx: makeNoise(rand),
        emaRx: 0, emaTx: 0,
        status: 'online',
        statusUntil: 0,
        bursts: [],           // { untilTs, magnitude, cls }
        conns: [],            // live pseudo-connections
        connsUntil: 0,
        history: []           // [{rx, tx}] ring, newest last
      });
    });

    let timer = null;
    let cb = null;
    let hourOverride = null;   // day-scrubber: null = follow the wall clock

    function scheduleStatus(dev, ts) {
      // Re-decide idle/asleep every 20-90 sim-seconds.
      dev.statusUntil = ts + (20 + dev.rand() * 70) * 1000;
      const r = dev.rand();
      if (r < dev.prof.idleProb * 0.4) dev.status = 'asleep';
      else if (r < dev.prof.idleProb) dev.status = 'idle';
      else dev.status = 'online';
    }

    function rollBursts(dev, ts, events) {
      const perTick = (dev.prof.bursts.ratePerHour || 0) / 3600 * (TICK_MS / 1000);
      if (dev.rand() < perTick && dev.status === 'online') {
        const clsKeys = Object.keys(dev.prof.classMix);
        const cls = clsKeys[Math.floor(dev.rand() * clsKeys.length)];
        dev.bursts.push({
          untilTs: ts + dev.prof.bursts.durSec * 1000 * (0.5 + dev.rand()),
          magnitude: dev.prof.bursts.magnitude * (0.4 + dev.rand() * 0.8),
          cls
        });
        events.push({ kind: 'spike', nodeId: dev.node.id, cls });
      }
      dev.bursts = dev.bursts.filter(b => b.untilTs > ts);
    }

    function refreshConns(dev, ts) {
      if (ts < dev.connsUntil && dev.conns.length) return;
      dev.connsUntil = ts + (8 + dev.rand() * 20) * 1000;
      const pool = dev.prof.dests || [];
      const want = dev.status === 'online' ? 1 + Math.floor(dev.rand() * Math.min(5, pool.length)) : 1;
      const picked = pool.slice().sort(() => dev.rand() - 0.5).slice(0, Math.max(1, want));
      dev.conns = picked.map((d, i) => ({
        id: dev.node.id + ':' + d.host + ':' + i,
        host: d.host, proto: d.proto, port: d.port, cls: d.cls,
        share: 0.2 + dev.rand() * 0.8, rx: 0, tx: 0
      }));
      const total = dev.conns.reduce((s, c) => s + c.share, 0);
      dev.conns.forEach(c => { c.share /= total; });
    }

    function tick() {
      const now = new Date();
      const ts = now.getTime();
      const hour = hourOverride != null ? hourOverride : now.getHours() + now.getMinutes() / 60;
      const events = [];
      const out = {};

      devices.forEach(dev => {
        if (ts > dev.statusUntil) {
          const prev = dev.status;
          scheduleStatus(dev, ts);
          if (prev === 'asleep' && dev.status !== 'asleep') events.push({ kind: 'join', nodeId: dev.node.id });
          if (prev !== 'asleep' && dev.status === 'asleep') events.push({ kind: 'sleep', nodeId: dev.node.id });
        }
        rollBursts(dev, ts, events);
        refreshConns(dev, ts);

        // diurnal interpolation between the two nearest hours
        const d = dev.prof.diurnal;
        const h0 = Math.floor(hour) % 24, h1 = (h0 + 1) % 24, f = hour - Math.floor(hour);
        const diur = d[h0] * (1 - f) + d[h1] * f;

        const statusMul = dev.status === 'online' ? 1 : dev.status === 'idle' ? 0.12 : 0.01;
        let rx = dev.prof.base.rx * diur * dev.noiseRx() * statusMul;
        let tx = dev.prof.base.tx * diur * dev.noiseTx() * statusMul;
        dev.bursts.forEach(b => {
          const ratio = dev.prof.base.tx > dev.prof.base.rx ? 0.85 : 0.15;
          rx += b.magnitude * (1 - ratio);
          tx += b.magnitude * ratio;
        });

        dev.emaRx += EMA_ALPHA * (rx - dev.emaRx);
        dev.emaTx += EMA_ALPHA * (tx - dev.emaTx);

        dev.history.push({ rx: dev.emaRx, tx: dev.emaTx });
        if (dev.history.length > HISTORY_LEN) dev.history.shift();

        const total = dev.emaRx + dev.emaTx;
        dev.conns.forEach(c => {
          c.rx = dev.emaRx * c.share;
          c.tx = dev.emaTx * c.share;
        });

        // class shares: profile mix, biased toward active burst classes
        const classes = {};
        Object.keys(dev.prof.classMix).forEach(k => { classes[k] = dev.prof.classMix[k]; });
        dev.bursts.forEach(b => { classes[b.cls] = (classes[b.cls] || 0) + 0.5; });
        const csum = Object.values(classes).reduce((s, v) => s + v, 0) || 1;
        Object.keys(classes).forEach(k => { classes[k] /= csum; });

        out[dev.node.id] = {
          rx: dev.emaRx, tx: dev.emaTx, total,
          online: dev.status !== 'asleep',
          status: dev.status,
          classes,
          connections: dev.conns,
          history: dev.history
        };
      });

      if (cb) cb({ ts, devices: out, events });
    }

    return {
      kind: 'sim',
      start(onSample) {
        cb = onSample;
        if (!timer) { tick(); timer = setInterval(tick, TICK_MS); }
      },
      stop() {
        if (timer) { clearInterval(timer); timer = null; }
        cb = null;
      },
      /* day-scrubber hook: pass an hour (0-24 float) to preview that time
         of day, or null to follow the wall clock again */
      setHour(h) { hourOverride = h; }
    };
  }

  NetMap.SimAdapter = SimAdapter;
})();
