import {validOnlineEventState} from './online-events';
import {validOnlineSetup,validOnlineLoadout} from './online-setup';
import {validCapacity} from './online-capacity';
import {validComponents} from './component-damage';
import {validCup} from '../multiplayer/cup';
import type { Snapshot } from '../multiplayer/protocol';

/** A stale/incompatible server must never feed undefined/NaN into physics or Web Audio. */
export function validOnlineSnapshot(s:Snapshot):boolean {
  const finite=(v:unknown):v is number=>typeof v==='number'&&Number.isFinite(v);
  const vector=(v:any)=>v&&['x','y','z'].every(k=>finite(v[k]));
  const quaternion=(v:any)=>vector(v)&&finite(v.w)&&Math.hypot(v.x,v.y,v.z,v.w)>.5;
  const input=(v:any)=>v&&['throttle','steer','brake'].every(k=>finite(v[k]))&&typeof v.handbrake==='boolean';
  const dent=(v:any)=>v&&Number.isSafeInteger(v.id)&&Number.isSafeInteger(v.repair)&&finite(v.damage)&&vector(v.localPoint)&&vector(v.localDirection);
  const capacity=s?.capacity??8;
  if(!s||(s.eventSupport!==undefined&&s.eventSupport!==true)||(s.event!==undefined&&(!s.eventSupport||!validOnlineEventState(s.event,s.mode,capacity)))||!validCapacity(capacity)||(s.liverySupport!==undefined&&s.liverySupport!==true)||(s.liveryRevision!==undefined&&(!s.liverySupport||!Number.isSafeInteger(s.liveryRevision)||s.liveryRevision<0))||(s.setupSupport!==undefined&&s.setupSupport!==true)||(s.setupRule!==undefined&&(!s.setupSupport||!['open','stock'].includes(s.setupRule)))||(s.cupSupport!==undefined&&s.cupSupport!==true)||(s.cup!==undefined&&(!validCup(s.cup)||s.cup.participants.length!==capacity||!s.cupSupport))||!Number.isSafeInteger(s.tick)||!finite(s.elapsed)||!finite(s.countdown)||
    !['derby','race','playground'].includes(s.mode)||!['lobby','countdown','playing','result'].includes(s.phase)||
    !Array.isArray(s.cars)||s.cars.length!==capacity||new Set(s.cars.map(c=>c.id)).size!==capacity||
    !Array.isArray(s.props)||s.props.length>128||!Array.isArray(s.damage)||!Array.isArray(s.members)||s.members.length>capacity||!Array.isArray(s.ranking)||!s.ack||typeof s.ack!=='object')return false;
  return s.cars.every(c=>c&&Number.isInteger(c.id)&&c.id>=0&&c.id<capacity&&
    ['coupe','sedan','hatch'].includes(c.kind)&&vector(c.p)&&quaternion(c.q)&&vector(c.v)&&vector(c.av)&&
    ['health','inflicted','damageLeft','damageRight','steering','speed','rpm','gear','passed','nextCheckpoint','lap','finishTime','penalty','repair','slip'].every(k=>finite((c as any)[k]))&&
    (c.components===undefined||validComponents(c.components))&&(c.setup===undefined||validOnlineSetup(c.setup))&&
    c.nextCheckpoint>=0&&c.nextCheckpoint<24&&['asphalt','gravel'].includes(c.surface)&&input(c.input)&&
    Array.isArray(c.wheels)&&c.wheels.length<=4&&c.wheels.every(w=>finite(w.suspension)&&finite(w.rotation))&&
    (c.dents===undefined||Array.isArray(c.dents)&&c.dents.length<=334&&c.dents.every(dent)))&&
    s.props.every(p=>p&&Number.isInteger(p.id)&&vector(p.p)&&quaternion(p.q)&&vector(p.v)&&vector(p.av))&&
    s.damage.every(d=>dent(d)&&Number.isInteger(d.car)&&d.car>=0&&d.car<capacity&&finite(d.tick))&&
    s.members.every(m=>m&&(m.liveryLayers===undefined||Number.isInteger(m.liveryLayers)&&m.liveryLayers>=0&&m.liveryLayers<=32)&&(m.loadout===undefined||validOnlineLoadout(m.loadout))&&Number.isInteger(m.id)&&m.id>=0&&m.id<capacity&&typeof m.name==='string'&&m.name.length<=18&&typeof m.host==='boolean'&&typeof m.connected==='boolean'&&(m.cupId===undefined||typeof m.cupId==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(m.cupId)))&&
    s.ranking.length===capacity&&new Set(s.ranking).size===capacity&&s.ranking.every(id=>Number.isInteger(id)&&id>=0&&id<capacity);
}
