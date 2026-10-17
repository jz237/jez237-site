/** Server-owned pre-countdown barrier. Time advances only through explicit room steps.
 * Never accept a client-provided roster, timeout or readiness for another round. */
export const START_READY_TIMEOUT_MS = 30_000;
export type StartReadinessState = { round:string; pending:number[]; remainingMs:number };
const validSlot=(id:unknown):id is number=>Number.isInteger(id)&&Number(id)>=0&&Number(id)<24;
export function validStartReadiness(value:unknown):value is StartReadinessState {
  if(!value||typeof value!=='object')return false;
  const s=value as StartReadinessState;
  return typeof s.round==='string'&&/^[a-zA-Z0-9-]{1,64}$/.test(s.round)&&Array.isArray(s.pending)&&s.pending.length<=24&&s.pending.every(validSlot)&&new Set(s.pending).size===s.pending.length&&Number.isFinite(s.remainingMs)&&s.remainingMs>=0&&s.remainingMs<=START_READY_TIMEOUT_MS;
}
export class StartReadiness {
  private state:StartReadinessState;
  constructor(round:string,participants:readonly number[]){
    this.state={round,pending:[...participants],remainingMs:participants.length?START_READY_TIMEOUT_MS:0};
    if(!validStartReadiness(this.state))throw Error('Invalid start readiness');
  }
  static restore(saved:unknown){
    if(!validStartReadiness(saved))throw Error('Invalid saved start readiness');
    const barrier=new StartReadiness(saved.round,saved.pending);
    barrier.state.remainingMs=saved.pending.length?saved.remainingMs:0;
    return barrier;
  }
  get waiting(){return this.state.pending.length>0&&this.state.remainingMs>0;}
  snapshot():StartReadinessState{return {...this.state,pending:[...this.state.pending]};}
  acknowledge(slot:number,round:string):boolean {
    if(!this.waiting||round!==this.state.round)return false;
    const at=this.state.pending.indexOf(slot);if(at<0)return false;
    this.state.pending.splice(at,1);if(!this.state.pending.length)this.state.remainingMs=0;
    return true;
  }
  /** New arrivals cannot extend a running barrier. Disconnects release their seat.
   * The caller supplies the authoritative connected roster, never client data. */
  advance(milliseconds:number,connected:ReadonlySet<number>):boolean {
    if(!Number.isFinite(milliseconds)||milliseconds<0)throw Error('Invalid readiness time step');
    if(!this.waiting)return false;
    this.state.pending=this.state.pending.filter(id=>connected.has(id));
    this.state.remainingMs=this.state.pending.length?Math.max(0,this.state.remainingMs-milliseconds):0;
    if(!this.state.remainingMs)this.state.pending=[];
    return this.waiting;
  }
}
