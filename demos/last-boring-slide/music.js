// Per-scene recorded music for The Last Boring Slide.
//
// The deck's own audio engine (inside the bundle in index.html) calls window.__lbsEngine once, with its
// Web Audio graph. This file plays music/<scene>.mp3 for whichever scene is on screen, crossfading between
// scenes and looping each track with a crossfade, and turns the engine's synthesised score down while a
// recorded track is playing. Sound effects, transitions and the wind/water ambience are left alone.
//
// Open the deck with ?score=original to hear the synthesised score instead.
// The tracks are made by scripts/last-boring-slide/gen_music.py.
(() => {
  const qs = new URLSearchParams(location.search);
  if (qs.has('headless') || qs.get('score') === 'original') return;

  const SCENES = ['office', 'tower', 'boat', 'loop', 'swarm', 'dominoes', 'calendar', 'lamp', 'selectall', 'aim', 'futures', 'pile', 'questions'];
  const LEVEL = 0.45; // tracks are mastered to about -18 LUFS; this sits them where the synthesised score sat
  const SCENE_LEVEL = { office: 0.6, questions: 0.7 }; // multipliers: the two dull-template scenes stay in the background
  const SCENE_FADE = 2.2; // seconds, one scene's music into the next
  const LOOP_FADE = 4; // seconds, a track's end into its own start

  let engine = null;
  let bus = null;
  let scene = '';
  let voice = null; // the track now playing: { scene, buffer, source, gain, startedAt }
  let wanted = 0; // counts scene changes, so a slow download cannot start a stale track
  const buffers = new Map(); // scene -> Promise<AudioBuffer | null>

  const load = (id) => {
    if (!buffers.has(id)) {
      buffers.set(id, fetch(`music/${id}.mp3`)
        .then((response) => (response.ok ? response.arrayBuffer() : Promise.reject(new Error(response.status))))
        .then((data) => engine.ctx.decodeAudioData(data))
        .catch((error) => { console.warn('music', id, error.message); return null; }));
    }
    return buffers.get(id);
  };

  const ramp = (param, value, seconds) => {
    const now = engine.ctx.currentTime;
    param.cancelScheduledValues(now);
    param.setValueAtTime(param.value, now);
    param.linearRampToValueAtTime(value, now + Math.max(0.02, seconds));
  };

  // The synthesised score and its reverb send: 1 = as the deck was written, 0 = silent.
  const setScore = (value, seconds) => {
    ramp(engine.bedBus.gain, value, seconds);
    ramp(engine.bedHall.gain, value, seconds);
  };

  const stop = (old, seconds) => {
    if (!old) return;
    ramp(old.gain.gain, 0, seconds);
    try { old.source.stop(engine.ctx.currentTime + seconds + 0.1); } catch {}
    setTimeout(() => { try { old.gain.disconnect(); } catch {} }, (seconds + 0.5) * 1000);
  };

  const start = (id, buffer, fade) => {
    const ctx = engine.ctx;
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = 0;
    source.connect(gain);
    gain.connect(bus);
    source.start();
    ramp(gain.gain, LEVEL * (SCENE_LEVEL[id] || 1), fade);
    return { scene: id, buffer, source, gain, startedAt: ctx.currentTime };
  };

  const change = async (id) => {
    const ticket = ++wanted;
    scene = id;
    const next = SCENES[SCENES.indexOf(id) + 1];
    const buffer = SCENES.includes(id) ? await load(id) : null;
    if (ticket !== wanted) return;
    // Decoded audio is large: keep this scene and the next one, let the rest go.
    for (const key of buffers.keys()) if (key !== id && key !== next) buffers.delete(key);
    if (next) load(next);
    stop(voice, SCENE_FADE);
    voice = buffer ? start(id, buffer, SCENE_FADE) : null;
    setScore(buffer ? 0 : 1, SCENE_FADE);
  };

  const tick = () => {
    const deck = window.__deck;
    if (!engine || !deck || engine.ctx.state !== 'running') return;
    const now = deck.info().scene;
    if (now && now !== scene) change(now);
    if (voice && engine.ctx.currentTime > voice.startedAt + voice.buffer.duration - LOOP_FADE) {
      const old = voice;
      voice = start(old.scene, old.buffer, LOOP_FADE);
      stop(old, LOOP_FADE);
    }
  };

  window.__lbsEngine = (audioEngine) => {
    if (engine) return;
    engine = audioEngine;
    bus = engine.ctx.createGain();
    bus.connect(engine.master); // after the effects compressor, before the deck's mute
    setInterval(tick, 120);
  };
})();
