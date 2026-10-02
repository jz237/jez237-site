import type {Pad} from './driving-controls';

export type ControllerCommand='up'|'down'|'left'|'right'|'accept'|'back'|'start'|'camera'|'recover';
type Direction=Extract<ControllerCommand,'up'|'down'|'left'|'right'>;
const actions=[['accept',0],['back',1],['start',9],['camera',2],['recover',3]] as const;
const identity=(pad:Pad)=>JSON.stringify([pad.index,pad.id]);
const axis=(pad:Pad,index:number)=>Number.isFinite(pad.axes[index])?Math.max(-1,Math.min(1,pad.axes[index])):0;
const value=(pad:Pad,index:number)=>Number.isFinite(pad.buttons[index]?.value)?Math.max(0,Math.min(1,pad.buttons[index].value)):0;
const held=(pad:Pad,index:number,releaseDeadzone:number)=>Number.isFinite(pad.buttons[index]?.value)&&(pad.buttons[index]?.pressed===true||value(pad,index)>releaseDeadzone);
const down=(pad:Pad,index:number)=>Number.isFinite(pad.buttons[index]?.value)&&(pad.buttons[index]?.pressed===true||value(pad,index)>=.5);
const latchedAxis=(raw:number,previous:number)=>Math.abs(raw)>=.55?Math.sign(raw):previous&&Math.sign(raw)===previous&&Math.abs(raw)>.3?previous:0;

/** UI commands are separate from the persisted driving map. A held input must
 * release before it can cross a screen boundary or reconnect into another action. */
export class ControllerInput {
 private padId:string|null=null;
 private context:string|undefined;
 private blocked=new Set<number>();
 private previousActions=new Set<ControllerCommand>();
 private stickBlocked=false;
 private stickX=0;
 private stickY=0;
 private direction:Direction|undefined;
 private repeatAt=0;
 private lastTime:number|undefined;

 update(pad:Pad|undefined,nowMs:number,contextKey:string,releaseDeadzone=.05):{commands:ControllerCommand[];disconnected:boolean}{
  // Use the same neutral range as the saved pedal map; zero remains valid.
  const release=Number.isFinite(releaseDeadzone)?Math.max(0,Math.min(.4,releaseDeadzone)):.05;
  const now=Number.isFinite(nowMs)?nowMs:this.lastTime??0;
  if(this.lastTime!==undefined&&now<this.lastTime)this.repeatAt=now+350;
  this.lastTime=now;
  const nextId=pad?.connected?identity(pad):null;
  const changedPad=nextId!==this.padId,changedContext=contextKey!==this.context;
  const disconnected=this.padId!==null&&changedPad;
  this.context=contextKey;
  if(changedPad||changedContext){
   this.padId=nextId;this.blocked.clear();this.previousActions.clear();
   this.direction=undefined;this.stickX=this.stickY=0;this.repeatAt=now+350;
   this.stickBlocked=!!pad&&pad.connected&&(Math.abs(axis(pad,0))>.3||Math.abs(axis(pad,1))>.3);
   if(pad?.connected)for(let i=0;i<pad.buttons.length;i++)if(held(pad,i,release))this.blocked.add(i);
  }
  if(!pad?.connected)return{commands:[],disconnected};
  for(const index of this.blocked)if(!held(pad,index,release))this.blocked.delete(index);
  const commands:ControllerCommand[]=[];
  const pressed=(index:number)=>!this.blocked.has(index)&&down(pad,index);
  for(const [command,index]of actions){
   if(pressed(index)){if(!this.previousActions.has(command))commands.push(command);this.previousActions.add(command);}
   else this.previousActions.delete(command);
  }
  const rawX=axis(pad,0),rawY=axis(pad,1);
  if(this.stickBlocked&&Math.abs(rawX)<=.3&&Math.abs(rawY)<=.3)this.stickBlocked=false;
  this.stickX=this.stickBlocked?0:latchedAxis(rawX,this.stickX);
  this.stickY=this.stickBlocked?0:latchedAxis(rawY,this.stickY);
  const dpad=[12,13,14,15].some(pressed);
  const x=dpad?Number(pressed(15))-Number(pressed(14)):this.stickX;
  const y=dpad?Number(pressed(13))-Number(pressed(12)):this.stickY;
  let next:Direction|undefined;
  if(x&&y){
   // Retain the dominant axis through small diagonal jitter. Exact ties start
   // vertically, independent of pad enumeration or frame cadence.
   const ax=dpad?1:Math.abs(rawX),ay=dpad?1:Math.abs(rawY);
   const horizontal=this.direction==='left'||this.direction==='right';
   const vertical=this.direction==='up'||this.direction==='down';
   next=horizontal&&ax+.1>=ay?x>0?'right':'left':vertical&&ay+.1>=ax?y>0?'down':'up':ax>ay?x>0?'right':'left':y>0?'down':'up';
  }else if(x)next=x>0?'right':'left';
  else if(y)next=y>0?'down':'up';
  if(next!==this.direction){this.direction=next;this.repeatAt=now+350;if(next)commands.push(next);}
  else if(next&&now>=this.repeatAt){commands.push(next);this.repeatAt=now+120;}
  return{commands,disconnected};
 }

 /** Preserve axes and unblocked buttons; never mutate the browser's snapshot.
  * Unknown/disconnected pads have all buttons masked until update observes them. */
 drivingPad(pad:Pad):Pad{
  const unknown=!pad.connected||identity(pad)!==this.padId;
  if(!unknown&&this.blocked.size===0)return pad;
  return{id:pad.id,index:pad.index,connected:pad.connected,axes:pad.axes,buttons:Array.from(pad.buttons,(button,index)=>unknown||this.blocked.has(index)?{value:0,pressed:false,touched:false}:button)};
 }
}
