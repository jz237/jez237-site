// Qualitative transport delays and retained-film drainage, in animation seconds.
// These are deliberately not a plumbing volume / pressure / fluid solver.
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const ramp=(n)=>{const t=clamp(n);return t*t*(3-2*t);};
export const padLoading=s=>clamp(s.loading??(s.blocked?1:0));
export function outletActive(hole,loading){
  if(hole%3===0)return true;
  const rank=(Math.floor(hole/3)*2+(hole%3-1))*17%42;
  return rank>=Math.round(clamp(loading)*42);
}
export function transport(s,h){
  const age=s.runAge??20,coast=s.coastAge??20,base=.3+.7*h.setting;
  const returning=h.running?base*ramp(age/1.4):0;
  const drain=h.running?base*ramp((age-3.35)/.9):(s.power?0:h.flow);
  const tray=h.running?base*ramp((age-4.0)/1.8):(s.power?0:Math.max(h.flow,.14*(1-ramp((coast-1.8)/3.4))));
  const film=h.running?base*ramp((age-4.4)/1.8):(s.power?0:Math.max(tray,.09*(1-ramp((coast-2.5)/3.5))));
  const phase=h.dry?'LOW LEVEL / PUMP STOPPED':!s.power?(coast<2.9?'GRAVITY DRAIN-DOWN':film>.001?'LAST DROPS / RETAINED FILM':'SETTLED'):age<1.4?'RETURN LINE FILLING':age<3.35?'AQUARIUM LEVEL RISING':age<4.25?'OVERFLOW REACHES THE DRAIN':age<6.2?'DISTRIBUTOR WETTING':'STEADY CIRCULATION';
  return {returning,drain,tray,film,phase};
}
