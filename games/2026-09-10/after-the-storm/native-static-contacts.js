// Numeric7F030/7F700 contact passes over twelve original-layout hull points.
// Native velocity is displacement per10ms tick, not metres per second. The
// caller selects original geometry and owns conversion/integration. These are
// full mutating passes: a hit shifts all twelve positions before subsequent
// candidates/points. A support-query first-hit result cannot replace this pass.
import {queryNativeSupportBoxes} from './native-support-queries.js';
const F=Math.fround,keys=['x','y','z'];
function number(v,name){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(`Invalid ${name}`);return F(v);}
function integer(v,name,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
const vector=(v,name)=>Object.fromEntries(keys.map(k=>[k,number(v?.[k],`${name}.${k}`)]));
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function copy(input){
 if(!Array.isArray(input?.pointsNative)||input.pointsNative.length!==12)throw new TypeError('Supply twelve native hull points');
 if(typeof input.markedBox!=='boolean')throw new TypeError('Supply retained markedBox');
 return {pointsNative:input.pointsNative.map(p=>({position:vector(p.position,'point position'),velocity:vector(p.velocity,'point velocity')})),
  floorImpactNative:number(input.floorImpactNative,'floor impact'),boxImpactNative:number(input.boxImpactNative,'box impact'),
  normalNative:vector(input.normalNative,'impact normal'),markedBox:input.markedBox};
}
const at=(q,i)=>number(q[i],`collision field${i}`);
const dot=(q,i,d)=>F(F(F(at(q,i)*d[0])+F(d[1]*at(q,i+1)))+F(d[2]*at(q,i+2)));
function row(rows,i){const q=rows?.[i];if(!Array.isArray(q)||q.length!==16)throw new TypeError('Supply reached original16-float collision row');return q;}
function apply(state,kind,pointIndex,normal,depth,flag,sourceIndex,contacts){
 const velocity=state.pointsNative[pointIndex].velocity;
 const incoming=F(F(F(-velocity.x*normal.x)-F(velocity.y*normal.y))-F(velocity.z*normal.z));
 if(kind==='floor'&&incoming<=0)return;
 const field=kind==='floor'?'floorImpactNative':'boxImpactNative';
 const impact=kind==='box'&&flag?F(F(.4)*incoming):incoming;
 if(state[field]<impact){state[field]=impact;state.normalNative={...normal};}
 if(kind==='box'&&flag)state.markedBox=true;
 for(const k of keys)velocity[k]=F(velocity[k]+F(incoming*normal[k]));
 // The source adds each component to point0 through point11, including the
 // contacted point. It changes no other point's velocity.
 const push=keys.map(k=>F(normal[k]*depth));
 for(const p of state.pointsNative)keys.forEach((k,i)=>p.position[k]=F(p.position[k]+push[i]));
 contacts.push({kind,pointIndex,sourceIndex,penetrationNative:depth,incomingNative:incoming,normalNative:{...normal},flag});
}
function cellOffset(p,g){
 const ix=(integer(Math.trunc(p.x),'point.x')-integer(g.originX3b44,'originX3b44'))|0;
 if(ix<0||ix>=integer(g.width3b4c,'width3b4c'))return null;
 const iz=(integer(Math.trunc(p.z),'point.z')-integer(g.originZ3b50,'originZ3b50'))|0;
 if(iz<0||iz>=integer(g.depth3b58,'depth3b58'))return null;
 const sx=integer(g.shiftX3b70,'shiftX3b70')&31,sz=integer(g.shiftZ3b78,'shiftZ3b78')&31;
 const swapped=integer(g.axisOrder3b40,'axisOrder3b40',-32768,32767)!==0;
 const cell=(swapped?(iz>>sz)|((ix>>sx)<<(integer(g.rowBitsZ3b68,'rowBitsZ3b68')&31)):
  (ix>>sx)|((iz>>sz)<<(integer(g.rowBitsX3b60,'rowBitsX3b60')&31)))>>>0;
 return integer(g.cellHalfwords?.[cell],'floor cell offset',0,65535)+1;
}

/** Full static-floor pass. Select a cell once per point; continue its ordered
 * candidate list after every accepted/rejected face, using updated positions.
 * Contact at depth0 still removes incoming velocity and may set the impact. */
export function prepareNativeFloorContacts(input,floor){
 const state=copy(input),contacts=[];
 if(!floor||typeof floor!=='object')throw new TypeError('Supply original floor geometry');
 for(let pointIndex=11;pointIndex>=0;pointIndex--){
  const p=state.pointsNative[pointIndex].position,start=cellOffset(p,floor);if(start===null)continue;
  for(let offset=start;;offset++){
   const sourceIndex=integer(floor.listHalfwords?.[offset],'floor candidate',0,65535);if(sourceIndex===0)break;
   const q=row(floor.planes,sourceIndex-1),d=keys.map((k,i)=>F(at(q,i)-p[k]));
   if(dot(q,6,d)<0||dot(q,9,d)<0)continue;
   const clip=dot(q,12,d);if(clip>=0||clip<at(q,15))continue;
   const depth=dot(q,3,d);if(depth<0||depth>16)continue;
   apply(state,'floor',pointIndex,Object.fromEntries(keys.map((k,i)=>[k,at(q,i+3)])),depth,false,sourceIndex,contacts);
  }
 }
 return freeze({state,contacts});
}

/** Full runtime-box pass. Each volume visits points11..0 before the preceding
 * volume. Non-upward faces exclude points1/8/11. Unlike floor contacts, outgoing
 * box contacts still project velocity, push all points and mark flagged boxes. */
export function prepareNativeBoxContacts(input,boxes){
 const state=copy(input),contacts=[],count=integer(boxes?.count0578,'count0578',0,32);
 for(let sourceIndex=count-1;sourceIndex>=0;sourceIndex--){
  const q=row(boxes.rows,sourceIndex),single={count0578:1,rows:[q]},flag=at(q,15)!==0;
  for(let pointIndex=11;pointIndex>=0;pointIndex--){
   const hit=queryNativeSupportBoxes(state.pointsNative[pointIndex].position,single),normal=hit.normalNative;
   if(!normal||normal.y<=0&&[1,8,11].includes(pointIndex))continue;
   apply(state,'box',pointIndex,normal,hit.penetrationNative,flag,sourceIndex,contacts);
  }
 }
 return freeze({state,contacts});
}
