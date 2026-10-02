// Quality tiers and URL flags. Every adaptive decision in the page reads from Q.
const P = new URLSearchParams(location.search);
const coarse = matchMedia('(pointer: coarse)').matches;
const small = Math.min(screen.width, screen.height) < 700;
const mobile = coarse && small;
const tierName = P.get('q') || (mobile ? 'medium' : 'high');

export const TIERS = {
  high:   { tier: 'high',   seg: 1.0,  tess: 1.0, fur: 1.0,  shadow: 4096, msaa: 4, ao: true,  bloom: true,  dpr: 2.0, accum: 32 },
  medium: { tier: 'medium', seg: 0.75, tess: 0.8, fur: 0.55, shadow: 2048, msaa: 4, ao: true,  bloom: true,  dpr: 1.5, accum: 16 },
  low:    { tier: 'low',    seg: 0.55, tess: 0.6, fur: 0.3,  shadow: 1024, msaa: 2, ao: false, bloom: false, dpr: 1.0, accum: 0 },
};

export const Q = { ...(TIERS[tierName] || TIERS.high), mobile, params: P };
if (P.has('dpr')) Q.dpr = Math.max(0.5, Math.min(3, parseFloat(P.get('dpr')) || Q.dpr));
if (P.has('ao')) Q.ao = P.get('ao') !== '0';
if (P.has('bloom')) Q.bloom = P.get('bloom') !== '0';
if (P.has('acc')) Q.accum = Math.max(0, Math.min(256, parseInt(P.get('acc'), 10) || 0));
if (P.has('fur')) Q.fur = Math.max(0, parseFloat(P.get('fur')) || 0);
