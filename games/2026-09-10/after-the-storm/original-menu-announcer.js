// Sequence0/channel12, special IO0=127. At tempo200 with48 ticks per
// quarter, one tick is6.25ms. These are layer events, not a guessed playlist.
export const ANNOUNCER_TICK=1/160;
export function originalMenuAnnouncerPlan(selector){
 if(!Number.isInteger(selector)||selector<0||selector>29)return null;
 const layer=(tick,note,pans=[[0,64]])=>({tick,note,pans});
 if(selector<16)return {busyTicks:0,layers:[layer(0,selector)]};
 if(selector<26)return {busyTicks:281,layers:[layer(140,16),layer(275,selector+1)]};
 // The channel waits100 ticks and then polls after6 more. Legato keeps one
 // sample running across pan changes; repeated notes do not restart it.
 if(selector===26)return {busyTicks:106,layers:[layer(0,26,[[0,32],[60,96]])]};
 if(selector===27)return {busyTicks:106,layers:[layer(0,27,[[0,32],[60,64],[90,96]])]};
 return {busyTicks:106,layers:[layer(0,selector===28?null:28)]};
}
