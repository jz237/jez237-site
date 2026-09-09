/** Browsers may deliver a queued RAF timestamp older than an effect's start time. */
export function frameDelta(now:number,last:number){
 const seconds=(now-last)/1000;
 return Number.isFinite(seconds)?Math.max(0,Math.min(seconds,.1)):0;
}
