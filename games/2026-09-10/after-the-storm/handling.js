const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// A loaded outside chine bites into a turn; the grip returns progressively
// after landing instead of snapping from an airborne skate to a rail.
export function contactHandling(rider, input, dt) {
  const h = rider.hydro, speed = Math.hypot(rider.vx, rider.vz);
  rider.contactGrip ??= h.wet;
  rider.contactGrip += (h.wet - rider.contactGrip) * (1 - Math.exp(-dt * (h.wet < rider.contactGrip ? 24 : 9)));
  const contact = Math.min(h.wet * 1.5, rider.contactGrip);
  const carve = clamp(speed / 18, 0, 1) * Math.abs(rider.turn) * contact;
  const lateral=rider.vx*Math.cos(rider.heading||0)-rider.vz*Math.sin(rider.heading||0);
  const demand=clamp((Math.abs(rider.turn)-.35)/.65,0,1)*clamp((speed-20)/6,0,1);
  // Bracing plants the stern; the explicit slide command still releases it.
  const target=demand*(input.slide?1:input.dampen||rider.onIce?0:.55);
  const old=rider.sternSlip||0;
  rider.sternSlip=old+(target-old)*(1-Math.exp(-dt*(target>old?5:3)));
  rider.gripCatch=Math.max((rider.gripCatch||0)*Math.exp(-dt*7),Math.max(0,old-rider.sternSlip)/Math.max(dt,.001)*clamp(Math.abs(lateral)/5,0,1)*contact);
  rider.slipVelocity=lateral;
  // No airborne steering assistance. Existing buoy routes and rider tuning
  // retain their authority; weight transfer adds a modest, physical bias.
  return { yaw: 1 - carve * .075, grip: (1 + carve * .12)*(1-rider.sternSlip*.45),
    contact: clamp(contact, 0, 1), landingLoss: input.dampen ? .020 : .027 };
}
