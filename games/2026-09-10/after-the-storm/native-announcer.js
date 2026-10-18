const fields=['note','priority','hold','delayedNote','delayedPriority','delayedHold','delay'];
const arities={c32a0:3,c3320:3,c338c:4,c33c8:4,c3408:3,c3464:4,c3494:0,c36f8:1,c3500:1,c3524:2,c377c:1};
function integer(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid original announcer field');return v;}
export const freshNativeAnnouncer=()=>Object.fromEntries(fields.map(k=>[k,0]));

// C32A0..C3494: one active priority hold and one delayed slot. A blocked
// delayed note is not automatically retried. Timers use unsigned bytes;
// incoming priorities are signed words, before the original byte stores.
export function prepareNativeAnnouncer(input,command,context){
 const state={...input},commands=[];
 for(const k of fields)integer(state[k],0,255);
 for(const k of ['raceMode','courseIndex','delay7cd8'])integer(context[k],-2147483648,2147483647);
 integer(context.audioMode,0,255);
 const {consumer,arguments:args}=command;
 if(!Object.hasOwn(arities,consumer)||!Array.isArray(args)||args.length!==arities[consumer])throw new TypeError('Unknown original announcer call');
 args.forEach(v=>integer(v,-2147483648,0xffffffff));
 const gate=context.courseIndex!==0&&context.audioMode===7;
 const emit=(port,value)=>commands.push({consumer:'c53d4',arguments:[port,value>>>0]});
 const now=(note,priority,hold)=>{
  if(state.hold!==0&&(priority|0)<state.priority)return state.hold;
  emit(0x06000c00,(note<<24)>>24);
  state.note=note&255;state.priority=priority&255;state.hold=hold&255;return 0;
 };
 const later=(note,delay,priority,hold)=>{
  if(state.delayedHold!==0&&(priority|0)<state.delayedPriority)return;
  state.delayedNote=note&255;state.delay=delay&255;state.delayedPriority=priority&255;state.delayedHold=hold&255;
 };
 const gatedNow=(note,priority,hold)=>{
  const remaining=now(note,priority,hold);
  if(gate&&remaining>0&&remaining<5)later(note,remaining,priority,hold);
 };
 let remaining=null;
 if(consumer==='c32a0')remaining=now(...args);
 else if(consumer==='c3500')now(args[0],125,10);
 else if(consumer==='c3524')later(args[0],args[1],125,10);
 else if(consumer==='c377c'){emit(0x06000c01,(args[0]<<24)>>24);emit(0x06000c00,127);}
 else if(consumer==='c3320'){if(gate)gatedNow(...args);}
 else if(consumer==='c338c')later(...args);
 else if(consumer==='c33c8'){if(gate)later(...args);}
 else if(consumer==='c3408'){if(context.raceMode===3)gatedNow(...args);}
 else if(consumer==='c3464'){if(context.raceMode===3)later(...args);}
 else if(consumer==='c3494'){
  if(state.delay!==0&&--state.delay===0)state.delayedHold=now(state.delayedNote,state.delayedPriority,state.delayedHold);
  if(state.hold!==0)state.hold--;
 }else if(context.courseIndex!==0&&context.raceMode!==3&&(args[0]|0)===5){
  emit(0x06000f00,0x36);
  if(context.delay7cd8===0&&gate)later(0x5e,30,32,30);
 }
 return {state,commands,remaining};
}

// Racing subset of BF370, called by47B00 before922E4's source-frame increment.
// The web music owner retains soundtrack playback. Credits/tempo/mixer timers
// remain separate; delayed music/announcer dispatch precedes the pause gate.
export function advanceNativeRaceAnnouncer(input,context){
 const g={...context},commands=[];let state={...input};
 for(const key of ['rankDelay','delay7cd8','delay7cf0','counter7cf4','delay7cd4','delay7cec','field7c98','musicSelection','paused7cc4','delay7cdc','delay7ce4','delayedCue7e1c'])integer(g[key],-2147483648,2147483647);
 integer(g.primaryPlaceByte,0,255);integer(g.random4562c,0,0xffffffff);
 const call=(consumer,...args)=>commands.push({consumer,arguments:args.map(v=>v>>>0)});
 const voice=(consumer,...args)=>{const next=prepareNativeAnnouncer(state,{consumer,arguments:args},g);state=next.state;commands.push(...next.commands);};
 if(g.delay7cdc!==0&&(g.delay7cdc=(g.delay7cdc-1)|0)===0)call('c15c8',g.musicSelection,10);
 if(g.delay7ce4!==0&&(g.delay7ce4=(g.delay7ce4-1)|0)===0)call('c377c',g.delayedCue7e1c);
 if(g.paused7cc4===0){
  if(g.rankDelay!==0)g.rankDelay=(g.rankDelay-1)|0;
  if(g.delay7cd8!==0&&(g.delay7cd8=(g.delay7cd8-1)|0)===0&&g.field7c98!==0)call('c1540',g.musicSelection,0,0);
  if(g.delay7cf0!==0&&(g.delay7cf0=(g.delay7cf0-1)|0)===0)g.counter7cf4=0;
  if(g.delay7cd4!==0&&(g.delay7cd4=(g.delay7cd4-1)|0)===0&&g.raceMode===0)
   voice('c3320',(g.random4562c&1)+(g.primaryPlaceByte===0?0x24:g.primaryPlaceByte===3?0x27:0x2a),90,60);
  voice('c3494');
  if(g.delay7cec!==0&&g.field7c98!==0&&(g.delay7cec=(g.delay7cec-1)|0)===0)call('c1540',g.musicSelection,120,1);
 }
 return {state,context:g,commands};
}
