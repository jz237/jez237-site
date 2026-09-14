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
