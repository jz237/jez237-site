// Keyboard and gamepad reads, merged with touch. Paddle W/S, turn A/D, anchor X, reel Space,
// twitch F, lenses P, next rig Tab. Gamepad: left stick paddle/turn, right stick look, LT hold and
// release to cast, RT reel, RB twitch, A anchor, X lenses, Start menu.
export function playerInput(keys,pad,touchKeys={}){
 const k=c=>!!(keys[c]||touchKeys[c]);
 const axis=(v,dead=.14)=>Math.abs(v)<dead?0:(v-Math.sign(v)*dead)/(1-dead);
 const padPaddle=pad?-axis(pad.axes[1]||0):0,padTurn=pad?-axis(pad.axes[0]||0):0;
 return {
  paddle:(k('KeyW')||k('ArrowUp')?1:0)-(k('KeyS')||k('ArrowDown')?1:0)||padPaddle,
  turn:(k('KeyA')||k('ArrowLeft')?1:0)-(k('KeyD')||k('ArrowRight')?1:0)||padTurn,
  lookX:pad?axis(pad.axes[2]||0,.18):0,lookY:pad?axis(pad.axes[3]||0,.18):0,
  reeling:k('Space')||(pad?.buttons[7]?.value||0)>.3,charging:k('Cast')||(pad?.buttons[6]?.value||0)>.3,
  padTwitch:!!pad?.buttons[5]?.pressed,padAnchor:!!pad?.buttons[0]?.pressed,padLenses:!!pad?.buttons[2]?.pressed,padMenu:!!pad?.buttons[9]?.pressed
 };
}
