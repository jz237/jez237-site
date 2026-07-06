/* ===================================================================
   audio.js — optional Web Audio sonification of network traffic.
   Muted by default; the AudioContext is created lazily on the first
   enable click (never autoplays) and suspended when toggled off or
   when the tab is hidden.

   Sound design:
     masterGain(0.15) → compressor → destination
     · hum: two detuned triangle oscillators (55 / 55.5 Hz beat)
       → lowpass 220 Hz; gain follows total network rate
     · air: looped noise buffer → bandpass 1.2 kHz; gain follows
       wireless traffic
     · pings: short sine blips, pitch per traffic class, fired on
       sim events (join / spike / sleep), rate-limited
   =================================================================== */

(function () {
  'use strict';
  const NetMap = (window.NetMap = window.NetMap || {});

  const PING_HZ = { streaming: 523.25, browsing: 659.25, gaming: 440, backup: 196, iot: 1318.5, voip: 783.99, join: 880, sleep: 261.63 };

  NetMap.createAudio = function () {
    let ctx = null;
    let master, humGain, airGain;
    let enabled = false;
    let lastPing = 0, pingsThisSec = 0, pingSecStart = 0;
    let humTarget = 0, airTarget = 0;

    function build() {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.15;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp);
      comp.connect(ctx.destination);

      // ambient hum
      humGain = ctx.createGain();
      humGain.gain.value = 0;
      const humLp = ctx.createBiquadFilter();
      humLp.type = 'lowpass';
      humLp.frequency.value = 220;
      humGain.connect(humLp);
      humLp.connect(master);
      [55, 55.5].forEach(f => {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.value = f;
        o.connect(humGain);
        o.start();
      });

      // wireless "air" noise
      const len = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      noise.loop = true;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1200;
      bp.Q.value = 4;
      airGain = ctx.createGain();
      airGain.gain.value = 0;
      noise.connect(bp);
      bp.connect(airGain);
      airGain.connect(master);
      noise.start();
    }

    function ping(hz, dur, vol) {
      if (!ctx || !enabled) return;
      const now = ctx.currentTime;
      const wall = performance.now();
      if (wall - pingSecStart > 1000) { pingSecStart = wall; pingsThisSec = 0; }
      if (pingsThisSec >= 3 || wall - lastPing < 120) return;
      pingsThisSec++;
      lastPing = wall;
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = hz;
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol || 0.25, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + (dur || 0.3));
      o.connect(g);
      g.connect(master);
      o.start(now);
      o.stop(now + (dur || 0.3) + 0.05);
    }

    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend();
      else if (enabled) ctx.resume();
    });

    return {
      get enabled() { return enabled; },
      toggle() {
        enabled = !enabled;
        if (enabled) {
          if (!ctx) build();
          ctx.resume();
        } else if (ctx) {
          ctx.suspend();
        }
        return enabled;
      },
      /* feed a sim sample: scale hum to total rate, air to wifi rate */
      setSample(sample, byId) {
        if (!ctx || !enabled) return;
        let total = 0, wifi = 0;
        Object.keys(sample.devices).forEach(id => {
          const d = sample.devices[id];
          total += d.rx + d.tx;
          const node = byId[id];
          if (node && node.media === 'wifi') wifi += d.rx + d.tx;
        });
        humTarget = Math.min(0.25, Math.log10(total + 1) / 5 * 0.25);
        airTarget = Math.min(0.05, Math.log10(wifi + 1) / 5 * 0.05);
        const now = ctx.currentTime;
        humGain.gain.linearRampToValueAtTime(humTarget, now + 1);
        airGain.gain.linearRampToValueAtTime(airTarget, now + 1);
        (sample.events || []).forEach(ev => {
          if (ev.kind === 'spike') ping(PING_HZ[ev.cls] || 600, ev.cls === 'iot' ? 0.12 : 0.3, 0.2);
          else if (ev.kind === 'join') ping(PING_HZ.join, 0.4, 0.22);
          else if (ev.kind === 'sleep') ping(PING_HZ.sleep, 0.5, 0.12);
        });
      }
    };
  };
})();
