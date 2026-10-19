// Independent numeric8E4B0 reconstruction. This prepares source environment
// state and partial vertex writes; the detailed browser scene remains intact.
import {NATIVE_COURSE_DISPLAY_ROWS} from './native-course-display-data.js';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const b=new DataView(new ArrayBuffer(4));
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function row(values){if(!Array.isArray(values)||values.length!==68)throw new RangeError('Supply selected course display row[68]');return values.map(v=>integer(v,'course display word',0,0xffffffff));}
function signedFloatWord(w){b.setUint32(0,w);const f=b.getFloat32(0),v=Math.trunc(f);if(!Number.isFinite(f)||v< -2147483648||v>2147483647)throw new RangeError('Course lighting conversion must fit signed32');return v>>>0;}

/** Both68-word destinations first receive the selected course. Only main21
 * replaces the first with ending row10 (A404 aliases this same table row).
 * The three light components truncate from the selected first destination.
 * waterExtent2498 comes from actual scene water initialization, radius*64.
 * Graphics commands patch only Y, flag, UV and RGBA; retained X/Z survive.
 */
export function prepareNativeCourseDisplayInitialization({courseIndex,main638,waterExtent2498,courseRows9964=NATIVE_COURSE_DISPLAY_ROWS}={}){
 integer(courseIndex,'courseIndex',0,11);integer(main638,'main638',-2147483648,2147483647);integer(waterExtent2498,'waterExtent2498',-2147483648,2147483647);
 if(!Array.isArray(courseRows9964)||courseRows9964.length!==12)throw new RangeError('Supply courseRows9964[12]');
 const selected=row(courseRows9964[courseIndex]),first=main638===21?row(courseRows9964[10]):selected;
 const operations=[],displayWordsB058=[...selected,...selected],lightWords4160=[];
 const copy=(values,start)=>values.forEach((value,i)=>{displayWordsB058[start+i]=value;operations.push({kind:'courseDisplayWrite',byteOffset:(start+i)*4,width:4,value});});
 copy(selected,0);copy(selected,68);if(main638===21)copy(first,0);
 for(let i=0;i<3;i++){const value=signedFloatWord(first[43+i]);lightWords4160.push(value);operations.push({kind:'courseLightWrite',byteOffset:i*4,width:4,value});}
 const y=Math.imul(waterExtent2498,3)&65535;
 for(let bufferIndex=0;bufferIndex<2;bufferIndex++){
  const write=(byteOffset,width,value)=>operations.push({kind:'courseDisplayGraphicsWrite',bufferIndex,byteOffset,width,value});
  const normal=base=>{for(const [offset,width,value]of [[2,2,0],[8,2,128],[10,2,0],[6,2,0],[12,1,0],[13,1,0],[14,1,0],[15,1,255]])write(base+offset,width,value);};
  const special=base=>{for(const [offset,width,value]of [[8,2,128],[10,2,20416],[6,2,0],[12,1,0],[13,1,0],[14,1,0],[15,1,255],[2,2,y]])write(base+offset,width,value);};
  const reverse=base=>{for(const [offset,width,value]of [[15,1,255],[14,1,0],[13,1,0],[12,1,0],[6,2,0],[10,2,0],[8,2,128],[2,2,0]])write(base+offset,width,value);};
  special(0x140);for(let base=0xe0;base<=0x130;base+=16)normal(base);special(0x1b0);
  for(const base of [0x160,0x150,0x1a0,0x190,0x180])reverse(base);normal(0x170);
 }
 return freeze({operations,displayWordsB058,lightWords4160,diagnostic:{endingOverride:main638===21,graphicsExecuted:false,highResolutionSceneChanged:false}});
}
