// Seasons and pressure: water temperature by day of year for a shallow Pennsylvania cove, the
// optical preset for the season, each species' comfort band turned into an activity factor, the
// barometric trend (feeding ahead of a front, lockjaw behind it), and Pennsylvania's closed seasons
// as understood from the Fish and Boat Commission's Commonwealth inland-water rules (check them
// each spring: bass are catch-and-immediate-release only from April 15 through the Friday before
// the first Saturday after June 11, with no tournaments; walleye are closed from March 15 through
// the Friday before the first Saturday in May). Pure, node-testable.
import {lakeOptics} from './water-profile.js';
import {localParts} from './game-clock.js';
// Sinusoid lagging the sun by about a month: 36 °F in late January, 80 °F at the start of August.
export function waterTempF(dayOfYear){return 58+22*Math.cos((dayOfYear-213)/365*Math.PI*2);}
export function waterTempC(dayOfYear){return (waterTempF(dayOfYear)-32)*5/9;}
export function seasonName(dayOfYear){return dayOfYear<75||dayOfYear>=340?'winter':dayOfYear<160?'spring':dayOfYear<260?'summer':'fall';}
export const seasonOf=seasonName;
export function seasonOptics(dayOfYear,rain=0){const s=seasonName(dayOfYear);return lakeOptics({season:s,rainDays:rain>.5?1:0,bloom:s==='summer'&&dayOfYear>200&&dayOfYear<245?.6:0});}
// 1 inside the species' band, falling off with a 4.5 °C sigma outside it, never below .2
export function tempFactor(sp,tempC){const [a,b]=sp.tempPref;const mid=(a+b)/2,half=(b-a)/2;const d=Math.abs(tempC-mid)-half;if(d<=0)return 1;return Math.max(.2,Math.exp(-(d*d)/(2*4.5*4.5)));}
// trend in hPa over the last three hours
export function pressureFactor(trend){if(!(Number.isFinite(trend)))return 1;if(trend<=-1.5)return 1.25;if(trend<=-.5)return 1.12;if(trend>=2)return .7;if(trend>=.8)return .85;return 1;}
export function pressureWord(trend){if(!(Number.isFinite(trend)))return 'steady';if(trend<=-1.5)return 'falling fast';if(trend<=-.5)return 'falling';if(trend>=2)return 'rising fast';if(trend>=.8)return 'rising';return 'steady';}
function firstSaturdayAfter(year,month,day){const d=new Date(Date.UTC(year,month-1,day));do{d.setUTCDate(d.getUTCDate()+1);}while(d.getUTCDay()!==6);return d.getTime();}
export function closedSeasonsFor({year,month,day}){
 const today=Date.UTC(year,month-1,day);
 const bass=today>=Date.UTC(year,3,15)&&today<firstSaturdayAfter(year,6,11);
 const walleye=today>=Date.UTC(year,2,15)&&today<firstSaturdayAfter(year,4,30);
 return {bass,walleye};
}
export function closedSeasons(ms,tz){return closedSeasonsFor(localParts(ms,tz));}
export function closedNote(id,closed){
 if(closed.bass&&(id==='largemouth'||id==='smallmouth'))return 'Spring closed season for bass: catch and immediate release, no tournaments';
 if(closed.walleye&&id==='walleye')return 'Walleye season is closed: released at once';
 return null;
}
export function seasonLine(dayOfYear,closed){const s=seasonName(dayOfYear);const notes=[];if(closed.bass)notes.push('bass C&R only');if(closed.walleye)notes.push('walleye closed');return s+(notes.length?' · '+notes.join(', '):'');}
