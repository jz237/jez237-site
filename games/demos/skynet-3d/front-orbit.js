// Keep the emblem front-facing, reversing auto-orbit at either side profile.
export function configureFrontOrbit(controls){
 controls.minAzimuthAngle=-Math.PI/2;
 controls.maxAzimuthAngle=Math.PI/2;
}

export function updateFrontOrbit(controls,dt,animated){
 const auto=controls.autoRotate;
 if(!animated)controls.autoRotate=false;
 controls.update(dt);
 const angle=controls.getAzimuthalAngle();
 if(animated&&auto&&((angle<=controls.minAzimuthAngle+1e-7&&controls.autoRotateSpeed>0)||(angle>=controls.maxAzimuthAngle-1e-7&&controls.autoRotateSpeed<0))){
  controls.autoRotateSpeed=-controls.autoRotateSpeed;
  // Discard outward damping momentum so the next frame heads inward.
  const damping=controls.enableDamping;
  controls.autoRotate=false;controls.enableDamping=false;
  controls.update(0);
  controls.enableDamping=damping;
 }
 controls.autoRotate=auto;
}
