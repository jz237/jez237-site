const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
// Entry angles are measured against the local surface, not the horizon.
export function landingResponse(h,craft,{bowSlope=0,sideSlope=0,dampen=false}={}){
 const pitch=h.pitch-bowSlope,roll=h.roll-sideSlope,fx=Math.sin(craft.heading),fz=Math.cos(craft.heading);
 const slip=(craft.vx||0)*fz-(craft.vz||0)*fx,side=clamp(Math.abs(roll)/.75+Math.abs(slip)/22),bow=clamp(pitch/.65),stern=clamp(-pitch/.65),energy=clamp((h.impact-2)/10),brace=dampen?.72:1;
 const style=side>.55?'sideways':bow>.27?'bow-first':stern>.27?'stern-first':'level';
 const directional=style==='level'?0:1;
 return {style,pitch,roll,slip,loss:directional*energy*(bow*.16+stern*.035+side*.20)*brace,yaw:directional*clamp(-slip*.015-Math.sin(roll)*.26,-.35,.35)*energy*brace,kick:directional*(stern*.35-bow*.22)*energy*brace,harshness:energy*(.65+bow*.6+side*.75)*brace};
}
export function airTrim(lean,pitch,pitchRate){return -Math.max(-1,Math.min(1,lean))*1.15-pitchRate*.12;}

// Match spray direction to the entry used by the physical pressure solver.
export function landingPlume(h){const style=h.entry?.style||h.landingStyle||'level',energy=clamp((h.impact||0)/10);
 return {style,forward:style==='bow-first'?2+energy*5:style==='stern-first'?-2-energy*3:0,
  lateral:style==='sideways'?3+energy*6:1.4+energy*2.5,
  rise:style==='bow-first'?1.2:style==='sideways'?.65:style==='stern-first'?.9:.45,
  carry:style==='level'?.60:.28,life:style==='sideways'?1.25:.85};}

// Gradual reattachment preserves lateral momentum after a skewed entry.
// This changes grip, never adds kinetic energy or snaps velocity to heading.
export function landingGrip(r,dt){
 const h=r.hydro;
 if(r.landingGripId!==h.landingId){r.landingGripId=h.landingId;r.landingSettle=h.entry?.style==='sideways'?clamp(h.entry.harshness,0,.85)*clamp((Math.abs(h.entry.slip||0)-3)/5):0;}
 const amount=r.landingSettle||0;
 if(!h.airborne)r.landingSettle=Math.max(0,amount-dt*(1.5+clamp(h.wet)*1.5));
 return 1-amount*.15;
}
