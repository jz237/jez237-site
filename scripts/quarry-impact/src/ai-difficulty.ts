/** Difficulty changes driving intent, never vehicle physics or damage. Amateur
 * preserves the original driver, including its existing record categories. */
export const AI_DIFFICULTIES = {
  novice: {label:'Novice', description:'A gentler race pace and less aggressive derby attacks.', racePace:.78, derbyPace:.8, interceptLead:.7},
  amateur: {label:'Amateur', description:'The original balanced drivers.', racePace:1, derbyPace:1, interceptLead:1},
  expert: {label:'Expert', description:'Faster straights and more committed moving-target attacks.', racePace:1.1, derbyPace:1.1, interceptLead:1.15},
} as const;
export type AIDifficulty=keyof typeof AI_DIFFICULTIES;
export const isAIDifficulty=(value:unknown):value is AIDifficulty=>typeof value==='string'&&Object.hasOwn(AI_DIFFICULTIES,value);
export const readAIDifficulty=(value:unknown):AIDifficulty=>isAIDifficulty(value)?value:'amateur';
export const difficultyRecordKey=(key:string,difficulty:AIDifficulty)=>difficulty==='amateur'?key:`${key}:ai-${difficulty}`;
export function sessionAIDifficulty(custom:boolean,demo:boolean,event:unknown,demonstration:unknown):AIDifficulty{
  return readAIDifficulty(demo?demonstration:custom?event:undefined);
}
