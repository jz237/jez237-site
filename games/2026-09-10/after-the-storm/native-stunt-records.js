// Source79528's Stunt record branch, after all racer scoring calls and before
// the later display stage. Selected-course numeric records only; persistence,
// ratings, unlocks, and result-menu transitions remain owned elsewhere.
const fields=['mainState638','mode620','activity624','state600','delayedAward39cc',
 'finished2c2c','metadataD9b0','metadataCb32c'];
function integer(value,name){
 if(!Number.isInteger(value)||value< -2147483648||value>2147483647)throw new RangeError(`Invalid ${name}`);return value;
}
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}

/** Pass the canonical award queue, including its TRANSFERRED total, and the
 * selected primary's finished word. delayedAward39cc is the pending AMOUNT,
 * not the countdown at39d0. Delayed finish awards must be processed
 * before this check. A queue that drains in this frame's later display stage
 * can only unblock the next gameplay update. The fresh result latch is set
 * even when no record improves. Ties do not beat the existing score.
 *
 * Each selected-course row has four retained words. Insertion shifts all four
 * words, then writes score and two metadata words only; the insertion row's
 * fourth word is retained. Do not replace it with a guessed name/rider field.
 */
export function prepareNativeStuntRecords(value,{awards,...context}={}){
 const state={flag1fd8:integer(value?.flag1fd8,'flag1fd8'),recordPlace2928:integer(value?.recordPlace2928,'recordPlace2928')};
 if(!Array.isArray(value?.courseRecords)||value.courseRecords.length!==3)throw new RangeError('Supply three selected-course score rows');
 state.courseRecords=value.courseRecords.map((row,i)=>{
  if(!Array.isArray(row)||row.length!==4)throw new RangeError('Each score row requires four retained words');
  return row.map((v,j)=>integer(v,`courseRecords[${i}][${j}]`));
 });
 const g=Object.fromEntries(fields.map(k=>[k,integer(context[k],k)]));
 if(g.activity624< -32768||g.activity624>32767)throw new RangeError('activity624 must fit signed16');
 if(!Array.isArray(awards?.slots)||awards.slots.length!==4)throw new RangeError('Supply the canonical four-slot award queue');
 const empty=awards.slots.map((s,i)=>integer(s?.type,`slots[${i}].type`)).every(type=>type===0);
 const total=integer(awards?.totals?.total,'transferred total');
 const applied=g.activity624===-1&&g.mode620===11&&g.mainState638===1&&g.state600===0&&
  state.flag1fd8===0&&g.finished2c2c!==0&&g.delayedAward39cc===0&&empty;
 let insertedPlace=null;
 if(applied){
  state.flag1fd8=1;state.recordPlace2928=0;
  const place=state.courseRecords.findIndex(row=>total>row[0]);
  if(place>=0){
   for(let j=2;j>place;j--)state.courseRecords[j]=[...state.courseRecords[j-1]];
   state.courseRecords[place].splice(0,3,total,g.metadataD9b0,g.metadataCb32c);
   state.recordPlace2928=insertedPlace=place+1;
  }
 }
 return freeze({state,applied,insertedPlace});
}
