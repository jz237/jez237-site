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
export function originalEffectSpatial(command){
 const a=command?.arguments;
 if(!Array.isArray(a)||a.length!==2||!Number.isInteger(a[1])||a[1]<0||a[1]>0xffffffff)return null;
 const lane=(a[0]>>>8)&255;
 if(command.consumer==='c538c'&&[0x01000200,0x01000500].includes(a[0])){
  const view=new DataView(new ArrayBuffer(4));view.setUint32(0,a[1]);const volume=view.getFloat32(0);
  return Number.isFinite(volume)&&volume>=0&&volume<=1?{lane,volume}:null;
 }
 if(command.consumer==='c53d4'&&[0x03000200,0x03000500].includes(a[0])&&a[1]<=127)return {lane,pan:a[1]};
 return null;
}
export function createOriginalEffectPoll(){
 const lanes=new Map([2,5].map(lane=>[lane,{contact:null,spray:null,pitch:null}]));
 const velocities=new Map([[2,0],[5,0]]),spatial=new Map();
 const riders=[null,null,null];
 return {
  submit(command,raceMode=0){
   const pitch=originalEffectPitch(command),a=command?.arguments;
   if(pitch){lanes.get(pitch.lane).pitch=copy(command);return true;}
   if(originalEffectSpatial(command)){spatial.set(a[0],copy(command));return true;}
   // C1268 expands BFFEC into the actual channel5 IO5/IO0 writes. IO5 is
   // sampled when the sequence polls, so a later velocity write still wins.
   if(command?.consumer==='c53d4'&&Array.isArray(a)&&a.length===2&&
     [0x06000500,0x06000505].includes(a[0])&&Number.isInteger(a[1])&&a[1]>=0&&a[1]<=127){
    const lane=lanes.get(5);
    if((a[0]&255)===5){velocities.set(5,a[1]);if(lane.contact)lane.contact.arguments[2]=a[1];}
    else lane.contact={...command,consumer:'bffec',arguments:[5,a[1],velocities.get(5)]};
    return true;
   }
   // C317C selects channel10 IO0 for solo P1, IO1 for versus P1, IO2
   // for P2. Its separate reverb-send command is not emulated by this bus.
   if(command?.consumer==='c317c'&&Array.isArray(a)&&a.length===2&&[0,1].includes(a[0])&&
    Number.isInteger(a[1])&&a[1]>=0&&a[1]<16){
    const port=a[0]===1?2:raceMode===1?1:0;
    riders[port]={...command,consumer:'c53d4',arguments:[0x06000a00|port,a[1]]};return true;
   }
   if(!['bffec','c0044'].includes(command?.consumer)||!Array.isArray(a)||a.length!==3||!lanes.has(a[0]))return false;
   const lane=lanes.get(a[0]);lane[command.consumer==='bffec'?'contact':'spray']=copy(command);
   if(command.consumer==='bffec')velocities.set(a[0],a[2]);return true;
  },
  poll(){
   const commands=[...spatial.values()];spatial.clear();
   for(const lane of lanes.values()){
    if(lane.pitch){commands.push(lane.pitch);lane.pitch=null;}
    if(lane.contact){commands.push(lane.contact);lane.contact=null;}
    else if(lane.spray){commands.push(lane.spray);lane.spray=null;}
   }
   // Channel10 checks IO0 before IO1 (same layer), then always checks IO2
   // (the independent second layer). A repeated write replaces only its port.
   const first=riders[0]?0:riders[1]?1:-1;
   if(first>=0){commands.push(riders[first]);riders[first]=null;}
   if(riders[2]){commands.push(riders[2]);riders[2]=null;}
   return commands;
  },
  clear(){for(const lane of lanes.values())lane.contact=lane.spray=lane.pitch=null;riders.fill(null);spatial.clear();},
  riderSnapshot(){return riders.map(c=>c?copy(c):null);},
  snapshot(){return [...lanes].map(([lane,pending])=>({lane,...Object.fromEntries(Object.entries(pending).map(([k,c])=>[k,c?copy(c):null]))}));}
 };
}
