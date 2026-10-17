export type LoadingStage={name:string;start:()=>Promise<unknown>};
export type LoadingReport={stage:string;phase:'submit'|'waiting'|'ready'|'failed';elapsedMs:number};
/** Submit all independent jobs before waiting, retaining the original barrier.
 * Reporting never changes rendering, falls back early, or abandons a job. */
export async function prepareLoadingStages(stages:LoadingStage[],report:(event:LoadingReport)=>void,now=()=>performance.now()){
 const pending=stages.map(({name,start})=>{const began=now();const emit=(phase:LoadingReport['phase'])=>report({stage:name,phase,elapsedMs:Math.round(now()-began)});emit('submit');try{const job=start();emit('waiting');return job.then(()=>emit('ready'),error=>{emit('failed');throw error;});}catch(error){emit('failed');return Promise.reject(error);}});
 await Promise.all(pending);
}
