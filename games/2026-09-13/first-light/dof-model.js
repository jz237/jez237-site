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
export function cocPixels(dist,focus,aperture,maxCoc,range=0){if(!(dist>0)||!(focus>0))return 0;return Math.min(maxCoc,aperture*Math.max(0,Math.abs(dist-focus)-range*focus)/dist);}
// what the pass should do this frame, or null for no pass
export function dofFor(view,{focus=1,quality='high',enabled=true,pixelRatio=1}={}){
 const taps=DOF_TAPS[quality]||0,v=DOF_VIEWS[view];
 if(!enabled||!v||taps<=0||!(focus>0))return null;
 const s=Math.max(.5,Math.min(3,pixelRatio||1));
 return {view,focus,aperture:v.aperture*s,maxCoc:v.maxCoc*s,range:v.range,taps};
}
