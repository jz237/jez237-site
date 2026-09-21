/** Group nearby same-kind markers in screen pixels, retaining every member. */
export function clusterPoints(points, radius = 48) {
  const groups = [], cells = new Map();
  for (const p of points.toSorted((a, b) => a.key.localeCompare(b.key))) {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
    const cx = Math.floor(p.x / radius), cy = Math.floor(p.y / radius);
    let group;
    if (p.type !== 'landmark') {
      for (let x = cx - 1; x <= cx + 1; x++) for (let y = cy - 1; y <= cy + 1; y++) {
        for (const candidate of cells.get(`${p.type}:${x}:${y}`) || []) {
          if (!group && Math.hypot(p.x - candidate.anchor.x, p.y - candidate.anchor.y) < radius) {
            group = candidate;
          }
        }
      }
    }
    if (!group) {
      group = { type: p.type, anchor: p, members: [], x: 0, y: 0 }; groups.push(group);
      const key = `${p.type}:${cx}:${cy}`, cell = cells.get(key) || [];
      cell.push(group); cells.set(key, cell);
    }
    group.members.push(p); group.x += p.x; group.y += p.y;
  }
  return groups.map(g => ({ ...g, x: g.x / g.members.length, y: g.y / g.members.length,
    key: g.members.map(p => p.key).join('|') }));
}
