// Independent numeric reconstruction of the bounded AI setup and shared LCG.
// This returns partial writes, never a synthesized cold or reset driver state.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
function integer(value,name,min=-2147483648,max=2147483647){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`Invalid ${name}`);return value||0;
}
function integers(value,name,length){
 if(!Array.isArray(value)||value.length!==length)throw new RangeError(`Expected ${length} ${name} entries`);
 return Array.from(value,(v,i)=>integer(v,`${name}[${i}]`));
}
function record(value,name){if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError(`Expected ${name}`);return value;}

/** One source shared-RNG call. The returned word is both the new retained
 * unsigned32 state and the source result. Callers supply the actual state;
 * there is no fixed seed, Date/performance seed, or unrelated water RNG here.
 */
export function stepNativeAIRandom(rngState){
 integer(rngState,'rngState',0,4294967295);
 const value=(Math.imul(rngState,0x41c64e6d)+0x3039)>>>0;
 return freeze({rngState:value,value});
}

/** Partial writes from one bounded native AI setup call, using actual copied
 * inputs. All FOUR stored hull profiles/avatars are needed even when fewer
 * racers are active. B64 selects the turn budget; B68 is copied independently
 * as the avatar/route-column identity. Unknown signed B64 values do NOT write
 * a turn budget. No other retained physical/AI field is filled in here.
 *
 * sourceOrder is the active prefix of the distinct native26c0 order table;
 * duplicates retain source last-write behavior. It is not guessed from rank,
 * place, current race order, avatar, or selected human. objectTypes4c contains
 * actual runtime object+4c words (0..64 objects) in original array order,
 * including nonqualifying objects. These are not raw course-file type tags.
 *
 * retainedRoleWords supplies all four actual prior signed role words. A role
 * fallback can probe index4, which aliases an adjacent target-scratch word.
 * adjacentRoleWord is required ONLY if that source read occurs. It is never
 * assumed zero or replaced with an invented fifth racer. A deterministic
 * repeating scan rejects atomically instead of hanging or repairing the scan.
 */
export function prepareNativeAIInitialization(input){
 record(input,'native AI initialization input');
 let rngState=integer(input.rngState,'rngState',0,4294967295),rngCalls=0;
 const racerCount=integer(input.racerCount,'racerCount',0,4),human=integer(input.primaryHumanIndex,'primaryHumanIndex',0,3);
 const profiles=integers(input.hullProfilesB64,'hullProfilesB64',4),avatars=integers(input.avatarsB68,'avatarsB68',4);
 const order=integers(input.sourceOrder,'sourceOrder',racerCount);order.forEach(v=>integer(v,'sourceOrder slot',0,3));
 const roles=integers(input.retainedRoleWords,'retainedRoleWords',4);
 let adjacent=input.adjacentRoleWord;
 if(adjacent!==undefined)adjacent=integer(adjacent,'adjacentRoleWord');
 if(!Array.isArray(input.objectTypes4c)||input.objectTypes4c.length>64)throw new RangeError('Expected0..64 objectTypes4c entries');
 const objectTypes=Array.from(input.objectTypes4c,(v,i)=>integer(v,`objectTypes4c[${i}]`));
 const patches=new Map(),driverStatePatches=Array.from({length:4},()=>({}));
 const fields={0:'racerIndex',4:'avatar',0x58:'field58',0x5c:'role',0x60:'field60',0x64:'turnBudgetDegrees',0x74:'cityRouteFlag74',
  0x80:'trait80',0x84:'trait84',0x88:'trait88',0x8c:'recoveryPhase',0xa0:'dryFloorFrames',0xac:'offCircleBehindFrames',
  0xb0:'flagB0',0xb4:'flagB4',0xd8:'courseEscapeFrames',0xdc:'courseEscapeActive'};
 function write(slot,offset,value,kind='i32'){
  const bits=kind==='f32'?value===1?0x3f800000:value===24?0x41c00000:0x42000000:value>>>0;
  patches.set(slot*0x100+offset,{slot,offset,kind,value,bits,field:fields[offset]});
 }
 function next(){const r=stepNativeAIRandom(rngState);rngState=r.rngState;rngCalls++;return r.value;}
 for(let slot=0;slot<4;slot++){
  for(const [offset,value]of [[0,slot],[4,avatars[slot]],[0x74,1],[0x8c,0],[0xac,0],[0xb0,0],[0xb4,1],[0x58,0],[0xa0,0],[0xd8,0],[0xdc,0]])write(slot,offset,value);
  const patch=driverStatePatches[slot];
  Object.assign(patch,{racerIndex:slot,avatar:avatars[slot],courseEscapeFrames:0,courseEscapeActive:false,dryFloorFrames:0,
   motionState:{recoveryPhase:0,offCircleBehindFrames:0,flagB0:0,flagB4:1}});
  if(profiles[slot]>=0&&profiles[slot]<=3){
   const budget=profiles[slot]===3?24:32;write(slot,0x64,budget,'f32');patch.turnBudgetDegrees=budget;
  }
 }
 const inverseOrderPatches=order.map((index,value)=>({index,value}));
 // The source does not advance its context pointer in this loop. The four-slot
 // prefix above leaves it at slot3, so repeated writes affect ONLY that field.
 if(racerCount>0)write(3,0x60,1,'f32');
 for(let slot=0;slot<racerCount;slot++){roles[slot]=-1;write(slot,0x5c,-1);driverStatePatches[slot].role=-1;}
 let adjacentRoleWordPatch=null;const roleAssignments=[],adjacentReads=[];
 function roleAt(index){
  if(index<4)return roles[index];
  if(adjacent===undefined)throw new TypeError('Actual adjacentRoleWord required by native slot4 role scan');
  adjacentReads.push(adjacent);return adjacent;
 }
 for(let role=0;role<racerCount-1;role++){
  next();const draw=next(),candidate=(draw>>>8)&3;let index=candidate;
  const scanned=[index],seen=new Set();
  while(roleAt(index)!==-1||index===human){
   if(seen.has(index))throw new RangeError('Native role scan repeats without an eligible source word');seen.add(index);
   index=index%racerCount+1;scanned.push(index);
  }
  if(index<4){roles[index]=role;write(index,0x5c,role);driverStatePatches[index].role=role;}
  else{adjacent=role;adjacentRoleWordPatch={value:role,bits:role>>>0};}
  roleAssignments.push({role,candidate,selectedIndex:index,scanned});
 }
 // Optional native trait columns are reset for ALL four slots. Every column
 // consumes two draws; a zero selector consumes two more and sets one slot.
 for(let slot=0;slot<4;slot++)for(const offset of [0x80,0x84,0x88])write(slot,offset,0);
 const traitSelections=[];
 for(let trait=0;trait<3;trait++){
  next();const draw=next(),selector=(draw>>>8)&3;let slot=null;
  if(selector===0){next();slot=(next()>>>8)&3;write(slot,0x80+trait*4,1);}
  traitSelections.push({trait,selector,selectedSlot:slot});
 }
 const proximityObjectIndicesPrefix=[];
 for(let index=0;index<objectTypes.length;index++)if(objectTypes[index]===1)proximityObjectIndicesPrefix.push(index);
 const cameraBytePatches=[];
 for(let cameraIndex=0;cameraIndex<2;cameraIndex++){
  for(let vertex=0;vertex<3;vertex++)for(let channel=0;channel<4;channel++)cameraBytePatches.push({cameraIndex,
   relativeByteOffset:-0x30+vertex*0x10+0xc+channel,value:[255,0,0,255][channel]});
  for(let vertex=0;vertex<4;vertex++)for(const [offset,value]of [[2,0],[3,0],[12,255],[13,255],[14,255]])cameraBytePatches.push({cameraIndex,relativeByteOffset:vertex*0x10+offset,value});
 }
 cameraBytePatches.sort((a,b)=>a.cameraIndex-b.cameraIndex||a.relativeByteOffset-b.relativeByteOffset);
 return freeze({rngState,rngCalls,driverStatePatches,
  nativeWordPatches:[...patches.values()].sort((a,b)=>a.slot-b.slot||a.offset-b.offset),adjacentRoleWordPatch,
  inverseOrderPatches,proximityCount:proximityObjectIndicesPrefix.length,proximityObjectIndicesPrefix,cameraBytePatches,
  context:{bodySlot:3,aiSlot:3},diagnostic:{roleAssignments,traitSelections,adjacentRoleReads:adjacentReads.length},
  provenance:{scope:'bounded native AI setup patch; no whole scene or cold/reset state synthesis',
   retained:'unlisted words retain their actual previous bits; merge nested driver motion patches explicitly',
   order:'native26c0 order, separate from ranking3990/place293c; inverse entries not cleared',
   proximity:'qualifying type1 index prefix; source86ce0 scans firstCOUNT RAW objects, not these indices',
   camera:'byte patches relative to each selected camera-corner block; negative offsets address its three prefix vertices; no XZ/camera producer',
   random:'caller-owned shared unsigned32 LCG state; no boot seed inferred',
   adjacentRole:'index4 is an explicit scratch alias, not an additional racer'}});
}
