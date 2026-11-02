(() => {
  const game=window.__shard;
  const LABEL={low:'Performance',high:'High',ultra:'Ultra'},SCALE={low:2,high:3,ultra:6},NEXT={low:'high',high:'ultra',ultra:'low'};
  const qBtn=document.getElementById('quality');
  const current=()=>game.graphics.quality||'high';
  const show=()=>{qBtn.textContent='Quality: '+(LABEL[current()]||'High');};
  document.getElementById('watch').onclick=()=>game.demo.start();
  const playBtn=document.getElementById('play');
  playBtn.onclick=()=>{if(game.demo.canTakeOver)game.demo.takeOver();else game.start();};
  qBtn.onclick=()=>{const q=NEXT[current()]||'high';game.setQuality(SCALE[q]);try{localStorage.setItem('shard.quality',q);}catch{}show();};
  document.getElementById('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}};
  setInterval(()=>{show();document.body.dataset.demo=String(game.demo.on);document.body.dataset.mode=game.mode;document.getElementById('watch').textContent=game.demo.on?'Restart demo':'Watch demo';playBtn.textContent=game.demo.canTakeOver?'Take over':'Play';document.getElementById('tactics').textContent=game.demo.on ? 'DEMO  /  '+(game.tactics||'Finding a safe route') : 'MOVE A/D  ·  J FIRE  ·  SPACE JUMP  ·  Q / 1-6 WEAPON  ·  M ROLL  ·  C CRYO  ·  V SHOCKWALL  ·  P PAUSE';},200);
  if(document.modelContext?.registerTool){
    for(const [name,description,fn] of [['start_demo','Start the Shard Assault demo',()=>game.demo.start()],['start_game','Start a new player-controlled run',()=>game.start()],['read_game','Read current game status',()=>{}]]){
      try{Promise.resolve(document.modelContext.registerTool({name,description,inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:name==='read_game'},execute(input){if(!input||typeof input!=='object'||Object.keys(input).length)throw Error('Expected an empty object');fn();return {...game.snapshot(),graphics:game.graphics};}})).catch(()=>{});}catch{}
    }
  }
})();
