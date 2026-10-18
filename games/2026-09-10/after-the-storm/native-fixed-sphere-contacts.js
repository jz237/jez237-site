const F=Math.fround,view=new DataView(new ArrayBuffer(4)),groups=[[4,5,3],[11,10,9]];
function words(v,n,count){if(!Array.isArray(v)||v.length!==count||Array.from(v).some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError(`Supply ${n}[${count}] unsigned words`);return v.slice();}
function scalar(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`Invalid ${n} float`);return F(v);}
function float(w){view.setUint32(0,w);return scalar(view.getFloat32(0),'fixed sphere');}
function vector(v,n,size=3){if(!Array.isArray(v)||v.length!==size)throw new TypeError(`Supply ${n}[${size}]`);return Array.from(v,x=>scalar(x,n));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Complete741A4 query of the retained73E6C grid. Float32 subtraction/division/
 * multiplication precede signed truncation, including just below the bounds.
 * Source list bytes are returned in stored order; contacts reverse them later.
 * Nonfinite/out-of-range conversion and out-of-span list reads reject rather
 * than modeling undefined conversion or memory outside this bounded owner. */
export function queryNativeFixedSphereGrid({fixedSphereGridWords1ce8,centerNativeXZ}={}){
 const grid=words(fixedSphereGridWords1ce8,'fixedSphereGridWords1ce8',166),center=vector(centerNativeXZ,'fixed sphere center',2);
 const cell=center.map((v,i)=>{
  const coordinate=F(F(F(v-float(grid[i]))/float(grid[4+i]))*4);
  if(!Number.isFinite(coordinate)||coordinate< -2147483648||coordinate>=2147483648)throw new RangeError('Unsupported fixed-sphere cell conversion');
  return Math.trunc(coordinate)||0;
 });
 if(cell.some(v=>v<0||v>=4))return freeze({cell,cellIndex:null,candidates:[]});
 const cellIndex=cell[0]*4+cell[1],count=grid[150+cellIndex]|0,candidates=[];
 if(count===-2147483648)throw new RangeError('Source fixed-sphere list count overflow');
 if(count>0){
  const start=grid[134+cellIndex];if(start+count>512)throw new RangeError('Source fixed-sphere list storage overflow');
  for(let i=0;i<count;i++){const offset=start+i;candidates.push((grid[6+(offset>>>2)]>>>((3-(offset&3))*8))&255);}
 }
 return freeze({cell,cellIndex,candidates});
}

/** Full7EF80: one741A4 query, then front/rear7ED2C with cached probes. Each
 * probe stops at the first descending candidate overlap. Extent is hardcoded37,
 * independent of stored radius/tag. Full penetration translates all12 points
 * and kicks three velocities, even when separating; fixed spheres never recoil.
 * C3C is a strict maximum. Coincident centers remain explicitly unresolved.
 */
export function prepareNativeFixedSphereContacts(input){
 const spheres=words(input?.fixedSphereWordsB138,'fixedSphereWordsB138',1536),query=queryNativeFixedSphereGrid(input);
 const hull={};for(const key of ['positions','velocities']){
  if(!Array.isArray(input.hull?.[key])||input.hull[key].length!==12)throw new TypeError('Supply twelve fixed-contact hull points');
  hull[key]=input.hull[key].map(p=>vector(p,key));
 }
 if(!Array.isArray(input.probesNative)||input.probesNative.length!==2)throw new TypeError('Supply two cached fixed-sphere probes');
 const probes=input.probesNative.map(p=>vector(p,'probe')),impact={maximum:scalar(input.impact?.maximum,'fixed impact'),normal:vector(input.impact?.normal,'fixed impact normal')},contacts=[],unresolved=[];
 for(let probeIndex=0;probeIndex<2;probeIndex++)for(let j=query.candidates.length-1;j>=0;j--){
  const index=query.candidates[j],b=index*6,probe=probes[probeIndex],dx=F(probe[0]-float(spheres[b])),dz=F(probe[2]-float(spheres[b+2])),horizontal=F(F(dx*dx)+F(dz*dz));
  if(horizontal>1369)continue;
  const dy=F(probe[1]-float(spheres[b+1])),squared=F(horizontal+F(dy*dy));if(squared>=1369)continue;
  if(squared===0){unresolved.push({index,probeIndex,reason:'coincident-center'});break;}
  const distance=F(Math.sqrt(squared)),inverse=F(1/distance),depth=F(37-distance),normal=[dx,dy,dz].map(v=>F(v*inverse)),translation=normal.map(v=>F(v*depth));
  const group=groups[probeIndex],velocity=hull.velocities[group[0]],incoming=scalar(F(F(F(-normal[0]*velocity[0])-F(normal[1]*velocity[1]))-F(normal[2]*velocity[2])),'fixed incoming');
  if(impact.maximum<incoming){impact.maximum=incoming;impact.normal=normal.slice();}
  for(const i of group)hull.velocities[i]=hull.velocities[i].map((v,k)=>scalar(F(v+translation[k]),'fixed velocity result'));
  hull.positions=hull.positions.map(p=>p.map((v,k)=>scalar(F(v+translation[k]),'fixed position result')));
  contacts.push({index,probeIndex,normal,translation,incoming,depth});break;
 }
 return freeze({hull,impact,contacts,unresolved,diagnostic:query});
}
