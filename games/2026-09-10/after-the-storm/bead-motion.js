const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function stepBeads(s,r,storm,dt){
 if(dt<=0)return s;
 const h=r.hydro,landing=h.landingId||0;
 if(landing!==(s.landing||0)){s.wet=Math.max(s.wet||0,clamp(h.impact/7,0,1));s.landing=landing;}
 const source=storm*.3+(r.sprayExposure||0)*.6+Math.max(0,r.speed-14)*h.wet*.002;
 s.wet=clamp((s.wet||0)*Math.exp(-dt*(.028+r.speed*.0015))+source*dt,0,1);
 s.flow=(s.flow||0)+dt*(.004+r.speed*r.speed*.000045);
 s.speed=r.speed;return s;
}
