import {steeringAxis} from './riding-controls.js';
import {keyboardActions,mappedGamepad,playerControls} from './control-bindings.js';
export function playerInput(keys,pad,player=0,split=false,out={},prefs=null,touchKeys=null){
 const key=keyboardActions(keys,prefs,player,split);
 // Touch buttons express fixed riding actions independently of keyboard rebinding.
 if(touchKeys&&player===0){const touch=keyboardActions(touchKeys,null,0,true);for(const action of Object.keys(key))key[action]||=touch[action];}
 const mapped=mappedGamepad(pad,prefs),buttons=mapped?.actions,modifier=!!buttons?.modifier.pressed;
 const trickList=[['flip','flip'],['rollLeft','left'],['rollRight','right'],['stand','stand'],['handstand','handstand'],['backwards','backwards'],['somersault','somersault']];
 const padTrick=modifier?trickList.find(([action])=>buttons[action].pressed)?.[1]??'':'';
 const axis=mapped?steeringAxis(-mapped.axes[0],mapped.deadzone):0;
 out.throttle=Math.max(key.throttle?1:0,buttons?.throttle.value||0);
 out.steer=axis||.8*(Number(key.steerLeft)-Number(key.steerRight));
 out.brake=!!(key.brakeReverse||key.brake||buttons?.brake.pressed);
 out.rescue=!!(key.rescue||buttons?.rescue.pressed);
 out.slide=!!(key.slide||buttons?.slide.pressed);
 out.dampen=!!(key.dampen||!modifier&&buttons?.dampen.pressed);
 out.lean=Number(key.leanForward)-Number(key.leanBackward)||(mapped&&Math.abs(mapped.axes[1])>mapped.deadzone?-mapped.axes[1]:0);
 out.dive=!!(key.dive||modifier&&buttons?.dive.pressed);
 out.trick=trickList.find(([action])=>key[action])?.[1]??padTrick;
 out.camera=!!(key.camera||!modifier&&buttons?.camera.pressed);out.pause=!!(key.pause||buttons?.pause.pressed);return out;
}
// Three.js viewports have their origin at the bottom left. The DOM HUD uses top left.
// Split physical canvas pixels before converting to renderer units. Each pixel
// belongs to exactly one view, including odd dimensions at fractional DPI.
export function splitViewports(width,height,layout='horizontal'){
 if(layout==='vertical'){const left=Math.floor(width/2);return [{x:0,y:0,width:left,height},{x:left,y:0,width:width-left,height}];}
 const lower=Math.floor(height/2);return [{x:0,y:lower,width,height:height-lower},{x:0,y:0,width,height:lower}];
}
export function splitPlayerAt(width,height,x,y,layout='horizontal'){
 const [first]=splitViewports(width,height,layout);
 return layout==='vertical'?(x<first.width?0:1):(y<first.height?0:1);
}
export function splitRenderViewports(width,height,layout='horizontal',pixelRatio=1){
 // Three rounds these units to physical pixels; the water shader floors them.
 // A tiny subpixel bias keeps both conversions at the authored integer edge.
 return splitViewports(width,height,layout).map(view=>Object.fromEntries(Object.entries(view).map(([key,value])=>[key,value/pixelRatio+1e-7])));
}

// The same mutable records are consumed synchronously by the fixed-step loop.
export function createInputSampler(getControls=()=>null){
 const first={},second={},pair=[first,second];
 return (keys,touchKeys,pads,split=false)=>{
  const controls=getControls();
  playerInput(keys,pads[0],0,split,first,playerControls(controls,0),touchKeys);
  if(!split)return first;
  playerInput(keys,pads[1],1,true,second,playerControls(controls,1));return pair;
 };
}
