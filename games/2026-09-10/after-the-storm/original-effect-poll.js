// Sequence0 channels2/5 poll IO0 before IO1 every8 ticks (200BPM,48PPQN).
// The browser anchors that50ms poll to completed physics frames. This retains
// command overwrite/priority behavior, not the cartridge audio scheduler phase.
const copy=c=>({...c,arguments:[...c.arguments]});
export function originalEffectPitch(command){
 const a=command?.arguments;
 if(command?.consumer!=='c538c'||!Array.isArray(a)||a.length!==2||
  ![0x04000200,0x04000500].includes(a[0])||!Number.isInteger(a[1])||a[1]<0||a[1]>0xffffffff)return null;
 const view=new DataView(new ArrayBuffer(4));view.setUint32(0,a[1]);const rate=view.getFloat32(0);
 return Number.isFinite(rate)&&rate>0&&rate<=8?{lane:(a[0]>>>8)&255,rate}:null;
}
export function createOriginalEffectPoll(){
 const lanes=new Map([2,5].map(lane=>[lane,{contact:null,spray:null,pitch:null}]));
 return {
  submit(command){
   const pitch=originalEffectPitch(command),a=command?.arguments;
   if(pitch){lanes.get(pitch.lane).pitch=copy(command);return true;}
   if(!['bffec','c0044'].includes(command?.consumer)||!Array.isArray(a)||a.length!==3||!lanes.has(a[0]))return false;
   const lane=lanes.get(a[0]);lane[command.consumer==='bffec'?'contact':'spray']=copy(command);return true;
  },
  poll(){
   const commands=[];
   for(const lane of lanes.values()){
    if(lane.pitch){commands.push(lane.pitch);lane.pitch=null;}
    if(lane.contact){commands.push(lane.contact);lane.contact=null;}
    else if(lane.spray){commands.push(lane.spray);lane.spray=null;}
   }
   return commands;
  },
  clear(){for(const lane of lanes.values())lane.contact=lane.spray=lane.pitch=null;},
  snapshot(){return [...lanes].map(([lane,pending])=>({lane,...Object.fromEntries(Object.entries(pending).map(([k,c])=>[k,c?copy(c):null]))}));}
 };
}
