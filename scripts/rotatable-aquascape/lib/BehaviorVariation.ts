/** Separate behavior randomness from the fixed planting/model layout. */
export function behaviorSeed(session:number,stream:number){
 let n=(session^Math.imul(stream+1,0x9e3779b9))>>>0;
 n=Math.imul(n^(n>>>16),0x21f0aaad);n=Math.imul(n^(n>>>15),0x735a2d97);
 return (n^(n>>>15))>>>0;
}
export function behaviorRandom(seed:number){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export function freshBehaviorSeed(){return globalThis.crypto.getRandomValues(new Uint32Array(1))[0];}
