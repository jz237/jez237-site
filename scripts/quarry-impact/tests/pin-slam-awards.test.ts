import test from 'node:test';
import assert from 'node:assert/strict';
import {EventAwards,PIN_MASTER} from '../src/event-awards';
const awardsOf=(a:EventAwards)=>a.awards('derby',[0,1,2,3].map(id=>({id,inflicted:0,health:50})) as never,[]) as {key:string;title:string;id:number;value:number;detail:string}[];
test('PIN MASTER goes to the driver with the most counted pins, from two up; one pin is not a speciality',()=>{
 const a=new EventAwards();a.pinned(2,1,10);assert.ok(!awardsOf(a).some(x=>x.key==='pinner'),'one pin');
 a.pinned(2,3,20);a.pinned(1,2,25);const pin=awardsOf(a).find(x=>x.key==='pinner');
 assert.ok(pin&&pin.id===2&&pin.value===PIN_MASTER&&pin.title==='PIN MASTER'&&pin.detail==='pinned 2 cars');
 a.pinned(-1,2,30);a.pinned(3,3,31);assert.equal(awardsOf(a).find(x=>x.key==='pinner')?.id,2,'no credit for nobody or for pinning yourself');
});
test('WALL SLAMMER goes to the driver who slammed the most cars into the wall; a reset forgets both',()=>{
 const a=new EventAwards();a.slammed(1,2,5);a.slammed(3,2,6);a.slammed(3,0,7);
 const slam=awardsOf(a).find(x=>x.key==='slammer');assert.ok(slam&&slam.id===3&&slam.value===2&&slam.detail==='slammed 2 cars into the wall');
 a.slammed(1,0,8);assert.equal(awardsOf(a).find(x=>x.key==='slammer')?.id,1,'a tie goes to the lower car number');
 a.reset();assert.ok(!awardsOf(a).some(x=>x.key==='slammer'||x.key==='pinner'));
});
test('pins, wall slams and pile-ups are replay highlights, a bigger pile-up ranking higher',()=>{
 const a=new EventAwards();a.pinned(1,2,3);a.slammed(2,3,10);a.pileUp(0,4,20);a.pileUp(3,7,30);a.pileUp(1,1,40);a.pileUp(-1,5,50);
 const h=a.highlights(10) as {label?:string;attacker:number;time:number;score?:number}[];
 assert.deepEqual(h.map(m=>m.label),['PINNED','WALL SLAM','PILE-UP ×4','PILE-UP ×7'],'in time order (highlights sit 2 s or more apart); a one-car or nobody pile-up is no moment');
 const top=a.highlights(1) as {label?:string}[];assert.equal(top[0].label,'PILE-UP ×7','the biggest pile-up is the best moment');
});
