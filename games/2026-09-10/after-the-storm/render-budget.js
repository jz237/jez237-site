export function refractionSize(width,height,quality,views=1){const scale=quality==='high'?.8:quality==='medium'?.68:.6;return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale/views))};}
export function shadowDue(frame,quality){return quality==='high'?frame%2===0:quality==='medium'?frame%3===0:false;}
