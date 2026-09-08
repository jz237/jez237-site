// Presentation reads only: no move durations, damage or collision boxes change.
export function hitRegion(attack,victim,point){
 if(attack.level==='low')return 'legs';
 if(attack.level==='overhead'||attack.kitAction?.includes('Launcher')||attack.kitAction==='launcher')return 'head';
 const height=Math.max(1,victim.height||180);
 return point&&Number.isFinite(point.y)?(victim.y-point.y)/height>=.7?'head':'body':victim.crouch?'body':'head';
}
export function recoveryProgress(fighter,progress){
 // A missed strike carries through, then retracts briskly. Contact retains its
 // existing recoil. The final guard still lands at the original recovery end.
 if(fighter.attackConnected==='hit'||fighter.attackConnected==='block')return progress;
 return Math.max(0,Math.min(1,progress<.18?progress*.4:.072+(progress-.18)*(.928/.82)));
}
const celebrations={
 jez:[[0,10],[.32,11],[1.8,12],[2.4,11]],
 benny:[[0,12],[.5,11],[2.2,12]],
 alan:[[0,10],[.55,12],[1.1,11]],
 ali:[[0,10],[.25,11],[1.4,12],[2.1,11]],
 commissioner:[[0,10],[.7,11],[2.3,12]],
 cyraxx:[[0,12],[.8,11],[1.65,12]],
 deathblow:[[0,10],[.4,12],[.95,11]],
 devil:[[0,10],[.65,11],[1.6,12]],
 donald:[[0,12],[.6,10],[1.2,11]],
 post:[[0,10],[.45,12],[1.5,11]],
};
export function victoryCell(id,elapsed){
 const beats=celebrations[id]||celebrations.jez;
 return beats.reduce((cell,[time,next])=>elapsed>=time?next:cell,beats[0][1]);
}
