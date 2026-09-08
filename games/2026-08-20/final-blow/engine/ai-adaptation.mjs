// Bounded, short-term memory of reaction-delayed visible behavior.
// Old patterns expire so changing tactics can fool the CPU again.
export function createOpponentMemory() {
  return {last:null, events:[], guards:[], lastGuardSample:-Infinity};
}
export function learnOpponent(memory, observation) {
  const prior=memory.last;
  if(prior && observation.frame<=prior.frame)return;
  const frame=observation.frame;
  memory.events=memory.events.filter(event=>frame-event.frame<=900);
  memory.guards=memory.guards.filter(sample=>frame-sample.frame<=900);
  if(prior){
    if(prior.grounded && !observation.grounded && !observation.down && !observation.juggled)
      memory.events.push({frame,type:'jump'});
    if(observation.attacking && (!prior.attacking || observation.attackFrame<prior.attackFrame
      || observation.attackKind!==prior.attackKind))
      memory.events.push({frame,type:'attack',kind:observation.attackKind,level:observation.attackLevel});
  }
  if(frame-memory.lastGuardSample>=30){
    memory.guards.push({frame,guarding:observation.guarding});memory.lastGuardSample=frame;
  }
  memory.events=memory.events.slice(-64);
  memory.last={...observation};
}
export function opponentHabits(memory) {
  const events=memory?.events || [], attacks=events.filter(event=>event.type==='attack');
  const count=(key,value)=>attacks.filter(event=>event[key]===value).length;
  const guards=memory?.guards || [];
  return {
    jumps:events.filter(event=>event.type==='jump').length,
    attacks:attacks.length,
    repeatedLow:attacks.length>=3 && count('level','low')/attacks.length>=.6,
    repeatedHeavy:attacks.length>=3 && count('kind','heavy')/attacks.length>=.6,
    holdsGuard:guards.length>=6 && guards.filter(sample=>sample.guarding).length/guards.length>=.65,
  };
}
