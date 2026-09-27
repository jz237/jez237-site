import assert from 'node:assert/strict';
import test from 'node:test';
import { AdmissionLedger, EMPTY_ROOM_MS, JOIN_TIMEOUT_MS, MAX_ROOMS, ROOM_LIFETIME_MS, roomDeadline } from './admission';

test('admission bounds worlds globally before allocation while full-room reconnects remain possible', () => {
  const ledger = new AdmissionLedger(); const now = 1000;
  for (let i = 0; i < MAX_ROOMS; i++) { const r = ledger.admit(`ROOM-${i}`, `hash-${i}`, now); assert.ok(r.ok); assert.ok(ledger.activate(`ROOM-${i}`, r.lease.id, now)); }
  assert.deepEqual(ledger.admit('EXTRA', 'hash-extra', now).ok, false);
  const joined = ledger.admit('ROOM-0', 'hash-extra', now); assert.ok(joined.ok);
  ledger.release('ROOM-0', 'forged-generation'); assert.equal(Object.keys(ledger.state.rooms).length, MAX_ROOMS);
  ledger.release('ROOM-0', joined.lease.id); assert.ok(ledger.admit('EXTRA', 'hash-extra', now).ok);
});

test('unclaimed, empty, and hard-expired leases reap; reconnect never extends two-hour deadline', () => {
  const ledger = new AdmissionLedger(); const r = ledger.admit('ABCDEF', 'hash-a', 1000); assert.ok(r.ok);
  assert.equal(ledger.activate('ABCDEF', r.lease.id, 31_000), false);
  const active = ledger.admit('ABCDEF', 'hash-a', 31_001); assert.ok(active.ok);
  assert.notEqual(active.lease.id, r.lease.id); assert.ok(ledger.activate('ABCDEF', active.lease.id, 31_002));
  ledger.idle('ABCDEF', active.lease.id, 40_000 + EMPTY_ROOM_MS);
  assert.ok(ledger.activate('ABCDEF', active.lease.id, 40_001));
  assert.equal(ledger.state.rooms.ABCDEF.expiresAt, 31_001 + ROOM_LIFETIME_MS);
  assert.equal(ledger.activate('ABCDEF', active.lease.id, 31_001 + ROOM_LIFETIME_MS), false);
  const empty = ledger.admit('EMPTY', 'hash-b', 8_000_000); assert.ok(empty.ok);
  ledger.activate('EMPTY', empty.lease.id, 8_000_000); ledger.idle('EMPTY', empty.lease.id, 8_000_000 + EMPTY_ROOM_MS);
  ledger.prune(8_000_000 + EMPTY_ROOM_MS); assert.equal(ledger.state.rooms.EMPTY, undefined);
});

test('per-network creation and connection limits persist across ledger restore and expire', () => {
  const ledger = new AdmissionLedger();
  for (let i = 0; i < 3; i++) { const r = ledger.admit(`CODE-${i}`, 'private-hash', 1000); assert.ok(r.ok); ledger.release(`CODE-${i}`, r.lease.id); }
  const restored = new AdmissionLedger(structuredClone(ledger.state));
  assert.equal(restored.admit('FOURTH', 'private-hash', 1001).ok, false);
  assert.ok(restored.admit('FOURTH', 'private-hash', 601_001).ok);
  for (let i = 0; i < 59; i++) assert.ok(restored.admit('FOURTH', 'private-hash', 601_002).ok);
  assert.equal(restored.admit('FOURTH', 'private-hash', 601_002).ok, false);
  assert.ok(restored.admit('FOURTH', 'private-hash', 661_002).ok);
});

test('socket churn cannot postpone earliest pending, empty or absolute room expiry', () => {
  const hard = 1000 + ROOM_LIFETIME_MS;
  assert.equal(roomDeadline(hard, undefined, [2000, 5000]), 2000 + JOIN_TIMEOUT_MS);
  assert.equal(roomDeadline(hard, 5000, []), 5000 + EMPTY_ROOM_MS);
  assert.equal(roomDeadline(hard, hard - 1000, [hard - 100]), hard);
  assert.equal(roomDeadline(hard, undefined, []), hard);
});
