// The interactive ripple field is a 2D wave equation on a GPU heightfield (ripple-field.js).
// The scheme constants live here so node tests can check stability and decay without WebGL.
export const RIPPLE={span:48,c:.55,dt:1/60,damping:.992};
export const RIPPLE_TIERS={high:{res:512},medium:{res:256},low:{res:128},saver:{res:128}};
export function rippleTier(quality){return RIPPLE_TIERS[quality]||RIPPLE_TIERS.medium;}
export function cellSize(res){return RIPPLE.span/res;}
export function cflNumber(res){return RIPPLE.c*RIPPLE.dt/cellSize(res);}
export function waveK(res){const c=cflNumber(res);return c*c;}
// Reference CPU step, identical to the fragment program: Verlet with damping, zero beyond the edge.
export function stepRippleCPU(h,hPrev,res,out=new Float32Array(res*res)){
 const k=waveK(res),d=RIPPLE.damping;
 for(let y=0;y<res;y++)for(let x=0;x<res;x++){const i=y*res+x;
  const l=x>0?h[i-1]:0,r=x<res-1?h[i+1]:0,u=y>0?h[i-res]:0,dn=y<res-1?h[i+res]:0;
  out[i]=h[i]+(h[i]-hPrev[i])*d+k*(l+r+u+dn-4*h[i]);}
 return out;
}
export function rippleEnergy(h,hPrev){let e=0;for(let i=0;i<h.length;i++){const v=h[i]-hPrev[i];e+=h[i]*h[i]+v*v;}return e;}
export function splat(h,res,cx,cy,radius,amplitude){for(let y=Math.max(0,Math.floor(cy-radius*3));y<Math.min(res,cy+radius*3);y++)for(let x=Math.max(0,Math.floor(cx-radius*3));x<Math.min(res,cx+radius*3);x++){const dx=x-cx,dy=y-cy;h[y*res+x]+=amplitude*Math.exp(-(dx*dx+dy*dy)/(2*radius*radius));}}
