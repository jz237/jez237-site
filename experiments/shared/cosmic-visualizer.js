/*
 * Cosmic Visualizer - shared canvas spectrum analyzer for the jez237 music experiments.
 * Classic script; exposes window.CosmicVisualizer.create(options).
 *
 * options:
 *   container    element that hosts the visualizer (canvas is injected, absolutely positioned)
 *   getFreqData  () => Uint8Array|null   frequency byte data (0-255)
 *   getTimeData  () => Uint8Array|null   optional time-domain byte data (0-255, centered on 128)
 *   isPlaying    () => boolean
 *   storageKey   localStorage key prefix used to persist the selected mode
 */
(function () {
  "use strict";

  var STYLE_ID = "cosmic-visualizer-style";
  var BIN_COUNT = 96;
  var UI_HIDE_MS = 2600;

  var MODES = [
    { id: "neon", label: "Neon Bars" },
    { id: "radial", label: "Solar Flare" },
    { id: "tunnel", label: "Star Tunnel" },
    { id: "aurora", label: "Aurora" },
    { id: "kaleido", label: "Kaleidoscope" },
    { id: "horizon", label: "Synthwave" },
    { id: "plasma", label: "Plasma" },
    { id: "fireworks", label: "Fireworks" },
    { id: "galaxy", label: "Galaxy" },
    { id: "fluid", label: "Fluid Lab" },
  ];

  var CSS = [
    ".cviz-host { position: relative; }",
    ".cviz-host:fullscreen { background: #000 !important; border: 0 !important; box-shadow: none !important; }",
    ".cviz-host.cviz-fake-fs { position: fixed !important; inset: 0 !important; width: auto !important; height: auto !important;",
    "  min-height: 0 !important; z-index: 2147483000; background: #000 !important; border: 0 !important; box-shadow: none !important; }",
    ".cviz { position: absolute; inset: 0; overflow: hidden; }",
    ".cviz canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; cursor: pointer; }",
    ".cviz canvas.cviz-gl { display: none; background: #000; }",
    ".cviz.fluid-on canvas.cviz-gl { display: block; }",
    ".cviz-ui button.on { border-color: #8fffff; color: #8fffff; background: rgba(90, 220, 255, .18); }",
    ".cviz-ui { position: absolute; top: 10px; right: 10px; z-index: 2; display: flex; gap: 6px; align-items: center;",
    "  padding: 6px 8px; border-radius: 999px; background: rgba(4, 6, 16, .66); border: 1px solid rgba(140, 160, 255, .38);",
    "  backdrop-filter: blur(8px); opacity: 0; transition: opacity .25s ease; pointer-events: none; }",
    ".cviz.show-ui .cviz-ui, .cviz:hover .cviz-ui { opacity: 1; pointer-events: auto; }",
    ".cviz-ui button { min-height: 28px; min-width: 28px; padding: 0 9px; border: 1px solid rgba(150, 170, 255, .42);",
    "  border-radius: 999px; background: rgba(20, 26, 60, .68); color: #cfe3ff; font: 700 12px/1 ui-monospace, Menlo, Consolas, monospace;",
    "  cursor: pointer; box-shadow: none; text-transform: none; letter-spacing: 0; }",
    ".cviz-ui button:hover, .cviz-ui button:focus-visible { border-color: #8fffff; color: #8fffff; outline: none; }",
    ".cviz-label { min-width: 104px; text-align: center; color: #e8f2ff; font: 700 12px/1.15 ui-monospace, Menlo, Consolas, monospace;",
    "  letter-spacing: .05em; text-transform: uppercase; text-shadow: 0 0 8px rgba(120, 200, 255, .7); }",
    ".cviz-toast { position: absolute; left: 50%; top: 13%; transform: translateX(-50%); z-index: 2; padding: 8px 18px;",
    "  border-radius: 999px; background: rgba(4, 6, 16, .55); border: 1px solid rgba(150, 170, 255, .4); color: #eaf4ff;",
    "  font: 800 clamp(13px, 2.2vw, 22px)/1 ui-monospace, Menlo, Consolas, monospace; letter-spacing: .08em; text-transform: uppercase;",
    "  text-shadow: 0 0 14px rgba(130, 210, 255, .8); opacity: 0; transition: opacity .4s ease; pointer-events: none; white-space: nowrap; }",
    ".cviz-toast.on { opacity: 1; }",
  ].join("\n");

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }

  function hsla(h, s, l, a) {
    return "hsla(" + (((h % 360) + 360) % 360).toFixed(1) + "," + s + "%," + l + "%," + a + ")";
  }

  function readStoredMode(key) {
    try {
      var value = window.localStorage.getItem(key);
      for (var i = 0; i < MODES.length; i += 1) {
        if (MODES[i].id === value) return i;
      }
    } catch (error) { /* private mode etc. */ }
    return 0;
  }

  function create(opts) {
    injectStyle();
    var host = opts.container;
    var storageKey = (opts.storageKey || "cosmic-viz") + "-mode";
    host.classList.add("cviz-host");

    var wrap = document.createElement("div");
    wrap.className = "cviz";
    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    var ui = document.createElement("div");
    ui.className = "cviz-ui";
    ui.innerHTML =
      '<button type="button" data-act="prev" title="Previous mode" aria-label="Previous visualizer mode">&#9664;</button>' +
      '<span class="cviz-label"></span>' +
      '<button type="button" data-act="next" title="Next mode" aria-label="Next visualizer mode">&#9654;</button>' +
      '<button type="button" data-act="shuffle" title="Auto-rotate modes randomly" aria-label="Auto-rotate visualizer modes" aria-pressed="false">AUTO</button>' +
      '<button type="button" data-act="fs" title="Fullscreen (double-click also works)" aria-label="Toggle fullscreen">&#x26F6;</button>';
    var toast = document.createElement("div");
    toast.className = "cviz-toast";
    wrap.appendChild(canvas);
    wrap.appendChild(ui);
    wrap.appendChild(toast);
    host.appendChild(wrap);

    var ctx = canvas.getContext("2d");
    var label = ui.querySelector(".cviz-label");
    var dpr = 1;
    var w = 0;
    var h = 0;

    var modeIndex = readStoredMode(storageKey);

    // ---- analysis state ----
    var an = {
      bins: new Float32Array(BIN_COUNT),
      peaks: new Float32Array(BIN_COUNT),
      target: new Float32Array(BIN_COUNT),
      energy: 0,
      bass: 0,
      mid: 0,
      treb: 0,
      beat: 0,
      live: false,
      hue: Math.random() * 360,
      rot: 0,
      t: 0,
    };
    var bassHist = [];
    var beatCooldown = 0;

    // ---- per-mode persistent bits ----
    var stars = null;
    var particles = [];
    var dust = null;

    // ---- fluid mode (WebGL, lazy) ----
    var glCanvas = null;
    var fluid = null;
    var fluidFailed = false;

    function ensureFluid() {
      if (fluid || fluidFailed) return fluid;
      if (!window.CosmicFluid) {
        fluidFailed = true;
        return null;
      }
      glCanvas = document.createElement("canvas");
      glCanvas.className = "cviz-gl";
      glCanvas.setAttribute("aria-hidden", "true");
      wrap.insertBefore(glCanvas, canvas);
      fluid = window.CosmicFluid.create(glCanvas);
      if (!fluid) {
        fluidFailed = true;
        glCanvas.remove();
        glCanvas = null;
      }
      return fluid;
    }

    // ---- shuffle (auto-rotate modes) ----
    var shuffleOn = false;
    try {
      shuffleOn = window.localStorage.getItem(storageKey + "-shuffle") === "1";
    } catch (error) { /* ignore */ }
    var shuffleCountdown = 0;

    function resetShuffleCountdown() {
      // 20-40s at ~60fps between automatic mode hops
      shuffleCountdown = 1200 + Math.floor(Math.random() * 1200);
    }
    resetShuffleCountdown();

    function resize() {
      var rect = wrap.getBoundingClientRect();
      w = Math.max(0, Math.floor(rect.width));
      h = Math.max(0, Math.floor(rect.height));
      dpr = clamp(window.devicePixelRatio || 1, 1, 1.75);
      var bw = Math.max(1, Math.floor(w * dpr));
      var bh = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#02030c";
      ctx.fillRect(0, 0, w, h);
    }

    function analyze() {
      var raw = null;
      try {
        raw = opts.getFreqData ? opts.getFreqData() : null;
      } catch (error) { /* backend not ready */ }

      var i;
      var live = false;
      if (raw && raw.length) {
        var len = raw.length;
        var sum = 0;
        for (i = 0; i < BIN_COUNT; i += 1) {
          var p0 = Math.pow(i / BIN_COUNT, 1.6) * (len - 1);
          var p1 = Math.pow((i + 1) / BIN_COUNT, 1.6) * (len - 1);
          var a = Math.floor(p0);
          var b = Math.max(a + 1, Math.ceil(p1));
          var peak = 0;
          for (var j = a; j < b && j < len; j += 1) {
            if (raw[j] > peak) peak = raw[j];
          }
          var v = Math.min(1, (peak / 255) * (0.72 + 0.85 * (i / BIN_COUNT)));
          an.target[i] = v;
          sum += v;
        }
        live = sum > 0.5;
      }

      if (!live) {
        // ambient idle bed so every mode keeps gently drifting
        for (i = 0; i < BIN_COUNT; i += 1) {
          an.target[i] = 0.05
            + 0.05 * (0.5 + 0.5 * Math.sin(an.t * 0.013 + i * 0.35))
            + 0.02 * Math.sin(an.t * 0.007 - i * 0.12);
        }
      }
      an.live = live;

      var bass = 0;
      var mid = 0;
      var treb = 0;
      var bassN = Math.max(2, Math.floor(BIN_COUNT * 0.14));
      var midN = Math.floor(BIN_COUNT * 0.55);
      for (i = 0; i < BIN_COUNT; i += 1) {
        var cur = an.bins[i];
        var t = an.target[i];
        an.bins[i] = cur + (t - cur) * (t > cur ? 0.5 : 0.14);
        an.peaks[i] = Math.max(an.bins[i], an.peaks[i] - 0.006);
        if (i < bassN) bass += an.bins[i];
        else if (i < midN) mid += an.bins[i];
        else treb += an.bins[i];
      }
      an.bass = bass / bassN;
      an.mid = mid / Math.max(1, midN - bassN);
      an.treb = treb / Math.max(1, BIN_COUNT - midN);
      an.energy = an.bass * 0.5 + an.mid * 0.35 + an.treb * 0.15;

      bassHist.push(an.bass);
      if (bassHist.length > 43) bassHist.shift();
      var avg = 0;
      for (i = 0; i < bassHist.length; i += 1) avg += bassHist[i];
      avg /= Math.max(1, bassHist.length);
      beatCooldown -= 1;
      an.beatFired = false;
      if (live && beatCooldown <= 0 && an.bass > avg * 1.32 + 0.03 && an.bass > 0.22) {
        an.beat = 1;
        an.beatFired = true;
        beatCooldown = 14;
        spawnBurst();
      } else {
        an.beat *= 0.93;
      }

      an.t += 1;
      an.hue = (an.hue + 0.18 + an.energy * 1.6 + an.beat * 1.1) % 360;
      an.rot += 0.0022 + an.energy * 0.012;
    }

    function sampleBin(f) {
      var pos = clamp(f, 0, 1) * (BIN_COUNT - 1);
      var i = Math.floor(pos);
      var frac = pos - i;
      var next = Math.min(BIN_COUNT - 1, i + 1);
      return an.bins[i] * (1 - frac) + an.bins[next] * frac;
    }

    function fade(alpha) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(2,3,12," + alpha + ")";
      ctx.fillRect(0, 0, w, h);
    }

    function feedback(zoom, rot, alpha) {
      ctx.globalCompositeOperation = "source-over";
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(w / 2, h / 2);
      ctx.rotate(rot);
      ctx.scale(zoom, zoom);
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, -w / 2, -h / 2, w, h);
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function spawnBurst() {
      var cx = w / 2;
      var cy = h / 2;
      for (var i = 0; i < 14; i += 1) {
        if (particles.length > 220) break;
        var ang = Math.random() * Math.PI * 2;
        var speed = 1.4 + Math.random() * 3.2;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          life: 1,
          hue: an.hue + Math.random() * 90,
        });
      }
    }

    function drawParticles() {
      if (!particles.length) return;
      ctx.globalCompositeOperation = "lighter";
      for (var i = particles.length - 1; i >= 0; i -= 1) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.life -= 0.018;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = hsla(p.hue, 100, 70, p.life * 0.8);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1 + p.life * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ---- mode: Neon Bars ----
    function drawNeon() {
      fade(0.3);
      var count = clamp(Math.floor(w / 14), 24, BIN_COUNT);
      var bw = w / count;
      var base = h * 0.84;
      var maxH = h * 0.76;
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < count; i += 1) {
        var v = sampleBin(i / (count - 1));
        var bh = Math.pow(v, 1.35) * maxH;
        var hue = an.hue + (i / count) * 150;
        var x = i * bw;
        var grad = ctx.createLinearGradient(0, base - bh, 0, base);
        grad.addColorStop(0, hsla(hue + 60, 100, 74, 0.95));
        grad.addColorStop(1, hsla(hue, 95, 52, 0.85));
        ctx.fillStyle = grad;
        ctx.fillRect(x + 1, base - bh, bw - 2, Math.max(2, bh));
        // reflection
        ctx.fillStyle = hsla(hue, 90, 58, 0.08 + v * 0.14);
        ctx.fillRect(x + 1, base + 3, bw - 2, bh * 0.32);
        // peak cap
        var pv = an.peaks[Math.round((i / (count - 1)) * (BIN_COUNT - 1))];
        var py = base - Math.pow(pv, 1.35) * maxH;
        ctx.fillStyle = hsla(hue + 40, 100, 82, 0.9);
        ctx.fillRect(x + 1, py - 3, bw - 2, 3);
      }
      ctx.fillStyle = hsla(an.hue, 100, 65, 0.4 + an.beat * 0.4);
      ctx.fillRect(0, base, w, 2);
      drawParticles();
      ctx.globalCompositeOperation = "source-over";
    }

    // ---- mode: Solar Flare (radial) ----
    function drawRadial() {
      feedback(1.015, 0.0022 + an.energy * 0.004, 0.5);
      fade(0.24);
      var cx = w / 2;
      var cy = h / 2;
      var R = Math.min(w, h);
      var r0 = R * (0.15 + an.bass * 0.07 + an.beat * 0.05);
      var spokes = BIN_COUNT * 2;
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = Math.max(1.5, R * 0.006);
      ctx.lineCap = "round";
      for (var k = 0; k < spokes; k += 1) {
        var i = k < BIN_COUNT ? k : spokes - 1 - k;
        var v = an.bins[i];
        var ang = (k / spokes) * Math.PI * 2 + an.rot;
        var len = Math.pow(v, 1.3) * R * 0.33 + 2;
        var cos = Math.cos(ang);
        var sin = Math.sin(ang);
        ctx.strokeStyle = hsla(an.hue + (k / spokes) * 300, 95, 62, 0.28 + v * 0.6);
        ctx.beginPath();
        ctx.moveTo(cx + cos * r0, cy + sin * r0);
        ctx.lineTo(cx + cos * (r0 + len), cy + sin * (r0 + len));
        ctx.stroke();
      }
      var core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r0 * 0.95);
      core.addColorStop(0, hsla(an.hue + 40, 100, 88, 0.55 + an.beat * 0.35));
      core.addColorStop(0.55, hsla(an.hue, 100, 60, 0.3));
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, r0 * 0.95, 0, Math.PI * 2);
      ctx.fill();
      drawParticles();
      ctx.globalCompositeOperation = "source-over";
    }

    // ---- mode: Star Tunnel ----
    function ensureStars() {
      if (stars) return;
      stars = [];
      for (var i = 0; i < 240; i += 1) {
        stars.push({
          ang: Math.random() * Math.PI * 2,
          rad: 0.08 + Math.random() * 0.92,
          z: Math.random(),
        });
      }
    }

    function drawTunnel() {
      ensureStars();
      fade(0.32);
      var cx = w / 2;
      var cy = h / 2;
      var R = Math.min(w, h);
      var speed = 0.004 + an.energy * 0.04 + an.beat * 0.05;
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (var i = 0; i < stars.length; i += 1) {
        var s = stars[i];
        var zPrev = s.z;
        s.z -= speed * (0.5 + s.rad);
        if (s.z <= 0.02) {
          s.ang = Math.random() * Math.PI * 2;
          s.rad = 0.08 + Math.random() * 0.92;
          s.z = 1;
          continue;
        }
        var ang = s.ang + an.rot * 0.3;
        var r1 = (s.rad / s.z) * R * 0.32;
        var r2 = (s.rad / Math.min(1, zPrev + 0.001)) * R * 0.32;
        if (r1 > R) {
          s.z = 1;
          continue;
        }
        var cos = Math.cos(ang);
        var sin = Math.sin(ang);
        var bright = clamp(1 - s.z, 0.08, 1);
        ctx.strokeStyle = hsla(an.hue + (ang / (Math.PI * 2)) * 360, 90, 70, bright * 0.85);
        ctx.lineWidth = 0.5 + bright * 2.4;
        ctx.beginPath();
        ctx.moveTo(cx + cos * r2, cy + sin * r2);
        ctx.lineTo(cx + cos * r1, cy + sin * r1);
        ctx.stroke();
      }
      // spectrum ring at tunnel mouth
      var base = R * (0.08 + an.bass * 0.04);
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (var k = 0; k <= BIN_COUNT * 2; k += 1) {
        var bi = k < BIN_COUNT ? k : BIN_COUNT * 2 - 1 - Math.min(k, BIN_COUNT * 2 - 1);
        var a = (k / (BIN_COUNT * 2)) * Math.PI * 2 - an.rot;
        var rr = base + an.bins[Math.max(0, bi)] * R * 0.12;
        var px = cx + Math.cos(a) * rr;
        var py = cy + Math.sin(a) * rr;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = hsla(an.hue + 180, 100, 70, 0.7);
      ctx.stroke();
      drawParticles();
      ctx.globalCompositeOperation = "source-over";
    }

    // ---- mode: Aurora ----
    function ensureDust() {
      if (dust) return;
      dust = [];
      for (var i = 0; i < 42; i += 1) {
        dust.push({
          x: Math.random(),
          y: Math.random(),
          v: 0.0003 + Math.random() * 0.0012,
          size: 0.6 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function drawAurora() {
      ensureDust();
      fade(0.2);
      var steps = 72;
      ctx.globalCompositeOperation = "lighter";
      for (var L = 0; L < 4; L += 1) {
        var baseY = h * (0.3 + L * 0.15);
        var amp = h * 0.17 * (1 - L * 0.14);
        var hueL = an.hue + L * 46;
        var grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, hsla(hueL, 95, 62, 0.7));
        grad.addColorStop(1, hsla(hueL + 90, 95, 62, 0.7));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2 + L * 0.8;
        ctx.beginPath();
        for (var sIdx = 0; sIdx <= steps; sIdx += 1) {
          var x = (sIdx / steps) * w;
          var v = sampleBin(sIdx / steps);
          var y = baseY
            - Math.pow(v, 1.2) * amp
            + Math.sin(x * 0.008 * (1 + L * 0.35) + an.t * (0.02 + L * 0.007)) * amp * 0.3;
          if (sIdx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        // soft fill beneath the ribbon
        ctx.lineTo(w, baseY + amp);
        ctx.lineTo(0, baseY + amp);
        ctx.closePath();
        ctx.fillStyle = hsla(hueL + 30, 90, 55, 0.05 + an.energy * 0.06);
        ctx.fill();
      }
      // oscilloscope garnish from time-domain data
      var time = null;
      try {
        time = opts.getTimeData ? opts.getTimeData() : null;
      } catch (error) { /* not ready */ }
      if (time && time.length && an.live) {
        ctx.strokeStyle = hsla(an.hue + 180, 100, 78, 0.8);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        var mid = h * 0.55;
        for (var i = 0; i <= steps; i += 1) {
          var ti = Math.floor((i / steps) * (time.length - 1));
          var ty = mid + ((time[ti] - 128) / 128) * h * 0.18;
          var tx = (i / steps) * w;
          if (i === 0) ctx.moveTo(tx, ty);
          else ctx.lineTo(tx, ty);
        }
        ctx.stroke();
      }
      // drifting dust
      for (var d = 0; d < dust.length; d += 1) {
        var pt = dust[d];
        pt.y -= pt.v * (1 + an.treb * 4);
        if (pt.y < -0.02) {
          pt.y = 1.02;
          pt.x = Math.random();
        }
        var twinkle = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(an.t * 0.05 + pt.phase)) + an.treb * 0.4;
        ctx.fillStyle = hsla(an.hue + 60, 100, 85, clamp(twinkle, 0, 0.85));
        ctx.beginPath();
        ctx.arc(pt.x * w, pt.y * h, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    // ---- mode: Kaleidoscope ----
    function drawKaleido() {
      feedback(1.018, 0.003 + an.energy * 0.01, 0.62);
      fade(0.14);
      var cx = w / 2;
      var cy = h / 2;
      var R = Math.min(w, h) * 0.5;
      var segments = 10;
      var wedge = (Math.PI * 2) / segments;
      var pts = 22;
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1.8;
      ctx.lineJoin = "round";
      for (var seg = 0; seg < segments; seg += 1) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(seg * wedge + an.rot);
        if (seg % 2) ctx.scale(1, -1);
        ctx.strokeStyle = hsla(an.hue + seg * 9, 95, 64, 0.5);
        ctx.beginPath();
        for (var p = 0; p <= pts; p += 1) {
          var i = Math.min(BIN_COUNT - 1, p * 4);
          var r = R * 0.12 + an.bins[i] * R * 0.82;
          var a = (p / pts) * wedge;
          var x = Math.cos(a) * r;
          var y = Math.sin(a) * r;
          if (p === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        for (var q = 0; q <= pts; q += 2) {
          var qi = Math.min(BIN_COUNT - 1, q * 4);
          var qv = an.bins[qi];
          var qr = R * 0.12 + qv * R * 0.82;
          var qa = (q / pts) * wedge;
          ctx.fillStyle = hsla(an.hue + q * 14, 100, 68, 0.25 + qv * 0.6);
          ctx.beginPath();
          ctx.arc(Math.cos(qa) * qr, Math.sin(qa) * qr, 1.2 + qv * 4.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      drawParticles();
      ctx.globalCompositeOperation = "source-over";
    }

    // ---- mode: Synthwave Horizon ----
    function drawHorizon() {
      fade(0.42);
      var horizon = h * 0.46;
      var cx = w / 2;
      ctx.globalCompositeOperation = "lighter";
      // sun
      var sunR = Math.min(w, h) * (0.17 + an.bass * 0.06 + an.beat * 0.03);
      var sunY = horizon - sunR * 0.2;
      var sun = ctx.createRadialGradient(cx, sunY, 0, cx, sunY, sunR);
      sun.addColorStop(0, hsla(an.hue + 45, 100, 78, 0.9));
      sun.addColorStop(0.65, hsla(an.hue, 100, 55, 0.6));
      sun.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sun;
      ctx.beginPath();
      ctx.arc(cx, sunY, sunR, 0, Math.PI * 2);
      ctx.fill();
      // classic scanline stripes across the sun's lower half
      ctx.globalCompositeOperation = "source-over";
      for (var st = 0; st < 6; st += 1) {
        var sy = sunY + sunR * (0.08 + st * 0.15);
        ctx.fillStyle = "rgba(2,3,12,0.85)";
        ctx.fillRect(cx - sunR, sy, sunR * 2, 1.5 + st * 1.4);
      }
      // spectrum mountain ridge (mirrored around center)
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      var steps = 64;
      for (var i = 0; i <= steps; i += 1) {
        var x = (i / steps) * w;
        var v = sampleBin(Math.abs(i / steps - 0.5) * 2);
        ctx.lineTo(x, horizon - Math.pow(v, 1.3) * h * 0.22 - 1);
      }
      ctx.lineTo(w, horizon);
      ctx.closePath();
      ctx.fillStyle = "rgba(3,4,16,0.92)";
      ctx.fill();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = hsla(an.hue + 160, 100, 65, 0.85);
      ctx.lineWidth = 1.6;
      ctx.stroke();
      // perspective grid floor
      ctx.strokeStyle = hsla(an.hue + 190, 95, 60, 0.4);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var k = -10; k <= 10; k += 1) {
        ctx.moveTo(cx + k * w * 0.011, horizon);
        ctx.lineTo(cx + k * w * 0.13, h);
      }
      ctx.stroke();
      var rows = 9;
      var scroll = (an.t * (0.004 + an.energy * 0.012)) % (1 / rows);
      for (var r = 0; r < rows; r += 1) {
        var zt = (r / rows + scroll) % 1;
        var gy = horizon + zt * zt * (h - horizon);
        ctx.strokeStyle = hsla(an.hue + 190, 95, 62, 0.12 + zt * 0.5);
        ctx.lineWidth = 0.8 + zt * 2;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }
      drawParticles();
      ctx.globalCompositeOperation = "source-over";
    }

    // ---- mode: Plasma ----
    var plasmaT = { a: Math.random() * 10, b: Math.random() * 10, c: Math.random() * 10 };

    function drawPlasma() {
      ctx.globalCompositeOperation = "source-over";
      plasmaT.a += 0.016 + an.energy * 0.05 + an.beat * 0.04;
      plasmaT.b += 0.011 + an.bass * 0.07;
      plasmaT.c += 0.008 + an.treb * 0.08;
      var cols = clamp(Math.floor(w / 16), 20, 64);
      var cell = Math.ceil(w / cols);
      var rows = Math.ceil(h / cell);
      var zoom = 0.16 * (1 + an.bass * 0.35);
      var glow = 0.55 + an.energy * 0.9;
      for (var iy = 0; iy < rows; iy += 1) {
        for (var ix = 0; ix < cols; ix += 1) {
          var dx = ix - cols / 2;
          var dy = iy - rows / 2;
          var v = Math.sin(ix * zoom * 2.1 + plasmaT.a)
            + Math.sin(iy * zoom * 1.7 - plasmaT.b)
            + Math.sin((ix + iy) * zoom * 1.2 + plasmaT.c)
            + Math.sin(Math.sqrt(dx * dx + dy * dy) * zoom * 2.4 - plasmaT.a * 1.3);
          ctx.fillStyle = hsla(an.hue + v * 44, 85, clamp(24 + (v + 4) * 6.5 * glow, 4, 74), 1);
          ctx.fillRect(ix * cell, iy * cell, cell + 1, cell + 1);
        }
      }
    }

    // ---- mode: Fireworks ----
    var rockets = [];
    var sparks = [];
    var framesSinceLaunch = 999;

    function drawFireworks() {
      fade(0.22);
      ctx.globalCompositeOperation = "lighter";
      var launch = an.beatFired ? 1 + Math.floor(an.bass * 2.5) : 0;
      // smooth tracks rarely trip the beat detector — keep the sky alive anyway
      if (!launch && an.live && framesSinceLaunch > 150 && an.energy > 0.04) launch = 1;
      if (!an.live && Math.random() < 0.005) launch = 1; // lone idle rocket now and then
      framesSinceLaunch += 1;
      if (launch) framesSinceLaunch = 0;
      for (var l = 0; l < launch && rockets.length < 6; l += 1) {
        rockets.push({
          x: w * (0.15 + Math.random() * 0.7),
          y: h + 4,
          vx: (Math.random() - 0.5) * 1.6,
          vy: -h * (0.012 + Math.random() * 0.006 + an.bass * 0.004),
          hue: an.hue + Math.random() * 120,
          fuse: h * (0.18 + Math.random() * 0.3),
        });
      }
      for (var r = rockets.length - 1; r >= 0; r -= 1) {
        var k = rockets[r];
        k.x += k.vx;
        k.y += k.vy;
        k.vy += h * 0.00016;
        ctx.fillStyle = hsla(k.hue, 100, 78, 0.9);
        ctx.fillRect(k.x - 1.2, k.y, 2.4, 6);
        if (k.y <= k.fuse || k.vy > -0.4) {
          var count = 36 + Math.floor(Math.random() * 30);
          for (var s = 0; s < count && sparks.length < 700; s += 1) {
            var a = Math.random() * Math.PI * 2;
            var sp = (0.7 + Math.random() * 2.6) * Math.min(w, h) * 0.0042;
            sparks.push({
              x: k.x,
              y: k.y,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp,
              life: 1,
              hue: k.hue + Math.random() * 40 - 20,
            });
          }
          rockets.splice(r, 1);
        }
      }
      for (var s2 = sparks.length - 1; s2 >= 0; s2 -= 1) {
        var p = sparks[s2];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += h * 0.0002;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.life -= 0.011;
        if (p.life <= 0) {
          sparks.splice(s2, 1);
          continue;
        }
        ctx.fillStyle = hsla(p.hue, 100, 55 + p.life * 30, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.8 + p.life * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      // equalizer skyline along the bottom
      var count2 = clamp(Math.floor(w / 22), 20, 64);
      var bw = w / count2;
      for (var i2 = 0; i2 < count2; i2 += 1) {
        var v = sampleBin(i2 / (count2 - 1));
        var bh = Math.pow(v, 1.4) * h * 0.16 + 2;
        ctx.fillStyle = hsla(an.hue + (i2 / count2) * 120, 90, 55, 0.5);
        ctx.fillRect(i2 * bw + 1, h - bh, bw - 2, bh);
      }
      ctx.globalCompositeOperation = "source-over";
    }

    // ---- mode: Galaxy ----
    var galaxyStars = null;

    function ensureGalaxy() {
      if (galaxyStars) return;
      galaxyStars = [];
      for (var i = 0; i < 460; i += 1) {
        galaxyStars.push({
          arm: i % 3,
          dist: Math.pow(Math.random(), 0.7),
          jitter: (Math.random() - 0.5) * 0.55,
          size: 0.5 + Math.random() * 1.6,
          tw: Math.random() * Math.PI * 2,
        });
      }
    }

    function drawGalaxy() {
      ensureGalaxy();
      feedback(1.006, 0.0012 + an.energy * 0.003, 0.45);
      fade(0.3);
      var cx = w / 2;
      var cy = h / 2;
      var R = Math.min(w, h) * 0.5;
      ctx.globalCompositeOperation = "lighter";
      var coreR = R * (0.1 + an.bass * 0.11 + an.beat * 0.06);
      var core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      core.addColorStop(0, hsla(an.hue + 50, 100, 88, 0.8));
      core.addColorStop(0.6, hsla(an.hue, 95, 60, 0.35));
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();
      for (var i = 0; i < galaxyStars.length; i += 1) {
        var s = galaxyStars[i];
        var v = sampleBin(s.dist);
        var ang = s.arm * (Math.PI * 2 / 3) + s.dist * 4.6 + s.jitter + an.rot * (1.6 - s.dist * 0.8);
        var rad = (0.12 + s.dist * 0.85) * R * (1 + v * 0.3);
        var x = cx + Math.cos(ang) * rad;
        var y = cy + Math.sin(ang) * rad * 0.72;
        var bright = 0.22 + v * 0.75 + 0.15 * Math.sin(an.t * 0.1 + s.tw);
        ctx.fillStyle = hsla(an.hue + s.dist * 140, 90, 62 + v * 20, clamp(bright, 0, 1));
        ctx.beginPath();
        ctx.arc(x, y, s.size + v * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      drawParticles();
      ctx.globalCompositeOperation = "source-over";
    }

    var DRAWERS = {
      neon: drawNeon,
      radial: drawRadial,
      tunnel: drawTunnel,
      aurora: drawAurora,
      kaleido: drawKaleido,
      horizon: drawHorizon,
      plasma: drawPlasma,
      fireworks: drawFireworks,
      galaxy: drawGalaxy,
    };

    function step() {
      analyze();
      if (shuffleOn) {
        shuffleCountdown -= 1;
        if (shuffleCountdown <= 0) {
          var next = Math.floor(Math.random() * (MODES.length - 1));
          if (next >= modeIndex) next += 1;
          setMode(next);
          resetShuffleCountdown();
        }
      }
      if (w > 12 && h > 12) {
        var mode = MODES[modeIndex].id;
        if (mode === "fluid") {
          var engine = ensureFluid();
          if (!engine) {
            // WebGL unavailable: skip past the fluid mode
            setMode(modeIndex + 1, true);
            mode = MODES[modeIndex].id;
          } else {
            wrap.classList.add("fluid-on");
            ctx.clearRect(0, 0, w, h);
            if (an.beatFired) engine.burst(Math.min(1, an.bass));
            // zero the bands when idle: the synthetic idle bed that keeps the
            // 2D modes breathing would otherwise stir the fluid in silence
            engine.step(1 / 60, {
              bass: an.live ? an.bass : 0,
              mid: an.live ? an.mid : 0,
              treb: an.live ? an.treb : 0,
              energy: an.live ? an.energy : 0,
              hue: an.hue,
              live: an.live,
            });
            engine.render();
          }
        }
        if (mode !== "fluid") {
          if (wrap.classList.contains("fluid-on")) wrap.classList.remove("fluid-on");
          (DRAWERS[mode] || drawNeon)();
          if (an.beat > 0.45) {
            var flash = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.7);
            flash.addColorStop(0, "rgba(0,0,0,0)");
            flash.addColorStop(1, hsla(an.hue, 100, 70, an.beat * 0.07));
            ctx.fillStyle = flash;
            ctx.fillRect(0, 0, w, h);
          }
        }
      }
    }

    function frame() {
      step();
      window.requestAnimationFrame(frame);
    }

    // ---- UI ----
    var toastTimer = 0;
    var uiTimer = 0;

    function showToast(text) {
      toast.textContent = text;
      toast.classList.add("on");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(function () {
        toast.classList.remove("on");
      }, 1400);
    }

    function showUi() {
      wrap.classList.add("show-ui");
      window.clearTimeout(uiTimer);
      uiTimer = window.setTimeout(function () {
        wrap.classList.remove("show-ui");
      }, UI_HIDE_MS);
    }

    function setMode(index, silent) {
      modeIndex = ((index % MODES.length) + MODES.length) % MODES.length;
      label.textContent = MODES[modeIndex].label;
      try {
        window.localStorage.setItem(storageKey, MODES[modeIndex].id);
      } catch (error) { /* ignore */ }
      if (!silent) showToast(MODES[modeIndex].label);
    }

    function cycleMode(delta) {
      setMode(modeIndex + (delta || 1));
      resetShuffleCountdown();
      showUi();
    }

    function syncShuffleButton() {
      var button = ui.querySelector('button[data-act="shuffle"]');
      button.classList.toggle("on", shuffleOn);
      button.setAttribute("aria-pressed", shuffleOn ? "true" : "false");
    }

    function toggleShuffle() {
      shuffleOn = !shuffleOn;
      resetShuffleCountdown();
      syncShuffleButton();
      try {
        window.localStorage.setItem(storageKey + "-shuffle", shuffleOn ? "1" : "0");
      } catch (error) { /* ignore */ }
      showToast(shuffleOn ? "Auto-rotate on" : "Auto-rotate off");
    }

    var fakeFullscreen = false;

    function isFullscreen() {
      return fakeFullscreen || (document.fullscreenElement || document.webkitFullscreenElement) === host;
    }

    function setFakeFullscreen(on) {
      fakeFullscreen = on;
      host.classList.toggle("cviz-fake-fs", on);
      resize();
    }

    function toggleFullscreen() {
      if (fakeFullscreen) {
        setFakeFullscreen(false);
        return;
      }
      if (isFullscreen()) {
        var exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) exit.call(document);
        return;
      }
      var request = host.requestFullscreen || host.webkitRequestFullscreen;
      if (!request) {
        setFakeFullscreen(true);
        return;
      }
      try {
        var result = request.call(host);
        // fall back to a fixed-position overlay when the native API is unavailable
        // or blocked (iOS Safari, embedded/automation contexts)
        if (result && typeof result.catch === "function") {
          result.catch(function () {
            setFakeFullscreen(true);
          });
        }
      } catch (error) {
        setFakeFullscreen(true);
      }
    }

    ui.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      var act = button.dataset.act;
      if (act === "prev") cycleMode(-1);
      else if (act === "next") cycleMode(1);
      else if (act === "shuffle") toggleShuffle();
      else if (act === "fs") toggleFullscreen();
    });

    canvas.addEventListener("click", showUi);
    canvas.addEventListener("dblclick", toggleFullscreen);
    wrap.addEventListener("pointermove", showUi, { passive: true });

    document.addEventListener("keydown", function (event) {
      if (!isFullscreen()) return;
      if (event.key === "ArrowLeft") cycleMode(-1);
      else if (event.key === "ArrowRight") cycleMode(1);
      else if (event.key === "f" || event.key === "F") toggleFullscreen();
      else if (event.key === "Escape" && fakeFullscreen) setFakeFullscreen(false);
    });

    document.addEventListener("fullscreenchange", resize);
    document.addEventListener("webkitfullscreenchange", resize);

    if (typeof ResizeObserver === "function") {
      new ResizeObserver(resize).observe(wrap);
    } else {
      window.addEventListener("resize", resize);
    }

    setMode(modeIndex, true);
    syncShuffleButton();
    resize();
    window.requestAnimationFrame(frame);

    return {
      element: wrap,
      setMode: setMode,
      cycleMode: cycleMode,
      toggleFullscreen: toggleFullscreen,
      getMode: function () { return MODES[modeIndex].id; },
      modes: MODES.slice(),
      renderFrame: step, // manual single-frame step (testing / embedding without RAF)
      getFluid: function () { return fluid; },
    };
  }

  window.CosmicVisualizer = { create: create, MODES: MODES };
})();
