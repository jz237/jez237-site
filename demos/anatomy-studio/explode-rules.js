/**
 * Whole-body explosion vectors. A piece carries two vectors: `offset` (anatomical separation, applied linearly with the slider)
 * and `spread` (a golden-angle fan applied over the last 45 % of the slider to de-clump small pieces).
 * Frame: metres, y up, +z anterior, +x subject's left. `env` is manifest.envelope.
 */
const PIVOT = 0.9;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const add = (...v) => v.reduce((a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], [0, 0, 0]);
const mul = (v, s) => [v[0] * s, v[1] * s, v[2] * s];

function frame(p, env) {
  const [cx, cy, cz] = p.center, limb = p.region === 'upper limb' ? 'arm' : p.region === 'lower limb' ? 'leg' : null;
  const axis = limb && env.limbAxis[limb][p.side] ? env.limbAxis[limb][p.side] : [0, 0];
  const dx = cx - axis[0], dz = cz - axis[1], d = Math.hypot(dx, dz);
  const lateral = [p.side === 'L' ? 1 : p.side === 'R' ? -1 : cx > 0.004 ? 1 : cx < -0.004 ? -1 : 0, 0, 0];
  const rhat = d > 0.012 ? [dx / d, 0, dz / d] : [lateral[0] * 0.7, 0, 0.7];
  const band = clamp(Math.floor(cy / env.band), 0, env.trunk.length - 1);
  const extent = limb ? (env[limb][p.side] || env.trunk)[band] : env.trunk[band];
  const depth = clamp(d / Math.max(extent, 0.04), 0, 1);
  const stretch = (cy - PIVOT) * 0.22;
  return {cx, cy, cz, lateral, rhat, depth, stretch, limb};
}

export function bodyOffset(p, env) {
  const f = frame(p, env), {cx, cy, cz, lateral, rhat, depth, stretch, limb} = f;
  const name = p.name, path = p.path || '';
  switch (p.file) {
    case 'skeletal':
    case 'joints': {
      const base = [cx * 0.08, (cy - PIVOT) * 0.06, cz * 0.08 - 0.04];
      return limb ? add(base, mul(lateral, limb === 'arm' ? 0.10 : 0.04)) : base;
    }
    case 'muscular': {
      const soft = /^(Fasciae|Bursae|Tendon sheaths|Synovial bursae|Thoracolumbar fascia|Cervical fasciae|Endo-abdominal)/.test(name) || /fascia|bursa|sheath|retinacul|aponeurosis|Iliotibial/i.test(name);
      if (limb) return add(mul(rhat, (soft ? 0.55 : 0.22) + 0.45 * depth), mul(lateral, limb === 'arm' ? 0.42 : 0.16), [0, stretch * 0.6, 0]);
      return add(mul(rhat, soft ? 1.35 : 0.42 + 0.85 * depth), [0, stretch, 0]);
    }
    case 'visceral': {
      if (p.region === 'head' || p.region === 'neck') return [cx * 0.5 + lateral[0] * 0.08, 0.15 + stretch, 0.55];
      if (p.region === 'thorax') return [cx * 0.6, stretch - 0.05, 0.70 + 0.30 * depth];
      if (p.region === 'abdomen') return [cx * 0.7, stretch - 0.15, 0.60 + 0.30 * depth];
      return [cx * 0.7, stretch - 0.20, 0.50];
    }
    case 'heart': return [0.05, stretch - 0.05, 0.92];
    case 'female': return /Mammary/.test(name) ? [cx * 0.8, stretch, 0.62] : [cx * 0.7, stretch - 0.2, 0.52];
    case 'brain': {
      if (/^(Falx cerebri|Tentorium cerebelli)$/.test(name)) return [0, 0.78, 0.10];
      if (name === 'Spinal dura') return [0, stretch, -0.30];
      if (/Eye|eyeball|Cornea|Iris|Lens|Retina|Sclera|Vitreous|Zonular|Lacrimal/i.test(name + path)) return [cx * 1.6, 0.30, 0.45];
      if (/Ear|Cochlea|Vestibule/.test(name + path)) return add(mul(lateral, 0.5), [0, 0.35, 0]);
      return [cx * 0.3, 0.55, 0.15];
    }
    case 'nerves': {
      if (/spinal cord|Central canal/.test(name)) return [0, stretch, -0.30];
      if (/Cranial nerves/.test(path) || /\((I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\)/.test(name)) return [cx * 0.4, 0.45, 0.05];
      if (limb) return add(mul(lateral, 0.9), mul(rhat, 0.2), [0, stretch * 0.6, -0.05]);
      return add(mul(lateral, 1.0), [0, stretch, -0.35]);
    }
    case 'vessels': {
      const artery = /arter|Aorta|aorta|trunk/i.test(name) || /Arterial system/.test(path);
      if (limb) return add(mul(lateral, artery ? 0.7 : 0.85), mul(rhat, 0.15), [0, stretch * 0.6, artery ? 0.1 : -0.1]);
      return artery ? add(mul(lateral, 0.75), [cx * 0.3, stretch, 0.35]) : add(mul(lateral, 0.9), [cx * 0.3, stretch, -0.15]);
    }
    case 'lymphoid': return limb ? add(mul(lateral, 0.6), [0, stretch * 0.6, 0.2]) : add(mul(lateral, 0.6), [0, stretch, 0.50]);
    case 'regions': {
      const v = add(mul(rhat, limb ? 0.9 : 1.6), [0, (cy - PIVOT) * 0.35, 0]);
      if (limb) v[0] += lateral[0] * 0.45;
      return p.region === 'head' ? add(v, [0, 0.25, 0]) : v;
    }
  }
  return [cx * 0.5, stretch, cz * 0.5 + 0.2];
}

export function bodySpread(p, index, inAssembly) {
  if (inAssembly || p.file === 'skeletal' || p.file === 'joints') return [0, 0, 0];
  const a = index * 2.3999632297, k = (p.region === 'upper limb' || p.region === 'lower limb') ? 0.5 : 1;
  return [Math.cos(a) * 0.28 * k, ((index % 17) / 16 - 0.5) * 0.45 * k, Math.sin(a) * 0.28 * k];
}

export const explodeSchedule = {spreadStart: 0.55, spreadEnd: 1};
