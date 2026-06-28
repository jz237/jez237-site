import { ChiptuneJsPlayer } from "./vendor/chiptune3.js";

const PLAYER_BASE = new URL("./", window.location.href).href;
const tracks = Array.isArray(window.AMIGA_MOD_LIBRARY) ? window.AMIGA_MOD_LIBRARY : [];
const composers = Array.isArray(window.AMIGA_MOD_COMPOSERS) ? window.AMIGA_MOD_COMPOSERS : [];
const FAVORITES_KEY = "amiga-mod-player-favorites";
const SCOPE_MODE_KEY = "amiga-mod-player-scope-mode";
const DEFAULT_DURATION = 600;
const SHORT_LOOP_DURATION = 90;

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
  nativeDuration: DEFAULT_DURATION,
  currentPosition: 0,
  playStartedAt: 0,
  playOffset: 0,
  initialized: null,
  audioContext: null,
  audioUnlocked: false,
  audioElement: null,
  audioSource: null,
  audioBuffer: null,
  audioBufferPath: "",
  audioBufferSource: null,
  audioGain: null,
  stoppingAudio: false,
  player: null,
  analyser: null,
  analyserData: null,
  modAnalyser: null,
  modAnalyserData: null,
  audioAnalyser: null,
  audioAnalyserData: null,
  playing: false,
  loading: false,
  seeking: false,
  loop: true,
  loopingModule: false,
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

function isAudioTrack(track) {
  return track && ["MP3", "OGG", "WAV", "M4A"].includes(String(track.format || "").toUpperCase());
}

function trackLengthLabel(track) {
  if (Number.isFinite(track && track.duration) && track.duration > 0) return formatTime(track.duration);
  return formatBytes(track && track.size);
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
  refs.playBtn.setAttribute("aria-label", text === "Pause" ? "Pause track" : "Play track");
  refs.miniPlayBtn.setAttribute("aria-label", text === "Pause" ? "Pause track" : "Play track");
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
  return new URL(track.path, PLAYER_BASE).href;
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

function currentPlaybackPosition() {
  if (!state.playing || !state.playStartedAt) return state.currentPosition;
  const elapsed = state.playOffset + ((performance.now() - state.playStartedAt) / 1000);
  if (isAudioTrack(state.currentTrack) && state.currentDuration > 0) {
    return state.loop ? elapsed % state.currentDuration : Math.min(elapsed, state.currentDuration);
  }
  return elapsed;
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
  refs.infoPatterns.textContent = isAudioTrack(track)
    ? "Audio"
    : meta && Number.isFinite(meta.totalPatterns) ? String(meta.totalPatterns) : "--";
  refs.infoOrders.textContent = isAudioTrack(track)
    ? "--"
    : meta && Number.isFinite(meta.totalOrders) ? String(meta.totalOrders) : "--";
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
  return context;
}

function wireAnalyser(player) {
  if (!player || !player.context || !player.gain) return;
  if (state.modAnalyser) {
    state.analyser = state.modAnalyser;
    state.analyserData = state.modAnalyserData;
    return;
  }
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
  state.modAnalyser = analyser;
  state.modAnalyserData = new Uint8Array(analyser.frequencyBinCount);
  state.analyser = state.modAnalyser;
  state.analyserData = state.modAnalyserData;
}

function useModAnalyser() {
  if (state.modAnalyser && state.modAnalyserData) {
    state.analyser = state.modAnalyser;
    state.analyserData = state.modAnalyserData;
  }
}

function ensureAudioElement() {
  if (state.audioElement) return state.audioElement;
  const audio = new Audio();
  audio.preload = "metadata";
  audio.style.display = "none";
  document.body.appendChild(audio);

  audio.addEventListener("loadedmetadata", () => {
    if (!isAudioTrack(state.currentTrack) || state.loadedPath !== state.currentTrack.path) return;
    const duration = Number.isFinite(audio.duration) && audio.duration > 0
      ? audio.duration
      : Number(state.currentTrack.duration) || DEFAULT_DURATION;
    state.currentDuration = duration;
    state.nativeDuration = duration;
    renderSeekPosition(audio.currentTime || 0);
  });

  audio.addEventListener("timeupdate", () => {
    if (!isAudioTrack(state.currentTrack) || state.scrubbing || state.seeking) return;
    state.currentPosition = audio.currentTime || 0;
    renderSeekPosition(state.currentPosition);
  });

  audio.addEventListener("ended", () => {
    if (!isAudioTrack(state.currentTrack)) return;
    if (state.loop) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.error(error);
        setStatus("Error", "error");
      });
      return;
    }
    onTrackEnd();
  });

  audio.addEventListener("error", () => {
    console.error(audio.error);
    state.playing = false;
    refs.scope.classList.remove("playing");
    setPlayButtonText("Play");
    setStatus("Error", "error");
  });

  const context = getAudioContext();
  const source = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.78;
  source.connect(analyser);
  analyser.connect(context.destination);
  state.audioElement = audio;
  state.audioSource = source;
  state.audioAnalyser = analyser;
  state.audioAnalyserData = new Uint8Array(analyser.frequencyBinCount);
  return audio;
}

function useAudioAnalyser() {
  ensureAudioElement();
  state.analyser = state.audioAnalyser;
  state.analyserData = state.audioAnalyserData;
}

function ensureAudioBufferGraph() {
  const context = getAudioContext();
  if (!state.audioGain) {
    const gain = context.createGain();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.78;
    gain.connect(analyser);
    analyser.connect(context.destination);
    state.audioGain = gain;
    state.audioAnalyser = analyser;
    state.audioAnalyserData = new Uint8Array(analyser.frequencyBinCount);
  }
  state.audioGain.gain.value = Number(refs.volume.value);
  state.analyser = state.audioAnalyser;
  state.analyserData = state.audioAnalyserData;
  return context;
}

async function loadAudioBuffer(track) {
  const context = ensureAudioBufferGraph();
  if (state.audioBuffer && state.audioBufferPath === track.path) return state.audioBuffer;
  const response = await fetch(trackUrl(track));
  if (!response.ok) throw new Error(`Could not load ${track.title}`);
  const data = await response.arrayBuffer();
  state.audioBuffer = await context.decodeAudioData(data);
  state.audioBufferPath = track.path;
  return state.audioBuffer;
}

function stopAudioBufferSource(resetPosition = false) {
  if (!state.audioBufferSource) return;
  state.stoppingAudio = true;
  try {
    state.audioBufferSource.stop();
  } catch (error) {
    console.warn(error);
  }
  state.audioBufferSource.disconnect();
  state.audioBufferSource = null;
  state.stoppingAudio = false;
  if (resetPosition) {
    state.currentPosition = 0;
    state.playOffset = 0;
    state.playStartedAt = 0;
  }
}

function startAudioBufferPlayback(offset = state.currentPosition || 0) {
  if (!state.audioBuffer || !state.audioGain) return;
  const context = getAudioContext();
  stopAudioBufferSource();
  const duration = state.audioBuffer.duration || state.currentDuration || DEFAULT_DURATION;
  const source = context.createBufferSource();
  source.buffer = state.audioBuffer;
  source.loop = state.loop;
  source.connect(state.audioGain);
  source.onended = () => {
    if (state.audioBufferSource !== source) return;
    if (state.stoppingAudio || state.loop || !isAudioTrack(state.currentTrack)) return;
    onTrackEnd();
  };
  state.audioBufferSource = source;
  state.currentPosition = Math.max(0, Math.min(offset, duration));
  state.playOffset = state.currentPosition;
  state.playStartedAt = performance.now();
  source.start(0, state.currentPosition % duration);
}

function ensurePlayer() {
  if (state.initialized) return state.initialized;
  setStatus("Starting", "");
  state.initialized = new Promise((resolve, reject) => {
    const player = new ChiptuneJsPlayer({
      repeatCount: -1,
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
      const nativeDuration = Number(meta && meta.dur) > 0 ? Number(meta.dur) : 0;
      state.nativeDuration = nativeDuration || DEFAULT_DURATION;
      state.loopingModule = nativeDuration > 0 && nativeDuration < SHORT_LOOP_DURATION;
      state.currentDuration = state.loopingModule ? DEFAULT_DURATION : (nativeDuration || DEFAULT_DURATION);
      setNowPlaying(state.currentTrack, meta);
      updateInfo(state.currentTrack, meta);
      renderSeekPosition(state.currentPosition);
    });
    player.onProgress((progress) => {
      if (state.scrubbing || state.seeking) return;
      state.currentPosition = state.loopingModule
        ? Math.min(currentPlaybackPosition(), state.currentDuration)
        : Number(progress && progress.pos) || 0;
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
      <button class="track-favorite" type="button" aria-label="Favorite track"></button>
    `;
    row.querySelector(".track-title").textContent = track.title;
    row.querySelector(".track-composer").textContent = `${track.composer} / ${track.collection}`;
    row.querySelector(".track-duration").textContent = trackLengthLabel(track);
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

function resetTrackState(track, autoplay) {
  if (!track) return;
  state.currentTrack = track;
  state.currentPosition = 0;
  state.currentDuration = Number(track.duration) || DEFAULT_DURATION;
  state.nativeDuration = Number(track.duration) || DEFAULT_DURATION;
  state.loopingModule = false;
  state.playOffset = 0;
  state.playStartedAt = 0;
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
}

function stopAudioPlayback(resetPosition = true) {
  stopAudioBufferSource(resetPosition);
  const audio = state.audioElement;
  if (!audio) return;
  audio.pause();
  if (resetPosition) {
    try {
      audio.currentTime = 0;
    } catch (error) {
      console.warn(error);
    }
  }
}

async function loadAudioTrack(track, autoplay) {
  if (!track || state.loading) return;
  state.loading = true;
  resetTrackState(track, autoplay);

  try {
    if (autoplay) await wakeAudio();
    if (state.player) state.player.stop();
    stopAudioPlayback();
    const buffer = await loadAudioBuffer(track);
    state.currentDuration = buffer.duration || Number(track.duration) || DEFAULT_DURATION;
    state.nativeDuration = state.currentDuration;
    state.loadedPath = track.path;
    renderSeekPosition(0);
    if (autoplay) {
      startAudioBufferPlayback(0);
      state.playing = true;
      refs.scope.classList.add("playing");
      setPlayButtonText("Pause");
      setStatus("Playing", "ready");
    } else {
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
    refs.nowMeta.textContent = error.message || "Audio playback failed";
    syncMiniMeta();
  } finally {
    state.loading = false;
  }
}

async function loadModuleTrack(track, autoplay) {
  if (!track || state.loading) return;
  state.loading = true;
  resetTrackState(track, autoplay);

  try {
    if (autoplay) await wakeAudio();
    stopAudioPlayback();
    const player = await ensurePlayer();
    useModAnalyser();
    const buffer = await fetchModule(track);
    player.play(buffer);
    player.setRepeatCount(state.loop ? -1 : 0);
    player.setVol(Number(refs.volume.value));
    state.loadedPath = track.path;
    state.playing = true;
    state.playOffset = 0;
    state.playStartedAt = performance.now();
    refs.scope.classList.add("playing");
    setPlayButtonText("Pause");
    setStatus("Playing", "ready");
    if (!autoplay) {
      player.pause();
      state.playing = false;
      state.playStartedAt = 0;
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

async function loadTrack(track, autoplay) {
  if (isAudioTrack(track)) {
    await loadAudioTrack(track, autoplay);
    return;
  }
  await loadModuleTrack(track, autoplay);
}

async function togglePlay() {
  await wakeAudio();
  const track = state.currentTrack || selectedTrack();
  if (!track) return;

  if (state.loadedPath !== track.path) {
    await loadTrack(track, true);
    return;
  }

  if (isAudioTrack(track)) {
    if (state.playing) {
      state.currentPosition = currentPlaybackPosition();
      stopAudioBufferSource();
      state.playing = false;
      refs.scope.classList.remove("playing");
      setPlayButtonText("Play");
      setStatus("Paused", "");
    } else {
      if (!state.audioBuffer || state.audioBufferPath !== track.path) {
        await loadAudioBuffer(track);
      }
      startAudioBufferPlayback(state.currentPosition);
      state.playing = true;
      refs.scope.classList.add("playing");
      setPlayButtonText("Pause");
      setStatus("Playing", "ready");
    }
    return;
  }

  const player = await ensurePlayer();

  if (state.playing) {
    player.pause();
    state.currentPosition = currentPlaybackPosition();
    state.playOffset = state.currentPosition;
    state.playStartedAt = 0;
    state.playing = false;
    refs.scope.classList.remove("playing");
    setPlayButtonText("Play");
    setStatus("Paused", "");
  } else {
    player.unpause();
    state.playing = true;
    state.playOffset = state.currentPosition;
    state.playStartedAt = performance.now();
    refs.scope.classList.add("playing");
    setPlayButtonText("Pause");
    setStatus("Playing", "ready");
  }
}

function stopPlayback() {
  const player = state.player;
  if (player) player.stop();
  stopAudioPlayback();
  state.playing = false;
  state.currentPosition = 0;
  state.playOffset = 0;
  state.playStartedAt = 0;
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
  state.playStartedAt = 0;
  refs.scope.classList.remove("playing");
  setPlayButtonText("Play");
  move(1);
  window.setTimeout(() => {
    state.ending = false;
  }, 500);
}

function performSeek(targetValue) {
  if (!state.currentTrack) return;
  if (!isAudioTrack(state.currentTrack) && state.loadedPath !== state.currentTrack.path) return;
  const target = Math.max(0, Math.min(Number(targetValue) || 0, state.currentDuration));
  state.seeking = true;
  state.scrubbing = true;
  state.currentPosition = target;
  state.playOffset = target;
  state.playStartedAt = state.playing ? performance.now() : 0;
  renderSeekPosition(target);
  if (isAudioTrack(state.currentTrack)) {
    if (state.playing) startAudioBufferPlayback(target);
    window.setTimeout(() => {
      state.seeking = false;
      state.scrubbing = false;
    }, 100);
    return;
  }
  if (!state.player) return;
  const nativeTarget = state.loopingModule && state.nativeDuration > 0
    ? target % state.nativeDuration
    : target;
  state.player.setPos(nativeTarget);
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
  control.addEventListener("click", (event) => {
    if (!state.currentTrack) return;
    event.preventDefault();
    wakeAudio().catch(console.warn);
    state.pointerSeeking = false;
    seekFromPoint(event.clientX, control);
  });
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

function wireSeekDelegation() {
  document.addEventListener("click", (event) => {
    const control = event.target.closest("#seekControl, #miniSeekControl");
    if (!control || !state.currentTrack) return;
    event.preventDefault();
    state.pointerSeeking = false;
    wakeAudio().catch(console.warn);
    seekFromPoint(event.clientX, control);
  }, true);
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
  if (state.playing && isAudioTrack(state.currentTrack) && !state.scrubbing && !state.seeking) {
    state.currentPosition = currentPlaybackPosition();
    renderSeekPosition(state.currentPosition);
  }

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
    if (state.audioElement) state.audioElement.loop = state.loop;
  });
  refs.scopeModeBtn.addEventListener("click", cycleScopeMode);
  refs.volume.addEventListener("input", () => {
    const volume = Number(refs.volume.value);
    refs.volumeText.textContent = `${Math.round(volume * 100)}%`;
    if (state.player) state.player.setVol(volume);
    if (state.audioElement) state.audioElement.volume = volume;
  });
  wireSeekControl(refs.seekControl);
  wireSeekControl(refs.miniSeekControl);
  wireSeekDelegation();
  refs.progress.addEventListener("input", () => {
    if (state.pointerSeeking) return;
    state.scrubbing = true;
    renderSeekPosition(Number(refs.progress.value));
  });
  refs.progress.addEventListener("change", () => performSeek(Number(refs.progress.value)));
}

function chooseInitialTrack() {
  state.filtered = tracks;
  const pinballFantasiesIndex = tracks.findIndex((track) => track.id === "olof-gustafsson-pinball-fantasies-ecran-titre");
  state.selected = pinballFantasiesIndex >= 0 ? pinballFantasiesIndex : 0;
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
  refs.loopBtn.classList.toggle("active", state.loop);
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
