// Original Amiga playback runs away from the render/physics thread.
let emu;
const files = new Map();
self.startsWith = (a, b) => a.startsWith(b);
self.startsWith2 = (a, b) => b.find((v) => a.startsWith(v)) ?? null;
self.window = {
  String,
  console,
  ScriptNodePlayer: {
    getInstance: () => ({
      isReady: () => true,
      _fileRequestCallback: (p) => (files.has(emu.UTF8ToString(p)) ? 0 : -1),
      _fileSizeRequestCallback: (p) =>
        files.get(emu.UTF8ToString(p))?.length ?? 0,
      _songUpdateCallback() {},
      setFileData: (name, data) => files.set(name, data),
    }),
  },
};
const root = "./";
const version = "20260917-csp2";
const asset = (path) => root + path + "?v=" + version;
importScripts(asset("renderer-csp2.js"));
const call = (n, t = [], a = []) => emu.ccall(n, "number", t, a);
async function bytes(path) {
  const response = await fetch(asset(path));
  if (!response.ok) throw Error(`Music asset unavailable: ${path}`);
  return new Uint8Array(await response.arrayBuffer());
}
function put(path, data) {
  const split = path.lastIndexOf("/"),
    dir = path.slice(0, split);
  emu.FS_createPath("/", dir, true, true);
  emu.FS_createDataFile(dir, path.slice(split + 1), data, true, true);
  files.set(path, data);
}
async function init(cue) {
  emu = await createUADE({
    wasmBinary: await bytes("renderer-csp2.wasm"),
    print() {},
    printErr() {},
  });
  const response = await fetch(asset("files.json"));
  const listing = await response.json();
  await Promise.all(
    Object.entries(listing).map(async ([name, path]) =>
      put(name, await bytes(path)),
    ),
  );
  const data = await bytes("cust." + cue.module);
  const pattern = [0xc0, 0xfc, 0, 5, 0x80, 0xfc, 0, 6];
  let count = 0;
  for (let i = 0; i <= data.length - pattern.length; i++)
    if (pattern.every((n, j) => data[i + j] === n)) {
      data[i + 3] = 6;
      count++;
    }
  if (count !== 1) throw Error("Original music PAL timer signature mismatch");
  put("/songs/cust." + cue.module, data);
  if (
    call("emu_prepare", ["string"], ["/uade"]) !== 0 ||
    call(
      "emu_load_file",
      ["number", "string", "string", "number"],
      [44100, "/songs", "cust." + cue.module, 1],
    ) !== 0
  )
    throw Error("Amiga music could not load");
  if (call("emu_set_subsong", ["number"], [cue.subsong]) !== 0)
    throw Error("Amiga music cue unavailable");
  call("emu_set_panning", ["number"], [-1]);
}
function chunk() {
  const pieces = [];
  let frames = 0;
  while (frames < 44100) {
    if (call("emu_compute_audio_samples") !== 0)
      throw Error("Amiga music sequencer stopped");
    const pointer = call("emu_get_audio_buffer"),
      count = call("emu_get_audio_buffer_length");
    if (!count) throw Error("Empty Amiga music buffer");
    pieces.push(new Int16Array(emu.HEAPU8.buffer, pointer, count * 2).slice());
    frames += count;
  }
  const pcm = new Int16Array(frames * 2);
  let offset = 0;
  for (const piece of pieces) {
    pcm.set(piece, offset);
    offset += piece.length;
  }
  self.postMessage({ pcm: pcm.buffer, frames, rate: 44100 }, [pcm.buffer]);
}
let queue = Promise.resolve();
self.onmessage = ({ data }) => {
  queue = queue
    .then(async () => {
      if (data.cue) await init(data.cue);
      chunk();
    })
    .catch((error) => self.postMessage({ error: error.message }));
};
