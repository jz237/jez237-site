import {nativeDrakeRaceScene} from './source-drake-course.js?v=0de61eeb1bd1';
import {nativeFortressRaceScene} from './source-fortress-course.js?v=0de61eeb1bd1';
import {nativePortRaceScene} from './source-port-race-course.js?v=0de61eeb1bd1';
import {nativeTwilightRaceScene} from './source-twilight-race-course.js?v=0de61eeb1bd1';

// Only these ordinary courses currently replace an older illustration scene.
// Race-host admission remains independent of preparing/rendering the geometry.
export function nativeRaceScene(course){
 return course.sourceWaterCourseIndex===3?nativeFortressRaceScene(course):course.sourceWaterCourseIndex===5?nativePortRaceScene(course):course.sourceWaterCourseIndex===6?nativeTwilightRaceScene(course):nativeDrakeRaceScene(course);
}
