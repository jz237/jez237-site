// Pond-only camera tour: every composition targets water or koi in the open basin.
// Camera motion follows the living fish without steering their simulation.
export function makePondTour({THREE, getFish, sdf, depth, getObstacles = () => [], waterY = 0}) {
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const mix = (a, b, u) => a.clone().lerp(b, u);
  const center = V(0, waterY - .35, 1.2);
  let cursor = 0;

  // Keep submerged cameras away from the bank and above the actual gravel floor.
  // The line toward the open basin also keeps tracking shots clear of the bridge.
  function inBasin(p) {
    p.x = Math.max(-2.8, Math.min(2.8, p.x));
    p.z = Math.max(-2.2, Math.min(4.9, p.z));
    for (let pass = 0; pass < 3; pass++) {
      const origin = p.clone();
      for (let i = 1; sdf(p.x, p.z) > -.5 && i <= 20; i++) {
        p.x = origin.x * (1 - i / 20);
        p.z = origin.z + (1.2 - origin.z) * i / 20;
      }
      if (p.y < waterY + .65) for (const o of getObstacles()) {
        let dx = p.x - o.x, dz = p.z - o.z, distance = Math.hypot(dx, dz);
        const radius = o.r + .22;
        if (distance < radius) {
          if (distance < .001) { dx = -1; dz = 0; distance = 1; }
          p.x = o.x + dx / distance * radius;
          p.z = o.z + dz / distance * radius;
        }
      }
    }
    return p;
  }
  function submerged(p) {
    inBasin(p);
    const floor = waterY - depth(p.x, p.z, -sdf(p.x, p.z));
    p.y = Math.max(floor + .18, Math.min(waterY - .18, p.y));
    return p;
  }
  const fixed = (cap, T, from, to, lookFrom, lookTo = lookFrom, under = false) => ({
    cap, T, under,
    frame(u) {
      const pos = mix(V(...from), V(...to), u);
      return {pos: under ? submerged(pos) : pos.y < waterY + .65 ? inBasin(pos) : pos, look: mix(V(...lookFrom), V(...lookTo), u)};
    }
  });
  const eligible = f => sdf(f.p.x, f.p.z) < -.75 && f.p.z > -2.6;
  function chooseFish(previous) {
    const all = getFish(), open = all.filter(eligible), choices = open.length ? open : all;
    if (!choices.length) return null;
    let f = choices[cursor++ % choices.length];
    if (f === previous && choices.length > 1) f = choices[cursor++ % choices.length];
    return f;
  }
  function tracking(cap, T, mode, angle, arc = .35) {
    const under = mode === 'side' || mode === 'follow';
    let fish, subject = center.clone(), heading = 0, first = true;
    return {
      cap, T, under, skip: () => !getFish().length,
      start() {
        fish = chooseFish(fish); first = true;
        if (fish) { subject.copy(fish.p); heading = fish.heading; }
      },
      frame(u, dt = 1 / 60) {
        if (!fish || !getFish().includes(fish) || !eligible(fish)) fish = chooseFish(fish);
        if (fish) {
          const k = first ? 1 : 1 - Math.exp(-Math.min(.1, dt) * 3);
          subject.lerp(fish.p, k);
          heading += Math.atan2(Math.sin(fish.heading - heading), Math.cos(fish.heading - heading)) * k * .45;
        }
        first = false;
        const a = heading + angle + arc * (u - .5), size = fish?.size || .65;
        const radius = mode === 'overhead' ? .55 : Math.max(1.1, size * 2.1);
        const pos = V(subject.x + Math.cos(a) * radius, 0, subject.z - Math.sin(a) * radius);
        pos.y = mode === 'overhead' ? waterY + 2.8 - .4 * u
          : mode === 'portrait' ? waterY + .8 - .12 * u
          : subject.y + (mode === 'follow' ? .16 : .06);
        if (under) submerged(pos); else inBasin(pos);
        const look = subject.clone();
        if (mode === 'follow') look.add(V(Math.cos(heading) * size * .35, 0, -Math.sin(heading) * size * .35));
        return {pos, look};
      }
    };
  }

  return [
    fixed('Across the koi pond', 12, [2.6, 5.4, 6], [-1.4, 4.8, 5.7], [0, -.35, 1.4]),
    tracking('Koi from above', 12, 'overhead', 1.7, .7),
    fixed('At the water’s edge', 10, [2.7, .55, 3.7], [1.8, .45, 1.6], [-.3, -.32, 1.3], [-.45, -.4, .3]),
    tracking('A closer look at the koi', 12, 'portrait', 2.3, .55),
    fixed('The pond from the opposite bank', 11, [-2.5, 2.4, 0], [-1.4, 2.7, -1.6], [.3, -.35, 2.5]),
    fixed('Beneath the surface', 12, [1.2, -.48, 3.2], [-.8, -.65, 1.5], [-.4, -.5, 1.2], [.5, -.6, .2], true),
    tracking('Swimming alongside the koi', 14, 'side', Math.PI / 2, .3),
    fixed('Water lilies and passing koi', 10, [.35, 1.9, 3.7], [-.1, 1.5, 2.6], [-1.5, -.12, 1.6]),
    tracking('Following the koi underwater', 14, 'follow', Math.PI, .25),
    fixed('Patterns beneath the ripples', 12, [-.9, 4.6, 2.5], [1.1, 4.1, 2], [0, -.4, 1.3]),
    fixed('A quiet pond perspective', 12, [1.4, 2.3, 4.5], [2.3, 3.8, 5.3], [-.2, -.3, 1])
  ];
}
