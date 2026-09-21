/** Reproject moving views promptly; idle observations only need an age refresh. */
export function createUpdateGate(interval = 33, maxAge = 1000) {
  let previous, last = -Infinity, dirty = true;
  return {
    invalidate() { dirty = true; },
    take(key, now) {
      if (!dirty && (now - last < interval || key === previous && now - last < maxAge)) return false;
      previous = key; last = now; dirty = false;
      return true;
    },
  };
}

/** Retained flight samples share elevation reads; discarded samples are collectable. */
export function createElevationCache(sampleElevation) {
  const cache = new WeakMap();
  return sample => {
    const entry = cache.get(sample);
    if (entry && entry.lon === sample.lon && entry.lat === sample.lat) return entry.height;
    const height = sampleElevation(sample.lon, sample.lat);
    cache.set(sample, { lon: sample.lon, lat: sample.lat, height });
    return height;
  };
}
