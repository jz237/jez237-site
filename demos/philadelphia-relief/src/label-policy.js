/** Keep geographic labels legible without covering the map's controls. */
export function labelBudget(width, height, density) {
  const capacity = Math.min(64, Math.max(12, width * height / 28000));
  return Math.round(4 + Math.max(0, Math.min(1, density)) * (capacity - 4));
}

export function nearbyLabel(item, pose, projection) {
  if (item.kind !== 'street' && item.kind !== 'address') return true;
  const dx = (item.lon - pose.lon) * projection.metersPerDegLon;
  const dz = (item.lat - pose.lat) * projection.metersPerDegLat;
  return Math.hypot(dx, dz) < Math.max(180, pose.dist * .65);
}

export function overlapsBox(a, b, padding = 0) {
  return !(a.r + padding < b.l || a.l - padding > b.r
    || a.b + padding < b.t || a.t - padding > b.b);
}

export function controlBoxes(root = document) {
  const selectors = '.topbar,.explore-nav,.readout-preset,.readout,.orientation'
    + ',#mobileBar,.caption,.map-navigation,.panel:not(.collapsed)';
  return [...root.querySelectorAll(selectors)].filter(el => {
    const style = getComputedStyle(el);
    return !el.hidden && style.display !== 'none' && style.visibility !== 'hidden';
  }).map(el => {
    const r = el.getBoundingClientRect();
    return {l:r.left, r:r.right, t:r.top, b:r.bottom};
  }).filter(r => r.r > r.l && r.b > r.t);
}

export function labelPriority(item) {
  return (item.kind==='landmark' ? -10 : item.kind==='place' ? 0 : 10) + (item.rank || 0);
}
