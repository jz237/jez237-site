import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { AdmissionLedger, EMPTY_ROOM_MS, JOIN_TIMEOUT_MS, ROOM_LIFETIME_MS } from './admission';

// Exercise the actual Worker lifecycle with only the hosting APIs and expensive physics mocked.
// The room/unit suite separately uses real Rapier and compares browser/server physics.
const source = await build({ entryPoints: ['worker.ts'], absWorkingDir: import.meta.dirname, bundle: true, write: false, format: 'esm', platform: 'neutral', plugins: [{ name: 'host-test', setup(b) {
  b.onResolve({ filter: /^(cloudflare:workers|\.\/room|\.\/\.generated\/rapier-worker\.mjs)$/ }, args => ({ path: args.path, namespace: 'host-test' }));
  b.onLoad({ filter: /.*/, namespace: 'host-test' }, args => ({ contents: args.path === 'cloudflare:workers'
    ? 'export class DurableObject { constructor(ctx,env){this.ctx=ctx;this.env=env;} }'
    : args.path === './room'
      ? `export class Room { static allocations=0; constructor(){Room.allocations++;globalThis.__quarryAllocations=(globalThis.__quarryAllocations??0)+1;this.activeCount=0;this.members=[];this.sim={phase:'lobby'};} connect(){const id=this.members.length;this.members.push({id,connected:true});this.activeCount++;return id;} disconnect(id){if(this.members[id]?.connected){this.members[id].connected=false;this.activeCount--;}} dispose(){} save(){return {sessions:this.members.map(member=>({member:{...member},token:'test-'+member.id,seq:0})),updated:Date.now()};} restore(saved){this.members=saved.sessions.map(s=>({...s.member,connected:false}));this.activeCount=0;} receive(){} }`
      : 'export default { init(){} };', loader: 'js' }));
} }] });
const { QuarryRoom } = await import('data:text/javascript;base64,' + Buffer.from(source.outputFiles[0].text).toString('base64'));

test('actual Worker allocates only after hello, rejects silent sockets, and socket churn cannot extend expiry', async () => {
  const originalNow = Date.now, OriginalResponse = globalThis.Response;
  const originalPair = (globalThis as any).WebSocketPair;
  let now = 1000; Date.now = () => now;
  class Socket {
    readyState = 1; attachment: any; closed?: number;
    serializeAttachment(a: unknown) { this.attachment = structuredClone(a); }
    deserializeAttachment() { return this.attachment; }
    send() {}
    close(code: number) { this.closed = code; this.readyState = 3; }
  }
  (globalThis as any).WebSocketPair = class { 0 = new Socket(); 1 = new Socket(); };
  (globalThis as any).Response = class { constructor(_body: unknown, public init: unknown) {} };
  const ledger = new AdmissionLedger();
  const gate = { activate: async (code: string, id: string, version: number) => ledger.activate(code, id, now, version), idle: async (code: string, id: string, deadline: number, version: number) => ledger.idle(code, id, deadline, version), release: async (code: string, id: string) => ledger.release(code, id) };
  function setup(code: string) {
    const data = new Map<string, unknown>(); let alarm: number | null = null;
    const sockets: Socket[] = [];
    const storage = {
      get: async (key: string) => structuredClone(data.get(key)),
      put: async (key: string | Record<string, unknown>, value?: unknown) => { if (typeof key === 'string') data.set(key, structuredClone(value)); else for (const [k, v] of Object.entries(key)) data.set(k, structuredClone(v)); },
      getAlarm: async () => alarm, setAlarm: async (time: number) => { alarm = time; }, deleteAll: async () => { data.clear(); alarm = null; }
    };
    const ctx = { storage, blockConcurrencyWhile: (f: () => unknown) => f(), getWebSockets: () => sockets.filter(s => s.readyState !== 3), acceptWebSocket: (s: Socket) => sockets.push(s), waitUntil: (_p: Promise<unknown>) => {} };
    const room = new QuarryRoom(ctx, { ADMISSION: { getByName: () => gate } });
    async function join() {
      const admission = ledger.admit(code, 'hash', now); assert.ok(admission.ok);
      await room.fetch(new Request('https://worker/rooms/' + code, { headers: { 'X-Quarry-Lease': JSON.stringify(admission.lease) } }));
      return sockets.at(-1)!;
    }
    return { room, join, getAlarm: () => alarm, runAlarm: async () => { alarm = null; await room.alarm(); }, data };
  }
  try {
    (globalThis as any).__quarryAllocations = 0;
    const silent = setup('ABCDEF'); const pending = await silent.join();
    assert.equal((globalThis as any).__quarryAllocations, 0);
    assert.equal(silent.getAlarm(), 1000 + JOIN_TIMEOUT_MS);
    now = 1000 + JOIN_TIMEOUT_MS; await silent.runAlarm();
    assert.equal(pending.closed, 1008); assert.equal((globalThis as any).__quarryAllocations, 0);
    assert.equal(ledger.state.rooms.ABCDEF, undefined);

    now = 20_000; const active = setup('BCDEFG'); const player = await active.join();
    await active.room.webSocketMessage(player, JSON.stringify({ type: 'hello', protocol: 1, name: 'TEST', kind: 'coupe' }));
    assert.equal((globalThis as any).__quarryAllocations, 1);
    now += JOIN_TIMEOUT_MS; await active.runAlarm();
    const hard = 20_000 + ROOM_LIFETIME_MS; assert.equal(active.getAlarm(), hard);
    const another = await active.join(); assert.equal(active.getAlarm(), now + JOIN_TIMEOUT_MS);
    another.close(1000); await active.room.webSocketClose(another, 1000);
    assert.equal(active.getAlarm(), now + JOIN_TIMEOUT_MS, 'closing a socket must not overwrite the earlier alarm');
    now = hard; await active.room.webSocketMessage(player, JSON.stringify({ type: 'ping', sent: 0 }));
    assert.equal(player.closed, 4000); assert.equal(active.data.size, 0); assert.equal(ledger.state.rooms.BCDEFG, undefined);

    now += 1000; const empty = setup('CDEFGH'); const last = await empty.join();
    await empty.room.webSocketMessage(last, JSON.stringify({ type: 'hello', protocol: 1, name: 'TEST', kind: 'coupe' }));
    last.close(1000); await empty.room.webSocketClose(last, 1000); now += EMPTY_ROOM_MS;
    await empty.runAlarm(); assert.equal(empty.data.size, 0); assert.equal(ledger.state.rooms.CDEFGH, undefined);
  } finally { Date.now = originalNow; globalThis.Response = OriginalResponse; (globalThis as any).WebSocketPair = originalPair; delete (globalThis as any).__quarryAllocations; }
});

test('a blocked save coalesces a subsequent join and final disconnect into the latest durable state', async () => {
  const originalNow = Date.now, OriginalResponse = globalThis.Response;
  const originalPair = (globalThis as any).WebSocketPair;
  let now = 1000; Date.now = () => now;
  class Socket {
    readyState = 1; attachment: any;
    serializeAttachment(a: unknown) { this.attachment = structuredClone(a); }
    deserializeAttachment() { return this.attachment; }
    send() {}
    close() { this.readyState = 3; }
  }
  (globalThis as any).WebSocketPair = class { 0 = new Socket(); 1 = new Socket(); };
  (globalThis as any).Response = class { constructor(_body: unknown, public init: unknown) {} };
  let signalWrite!: () => void, releaseWrite!: () => void;
  const writeStarted = new Promise<void>(r => { signalWrite = r; });
  const blockedWrite = new Promise<void>(r => { releaseWrite = r; });
  const ledger = new AdmissionLedger(), data = new Map<string, any>(), sockets: Socket[] = [];
  let alarm: number | null = null, roomWrites = 0;
  const storage = {
    get: async (key: string) => structuredClone(data.get(key)),
    put: async (key: string | Record<string, unknown>, value?: unknown) => {
      if (typeof key === 'string') { data.set(key, structuredClone(value)); return; }
      // Storage captures the serialized value when put() is called, not after
      // later in-memory metadata/member mutations have occurred.
      const captured = structuredClone(key);
      if (++roomWrites === 1) { signalWrite(); await blockedWrite; }
      for (const [k, v] of Object.entries(captured)) data.set(k, v);
    },
    getAlarm: async () => alarm, setAlarm: async (time: number) => { alarm = time; },
    deleteAll: async () => { data.clear(); alarm = null; }
  };
  const gate = {
    activate: async (code: string, id: string, version: number) => ledger.activate(code, id, now, version),
    idle: async (code: string, id: string, deadline: number, version: number) => ledger.idle(code, id, deadline, version),
    release: async (code: string, id: string) => ledger.release(code, id)
  };
  const ctx = { storage, blockConcurrencyWhile: (f: () => unknown) => f(), getWebSockets: () => sockets.filter(s => s.readyState !== 3), acceptWebSocket: (s: Socket) => sockets.push(s), waitUntil: (_p: Promise<unknown>) => {} };
  try {
    const room = new QuarryRoom(ctx, { ADMISSION: { getByName: () => gate } });
    async function open() {
      const admission = ledger.admit('CDEFGH', 'network-hash', now); assert.ok(admission.ok);
      await room.fetch(new Request('https://worker/rooms/CDEFGH', { headers: { 'X-Quarry-Lease': JSON.stringify(admission.lease) } }));
      return sockets.at(-1)!;
    }
    const first = await open();
    const hello = JSON.stringify({ type: 'hello', protocol: 1, name: 'DRIVER', kind: 'coupe' });
    const firstJoin = room.webSocketMessage(first, hello);
    await writeStarted;
    now = 1500;
    const second = await open(), secondJoin = room.webSocketMessage(second, hello);
    // Allow the second valid hello to establish its member before both peers
    // leave, while the original serialized write remains blocked.
    for (let i = 0; i < 20 && room.room.activeCount !== 2; i++) await Promise.resolve();
    assert.equal(room.room.activeCount, 2);
    first.close(); const firstClose = room.webSocketClose(first, 1000, 'Left');
    now = 2000;
    second.close(); const lastClose = room.webSocketClose(second, 1000, 'Left');
    await Promise.resolve(); await Promise.resolve();
    assert.equal(roomWrites, 1, 'the original write is still in flight');
    releaseWrite();
    await Promise.all([firstJoin, secondJoin, firstClose, lastClose]);
    assert.ok(roomWrites >= 2, 'a newer snapshot must follow the obsolete in-flight write');
    assert.equal(data.get('metadata').emptySince, 2000);
    assert.equal(data.get('metadata').activityVersion, ledger.state.rooms.CDEFGH.activityVersion);
    assert.equal(ledger.state.rooms.CDEFGH.deadline, 2000 + EMPTY_ROOM_MS);
    assert.deepEqual(data.get('room').sessions.map((s: any) => [s.member.id, s.member.connected]), [[0, false], [1, false]]);
    assert.equal(data.get('room').updated, 2000);
    // A fresh instance must recover the latest idle deadline, not the first
    // join's obsolete active metadata, then expire the room on time.
    const restored = new QuarryRoom(ctx, { ADMISSION: { getByName: () => gate } });
    await restored.prepared;
    assert.equal(restored.meta.emptySince, 2000);
    now = 2000 + EMPTY_ROOM_MS; alarm = null; await restored.alarm();
    assert.equal(data.size, 0); assert.equal(ledger.state.rooms.CDEFGH, undefined);
  } finally {
    releaseWrite(); Date.now = originalNow; globalThis.Response = OriginalResponse;
    (globalThis as any).WebSocketPair = originalPair;
    delete (globalThis as any).__quarryAllocations;
  }
});

test('pending socket close during first hello cannot leave the active room with an idle lease', async () => {
  const originalNow = Date.now, OriginalResponse = globalThis.Response;
  const originalPair = (globalThis as any).WebSocketPair;
  let now = 1000; Date.now = () => now;
  class Socket {
    readyState = 1; attachment: any;
    serializeAttachment(a: unknown) { this.attachment = structuredClone(a); }
    deserializeAttachment() { return this.attachment; }
    send() {}
    close() { this.readyState = 3; }
  }
  (globalThis as any).WebSocketPair = class { 0 = new Socket(); 1 = new Socket(); };
  (globalThis as any).Response = class { constructor(_body: unknown, public init: unknown) {} };
  const deferred = () => { let resolve!: () => void; const promise = new Promise<void>(r => { resolve = r; }); return { promise, resolve }; };
  try {
    // Cover both an idle update that arrives during activation and an older idle
    // RPC that only reaches the ledger after the successful join is committed.
    for (const delayIdle of [false, true]) {
      now = 1000;
      const code = 'BCDEFG', ledger = new AdmissionLedger();
      const firstActivation = deferred(), releaseActivation = deferred();
      const idleStarted = deferred(), releaseIdle = deferred();
      let activations = 0;
      const gate = {
        activate: async (roomCode: string, id: string, version: number) => {
          const accepted = ledger.activate(roomCode, id, now, version);
          if (++activations === 1) { firstActivation.resolve(); await releaseActivation.promise; }
          return accepted;
        },
        idle: async (roomCode: string, id: string, deadline: number, version: number) => {
          idleStarted.resolve();
          if (delayIdle) await releaseIdle.promise;
          ledger.idle(roomCode, id, deadline, version);
        },
        release: async (roomCode: string, id: string) => ledger.release(roomCode, id)
      };
      const data = new Map<string, unknown>(), sockets: Socket[] = [];
      let alarm: number | null = null;
      const storage = {
        get: async (key: string) => structuredClone(data.get(key)),
        put: async (key: string | Record<string, unknown>, value?: unknown) => {
          if (typeof key === 'string') data.set(key, structuredClone(value));
          else for (const [k, v] of Object.entries(key)) data.set(k, structuredClone(v));
        },
        getAlarm: async () => alarm, setAlarm: async (time: number) => { alarm = time; },
        deleteAll: async () => { data.clear(); alarm = null; }
      };
      const ctx = { storage, blockConcurrencyWhile: (f: () => unknown) => f(), getWebSockets: () => sockets.filter(s => s.readyState !== 3), acceptWebSocket: (s: Socket) => sockets.push(s), waitUntil: (_p: Promise<unknown>) => {} };
      const room = new QuarryRoom(ctx, { ADMISSION: { getByName: () => gate } });
      async function join() {
        const admission = ledger.admit(code, 'network-hash', now); assert.ok(admission.ok);
        await room.fetch(new Request('https://worker/rooms/' + code, { headers: { 'X-Quarry-Lease': JSON.stringify(admission.lease) } }));
        return sockets.at(-1)!;
      }
      const player = await join(), abandoned = await join();
      const generation = ledger.state.rooms[code].id;
      const hello = room.webSocketMessage(player, JSON.stringify({ type: 'hello', protocol: 1, name: 'DRIVER', kind: 'coupe' }));
      await firstActivation.promise;
      abandoned.close();
      const closing = room.webSocketClose(abandoned, 1000, 'Left before hello');
      await idleStarted.promise;
      if (!delayIdle) await closing;
      releaseActivation.resolve(); await hello;
      releaseIdle.resolve(); await closing;
      assert.equal(room.room.activeCount, 1);
      assert.equal(room.meta.emptySince, undefined);
      assert.equal(ledger.state.rooms[code].deadline, 1000 + ROOM_LIFETIME_MS,
        'closing a pending peer must not shorten the established active room lease');
      now += EMPTY_ROOM_MS + 1;
      const reconnect = ledger.admit(code, 'another-network', now); assert.ok(reconnect.ok);
      assert.equal(reconnect.lease.id, generation, 'the live room must retain its generation beyond the idle deadline');
    }
  } finally {
    Date.now = originalNow; globalThis.Response = OriginalResponse;
    (globalThis as any).WebSocketPair = originalPair;
    delete (globalThis as any).__quarryAllocations;
  }
});
