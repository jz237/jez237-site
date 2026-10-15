// Independently reconstructed numeric power selection. This leaf does not
// compute standings, AI roles, route progress, flags, random values or inputs.
// The numeric source field names below deliberately avoid inventing meanings
// for their producers. Slot ZERO is not assumed to be the human racer.
const F=Math.fround;
const group=values=>values.map(F);
const zero={comparisonOverride:group([.76,.73,.7]),lower:group([.7,.6]),equalOrHigher:group([.9,.8,.7])};
const one={comparisonOverride:group([.88,.86,.88,.88]),lower:group([.9,.8,.7]),equalOrHigher:group([1,.93,.85])};
const two={comparisonOverride:F(.95),otherwise:group([1,.95,.9])};
const finished=group([.4,.57,.4,.5]);
const limits={minimum:.5,maximum:F(1.2),markedBox:F(1.05)};
function integer(value,name,min=-0x80000000,max=0x7fffffff){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} must be an integer from ${min} to ${max}`);return value;
}
function binary32(value,name){
 if(typeof value!=='number'||!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError(`${name} must fit finite binary32`);return F(value);
}

/**
 * All inputs are explicit snapshots; the returned number is basePowerFactor
 * BEFORE common actor multipliers. role is the supplied -1..2 source AI role,
 * avatar is0..3, and own293c/slotZero293c are signed record values. Numeric
 * flagA4/B0/98 and finished2c2c are signed32; markedBox15de is signed16,
 * fieldC7c unsigned16, counter90 signed32 and rawXNative a signed byte.
 *
 * difficulty is the ACTUAL supplied source difficulty. Only0/1/2 select a
 * table; other signed values retain previousPowerFactor at that phase. A
 * browser Reverse menu index is never automatically interpreted as Expert.
 * The caller owns the previous value even if the usual valid branch replaces
 * it. Course0 and later overrides still apply to an unrecognized difficulty.
 *
 * Order matters: table -> finished -> flag98/strict|X|>56 -> markedBox or
 * C7c-zero -> counter>=16 -> course0 -> [.5,F32(1.2)] clamp. No source producer,
 * racing AI controller, navigation, physics profile or live host is supplied.
 */
export function selectNativeAIPower(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('Explicit AI power fields are required');
 const {difficulty,role,avatar,own293c,slotZero293c,flagA4,flagB0,flag98,finished2c2c,markedBox15de,fieldC7c,counter90,courseIndex,rawXNative}=input;
 for(const key of ['difficulty','own293c','slotZero293c','flagA4','flagB0','flag98','finished2c2c','counter90'])integer(input[key],key);
 integer(role,'role',-1,2);integer(avatar,'avatar',0,3);integer(markedBox15de,'markedBox15de',-32768,32767);
 integer(fieldC7c,'fieldC7c',0,65535);integer(courseIndex,'courseIndex',0,9);integer(rawXNative,'rawXNative',-128,127);
 let power=binary32(input.previousPowerFactor,'previousPowerFactor');
 const r=Math.max(0,role),comparisonOverride=flagA4!==0||own293c>slotZero293c&&flagB0===0;
 if(difficulty===0){
  if(comparisonOverride)power=zero.comparisonOverride[r];
  else if(own293c<slotZero293c)power=r===2?finished[avatar]:zero.lower[r];
  else power=zero.equalOrHigher[r];
 }else if(difficulty===1){
  if(comparisonOverride)power=one.comparisonOverride[avatar];
  else power=(own293c<slotZero293c?one.lower:one.equalOrHigher)[r];
 }else if(difficulty===2)power=comparisonOverride?two.comparisonOverride:two.otherwise[r];
 if(finished2c2c!==0)power=finished[avatar];
 if(flag98!==0||Math.abs(rawXNative)>56)power=1;
 if(markedBox15de!==0)power=limits.markedBox;
 else if(fieldC7c===0)power=limits.maximum;
 if(counter90>=16)power=1;
 if(courseIndex===0)power=1;
 return Math.max(limits.minimum,Math.min(limits.maximum,power));
}
