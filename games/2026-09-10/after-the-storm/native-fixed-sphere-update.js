const view=new DataView(new ArrayBuffer(4));
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}

/** Reached6E3A8 block6E3F4..6E468, after7DBC0 and before6E0F4.
 * Southern's fixed spheres follow the signed integer water datum. Tag5
 * retains its loaded height; all other words, including the XZ grid, survive.
 * The caller owns the activity gate and the water field's single datum owner.
 */
export function prepareNativeFixedSphereUpdate(input){
 const course=integer(input?.courseIndex,'courseIndex'),diagnostic={updatedRows:[]};
 if(!Array.isArray(input.fixedSphereWordsB138)||input.fixedSphereWordsB138.length!==1536)throw new RangeError('Supply fixedSphereWordsB138[1536]');
 const output=Array.from(input.fixedSphereWordsB138,w=>integer(w,'fixed sphere word',0,0xffffffff));
 if(course===7){
  const count=integer(input.fixedSphereCountC938,'fixedSphereCountC938',-2147483648,256);
  for(let i=0;i<count;i++)if(output[i*6+4]!==5){
   view.setFloat32(0,integer(input.datum2458,'datum2458'));output[i*6+1]=view.getUint32(0);diagnostic.updatedRows.push(i);
  }
 }
 Object.freeze(diagnostic.updatedRows);Object.freeze(diagnostic);
 return Object.freeze({fixedSphereWordsB138:Object.freeze(output),diagnostic});
}
