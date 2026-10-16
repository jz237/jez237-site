// Volatile web-session transport for the retained source record/setup region.
// The next source reset owns clearing result flags and selecting record clocks.
// No physical racers, HUD animation, input history or ranked save is transported.
// Version2 excludes the selected rider: that belongs to the next race setup,
// even though its source word also selects the fallback initials profile.
const FIRST=(0x1ff0-0x1f94)/4,COUNT=(0x2938-0x1ff0)/4;
function integer(value,name,min,max){if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`Invalid record session ${name}`);return value;}
function words(value,count,name){if(!Array.isArray(value)||value.length!==count)throw new RangeError(`Invalid record session ${name} length`);
 return Array.from(value,x=>integer(x,name,0,0xffffffff));}
function copy(value){
 if(value?.version!==2)throw new RangeError('Unsupported native record session');
 return {version:2,recordSetupWords1ff0:words(value.recordSetupWords1ff0,COUNT,'record/setup'),
  saveWordsB280:words(value.saveWordsB280,34,'profile'),cold8224:integer(value.cold8224,'cold latch',-2147483648,2147483647),
  freshNameAb6c:integer(value.freshNameAb6c,'name latch',-32768,32767),field700:integer(value.field700,'initials',-2147483648,2147483647)};
}
export function copyNativeRecordSession(value){const result=copy(value);Object.freeze(result.recordSetupWords1ff0);Object.freeze(result.saveWordsB280);return Object.freeze(result);}

/** Detached snapshot for a menu handoff, never a concurrently updated owner.
 * Includes per-course record flags, original setup order and cold-reset tails;
 * dropping those would silently turn an original warm reset into a cold one. */
export function captureNativeRecordSession(state){
 const race=words(state.raceWords1f94,1693,'race owner');
 return copyNativeRecordSession({version:2,recordSetupWords1ff0:race.slice(FIRST,FIRST+COUNT),saveWordsB280:state.saveWordsB280,
  cold8224:state.scene.cold8224,freshNameAb6c:state.scene.freshNameAb6c,field700:state.scene.field700});
}

/** Install before75310, so its selected best-time caches see retained records.
 * Only a detached newly constructed state is returned; malformed sessions
 * cannot partially overwrite the caller or turn into opaque saved game state. */
export function restoreNativeRecordSession(state,value){
 const session=copy(value),race=words(state.raceWords1f94,1693,'race owner');
 race.splice(FIRST,COUNT,...session.recordSetupWords1ff0);
 return {...state,raceWords1f94:race,saveWordsB280:session.saveWordsB280,
  scene:{...state.scene,cold8224:session.cold8224,freshNameAb6c:session.freshNameAb6c,field700:session.field700}};
}
