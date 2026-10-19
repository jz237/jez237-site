import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
const F=Math.fround,bits=new DataView(new ArrayBuffer(4)),packet=0x1608;
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid dolphin audio ${name}`);return v;}
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
/** Complete C1268 and BFFEC. The nine-byte packet at801D0668 belongs to
 * the retained actor pool. Audio context belongs to the existing mixer owner;
 * its course/mode may differ during transitions from the physical scene.
 * Raw C538C/C53D4 queue commands remain external effects, never playback. */
export function prepareNativeDolphinAudio({actorWordsF060:source,audioContext}={}){
 if(!Array.isArray(source)||source.length!==NATIVE_PRESENTATION_ACTOR_WORDS||Array.from(source).some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))
  throw new RangeError(`Supply actorWordsF060[${NATIVE_PRESENTATION_ACTOR_WORDS}]`);
 const actorWordsF060=[...source],operations=[],result=()=>freeze({actorWordsF060,operations});
 const audioMode=integer(audioContext?.audioMode,'mode',0,255);
 if(audioMode!==7)return result();
 if(integer(audioContext.courseIndex,'course',-2147483648,2147483647)!==0)return result();
 const byte=o=>(actorWordsF060[(packet+o)>>>2]>>>(24-((packet+o)&3)*8))&255;
 const signed=v=>(v<<24)>>24;
 function put(o,v){const offset=packet+o,index=offset>>>2,shift=24-(offset&3)*8;actorWordsF060[index]=((actorWordsF060[index]&~(255<<shift))|((v&255)<<shift))>>>0;operations.push({kind:'presentationActorWrite',byteOffset:offset,width:1,value:v&255});}
 const emit=(consumer,port,value)=>operations.push({kind:'externalCall',consumer,arguments:[port,value>>>0]});
 const cue=value=>{emit('800c53d4',0x06000505,127);emit('800c53d4',0x06000500,signed(value));};
 if(byte(4)!==byte(5)){cue(signed(byte(5))===1?9:8);put(4,byte(5));}
 if(byte(8)!==0&&integer(audioContext.raceMode,'race mode',-2147483648,2147483647)===0){cue(byte(8));put(8,0);}
 bits.setUint32(0,actorWordsF060[packet/4]);const distance=bits.getFloat32(0);
 if(!Number.isFinite(distance))throw new RangeError('Nonfinite dolphin audio distance');
 const volume=distance>4?Math.trunc(F(508/distance)):127;
 bits.setFloat32(0,F(F(volume)/127));emit('800c538c',0x01000500,bits.getUint32(0));
 emit('800c53d4',0x03000500,signed(byte(7)));
 return result();
}
