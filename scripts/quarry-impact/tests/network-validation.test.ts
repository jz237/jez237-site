import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import { Simulation } from '../multiplayer/simulation';
import { validOnlineSnapshot } from '../src/network-validation';

test('live snapshots are accepted; stale audio state and nonfinite transforms are rejected',async()=>{
  await R.init();const sim=new Simulation(R);
  try {
    const snapshot={...sim.snapshot(true),members:[],ack:{}};
    assert.equal(validOnlineSnapshot(snapshot),true);
    const stale=structuredClone(snapshot);delete (stale.cars[0] as any).slip;
    assert.equal(validOnlineSnapshot(stale),false,'Old server must fail before it reaches AudioParam');
    const invalid=structuredClone(snapshot);invalid.cars[1].p.x=NaN;
    assert.equal(validOnlineSnapshot(invalid),false,'Bad transform must fail before it reaches rendering');
    const duplicate=structuredClone(snapshot);duplicate.cars[1].id=0;
    assert.equal(validOnlineSnapshot(duplicate),false,'Each driver owns a unique car slot');
  }finally{sim.dispose();}
});
