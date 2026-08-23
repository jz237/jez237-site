const GAME_AUDIO = "/games/2026-08-20/final-blow/assets/audio";
const STORAGE_KEY = "final-blow-sfx-review-v1";

// Jez's completed 2026-08-23 review is the baseline. Rejected recordings have
// been removed from both the game and this temporary lab, so only the 51
// accepted sounds and the two still-unrated sounds are allowed onto the board.
const APPROVED_IDS = new Set([
  "shared-jump", "shared-light-swing", "shared-heavy-swing", "shared-body-hit",
  "shared-finish-ready", "shared-knockout",
  "deathblow-jump", "deathblow-light", "deathblow-heavy", "deathblow-special",
  "deathblow-throw", "deathblow-super",
  "alan-jump", "alan-light", "alan-heavy", "alan-hit-light",
  "benny-special", "donald-jump", "donald-heavy", "ali-dash", "ali-super",
  "deathblow-light-kick-swing-a", "deathblow-roundhouse-swing-a",
  "deathblow-roundhouse-swing-b", "deathblow-roundhouse-impact-b",
  "jez-light-kick-swing-a", "jez-light-kick-swing-b", "jez-roundhouse-impact-b",
  "alan-light-kick-swing-a", "alan-light-kick-swing-b", "alan-roundhouse-swing-a",
  "alan-light-kick-impact-b", "alan-roundhouse-impact-a",
  "post-light-kick-swing-a", "post-light-kick-swing-b", "post-light-kick-impact-a",
  "post-roundhouse-impact-b", "benny-light-kick-swing-b",
  "benny-roundhouse-swing-a", "benny-roundhouse-swing-b", "benny-roundhouse-impact-a",
  "donald-roundhouse-swing-a", "donald-roundhouse-swing-b",
  "cyraxx-light-kick-swing-a", "cyraxx-roundhouse-swing-a",
  "cyraxx-roundhouse-swing-b", "cyraxx-light-kick-impact-a",
  "cyraxx-roundhouse-impact-a", "cyraxx-roundhouse-impact-b",
  "ali-light-kick-swing-a", "ali-roundhouse-swing-b",
]);
const SURVIVOR_IDS = new Set([...APPROVED_IDS, "shared-ui-select", "post-light-kick-impact-b"]);

const fighters = [
  { id: "deathblow", name: "DeathBlow", color: "#f3b53f" },
  { id: "jez", name: "Jez", color: "#57dcff" },
  { id: "alan", name: "Allan", color: "#6fe36d" },
  { id: "post", name: "Post", color: "#ff5bb7" },
  { id: "benny", name: "Benny", color: "#d9e2f3" },
  { id: "donald", name: "Donald", color: "#ffc34a" },
  { id: "cyraxx", name: "Cyraxx", color: "#b084ff" },
  { id: "ali", name: "Ali G", color: "#ffed49" },
];

const categoryDefinitions = [
  { id: "ui", name: "UI & Menu", description: "Selection and interface confirmation." },
  { id: "movement", name: "Movement", description: "Jumps and dashes for every fighter." },
  { id: "jab-swing", name: "Jab Swings", description: "Current light-attack launches, reassigned to LP jab." },
  { id: "hook-swing", name: "Hook Swings", description: "Current heavy-attack launches, reassigned to HP hook." },
  { id: "light-kick-swing", name: "Light Kick Swings", description: "Two new candidates per fighter; choose one winner in each pair." },
  { id: "roundhouse-swing", name: "Roundhouse Swings", description: "Two new candidates per fighter; choose one winner in each pair." },
  { id: "special", name: "Special Moves", description: "Personal move and shared special-launch cues." },
  { id: "super", name: "Supers", description: "Full Grit super cues." },
  { id: "throw", name: "Throws", description: "Character-specific grab and throw cues." },
  { id: "jab-impact", name: "Jab Impacts", description: "Current light-hit impacts, reassigned to punches." },
  { id: "hook-impact", name: "Hook Impacts", description: "Current heavy-hit impacts, reassigned to punches." },
  { id: "light-kick-impact", name: "Light Kick Impacts", description: "Two new contact candidates per fighter; choose one winner in each pair." },
  { id: "roundhouse-impact", name: "Roundhouse Impacts", description: "Two new contact candidates per fighter; choose one winner in each pair." },
  { id: "block", name: "Blocks & Defense", description: "Guard impacts and shared defensive fallback." },
  { id: "final", name: "Final Blow", description: "Readiness, callout, and fighter-specific fatality cues." },
  { id: "ko", name: "Knockouts", description: "Fighter-specific and shared knockout cues." },
];

const sounds = [];
const add = (sound) => {
  if (SURVIVOR_IDS.has(sound.id)) sounds.push(Object.freeze(sound));
};

add({ id: "shared-ui-select", category: "ui", title: "Menu Select", fighter: "Shared", color: "#a3a6b0", source: `${GAME_AUDIO}/ui-select.mp3`, origin: "current" });
add({ id: "shared-jump", category: "movement", title: "Generic Jump Fallback", fighter: "Shared", color: "#a3a6b0", source: `${GAME_AUDIO}/jump.mp3`, origin: "current" });
add({ id: "shared-light-swing", category: "jab-swing", title: "Generic Jab Fallback", fighter: "Shared", color: "#a3a6b0", source: `${GAME_AUDIO}/light-swing.mp3`, origin: "current" });
add({ id: "shared-heavy-swing", category: "hook-swing", title: "Generic Hook Fallback", fighter: "Shared", color: "#a3a6b0", source: `${GAME_AUDIO}/heavy-swing.mp3`, origin: "current" });
add({ id: "shared-body-hit", category: "jab-impact", title: "Generic Body Impact", fighter: "Shared", color: "#a3a6b0", source: `${GAME_AUDIO}/body-hit.mp3`, origin: "current" });
add({ id: "shared-finish-ready", category: "final", title: "Final Blow Ready", fighter: "Shared", color: "#ff3b43", source: `${GAME_AUDIO}/finish-ready.mp3`, origin: "current" });
add({ id: "shared-knockout", category: "ko", title: "Generic Knockout", fighter: "Shared", color: "#a3a6b0", source: `${GAME_AUDIO}/knockout.mp3`, origin: "current" });

const cueCategories = {
  jump: ["movement", "Jump"],
  dash: ["movement", "Dash"],
  light: ["jab-swing", "Jab Swing"],
  heavy: ["hook-swing", "Hook Swing"],
  special: ["special", "Special Move"],
  throw: ["throw", "Throw"],
  "hit-light": ["jab-impact", "Jab Impact"],
  "hit-heavy": ["hook-impact", "Hook Impact"],
  block: ["block", "Block"],
  super: ["super", "Full Grit Super"],
  fatal: ["final", "Fatality"],
  ko: ["ko", "Knockout"],
};

for (const fighter of fighters) {
  for (const [cue, [category, title]] of Object.entries(cueCategories)) {
    add({
      id: `${fighter.id}-${cue}`,
      category,
      title,
      fighter: fighter.name,
      color: fighter.color,
      source: `${GAME_AUDIO}/fighters/${fighter.id}/${cue}.mp3`,
      origin: "current",
    });
  }
}

const candidateKinds = [
  ["light-kick-swing", "Light Kick Swing"],
  ["roundhouse-swing", "Roundhouse Swing"],
  ["light-kick-impact", "Light Kick Impact"],
  ["roundhouse-impact", "Roundhouse Impact"],
];

for (const fighter of fighters) {
  for (const [category, title] of candidateKinds) {
    for (const variant of ["a", "b"]) {
      add({
        id: `${fighter.id}-${category}-${variant}`,
        category,
        title: `${title} · ${variant.toUpperCase()}`,
        fighter: fighter.name,
        color: fighter.color,
        source: `audio/${fighter.id}/${category}-${variant}.mp3`,
        origin: "candidate",
        group: `${fighter.id}-${category}`,
      });
    }
  }
}

const board = document.querySelector("#soundBoard");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const toast = document.querySelector("#toast");
const player = new Audio();
player.preload = "metadata";
let activeSoundId = "";
let activeFilter = "all";
let query = "";
let toastTimer = 0;

function loadDecisions() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const saved = stored && typeof stored === "object" ? stored : {};
    return Object.fromEntries([...SURVIVOR_IDS].flatMap((id) => {
      const status = saved[id] || (APPROVED_IDS.has(id) ? "accepted" : "");
      return status ? [[id, status]] : [];
    }));
  } catch {
    return Object.fromEntries([...APPROVED_IDS].map((id) => [id, "accepted"]));
  }
}

const decisions = loadDecisions();

function saveDecisions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
}

function waveform(soundId) {
  let seed = [...soundId].reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 2166136261);
  return Array.from({ length: 18 }, () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const height = 22 + (seed % 78);
    return `<i style="--bar:${height}%"></i>`;
  }).join("");
}

function matches(sound) {
  const status = decisions[sound.id] || "unrated";
  if (activeFilter !== "all" && status !== activeFilter) return false;
  if (!query) return true;
  return `${sound.fighter} ${sound.title} ${sound.category}`.toLowerCase().includes(query);
}

function cardMarkup(sound) {
  const status = decisions[sound.id] || "unrated";
  return `
    <article class="sound-card" data-sound-id="${sound.id}" data-status="${status}" style="--fighter-color:${sound.color}">
      <button class="play" data-action="play" aria-label="Play ${sound.fighter} ${sound.title}">▶</button>
      <div class="sound-card__body">
        <div class="sound-card__top">
          <div>
            <h3>${sound.title}</h3>
            <p class="sound-card__fighter">${sound.fighter}</p>
          </div>
          <span class="source-tag ${sound.origin === "candidate" ? "source-tag--candidate" : ""}">${sound.origin}</span>
        </div>
        <div class="wave" aria-hidden="true">${waveform(sound.id)}</div>
        <div class="decisions">
          <button class="decision decision--reject" data-action="reject" aria-label="Reject ${sound.fighter} ${sound.title}">✕</button>
          <button class="decision decision--accept" data-action="accept" aria-label="Accept ${sound.fighter} ${sound.title}">✓</button>
        </div>
      </div>
    </article>`;
}

function render() {
  const groups = categoryDefinitions.map((category) => ({
    ...category,
    sounds: sounds.filter((sound) => sound.category === category.id && matches(sound)),
  })).filter((category) => category.sounds.length);

  board.innerHTML = groups.map((category) => `
    <section class="category" id="category-${category.id}">
      <header class="category__head">
        <div><h2>${category.name}</h2><p>${category.description}</p></div>
        <span class="category__count">${category.sounds.length} sound${category.sounds.length === 1 ? "" : "s"}</span>
      </header>
      <div class="sound-grid">${category.sounds.map(cardMarkup).join("")}</div>
    </section>`).join("");

  emptyState.hidden = groups.length > 0;
  refreshSummary();
}

function refreshSummary() {
  const accepted = sounds.filter((sound) => decisions[sound.id] === "accepted").length;
  const rejected = sounds.filter((sound) => decisions[sound.id] === "rejected").length;
  const reviewed = accepted + rejected;
  document.querySelector("#totalCount").textContent = String(sounds.length);
  document.querySelector("#acceptedCount").textContent = String(accepted);
  document.querySelector("#rejectedCount").textContent = String(rejected);
  document.querySelector("#unratedCount").textContent = String(sounds.length - reviewed);
  document.querySelector("#reviewProgress").textContent = `${reviewed} / ${sounds.length} reviewed`;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function setDecision(soundId, nextStatus) {
  if (decisions[soundId] === nextStatus) delete decisions[soundId];
  else decisions[soundId] = nextStatus;
  saveDecisions();
  const card = board.querySelector(`[data-sound-id="${CSS.escape(soundId)}"]`);
  if (card) card.dataset.status = decisions[soundId] || "unrated";
  if (activeFilter !== "all") render();
  else refreshSummary();
}

function stopPlayer() {
  player.pause();
  document.querySelectorAll(".sound-card.is-playing").forEach((card) => {
    card.classList.remove("is-playing");
    card.querySelector(".play").textContent = "▶";
  });
  activeSoundId = "";
}

async function playSound(sound, card) {
  if (activeSoundId === sound.id && !player.paused) {
    stopPlayer();
    return;
  }
  stopPlayer();
  activeSoundId = sound.id;
  player.src = sound.source;
  card.classList.add("is-playing");
  card.querySelector(".play").textContent = "■";
  try {
    await player.play();
  } catch {
    stopPlayer();
    showToast(sound.origin === "candidate" ? "Candidate audio is not generated yet" : "Sound could not be played");
  }
}

player.addEventListener("ended", stopPlayer);
player.addEventListener("error", stopPlayer);

board.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  const card = event.target.closest(".sound-card");
  if (!button || !card) return;
  const sound = sounds.find((entry) => entry.id === card.dataset.soundId);
  if (!sound) return;
  if (button.dataset.action === "play") playSound(sound, card);
  if (button.dataset.action === "accept") setDecision(sound.id, "accepted");
  if (button.dataset.action === "reject") setDecision(sound.id, "rejected");
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    activeFilter = button.dataset.filter;
    stopPlayer();
    render();
  });
});

searchInput.addEventListener("input", () => {
  query = searchInput.value.trim().toLowerCase();
  stopPlayer();
  render();
});

function resultsPayload() {
  const accepted = sounds.filter((sound) => decisions[sound.id] === "accepted").map((sound) => sound.id);
  const rejected = sounds.filter((sound) => decisions[sound.id] === "rejected").map((sound) => sound.id);
  const candidateGroups = Object.fromEntries([...new Set(sounds.filter((sound) => sound.group).map((sound) => sound.group))].map((group) => [
    group,
    sounds.filter((sound) => sound.group === group && decisions[sound.id] === "accepted").map((sound) => sound.id),
  ]));
  return {
    format: "final-blow-sfx-review-v1",
    reviewedAt: new Date().toISOString(),
    totals: { sounds: sounds.length, accepted: accepted.length, rejected: rejected.length },
    accepted,
    rejected,
    candidateGroups,
  };
}

document.querySelector("#copyButton").addEventListener("click", async () => {
  const text = JSON.stringify(resultsPayload());
  try {
    await navigator.clipboard.writeText(text);
    showToast("Results copied — paste them to Kosh");
  } catch {
    showToast("Clipboard blocked — use Download JSON");
  }
});

document.querySelector("#downloadButton").addEventListener("click", () => {
  const blob = new Blob([`${JSON.stringify(resultsPayload(), null, 2)}\n`], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "final-blow-sfx-review.json";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  showToast("Review JSON downloaded");
});

render();
