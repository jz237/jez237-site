/** Conservative initial graphics for limited devices; the user can override it. */
export function preferLightweight({ memory, cores, saved } = {}) {
  if (saved === 'on' || saved === 'off') return saved === 'on';
  return memory > 0 && memory <= 4 || cores > 0 && cores <= 4;
}

/** Regional imagery stays visible while nearby, full-resolution patches arrive. */
export function districtAssets(pose, imagery) {
  if (!imagery || pose.dist > 45000) return [];
  const margin = pose.dist / 80000;
  const near = (west, south, east, north) => pose.lon >= west - margin && pose.lon <= east + margin
    && pose.lat >= south - margin && pose.lat <= north + margin;
  const ids = [];
  if (near(-75.235, 39.90, -75.095, 40.005)) ids.push('cityImagery');
  if (near(-74.9067, 40.1188, -74.8587, 40.1548)) ids.push('reefImagery');
  return ids;
}
