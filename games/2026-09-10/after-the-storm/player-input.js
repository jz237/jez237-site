export function playerInput(keys,pad,player=0,split=false){
 const second=player===1,up=second?'ArrowUp':'KeyW',left=second?'ArrowLeft':'KeyA',right=second?'ArrowRight':'KeyD',down=second?'ArrowDown':'KeyS';
 const arrows=!split&&!second,modifier=!!pad?.buttons[4]?.pressed;const padTrick=!modifier?'':pad?.buttons[3]?.pressed?'flip':pad?.buttons[2]?.pressed?'left':pad?.buttons[1]?.pressed?'right':pad?.buttons[12]?.pressed?'stand':pad?.buttons[15]?.pressed?'handstand':pad?.buttons[13]?.pressed?'backwards':pad?.buttons[0]?.pressed?'somersault':'';
 const axis=pad&&Math.abs(pad.axes[0])>.12?-pad.axes[0]:0;
 return {throttle:Math.max(keys[up]||arrows&&keys.ArrowUp?1:0,pad?.buttons[7]?.value||0),
 steer:axis||.8*((keys[left]||arrows&&keys.ArrowLeft?1:0)-(keys[right]||arrows&&keys.ArrowRight?1:0)),
 brake:!!(keys[down]||keys[second?'ControlRight':'Space']||arrows&&keys.ArrowDown||pad?.buttons[6]?.pressed),
 rescue:!!keys[second?'Backspace':'KeyR'],
 slide:!!(keys[second?'ShiftRight':'ShiftLeft']||pad?.buttons[5]?.pressed),
 dampen:!!(keys[second?'Period':'KeyB']||!modifier&&pad?.buttons[0]?.pressed),
 lean:((keys[second?'BracketLeft':'KeyQ']?1:0)-(keys[second?'BracketRight':'KeyE']?1:0))||(pad&&Math.abs(pad.axes[1]||0)>.12?-(pad.axes[1]||0):0),
 dive:!second&&!!(keys.KeyF||modifier&&pad?.buttons[6]?.pressed),
 trick:second?'':keys.Digit1?'flip':keys.Digit2?'left':keys.Digit3?'right':keys.Digit4?'stand':keys.Digit5?'handstand':keys.Digit6?'backwards':keys.Digit7?'somersault':padTrick};
}
// Three.js viewports have their origin at the bottom left. The DOM HUD uses top left.
export function splitViewports(width,height){const lower=Math.floor(height/2);return [{x:0,y:lower,width,height:height-lower},{x:0,y:0,width,height:lower}];}
