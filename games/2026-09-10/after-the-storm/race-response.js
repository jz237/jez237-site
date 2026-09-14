const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
// Retained throttle load gives a short surge as a carve unwinds. Actual intake
// immersion gates the force; no extra terminal speed or airborne propulsion.
export function cornerDrive(r,c,dt,ratio){
 const h=r.hydro,turn=Math.abs(r.turn||0),loaded=turn>.28&&r.speed>7&&c.throttle>.55&&!c.brake&&!h.airborne;
 r.cornerLoad=clamp((r.cornerLoad||0)+(loaded?dt*2:-dt*1.6));
 const unwind=1-clamp(turn/.35),contact=clamp((h.intake-.4)/.5);
 r.exitDrive=!c.brake&&!h.airborne&&!r.onIce&&!r.recover&&r.speed>5?
  r.cornerLoad*unwind*contact*clamp(c.throttle||0)*clamp(1-ratio*ratio)*.28:0;
 return r.exitDrive;
}
