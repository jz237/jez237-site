// Retained guest-order bytes for the three prefix vertices and four AI corner
// vertices in each graphics buffer. These are independent of the modern camera
// and output resolution. Relative offset0 is the first AI corner vertex.
const PREFIX=48,BYTES=112,freeze=Object.freeze;
function integer(v,name,min,max){
 if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);
 return v||0;
}
function copy(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Supply retained graphics corner state');
 const renderBufferIndex=integer(value.renderBufferIndex,'renderBufferIndex',0,1);
 if(!Array.isArray(value.buffers)||value.buffers.length!==2)throw new RangeError('Supply both graphics corner buffers');
 const buffers=Array.from(value.buffers,(buffer,index)=>{
  if(!Array.isArray(buffer)||buffer.length!==BYTES)throw new RangeError(`Graphics corner buffer${index} requires112 guest-order bytes`);
  return Array.from(buffer,v=>integer(v,'graphics corner byte',0,255));
 });
 return {renderBufferIndex,buffers};
}
function seal(state){state.buffers.forEach(freeze);freeze(state.buffers);return freeze(state);}
export function createNativeGraphicsCornerState(value){return seal(copy(value));}

/** The original BSS clear and explicit selector0 store, BEFORE the initial
 * 46D2C call. Use only at a declared cold boot, never for warm scene entry or
 * restoration of omitted data. Subsequent writes remain ordinary retained
 * state; this does not declare the coordinates permanently zero. */
export function createNativeGraphicsCornerBootState(){
 return seal({renderBufferIndex:0,buffers:Array.from({length:2},()=>Array(BYTES).fill(0))});
}

/** Consume explicit guest byte patches, including890B4's negative prefix
 * offsets. Validate the entire batch before exposing any changed state.
 * Repeated addresses retain source order; XZ writes are not prohibited. */
export function patchNativeGraphicsCornerState(value,patches){
 const state=copy(value);
 if(!Array.isArray(patches))throw new TypeError('Supply ordered graphics corner byte patches');
 const prepared=Array.from(patches,p=>{
  if(!p||typeof p!=='object'||Array.isArray(p))throw new TypeError('Invalid graphics corner byte patch');
  return {buffer:integer(p.cameraIndex,'graphics buffer index',0,1),
   at:PREFIX+integer(p.relativeByteOffset,'graphics corner relative byte offset',-PREFIX,BYTES-PREFIX-1),
   value:integer(p.value,'graphics corner byte',0,255)};
 });
 for(const p of prepared)state.buffers[p.buffer][p.at]=p.value;
 return seal(state);
}

/**46D2C: one startup call, then one per original outer main-loop iteration,
 * before scene/AI dispatch. It also runs when that dispatch skips physics.
 * The host must call this explicitly; browser renders and hull ticks are not
 * substitutes for the original outer-loop schedule. */
export function advanceNativeGraphicsCornerState(value){
 const state=copy(value);state.renderBufferIndex^=1;return seal(state);
}

export function nativeGraphicsCornerView(value){
 const state=copy(value),short=(buffer,at)=>((buffer[at]<<8|buffer[at+1])<<16)>>16;
 const cornerBuffersNative=state.buffers.map(buffer=>freeze(Array.from({length:4},(_,i)=>
  freeze({x:short(buffer,PREFIX+i*16),z:short(buffer,PREFIX+i*16+4)}))));
 freeze(cornerBuffersNative);
 return freeze({renderBufferIndex:state.renderBufferIndex,cornerBuffersNative,
  cameraCornersNative:cornerBuffersNative[state.renderBufferIndex]});
}
