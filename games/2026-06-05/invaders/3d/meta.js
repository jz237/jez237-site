// Invaders 3D Edition — settings, medals, toasts and the share card.
// Pure UI/storage helpers; the game logic in game.js decides when to call them.

// ---- settings --------------------------------------------------------------------
const SETTINGS_KEY = "invaders3d_settings_v1";
export const SETTINGS_DEFAULTS = {
  music: 100,
  sfx: 100,
  shake: "full",
  flash: "full",
  glow: "normal",
  palette: "standard",
  cinema: "on",
  rumble: "on",
  quality: "auto"
};
const CHOICES = [
  { key: "shake", label: "Screen shake", options: [["off", "Off"], ["low", "Low"], ["full", "Full"]] },
  { key: "flash", label: "Flashes", options: [["off", "Off"], ["low", "Low"], ["full", "Full"]] },
  { key: "glow", label: "Glow", options: [["low", "Low"], ["normal", "Normal"], ["high", "High"]] },
  { key: "palette", label: "Enemy colours", options: [["standard", "Standard"], ["cb", "Colour-blind"]] },
  { key: "cinema", label: "Camera moments", options: [["on", "On"], ["off", "Off"]] },
  { key: "rumble", label: "Vibration", options: [["on", "On"], ["off", "Off"]] },
  { key: "quality", label: "Graphics", options: [["auto", "Auto"], ["low", "Low"], ["med", "Med"], ["high", "High"]] }
];

export function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return { ...SETTINGS_DEFAULTS, ...(saved && typeof saved === "object" ? saved : {}) };
  } catch (error) {
    return { ...SETTINGS_DEFAULTS };
  }
}

export function saveSettings(settings) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (error) {}
}

export function renderSettings(el, settings, onChange) {
  const slider = (key, label) => `
    <label class="setting-row">
      <span>${label}</span>
      <input type="range" min="0" max="100" step="5" value="${settings[key]}" data-setting="${key}" aria-label="${label}">
      <output data-out="${key}">${settings[key]}%</output>
    </label>`;
  const choice = c => `
    <div class="setting-row">
      <span>${c.label}</span>
      <div class="seg" role="group" aria-label="${c.label}">
        ${c.options.map(([value, text]) => `<button type="button" data-setting="${c.key}" data-value="${value}" aria-pressed="${settings[c.key] === value}">${text}</button>`).join("")}
      </div>
    </div>`;
  el.innerHTML = `
    <h2>Settings</h2>
    ${slider("music", "Music")}
    ${slider("sfx", "Effects")}
    ${CHOICES.map(choice).join("")}
    <button type="button" class="secondary settings-reset" data-reset="1">Reset to defaults</button>`;
  el.oninput = event => {
    const input = event.target.closest("input[data-setting]");
    if (!input) return;
    settings[input.dataset.setting] = Number(input.value);
    const out = el.querySelector(`[data-out="${input.dataset.setting}"]`);
    if (out) out.textContent = input.value + "%";
    onChange(settings, input.dataset.setting);
  };
  el.onclick = event => {
    if (event.target.closest("[data-reset]")) {
      Object.assign(settings, SETTINGS_DEFAULTS);
      renderSettings(el, settings, onChange);
      onChange(settings, "*");
      return;
    }
    const button = event.target.closest("button[data-setting]");
    if (!button) return;
    settings[button.dataset.setting] = button.dataset.value;
    for (const b of el.querySelectorAll(`button[data-setting="${button.dataset.setting}"]`)) {
      b.setAttribute("aria-pressed", String(b === button));
    }
    onChange(settings, button.dataset.setting);
  };
}

// ---- medals ------------------------------------------------------------------------
// The picker page (../index.html) reads the same storage key to show the medal count,
// so each unlocked entry also carries its icon and name.
const MEDALS_KEY = "invaders3d_medals_v1";
export const MEDALS = [
  { id: "perfect", icon: "🎯", name: "Untouched", desc: "Clear a wave without taking a hit." },
  { id: "flawless5", icon: "💎", name: "Flawless Five", desc: "Five untouched waves in a row." },
  { id: "firstboss", icon: "⚔️", name: "Warship Down", desc: "Destroy a boss warship." },
  { id: "quickboss", icon: "⏱️", name: "Speed Kill", desc: "Destroy a boss in under 30 seconds." },
  { id: "fleet", icon: "👑", name: "Fleet Breaker", desc: "Destroy all four boss types." },
  { id: "chain50", icon: "🔗", name: "Chain Fifty", desc: "50 kills in one unbroken combo." },
  { id: "divetag10", icon: "🪂", name: "Dive Tagger", desc: "Shoot 10 divers mid-dive in one run." },
  { id: "saucer", icon: "🛸", name: "Saucer Sniper", desc: "Shoot down a bonus saucer." },
  { id: "saucer5", icon: "🌠", name: "Saucer Ace", desc: "Five saucers in one run." },
  { id: "ghost", icon: "👻", name: "Ghost Buster", desc: "Destroy a phantom while it takes aim." },
  { id: "flank", icon: "↩️", name: "Flanker", desc: "Destroy a warden with its barrier still up." },
  { id: "bomb30", icon: "💥", name: "Mass Effect", desc: "Destroy 30 enemies with one smart bomb." },
  { id: "overdrive10", icon: "⚡", name: "Overdriver", desc: "Trigger Overdrive 10 times in one run." },
  { id: "perks5", icon: "🧰", name: "Fully Loaded", desc: "Pick five upgrades in one run." },
  { id: "sector3", icon: "🪐", name: "Far Traveller", desc: "Reach the third star sector." },
  { id: "wave20", icon: "🚀", name: "Deep Space", desc: "Reach wave 20 in an Arcade or Daily run." },
  { id: "ace100k", icon: "🏆", name: "Ace Pilot", desc: "Score 100,000 points in one run." },
  { id: "rush4", icon: "🔥", name: "Rush Survivor", desc: "Destroy four warships in Boss Rush." },
  { id: "daily", icon: "📅", name: "Daily Duty", desc: "Finish a Daily Challenge run." }
];

export function createMedals(onUnlock) {
  let store = { total: MEDALS.length, got: {}, kinds: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(MEDALS_KEY) || "null");
    if (saved && saved.got) store = { total: MEDALS.length, got: saved.got, kinds: Array.isArray(saved.kinds) ? saved.kinds : [] };
  } catch (error) {}
  const save = () => {
    store.total = MEDALS.length;
    try { localStorage.setItem(MEDALS_KEY, JSON.stringify(store)); } catch (error) {}
  };
  return {
    total: MEDALS.length,
    has: id => !!store.got[id],
    count: () => MEDALS.filter(m => store.got[m.id]).length,
    unlock(id) {
      const medal = MEDALS.find(m => m.id === id);
      if (!medal || store.got[id]) return false;
      store.got[id] = { t: Date.now(), icon: medal.icon, name: medal.name };
      save();
      onUnlock(medal);
      return true;
    },
    noteBossKind(kind) {
      if (!store.kinds.includes(kind)) { store.kinds.push(kind); save(); }
      return store.kinds.length;
    },
    render(el) {
      const got = MEDALS.filter(m => store.got[m.id]).length;
      el.innerHTML = `
        <h2>Medals · ${got} / ${MEDALS.length}</h2>
        <div class="medal-grid">
          ${MEDALS.map(m => {
            const entry = store.got[m.id];
            const when = entry ? new Date(entry.t).toLocaleDateString() : "";
            return `<div class="medal${entry ? " got" : ""}" title="${m.desc}">
              <i aria-hidden="true">${entry ? m.icon : "🔒"}</i>
              <b>${m.name}</b>
              <span>${m.desc}${when ? `<br><em>${when}</em>` : ""}</span>
            </div>`;
          }).join("")}
        </div>`;
    }
  };
}

// ---- toasts ------------------------------------------------------------------------------
export function createToast(el) {
  const queue = [];
  let busy = false;
  function next() {
    const item = queue.shift();
    if (!item) { busy = false; return; }
    busy = true;
    el.innerHTML = `<i aria-hidden="true">${item.icon}</i><span><b>${item.title}</b>${item.text ? `<br>${item.text}` : ""}</span>`;
    el.classList.remove("hidden");
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => { el.classList.add("hidden"); next(); }, 320);
    }, item.ms || 2600);
  }
  return {
    show(icon, title, text, ms) {
      queue.push({ icon, title, text, ms });
      if (!busy) next();
    }
  };
}

// ---- share card -------------------------------------------------------------------------------
// 1200x630 (the size link previews use): the last frame of the run, plus the result.
export function buildShareCard({ shot, score, waveLabel, mode, sector, medals, total, url }) {
  const W = 1200, H = 630;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  g.fillStyle = "#03050d";
  g.fillRect(0, 0, W, H);
  if (shot && shot.width && shot.height) {
    const k = Math.max(W / shot.width, H / shot.height);
    const sw = W / k, sh = H / k;
    g.drawImage(shot, (shot.width - sw) / 2, (shot.height - sh) / 2, sw, sh, 0, 0, W, H);
  }
  const shade = g.createLinearGradient(0, 0, W * 0.75, 0);
  shade.addColorStop(0, "rgba(3, 5, 13, 0.92)");
  shade.addColorStop(0.55, "rgba(3, 5, 13, 0.62)");
  shade.addColorStop(1, "rgba(3, 5, 13, 0)");
  g.fillStyle = shade;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = "rgba(255, 61, 242, 0.55)";
  g.lineWidth = 4;
  g.strokeRect(14, 14, W - 28, H - 28);

  const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  g.textBaseline = "alphabetic";
  g.fillStyle = "#ffffff";
  g.shadowColor = "#35f4ff";
  g.shadowBlur = 24;
  g.font = `900 92px system-ui, sans-serif`;
  g.fillText("INVADERS", 64, 140);
  g.shadowBlur = 0;
  g.fillStyle = "#35f4ff";
  g.font = `800 26px ${mono}`;
  g.fillText("3D EDITION", 68, 182);

  g.fillStyle = "rgba(234, 249, 255, 0.7)";
  g.font = `800 24px ${mono}`;
  g.fillText(mode.toUpperCase(), 68, 268);
  g.fillStyle = "#ffd23d";
  g.shadowColor = "#ffd23d";
  g.shadowBlur = 20;
  g.font = `900 104px ${mono}`;
  g.fillText(Number(score || 0).toLocaleString(), 62, 372);
  g.shadowBlur = 0;
  g.fillStyle = "#ffffff";
  g.font = `800 30px ${mono}`;
  g.fillText(waveLabel, 68, 428);
  g.fillStyle = "rgba(167, 255, 61, 0.9)";
  g.font = `800 24px ${mono}`;
  g.fillText(`SECTOR · ${sector.toUpperCase()}`, 68, 470);
  g.fillStyle = "rgba(234, 249, 255, 0.75)";
  g.fillText(`MEDALS ${medals} / ${total}`, 68, 508);

  g.fillStyle = "rgba(53, 244, 255, 0.85)";
  g.font = `700 20px ${mono}`;
  g.fillText(url, 68, H - 54);
  g.textAlign = "right";
  g.fillStyle = "rgba(234, 249, 255, 0.55)";
  g.fillText(new Date().toLocaleDateString(), W - 56, H - 54);
  return c;
}

function canvasBlob(canvas) {
  return new Promise(resolve => canvas.toBlob(resolve, "image/png"));
}

export function canShareFiles() {
  try {
    return !!(navigator.canShare && navigator.share && navigator.canShare({ files: [new File([new Blob(["x"])], "x.png", { type: "image/png" })] }));
  } catch (error) {
    return false;
  }
}

export async function shareCardImage(canvas, { title, text, filename }) {
  const blob = await canvasBlob(canvas);
  if (!blob) return "failed";
  const file = new File([blob], filename, { type: "image/png" });
  try {
    await navigator.share({ files: [file], title, text });
    return "shared";
  } catch (error) {
    return error && error.name === "AbortError" ? "cancelled" : "failed";
  }
}

export async function downloadCardImage(canvas, filename) {
  const blob = await canvasBlob(canvas);
  if (!blob) return "failed";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  return "downloaded";
}
