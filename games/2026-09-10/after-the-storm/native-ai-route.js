// Independently reconstructed numeric navigation graph and plane consumer.
// This is separate from the primary buoy judge and from AI aiming/steering.
// One active call represents one source50ms outer navigation sample. It does
// not move a hull, sweep crossings, award power, change laps, or finish a race.
const F=Math.fround,graphs=new WeakMap(),states=new WeakMap();
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
function integer(value,name,min,max){if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`Invalid ${name}`);return value;}
function finite(value,name){if(!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError(`${name} must be finite binary32`);return F(value);}
function worldPosition(value,scale,name){
 if(!value||typeof value!=='object')throw new TypeError(`Expected ${name} x/z`);
 return {x:finite(value.x/scale,`${name}.x`),z:finite(value.z/scale,`${name}.z`)};
}
function graphData(graph){const data=graphs.get(graph);if(!data)throw new TypeError('Expected a compiled native AI route');return data;}
function stateData(graph,state){
 const data=graphData(graph);
 if(states.get(state)!==graph)throw new TypeError('Route state belongs to another graph; restore a snapshot explicitly');
 return data;
}
function rawNode(row,index,courseIndex,scale){
 if(!Array.isArray(row)||row.length!==4)throw new TypeError('Expected four-short source rows');
 row.forEach((v,i)=>integer(v,`row${index} field${i}`,-32768,32767));
 const [x,z,type,heading]=row;integer(type,'nativeType',0,32);
 if(heading===-1)throw new RangeError('Remove source sentinel rows');
 const classification=[1,5,7,10,13,16,19,22].includes(type)?1:type===2?2:type===3?3:
  [8,11,14,17,20,23].includes(type)?4:type>=24?type-18:0;
 let routeGroup=[6,7,8,24,25,29,30,31,32].includes(type)?1:type>=9&&type<=23?Math.floor((type-9)/3)+2:0;
 if(type===26||type===27)routeGroup=courseIndex===0&&type===27?1:2;
 // The original4096-entry RAM sine table may instead be supplied as exact
 // tx/tz metadata. This declared fallback is not original table-bit identity.
 const phase=Math.trunc(F(F(heading/360)*4096))&4095,angle=phase*Math.PI*2/4096;
 let tx=F(Math.sin(angle)),tz=F(Math.cos(angle));
 if(phase%1024===0)[tx,tz]=[[0,1],[1,0],[0,-1],[-1,0]][phase/1024];
 return {sourceRow:index,x:x*scale,z:z*scale,tx,tz,classification,routeGroup};
}

/**
 * Compile copied native [x,z,type,heading] rows, or all sourceBuoyLayout.nodes.
 * Array order is the original raw row order. Existing human nextSourceRow,
 * enabled/suppressed flags do not define this graph and are never reused.
 * For avatar r0..3 the source retains groups0,2,r+3; other rows keep their
 * immediate raw neighbours. Avatar identity is distinct from racer ordinal.
 * Caller selects the primary/secondary/tertiary table and validates its source
 * loader count. Course-specific table selectors are not implemented here.
 */
export function createNativeAIRoute({rows,nodes,scale=.025,courseIndex=1,family='primary'}={}){
 if(!Number.isFinite(scale)||scale<=0||scale>1)throw new RangeError('Invalid world scale');
 integer(courseIndex,'courseIndex',0,9);
 if(!['primary','secondary','tertiary'].includes(family))throw new RangeError('Invalid source route family');
 if((rows===undefined)===(nodes===undefined))throw new TypeError('Supply rows or nodes');
 const supplied=rows??nodes;
 if(!Array.isArray(supplied)||supplied.length<1||supplied.length>64)throw new RangeError('Expected1..64 source nodes');
 const source=rows===undefined?nodes:rows.map((row,index)=>rawNode(row,index,courseIndex,scale));
 const compiled=source.map((node,index)=>{
  const p=worldPosition(node,scale,'node'),tx=finite(node.tx,'node.tx'),tz=finite(node.tz,'node.tz');
  if(Math.abs(tx*tx+tz*tz-1)>.002)throw new RangeError('Expected a unit node forward axis');
  return {sourceRow:integer(node.sourceRow??index,'sourceRow',0,65535),x:p.x,z:p.z,tx,tz,
   classification:integer(node.classification,'classification',0,14),routeGroup:integer(node.routeGroup??0,'routeGroup',0,6),
   next:Array(4).fill((index+1)%source.length),previous:Array(4).fill((index+source.length-1)%source.length)};
 });
 const byRow=new Map(compiled.map((node,index)=>[node.sourceRow,index]));
 if(byRow.size!==compiled.length)throw new RangeError('Duplicate sourceRow');
 for(let avatar=0;avatar<4;avatar++)for(let index=0;index<compiled.length;index++){
  const belongs=node=>node.routeGroup===0||node.routeGroup===2||node.routeGroup===avatar+3;
  if(!belongs(compiled[index]))continue;
  let next=(index+1)%compiled.length;
  while(!belongs(compiled[next]))next=(next+1)%compiled.length;
  compiled[index].next[avatar]=next;compiled[next].previous[avatar]=index;
 }
 const graph=freeze({scale,courseIndex,family,nodes:compiled.map(node=>({
  sourceRow:node.sourceRow,x:node.x*scale,z:node.z*scale,tx:node.tx,tz:node.tz,
  classification:node.classification,routeGroup:node.routeGroup,
  nextByAvatar:node.next.map(index=>compiled[index].sourceRow),previousByAvatar:node.previous.map(index=>compiled[index].sourceRow)
 })),provenance:{status:'reconstructed-native-ai-route-graph',branchIdentity:'selected-avatar',
  coordinates:rows===undefined?'explicit-node-axis-binary32':'4096-phase-trig-fallback',
  tableSelection:'caller-owned; course-specific selectors and loader-count guards required',
  window:'initial route window only; lookahead advancement and aim-point production are separate'}});
 graphs.set(graph,{nodes:compiled,byRow,scale});return graph;
}

/** Detached JSON-serializable state. Omit navigationSourceRow to start at the
 * last class3 node, matching ordinary setup's finish-index initialization.
 * A source mainState8 setup has a separate initializer; pass its real row.
 * To select another already-validated source table, explicitly create a state
 * for that graph from nativeAIRouteSnapshot(oldGraph,oldState).
 */
export function createNativeAIRouteState(graph,{avatar,navigationSourceRow}={}){
 const data=graphData(graph);integer(avatar,'avatar',0,3);
 const row=navigationSourceRow??[...data.nodes].reverse().find(node=>node.classification===3)?.sourceRow;
 integer(row,'navigationSourceRow',0,65535);
 if(!data.byRow.has(row))throw new RangeError('Unknown navigation source row');
 const state=freeze({avatar,navigationSourceRow:row});states.set(state,graph);return state;
}

/** Copy a complete current-center snapshot when source primary buoys move.
 * Entries are WORLD {sourceRow,x,z}, in any order; partial/duplicate/unknown
 * entries are rejected. Positions are copied before any decisions are made.
 */
function centers(data,nodePositions){
 if(nodePositions===undefined)return data.nodes.map(node=>({x:node.x,z:node.z}));
 if(!Array.isArray(nodePositions)||nodePositions.length!==data.nodes.length)throw new RangeError('Expected one current position per route node');
 const copied=Array(data.nodes.length),seen=new Set();
 for(const node of nodePositions){
  const row=integer(node?.sourceRow,'position sourceRow',0,65535),index=data.byRow.get(row);
  if(index===undefined||seen.has(row))throw new RangeError('Unknown or duplicate current-position source row');
  copied[index]=worldPosition(node,data.scale,'current node');seen.add(row);
 }
 return copied;
}
function windowFor(data,state,positions){
 const index=data.byRow.get(state.navigationSourceRow),node=data.nodes[index];
 const describe=i=>{const q=data.nodes[i],p=positions[i];return {sourceRow:q.sourceRow,classification:q.classification,
  x:p.x*data.scale,z:p.z*data.scale,tx:q.tx,tz:q.tz};};
 return {avatar:state.avatar,current:describe(index),target:describe(index),
  next:describe(node.next[state.avatar]),previous:describe(node.previous[state.avatar])};
}

/** The initial current/target/next/previous window prepared by the source.
 * `target` initially equals `current`; this does not run later aiming logic.
 */
export function nativeAIRouteWindow(graph,state,{nodePositions}={}){
 const data=stateData(graph,state);return freeze(windowFor(data,state,centers(data,nodePositions)));
}
export function nativeAIRouteSnapshot(graph,state){stateData(graph,state);return {avatar:state.avatar,navigationSourceRow:state.navigationSourceRow};}

// Preserve the source's Z-product then X-product binary32 evaluation order.
function plane(position,node,center){
 const dz=finite(position.z-center.z,'plane deltaZ'),dx=finite(position.x-center.x,'plane deltaX');
 const z=finite(dz*node.tz,'plane productZ'),x=finite(node.tx*dx,'plane productX');
 return finite(z+x,'plane dot');
}

/** One sampled index decision. Both tests use the OLD current window: positive
 * current-plane dot stores next(old); independently, negative dot at prev(old)
 * stores prev(prev(old)), overriding a preceding forward store. Exact zero
 * does not cross. No arming, finite span, region, Y, power or lap predicate.
 */
export function stepNativeAIRoute(graph,state,{position,nodePositions,active=true}={}){
 const data=stateData(graph,state);
 if(typeof active!=='boolean')throw new TypeError('active must be boolean');
 const copied=centers(data,nodePositions);
 if(!active)return freeze({state,window:windowFor(data,state,copied),diagnostic:{active:false,decision:'unchanged',sourceRowChanged:false}});
 const p=worldPosition(position,data.scale,'craft position'),index=data.byRow.get(state.navigationSourceRow),node=data.nodes[index];
 const previous=node.previous[state.avatar],previousNode=data.nodes[previous];
 const forwardDotNative=plane(p,node,copied[index]),previousDotNative=plane(p,previousNode,copied[previous]);
 const forward=forwardDotNative>0,backward=previousDotNative<0;
 const chosen=backward?previousNode.previous[state.avatar]:forward?node.next[state.avatar]:index;
 const next=chosen===index?state:createNativeAIRouteState(graph,{avatar:state.avatar,navigationSourceRow:data.nodes[chosen].sourceRow});
 return freeze({state:next,window:windowFor(data,next,copied),diagnostic:{active:true,
  decision:backward?'backward-plane':forward?'forward-plane':'unchanged',forward,backward,
  oldSourceRow:node.sourceRow,testedPreviousSourceRow:previousNode.sourceRow,
  forwardDotNative,previousDotNative,sourceRowChanged:chosen!==index}});
}
