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
