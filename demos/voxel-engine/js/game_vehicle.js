// Vehicles, the host's part. The engine owns driving: the same input goes
// in as on foot (E is one more button), and what comes back is read here.
// Two things are left to do. The chase camera turns with the vehicle, and
// the look direction is the host's: the engine reports by how much to turn
// it (running sums, as with recoil) and turn() adds that. And one line of
// HUD: the prompt at a door, the speed at the wheel.
import { VEHICLE_STATE } from './engine.js';

const NAMES = ['Car', 'Flatbed', 'Dump truck', 'Bulldozer'];
const PITCH_LIMIT = 1.55;
const LINE = 'margin:0 auto 8px;width:max-content;max-width:90vw;padding:5px 12px;border-radius:8px;' +
  'background:rgba(12,15,19,0.6);font:600 12px/1.4 var(--mono, monospace);letter-spacing:0.03em;color:var(--text, #eee)';

export function createVehicle(ctx, look) {
  const { sim } = ctx;
  const dock = document.getElementById('dock');
  const use = document.getElementById('tb-use');
  const line = document.createElement('div');
  line.id = 'drive';
  line.style.cssText = LINE;
  line.hidden = true;
  if (dock) dock.insertBefore(line, dock.firstChild);
  // (`.tb` sets its own display, so `hidden` would not hide it.)
  if (use) use.style.cssText = 'display:none;right:calc(186px + var(--safe-r));bottom:calc(196px + var(--safe-b));width:58px;height:58px';
  // Sums already added to the look direction, and what the line shows.
  let yaw = 0, pitch = 0, shown = '', kmh = -1, mode = 0, edge = false;

  return {
    // Forget what the engine has reported so far: it is new (a restart), or
    // something else moved the view meanwhile (a script).
    reset() {
      const s = sim.frame.vehicleState;
      yaw = s[VEHICLE_STATE.LOOK_YAW];
      pitch = s[VEHICLE_STATE.LOOK_PITCH];
    },

    // Before the input goes in: turn the view by what the vehicle turned.
    turn() {
      const s = sim.frame.vehicleState;
      const dy = s[VEHICLE_STATE.LOOK_YAW] - yaw, dp = s[VEHICLE_STATE.LOOK_PITCH] - pitch;
      yaw += dy;
      pitch += dp;
      if (dy === dy && dp === dp) {
        look.yaw += dy;
        look.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, look.pitch + dp));
      }
    },

    // Once per drawn frame. The DOM is written only when the text changes.
    frame() {
      const s = sim.frame.vehicleState;
      const driving = s[VEHICLE_STATE.DRIVING] !== 0, prompt = s[VEHICLE_STATE.PROMPT] !== 0;
      const now = driving ? 2 : prompt ? 1 : 0;
      const speed = driving ? Math.round(Math.abs(s[VEHICLE_STATE.SPEED]) * 3.6) : -1;
      // The map ends where nothing drawn says so (fields and streets go
      // on beyond): the engine brakes a vehicle to a stand there, and
      // this line says why.
      const held = driving && s[VEHICLE_STATE.EDGE] > 0;
      if (now === mode && speed === kmh && held === edge) return;
      mode = now;
      kmh = speed;
      edge = held;
      // With touch controls the keys mean nothing: the button says it.
      const keys = !document.body.classList.contains('touch');
      const name = NAMES[s[VEHICLE_STATE.KIND]] || 'Vehicle';
      const text = driving
        ? held ? `${name} · ${speed} km/h · the map ends here: turn back`
          : `${name} · ${speed} km/h${keys ? ' · E out · V view · Space handbrake · H horn' : ''}`
        : prompt && keys ? 'E · drive' : '';
      if (text !== shown) {
        shown = text;
        line.textContent = text;
        line.hidden = text === '';
      }
      if (use) {
        use.style.display = now === 0 ? 'none' : '';
        use.textContent = driving ? 'Out' : 'Drive';
      }
    },
  };
}
