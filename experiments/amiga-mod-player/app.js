import { ChiptuneJsPlayer } from "./vendor/chiptune3.js";

const PLAYER_BASE = "/experiments/amiga-mod-player/";
const tracks = Array.isArray(window.AMIGA_MOD_LIBRARY) ? window.AMIGA_MOD_LIBRARY : [];
const composers = Array.isArray(window.AMIGA_MOD_COMPOSERS) ? window.AMIGA_MOD_COMPOSERS : [];
const FAVORITES_KEY = "amiga-mod-player-favorites";
const SCOPE_MODE_KEY = "amiga-mod-player-scope-mode";
const DEFAULT_DURATION = 180;

const refs = {
  trackTotal: document.getElementById("trackTotal"),
  search: document.getElementById("search"),
  collectionFilter: document.getElementById("collectionFilter"),
  composerFilter: document.getElementById("composerFilter"),
  listMeta: document.getElementById("listMeta"),
  trackList: document.getElementById("trackList"),
  nowTitle: document.getElementById("nowTitle"),
  nowMeta: document.getElementById("nowMeta"),
  deck: document.querySelector(".deck"),
  status: document.getElementById("status"),
  favNowBtn: document.getElementById("favNowBtn"),
  prevBtn: document.getElementById("prevBtn"),
  playBtn: document.getElementById("playBtn"),
  stopBtn: document.getElementById("stopBtn"),
  nextBtn: document.getElementById("nextBtn"),
  loopBtn: document.getElementById("loopBtn"),
  scopeModeBtn: document.getElementById("scopeModeBtn"),
  elapsed: document.getElementById("elapsed"),
  duration: document.getElementById("duration"),
  seekControl: document.getElementById("seekControl"),
  seekFill: document.getElementById("seekFill"),
  seekThumb: document.getElementById("seekThumb"),
  progress: document.getElementById("progress"),
  volume: document.getElementById("volume"),
  volumeText: document.getElementById("volumeText"),
  scope: document.getElementById("scope"),
  scopeGrid: document.getElementById("scopeGrid"),
  infoFormat: document.getElementById("infoFormat"),
  infoPatterns: document.getElementById("infoPatterns"),
  infoOrders: document.getElementById("infoOrders"),
  infoSource: document.getElementById("infoSource"),
  miniTitle: document.getElementById("miniTitle"),
  miniMeta: document.getElementById("miniMeta"),
  miniFavBtn: document.getElementById("miniFavBtn"),
  miniPrevBtn: document.getElementById("miniPrevBtn"),
  miniPlayBtn: document.getElementById("miniPlayBtn"),
  miniNextBtn: document.getElementById("miniNextBtn"),
  miniElapsed: document.getElementById("miniElapsed"),
  miniDuration: document.getElementById("miniDuration"),
  miniSeekControl: document.getElementById("miniSeekControl"),
  miniSeekFill: document.getElementById("miniSeekFill"),
  miniSeekThumb: document.getElementById("miniSeekThumb"),
};

const state = {
  filtered: [],
  selected: 0,
  currentTrack: null,
  loadedPath: "",
  currentDuration: DEFAULT_DURATION,
  currentPosition: 0,
  initialized: null,
  audioContext: null,
  audioUnlocked: false,
  player: null,
  analyser: null,
  analyserData: null,
  playing: false,
  loading: false,
  seeking: false,
  loop: false,
  scrubbing: false,
  ending: false,
  pointerSeeking: false,
  favorites: new Set(),
  scopeMode: "full",
};

function normalize(value) {
  return String(value || "").toLowerCase();
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(total % 60).padStart(2, "0")}`;
}

function formatBytes(size) {
  if (!Number.isFinite(size)) return "";
  if (size < 1024) return `${size} B`;
  return `${Math.round(size / 1024)} KB`;
}

function readStoredJson(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(error);
    return fallback;
  }
}

function writeStoredJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(error);
  }
}

function setStatus(text, kind) {
  refs.status.textContent = text;
  refs.status.className = `status${kind ? ` ${kind}` : ""}`;
  syncMiniMeta();
}

function setPlayButtonText(text) {
  refs.playBtn.textContent = text;
  refs.miniPlayBtn.textContent = text;
  refs.playBtn.setAttribute("aria-label", text === "Pause" ? "Pause MOD" : "Play MOD");
  refs.miniPlayBtn.setAttribute("aria-label", text === "Pause" ? "Pause MOD" : "Play MOD");
}

function syncMiniMeta() {
  const status = refs.status.textContent;
  const meta = refs.nowMeta.textContent;
  refs.miniMeta.textContent = meta && meta !== "libopenmpt standby"
    ? `${status} / ${meta}`
    : status;
}

function favoriteKey(track) {
  return track ? track.path : "";
}

function isFavorite(track) {
  return state.favorites.has(favoriteKey(track));
}

function activeTrack() {
  return state.currentTrack || selectedTrack();
}

function saveFavorites() {
  writeStoredJson(FAVORITES_KEY, Array.from(state.favorites));
}

function toggleFavorite(track) {
  if (!track) return;
  const key = favoriteKey(track);
  if (state.favorites.has(key)) {
    state.favorites.delete(key);
  } else {
    state.favorites.add(key);
  }
  saveFavorites();
  updateFavoriteControls();
  applyFilters();
}

function updateFavoriteControls() {
  const active = isFavorite(activeTrack());
  refs.favNowBtn.classList.toggle("active", active);
  refs.miniFavBtn.classList.toggle("active", active);
  refs.favNowBtn.textContent = active ? "★" : "☆";
  refs.miniFavBtn.textContent = active ? "★" : "☆";
  refs.favNowBtn.setAttribute("aria-pressed", active ? "true" : "false");
  refs.miniFavBtn.setAttribute("aria-pressed", active ? "true" : "false");
}

function trackUrl(track) {
  return new URL(track.path, window.location.origin + PLAYER_BASE).href;
}

function renderSeekPosition(seconds) {
  const value = Math.max(0, Math.min(Number(seconds) || 0, state.currentDuration || DEFAULT_DURATION));
  const duration = state.currentDuration || DEFAULT_DURATION;
  const percent = duration > 0 ? (value / duration) * 100 : 0;
  refs.progress.max = String(duration);
  refs.progress.value = String(value);
  refs.elapsed.textContent = formatTime(value);
  refs.duration.textContent = formatTime(duration);
  refs.seekFill.style.width = `${percent}%`;
  refs.seekThumb.style.left = `${percent}%`;
  refs.miniElapsed.textContent = formatTime(value);
  refs.miniDuration.textContent = formatTime(duration);
  refs.miniSeekFill.style.width = `${percent}%`;
  refs.miniSeekThumb.style.left = `${percent}%`;
  refs.seekControl.setAttribute("aria-valuemax", String(Math.round(duration)));
  refs.seekControl.setAttribute("aria-valuenow", String(Math.round(value)));
  refs.seekControl.setAttribute("aria-valuetext", formatTime(value));
  refs.miniSeekControl.setAttribute("aria-valuemax", String(Math.round(duration)));
  refs.miniSeekControl.setAttribute("aria-valuenow", String(Math.round(value)));
  refs.miniSeekControl.setAttribute("aria-valuetext", formatTime(value));
}

function setNowPlaying(track, meta) {
  refs.nowTitle.textContent = track.title;
  refs.nowMeta.textContent = `${track.composer} | ${track.collection}`;
  refs.miniTitle.textContent = track.title;
  syncMiniMeta();
}

function updateInfo(track, meta = null) {
  refs.infoFormat.textContent = track ? track.format : "MOD";
  refs.infoSource.textContent = track ? track.source : "Modland ProTracker archive";
  refs.infoPatterns.textContent = meta && Number.isFinite(meta.totalPatterns) ? String(meta.totalPatterns) : "--";
  refs.infoOrders.textContent = meta && Number.isFinite(meta.totalOrders) ? String(meta.totalOrders) : "--";
}

function setScopeMode(mode) {
  state.scopeMode = ["full", "compact", "hidden"].includes(mode) ? mode : "full";
  refs.deck.classList.toggle("scope-compact", state.scopeMode === "compact");
  refs.deck.classList.toggle("scope-hidden", state.scopeMode === "hidden");
  const label = state.scopeMode === "full"
    ? "Scope Full"
    : state.scopeMode === "compact"
      ? "Scope Compact"
      : "Scope Hidden";
  refs.scopeModeBtn.textContent = label;
  refs.scopeModeBtn.setAttribute("aria-pressed", state.scopeMode === "hidden" ? "true" : "false");
  try {
    window.localStorage.setItem(SCOPE_MODE_KEY, state.scopeMode);
  } catch (error) {
    console.warn(error);
  }
}

function cycleScopeMode() {
  if (state.scopeMode === "full") setScopeMode("compact");
  else if (state.scopeMode === "compact") setScopeMode("hidden");
  else setScopeMode("full");
}

function getAudioContext() {
  if (state.audioContext) return state.audioContext;
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) throw new Error("WebAudio is not supported");
  state.audioContext = new AudioContextCtor();
  return state.audioContext;
}

async function unlockAudioContext() {
  const context = getAudioContext();
  if (context.state === "suspended") {
    await context.resume();
  }
  if (!state.audioUnlocked) {
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = context.createBuffer(1, 1, context.sampleRate);
    gain.gain.value = 0;
    source.connect(gain);
    gain.connect(context.destination);
    source.start(0);
    state.audioUnlocked = true;
    window.setTimeout(() => {
      try {
        source.disconnect();
        gain.disconnect();
      } catch (error) {
        console.warn(error);
      }
    }, 50);
  }
  return context;
}

async function wakeAudio() {
  const context = await unlockAudioContext();
  const player = await ensurePlayer();
  if (player && player.context && player.context.state === "suspended") {
    await player.context.resume();
  }
  return context;
}

function wireAnalyser(player) {
  if (state.analyser || !player || !player.context || !player.gain) return;
  const analyser = player.context.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.78;
  try {
    player.gain.disconnect();
  } catch (error) {
    console.warn(error);
  }
  player.gain.connect(analyser);
  analyser.connect(player.context.destination);
  state.analyser = analyser;
  state.analyserData = new Uint8Array(analyser.frequencyBinCount);
}

function ensurePlayer() {
  if (state.initialized) return state.initialized;
  setStatus("Starting", "");
  state.initialized = new Promise((resolve, reject) => {
    const player = new ChiptuneJsPlayer({
      repeatCount: 0,
      context: getAudioContext(),
    });
    state.player = player;
    player.onInitialized(() => {
      player.setVol(Number(refs.volume.value));
      wireAnalyser(player);
      setStatus("Ready", "ready");
      resolve(player);
    });
    player.onMetadata((meta) => {
      if (!state.currentTrack) return;
      state.currentDuration = Number(meta && meta.dur) > 0 ? Number(meta.dur) : DEFAULT_DURATION;
      setNowPlaying(state.currentTrack, meta);
      updateInfo(state.currentTrack, meta);
      renderSeekPosition(state.currentPosition);
    });
    player.onProgress((progress) => {
      if (state.scrubbing || state.seeking) return;
      state.currentPosition = Number(progress && progress.pos) || 0;
      renderSeekPosition(state.currentPosition);
    });
    player.onEnded(() => {
      if (!state.loop) onTrackEnd();
    });
    player.onError((error) => {
      console.error(error);
      setStatus("Error", "error");
      reject(error);
    });
  });
  return state.initialized;
}

function renderComposers() {
  refs.composerFilter.innerHTML = "";
  const all = document.createElement("option");
  all.value = "all";
  all.textContent = "All composers";
  refs.composerFilter.appendChild(all);

  for (const composer of composers) {
    const option = document.createElement("option");
    option.value = composer;
    option.textContent = composer;
    refs.composerFilter.appendChild(option);
  }
}

function applyFilters() {
  const query = normalize(refs.search.value);
  const collection = refs.collectionFilter.value;
  const composer = refs.composerFilter.value;
  state.filtered = tracks.filter((track) => {
    const collectionMatch = collection === "all"
      || (collection === "favorites" && isFavorite(track))
      || (collection === "game" && track.collection === "Game Music")
      || (collection === "popular" && track.collection === "Popular MODs")
      || (collection === "cracktro" && track.collection === "Cracktro Scene")
      || (collection === "demo" && track.collection === "Demo Scene");
    if (!collectionMatch) return false;
    if (composer !== "all" && track.composer !== composer) return false;
    if (!query) return true;
    return normalize(`${track.title} ${track.composer} ${track.collection} ${track.path}`).includes(query);
  });

  if (state.selected >= state.filtered.length) state.selected = 0;
  renderTracks();
}

function renderTracks() {
  refs.trackList.innerHTML = "";
  refs.listMeta.textContent = refs.collectionFilter.value === "favorites"
    ? `${state.filtered.length} favorites`
    : `${state.filtered.length} shown`;

  const fragment = document.createDocumentFragment();
  state.filtered.forEach((track, index) => {
    const row = document.createElement("div");
    row.className = `track${track === activeTrack() ? " active" : ""}`;
    row.setAttribute("role", "option");
    row.setAttribute("aria-selected", track === activeTrack() ? "true" : "false");
    row.dataset.index = String(index);
    row.innerHTML = `
      <button class="track-main" type="button">
        <span class="track-title"></span>
        <span class="track-composer"></span>
      </button>
      <span class="track-duration"></span>
      <button class="track-favorite" type="button" aria-label="Favorite MOD"></button>
    `;
    row.querySelector(".track-title").textContent = track.title;
    row.querySelector(".track-composer").textContent = `${track.composer} / ${track.collection}`;
    row.querySelector(".track-duration").textContent = formatBytes(track.size);
    const favoriteButton = row.querySelector(".track-favorite");
    const activeFavorite = isFavorite(track);
    favoriteButton.classList.toggle("active", activeFavorite);
    favoriteButton.textContent = activeFavorite ? "★" : "☆";
    favoriteButton.setAttribute("aria-pressed", activeFavorite ? "true" : "false");
    favoriteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorite(track);
    });
    const mainButton = row.querySelector(".track-main");
    mainButton.addEventListener("pointerdown", () => wakeAudio().catch(console.warn), { passive: true });
    mainButton.addEventListener("click", () => {
      state.selected = index;
      loadTrack(track, true);
    });
    fragment.appendChild(row);
  });
  refs.trackList.appendChild(fragment);
}

function selectedTrack() {
  if (!state.filtered.length) return null;
  return state.filtered[Math.max(0, Math.min(state.selected, state.filtered.length - 1))];
}

async function fetchModule(track) {
  const response = await fetch(trackUrl(track));
  if (!response.ok) throw new Error(`Could not load ${track.title}`);
  return response.arrayBuffer();
}

async function loadTrack(track, autoplay) {
  if (!track || state.loading) return;
  state.loading = true;
  state.currentTrack = track;
  state.currentPosition = 0;
  state.currentDuration = DEFAULT_DURATION;
  state.loadedPath = "";
  setStatus("Loading", "");
  setPlayButtonText(autoplay ? "Pause" : "Play");
  refs.scope.classList.remove("playing");
  refs.nowTitle.textContent = track.title;
  refs.nowMeta.textContent = `${track.composer} | ${track.collection}`;
  refs.miniTitle.textContent = track.title;
  syncMiniMeta();
  updateFavoriteControls();
  updateInfo(track);
  renderTracks();
  renderSeekPosition(0);

  try {
    if (autoplay) await wakeAudio();
    const player = await ensurePlayer();
    const buffer = await fetchModule(track);
    player.play(buffer);
    player.setRepeatCount(state.loop ? -1 : 0);
    player.setVol(Number(refs.volume.value));
    state.loadedPath = track.path;
    state.playing = true;
    refs.scope.classList.add("playing");
    setPlayButtonText("Pause");
    setStatus("Playing", "ready");
    if (!autoplay) {
      player.pause();
      state.playing = false;
      refs.scope.classList.remove("playing");
      setPlayButtonText("Play");
      setStatus("Ready", "ready");
    }
  } catch (error) {
    console.error(error);
    state.playing = false;
    setPlayButtonText("Play");
    refs.scope.classList.remove("playing");
    setStatus("Error", "error");
    refs.nowMeta.textContent = error.message || "MOD playback failed";
    syncMiniMeta();
  } finally {
    state.loading = false;
  }
}

async function togglePlay() {
  await wakeAudio();
  const track = state.currentTrack || selectedTrack();
  if (!track) return;
  const player = await ensurePlayer();

  if (state.loadedPath !== track.path) {
    await loadTrack(track, true);
    return;
  }

  if (state.playing) {
    player.pause();
    state.playing = false;
    refs.scope.classList.remove("playing");
    setPlayButtonText("Play");
    setStatus("Paused", "");
  } else {
    player.unpause();
    state.playing = true;
    refs.scope.classList.add("playing");
    setPlayButtonText("Pause");
    setStatus("Playing", "ready");
  }
}

function stopPlayback() {
  const player = state.player;
  if (player) player.stop();
  state.playing = false;
  state.currentPosition = 0;
  state.loadedPath = "";
  refs.scope.classList.remove("playing");
  setPlayButtonText("Play");
  renderSeekPosition(0);
  setStatus("Stopped", "");
}

function move(delta) {
  if (!state.filtered.length) return;
  state.selected = (state.selected + delta + state.filtered.length) % state.filtered.length;
  loadTrack(selectedTrack(), true);
}

function onTrackEnd() {
  if (state.ending || state.loading || state.seeking || !state.currentTrack) return;
  state.ending = true;
  state.playing = false;
  refs.scope.classList.remove("playing");
  setPlayButtonText("Play");
  move(1);
  window.setTimeout(() => {
    state.ending = false;
  }, 500);
}

function performSeek(targetValue) {
  if (!state.currentTrack || !state.player || state.loadedPath !== state.currentTrack.path) return;
  const target = Math.max(0, Math.min(Number(targetValue) || 0, state.currentDuration));
  state.seeking = true;
  state.scrubbing = true;
  state.currentPosition = target;
  renderSeekPosition(target);
  state.player.setPos(target);
  window.setTimeout(() => {
    state.seeking = false;
    state.scrubbing = false;
  }, 100);
}

function progressValueFromPoint(clientX, control) {
  const rect = control.getBoundingClientRect();
  if (!rect.width) return Number(refs.progress.value) || 0;
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  return ratio * state.currentDuration;
}

function previewSeekFromPoint(clientX, control = refs.seekControl) {
  const target = progressValueFromPoint(clientX, control);
  renderSeekPosition(target);
  return target;
}

function seekFromPoint(clientX, control = refs.seekControl) {
  performSeek(previewSeekFromPoint(clientX, control));
}

function stepSeekFromKey(event) {
  if (!state.currentTrack) return;
  const current = Number(refs.progress.value) || 0;
  const step = event.shiftKey ? 10 : 5;
  let target = current;

  if (event.key === "ArrowLeft") target = current - step;
  if (event.key === "ArrowRight") target = current + step;
  if (event.key === "PageDown") target = current - 30;
  if (event.key === "PageUp") target = current + 30;
  if (event.key === "Home") target = 0;
  if (event.key === "End") target = state.currentDuration;

  if (target !== current) {
    event.preventDefault();
    performSeek(target);
  }
}

function wireSeekControl(control) {
  control.addEventListener("pointerdown", (event) => {
    if (!state.currentTrack) return;
    event.preventDefault();
    wakeAudio().catch(console.warn);
    state.pointerSeeking = true;
    state.scrubbing = true;
    try {
      control.setPointerCapture(event.pointerId);
    } catch (error) {
      console.warn(error);
    }
    previewSeekFromPoint(event.clientX, control);
  });
  control.addEventListener("pointermove", (event) => {
    if (!state.pointerSeeking) return;
    event.preventDefault();
    previewSeekFromPoint(event.clientX, control);
  });
  control.addEventListener("pointerup", (event) => {
    if (!state.pointerSeeking) return;
    event.preventDefault();
    state.pointerSeeking = false;
    seekFromPoint(event.clientX, control);
  });
  control.addEventListener("pointercancel", () => {
    state.pointerSeeking = false;
    state.scrubbing = false;
  });
  control.addEventListener("touchstart", (event) => {
    if (!state.currentTrack) return;
    event.preventDefault();
    wakeAudio().catch(console.warn);
    state.scrubbing = true;
    const touch = event.changedTouches[0];
    if (touch) previewSeekFromPoint(touch.clientX, control);
  }, { passive: false });
  control.addEventListener("touchmove", (event) => {
    if (!state.currentTrack) return;
    event.preventDefault();
    const touch = event.changedTouches[0];
    if (touch) previewSeekFromPoint(touch.clientX, control);
  }, { passive: false });
  control.addEventListener("touchend", (event) => {
    if (!state.currentTrack) return;
    event.preventDefault();
    const touch = event.changedTouches[0];
    if (touch) seekFromPoint(touch.clientX, control);
  }, { passive: false });
  control.addEventListener("keydown", stepSeekFromKey);
}

function buildScope() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 32; i += 1) {
    const bar = document.createElement("span");
    bar.className = "bar";
    bar.style.height = `${18 + ((i * 19) % 76)}%`;
    bar.style.animationDelay = `${(i % 8) * -90}ms`;
    fragment.appendChild(bar);
  }
  refs.scopeGrid.appendChild(fragment);
}

function renderSpectrum() {
  const bars = refs.scopeGrid.children;
  if (state.analyser && state.analyserData && bars.length) {
    state.analyser.getByteFrequencyData(state.analyserData);
    refs.scope.classList.add("live");
    const step = Math.max(1, Math.floor(state.analyserData.length / bars.length));
    for (let i = 0; i < bars.length; i += 1) {
      let peak = 0;
      const start = i * step;
      const end = Math.min(state.analyserData.length, start + step);
      for (let j = start; j < end; j += 1) {
        if (state.analyserData[j] > peak) peak = state.analyserData[j];
      }
      const level = Math.max(8, Math.round((peak / 255) * 100));
      bars[i].style.height = `${level}%`;
    }
  } else {
    refs.scope.classList.remove("live");
  }
  window.requestAnimationFrame(renderSpectrum);
}

function wireEvents() {
  refs.search.addEventListener("input", applyFilters);
  refs.collectionFilter.addEventListener("change", applyFilters);
  refs.composerFilter.addEventListener("change", applyFilters);
  refs.playBtn.addEventListener("pointerdown", () => wakeAudio().catch(console.warn), { passive: true });
  refs.prevBtn.addEventListener("pointerdown", () => wakeAudio().catch(console.warn), { passive: true });
  refs.nextBtn.addEventListener("pointerdown", () => wakeAudio().catch(console.warn), { passive: true });
  refs.miniPlayBtn.addEventListener("pointerdown", () => wakeAudio().catch(console.warn), { passive: true });
  refs.miniPrevBtn.addEventListener("pointerdown", () => wakeAudio().catch(console.warn), { passive: true });
  refs.miniNextBtn.addEventListener("pointerdown", () => wakeAudio().catch(console.warn), { passive: true });
  refs.playBtn.addEventListener("click", () => togglePlay().catch((error) => {
    console.error(error);
    setStatus("Error", "error");
  }));
  refs.miniPlayBtn.addEventListener("click", () => togglePlay().catch((error) => {
    console.error(error);
    setStatus("Error", "error");
  }));
  refs.stopBtn.addEventListener("click", stopPlayback);
  refs.prevBtn.addEventListener("click", () => move(-1));
  refs.miniPrevBtn.addEventListener("click", () => move(-1));
  refs.nextBtn.addEventListener("click", () => move(1));
  refs.miniNextBtn.addEventListener("click", () => move(1));
  refs.favNowBtn.addEventListener("click", () => toggleFavorite(activeTrack()));
  refs.miniFavBtn.addEventListener("click", () => toggleFavorite(activeTrack()));
  refs.loopBtn.addEventListener("click", () => {
    state.loop = !state.loop;
    refs.loopBtn.classList.toggle("active", state.loop);
    if (state.player) state.player.setRepeatCount(state.loop ? -1 : 0);
  });
  refs.scopeModeBtn.addEventListener("click", cycleScopeMode);
  refs.volume.addEventListener("input", () => {
    const volume = Number(refs.volume.value);
    refs.volumeText.textContent = `${Math.round(volume * 100)}%`;
    if (state.player) state.player.setVol(volume);
  });
  wireSeekControl(refs.seekControl);
  wireSeekControl(refs.miniSeekControl);
  refs.progress.addEventListener("input", () => {
    if (state.pointerSeeking) return;
    state.scrubbing = true;
    renderSeekPosition(Number(refs.progress.value));
  });
  refs.progress.addEventListener("change", () => performSeek(Number(refs.progress.value)));
}

function chooseInitialTrack() {
  state.filtered = tracks;
  const lotusIndex = tracks.findIndex((track) => track.id === "barry-leitch-lotus2-title");
  state.selected = lotusIndex >= 0 ? lotusIndex : 0;
  const track = tracks[state.selected];
  if (!track) return;
  refs.nowTitle.textContent = track.title;
  refs.nowMeta.textContent = `${track.composer} | ${track.collection}`;
  refs.miniTitle.textContent = track.title;
  syncMiniMeta();
  updateFavoriteControls();
  updateInfo(track);
}

function init() {
  state.favorites = new Set(readStoredJson(FAVORITES_KEY, []));
  try {
    state.scopeMode = window.localStorage.getItem(SCOPE_MODE_KEY) || "full";
  } catch (error) {
    console.warn(error);
    state.scopeMode = "full";
  }
  refs.trackTotal.textContent = String(tracks.length);
  refs.volumeText.textContent = `${Math.round(Number(refs.volume.value) * 100)}%`;
  renderSeekPosition(0);
  setScopeMode(state.scopeMode);
  renderComposers();
  chooseInitialTrack();
  applyFilters();
  buildScope();
  wireEvents();
  renderSpectrum();
}

init();
