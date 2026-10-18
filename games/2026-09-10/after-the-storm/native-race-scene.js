import {nativeDrakeRaceScene} from './source-drake-course.js';
import {nativeFortressRaceScene} from './source-fortress-course.js';
import {nativePortRaceScene} from './source-port-race-course.js';
import {nativeTwilightRaceScene} from './source-twilight-race-course.js';

// Only these ordinary courses currently replace an older illustration scene.
// Race-host admission remains independent of preparing/rendering the geometry.
export function nativeRaceScene(course){
 return course.sourceWaterCourseIndex===3?nativeFortressRaceScene(course):course.sourceWaterCourseIndex===5?nativePortRaceScene(course):course.sourceWaterCourseIndex===6?nativeTwilightRaceScene(course):nativeDrakeRaceScene(course);
}
