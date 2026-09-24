/** Give paint, input and network callbacks a turn between construction stages. */
export async function yieldBuild(){
 const scheduler=(globalThis as typeof globalThis & {scheduler?:{yield?:()=>Promise<void>}}).scheduler;
 if(scheduler?.yield)await scheduler.yield();
 else await new Promise<void>(resolve=>setTimeout(resolve,0));
}
