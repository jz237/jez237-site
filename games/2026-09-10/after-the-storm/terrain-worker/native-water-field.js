// Independent numeric reconstruction of the native triangular water field.
// No mesh, waveform lookup table, animation, executable or original asset is
// included. ALL coordinates/heights in this module are NATIVE units; an adapter
// may explicitly choose .025 metres/native unit. Heights/velocities use signed
// 16-bit Q8.8 storage, including source arithmetic shifts and storage wrapping.
//
// Only selected camera-local hex patches evolve. Call forceNativeWaterLine
// AFTER a frame's five hull ticks, then stepNativeWaterPatch for each supplied
// camera patch, in explicit order. Native two-player scheduling visits P2 then
// P1, so overlapping cells evolve twice. There is no automatic dt, 100Hz ocean
// update, inferred camera, random seed, initial phase or amplitude clamp here.
// The caller owns camera centers, field variant, phase and random15 provider.
//
// Amplitude20 is a forcing/noise INPUT, not an all-time height bound. Source
// wakes/contact disturbances and special scene scheduling are not implemented.
// Math.sin regenerates forcing samples unless the caller supplies sineLookup;
// bit-identical original lookup-table values are not claimed by that default.

export const NATIVE_WATER_GRID=Object.freeze({columns:128,rows:384,spacingNative:64,fixedScale:256});
const COLS=128,ROWS=384,SIZE=COLS*ROWS,F=Math.fround;
const SHEAR=F(1/Math.sqrt(3)),STRETCH=F(2/Math.sqrt(3)),VERTICAL=F(Math.sqrt(3)/2);
const topologyCache=new Map(),patches=new WeakSet();
const signed16=value=>(value<<16)>>16;
const mod=(value,divisor)=>((value%divisor)+divisor)%divisor;
const integer=(value,name,min,max)=>{
  if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  return value;
};
const finite=(value,name)=>{if(!Number.isFinite(value))throw new TypeError(`${name} must be finite`);return value;};
function coordinate(value,name){
  finite(value,name);
  // Keeps all transformed source truncations within signed32 arithmetic.
  if(Math.abs(value)>1e9)throw new RangeError(`${name} exceeds the supported source coordinate range`);
  return F(value);
}
function radiusValue(radius){
  integer(radius,'radius',2,16);
  if(radius%2)throw new RangeError('radius must be even; the source tail update requires an odd final-row vertex count');
  return radius;
}
function fieldData(field){
  if(!(field?.heightQ instanceof Int16Array)||field.heightQ.length!==SIZE||
     !(field.velocityQ instanceof Int16Array)||field.velocityQ.length!==SIZE)throw new TypeError('Expected a native water field');
  return field;
}

/** Source initialization selectors; variant is the explicit numeric selector. */
export function nativeWaterFieldParameters({variant=0,players=1}={}){
  integer(variant,'variant',0,255);integer(players,'players',1,2);
  return Object.freeze(variant===1?{radius:16,restoringShift:10,couplingShift:4,dampingShift:5}:
    {radius:variant===2||players===2?10:12,restoringShift:9,couplingShift:5,dampingShift:6});
}

/** Flat storage/phase0 are reset choices, not a replay of the game's RNG/history. */
export function createNativeWaterField({variant=0,players=1,datumNative=0,phaseCounter=0}={}){
  integer(datumNative,'datumNative',-32768,32767);integer(phaseCounter,'phaseCounter',0,65535);
  return {parameters:nativeWaterFieldParameters({variant,players}),datumNative,phaseCounter,
    heightQ:new Int16Array(SIZE),velocityQ:new Int16Array(SIZE),patchUpdates:0,forcingCalls:0};
}

/** Toroidal shear mapping; a column wrap carries128 rows, not zero rows. */
export function nativeWaterVertexIndex(u,v){
  integer(u,'u',-0x1000000,0x1000000);integer(v,'v',-0x1000000,0x1000000);
  return mod(v+(u&~127),ROWS)*COLS+(u&127);
}

/** Source float transforms truncate BEFORE floor-cell selection, also for XZ<0. */
export function locateNativeWaterCell(xNative,zNative){
  const x=coordinate(xNative,'xNative'),z=coordinate(zNative,'zNative');
  const integerU=Math.trunc(F(F(z*SHEAR)+x))%24576,integerV=Math.trunc(F(z*STRETCH))%24576;
  const cellU=integerU>>6,cellV=integerV>>6;
  const offsetU=cellU*64-integerU,offsetV=cellV*64-integerV;
  const base=nativeWaterVertexIndex(cellU,cellV),alongU=nativeWaterVertexIndex(cellU+1,cellV);
  const alongV=nativeWaterVertexIndex(cellU,cellV+1),diagonal=nativeWaterVertexIndex(cellU+1,cellV+1);
  const upperTriangle=offsetV<offsetU;
  return {integerU:integerU||0,integerV:integerV||0,cellU,cellV,offsetU:offsetU||0,offsetV:offsetV||0,
    upperTriangle,indices:upperTriangle?[base,alongV,diagonal]:[base,alongU,diagonal]};
}

function topology(radius){
  radiusValue(radius);
  if(topologyCache.has(radius))return topologyCache.get(radius);
  const coordinates=[],lookup=new Map(),links=[];
  for(let v=-radius;v<=radius;v++)for(let u=Math.max(-radius,v-radius);u<=Math.min(radius,v+radius);u++){
    lookup.set(`${u},${v}`,coordinates.length);coordinates.push(Object.freeze({u,v}));
  }
  for(let i=0;i<coordinates.length;i++){
    const {u,v}=coordinates[i];
    for(const [du,dv]of [[1,0],[0,1],[1,1]]){
      const j=lookup.get(`${u+du},${v+dv}`);if(j===undefined)continue;
      // A negative arithmetic right shift rounds down. Reversing a quantized
      // difference changes a one-quantum residue, so source edge orientation
      // must survive the independent graph formulation. The final row's two-
      // edge tail alternates direction; earlier horizontal rows point left.
      const reverse=dv===0&&!(v===radius&&u%2===0);
      links.push(Object.freeze(reverse?[j,i]:[i,j]));
    }
  }
  const result=Object.freeze({coordinates:Object.freeze(coordinates),links:Object.freeze(links)});
  topologyCache.set(radius,result);return result;
}

/**
 * Build a camera-selected patch from explicit native XZ. This reproduces source
 * nearest lattice rounding and toroidal pointer mapping; it does not choose the
 * source camera's ahead-distance or viewpoint. indices are immutable and may be
 * reused while a camera stays within the same selected lattice cell.
 */
export function createNativeWaterPatch(field,{xNative=0,zNative=0,radius=field?.parameters?.radius}={}){
  fieldData(field);const shape=topology(radius),location=locateNativeWaterCell(xNative,zNative);
  const centerU=(location.integerU+32)>>6,centerV=(location.integerV+32)>>6;
  const offsetX=F(F(centerU*64-F(centerV*64*.5))-F(location.integerU-F(location.integerV*.5)));
  const offsetZ=F(F(VERTICAL*F(centerV*64))-F(VERTICAL*location.integerV));
  const patch=Object.freeze({radius,centerU,centerV,
    snappedCenterNative:Object.freeze({x:Math.trunc(F(coordinate(xNative,'xNative')+offsetX))||0,
      z:Math.trunc(F(coordinate(zNative,'zNative')+offsetZ))||0}),
    indices:Object.freeze(shape.coordinates.map(({u,v})=>nativeWaterVertexIndex(centerU+u,centerV+v))),
    edgeCount:shape.links.length});
  patches.add(patch);return patch;
}

/**
 * One patch kernel call, not a time interval. Pair accelerations read old heights
 * before integration; modulo16 addition lets this graph formulation match the
 * original interleaved traversal. Every incident edge is processed before its
 * point integrates. Cells outside the finite patch receive no update at all.
 */
export function stepNativeWaterPatch(field,patch){
  fieldData(field);
  if(!patches.has(patch))throw new TypeError('Expected a patch from createNativeWaterPatch');
  const p=field.parameters;
  for(const name of ['restoringShift','couplingShift','dampingShift'])integer(p?.[name],name,0,31);
  const {heightQ:h,velocityQ:v}=field;
  for(const [a,b]of topology(patch.radius).links){
    const i=patch.indices[a],j=patch.indices[b];
    const difference=(h[j]-h[i])>>p.couplingShift,restoring=(h[i]+h[j])>>p.restoringShift;
    v[i]=v[i]+difference-restoring;v[j]=v[j]-difference-restoring;
  }
  for(const i of patch.indices){h[i]=h[i]+v[i];v[i]=v[i]-(v[i]>>p.dampingShift);}
  field.patchUpdates++;return field;
}

/**
 * Source scalar query, raw cell parameters for nativeWaveCellImpulse, and a
 * separate grid-render interpolation. sourcePlaneQueryNative is the original
 * normalized expression, NOT a generically interchangeable surface height.
 * Integer point sampling discards the low8 fixed-height bits with signed >>8.
 * renderHeightNative interpolates those three rendered grid vertex heights;
 * it is deliberately named separately from the physics query.
 */
export function queryNativeWaterField(field,xNative,zNative,{datumNative=field?.datumNative}={}){
  fieldData(field);integer(datumNative,'datumNative',-32768,32767);
  const location=locateNativeWaterCell(xNative,zNative),samples=location.indices.map(i=>field.heightQ[i]>>8);
  const [h00,h1,h2]=samples;
  const slopeU=location.upperTriangle?h1-h2:h00-h1,slopeV=location.upperTriangle?h00-h1:h1-h2;
  const numerator=slopeU*location.offsetU+(datumNative+h00)*4096+slopeV*location.offsetV;
  const denominator=F(Math.sqrt(F((slopeU*slopeU+slopeV*slopeV+4096)*4096)));
  const u=-location.offsetU/64,v=-location.offsetV/64;
  const renderVertexHeightsNative=samples.map(h=>signed16(datumNative+h)),[a,b,c]=renderVertexHeightsNative;
  const renderHeightNative=location.upperTriangle?(1-v)*a+(v-u)*b+u*c:(1-u)*a+(u-v)*b+v*c;
  return {...location,samplesNative:samples,sourcePlaneQueryNative:F(F(numerator)/denominator),renderHeightNative,renderVertexHeightsNative,
    cell:{h00,slopeU,slopeV,offsetU:location.offsetU,offsetV:location.offsetV,referenceHeight:datumNative}};
}

/**
 * Two source noise passes. random15 must explicitly supply integers0..32767.
 * Each pass seeds six terms, then refreshes only term5 per vertex; the other
 * five persist for that pass. Traversal is column→row, then row→column. Global
 * source PRNG consumption/seed outside this initializer remains caller-owned.
 * Failure leaves the field arrays intact; the external random stream advances.
 */
export function seedNativeWaterNoise(field,{amplitudeNative=20,random15}={}){
  fieldData(field);integer(amplitudeNative,'amplitudeNative',0,127);
  if(typeof random15!=='function')throw new TypeError('An explicit random15 provider is required');
  const heights=new Int16Array(SIZE);let calls=0;
  const random=()=>{calls++;return integer(random15(),'random15 result',0,32767);};
  const sample=terms=>{
    terms[5]=random();const sum=terms.reduce((a,b)=>a+b,0);
    const value=F(F(amplitudeNative)*F(F(F(F(sum)/6)/F(16383.5))-1));
    return Math.trunc(F(value+(value<0?-.5:.5)))<<8;
  };
  for(let pass=0;pass<2;pass++){
    const terms=Array(6);for(let j=5;j>=0;j--)terms[j]=random();
    for(let outer=0;outer<(pass?ROWS:COLS);outer++)for(let inner=0;inner<(pass?COLS:ROWS);inner++){
      const i=pass?outer*COLS+inner:inner*COLS+outer;
      heights[i]=(pass?heights[i]:0)+sample(terms);
    }
  }
  field.heightQ.set(heights);field.velocityQ.fill(0);
  return {amplitudeNative,randomCalls:calls};
}

/**
 * Source sine-line forcing. phaseCounter advances by explicit0/1 and subtracts
 * period ONCE when at/above it. Each sample overwrites a triangle's three heights
 * with trunc(sine*amplitude)<<8 and resets their velocities. The diagonal line
 * steps(+64,+64) through the supplied ahead-center, with span=radius*16. Native
 * two-player callers may force a second line with advance:0 for the same phase.
 * No field update, camera choice or wake impulse is performed by this helper.
 */
export function forceNativeWaterLine(field,{xNative,zNative,radius=field?.parameters?.radius,
  amplitudeNative=20,period=20,advance=1,sineLookup=index=>F(Math.sin(index*Math.PI*2/4096))}={}){
  fieldData(field);radiusValue(radius);coordinate(xNative,'xNative');coordinate(zNative,'zNative');
  integer(amplitudeNative,'amplitudeNative',0,127);integer(period,'period',1,65535);integer(advance,'advance',0,1);
  integer(field.phaseCounter,'phaseCounter',0,65535);
  if(typeof sineLookup!=='function')throw new TypeError('sineLookup must be a function');
  let phase=field.phaseCounter+advance;if(phase>=period)phase-=period;
  const sineIndex=Math.trunc((phase<<12)/period)&4095,sine=F(finite(sineLookup(sineIndex),'sine sample'));
  if(Math.abs(sine)>1)throw new RangeError('sine sample must be from -1 to 1');
  const heightNative=Math.trunc(F(sine*amplitudeNative))||0,heightQ=signed16(heightNative<<8),written=new Set();
  const span=(radius*64)>>2,end=F(F(xNative)+span);let x=F(F(xNative)-span),z=F(F(zNative)-span),lineSamples=0;
  while(x<=end){
    for(const i of locateNativeWaterCell(x,z).indices)written.add(i);
    x=F(x+64);z=F(z+64);lineSamples++;
  }
  for(const i of written){field.heightQ[i]=heightQ;field.velocityQ[i]=0;}
  field.phaseCounter=phase;field.forcingCalls++;
  return {phaseCounter:phase,sineIndex,heightNative,heightQ,lineSamples,writtenIndices:[...written]};
}
