// Independent course0 sequence arithmetic. Actual loaded table/template words
// remain in the caller's canonical i1 owner; no original images or text data.
const I1=0x9440,HUD=0x7788,MIN=-2147483648,MAX=2147483647;
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires${count} unsigned words`);
 return Array.from(v,(x,i)=>integer(x,`${n}[${i}]`,0,0xffffffff));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function context(value){record(value,'course0 sequence input');return {value,i1:null,hud:null,lengths:null,operations:[]};}
const i1=c=>c.i1??=words(c.value.i1Words9440,'i1Words9440',168);
const read=(c,address)=>i1(c)[(address-I1)/4]|0;
function write(c,address,value){const bits=value>>>0;i1(c)[(address-I1)/4]=bits;
 c.operations.push({kind:'i1Write',byteOffset:address-I1,width:4,value:bits});}
function hudWrite(c,address,value){c.hud??=words(c.value.hudWords7788,'hudWords7788',1442);const bits=value>>>0;
 c.hud[(address-HUD)/4]=bits;c.operations.push({kind:'hudWrite',byteOffset:address-HUD,width:4,value:bits});}
function length(c,token){
 if(c.lengths===null){const v=c.value.descriptorLengthWords6894;
  if(!Array.isArray(v)||v.length<1||v.length>55)throw new RangeError('Supply1..55 actual signed descriptorLengthWords6894 entries');
  c.lengths=Array.from(v,(x,i)=>integer(x,`descriptorLengthWords6894[${i}]`));
 }
 return c.lengths[integer(token,'descriptor token',0,c.lengths.length-1)];
}
function initialize(c,sequenceIndex){
 const index=integer(sequenceIndex,'sequenceIndex',0,10);
 for(let i=0;i<9;i++)write(c,0x96a8+i*4,i1(c)[(0x94c8-I1)/4+i]);
 write(c,0x96a8,1);let x=290;const tokens=[];
 for(let i=0;i<3;i++){
  const token=read(c,0x9444+index*12+i*4);write(c,0x96b4+i*4,x);write(c,0x96c0+i*4,token);
  if(token!==-1){
   write(c,0x96ac,(read(c,0x96ac)+1)|0);const step=(length(c,token)+1)|0;
   write(c,0x96b0,(read(c,0x96b0)+step)|0);x=(x+step)|0;
  }
  tokens.push(token);
 }
 c.operations.push({kind:'audioEntry',consumer:'800c37d4',arguments:[index>>>0]});
 return {sequenceIndex:index,tokens};
}

/** Complete59E8 numeric setup. options.sequenceIndex is the actual source row
 *0..10. The33 token-table words and9 template words are read from i1Words9440;
 * descriptorLengthWords6894 is an explicit signed32 readonly length view.
 * Only−1 is a sentinel. Tokens/slots are not compacted. The copied count and
 * width accumulate with signed32 wrap; no implicit zero template is supplied.
 * Audio is an ordered entry recipe, with no callback or consumed return.
 */
export function prepareNativeRaceCourseZeroSequenceInitialization(value,options={}){
 const c=context(value);record(options,'sequence initialization options');
 const diagnostic=initialize(c,options.sequenceIndex);return freeze({operations:c.operations,diagnostic});
}

/** Complete5900, including actual59E8 when state1 is reached. State0 writes
 * delay−1 before testing its signed value. State1 stores2 before setup/audio,
 * then increments the row and wraps only when the new signed value>=11.
 * State2 waits for active0 and chooses delay0 only for the post-start index1;
 * other state words retain all fields. Unread descriptor/index inputs are not
 * required. The enclosing5800 guards and existing587C initializer are separate.
 */
export function prepareNativeRaceCourseZeroSequenceUpdate(value){
 const c=context(value),state=read(c,0x94ec),diagnostic={sequenceStateBefore:state,initialization:null};
 if(state===0){
  const next=(read(c,0x94f0)-1)|0;write(c,0x94f0,next);
  if(next<=0){write(c,0x94ec,1);write(c,0x94f0,0);}
 }else if(state===1){
  write(c,0x94ec,2);diagnostic.initialization=initialize(c,read(c,0x94f4));
  const next=(read(c,0x94f4)+1)|0;write(c,0x94f4,next);if(next>=11)write(c,0x94f4,0);
 }else if(state===2&&read(c,0x96a8)===0){
  write(c,0x94ec,0);write(c,0x94f0,read(c,0x94f4)===1?0:100);
 }
 return freeze({operations:c.operations,diagnostic});
}

function draw(c,consumer,args){c.operations.push({kind:'externalCall',consumer,arguments:args,numericPrepared:true});}
function styleZero(c){
 c.operations.push({kind:'sourceWordWrite',field:'style6e2c',value:100});
 hudWrite(c,0x8a44,0);
 c.operations.push({kind:'sourceHalfwordWrite',field:'style6e28',value:0});
 for(const address of [0x8a58,0x8a48,0x8a68,0x8a4c,0x8a5c,0x8a6c,0x8a60,0x8a70,0x8a50,0x8a74,0x8a64,0x8a54])hudWrite(c,address,255);
 draw(c,'courseZeroSequenceStyle',[0,...Array(12).fill(255)]);
}

/** Complete6BD8 retained arithmetic and the reached1E946C style0 writes.
 * Canonical HUD writes remain raw integer words; outside fields style6e2c and
 * style6e28 retain separate word/u16 owners. The other original draw styles,
 * graphics buffers, image assets and audio playback are not reconstructed.
 *
 * Draw operations are explicit high-resolution recipes in source order:
 * Backdrop[group,x,y,width,height],Style[mode,12 scalar channels],
 * Clip[left,top,right,bottom],Glyph[group,token,x,y,selector]. Coordinates are
 * logical screen units, not native world metres. No GPU head is fabricated.
 * The NEW consumer names/numericPrepared flag prevent an original6BD8 replay
 * from advancing these counters again. A renderer must execute recipes only.
 *
 * Call once per admitted source display. Active0 still draws backdrop and
 * restores clipping. Active nonzero moves reached non-sentinel slots by−2
 * only when signed16 activity624==−1, but always tests strict expiry AFTER
 * drawing. The final glyph recipes precede active0. Nonpositive counts skip
 * their loop; positive counts>3 reject as outside the bounded three-slot view,
 * rather than walking adjacent words or claiming an original source clamp.
 */
export function prepareNativeRaceCourseZeroSequenceDisplay(value){
 const c=context(value),diagnostic={activeBefore:read(c,0x96a8),tokens:[],expired:false};
 draw(c,'courseZeroSequenceBackdrop',[0,22,197,276,20]);
 if(diagnostic.activeBefore!==0){
  styleZero(c);draw(c,'courseZeroSequenceClip',[30,20,290,218]);
  const count=read(c,0x96ac);if(count>3)throw new RangeError('Source display count exceeds bounded three-slot view');
  diagnostic.tokenCount=count;
  for(let i=0;i<count;i++){
   const token=read(c,0x96c0+i*4);if(token===-1)continue;
   if(token<0||token>54)throw new RangeError('Source draw token outside supplied descriptor family');
   const activity=integer(record(value.scene,'source sequence scene').activity624,'scene.activity624',-32768,32767);
   const before=read(c,0x96b4+i*4);if(activity===-1)write(c,0x96b4+i*4,(before-2)|0);
   const x=read(c,0x96b4+i*4);draw(c,'courseZeroSequenceGlyph',[3,token,x,200,0]);
   diagnostic.tokens.push({slot:i,token,x,moved:activity===-1});
  }
  if(read(c,0x96b4)<((-read(c,0x96b0))|0)){write(c,0x96a8,0);diagnostic.expired=true;}
 }
 draw(c,'courseZeroSequenceClip',[0,0,319,239]);return freeze({operations:c.operations,diagnostic});
}
