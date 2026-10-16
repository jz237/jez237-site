const ri=a=>(a-0x1f94)/4;
function word(state,address){const v=state.raceWords1f94?.[ri(address)];if(!Number.isInteger(v)||v<0||v>0xffffffff)throw new RangeError('Invalid result record word');return v;}
function initials(value){let text='';for(let i=3;i>=0;i--){const byte=value>>>(i*8)&255;if(byte===0)break;text+=String.fromCharCode(byte);}return text;}
/** Read-only record selection used by the normal5C2C results drawing body.
 * Modern labels/presentation replace graphics calls. The selected current
 * rider comes from the host's physical roster, corresponding toA9B0[48DC].
 * Reverse rows2/3 and reverse best lap are placeholders, not repeated records.
 */
export function nativeResultsRecordView(state,{ridersBySlot=[]}={}){
 const course=state.scene.courseIndex,reverse=state.scene.reverseDab68!==0;
 if(!Number.isInteger(course)||course<0||course>11)throw new RangeError('Invalid results course');
 const place=word(state,0x2650),lapFlag=word(state,0x2654);
 const row=(address,extra)=>({timeMs:word(state,address),rider:word(state,address+4),tuned:word(state,address+8)!==0,
  difficulty:word(state,address+12),initials:initials(word(state,address+16)),...extra});
 const rows=Array.from({length:3},(_,index)=>{
  const extra={kind:'rank',rank:index+1,offset:index%2?'xB':'xA',highlight:reverse?(index===0&&place!==0?'record':'none'):
   place===index+1?(place===1?'record':'current'):'none'};
  return reverse&&index>0?{...extra,placeholder:true}:row(reverse?0x23b0+course*20:0x1ff0+course*60+index*20,extra);
 });
 if(place===0){
  const slot=state.scene.primaryHumanIndex,rider=ridersBySlot[slot];
  if(!Number.isInteger(slot)||slot<0||slot>3||!Number.isInteger(rider)||rider<0||rider>3)throw new RangeError('Supply current results rider');
  rows.push({kind:'current',offset:'xB',highlight:'current',timeMs:word(state,0x2ad4+slot*888),rider,
   tuned:state.scene.metadataCb32c!==0,difficulty:state.profileWordsB330[2],initials:''});
 }
 const extra={kind:'lap',offset:place===0?'xA':'xB',highlight:lapFlag!==0?'record':'none'};
 rows.push(reverse?{...extra,placeholder:true,highlight:'none'}:row(0x22c0+course*20,extra));
 return {course,reverse,rows};
}
