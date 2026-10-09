import {createCountyCourse} from './county-course';
/** Long waterside straights feed a wide, loose-surface northern loop. */
export const MILLBROOK=createCountyCourse({
 id:'millbrook-canal-v1',name:'Millbrook Canal Circuit',startZ:-120,
 controls:[[-120,-120],[0,-120],[120,-120],[172,-72],[168,18],[142,105],[76,128],[30,85],[-28,85],[-83,125],[-155,99],[-174,28],[-162,-58]],
 height:()=>0,asphalt:(_x,z)=>z<35,
});
/** The paddock stays level; a long western climb reaches an elevated northern bend. */
export function granitePassHeight(x:number,z:number){
 const t=Math.max(0,Math.min(1,(z+80)/110)),blend=t*t*(3-2*t);
 return blend*(3+8*Math.exp(-(((x+95)/110)**2+((z-85)/130)**2)));
}
export const GRANITE_PASS=createCountyCourse({
 id:'granite-pass-v1',name:'Granite Pass Rally',startZ:-120,
 controls:[[-120,-120],[0,-120],[120,-120],[173,-65],[136,5],[147,80],[95,125],[18,112],[-38,55],[-100,111],[-167,76],[-159,-2],[-174,-65]],
 height:granitePassHeight,asphalt:()=>false,
});
export const CANAL_PASS_COURSES=[MILLBROOK,GRANITE_PASS] as const;
