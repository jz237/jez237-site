import type {Mode} from './rules';
/** Respawning players keep their own view; eliminated/finished players can watch survivors. */
export function onlineSpectatorEligible(active:boolean,mode:Mode,respawns:boolean,player:{health:number;finished:boolean}|undefined){
 return !!(active&&player&&(mode==='race'&&(player.health<=0||player.finished)||mode==='derby'&&!respawns&&player.health<=0));
}
