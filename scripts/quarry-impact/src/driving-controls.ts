import type {TransmissionMode} from './transmission';
import type {Input} from './vehicle';
export const CONTROLS_KEY='quarry-impact-controls-v1';
export const ACTIONS=['throttle','reverse','left','right','handbrake','shiftUp','shiftDown','clutch'] as const;
export type Action=typeof ACTIONS[number];
export const ACTION_LABELS:Record<Action,string>={throttle:'Accelerate',reverse:'Brake / reverse',left:'Steer left',right:'Steer right',handbrake:'Handbrake',shiftUp:'Shift up',shiftDown:'Shift down',clutch:'Clutch'};
export interface DrivingControls {
 version:1; keys:Record<Action,string[]>;
 pad:number; axis:number; invert:boolean; center:number; deadzone:number; saturation:number; curve:number;
 throttleButton:number; brakeButton:number; handbrakeButton:number; triggerDeadzone:number;
 speedAssist:number; rumble:number; transmission:TransmissionMode; shiftUpButton:number; shiftDownButton:number; clutchButton:number;
}
export function defaultControls():DrivingControls{return {version:1,keys:{throttle:['KeyW','ArrowUp'],reverse:['KeyS','ArrowDown'],left:['KeyA','ArrowLeft'],right:['KeyD','ArrowRight'],handbrake:['Space'],shiftUp:['KeyE'],shiftDown:['KeyQ'],clutch:['ShiftLeft']},pad:-1,axis:0,invert:false,center:0,deadzone:.12,saturation:1,curve:1,throttleButton:7,brakeButton:6,handbrakeButton:0,triggerDeadzone:.05,speedAssist:0,rumble:.65,transmission:'automatic',shiftUpButton:5,shiftDownButton:4,clutchButton:1};}
const reserved=new Set(['KeyC','KeyR','KeyM','KeyF','KeyP','KeyI','KeyT']);
export const allowedKey=(key:string)=>/^(Key[A-Z]|Digit[0-9]|Arrow(Up|Down|Left|Right)|Space|Shift(Left|Right))$/.test(key)&&!reserved.has(key);
const bound=(n:unknown,min:number,max:number,fallback:number)=>typeof n==='number'&&Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback;
export function readControls(raw?:string|null):DrivingControls{
 const d=defaultControls();let v:any;try{v=JSON.parse(raw??'null');}catch{return d;}
 if(!v||v.version!==1)return d;
 // Reject the whole map if any action is unbound or a physical key has two meanings.
 const keys={} as DrivingControls['keys'],seen=new Set<string>();let valid=true;
 for(const action of ACTIONS){let entries=v.keys?.[action];
  if(entries===undefined&&['shiftUp','shiftDown','clutch'].includes(action)){const fallback=[...d.keys[action],'KeyZ','KeyX','KeyV','KeyB','KeyN','KeyL','KeyJ','KeyK','ShiftRight'].find(k=>!seen.has(k));entries=[fallback];}
 if(!Array.isArray(entries)||entries.length<1||entries.length>2){valid=false;break;}keys[action]=[];for(const key of entries){if(typeof key!=='string'||!allowedKey(key)||seen.has(key)){valid=false;break;}seen.add(key);keys[action].push(key);}}
 if(valid)d.keys=keys;
 if(v.transmission==='manual'||v.transmission==='clutch')d.transmission=v.transmission;
 for(const k of ['pad','axis','throttleButton','brakeButton','handbrakeButton','shiftUpButton','shiftDownButton','clutchButton'] as const)d[k]=Math.round(bound(v[k],k==='pad'?-1:0,k==='pad'?3:k==='axis'?7:31,d[k]));
 d.invert=v.invert===true;
 d.center=bound(v.center,-.5,.5,0);d.deadzone=bound(v.deadzone,0,.45,.12);d.saturation=bound(v.saturation,.5,1,1);d.curve=bound(v.curve,.5,3,1);d.triggerDeadzone=bound(v.triggerDeadzone,0,.4,.05);d.speedAssist=bound(v.speedAssist,0,1,0);d.rumble=bound(v.rumble,0,1,.65);
 if(new Set([d.throttleButton,d.brakeButton,d.handbrakeButton]).size!==3){d.throttleButton=7;d.brakeButton=6;d.handbrakeButton=0;}
 const used=new Set([d.throttleButton,d.brakeButton,d.handbrakeButton]);
 for(const key of ['shiftUpButton','shiftDownButton','clutchButton']as const){if(used.has(d[key]))d[key]=Array.from({length:32},(_,i)=>i).find(i=>!used.has(i))!;used.add(d[key]);}
 return d;
}
export const keyLabel=(code:string)=>code.startsWith('Key')?code.slice(3):code.startsWith('Digit')?code.slice(5):({ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',Space:'Space',ShiftLeft:'Left Shift',ShiftRight:'Right Shift'}[code]??code);
export function bindKey(config:DrivingControls,action:Action,slot:number,code:string):string|null{
 if(!allowedKey(code))return 'That key is reserved. Use a letter, number, arrow, Space or Shift. C/R/M/F/P/I/T keep their existing shortcuts.';
 for(const other of ACTIONS)if(config.keys[other].includes(code)&&!(other===action&&config.keys[other][slot]===code))return `${keyLabel(code)} is already assigned to ${ACTION_LABELS[other]}.`;
 config.keys[action][slot]=code;return null;
}
export type Pad=Pick<Gamepad,'index'|'connected'|'axes'|'buttons'|'id'>;
export function selectedPad(config:DrivingControls,pads:readonly (Pad|null)[]):Pad|undefined{return pads.find((p):p is Pad=>!!p?.connected&&(config.pad<0||p.index===config.pad));}
export function steeringAxis(raw:number,config:DrivingControls):number{
 if(!Number.isFinite(raw))return 0;
 const value=bound(raw,-1,1,0)-config.center;
 const amount=Math.max(0,Math.min(1,(Math.abs(value)-config.deadzone)/(config.saturation-config.deadzone)));
 return Math.sign(value)*Math.pow(amount,config.curve)*(config.invert?-1:1);
}
export function drivingInput(config:DrivingControls,keys:ReadonlySet<string>,pads:readonly(Pad|null)[],speed:number,transmissionAvailable=true):Input{
 const held=(action:Action)=>config.keys[action].some(key=>keys.has(key));
 let up=held('shiftUp'),down=held('shiftDown'),clutch=Number(held('clutch'));
 let steer=Number(held('right'))-Number(held('left')),gas=Number(held('throttle')),reverse=Number(held('reverse')),handbrake=held('handbrake');
 const pad=selectedPad(config,pads);
 if(pad){const axis=steeringAxis(pad.axes[config.axis]??NaN,config);if(axis!==0)steer=axis;
  const button=(index:number)=>{const value=bound(pad.buttons[index]?.value,0,1,0);return Math.max(0,(value-config.triggerDeadzone)/(1-config.triggerDeadzone));};
  gas=Math.max(gas,button(config.throttleButton));reverse=Math.max(reverse,button(config.brakeButton));handbrake ||= button(config.handbrakeButton)>.5;up ||= button(config.shiftUpButton)>.5;down ||= button(config.shiftDownButton)>.5;clutch=Math.max(clutch,button(config.clutchButton));
 }
 const safeSpeed=Number.isFinite(speed)?speed:0;
 // Simultaneous pedals brake instead of unexpectedly reversing at a stop.
 const brake=reverse>0&&(safeSpeed>1||gas>0)?reverse:0;
 const throttle=brake>0?0:reverse>0?-reverse*.6:gas;
 steer*=Math.max(.35,1/(1+Math.abs(safeSpeed)*config.speedAssist*.025));
 if(transmissionAvailable&&config.transmission!=='automatic')return{throttle:reverse>0?0:gas,brake:reverse,steer,handbrake,transmission:{mode:config.transmission,up,down,clutch}};
 return {throttle,brake,steer,handbrake};
}

export const drivingButtons=(config:DrivingControls,transmissionAvailable=true)=>[config.throttleButton,config.brakeButton,config.handbrakeButton,...(transmissionAvailable&&config.transmission!=='automatic'?[config.shiftUpButton,config.shiftDownButton,...(config.transmission==='clutch'?[config.clutchButton]:[])]:[])];
