// Abdomen canvas textures: one ink atlas (bee logo, tagline, hazard bars, labels, wear marks) behind a single decal
// material, and one emissive strip for the cyan data displays. Everything is drawn at load time.
import { THREE, T, decal } from '../kit.js';

const W = 2048, H = 1024;
// name -> [x, y, w, h] in canvas pixels
const RECTS = {
  logo: [0, 0, 512, 512],
  tag: [512, 0, 1024, 192],
  apx: [512, 192, 1024, 320],
  hazard: [0, 512, 1024, 256],
  nth: [1024, 512, 512, 256],
  label: [1536, 512, 512, 256],
  belt: [0, 768, 1024, 128],
  serial: [1024, 768, 512, 128],
  wear: [1536, 0, 512, 512],
  arrows: [0, 896, 512, 128],
  stripe: [512, 896, 512, 128],
};

let cache = null;

function drawAtlas(ctx) {
  const clip = (name, fn) => {
    const [x, y, w, h] = RECTS[name];
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.translate(x, y);
    fn(w, h);
    ctx.restore();
  };
  const font = (weight, size, family = T.FONT, track = 0) => {
    ctx.font = `${weight} ${size}px ${family}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${track}px`;
  };
  const INK = '#0e0e11';
  clip('logo', (w, h) => T.drawBee(ctx, w / 2, h / 2, h * 0.92, INK));
  clip('tag', (w, h) => {
    ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    font(800, 72, T.FONT, 6);
    ctx.fillText('POLLINATE A', w / 2, 76);
    ctx.fillText('TOMORROW BRIGHTER', w / 2, 160);
  });
  clip('apx', (w, h) => {
    ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    font(900, 190, T.FONT, 10);
    ctx.fillText('APX-9', w / 2, 190);
    font(700, 50, T.FONT, 4);
    ctx.fillText('AUTONOMOUS POLLINATION UNIT', w / 2, 262);
    ctx.fillRect(w * 0.08, 292, w * 0.84, 5);
  });
  clip('hazard', (w, h) => {
    ctx.fillStyle = INK;
    const bar = 96, pitch = 192;
    for (let x = -h; x < w + h; x += pitch) {
      ctx.beginPath();
      ctx.moveTo(x, h); ctx.lineTo(x + bar, h); ctx.lineTo(x + bar + h, 0); ctx.lineTo(x + h, 0);
      ctx.closePath(); ctx.fill();
    }
  });
  clip('nth', (w, h) => {
    ctx.fillStyle = '#e9b53a'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    font(800, 62, T.MONO, 6);
    ctx.fillText('NATURE', 24, 84);
    ctx.fillText('TECHNOLOGY', 24, 164);
    ctx.fillText('HARMONY', 24, 244);
  });
  clip('label', (w, h) => {
    ctx.fillStyle = '#e9b53a'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    font(800, 54, T.MONO, 4);
    ctx.fillText('APX-9 // PAYLOAD', 24, 74);
    font(700, 42, T.MONO, 3);
    ctx.fillText('POLLEN-BAY  0.48 g', 24, 136);
    ctx.fillText('SN 0097-A  REV C', 24, 188);
    ctx.fillStyle = '#e9b53a';
    for (let i = 0; i < 18; i++) ctx.fillRect(24 + i * 18 + (i % 3) * 2, 212, 6 + (i % 4) * 2, 30);
  });
  clip('belt', (w, h) => {
    ctx.fillStyle = '#e8e6df'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    font(800, 86, T.MONO, 8);
    ctx.fillText('TT   A-09   0412', 20, 98);
  });
  clip('serial', (w, h) => {
    ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    font(700, 62, T.MONO, 4);
    ctx.fillText('SN-0097  ▲ F-7', 16, 90);
  });
  clip('arrows', (w, h) => {
    ctx.fillStyle = INK;
    for (let i = 0; i < 6; i++) {
      const x = 30 + i * 80;
      ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x + 56, 64); ctx.lineTo(x, 108); ctx.lineTo(x + 18, 64); ctx.closePath(); ctx.fill();
    }
  });
  clip('stripe', (w, h) => {
    ctx.fillStyle = INK;
    ctx.fillRect(0, 36, w, 10); ctx.fillRect(0, 62, w, 4); ctx.fillRect(0, 82, w, 10);
  });
  // wear: soft light scratches and darker scuffs on transparent (very low alpha so the paint shows through)
  clip('wear', (w, h) => {
    let s = 12345;
    const rnd = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
    ctx.lineCap = 'round';
    for (let i = 0; i < 70; i++) {
      const x = rnd() * w, y = rnd() * h, a = rnd() * Math.PI, l = 14 + rnd() * 70;
      ctx.strokeStyle = rnd() < 0.55 ? 'rgba(255,238,190,0.30)' : 'rgba(40,24,6,0.26)';
      ctx.lineWidth = 0.8 + rnd() * 1.8;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l * 0.35); ctx.stroke();
    }
    for (let i = 0; i < 26; i++) {
      const x = rnd() * w, y = rnd() * h, r = 8 + rnd() * 34;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(60,36,8,0.20)'); g.addColorStop(1, 'rgba(60,36,8,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
  });
}

function drawGlow(ctx, w, h) {
  // vertical strip text (reads bottom to top), cyan on transparent
  ctx.save();
  ctx.translate(0, h);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#7ef0ff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.font = `700 ${Math.round(w * 0.36)}px ${T.MONO}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
  const msg = 'APX-9 // LINK 0412 // THERM 31.4C // PAYLOAD 87% // VENT NOM // HYDR 3.2 BAR // TT-A09 // ';
  ctx.fillText(msg + msg, 10, w * 0.30);
  ctx.font = `600 ${Math.round(w * 0.22)}px ${T.MONO}`;
  ctx.fillStyle = '#39b6d0';
  ctx.fillText('0101 1100 0110 1001 1110 0010 0111 0001 1010 0101 1100 0110 1001 1110', 10, w * 0.68);
  ctx.fillRect(0, w * 0.88, h, 2);
  ctx.restore();
}

export function atlas() {
  if (cache) return cache;
  const tex = T.canvasTex(W, H, drawAtlas, { repeat: false, aniso: 8 });
  const glowTex = T.canvasTex(128, 2560, drawGlow, { repeat: false, aniso: 8 });
  const ink = decal(tex, { roughness: 0.42 });
  ink.name = 'abdomen ink decals';
  const glow = decal(glowTex, { color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 1.9, roughness: 0.3 });
  glow.name = 'abdomen display text';
  const uv = (n) => { const [x, y, w, h] = RECTS[n]; return [x / W, 1 - (y + h) / H, (x + w) / W, 1 - y / H]; };
  const aspect = (n) => RECTS[n][2] / RECTS[n][3];
  cache = { ink, glow, uv, aspect, tex, glowTex };
  return cache;
}

void THREE;
