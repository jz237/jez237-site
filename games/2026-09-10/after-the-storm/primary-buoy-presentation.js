// Bounded display-only values. Native recoil velocities, anchors, contact
// accumulators and motion clocks are deliberately outside a replay frame.
const copy=p=>({x:p.x,y:p.y,z:p.z});
function point(p){if(!p||!['x','y','z'].every(k=>Number.isFinite(p[k])))throw new TypeError('Buoy presentation requires finite XYZ');return copy(p);}
export function capturePrimaryBuoyPresentation(snapshot){
 if(snapshot===null||snapshot===undefined)return null;
 if(!Array.isArray(snapshot)||snapshot.length>64)throw new RangeError('Expected at most64 primary buoy display nodes');
 const rows=new Set();
 return snapshot.map(q=>{
  if(!q||!Number.isInteger(q.sourceRow)||q.sourceRow<0||q.sourceRow>65535||rows.has(q.sourceRow))throw new RangeError('Invalid primary display source row');
  if(!Number.isInteger(q.classification)||q.classification<0||q.classification>14||typeof q.fixed!=='boolean'||typeof q.renderEnabled!=='boolean')
   throw new TypeError('Invalid primary display classification/flags');
  if(!Array.isArray(q.endpoints)||q.endpoints.length!==2)throw new TypeError('Expected two fixed display endpoints');
  rows.add(q.sourceRow);return {sourceRow:q.sourceRow,classification:q.classification,fixed:q.fixed,renderEnabled:q.renderEnabled,
   position:point(q.position),endpoints:q.endpoints.map(point)};
 });
}
export function samplePrimaryBuoyPresentation(a,b,t){
 if(!Number.isFinite(t)||t<0||t>1)throw new RangeError('Buoy display interpolation must be from0 to1');
 const first=capturePrimaryBuoyPresentation(a),last=capturePrimaryBuoyPresentation(b);
 if(!first||!last)return t<1?first:last;
 if(first.length!==last.length)throw new Error('Buoy replay identity changed');
 const byRow=new Map(last.map(q=>[q.sourceRow,q]));
 return first.map(q=>{
  const next=byRow.get(q.sourceRow);
  if(!next||next.classification!==q.classification||next.fixed!==q.fixed)throw new Error('Buoy replay identity changed');
  const chosen=t<1?q:next;
  return {...chosen,position:Object.fromEntries(['x','y','z'].map(k=>[k,q.position[k]+(next.position[k]-q.position[k])*t]))};
 });
}
