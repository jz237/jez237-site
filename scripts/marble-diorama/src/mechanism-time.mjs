export function presenceAt(p, time) {
  if (!p.presence) return { visible: true, remaining: Infinity };
  const { period, on, phase = 0 } = p.presence,
    t = (((time + phase) % period) + period) % period;
  return { visible: t < on, remaining: Math.max(0, on - t) };
}
