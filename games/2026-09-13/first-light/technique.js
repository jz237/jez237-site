// The retrieve technique recognizer: a three-second window over reel state and rod twitches,
// classified into the named vocabulary anglers use. Feeds the HUD, the buddy's voice, the journal
// and (M2.3) each species' technique preferences.
export const TECHNIQUES=['idle','dead stick','straight retrieve','slow roll','stop & go','twitching','lift & drop','walking the dog'];
export function createRecognizer(){return {samples:[],twitches:[],label:'idle',since:0};}
export function recordSample(r,t,reeling){r.samples.push({t,reeling:reeling?1:0});prune(r,t);}
export function recordTwitch(r,t){r.twitches.push(t);prune(r,t);}
function prune(r,t){while(r.samples.length&&r.samples[0].t<t-3)r.samples.shift();while(r.twitches.length&&r.twitches[0]<t-3)r.twitches.shift();}
export function classify(r,t,lure,{inWater=true,onBottom=false,moving=false}={}){
 prune(r,t);const s=r.samples;if(!inWater||s.length<8){r.label='idle';return r.label;}
 let reel=0,toggles=0;for(let i=0;i<s.length;i++){reel+=s[i].reeling;if(i>0&&s[i].reeling!==s[i-1].reeling)toggles++;}
 const reelFrac=reel/s.length,tw=r.twitches.length;
 let label;
 if(moving&&reelFrac<.3&&tw===0)label='trolling';
 else if(reelFrac<.05&&tw===0)label='dead stick';
 else if(tw>=3&&lure&&lure.family==='topwater'&&reelFrac<.7)label='walking the dog';
 else if(tw>=2&&reelFrac<.3&&(onBottom||(lure&&lure.buoyancy==='sink')))label='lift & drop';
 else if(tw>=2)label='twitching';
 else if(toggles>=3)label='stop & go';
 else if(reelFrac>.85)label='straight retrieve';
 else if(reelFrac>.3)label='slow roll';
 else label='dead stick';
 if(label!==r.label){r.label=label;r.since=t;}
 return label;
}
