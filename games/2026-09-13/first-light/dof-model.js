// Depth of field for the moments that deserve it: the fish in hand, the gallery turntable and photo
// mode. This half is pure and node-tested: the circle of confusion in device pixels for a view
// distance, and the per-view presets (aperture is the blur radius the far background reaches).
// The shader pass lives in dof.js.
export const DOF_TAPS={high:24,medium:16,low:0,saver:0};
// range is the focal band as a fraction of the focus distance: everything inside it stays untouched,
// so a fish angled toward the camera never picks up a one-pixel blur at its nose and tail
export const DOF_VIEWS={
 hero:{aperture:16,maxCoc:18,range:.2,blurb:'the catch in hand, the cove soft behind it'},
 gallery:{aperture:12,maxCoc:14,range:.15,blurb:'the turntable'},
 photo:{aperture:6,maxCoc:8,range:.12,blurb:'a gentle fall-off around the kayak'},
 drift:{aperture:7,maxCoc:9,range:.2,blurb:'the lure cam drift, the fish in focus'}
};
// The grade: what the always-on post pass does to the tonemapped frame. Saturation, an S-curve of
// contrast, a warm-highlight / cool-shadow split that grows as the sun drops, and a vignette; off on
// Saver, where the frame goes straight to the screen.
export function gradeFor({elevation=30,night=0,quality='high'}={}){
 if(quality==='saver')return null;
 const lowSun=Math.max(0,Math.min(1,1-elevation/16));
 return {sat:1.12+.12*lowSun-.15*night,contrast:1.06+.10*lowSun,split:.35*lowSun*(1-night),vignette:.22,warm:[1.0,.86,.62],cool:[.55,.6,.9]};
}
export function cocPixels(dist,focus,aperture,maxCoc,range=0){if(!(dist>0)||!(focus>0))return 0;return Math.min(maxCoc,aperture*Math.max(0,Math.abs(dist-focus)-range*focus)/dist);}
// what the pass should do this frame, or null for no pass
export function dofFor(view,{focus=1,quality='high',enabled=true,pixelRatio=1}={}){
 const taps=DOF_TAPS[quality]||0,v=DOF_VIEWS[view];
 if(!enabled||!v||taps<=0||!(focus>0))return null;
 const s=Math.max(.5,Math.min(3,pixelRatio||1));
 return {view,focus,aperture:v.aperture*s,maxCoc:v.maxCoc*s,range:v.range,taps};
}
// The glow: how far the bright pass bleeds (the low sun over the tree line, the moon, glints) and
// whether the rays run this frame. Rays need the sun low, above the horizon and on or near the
// screen; they fade as it leaves the frame so nothing pops. Off on Saver with the rest of the pass.
const clamp01=v=>Math.max(0,Math.min(1,v));
export function glowFor({elevation=30,night=0,quality='high',cloud=0,sunUV=null,sunAhead=false}={}){
 if(quality==='saver')return null;
 const lowSun=clamp01(1-(elevation-1)/16);
 const bloom=(.16+.24*lowSun)*(1-.5*cloud)+.12*night;
 const threshold=.85-.28*lowSun-.3*night;
 let shaft=0;
 if(sunAhead&&sunUV&&elevation>-1&&elevation<22&&night<.5){
  const out=Math.max(-sunUV[0],sunUV[0]-1,-sunUV[1],sunUV[1]-1);
  const edge=clamp01(1-out/.35);
  shaft=.9*lowSun*edge*(1-.7*cloud);
 }
 return {bloom:+bloom.toFixed(3),threshold:+threshold.toFixed(3),wide:quality==='high',shaft:+shaft.toFixed(3),sunUV,decay:.965,density:.85,samples:quality==='high'?40:24,shaftThreshold:.35,tint:[1,.72,.45]};
}
