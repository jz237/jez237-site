// The original places wake, spray and splash against its physics water plane
// (4D30C queries), while the high-resolution water draws the exact rendered
// triangles. Depth-tested wake would then sink below the surface. Lift those
// vertices just above the rendered water at their own X/Z. Presentation only:
// canonical effect state and droplets in the air are never changed.
const LIFTED=new Set(['wake','spray','splash']);

export function liftNativeEffectsToSurface(presentation,heightAt,clearance=.03){
 if(!Array.isArray(presentation?.draws))return presentation;
 if(typeof heightAt!=='function'||!Number.isFinite(clearance))throw new TypeError('Supply the rendered water height');
 return {...presentation,draws:presentation.draws.map(d=>{
  if(!LIFTED.has(d.family))return d;
  const p=d.positions.slice();
  for(let i=0;i<p.length;i+=3){const h=heightAt(p[i],p[i+2])+clearance;if(Number.isFinite(h)&&p[i+1]<h)p[i+1]=h;}
  return {...d,positions:p};
 })};
}
