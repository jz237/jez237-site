// Fixed 60 Hz flight assistance. Simulation owns collisions, fuel and rescues.
// Velocity targets remove unwanted climb/drift while retaining visible bank and inertia.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const approach = (v, target, response, limit) => v + clamp((target - v) * response, -limit, limit);
export function flyHelicopter(h, input, context) {
  const { floorY, pointer, cameraX, viewScale } = context;
  const altitude = Math.max(0, floorY - h.y);
  const outOfFuel = h.fuel <= 0;
  const axis = clamp(input.axisX ?? (Number(!!input.right) - Number(!!input.left)), -1, 1);
  const climb = clamp(input.axisY ?? (Number(!!input.descend) - Number(!!input.lift)), -1, 1);
  let targetX = axis * 6.2;
  let targetY = climb < 0 ? climb * 4.8 : climb * 4;
  let pTarget = null;
  let powered = Math.abs(axis) > .01 || Math.abs(climb) > .01;

  if (pointer.active && !outOfFuel) {
    // Mouse points exactly; touch points ahead of the finger in CSS pixels.
    const offset = pointer.type === 'touch' ? 56 / viewScale : 0;
    pTarget = { x: pointer.sx + cameraX, y: clamp(pointer.sy - offset, 26, floorY) };
    const dx = pTarget.x - h.x, dy = pTarget.y - h.y;
    targetX = Math.abs(dx) < 2 ? 0 : clamp(dx * .09, -6.2, 6.2);
    targetY = Math.abs(dy) < 1.2 ? 0 : clamp(dy * .11, -4.8, 4);
    if (pTarget.y >= floorY - 3 && dy >= 0) targetY = Math.max(1, targetY);
    if (Math.abs(dx) > 24) h.facingTgt = dx > 0 ? 1 : -1;
    powered = true;
  } else {
    if (Math.abs(axis) > .08) h.facingTgt = axis > 0 ? 1 : -1;
    // Keyboard is hands-off hover; releasing a drag gently settles to rescue.
    if (!powered && pointer.used && !h.onGround) targetY = 1.45;
    // Side input lifts clear of the skids, then holds a low transit altitude.
    if (Math.abs(axis) > .01 && Math.abs(climb) < .01 && altitude < 24) targetY = -1.7;
  }

  if (outOfFuel) {
    // Autorotation retains momentum and a controlled descent without powered lift.
    h.vx *= .993;
    h.vy = approach(h.vy, altitude < 45 ? 2.4 : 3.8, .06, .09);
    powered = false;
    pTarget = null;
  } else {
    // Descending near the ground automatically flares into a gentle touchdown.
    if (targetY > 0) targetY = Math.min(targetY, 1.05 + Math.max(0, altitude - 16) * .035);
    if (h.onGround && !powered) targetY = 0;
    const beforeX = h.vx, beforeY = h.vy;
    const braking = targetX === 0 || targetX * h.vx < 0;
    h.vx = approach(h.vx, targetX, braking ? .16 : .11, braking ? .44 : .34);
    h.vy = approach(h.vy, targetY, .14, targetY > h.vy ? .27 : .34);
    if (Math.abs(h.vx) < .025 && targetX === 0) h.vx = 0;
    if (Math.abs(h.vy) < .025 && targetY === 0) h.vy = 0;
    h.cmd = clamp(h.vx * .034 + (h.vx - beforeX) * .7, -.34, .34);
    h.thrustN += (clamp(1 - (h.vy - beforeY) / .3, .2, 2.3) - h.thrustN) * .18;
  }
  if (outOfFuel) { h.cmd = clamp(h.vx * .025, -.2, .2); h.thrustN = .5; }
  if (altitude < 18 && h.vy > 0) h.cmd *= .55;
  h.attV = (h.attV + (h.cmd - h.att) * .12) * .57;
  h.att += h.attV;
  const spoolTarget = outOfFuel ? (h.onGround ? 0 : .5) : (powered || !h.onGround ? 1 : .5);
  h.spool = approach(h.spool, spoolTarget, .2, .055);
  h.facing = h.facingTgt;
  if (!h.onGround || powered) h.yawVis += clamp(h.facingTgt - h.yawVis, -.12, .12);
  h.rotor += .15 + 1.3 * h.spool * h.spool;
  const lift = h.thrustN * h.spool * h.spool;
  h.rotorPow = clamp(h.spool * (.5 + .28 * h.thrustN), 0, 1);
  return { powered, pTarget, lift };
}
