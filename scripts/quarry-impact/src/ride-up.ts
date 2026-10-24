/** Riding up (offline events): a car that rams the end of another nose-first at RIDE.closing or more climbs onto it: its
 * front kicks up by RIDE.lift (a share of its mass in upward impulse at the front axle), so its momentum carries it onto
 * the other car's bonnet or boot rather than bouncing straight off. Half of such rams (fixed per pair and second), at most
 * once every RIDE.gap seconds per car. */
export const RIDE={closing:11,toward:6,front:.45,end:.5,lift:2.6,chance:.5,gap:2} as const;
/** On top (offline): a car resting more than ON_TOP.above over another (centres within ON_TOP.reach) crushes it under its
 * weight: ON_TOP.crush of structure a second at the end or roof beneath, and a real dent every ON_TOP.dent seconds; after
 * ON_TOP.credit seconds the car on top is credited once. */
export const ON_TOP={above:.45,reach:2.6,crush:.12,dent:.3,dentDamage:2.5,credit:.4} as const;
/** The player's own ride-ups (riding up, or being ridden up on) run in slow motion for RIDE_SLOWMO.seconds at RIDE_SLOWMO.scale,
 * with a steel crunch, the way a big smash does. */
export const RIDE_SLOWMO={seconds:.7,scale:.35} as const;
/** The face of the car underneath that takes the weight: 0 front, 1 rear, 4 roof. */
export const crushedFace=(along:number)=>along>.35?0:along<-.35?1:4;
type V={x:number;z:number};
/** Where a world point sits along a car (forward-local z, + = front) as a share of its half length. */
export const alongCar=(p:V,centre:V,forward:V,halfLength:number)=>((p.x-centre.x)*forward.x+(p.z-centre.z)*forward.z)/Math.max(.1,halfLength);
/** The rammer in a car-to-car contact, or -1: the car driving into the other at RIDE.toward or more, hitting with its nose
 * (past RIDE.front of its half length) into the other's front or rear end (past RIDE.end), the closing speed RIDE.closing+. */
export function rammer(closing:number,a:{c:V;f:V;v:V;half:number},b:{c:V;f:V;v:V;half:number},point:V){
  if(!(closing>=RIDE.closing))return -1;
  const toward=(s:{c:V;v:V},o:{c:V})=>{const dx=o.c.x-s.c.x,dz=o.c.z-s.c.z,d=Math.hypot(dx,dz)||1;return (s.v.x*dx+s.v.z*dz)/d;};
  const ta=toward(a,b),tb=toward(b,a),[s,o,id]=ta>=tb?[a,b,0]:[b,a,1];
  if(Math.max(ta,tb)<RIDE.toward)return -1;
  return alongCar(point,s.c,s.f,s.half)>=RIDE.front&&Math.abs(alongCar(point,o.c,o.f,o.half))>=RIDE.end?id:-1;
}
export function ridesUp(seed:number){const x=Math.sin(seed*45.164+7.7)*43758.5453;return x-Math.floor(x)<RIDE.chance;}
