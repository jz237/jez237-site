export function createOpeningCoach(p,stats) {
  return {stage:'move',distance:0,x:p.x,z:p.z,bolts:stats.bolts,hits:stats.hits,goalTime:0};
}
export function advanceOpeningCoach(coach,p,stats,dt,active=true) {
  if(coach.stage==='move') {
    if(active)coach.distance+=Math.hypot(p.x-coach.x,p.z-coach.z);
    if(coach.distance>=1.2)coach.stage='fire';
  } else if(coach.stage==='fire'&&stats.bolts>coach.bolts)coach.stage='return';
  else if(coach.stage==='return'&&stats.hits>coach.hits)coach.stage='goal';
  else if(coach.stage==='goal'){coach.goalTime+=dt;if(coach.goalTime>=5)coach.stage='done';}
  coach.x=p.x;coach.z=p.z;return coach.stage;
}
export function openingMessage(stage,input='key') {
  const move={touch:'Drag in the arena to move your paddle.',mouse:'Move your mouse to steer your paddle.',pad:'Move the left stick to steer your paddle.',key:'Use WASD or the arrow keys to move your paddle.'};
  const fire={touch:'Tap FIRE to launch a plasma bolt.',mouse:'Click to launch a plasma bolt.',pad:'Press A or the right trigger to launch a plasma bolt.',key:'Press Space or F to launch a plasma bolt.'};
  return {
    move:['1 / 3 · MOVE',move[input]||move.key],
    fire:['2 / 3 · FIRE',(fire[input]||fire.key)+' Bolts stun the rival and collect power-ups.'],
    return:['3 / 3 · RETURN THE BALL','Move into the bright ball to send it back. A return is automatic when it touches your paddle.'],
    goal:['BREAK THROUGH','Break the shield wall, then aim through a gap to hit the reactor core.'],
    done:['',''],
  }[stage];
}
