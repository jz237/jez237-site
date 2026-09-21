export const AIRCRAFT_SESSION_MS = 30 * 60 * 1000;
export function createAircraftSession({ expire, now = Date.now,
  schedule = setTimeout, cancel = clearTimeout }) {
  let deadline = 0, timer;
  function stop() { cancel(timer); deadline = 0; }
  function check() {
    if (!deadline || now() < deadline) return false;
    stop(); expire(); return true;
  }
  function wake() { if (!check() && deadline) timer = schedule(wake, Math.max(1, deadline - now())); }
  return { check, stop, start() { stop(); deadline = now() + AIRCRAFT_SESSION_MS;
    timer = schedule(wake, AIRCRAFT_SESSION_MS); } };
}
