// Evaluate the complete saved benchmark predicates without changing its raw
// verdict. Only east-bay-close's interrupted sample count may use independent
// coverage; no supplemental frame samples enter the sustained timing statistics.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const [originalPath,supplementPath,output,failedSupplementPath]=process.argv.slice(2);
assert.ok(originalPath&&supplementPath&&output,'Pass original report, supplement report, unique review path');
assert.equal(await fs.access(output).then(()=>true,()=>false),false,'Preserve previous review');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const originalBytes=await fs.readFile(originalPath),supplementBytes=await fs.readFile(supplementPath);
const r=JSON.parse(originalBytes),s=JSON.parse(supplementBytes);
const review={reviewedAt:new Date().toISOString(),original:{path:originalPath,sha256:hash(originalBytes),passed:r.passed,failure:r.failure},
  supplement:{path:supplementPath,sha256:hash(supplementBytes),passed:s.passed,actualSeconds:s.actualSeconds},checks:[],
  rule:'Raw benchmark remains failed. Only the interrupted east-bay-close settled-sample-count predicate uses independent confirmation. All other original predicates are evaluated from the original run; timing and memory come solely from it.',
  actualSeconds:r.actualSeconds,timing:r.timing,memory:r.memory,maxFrameMs:Math.max(...r.frames),slowFramePercent:r.timing.over33ms/r.frames.length*100,
  limits:['Whole-frame intervals are not isolated GPU timings.','JavaScript heap excludes GPU allocations and full process memory.','Seven scenery intervals are placed braked inspections, not physical forest drives.','The original East Bay close interval was interrupted by a normal derby completion/restart; only one sample met the original five-second settle and playing-state requirements.','Independent stop timing is not aggregated with or substituted into the 611-second performance metrics.','Observed bounded memory during one run does not establish universal absence of leaks.']};
function check(name,predicate,evidence){
  const passed=!!predicate;review.checks.push({name,passed,...(evidence===undefined?{}:{evidence})});
}
check('Raw run has only the identified failed sample-count predicate',r.passed===false&&r.failure==='AssertionError [ERR_ASSERTION]: east-bay-close needs settled close inspection samples');
check('Both browser processes closed',r.browserClosed&&s.browserClosed);
check('Supplement is independently successful, real and long enough',s.passed&&s.actualSeconds>=16&&s.settledPlayingSamples>=2&&s.errors.length===0);
check('Clean supplement retains all 35 decoded audio buffers',s.samples.every(sample=>sample.stats.audio===35));
if(failedSupplementPath){
  const bytes=await fs.readFile(failedSupplementPath),failed=JSON.parse(bytes);
  review.failedSupplement={path:failedSupplementPath,sha256:hash(bytes),passed:failed.passed,failure:failed.failure,errors:failed.errors,browserClosed:failed.browserClosed};
  check('Failed transient-load attempt is retained explicitly',failed.passed===false&&failed.browserClosed&&failed.errors.some(error=>error.includes('ERR_NO_BUFFER_SPACE')));
}
check('Identical tested application',new URL(r.buildURL).pathname.endsWith(s.bundle.slice(1))&&r.buildSha256===s.bundleSha256);
const bundleFile=new URL(r.buildURL).pathname.replace(/^\//,'');
check('Frozen application still matches dist',hash(await fs.readFile(path.join('dist',bundleFile)))===r.buildSha256);
check('Continuous full-duration frames',r.actualSeconds>=r.seconds&&r.frames.length>r.seconds*10);
check('Runtime sample cap not reached',r.frames.length<50000);
check('Every sampled event has eight cars',r.samples.every(sample=>sample.cars.length===8));
check('Racing visits original required surfaces',r.samples.some(sample=>sample.mode==='race')&&r.roadsideVisits>0&&r.extensionVisits>0&&r.headwallVisits>0&&r.roadApproachVisits>0,
  {roadside:r.roadsideVisits,extension:r.extensionVisits,headwall:r.headwallVisits,road:r.roadApproachVisits,eastBay:r.eastBayRaceVisits});
const stops=[...r.forestStops,...r.ridgeStops,...r.eastBayStops],required=r.forestProtocol.stopSeconds>=14?2:1;
const interrupted=stops.find(stop=>stop.id==='east-bay-close');
check('Independent coverage uses the exact original stop',interrupted&&['x','z','yaw','ground'].every(key=>interrupted[key]===s.stop[key])&&JSON.stringify(interrupted.targetCenter)===JSON.stringify(s.stop.targetCenter));
for(const stop of stops){
  if(stop.id==='east-bay-close')check(stop.id+' settled playing sample count independently confirmed',s.settledPlayingSamples>=required,{original:stop.visits,independent:s.settledPlayingSamples});
  else check(stop.id+' original settled sample count',stop.visits>=required,stop.visits);
  check(stop.id+' original samples remain braked',stop.samples.every(sample=>Math.abs(sample.cars[0].speed)<1));
  check(stop.id+' original samples remain grounded',stop.samples.every(sample=>{const y=sample.cars[0].position[1]-sample.forestGroundAtCar;return y>.25&&y<1.8;}));
  if(!stop.kind&&r.northForestDiagnosticsAvailable)check(stop.id+' actual near LOD selected',stop.samples.every(sample=>Array.isArray(sample.northForest)&&sample.northForest.some(cell=>cell.id===`north-forest-${stop.id}`&&cell.visible&&cell.lod===0&&Number.isFinite(cell.triangles)&&cell.triangles>0&&cell.draws>0&&cell.distance<55)));
}
for(const stop of r.ridgeStops){
  check(stop.id+' shader transition distance',stop.actualDistances.every(distance=>distance>=stop.expectedDistanceBand[0]&&distance<=stop.expectedDistanceBand[1]));
  check(stop.id+' stays inside recovery bounds',stop.samples.every(sample=>Math.hypot(sample.cars[0].position[0],sample.cars[0].position[2])<250));
  check(stop.id+' geometry and complementary atlas pass',stop.samples.every(sample=>sample.northRidge?.some(cell=>cell.id==='north-ridge-'+stop.standId&&(cell.near||cell.far)&&cell.atlas)));
}
check('Both East Bay directions and normal race pass were sampled',r.eastBayStops.length===2&&r.eastBayRaceVisits>0);
check('East Bay model observed from the actual application',r.eastBayAsset?.observedApplicationRequest);
function framed(sample,target){
  const delta=target.map((value,i)=>value-sample.camera.position[i]);
  const [x,y,z,w]=sample.camera.quaternion,forward=[-2*(x*z+w*y),-2*(y*z-w*x),-1+2*(x*x+y*y)];
  return delta.reduce((sum,value,i)=>sum+value*forward[i],0)/(Math.hypot(...delta)*Math.hypot(...forward))>Math.cos(sample.camera.fov*Math.PI/360);
}
for(const stop of r.eastBayStops)check(stop.id+' original normal-chase wall framing',stop.samples.every(sample=>framed(sample,stop.targetCenter)));
const independent=s.samples.filter(sample=>sample.time>=5&&sample.state==='playing');
check('Independent samples satisfy original braked/grounded/framing constraints',independent.length>=required&&independent.every(sample=>{
  const p=sample.cars[0].position,y=p[1]-sample.ground;
  return sample.cars.length===8&&Math.abs(sample.cars[0].speed)<1&&y>.25&&y<1.8&&Math.hypot(p[0]-s.stop.x,p[2]-s.stop.z)<3&&framed(sample,s.stop.targetCenter);
}));
check('Original inspection intervals have continuous frame capture',r.forestFrameSamples.length>r.forestProtocol.durationSeconds*10);
check('Original run has no application/request errors',r.errors.length===0);
for(const [name,assets]of Object.entries({forest:r.forestAssets,circuit:r.circuitAssets,geology:r.geologyAssets})){
  check(name+' actual asset observations retained',assets.length===({forest:26,circuit:4,geology:3})[name]&&assets.every(asset=>asset.observedApplicationRequest));
  for(const asset of assets)check(asset.file+' still matches public/dist',hash(await fs.readFile(path.join('dist',asset.file)))===asset.sha256&&hash(await fs.readFile(path.join('public',asset.file)))===asset.sha256);
}
review.stopCoverage=stops.map(stop=>({id:stop.id,originalSettledSamples:stop.visits,independentSettledSamples:stop.id==='east-bay-close'?s.settledPlayingSamples:undefined,
  seconds:r.forestRanges.filter(range=>range.stop===stop.id).reduce((sum,range)=>sum+range.endSeconds-range.startSeconds,0),timing:stop.timing}));
review.raceCompletions=r.events.filter(event=>event.reason==='completed event'&&event.previous?.mode==='race').map(event=>({seconds:event.time,passed:event.previous.cars[0].passed,lap:event.previous.cars[0].lap}));
check('Original raw report byte-for-byte preserved',hash(await fs.readFile(originalPath))===review.original.sha256);
review.acceptanceSatisfied=review.checks.every(check=>check.passed);
review.status=review.acceptanceSatisfied?'composite coverage accepted; original benchmark remains failed':'additional evidence still required';
await fs.writeFile(output,JSON.stringify(review,null,2)+'\n');
console.log(JSON.stringify({output,status:review.status,checks:review.checks.length,failed:review.checks.filter(check=>!check.passed)}));
if(!review.acceptanceSatisfied)process.exitCode=1;
