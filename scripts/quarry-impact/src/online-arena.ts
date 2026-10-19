import {ARENA_NAMES,type ArenaId} from './arena-id';
import {getRaceCourse,type RaceCourse} from './race-course';
import type {ArenaLayout} from './derby-arena';
import {HARROW_ARENA,harrowGround,buildHarrowPhysics} from './harrow-arena';
import {BRIARHILL_ARENA,briarhillGround,buildBriarhillPhysics} from './briarhill-arena';
import {FOUNDRY_ARENA,foundryGround,buildFoundryPhysics} from './foundry-arena';
import {WRENFORD_PIT_ARENA,wrenfordPitGround,buildWrenfordPitPhysics} from './wrenford-pit-arena';
import {KESTREL_RING_ARENA,kestrelRingGround,buildKestrelRingPhysics} from './kestrel-ring-arena';
const legacy:ArenaLayout={x:0,z:0,radius:46,segments:66,spawnRadius:32,fenceRadius:50};
const entries={
 'quarry-arena-v1':{layout:legacy,ground:getRaceCourse()},
 'harrow-bowl-v1':{layout:HARROW_ARENA,ground:{...getRaceCourse(),...harrowGround,name:ARENA_NAMES['harrow-bowl-v1'],buildPhysics:buildHarrowPhysics}},
 'briarhill-bowl-v1':{layout:BRIARHILL_ARENA,ground:{...getRaceCourse(),...briarhillGround,name:ARENA_NAMES['briarhill-bowl-v1'],buildPhysics:buildBriarhillPhysics}},
 'foundry-yard-v1':{layout:FOUNDRY_ARENA,ground:{...getRaceCourse(),...foundryGround,name:ARENA_NAMES['foundry-yard-v1'],buildPhysics:buildFoundryPhysics}},
 'wrenford-pit-v1':{layout:WRENFORD_PIT_ARENA,ground:{...getRaceCourse(),...wrenfordPitGround,name:ARENA_NAMES['wrenford-pit-v1'],buildPhysics:buildWrenfordPitPhysics}},
 'kestrel-ring-v1':{layout:KESTREL_RING_ARENA,ground:{...getRaceCourse(),...kestrelRingGround,name:ARENA_NAMES['kestrel-ring-v1'],buildPhysics:buildKestrelRingPhysics}},
} satisfies Record<ArenaId,{layout:ArenaLayout;ground:RaceCourse}>;
export const onlineArena=(id:ArenaId='quarry-arena-v1')=>entries[id];
