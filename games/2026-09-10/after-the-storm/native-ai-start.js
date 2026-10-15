// Independent reconstruction of the source's non-driving AI input stage.
// This chooses raw buttons only. The source timer, phase transitions, rocket
// mechanics, actor gates and retained power/history have separate owners.
const RELEASE_DELAYS=[[5,2,0],[5,3,2],[5,4,4]];
function integer(v,name,min=-2147483648,max=2147483647){
 if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`${name} is outside its native integer range`);
 return v;
}

/** Native80630: clear both axes, then set/clear only button bits0xa000.
 * role is the original AI5c value (-1 for the selected human). Timer80228a90
 * is a signed32 source word. Its producer and timer units are not inferred.
 * For role-1 the source ignores difficulty; the ordinary role table supports
 * native difficulty0..2. Reverse is an independent selector, not difficulty3.
 * Power and all retained AI histories remain untouched by this input leaf.
 */
export function prepareNativeAIStartInput({role,difficulty,chargeTimerNative,heldButtons}={}){
 integer(role,'role',-1,2);integer(difficulty,'difficulty');integer(chargeTimerNative,'chargeTimerNative');
 integer(heldButtons,'heldButtons',0,65535);
 if(role!==-1&&(difficulty<0||difficulty>2))throw new RangeError('The ordinary source start table requires difficulty0..2');
 const held=role===-1?chargeTimerNative<16:chargeTimerNative<=15-RELEASE_DELAYS[role][difficulty];
 return Object.freeze({rawXNative:0,rawYNative:0,heldButtons:held?heldButtons|0xa000:heldButtons&0x5fff});
}
