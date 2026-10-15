export const KEYBOARD_ACTIONS=Object.freeze([
 ['throttle','Throttle','KeyW','ArrowUp'],['steerLeft','Steer left','KeyA','ArrowLeft'],['steerRight','Steer right','KeyD','ArrowRight'],
 ['brakeReverse','Brake / reverse','KeyS','ArrowDown'],['brake','Brake','Space','ControlRight'],['rescue','Rescue','KeyR','Backspace'],
 ['slide','Surface slide','ShiftLeft','ShiftRight'],['dampen','Absorb waves','KeyB','Period'],['leanForward','Forward trim','KeyQ','BracketLeft'],['leanBackward','Rearward trim','KeyE','BracketRight'],
 ['dive','Dive on descent','KeyF','Quote'],['flip','Backflip','Digit1','Numpad1'],['rollLeft','Left barrel roll','Digit2','Numpad2'],['rollRight','Right barrel roll','Digit3','Numpad3'],
 ['stand','Standing ride','Digit4','Numpad4'],['handstand','Handstand','Digit5','Numpad5'],['backwards','Backwards ride','Digit6','Numpad6'],['somersault','Rider somersault','Digit7','Numpad7'],
 ['camera','Change camera','KeyC','Slash'],['pause','Pause / resume','Escape','Enter']
].map(Object.freeze));
export const GAMEPAD_BUTTON_ACTIONS=Object.freeze([
 ['throttle','Throttle',7],['brake','Brake / reverse',6],['slide','Surface slide',5],['dampen','Absorb waves',0],['modifier','Stunt modifier',4],
 ['flip','Modifier + backflip',3],['rollLeft','Modifier + left roll',2],['rollRight','Modifier + right roll',1],['stand','Modifier + standing ride',12],
 ['handstand','Modifier + handstand',15],['backwards','Modifier + backwards ride',13],['somersault','Modifier + somersault',0],['dive','Modifier + dive',6],
 ['rescue','Rescue',null],['camera','Change camera',3],['pause','Pause / resume',9]
].map(Object.freeze));
export const GAMEPAD_AXES=Object.freeze([['steer','Steering',0],['lean','Fore / aft trim',1]].map(Object.freeze));
export const MAX_GAMEPAD_BUTTON=31,MAX_GAMEPAD_AXIS=7;
const fixedCodes=new Set(['Escape','Space','Enter','Backspace','Delete','Insert','Home','End','PageUp','PageDown','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight','ControlLeft','ControlRight','BracketLeft','BracketRight','Semicolon','Quote','Comma','Period','Slash','Backslash','Minus','Equal','Backquote','IntlBackslash','NumpadAdd','NumpadSubtract','NumpadMultiply','NumpadDivide','NumpadDecimal','NumpadEnter','NumpadEqual']);
const actionIds=new Set(KEYBOARD_ACTIONS.map(a=>a[0])),buttonIds=new Set(GAMEPAD_BUTTON_ACTIONS.map(a=>a[0]));
const requiredKeys=new Set(['throttle','steerLeft','steerRight','brake','rescue','camera','pause']);
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const fail=message=>{throw new Error(message);};
const ownKeys=(value,allowed,name)=>{if(!object(value)||Object.keys(value).some(k=>!allowed.has(k)))fail('Invalid '+name+'.');};
const finite=(value,min,max)=>typeof value==='number'&&Number.isFinite(value)&&value>=min&&value<=max;
const index=(value,max)=>value===null||Number.isInteger(value)&&value>=0&&value<=max;
export function supportedKey(code,action=''){
 return typeof code==='string'&&code.length<=20&&(fixedCodes.has(code)||/^(Key[A-Z]|Digit[0-9]|Numpad[0-9])$/.test(code))&&(code!=='Escape'||action==='pause');
}
export function keyLabel(code){
 if(code===null)return 'Unassigned';
 const names={Space:'Space',Quote:'Apostrophe',Slash:'/',Period:'.',Comma:',',BracketLeft:'[',BracketRight:']',Semicolon:';',Backslash:'Backslash',Backquote:'Backtick',Minus:'−',Equal:'=',ControlRight:'Right Ctrl',ControlLeft:'Left Ctrl',ShiftLeft:'Left Shift',ShiftRight:'Right Shift'};
 return names[code]||code.replace(/^Key/,'').replace(/^Digit/,'').replace(/^Numpad/,'Numpad ').replace(/^Arrow/,'Arrow ');
}
export function initialControls(){return {version:1,players:[0,1].map(player=>({
 keyboard:Object.fromEntries(KEYBOARD_ACTIONS.map(([action,,first,second])=>[action,player?second:first])),
 gamepad:{buttons:Object.fromEntries(GAMEPAD_BUTTON_ACTIONS.map(([action,,button])=>[action,button])),axes:{steer:{index:0,invert:false},lean:{index:1,invert:false}},deadzone:.05}
}))};}
const defaults=initialControls();
for(const p of defaults.players){Object.freeze(p.keyboard);Object.freeze(p.gamepad.buttons);for(const axis of Object.values(p.gamepad.axes))Object.freeze(axis);Object.freeze(p.gamepad.axes);Object.freeze(p.gamepad);Object.freeze(p);}Object.freeze(defaults.players);Object.freeze(defaults);
export function playerControls(controls,player=0){return controls?.players?.[player]??defaults.players[player===1?1:0];}
export function validateControls(value){
 if(value===undefined||value===null)return initialControls();
 ownKeys(value,new Set(['version','players']),'control settings');
 if(value.version!==1||!Array.isArray(value.players)||value.players.length!==2)fail('Unsupported control settings.');
 const out=initialControls(),assigned=new Map();
 for(let player=0;player<2;player++){
  const p=value.players[player],clean=out.players[player];ownKeys(p,new Set(['keyboard','gamepad']),'player controls');
  ownKeys(p.keyboard,actionIds,'keyboard controls');
  for(const [action,label] of KEYBOARD_ACTIONS){
   const code=Object.hasOwn(p.keyboard,action)?p.keyboard[action]:clean.keyboard[action];
   if(code===null){if(requiredKeys.has(action))fail(label+' must keep a keyboard key.');clean.keyboard[action]=null;continue;}
   if(!supportedKey(code,action))fail('Unsupported key for '+label+'. Browser shortcuts and Escape are reserved.');
   const previous=assigned.get(code);
   if(previous&&!(action==='pause'&&previous.action==='pause'&&previous.player!==player))fail(keyLabel(code)+' is already assigned to Player '+(previous.player+1)+' '+previous.label.toLowerCase()+'.');
   assigned.set(code,{player,action,label});clean.keyboard[action]=code;
  }
  const pad=p.gamepad;ownKeys(pad,new Set(['buttons','axes','deadzone']),'gamepad controls');
  ownKeys(pad.buttons,buttonIds,'gamepad buttons');
  for(const [action] of GAMEPAD_BUTTON_ACTIONS){const button=Object.hasOwn(pad.buttons,action)?pad.buttons[action]:clean.gamepad.buttons[action];if(!index(button,MAX_GAMEPAD_BUTTON))fail('Gamepad button must be unassigned or between 0 and '+MAX_GAMEPAD_BUTTON+'.');clean.gamepad.buttons[action]=button;}
  ownKeys(pad.axes,new Set(GAMEPAD_AXES.map(a=>a[0])),'gamepad axes');
  for(const [action] of GAMEPAD_AXES){
   const axis=Object.hasOwn(pad.axes,action)?pad.axes[action]:clean.gamepad.axes[action];ownKeys(axis,new Set(['index','invert']),'gamepad axis');
   if(!index(axis.index,MAX_GAMEPAD_AXIS)||typeof axis.invert!=='boolean')fail('Gamepad axis must be unassigned or between 0 and '+MAX_GAMEPAD_AXIS+', with a boolean inversion.');
   clean.gamepad.axes[action]={index:axis.index,invert:axis.invert};
  }
  const deadzone=Object.hasOwn(pad,'deadzone')?pad.deadzone:.05;if(!finite(deadzone,0,.35))fail('Joystick deadzone must be between 0% and 35%.');clean.gamepad.deadzone=deadzone;
 }
 return out;
}
export function rebindKeyboard(controls,player,action,code){
 if(!Number.isInteger(player)||player<0||player>1||!actionIds.has(action))fail('Unknown player or keyboard action.');
 if(code!==null&&!supportedKey(code,action))fail('Unsupported key. Browser shortcuts and Escape are reserved.');
 const next=validateControls(controls);
 if(code!==null)for(let p=0;p<2;p++)for(const [other,label] of KEYBOARD_ACTIONS)if((p!==player||other!==action)&&next.players[p].keyboard[other]===code&&!(action==='pause'&&other==='pause'&&p!==player))fail(keyLabel(code)+' is already assigned to Player '+(p+1)+' '+label.toLowerCase()+'.');
 next.players[player].keyboard[action]=code;return validateControls(next);
}
export function keyboardActions(keys={},prefs=null,player=0,split=false,out={}){
 const bindings=prefs?.keyboard??defaults.players[player===1?1:0].keyboard;
 for(const [action] of KEYBOARD_ACTIONS)out[action]=!!(bindings[action]&&keys[bindings[action]]);
 // Escape remains an emergency pause even after the alternate pause key changes.
 out.pause||=!!keys.Escape;
 if(!split&&player===0){
  for(const [code,action] of [['ArrowUp','throttle'],['ArrowLeft','steerLeft'],['ArrowRight','steerRight'],['ArrowDown','brakeReverse']]){
   if(keys[code]&&!KEYBOARD_ACTIONS.some(([other])=>other!==action&&bindings[other]===code))out[action]=true;
  }
 }
 return out;
}
export function gameplayKey(code,controls=null,split=false){
 if(code==='Escape')return true;
 for(let player=0;player<(split?2:1);player++)if(Object.values(playerControls(controls,player).keyboard).includes(code))return true;
 return !split&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(code);
}
export function reservedKeyChord(event){return !!(event.metaKey||event.altKey||event.ctrlKey&&!['ControlLeft','ControlRight'].includes(event.code));}

const mapped=Symbol('mapped-race-gamepad'),emptyButton=Object.freeze({pressed:false,value:0});
function buttonState(pad,index){
 if(index===null||!Number.isInteger(index)||index<0||index>MAX_GAMEPAD_BUTTON)return emptyButton;
 const button=pad.buttons?.[index];if(!button)return emptyButton;
 const value=finite(button.value,0,1)?button.value:0,pressed=!!button.pressed||value>.5;
 return {pressed,value:pressed&&value===0?1:value};
}
function axisState(pad,axis){
 if(!axis||axis.index===null||!Number.isInteger(axis.index)||axis.index<0||axis.index>MAX_GAMEPAD_AXIS)return 0;
 const value=pad.axes?.[axis.index];return typeof value==='number'&&Number.isFinite(value)?Math.max(-1,Math.min(1,value))*(axis.invert?-1:1):0;
}
export function mappedGamepad(pad,prefs=null){
 if(!pad||pad.connected===false)return null;if(pad[mapped])return pad;
 const config=prefs?.gamepad??defaults.players[0].gamepad,actions={};
 for(const [action] of GAMEPAD_BUTTON_ACTIONS)actions[action]=buttonState(pad,config.buttons[action]);
 return {[mapped]:true,raw:pad,index:pad.index,id:pad.id,axes:[axisState(pad,config.axes.steer),axisState(pad,config.axes.lean)],actions,deadzone:finite(config.deadzone,0,.35)?config.deadzone:.05};
}
