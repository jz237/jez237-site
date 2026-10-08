/** Arena choices are separate from race courses so lap/TT categories stay valid. */
export const ARENA_NAMES={'quarry-arena-v1':'Blackridge Quarry','harrow-bowl-v1':'Harrow Breaker Bowl'} as const;
export type ArenaId=keyof typeof ARENA_NAMES;
export const isArenaId=(value:unknown):value is ArenaId=>typeof value==='string'&&Object.hasOwn(ARENA_NAMES,value);
export const resolveArenaId=(value:unknown):ArenaId=>isArenaId(value)?value:'quarry-arena-v1';
export const arenaRecordKey=(key:string,arena:unknown)=>resolveArenaId(arena)==='quarry-arena-v1'?key:`${key}:arena:${resolveArenaId(arena)}`;
