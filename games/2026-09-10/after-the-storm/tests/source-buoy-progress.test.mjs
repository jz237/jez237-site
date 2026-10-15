import test from 'node:test';
import assert from 'node:assert/strict';
import {SOURCE_BUOY_STEP_MS,createSourceBuoyLayout,createSourceBuoyProgress,
 stepSourceBuoyProgress,sourceBuoyCourseRules,sourceBuoyRegions,sourceBuoyVisibleRow} from '../source-buoy-progress.js';
import {TWILIGHT_NATIVE_GEOMETRY} from '../source-twilight-course.js';

// Literal expected state vectors independently obtained from bounded source
// consumer execution. Fixtures contain numeric inputs/results, no executable
// source, ROM bytes or dependency on private evidence paths.
// State vector: nextRow,side,armed,power,lapMisses,totalMisses,limitReached,
// missedCheckpoint,logicalTicks. The code under test never derives expectations.
const rawFixtures=[
 {"name":"race finish side0 x-12000","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[-12000,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[-12000,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"race finish side0 x-500","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[-500,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[-500,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"race finish side0 x0","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[0,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[0,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"race finish side0 x500","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[500,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[500,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"race finish side0 x1012","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[1012,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[1012,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"race finish side0 x1012.125","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[1012.125,-10],[0,-1,true,0,0,0,false,false,1],0,false,false,false],[[1012.125,10],[0,1,false,0,0,0,false,false,2],0,false,false,false]]},
 {"name":"race finish side1 x-1012.125","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":1,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[-1012.125,-10],[0,-1,true,0,0,0,false,false,1],0,false,false,false],[[-1012.125,10],[0,0,false,0,0,0,false,false,2],0,false,false,false]]},
 {"name":"race finish side1 x-1012","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":1,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[-1012,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[-1012,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"race finish side1 x-500","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":1,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[-500,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[-500,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"race finish side1 x0","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":1,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[0,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[0,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"race finish side1 x500","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":1,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[500,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[500,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"race finish side1 x12000","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":1,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[12000,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[12000,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"stunt class3 x-500.125","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"lapLegalCounter":0},"frames":[[[-500.125,-10],[0,-1,true,0,0,0,false,false,1],0,false,false,false],[[-500.125,10],[0,0,false,0,0,0,false,true,2],0,false,false,false]]},
 {"name":"stunt class3 x-500","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"lapLegalCounter":0},"frames":[[[-500,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[-500,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"stunt class3 x0","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"lapLegalCounter":0},"frames":[[[0,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[0,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"stunt class3 x500","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"lapLegalCounter":0},"frames":[[[500,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[500,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"stunt class3 x500.125","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"lapLegalCounter":0},"frames":[[[500.125,-10],[0,-1,true,0,0,0,false,false,1],0,false,false,false],[[500.125,10],[0,1,false,0,0,0,false,true,2],0,false,false,false]]},
 {"name":"stunt class2 x-800.125","rows":[[0,0,2,0],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"lapLegalCounter":0},"frames":[[[-800.125,-10],[0,-1,true,0,0,0,false,false,1],0,false,false,false],[[-800.125,10],[0,0,false,0,0,0,false,true,2],0,false,false,false]]},
 {"name":"stunt class2 x-800","rows":[[0,0,2,0],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"lapLegalCounter":0},"frames":[[[-800,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[-800,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"stunt class2 x0","rows":[[0,0,2,0],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"lapLegalCounter":0},"frames":[[[0,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[0,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"stunt class2 x800","rows":[[0,0,2,0],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"lapLegalCounter":0},"frames":[[[800,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[800,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"stunt class2 x800.125","rows":[[0,0,2,0],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"lapLegalCounter":0},"frames":[[[800.125,-10],[0,-1,true,0,0,0,false,false,1],0,false,false,false],[[800.125,10],[0,1,false,0,0,0,false,true,2],0,false,false,false]]},
 {"name":"race oblique heading45 tangent1012","rows":[[0,0,3,45],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[708.52099609375,-722.6631469726562],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[722.6631469726562,-708.52099609375],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"race oblique heading45 tangent1012.125","rows":[[0,0,3,45],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[708.609375,-722.7515258789062],[0,-1,true,0,0,0,false,false,1],0,false,false,false],[[722.7515258789062,-708.609375],[0,1,false,0,0,0,false,false,2],0,false,false,false]]},
 {"name":"stunt oblique heading45 tangent500","rows":[[0,0,3,45],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[346.4823303222656,-360.62445068359375],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[360.62445068359375,-346.4823303222656],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"stunt oblique heading45 tangent500.125","rows":[[0,0,3,45],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[346.5707092285156,-360.71282958984375],[0,-1,true,0,0,0,false,false,1],0,false,false,false],[[360.71282958984375,-346.5707092285156],[0,1,false,0,0,0,false,true,2],0,false,false,false]]},
 {"name":"race oblique heading135 tangent1012","rows":[[0,0,3,135],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[-722.6631469726562,-708.52099609375],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[-708.52099609375,-722.6631469726562],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"race oblique heading135 tangent1012.125","rows":[[0,0,3,135],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[-722.7515258789062,-708.609375],[0,-1,true,0,0,0,false,false,1],0,false,false,false],[[-708.609375,-722.7515258789062],[0,1,false,0,0,0,false,false,2],0,false,false,false]]},
 {"name":"stunt oblique heading135 tangent500","rows":[[0,0,3,135],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[-360.62445068359375,-346.4823303222656],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[-346.4823303222656,-360.62445068359375],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"stunt oblique heading135 tangent500.125","rows":[[0,0,3,135],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[-360.71282958984375,-346.5707092285156],[0,-1,true,0,0,0,false,false,1],0,false,false,false],[[-346.5707092285156,-360.71282958984375],[0,1,false,0,0,0,false,true,2],0,false,false,false]]},
 {"name":"colored c0 x25","rows":[[0,0,0,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[25,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[25,10],[1,-1,true,0,1,1,false,false,2],2,true,null,false]]},
 {"name":"colored c0 x24.875","rows":[[0,0,0,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[24.875,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[24.875,10],[1,-1,true,1,0,0,false,false,2],1,true,null,false]]},
 {"name":"colored c1 x-25","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[-25,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[-25,10],[1,-1,true,1,0,0,false,false,2],1,true,null,false]]},
 {"name":"colored c1 x-25.125","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[-25.125,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[-25.125,10],[1,-1,true,0,1,1,false,false,2],2,true,null,false]]},
 {"name":"wrong side misses disabled","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"missesEnabled":false},"frames":[[[-26,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[-26,10],[1,-1,true,0,0,0,false,false,2],0,true,null,false]]},
 {"name":"wrong side non-race state","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"mainState":2},"frames":[[[-26,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[-26,10],[1,-1,true,0,0,0,false,false,2],0,true,null,false]]},
 {"name":"wrong side AI","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"human":false},"frames":[[[-26,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[-26,10],[1,-1,true,0,0,0,false,false,2],2,true,null,false]]},
 {"name":"wrong side positive threshold","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"missLimit":1},"frames":[[[-26,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[-26,10],[1,-1,true,0,1,1,true,false,2],2,true,null,false]]},
 {"name":"wrong side zero threshold","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"missLimit":0},"frames":[[[-26,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[-26,10],[0,0,true,0,1,1,true,false,2],0,false,null,true]]},
 {"name":"wrong side finished","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"finished":true},"frames":[[[-26,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[-26,10],[1,-1,true,0,0,0,false,false,2],0,true,null,false]]},
 {"name":"wrong side disqualified","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"disqualified":true},"frames":[[[-26,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[-26,10],[1,-1,true,0,0,0,false,false,2],0,true,null,false]]},
 {"name":"correct at max power","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":5,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[20,-10],[0,-1,true,5,0,0,false,false,1],0,false,null,false],[[20,10],[1,-1,true,5,0,0,false,false,2],1,true,null,false]]},
 {"name":"lap counter mismatch","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{"lap":1,"lapLegalCounter":0},"frames":[[[20,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[20,10],[0,1,false,0,0,0,false,false,2],0,false,null,false]]},
 {"name":"initial positive remains unarmed","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[50,10],[0,1,false,0,0,0,false,false,1],0,false,null,false]]},
 {"name":"region failure needs negative retry","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[1400,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[1400,10],[0,1,false,0,0,0,false,false,2],0,false,null,false],[[-50,10],[0,1,false,0,0,0,false,false,3],0,false,null,false],[[-50,-10],[0,-1,true,0,0,0,false,false,4],0,false,null,false],[[-50,10],[1,-1,true,0,1,1,false,false,5],2,true,null,false]]},
 {"name":"disabled colored bypasses region and awards","rows":[[0,0,7,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[1400,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[1400,10],[1,-1,true,0,0,0,false,false,2],0,true,null,false]],"enabled":false},
 {"name":"course3 guide still requires region","rows":[[0,0,8,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":3,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[1400,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[1400,10],[0,1,false,0,0,0,false,false,2],0,false,null,false]],"enabled":false},
 {"name":"other unscored guide bypasses region","rows":[[0,0,8,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[[700.0,30000.0,-1800.0,30000.0],[-30000.0,1250.0,-1800.0,30000.0],[700.0,30000.0,-30000.0,200.0],[-30000.0,1250.0,-30000.0,200.0]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[1400,-10],[0,-1,true,0,0,0,false,false,1],0,false,null,false],[[1400,10],[1,-1,true,0,0,0,false,false,2],0,true,null,false]],"enabled":false},
 {"name":"stunt ignores coarse region","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"stunt","courseIndex":6,"checkpointSide":0,"checkpointSlackNative":512,"regionsNative":[]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[0,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[0,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"training finish upper span","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":0,"checkpointSide":0,"checkpointSlackNative":256,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[626,-10],[0,-1,true,0,0,0,false,false,1],0,false,true,false],[[626,10],[1,-1,true,0,0,0,false,false,2],0,true,true,false]]},
 {"name":"training finish upper span rejected","rows":[[0,0,3,0],[0,1000,7,0]],"layout":{"mode":"race","courseIndex":0,"checkpointSide":0,"checkpointSlackNative":256,"regionsNative":[[-30000,30000,-30000,30000]]},"initial":{"nextSourceRow":0,"side":-1,"armed":false,"power":0,"lapMisses":0,"totalMisses":0,"missLimitReached":false,"missedCheckpoint":false,"logicalTicks":0},"sample":{},"frames":[[[626.125,-10],[0,-1,true,0,0,0,false,false,1],0,false,false,false],[[626.125,10],[0,1,false,0,0,0,false,false,2],0,false,false,false]]}
];
const stateKeys=['nextSourceRow','side','armed','power','lapMisses','totalMisses','missLimitReached','missedCheckpoint','logicalTicks'];
const stateVector=s=>stateKeys.map(k=>s[k]);
const world=(p,scale=.025)=>({x:p[0]*scale,z:p[1]*scale});

for(const fixture of rawFixtures)test(`source consumer fixture: ${fixture.name}`,()=>{
 const options={...fixture.layout,rows:fixture.rows};
 let layout=createSourceBuoyLayout(options);
 if(fixture.enabled!==undefined)layout=createSourceBuoyLayout({...options,rows:undefined,nodes:layout.nodes.map((n,i)=>i===0?{...n,enabled:fixture.enabled}:n)});
 let state=createSourceBuoyProgress(layout,fixture.initial),previousPosition;
 for(const [nativePosition,expected,code,advanced,spanPass,immediate] of fixture.frames){
  const snapshot=structuredClone(state),position=world(nativePosition);
  const actual=stepSourceBuoyProgress(layout,state,{lap:1,...fixture.sample,position,previousPosition});
  assert.deepEqual(state,snapshot,'step mutates no input state');
  assert.deepEqual(stateVector(actual.state),expected,JSON.stringify(nativePosition));
  assert.equal(actual.event?.nativeEventCode??0,code);
  assert.equal(actual.event?.advanced??false,advanced);
  assert.equal(actual.event?.immediateDisqualification??false,immediate);
  if(spanPass!==null)assert.equal(actual.diagnostic.spanPass,spanPass);
  state=actual.state;previousPosition=position;
 }
});

test('course headers, reverse selection and slack preserve independent numeric facts',()=>{
 const forward=[0,0,0,1,0,1,0,0,1,0],slack=[256,256,1200,256,256,256,512,1300,512,256];
 const regionCounts=[1,4,3,5,4,4,4,4,5,1];
 for(let courseIndex=0;courseIndex<10;courseIndex++){
  const rule=sourceBuoyCourseRules(courseIndex);
  assert.equal(rule.checkpointSide,forward[courseIndex]);
  assert.equal(rule.checkpointSlackNative,slack[courseIndex]);
  assert.equal(rule.regionsNative.length,regionCounts[courseIndex]);
  assert.equal(sourceBuoyCourseRules(courseIndex,{reverse:true}).checkpointSide,forward[courseIndex]^1);
  assert.equal(sourceBuoyCourseRules(courseIndex,{reverseOverride:true}).checkpointSide,forward[courseIndex]^1);
  assert.equal(sourceBuoyCourseRules(courseIndex,{reverse:true,mainState:8}).checkpointSide,forward[courseIndex]);
  assert.throws(()=>rule.regionsNative[0][0]=1,TypeError);
 }
 assert.deepEqual(sourceBuoyCourseRules(5).regionsNative,[[-30000,-600,-30000,-1250],[-3750,30000,-3250,27500],[-3750,30000,-30000,-1250],[-30000,-2000,-3250,27500]]);
});

test('coarse region consumer retains first and last overlap, inclusive boundaries',()=>{
 const layout=createSourceBuoyLayout({rows:[[0,0,3,0]]});
 assert.deepEqual(sourceBuoyRegions(layout,world([1000,0])),[0,3]);
 assert.deepEqual(sourceBuoyRegions(layout,world([700,-1800])),[0,3]);
 assert.deepEqual(sourceBuoyRegions(layout,world([1250,200])),[0,3]);
 assert.deepEqual(sourceBuoyRegions(layout,world([-50,-3000])),[3,-1]);
 assert.deepEqual(sourceBuoyRegions(layout,world([30001,0])),[-1,-1]);
});

test('raw guides require their own planes while alternate groups are skipped by source links',()=>{
 const rows=[[0,0,3,0],[0,100,8,0],[0,150,11,0],[0,200,6,0],[0,300,4,0],[0,400,17,0],[0,500,23,0]];
 const layout=createSourceBuoyLayout({rows});
 assert.deepEqual(layout.nodes.map(n=>[n.classification,n.routeGroup,n.enabled,n.checkpoint]),[
  [3,0,true,true],[4,1,false,false],[4,2,false,false],[0,1,true,false],[0,0,false,false],[4,4,false,false],[4,6,false,false]
 ]);
 assert.deepEqual(layout.nodes.map(n=>n.nextSourceRow),[1,3,3,4,0,6,0]);
 assert.equal(layout.nodes[0].nextVisibleSourceRow,3);
 assert.equal(sourceBuoyVisibleRow(layout,1),3);
 let state=createSourceBuoyProgress(layout);
 state=stepSourceBuoyProgress(layout,state,{position:world([-40,-10])}).state;
 const finish=stepSourceBuoyProgress(layout,state,{position:world([-40,10])});
 assert.equal(finish.event.sourceRow,0);assert.equal(finish.state.nextSourceRow,1);
 const guide=stepSourceBuoyProgress(layout,finish.state,{position:world([-40,110])});
 assert.equal(guide.event.sourceRow,1);assert.equal(guide.event.kind,'guide');
 assert.equal(guide.event.nativeEventCode,0);assert.equal(guide.state.power,0);assert.equal(guide.state.nextSourceRow,3);
 assert.equal(guide.event.nextVisibleSourceRow,3);
 const buoy=stepSourceBuoyProgress(layout,guide.state,{position:world([-40,210])});
 assert.equal(buoy.event.sourceRow,3);assert.equal(buoy.event.nativeEventCode,1);assert.equal(buoy.state.power,1);
});

test('City inner lane accepts actual sequential outer planes in both forward source classes',()=>{
 for(const nativeClass of [1,2]){
  const layout=createSourceBuoyLayout({rows:TWILIGHT_NATIVE_GEOMETRY.racePrimaryByClass[nativeClass]});
  let state=createSourceBuoyProgress(layout,{nextSourceRow:1});const events=[];
  const positions=[];
  for(let z=-4000;z<=4320;z+=20)positions.push([-50,z]);
  for(let x=-30;x<=2240;x+=20)positions.push([x,4320]);
  for(const p of positions){const q=stepSourceBuoyProgress(layout,state,{position:world(p),lap:1});state=q.state;if(q.event)events.push(q.event);}
  assert.deepEqual(events.map(e=>e.sourceRow),[1,3,5,6,7,11,12]);
  assert.ok(events.every(e=>e.nativeEventCode===1&&e.advanced));
  assert.equal(state.totalMisses,0);assert.equal(state.nextSourceRow,21);
 }
});

test('one sample can advance only one source row, even when later planes are already behind',()=>{
 const layout=createSourceBuoyLayout({rows:[[0,0,3,0],[0,100,8,0],[0,200,7,0]]});
 let state=createSourceBuoyProgress(layout);
 state=stepSourceBuoyProgress(layout,state,{position:world([50,-1])}).state;
 const first=stepSourceBuoyProgress(layout,state,{position:world([50,1000])});
 assert.equal(first.event.sourceRow,0);assert.equal(first.state.nextSourceRow,1);
 const second=stepSourceBuoyProgress(layout,first.state,{position:world([50,1000])});
 assert.equal(second.event.sourceRow,1);assert.equal(second.state.nextSourceRow,2);
 assert.equal(second.state.logicalTicks,3);assert.equal(SOURCE_BUOY_STEP_MS,50);
});

test('paused samples preserve arming and counters without queued catch-up',()=>{
 const layout=createSourceBuoyLayout({rows:[[0,0,7,0],[0,1000,3,0]]});
 const initial=createSourceBuoyProgress(layout,{nextSourceRow:0});
 const armed=stepSourceBuoyProgress(layout,initial,{position:world([50,-1])}).state;
 const paused=stepSourceBuoyProgress(layout,armed,{active:false});
 assert.deepEqual(paused.state,armed);assert.equal(paused.event,null);assert.equal(paused.diagnostic,null);
 const resumed=stepSourceBuoyProgress(layout,paused.state,{position:world([50,1])});
 assert.equal(resumed.event.sourceRow,0);assert.equal(resumed.state.logicalTicks,2);
});

test('world scale is explicit and gate admission ignores craft height',()=>{
 for(const scale of [.025,.05,.1]){
  const layout=createSourceBuoyLayout({rows:[[0,0,7,0],[0,1000,3,0]],scale});
  let state=createSourceBuoyProgress(layout,{nextSourceRow:0});
  state=stepSourceBuoyProgress(layout,state,{position:{...world([-25,-10],scale),y:999}}).state;
  const q=stepSourceBuoyProgress(layout,state,{position:{...world([-25,10],scale),y:-999}});
  assert.equal(q.event.nativeEventCode,1);assert.equal(q.state.power,1);
 }
});

test('CP timing uses actual source plane distances and a 50-unit truncation',()=>{
 const layout=createSourceBuoyLayout({rows:[[0,0,3,0],[0,1000,8,0]],mode:'stunt'});
 let state=createSourceBuoyProgress(layout);
 assert.equal(state.power,5);
 state=stepSourceBuoyProgress(layout,state,{position:world([0,-7]),lap:1}).state;
 const crossing=stepSourceBuoyProgress(layout,state,{position:world([0,3]),previousPosition:world([0,-7]),lap:1,lapLegalCounter:0});
 assert.equal(crossing.event.checkpointTimingEligible,true);assert.equal(crossing.event.crossingOffsetNative,15);
 assert.equal(crossing.event.nativeEventCode,0);
 const start=stepSourceBuoyProgress(layout,createSourceBuoyProgress(layout,{armed:true}),{position:world([0,3]),previousPosition:world([0,-7]),lap:0});
 assert.equal(start.event.advanced,true);assert.equal(start.event.checkpointTimingEligible,false);assert.equal(start.event.crossingOffsetNative,null);
});

test('raw node identity and phase headings survive compilation without caller aliasing',()=>{
 const nodes=[{sourceRow:42,x:0,z:0,tx:0,tz:1,classification:1,nextSourceRow:99},
  {sourceRow:99,x:1,z:2,tx:0,tz:1,classification:3,nextSourceRow:42}];
 const regions=[[-10,10,-10,10]],layout=createSourceBuoyLayout({nodes,regions});
 nodes[0].x=5;regions[0][0]=0;
 assert.equal(layout.nodes[0].sourceRow,42);assert.equal(layout.nodes[0].x,0);assert.equal(layout.regions[0][0],-10);
 assert.equal(sourceBuoyVisibleRow(layout,42),42);assert.equal(layout.finishSourceRow,99);
 assert.throws(()=>layout.nodes[0].nextSourceRow=42,TypeError);
 const raw=createSourceBuoyLayout({rows:[[0,0,3,360],[0,1000,7,90]]});
 assert.equal(raw.nodes[0].tx,0);assert.equal(raw.nodes[0].tz,1);assert.equal(raw.nodes[1].tx,1);assert.equal(raw.nodes[1].tz,0);
});

test('validation rejects malformed geometry, links, state and nonfinite positions',()=>{
 assert.throws(()=>createSourceBuoyLayout({rows:[]}),RangeError);
 assert.throws(()=>createSourceBuoyLayout({rows:[[0,0,3,-1]]}),RangeError);
 assert.throws(()=>createSourceBuoyLayout({rows:[[0,0,3,0]],scale:0}),RangeError);
 assert.throws(()=>createSourceBuoyLayout({rows:[[0,0,3,0]],regions:[[2,1,0,1]]}),RangeError);
 const node={sourceRow:1,x:0,z:0,tx:0,tz:1,classification:1};
 assert.throws(()=>createSourceBuoyLayout({nodes:[node,{...node}]}),RangeError);
 assert.throws(()=>createSourceBuoyLayout({nodes:[{...node,nextSourceRow:5}]}),RangeError);
 assert.throws(()=>createSourceBuoyLayout({nodes:[{...node,tx:NaN}]}),TypeError);
 const layout=createSourceBuoyLayout({nodes:[node]}),state=createSourceBuoyProgress(layout);
 assert.throws(()=>createSourceBuoyProgress(layout,{power:6}),RangeError);
 assert.throws(()=>stepSourceBuoyProgress(layout,{...state,side:2},{position:{x:0,z:0}}),RangeError);
 assert.throws(()=>stepSourceBuoyProgress(layout,state,{position:{x:Infinity,z:0}}),TypeError);
 assert.throws(()=>stepSourceBuoyProgress(layout,state,{position:{x:0,z:0},human:1}),TypeError);
});
