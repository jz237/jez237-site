const ri=a=>(a-0x1f94)/4;
function word(state,address){const v=state.raceWords1f94?.[ri(address)];if(!Number.isInteger(v)||v<0||v>0xffffffff)throw new RangeError('Invalid Stunt record word');return v;}
function initials(value){let text='';for(let i=3;i>=0;i--){const byte=value>>>(i*8)&255;if(byte===0)break;text+=String.fromCharCode(byte);}return text;}
/** Read-only rows selected by3698: three records plus the unranked current
 * run when2928 iszero. Rider IDs come from the source records/physical roster. */
export function nativeStuntRecordView(state,{ridersBySlot=[]}={}){
 const course=state.scene.courseIndex;
 if(!Number.isInteger(course)||course<0||course>11)throw new RangeError('Invalid Stunt results course');
 const place=word(state,0x2928),rows=Array.from({length:3},(_,i)=>{
  const address=0x26e8+course*48+i*16;
  return {kind:'rank',rank:i+1,score:word(state,address),rider:word(state,address+4),tuned:word(state,address+8)!==0,
   initials:initials(word(state,address+12)),offset:i%2?'xB':'xA',highlight:place===i+1?(place===1?'record':'current'):'none'};
 });
 if(place===0){
  const slot=state.scene.primaryHumanIndex,rider=ridersBySlot[slot];
  if(!Number.isInteger(slot)||slot<0||slot>3||!Number.isInteger(rider)||rider<0||rider>3)throw new RangeError('Supply current Stunt rider');
  rows.push({kind:'current',score:word(state,0x26d0),rider,tuned:state.scene.metadataCb32c!==0,initials:'',offset:'xB',highlight:'current'});
 }
 return {course,rows};
}
