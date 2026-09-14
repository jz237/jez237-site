// The rod-holder bell: two rings of three decaying partials from WebAudio, nothing to download.
// Browsers keep the context suspended until a gesture; the ring is silent then, never an error.
let ctx=null;
export function ringBell(volume=.22){
 try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();
  for(const off of [0,.32]){const t=ctx.currentTime+off;for(const [f,g] of [[2093,1],[3136,.5],[4186,.22]]){const o=ctx.createOscillator(),a=ctx.createGain();o.type='sine';o.frequency.value=f;a.gain.setValueAtTime(volume*g,t);a.gain.exponentialRampToValueAtTime(.0005,t+.9);o.connect(a).connect(ctx.destination);o.start(t);o.stop(t+.95);}}
  return true;}catch{return false;}
}
