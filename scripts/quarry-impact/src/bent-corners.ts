/** Bent corners (offline): a knocked wheel leans. The corner damage that already softens a wheel's grip, sags it and toes it
 * out now shows as camber too — the top of the wheel kicked out and the bottom tucked under, from LEAN.onset of damage to
 * LEAN.max rad by LEAN.full (derby corners seldom get past it before the wheel is torn off) — the wheel steering and
 * spinning on its bent upright, lifted so its tread's low edge stays on the road rather than in it. On top of the slight
 * camber the wreck pose gives every damaged wheel (0.22 rad per unit of damage, online too), which hardly showed at the
 * damage derby corners reach. Only a rotation the wheel already has: no draw call. */
export const LEAN={onset:.08,full:.32,max:.3} as const;
/** How far (rad, about the wheel's fore-aft line) a wheel with this corner damage leans, on this side (−1 left, 1 right). */
export function cornerLean(damage:number,side:number){
  const d=Number.isFinite(damage)?damage:0,t=Math.max(0,Math.min(1,(d-LEAN.onset)/(LEAN.full-LEAN.onset)));return -(side<0?-1:1)*LEAN.max*t;
}
/** How far to lift a wheel leaning `lean` rad so its tread's low edge stays at the road: half its width up, its radius down. */
export function leanLift(lean:number,radius:number,halfWidth:number){
  const a=Math.abs(Number.isFinite(lean)?lean:0);return Math.max(0,halfWidth*Math.sin(a)-radius*(1-Math.cos(a)));
}
