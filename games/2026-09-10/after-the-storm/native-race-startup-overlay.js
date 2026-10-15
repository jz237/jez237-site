// Numeric source startup HUD reset. All loaded presentation data is supplied by
// the caller; no original palette, vertex, texture or executable data is embedded.
// The one HUD word owner includes loaded data and the retained HUD BSS. Results
// are ordered partial writes, never a second mutable HUD/timer/record state.

const F=Math.fround,I0=-2147483648,I1=2147483647;
const HUD_BASE=0x7788,HUD_WORDS=(0x8e10-HUD_BASE)/4,RACE_BASE=0x1f94,RACE_WORDS=(0x3a08-RACE_BASE)/4;
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=I0,max=I1){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function words(v,count,n){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires${count} retained unsigned words`);
 return Array.from(v,(x,i)=>integer(x,`${n}[${i}]`,0,0xffffffff));}
function context(value){record(value,'startup source sample');return {hud:words(value.hudWords7788,HUD_WORDS,'hudWords7788'),
 race:words(value.raceWords1f94,RACE_WORDS,'raceWords1f94'),globals:record(value.globals,'startup globals'),operations:[],numericCalls:[]};}
function atHud(c,address){return c.hud[(address-HUD_BASE)/4];}
function signedHud(c,address){return atHud(c,address)|0;}
function signedRace(c,address){return c.race[(address-RACE_BASE)/4]|0;}
function write(c,address,value,width=4){
 const byteOffset=address-HUD_BASE;
 integer(byteOffset,'HUD byte offset',0,HUD_WORDS*4-width);
 if(width!==1&&width!==4||width===4&&byteOffset%4)throw new RangeError('Unsupported source HUD write width/alignment');
 const bits=integer(value,'source write bits',0,width===1?255:0xffffffff);
 c.operations.push({kind:'hudWrite',byteOffset,width,value:bits});
 if(width===4)c.hud[byteOffset/4]=bits;
 else{const i=byteOffset>>2,shift=(3-(byteOffset&3))*8;c.hud[i]=((c.hud[i]&~(255<<shift))|(bits<<shift))>>>0;}
}
function writeSigned(c,address,value){write(c,address,value>>>0);}
function interpolate(current,next,weight,inverse){
 // cvt.s.w, each multiply and the final sum round separately to binary32.
 const value=F(F(F(next)*inverse)+F(F(current)*weight));
 if(!Number.isFinite(value)||value<I0||value>=2147483648)
  throw new RangeError('Source palette conversion is outside finite signed32; FCSR exception behavior is not emulated');
 return Math.trunc(value)>>>0;
}
function palette(c){
 const activity=integer(c.globals.activity624,'activity624',-32768,32767);
 const phase=signedHud(c,0x8d20),bank=signedHud(c,0x8d1c);
 // Each selected bank reads both its row and the following row. The loaded
 // source has five triples per table and the ordinary retained bank is0..3.
 integer(bank,'retained bank8d1c',0,3);
 const weight=F(F((2-phase)|0)/2),inverse=F(1-weight),flag=signedRace(c,0x1fd8);
 let output=0x8aac;
 for(const table of [0x7888,0x78c4,0x7900,0x793c]){
  const fixed=flag!==0&&(table===0x7900||table===0x793c),selected=fixed?0:bank;
  for(let j=0;j<3;j++)write(c,output+j*4,interpolate(signedHud(c,table+selected*12+j*4),
   signedHud(c,table+(selected+1)*12+j*4),fixed?1:weight,fixed?0:inverse));
  output+=12;
 }
 if(activity===-1){
  const next=(phase+1)|0;writeSigned(c,0x8d20,next);
  if(next>=2){const nextBank=(bank+1)|0;writeSigned(c,0x8d1c,nextBank);write(c,0x8d20,0);write(c,0x8d1c,nextBank&3);}
 }
 return {phase8d20:phase,bank8d1c:bank,weight,inverse,fixedFinalTables:flag!==0};
}
function bufferWord(c,bufferIndex,byteOffset,value){
 c.operations.push({kind:'presentationBufferWrite',bufferIndex,byteOffset,width:4,value});
}

/** Complete numeric EE9C0 palette/history helper. Read views derive from the
 * caller's canonical hudWords7788[1442] and raceWords1f94[1693] owners. Only
 * globals.activity624(signed16) is needed. Retained phase/bank are read before
 * any surrounding reset; flag1fd8 comes from the race span. This returns
 * ordered big-endian HUD byte/word patches; it mutates neither input array.
 * Valid ordinary banks0..3 and finite signed32 conversions are explicit bounds.
 */
export function prepareNativeRaceStartupPalette(value){
 const c=context(value),diagnostic=palette(c);return freeze({operations:c.operations,diagnostic});
}

/** Complete numeric EED70 terminal, including its EE9C0 helper in source order.
 * Input globals are actual activity624, players, mode620, courseIndex and
 * racerCount. Human selectors are read lazily only when the active loops use
 * them. Source places293c and flag1fd8 come from raceWords1f94, which is never
 * written. Configured players1/2 and active racer count0..4 bound array access.
 *
 * hudWrite offsets are bytes relative to80227788; widths1/4 preserve byte
 * latches and unrelated neighbor bits. presentationBufferWrite targets two
 * caller-owned opaque64-word buffers, corresponding to source801a3528 and
 *801ae818. No original data is supplied here. Copy operations preserve source
 * word order and bits. A modern renderer may consume an explicit equivalent
 * presentation; this leaf performs no rendering, audio or external callback.
 * numericCalls is diagnostic: that helper is ALREADY expanded into operations
 * and must not be executed again. There are no pending external effects.
 */
export function prepareNativeRaceStartupOverlay(value){
 const c=context(value),g=c.globals;
 // Validate source-independent bounds before constructing any returned writes.
 const count=integer(g.racerCount,'racerCount',0,4),players=integer(g.players,'players',1,2);
 const mode=integer(g.mode620,'mode620'),course=integer(g.courseIndex,'courseIndex');
 if(signedHud(c,0x7998)!==0)write(c,0x7998,0);
 c.numericCalls.push({consumer:'801ee9c0',operationIndex:c.operations.length,prepared:true});
 const paletteDiagnostic=palette(c);
 for(const address of [0x8b54,0x8b50,0x8aa4])write(c,address,0);
 for(let group=0;group<2;group++)for(let row=0;row<3;row++){
  const base=0x8c30+group*0x54+row*0x1c;
  // The source deliberately retains row+10; do not zero the whole structure.
  for(const offset of [0x14,0x18,0x0c,0x08,0x04,0])write(c,base+offset,0);
 }
 for(let buffer=0;buffer<2;buffer++)for(let row=0;row<4;row++){
  const first=row*16;
  for(let j=0;j<4;j++)bufferWord(c,buffer,0x80+first+j*4,atHud(c,0x7788+first+j*4));
  for(const [source,destination]of [[0x77c8,0],[0x7808,0x40],[0x7848,0xc0]])
   for(const offset of [4,0,8,12])bufferWord(c,buffer,destination+first+offset,atHud(c,source+first+offset));
 }
 write(c,0x8d08,0);write(c,0x8a90,60);
 const latch=course===0||mode===11?1:0;
 for(let i=0;i<count;i++)write(c,0x8b58+i,latch,1);
 const limit=players===1?100:50;write(c,0x8d10,limit);write(c,0x8d0c,mode===0||mode===11?0:limit);
 for(const address of [0x8d20,0x8c28,0x8c2c,0x8d1c,0x8b80,0x8b7c,0x8b78,0x8a98])write(c,address,0);
 for(let row=0;row<2;row++)for(const base of [0x8b70,0x8b68,0x8b60])write(c,base+row*4,0);
 write(c,0x8aa0,0);
 const places=Array.from({length:count},(_,i)=>signedRace(c,0x293c+i*0x378));
 for(let player=0;player<players;player++){
  const base=0x8d28+player*0x50;
  for(let i=0;i<count;i++)writeSigned(c,base+i*0x14+0x0c,Math.imul(places[i],24));
  if(count>0){
   const selected=integer(player===0?g.primaryHumanIndex:g.secondaryHumanIndex,player===0?'primaryHumanIndex':'secondaryHumanIndex',0,3);
   const selectedPlace=signedRace(c,0x293c+selected*0x378);
   for(let i=0;i<count;i++)if(selectedPlace<places[i])writeSigned(c,base+i*0x14+0x0c,(signedHud(c,base+i*0x14+0x0c)+4)|0);
  }
  for(let i=0;i<count;i++){
   const row=base+i*0x14,offset=atHud(c,row+0x0c);
   for(const at of [0x10,0x08,0])write(c,row+at,0);
   write(c,row+4,offset);
  }
 }
 for(let i=0;i<4;i++){write(c,0x8dd8+i*4,0);write(c,0x8dc8+i*4,0);write(c,0x8de8+i*4,1);}
 for(const address of [0x8ae0,0x8afc,0x8b18,0x8b34,0x8a94,0x8a9c,0x8dfc,0x8df8])write(c,address,0);
 for(let player=0;player<players;player++)for(let i=0;i<count;i++){
  const base=0x8b88+player*0x50+i*0x14;
  for(const offset of [0x0c,0x10,0x08,0x04,0])write(c,base+offset,0);
 }
 write(c,0x8b5c,mode!==11&&course===0?219:119);write(c,0x8aa8,0);
 write(c,0x8e00,0);write(c,0x8e04,0);
 return freeze({operations:c.operations,diagnostic:{palette:paletteDiagnostic,numericCalls:c.numericCalls,
  activeRacers:count,players,presentationBufferWords:128,pendingExternalEffects:0}});
}
