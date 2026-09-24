// Check only our authenticated health endpoint, never the aircraft provider.
// Three consecutive failures tolerate brief network changes and resume from sleep.
export function createTunnelWatch({ probe, restart, threshold = 3 }) {
  let failures = 0, busy = false, disposed = false;
  return {
    async check() {
      if (busy || disposed) return;
      busy = true;
      try {
        let healthy = false;
        try { healthy = await probe(); } catch { /* transient connectivity */ }
        if (disposed) return;
        failures = healthy ? 0 : failures + 1;
        if (failures >= threshold) { failures = 0; await restart(); }
      } finally { busy = false; }
    },
    dispose() { disposed = true; },
  };
}
