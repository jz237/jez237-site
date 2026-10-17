function integer(v,max){if(!Number.isInteger(v)||v<0||v>max)throw new RangeError('Invalid native hull wet field');return v;}

//62E50 initializes aggregate count8 and current/previous flags1 even though
//4B0F8 has cleared point flags. The first completed frame recounts them.
export function initialNativeHullWetState(){
 return Object.freeze({wetCountC78:8,wetFlagC7c:1,landingC7e:0,takeoffC80:0,previousWetFlagC82:1});
}

//65C18,65FF8..66074: twelve point flag words, descending, bit0 only.
// This completion is outside the simulation648 movement gate. C78 is a count;
// C7C is a flag. C7E/C80 report the edges from the PRECEDING aggregate flag.
export function completeNativeHullWetState(previousWetFlagC7c,pointFlags){
 integer(previousWetFlagC7c,65535);
 if(!Array.isArray(pointFlags)||pointFlags.length!==12)throw new TypeError('Expected twelve native point flags');
 pointFlags.forEach(v=>integer(v,0xffffffff));
 let wetCountC78=0;for(let i=11;i>=0;i--)wetCountC78+=pointFlags[i]&1;
 const wetFlagC7c=Number(wetCountC78!==0),changed=previousWetFlagC7c^wetFlagC7c;
 return Object.freeze({wetCountC78,wetFlagC7c,landingC7e:wetFlagC7c&changed,
  takeoffC80:previousWetFlagC7c&changed,previousWetFlagC82:previousWetFlagC7c});
}
