import { musicCues } from "./music-cues.mjs";
import {
  initPhysics,
  Simulation,
  FixedClock,
  DemoController,
  STEP,
  PHYSICS_VERSION,
  RADIUS,
} from "./physics.mjs";
import { proofCourse, validateCourse, part, point } from "./course.mjs";
import { campaignCourses, practiceCourse } from "./campaign.mjs";
import { CampaignRun } from "./rules.mjs";
import { bonusCourses } from "./bonus.mjs";
import {
  blankCourse,
  workshopObjects,
  makeWorkshopPart,
  moveWorkshopObject,
  removeWorkshopObject,
  rotateWorkshopObject,
} from "./workshop.mjs";
import { DioramaView } from "./view.mjs";
import { Inputs } from "./input.mjs";
import { AudioEngine } from "./audio.mjs";
import {
  medalTargets,
  recordContext,
  recordSummary,
  saveFinishedRun,
} from "./records.mjs";
import {
  loadStore,
  saveStore,
  recordKey,
  Recording,
  seekRecording,
  ghostAt,
} from "./storage.mjs";
const $ = (id) => document.getElementById(id),
  show = (id, v = true) => ($(id).hidden = !v);
const store = loadStore(),
  audio = new AudioEngine();
audio.verifiedCues = musicCues;
let view,
  sim,
  clock,
  inputs,
  recording,
  lastRecording,
  ghost,
  runMode = "menu",
  paused = false,
  demoControllers = [],
  replayPaused = false,
  replaySpeed = 1,
  selected = practiceCourse(),
  editCourse = null,
  undo = [],
  redo = [],
  toastTimer;
let campaign = null,
  campaignOutcome = null,
  campaignDemo = false,
  campaignTransition = null,
  lastRunWasDemo = false;
const toast = (text) => {
  $("toast").textContent = text;
  $("toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("visible"), 3000);
};
function persist(successMessage) {
  let pruned = 0;
  const saved = saveStore(store, { onPrune: (count) => (pruned = count) });
  if (!saved)
    toast(
      "Local storage is full or unavailable. Export your course to keep it.",
    );
  else if (pruned)
    toast(
      "Saved. Storage was full, so older replay or ghost data was cleared. Scores and courses are kept.",
    );
  else if (successMessage) toast(successMessage);
  return saved;
}
audio.onMusicError = (reason) => {
  console.error("Amiga music:", reason);
  $("musicStatus").textContent = `Music could not load: ${reason}`;
  toast("Music could not load. Restart the race to retry.");
};
function options() {
  return {
    players: Number($("players").value),
    difficulty: Number($("difficulty").value),
    untimed: $("mode").value === "untimed",
    assisted: $("assisted").checked,
    seed: 237,
  };
}
function settings() {
  const s = store.settings;
  audio.volumes(s.music, s.effects);
  inputs.sensitivity = s.sensitivity;
  inputs.trackball = $("trackball").checked;
  view.setQuality(s.quality);
}
function refreshCourses() {
  const list = $("courseList");
  const recordOptions = {
    ...options(),
    campaign: $("recordScope").value === "campaign",
  };
  $("recordContext").textContent = recordContext(recordOptions);
  list.replaceChildren();
  for (const c of [
    ...campaignCourses(),
    ...bonusCourses(),
    proofCourse(),
    ...store.courses,
  ]) {
    const btn = document.createElement("button");
    btn.className = "course-choice";
    const label = document.createElement("span"),
      title = document.createElement("strong"),
      desc = document.createElement("small");
    label.textContent =
      c.category === "campaign"
        ? `AMIGA COURSE ${c.courseNumber} · RECONSTRUCTION`
        : c.category === "bonus"
          ? "BONUS COURSE"
          : c.category === "proof"
            ? "PHYSICS STUDY"
            : "CUSTOM COURSE";
    title.textContent = c.name;
    desc.textContent = c.subtitle ?? "Your own miniature world";
    btn.append(label, title, desc);
    const targets = document.createElement("small");
    targets.className = "medal-targets";
    targets.textContent = medalTargets(c);
    btn.append(targets);
    for (let i = 0; i < recordOptions.players; i++) {
      const best = document.createElement("small");
      best.className = "record-summary";
      best.textContent = recordSummary(store, c, recordOptions, i);
      btn.append(best);
    }
    btn.onclick = () => {
      selected = structuredClone(c);
      menu();
      $("courseDialog").close();
    };
    list.append(btn);
  }
}
function refreshSelectedRecords() {
  const opts = options();
  $("selectedTargets").textContent = medalTargets(selected);
  $("selectedRecordContext").textContent = recordContext(opts);
  $("selectedRecords").replaceChildren();
  for (let i = 0; i < opts.players; i++) {
    const row = document.createElement("p");
    row.textContent = recordSummary(store, selected, opts, i);
    $("selectedRecords").append(row);
  }
}
function finishAwards() {
  const root = $("resultAwards");
  root.replaceChildren();
  show("resultAwards", runMode === "play");
  if (runMode !== "play") return;
  const outcome = saveFinishedRun(store, {
    course: selected,
    options: sim.options,
    players: sim.players,
    recording,
    mode: runMode,
  });
  const context = document.createElement("p");
  context.className = "record-context";
  context.textContent = recordContext(sim.options);
  root.append(context);
  for (const result of outcome.results) {
    const row = document.createElement("div"),
      badge = document.createElement("span"),
      detail = document.createElement("div"),
      title = document.createElement("strong"),
      note = document.createElement("small");
    row.className = "award-row";
    badge.className = "medal-badge " + (result.medal ?? "unfinished");
    badge.textContent = result.medal ? result.medal[0].toUpperCase() : "—";
    badge.setAttribute("aria-hidden", "true");
    title.textContent =
      `Player ${result.index + 1} · ` +
      (result.finished
        ? `${result.medal[0].toUpperCase() + result.medal.slice(1)} · ${result.time.toFixed(2)}s`
        : "Out of time");
    note.textContent = !result.finished
      ? "Finish the course to earn a medal."
      : outcome.saved
        ? `${result.personalBest ? "New personal best!" : `Best ${result.bestTime.toFixed(2)}s`} · High score ${result.bestScore}`
        : "Run complete, but this result could not be saved.";
    detail.append(title, note);
    row.append(badge, detail);
    root.append(row);
  }
  const note = document.createElement("p");
  note.className = "record-context";
  note.textContent =
    outcome.saved === false
      ? "Local storage is full or unavailable. Your previous records are unchanged."
      : outcome.saved
        ? "Saved on this device." +
          (outcome.pruned
            ? " Older replay or ghost data was cleared to make room."
            : "")
        : medalTargets(selected);
  root.append(note);
}
function setSim(next) {
  sim?.dispose();
  sim = next;
  view.load(sim);
}
function menu() {
  campaign = null;
  campaignOutcome = null;
  campaignTransition = null;
  runMode = "menu";
  paused = false;
  clock.pause(true);
  audio.stop();
  audio.pause();
  document.body.classList.remove("playing");
  for (const id of [
    "hud",
    "pauseCard",
    "result",
    "replayBar",
    "touchControls",
    "editor",
  ])
    show(id, false);
  show("intro");
  show("sceneLabel");
  $("courseName").textContent = selected.name;
  $("demoRoute").replaceChildren();
  for (const route of [
    { id: "", name: "Main route" },
    ...(selected.alternateRoutes ?? []),
  ]) {
    const option = document.createElement("option");
    option.value = route.id;
    option.textContent = route.name;
    $("demoRoute").append(option);
  }
  show("demoRoutes", !!selected.alternateRoutes?.length);
  $("sceneLabel").children[0].textContent =
    selected.category === "campaign"
      ? `${String(selected.courseNumber).padStart(2, "0")} / ${selected.name.toUpperCase()}`
      : selected.category === "bonus"
        ? "BONUS / " + selected.name.toUpperCase()
        : selected.category === "custom"
          ? "YOUR COURSE"
          : "PHYSICS STUDY";
  $("courseDescription").textContent =
    selected.subtitle ??
    "Slopes, ceramic channels and a moving bridge. Explore the new physical world.";
  refreshSelectedRecords();
  setSim(new Simulation(selected, { untimed: true }));
  view.setOrbit(true);
  view.frameOverview();
  $("status").textContent = "Workshop preview · locally bundled physics";
  inputs.reset();
  view.resize();
}
async function start(demo = false, course = selected, run = null) {
  campaignTransition = null;
  await audio.unlock();
  campaign = run;
  campaignOutcome = null;
  lastRunWasDemo = demo;
  selected = structuredClone(course);
  const simulationCourse = structuredClone(selected);
  const alternative =
    demo && !run
      ? simulationCourse.alternateRoutes?.find(
          (r) => r.id === $("demoRoute").value,
        )
      : null;
  if (alternative) {
    const routes = simulationCourse.playerRoutes ?? [
      simulationCourse.route,
      simulationCourse.route,
    ];
    simulationCourse.playerRoutes = [
      alternative.route,
      routes[alternative.start === 1 ? 0 : 1],
    ];
    simulationCourse.route = alternative.route;
    if (alternative.start === 1) simulationCourse.starts.reverse();
  }
  setSim(
    new Simulation(simulationCourse, {
      ...(run?.options ?? options()),
      ...(demo ? { untimed: true } : {}),
    }),
  );
  run?.prepare(sim);
  runMode = demo ? "demo" : "play";
  paused = false;
  clock.pause(false);
  recording = new Recording(sim);
  demoControllers = sim.players.map(() => new DemoController());
  const saved = store.records[recordKey(selected, sim.options)];
  ghost = saved?.ghost ?? null;
  const cue = selected.musicCue ?? selected.id;
  $("musicStatus").textContent = "Loading original Amiga music�";
  audio.playCue(musicCues[cue] ? cue : "practice").then((playing) => {
    if (playing)
      $("musicStatus").textContent = "Original Amiga music is playing.";
  });
  for (const id of ["intro", "result", "pauseCard", "replayBar", "editor"])
    show(id, false);
  show("hud");
  show("pause");
  show("restart");
  show("touchControls", !demo);
  show("touchP2", sim.players.length === 2);
  document.body.classList.add("playing");
  $("raceName").textContent = selected.name;
  $("raceCategory").textContent = demo
    ? "DEMO · NORMAL STEERING"
    : selected.category === "campaign"
      ? "AMIGA COURSE RECONSTRUCTION"
      : "PHYSICS WORKSHOP";
  if (campaign)
    $("raceCategory").textContent =
      `${demo ? "DEMO · " : ""}CAMPAIGN ${campaign.index + 1} / 6${sim.options.untimed ? " · UNTIMED" : ""}`;
  view.setOrbit(false);
  view.follow();
  view.resize();
  inputs.reset();
  $("status").textContent = demo
    ? "Demo uses the same steering and physics"
    : "120 Hz physics · local saves";
  renderHud();
}
function beginCampaign(demo = false) {
  campaignDemo = demo;
  const run = new CampaignRun({ ...options(), campaign: true });
  if (demo) run.options.untimed = true;
  start(demo, campaignCourses()[0], run);
}
function continueCampaign() {
  campaignTransition = null;
  if (campaign && campaignOutcome === "next")
    start(
      campaignDemo,
      campaignCourses().find((c) => c.id === campaign.courseId),
      campaign,
    );
}
function restart() {
  if (campaign && campaignOutcome) beginCampaign(campaignDemo);
  else start(lastRunWasDemo, selected, campaign);
}
function pause(value = !paused) {
  if (!["play", "demo"].includes(runMode)) return;
  paused = value;
  clock.pause(value);
  show("pauseCard", value);
  view.setOrbit(value);
  inputs.reset();
  if (value) audio.pause();
  else audio.resume();
}
function renderHud() {
  const root = $("scores");
  if (root.children.length !== sim.players.length) {
    root.replaceChildren();
    for (let i = 0; i < sim.players.length; i++) {
      const d = document.createElement("div");
      d.className = "score" + (i ? " blue" : "");
      d.innerHTML = "<span></span><b></b><small></small>";
      root.append(d);
    }
  }
  sim.players.forEach((p, i) => {
    const d = root.children[i];
    d.children[0].textContent = `PLAYER ${i + 1} · ${p.status === "racing" && sim.tick < p.stunnedUntil ? "DIZZY" : p.status.toUpperCase()}`;
    d.children[1].textContent = sim.options.untimed ? "∞" : p.time.toFixed(1);
    const total =
      campaignOutcome === "complete" && runMode !== "replay"
        ? campaign.players[i]
        : p;
    d.children[2].textContent = `${total.score.toString().padStart(5, "0")} POINTS · ${total.deaths} FALLS`;
  });
}
function finish() {
  renderHud();
  lastRecording = recording;
  clock.pause(true);
  audio.finishRace();
  show("result");
  show("touchControls", false);
  view.setOrbit(true);
  const winner =
    sim.players
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.status === "finished")
      .sort((a, b) => a.p.finishTick - b.p.finishTick)[0]?.i ?? -1;
  $("resultLabel").textContent =
    runMode === "demo"
      ? "DEMONSTRATION COMPLETE"
      : winner < 0
        ? "OUT OF TIME"
        : "COURSE COMPLETE";
  $("resultTitle").textContent =
    winner < 0 ? "Another way down." : "Beautifully rolled.";
  $("resultText").textContent =
    winner < 0
      ? "Follow the channels and brake before the edges."
      : `${sim.players.length === 2 ? `Player ${winner + 1} · ` : ""}${(sim.players[winner].finishTick * STEP).toFixed(2)} seconds · ${sim.players[winner].score} points${sim.options.assisted ? " · assisted" : ""}`;
  $("again").textContent = "Roll again ↻";
  finishAwards();
  if (campaign) {
    campaignOutcome = campaign.complete(sim);
    const totals = campaign.players
      .map(
        (p, i) =>
          `Player ${i + 1}: ${p.score} points · ${p.deaths} falls${p.active ? "" : " · out of time"}`,
      )
      .join(" | ");
    if (campaignOutcome === "next") {
      const next = campaignCourses().find((c) => c.id === campaign.courseId);
      $("resultTitle").textContent = `Next: ${next.name}`;
      $("resultText").textContent =
        totals +
        (campaign.courseId === "beginner"
          ? ". Beginner starts with 75 clock units."
          : ". Each surviving player carries their remaining time.") +
        campaign.nextTimeBonuses
          .map((bonus, i) =>
            bonus
              ? ` Player ${i + 1} won this race: +${bonus} clock units next race.`
              : "",
          )
          .join("");
      $("again").textContent = "Next race →";
      if (campaignDemo) campaignTransition = performance.now() + 2500;
    } else {
      $("resultLabel").textContent =
        campaignOutcome === "complete" ? "CAMPAIGN COMPLETE" : "GAME OVER";
      $("resultTitle").textContent =
        campaignOutcome === "complete"
          ? "All six worlds, rolled."
          : "The clock caught up.";
      $("resultText").textContent =
        totals +
        (campaignOutcome === "complete"
          ? ". Finish bonus: 20,000 + 1,000 per remaining clock unit − 1,000 per fall. Untimed runs receive no time bonus."
          : "");
      $("again").textContent = "Restart campaign ↻";
      if (!campaignDemo && campaignOutcome === "complete") {
        store.campaignRecords ??= [];
        store.campaignRecords.push({
          physics: PHYSICS_VERSION,
          options: campaign.options,
          players: campaign.players,
          results: campaign.results,
          date: new Date().toISOString(),
        });
        store.campaignRecords = store.campaignRecords.slice(-20);
        persist();
      }
    }
  }
  if (campaignOutcome === "complete") {
    audio.resume();
    audio.playCue("ending");
  }
  runMode = "result";
  renderHud();
}
function step() {
  if (!sim) return;
  if (runMode === "replay") {
    if (replayPaused || sim.tick >= lastRecording.inputs.length) return;
    sim.step(lastRecording.inputs[sim.tick]);
    $("seek").value = sim.tick;
    return;
  }
  if (!["play", "demo"].includes(runMode)) return;
  const controls =
    runMode === "demo"
      ? demoControllers.map((d, i) => d.input(sim, i))
      : inputs.read(sim.players.length);
  const events = sim.step(controls);
  recording.capture(sim, controls);
  for (const e of events) {
    if (e.type === "impact" || e.type === "fall") view.effect(e);
    audio.event(e, sim.options.assisted);
    if (e.type === "checkpoint" && sim.options.assisted)
      toast("Checkpoint reached");
    if (e.type === "fall") toast(`Player ${e.player + 1} · back in a moment`);
    if (e.type === "landing-bonus")
      toast(`Player ${e.player + 1} · landing bonus +${e.score} points`);
    if (e.type === "traversal-bonus")
      toast(`Player ${e.player + 1} · transfer bonus +${e.score} points`);
    if (e.type === "steelie-defeat")
      toast(`Player ${e.player + 1} · steelie defeated +${e.score} points`);
    if (e.type === "collect")
      toast(`Player ${e.player + 1} · +${e.time} seconds · +${e.score} points`);
  }
  if (
    sim.players.every((p) => p.status === "finished" || p.status === "timeout")
  )
    finish();
}
function watchReplay() {
  campaignTransition = null;
  lastRecording ??= store.recordings[0];
  if (!lastRecording) {
    toast("Finish a run to record a replay.");
    return;
  }
  if (lastRecording.physics !== PHYSICS_VERSION) {
    toast(
      "This saved replay belongs to an earlier physics version. Finish a new run to record this version.",
    );
    return;
  }
  runMode = "replay";
  replayPaused = false;
  clock.pause(false);
  setSim(seekRecording(lastRecording, 0));
  for (const id of ["intro", "result", "pauseCard", "touchControls"])
    show(id, false);
  show("replayBar");
  show("hud");
  show("pause", false);
  show("restart", false);
  $("raceName").textContent = lastRecording.course.name;
  $("raceCategory").textContent = "REPLAY · RECORDED INPUTS";
  $("seek").max = lastRecording.inputs.length;
  $("seek").value = 0;
  document.body.classList.add("playing");
  view.follow();
  view.setOrbit(true);
  view.replayFollow = true;
  audio.pause();
}
function edit() {
  editCourse = structuredClone(selected);
  editCourse.category = "custom";
  editCourse.id =
    selected.category === "custom" ? selected.id : "custom-" + Date.now();
  editCourse.name =
    selected.category === "custom" ? selected.name : "My marble course";
  editCourse.revision++;
  undo = [];
  redo = [];
  runMode = "editor";
  clock.pause(true);
  audio.pause();
  show("intro", false);
  show("pauseCard", false);
  show("result", false);
  show("hud", false);
  show("touchControls", false);
  show("editor");
  document.body.classList.add("playing");
  view.setOrbit(true);
  view.overview = true;
  view.frameOverview();
  $("editorStatus").textContent =
    "Click to place. Drag to orbit. Choose an object to move or rotate it.";
  refreshEditor();
}
function refreshEditor() {
  const list = $("selectedPiece"),
    key = list.value;
  list.replaceChildren();
  for (const o of workshopObjects(editCourse)) {
    const opt = document.createElement("option");
    opt.value = o.key;
    opt.textContent = o.label;
    list.append(opt);
  }
  if ([...list.options].some((o) => o.value === key)) list.value = key;
  $("customName").value = editCourse.name;
  $("customTime").value = editCourse.time;
  $("undo").disabled = !undo.length;
  $("redo").disabled = !redo.length;
}
function pieceSettings() {
  return Object.fromEntries(
    [
      ["width", "pieceWidth"],
      ["depth", "pieceDepth"],
      ["rise", "pieceRise"],
      ["angle", "pieceAngle"],
      ["bank", "pieceBank"],
      ["amplitude", "pieceAmplitude"],
      ["period", "piecePeriod"],
      ["radius", "pieceRadius"],
      ["forward", "pieceForward"],
      ["up", "pieceUp"],
    ]
      .map(([key, id]) => [key, Number($(id).value)])
      .concat([
        ["material", $("pieceMaterial").value],
        ["axis", $("pieceAxis").value],
      ]),
  );
}
function commitEditorMetadata() {
  const name = $("customName").value.trim() || "My marble course",
    time = Number($("customTime").value);
  if (name === editCourse.name && time === editCourse.time) return true;
  const next = { ...editCourse, name, time };
  try {
    validateCourse(next);
    undo.push(structuredClone(editCourse));
    redo = [];
    editCourse = next;
    refreshEditor();
    return true;
  } catch (e) {
    toast(e.message);
    return false;
  }
}
function rebuildEditor() {
  try {
    validateCourse(editCourse);
    const pose = view.camera.position.clone(),
      target = view.controls.target.clone(),
      zoom = view.zoom;
    setSim(new Simulation(editCourse, { untimed: true }));
    view.camera.position.copy(pose);
    view.controls.target.copy(target);
    view.zoom = zoom;
    view.updateFrustum();
    view.setOrbit(true);
    view.overview = true;
    refreshEditor();
  } catch (e) {
    toast(e.message);
  }
}
function editAction(change) {
  const before = structuredClone(editCourse);
  try {
    change();
    validateCourse(editCourse);
    undo.push(before);
    redo = [];
    rebuildEditor();
  } catch (e) {
    editCourse = before;
    toast(e.message);
  }
}
function download(c) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(c, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = c.id + ".json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function init() {
  try {
    await initPhysics();
    view = new DioramaView($("world"));
    clock = new FixedClock(step);
    inputs = new Inputs(
      $("world"),
      (code) => {
        if (
          code === "KeyP" ||
          (code === "Escape" && !document.pointerLockElement)
        )
          pause();
        if (code === "KeyR" && ["play", "demo", "result"].includes(runMode))
          restart();
      },
      () => runMode === "play" && !paused && !view.orbit,
    );
    for (let i = 0; i < 8; i++) {
      const o = document.createElement("option");
      o.value = i;
      o.textContent = `${i} — ${i === 0 ? "Easiest" : i === 7 ? "Hardest" : "Level " + i}`;
      $("difficulty").append(o);
    }
    for (const [id, key] of [
      ["musicVolume", "music"],
      ["effectsVolume", "effects"],
      ["sensitivity", "sensitivity"],
      ["quality", "quality"],
    ]) {
      $(id).value = store.settings[key];
      $(id).oninput = () => {
        store.settings[key] =
          key === "quality" ? $(id).value : Number($(id).value);
        settings();
        persist();
      };
    }
    settings();
    $("trackball").onchange = settings;
    for (const id of ["players", "mode", "difficulty", "assisted"])
      $(id).onchange = refreshSelectedRecords;
    $("recordScope").onchange = refreshCourses;
    $("play").onclick = () => start();
    $("demo").onclick = () => start(true);
    $("campaignPlay").onclick = () => beginCampaign(false);
    $("campaignDemo").onclick = () => beginCampaign(true);
    $("pause").onclick = () => pause();
    $("resume").onclick = () => pause(false);
    $("restart").onclick = restart;
    $("again").onclick = () =>
      campaignOutcome === "next" ? continueCampaign() : restart();
    $("home").onclick = menu;
    $("resultHome").onclick = menu;
    $("replay").onclick = watchReplay;
    $("replayPause").onclick = () => {
      replayPaused = !replayPaused;
      $("replayPause").textContent = replayPaused
        ? "Resume replay"
        : "Pause replay";
    };
    $("replaySpeed").onchange = () =>
      (replaySpeed = Number($("replaySpeed").value));
    $("seek").oninput = () => {
      const pos = view.camera.position.clone(),
        target = view.controls.target.clone(),
        zoom = view.zoom;
      setSim(seekRecording(lastRecording, Number($("seek").value)));
      view.camera.position.copy(pos);
      view.controls.target.copy(target);
      view.zoom = zoom;
      view.updateFrustum();
      view.setOrbit(true);
      view.overview = false;
      view.replayFollow = true;
      view.focusPlayers();
    };
    $("exitReplay").onclick = menu;
    $("zoomIn").onclick = () => {
      view.zoom = Math.min(view.controls.maxZoom, view.zoom * 1.2);
      view.updateFrustum();
    };
    $("zoomOut").onclick = () => {
      view.zoom = Math.max(view.controls.minZoom, view.zoom / 1.2);
      view.updateFrustum();
    };
    $("resetView").onclick = () => {
      if (runMode === "menu") view.frameOverview();
    };
    $("settingsButton").onclick = () => {
      if (["play", "demo"].includes(runMode)) pause(true);
      $("settings").showModal();
    };
    $("settingsDone").onclick = () => $("settings").close();
    document
      .querySelectorAll("[data-close]")
      .forEach((b) => (b.onclick = () => $(b.dataset.close).close()));
    $("coursesButton").onclick = () => {
      refreshCourses();
      $("courseDialog").showModal();
    };
    $("editButton").onclick = edit;
    $("newCourse").onclick = () => {
      $("courseDialog").close();
      selected = blankCourse();
      setSim(new Simulation(selected, { untimed: true }));
      edit();
    };
    $("closeEditor").onclick = () => {
      if (!commitEditorMetadata()) return;
      selected = structuredClone(editCourse);
      menu();
    };
    $("playtest").onclick = () => {
      if (commitEditorMetadata()) start(false, editCourse);
    };
    $("customName").onchange = commitEditorMetadata;
    $("customTime").onchange = commitEditorMetadata;
    $("removePiece").onclick = () =>
      editAction(() =>
        removeWorkshopObject(editCourse, $("selectedPiece").value),
      );
    $("rotatePiece").onclick = () =>
      editAction(() =>
        rotateWorkshopObject(editCourse, $("selectedPiece").value, Math.PI / 4),
      );
    $("movePiece").onclick = () => {
      $("piece").value = "move selected";
      toast("Click the world at the destination elevation.");
    };
    $("undo").onclick = () => {
      if (undo.length) {
        redo.push(structuredClone(editCourse));
        editCourse = undo.pop();
        rebuildEditor();
      }
    };
    $("redo").onclick = () => {
      if (redo.length) {
        undo.push(structuredClone(editCourse));
        editCourse = redo.pop();
        rebuildEditor();
      }
    };
    $("saveCourse").onclick = () => {
      if (!commitEditorMetadata()) return;
      const ix = store.courses.findIndex((c) => c.id === editCourse.id);
      if (ix < 0) store.courses.push(structuredClone(editCourse));
      else store.courses[ix] = structuredClone(editCourse);
      persist("Custom course saved locally");
    };
    $("exportCourse").onclick = () => {
      if (commitEditorMetadata()) download(editCourse);
    };
    $("importCourse").onchange = async (e) => {
      try {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 1000000) throw Error("Course file must be under 1 MB");
        const c = validateCourse(JSON.parse(await file.text()));
        undo.push(editCourse);
        redo = [];
        editCourse = c;
        rebuildEditor();
        toast("Course imported");
      } catch (err) {
        toast(err.message);
      }
      e.target.value = "";
    };
    let down = null;
    $("world").addEventListener(
      "pointerdown",
      (e) => (down = { x: e.clientX, y: e.clientY }),
    );
    $("world").addEventListener("pointerup", (e) => {
      if (
        runMode !== "editor" ||
        !down ||
        Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5
      )
        return;
      const y = Number($("pieceY").value),
        hit = view.pick(e.clientX, e.clientY, y);
      if (!hit) return;
      const snap = Number($("pieceSnap").value),
        x = Math.round(hit.x / snap) * snap,
        z = Math.round(hit.z / snap) * snap,
        kind = $("piece").value;
      editAction(() => {
        if (kind === "move selected") {
          const key = $("selectedPiece").value;
          moveWorkshopObject(
            editCourse,
            key,
            point(
              x,
              y +
                (key.startsWith("start:") || key.startsWith("checkpoint:")
                  ? RADIUS + 0.01
                  : 0),
              z,
            ),
          );
        } else if (
          ["start", "checkpoint", "goal", "demo waypoint"].includes(kind)
        ) {
          const p = point(x, y + (kind === "goal" ? 0 : RADIUS + 0.01), z);
          if (kind === "start") editCourse.starts = [p, point(x + 1.3, p.y, z)];
          if (kind === "goal") editCourse.goal = p;
          if (kind === "checkpoint") editCourse.checkpoints.push(p);
          if (kind === "demo waypoint") {
            editCourse.route ??= [];
            editCourse.route.push(point(x, y, z));
          }
        } else if (kind === "erase") {
          const closest = editCourse.parts
            .filter(
              (p) => Math.abs(p.x - x) < p.w / 2 && Math.abs(p.z - z) < p.d / 2,
            )
            .sort((a, b) => Math.abs(a.y - y) - Math.abs(b.y - y))[0];
          if (closest)
            removeWorkshopObject(
              editCourse,
              closest.motion?.strip
                ? `wave:${closest.motion.strip}`
                : `part:${closest.id}`,
            );
        } else if (["hazard", "magnet", "acid", "vacuum"].includes(kind)) {
          editCourse.zones ??= [];
          const a = (Number($("pieceAngle").value) * Math.PI) / 180;
          editCourse.zones.push({
            kind,
            x,
            y,
            z,
            radius: Number($("pieceRadius").value),
            strength: kind === "vacuum" ? 3 : 0.4,
            ...(kind === "vacuum"
              ? { direction: { x: -Math.sin(a), y: 0, z: Math.cos(a) } }
              : {}),
          });
        } else if (["steelie", "muncher", "mini", "bird"].includes(kind)) {
          editCourse.enemies ??= [];
          editCourse.enemies.push({
            id: "enemy-" + Date.now(),
            kind,
            x,
            y: y + (kind === "mini" ? 0.22 : kind === "muncher" ? 0.8 : 0.55),
            z,
            radius: kind === "mini" ? 0.22 : 0.55,
            roam: 6,
            speed: 1.5,
            ...(kind === "bird"
              ? {
                  speed: 6,
                  radius: 0.65,
                  distance: 24,
                  rest: 1.8,
                  direction: {
                    x: -Math.sin(
                      (Number($("pieceAngle").value) * Math.PI) / 180,
                    ),
                    z: Math.cos(
                      (Number($("pieceAngle").value) * Math.PI) / 180,
                    ),
                  },
                  color: "#943adb",
                }
              : {}),
          });
        } else {
          editCourse.parts.push(
            makeWorkshopPart(
              kind,
              x,
              y,
              z,
              pieceSettings(),
              "piece-" + Date.now(),
            ),
          );
        }
      });
      $("editorStatus").textContent =
        `${kind} at (${x}, ${y}, ${z}) · ${editCourse.parts.length} pieces`;
    });
    document.addEventListener("visibilitychange", () => {
      previous = performance.now();
      if (document.hidden) {
        inputs.reset();
        if (["play", "demo"].includes(runMode)) pause(true);
        else clock.pause(true);
        audio.pause();
      } else if (runMode === "replay") clock.pause(false);
    });
    menu();
    let previous = performance.now();
    function frame(now) {
      const dt = Math.max(0, (now - previous) / 1000);
      previous = now;
      if (!document.hidden) {
        if (
          campaignTransition !== null &&
          now >= campaignTransition &&
          runMode === "result"
        )
          continueCampaign();
        clock.advance(dt * (runMode === "replay" ? replaySpeed : 1));
        view.render(
          clock.paused ? 1 : clock.alpha,
          dt,
          runMode === "play" ? ghostAt(ghost, sim.tick) : null,
        );
        if (["play", "demo", "replay"].includes(runMode)) renderHud();
        audio.motion(sim, ["play", "demo"].includes(runMode) && !paused);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    // Read-only diagnostics: QA cannot move, snap or finish a player through this API.
    const diagnostics = () => ({
      mode: runMode,
      tick: sim.tick,
      physics: PHYSICS_VERSION,
      players: sim.players.map((p) => ({
        position: p.current.position,
        rotation: p.current.rotation,
        status: p.status,
        deaths: p.deaths,
        time: p.time,
        score: p.score,
      })),
      fps: Math.round(
        view.frames.length / view.frames.reduce((a, b) => a + b, 0),
      ),
      drawCalls: view.renderer.info.render.calls,
      triangles: view.renderer.info.render.triangles,
      renderer: view.renderer
        .getContext()
        .getParameter(view.renderer.getContext().RENDERER),
    });
    if (new URLSearchParams(location.search).has("qa")) {
      const el = document.createElement("pre");
      el.id = "qaDiagnostics";
      el.style.cssText =
        "position:fixed;bottom:48px;left:12px;z-index:30;font-size:9px;max-width:480px;max-height:190px;overflow:auto;background:#101a20dd;padding:8px;pointer-events:none";
      document.body.append(el);
      setInterval(
        () => (el.textContent = JSON.stringify(diagnostics(), null, 2)),
        1000,
      );
    }
  } catch (e) {
    $("status").textContent = "Unable to start the 3D workshop";
    $("courseDescription").textContent = e.message;
    $("play").disabled = true;
    $("demo").disabled = true;
    console.error(e);
  }
}
init();
