import {gridPool} from './grid-rules';
import type {CarKind} from './rules';
export const ONLINE_OPPONENT_SETS={mixed:'Mixed vehicles',fwd:'Front-wheel drive',rwd:'Rear-wheel drive',american:'American-style',european:'European-style',muscle:'Muscle cars'} as const;
export type OnlineOpponentSet=keyof typeof ONLINE_OPPONENT_SETS;
export const isOnlineOpponentSet=(value:unknown):value is OnlineOpponentSet=>typeof value==='string'&&Object.hasOwn(ONLINE_OPPONENT_SETS,value);
/** Occupied/reserved seats retain their chosen model. Only vacant AI seats change.
 * Omitted set exactly retains existing negotiated-roster slot rotation. */
export function onlineOpponentKinds(current:readonly CarKind[],selected:readonly (CarKind|undefined)[],available?:readonly CarKind[],set?:OnlineOpponentSet):CarKind[]{
 if(set!==undefined&&!isOnlineOpponentSet(set))throw Error('Invalid opponent set');
 const pool=set?available?.filter(kind=>gridPool('coupe',set).includes(kind)):available;
 if(set&&!pool?.length)throw Error('No compatible vehicles for this opponent set');
 return current.map((kind,i)=>selected[i]??(pool?.length?pool[i%pool.length]:kind));
}
