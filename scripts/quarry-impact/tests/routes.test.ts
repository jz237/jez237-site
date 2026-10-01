import test from 'node:test';
import assert from 'node:assert/strict';
import {readEventOptions,DEFAULT_EVENT,raceGridSlot,directionForCar,circuitRoute,checkRoute,lapProgress} from '../src/event-rules';
import {WAYPOINTS,WaypointRace,waypointSequence,roadNavigation,nearestRoad} from '../src/waypoint-race';
import {verifyRouteRevision} from './route-invariants';
test('older event saves migrate to circuit laps and all route choices round trip',()=>{
  assert.equal(readEventOptions('{"version":1,"direction":"reverse"}').race,'laps');
  for(const race of ['laps','ordered','free','random']as const){const options={...DEFAULT_EVENT,race,direction:'opposing' as const};assert.deepEqual(readEventOptions(JSON.stringify(options)),options);}
  assert.equal(readEventOptions('{"version":1,"race":"script"}').race,'laps');
});
test('opposing 24-car grid has no intersecting full-size chassis and correct individual route accounting',()=>{
  const grid=Array.from({length:24},(_,i)=>raceGridSlot(i,'opposing'));
  const projection=(p:typeof grid[0],u:{x:number;z:number})=>2.6*Math.abs(Math.sin(p.yaw)*u.x+Math.cos(p.yaw)*u.z)+1.05*Math.abs(Math.cos(p.yaw)*u.x-Math.sin(p.yaw)*u.z);
  for(let i=0;i<24;i++)for(let j=i+1;j<24;j++){const a=grid[i],b=grid[j],axes=[a.yaw,b.yaw].flatMap(yaw=>[{x:Math.sin(yaw),z:Math.cos(yaw)},{x:Math.cos(yaw),z:-Math.sin(yaw)}]);assert.ok(axes.some(u=>Math.abs((a.x-b.x)*u.x+(a.z-b.z)*u.z)>projection(a,u)+projection(b,u)),`${i}/${j}`);}
  for(let i=0;i<24;i++){const route=circuitRoute(directionForCar('opposing',i)),p=grid[i];let next=p.next,passed=p.passed;for(let n=0;n<24-p.passed;n++){const target=route[next];assert.equal(checkRoute(route,target.x,target.z,next,Infinity).passed,true);passed++;next=(next+1)%24;}assert.equal(lapProgress(passed,1).finished,true);assert.equal(next,1);}
});
test('ordered waypoints reject skipped stations, duplicate collection and early finishes across rounds',()=>{
  const race=new WaypointRace('ordered',2,17);assert.equal(race.sample(0,WAYPOINTS[0]),null);assert.equal(race.sample(0,WAYPOINTS[3]),null);
  for(let round=0;round<2;round++){for(let i=1;i<=5;i++){assert.equal(race.sample(0,WAYPOINTS[i])?.id,i);assert.equal(race.sample(0,WAYPOINTS[i]),null);}assert.equal(race.sample(0,WAYPOINTS[0])?.finished,round===1);}
  assert.equal(race.get(0).passed,12);assert.deepEqual(race.available(0),[]);assert.equal(race.sample(0,WAYPOINTS[1]),null);assert.equal(race.get(1).passed,0);
});
test('free-order racers can choose different orders and must collect all stations before finish',()=>{
  const race=new WaypointRace('free',1,1);
  for(const [id,order]of [[0,[5,2,4,1,3]],[1,[1,4,3,5,2]]]as const){for(const target of order){assert.ok(race.available(id).includes(target));race.sample(id,WAYPOINTS[target]);assert.equal(race.sample(id,WAYPOINTS[target]),null);}assert.deepEqual(race.available(id),[0]);race.sample(id,WAYPOINTS[0]);assert.equal(race.get(id).finished,true);}
});
test('random waypoint order is shared, deterministic, complete and varies across seeds and rounds',()=>{
  const orders=new Set<string>();for(let seed=1;seed<=30;seed++){const race=new WaypointRace('random',2,seed);for(let round=0;round<2;round++){const order=waypointSequence(seed,round);orders.add(order.join());assert.deepEqual([...order].sort(),[1,2,3,4,5]);for(const target of [...order,0]){assert.deepEqual(race.available(0),[target]);assert.deepEqual(race.available(1),[target]);race.sample(0,WAYPOINTS[target]);race.sample(1,WAYPOINTS[target]);}}}assert.ok(orders.size>20);
});
test('road navigation takes the shorter direction and stays finite at exact gates',()=>{
  for(const from of WAYPOINTS)for(const to of WAYPOINTS){const nav=roadNavigation(from,to.id);assert.ok(Number.isFinite(nav.distance));assert.ok(nav.next>=0&&nav.next<24);assert.equal(nav.route.length,24);assert.ok(nearestRoad(from).distance<1e-8);}
  assert.equal(roadNavigation(WAYPOINTS[0],1).reverse,false);assert.equal(roadNavigation(WAYPOINTS[0],5).reverse,true);
});
test('waypoint navigation keeps its destination until collection and resets cleanly on a new target',()=>{
  const race=new WaypointRace('random',1,22),first=race.available(0)[0];race.navigation(0,WAYPOINTS[0]);const old=race.get(0).nav;race.navigation(0,WAYPOINTS[2]);assert.equal(race.get(0).nav,old);race.sample(0,WAYPOINTS[first]);race.navigation(0,WAYPOINTS[first]);assert.notEqual(race.get(0).nav,old);
});
test('route additions retain exact previous-release source recovery',verifyRouteRevision);
