export function overviewLocation(x, y, bounds, width=220, height=150) {
  const unit=v => Math.min(1,Math.max(0,v));
  return {lon:bounds.west + unit((x-12)/(width-24))*(bounds.east-bounds.west),
    lat:bounds.north - unit((y-8)/(height-16))*(bounds.north-bounds.south)};
}

export function cameraAction(action, pose) {
  const target={lon:pose.lon,lat:pose.lat,camDist:pose.dist};
  if (action==='north') return {...target,camBearing:0};
  if (action==='overhead') return {...target,camPitch:pose.pitch < 5 ? 50 : 0};
  return target;
}

export function wireNavigation(host, rig, motion) {
  if (!host) return {update() {},dispose() {}};
  const click=event => {
    const action=event.target.closest('button[data-camera]')?.dataset.camera;
    if (!action) return;
    motion.stop();
    if (action==='in' || action==='out') rig.nudge({zoom:action==='in' ? 1/1.6 : 1.6});
    else motion.flyTo(cameraAction(action,rig.pose()));
  };
  const north=host.querySelector('[data-camera="north"] span');
  const overhead=host.querySelector('[data-camera="overhead"]');
  const zoomIn=host.querySelector('[data-camera="in"]'), zoomOut=host.querySelector('[data-camera="out"]');
  host.addEventListener('click',click);
  return {
    update(pose) {
      north.style.transform=`rotate(${-pose.bearing}deg)`;
      overhead.setAttribute('aria-pressed',String(pose.pitch<5));
      zoomIn.disabled=pose.dist<=201; zoomOut.disabled=pose.dist>=189999;
    },
    dispose() { host.removeEventListener('click',click); },
  };
}
