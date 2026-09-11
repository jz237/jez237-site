import {boardLayouts} from './hardware-layout.mjs';
// Functional Robotron board reconstruction. Package families are historical;
// placement is approximate, not a traced factory assembly drawing.
export const robotronLayouts=structuredClone(boardLayouts);
robotronLayouts.cpu.title='ROBOTRON CPU / VIDEO / BLITTER';
robotronLayouts.cpu.chips=robotronLayouts.cpu.chips.filter(c=>!['5M','6M','5P','6P'].includes(c.ref));
robotronLayouts.cpu.chips.push(...[{ref:'SC1',u:.50,v:.71},{ref:'SC2',u:.60,v:.71}].map(c=>({...c,family:'SC1 BLITTER',pins:40,socket:true})));
robotronLayouts.cpu.chips.filter(c=>c.family==='7641').forEach((c,i)=>c.family='DECODER '+(i?6:4));
robotronLayouts.rom.title='ROBOTRON / 12 PROGRAM EPROMS';
robotronLayouts.rom.chips.forEach(c=>{if(c.family==='UNUSED'||c.family.startsWith('ROM ')){c.family='ROM '+c.ref.slice(2);c.empty=false;c.red=false;}});
robotronLayouts.interface.title='ROBOTRON / TWO 8-WAY STICKS';
robotronLayouts.sound.title='D8224 / VIDEO SOUND ROM 3';
robotronLayouts.sound.chips.find(c=>c.ref==='IC12').family='VIDEO SOUND 3';
