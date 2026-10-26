/** Tired electrics (offline, by an old rival's age): the wiring of an old banger is past its best. Past ELECTRICS.deadAge, one
 * headlamp bulb in ELECTRICS.dead of them has gone (each car its own, left or right); and past ELECTRICS.age a hard knock shakes
 * the loose connections — every lamp on the car flickers off and on for ELECTRICS.flicker s (ELECTRICS.rate beats a second,
 * dark and lit by turns, each car its own pattern), head, tail and brake lamps alike. */
export const ELECTRICS={age:.5,deadAge:.7,dead:.45,flicker:.45,rate:14,knock:6} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*23.117+salt*61.73)*43758.5453)%1;
/** Which headlamp (0 or 1) has a dead bulb on car `id` of this age, or −1. */
export function deadBulb(id:number,age:number){const n=Number.isFinite(id)?id:0;if(!(age>=ELECTRICS.deadAge))return -1;return hash(n,1)<ELECTRICS.dead?(hash(n,2)<.5?0:1):-1;}
/** Does a hard knock of this damage set an old car's lamps flickering? */
export const shakesWiring=(age:number,damage:number)=>age>=ELECTRICS.age&&damage>=ELECTRICS.knock;
/** Are the lamps dark at this moment, `since` s into a flicker on car `id`? (Lit again once the flicker is over.) */
export function flickerOff(since:number,id:number){
  if(!(since>=0)||since>=ELECTRICS.flicker)return false;
  // Mostly off and on by turns, broken up: a lamp catching and losing its connection.
  const beat=Math.floor(since*ELECTRICS.rate),r=hash((Number.isFinite(id)?id:0)*97+beat,3);return beat%2===0?r<.85:r<.2;
}
