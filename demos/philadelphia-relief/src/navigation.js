import { compassPoint } from './geo.js?v=philly-2026090905';
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
  const caption=host.querySelector('.camera-caption');
  host.addEventListener('click',click);
  return {
    update(pose) {
      if (caption) caption.textContent=cameraCaption(pose);
      north.style.transform=`rotate(${-pose.bearing}deg)`;
      overhead.setAttribute('aria-pressed',String(pose.pitch<5));
      zoomIn.disabled=pose.dist<=201; zoomOut.disabled=pose.dist>=189999;
    },
    dispose() { host.removeEventListener('click',click); },
  };
}

export function awayFromPreset(preset, state, projection) {
  if (!preset) return true;
  const dx=(state.camLon-preset.camera.camLon)*projection.metersPerDegLon;
  const dz=(state.camLat-preset.camera.camLat)*projection.metersPerDegLat;
  const radius=Math.max(1200,Math.min(20000,preset.camera.camDist*.8));
  return Math.hypot(dx,dz)>radius || (preset.camera.camDist>45000 && state.camDist<9000);
}

export function cameraCaption(pose) {
  const scale=pose.dist>45000 ? 'Region' : pose.dist>9000 ? 'City'
    : pose.dist>700 ? 'Neighborhood' : 'Street';
  return `${compassPoint(pose.bearing)} · ${pose.pitch<5 ? 'Overhead' : scale}`;
}
