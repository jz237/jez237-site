// Verified numeric i5/resident metadata. No guest executable, jump tables,
// font bitmaps or display-list pointers are needed by the vector consumer.
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const NATIVE_CHAMPIONSHIP_STANDINGS_DATA=freeze({
 // Resident signed halves read by801EB91C at800EABEC, including unused rows.
 courseWaves:[20,20,20,40,10,30,20,25,25,0,15,15],
 digitWidths6d70:[14,10,13,11,15,12,12,11,13,12],
 requiredPointsAbbc:[[0,1,2,4,8,12,16,0],[2,4,6,10,14,21,28,0],[2,4,8,12,16,23,30,37]],
 requiredPlaceTokens:[80,81,82,83,84],lastRound7a2c:[6,6,7]
});

/** Fresh semantic storage on the actual result->standings transition, never
 * a per-frame reset. Retain the original numeric layout fields; unused guest
 * code/format/pointer slots are zero placeholders, not a copied ROM overlay.
 * 7B00/outcome and 7B08/destination are written before reading by 5A98;
 * 7B04/offset is written by 5850. The high-resolution renderer owns matrices.
 */
export function createNativeChampionshipStandingsMenuWords(){
 const words=Array(68).fill(0);
 words[0]=320<<16;words.splice(2,4,0x028001e0,0x01ff0000,0x028001e0,0x01ff0000);
 words.splice(6,5,...NATIVE_CHAMPIONSHIP_STANDINGS_DATA.requiredPlaceTokens);
 words.splice(11,3,...NATIVE_CHAMPIONSHIP_STANDINGS_DATA.lastRound7a2c);return words;
}

/** Source 5DC0 uses the four base-avatar names at B298, independent of the
 * alternate model color. Decode the retained eleven-byte name portion only;
 * the following three tuning bytes must never be mistaken for text.
 */
export function nativeChampionshipStandingsSourceViews(state,avatarsBySlot){
 const save=state?.saveWordsB280;
 if(!Array.isArray(save)||save.length!==34||save.some(v=>!Number.isInteger(v)||v<0||v>0xffffffff))throw new RangeError('Supply retained saveWordsB280[34]');
 if(!Array.isArray(avatarsBySlot)||avatarsBySlot.length!==4||new Set(avatarsBySlot).size!==4||avatarsBySlot.some(v=>!Number.isInteger(v)||v<0||v>3))throw new RangeError('Supply the four selected avatars');
 const byte=at=>(save[at>>>2]>>>((3-(at&3))*8))&255;
 const riderNamesB298=Array.from({length:4},(_,avatar)=>{
  let name='';for(let i=0;i<11;i++){const b=byte(24+avatar*14+i);if(b===0)return name;if(b<32||b>126)throw new RangeError('Unsupported retained rider name encoding');name+=String.fromCharCode(b);}
  throw new RangeError('Retained rider name needs a terminator before tuning');
 });
 return freeze({...NATIVE_CHAMPIONSHIP_STANDINGS_DATA,avatarsA9b0:[...avatarsBySlot],riderNamesB298});
}
