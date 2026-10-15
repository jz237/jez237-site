// Independently reconstructed numeric gameplay selection, USA Rev1. These
// amplitudes seed and force the water; they are never a global wave-height cap.
const courseIndices=Object.freeze({practice:0,greyhaven:1,amber:2,citadel:3,reed:4,port:5,neon:6,tempest:7,glacier:8});
const one=Object.freeze([20,20,20,40,10,30,20,25,25]);
const two=Object.freeze([15,15,15,35,5,20,15,20,20]);
export function sourceWaterConditions({courseIndex,courseId,players=1,stunt=false,reverse=false,seaChoice=0,random31}={}){
 const index=courseIndex??courseIndices[courseId];
 if(!Number.isInteger(index)||index<0||index>8)throw new RangeError('Unknown source water course');
 if(players!==1&&players!==2)throw new RangeError('Source water supports one or two human cameras');
 if(typeof stunt!=='boolean'||typeof reverse!=='boolean')throw new TypeError('stunt and reverse must be boolean');
 if(!Number.isInteger(seaChoice)||seaChoice<0||seaChoice>3)throw new RangeError('Invalid source sea choice');
 let amplitudeNative=(stunt||reverse||players===1?one:two)[index];
 if(!stunt&&!reverse){
  if(seaChoice===1)amplitudeNative=10;
  else if(seaChoice===2)amplitudeNative=40;
  else if(seaChoice===3){
   const value=typeof random31==='function'?random31():random31;
   if(!Number.isInteger(value)||value<0||value>30)throw new RangeError('An explicit random0..30 sample is required');
   amplitudeNative=value+10;
  }
 }
 return Object.freeze({courseIndex:index,variant:0,players,baseAmplitudeNative:amplitudeNative,
  seaChoice:stunt||reverse?0:seaChoice,customSea:!stunt&&!reverse&&seaChoice!==0,period:20});
}
