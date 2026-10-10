// Spine and tubercle placement for the agamid. Each entry is a seed point near
// the body, a preferred tilt and a size; the bake projects it onto the surface.
import { profile, limbs } from './anatomy.mjs';
import { hash3 } from './sdf.mjs';

const rand = (i, salt = 0) => hash3(i * 7 + 3, salt * 13 + 1, i ^ (salt * 31));

export function spikeSeeds() {
  const seeds = [];
  const push = (p, tilt, h, r, kind = 'spine') => seeds.push({ p, tilt, h, r, kind });
  for (const s of [1, -1]) {
    // Beard: rows of soft spines beneath the jaw and throat.
    let i = 0;
    for (let x = 9.15; x <= 10.9; x += 0.19, i++) {
      const pr = profile(x);
      const back = Math.min(1, Math.max(0, (10.9 - x) / 1.75));
      for (const [k, th] of [[0, 30], [1, 52], [2, 74]].map(([k, a]) => [k, (a * Math.PI) / 180])) {
        const jitter = (rand(i * 3 + k, s + 5) - 0.5) * 0.08;
        const y = pr.cy - pr.hb * Math.cos(th);
        const z = pr.w * Math.sin(th) * s;
        push([x + jitter, y, z], [-0.35, -0.55, 0.45 * s], 0.07 + 0.12 * back * (0.6 + 0.8 * rand(i, k + 11)), 0.045 + 0.02 * back);
      }
    }
    // Spines clustered around and behind the ear opening.
    const ear = [[10.2, 0.32], [9.95, 0.42], [9.65, 0.3], [9.45, 0.05], [9.6, -0.22], [9.95, -0.32], [10.25, -0.18], [9.25, 0.32]];
    ear.forEach(([x, dy], k) => {
      const pr = profile(x);
      push([x, pr.cy + dy, (pr.w + 0.05) * s], [-0.5, 0.15 * Math.sign(dy || 1), 0.8 * s], 0.24 + 0.12 * rand(k, 21 + s), 0.06);
    });
    // Occipital crown and supraocular scales.
    for (let k = 0; k < 4; k++) {
      const x = 9.8 + k * 0.04, z = (0.45 + k * 0.22) * s, pr = profile(x);
      push([x, pr.cy + pr.ht * 0.9, z], [-0.6, 0.7, 0.25 * s], 0.11 + 0.04 * rand(k, 31), 0.05);
    }
    for (let k = 0; k < 3; k++) {
      const x = 10.65 + k * 0.17, pr = profile(x);
      push([x, pr.cy + pr.ht * 0.92, (pr.w * 0.62) * s], [-0.3, 0.9, 0.35 * s], 0.07, 0.04);
    }
    // Lower jaw edge.
    for (let k = 0; k < 6; k++) {
      const x = 10.45 + k * 0.27, pr = profile(x);
      push([x, pr.cy - pr.hb * 0.55, pr.w * 0.85 * s], [-0.4, -0.45, 0.7 * s], 0.08 - k * 0.006, 0.035);
    }
    // Neck sides.
    for (let k = 0; k < 5; k++) {
      const x = 8.45 + k * 0.22, pr = profile(x);
      push([x, pr.cy - 0.05 + (k % 2) * 0.22, pr.w * s], [-0.5, 0.1, 0.85 * s], 0.15 + 0.06 * rand(k, 41 + s), 0.055);
    }
    // Flank fringe on the lateral fold (two rows, offset).
    i = 0;
    for (let x = 2.0; x <= 7.5; x += 0.3, i++) {
      const pr = profile(x);
      const mid = 1 - Math.abs(x - 4.7) / 3.2;
      push([x, pr.cy - 0.2, pr.w * s], [-0.45, -0.25, 0.85 * s], 0.15 + 0.11 * mid + 0.05 * rand(i, 51 + s), 0.05);
      if (x < 7.2) push([x + 0.15, pr.cy + 0.15, pr.w * 0.97 * s], [-0.5, 0.25, 0.8 * s], 0.08 + 0.05 * rand(i, 61 + s), 0.045);
    }
    // Paravertebral tubercle rows.
    for (const [row, off] of [[0, 0.42], [1, 1.05]]) {
      i = 0;
      for (let x = 0.6 + row * 0.2; x <= 8.4; x += 0.42, i++) {
        const pr = profile(x);
        const z = Math.min(off, pr.w * 0.62) * s;
        push([x, pr.cy + pr.ht, z], [-0.55, 0.85, 0.12 * s], 0.075 + 0.05 * rand(i, 71 + row + s), 0.05 + 0.01 * row);
      }
    }
    // Tail-base lateral spines.
    i = 0;
    for (let x = -0.4; x >= -5.4; x -= 0.42, i++) {
      const pr = profile(x);
      const f = 1 + x / 6.5;
      push([x, pr.cy, pr.w * s], [-0.6, 0.1, 0.75 * s], 0.05 + 0.07 * f, 0.03 + 0.015 * f);
    }
  }
  // Scattered dorsal tubercles.
  for (let k = 0; k < 90; k++) {
    const x = 0.2 + rand(k, 91) * 8.0;
    const pr = profile(x);
    const z = (rand(k, 92) * 2 - 1) * pr.w * 0.85;
    push([x, pr.cy + pr.ht, z], [-0.4, 1, 0.3 * Math.sign(z)], 0.04 + 0.04 * rand(k, 93), 0.035, 'tubercle');
  }
  // Tubercles on the thighs and upper arms.
  limbs.forEach((l, li) => {
    for (let k = 0; k < 7; k++) {
      const t = 0.2 + 0.6 * rand(k, 101 + li);
      const p = [l.root[0] + (l.mid[0] - l.root[0]) * t, l.root[1] + (l.mid[1] - l.root[1]) * t + 0.35, l.root[2] + (l.mid[2] - l.root[2]) * t];
      push(p, [-0.4, 1, 0.3 * l.side], 0.05 + 0.04 * rand(k, 111 + li), 0.035, 'tubercle');
    }
  });
  return seeds;
}
