export function streetMotionEnabled(state,reducedMotion){
  return state.animationSpeed>0&&state.streetMotion!=='off'
    &&(!reducedMotion||state.streetMotion==='on');
}

export function streetStatus(state,pose,stats,{photo=false,archive=false,reducedMotion=false}={}){
  if(!state.streetLife)return 'Street life is off.';
  if(state.lightweight)return 'Lighter graphics hides simulated traffic.';
  if(archive||state.era!=='present'||state.compareMode!=='off'||!state.layers.structures)
    return 'Simulated traffic needs the present-day building layer.';
  if(pose.dist>=6500)return 'Zoom into central Philadelphia to see moving traffic.';
  if(stats.loading)return 'Loading simulated street traffic…';
  if(stats.failed)return 'Street data could not load. Retrying shortly…';
  if(!streetMotionEnabled(state,reducedMotion))return reducedMotion&&state.streetMotion!=='off'
    &&state.animationSpeed>0?'Traffic paused by reduced motion. Choose Play to animate it.'
    :'Traffic animation is paused. Choose Play to resume.';
  if(!stats.cars)return 'No simulated cars in this view. Show moving traffic in Center City.';
  const area=stats.radius?`within ${Math.round(stats.radius)} m`:'in the surrounding streets';
  return `Simulated traffic · ${stats.moving||0} moving / ${stats.cars-(stats.moving||0)} waiting`
    +` ${area}. Includes off-screen streets and cars hidden by buildings.`
    +(photo?' Moving cars are simulated; parked cars in the imagery remain still.':'');
}
