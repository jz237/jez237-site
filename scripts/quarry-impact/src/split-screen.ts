import * as T from 'three';
import {ACTIONS,defaultControls,type DrivingControls} from './driving-controls';
import {playerChaseComposition,type CameraSettings} from './camera-settings';
import {clearChasePosition} from './chase-camera-clearance';
import type {CameraObstruction} from './demo-camera-visibility';
import {roadBuzz,smoothAccel,speedFov} from './speed-feel';

/** Two players on one screen (offline derbies, races and free drive): player 1 drives the top half, player 2 the bottom.
 * Player 1 keeps the letter keys (W A S D, Space) and player 2 takes the arrows (Right Shift handbrake, Enter recovers);
 * one gamepad goes to player 2, with two each player takes one. Both halves draw the same scene through the same post
 * chain; a wide half narrows its view (SPLIT.aspect) so it is not a fisheye. Split runs are not banked. */
export const SPLIT={key:'quarry-impact-split-v1',noPad:99,handbrake:['ShiftRight','Numpad0'],recover:['Enter','NumpadEnter'],aspect:16/9*1.25,shadowShare:120} as const;
export type SplitChoice={on:boolean;p2:string};
export type Seats={p1:number;p2:number};
/** The saved choice (off, and the second car of the roster, unless a valid one was saved). */
export function readSplit(raw:string|null|undefined,kinds:readonly string[]):SplitChoice{
 let v:any;try{v=JSON.parse(raw??'null');}catch{v=null;}
 const p2=typeof v?.p2==='string'&&kinds.includes(v.p2)?v.p2:kinds[1]??kinds[0]??'';
 return {on:v?.on===true,p2};
}
/** Which gamepad each player drives with (SPLIT.noPad: keyboard only). Two or more pads: player 1 keeps the one the menus
 * use, player 2 takes the next. One pad: it goes to player 2 and player 1 drives on the keyboard. */
export function splitSeats(connected:readonly number[],menuPad?:number):Seats{
 const pads=[...new Set(connected.filter(i=>Number.isInteger(i)&&i>=0))].sort((a,b)=>a-b);
 if(pads.length>=2){const p1=menuPad!==undefined&&pads.includes(menuPad)?menuPad:pads[0];return {p1,p2:pads.find(i=>i!==p1)!};}
 return {p1:SPLIT.noPad,p2:pads[0]??SPLIT.noPad};
}
/** Driving maps for the two seats: player 1's own map without the arrows (an action left with no key falls back to its
 * default letter), player 2 the default arrows on an automatic box. */
export function splitControls(saved:DrivingControls,seats:Seats):{p1:DrivingControls;p2:DrivingControls}{
 const d=defaultControls(),arrow=(k:string)=>k.startsWith('Arrow'),theirs=new Set<string>([...SPLIT.handbrake,...SPLIT.recover]);
 const p1:DrivingControls={...saved,keys:{...saved.keys},pad:seats.p1};
 for(const action of ACTIONS){const own=saved.keys[action].filter(k=>!arrow(k)&&!theirs.has(k));p1.keys[action]=own.length?own:d.keys[action].filter(k=>!arrow(k));}
 const p2:DrivingControls={...d,keys:{throttle:d.keys.throttle.filter(arrow),reverse:d.keys.reverse.filter(arrow),left:d.keys.left.filter(arrow),right:d.keys.right.filter(arrow),handbrake:[...SPLIT.handbrake],shiftUp:[],shiftDown:[],clutch:[]},pad:seats.p2};
 return {p1,p2};
}
/** Whether both players are done: in a race finished or wrecked, in a derby wrecked (free drive never ends). */
export function splitDone(mode:string,humans:readonly {finished:boolean;health:number}[]):boolean{
 if(humans.length<2||mode==='playground')return false;
 return humans.every(h=>!(h.health>0)||mode==='race'&&h.finished);
}
/** Each player's place in the final order (0 if missing) and who came out ahead (0 when level or both missing). */
export function splitDuel(order:readonly number[],p1=0,p2=1){
 const a=order.indexOf(p1)+1,b=order.indexOf(p2)+1;
 return {p1:a,p2:b,winner:a&&b?(a<b?1:b<a?2:0):a?1:b?2:0};
}
/** 1ST, 2ND, 3RD, 4TH … 11TH, 12TH, 13TH … 21ST. */
export const placeLabel=(n:number)=>n+(n%100>10&&n%100<14?'TH':['TH','ST','ND','RD'][n%10]??'TH');
/** How much a wide half narrows its view so the horizontal view is no wider than at SPLIT.aspect (1 for an ordinary shape). */
export const splitZoom=(aspect:number)=>Number.isFinite(aspect)&&aspect>SPLIT.aspect?aspect/SPLIT.aspect:1;
/** The vertical field of view (degrees) a half uses for a lens of `fov`: narrowed, not zoomed, since level of detail reads a
 * camera's zoom as nearness and would draw the whole quarry at full detail. */
export function splitFov(fov:number,aspect:number){const k=splitZoom(aspect);return k===1?fov:T.MathUtils.radToDeg(2*Math.atan(Math.tan(T.MathUtils.degToRad(fov)/2)/k));}
/** Each half's height in CSS pixels: the top one takes an odd pixel. */
export const splitHeights=(height:number)=>{const h=Math.max(1,Math.floor(height));return {top:Math.ceil(h/2),bottom:Math.floor(h/2)};};
/** Copy a view (placement and lens) from one camera to another. */
export function adoptView(into:T.PerspectiveCamera,from:T.PerspectiveCamera){
 into.position.copy(from.position);into.quaternion.copy(from.quaternion);into.up.copy(from.up);
 into.fov=from.fov;into.near=from.near;into.far=from.far;into.aspect=from.aspect;into.zoom=from.zoom;
 into.updateProjectionMatrix();into.updateMatrixWorld(true);
}
type Subject={root:T.Object3D;speed:number;impactResponse:{step(dt:number):{offset:{x:number;y:number;z:number};roll:number;pitch:number}}};
/** Player 2's chase camera: player 1's chase composition, boom clearance, impact shake and speed feel, on its own state. */
export class SplitCamera {
 readonly camera=new T.PerspectiveCamera(52,1,.1,850);
 private offset=new T.Vector3();private accel=0;private last=0;private seated=false;private lens=52;
 private f=new T.Vector3();private anchor=new T.Vector3();private before=new T.Vector3();
 reset(){this.seated=false;this.accel=0;this.last=0;this.lens=52;this.offset.set(0,0,0);}
 follow(p:Subject,dt:number,settings:CameraSettings,ground:(x:number,z:number)=>number,obstruction:CameraObstruction,live:boolean,clock:number){
  const cam=this.camera,f=this.f.set(0,0,1).applyQuaternion(p.root.quaternion);f.y=0;if(f.lengthSq()<1e-6)f.set(0,0,1);f.normalize();
  const target=p.root.position.clone(),view=playerChaseComposition(target,f,p.speed,settings);
  view.position.y=Math.max(view.position.y,ground(view.position.x,view.position.z)+.65);
  this.anchor.copy(target);this.anchor.y+=.8;
  cam.position.sub(this.offset);
  if(this.seated)cam.position.lerp(view.position,1-Math.exp(-dt*5));else{cam.position.copy(view.position);this.seated=true;}
  cam.position.copy(clearChasePosition(this.anchor,cam.position,obstruction));cam.up.set(0,1,0);cam.lookAt(view.target);
  const response=p.impactResponse.step(live?dt:0);
  this.offset.set(response.offset.x,response.offset.y,response.offset.z).multiplyScalar(settings.shake);
  this.before.copy(cam.position);cam.position.add(this.offset);cam.position.copy(clearChasePosition(this.anchor,cam.position,obstruction));
  this.offset.copy(cam.position).sub(this.before);cam.lookAt(view.target);
  cam.rotateZ(response.roll*settings.shake);cam.rotateX(response.pitch*settings.shake);
  this.accel=smoothAccel(this.accel,p.speed,this.last,live?dt:0);this.last=p.speed;
  if(live){const buzz=roadBuzz(p.speed)*settings.shake;if(buzz>0){const w=clock*61;cam.rotateZ(Math.sin(w)*buzz*.6);cam.rotateX(Math.sin(w*1.73+.4)*buzz);}}
  this.lens=T.MathUtils.damp(this.lens,speedFov(settings.fov,p.speed,this.accel),3,dt);cam.fov=splitFov(this.lens,cam.aspect);
  cam.updateProjectionMatrix();cam.updateMatrixWorld();
 }
}
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
/** Player 2's instruments, in the bottom half (player 1 keeps the usual HUD in the top half). */
export function p2HudMarkup(car:string){
 return `<div class="split-tag split-tag-p1" aria-hidden="true">P1</div><div class="p2-hud" id="p2-hud" aria-label="Player 2"><div class="split-tag" aria-hidden="true">P2</div>`
  +`<div class="p2-status"><div class="status-row"><span>${escape(car)}</span><b id="p2-health">100%</b></div><div class="condition"><b id="p2-health-bar" style="width:100%"></b></div><div class="p2-note" id="p2-note"></div></div>`
  +`<div class="p2-stats"><div><span id="p2-place-label">POSITION</span><strong id="p2-place">–</strong></div><div><span id="p2-lap-label">LAP</span><strong id="p2-lap">–</strong></div></div>`
  +`<div class="p2-speed"><strong id="p2-speed">0</strong> <span>KM/H</span><small id="p2-gear">GEAR 1</small></div></div>`;
}
