export function presenceAt(p, time) {
  if (!p.presence) return { visible: true, remaining: Infinity, deployment: 1 };
  const { period, on, phase = 0 } = p.presence,
    t = (((time + phase) % period) + period) % period;
  const remaining = Math.max(0, on - t);
  const transition = p.presence.transition ?? 0;
  const fraction = transition
    ? Math.max(0, Math.min(1, t / transition, remaining / transition))
    : Number(t < on);
  const deployment = fraction * fraction * (3 - 2 * fraction);
  return { visible: t < on && deployment > 0, remaining, deployment };
}
