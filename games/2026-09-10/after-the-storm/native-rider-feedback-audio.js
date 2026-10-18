// Original C3548/C35B4 retain separate gates for spoken commentary (inside
// C3408) and the channel11 cue. A nonzero result flag suppresses both.
// The caller supplies the audio RNG word; this helper never advances it.
export function prepareNativeRiderFeedbackAudio(consumer,{resultFlag7dd0,random4562c}){
 if(!['c3548','c35b4'].includes(consumer))throw new TypeError('Unknown native rider feedback call');
 if(!Number.isInteger(resultFlag7dd0)||resultFlag7dd0< -2147483648||resultFlag7dd0>2147483647||
  !Number.isInteger(random4562c)||random4562c<0||random4562c>0xffffffff)throw new RangeError('Invalid native rider feedback state');
 if(resultFlag7dd0!==0)return [];
 return [{consumer:'c3408',arguments:[consumer==='c3548'?(random4562c&3)+0x6c:random4562c%3+0x66,32,30]},
  {consumer:'c1eb8',arguments:[consumer==='c3548'?(random4562c&1):(random4562c&1)?19:2]}];
}
