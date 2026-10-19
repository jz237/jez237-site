const WORDS=65,FAMILY_ROWS=64,FAMILIES=['primary','secondary','tertiary'];
const bits=new DataView(new ArrayBuffer(4));
const word=v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff;
function records(data,name){
 if(data===null)return [];
 const rows=data?.recordWordsBySourceRow;
 if(!Array.isArray(rows)||rows.length<1||rows.length>FAMILY_ROWS||
   Array.from(rows).some(r=>!Array.isArray(r)||r.length!==WORDS||Array.from(r).some(v=>!word(v))))
  throw new TypeError(`Supply selected ${name} course records or explicit null`);
 return rows;
}
function float(v,name){
 if(!Number.isFinite(v)||!Number.isFinite(Math.fround(v)))throw new TypeError(`Invalid current primary ${name}`);
 bits.setFloat32(0,v);return bits.getUint32(0);
}

/** Read-only actor view of the selected contiguous route families. The caller
 * explicitly owns every unused record: Dolphin's B124 search can read primary
 * padding, and its negative record offset can cross a family boundary. Never
 * shorten, wrap or zero those reads according to a family's selected count.
 *
 * Current primary positions/endpoints/velocities and separate C4/C8 flags come
 * from the one physical buoy owner, after contact and the outer motion pass.
 * Secondary/tertiary records remain their independently selected data. This
 * detached snapshot neither advances physics nor retains another mutable world.
 */
export function snapshotNativeCourseActorRoutes({routes,primaryState,retainedWordsEe20}={}){
 if(!Array.isArray(retainedWordsEe20)||retainedWordsEe20.length!==FAMILY_ROWS*WORDS*3||
   Array.from(retainedWordsEe20).some(v=>!word(v)))throw new TypeError('Supply all192 retained course records');
 const selected=FAMILIES.map(name=>records(routes?.[name],name)),primary=selected[0];
 if(!primary.length||!Array.isArray(primaryState?.nodes)||primaryState.nodes.length!==primary.length)
  throw new TypeError('Supply the matching physical primary owner');
 const result=[...retainedWordsEe20];
 selected.forEach((rows,family)=>rows.forEach((row,i)=>{
  const base=(family*FAMILY_ROWS+i)*WORDS;row.forEach((v,j)=>{result[base+j]=v;});
 }));
 Array.from(primaryState.nodes).forEach((n,i)=>{
  const base=i*WORDS,r=primary[i];
  if(!n||n.sourceRow!==i||n.sourceIndex!==i||n.classification!==(r[0x98/4]|0)||
    typeof n.fixed!=='boolean'||Number(n.fixed)!==r[0x9c/4])throw new RangeError('Physical primary source identity differs from selected route');
  const putVector=(offset,p,name)=>['x','y','z'].forEach((axis,j)=>{result[base+offset/4+j]=float(p?.[axis],name+'.'+axis);});
  putVector(0,n.positionNative,'position');putVector(0x3c,n.velocityNative,'velocity');
  if(!Array.isArray(n.endpointsNative)||n.endpointsNative.length!==2)throw new TypeError('Supply both current primary endpoints');
  n.endpointsNative.forEach((p,j)=>putVector(0xc+j*0xc,p,'endpoint'+j));
  for(const [field,offset]of [['physicsEnabled',0xc4],['renderEnabled',0xc8]]){
   if(typeof n[field]!=='boolean')throw new TypeError(`Supply current primary ${field}`);
   result[base+offset/4]=Number(n[field]);
  }
 });
 return Object.freeze(result);
}
