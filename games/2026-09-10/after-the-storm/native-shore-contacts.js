// Complete numeric80051740 pass. The input owns twelve points in native units
// and velocity per10ms tick. Original signed cell offsets address byte lists;
// index0 terminates and other indices directly address8-float line records.
const F=Math.fround,keys=['x','y','z'];
function number(v,name){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(`Invalid ${name}`);return F(v);}
function integer(v,name,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
const vector=(v,name)=>Object.fromEntries(keys.map(k=>[k,number(v?.[k],`${name}.${k}`)]));
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function cellOffset(p,g){
 const ix=(integer(Math.trunc(p.x),'point.x')-integer(g.originX24f4,'originX24f4'))|0;
 if(ix<0||ix>=integer(g.width24fc,'width24fc'))return null;
 const iz=(integer(Math.trunc(p.z),'point.z')-integer(g.originZ2500,'originZ2500'))|0;
 if(iz<0||iz>=integer(g.depth2508,'depth2508'))return null;
 const sx=integer(g.shiftX2520,'shiftX2520')&31,sz=integer(g.shiftZ2528,'shiftZ2528')&31;
 const swapped=integer(g.axisOrder24f0,'axisOrder24f0')!==0;
 const cell=(swapped?(iz>>sz)|((ix>>sx)<<(integer(g.rowBitsZ2518,'rowBitsZ2518')&31)):
  (ix>>sx)|((iz>>sz)<<(integer(g.rowBitsX2510,'rowBitsX2510')&31)))>>>0;
 return integer(g.cellHalfwords?.[cell],'signed shore cell offset',-32768,32767);
}

/** Complete51CB4 point probe. It uses the original signed cell offsets and
 * ordered byte lists, a strict32-unit depth band, and strict segment ends.
 * Unlike hull response, it returns the first matching normal without moving
 * any point or requiring an incoming velocity. */
export function queryNativeShorePoint(positionNative,shore){
 const p={x:number(positionNative?.x,'shore point.x'),z:number(positionNative?.z,'shore point.z')};
 if(!shore||typeof shore!=='object')throw new TypeError('Supply original shoreline grid');
 const start=cellOffset(p,shore),empty=()=>Object.freeze({penetrationNative:0,normalNative:null});
 if(start===null)return empty();
 for(let offset=start;;offset++){
  const sourceIndex=integer(shore.listBytes?.[offset],'shore candidate byte',0,255);if(sourceIndex===0)return empty();
  const row=shore.lines?.[sourceIndex];if(!Array.isArray(row)||row.length!==8)throw new TypeError('Supply reached original8-float shore row');
  const at=i=>number(row[i],`shore field${i}`),nx=at(2),nz=at(3);
  const depth=F(F(F(at(0)-p.x)*nx)+F(F(at(1)-p.z)*nz));
  if(depth<=0||depth>=32)continue;
  const along=F(F(F(p.x-at(0))*at(4))+F(F(p.z-at(1))*at(5)));
  if(along<=0||along>=at(6))continue;
  return Object.freeze({penetrationNative:depth,normalNative:Object.freeze({x:nx,z:nz})});
 }
}

export function prepareNativeShoreContacts(input,shore){
 if(!Array.isArray(input?.pointsNative)||input.pointsNative.length!==12)throw new TypeError('Supply twelve native hull points');
 if(!shore||typeof shore!=='object')throw new TypeError('Supply original shoreline grid');
 const state={pointsNative:input.pointsNative.map(p=>({position:vector(p.position,'point position'),velocity:vector(p.velocity,'point velocity')})),
  shoreImpactNative:number(input.shoreImpactNative,'shore impact'),normalNative:vector(input.normalNative,'impact normal')},contacts=[];
 for(let pointIndex=11;pointIndex>=0;pointIndex--){
  const {position:p,velocity:v}=state.pointsNative[pointIndex],start=cellOffset(p,shore);if(start===null)continue;
  // Keep this initial grid cell/list even after a response translates the hull.
  for(let offset=start;;offset++){
   const sourceIndex=integer(shore.listBytes?.[offset],'shore candidate byte',0,255);if(sourceIndex===0)break;
   const row=shore.lines?.[sourceIndex];if(!Array.isArray(row)||row.length!==8)throw new TypeError('Supply reached original8-float shore row');
   const at=i=>number(row[i],`shore field${i}`),nx=at(2),nz=at(3);
   const depth=F(F(F(at(0)-p.x)*nx)+F(F(at(1)-p.z)*nz));
   if(depth<=0||depth>=16)continue;
   const along=F(F(F(p.x-at(0))*at(4))+F(F(p.z-at(1))*at(5)));
   if(along<=0||along>=at(6))continue;
   const incoming=F(F(-v.x*nx)-F(v.z*nz));if(incoming<=0)continue;
   const normal={x:nx,y:0,z:nz};
   if(state.shoreImpactNative<incoming){state.shoreImpactNative=incoming;state.normalNative={...normal};}
   v.x=F(v.x+F(incoming*nx));v.z=F(v.z+F(incoming*nz));
   const dx=F(nx*depth),dz=F(nz*depth);
   for(const point of state.pointsNative){point.position.x=F(point.position.x+dx);point.position.z=F(point.position.z+dz);}
   contacts.push({kind:'shore',pointIndex,sourceIndex,penetrationNative:depth,incomingNative:incoming,normalNative:normal,flag:false});
  }
 }
 return freeze({state,contacts});
}
