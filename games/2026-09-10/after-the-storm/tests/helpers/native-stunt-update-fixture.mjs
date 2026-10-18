import {createNativePrimaryCourseData} from '../../native-primary-initialization.js';
import {createNativePrimaryScratchLayout} from '../../native-primary-scratch-context.js';
import {createNativeRaceResetLayout} from '../../native-race-reset.js';
import {createNativeRaceState,prepareNativeRaceStartup,nativeRaceStateSnapshot} from '../../native-race-state.js';
const ri=a=>(a-0x1f94)/4,hi=a=>(a-0x7788)/4;
export function stuntFixture({racers=1,phase=3,primary=0,players=1}={}){
 const data=createNativePrimaryCourseData({rows:[[0,0,3,0],[0,1000,2,0]],courseIndex:1,mode620:11});
 const scratchData={nodes:data.nodes,regionsNative:[[-10000,10000,-10000,10000]],
  weedCentersNativeXZ:Array.from({length:6},()=>({x:50000,z:50000})),weedRadiusSquaredNative:22500,
  portRegionNative:[-1000,2600,-5450,1500],cityRegionNative:[-300,300,700,4400]};
 const raceWords1f94=Array(1693).fill(0),hudWords7788=Array(1442).fill(0);
 for(let camera=0;camera<2;camera++)for(const [offset,bits]of [[0x4c,0],[0x54,0xc4fa0000],[0x64,0],[0x6c,0x3f800000],
  [0x7c,0],[0x84,0],[0xf0,0],[0xf4,0xbf800000]])hudWords7788[hi(0x7c80+camera*0x10c+offset)]=bits;
 hudWords7788[hi(0x7a50)]=0x3f2aaaab;
 const scene={cold8224:0,clockStopped817c:0,phase650:phase,simulation648:3,main638:1,mode620:11,activity624:-1,
  primaryHumanIndex:primary,secondaryHumanIndex:1,players,courseIndex:1,racerCount:racers,primaryCount:2,finishSourceRow:data.finishSourceRow,
  difficulty:1,reverseDab68:0,restart6f8:0,forceFirst8228:0,demoOffset5438:0,event628:0,configuredLaps728:1,
  missLimit8174:5,noFinish8178:0,missesEnabled72e:1,state600:0,directionFlag1f90:0,
  ambientD4b00:0,fortressD8240:0,metadataD9b0:7,metadataCb32c:8,seed6f00:17,
  ringCountB134:12,ringNext0cb0:0,ringStreak0cb4:0,objectCountFa40:0,unlockAb60:0};
 const reset=createNativeRaceResetLayout({nodes:data.nodes,boundaryNativeXZ:[],objectKinds4c:[],checkpointSeconds:30,
  checkpointSlackNative:256,recordTimeTemplateWords:[599999,0,0,0,0x494e4900],stuntTemplateWords:[0,0,0,0x494e4900]});
 const s=nativeRaceStateSnapshot(prepareNativeRaceStartup(reset,createNativeRaceState({raceWords1f94,hudWords7788,scene})).state);
 s.scene.phase650=phase;s.scene.clockStopped817c=phase<2?1:0;
 const bodiesBySlot=Array.from({length:Math.max(2,racers)},(_,i)=>({positionNative:{x:5000+i*10,y:0,z:-1000},priorBodyPointNative:{x:5000+i*10,y:0,z:-1010},
  forwardXZ:{x:0,z:1},speedB90Native:20,frameSpeedB98:60,speedBbc:60,speedBc0:40,field15c0:0,field16d0:0,actorState:22,
  stuntMove1604:0,stuntArc15ecNative:10+i}));
 for(let i=0;i<racers;i++){s.raceWords1f94[ri(0x2938)+i*222]=1;s.raceWords1f94[ri(0x293c)+i*222]=i;}
 return {state:createNativeRaceState(s),scratchData,input:{nodes:data.nodes,primaryScratchLayout:createNativePrimaryScratchLayout(scratchData),
  checkpointSecondsByIndex:[30,20,15,10],bodiesBySlot,cameraIndicesByView:[0,1],pressedButtonsB58BySlot:[0,0,0,0],
  angleTableWords6f08:Array(512).fill(0),sineTableWords4350:Array(4096).fill(0),
  warningSuppressionRegionsNative:[],allowedRegionsNative:[[-10000,10000,-10000,10000]]}};
}
