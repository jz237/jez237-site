// The tackle box grows through catches, never through money: three rigs to start, the rest earned
// from the journal. Pure, node-testable.
import {RIGS} from './tackle.js';
export const SONAR_UNLOCK={count:12,label:'twelve fish'};
export function isSonarUnlocked(journal){return (((journal&&journal.catches)||[]).length)>=SONAR_UNLOCK.count;}
export const RIG_UNLOCKS={
 finesse:null,topwater:null,float:null,
 crank:{count:3,label:'three fish in the journal'},
 bottom:{count:6,label:'six fish in the journal'},
 musky:{trophy:1,label:'a trophy-class fish of any species'}
};
function stats(journal){const c=(journal&&journal.catches)||[];return {count:c.length,trophies:c.filter(x=>x.sizeClass==='trophy'||x.sizeClass==='legend').length};}
export function isUnlocked(rigId,journal){const u=RIG_UNLOCKS[rigId];if(u===null||u===undefined)return true;const s=stats(journal);if(u.count!==undefined&&s.count<u.count)return false;if(u.trophy!==undefined&&s.trophies<u.trophy)return false;return true;}
export function unlockedRigs(journal){return RIGS.filter(r=>isUnlocked(r.id,journal)).map(r=>r.id);}
// the next thing the player can earn, for the menu line
export function nextUnlock(journal){
 const s=stats(journal);const locked=RIGS.filter(r=>!isUnlocked(r.id,journal));if(!locked.length){if(!isSonarUnlocked(journal))return `Fish finder unlocks after ${SONAR_UNLOCK.label} (${Math.max(0,SONAR_UNLOCK.count-s.count)} more)`;return null;}
 const r=locked[0],u=RIG_UNLOCKS[r.id];
 if(u.count!==undefined)return `${r.name} unlocks after ${u.label} (${Math.max(0,u.count-s.count)} more)`;
 return `${r.name} unlocks after ${u.label}`;
}
// what a new catch just unlocked, if anything
export function newlyUnlocked(before,journal){const now=unlockedRigs(journal);return now.filter(id=>!before.includes(id)).map(id=>RIGS.find(r=>r.id===id).name);}
