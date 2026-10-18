import {classifyNativeStuntFrame} from './native-stunt-scoring.js';

//65C18's result tail follows the completed actor phase. The retained countdown
// is armed by63C88's release write; an arbitrary splash is not a stunt landing.
export function prepareNativeRiderLanding(state,snapshot){
 if(!state||!snapshot)throw new TypeError('Explicit landing state and completed actor snapshot are required');
 for(const k of ['racerIndex','primaryRacerIndex'])if(!Number.isInteger(snapshot[k])||snapshot[k]<0||snapshot[k]>3)throw new RangeError(`Invalid ${k}`);
 for(const k of ['actorState','animationFrame','action','wetCount','anyWet','airborneFrames','floorContact','boxContact','recoveryState','crash','partial','upY'])
  if(snapshot[k]===undefined)throw new TypeError(`Landing snapshot requires ${k}`);
 if(state.landingTicks===undefined||state.arcNative===undefined)throw new TypeError('Retained landing countdown and arc are required');
 const result=classifyNativeStuntFrame({...snapshot,landingTicks:state.landingTicks,arcNative:state.arcNative}),effects=[];
 if(result.settled){
  if(result.move===6&&snapshot.racerIndex===snapshot.primaryRacerIndex)effects.push({kind:'externalCall',consumer:'800c35b4',arguments:[]});
  effects.push({kind:'repairLandingHull',consumer:'80051ec0',racerIndex:snapshot.racerIndex});
 }
 return {...result,effects};
}
