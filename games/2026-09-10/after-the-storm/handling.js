const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// A loaded outside chine bites into a turn; the grip returns progressively
// after landing instead of snapping from an airborne skate to a rail.
export function contactHandling(rider, input, dt) {
  const h = rider.hydro, speed = Math.hypot(rider.vx, rider.vz);
  rider.contactGrip ??= h.wet;
  rider.contactGrip += (h.wet - rider.contactGrip) * (1 - Math.exp(-dt * (h.wet < rider.contactGrip ? 24 : 9)));
  const contact = Math.min(h.wet * 1.5, rider.contactGrip);
  const carve = clamp(speed / 18, 0, 1) * Math.abs(rider.turn) * contact;
  // No airborne steering assistance. Existing buoy routes and rider tuning
  // retain their authority; weight transfer adds a modest, physical bias.
  return { yaw: 1 - carve * .075, grip: 1 + carve * .12,
    contact: clamp(contact, 0, 1), landingLoss: input.dampen ? .020 : .027 };
}
