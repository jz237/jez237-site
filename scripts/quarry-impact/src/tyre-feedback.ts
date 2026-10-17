import {tyreFailure} from './tyre-condition';

const corners=['FL','FR','RL','RR'];
/** Report observed tyre failure, never infer pressure from general body health. */
export function tyreWarning(damage?:ArrayLike<number>){
  if(!damage)return '';
  const affected=corners.filter((_,i)=>tyreFailure(damage[i])>0);
  if(!affected.length)return '';
  const flat=corners.every((_,i)=>tyreFailure(damage[i])===0||tyreFailure(damage[i])>=.95);
  return `${flat?'FLAT TYRE'+(affected.length>1?'S':''):'TYRE DAMAGE'} · ${affected.join(' / ')}`;
}

import type {DrivingSurface} from './driving-surface';
/** Shared bounded emission policy. Slip is measured at this tire, not the
 * loudest wheel on the car. A stationary handbrake alone makes no smoke. */
export function tyreFeedback(surface:DrivingSurface,speed:number,slip:number,handbrake:boolean,index:number,grounded:boolean,wet=false){
 const scrub=Math.max(Math.abs(slip),handbrake&&index>1?Math.abs(speed):0),skid=grounded&&!wet&&scrub>2;
 const count=!grounded||wet?0:surface==='asphalt'?(scrub>4?Math.min(3,Math.ceil(scrub/8)):0):(Math.abs(speed)>3?1:0)+(skid?2:0);
 return{skid,count,type:surface==='asphalt'?5:surface==='mud'?4:0,force:Math.min(1.5,Math.max(.25,Math.max(Math.abs(speed),scrub)*.04)),markLength:Math.max(.2,Math.abs(speed)*.09),evidence:Math.min(.65,scrub*.06)};
}
