// Selected71E70 fixed-sphere loading73278..735EC, then complete73E6C.
// Caller owns earlier pointer selection and count resets. All untouched words
// and list bytes remain retained; no zero/BSS or graphical asset policy here.
const F=Math.fround,view=new DataView(new ArrayBuffer(4));
function integer(v,n,min=0,max=0xffffffff){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`Supply ${n}[${count}]`);return Array.from(v,x=>integer(x,n));}
function bits(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Fixed-sphere float must be finite binary32');view.setFloat32(0,v);return view.getUint32(0);}
function float(v){view.setUint32(0,v);const x=view.getFloat32(0);if(!Number.isFinite(x))throw new RangeError('Fixed-sphere coordinate must be finite');return x;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function rows(v,n){if(!Array.isArray(v))throw new TypeError(`Supply selected ${n} without sentinel`);return v;}
function row(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`Supply ${n}[${count}]`);v.forEach(x=>integer(x,n,-32768,32767));return v;}

/** Generic XZ rows, then markers, then hidden XYZ. The first two groups check
 * capacity after a write; hidden XYZ checks before it. An overflowing write
 * rejects atomically. The reached main21 tail clears both object counts.
 */
export function prepareNativeFixedSphereLoading(input){
 const output=words(input?.fixedSphereWordsB138,'fixedSphereWordsB138',1536);
 let count=integer(input.fixedSphereCountC938,'fixedSphereCountC938',0,256),objectCount=integer(input.objectCountFa40,'objectCountFa40',0,64);
 const course=integer(input.courseIndex,'courseIndex',0,11),difficulty=integer(input.difficulty,'difficulty',-2147483648,2147483647),
  main=integer(input.main638,'main638',-2147483648,2147483647),reverse=integer(input.reverseDab68,'reverseDab68',0,65535),
  alternate=integer(input.alternate8250,'alternate8250',-2147483648,2147483647),override=integer(input.rampFilterOverride8254,'rampFilterOverride8254',-2147483648,2147483647);
 const diagnostic={fixed:[],markers:[],hidden:[]};
 const slot=()=>{if(count>=256)throw new RangeError('Source fixed-sphere storage overflow');return count*6;};
 for(const [i,raw]of rows(input.fixedRows,'fixedRows').entries()){
  const [x,z,tag]=row(raw,'fixed row',3);if(tag===-1)throw new RangeError('Remove fixed row sentinel');
  const accepted=!(tag===2&&difficulty<=0&&override===0||tag===3&&(difficulty<2&&override===0||course===6&&(reverse!==0||alternate!==0)));
  diagnostic.fixed.push({sourceRow:i,sphereIndex:count,accepted});if(!accepted)continue;
  const b=slot();output[b]=bits(x);output[b+2]=bits(z);output[b+4]=tag>=0&&tag<=4?tag:0;
  if(++count>=256)break;
 }
 for(const [i,raw]of rows(input.markerRows,'markerRows').entries()){
  const [x,z]=row(raw,'marker row',2);if(x===-1&&z===-1)throw new RangeError('Remove marker row sentinel');
  const b=slot();output[b]=bits(x);output[b+2]=bits(z);output[b+4]=1;
  diagnostic.markers.push({sourceRow:i,sphereIndex:count});if(++count>=256)break;
 }
 for(const [i,raw]of rows(input.hiddenRows,'hiddenRows').entries()){
  if(count>=256)break;
  const [x,y,z]=row(raw,'hidden row',3);if(x===-1&&z===-1)throw new RangeError('Remove hidden row sentinel');
  const b=slot();output[b]=bits(x);output[b+1]=bits(y);output[b+2]=bits(z);output[b+4]=5;
  diagnostic.hidden.push({sourceRow:i,sphereIndex:count});count++;
 }
 if(main===21){count=0;objectCount=0;}
 return freeze({fixedSphereWordsB138:output,fixedSphereCountC938:count,objectCountFa40:objectCount,diagnostic});
}

/** Full73E6C: tag5 keeps loaded Y; other tags become Y0. Radius25, special
 * flag for tags2/3/4, float32 bounds/cells, ascending byte indices and a shared
 *511-entry cap. Source empty-list sentinel bounds and unwritten bytes survive.
 */
export function prepareNativeFixedSphereInitialization(input){
 const output=words(input?.fixedSphereWordsB138,'fixedSphereWordsB138',1536),grid=words(input.fixedSphereGridWords1ce8,'fixedSphereGridWords1ce8',166),
  count=integer(input.fixedSphereCountC938,'fixedSphereCountC938',0,256);
 let minX=524287,minZ=524287,maxX=-524288,maxZ=-524288;
 for(let i=0;i<count;i++){
  const b=i*6,tag=output[b+4],x=float(output[b]),z=float(output[b+2]);
  if(tag!==5)output[b+1]=0;
  if(x<minX)minX=x;if(maxX<x)maxX=x;if(z<minZ)minZ=z;if(maxZ<z)maxZ=z;
  output[b+3]=bits(25);output[b+5]=Number(tag===2||tag===3||tag===4);
 }
 minX=F(minX-25);minZ=F(minZ-25);maxX=F(maxX+25);maxZ=F(maxZ+25);
 const sizeX=F(maxX-minX),sizeZ=F(maxZ-minZ),cellX=F(sizeX/4),cellZ=F(sizeZ/4);
 [minX,minZ,maxX,maxZ,sizeX,sizeZ].forEach((v,i)=>grid[i]=bits(v));
 let entries=0;
 for(let x=0;x<4;x++){
  const cellLowX=F(F(x*cellX)+minX),lowX=F(cellLowX-25),highX=F(F(cellLowX+cellX)+25);
  for(let z=0;z<4;z++){
   const cell=x*4+z,cellLowZ=F(F(z*cellZ)+minZ),lowZ=F(cellLowZ-25),highZ=F(F(cellLowZ+cellZ)+25);
   grid[134+cell]=entries;let added=0;
   for(let i=0;i<count;i++)if(entries<511){
    const px=float(output[i*6]),pz=float(output[i*6+2]);
    if(lowX<=px&&px<=highX&&lowZ<=pz&&pz<=highZ){
     const index=6+(entries>>>2),shift=(3-(entries&3))*8;
     grid[index]=((grid[index]&~(255<<shift))|(i<<shift))>>>0;entries++;added++;
    }
   }
   grid[150+cell]=added;
  }
 }
 return freeze({fixedSphereWordsB138:output,fixedSphereGridWords1ce8:grid});
}
