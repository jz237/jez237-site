// Qualitative teaching model: dimensionless flow and media properties, not CFD.
export const defaults = {flow:58, size:50, maturity:75, oxygen:85, pump:true, blocked:false};
export function createSimulation(){
  let time=0, velocity=58, expansion=1.78, mobility=.7, loss=0;
  function snapshot(p=defaults){
    const threshold=24+p.size*.28, ratio=velocity/threshold;
    const regime=!p.pump&&velocity<1?'Settled':ratio<.92?'Packed bed':ratio<1.12?'Beginning to lift':expansion>2.92?'Carryover risk':'Fluidized';
    return {time,velocity,expansion,mobility,loss,threshold,ratio,regime,activity:Math.round(p.maturity/100*p.oxygen*Math.min(1,velocity/35)),headroom:Math.max(0,3.75-expansion*1.18)};
  }
  return {snapshot,reset(){time=0;velocity=58;expansion=1.78;mobility=.7;loss=0;},step(dt,p){
    if(!Number.isFinite(dt)||dt<=0)return snapshot(p);
    dt=Math.min(dt,.1);time+=dt;
    velocity+=((p.pump?p.flow*(p.blocked?.48:1):0)-velocity)*(1-Math.exp(-dt*1.5));
    const threshold=24+p.size*.28,ratio=velocity/threshold;
    const target=Math.min(3.25,1+Math.max(0,ratio-1)*1.5*(1+p.maturity*.002));
    expansion+=(target-expansion)*(1-Math.exp(-dt*(target<expansion?1.1:.65)));
    mobility+=(Math.min(1,Math.max(0,(ratio-.88)*1.3))-mobility)*(1-Math.exp(-dt*1.8));
    if(expansion>2.92)loss=Math.min(.22,loss+dt*.004*(expansion-2.92)/.33);
    return snapshot(p);
  }};
}
