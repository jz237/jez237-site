/* Pay Dirt — audio.js
   WebAudio procedural SFX + sequenced music loop. Stub in Phase 0; full pass in Phase 8. */
'use strict';
const AUDIO = (() => {
  let ctx = null, master = null, musicGain = null, sfxGain = null;
  let muted = false;
  try { muted = localStorage.getItem('paydirt-muted') === '1'; } catch (e) {}

  function ensure(){
    if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return ctx.state === 'running'; }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.connect(ctx.destination);
      sfxGain = ctx.createGain(); sfxGain.connect(master);
      musicGain = ctx.createGain(); musicGain.gain.value = 0.32; musicGain.connect(master);
      master.gain.value = muted ? 0 : 1;
    } catch (e) { return false; }
    return true;
  }

  function setMuted(m){
    muted = m;
    try { localStorage.setItem('paydirt-muted', m ? '1' : '0'); } catch (e) {}
    if (master) master.gain.value = m ? 0 : 1;
  }

  function sfx(name){ if (!ctx || muted) return; /* Phase 8 fills this in */ }
  function startMusic(){ /* Phase 8 */ }
  function stopMusic(){ /* Phase 8 */ }

  return { ensure, sfx, startMusic, stopMusic, setMuted, get muted(){ return muted; } };
})();
