import {nativeCourseObjectResources} from './native-course-object-resources.js';
import {prepareNativeObjectLoading} from './native-object-loading.js';
import {prepareNativeFixedSphereLoading,prepareNativeFixedSphereInitialization} from './native-fixed-sphere-startup.js';
import {prepareNativeObjectInitialization} from './native-object-initialization.js';
import {nativeSineTableWords} from './native-math-tables.js';

/** Fresh web storage policy for normal source course entry. Numeric loading
 * and initialization use the recovered routines; unrelated initial words are
 * explicitly zero. Primary initialization is independent and must also finish
 * before75310. This immutable seed is not a moving world or a retained save. */
export function createNativeCourseObjectStartup({courseIndex,players,mode620,difficulty,reverseDab68}={}){
 const resources=nativeCourseObjectResources({courseIndex,players,mode620});
 const scene={courseIndex,players,mode620,difficulty,reverseDab68,main638:1,
  objectCountFa40:0,ringCountB134:0,fixedSphereCountC938:0,
  forceStunt824c:0,rampFilterOverride8254:0,alternate8250:0};
 const loaded=prepareNativeObjectLoading({...scene,...resources,objectWordsC940:Array(3136).fill(0)});
 const fixed=prepareNativeFixedSphereLoading({...scene,...resources,objectCountFa40:loaded.objectCountFa40,fixedSphereWordsB138:Array(1536).fill(0)});
 const grid=prepareNativeFixedSphereInitialization({...fixed,fixedSphereGridWords1ce8:Array(166).fill(0)});
 const initialized=prepareNativeObjectInitialization({...scene,...resources,objectCountFa40:fixed.objectCountFa40,
  objectWordsC940:loaded.objectWordsC940,collisionPlaneWordsFd78:Array(512).fill(0),packedObjectMatrixWords0cd0:Array(1024).fill(0),sineTableWords4350:nativeSineTableWords()});
 return Object.freeze({storage:Object.freeze({...grid,objectWordsC940:initialized.objectWordsC940,
  collisionPlaneWordsFd78:initialized.collisionPlaneWordsFd78,packedObjectMatrixWords0cd0:initialized.packedObjectMatrixWords0cd0}),
  transformResources:Object.freeze({sineTableWords4350:nativeSineTableWords(),planeTemplatesByAddress:resources.planeTemplatesByAddress}),
  counts:Object.freeze({objectCountFa40:fixed.objectCountFa40,ringCountB134:loaded.ringCountB134,
   fixedSphereCountC938:fixed.fixedSphereCountC938,collisionPlaneCount0578:initialized.collisionPlaneCount0578}),
  objectKinds4c:Object.freeze(Array.from({length:fixed.objectCountFa40},(_,i)=>initialized.objectWordsC940[i*49+0x4c/4]|0))});
}
