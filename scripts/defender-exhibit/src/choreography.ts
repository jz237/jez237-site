import {offsets} from './data';
export const stages:Record<string,number>={left_panel:0,right_panel:0,back_panel:.06,marquee:.10,crt:.24,controls:.24,coin:.36,logic:.52,power:.58,speaker:.42,ventilation:.64,chassis:0,details:0};
export function assemblyProgress(id:string,progress:number){const delay=stages[id]||0;const phase=Math.min(1,Math.max(0,(progress-delay)/(1-delay)));return phase*phase*(3-2*phase);}
export function assemblyOffset(id:string,progress:number,mobile:boolean):[number,number,number]{const t=assemblyProgress(id,progress);const off=offsets[id]||[0,0,0];return [off[0]*t*(mobile?.62:1),off[1]*t,off[2]*t];}
