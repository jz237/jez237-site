import {makeWorld, wd, wp} from './sim.js?v=26';

// A separate, unranked world uses the real flight, beam, catch and landing rules.
// Keeping its director in intro prevents timed waves or planetary hazards.
export function createPractice() {
  const W=makeWorld({mode:'campaign',sector:0,seed:237,noTut:true,demo:true,diff:'easy',ship:'warden',mast:0});
  W.phaseT=1e9; W.players[0].inv=1e9; W.R.fallV=.8;
  return {world:W,stage:'move',distance:0,x:W.players[0].x,y:W.players[0].y,fired:0,landed:W.stats.landed,settler:null};
}
function dropNearby(session) {
  const W=session.world,p=W.players[0],s=session.settler;
  Object.assign(s,{st:'fall',by:0,x:wp(p.x+(p.face||1)*7),y:Math.max(14,p.y+5),dropY:40,t:0});
}
export function advancePractice(session) {
  const W=session.world,p=W.players[0];
  if(session.stage==='move') {
    session.distance+=Math.hypot(wd(p.x-session.x),p.y-session.y);
    if(session.distance>=8){session.stage='fire';session.fired=W.stats.fired;}
  } else if(session.stage==='fire'&&W.stats.fired-session.fired>=3) {
    session.stage='catch'; session.settler=W.settlers[0]; dropNearby(session);
  } else if(session.stage==='catch') {
    if(p.carry===session.settler.id)session.stage='land';
    else if(session.settler.st!=='fall')dropNearby(session);
  } else if(session.stage==='land') {
    if(W.stats.landed>session.landed)session.stage='done';
    else if(!p.carry){session.stage='catch';dropNearby(session);}
  }
  session.x=p.x;session.y=p.y;
  return session.stage;
}
