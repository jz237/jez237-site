// Exponential optical zoom works in fixed views and the optional moving tour.
// Normalize wheels/trackpads; limit one event so unusual devices cannot jump abruptly.
export function zoomFromWheel(zoom, deltaY, deltaMode=0, pageHeight=800) {
  if (!Number.isFinite(deltaY)) return zoom;
  const pixels=deltaY*(deltaMode===1?16:deltaMode===2?pageHeight:1);
  return Math.max(.65, Math.min(4, zoom*Math.exp(-Math.max(-180,Math.min(180,pixels))*.0015)));
}
export function fovFromWheel(fov, deltaY, deltaMode=0, pageHeight=800) {
  const base=Math.tan(52*Math.PI/360);
  const zoom=zoomFromWheel(base/Math.tan(fov*Math.PI/360),deltaY,deltaMode,pageHeight);
  return Math.atan(base/zoom)*360/Math.PI;
}
