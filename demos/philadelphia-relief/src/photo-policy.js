// Separate thresholds prevent rapid renderer changes near the zoom boundary.
export const PHOTO_ENTER = 6500;
export const PHOTO_EXIT = 9500;
export const PHOTO_PRELOAD = 16000;

export function photoAllowed(state) {
  return state.era === 'present' && state.compareMode === 'off'
    && state.layers.terrain && state.layers.imagery
    && !state.layers.flood && !state.layers.contours;
}

export function photoWanted(state, distance, wasWanted = false) {
  if (!photoAllowed(state) || state.photoMode === 'relief') return false;
  if (state.photoMode === 'photo') return true;
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
