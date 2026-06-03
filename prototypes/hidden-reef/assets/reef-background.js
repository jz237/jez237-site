(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionScale = prefersReducedMotion ? 0.72 : 1;
  const canvas = document.querySelector('[data-reef-background]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let bubbles = [];
  let raf = 0;
  let last = performance.now();

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.65);
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isDesktop = width >= 900;
    const count = prefersReducedMotion
      ? (isDesktop ? 32 : 18)
      : Math.round(Math.min(isDesktop ? 118 : 86, Math.max(isDesktop ? 58 : 34, width / (isDesktop ? 14 : 18))));
    bubbles = Array.from({ length: count }, function(_, index) {
      const featured = isDesktop && index % 6 === 0;
      return {
        x: random(-40, width + 40),
        y: random(-height * 0.2, height * 1.15),
        radius: random(featured ? 3.6 : 1.5, featured ? 9.2 : 5.1),
        speed: random(isDesktop ? 12 : 10, isDesktop ? 42 : 34),
        wobble: random(12, isDesktop ? 58 : 44),
        phase: random(0, Math.PI * 2),
        alpha: random(isDesktop ? 0.18 : 0.14, isDesktop ? 0.5 : 0.42)
      };
    });
  }

  function drawCaustics(time) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const isDesktop = width >= 900;
    for (let band = 0; band < (isDesktop ? 12 : 9); band += 1) {
      const yBase = height * (0.12 + band * 0.105);
      const amp = (isDesktop ? 14 : 10) + band * 1.8;
      const drift = time * motionScale * (0.00028 + band * 0.000018);
      const gradient = ctx.createLinearGradient(0, yBase - 26, width, yBase + 38);
      gradient.addColorStop(0, 'rgba(64,217,255,0)');
      gradient.addColorStop(0.5, 'rgba(124,236,255,' + (isDesktop ? '0.12' : '0.08') + ')');
      gradient.addColorStop(1, 'rgba(64,217,255,0)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = (isDesktop ? 1.6 : 1.2) + (band % 3) * 0.5;
      ctx.beginPath();
      for (let x = -40; x <= width + 44; x += 28) {
        const y = yBase
          + Math.sin(x * 0.012 + drift * 3.1 + band) * amp
          + Math.sin(x * 0.027 - drift * 2.4) * (amp * 0.34);
        if (x === -40) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawLightRays(time) {
    if (width < 900) return;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let ray = 0; ray < 7; ray += 1) {
      const center = width * (0.08 + ray * 0.15) + Math.sin(time * motionScale * 0.00022 + ray) * 52;
      const top = -height * 0.05;
      const bottom = height * 1.08;
      const rayWidth = width * (0.08 + (ray % 3) * 0.025);
      const gradient = ctx.createLinearGradient(center, top, center + rayWidth, bottom);
      gradient.addColorStop(0, 'rgba(120,232,255,0.14)');
      gradient.addColorStop(0.48, 'rgba(64,217,255,0.045)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(center - rayWidth * 0.45, top);
      ctx.lineTo(center + rayWidth * 0.35, top);
      ctx.lineTo(center + rayWidth * 1.6, bottom);
      ctx.lineTo(center - rayWidth * 0.85, bottom);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBubble(bubble, time) {
    const x = bubble.x + Math.sin(time * motionScale * 0.0012 + bubble.phase) * bubble.wobble;
    const y = bubble.y;
    const glow = ctx.createRadialGradient(
      x - bubble.radius * 0.35,
      y - bubble.radius * 0.35,
      bubble.radius * 0.1,
      x,
      y,
      bubble.radius * 1.7
    );
    glow.addColorStop(0, 'rgba(255,255,255,' + Math.min(0.65, bubble.alpha + 0.2) + ')');
    glow.addColorStop(0.34, 'rgba(152,236,255,' + bubble.alpha + ')');
    glow.addColorStop(1, 'rgba(64,217,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, bubble.radius * 1.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(214,250,255,' + Math.min(0.48, bubble.alpha + 0.1) + ')';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(x, y, bubble.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  function draw(time) {
    const dt = Math.min(48, time - last);
    last = time;
    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, 'rgba(3,48,84,0.92)');
    bg.addColorStop(0.45, 'rgba(2,31,63,0.76)');
    bg.addColorStop(1, 'rgba(0,8,22,0.96)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const topLight = ctx.createRadialGradient(width * 0.5, -height * 0.12, 0, width * 0.5, -height * 0.12, Math.max(width, height) * 0.75);
    topLight.addColorStop(0, 'rgba(83,226,255,0.34)');
    topLight.addColorStop(0.42, 'rgba(0,167,183,0.12)');
    topLight.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topLight;
    ctx.fillRect(0, 0, width, height);

    drawLightRays(time);
    drawCaustics(time);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    bubbles.forEach(function(bubble) {
      drawBubble(bubble, time);
      bubble.y -= bubble.speed * motionScale * dt / 1000;
      bubble.phase += dt * motionScale * 0.00042;
      if (bubble.y < -24) {
        bubble.y = height + random(20, 90);
        bubble.x = random(-40, width + 40);
        bubble.radius = random(1.4, bubble.radius > 4.8 ? 6.2 : 4.2);
      }
    });
    ctx.restore();

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw(performance.now());
})();
