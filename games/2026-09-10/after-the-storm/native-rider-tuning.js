import {NATIVE_RIDER_TUNE_DEFAULTS} from './native-rider-controls.js';

export const NATIVE_TUNE_KEYS=Object.freeze(['tuneB6c','tuneB70','tuneB74']);
export const initialNativeSettings=()=>Array.from({length:2},()=>Array.from({length:4},()=>({...NATIVE_RIDER_TUNE_DEFAULTS})));

// The rider menu stores three integer indices, each with twelve positions.
// Fractional diagnostic water coefficients remain a separate low-level API.
export function nativeMenuTune(value={}){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new RangeError('Invalid original rider tuning');
 return Object.fromEntries(NATIVE_TUNE_KEYS.map(key=>{
  const v=value[key]===undefined?NATIVE_RIDER_TUNE_DEFAULTS[key]:value[key];
  if(!Number.isInteger(v)||v<0||v>11)throw new RangeError('Original tuning must use positions 0 through 11');
  return [key,v];
 }));
}

export function validateNativeSettings(value){
 if(value===undefined)return initialNativeSettings();
 if(!Array.isArray(value)||value.length!==2)throw new RangeError('Original tuning requires two player banks');
 return Array.from(value,bank=>{
  if(!Array.isArray(bank)||bank.length!==4)throw new RangeError('Original tuning requires four riders per player');
  return Array.from(bank,tune=>{
   if(!tune||NATIVE_TUNE_KEYS.some(key=>!Object.hasOwn(tune,key)))throw new RangeError('Incomplete original rider tuning');
   return nativeMenuTune(tune);
  });
 });
}

export const nativeTuneIsCustom=tune=>NATIVE_TUNE_KEYS.some(key=>tune[key]!==NATIVE_RIDER_TUNE_DEFAULTS[key]);

// Profile layout recovered from the original rider-menu byte stores: two
// player banks of four 14-byte profiles, after a 24-byte save header. Applying
// the current selection after record restoration preserves names/old records.
export function nativeTuneLaunchOperations(racers,players,tunes=[]){
 if(!Array.isArray(tunes))throw new RangeError('Expected original rider tunes');
 const operations=[];
 for(let player=0;player<players;player++){
  const rider=racers[player].id,tune=nativeMenuTune(tunes[player]);
  for(const [trait,key]of NATIVE_TUNE_KEYS.entries())operations.push({kind:'saveByteWrite',byteOffset:24+(player*4+rider)*14+11+trait,width:1,value:tune[key]});
  const custom=Number(nativeTuneIsCustom(tune));
  operations.push({kind:'sourceWordWrite',field:player?'secondRiderFlagA9cc':'riderFlagA9c8',value:custom});
  if(!player)operations.push({kind:'sourceWordWrite',field:'metadataCb32c',value:custom});
 }
 return operations;
}
