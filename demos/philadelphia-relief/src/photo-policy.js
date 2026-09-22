// Separate thresholds prevent rapid renderer changes near the zoom boundary.
export const PHOTO_ENTER = 6500;
export const PHOTO_EXIT = 9500;
export const PHOTO_PRELOAD = 16000;

// Horizon views spread the first tile budget over a much larger visible area.
// Accept neighborhood geometry for that initial handoff; final SSE is unchanged.
export function photoTileReady(error, flightHeight, viewDistance = 0) {
  // Google tile errors are near powers of two, not necessarily exact powers.
  // Higher aircraft need a wider initial footprint than a street-level orbit.
  // Explicit Photo 3D also works at regional distances. Its initial coverage
  // must match that scale; the renderer still refines to SSE 2 afterwards.
  const threshold = Number.isFinite(flightHeight)
    ? Math.max(130, Math.min(2048, flightHeight / 8))
    : Math.max(65, Math.min(2048, Number.isFinite(viewDistance) ? viewDistance / 100 : 0));
  return Number.isFinite(error) && error <= threshold;
}

// A loaded planet-scale fallback is not a usable photographic close-up.
export function photoReady(detailTiles, visibleTiles, settled) {
  return detailTiles >= 8 || (settled && detailTiles >= 1 && detailTiles === visibleTiles);
}

export function photoAllowed(state) {
  return !state.lightweight && state.era === 'present' && state.compareMode === 'off'
    && state.layers.terrain && state.layers.imagery
    && !state.layers.flood && !state.layers.contours;
}

export function photoWanted(state, distance, wasWanted = false) {
  if (!photoAllowed(state) || state.photoMode === 'relief') return false;
  // This is a regional diorama: even an explicit photographic choice hands
  // back to the miniature when zoomed out. Shared close-ups still open in 3D.
  if (state.photoMode === 'photo') return distance <= (wasWanted ? PHOTO_PRELOAD * 1.2 : PHOTO_PRELOAD);
  return distance <= (wasWanted ? PHOTO_EXIT : PHOTO_ENTER);
}

// The relief rig measures pitch from vertical; Cesium measures from horizontal.
export function photoCamera(pose, aspect) {
  const vertical = pose.fov * Math.PI / 180;
  return {
    heading: pose.bearing * Math.PI / 180,
    pitch: (pose.pitch - 90) * Math.PI / 180,
    range: pose.dist,
    fov: aspect > 1 ? 2 * Math.atan(Math.tan(vertical / 2) * aspect) : vertical,
  };
}
