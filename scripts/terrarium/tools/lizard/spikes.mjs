// Spine and tubercle placement for Pogona vitticeps. Each entry is a seed point
// near the body, a preferred tilt and a size; the bake projects it onto the
// surface. The beard, the ear and nape clusters and the lateral fringe are the
// bearded dragon's signature; the back carries rows of keeled tubercles.
import { profile, limbs } from './anatomy.mjs';
import { hash3 } from './sdf.mjs';

const rand = (i, salt = 0) => hash3(i * 7 + 3, salt * 13 + 1, i ^ (salt * 31));

export function spikeSeeds() {
  const seeds = [];
  const push = (p, tilt, h, r, kind = 'spine') => seeds.push({ p, tilt, h, r, kind });
  for (const s of [1, -1]) {
    // Beard: transverse rows of spines across the throat and along the jaw.
    let i = 0;
    for (let x = 8.9; x <= 10.75; x += 0.16, i++) {
      const pr = profile(x);
      const back = Math.min(1, Math.max(0, (10.75 - x) / 1.85));
      for (const [k, deg] of [[0, 18], [1, 36], [2, 54], [3, 72], [4, 88]]) {
        const th = (deg * Math.PI) / 180;
        if (k === 0 && rand(i, 3 + s) < 0.4) continue;
        const jitter = (rand(i * 5 + k, s + 5) - 0.5) * 0.09;
        const y = pr.cy - pr.hb * Math.cos(th) * 0.98;
        const z = pr.w * Math.sin(th) * s;
        const big = k >= 3 ? 1.35 : 1;
        push([x + jitter, y, z], [-0.3, -0.55 - 0.1 * (k < 2), (0.3 + 0.12 * k) * s], (0.16 + 0.34 * back * (0.6 + 0.8 * rand(i, k + 11))) * big, 0.05 + 0.035 * back);
      }
      // the beard's outer edge along the jaw: the longest, pointing out and down
      if (x < 10.5) {
        const pr2 = profile(x + 0.08);
        push([x + 0.08, pr2.cy - pr2.hb * 0.42, pr2.w * 0.99 * s], [-0.35, -0.5, 0.85 * s], 0.3 + 0.32 * back * (0.7 + 0.6 * rand(i, 13 + s)), 0.06 + 0.035 * back);
      }
    }
    // The great spines behind the ear, fanning back and out.
    for (let k = 0; k < 5; k++) {
      const x = 9.48 + k * 0.07, pr = profile(x);
      const dy = 0.42 - k * 0.2;
      push([x, pr.cy + dy, (pr.w + 0.02) * s], [-0.75, 0.2 + dy * 0.6, 0.75 * s], 0.5 + 0.2 * rand(k, 19 + s) + (k === 1 || k === 2 ? 0.12 : 0), 0.072);
    }
    // The spiny jowl: a dense cluster around and below the ear.
    for (let k = 0; k < 14; k++) {
      const a = (k / 14) * Math.PI * 2;
      const x = 9.9 + Math.cos(a) * 0.42 + (rand(k, 17 + s) - 0.5) * 0.12;
      const pr = profile(x);
      const dy = Math.sin(a) * 0.38 - 0.12;
      push([x, pr.cy + dy, (pr.w + 0.04) * s], [-0.45, 0.25 * Math.sign(dy || 1), 0.85 * s], 0.32 + 0.22 * rand(k, 21 + s), 0.085);
    }
    for (let k = 0; k < 8; k++) {
      const x = 9.2 + k * 0.17, pr = profile(x);
      push([x, pr.cy - pr.hb * 0.25 - (k % 2) * 0.18, pr.w * s], [-0.5, -0.15, 0.85 * s], 0.28 + 0.2 * rand(k, 23 + s), 0.08);
    }
    // Occipital crown: a row of spines across the back of the head.
    for (let k = 0; k < 6; k++) {
      const x = 9.62 + k * 0.03, z = (0.25 + k * 0.29) * s, pr = profile(x);
      push([x, pr.cy + pr.ht * (0.95 - k * 0.05), z], [-0.65, 0.7, 0.3 * s], 0.22 + 0.1 * rand(k, 31) + k * 0.02, 0.065);
    }
    // Supraocular and temporal scales above the eye.
    for (let k = 0; k < 4; k++) {
      const x = 10.55 + k * 0.18, pr = profile(x);
      push([x, pr.cy + pr.ht * 0.9, (pr.w * 0.66) * s], [-0.3, 0.9, 0.35 * s], 0.08 + 0.03 * rand(k, 33), 0.045);
    }
    // Lower jaw edge and lip.
    for (let k = 0; k < 7; k++) {
      const x = 10.15 + k * 0.24, pr = profile(x);
      push([x, pr.cy - pr.hb * 0.8, pr.w * 0.72 * s], [-0.4, -0.7, 0.55 * s], 0.11 - k * 0.009, 0.04);
    }
    // Neck sides: clusters of tall spines.
    for (let k = 0; k < 9; k++) {
      const x = 8.1 + k * 0.17, pr = profile(x);
      push([x, pr.cy - 0.15 + (k % 3) * 0.26, pr.w * 0.98 * s], [-0.5, 0.15, 0.85 * s], 0.28 + 0.18 * rand(k, 41 + s), 0.07);
    }
    // Lateral fringe on the fold: three offset rows, longest mid-body.
    i = 0;
    for (let x = 1.4; x <= 7.7; x += 0.24, i++) {
      const pr = profile(x);
      const mid = Math.max(0, 1 - Math.abs(x - 4.6) / 3.4);
      push([x, pr.cy - 0.22, pr.w * s], [-0.4, -0.2, 0.9 * s], 0.2 + 0.2 * mid + 0.07 * rand(i, 51 + s), 0.06);
      if (i % 2 === 0) push([x + 0.12, pr.cy + 0.08, pr.w * 0.98 * s], [-0.5, 0.2, 0.85 * s], 0.11 + 0.08 * mid + 0.05 * rand(i, 61 + s), 0.05);
      if (i % 3 === 1) push([x - 0.08, pr.cy - 0.42, pr.w * 0.95 * s], [-0.4, -0.5, 0.75 * s], 0.08 + 0.05 * mid, 0.045);
    }
    // Paravertebral rows of keeled, spiny tubercles.
    for (const [row, off, size] of [[0, 0.45, 1.0], [1, 1.15, 1.1], [2, 1.95, 0.85]]) {
      i = 0;
      for (let x = 0.4 + row * 0.15; x <= 8.4; x += 0.36, i++) {
        const pr = profile(x);
        const z = Math.min(off, pr.w * 0.72) * s;
        const yy = pr.cy + pr.ht * Math.sqrt(Math.max(0, 1 - (Math.abs(z) / pr.w) ** 2.6));
        push([x, yy, z], [-0.55, 0.85, (0.12 + row * 0.2) * s], (0.1 + 0.08 * rand(i, 71 + row + s)) * size, 0.055 + 0.012 * row);
      }
    }
    // Tail: rows of small spines along the sides, shrinking toward the tip.
    i = 0;
    for (let x = -0.3; x >= -11.5; x -= 0.38, i++) {
      const pr = profile(x);
      const f = Math.max(0.15, 1 + x / 12);
      push([x, pr.cy + 0.05, pr.w * s], [-0.65, 0.1, 0.7 * s], 0.05 + 0.1 * f, 0.025 + 0.02 * f);
      if (i % 2 === 0 && x > -7) push([x - 0.19, pr.cy + pr.ht * 0.75, pr.w * 0.55 * s], [-0.6, 0.75, 0.25 * s], 0.04 + 0.06 * f, 0.025 + 0.012 * f, 'tubercle');
    }
  }
  // Scattered dorsal tubercles across the broad back.
  for (let k = 0; k < 170; k++) {
    const x = 0.0 + rand(k, 91) * 8.4;
    const pr = profile(x);
    const z = (rand(k, 92) * 2 - 1) * pr.w * 0.9;
    const yy = pr.cy + pr.ht * Math.sqrt(Math.max(0, 1 - (Math.abs(z) / pr.w) ** 2.6));
    push([x, yy, z], [-0.4, 1, 0.3 * Math.sign(z)], 0.045 + 0.05 * rand(k, 93), 0.04, 'tubercle');
  }
  // Dense small conical scales: the bumpy, gritty outline of a real Pogona
  // across the back, the flanks, the neck and the sides of the head.
  for (let k = 0; k < 360; k++) {
    const x = 0.2 + rand(k, 121) * 8.4;
    const pr = profile(x);
    const z = (rand(k, 122) * 2 - 1) * pr.w * 0.95;
    const yy = pr.cy + pr.ht * Math.sqrt(Math.max(0, 1 - (Math.abs(z) / pr.w) ** 2.6));
    push([x, yy, z], [-0.45, 1, 0.35 * Math.sign(z)], 0.028 + 0.035 * rand(k, 123), 0.026 + 0.012 * rand(k, 124), 'tubercle');
  }
  for (const s of [1, -1]) {
    for (let k = 0; k < 110; k++) {
      const x = 0.6 + rand(k, 131 + s) * 7.4;
      const pr = profile(x);
      const dy = (rand(k, 133 + s) - 0.35) * pr.ht * 1.1;
      push([x, pr.cy + dy, pr.w * 0.98 * s], [-0.45, 0.2, 0.9 * s], 0.035 + 0.045 * rand(k, 135 + s), 0.028, rand(k, 137 + s) < 0.3 ? 'spine' : 'tubercle');
    }
    for (let k = 0; k < 40; k++) {
      // neck and nape
      const x = 8.0 + rand(k, 141 + s) * 1.4;
      const pr = profile(x);
      const a = (rand(k, 143 + s) - 0.2) * 1.3;
      push([x, pr.cy + Math.sin(a) * pr.ht, Math.cos(a) * pr.w * s], [-0.5, 0.5, 0.7 * s], 0.035 + 0.05 * rand(k, 145 + s), 0.03, 'tubercle');
    }
    for (let k = 0; k < 36; k++) {
      // the temples and cheeks behind the eye: small pointed scales
      const x = 9.7 + rand(k, 151 + s) * 1.0;
      const pr = profile(x);
      const dy = (rand(k, 153 + s) - 0.4) * pr.ht * 0.9;
      push([x, pr.cy + dy, pr.w * s], [-0.4, 0.2, 0.9 * s], 0.03 + 0.035 * rand(k, 155 + s), 0.025, 'tubercle');
    }
  }
  // Tubercles on the thighs and upper arms: their spiny look.
  limbs.forEach((l, li) => {
    for (let k = 0; k < 34; k++) {
      const t = 0.12 + 0.76 * rand(k, 101 + li);
      const p = [l.root[0] + (l.mid[0] - l.root[0]) * t, l.root[1] + (l.mid[1] - l.root[1]) * t + 0.45, l.root[2] + (l.mid[2] - l.root[2]) * t];
      push(p, [-0.4, 1, 0.3 * l.side], 0.07 + 0.06 * rand(k, 111 + li), 0.04, k % 3 === 0 ? 'spine' : 'tubercle');
    }
  });
  return seeds;
}
