// Independently reconstructed selected AI course-table policy. No course
// loader, initializer, navigation advance, primary judge or clock is run here.
import {createNativeAITargetWindow} from './native-ai-target.js';

const F=Math.fround;
function integer(n,name,min=-2147483648,max=2147483647){
 if(!Number.isInteger(n)||n<min||n>max)throw new RangeError(`Invalid ${name}`);return n||0;
}
function scalar(n,name){if(!Number.isFinite(n)||!Number.isFinite(F(n)))throw new TypeError(`${name} must fit finite float32`);return F(n);}
function family(n){if(!['primary','secondary','tertiary'].includes(n))throw new RangeError('Supply the retained recordFamily');return n;}

/** Source selected-context table choice, including the retained City74 word.
 * All positions are NATIVE units. Fields retain native identities where their
 * complete producer semantics are not established. The source record's table
 * pointer is expressed as recordFamily, never inferred from a human route.
 * The caller supplies and commits cityRouteFlag74 independently of AI input
 * history. A table override does not write that record's retained family.
 * Fields gated out by source control flow are not read or validated.
 */
export function selectNativeAIContext(input){
 if(!input||typeof input!=='object')throw new TypeError('Expected explicit AI context');
 const flag=integer(input.cityRouteFlag74,'cityRouteFlag74'),state=integer(input.state638,'state638');
 // Mode is not read when main-state21 already selects the primary table.
 if(state===21)return Object.freeze({family:'primary',cityRouteFlag74:flag});
 const mode=integer(input.mode620,'mode620');
 if(mode===1)return Object.freeze({family:'primary',cityRouteFlag74:flag});
 const course=integer(input.courseIndex,'courseIndex',0,8);
 if(course===5){
  const avatar=integer(input.avatar,'avatar',0,3);
  const selected=avatar===1&&integer(input.difficulty,'difficulty')!==2?'secondary':'primary';
  return Object.freeze({family:selected,cityRouteFlag74:flag});
 }
 if(course!==6)return Object.freeze({family:family(input.recordFamily),cityRouteFlag74:flag});
 if(typeof input.reverse!=='boolean')throw new TypeError('reverse must be boolean');
 if(input.reverse)return Object.freeze({family:family(input.recordFamily),cityRouteFlag74:flag});
 const variant=integer(input.cityVariant98c8,'cityVariant98c8');
 if(variant!==2)return Object.freeze({family:variant===0?'secondary':'primary',cityRouteFlag74:flag});
 const p=input.positionNative;
 if(!p||typeof p!=='object')throw new TypeError('Expected positionNative');
 const x=scalar(p.x,'positionNative.x'),y=scalar(p.y,'positionNative.y'),z=scalar(p.z,'positionNative.z');
 let next=flag;
 // Ordered, open regions. The two upper passages do not test body height.
 if(y<80&&-1000<x&&x<500&&-1500<z&&z< -1000)next=0;
 if(-580<x&&x<580&&-900<z&&z<600)next=1;
 if(-260<x&&x<260&&4340<z&&z<5400)next=1;
 if(y<80&&1500<x&&x<2100&&-8400<z&&z< -7400)next=0;
 if(700<x&&x<1500&&-8400<z&&z< -7400)next=1;
 const finished=integer(input.finished2c2c,'finished2c2c');
 return Object.freeze({family:finished!==0?'secondary':next===1?'primary':'secondary',cityRouteFlag74:next});
}

/** Resolve the chosen already-compiled target table and refresh its scratch
 * current/target/next/previous window, as one source context call does. The
 * source loader must establish the table set and shared row index validity.
 * Missing tables/rows reject before any returned state is committed. This
 * does not rebase or advance the persistent navigationSourceRow, change the
 * retained recordFamily, or recompute any fixed endpoint geometry.
 */
export function prepareNativeAIContext(tables,input){
 const selection=selectNativeAIContext(input),table=tables?.[selection.family];
 if(!table||table.family!==selection.family)throw new TypeError('Missing selected source target table');
 if(table.courseIndex!==input.courseIndex)throw new RangeError('Selected context table must match source course');
 const window=createNativeAITargetWindow(table,{avatar:input.avatar,navigationSourceRow:input.navigationSourceRow});
 return Object.freeze({selection,table,window});
}
