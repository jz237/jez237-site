const TAU=Math.PI*2;
export function demoFlipInput(r,input){
 const h=r.hydro,s=r.stunt;
 const ready=r.raceTime>(s.nextDemoFlip??(12+r.id*4));
 const safe=ready&&h.airborne&&h.vy>4.5&&h.y-h.waterHeight>.5&&h.airTime<.2;
 if(safe&&!s.trick)s.nextDemoFlip=r.raceTime+30+r.id*4;
 return safe||s.trick?{...input,trick:'flip'}:input;
}
// One optional rotation per jump. Incomplete rotations lose speed on landing.
export function stepRaceFlip(r,input,dt){const s=r.stunt,h=r.hydro;
 if(h.airborne){s.airDuration+=dt;if(!s.trick&&!s.flipUsed&&input.trick==='flip'){s.trick='flip';s.angle=0;s.flipUsed=true;}if(s.trick)s.angle=Math.min(TAU,s.angle+dt*8.5);}
 if(h.landingId!==s.lastLanding){s.lastLanding=h.landingId;if(s.trick){if(s.angle>=TAU-.08){s.tricks++;s.completedTricks.flip=true;r.event='CLEAN WAVE FLIP';}else{r.vx*=.65;r.vz*=.65;r.recover=.45;s.crashes++;r.event='ROUGH FLIP LANDING';}r.eventTime=r.raceTime;s.trick=null;s.angle=0;}s.flipUsed=false;s.airDuration=0;}
}
