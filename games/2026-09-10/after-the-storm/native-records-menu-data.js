// Verified numeric menu metadata. These are logical layout/selection constants,
// not cartridge records, executable code, font artwork or rider models.
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const NATIVE_RECORDS_MENU_DATA=freeze({
 courseOrderAad8:[0,1,2,4,3,5,6,8,7],
 courseNameTokensAa10:[8,9,10,11,12,13,14,15,16],
 courseHeaderTokensAa34:[8,9,10,11,12,13,14,15,22],
 transformWord821c:0x3ccccccd
});

/** A fresh load of the records overlay, not a per-frame reset. The host installs
 * this owner when entering a newly loaded records screen. Retained menu ticks
 * must keep their existing owner, including slides and post-race context.
 */
export function createNativeRecordsMenuWords(){
 const words=Array(62).fill(0),put=(address,values)=>values.forEach((v,i)=>words[(address-0x80c0)/4+i]=v>>>0);
 put(0x80e4,[0,0,10,0,320,0,0,0]);put(0x8104,[0,0,10,0,320,0,0,0]);
 put(0x8128,[0x028001e0,0x01ff0000,0x028001e0,0x01ff0000]);
 put(0x8138,[3,62,63]);put(0x8144,[0,-6,2]);
 put(0x8150,[0,1,5,-10,5,9,1,-10,-4]);put(0x8174,[0,0,12,-8,12,20,0,4,-8]);
 put(0x8198,[3,17,18]);put(0x81a8,[6,6,7]);return words;
}
