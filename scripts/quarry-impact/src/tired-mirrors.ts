import {MIRROR_HANG} from './wreck-attachments';

/** Tired mirrors (offline rivals, by age): from MIRRORS.age of its age, an old banger's door mirror has seen better days —
 * on MIRRORS.hang of them one hangs by its wire already (as loose as MIRRORS.loose of the way to falling), swinging as any
 * knocked mirror does, and on MIRRORS.gone of them one has gone altogether. Each car its own side. */
export const MIRRORS={age:.4,hang:.4,gone:.18,loose:[.55,.9]} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*71.39+salt*29.83)*43758.5453)%1;
export type MirrorState={hanging:'left'|'right'|null;loose:number;gone:'left'|'right'|null};
/** Car `id` of this age: which mirror hangs (and how loose) and which has gone. */
export function mirrorStateFor(id:number,age:number):MirrorState{
  const n=Number.isFinite(id)?id:0,side=(s:number)=>hash(n,s)<.5?'left' as const:'right' as const;
  if(!(age>=MIRRORS.age))return {hanging:null,loose:0,gone:null};
  const r=hash(n,1);
  if(r<MIRRORS.hang)return {hanging:side(2),loose:MIRRORS.loose[0]+(MIRRORS.loose[1]-MIRRORS.loose[0])*hash(n,3),gone:null};
  if(r<MIRRORS.hang+MIRRORS.gone)return {hanging:null,loose:0,gone:side(4)};
  return {hanging:null,loose:0,gone:null};
}
/** The damage that leaves a mirror this loose on its wire. */
export const hangingDamage=(loose:number)=>MIRROR_HANG.start+MIRROR_HANG.span*Math.max(0,Math.min(.99,Number.isFinite(loose)?loose:0));
