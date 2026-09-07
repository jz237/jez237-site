(() => {
  const game=window.__turrican;
  document.getElementById('watch').onclick=()=>game.demo.start();
  document.getElementById('play').onclick=()=>game.start();
  let quality=game.graphics.quality||2;
  document.getElementById('quality').onclick=(e)=>{quality=quality===3?6:quality===6?2:3;game.setQuality(quality);e.target.textContent='Quality: '+({2:'Smooth',3:'HD',6:'4K'})[quality];};
  document.getElementById('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}};
  setInterval(()=>{const actual=game.graphics.quality;if(actual){quality=actual;document.getElementById('quality').textContent='Quality: '+({2:'Smooth',3:'HD',6:'4K'})[quality];}document.body.dataset.demo=String(game.demo.on);document.getElementById('watch').textContent=game.demo.on?'Restart demo':'Watch demo';document.getElementById('tactics').textContent=game.demo.on ? 'DEMO  /  '+(game.tactics||'Finding a safe route') : 'MOVE A/D  ·  J FIRE  ·  SPACE JUMP  ·  Q WEAPON  ·  M MORPH  ·  C FREEZE  ·  V POWER LINE  ·  P PAUSE';},250);
  if(document.modelContext?.registerTool){
    for(const [name,description,fn] of [['start_demo','Start the tactical game demo',()=>game.demo.start()],['start_game','Start a new player-controlled run',()=>game.start()],['read_game','Read current game status',()=>{}]]){
      try{Promise.resolve(document.modelContext.registerTool({name,description,inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:name==='read_game'},execute(input){if(!input||typeof input!=='object'||Object.keys(input).length)throw Error('Expected an empty object');fn();return {...game.snapshot(),graphics:game.graphics};}})).catch(()=>{});}catch{}
    }
  }
})();
