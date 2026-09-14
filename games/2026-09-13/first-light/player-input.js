// Keyboard and gamepad reads, merged with touch. Paddle W/S, turn A/D, anchor Space, lenses P.
// Gamepad: left stick paddle/turn, right stick look, A anchor, X lenses, Start menu.
export function playerInput(keys,pad,touchKeys={}){
 const k=c=>!!(keys[c]||touchKeys[c]);
 const axis=(v,dead=.14)=>Math.abs(v)<dead?0:(v-Math.sign(v)*dead)/(1-dead);
 const padPaddle=pad?-axis(pad.axes[1]||0):0,padTurn=pad?-axis(pad.axes[0]||0):0;
 return {
  paddle:(k('KeyW')||k('ArrowUp')?1:0)-(k('KeyS')||k('ArrowDown')?1:0)||padPaddle,
  turn:(k('KeyA')||k('ArrowLeft')?1:0)-(k('KeyD')||k('ArrowRight')?1:0)||padTurn,
  lookX:pad?axis(pad.axes[2]||0,.18):0,lookY:pad?axis(pad.axes[3]||0,.18):0,
  padAnchor:!!pad?.buttons[0]?.pressed,padLenses:!!pad?.buttons[2]?.pressed,padMenu:!!pad?.buttons[9]?.pressed
 };
}
