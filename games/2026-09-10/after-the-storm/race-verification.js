import {aiInput} from './race-core.js';
// Verification issues the same inputs available to a rider. It does not move
// craft, award scores, or mark objectives complete.
export function verificationInput(state,r){const input=aiInput(state,r);if(state.mode!=='stunt')return input;
 const s=r.stunt,h=r.hydro,kind=['flip','left','right','flip'][s.nextCheckpoint%4];
 if(h.airborne&&(h.y-h.waterHeight>1.5||s.trick)&&Math.abs(s.angle)<6.20)input.trick=s.trick||kind;
 else if(!h.airborne&&h.wet>.5&&r.next%6>=4){input.trick=['stand','handstand','backwards','stand'][s.nextCheckpoint%4];if(s.pose==='stand'&&s.poseTime>1.2)input.trick='somersault';}
 return input;
}
