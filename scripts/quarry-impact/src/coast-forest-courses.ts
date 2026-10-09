import {createCountyCourse} from './county-course';
/** Long seaside straight, sweeping headland and an inland double bend. */
export const SEABROOK=createCountyCourse({
 id:'seabrook-coast-v1',name:'Seabrook Coast Circuit',startZ:-118,
 controls:[[-125,-118],[0,-118],[125,-118],[173,-69],[175,12],[133,87],[55,130],[-15,108],[-63,58],[-130,85],[-175,33],[-173,-52]],
 height:()=>0,asphalt:()=>true,
});
/** Gravel loop with a broad wooded crest, flowing esses and a flat full grid. */
export function hazelwoodHeight(x:number,z:number){
 const t=Math.max(0,Math.min(1,(z+80)/100));
 return t*t*(3-2*t)*(1.2+2.8*(1+Math.cos(Math.min(1,Math.abs(x-35)/150)*Math.PI))/2);
}
export const HAZELWOOD=createCountyCourse({
 id:'hazelwood-forest-v1',name:'Hazelwood Forest Rally',startZ:-118,
 controls:[[-125,-118],[0,-118],[125,-118],[174,-60],[137,5],[168,75],[111,128],[44,92],[-22,124],[-90,107],[-159,70],[-174,5],[-160,-60]],
 height:hazelwoodHeight,asphalt:()=>false,
});
export const COAST_FOREST_COURSES=[SEABROOK,HAZELWOOD] as const;
