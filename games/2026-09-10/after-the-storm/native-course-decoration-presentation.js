import {captureNativeStuntWorld} from './native-stunt-presentation.js';

/** Read-only ordinary decoration view. Rendering and replay receive detached
 * values; canonical loading/initialization remain the sole object owner. */
export function createNativeCourseDecorationPresentation({course,readState,scale=.025}){
 if(typeof readState!=='function'||!Number.isFinite(scale)||scale<=0)throw new TypeError('Expected canonical decoration owner');
 const initial=readState(),d=new DataView(new ArrayBuffer(4)),mode=initial.scene.mode620,index=initial.scene.courseIndex;
 if(![0,1].includes(mode)||index!==course.sourceWaterCourseIndex)throw new RangeError('Select an ordinary source course');
 const float=w=>{d.setUint32(0,w);const v=d.getFloat32(0);if(!Number.isFinite(v))throw new RangeError('Invalid decoration position');return v;};
 const position=(a,i)=>a.slice(i*49,i*49+3).map(w=>float(w)*scale);
 const a=initial.objectWordsC940,used=new Set();
 const decorations=(course.sourceStaticObjects??[]).map(q=>{
  const i=q.sourceIndex,b=i*49;
  if(!Number.isInteger(i)||i<0||i>=initial.scene.objectCountFa40||used.has(i)||![3,4].includes(q.runtimeKind)||
   a[b+19]!==q.runtimeKind||a[b+21]!==2||a[b+22]!==0||a[b+23]!==0||q.visual!=='reeds'||
   !position(a,i).every((v,j)=>Math.abs(v-q[['x','y','z'][j]])<1e-5))throw new RangeError('Decoration must match its loaded source row and center');
  used.add(i);return Object.freeze({id:q.id,sourceIndex:i,runtimeKind:q.runtimeKind,visual:q.visual});
 });
 if(used.size!==Array.from({length:initial.scene.objectCountFa40},(_,i)=>a[i*49+19]).filter(k=>[3,4].includes(k)).length)
  throw new RangeError('Every loaded decoration needs a high-resolution mesh');
 const layout=Object.freeze({version:1,courseIndex:index,decorations:Object.freeze(decorations)});
 function snapshot(){
  const s=readState(),a=s.objectWordsC940;
  if(s.scene.mode620!==mode||s.scene.courseIndex!==index)throw new RangeError('Decoration selection changed');
  return captureNativeStuntWorld({version:1,rings:[],volumes:[],decorations:decorations.map(q=>{
   if(a[q.sourceIndex*49+19]!==q.runtimeKind)throw new RangeError('Decoration source row changed');
   return {id:q.id,sourceIndex:q.sourceIndex,position:position(a,q.sourceIndex),visible:a[q.sourceIndex*49+21]===2};
  })});
 }
 snapshot();return Object.freeze({layout,snapshot});
}
