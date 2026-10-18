import {nativeDrakeRaceScene} from './source-drake-course.js?v=8e78b4f796b7';
import {nativeFortressRaceScene} from './source-fortress-course.js?v=8e78b4f796b7';

// Only these ordinary courses currently replace an older illustration scene.
// Race-host admission remains independent of preparing/rendering the geometry.
export function nativeRaceScene(course){
 return course.sourceWaterCourseIndex===3?nativeFortressRaceScene(course):nativeDrakeRaceScene(course);
}
