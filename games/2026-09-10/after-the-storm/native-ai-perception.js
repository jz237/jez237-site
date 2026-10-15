// Independently reconstructed numeric AI perception producers. All coordinates
// use NATIVE units. No presentation camera, authored frustum, clock, RNG, field
// update, object simulation or source camera-selection policy is supplied here.
// Water mesh XZ is procedural arithmetic, not original graphics/vertex assets.
const F=Math.fround,freeze=Object.freeze,INT_MIN=-2147483648,INT_MAX=2147483647;
const SHEAR=F(.5773502588272095),STRETCH=F(1.154700517654419);
const ROW_HEIGHT=F(F(F(Math.sqrt(3))*64)/2),SNAP_HEIGHT=F(.8660253882408142),AHEAD=F(.866);
const profiles=new Map();
function integer(value,name,min=INT_MIN,max=INT_MAX){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
 return value||0;
}
function scalar(value,name){
 if(!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError(`${name} must be finite native float32`);
 return F(value);
}
function arithmetic(value){
 const result=F(value);if(!Number.isFinite(result))throw new RangeError('Native perception arithmetic must remain finite');return result;
}
function truncWord(value){
 const result=Math.trunc(value);
 if(!Number.isFinite(value)||result<INT_MIN||result>INT_MAX)throw new RangeError('Native perception truncation exceeds the supported signed32 domain');
 return result||0;
}
const short=value=>(value<<16)>>16;
const nearestWord=value=>truncWord(arithmetic(value<0?value-.5:value+.5));
function pair(value,name,asShort=false){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError(`${name} must contain x/z`);
 return freeze(Object.fromEntries(['x','z'].map(k=>[k,asShort?integer(value[k],`${name}.${k}`,-32768,32767):scalar(value[k],`${name}.${k}`)])));
}
function circleRadius(value){
 // Source is an integer word (normally1500). Keep its low32 signed square,
 // rather than replacing the actual multiply/conversion with a double square.
 return integer(value,'selectionRadiusNative');
}
function profile(value){
 if(![10,12,16].includes(value))throw new RangeError('radius must be a source mesh radius10,12 or16');
 if(profiles.has(value))return profiles.get(value);
 const radius=value,vertices=[];
 for(let row=-radius;row<=radius;row++){
  const start=Math.max(-radius,row-radius),end=Math.min(radius,row+radius);
  const z=short(truncWord(arithmetic(ROW_HEIGHT*row)+(row<0?-.5:.5)));
  for(let column=start;column<=end;column++)vertices.push(freeze({x:short(column*64-row*32),z}));
 }
 const count=vertices.length,geometricCenter=(count-1)/2;
 // The radius16 layout selects406, two entries left of geometric center408.
 // Preserve that source table quirk while its outer references remain axial.
 const center=geometricCenter-(radius===16?2:0);
 const indices=[0,radius,geometricCenter+radius,count-1,count-1-radius,geometricCenter-radius];
 const result=freeze({radius,count,center:vertices[center],outerReferences:freeze(indices.map(i=>vertices[i]))});
 profiles.set(value,result);return result;
}

/** Exact circle tail from two ALREADY STORED signed16 opposite mesh vertices.
 * These are outer slots0/3, in that order. snapOffsetNative is the original
 * patch's snap offset, not an inferred request-to-center delta. The original
 * AI motion update reads patch0's circle, even when patch1 is also generated.
 */
export function nativeAISelectionCircleFromMesh({oppositeOuterVerticesNative,snapOffsetNative,selectionRadiusNative}={}){
 if(!Array.isArray(oppositeOuterVerticesNative)||oppositeOuterVerticesNative.length!==2)
  throw new TypeError('oppositeOuterVerticesNative must contain two stored signed16 vertices');
 const vertices=oppositeOuterVerticesNative.map((p,i)=>pair(p,`oppositeOuterVerticesNative[${i}]`,true));
 const offset=pair(snapOffsetNative,'snapOffsetNative'),radius=circleRadius(selectionRadiusNative);
 return freeze({x:arithmetic(arithmetic(arithmetic(vertices[0].x+vertices[1].x)*.5)-offset.x),
  z:arithmetic(arithmetic(arithmetic(vertices[0].z+vertices[1].z)*.5)-offset.z),
  radiusSquared:F(Math.imul(radius,radius))});
}

/** Pure water-mesh XZ/snap producer and its selection circle. The requested
 * center comes from the selected source camera's upstream water-patch plan;
 * it is NOT the final circle. Mesh radius comes from actual source scene/player
 * selection. horizontalForwardsNative retains camera RECORD order0/1, because
 * this producer selects camera0 for patch0 and camera1 for patch1 directly.
 * Supplied axes are consumed as float32, without normalization or defaults.
 *
 * Height samples, mesh normals and source water evolution cannot change these
 * XZ writes, so those unrelated fields are not fabricated. Signed16 overflow,
 * signed remainder, integer truncation and source float32 order are retained.
 */
export function prepareNativeAISelectionCircle({radius,selectionRadiusNative,patchIndex,
 requestedCenterNative,horizontalForwardsNative}={}){
 const mesh=profile(radius),selectionRadius=circleRadius(selectionRadiusNative);
 const slot=integer(patchIndex,'patchIndex',0,1),requested=pair(requestedCenterNative,'requestedCenterNative');
 if(!Array.isArray(horizontalForwardsNative)||horizontalForwardsNative.length<slot+1||horizontalForwardsNative.length>2)
  throw new TypeError('horizontalForwardsNative must contain the actual camera records through patchIndex');
 const forwards=horizontalForwardsNative.map((p,i)=>pair(p,`horizontalForwardsNative[${i}]`)),forward=forwards[slot];
 const u=truncWord(arithmetic(arithmetic(SHEAR*requested.z)+requested.x))%24576||0;
 const v=truncWord(arithmetic(STRETCH*requested.z))%24576||0;
 const cu=((u+32)|0)>>6,cv=((v+32)|0)>>6;
 const dx=arithmetic(arithmetic(F(cu*64)-arithmetic(F(cv*64)*.5))-arithmetic(F(u)-arithmetic(F(v)*.5)));
 const dz=arithmetic(arithmetic(SNAP_HEIGHT*F(cv*64))-arithmetic(SNAP_HEIGHT*F(v)));
 const offset=freeze({x:dx,z:dz}),center=freeze({x:truncWord(arithmetic(dx+requested.x)),z:truncWord(arithmetic(dz+requested.z))});
 const storedCenter={x:short(center.x+mesh.center.x),z:short(center.z+mesh.center.z)};
 const ratio=arithmetic(F(selectionRadius)/F(radius*64));
 const ahead=arithmetic(F((selectionRadius-radius*64)|0)*AHEAD);
 const shift={x:nearestWord(arithmetic(ahead*forward.x)),z:nearestWord(arithmetic(ahead*forward.z))};
 const outer=mesh.outerReferences.map(reference=>{
  const inner={x:short(center.x+reference.x),z:short(center.z+reference.z)};
  return freeze({x:short(short(storedCenter.x+truncWord(arithmetic(ratio*F(inner.x-storedCenter.x))))+shift.x),
   z:short(short(storedCenter.z+truncWord(arithmetic(ratio*F(inner.z-storedCenter.z))))+shift.z)});
 });
 return freeze({patchIndex:slot,snappedCenterNative:center,snapOffsetNative:offset,outerVerticesNative:freeze(outer),
  selectionCircleNative:nativeAISelectionCircleFromMesh({oppositeOuterVerticesNative:[outer[0],outer[3]],snapOffsetNative:offset,selectionRadiusNative:selectionRadius})});
}

/** Detached current generic-object position table in RAW runtime record order.
 * proximityCount is the previously produced setup count. The reader consumes
 * the first count records; it does NOT consume the initializer's qualifying
 * type1 index list. Do not filter, sort, replace with anchor positions or infer
 * a new count from current types. Actual moving-object simulation is upstream.
 */
export function nativeAIProximitySnapshot({proximityObjectCentersNative,proximityCount}={}){
 if(!Array.isArray(proximityObjectCentersNative)||proximityObjectCentersNative.length>64)
  throw new RangeError('proximityObjectCentersNative must contain at most64 raw-order records');
 const count=integer(proximityCount,'proximityCount',0,proximityObjectCentersNative.length);
 const centers=proximityObjectCentersNative.map((p,i)=>pair(p,`proximityObjectCentersNative[${i}]`));
 return freeze({proximityObjectCentersNative:freeze(centers),proximityCount:count});
}

/** Select the actual four signed16 XZ values read from the graphics double
 * buffer. renderBufferIndex is not a player/camera index. This is an explicit
 * retained-buffer snapshot, NOT a recovered camera projection producer. The
 * initializer writes corner Y/RGB while preserving these XZ values; their
 * upstream writer remains outside this bounded reconstruction.
 */
export function nativeAICameraCornerSnapshot({renderBufferIndex,cornerBuffersNative}={}){
 const slot=integer(renderBufferIndex,'renderBufferIndex',0,1);
 if(!Array.isArray(cornerBuffersNative)||cornerBuffersNative.length!==2)
  throw new TypeError('cornerBuffersNative must contain both retained graphics buffers');
 const buffers=cornerBuffersNative.map((buffer,j)=>{
  if(!Array.isArray(buffer)||buffer.length!==4)throw new TypeError(`cornerBuffersNative[${j}] must contain four corners`);
  return buffer.map((p,i)=>pair(p,`cornerBuffersNative[${j}][${i}]`,true));
 });
 return freeze(buffers[slot]);
}
