/* Eight Ball Deluxe — audio: WebAudio synth SFX (no assets) + speech callouts.
   Everything is generated; mute persists. Speech falls back silently — the DMD
   always shows the line as text regardless. */
'use strict';

const AU = (() => {
  let ctx = null, master = null, comp = null, ready = false;
  let muted = localStorage.getItem('ebd-mute') === '1';
  let droneNodes = null, droneLevel = 0;

  function init(){
    if (ctx) return;
    try{
      ctx = new (window.AudioContext||window.webkitAudioContext)();
      comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16; comp.ratio.value = 6;
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.9;
      master.connect(comp); comp.connect(ctx.destination);
    }catch(e){ ctx = null; }
  }
  function resume(){
    if (!ctx) init();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(()=>{});
    ready = !!ctx;
  }
  function setMute(m){
    muted = m; localStorage.setItem('ebd-mute', m?'1':'0');
    if (master) master.gain.setTargetAtTime(m?0:0.9, ctx.currentTime, 0.02);
    if (m) try{ speechSynthesis.cancel(); }catch(e){}
  }
  function toggleMute(){ setMute(!muted); return muted; }

  /* ---------- primitives ---------- */
  function osc(type,freq,t0,dur,vol,slideTo,Q){
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20,slideTo), t0+dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0+0.004);
    g.gain.exponentialRampToValueAtTime(0.0008, t0+dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0+dur+0.02);
  }
  function noise(t0,dur,vol,fLo,fHi,slideTo){
    if (!ctx) return;
    const len = Math.max(1, (dur*ctx.sampleRate)|0);
    const buf = ctx.createBuffer(1,len,ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i=0;i<len;i++) d[i] = Math.random()*2-1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type='bandpass'; bp.frequency.setValueAtTime((fLo+fHi)/2, t0);
    if (slideTo) bp.frequency.exponentialRampToValueAtTime(slideTo, t0+dur);
    bp.Q.value = 0.9;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0+dur);
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(t0); src.stop(t0+dur);
  }
  const now = () => ctx ? ctx.currentTime : 0;

  /* ---------- sfx ---------- */
  const SFX = {
    /* Bally chime unit — used for bonus countdown; n = 0,1,2 pitch tier */
    chime(n){ const t=now(); const f=[523,659,784][n%3]*(n>=3?2:1);
      osc('square', f, t, .16, .12); osc('sine', f*2, t, .22, .08); },
    drop(){ const t=now(); noise(t,.06,.5,700,1800); osc('sine',150,t,.11,.4,70);
      osc('triangle',90,t,.13,.3,55); },
    standup(){ const t=now(); osc('square',870,t,.07,.14); osc('sine',1740,t,.1,.07); },
    bumper(){ const t=now(); noise(t,.04,.5,900,2400); osc('sine',210,t,.1,.5,95);
      osc('square',420,t,.05,.12); },
    sling(){ const t=now(); noise(t,.035,.45,1200,3200); osc('sine',330,t,.07,.3,140); },
    rollover(){ const t=now(); osc('square',1170,t,.045,.1); },
    saucer(){ const t=now(); noise(t,.08,.35,300,900); osc('sine',120,t,.16,.4,60); },
    eject(){ const t=now(); noise(t,.05,.3,500,1400); osc('sine',180,t,.08,.3,260); },
    knocker(){ const t=now(); noise(t,.05,.95,150,600); osc('sine',82,t,.1,.8,40);
      noise(t+.01,.12,.3,80,300); },
    flipUp(){ const t=now(); noise(t,.025,.32,600,2400); osc('sine',95,t,.04,.2); },
    flipDn(){ const t=now(); noise(t,.02,.16,400,1500); },
    plungePull(p){ const t=now(); osc('triangle',120+p*180,t,.05,.07); },
    launch(p){ const t=now(); noise(t,.1,.5,300,1800,500); osc('sine',70+90*p,t,.2,.5,40); },
    nudge(){ const t=now(); noise(t,.05,.3,90,420); },
    tiltWarn(){ const t=now(); osc('square',180,t,.22,.3,150); },
    tilt(){ const t=now(); osc('square',140,t,.9,.4,60); noise(t,.5,.2,100,400); },
    drain(){ const t=now(); osc('sine',330,t,.5,.3,82); },
    bankshot(){ const t=now(); osc('square',392,t,.07,.14); osc('square',523,t+.07,.07,.14);
      osc('square',659,t+.14,.1,.16); },
    spot(){ const t=now(); osc('sine',659,t,.1,.2); osc('sine',880,t+.1,.14,.2); },
    eight(){ const t=now(); osc('sine',98,t,1.1,.6,72); osc('sine',196,t,.7,.25);
      noise(t,.06,.3,200,800); },
    deluxe(){ const t=now();
      [523,659,784,1047,1319].forEach((f,i)=>{ osc('square',f,t+i*.09,.22,.16); osc('sine',f*2,t+i*.09,.26,.08); }); },
    jingle(){ const t=now();
      [392,523,659,784].forEach((f,i)=>{ osc('square',f,t+i*.11,.18,.14); }); },
    over(){ const t=now();
      [784,659,523,392,330].forEach((f,i)=>{ osc('square',f,t+i*.13,.2,.13); }); },
    match(){ const t=now(); osc('square',262,t,.1,.13); osc('square',262,t+.16,.1,.13); },
    matchWin(){ const t=now(); SFX.knocker();
      [523,784,1047].forEach((f,i)=>osc('square',f,t+.1+i*.1,.2,.15)); },
    extra(){ const t=now(); [659,880,1175].forEach((f,i)=>osc('square',f,t+i*.08,.16,.15)); },
  };

  /* bonus drone — Bally background hum rising with bonus */
  function drone(level){   // 0..1, 0 stops
    droneLevel = level;
    if (!ctx) return;
    if (level > 0 && !droneNodes){
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
      const f = ctx.createBiquadFilter(), g = ctx.createGain();
      o1.type='sawtooth'; o2.type='sawtooth';
      f.type='lowpass'; f.frequency.value=320; f.Q.value=2;
      g.gain.value=0;
      o1.connect(f); o2.connect(f); f.connect(g); g.connect(master);
      o1.start(); o2.start();
      droneNodes = {o1,o2,f,g};
    }
    if (droneNodes){
      const t = now();
      if (level <= 0){
        droneNodes.g.gain.setTargetAtTime(0, t, .2);
        const dn = droneNodes; droneNodes = null;
        setTimeout(()=>{ try{dn.o1.stop();dn.o2.stop();}catch(e){} }, 800);
      } else {
        const base = 55 + level*110;
        droneNodes.o1.frequency.setTargetAtTime(base, t, .08);
        droneNodes.o2.frequency.setTargetAtTime(base*1.007+1.3, t, .08);
        droneNodes.f.frequency.setTargetAtTime(240+level*700, t, .1);
        droneNodes.g.gain.setTargetAtTime(.05+.05*level, t, .12);
      }
    }
  }

  /* ---------- speech ---------- */
  let voice = null, voicesScanned = false, lastSay = 0, sayQ = [];
  function pickVoice(){
    try{
      const vs = speechSynthesis.getVoices();
      if (!vs.length) return;
      voicesScanned = true;
      const pref = [/david/i, /mark/i, /daniel/i, /google uk english male/i,
                    /google us english/i, /male/i];
      for (const p of pref){
        const v = vs.find(v=>p.test(v.name) && /^en/i.test(v.lang));
        if (v){ voice = v; return; }
      }
      voice = vs.find(v=>/^en/i.test(v.lang)) || vs[0];
    }catch(e){}
  }
  try{
    speechSynthesis.addEventListener('voiceschanged', pickVoice);
    pickVoice();
  }catch(e){}

  function say(text, prio){
    // prio: 2 = always (interrupts), 1 = queue, 0 = drop if busy
    if (muted) return;
    try{
      if (!voicesScanned) pickVoice();
      const t = performance.now();
      if (speechSynthesis.speaking || t - lastSay < 1300){
        if (prio === 2){ speechSynthesis.cancel(); }
        else if (prio === 1){ if (sayQ.length < 2) sayQ.push(text); return; }
        else return;
      }
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.rate = 0.92; u.pitch = 0.35; u.volume = 1;
      u.onend = () => {
        lastSay = performance.now();
        if (sayQ.length){ const nx = sayQ.shift(); setTimeout(()=>say(nx,0), 500); }
      };
      lastSay = t;
      speechSynthesis.speak(u);
    }catch(e){}
  }
  function shutUp(){ sayQ.length=0; try{ speechSynthesis.cancel(); }catch(e){} }

  return { init, resume, setMute, toggleMute, get muted(){return muted;},
           sfx: SFX, drone, say, shutUp, get ready(){return ready;} };
})();
