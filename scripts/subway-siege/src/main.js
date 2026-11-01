import "./style.css";
import { World, SECTORS } from "./world.js";
import { Game, SHIPS, WEAPONS, UPGRADES } from "./game.js";
import { Sound } from "./audio.js";
import { Scores, store } from "./scores.js";

const $ = (id) => document.getElementById(id);
const settings = {
  auto: true,
  music: 0.45,
  sfx: 0.7,
  motion: matchMedia("(prefers-reduced-motion: reduce)").matches,
  quality: "auto",
  ship: 0,
  ...store.get("subway_siege_ironline_settings", {}),
};
settings.ship = Math.max(0, Math.min(2, Number(settings.ship) || 0));
settings.sfx = Math.max(0, Math.min(1, Number(settings.sfx) || 0));
settings.music = Math.max(0, Math.min(1, Number(settings.music) || 0));
const save = () => store.set("subway_siege_ironline_settings", settings);
// Auto starts at the top tier on desktop-class screens and steps down if the
// frame rate stays low; phones start at high.
const autoTier = () =>
  matchMedia("(pointer: coarse)").matches ||
  Math.min(screen.width, screen.height) < 700
    ? "high"
    : "ultra";
const tierFor = (q) => (q === "auto" ? autoTier() : q);
let game,
  world,
  sound,
  boards,
  toastTimer,
  radioTimer,
  damageTimer,
  dialogKind = "";
let muted = false,
  mutedVolumes = null;
const action = (label, fn, primary = false) => {
  const b = document.createElement("button");
  b.textContent = label;
  if (primary) b.className = "primary";
  b.onclick = () => {
    sound.unlock();
    sound.tone(600, 0.06, 0.04);
    fn();
  };
  $("dialog-actions").append(b);
  return b;
};
const visibleHud = (visible) => {
  for (const id of ["hud", "instruments", "flight-bar", "combo"])
    $(id).hidden = !visible;
};
function openDialog(title, body, kicker = "UNDERGROUND DEFENCE AUTHORITY") {
  dialogKind = title;
  $("dialog-title").textContent = title;
  $("dialog-body").innerHTML = body;
  $("dialog-kicker").textContent = kicker;
  $("dialog-actions").replaceChildren();
  $("dialog").hidden = false;
  game.keys = {};
  game.pointer.active = false;
  requestAnimationFrame(() =>
    $("dialog").querySelector("button")?.focus({ preventScroll: true }),
  );
}
function close() {
  dialogKind = "";
  $("dialog").hidden = true;
}
function setShips() {
  $("ships").replaceChildren();
  SHIPS.forEach((s, i) => {
    const b = document.createElement("button");
    b.className = "ship-choice" + (settings.ship === i ? " selected" : "");
    b.setAttribute("aria-pressed", settings.ship === i ? "true" : "false");
    b.innerHTML = `<b>${s.name}</b><small>${s.desc}</small>`;
    b.onclick = () => {
      sound.unlock();
      sound.tone(400 + i * 100, 0.1, 0.06);
      game.selectShip(i);
      save();
      setShips();
    };
    $("ships").append(b);
  });
}
async function refreshBoards() {
  const before = game?.state;
  await boards.fetch();
  if (game?.state === "menu") $("menu-boards").innerHTML = boards.html(3);
  if (dialogKind === "HIGH SCORES")
    $("dialog-body").innerHTML = `<div class="columns">${boards.html()}</div>`;
  return before;
}
const ui = {
  close,
  start(demo) {
    close();
    document.body.classList.add("playing");
    $("menu").hidden = true;
    visibleHud(!demo);
    $("demo-bar").hidden = !demo;
    $("pulse").querySelector("small").textContent = matchMedia(
      "(pointer:coarse)",
    ).matches
      ? "TAP WHEN READY"
      : "X / RMB";
    $("flight-note").textContent = matchMedia("(pointer:coarse)").matches
      ? "DRAG TO STEER · TAP PULSE"
      : "WASD / ARROWS · SPACE fire · X pulse · P pause";
    boards.startRun();
    this.hud();
  },
  menu() {
    close();
    document.body.classList.remove("playing");
    $("menu").hidden = false;
    visibleHud(false);
    $("boss-hud").hidden = true;
    $("demo-bar").hidden = true;
    $("toast").classList.remove("show");
    $("radio").textContent = "";
    $("menu-boards").innerHTML = boards.html(3);
    setShips();
    refreshBoards();
  },
  hud() {
    const p = game.player;
    $("score").textContent = String(Math.floor(game.score)).padStart(6, "0");
    $("wave").textContent =
      (game.isBoss ? "BOSS " : "WAVE ") + String(game.wave).padStart(2, "0");
    $("station").textContent =
      String((Math.floor((game.wave - 1) / 4) % 5) + 1).padStart(2, "0") +
      " / " +
      SECTORS[Math.floor((game.wave - 1) / 4) % 5].name;
    $("best").textContent =
      "GLOBAL BEST " + (boards.global?.[0]?.score?.toLocaleString() || "—");
    $("lives").textContent = "● ".repeat(Math.max(0, p.lives));
    $("shield").style.width = p.shield + "%";
    $("charge").style.width = p.charge + "%";
    $("weapon").textContent =
      WEAPONS[p.weapon].name +
      (p.weaponT > 0 ? " / " + Math.ceil(p.weaponT) + "s" : "");
    $("pulse").classList.toggle("ready", p.charge >= 100);
    $("pulse").firstChild.textContent =
      p.charge >= 100
        ? "RAIL PULSE READY "
        : "PULSE " + Math.floor(p.charge) + "% ";
    $("combo").hidden = game.demo || game.combo < 2;
    $("combo").querySelector("strong").textContent =
      "×" + (1 + Math.min(30, game.combo) * 0.08).toFixed(1);
    $("combo").querySelector("span").textContent =
      game.overdrive > 0
        ? "OVERDRIVE " + Math.ceil(game.overdrive) + "s"
        : game.combo + " KILL CHAIN";
    $("wave-meter").firstChild.style.width =
      Math.min(100, ((game.resolved || 0) / game.waveTotal) * 100) + "%";
    const boss = game.enemies.find((e) => e.type === "boss" && !e.dead);
    $("boss-hud").hidden = !boss || game.demo;
    if (boss) {
      $("boss-name").textContent = boss.name;
      $("boss-hp").style.width = Math.max(0, (boss.hp / boss.max) * 100) + "%";
      $("boss-phase").textContent =
        "PHASE " +
        ["I / TRACKING VOLLEYS", "II / ARMOUR BREACH", "III / EXPOSED CORE"][
          boss.phase
        ];
    }
    $("fire-toggle").textContent = settings.auto ? "AUTO FIRE" : "HOLD TO FIRE";
  },
  toast(kicker, title, note) {
    clearTimeout(toastTimer);
    $("toast").querySelector("small").textContent = kicker;
    $("toast").querySelector("strong").textContent = title;
    $("toast").querySelector("span").textContent = note;
    $("toast").classList.add("show");
    toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2700);
  },
  radio(title, text) {
    clearTimeout(radioTimer);
    $("radio").replaceChildren();
    const b = document.createElement("b");
    b.textContent = title;
    $("radio").append(b, document.createTextNode(text));
    radioTimer = setTimeout(() => $("radio").replaceChildren(), 7000);
  },
  damage() {
    clearTimeout(damageTimer);
    $("damage").style.opacity = ".45";
    damageTimer = setTimeout(() => ($("damage").style.opacity = "0"), 150);
  },
  toggleFire() {
    settings.auto = !settings.auto;
    save();
    this.hud();
  },
  toggleMute() {
    if (!muted) {
      mutedVolumes = { music: settings.music, sfx: settings.sfx };
      settings.music = 0;
      settings.sfx = 0;
    } else Object.assign(settings, mutedVolumes || { music: 0.45, sfx: 0.7 });
    muted = !muted;
    sound.apply();
    if (!muted) sound.setMusic(game.isBoss ? "boss" : "game");
  },
  pause() {
    openDialog(
      "HOLDING THE LINE",
      `<p>Drone systems suspended. Take a breath.</p><div class="stats"><div class="stat"><b>${Math.floor(game.score).toLocaleString()}</b><small>SCORE</small></div><div class="stat"><b>${game.wave}</b><small>WAVE</small></div><div class="stat"><b>${game.kills}</b><small>ELIMINATED</small></div></div>`,
      "TRANSMISSION PAUSED",
    );
    action("RESUME", () => game.resume(), true);
    action("OPTIONS", () => showSettings("pause"));
    action("END RUN & SAVE", () => game.finish());
    action("EDITIONS", () => {
      openDialog(
        "LEAVE THE LINE?",
        "<p>Your current run will end. Save your score before returning to the edition selector.</p>",
      );
      action("SAVE & END RUN", () => game.finish(), true);
      action("BACK", () => this.pause());
    });
  },
  upgrade(options) {
    openDialog(
      "REBUILD. RELOAD. ROLL OUT.",
      `<p>Wave ${game.wave} secured. Choose a permanent module for this run.</p><div class="upgrade-grid">${options.map((u, i) => `<button class="upgrade-card" data-upgrade="${u.id}"><strong>${u.icon}</strong><b>${u.name} <small>${u.id === "shield" ? "" : String((game.upgrades[u.id] || 0) + 1).padStart(2, "0")}</small></b><p>${u.desc}</p></button>`).join("")}</div>`,
      "STATION SERVICE / SELECT ONE MODULE",
    );
    $("dialog-body")
      .querySelectorAll("[data-upgrade]")
      .forEach(
        (b) => (b.onclick = () => game.chooseUpgrade(b.dataset.upgrade)),
      );
  },
  finish() {
    if (game.demo) {
      game.menu();
      return;
    }
    const total = Math.floor(game.score),
      rank =
        game.wave >= 20
          ? "STATIONMASTER"
          : game.wave >= 12
            ? "LINE COMMANDER"
            : game.wave >= 8
              ? "WARDEN BREAKER"
              : game.wave >= 4
                ? "RAIL RUNNER"
                : "NEW RECRUIT";
    const initials = String(store.get("jez237_initials", "AAA"))
      .replace(/[^A-Z0-9]/g, "")
      .padEnd(3, "A")
      .slice(0, 3);
    openDialog(
      "END OF THE LINE",
      `<p>${rank} · ${SHIPS[settings.ship].name} · ${SECTORS[Math.floor((game.wave - 1) / 4) % 5].name}</p><div class="stats"><div class="stat"><b>${total.toLocaleString()}</b><small>FINAL SCORE</small></div><div class="stat"><b>${game.wave}</b><small>WAVE REACHED</small></div><div class="stat"><b>${game.maxCombo}</b><small>BEST CHAIN</small></div></div><p style="text-align:center">Enter your callsign for the local and global high-score boards.</p><div class="initials-entry">${initials
        .split("")
        .map(
          (ch, i) =>
            `<div class="initials-slot"><button data-char="${i}" data-dir="1" aria-label="Next letter ${i + 1}">▲</button><input aria-label="Callsign letter ${i + 1}" maxlength="1" value="${ch}" autocomplete="off" autocapitalize="characters" inputmode="text" data-initial="${i}"><button data-char="${i}" data-dir="-1" aria-label="Previous letter ${i + 1}">▼</button></div>`,
        )
        .join(
          "",
        )}</div><p id="submit-status" class="status">Global board: Ironline only · Classic scores preserved.</p>`,
      "SIGNAL LOST / RUN COMPLETE",
    );
    $("boss-hud").hidden = true;
    $("dialog-body")
      .querySelectorAll("[data-char]")
      .forEach(
        (b) =>
          (b.onclick = () => {
            const input = $("dialog-body").querySelector(
                `[data-initial="${b.dataset.char}"]`,
              ),
              chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            input.value =
              chars[
                (chars.indexOf(input.value) + Number(b.dataset.dir) + 36) % 36
              ];
          }),
      );
    $("dialog-body")
      .querySelectorAll("input")
      .forEach((input, i, list) => {
        input.addEventListener("focus", () => input.select());
        input.addEventListener("input", () => {
          input.value = input.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(-1);
          if (input.value && i < 2) {
            list[i + 1].focus();
            list[i + 1].select();
          }
        });
        input.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.code === "Enter") submit.click();
          if (e.code === "ArrowLeft" && i > 0) list[i - 1].focus();
          if (e.code === "ArrowRight" && i < 2) list[i + 1].focus();
        });
      });
    const submit = action(
      "SAVE HIGH SCORE",
      async () => {
        if (boards.posting || boards.posted) return;
        const initials = [...$("dialog-body").querySelectorAll("input")]
          .map((x) => x.value || "A")
          .join("");
        boards.save(initials, total, game.wave);
        submit.disabled = true;
        leave.disabled = true;
        retry.disabled = true;
        submit.textContent = "CONNECTING…";
        $("submit-status").textContent =
          "Saved on this device. Sending to the global board…";
        const ok = await boards.post();
        if (dialogKind !== "END OF THE LINE") return;
        submit.textContent = ok ? "SCORE SAVED ✓" : "RETRY GLOBAL SAVE";
        submit.disabled = ok;
        leave.disabled = false;
        retry.disabled = false;
        $("submit-status").textContent = ok
          ? "Saved locally and on the worldwide Ironline board."
          : "Saved locally. Global submission was not confirmed; you can retry.";
        $("dialog-body")
          .querySelectorAll("input,[data-char]")
          .forEach((x) => (x.disabled = true));
      },
      true,
    );
    if (total <= 0) {
      submit.disabled = true;
      $("submit-status").textContent =
        "No score this run. Deploy again to set your first record.";
    }
    const retry = action("REDEPLOY", () => game.start());
    const leave = action("MAIN MENU", () => game.menu());
    action("EDITIONS", () => location.assign("../"));
  },
};

function showScores() {
  openDialog(
    "HIGH SCORES",
    `<div class="columns">${boards.html()}</div>`,
    "GLOBAL NETWORK / IRONLINE",
  );
  action("BACK", close, true);
  action("REFRESH", () => refreshBoards());
  refreshBoards();
}
function showHelp() {
  openDialog(
    "KNOW YOUR LINE",
    `<div class="help-grid"><div><h3>MOVE / FIRE</h3><p><span class="key">WASD</span> or arrows steer. Hold Space, J, mouse or touch to fire. Auto fire starts ON; use <span class="key">F</span> or the HUD button to change it. Touch: drag anywhere on the field. Gamepad: left stick + A / RT.</p></div><div><h3>RAIL PULSE</h3><p><span class="key">X</span>, right click, gamepad B or the PULSE button. At 100%, clear hostile shots and damage everything. Kills recharge it. You are briefly protected during the blast.</p></div><div><h3>READ THE THREATS</h3><p>Hunters lead their shots. Weavers cross-fire. Sentries hold position. Splitters become two fast drones. Stay off flashing amber tracks: an express train is incoming. Trains can be destroyed for a bounty.</p></div><div><h3>BUILD YOUR RUN</h3><p>A module choice every two waves. A three-phase boss every four. Weapons last 20 seconds. Green supplies restore shield; amber supplies charge pulse. Chain 12 kills to activate overdrive.</p></div><div><h3>SCORE FAIRLY</h3><p>Only destroyed enemies earn bounties. Escapes damage your hull and award nothing. Flawless waves earn a bonus. Ironline and Classic have separate global boards. Demo runs never submit scores.</p></div><div><h3>STAY IN CONTROL</h3><p><span class="key">P / Esc</span> pauses. <span class="key">M</span> mutes. Leaving the tab pauses the run. Options include reduced motion and a low-effects mode. There is no final wave: the five-sector route continues with stronger opposition.</p></div></div>`,
  );
  action("GOT IT", close, true);
}
function showSettings(from = "menu") {
  openDialog(
    "DRONE SYSTEMS",
    `<label class="setting">MUSIC <input id="music-vol" type="range" min="0" max="1" step=".05" value="${settings.music}" aria-label="Music volume"></label><label class="setting">EFFECTS <input id="sfx-vol" type="range" min="0" max="1" step=".05" value="${settings.sfx}" aria-label="Effects volume"></label><div class="setting"><span>FIRE MODE</span><button id="option-fire">${settings.auto ? "AUTO FIRE" : "HOLD TO FIRE"}</button></div><div class="setting"><span>REDUCED MOTION</span><button id="option-motion">${settings.motion ? "ON" : "OFF"}</button></div><div class="setting"><span>VISUAL QUALITY</span><button id="option-quality">${settings.quality.toUpperCase()}</button></div><p>Ultra adds full-resolution light, three haze layers and sharper shadows. High keeps wet-floor reflections, volumetric haze and post effects. Low disables bloom, reflections and haze and reduces particles. Auto starts at the best tier for your screen and steps down if the frame rate stays low.</p>`,
  );
  for (const name of ["music", "sfx"])
    $(name + "-vol").oninput = (e) => {
      settings[name] = Number(e.target.value);
      save();
      sound.apply();
      if (name === "music")
        sound.setMusic(
          from === "pause"
            ? null
            : game.state === "menu"
              ? "menu"
              : game.isBoss
                ? "boss"
                : "game",
        );
    };
  $("option-fire").onclick = () => {
    ui.toggleFire();
    $("option-fire").textContent = settings.auto ? "AUTO FIRE" : "HOLD TO FIRE";
  };
  $("option-motion").onclick = () => {
    settings.motion = !settings.motion;
    save();
    $("option-motion").textContent = settings.motion ? "ON" : "OFF";
  };
  $("option-quality").onclick = () => {
    const modes = ["auto", "ultra", "high", "low"];
    settings.quality = modes[(modes.indexOf(settings.quality) + 1) % 4];
    save();
    world.setQuality(tierFor(settings.quality));
    $("option-quality").textContent = settings.quality.toUpperCase();
  };
  action("BACK", () => (from === "pause" ? ui.pause() : close()), true);
}

async function boot() {
  boards = new Scores();
  sound = new Sound(settings);
  world = new World($("world"), settings);
  world.setQuality(tierFor(settings.quality));
  game = new Game(world, sound, settings, ui);
  $("deploy").onclick = () => game.start();
  $("watch").onclick = () => game.start(true);
  $("scores-open").onclick = showScores;
  $("help-open").onclick = showHelp;
  $("settings-open").onclick = () => {
    sound.unlock();
    showSettings();
  };
  $("pause").onclick = () => game.pause();
  $("pulse").onclick = () => {
    sound.unlock();
    game.pulse();
  };
  $("fire-toggle").onclick = () => ui.toggleFire();
  $("demo-exit").onclick = () => game.start();
  game.menu();
  world.update(1 / 60, game);
  $("loading").hidden = true;
  let previous = performance.now(),
    acc = 0,
    frames = 0,
    elapsed = 0,
    fps = 60,
    slowWindows = 0,
    lifeFrames = 0;
  let padStart = false;
  function frame(now) {
    requestAnimationFrame(frame);
    const realDt = (now - previous) / 1000,
      dt = Math.min(0.12, realDt);
    previous = now;
    const start = !!navigator.getGamepads?.()?.[0]?.buttons[9]?.pressed;
    if (start && !padStart) {
      if (game.state === "paused") game.resume();
      else if (game.state === "play") game.pause();
    }
    padStart = start;
    if (document.hidden) return;
    acc += dt;
    let steps = 0;
    while (acc >= 1 / 60 && steps < 7) {
      game.update(1 / 60);
      acc -= 1 / 60;
      steps++;
    }
    world.update(Math.min(0.05, dt), game);
    sound.update(Math.min(0.05, dt), game);
    frames++;
    lifeFrames++;
    elapsed += realDt;
    if (elapsed >= 2) {
      fps = frames / elapsed;
      frames = 0;
      elapsed = 0;
      if (settings.quality === "auto" && !world.low) {
        slowWindows = fps < (world.level === "ultra" ? 50 : 33) ? slowWindows + 1 : 0;
        if (slowWindows >= 3) {
          slowWindows = 0;
          const next = world.level === "ultra" ? "high" : "low";
          world.setQuality(next);
          ui.radio(
            "SYSTEMS / ADAPTIVE RENDER",
            next === "high"
              ? "Render tier lowered to High to hold the frame rate."
              : "Low-effects mode enabled to keep the line moving.",
          );
        }
      }
    }
  }
  requestAnimationFrame(frame);
  if (new URLSearchParams(location.search).has("qa")) {
    window.__ironline = {
      game,
      world,
      sound,
      boards,
      snapshot: () => ({
        ...game.snapshot(),
        fps: Math.round(fps),
        drawCalls: world.renderer.info.render.calls,
        triangles: world.renderer.info.render.triangles,
        low: !!world.low,
        level: world.level,
        particles: world.particles.length,
        sparks: world.sparks.length,
        smoke: world.smoke.puffs.length,
        lights: world.lightField.count,
        streaks: world.streaks.count,
        settings: { ...settings },
      }),
      start: () => game.start(),
      wave(n) {
        game.clear();
        game.state = "play";
        game.wave = n;
        game.beginWave();
      },
      finish: () => game.finish(),
      spawn: (type, x, z) => game.spawnEnemy(type, x, z),
      damage: () => game.damage(),
      killAll() {
        for (const e of [...game.enemies]) game.kill(e);
      },
      drop: (type, weapon) =>
        game.drop(game.player.x, game.player.z, type, weapon),
      upgrade: (id) => game.chooseUpgrade(id),
      pulse: () => game.pulse(),
      pause: () => game.pause(),
      resume: () => game.resume(),
    };
  }
}
boot().catch((error) => {
  console.error(error);
  $("load-note").textContent =
    "The 3D renderer could not start. Enable WebGL / hardware acceleration, or play Classic.";
  const a = document.createElement("a");
  a.href = "../classic/";
  a.textContent = "PLAY CLASSIC →";
  a.style.marginTop = "20px";
  $("loading").append(a);
});
