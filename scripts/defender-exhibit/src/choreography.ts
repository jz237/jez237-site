import {offsets} from './data';
export const stages:Record<string,number>={left_panel:0,right_panel:0,back_panel:.06,marquee:.12,crt:.22,controls:.36,coin:.48,logic:.25,power:.37,speaker:.25,ventilation:.4,chassis:0,details:0};
export function assemblyOffset(id:string,progress:number,mobile:boolean):[number,number,number]{const delay=stages[id]||0;const phase=Math.min(1,Math.max(0,(progress-delay)/(1-delay)));const t=phase*phase*(3-2*phase);const off=offsets[id]||[0,0,0];return [off[0]*t*(mobile?.62:1),off[1]*t,off[2]*t];}
