// Numeric7F448/7FAE4 point queries. Inputs are selected original collision
// records in native units, including grid list order and original clip vectors.
// Reconstructed render triangles, spatial bins and world-space boxes cannot
// be substituted for these records. These functions retain no geometry owner.
const F=Math.fround;
function int(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function float(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`Invalid ${n}`);return F(v);}
function point(v){return ['x','y','z'].map(k=>float(v?.[k],`native point.${k}`));}
function row(rows,i){const q=rows?.[i];if(!Array.isArray(q)||q.length!==16)throw new RangeError('Supply reached original16-float collision row');return q;}
const at=(q,i)=>float(q[i],`collision field${i}`);
const dot=(q,i,d)=>F(F(F(at(q,i)*d[0])+F(d[1]*at(q,i+1)))+F(d[2]*at(q,i+2)));
const delta=(q,p)=>[0,1,2].map(i=>F(at(q,i)-p[i]));
const noHit=()=>Object.freeze({penetrationNative:0,normalNative:null});
const hit=(depth,normal)=>Object.freeze({penetrationNative:depth,normalNative:Object.freeze({x:normal[0],y:normal[1],z:normal[2]})});

/** floor contains the actual3B40..3B78 selectors and dereferenced3B7C/80/84
 * views. listHalfwords begins at the runtime3B80 pointer (the loaded list base
 * minus two bytes); a cell offset reads its first candidate at offset+1.
 * Rows use one-based indices, zero terminates. A zero-depth first hit RETURNS
 * immediately with its normal, rather than trying later candidates.
 */
export function queryNativeSupportFloor(pointNative,floor){
 const p=point(pointNative),g=floor;
 if(!g||typeof g!=='object')throw new TypeError('Supply selected native floor grid');
 const x=int(Math.trunc(p[0]),'truncated point.x'),ix=(x-int(g.originX3b44,'originX3b44'))|0;
 if(ix<0||ix>=int(g.width3b4c,'width3b4c'))return noHit();
 const z=int(Math.trunc(p[2]),'truncated point.z'),iz=(z-int(g.originZ3b50,'originZ3b50'))|0;
 if(iz<0||iz>=int(g.depth3b58,'depth3b58'))return noHit();
 const shiftX=int(g.shiftX3b70,'shiftX3b70')&31,shiftZ=int(g.shiftZ3b78,'shiftZ3b78')&31;
 const swapped=int(g.axisOrder3b40,'axisOrder3b40',-32768,32767)!==0;
 const cell=(swapped?(iz>>shiftZ)|((ix>>shiftX)<<(int(g.rowBitsZ3b68,'rowBitsZ3b68')&31)):
  (ix>>shiftX)|((iz>>shiftZ)<<(int(g.rowBitsX3b60,'rowBitsX3b60')&31)))>>>0;
 let offset=int(g.cellHalfwords?.[cell],'reached floor cell offset',0,65535)+1;
 for(;;offset++){
  const index=int(g.listHalfwords?.[offset],'reached floor candidate',0,65535);
  if(index===0)return noHit();
  const q=row(g.planes,index-1),d=delta(q,p);
  if(dot(q,6,d)<0||dot(q,9,d)<0)continue;
  const clip=dot(q,12,d);if(clip>=0||clip<at(q,15))continue;
  const depth=dot(q,3,d);if(depth<0||depth>16)continue;
  return hit(depth,[at(q,3),at(q,4),at(q,5)]);
 }
}

/** boxes are the actual16-float runtime rows starting801BFD78, selected by
 * count0578. Query last-to-first; the first containing row wins. Each projected
 * interval includes zero and excludes its span. Closest-face ties retain the
 * earlier axis/sign, including signed zero in the selected normal.
 */
export function queryNativeSupportBoxes(pointNative,boxes){
 const p=point(pointNative),count=int(boxes?.count0578,'count0578',0,32);
 for(let i=count-1;i>=0;i--){
  const q=row(boxes.rows,i),d=delta(q,p),a=dot(q,3,d);if(a<0||a>=at(q,12))continue;
  const b=dot(q,6,d);if(b<0||b>=at(q,13))continue;
  const c=dot(q,9,d);if(c<0||c>=at(q,14))continue;
  let depth=a,axis=3,sign=1;const farA=F(at(q,12)-a);
  if(farA<depth){depth=farA;sign=-1;}
  for(const [distance,candidateAxis,candidateSign]of [[b,6,1],[F(at(q,13)-b),6,-1],[c,9,1],[F(at(q,14)-c),9,-1]]){
   if(distance<depth){depth=distance;axis=candidateAxis;sign=candidateSign;}
  }
  return hit(depth,[at(q,axis)*sign,at(q,axis+1)*sign,at(q,axis+2)*sign]);
 }
 return noHit();
}
