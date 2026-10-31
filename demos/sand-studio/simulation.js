// Qualitative teaching model: dimensionless flow and media properties, not CFD.
export const defaults = {flow:58, size:50, maturity:75, oxygen:85, pump:true, blocked:false};
export function createSimulation(){
  let time=0, velocity=58, expansion=1.78, mobility=.7, loss=0,flowPhase=0;
  function snapshot(p=defaults){
    const threshold=24+p.size*.28, ratio=velocity/threshold;
    const settledHeight=1.18*(1-loss),bedHeight=settledHeight*expansion,headroom=Math.max(0,3.89-bedHeight),carryover=bedHeight>3.45&&mobility>.5;
    const regime=!p.pump&&velocity<1?'Settled':ratio<.92?'Packed bed':ratio<1.12?'Beginning to lift':carryover?'Carryover risk':'Fluidized';
    return {time,velocity,expansion,mobility,loss,flowPhase,settledHeight,bedHeight,carryover,threshold,ratio,regime,activity:Math.round(p.maturity/100*p.oxygen*Math.min(1,velocity/35)),headroom};
  }
  return {snapshot,reset(){time=0;velocity=58;expansion=1.78;mobility=.7;loss=0;flowPhase=0;},step(dt,p){
    if(!Number.isFinite(dt)||dt<=0)return snapshot(p);
    dt=Math.min(dt,.1);time+=dt;
    velocity+=((p.pump?p.flow*(p.blocked?.48:1):0)-velocity)*(1-Math.exp(-dt*1.5));
    flowPhase+=dt*velocity/58;
    const threshold=24+p.size*.28,ratio=velocity/threshold;
    const target=Math.min(3.25,1+Math.max(0,ratio-1)*1.5*(1+p.maturity*.002));
    expansion+=(target-expansion)*(1-Math.exp(-dt*(target<expansion?1.1:.65)));
    mobility+=(Math.min(1,Math.max(0,(ratio-.88)*1.3))-mobility)*(1-Math.exp(-dt*1.8));
    const bedHeight=1.18*(1-loss)*expansion;
    if(bedHeight>3.45&&mobility>.5)loss=Math.min(.22,loss+dt*.006*Math.min(1,(bedHeight-3.45)/.38));
    return snapshot(p);
  }};
}
