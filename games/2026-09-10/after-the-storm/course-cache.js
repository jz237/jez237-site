// Only retain the active GPU world. A new venue still disposes the previous one.
// Layout-affecting modes/classes must rebuild; liveries, laps and waves do not.
export function courseWorldKey(course,freeRide=false){
 return [course.id,course.difficulty??0,!!course.reverse,!!course.stunt,!!course.freeStunts,freeRide].join(':');
}
