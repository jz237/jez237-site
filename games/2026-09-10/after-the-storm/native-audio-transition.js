// Direct writes to the admitted race timers/voice slot in C1F60, and the
// unconditional prefix of C21F4. Music/menu callees and the rest of mode-entry
// selection have separate owners; this is deliberately not a full mixer reset.
export function resetNativeRaceAudioTimers(consumer,mode,voice,context){
 if(!['800c1f60','800c21f4'].includes(consumer))throw new RangeError('Unknown audio transition');
 if(!Number.isInteger(mode)||mode< -2147483648||mode>2147483647)throw new RangeError('Invalid audio transition mode');
 const state={...voice},g={...context};
 for(const k of ['hold','delayedHold','delay'])if(!Number.isInteger(state[k])||state[k]<0||state[k]>255)throw new RangeError('Invalid announcer byte');
 if(!Number.isInteger(g.audioMode)||g.audioMode<0||g.audioMode>255)throw new RangeError('Invalid audio mode byte');
 for(const k of ['delay7cd8','delay7cd4','delay7cec','engineGate7ca0','eventLatch7ca8','delay7cf0','counter7cf4','eventGate7cb8'])
  if(!Number.isInteger(g[k])||g[k]< -2147483648||g[k]>2147483647)throw new RangeError('Invalid audio transition timer');
 g.delay7cd8=g.delay7cec=0;
 const previous=(g.audioMode<<24)>>24;
 if(consumer==='800c21f4'){
  g.delay7cd4=g.engineGate7ca0=g.eventLatch7ca8=g.delay7cf0=g.counter7cf4=0;
  state.delayedHold=state.delay=0;
 }else if(mode!==previous||mode!==1&&mode!==10){
  state.hold=state.delayedHold=state.delay=0;
  if(mode===0)g.eventGate7cb8=0;
 }
 return {state,context:g,stopAnnouncer:consumer==='800c1f60'&&previous===7&&mode!==4&&mode!==6};
}
