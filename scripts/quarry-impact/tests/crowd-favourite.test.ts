import test from 'node:test';
import assert from 'node:assert/strict';
import {EventAwards,CROWD_FAVOURITE} from '../src/event-awards';
const awardsOf=(a:EventAwards)=>a.awards('derby',[0,1,2,3].map(id=>({id,inflicted:0,health:50})) as never,[]) as {key:string;title:string;id:number;value:number;detail:string}[];
test('CROWD FAVOURITE goes to the best showpiece moments, from three: rolls, pins, slams, dominoes, pile-ups, fires, takedowns',()=>{
 const a=new EventAwards();a.rolled(1,2,1);a.pinned(1,3,10);assert.ok(!awardsOf(a).some(x=>x.key==='crowd'),'two is not enough');
 a.slammed(1,0,20);a.dominoed(2,3,30);a.pileUp(2,4,40);
 const fav=awardsOf(a).find(x=>x.key==='crowd');assert.ok(fav&&fav.id===1&&fav.value===CROWD_FAVOURITE&&fav.detail==='3 moments the crowd loved');
 a.setAlight(2,0,50);assert.equal(awardsOf(a).find(x=>x.key==='crowd')?.id,2,'the better set of moments wins once both qualify');
});
test("plain hits and a driver's own breakdowns do not make a crowd favourite",()=>{
 const a=new EventAwards();for(let i=0;i<5;i++)a.hit(3,1,30,false,i*10,20);for(let i=0;i<5;i++)a.failure(2,'DIFF BROKEN',100+i*10,28);
 assert.ok(!awardsOf(a).some(x=>x.key==='crowd'));
});
