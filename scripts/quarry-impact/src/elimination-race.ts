import type {EventOptions} from './event-rules';
/** Elimination: in a custom lap race, the last-placed running car is knocked out every
 * interval until one car is left running or the race finishes normally. */
export const ELIMINATION_INTERVAL=30;
export function eliminationActive(mode:string,custom:boolean,demo:boolean,format:string,event:Pick<EventOptions,'elimination'|'raceDuration'>,options:Pick<EventOptions,'elimination'|'raceDuration'>):boolean{
 const o=demo?options:event;return mode==='race'&&custom&&format==='laps'&&o.elimination===true&&!o.raceDuration;
}
/** The car to knock out: last in race order among cars still running, or null when only one remains. */
export function nextElimination(runningOrder:readonly number[]):number|null{return runningOrder.length>1?runningOrder[runningOrder.length-1]:null;}
