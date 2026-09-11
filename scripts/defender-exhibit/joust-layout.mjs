import {boardLayouts} from './hardware-layout.mjs';
// Functional Joust board reconstruction. Package families are historical;
// placement is approximate, not a traced factory assembly drawing.
export const joustLayouts=structuredClone(boardLayouts);
joustLayouts.cpu.title='JOUST CPU / VIDEO / BLITTER';
joustLayouts.cpu.chips=joustLayouts.cpu.chips.filter(c=>!['5M','6M','5P','6P'].includes(c.ref));
joustLayouts.cpu.chips.push(...[{ref:'SC1',u:.50,v:.71},{ref:'SC2',u:.60,v:.71}].map(c=>({...c,family:'SC1 BLITTER',pins:40,socket:true})));
joustLayouts.cpu.chips.filter(c=>c.family==='7641').forEach((c,i)=>c.family='DECODER '+(i?6:4));
joustLayouts.rom.title='JOUST / 12 PROGRAM EPROMS';
joustLayouts.rom.chips.forEach(c=>{if(c.family==='UNUSED'||c.family.startsWith('ROM ')){c.family='ROM '+c.ref.slice(2);c.empty=false;c.red=false;}});
joustLayouts.interface.title='JOUST / TWO 2-WAY STICKS / FLAP';
joustLayouts.sound.title='D8224 / VSNDRM4';
joustLayouts.sound.chips.find(c=>c.ref==='IC12').family='VSNDRM4';
