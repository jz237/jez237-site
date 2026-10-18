import {nativeDrakeRaceScene} from './source-drake-course.js?v=d5529706860a';
import {nativeFortressRaceScene} from './source-fortress-course.js?v=d5529706860a';
import {nativePortRaceScene} from './source-port-race-course.js?v=d5529706860a';

// Only these ordinary courses currently replace an older illustration scene.
// Race-host admission remains independent of preparing/rendering the geometry.
export function nativeRaceScene(course){
 return course.sourceWaterCourseIndex===3?nativeFortressRaceScene(course):course.sourceWaterCourseIndex===5?nativePortRaceScene(course):nativeDrakeRaceScene(course);
}
