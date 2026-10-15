// Numeric76378 pre-judge context. The caller owns one canonical race record;
// this returns only actual writes to that record plus the shared scratch XYZ.
// No HUD/progress percentage, alternate route, startup or generic nearest
// search is substituted for the source's previous/current/next comparison.
import {nativePrimaryGateScratchPosition} from './native-primary-gate-judge.js';

const F=Math.fround,layouts=new WeakSet();
function record(v,name){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${name}`);return v;}
function integer(v,name,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v||0;}
function scalar(v,name){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(`${name} must fit finite float32`);return F(v);}
function point(v,name){record(v,name);return {x:scalar(v.x,`${name}.x`),z:scalar(v.z,`${name}.z`)};}
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const sub=(a,b)=>scalar(a-b,'difference'),mul=(a,b)=>scalar(a*b,'product'),add=(a,b)=>scalar(a+b,'sum');
function rectangle(v,name){if(!Array.isArray(v)||v.length!==4)throw new TypeError(`Expected four ${name} bounds`);return v.map(x=>scalar(x,name));}
const contains=(r,p)=>r[0]<=p.x&&p.x<=r[1]&&r[2]<=p.z&&p.z<=r[3];
function containing(rows,p){let first=-1,last=-1;for(let i=0;i<rows.length;i++)if(contains(rows[i],p)){if(first<0)first=i;else last=i;}return [first,last];}
function distanceSquared(a,b){const x=sub(a.x,b.x),z=sub(a.z,b.z);return add(mul(x,x),mul(z,z));}

/** Inject actual source tables, in source order; no course default is chosen.
 * Nodes use primary A0/A8 links and complete raw array order. Weed tables have
 * exactly six centers; the source difficulty branch selects their first3/6.
 * Port/City rectangles are inclusive ordinary bounds, not coarse sentinels.
 * Source regions have their sentinel removed. The64-region API bound is an
 * explicit bounded input policy, matching the other primary numeric leaves.
 */
export function createNativePrimaryScratchLayout(input){
 record(input,'scratch layout');const {nodes}=input;
 if(!Array.isArray(nodes)||nodes.length<1||nodes.length>64)throw new RangeError('Expected1..64 complete primary nodes');
 const copied=nodes.map((n,i)=>{
  record(n,'primary node');if(integer(n.sourceRow,'sourceRow',0,63)!==i)throw new RangeError('Use complete raw primary array order');
  return {sourceRow:i,centerNativeXZ:point(n.centerNativeXZ,'node center'),
   nextSourceRowA0:integer(n.nextSourceRowA0,'nextSourceRowA0',0,nodes.length-1),
   previousSourceRowA8:integer(n.previousSourceRowA8,'previousSourceRowA8',0,nodes.length-1)};
 });
 if(!Array.isArray(input.regionsNative)||input.regionsNative.length>64)throw new RangeError('Expected bounded source coarse regions');
 const regions=input.regionsNative.map(r=>{const row=rectangle(r,'coarse region');if(row[0]>=row[1]||row[2]>row[3])throw new RangeError('Remove coarse sentinel/reversed rows');return row;});
 if(!Array.isArray(input.weedCentersNativeXZ)||input.weedCentersNativeXZ.length!==6)throw new RangeError('Expected the six selected source weed centers');
 const result=freeze({nodes:copied,regionsNative:regions,weedCentersNativeXZ:input.weedCentersNativeXZ.map(p=>point(p,'weed center')),
  weedRadiusSquaredNative:scalar(input.weedRadiusSquaredNative,'weed radius squared'),
  portRegionNative:rectangle(input.portRegionNative,'Port region'),cityRegionNative:rectangle(input.cityRegionNative,'City region')});
 layouts.add(result);return result;
}
function centers(layout,supplied){
 if(supplied===undefined)return layout.nodes.map(n=>n.centerNativeXZ);
 if(!Array.isArray(supplied)||supplied.length!==layout.nodes.length)throw new RangeError('Expected complete current primary centers');
 const result=Array(supplied.length),seen=new Set();
 for(const p of supplied){const i=integer(p?.sourceRow,'current sourceRow',0,result.length-1);if(seen.has(i))throw new RangeError('Duplicate current primary center');seen.add(i);result[i]=point(p,'current node center');}
 return result;
}

/** Run once for the selected racer immediately BEFORE7687c, in the caller's
 * source racer order. recordView is the canonical record, not a second owner:
 * postJudgeSourceRow2c48 is read only in main638==1; region2c54 is read only
 * for courses5/6. No2940,2944 or AI2948 cursor is substituted for2c48.
 *
 * Body/alternate inputs are the actual native stores consumed by the shared
 * scratch selector. Supplied live centers must cover the complete layout.
 * Source4 writes weed2c50 regardless of main state;5/6 write region2c54 and
 * return ordered audio entry recipes only on a selected human's transition.
 * No audio queue/RNG or other persistent global is advanced here.
 */
export function prepareNativePrimaryScratchContext(layout,recordView,input){
 if(!layouts.has(layout))throw new TypeError('Expected compiled primary scratch layout');record(recordView,'canonical record');record(input,'scratch context sample');
 const racer=integer(input.racerIndex,'racerIndex',0,3),main=integer(input.state638,'state638'),players=integer(input.players,'players',1,2);
 const primary=integer(input.primaryHumanIndex,'primaryHumanIndex',0,3),secondary=integer(input.secondaryHumanIndex,'secondaryHumanIndex',0,3);
 const course=integer(input.courseIndex,'courseIndex',0,9),human=racer===primary||players===2&&racer===secondary;
 const p=nativePrimaryGateScratchPosition(input),writes={},effects=[],diagnostic={human,nearest:null,weedHitIndex:null,regionTransition:null};
 if(main===1){
  const row=integer(recordView.postJudgeSourceRow2c48,'postJudgeSourceRow2c48',0,layout.nodes.length-1),node=layout.nodes[row],positions=centers(layout,input.nodePositionsNative);
  const previous=node.previousSourceRowA8,next=node.nextSourceRowA0;
  const distances={current:distanceSquared(positions[row],p),previous:distanceSquared(positions[previous],p),next:distanceSquared(positions[next],p)};
  // Strict replacements preserve source tie priority: current, previous, next.
  let candidate=row,best=distances.current;if(distances.previous<best){candidate=previous;best=distances.previous;}
  if(distances.next<best)candidate=next;
  const craft=containing(layout.regionsNative,p);let candidateRegions=null,shared=null;
  if(candidate!==row){candidateRegions=containing(layout.regionsNative,positions[candidate]);shared=craft.some(i=>i>=0&&candidateRegions.includes(i));
   if(shared)writes.postJudgeSourceRow2c48=candidate;
  }
  diagnostic.nearest={sourceRow:row,previousSourceRowA8:previous,nextSourceRowA0:next,candidateSourceRow:candidate,
   distancesSquaredNative:distances,craftRegionIds:craft,candidateRegionIds:candidateRegions,regionShared:shared};
 }
 if(course===4){
  const count=integer(input.difficulty,'difficulty')<2?3:6;writes.weed2c50=0;
  if(p.y<=40)for(let i=0;i<count;i++)if(distanceSquared(p,layout.weedCentersNativeXZ[i])<=layout.weedRadiusSquaredNative){writes.weed2c50=1;diagnostic.weedHitIndex=i;break;}
 }
 if(course===5||course===6){
  const before=integer(recordView.region2c54,'region2c54'),inside=Number(contains(course===5?layout.portRegionNative:layout.cityRegionNative,p));
  writes.region2c54=inside;diagnostic.regionTransition={before,after:inside};
  if(human&&before!==inside)effects.push(inside?{kind:'courseRegionEnterCue',arguments:[]}:
   {kind:'courseRegionExitCue',arguments:[racer===primary?0:1]});
 }
 return freeze({positionNative:{...p},recordWrites:writes,effects,diagnostic});
}
