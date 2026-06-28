(function () {
  const PLAYER_BASE = "/experiments/sid-player/";
  const tracks = Array.isArray(window.SID_LIBRARY) ? window.SID_LIBRARY : [];
  const composers = Array.isArray(window.SID_COMPOSERS) ? window.SID_COMPOSERS : [];
  const stilNotes = window.SID_STIL && typeof window.SID_STIL === "object" ? window.SID_STIL : {};
  const FALLBACK_SEEK_WINDOW_MS = 600000;
  const FAVORITES_KEY = "sid-player-favorites";
  const SCOPE_MODE_KEY = "sid-player-scope-mode";

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
    seekNotice: document.getElementById("seekNotice"),
    volume: document.getElementById("volume"),
    volumeText: document.getElementById("volumeText"),
    scope: document.getElementById("scope"),
    scopeGrid: document.getElementById("scopeGrid"),
    stilPanel: document.getElementById("stilPanel"),
    stilText: document.getElementById("stilText"),
  };

  const state = {
    filtered: [],
    selected: 0,
    currentTrack: null,
    currentDuration: FALLBACK_SEEK_WINDOW_MS,
    durationKnown: false,
    initialized: null,
    playing: false,
    loading: false,
    seeking: false,
    loop: false,
    scrubbing: false,
    ending: false,
    fallbackPosition: 0,
    wallStarted: 0,
    pointerSeeking: false,
    seekRunId: 0,
    pendingAutoplay: false,
    favorites: new Set(),
    scopeMode: "full",
  };

  function formatTime(ms) {
    if (!Number.isFinite(ms) || ms < 0) return "--:--";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function formatBytes(size) {
    if (!Number.isFinite(size)) return "";
    if (size < 1024) return `${size} B`;
    return `${Math.round(size / 1024)} KB`;
  }

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function setStatus(text, kind) {
    refs.status.textContent = text;
    refs.status.className = `status${kind ? ` ${kind}` : ""}`;
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
    refs.favNowBtn.textContent = active ? "★" : "☆";
    refs.favNowBtn.setAttribute("aria-pressed", active ? "true" : "false");
  }

  function setSeekNotice(text) {
    refs.seekNotice.hidden = !text;
    refs.seekNotice.textContent = text || "";
  }

  function getPlayer() {
    if (typeof ScriptNodePlayer === "undefined") return null;
    return ScriptNodePlayer.getInstance();
  }

  function wakeAudio() {
    if (typeof ScriptNodePlayer === "undefined") return;

    try {
      const context = ScriptNodePlayer.getWebAudioContext();
      if (context && context.state === "suspended" && typeof context.resume === "function") {
        context.resume();
      }
    } catch (error) {
      console.warn(error);
    }

    const player = getPlayer();
    if (player && typeof player._initByUserGesture === "function") {
      try {
        player._initByUserGesture();
      } catch (error) {
        console.warn(error);
      }
    }
  }

  async function ensurePlayer() {
    if (state.initialized) return state.initialized;
    if (typeof SIDBackendAdapter === "undefined" || typeof ScriptNodePlayer === "undefined") {
      throw new Error("webSID did not load");
    }

    setStatus("Starting", "");
    window.backend = new SIDBackendAdapter(undefined, undefined, undefined);
    state.initialized = ScriptNodePlayer.initialize(window.backend, onTrackEnd, [], true).then(() => {
      const player = getPlayer();
      if (player) player.setVolume(Number(refs.volume.value));
      setStatus("Ready", "ready");
      return player;
    });
    return state.initialized;
  }

  function bestDuration() {
    const player = getPlayer();
    state.durationKnown = false;
    const trackDuration = Number(state.currentTrack && state.currentTrack.durationMs);
    if (Number.isFinite(trackDuration) && trackDuration > 5000) {
      state.durationKnown = true;
      return trackDuration;
    }
    if (!player) return FALLBACK_SEEK_WINDOW_MS;
    const max = Number(player.getMaxPlaybackPosition());
    if (Number.isFinite(max) && max > 5000) {
      state.durationKnown = true;
      return max;
    }
    return FALLBACK_SEEK_WINDOW_MS;
  }

  function playbackPosition() {
    const player = getPlayer();
    if (player) {
      const position = Number(player.getPlaybackPosition());
      if (Number.isFinite(position) && position > 0) {
        state.fallbackPosition = position;
        if (state.playing) state.wallStarted = performance.now() - position;
        return position;
      }

      const playtime = Number(player.getCurrentPlaytime());
      if (Number.isFinite(playtime) && playtime > 0) {
        const ms = playtime * 1000;
        state.fallbackPosition = ms;
        if (state.playing) state.wallStarted = performance.now() - ms;
        return ms;
      }
    }

    if (state.playing && state.wallStarted) {
      state.fallbackPosition = Math.max(0, performance.now() - state.wallStarted);
    }
    return state.fallbackPosition;
  }

  function beginProgressClock(offset) {
    state.fallbackPosition = Math.max(0, Number(offset) || 0);
    state.wallStarted = performance.now() - state.fallbackPosition;
  }

  function holdProgressClock() {
    state.fallbackPosition = playbackPosition();
    state.wallStarted = 0;
  }

  function renderSeekPosition(ms) {
    const value = Math.max(0, Math.min(Number(ms) || 0, state.currentDuration));
    const percent = state.currentDuration > 0 ? (value / state.currentDuration) * 100 : 0;
    refs.progress.max = String(state.currentDuration);
    refs.progress.value = String(value);
    refs.elapsed.textContent = formatTime(value);
    refs.duration.textContent = formatTime(state.currentDuration);
    refs.seekFill.style.width = `${percent}%`;
    refs.seekThumb.style.left = `${percent}%`;
    refs.seekControl.setAttribute("aria-valuemax", String(Math.round(state.currentDuration)));
    refs.seekControl.setAttribute("aria-valuenow", String(Math.round(value)));
    refs.seekControl.setAttribute("aria-valuetext", formatTime(value));
  }

  function currentTrackUrl() {
    if (!state.currentTrack) return "";
    return new URL(state.currentTrack.path, window.location.origin + PLAYER_BASE).href;
  }

  function updateStil(track) {
    const note = track ? stilNotes[track.path] : "";
    refs.stilPanel.hidden = !note;
    refs.stilText.textContent = note || "";
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
        || (collection === "top100" && track.top100Rank)
        || (collection === "games" && track.composerKey === "GAMES");
      if (!collectionMatch) return false;
      const composerMatch = composer === "all" || track.composer === composer;
      if (!composerMatch) return false;
      if (!query) return true;
      return normalize(`${track.title} ${track.composer} ${track.category || ""} ${track.fileName} ${track.top100Title || ""}`).includes(query);
    });

    if (collection === "top100") {
      state.filtered.sort((a, b) => (a.top100Rank || 999) - (b.top100Rank || 999));
    }

    if (state.selected >= state.filtered.length) state.selected = 0;
    renderTracks();
  }

  function renderTracks() {
    refs.trackList.innerHTML = "";
    const top100Count = state.filtered.filter((track) => track.top100Rank).length;
    refs.listMeta.textContent = refs.collectionFilter.value === "favorites"
      ? `${state.filtered.length} favorites`
      : refs.collectionFilter.value === "top100"
      ? `${top100Count} ranked favorites`
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
        <button class="track-favorite" type="button" aria-label="Favorite SID"></button>
      `;
      row.querySelector(".track-title").textContent = track.title;
      const label = track.top100Rank
        ? `#${track.top100Rank} HVSC Top 100`
        : track.category;
      row.querySelector(".track-composer").textContent = label
        ? `${track.composer} / ${label}`
        : track.composer;
      row.querySelector(".track-duration").textContent = track.durationMs ? formatTime(track.durationMs) : formatBytes(track.size);
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
      mainButton.addEventListener("pointerdown", wakeAudio, { passive: true });
      mainButton.addEventListener("click", () => {
        wakeAudio();
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

  function setNowPlaying(track, songInfo) {
    const title = songInfo && songInfo.songName ? songInfo.songName : track.title;
    const author = songInfo && songInfo.songAuthor ? songInfo.songAuthor : track.composer;
    const released = songInfo && songInfo.songReleased ? songInfo.songReleased : track.fileName;
    refs.nowTitle.textContent = title;
    refs.nowMeta.textContent = `${author} | ${released}`;
  }

  async function loadTrack(track, autoplay) {
    if (!track) return;
    if (state.loading) {
      state.pendingAutoplay = state.pendingAutoplay || autoplay;
      return;
    }
    state.loading = true;
    state.pendingAutoplay = Boolean(autoplay);
    state.currentTrack = track;
    setStatus("Loading", "");
    setSeekNotice("");
    refs.playBtn.textContent = autoplay ? "Pause" : "Play";
    refs.scope.classList.remove("playing");
    refs.nowTitle.textContent = track.title;
    refs.nowMeta.textContent = `${track.composer} | ${track.fileName}`;
    updateFavoriteControls();
    updateStil(track);
    renderTracks();

    try {
      const player = await ensurePlayer();
      await ScriptNodePlayer.loadMusicFromURL(
        new URL(track.path, window.location.origin + PLAYER_BASE).href,
        { track: -1, timeout: -1, traceSID: false },
        () => {
          throw new Error(`Could not load ${track.fileName}`);
        },
        () => {}
      );

      const info = player.getSongInfo();
      state.currentDuration = bestDuration();
      state.fallbackPosition = 0;
      state.wallStarted = 0;
      setNowPlaying(track, info);
      updateFavoriteControls();
      updateStil(track);
      refs.duration.textContent = formatTime(state.currentDuration);
      renderSeekPosition(0);

      const shouldAutoplay = state.pendingAutoplay;
      state.pendingAutoplay = false;
      if (shouldAutoplay) {
        player.resume();
        state.playing = true;
        beginProgressClock(0);
        refs.playBtn.textContent = "Pause";
        refs.scope.classList.add("playing");
        setStatus("Playing", "ready");
      } else {
        player.pause();
        state.playing = false;
        refs.playBtn.textContent = "Play";
        refs.scope.classList.remove("playing");
        setStatus("Ready", "ready");
      }
    } catch (error) {
      console.error(error);
      state.pendingAutoplay = false;
      state.playing = false;
      refs.playBtn.textContent = "Play";
      refs.scope.classList.remove("playing");
      setStatus("Error", "error");
      refs.nowMeta.textContent = error.message || "SID playback failed";
    } finally {
      state.loading = false;
      if (!state.seeking) setSeekNotice("");
    }
  }

  async function togglePlay() {
    wakeAudio();
    if (state.loading) {
      state.pendingAutoplay = true;
      refs.playBtn.textContent = "Pause";
      setStatus("Loading", "");
      return;
    }
    const player = await ensurePlayer();
    if (!state.currentTrack) {
      await loadTrack(selectedTrack(), true);
      return;
    }

    if (state.playing) {
      holdProgressClock();
      player.pause();
      state.playing = false;
      refs.playBtn.textContent = "Play";
      refs.scope.classList.remove("playing");
      setStatus("Paused", "");
    } else {
      beginProgressClock(state.fallbackPosition);
      player.resume();
      state.playing = true;
      refs.playBtn.textContent = "Pause";
      refs.scope.classList.add("playing");
      setStatus("Playing", "ready");
    }
  }

  function stopPlayback() {
    state.pendingAutoplay = false;
    const player = getPlayer();
    if (!player) return;
    player.pause();
    try {
      player.seekPlaybackPosition(0);
    } catch (error) {
      console.warn(error);
    }
    state.playing = false;
    state.fallbackPosition = 0;
    state.wallStarted = 0;
    refs.playBtn.textContent = "Play";
    refs.scope.classList.remove("playing");
    renderSeekPosition(0);
    setStatus("Stopped", "");
  }

  function move(delta) {
    if (!state.filtered.length) return;
    state.selected = (state.selected + delta + state.filtered.length) % state.filtered.length;
    loadTrack(selectedTrack(), true);
  }

  async function onTrackEnd() {
    if (state.ending || state.loading || state.seeking || !state.currentTrack) return;
    state.ending = true;
    state.playing = false;
    refs.playBtn.textContent = "Play";
    refs.scope.classList.remove("playing");

    if (state.loop) {
      await loadTrack(state.currentTrack, true);
    } else {
      move(1);
    }

    window.setTimeout(() => {
      state.ending = false;
    }, 500);
  }

  function updateProgress() {
    if (state.currentTrack && !state.scrubbing && !state.seeking) {
      const rawPosition = playbackPosition();
      if (!state.durationKnown && rawPosition > state.currentDuration - 30000) {
        state.currentDuration += FALLBACK_SEEK_WINDOW_MS;
      }
      const pos = state.durationKnown ? Math.min(rawPosition, state.currentDuration) : rawPosition;
      renderSeekPosition(pos);

      if (state.durationKnown && state.playing && pos >= state.currentDuration - 300) {
        onTrackEnd();
      }
    }
    window.requestAnimationFrame(updateProgress);
  }

  function renderSpectrum() {
    const player = getPlayer();
    const data = player && typeof player.getFreqByteData === "function" ? player.getFreqByteData() : null;
    const bars = refs.scopeGrid.children;

    if (data && data.length) {
      refs.scope.classList.add("live");
      const step = Math.max(1, Math.floor(data.length / bars.length));
      for (let i = 0; i < bars.length; i += 1) {
        let peak = 0;
        const start = i * step;
        const end = Math.min(data.length, start + step);
        for (let j = start; j < end; j += 1) {
          if (data[j] > peak) peak = data[j];
        }
        const level = Math.max(8, Math.round((peak / 255) * 100));
        bars[i].style.height = `${level}%`;
      }
    } else {
      refs.scope.classList.remove("live");
    }

    window.requestAnimationFrame(renderSpectrum);
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

  function waitForUi() {
    return new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  async function fastForwardBackend(target, seekId) {
    const backend = window.backend;
    if (!backend || typeof backend.computeAudioSamples !== "function" || typeof backend.getAudioBufferLength !== "function") {
      throw new Error("SID fast-forward is not available");
    }

    const sampleRate = typeof ScriptNodePlayer.getWebAudioSampleRate === "function"
      ? ScriptNodePlayer.getWebAudioSampleRate()
      : 44100;
    const bufferLength = Math.max(1, Number(backend.getAudioBufferLength()) || 1024);
    const calls = Math.ceil((sampleRate * (target / 1000)) / bufferLength);

    for (let i = 0; i < calls; i += 1) {
      if (seekId !== state.seekRunId) return false;
      backend.computeAudioSamples();
      if (i > 0 && i % 240 === 0) {
        const seekPosition = (i / calls) * target;
        setStatus(`Seeking ${formatTime(seekPosition)}`, "");
        setSeekNotice(`Fast-forwarding ${formatTime(seekPosition)} / ${formatTime(target)}`);
        await waitForUi();
      }
    }

    if (backend._transformer && typeof backend._transformer.seekPosition === "function") {
      backend._transformer.seekPosition(target);
    }
    return true;
  }

  async function manualSeekTo(player, target, seekId) {
    const wasPlaying = state.playing;
    const volume = Number(refs.volume.value);

    setStatus(`Seeking ${formatTime(target)}`, "");
    setSeekNotice(`Preparing seek to ${formatTime(target)}`);
    player.pause();
    player.setVolume(0);

    await ScriptNodePlayer.loadMusicFromURL(
      currentTrackUrl(),
      { track: -1, timeout: -1, traceSID: false },
      () => {
        throw new Error(`Could not reload ${state.currentTrack.fileName}`);
      },
      () => {}
    );

    if (seekId !== state.seekRunId) return;
    player.pause();
    const completed = await fastForwardBackend(target, seekId);
    if (!completed || seekId !== state.seekRunId) return;

    player.setVolume(volume);
    state.fallbackPosition = target;
    setSeekNotice("");

    if (wasPlaying) {
      beginProgressClock(target);
      player.resume();
      state.playing = true;
      refs.playBtn.textContent = "Pause";
      refs.scope.classList.add("playing");
      setStatus("Playing", "ready");
    } else {
      state.wallStarted = 0;
      player.pause();
      state.playing = false;
      refs.playBtn.textContent = "Play";
      refs.scope.classList.remove("playing");
      setStatus("Paused", "");
    }
  }

  async function performSeek(targetValue) {
    const player = getPlayer();
    const sourceValue = typeof targetValue === "number" || typeof targetValue === "string"
      ? targetValue
      : refs.progress.value;
    const target = Math.max(0, Math.min(Number(sourceValue) || 0, state.currentDuration));
    const seekId = state.seekRunId + 1;
    state.seekRunId = seekId;
    state.seeking = true;
    state.scrubbing = true;
    renderSeekPosition(target);

    try {
      if (!player || typeof player.seekPlaybackPosition !== "function") {
        throw new Error("SID player is not ready");
      }

      const maxSeek = Number(player.getMaxPlaybackPosition());
      if (Number.isFinite(maxSeek) && maxSeek > 0) {
        player.seekPlaybackPosition(target);
      } else {
        await manualSeekTo(player, target, seekId);
      }

      if (seekId !== state.seekRunId) return;
      state.fallbackPosition = target;
      if (state.playing) {
        state.wallStarted = performance.now() - target;
      } else {
        state.wallStarted = 0;
      }
    } catch (error) {
      console.error(error);
      setStatus("Seek failed", "error");
      setSeekNotice("Seek failed");
    } finally {
      if (seekId === state.seekRunId) {
        state.seeking = false;
        state.scrubbing = false;
        if (refs.status.textContent !== "Seek failed") setSeekNotice("");
      }
    }
  }

  function seekToProgress(targetValue) {
    performSeek(targetValue);
  }

  function progressValueFromPoint(clientX) {
    const rect = refs.seekControl.getBoundingClientRect();
    if (!rect.width) return Number(refs.progress.value) || 0;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return ratio * state.currentDuration;
  }

  function previewSeekFromPoint(clientX) {
    const target = progressValueFromPoint(clientX);
    renderSeekPosition(target);
    return target;
  }

  function seekFromPoint(clientX) {
    seekToProgress(previewSeekFromPoint(clientX));
  }

  function wireEvents() {
    refs.search.addEventListener("input", applyFilters);
    refs.collectionFilter.addEventListener("change", applyFilters);
    refs.composerFilter.addEventListener("change", applyFilters);
    refs.playBtn.addEventListener("pointerdown", wakeAudio, { passive: true });
    refs.prevBtn.addEventListener("pointerdown", wakeAudio, { passive: true });
    refs.nextBtn.addEventListener("pointerdown", wakeAudio, { passive: true });
    refs.playBtn.addEventListener("click", () => togglePlay().catch((error) => {
      console.error(error);
      setStatus("Error", "error");
    }));
    refs.stopBtn.addEventListener("click", stopPlayback);
    refs.prevBtn.addEventListener("click", () => {
      wakeAudio();
      move(-1);
    });
    refs.nextBtn.addEventListener("click", () => {
      wakeAudio();
      move(1);
    });
    refs.favNowBtn.addEventListener("click", () => {
      toggleFavorite(activeTrack());
    });
    refs.loopBtn.addEventListener("click", () => {
      state.loop = !state.loop;
      refs.loopBtn.classList.toggle("active", state.loop);
    });
    refs.scopeModeBtn.addEventListener("click", cycleScopeMode);
    refs.volume.addEventListener("input", () => {
      const volume = Number(refs.volume.value);
      refs.volumeText.textContent = `${Math.round(volume * 100)}%`;
      const player = getPlayer();
      if (player) player.setVolume(volume);
    });
    refs.seekControl.addEventListener("pointerdown", (event) => {
      if (!state.currentTrack) return;
      event.preventDefault();
      wakeAudio();
      state.pointerSeeking = true;
      state.scrubbing = true;
      refs.seekControl.setPointerCapture(event.pointerId);
      previewSeekFromPoint(event.clientX);
    });
    refs.seekControl.addEventListener("pointermove", (event) => {
      if (!state.pointerSeeking) return;
      event.preventDefault();
      previewSeekFromPoint(event.clientX);
    });
    refs.seekControl.addEventListener("pointerup", (event) => {
      if (!state.pointerSeeking) return;
      event.preventDefault();
      state.pointerSeeking = false;
      seekFromPoint(event.clientX);
    });
    refs.seekControl.addEventListener("pointercancel", () => {
      state.pointerSeeking = false;
      state.scrubbing = false;
    });
    refs.seekControl.addEventListener("touchstart", (event) => {
      if (!state.currentTrack) return;
      event.preventDefault();
      wakeAudio();
      state.scrubbing = true;
      const touch = event.changedTouches[0];
      if (touch) previewSeekFromPoint(touch.clientX);
    }, { passive: false });
    refs.seekControl.addEventListener("touchmove", (event) => {
      if (!state.currentTrack) return;
      event.preventDefault();
      const touch = event.changedTouches[0];
      if (touch) previewSeekFromPoint(touch.clientX);
    }, { passive: false });
    refs.seekControl.addEventListener("touchend", (event) => {
      if (!state.currentTrack) return;
      event.preventDefault();
      const touch = event.changedTouches[0];
      if (touch) seekFromPoint(touch.clientX);
    }, { passive: false });
    refs.progress.addEventListener("input", () => {
      if (state.pointerSeeking) return;
      state.scrubbing = true;
      renderSeekPosition(Number(refs.progress.value));
    });
    refs.progress.addEventListener("change", seekToProgress);
    refs.seekControl.addEventListener("keydown", (event) => {
      if (!state.currentTrack) return;
      const current = Number(refs.progress.value) || 0;
      const step = event.shiftKey ? 10000 : 5000;
      let target = current;

      if (event.key === "ArrowLeft") target = current - step;
      if (event.key === "ArrowRight") target = current + step;
      if (event.key === "PageDown") target = current - 30000;
      if (event.key === "PageUp") target = current + 30000;
      if (event.key === "Home") target = 0;
      if (event.key === "End") target = state.currentDuration;

      if (target !== current) {
        event.preventDefault();
        seekToProgress(target);
      }
    });
  }

  function chooseInitialTrack() {
    const exactCommandoIndex = tracks.findIndex((track) => track.composerKey === "Hubbard_Rob" && track.fileName === "Commando.sid");
    const commandoIndex = exactCommandoIndex >= 0
      ? exactCommandoIndex
      : tracks.findIndex((track) => normalize(track.title).includes("commando"));
    state.filtered = tracks;
    state.selected = commandoIndex >= 0 ? commandoIndex : 0;
    const track = tracks[state.selected];
    if (track) {
      refs.nowTitle.textContent = track.title;
      refs.nowMeta.textContent = `${track.composer} | ${track.fileName}`;
      updateFavoriteControls();
      updateStil(track);
    }
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
    updateProgress();
    renderSpectrum();
    ensurePlayer().catch((error) => {
      console.error(error);
      setStatus("Error", "error");
    });
  }

  init();
})();
