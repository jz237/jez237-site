import test from 'node:test';
import assert from 'node:assert/strict';
import {TWILIGHT_NATIVE_BOXES,twilightFixedVolumes,twilightRampProfile,twilightRampVolumes,twilightContactVolumes} from '../source-twilight-boxes.js';
import {twilightRampsForSelection} from '../source-twilight-course.js';
import {volumeContact} from '../clipped-volumes.js';

const S=.025,dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0),point=p=>p.map(v=>v*S);
const close=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);

test('four globally appended finite solids preserve independently decoded bounds',()=>{
 const q=twilightFixedVolumes(),bounds=[[[1565.999991473674,31.492949985938417,-8400],[1637,101.50701906561952,-7400]],[[1400,-100,-8400],[1600,100,-7400]],[[-500,42.00000960947838,-1032],[400,101.99999039052162,-972.0000192189568]],[[-500,-20,-1000],[400,100,-900]]];
 assert.deepEqual(q.map(p=>p.sourceRecordAddress),['0x800d7870','0x800d78b0','0x800d78f0','0x800d7930']);
 q.forEach((v,i)=>{for(let k=0;k<3;k++){close(v.bounds.min[k],bounds[i][0][k]*S);close(v.bounds.max[k],bounds[i][1][k]*S);}assert.equal(v.flag,0);assert.equal(v.vertices.length,8);assert.equal(v.triangles.length,12);});
 assert.equal(q[3].bounds.min[1],-.5);assert.equal(q[3].bounds.max[1],2.5);
});

test('nonorthogonal projection axes retain exact corner equations',()=>{
 const q=twilightFixedVolumes()[0];close(dot(q.axes[0],q.axes[1]),-.014083458231169743);
 assert.ok(Math.abs(dot(q.axes[0],q.axes[1]))>.01,'source axes must not be coerced to an orthonormal box');
 for(const volume of [...twilightFixedVolumes(),...twilightRampsForSelection({mode:'stunt'}).flatMap(twilightRampVolumes)]){
  volume.vertices.forEach((p,bits)=>volume.axes.forEach((axis,k)=>close(dot(axis,volume.origin.map((v,j)=>v-p[j])),((bits>>k)&1)*volume.spans[k],1e-8)));
  assert.ok(volume.triangles.flat(2).every(Number.isFinite));
 }
});

test('crossbar has finite vertical and horizontal bounds, including underwater clearance',()=>{
 const bar=twilightFixedVolumes()[3];
 assert.equal(volumeContact(bar,point([0,-21,-950])),null,'below the source bottom is clear');
 assert.equal(volumeContact(bar,point([0,101,-950])),null,'above the source top is clear');
 assert.equal(volumeContact(bar,point([401,0,-950])),null,'past the finite span is clear');
 assert.equal(volumeContact(bar,point([0,0,-899])),null,'past the rear edge is clear');
 const hit=volumeContact(bar,point([0,0,-950]));assert.ok(hit);close(hit.penetration,20*S);assert.deepEqual(hit.normal,{x:0,y:-1,z:0});
 assert.equal(volumeContact(bar,point([0,0,-950]),1),null,'upper point1 omits the downward underside response');
 assert.ok(volumeContact(bar,point([0,0,-950]),0));
 const top=volumeContact(bar,point([0,99,-950]),1);assert.ok(top);assert.deepEqual(top.normal,{x:0,y:1,z:0});
 close(top.penetration,S);
});

test('local ramp selection uses variant and native class with fixed finite profiles',()=>{
 assert.equal(twilightRampProfile(0,1).address,'0x800d74f0');
 assert.equal(twilightRampProfile(1,1).address,'0x800d7530');
 assert.equal(twilightRampProfile(1,2).address,'0x800d74f0');
 assert.equal(twilightRampProfile(2,2).address,'0x800d7530');
 assert.equal(twilightRampProfile(3,1).address,'0x800d7530');
 assert.deepEqual(TWILIGHT_NATIVE_BOXES.rampProfiles.map(q=>q.spans),[[200,266,743],[266,400,743]]);
 assert.throws(()=>twilightRampProfile(4,2),RangeError);assert.throws(()=>twilightRampProfile(0,3),RangeError);
});

test('native heading plus180 rotates the ramp projection volume and upward launch face',()=>{
 const ramp=twilightRampsForSelection({mode:'stunt'})[0],v=twilightRampVolumes(ramp)[0];
 // Source raw heading180 gives a zero-yaw object transform. Its profile top
 // has normal(0,.940887,.338719); moving along rawheading−Z climbs this face.
 const top=150-305*.3387190103530884/.9408869743347168;
 const hit=volumeContact(v,point([2350,top-.1,2405]));assert.ok(hit);
 close(hit.normal.x,0);close(hit.normal.y,.9408869743347168);close(hit.normal.z,.3387190103530884);
 assert.ok(hit.normal.x*ramp.tx+hit.normal.z*ramp.tz<0);
 assert.equal(volumeContact(v,point([2451,top-.1,2405])),null,'the ramp side is finite');
 assert.equal(volumeContact(v,point([2350,1000,2405])),null);
 const second=twilightRampsForSelection({mode:'stunt'})[1],q=twilightRampVolumes(second)[0];
 // Native heading270 rotates local+X into world−Z and local+Z into world+X.
 close(q.origin[0],(5105-305)*S);close(q.origin[1],150*S);close(q.origin[2],(-7950-100)*S);
 assert.equal(q.flag,1);assert.equal(q.rampId,second.id);
 assert.throws(()=>twilightRampVolumes({...ramp,tx:4}),TypeError);
});

test('each selected course uses four fixed solids plus only its four source ramps',()=>{
 for(const selection of [{difficulty:0},{difficulty:1},{difficulty:2},{difficulty:3},{mode:'stunt'}]){
  const ramps=twilightRampsForSelection(selection),solids=twilightContactVolumes(ramps);assert.equal(solids.volumes.length,8);
  assert.equal(new Set(solids.volumes.map(q=>q.id)).size,8);
  assert.equal(solids.volumes.filter(q=>q.kind==='ramp').length,4);
  assert.equal(solids.volumes.filter(q=>q.flag===0).length,4);
  assert.equal(solids.volumes.filter(q=>q.flag===1).length,4);
  assert.ok(solids.query({x:0,y:0,z:-950*S}).some(q=>q.sourceRecordAddress==='0x800d7930'));
 }
 assert.equal(twilightContactVolumes().volumes.length,4);
 assert.equal(twilightContactVolumes([{sourceVolumeProfile:true,sourceCourseIndex:7}]).volumes.length,4);
 assert.throws(()=>twilightContactVolumes({}),TypeError);
 const one=twilightFixedVolumes(),two=twilightFixedVolumes();one[0].axes[0][0]=999;assert.notEqual(two[0].axes[0][0],999);
 assert.throws(()=>{TWILIGHT_NATIVE_BOXES.fixed[0].origin[0]=999;},TypeError);
});
