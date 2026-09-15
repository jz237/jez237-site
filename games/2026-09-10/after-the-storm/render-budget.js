export function refractionSize(width,height,quality,views=1){const scale=quality==='high'?.8:quality==='medium'?.68:.6;return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale/views))};}
export function shadowDue(frame,quality){return quality==='high'?frame%2===0:quality==='medium'?frame%3===0:false;}

// Preserve CSS-pixel clarity on phones while bounding total raster work.
export function renderPixelRatio(width,height,dpr,quality){
 const area=Math.max(1,width*height),budget=quality==='high'?2300000:quality==='medium'?1200000:620000;
 const ceiling=quality==='high'?1.75:quality==='medium'?1.25:1;
 return Math.min(Math.max(.5,dpr||1),ceiling,Math.sqrt(budget/area));
}
