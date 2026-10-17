import type {Sound} from './audio';
import type {ReplayBurst} from './replay-data';
import {ReplayImpactPlayback} from './replay-impact-audio';
/** Use the same bounded forward-only transport as collision one-shots. */
export class ReplayBurstPlayback extends ReplayImpactPlayback {
 constructor(events:readonly ReplayBurst[],sound:Pick<Sound,'thermal'>){
  super(events.map(e=>({...e,severity:0,glass:false,debris:false})),{
   impact:(_severity,position)=>sound.thermal([],[{id:0,heat:1,burst:1,position}])
  });
 }
}
