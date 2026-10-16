import {Vector3} from 'three';
import type {Sound} from './audio';
import type {ReplayImpact} from './replay-data';
/** Only forward playback emits impacts. Reconstruction may span frames, but
 * scrubbing/pausing cancels the pending interval. Limit catch-up after stalls. */
export class ReplayImpactPlayback {
 private pendingFrom:number|undefined;
 constructor(private readonly events:readonly ReplayImpact[],private readonly sound:Pick<Sound,'impact'>){}
 step(from:number,to:number,playing:boolean,seeking:boolean,ready:boolean){
  if(!playing||!ready||!Number.isFinite(from)||!Number.isFinite(to)||to<from){this.pendingFrom=undefined;return 0;}
  if(seeking){this.pendingFrom??=from;return 0;}
  const start=Math.max(this.pendingFrom??from,to-.25);this.pendingFrom=undefined;
  const upper=(time:number)=>{let lo=0,hi=this.events.length;while(lo<hi){const mid=(lo+hi)>>>1;if(this.events[mid].time<=time)lo=mid+1;else hi=mid;}return lo;};
  const end=upper(to),begin=Math.max(upper(start),end-8);
  for(let i=begin;i<end;i++){const e=this.events[i];this.sound.impact(e.severity,new Vector3().fromArray(e.position),e.glass,e.debris);}
  return end-begin;
 }
}
