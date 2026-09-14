// Snags and line care, the pure parts. A lure dragged along the bottom through wood hangs up now
// and then; a snag is cleared the way real ones are (give it slack, then snap the rod: the
// bow-and-snap) or broken off by pulling; line that has rubbed wood or rock frays, and a frayed
// line breaks below its rating until it is retied. Node-testable; angling.js drives it.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// how snaggy each kind of cover is when the lure is on the bottom and moving
export const SNAG_RATE={laydown:.07,stump:.06,dock:.03,riprap:.02,weedbed:.01,pads:.015};
export const ABRADE_RATE={laydown:.05,stump:.05,dock:.035,riprap:.06};
export const FRAYED=.3,RETIE_SECONDS=3;
// per-second chance of hanging up: only on the bottom, only while the lure moves, scaled by the lure's tendency to catch
export function snagChance(featureType,onBottom,speed,lure){
 if(!onBottom||speed<.05)return 0;const base=SNAG_RATE[featureType]||0;if(!base)return 0;
 const hooky=lure&&lure.family==='crank'?1.4:lure&&lure.family==='bait'?.6:lure&&lure.family==='topwater'?0:1;
 return base*hooky*clamp(speed/.4,.3,1.4);
}
// per-second fraying while a fight or a retrieve runs the line over wood or rock
export function abradeRate(featureType,fighting){const r=ABRADE_RATE[featureType]||0;return fighting?r:r*.25;}
// one attempt to free a snag: slack first, then a snap; a snap under load mostly just buries the hook
export function attemptFree(slackSeconds,random){const p=slackSeconds>=.6?.55:.15;return random()<p;}
// pulling on a snag: the line goes at the weakest link, sooner if it is frayed
export function snagBreakSeconds(abrasion){return 2.5*(1-clamp(abrasion,0,1)*.6);}
// effective strength of a frayed line
export function strengthFactor(abrasion){return 1-clamp(abrasion,0,1)*.5;}
export function lineWord(abrasion){return abrasion>=.6?'badly frayed':abrasion>=FRAYED?'frayed':abrasion>=.12?'a little worn':'good';}
