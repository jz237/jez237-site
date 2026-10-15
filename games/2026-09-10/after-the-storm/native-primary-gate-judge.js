// Independently reconstructed numeric primary-gate geometry. Timing, legal
// laps, awards, event2960 reset, graph advancement and finish handling belong
// to their separate consumers. Call once at the actual judging boundary;
// this is remembered source side classification, not a swept line crossing.
const F=Math.fround;
function record(v,name){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${name}`);return v;}
function integer(v,name,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v||0;}
function scalar(v,name){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(`${name} must fit finite float32`);return F(v);}
function point(v,name){record(v,name);return {x:scalar(v.x,`${name}.x`),z:scalar(v.z,`${name}.z`)};}
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const add=(a,b)=>scalar(a+b,'sum'),sub=(a,b)=>scalar(a-b,'difference'),mul=(a,b)=>scalar(a*b,'product'),div=(a,b)=>scalar(a/b,'quotient');
function normalized(x,z){
 const length=scalar(Math.sqrt(add(mul(x,x),mul(z,z))),'length');
 return {unit:length>0?{x:div(x,length),z:div(z,length)}:{x,z},length};
}
function regionRows(rows){
 if(!Array.isArray(rows)||rows.length>64)throw new RangeError('Expected at most64 coarse regions with the sentinel removed');
 return rows.map(row=>{
  if(!Array.isArray(row)||row.length!==4)throw new TypeError('Expected four native region bounds');
  const r=row.map(v=>scalar(v,'region bound'));
  if(r[0]>=r[1]||r[2]>r[3])throw new RangeError('Remove sentinel or reversed region rows');return r;
 });
}
function containing(rows,p){
 let first=-1,last=-1;
 for(let i=0;i<rows.length;i++){
  const r=rows[i];if(r[0]<=p.x&&p.x<=r[1]&&r[2]<=p.z&&p.z<=r[3]){if(first<0)first=i;else last=i;}
 }
 return [first,last];
}

/** These are retained signed source words, not booleans or a guessed reset.
 * Natural side states are-1/0/1, but an injected other signed value must retain
 * the source's actual comparisons. This does not initialize a race record. */
export function createNativePrimaryGateState(state){
 record(state,'retained gate state');
 return freeze({side2954:integer(state.side2954,'side2954'),armed2958:integer(state.armed2958,'armed2958')});
}

/** The bounded76378 scratch-position producer. The caller selects the actual
 * racer record: bodyPositionNative is body+44/+48/+4c; the alternate XZ comes
 * from its separate24-byte record. main state2 copies that XZ and writes Y=0.
 * All other states copy the three body floats. Unused inputs are not read.
 * These are NATIVE coordinates; this function performs no world conversion,
 * center approximation or main-state admission decision. */
export function nativePrimaryGateScratchPosition(input){
 record(input,'scratch position input');
 if(integer(input.state638,'state638')===2){
  const p=point(input.alternatePositionNativeXZ,'alternate position');return freeze({x:p.x,y:0,z:p.z});
 }
 const p=record(input.bodyPositionNative,'body position');
 return freeze({x:scalar(p.x,'body position.x'),y:scalar(p.y,'body position.y'),z:scalar(p.z,'body position.z')});
}

/** One prepared primary geometry sample, after the timing prefix and before
 * any event eligibility. positionNativeXZ is the actual scratch3780/3788.
 * selectedNode contains the CURRENT physical center, source axes, signed
 * classification98/checkpointFlag9c/enabledC8 and primary nextSourceRowA0.
 * Only checkpointFlag9c EXACTLY1 reads endpoint A/B, directionFlag1f90 and
 * checkpointSlackNative39c4; its forward-direction branch also reads width8c.
 * Endpoints are supplied actual stores, never recomputed from moving centers.
 *
 * Return selectedNode is a detached bounded numeric snapshot for the event
 * owner. Source routeGroupC0 and AI avatar links are unrelated to this kernel.
 * Coarse regions are inclusive and preserve source first/LAST matching IDs.
 * The64-row limit is a bounded API policy shared with the other primary leaf.
 *
 * Non-checkpoint class8/9's source lateral calculation has no observable
 * gate/side write: all comparison paths rejoin. It is intentionally not made
 * into an aperture predicate. checkpointLimitPassed is null when not read.
 * Float32 arithmetic is explicit; unsupported nonfinite intermediates reject
 * without mutation rather than guessing source FCSR exception behavior.
 */
export function prepareNativePrimaryGateJudge(state,input){
 const next={...createNativePrimaryGateState(state)};record(input,'prepared gate input');
 const n=record(input.selectedNode,'selected node'),p=point(input.positionNativeXZ,'scratch position');
 const selected={sourceRow:integer(n.sourceRow,'sourceRow',0,63),centerNativeXZ:point(n.centerNativeXZ,'current center'),
  forwardXZ:point(n.forwardXZ,'forward axis'),rightXZ:point(n.rightXZ,'right axis'),
  classification98:integer(n.classification98,'classification98'),checkpointFlag9c:integer(n.checkpointFlag9c,'checkpointFlag9c'),
  enabledC8:integer(n.enabledC8,'enabledC8'),nextSourceRowA0:integer(n.nextSourceRowA0,'nextSourceRowA0',0,63)};
 const rows=regionRows(input.regionsNative);
 // Source performs *50 then*.5 with separate single-precision stores.
 const anchor={x:sub(selected.centerNativeXZ.x,mul(mul(selected.rightXZ.x,50),F(.5))),
  z:sub(selected.centerNativeXZ.z,mul(mul(selected.rightXZ.z,50),F(.5)))};
 let limit=null,cpq=null,cplen=null,cpunit=null;
 if(selected.checkpointFlag9c===1){
  const a=point(n.endpointANativeXZ,'endpoint A'),b=point(n.endpointBNativeXZ,'endpoint B');
  selected.endpointANativeXZ=a;selected.endpointBNativeXZ=b;
  const direction=integer(input.directionFlag1f90,'directionFlag1f90'),slack=scalar(input.checkpointSlackNative39c4,'checkpoint slack');
  const segment=normalized(sub(a.x,b.x),sub(a.z,b.z));cpunit=segment.unit;cplen=segment.length;
  cpq=add(mul(sub(p.x,b.x),cpunit.x),mul(sub(p.z,b.z),cpunit.z));
  if(direction===0){
   selected.halfWidthNative8c=scalar(n.halfWidthNative8c,'checkpoint half width');
   limit=cpq<=add(mul(selected.halfWidthNative8c,F(2)),slack);
  }else{
   if(n.halfWidthNative8c!==undefined)selected.halfWidthNative8c=scalar(n.halfWidthNative8c,'checkpoint half width');
   limit=scalar(-slack,'negative slack')<=cpq;
  }
 }
 const relative=normalized(sub(p.x,anchor.x),sub(p.z,anchor.z)),unit=relative.unit,f=selected.forwardXZ;
 const forwardDot=add(mul(f.x,unit.x),mul(f.z,unit.z));let cross=null;
 if(next.side2954===-1&&forwardDot>0){
  cross=sub(mul(f.z,unit.x),mul(f.x,unit.z));next.side2954=cross>=0?1:0;
 }else if(forwardDot<=0)next.side2954=-1;
 if(next.armed2958===0&&next.side2954===-1)next.armed2958=1;
 const craft=containing(rows,p),node=containing(rows,selected.centerNativeXZ);
 return freeze({state:next,selectedNode:selected,checkpointLimitPassed:limit,
  regionShared:craft.some(i=>i>=0&&node.includes(i)),craftRegionIds:craft,nodeRegionIds:node,
  diagnostic:{anchorNativeXZ:anchor,relativeUnitXZ:unit,relativeLengthNative:relative.length,sideForwardDot:forwardDot,
   sideCrossOrNull:cross,checkpointProjectionNative:cpq,checkpointLengthNative:cplen,checkpointUnitXZ:cpunit}});
}
