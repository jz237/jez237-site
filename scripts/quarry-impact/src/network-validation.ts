import {validStartReadiness} from '../multiplayer/start-readiness';
import {isOnlineOpponentSet} from './online-opponents';
import {validNetworkDrives} from './drivetrain/network';
import {isImpactMaterial} from './impact-material';
import {validChasePhysics} from './online-chase';
import {validOnlineCar,extendedOnlineCar} from './online-roster';
import {validDrivingAssists} from './driving-assists';
import {validTransmissionInput,validTransmissionState} from './transmission';
import {validEngineStall} from './engine-stall';
import {validOnlineEventState} from './online-events';
import {onlineClassEligible,validOnlineSetup,validOnlineLoadout} from './online-setup';
import {validCapacity} from './online-capacity';
import {validComponents} from './component-damage';
import {validCup} from '../multiplayer/cup';
import type { Snapshot } from '../multiplayer/protocol';

/** A stale/incompatible server must never feed undefined/NaN into physics or Web Audio. */
export function validOnlineSnapshot(s:Snapshot):boolean {
  const finite=(v:unknown):v is number=>typeof v==='number'&&Number.isFinite(v);
  const vector=(v:any)=>v&&['x','y','z'].every(k=>finite(v[k]));
  const quaternion=(v:any)=>vector(v)&&finite(v.w)&&Math.hypot(v.x,v.y,v.z,v.w)>.5;
  const input=(v:any)=>v&&['throttle','steer','brake'].every(k=>finite(v[k]))&&typeof v.handbrake==='boolean'&&(v.assists===undefined||validDrivingAssists(v.assists))&&(v.transmission===undefined||validTransmissionInput(v.transmission));
  const dent=(v:any)=>v&&Number.isSafeInteger(v.id)&&Number.isSafeInteger(v.repair)&&finite(v.damage)&&(v.scar===undefined||typeof v.scar==='boolean')&&vector(v.localPoint)&&vector(v.localDirection);
  const patch=(v:any)=>v&&Array.isArray(v.plane)&&v.plane.length===4&&v.plane.every((n:unknown)=>finite(n)&&Math.abs(n)<1e7)&&Math.abs(Math.hypot(...v.plane.slice(0,3))-1)<.001&&finite(v.load)&&v.load>=0&&v.load<=2.5;
  const capacity=s?.capacity??8;
  if(!s||(s.raceFinishWindowSupport!==undefined&&s.raceFinishWindowSupport!==true)||(s.startReadySupport!==undefined&&s.startReadySupport!==true)||(s.startReadiness!==undefined&&(!s.startReadySupport||!validStartReadiness(s.startReadiness)||s.phase!=='countdown'||s.tick!==0||s.elapsed!==0||s.countdown!==3||s.startReadiness.pending.length===0||s.startReadiness.remainingMs<=0||s.startReadiness.pending.some(id=>id>=capacity)))||(s.opponentSetSupport!==undefined&&(s.opponentSetSupport!==true||!s.rosterSupport||!s.kiteSupport||!s.morrowSupport))||(s.opponentSet!==undefined&&(!isOnlineOpponentSet(s.opponentSet)||!s.opponentSetSupport))||(s.classEngineSupport!==undefined&&(s.classEngineSupport!==true||s.eventSupport!==true))||(s.event?.rules?.classLimit!==undefined&&s.classEngineSupport!==true)||(s.spinTierSupport!==undefined&&(s.spinTierSupport!==true||s.eventSupport!==true))||(s.event?.spinTiers===1&&s.spinTierSupport!==true)||(s.alderSupport!==undefined&&(s.alderSupport!==true||s.morrowSupport!==true||s.kiteSupport!==true||s.rosterSupport!==true))||(s.morrowSupport!==undefined&&(s.morrowSupport!==true||s.kiteSupport!==true||s.rosterSupport!==true))||(s.chaseSupport!==undefined&&(s.chaseSupport!==true||s.eventSupport!==true))||(s.event?.rules?.chase!==undefined&&s.chaseSupport!==true)||(s.kiteSupport!==undefined&&(s.kiteSupport!==true||s.rosterSupport!==true))||(s.arenaSupport!==undefined&&(s.arenaSupport!==true||s.eventSupport!==true))||(s.event?.rules?.arena&&s.event.rules.arena!=='quarry-arena-v1'&&!s.arenaSupport)||(s.courseSupport!==undefined&&(s.courseSupport!==true||s.eventSupport!==true))||(s.event?.rules?.course&&s.event.rules.course!=='quarry-v1'&&!s.courseSupport)||(s.rosterSupport!==undefined&&s.rosterSupport!==true)||(s.timedRaceSupport!==undefined&&(s.timedRaceSupport!==true||s.eventSupport!==true))||(s.event?.rules?.raceDuration!==undefined&&s.timedRaceSupport!==true)||(s.noRespawnDerbySupport!==undefined&&(s.noRespawnDerbySupport!==true||s.eventSupport!==true))||(s.event?.rules?.derby==='score-no-respawn'&&s.noRespawnDerbySupport!==true)||(s.absSupport!==undefined&&(s.absSupport!==true||s.assistsSupport!==true))||(s.assistsSupport!==undefined&&s.assistsSupport!==true)||(s.transmissionSupport!==undefined&&s.transmissionSupport!==true)||(s.eventSupport!==undefined&&s.eventSupport!==true)||(s.event!==undefined&&(!s.eventSupport||!validOnlineEventState(s.event,s.mode,capacity)))||!validCapacity(capacity)||(s.liverySupport!==undefined&&s.liverySupport!==true)||(s.liveryRevision!==undefined&&(!s.liverySupport||!Number.isSafeInteger(s.liveryRevision)||s.liveryRevision<0))||(s.setupSupport!==undefined&&s.setupSupport!==true)||(s.setupRule!==undefined&&(!s.setupSupport||!['open','stock'].includes(s.setupRule)))||(s.cupSupport!==undefined&&s.cupSupport!==true)||(s.cup!==undefined&&(!validCup(s.cup)||s.cup.participants.length!==capacity||!s.cupSupport))||!Number.isSafeInteger(s.tick)||!finite(s.elapsed)||!finite(s.countdown)||
    !['derby','race','playground'].includes(s.mode)||!['lobby','countdown','playing','result'].includes(s.phase)||
    !Array.isArray(s.cars)||s.cars.length!==capacity||new Set(s.cars.map(c=>c.id)).size!==capacity||
    !Array.isArray(s.props)||s.props.length>128||new Set(s.props.map(p=>p?.id)).size!==s.props.length||!Array.isArray(s.damage)||!Array.isArray(s.members)||s.members.length>capacity||!Array.isArray(s.ranking)||!s.ack||typeof s.ack!=='object')return false;
  if(!validNetworkDrives(s))return false;
  return s.cars.every(c=>c&&Number.isInteger(c.id)&&c.id>=0&&c.id<capacity&&
    validOnlineCar(c.kind)&&(c.kind!=='kite'||s.kiteSupport===true)&&(c.kind!=='morrow'||s.morrowSupport===true)&&(c.kind!=='alder'||s.alderSupport===true)&&(s.rosterSupport===true||!extendedOnlineCar(c.kind))&&vector(c.p)&&quaternion(c.q)&&vector(c.v)&&vector(c.av)&&
    ['health','inflicted','damageLeft','damageRight','steering','speed','rpm','gear','passed','nextCheckpoint','lap','finishTime','penalty','repair','slip'].every(k=>finite((c as any)[k]))&&
    (c.contactScrape===undefined||finite(c.contactScrape)&&c.contactScrape>=0&&c.contactScrape<=1)&&validEngineStall(c.engineStall)&&(c.transmission===undefined||validTransmissionState(c.transmission)&&[-1,0,1,2,3,4,5].includes(c.gear))&&(c.components===undefined||validComponents(c.components))&&(c.setup===undefined||validOnlineSetup(c.setup))&&(!c.setup?.engineRestriction||s.classEngineSupport===true)&&(!s.event?.rules.classLimit||onlineClassEligible(c.kind,c.setup,s.event.rules.classLimit))&&
    c.nextCheckpoint>=0&&c.nextCheckpoint<24&&((s.courseSupport||s.arenaSupport)?['asphalt','gravel','mud']:['asphalt','gravel']).includes(c.surface)&&input(c.input)&&
    Array.isArray(c.wheels)&&c.wheels.length<=4&&c.wheels.every(w=>finite(w.suspension)&&finite(w.rotation)&&(w.slip===undefined||finite(w.slip)&&w.slip>=0&&w.slip<1e6)&&(w.patch===undefined||typeof w.contact==='boolean'&&patch(w.patch)))&&
    (c.dents===undefined||Array.isArray(c.dents)&&c.dents.length<=334&&c.dents.every(dent)))&&
    s.props.every(p=>p&&Number.isInteger(p.id)&&p.id>=0&&p.id<128&&vector(p.p)&&quaternion(p.q)&&vector(p.v)&&vector(p.av))&&
    s.damage.every(d=>dent(d)&&(d.material===undefined||isImpactMaterial(d.material))&&Number.isInteger(d.car)&&d.car>=0&&d.car<capacity&&finite(d.tick))&&
    s.members.every(m=>m&&validOnlineCar(m.kind)&&((m.kind!=='kite'&&m.loadout?.kind!=='kite')||s.kiteSupport===true)&&((m.kind!=='morrow'&&m.loadout?.kind!=='morrow')||s.morrowSupport===true)&&((m.kind!=='alder'&&m.loadout?.kind!=='alder')||s.alderSupport===true)&&(s.rosterSupport===true||!extendedOnlineCar(m.kind)&&!extendedOnlineCar(m.loadout?.kind))&&(m.liveryLayers===undefined||Number.isInteger(m.liveryLayers)&&m.liveryLayers>=0&&m.liveryLayers<=32)&&(m.loadout===undefined||validOnlineLoadout(m.loadout))&&(!m.loadout?.setup.engineRestriction||s.classEngineSupport===true)&&Number.isInteger(m.id)&&m.id>=0&&m.id<capacity&&typeof m.name==='string'&&m.name.length<=18&&typeof m.host==='boolean'&&typeof m.connected==='boolean'&&(m.cupId===undefined||typeof m.cupId==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(m.cupId)))&&
    s.ranking.length===capacity&&new Set(s.ranking).size===capacity&&s.ranking.every(id=>Number.isInteger(id)&&id>=0&&id<capacity)&&
    (!s.event?.rules.chase||validChasePhysics(s.event.rules.chase,capacity,s.event.chase,s.cars,s.elapsed)&&((s.phase==='result')===s.event.chase!.results.every(r=>r.outcome!=='running')));
}
