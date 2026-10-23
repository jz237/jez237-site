import {createOpenSeaSpectrum} from './open-sea-spectrum.js';
import {coastalBed,coastalDepth} from './coastal-depth.js';
// The physics side of the experimental open sea: the CPU mirror of the GPU
// spectrum, calmed in shallow water exactly as the rendered surface is, and
// rebuilt every few frames with each wave's own rate of change filling the gaps.

// Douglas-like sea states for the game's sea choices.
export const OPEN_SEA_STATES=Object.freeze({calm:2,course:3.5,chop:4.2,surf:5,storm:6.5});
// Depth range (m) over which waves grow from flat to full open-sea height.
export const OPEN_SEA_SHOAL=Object.freeze([.3,5]);
const REBUILD=.05;
const smoothstep=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};

/** Physics field for one sea state. The finest rendered cascade (waves under
 * 2.2 m) is left to the picture: twelve hull points cannot resolve it. */
export function createOpenSeaField({seaState=OPEN_SEA_STATES.course,windDirection=.55}={}){
 const field={seaState,windDirection,level:0,time:0,builtAt:NaN,
  shoal:(x,z)=>coastalDepth.active?smoothstep(OPEN_SEA_SHOAL[0],OPEN_SEA_SHOAL[1],field.level-coastalBed(x,z)):1,
  /** Advance to a simulation time (seconds). */
  setTime(t){field.time=t;if(!(Math.abs(t-field.builtAt)<=REBUILD)){spectrum.setTime(t);field.builtAt=t;}},
  /** Surface {h,ht} about the mean level under x,z at the current time. */
  sample(x,z){const s=spectrum.sample(x,z),age=field.time-field.builtAt;return {h:s.h+s.ht*age,ht:s.ht};},
  /** Absolute surface height under x,z. */
  height(x,z){return field.level+field.sample(x,z).h;}};
 const spectrum=createOpenSeaSpectrum({seaState,windDirection,cascades:3,shoal:field.shoal});
 field.spectrum=spectrum;
 return field;
}

let active=null;
/** Select the open-sea field `wave()` reports, or null for the venue's own water. */
export function setOpenSeaField(field){active=field||null;}
export const activeOpenSeaField=()=>active;
export function openSeaHeight(x,z){return active?active.height(x,z):null;}
