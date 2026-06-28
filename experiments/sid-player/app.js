(function () {
  const PLAYER_BASE = "/experiments/sid-player/";
  const tracks = Array.isArray(window.SID_LIBRARY) ? window.SID_LIBRARY : [];
  const composers = Array.isArray(window.SID_COMPOSERS) ? window.SID_COMPOSERS : [];
  const DEFAULT_DURATION_MS = 180000;

  const refs = {
    trackTotal: document.getElementById("trackTotal"),
    search: document.getElementById("search"),
    composerFilter: document.getElementById("composerFilter"),
    listMeta: document.getElementById("listMeta"),
    trackList: document.getElementById("trackList"),
    nowTitle: document.getElementById("nowTitle"),
    nowMeta: document.getElementById("nowMeta"),
    status: document.getElementById("status"),
    prevBtn: document.getElementById("prevBtn"),
    playBtn: document.getElementById("playBtn"),
    stopBtn: document.getElementById("stopBtn"),
    nextBtn: document.getElementById("nextBtn"),
    loopBtn: document.getElementById("loopBtn"),
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
  };

  const state = {
    filtered: [],
    selected: 0,
    currentTrack: null,
    currentDuration: DEFAULT_DURATION_MS,
    initialized: null,
    playing: false,
    loading: false,
    loop: false,
    scrubbing: false,
    ending: false,
    fallbackPosition: 0,
    wallStarted: 0,
    pointerSeeking: false,
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
    if (!player) return DEFAULT_DURATION_MS;
    const max = Number(player.getMaxPlaybackPosition());
    if (Number.isFinite(max) && max > 5000) return max;
    return DEFAULT_DURATION_MS;
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
    const composer = refs.composerFilter.value;
    state.filtered = tracks.filter((track) => {
      const composerMatch = composer === "all" || track.composer === composer;
      if (!composerMatch) return false;
      if (!query) return true;
      return normalize(`${track.title} ${track.composer} ${track.category || ""} ${track.fileName}`).includes(query);
    });

    if (state.selected >= state.filtered.length) state.selected = 0;
    renderTracks();
  }

  function renderTracks() {
    refs.trackList.innerHTML = "";
    refs.listMeta.textContent = `${state.filtered.length} shown`;

    const fragment = document.createDocumentFragment();
    state.filtered.forEach((track, index) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = `track${track === state.currentTrack ? " active" : ""}`;
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", track === state.currentTrack ? "true" : "false");
      row.dataset.index = String(index);
      row.innerHTML = `
        <span>
          <span class="track-title"></span>
          <span class="track-composer"></span>
        </span>
        <span class="track-size"></span>
      `;
      row.querySelector(".track-title").textContent = track.title;
      row.querySelector(".track-composer").textContent = track.category
        ? `${track.composer} / ${track.category}`
        : track.composer;
      row.querySelector(".track-size").textContent = formatBytes(track.size);
      row.addEventListener("pointerdown", wakeAudio, { passive: true });
      row.addEventListener("click", () => {
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
    if (!track || state.loading) return;
    state.loading = true;
    state.currentTrack = track;
    setStatus("Loading", "");
    refs.nowTitle.textContent = track.title;
    refs.nowMeta.textContent = `${track.composer} | ${track.fileName}`;
    renderTracks();

    try {
      const player = await ensurePlayer();
      await ScriptNodePlayer.loadMusicFromURL(
        new URL(track.path, window.location.origin + PLAYER_BASE).href,
        { track: -1, timeout: DEFAULT_DURATION_MS / 1000, traceSID: false },
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
      refs.duration.textContent = formatTime(state.currentDuration);
      renderSeekPosition(0);

      if (autoplay) {
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
      state.playing = false;
      refs.playBtn.textContent = "Play";
      refs.scope.classList.remove("playing");
      setStatus("Error", "error");
      refs.nowMeta.textContent = error.message || "SID playback failed";
    } finally {
      state.loading = false;
    }
  }

  async function togglePlay() {
    wakeAudio();
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
    if (state.ending || state.loading || !state.currentTrack) return;
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
    if (state.currentTrack && !state.scrubbing) {
      const pos = Math.min(playbackPosition(), state.currentDuration);
      renderSeekPosition(pos);

      if (state.playing && pos >= state.currentDuration - 300) {
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

  function seekToProgress(targetValue) {
    const player = getPlayer();
    const sourceValue = typeof targetValue === "number" || typeof targetValue === "string"
      ? targetValue
      : refs.progress.value;
    const target = Math.max(0, Math.min(Number(sourceValue) || 0, state.currentDuration));
    renderSeekPosition(target);

    if (player && typeof player.seekPlaybackPosition === "function") {
      try {
        player.seekPlaybackPosition(target);
      } catch (error) {
        console.warn(error);
      }
    }

    state.fallbackPosition = target;
    if (state.playing) {
      state.wallStarted = performance.now() - target;
    } else {
      state.wallStarted = 0;
    }
    state.scrubbing = false;
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
    refs.loopBtn.addEventListener("click", () => {
      state.loop = !state.loop;
      refs.loopBtn.classList.toggle("active", state.loop);
    });
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
      seekFromPoint(event.clientX);
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
      if (touch) seekFromPoint(touch.clientX);
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
    }
  }

  function init() {
    refs.trackTotal.textContent = String(tracks.length);
    refs.volumeText.textContent = `${Math.round(Number(refs.volume.value) * 100)}%`;
    renderSeekPosition(0);
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
