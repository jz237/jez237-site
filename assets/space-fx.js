/* space-fx.js — animated star field + meteors for galaxy-themed pages.
   Host resolution: [data-space-fx] element → .galaxy-backdrop (home) → a fixed
   full-viewport layer appended to body (games/, how-ai-works/, ai-explainer —
   their content sits at z-index 1, galaxy pseudo-elements at 0).
   Respects prefers-reduced-motion (static stars, no meteors).
   Debug: window.__spaceFx.renderFrame(dtMs) steps one frame manually — needed in
   headless previews where document.hidden keeps requestAnimationFrame from firing. */
(function () {
  'use strict';

  var host = document.querySelector('[data-space-fx]') || document.querySelector('.galaxy-backdrop');
  if (!host) {
    host = document.createElement('div');
    host.className = 'space-fx-layer';
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
    document.body.appendChild(host);
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var canvas = document.createElement('canvas');
  canvas.className = 'galaxy-fx-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;z-index:4;width:100%;height:100%;pointer-events:none;display:block;';
  host.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;

  // ---- stars ------------------------------------------------------------
  // Fractional coordinates so a resize keeps the same sky.
  var STAR_COLORS = [
    [255, 255, 255], [255, 255, 255], [255, 255, 255],
    [155, 232, 255], [136, 176, 255], [255, 217, 160]
  ];
  var stars = [];

  function buildStars() {
    stars.length = 0;
    var count = Math.max(40, Math.min(230, Math.round((W * H) / 8500)));
    for (var i = 0; i < count; i++) {
      var bright = Math.random() < 0.08;
      stars.push({
        fx: Math.random(),
        fy: Math.random(),
        r: bright ? 1.5 + Math.random() * 0.9 : 0.35 + Math.random() * 1.1,
        c: STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0],
        base: 0.25 + Math.random() * 0.5,       // baseline alpha
        amp: 0.2 + Math.random() * 0.55,        // twinkle amplitude
        speed: 0.4 + Math.random() * 1.6,       // twinkle speed (rad/s)
        phase: Math.random() * Math.PI * 2,
        glint: bright
      });
    }
  }

  // ---- meteors ----------------------------------------------------------
  var meteors = [];
  var nextMeteorIn = 2.5 + Math.random() * 4; // first one shows up quickly

  function spawnMeteor() {
    var dir = Math.random() < 0.5 ? 1 : -1;             // 1 = left→right
    var angle = (28 + Math.random() * 24) * Math.PI / 180; // downward slope
    var scale = Math.min(1, Math.max(0.45, H / 900));    // small hosts get slower, shorter meteors
    var speed = (520 + Math.random() * 520) * scale;     // px/s
    meteors.push({
      x: dir === 1 ? -40 + Math.random() * W * 0.35 : W * 0.65 + Math.random() * (W * 0.35 + 40),
      y: -20 + Math.random() * H * 0.38,
      vx: Math.cos(angle) * speed * dir,
      vy: Math.sin(angle) * speed,
      life: 0,
      ttl: 1.1 + Math.random() * 0.9,
      len: (90 + Math.random() * 130) * scale,
      hue: Math.random() < 0.3 ? '200,230,255' : '255,255,255'
    });
  }

  // ---- drawing ----------------------------------------------------------
  var t = 0;

  function drawFrame(dt) {
    t += dt;
    ctx.clearRect(0, 0, W, H);

    // stars
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var a = s.base + (reduceMotion ? 0.2 : Math.sin(t * s.speed + s.phase) * 0.5 + 0.5) * s.amp;
      if (a <= 0.02) continue;
      var x = s.fx * W, y = s.fy * H;
      ctx.globalAlpha = Math.min(1, a);
      ctx.fillStyle = 'rgb(' + s.c[0] + ',' + s.c[1] + ',' + s.c[2] + ')';
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, 6.2832);
      ctx.fill();
      if (s.glint && a > 0.55) {
        // 4-point diffraction glint on the bright ones
        ctx.globalAlpha = (a - 0.55) * 0.9;
        ctx.strokeStyle = 'rgba(' + s.c[0] + ',' + s.c[1] + ',' + s.c[2] + ',0.8)';
        ctx.lineWidth = 0.8;
        var g = s.r * 4.5;
        ctx.beginPath();
        ctx.moveTo(x - g, y); ctx.lineTo(x + g, y);
        ctx.moveTo(x, y - g); ctx.lineTo(x, y + g);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    if (reduceMotion) return;

    // meteors
    nextMeteorIn -= dt;
    if (nextMeteorIn <= 0 && meteors.length < 2) {
      spawnMeteor();
      nextMeteorIn = 3.5 + Math.random() * 6.5;
    }
    for (var m = meteors.length - 1; m >= 0; m--) {
      var mt = meteors[m];
      mt.life += dt;
      mt.x += mt.vx * dt;
      mt.y += mt.vy * dt;
      var p = mt.life / mt.ttl;
      if (p >= 1 || mt.y > H + 60 || mt.x < -220 || mt.x > W + 220) {
        meteors.splice(m, 1);
        continue;
      }
      // fade in fast, fade out at the end
      var fade = Math.min(1, p * 6) * Math.min(1, (1 - p) * 2.5);
      var nv = Math.hypot(mt.vx, mt.vy);
      var tx = mt.x - (mt.vx / nv) * mt.len;
      var ty = mt.y - (mt.vy / nv) * mt.len;
      var grad = ctx.createLinearGradient(mt.x, mt.y, tx, ty);
      grad.addColorStop(0, 'rgba(' + mt.hue + ',' + (0.95 * fade) + ')');
      grad.addColorStop(0.25, 'rgba(' + mt.hue + ',' + (0.45 * fade) + ')');
      grad.addColorStop(1, 'rgba(' + mt.hue + ',0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(mt.x, mt.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      // glowing head
      ctx.globalAlpha = fade;
      ctx.fillStyle = 'rgba(' + mt.hue + ',0.95)';
      ctx.beginPath();
      ctx.arc(mt.x, mt.y, 1.6, 0, 6.2832);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // ---- sizing / loop ----------------------------------------------------
  function resize() {
    var rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    W = Math.round(rect.width);
    H = Math.round(rect.height);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildStars();
    drawFrame(0);
  }

  var last = 0, rafId = 0;
  function loop(now) {
    rafId = requestAnimationFrame(loop);
    var dt = Math.min(0.05, (now - last) / 1000) || 0.016;
    last = now;
    drawFrame(dt);
  }
  function start() {
    if (rafId || reduceMotion) return;
    last = performance.now();
    rafId = requestAnimationFrame(loop);
  }
  function stop() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  resize();
  if (!document.hidden) start();

  // Debug/testing hook (headless previews never fire rAF — step manually).
  window.__spaceFx = {
    canvas: canvas,
    stars: stars,
    meteors: meteors,
    spawnMeteor: spawnMeteor,
    renderFrame: function (dtMs) { drawFrame((dtMs || 16.7) / 1000); },
    resize: resize
  };
})();
