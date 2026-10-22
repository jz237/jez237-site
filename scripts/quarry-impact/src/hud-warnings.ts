/** The HUD's mechanical warning line: with a dozen damage systems a wrecked car could list a dozen warnings at once, so they
 * are ordered by how much they matter to the driver right now and capped at HUD_WARNINGS.max, the rest counted as "+N". */
export const HUD_WARNINGS={max:3} as const;
const PRIORITY=[/OUT IN/,/ENGINE OVERHEATING/,/DAZED/,/DIFF BROKEN/,/TIE ROD/,/PROPSHAFT SNAPPED/,/BATTERY FLAT/,/BEARING SEIZED/,/ROLL BAR/,/JUMPED OUT/,/BRAKE FLUID|BRAKE BINDING/,/STEERING|POWER STEER/,/THROTTLE/,/CLUTCH/,/GEARBOX/,/WHEEL LOOSE/,
  /FRAME BENT/,/STARTER/,/ELECTRICAL/,/MOUNTS/,/DIFF GRINDING/,/TYRE RUBBING/,/EXHAUST/];
const rank=(w:string)=>{const i=PRIORITY.findIndex(p=>p.test(w));return i<0?PRIORITY.length:i;};
export function warningLine(warnings:readonly string[],max:number=HUD_WARNINGS.max){
  const list=warnings.filter(Boolean).map((w,i)=>({w,i})).sort((a,b)=>rank(a.w)-rank(b.w)||a.i-b.i).map(x=>x.w);
  const shown=list.slice(0,Math.max(1,max)),more=list.length-shown.length;
  return shown.join(' · ')+(more>0?` · +${more}`:'');
}
