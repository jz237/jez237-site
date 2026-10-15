import test from 'node:test';
import assert from 'node:assert/strict';
import { createNativeWaterFollowCamera, stepNativeWaterFollowCamera, nativeWaterFollowProfile,
  nativeWaterCameraBasis, nativeWaterCameraControl, nativeWaterAmplitudeThreshold, nativeWaterPatchCenter, nativeWaterForcingPlan, planNativeWaterFrame } from '../native-water-schedule.js';
import { createNativeWaterField, createNativeWaterPatch, stepNativeWaterPatch,
  forceNativeWaterLine } from '../native-water-field.js';

// Independent numeric fixture outputs from bounded original instruction execution:
// basis801e0ff0, frustum80050b78, forcing80066a48..66d6c and ordinary follow801df744.
// Prepared fields and regenerated sin/acos samples are explicit; native physics,
// camera collision corrections, scene cameras and original lookup bits are not claimed.
// Only inputs and numeric outputs are included here. Private raw/evidence stays outside
// the game tree. Coordinate units are native; no display-camera or metre conversion.
const fixtures={"cameraCases":[{"input":{"name":"ordinary-default-north","eyeNative":[0,55,-129],"targetNative":[0,0,0]},"radius":12,"datumNative":0,"amplitudeNative":20,"sourceBasis":{"eyeNative":[0.0,55.0,-129.0],"targetNative":[0.0,0.0,0.0],"forward":[0.0,-0.3921973705291748,0.9198810458183289],"up":[0.0,0.9198810458183289,0.3921973705291748],"horizontalForward":[0.0,1.0],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[0.0,535.4064331054688],"downwardCornerBranches":2},{"input":{"name":"ordinary-default-north","eyeNative":[0,55,-129],"targetNative":[0,0,0]},"radius":10,"datumNative":-100,"amplitudeNative":35,"sourceBasis":{"eyeNative":[0.0,55.0,-129.0],"targetNative":[0.0,0.0,0.0],"forward":[0.0,-0.3921973705291748,0.9198810458183289],"up":[0.0,0.9198810458183289,0.3921973705291748],"horizontalForward":[0.0,1.0],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[0.0,500.61737060546875],"downwardCornerBranches":2},{"input":{"name":"ordinary-default-south","eyeNative":[0,55,129],"targetNative":[0,0,0]},"radius":12,"datumNative":0,"amplitudeNative":20,"sourceBasis":{"eyeNative":[0.0,55.0,129.0],"targetNative":[0.0,0.0,0.0],"forward":[0.0,-0.3921973705291748,-0.9198810458183289],"up":[0.0,0.9198810458183289,-0.3921973705291748],"horizontalForward":[0.0,-1.0],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[0.0,-535.4064331054688],"downwardCornerBranches":2},{"input":{"name":"ordinary-default-south","eyeNative":[0,55,129],"targetNative":[0,0,0]},"radius":10,"datumNative":-100,"amplitudeNative":35,"sourceBasis":{"eyeNative":[0.0,55.0,129.0],"targetNative":[0.0,0.0,0.0],"forward":[0.0,-0.3921973705291748,-0.9198810458183289],"up":[0.0,0.9198810458183289,-0.3921973705291748],"horizontalForward":[0.0,-1.0],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[0.0,-500.61737060546875],"downwardCornerBranches":2},{"input":{"name":"ordinary-east","eyeNative":[-129,55,0],"targetNative":[0,0,0]},"radius":12,"datumNative":0,"amplitudeNative":20,"sourceBasis":{"eyeNative":[-129.0,55.0,0.0],"targetNative":[0.0,0.0,0.0],"forward":[0.9198810458183289,-0.3921973705291748,0.0],"up":[0.3921973705291748,0.9198810458183289,0.0],"horizontalForward":[1.0,0.0],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[535.4064331054688,0.0],"downwardCornerBranches":2},{"input":{"name":"ordinary-east","eyeNative":[-129,55,0],"targetNative":[0,0,0]},"radius":10,"datumNative":-100,"amplitudeNative":35,"sourceBasis":{"eyeNative":[-129.0,55.0,0.0],"targetNative":[0.0,0.0,0.0],"forward":[0.9198810458183289,-0.3921973705291748,0.0],"up":[0.3921973705291748,0.9198810458183289,0.0],"horizontalForward":[1.0,0.0],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[500.61737060546875,0.0],"downwardCornerBranches":2},{"input":{"name":"diagonal-turn","eyeNative":[-100,80,50],"targetNative":[25,15,180]},"radius":12,"datumNative":0,"amplitudeNative":20,"sourceBasis":{"eyeNative":[-100.0,80.0,50.0],"targetNative":[25.0,15.0,180.0],"forward":[0.6520506739616394,-0.33906635642051697,0.6781327128410339],"up":[0.2350098341703415,0.940762460231781,0.24441023170948029],"horizontalForward":[0.6931086778640747,0.7208330631256104],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[380.5217590332031,549.74267578125],"downwardCornerBranches":2},{"input":{"name":"diagonal-turn","eyeNative":[-100,80,50],"targetNative":[25,15,180]},"radius":10,"datumNative":-100,"amplitudeNative":35,"sourceBasis":{"eyeNative":[-100.0,80.0,50.0],"targetNative":[25.0,15.0,180.0],"forward":[0.6520506739616394,-0.33906635642051697,0.6781327128410339],"up":[0.2350098341703415,0.940762460231781,0.24441023170948029],"horizontalForward":[0.6931086778640747,0.7208330631256104],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[338.7987976074219,506.35076904296875],"downwardCornerBranches":2},{"input":{"name":"rolled-up","eyeNative":[350,72,-200],"targetNative":[420,10,-85],"up":[0.2,1,0.3]},"radius":12,"datumNative":0,"amplitudeNative":20,"sourceBasis":{"eyeNative":[350.0,72.0,-200.0],"targetNative":[420.0,10.0,-85.0],"forward":[0.47227275371551514,-0.41829872131347656,0.7758766412734985],"up":[0.22945323586463928,0.9082201719284058,0.3499819338321686],"horizontalForward":[0.5199469923973083,0.8541985750198364],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[701.4737548828125,377.421142578125],"downwardCornerBranches":2},{"input":{"name":"rolled-up","eyeNative":[350,72,-200],"targetNative":[420,10,-85],"up":[0.2,1,0.3]},"radius":10,"datumNative":-100,"amplitudeNative":35,"sourceBasis":{"eyeNative":[350.0,72.0,-200.0],"targetNative":[420.0,10.0,-85.0],"forward":[0.47227275371551514,-0.41829872131347656,0.7758766412734985],"up":[0.22945323586463928,0.9082201719284058,0.3499819338321686],"horizontalForward":[0.5199469923973083,0.8541985750198364],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[679.1722412109375,340.78289794921875],"downwardCornerBranches":2},{"input":{"name":"below-plane","eyeNative":[0,-40,-100],"targetNative":[0,-70,0]},"radius":12,"datumNative":0,"amplitudeNative":20,"sourceBasis":{"eyeNative":[0.0,-40.0,-100.0],"targetNative":[0.0,-70.0,0.0],"forward":[0.0,-0.2873478829860687,0.9578262567520142],"up":[0.0,0.9578263163566589,0.2873479127883911],"horizontalForward":[0.0,1.0],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[0.0,465.947265625],"downwardCornerBranches":2},{"input":{"name":"below-plane","eyeNative":[0,-40,-100],"targetNative":[0,-70,0]},"radius":10,"datumNative":-100,"amplitudeNative":35,"sourceBasis":{"eyeNative":[0.0,-40.0,-100.0],"targetNative":[0.0,-70.0,0.0],"forward":[0.0,-0.2873478829860687,0.9578262567520142],"up":[0.0,0.9578263163566589,0.2873479127883911],"horizontalForward":[0.0,1.0],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[0.0,450.21527099609375],"downwardCornerBranches":2},{"input":{"name":"look-up-no-downward-corner","eyeNative":[0,50,-80],"targetNative":[0,250,0]},"radius":12,"datumNative":0,"amplitudeNative":20,"sourceBasis":{"eyeNative":[0.0,50.0,-80.0],"targetNative":[0.0,250.0,0.0],"forward":[0.0,0.9284766912460327,0.371390700340271],"up":[0.0,0.3713906705379486,-0.9284766316413879],"horizontalForward":[0.0,1.0],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[0.0,663.93603515625],"downwardCornerBranches":0},{"input":{"name":"look-up-no-downward-corner","eyeNative":[0,50,-80],"targetNative":[0,250,0]},"radius":10,"datumNative":-100,"amplitudeNative":35,"sourceBasis":{"eyeNative":[0.0,50.0,-80.0],"targetNative":[0.0,250.0,0.0],"forward":[0.0,0.9284766912460327,0.371390700340271],"up":[0.0,0.3713906705379486,-0.9284766316413879],"horizontalForward":[0.0,1.0],"fovDegrees":75.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[0.0,553.0880126953125],"downwardCornerBranches":0},{"input":{"name":"near-horizontal-corner","eyeNative":[12,4,-100],"targetNative":[12,3,0],"fovDegrees":36},"radius":12,"datumNative":0,"amplitudeNative":20,"sourceBasis":{"eyeNative":[12.0,4.0,-100.0],"targetNative":[12.0,3.0,0.0],"forward":[0.0,-0.009999500587582588,0.9999500513076782],"up":[0.0,0.9999500513076782,0.009999501518905163],"horizontalForward":[0.0,1.0],"fovDegrees":36.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[12.0,643.93603515625],"downwardCornerBranches":0},{"input":{"name":"near-horizontal-corner","eyeNative":[12,4,-100],"targetNative":[12,3,0],"fovDegrees":36},"radius":10,"datumNative":-100,"amplitudeNative":35,"sourceBasis":{"eyeNative":[12.0,4.0,-100.0],"targetNative":[12.0,3.0,0.0],"forward":[0.0,-0.009999500587582588,0.9999500513076782],"up":[0.0,0.9999500513076782,0.009999501518905163],"horizontalForward":[0.0,1.0],"fovDegrees":36.0,"nearNative":10.0,"projectionOffset":[0.0,3.0]},"sourceCenterNative":[12.0,533.0880126953125],"downwardCornerBranches":0},{"input":{"name":"offset-far-scene","eyeNative":[1000,340,-4500],"targetNative":[1200,80,-4200],"fovDegrees":90,"nearNative":32,"projectionOffset":[-1.2,0]},"radius":12,"datumNative":0,"amplitudeNative":20,"sourceBasis":{"eyeNative":[1000.0,340.0,-4500.0],"targetNative":[1200.0,80.0,-4200.0],"forward":[0.44992128014564514,-0.5848976373672485,0.6748818755149841],"up":[0.32444289326667786,0.8111070990562439,0.4866642951965332],"horizontalForward":[0.5547001957893372,0.8320502638816833],"fovDegrees":90.0,"nearNative":32.0,"projectionOffset":[-1.2000000476837158,0.0]},"sourceCenterNative":[1379.9368896484375,-3930.0947265625],"downwardCornerBranches":2},{"input":{"name":"offset-far-scene","eyeNative":[1000,340,-4500],"targetNative":[1200,80,-4200],"fovDegrees":90,"nearNative":32,"projectionOffset":[-1.2,0]},"radius":10,"datumNative":-100,"amplitudeNative":35,"sourceBasis":{"eyeNative":[1000.0,340.0,-4500.0],"targetNative":[1200.0,80.0,-4200.0],"forward":[0.44992128014564514,-0.5848976373672485,0.6748818755149841],"up":[0.32444289326667786,0.8111070990562439,0.4866642951965332],"horizontalForward":[0.5547001957893372,0.8320502638816833],"fovDegrees":90.0,"nearNative":32.0,"projectionOffset":[-1.2000000476837158,0.0]},"sourceCenterNative":[1326.089599609375,-4010.86572265625],"downwardCornerBranches":2},{"input":{"name":"narrow-view","eyeNative":[-2500,80,5800],"targetNative":[-2350,0,5800],"fovDegrees":45,"projectionOffset":[2,-3]},"radius":12,"datumNative":0,"amplitudeNative":20,"sourceBasis":{"eyeNative":[-2500.0,80.0,5800.0],"targetNative":[-2350.0,0.0,5800.0],"forward":[0.8823529481887817,-0.47058823704719543,0.0],"up":[0.47058823704719543,0.882352888584137,0.0],"horizontalForward":[1.0,0.0],"fovDegrees":45.0,"nearNative":10.0,"projectionOffset":[2.0,-3.0]},"sourceCenterNative":[-1837.137451171875,5800.0],"downwardCornerBranches":2},{"input":{"name":"narrow-view","eyeNative":[-2500,80,5800],"targetNative":[-2350,0,5800],"fovDegrees":45,"projectionOffset":[2,-3]},"radius":10,"datumNative":-100,"amplitudeNative":35,"sourceBasis":{"eyeNative":[-2500.0,80.0,5800.0],"targetNative":[-2350.0,0.0,5800.0],"forward":[0.8823529481887817,-0.47058823704719543,0.0],"up":[0.47058823704719543,0.882352888584137,0.0],"horizontalForward":[1.0,0.0],"fovDegrees":45.0,"nearNative":10.0,"projectionOffset":[2.0,-3.0]},"sourceCenterNative":[-1905.8048095703125,5800.0],"downwardCornerBranches":2}],"forcingCases":[{"input":{"name":"one-player-radial-0-0","players":1,"previousPatchCentersNative":[[64,-111]],"horizontalForwards":[[0.6,0.8]],"craftPositionsNative":[[0,0]]},"sourceCalls":[{"xNative":524.800048828125,"zNative":503.4000244140625,"amplitudeNative":20,"period":20,"advance":1}]},{"input":{"name":"one-player-radial-6000-8000","players":1,"previousPatchCentersNative":[[64,-111]],"horizontalForwards":[[0.6,0.8]],"craftPositionsNative":[[6000,8000]]},"sourceCalls":[{"xNative":524.800048828125,"zNative":503.4000244140625,"amplitudeNative":20,"period":20,"advance":1}]},{"input":{"name":"one-player-radial-10001-0","players":1,"previousPatchCentersNative":[[64,-111]],"horizontalForwards":[[0.6,0.8]],"craftPositionsNative":[[10001,0]]},"sourceCalls":[{"xNative":524.800048828125,"zNative":503.4000244140625,"amplitudeNative":20,"period":20,"advance":1}]},{"input":{"name":"one-player-radial-12000-0","players":1,"previousPatchCentersNative":[[64,-111]],"horizontalForwards":[[0.6,0.8]],"craftPositionsNative":[[12000,0]]},"sourceCalls":[{"xNative":524.800048828125,"zNative":503.4000244140625,"amplitudeNative":40,"period":20,"advance":1}]},{"input":{"name":"one-player-radial-13999-0","players":1,"previousPatchCentersNative":[[64,-111]],"horizontalForwards":[[0.6,0.8]],"craftPositionsNative":[[13999,0]]},"sourceCalls":[{"xNative":524.800048828125,"zNative":503.4000244140625,"amplitudeNative":59,"period":20,"advance":1}]},{"input":{"name":"one-player-radial-14000-0","players":1,"previousPatchCentersNative":[[64,-111]],"horizontalForwards":[[0.6,0.8]],"craftPositionsNative":[[14000,0]]},"sourceCalls":[{"xNative":524.800048828125,"zNative":503.4000244140625,"amplitudeNative":60,"period":20,"advance":1}]},{"input":{"name":"one-player-radial-24000-0","players":1,"previousPatchCentersNative":[[64,-111]],"horizontalForwards":[[0.6,0.8]],"craftPositionsNative":[[24000,0]]},"sourceCalls":[{"xNative":524.800048828125,"zNative":503.4000244140625,"amplitudeNative":60,"period":20,"advance":1}]},{"input":{"name":"two-both-far","players":2,"previousPatchCentersNative":[[0,0],[5000,0]],"horizontalForwards":[[0,1],[0,1]],"craftPositionsNative":[[0,0],[5000,0]]},"sourceCalls":[{"xNative":0.0,"zNative":640.0,"amplitudeNative":20,"period":20,"advance":1},{"xNative":5000.0,"zNative":640.0,"amplitudeNative":20,"period":20,"advance":0}]},{"input":{"name":"two-both-near","players":2,"previousPatchCentersNative":[[0,0],[0,0]],"horizontalForwards":[[0,1],[0,1]],"craftPositionsNative":[[0,0],[0,0]]},"sourceCalls":[]},{"input":{"name":"two-first-only","players":2,"previousPatchCentersNative":[[5000,0],[5000,-640]],"horizontalForwards":[[0,1],[0,1]],"craftPositionsNative":[[5000,0],[0,0]]},"sourceCalls":[{"xNative":5000.0,"zNative":640.0,"amplitudeNative":20,"period":20,"advance":1}]},{"input":{"name":"two-second-only","players":2,"previousPatchCentersNative":[[5000,-640],[5000,0]],"horizontalForwards":[[0,1],[0,1]],"craftPositionsNative":[[0,0],[5000,0]]},"sourceCalls":[{"xNative":5000.0,"zNative":640.0,"amplitudeNative":20,"period":20,"advance":1}]},{"input":{"name":"strict-radius-boundary","players":2,"previousPatchCentersNative":[[0,0],[0,0]],"horizontalForwards":[[1,0],[-1,0]],"craftPositionsNative":[[0,0],[0,0]]},"sourceCalls":[]},{"input":{"name":"fractional-distance","players":2,"previousPatchCentersNative":[[5000,-639],[0,0]],"horizontalForwards":[[0,1],[0.6,0.8]],"craftPositionsNative":[[0,0],[5000,0]]},"sourceCalls":[]},{"input":{"name":"inactive-no-force","players":1,"simulationActive":false,"previousPatchCentersNative":[[0,0]],"horizontalForwards":[[0,1]],"craftPositionsNative":[[0,0]]},"sourceCalls":[]}],"followCases":[{"initial":{"positionNative":[0,0,0],"forwardXZ":[0,1],"velocityXZ":[0,0],"liftOffsetNative":0,"zoomResponse":0.1},"steps":[{"input":{"positionNative":[0,0,0],"forwardXZ":[0,1],"velocityXZ":[0,0],"liftOffsetNative":0,"zoomResponse":0.1},"sourceEyeNative":[0.0,54.56614303588867,-128.92840576171875],"sourceTargetNative":[0.0,0.0,0.0],"sourceUp":[0.0,1.0,0.0],"sourceLagXZ":[0.0,-77.0],"radiusNative":140.0,"pitchDegrees":23.0,"fovDegrees":75.0}]},{"initial":{"positionNative":[100,40,-300],"forwardXZ":[1,0],"velocityXZ":[30,0],"zoomIndex":0,"liftOffsetNative":0,"zoomResponse":0.1},"steps":[{"input":{"positionNative":[100,40,-300],"forwardXZ":[1,0],"velocityXZ":[30,0],"zoomIndex":0,"liftOffsetNative":0,"zoomResponse":0.1},"sourceEyeNative":[-84.18344116210938,97.9516372680664,-300.0],"sourceTargetNative":[100.0,28.0,-300.0],"sourceUp":[0.0,1.0,0.0],"sourceLagXZ":[23.0,-300.0],"radiusNative":200.0,"pitchDegrees":23.0,"fovDegrees":72.0}]},{"initial":{"positionNative":[-200,-70,1000],"forwardXZ":[-0.6,0.8],"velocityXZ":[-20,20],"zoomIndex":2,"datumNative":-100,"liftOffsetNative":0,"zoomResponse":0.1},"steps":[{"input":{"positionNative":[-200,-70,1000],"forwardXZ":[-0.6,0.8],"velocityXZ":[-20,20],"zoomIndex":2,"datumNative":-100,"liftOffsetNative":0,"zoomResponse":0.1},"sourceEyeNative":[-150.42291259765625,-49.9217643737793,933.5798950195312],"sourceTargetNative":[-200.0,-79.0,1000.0],"sourceUp":[0.0,1.0,0.0],"sourceLagXZ":[-153.8000030517578,938.4000244140625],"radiusNative":90.0,"pitchDegrees":23.0,"fovDegrees":90.0}]},{"initial":{"positionNative":[500,180,2500],"forwardXZ":[0.8,0.6],"velocityXZ":[40,40],"zoomIndex":3,"liftOffsetNative":0,"zoomResponse":0.1},"steps":[{"input":{"positionNative":[500,180,2500],"forwardXZ":[0.8,0.6],"velocityXZ":[40,40],"zoomIndex":3,"liftOffsetNative":0,"zoomResponse":0.1},"sourceEyeNative":[444.462646484375,129.96456909179688,2458.5458984375],"sourceTargetNative":[500.0,135.73440551757812,2500.0],"sourceUp":[0.0,1.0,0.0],"sourceLagXZ":[438.3999938964844,2453.800048828125],"radiusNative":80.0,"pitchDegrees":30.0,"fovDegrees":90.0}]},{"initial":{"positionNative":[0,0,0],"forwardXZ":[0,1],"velocityXZ":[0,30],"liftOffsetNative":0,"zoomResponse":0.1},"steps":[{"input":{"positionNative":[0,0,0],"forwardXZ":[0,1],"velocityXZ":[0,30],"liftOffsetNative":0,"zoomResponse":0.1},"sourceEyeNative":[0.0,54.56614303588867,-128.92840576171875],"sourceTargetNative":[0.0,0.0,-2.682209014892578e-06],"sourceUp":[0.0,1.0,0.0],"sourceLagXZ":[0.0,-77.0],"radiusNative":140.0,"pitchDegrees":23.0,"fovDegrees":75.0},{"input":{"positionNative":[0,3,33],"forwardXZ":[0.1,0.9949874],"velocityXZ":[3,33],"liftOffsetNative":0,"zoomResponse":0.1},"sourceEyeNative":[0.0,56.06614303588867,-95.92840576171875],"sourceTargetNative":[4.147956848144531,2.0999999046325684,32.999996185302734],"sourceUp":[0.0,1.0,0.0],"sourceLagXZ":[0.0,-44.0],"radiusNative":140.0,"pitchDegrees":23.0,"fovDegrees":75.0},{"input":{"positionNative":[5,5,66],"forwardXZ":[0.3,0.9539392],"velocityXZ":[10,32],"liftOffsetNative":0,"zoomResponse":0.1},"sourceEyeNative":[-0.931117057800293,57.06614303588867,-62.79191589355469],"sourceTargetNative":[15.716997146606445,3.5,65.51286315917969],"sourceUp":[0.0,1.0,0.0],"sourceLagXZ":[1.5036101341247559,-10.920578002929688],"radiusNative":140.0,"pitchDegrees":23.0,"fovDegrees":75.0},{"input":{"positionNative":[18,12,98],"forwardXZ":[0.7,0.7141428],"velocityXZ":[24,25],"liftOffsetNative":0,"zoomResponse":0.1},"sourceEyeNative":[-1.3089027404785156,60.56614303588867,-29.47431182861328],"sourceTargetNative":[42.76541519165039,8.399999618530273,94.24919891357422],"sourceUp":[0.0,1.0,0.0],"sourceLagXZ":[6.469583511352539,21.868209838867188],"radiusNative":140.0,"pitchDegrees":23.0,"fovDegrees":75.0}]},{"initial":{"positionNative":[1000,320,1000],"forwardXZ":[1,0],"velocityXZ":[55,0],"datumNative":-150,"liftOffsetNative":0,"zoomResponse":0.1},"steps":[{"input":{"positionNative":[1000,320,1000],"forwardXZ":[1,0],"velocityXZ":[55,0],"datumNative":-150,"liftOffsetNative":0,"zoomResponse":0.1},"sourceEyeNative":[871.0715942382812,139.56614685058594,1000.0],"sourceTargetNative":[1000.0,273.0,1000.0],"sourceUp":[0.0,1.0,0.0],"sourceLagXZ":[923.0,1000.0],"radiusNative":140.0,"pitchDegrees":23.0,"fovDegrees":75.0},{"input":{"positionNative":[1050,250,1000],"forwardXZ":[0,1],"velocityXZ":[50,1],"datumNative":-150,"liftOffsetNative":0,"zoomResponse":0.1},"sourceEyeNative":[921.0715942382812,104.56614685058594,1000.0],"sourceTargetNative":[1050.0,181.20001220703125,1045.0],"sourceUp":[0.0,1.0,0.0],"sourceLagXZ":[973.0,1000.0],"radiusNative":140.0,"pitchDegrees":23.0,"fovDegrees":75.0}]}],"cameraControlCases":[{"input":{"oldZoomIndex":1,"buttons":0,"oldLiftNative":0,"poseState":0,"poseTimer":0},"sourceSelectedZoom":1,"sourceRadiusTargetNative":140.0,"sourcePitchTargetDegrees":23.0,"sourceFovTargetDegrees":75.0,"sourceRadiusResponse":0.20000000298023224,"sourcePitchResponse":0.20000000298023224,"sourceFovResponse":0.20000000298023224,"sourceLiftNative":0.0},{"input":{"oldZoomIndex":1,"buttons":8,"oldLiftNative":0,"poseState":0,"poseTimer":0},"sourceSelectedZoom":2,"sourceRadiusTargetNative":90.0,"sourcePitchTargetDegrees":23.0,"sourceFovTargetDegrees":90.0,"sourceRadiusResponse":0.20000000298023224,"sourcePitchResponse":0.20000000298023224,"sourceFovResponse":0.20000000298023224,"sourceLiftNative":2.4000000953674316},{"input":{"oldZoomIndex":1,"buttons":4,"oldLiftNative":0,"poseState":0,"poseTimer":0},"sourceSelectedZoom":0,"sourceRadiusTargetNative":200.0,"sourcePitchTargetDegrees":23.0,"sourceFovTargetDegrees":72.0,"sourceRadiusResponse":0.20000000298023224,"sourcePitchResponse":0.20000000298023224,"sourceFovResponse":0.20000000298023224,"sourceLiftNative":0.0},{"input":{"oldZoomIndex":0,"buttons":4,"oldLiftNative":0,"poseState":0,"poseTimer":0},"sourceSelectedZoom":3,"sourceRadiusTargetNative":80.0,"sourcePitchTargetDegrees":30.0,"sourceFovTargetDegrees":90.0,"sourceRadiusResponse":0.30000001192092896,"sourcePitchResponse":0.30000001192092896,"sourceFovResponse":0.30000001192092896,"sourceLiftNative":18.600000381469727},{"input":{"oldZoomIndex":3,"buttons":8,"oldLiftNative":62,"poseState":0,"poseTimer":0},"sourceSelectedZoom":0,"sourceRadiusTargetNative":200.0,"sourcePitchTargetDegrees":23.0,"sourceFovTargetDegrees":72.0,"sourceRadiusResponse":0.30000001192092896,"sourcePitchResponse":0.30000001192092896,"sourceFovResponse":0.30000001192092896,"sourceLiftNative":43.400001525878906},{"input":{"oldZoomIndex":2,"buttons":0,"oldLiftNative":4,"poseState":0,"poseTimer":0},"sourceSelectedZoom":2,"sourceRadiusTargetNative":90.0,"sourcePitchTargetDegrees":23.0,"sourceFovTargetDegrees":90.0,"sourceRadiusResponse":0.20000000298023224,"sourcePitchResponse":0.20000000298023224,"sourceFovResponse":0.20000000298023224,"sourceLiftNative":4.559999942779541},{"input":{"oldZoomIndex":3,"buttons":0,"oldLiftNative":62,"poseState":23,"poseTimer":0},"sourceSelectedZoom":3,"sourceRadiusTargetNative":80.0,"sourcePitchTargetDegrees":30.0,"sourceFovTargetDegrees":90.0,"sourceRadiusResponse":0.20000000298023224,"sourcePitchResponse":0.20000000298023224,"sourceFovResponse":0.20000000298023224,"sourceLiftNative":54.20000076293945},{"input":{"oldZoomIndex":3,"buttons":0,"oldLiftNative":62,"poseState":7,"poseTimer":30},"sourceSelectedZoom":3,"sourceRadiusTargetNative":80.0,"sourcePitchTargetDegrees":30.0,"sourceFovTargetDegrees":90.0,"sourceRadiusResponse":0.20000000298023224,"sourcePitchResponse":0.20000000298023224,"sourceFovResponse":0.20000000298023224,"sourceLiftNative":57.65999984741211}],"amplitudeThresholdCases":[{"name":"minimum-empty","primaryPointsNative":[],"boundaryPointsNative":[],"sourceMaximumAbsNative":4096,"sourceThresholdNative":7840.56298828125},{"name":"minimum-small","primaryPointsNative":[[100,-200]],"boundaryPointsNative":[],"sourceMaximumAbsNative":4096,"sourceThresholdNative":7840.56298828125},{"name":"primary-abs","primaryPointsNative":[[-8500,300],[200,6000]],"boundaryPointsNative":[],"sourceMaximumAbsNative":8500,"sourceThresholdNative":14068.69921875},{"name":"boundary-extents","primaryPointsNative":[[100,100]],"boundaryPointsNative":[[20,-8900],[-9000,30]],"sourceMaximumAbsNative":9000,"sourceThresholdNative":14775.7998046875},{"name":"city-stunt-loaded-points","primaryPointsNative":[[-187,-5689],[862,4897],[3356,4723],[3524,-2432],[6000,-4494],[6481,-7685],[5795,-7908],[222,-7816]],"boundaryPointsNative":[[2101,1862],[2561,1858],[2346,1701],[2150,1501],[2567,1478],[2251,1337],[2453,1338],[2349,1508],[4427,-8900],[4427,-8700],[4427,-8500],[4427,-8300],[4427,-8100],[4427,-7900],[4427,-7700],[4427,-7500],[4120,-7600],[4120,-7720],[4120,-7840],[4120,-7960],[4120,-8080],[4120,-8200],[4120,-8320],[4120,-8440],[4120,-8560],[4120,-8680],[4120,-8800]],"sourceMaximumAbsNative":8900,"sourceThresholdNative":14634.3798828125}]};
function close(actual,expected,tolerance=0){
  if(Array.isArray(expected)){assert.equal(actual.length,expected.length);actual.forEach((x,i)=>close(x,expected[i],tolerance));return;}
  assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected} (tolerance ${tolerance})`);
}
function forcingInput(c){
  return {...c,baseAmplitudeNative:c.baseAmplitudeNative??20,
    previousPatchCentersNative:c.previousPatchCentersNative.map(([xNative,zNative])=>({xNative,zNative})),
    camerasBeforeUpdate:c.horizontalForwards.map(horizontalForward=>({horizontalForward})),
    radius:c.radius??(c.players===1?12:10),amplitudeThresholdNative:c.amplitudeThresholdNative??10000};
}
for(const c of fixtures.cameraCases){
  test(`raw camera/frustum: ${c.input.name},radius${c.radius},datum${c.datumNative}`,()=>{
    const basis=nativeWaterCameraBasis(c.input);
    for(const key of ['forward','up','horizontalForward'])close(basis[key],c.sourceBasis[key]);
    const center=nativeWaterPatchCenter(basis,c);
    close([center.xNative,center.zNative],c.sourceCenterNative);
  });
}
for(const c of fixtures.forcingCases){
  test(`raw forcing: ${c.input.name}`,()=>{
    const plan=nativeWaterForcingPlan(forcingInput(c.input));
    assert.deepEqual(plan.map(({xNative,zNative,amplitudeNative,period,advance})=>({xNative,zNative,amplitudeNative,period,advance})),c.sourceCalls);
  });
}
for(const [index,sequence]of fixtures.followCases.entries()){
  test(`raw ordinary virtual follow sequence${index}`,()=>{
    let state=createNativeWaterFollowCamera(sequence.initial);
    for(const step of sequence.steps){
      const result=stepNativeWaterFollowCamera(state,step.input);state=result.state;
      close(result.camera.eyeNative,step.sourceEyeNative);
      close(result.camera.targetNative,step.sourceTargetNative);
      close(state.lagXZ,step.sourceLagXZ);
      close(state.radiusNative,step.radiusNative);close(state.pitchDegrees,step.pitchDegrees);
      close(state.fovDegrees,step.fovDegrees);
    }
  });
}

for(const [index,c]of fixtures.cameraControlCases.entries()){
  test(`raw camera-control selector${index}`,()=>{
    const selected=nativeWaterCameraControl({zoomIndex:c.sourceSelectedZoom,
      previousZoomIndex:c.input.oldZoomIndex,liftOffsetNative:c.input.oldLiftNative,
      sourcePoseState:c.input.poseState,sourcePoseTimer:c.input.poseTimer});
    close(selected.radiusNative,c.sourceRadiusTargetNative);
    close(selected.pitchDegrees,c.sourcePitchTargetDegrees);
    close(selected.fovDegrees,c.sourceFovTargetDegrees);
    close(selected.zoomResponse,c.sourceRadiusResponse);
    close(selected.zoomResponse,c.sourcePitchResponse);
    close(selected.zoomResponse,c.sourceFovResponse);
    close(selected.liftOffsetNative,c.sourceLiftNative);
  });
}
for(const c of fixtures.amplitudeThresholdCases){
  test(`raw amplitude threshold: ${c.name}`,()=>{
    close(nativeWaterAmplitudeThreshold(c),c.sourceThresholdNative);
  });
}

const north=()=>nativeWaterCameraBasis({eyeNative:[0,55,-129],targetNative:[0,0,0]});
const east=(x=0)=>nativeWaterCameraBasis({eyeNative:[x-129,55,0],targetNative:[x,0,0]});
const frameOptions=(players=1)=>({players,variant:0,simulationActive:true,
  previousPatchCentersNative:players===1?[{xNative:64,zNative:-111}]:[{xNative:0,zNative:0},{xNative:5000,zNative:0}],
  camerasBeforeUpdate:Array.from({length:players},north),
  camerasAfterUpdate:players===1?[east()]:[east(),east(128)],
  craftPositionsNative:players===1?[[0,0]]:[[0,0],[5000,0]],
  baseAmplitudeNative:20,datumNative:0,period:20,amplitudeThresholdNative:10000});

test('forcing uses prior snapped patch and old forward, while patch selection uses updated camera',()=>{
  const plan=planNativeWaterFrame(frameOptions());
  assert.equal(plan.forcing.length,1);assert.equal(plan.patches.length,1);
  assert.equal(plan.forcing[0].xNative,64);assert.equal(plan.forcing[0].zNative,657);
  assert.equal(plan.patches[0].zNative,0);
  // Independent raw east-view/radius12 oracle, unrelated to the old north view.
  const expected=fixtures.cameraCases.find(c=>c.input.name==='ordinary-east'&&c.radius===12);
  close([plan.patches[0].xNative,plan.patches[0].zNative],expected.sourceCenterNative);
});

function preparedField(players=2){
  const field=createNativeWaterField({players,phaseCounter:4});
  for(let i=0;i<field.heightQ.length;i++){
    field.heightQ[i]=((i*13)%43-21)*256;field.velocityQ[i]=((i*7)%5-2)*64;
  }
  return field;
}
function applyPlan(field,plan){
  for(const line of plan.forcing)forceNativeWaterLine(field,line);
  const snapped=[];
  for(const spec of plan.patches){
    const patch=createNativeWaterPatch(field,spec);
    if(spec.evolve)stepNativeWaterPatch(field,patch);
    snapped[spec.playerIndex]=patch.snappedCenterNative;
  }
  return snapped;
}
test('one2P frame advances forcing phase once and evolves overlapping patches in P2/P1 order',()=>{
  const options=frameOptions(2),plan=planNativeWaterFrame(options);
  assert.deepEqual(plan.patches.map(p=>p.playerIndex),[1,0]);
  assert.deepEqual(plan.forcing.map(p=>p.advance),[1,0]);
  assert.equal(plan.parameters.radius,10);
  const actual=preparedField(),expected=preparedField(),reversed=preparedField();
  assert.equal(actual.phaseCounter,4); // Planning has no field/counter side effects.
  const snapped=applyPlan(actual,plan);
  // Explicit source order supplied independently of the frame planner.
  for(const line of plan.forcing)forceNativeWaterLine(expected,line);
  const centers=[nativeWaterPatchCenter(options.camerasAfterUpdate[0],{radius:10,datumNative:0,amplitudeNative:20}),
    nativeWaterPatchCenter(options.camerasAfterUpdate[1],{radius:10,datumNative:0,amplitudeNative:20})];
  for(const i of [1,0])stepNativeWaterPatch(expected,createNativeWaterPatch(expected,{...centers[i],radius:10}));
  for(const line of plan.forcing)forceNativeWaterLine(reversed,line);
  for(const i of [0,1])stepNativeWaterPatch(reversed,createNativeWaterPatch(reversed,{...centers[i],radius:10}));
  assert.deepEqual(actual.heightQ,expected.heightQ);assert.deepEqual(actual.velocityQ,expected.velocityQ);
  assert.notDeepEqual(actual.heightQ,reversed.heightQ,'Overlap must retain source update order');
  assert.equal(actual.phaseCounter,5);assert.equal(actual.forcingCalls,2);assert.equal(actual.patchUpdates,2);
  assert.equal(snapped.length,2);assert.ok(snapped.every(p=>Number.isInteger(p.x)&&Number.isInteger(p.z)));
  const next=nativeWaterForcingPlan({...options,radius:10,
    previousPatchCentersNative:snapped.map(p=>({xNative:p.x,zNative:p.z}))});
  assert.equal(next[0].xNative,snapped[0].x);
  assert.equal(next[0].zNative,Math.fround(snapped[0].z+640));
});

test('inactive frame selects display patches without forcing, phase reset or field evolution',()=>{
  const plan=planNativeWaterFrame({...frameOptions(2),simulationActive:false});
  assert.deepEqual(plan.forcing,[]);assert.deepEqual(plan.patches.map(p=>p.evolve),[false,false]);
  const field=preparedField(),before=field.heightQ.slice(),velocity=field.velocityQ.slice();
  applyPlan(field,plan);
  assert.deepEqual(field.heightQ,before);assert.deepEqual(field.velocityQ,velocity);
  assert.equal(field.phaseCounter,4);assert.equal(field.patchUpdates,0);assert.equal(field.forcingCalls,0);
});

test('full frame requires an explicit camera sequence and rejects unresolved variant1 producer',()=>{
  assert.throws(()=>planNativeWaterFrame({...frameOptions(),variant:1}),/special random disturbance/);
  assert.throws(()=>planNativeWaterFrame({...frameOptions(),camerasAfterUpdate:[]}),/exactly1/);
  assert.throws(()=>nativeWaterForcingPlan({...frameOptions(),radius:12,simulationActive:1}),/boolean/);
  assert.equal(planNativeWaterFrame({...frameOptions(),variant:2}).parameters.radius,10);
});

test('follow state is immutable, independent per craft, and retains its explicit native datum',()=>{
  const a=createNativeWaterFollowCamera({positionNative:[0,-100,0],forwardXZ:[0,1],datumNative:-100});
  const b=createNativeWaterFollowCamera({positionNative:[5000,0,0],forwardXZ:[1,0]});
  const initialLag=a.lagXZ.slice();
  assert.ok(Object.isFrozen(a)&&Object.isFrozen(a.lagXZ));
  assert.throws(()=>{a.lagXZ[0]=99;},TypeError);
  const next=stepNativeWaterFollowCamera(a,{positionNative:[10,-100,30],forwardXZ:[.6,.8],velocityXZ:[20,30]});
  assert.deepEqual(a.lagXZ,initialLag);assert.equal(next.state.datumNative,-100);
  assert.deepEqual(b.lagXZ,[4900,0]);
  assert.throws(()=>stepNativeWaterFollowCamera({...a},{positionNative:[0,0,0],forwardXZ:[0,1],velocityXZ:[0,0]}),/follow state/);
  assert.ok(Object.isFrozen(next.camera)&&Object.isFrozen(next.camera.forward));
});

test('camera zoom changes preserve current source state while source pose selectors change lift',()=>{
  const initial=createNativeWaterFollowCamera({positionNative:[0,0,0],forwardXZ:[0,1]});
  const zoomed=stepNativeWaterFollowCamera(initial,{positionNative:[0,0,20],forwardXZ:[0,1],velocityXZ:[0,30],zoomIndex:2});
  close(zoomed.state.radiusNative,130);close(zoomed.state.fovDegrees,78);
  close(zoomed.state.liftOffsetNative,Math.fround(2.4));
  const pose=stepNativeWaterFollowCamera(zoomed.state,{positionNative:[0,0,40],forwardXZ:[0,1],velocityXZ:[0,30],sourcePoseState:23});
  assert.ok(pose.state.liftOffsetNative>zoomed.state.liftOffsetNative);
  const a=nativeWaterCameraControl({zoomIndex:3,previousZoomIndex:3,liftOffsetNative:62,sourcePoseState:7,sourcePoseTimer:55});
  const b=nativeWaterCameraControl({zoomIndex:3,previousZoomIndex:3,liftOffsetNative:62,sourcePoseState:7,sourcePoseTimer:56});
  assert.ok(a.liftOffsetNative<62);assert.equal(b.liftOffsetNative,62);
});

test('input bounds reject corrupt cameras, degenerate bases and unsnapped prior centers',()=>{
  assert.throws(()=>nativeWaterCameraBasis({eyeNative:[0,0,0],targetNative:[0,0,0]}),/nonzero/);
  assert.throws(()=>nativeWaterCameraBasis({eyeNative:[0,0,0],targetNative:[0,1,0]}),/horizontal/);
  assert.throws(()=>nativeWaterCameraBasis({eyeNative:[0,0,0],targetNative:[0,0,1],up:[0,0,1]}),/nonzero/);
  assert.throws(()=>nativeWaterPatchCenter({...north(),fovDegrees:NaN},{radius:12,amplitudeNative:20}),/finite/);
  assert.throws(()=>nativeWaterPatchCenter(north(),{radius:11,amplitudeNative:20}),/even/);
  assert.throws(()=>nativeWaterForcingPlan({...frameOptions(),radius:12,previousPatchCentersNative:[{xNative:.5,zNative:0}]}),/snapped integers/);
  assert.throws(()=>nativeWaterForcingPlan({...frameOptions(),radius:12,craftPositionsNative:[[Infinity,0]]}),/finite/);
  assert.throws(()=>nativeWaterForcingPlan({...frameOptions(),radius:12,amplitudeThresholdNative:0}),/positive/);
  assert.throws(()=>nativeWaterAmplitudeThreshold({primaryPointsNative:Array(65).fill([0,0])}),/source row bound/);
  assert.throws(()=>nativeWaterFollowProfile(4),/zoomIndex/);
});
