import {openWaterCourse} from './open-water-course.mjs';

// Synthetic authored scenery for generic wave/pier/bobbing-boat regression
// tests. Public Sunset now uses recovered static shores and roller generators.
export function authoredCoastFixture(){
 return openWaterCourse({id:'authored-coast-fixture',stuntLayout:undefined,
  waveTrain:[-86.25,-39,14,.9],
  ramps:[{id:100,name:'SYNTHETIC JUMP',x:-86.25,z:-57.75,tx:0,tz:1,width:12,length:17,height:2.1,floating:false}],
  crossbars:[{x:-84,z:-98.25,tx:1,tz:0,length:61,depth:3.2,bottom:2.8,top:3.2,material:'wood',pileSpacing:14},
   {x:-80.625,z:18,tx:1,tz:0,length:57.75,depth:3.2,bottom:2.8,top:3.2,material:'wood',pileSpacing:14,pileOffsets:[-24.525,-10.925,2.675,16.275,28.875]}],
  mooredBoats:[{id:'test-launch-0',x:-116.25,z:-96.75,width:3.5,length:10,heading:0},
   {id:'test-launch-1',x:-114,z:18,width:3.5,length:10,heading:0}]});
}
