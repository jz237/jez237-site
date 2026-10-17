/** Derby scoring and respawn policy; legacy event formats retain their rules. */
export type DerbyFormat='survival'|'score'|'score-no-respawn';
export const DERBY_FORMATS:Record<DerbyFormat,{label:string;scored:boolean;respawns:boolean}>={
 survival:{label:'Last car standing',scored:false,respawns:false},
 score:{label:'Score derby · respawns',scored:true,respawns:true},
 'score-no-respawn':{label:'Score derby · no respawns',scored:true,respawns:false},
};
export function readDerbyFormat(value:unknown):DerbyFormat{return value==='score'||value==='score-no-respawn'?value:'survival';}
export function derbyEndReason(format:DerbyFormat,cars:readonly {health:number}[],elapsed:number,duration:number):'time'|'elimination'|null{
 // Never conclude while the roster is absent or the simulation clock is invalid.
 if(cars.length<2||!Number.isFinite(elapsed)||elapsed<0||!Number.isFinite(duration)||duration<=0)return null;
 if(elapsed>=duration)return 'time';
 if(!DERBY_FORMATS[format].respawns&&cars.filter(c=>c.health>0).length<=1)return 'elimination';
 return null;
}
export function derbyRecordPrefix(format:DerbyFormat,rivals=false,gradedSpins=false){if(gradedSpins&&DERBY_FORMATS[format].scored)return (format==='score-no-respawn'?'score-elimination-v3':'score-derby-v4')+(rivals?'':'-no-rivals');if(rivals&&DERBY_FORMATS[format].scored)return format==='score-no-respawn'?'score-elimination-v2':'score-derby-v3';return format==='score-no-respawn'?'score-elimination-v1':format==='score'?'score-derby-v2':'derby';}
export function derbyWreckStatus(format:DerbyFormat,respawnAt:number,elapsed:number){
 if(!DERBY_FORMATS[format].respawns)return 'WRECKED · WATCHING REMAINING DRIVERS';
 return elapsed<respawnAt?`WRECKED · RESPAWN IN ${Math.ceil(respawnAt-elapsed)}s`:'WAITING FOR A CLEAR SPAWN';
}
