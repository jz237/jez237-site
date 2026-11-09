// The world's coarse meshes made in a worker of their own: the step's side
// (MeshAway) and the mesher's (meshServer). The engine's halves are
// world/jobs.rs and mesher/job.rs; the design, docs/design/mesher_worker.md.
//
// After a prepare the engine may have a job: the rows of the chunks an edit
// reached since they were last meshed, as words. It goes to the mesher as it
// is (one ArrayBuffer, transferred), the answer comes back the same way, and
// the next prepare puts its meshes in place. A chunk's mesh is then a frame
// late (two when the answer misses a prepare) and the step never waits for
// it. The mesher is a second instance of the same engine, given no world:
// it keeps the rows it has been sent and nothing else. Nothing a step reads
// passes through here.
//
// The water's output rides with it (engine/src/water/output/doors.rs, the
// water engineer's: the same three doors on each instance, the same
// words): its job is a second buffer in the same message and its answer
// a second buffer in the answer, made by the same second instance.

const NOW = () => performance.now();
// A job unanswered for this long (ms) has no mesher any more: the engine
// makes its meshes itself again, as it does where there is none.
const ANSWER_MS = 3000;
// The fewest cores the browser must report for a mesher to be made. With
// the browser held to two (tools/perf/two_cores.mjs, Broadway coming
// down) the page's thread, the step's worker and the mesher share them:
// what a prepare saved the steps lost again (the worker's work over the
// window 4.8 s with it and without), the page's thread's frames were no
// shorter and its long ones longer (p95 2.6 to 3.5 ms, the longest wait
// between two frames 25 to 35 ms), and more chunks were a frame or two
// late. With four the worker's work was an eighth less.
export const CORES_LEAST = 4;

// The mesher's side. post(message, transfer); returns what takes a message.
export function meshServer(post, now = NOW) {
  let x = null;
  return async (m) => {
    if (m.t === 'boot') {
      const instance = await WebAssembly.instantiate(m.module, { env: { js_now: now } });
      x = instance.exports;
      post({ t: 'ready' }, []);
    } else if (m.t === 'job' && x) {
      const answer = { t: 'answer' }, transfer = [];
      if (m.buf) {
        const bytes = m.buf.byteLength;
        const at = x.vx_mesher_job(bytes >>> 3);
        new Uint8Array(x.memory.buffer, at, bytes).set(new Uint8Array(m.buf));
        const words = x.vx_mesher_run();
        // (Words that were no job: this end is of no use to the other.)
        if (!(words > 0)) throw new Error('the mesher was given words that are no job');
        const from = x.vx_mesher_answer();
        answer.buf = x.memory.buffer.slice(from, from + words * 8);
        transfer.push(answer.buf);
      }
      if (m.water) {
        const bytes = m.water.byteLength;
        const at = x.vx_water_maker_job(bytes >>> 3);
        new Uint8Array(x.memory.buffer, at, bytes).set(new Uint8Array(m.water));
        const words = x.vx_water_maker_run();
        // (No words: the engine takes the job for lost in its own time.)
        if (words > 0) {
          const from = x.vx_water_maker_answer();
          answer.water = x.memory.buffer.slice(from, from + words * 8);
          transfer.push(answer.water);
        }
      }
      post(answer, transfer);
    }
  };
}

// The ways a worker running mesh_worker.js can be had, as for the
// simulation's own (sim_remote.js, waysToWork): from the file, or where a
// page's origin is no file's, from a script of one line that imports it.
export function waysToMesh(base) {
  const script = new URL('./mesh_worker.js', base).href;
  const loader = `import ${JSON.stringify(script)};`;
  return [
    () => new Worker(script, { type: 'module' }),
    () => new Worker(URL.createObjectURL(new Blob([loader], { type: 'text/javascript' })), { type: 'module' }),
    () => new Worker('data:text/javascript,' + encodeURIComponent(loader), { type: 'module' }),
  ];
}

// The step's side: one engine (engine.js) and the mesher it sends its jobs to.
export class MeshAway {
  // opts.trapped(e): the engine itself trapped while an answer was being
  // written into it (whoever owns the engine stops the game as for a trap
  // in a step); opts.now: the clock (ms); opts.what: 'away' (the world's
  // coarse meshes and the water's output: what the switch means),
  // 'meshes' or 'water' (one of the two alone, for a measure).
  constructor(engine, opts = {}) {
    this.engine = engine;
    this.meshes = opts.what !== 'water';
    this.water = opts.what !== 'meshes' && !!engine.x.vx_water_away;
    this._now = opts.now || NOW;
    this._trapped = opts.trapped || null;
    this._worker = null;
    this._ways = [];
    this._module = null;
    // The mesher has said it is ready; if not, why there is none.
    this.on = false;
    this.why = 'not started';
    // Jobs posted and not answered, when the last of them was posted or
    // the last answer came (ms; 0: none is out), and the prepare the last
    // job was made by.
    this._out = 0;
    this._outAt = 0;
    this._outFrame = 0;
    this._frame = 0;
    // Jobs posted, answers brought back, their bytes, how many prepares
    // an answer was late by, summed and at most (1: the next prepare),
    // what the posting and the bringing back took this thread (ms), and
    // how long answers were in coming, from the post to the hearing (ms,
    // summed and at most).
    // (`water`: of the jobs, those that carried one of the water's.)
    this.stats = { jobs: 0, answers: 0, bytesOut: 0, bytesIn: 0, late: 0, latest: 0, ms: 0, wait: 0, waitMost: 0, water: 0 };
  }

  // ways: functions that each return a worker running mesh_worker.js, tried
  // in turn; module: the engine's WebAssembly.Module; cores: as the browser
  // reports them. False, and `why`, where there will be no mesher.
  start(ways, module, cores) {
    if (!(cores >= CORES_LEAST)) return this._off(cores > 1 ? 'fewer than four cores' : 'one core');
    if (!module || !this.engine.x.vx_mesh_away) return this._off('an engine without jobs');
    this._ways = ways.slice();
    this._module = module;
    return this._next('no way to start a worker');
  }

  _off(why) {
    this.on = false;
    this.why = why;
    return false;
  }

  // The next way of having a worker, or none.
  _next(why) {
    while (this._ways.length) {
      const make = this._ways.shift();
      let worker = null;
      try {
        worker = make();
      } catch (e) {
        why = String((e && e.message) || e);
        continue;
      }
      this._worker = worker;
      worker.onmessage = (e) => this._heard(e.data);
      // (Before it is ready: this way of making it was refused, the next
      // may not be. After: it died at work.)
      worker.onerror = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const said = (e && e.message) || 'the mesher failed';
        if (this.on) this.stop(said);
        else {
          worker.terminate();
          this._next(said);
        }
      };
      worker.postMessage({ t: 'boot', module: this._module });
      this.why = 'starting';
      return true;
    }
    return this._off(why);
  }

  // A message from the mesher. Nothing thrown here goes further: a trap of
  // the engine is told to whoever owns it, anything else turns the mesher
  // off and leaves the engine making its meshes itself.
  _heard(m) {
    try {
      this._take(m);
    } catch (e) {
      const trap = typeof WebAssembly !== 'undefined' && e instanceof WebAssembly.RuntimeError;
      if (trap && this._trapped) {
        this._off('the engine trapped');
        this._trapped(e);
      } else {
        try { this.stop(String((e && e.message) || e)); } catch (again) { this._off('the mesher could not be stopped'); }
      }
    }
  }

  _take(m) {
    if (m.t === 'ready') {
      this.on = true;
      this.why = '';
      this._ways = [];
    } else if (m.t === 'answer' && this.on) {
      const x = this.engine.x, t = this._now();
      let bytes = 0;
      // (The engine's memory as it is after each call: room may have grown it.)
      if (m.buf) {
        const at = x.vx_mesh_answer(m.buf.byteLength >>> 3);
        if (at) new Uint8Array(x.memory.buffer, at, m.buf.byteLength).set(new Uint8Array(m.buf));
        bytes += m.buf.byteLength;
      }
      if (m.water && this.water) {
        const at = x.vx_water_answer(m.water.byteLength >>> 3);
        if (at) new Uint8Array(x.memory.buffer, at, m.water.byteLength).set(new Uint8Array(m.water));
        bytes += m.water.byteLength;
      }
      const late = this._frame + 1 - this._outFrame, s = this.stats;
      if (this._outAt > 0) {
        s.wait += t - this._outAt;
        s.waitMost = Math.max(s.waitMost, t - this._outAt);
      }
      this._out = Math.max(0, this._out - 1);
      this._outAt = this._out > 0 ? t : 0;
      s.answers++;
      s.bytesIn += bytes;
      s.late += late;
      s.latest = Math.max(s.latest, late);
      s.ms += this._now() - t;
    } else if (m.t === 'error') {
      if (this.on) this.stop(m.message || 'the mesher failed');
      else if (this._worker) {
        this._worker.terminate();
        this._next(m.message || 'the mesher failed');
      }
    }
  }

  // Whether a job is out whose answer has not been heard: whoever is about
  // to prepare may let the thread take a turn first, so that an answer
  // that has come is in this prepare and not the next.
  get waiting() { return this.on && this._out > 0; }

  // After every prepare, before anything of the engine's memory is looked
  // at (a call here may move it): the job it made goes to the mesher.
  // (A trap of the engine in here is the caller's, as any in a prepare;
  // anything else turns the mesher off.)
  after() {
    this._frame++;
    if (!this.on) return;
    try {
      this._post();
    } catch (e) {
      if (typeof WebAssembly !== 'undefined' && e instanceof WebAssembly.RuntimeError) throw e;
      this.stop(String((e && e.message) || e));
    }
  }

  _post() {
    const x = this.engine.x;
    // (A new world makes its meshes, and its water's output, itself until
    // it is told.)
    const t = this._now(), job = { t: 'job' }, transfer = [];
    if (this.meshes) {
      if (!x.vx_mesh_is_away()) x.vx_mesh_away(1);
      const words = x.vx_mesh_job();
      if (words > 0) {
        const at = x.vx_mesh_job_at();
        job.buf = x.memory.buffer.slice(at, at + words * 8);
        transfer.push(job.buf);
      }
    }
    if (this.water) {
      if (!x.vx_water_is_away()) x.vx_water_away(1);
      const words = x.vx_water_job();
      if (words > 0) {
        const at = x.vx_water_job_at();
        job.water = x.memory.buffer.slice(at, at + words * 8);
        transfer.push(job.water);
        this.stats.water++;
      }
    }
    if (transfer.length) {
      this._out++;
      this._outAt = t;
      this._outFrame = this._frame;
      this.stats.jobs++;
      for (const b of transfer) this.stats.bytesOut += b.byteLength;
      this._worker.postMessage(job, transfer);
      this.stats.ms += this._now() - t;
    } else if (this._outAt > 0 && this._now() - this._outAt > ANSWER_MS) {
      this.stop('the mesher did not answer');
    }
  }

  // No mesher any more: the engine makes its meshes itself from here on,
  // those that were out among them.
  stop(why) {
    if (this.engine.x.vx_mesh_away) this.engine.x.vx_mesh_away(0);
    if (this.water) this.engine.x.vx_water_away(0);
    if (this._worker) this._worker.terminate();
    this._worker = null;
    this._out = 0;
    this._outAt = 0;
    this._off(why);
  }
}
