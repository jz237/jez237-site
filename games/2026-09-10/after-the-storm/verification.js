// Deterministic helm controller used only by the explicit ?verify=1 browser harness.
// It uses ordinary throttle, steering, brake and interaction inputs, never teleports.
export const voyage=[{x:0,z:116},{x:-66,z:46,job:0},{x:74,z:-46,job:1},{x:0,z:119},{x:0,z:140,dock:true},{x:0,z:113},{x:0,z:-134},{x:-32,z:-164,job:2},{x:0,z:-134},{x:0,z:118},{x:0,z:140,dock:true}];
export function pilot(s,route,index){let p=route[index];if(!p)return {input:{brake:true},index};const dx=p.x-s.x,dz=p.z-s.z,d=Math.hypot(dx,dz);if(p.job!==undefined&&s.jobs[p.job].status!=='waiting'||p.dock&&s.load.length===0&&d<11||p.job===undefined&&!p.dock&&d<7){index++;p=route[index];if(!p)return {input:{brake:true},index};return pilot(s,route,index);}
let angle=Math.atan2(dx,dz)-s.heading;angle=Math.atan2(Math.sin(angle),Math.cos(angle));const close=d<8&&(p.job!==undefined||p.dock);return {index,input:close?{brake:true,interact:true}:{throttle:Math.abs(angle)>1.1?.28:d<20?.45:1,steer:Math.max(-1,Math.min(1,angle*2.2)),brake:d<12&&s.speed>1.4}};
}
