import {nativeDrakeRaceScene} from './source-drake-course.js';
import {nativeFortressRaceScene} from './source-fortress-course.js';

// Only these ordinary courses currently replace an older illustration scene.
// Race-host admission remains independent of preparing/rendering the geometry.
export function nativeRaceScene(course){
 return course.sourceWaterCourseIndex===3?nativeFortressRaceScene(course):nativeDrakeRaceScene(course);
}
