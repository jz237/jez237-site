import {prepareNativeSprayPhysicalInputs,prepareNativeSprayLevels,normalizeNativeSprayCamera} from './native-spray-levels.js';
import {queryNativeWaterField} from './native-water-field.js';
const F=Math.fround,axes=['x','y','z'];
const xyz=v=>Object.fromEntries(axes.map((k,i)=>[k,v[i]]));
function physical(adapter,field,courseIndex){
 const {hull,lastFrame,impacts,riderLifecycle}=adapter,motion=hull.sprayMotionNative;
 if(adapter.pendingFrameCompletion||!motion||!riderLifecycle)throw new TypeError('Spray requires completed physical owners');
 const positionNative=Object.fromEntries(axes.map(k=>[k,F(hull.center[k]/hull.scale)]));
 return prepareNativeSprayPhysicalInputs({positionNative,frameDisplacementNative:lastFrame.frameDisplacementNative,
  forwardNative:hull.frame.forward,rightNative:hull.frame.right,referenceVelocityNative:motion.velocity,tickDisplacementNative:motion.centerVelocity,
  floorImpactNative:impacts.floorImpactNative,alternate16cc:riderLifecycle.state.alternateStumble,courseIndex,
  waterQueryNative:queryNativeWaterField(field,positionNative.x,positionNative.z).sourcePlaneQueryNative});
}

// AE7C4 startup and B2ABC's admitted human spray owners. The post-world
// producer runs after water/cameras/object motion.52480 observes these levels
// on the FOLLOWING physical frame. No render refresh advances this state.
export function createNativeRaceSpray({adapters,field,courseIndex}){
 if(!Array.isArray(adapters)||![1,2].includes(adapters.length))throw new RangeError('Expected admitted human spray owners');
 let frame=0,cameraForward={x:0,y:0,z:0};
 let states=adapters.map(a=>{const p=physical(a,field,courseIndex);return {wet:Number(p.position.y<=p.water),dryFrames:0,cooldown:0,left:0,right:0,intensity:0,previousSpeed:0,previousVertical:0};});
 return {
  advance(context,cameras){
   const next=adapters[0].logicalFrames;
   if(next!==frame+1||adapters.some(a=>a.logicalFrames!==next||a.pendingFrameCompletion))throw new Error('Spray requires successive completed physical frames');
   if(context.players!==adapters.length||!Array.isArray(cameras)||cameras.length!==context.players||!Array.isArray(context.records2f4)||context.records2f4.length!==adapters.length)throw new TypeError('Supply canonical spray scene, records and cameras');
   // B2ABC normalizes P1 then P2 into the SAME global7974 vector before
   // selecting each racer's camera eye. Preserve that source behavior.
   for(const camera of cameras)cameraForward=normalizeNativeSprayCamera(cameraForward,xyz(camera.forward));
   if(context.activity624===-1)states=states.map((previous,i)=>prepareNativeSprayLevels(previous,{
    ...context,...physical(adapters[i],field,courseIndex),racerIndex:i,record2f4:context.records2f4[i],
    cameraEye:xyz(cameras[context.players===2&&i===context.secondaryIndex?1:0].eyeNative),cameraForward}));
   frame=next;
  },
  levels:()=>states.map(s=>({left:s.left,right:s.right})),
  snapshot:()=>({frame,cameraForward:{...cameraForward},states:states.map(s=>({...s}))})
 };
}
