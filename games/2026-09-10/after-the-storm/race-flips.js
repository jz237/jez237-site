import {stepRiderTricks} from './stunts.js';
export function demoFlipInput(r,input){
 const h=r.hydro,s=r.stunt;
 const ready=r.raceTime>(s.nextDemoFlip??(12+r.id*4));
 const clearance=Math.max(0,h.y-h.waterHeight),flight=(h.vy+Math.sqrt(h.vy*h.vy+19.62*clearance))/9.81;
 // A dropping trough can leave enough airtime even after upward speed fades.
 const safe=ready&&h.airborne&&h.vy>0&&clearance>.5&&flight>1.15&&h.airTime<.35;
 if(safe&&!s.trick)s.nextDemoFlip=r.raceTime+30+r.id*4;
 return safe||s.trick&&Math.abs(s.angle)<6.2?{...input,trick:'flip'}:input;
}
export function stepRaceFlip(r,input,dt){const s=r.stunt,eventId=s.eventId;
 stepRiderTricks(s,r,input,dt,{scoring:false});
 if(s.eventId!==eventId){r.event=s.event;r.eventTime=r.raceTime;}
}
