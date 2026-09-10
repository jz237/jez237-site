// Original, sparse 80 BPM instrumental. Notes are generated in bounded phrases;
// scheduling uses AudioContext time so a slow render frame does not change tempo.
export const NOTE_INTERVAL=.375;
export function musicNotes(step){const roots=[50,46,53,48],root=roots[Math.floor(step/16)%4],notes=[];
 if(step%8===0)notes.push({midi:root-12,duration:2.8,gain:.09,pan:-.15,type:'triangle'});
 if(step%4===0)for(const n of [0,7,12])notes.push({midi:root+n,duration:1.35,gain:.022,pan:n===0?-.45:.45,type:'sine'});
 const melody=[12,19,22,19,17,15,19,17];if(step%2===0)notes.push({midi:root+melody[(step/2)%8],duration:.60,gain:.035,pan:.25,type:'sine'});
 return notes;
}
export const midiFrequency=n=>440*Math.pow(2,(n-69)/12);
export const stereoWidth=mode=>mode==='mono'?0:mode==='headphones'?.45:1;
