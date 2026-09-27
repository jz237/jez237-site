// Load in a disposable local preview: then await runJoustRegression().
// Exercises the actual WebGL renderer and game shell; never submits leaderboard scores.
window.runJoustRegression = async function () {
  const results=[];
  const saved=JSON.stringify(save),stored=localStorage.getItem(SAVE_KEY);
  const check=(name,condition)=>{if(!condition)throw Error(name);results.push(name);};
  const key=(code,repeat=false)=>window.dispatchEvent(new KeyboardEvent('keydown',{code,repeat,bubbles:true}));
  const up=code=>window.dispatchEvent(new KeyboardEvent('keyup',{code,bubbles:true}));
  const paint=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  try {
    __joustQA.bot=false;__joustQA.start(1);hudCanvas.focus();
    key('ArrowRight');key('Space');__joustQA.tick(1);up('ArrowRight');up('Space');
    check('keyboard flap starts a protected life',engine.started&&!engine.players[0].safe);
    key('KeyP');check('P pauses and opens the accessible dialog',paused&&!pauseMenu.hidden);
    key('KeyP',true);check('holding P cannot repeatedly toggle pause',paused);
    const waveTime=engine.waveTime,time=renderer.time;await paint();await paint();
    check('pause freezes physics and animation',engine.waveTime===waveTime&&renderer.time===time);
    document.getElementById('resume').click();check('resume clears pending input',!paused&&!flapQueue.some(Boolean));
    touch.left=touch.flapHeld=true;flapQueue[0]=true;window.dispatchEvent(new Event('blur'));
    check('focus loss pauses and clears touch, keyboard and queued strokes',paused&&!touch.left&&!touch.flapHeld&&!flapQueue.some(Boolean));
    const before=engine.players[0].lives;document.getElementById('restart').click();
    check('restart costs exactly one mount and waits for the next input',engine.players[0].lives===before-1&&state==='intro'&&!engine.started&&!paused);
    setPaused(true);document.getElementById('quit').click();
    check('quit replaces the arena with a fresh attract simulation',state==='title'&&renderer.previousPoses===null&&!paused);
    __joustQA.start(1,'2p');hudCanvas.focus();key('KeyA');key('KeyW');
    const input=readInputs();up('KeyA');up('KeyW');
    check('two-player keys only control the intended rider',!input[0].left&&!input[0].flapHeld&&input[1].left&&input[1].flapHeld);
    const originalPad=Object.getOwnPropertyDescriptor(navigator,'getGamepads');
    try {
      const buttons=Array.from({length:16},()=>({pressed:false}));
      const gp={connected:true,axes:[0,0],buttons};
      Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[gp]});
      clearInput();buttons[1].pressed=true;pollGamepad();
      check('holding gamepad B flaps without arming a life-costing restart',pad.flapHeld&&escDownAt===0);
      buttons[1].pressed=false;buttons[8].pressed=true;pollGamepad();
      check('gamepad Back deliberately arms restart',escDownAt>0);
      gp.connected=false;pollGamepad();
      check('disconnecting a gamepad clears held controls and restart',!pad.on&&!pad.flapHeld&&escDownAt===0);
    } finally { if(originalPad)Object.defineProperty(navigator,'getGamepads',originalPad);else delete navigator.getGamepads; }
    __joustQA.start(4);const p=engine.players[0];p.x=0;p.y=110;p.onGround=false;p.safe=false;p.wingDown=5;
    renderer.render(engine.snapshot(),16.6);const view=renderer.views.get(p.id);
    check('wrapped copies share the same wing and body animation',view.ghost.group.visible&&view.main.state.c===view.ghost.state.c&&view.main.pivot.rotation.z===view.ghost.pivot.rotation.z);
    check('wrap copies and platforms are clipped to the actual arena',renderer.gl.localClippingEnabled&&view.main.mBody.clippingPlanes.length===2);
    p.x=146;p.y=WORLD.FLOOR-40;renderer.reachAmt=0;renderer.pokePh=-1;renderer.pokeT=100;
    renderer._reachUpdate(engine.snapshot(),1,1/60);
    check('the lava hand never targets a rider above the safe central island',renderer.reachAmt===0);
    const empty={players:[],enemies:[],eggs:[],pteros:[],trolls:[],platforms:engine.platforms,info:{}};
    renderer.render(empty,0);check('removed entities release their views immediately',renderer.views.size===0);
    // Warm the permanent early-wave bridge geometry before measuring per-entity leaks.
    __joustQA.start(1);renderer.render(engine.snapshot(),16.6);renderer.render(empty,0);
    const mem0=renderer.gl.info.memory.geometries;
    for(let i=0;i<30;i++) {__joustQA.start(1+i%10);renderer.render(engine.snapshot(),16.6);renderer.render(empty,0);}
    check('30 successive arenas do not leak GPU geometry',renderer.gl.info.memory.geometries<=mem0+2);
    for(const q of ['low','medium','high']) {renderer.setQuality(q);renderer.render(engine.snapshot(),16.6);check(q+' quality renders with the intended post-processing mode',renderer.post.enabled===(q!=='low')&&(q!=='low'||renderer.post.rtScene===null));}
    renderer.particles.spawn(0,0,0,{life:200});const particle=renderer.particles.live.at(-1);const age=particle.t;renderer.particles.update(.5);renderer.particles.update(.5);
    check('particles age by elapsed time',particle.t===age+1);
    const stopped=particle.t;renderer.particles.update(0);check('paused particles do not advance',particle.t===stopped);
    for(const q of ['low','high']) {renderer.setQuality(q);renderer.render(engine.snapshot(),16.6);}
    await paint();
    return {passed:results.length,checks:results,memory:renderer.gl.info.memory};
  } finally {
    __joustQA.bot=false;save=JSON.parse(saved);backToTitle();
    if(stored===null)localStorage.removeItem(SAVE_KEY);else localStorage.setItem(SAVE_KEY,stored);
    renderer.setQuality(save.opts.quality);
  }
};
