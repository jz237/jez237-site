// Hysteresis keeps a loading hitch from permanently lowering quality and stops oscillation.
// Tiers: saver (30 fps paint, phone thermals) < low < medium < high < ultra (desktop only: real
// trees on the near bank, volumetric mist, 4k shadows). `ceiling` caps what the adapter may promote
// to, so a touch device never climbs past high however fast it runs.
export const QUALITY_LEVELS=['saver','low','medium','high','ultra'];
export function adaptiveQuality(memory,quality,fps,seconds=2,ceiling='high'){
 if(!Number.isFinite(fps)||fps<=0)return quality;
 memory.elapsed=(memory.elapsed||0)+seconds;memory.cooldown=Math.max(0,(memory.cooldown||0)-seconds);
 if(memory.elapsed<4)return quality;
 memory.slow=fps<46?(memory.slow||0)+1:0;memory.fast=fps>=58?(memory.fast||0)+seconds:0;
 const index=QUALITY_LEVELS.indexOf(quality);
 const top=Math.max(0,QUALITY_LEVELS.indexOf(ceiling));
 if(index>0&&(fps<24||memory.slow>=2)){memory.slow=memory.fast=0;memory.cooldown=30;return QUALITY_LEVELS[index-1];}
 if(index<top&&memory.fast>=12&&!memory.cooldown){memory.fast=memory.slow=0;memory.cooldown=30;return QUALITY_LEVELS[index+1];}
 return quality;
}
