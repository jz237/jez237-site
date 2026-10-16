// Verified numeric title/demo selections, not rendering assets or ROM code.
// AC44 rows are eight bytes apart; only their first two signed halves are read.
// D96A4 has nine course rows of four three-word rider tuning records. Do not
// reinterpret the following unrelated data as additional tuning rows.
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const NATIVE_TITLE_INITIAL_PAIR=3;
export const NATIVE_TITLE_MENU_DATA=freeze({
 titleAvatarPairsAc44:[[0,2],[2,3],[1,2],[3,0]],
 courseRiderTraits:Array.from({length:9},()=>[[0,0,11],[1,0,11],[5,2,9],[11,0,11]]),
 courseResourcePairs:[[0,2],[3,2],[0,-1],[3,-1],[6,4],[7,-1],[-1,-1],[1,3],[8,-1]]
});
