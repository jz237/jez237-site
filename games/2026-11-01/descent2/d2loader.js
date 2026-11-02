// Descent II in the browser: download hosted resources automatically and cache
// them locally. Optional folder imports remain available for custom copies.

// Bump with every engine or loader release so browsers fetch the new files
const BUILD = '20261102c';
const DB_NAME = 'descent2-web';
const DB_VERSION = 2; // 2 adds the music folder store
const SAVE_DIR = '/home/web_user/.d2x-redux';
const DATA_DIR = '/data';

const CORE_FILES = ['descent2.hog', 'descent2.ham', 'descent2.s11', 'descent2.s22',
  'alien1.pig', 'alien2.pig', 'fire.pig', 'groupa.pig', 'ice.pig', 'water.pig'];
const REQUIRED = ['descent2.hog', 'descent2.ham', 'groupa.pig'];
const OPTIONAL_FILES = ['intro-h.mvl', 'other-h.mvl', 'robots-h.mvl', 'intro-l.mvl', 'other-l.mvl',
  'robots-l.mvl', 'hoard.ham', 'd2x.hog', 'd2x.mn2', 'd2x-h.mvl', 'd2x-l.mvl', 'descent2.sow',
  'descent2.dem'];

const $ = (id) => document.getElementById(id);

// ---------- IndexedDB ----------

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta');
      if (!db.objectStoreNames.contains('music')) db.createObjectStore('music');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idb(db, store, mode, fn) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const result = fn(tx.objectStore(store));
    tx.oncomplete = () => resolve(result && 'result' in result ? result.result : result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted'));
  });
}

const idbGet = (db, store, key) => idb(db, store, 'readonly', (s) => s.get(key));
const idbPut = (db, store, key, value) => idb(db, store, 'readwrite', (s) => s.put(value, key));
const idbClear = (db, store) => idb(db, store, 'readwrite', (s) => s.clear());

// ---------- Collecting the user's files ----------

async function filesFromDrop(dataTransfer) {
  const out = [];
  const walk = async (entry, path) => {
    if (entry.isFile) {
      const file = await new Promise((res, rej) => entry.file(res, rej));
      out.push({ file, path: path + file.name });
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      let batch;
      do {
        batch = await new Promise((res, rej) => reader.readEntries(res, rej));
        for (const e of batch) await walk(e, path + entry.name + '/');
      } while (batch.length);
    }
  };
  const entries = [...dataTransfer.items].map((i) => i.webkitGetAsEntry && i.webkitGetAsEntry()).filter(Boolean);
  if (entries.length) {
    for (const e of entries) await walk(e, '');
  } else {
    for (const f of dataTransfer.files) out.push({ file: f, path: f.name });
  }
  return out;
}

function filesFromInput(fileList) {
  return [...fileList].map((f) => ({ file: f, path: f.webkitRelativePath || f.name }));
}

// Picks the game files out of whatever folder the player chose (Steam, GOG or CD layout).
function classify(items) {
  const byName = new Map();
  const missions = [];
  const demos = [];
  const cueSheets = [];
  const looseTracks = [];
  for (const it of items) {
    const lower = it.path.toLowerCase().replace(/\\/g, '/');
    const name = lower.split('/').pop();
    if (/(^|\/)dosbox\//.test(lower) || name.endsWith('.exe') || name.endsWith('.dll')) continue;
    if (/(^|\/)missions\//.test(lower) && /\.(hog|mn2|msn|rl2|rdl|mvl|txb|ham|pog|pig|s11|s22|sng|hmp|ogg|mp3)$/.test(name)) {
      missions.push({ ...it, name });
      continue;
    }
    if (/(^|\/)demos\//.test(lower) && name.endsWith('.dem')) {
      demos.push({ ...it, name });
      continue;
    }
    if (name.endsWith('.cue') || name.endsWith('.inst')) {
      cueSheets.push({ ...it, name });
      continue;
    }
    const tm = name.match(/^track ?(\d{1,2})\.(ogg|mp3|wav|flac|opus|m4a)$/);
    if (tm) {
      looseTracks.push({ ...it, name, track: parseInt(tm[1], 10) });
      continue;
    }
    // prefer the shortest path (top-level copy) when a name appears twice
    if (!byName.has(name) || it.path.length < byName.get(name).path.length) byName.set(name, { ...it, name });
  }
  return { byName, missions, demos, cueSheets, looseTracks };
}

// ---------- CD audio from the disc image ----------

function parseCue(text) {
  const tracks = [];
  let file = null;
  let cur = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    let m;
    if ((m = line.match(/^FILE\s+"?([^"]+?)"?\s+\w+$/i))) file = m[1];
    else if ((m = line.match(/^TRACK\s+(\d+)\s+(\S+)/i))) {
      cur = { num: parseInt(m[1], 10), mode: m[2].toUpperCase(), file, start: null };
      tracks.push(cur);
    } else if ((m = line.match(/^INDEX\s+01\s+(\d+):(\d+):(\d+)/i)) && cur) {
      cur.start = (parseInt(m[1], 10) * 60 + parseInt(m[2], 10)) * 75 + parseInt(m[3], 10);
    }
  }
  return tracks.filter((t) => t.start !== null);
}

function wavHeader(byteLength) {
  const h = new DataView(new ArrayBuffer(44));
  const str = (o, s) => [...s].forEach((c, i) => h.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF'); h.setUint32(4, 36 + byteLength, true); str(8, 'WAVE');
  str(12, 'fmt '); h.setUint32(16, 16, true); h.setUint16(20, 1, true); h.setUint16(22, 2, true);
  h.setUint32(24, 44100, true); h.setUint32(28, 44100 * 4, true); h.setUint16(32, 4, true);
  h.setUint16(34, 16, true); str(36, 'data'); h.setUint32(40, byteLength, true);
  return h.buffer;
}

// Returns [{track, blob}] for each audio track of the first usable cue sheet.
async function ripCdAudio(found) {
  for (const cue of found.cueSheets) {
    const tracks = parseCue(await cue.file.text());
    if (!tracks.some((t) => t.mode === 'AUDIO')) continue;
    const binName = (tracks[0].file || '').toLowerCase().split(/[\\/]/).pop();
    const bin = found.byName.get(binName);
    if (!bin) continue;
    const totalSectors = Math.floor(bin.file.size / 2352);
    const out = [];
    tracks.forEach((t, i) => {
      if (t.mode !== 'AUDIO') return;
      const end = i + 1 < tracks.length ? tracks[i + 1].start : totalSectors;
      const slice = bin.file.slice(t.start * 2352, end * 2352);
      out.push({ track: t.num, blob: new Blob([wavHeader(slice.size), slice], { type: 'audio/wav' }) });
    });
    if (out.length) return { tracks: out, source: bin.name };
  }
  if (found.looseTracks.length) {
    return { tracks: found.looseTracks.map((t) => ({ track: t.track, blob: t.file })), source: 'track files' };
  }
  return null;
}

// ---------- Import ----------

async function importGame(items, onProgress) {
  const found = classify(items);
  const missing = REQUIRED.filter((n) => !found.byName.has(n));
  if (missing.length) {
    throw new Error(`Those files don't look like Descent II: couldn't find ${missing.join(', ')}. ` +
      'Pick the "descent2" folder inside your Steam "Descent 2" install.');
  }
  const plan = [];
  for (const n of [...CORE_FILES, ...OPTIONAL_FILES]) {
    const f = found.byName.get(n);
    if (f) plan.push({ key: n, path: n, file: f.file });
  }
  for (const f of found.missions) plan.push({ key: 'missions/' + f.name, path: 'missions/' + f.name, file: f.file });
  for (const f of found.demos) plan.push({ key: 'demos/' + f.name, path: 'demos/' + f.name, file: f.file });

  const cd = await ripCdAudio(found);
  const cdPlan = cd ? cd.tracks.map((t) => ({ key: `cd/${String(t.track).padStart(2, '0')}`, track: t.track, file: t.blob })) : [];

  const total = [...plan, ...cdPlan].reduce((a, p) => a + p.file.size, 0);
  let done = 0;
  const db = await openDb();
  await idbClear(db, 'files');
  await idbClear(db, 'meta');
  for (const p of [...plan, ...cdPlan]) {
    onProgress(done / total, p.key.startsWith('cd/') ? `CD audio track ${p.track}` : p.path);
    // copy into memory first so the stored value doesn't depend on the picked file staying readable
    const buf = await p.file.arrayBuffer();
    await idbPut(db, 'files', p.key, new Blob([buf], { type: p.file.type || 'application/octet-stream' }));
    done += p.file.size;
  }
  const manifest = {
    version: 1,
    importedAt: new Date().toISOString(),
    files: plan.map((p) => ({ key: p.key, path: p.path, size: p.file.size })),
    cdTracks: cdPlan.map((p) => ({ key: p.key, track: p.track, size: p.file.size })),
    cdSource: cd ? cd.source : null,
    totalBytes: total,
  };
  await idbPut(db, 'meta', 'manifest', manifest);
  onProgress(1, 'done');
  db.close();
  return manifest;
}

// ---------- Music folder ----------

// The player's own music files (for example D2X-XL's music/d2 folder) for the engine's
// "jukebox" music type: songs by SONG_* number, then the level playlist.
const MUSIC_EXT = { ogg: 'audio/ogg', oga: 'audio/ogg', opus: 'audio/ogg', mp3: 'audio/mpeg',
  flac: 'audio/flac', wav: 'audio/wav', m4a: 'audio/mp4' };
const MUSIC_SONGS = [['title', 'descent'], ['briefing'], ['endlevel', 'exit'], ['endgame', 'ending'], ['credits']];
const MUSIC_SONG_NAMES = ['title', 'briefing', 'level end', 'game end', 'credits'];
const musicExt = (name) => name.slice(name.lastIndexOf('.') + 1);
const levelKey = (i) => `level/${String(i).padStart(3, '0')}`;

async function classifyMusic(items) {
  const all = items.map((it) => {
    const parts = it.path.toLowerCase().replace(/\\/g, '/').split('/');
    return { ...it, dirs: parts.slice(0, -1), dir: parts.slice(0, -1).join('/'), name: parts[parts.length - 1] };
  });
  const base = (n) => n.replace(/\.[^.]+$/, '');
  let audio = all.filter((f) => f.name.includes('.') && musicExt(f.name) in MUSIC_EXT);
  // a D2X-XL music folder keeps the Descent 1 and Descent II sets in d1/ and d2/
  const d2 = audio.filter((f) => f.dirs.includes('d2'));
  const notD1 = audio.filter((f) => !f.dirs.includes('d1'));
  audio = d2.length ? d2 : notD1.length ? notD1 : audio;
  if (!audio.length) throw new Error('That folder has no music files (OGG, MP3, FLAC, WAV, Opus or M4A).');
  const songs = MUSIC_SONGS.map((names) => audio.find((f) => names.includes(base(f.name))) || null);
  const rest = audio.filter((f) => !songs.includes(f))
    .sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }));
  // a playlist next to the music sets the level order (and which files play)
  let levels = [];
  const dirs = new Set(audio.map((f) => f.dir));
  const playlist = all.find((f) => /^playlist\.(txt|m3u8?)$/.test(f.name) && dirs.has(f.dir));
  if (playlist) {
    for (const line of (await playlist.file.text()).split(/\r?\n/)) {
      const name = line.trim().toLowerCase().replace(/\\/g, '/').split('/').pop();
      const f = name && !name.startsWith('#') && rest.find((r) => r.name === name);
      if (f && !levels.includes(f)) levels.push(f);
    }
  }
  const fromPlaylist = levels.length > 0;
  if (!fromPlaylist) levels = rest;
  return { songs, levels, playlist: fromPlaylist };
}

async function importMusic(items, onProgress) {
  const set = await classifyMusic(items);
  const plan = [
    ...set.songs.map((f, i) => f && { key: `song/${i}`, f }),
    ...set.levels.map((f, i) => ({ key: levelKey(i), f })),
  ].filter(Boolean);
  const total = plan.reduce((a, p) => a + p.f.file.size, 0);
  let done = 0;
  const db = await openDb();
  try {
    await idbClear(db, 'music');
    for (const p of plan) {
      onProgress(done / total, p.f.name);
      const buf = await p.f.file.arrayBuffer();
      await idbPut(db, 'music', p.key, new Blob([buf], { type: MUSIC_EXT[musicExt(p.f.name)] }));
      done += p.f.file.size;
    }
    const index = {
      version: 1,
      importedAt: new Date().toISOString(),
      songs: set.songs.map((f) => (f ? f.name : null)),
      levels: set.levels.map((f) => f.name),
      playlist: set.playlist,
      totalBytes: total,
    };
    await idbPut(db, 'music', 'index', index);
    onProgress(1, 'done');
    return index;
  } catch (e) {
    await idbClear(db, 'music').catch(() => {});
    throw e;
  } finally {
    db.close();
  }
}

async function withDb(fn) {
  const db = await openDb();
  try {
    return await fn(db);
  } finally {
    db.close();
  }
}
const musicIndex = () => withDb((db) => idbGet(db, 'music', 'index')).then((i) => i || null);
const removeMusic = () => withDb((db) => idbClear(db, 'music'));

// Object URLs for the engine (Module.d2music), or null without a stored folder.
async function loadMusicFolder(db) {
  const index = await idbGet(db, 'music', 'index');
  if (!index) return null;
  const url = async (key) => {
    const blob = await idbGet(db, 'music', key);
    return blob ? URL.createObjectURL(blob) : null;
  };
  const songs = [];
  for (let i = 0; i < MUSIC_SONGS.length; i++) songs[i] = index.songs[i] ? await url(`song/${i}`) : null;
  const levels = [];
  for (let i = 0; i < index.levels.length; i++) {
    const u = await url(levelKey(i));
    if (u) levels.push(u);
  }
  return songs.some(Boolean) || levels.length ? { songs, levels } : null;
}

function describeMusic(index) {
  const songs = MUSIC_SONG_NAMES.filter((_, i) => index.songs[i]);
  return `${index.levels.length} level track${index.levels.length === 1 ? '' : 's'}` +
    (index.playlist ? ' (in playlist order)' : '') +
    (songs.length ? ` + ${songs.join(', ')}` : '') + ` · ${fmtBytes(index.totalBytes)}`;
}

// ---------- Settings ----------

const SETTINGS_KEY = 'descent2-web-settings';
function loadSettings() {
  const defaults = { quality: 'native', msaa: true, music: 'cd' };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch {
    return defaults;
  }
}
function saveSettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch {}
}

function renderResolution(quality) {
  const dpr = window.devicePixelRatio || 1;
  // full-screen size; embedded/hidden views can report a zero screen, so fall back to the window
  let w = Math.round((screen.width || window.innerWidth || 1280) * dpr);
  let h = Math.round((screen.height || window.innerHeight || 720) * dpr);
  const caps = { native: Infinity, '1440': 1440, '1080': 1080, '720': 720 };
  const cap = caps[quality] || Infinity;
  if (h > cap) {
    w = Math.round((w * cap) / h);
    h = cap;
  }
  w -= w % 2;
  return { w, h };
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// D2X music types: 0 none, 1 built-in (the game's MIDI songs), 2 CD audio, 3 music folder
const MUSIC_TYPES = { off: 0, midi: 1, cd: 2, folder: 3 };

function buildConfig(existing, settings, haveCd, haveFolder) {
  const { w, h } = renderResolution(settings.quality);
  const g = gcd(w, h);
  const forced = {
    ResolutionX: w,
    ResolutionY: h,
    AspectX: h / g, // D2X stores the aspect ratio as height:width in these keys
    AspectY: w / g,
    WindowMode: 0,
    Multisample: settings.msaa ? 1 : 0,
    VSync: 1,
    OrigTrackOrder: 1,
  };
  const defaults = { DigiVolume: 8, MusicVolume: 6, TexFilt: 3, MovieTexFilt: 1, MovieSubtitles: 0,
    FPSIndicator: 0, Grabinput: 1, GammaLevel: 0, ClassicDepth: 0 };
  const kv = new Map();
  if (existing) {
    for (const line of existing.split(/\r?\n/)) {
      const i = line.indexOf('=');
      if (i > 0) kv.set(line.slice(0, i), line.slice(i + 1));
    }
  }
  for (const [k, v] of Object.entries(defaults)) if (!kv.has(k)) kv.set(k, String(v));
  // The in-game Sound menu can switch music too: keep that choice unless the page's own
  // Music setting changed since the last start.
  const inGame = Number(kv.get('MusicType'));
  if (settings.musicWritten !== undefined && inGame !== settings.musicWritten) {
    const name = Object.keys(MUSIC_TYPES).find((k) => MUSIC_TYPES[k] === inGame);
    if (name) settings.music = name;
  }
  let music = settings.music in MUSIC_TYPES ? settings.music : 'cd';
  if (music === 'folder' && !haveFolder) music = 'cd';
  if (music === 'cd' && !haveCd) music = 'midi';
  forced.MusicType = MUSIC_TYPES[music];
  settings.musicWritten = forced.MusicType;
  for (const [k, v] of Object.entries(forced)) kv.set(k, String(v));
  return { text: [...kv].map(([k, v]) => `${k}=${v}`).join('\n') + '\n', w, h };
}

// ---------- Boot ----------

async function loadHostedManifest() {
  const response = await fetch(`data/manifest.json?v=${BUILD}`);
  if (!response.ok) throw new Error('Game files are temporarily unavailable. Reload to try again.');
  const manifest = await response.json();
  if (manifest.source !== 'hosted' || !REQUIRED.every(name => manifest.files.some(f => f.path === name))) {
    throw new Error('The game download is incomplete. Reload to try again.');
  }
  return manifest;
}

async function hostedFile(file, db, onBytes) {
  // Cache each complete file separately so interrupted downloads can resume.
  const cached = db ? await idbGet(db, 'files', file.key).catch(() => null) : null;
  if (cached && cached.size === file.size) {
    onBytes(file.size);
    return new Uint8Array(await cached.arrayBuffer());
  }
  const data = new Uint8Array(file.size);
  let offset = 0;
  for (const part of file.parts) {
    const response = await fetch(part.url);
    if (!response.ok) throw new Error(`Could not download ${file.path}. Press Play to retry.`);
    const reader = response.body.getReader();
    let received = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (received + value.length > part.size || offset + value.length > data.length) {
        await reader.cancel();
        throw new Error(`Invalid download for ${file.path}. Press Play to retry.`);
      }
      data.set(value, offset);
      offset += value.length;
      received += value.length;
      onBytes(value.length);
    }
    if (received !== part.size) throw new Error(`Download interrupted: ${file.path}. Press Play to retry.`);
  }
  const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', data))]
    .map(n => n.toString(16).padStart(2, '0')).join('');
  if (offset !== file.size || digest !== file.sha256) {
    throw new Error(`Download verification failed: ${file.path}. Press Play to retry.`);
  }
  // Storage quotas/private browsing must not prevent playing a downloaded copy.
  if (db) await idbPut(db, 'files', file.key, new Blob([data])).catch(e => console.warn('Game cache unavailable', e));
  return data;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not load ' + src));
    document.body.appendChild(s);
  });
}

async function bootGame(manifest, ui) {
  const settings = loadSettings();
  const hosted = manifest.source === 'hosted';
  const db = await openDb().catch(e => { if (!hosted) throw e; return null; });
  ui.status('Loading game files…');
  const fileData = [];
  let loaded = 0;
  const cdTracks = [];
  let music = null;
  try {
    for (const f of manifest.files) {
      ui.status(`Loading ${f.path}…`);
      let data;
      if (hosted) {
        data = await hostedFile(f, db, bytes => {
          loaded += bytes;
          ui.progress(loaded / manifest.totalBytes);
        });
      } else {
        const blob = await idbGet(db, 'files', f.key);
        if (!blob) throw new Error(`Stored file ${f.path} is missing. Import your game files again.`);
        data = new Uint8Array(await blob.arrayBuffer());
        loaded += f.size;
        ui.progress(loaded / manifest.totalBytes);
      }
      fileData.push({ path: f.path, data });
    }
    for (const t of manifest.cdTracks) {
      if (hosted) cdTracks[t.track] = t.url;
      else {
        const blob = await idbGet(db, 'files', t.key);
        if (blob) cdTracks[t.track] = URL.createObjectURL(blob);
      }
    }
    if (db) music = await loadMusicFolder(db).catch((e) => { console.warn('Music folder unavailable', e); return null; });
  } finally {
    if (db) db.close();
  }
  if (cdTracks.length) for (let i = 0; i < cdTracks.length; i++) if (!cdTracks[i]) cdTracks[i] = null;

  ui.status('Starting the engine…');
  const canvas = $('canvas');
  window.Module = {
    canvas,
    d2cd: { tracks: cdTracks },
    d2music: music,
    d2midi: midiPlayer(),
    print: (t) => console.log(t),
    printErr: (t) => console.warn(t),
    onGameMessage: (text, isError) => ui.message(text, isError),
    // Quit from the game menu: saves are already flushed, so start fresh at the page
    onQuit: () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      location.reload();
    },
    locateFile: (p) => `${p}?v=${BUILD}`,
    preRun: [
      () => {
        const FS = Module.FS;
        FS.mkdirTree(DATA_DIR);
        for (const f of fileData) {
          const dir = f.path.includes('/') ? DATA_DIR + '/' + f.path.split('/').slice(0, -1).join('/') : null;
          if (dir) FS.mkdirTree(dir);
          FS.writeFile(DATA_DIR + '/' + f.path, f.data);
        }
        fileData.length = 0;
        FS.mkdirTree(SAVE_DIR);
        FS.mount(Module.IDBFS, {}, SAVE_DIR);
        Module.addRunDependency('savegames');
        FS.syncfs(true, (err) => {
          if (err) console.warn('Could not read saved games', err);
          const cfgPath = SAVE_DIR + '/descent.cfg';
          let existing = null;
          try { existing = FS.readFile(cfgPath, { encoding: 'utf8' }); } catch {}
          const cfg = buildConfig(existing, settings, cdTracks.length > 0, !!music);
          saveSettings(settings);
          FS.writeFile(cfgPath, cfg.text);
          canvas.width = cfg.w;
          canvas.height = cfg.h;
          Module.removeRunDependency('savegames');
        });
      },
    ],
    onRuntimeInitialized: () => {
      ui.started();
      // WebGL lacks texture-level queries and the tiny GL 1.x internal formats
      Module.callMain(['-hogdir', DATA_DIR, '-gl_gettexlevelparam_ok', '0', '-gl_intensity4_ok', '0',
        '-gl_luminance4_alpha4_ok', '0', '-gl_rgba2_ok', '0']);
      startSaveSync();
      // fetch the MIDI sound bank in the background so its music starts without a wait
      if (settings.music === 'midi' || settings.music === 'cd') Module.d2midi.load();
    },
    onAbort: (what) => ui.message('The game stopped unexpectedly: ' + what, true),
  };
  // FS/IDBFS are exported on Module once the runtime script runs
  await loadScript(`d2x.js?v=${BUILD}`);
  Module.FS = Module.FS || window.FS;
}

// The engine's MIDI songs play through a General MIDI soft synth that loads on demand
// (synth/d2synth.js + an 8 MB sound bank). Calls queue in order on the module import.
function midiPlayer() {
  let mod = null;
  const get = () => (mod ||= import(`./synth/d2synth.js?v=${BUILD}`));
  const call = (fn) => get().then(fn).catch((e) => console.warn('MIDI music unavailable', e));
  return {
    load: () => call((m) => m.load()),
    play: (bytes, loop) => call((m) => m.play(bytes, loop)),
    stop: () => call((m) => m.stop()),
    pause: () => call((m) => m.pause()),
    resume: () => call((m) => m.resume()),
    toggle: () => call((m) => m.toggle()),
    volume: (v) => call((m) => m.setVolume(v)),
    status: () => get().then((m) => m.status()),
  };
}

function startSaveSync() {
  let busy = false;
  const sync = () => {
    if (busy || !Module.FS) return;
    busy = true;
    Module.FS.syncfs(false, (err) => {
      busy = false;
      if (err) console.warn('Saving to browser storage failed', err);
    });
  };
  setInterval(sync, 5000);
  document.addEventListener('visibilitychange', () => { if (document.hidden) sync(); });
  window.addEventListener('pagehide', sync);
}

// ---------- UI wiring ----------

function fmtBytes(n) {
  return n > 1e9 ? (n / 1e9).toFixed(2) + ' GB' : (n / 1e6).toFixed(0) + ' MB';
}

async function main() {
  const ui = {
    status: (t) => { $('status').textContent = t; },
    progress: (f) => { $('bar').style.width = Math.round(f * 100) + '%'; },
    message: (text, isError) => {
      const el = $('message');
      el.textContent = text;
      el.className = isError ? 'message error' : 'message';
      el.hidden = false;
      if (!isError) setTimeout(() => { el.hidden = true; }, 6000);
    },
    started: () => {
      document.body.classList.add('playing');
      $('canvas').focus();
      // Keep browser shortcuts (F5 reload, F1 help, Ctrl+key, Tab focus…) from firing mid-game.
      // Plain printable keys still reach the browser so the game gets their typed characters.
      window.addEventListener('keydown', (e) => {
        if (e.key === 'F11') return;
        const printable = e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey;
        if (!printable || e.key === ' ') e.preventDefault();
      }, true);
    },
  };

  const settings = loadSettings();
  $('quality').value = settings.quality;
  $('msaa').checked = settings.msaa;
  $('music').value = settings.music;
  $('music').addEventListener('change', () => {
    settings.music = $('music').value;
    delete settings.musicWritten; // the page's choice wins over the last in-game one
    saveSettings(settings);
  });
  // The music folder is stored apart from the game files, so it survives a game re-import.
  const showMusic = (index) => {
    $('musicFolderOption').hidden = $('musicFolderOption').disabled = !index;
    $('music').value = index || settings.music !== 'folder' ? settings.music : 'cd';
    $('musicInfo').textContent = index ? 'Music folder: ' + describeMusic(index) + ', stored in this browser.'
      : 'Have Descent II music files, like the D2X-XL music folder? Load them to play them in the game.';
    $('musicRemove').hidden = !index;
  };
  showMusic(await musicIndex().catch(() => null));
  $('musicFolder').addEventListener('change', async (ev) => {
    if (!ev.target.files.length) return;
    $('musicBusy').hidden = false;
    $('message').hidden = true;
    try {
      if (navigator.storage && navigator.storage.persist) await navigator.storage.persist();
      const index = await importMusic(filesFromInput(ev.target.files), (f, label) => {
        $('musicBar').style.width = Math.round(f * 100) + '%';
        $('musicLabel').textContent = label === 'done' ? 'Done' : 'Storing ' + label;
      });
      settings.music = 'folder';
      delete settings.musicWritten;
      saveSettings(settings);
      showMusic(index);
      ui.message('Music folder stored. The game will play it.');
    } catch (e) {
      ui.message(e.message, true);
    } finally {
      $('musicBusy').hidden = true;
      ev.target.value = '';
    }
  });
  $('musicRemove').addEventListener('click', async () => {
    try {
      await removeMusic();
    } catch (e) {
      ui.message(e.message, true);
      return;
    }
    if (settings.music === 'folder') {
      settings.music = 'cd';
      delete settings.musicWritten;
      saveSettings(settings);
    }
    showMusic(null);
  });
  $('quality').addEventListener('change', () => { settings.quality = $('quality').value; saveSettings(settings); updateResLabel(); });
  $('msaa').addEventListener('change', () => { settings.msaa = $('msaa').checked; saveSettings(settings); });
  const updateResLabel = () => {
    const { w, h } = renderResolution(settings.quality);
    $('reslabel').textContent = `${w} × ${h}`;
  };
  updateResLabel();

  let manifest = null;
  let hostedManifest = null;
  try {
    hostedManifest = await loadHostedManifest();
    manifest = hostedManifest;
  } catch (e) {
    ui.message(e.message, true);
    $('readyInfo').textContent = 'Unable to load game files. Reload this page to retry.';
    $('play').disabled = true;
  }

  const showReady = (m) => {
    manifest = m;
    $('importPanel').hidden = true;
    $('readyPanel').hidden = false;
    $('readyInfo').textContent = (m.source === 'hosted' ? 'No setup needed · ' : '') + `${m.files.length} game files (${fmtBytes(m.totalBytes)})` +
      (m.cdTracks.length ? ` · ${m.cdTracks.length} CD music tracks` : ' · no CD tracks, so the original MIDI music plays');
    $('play').disabled = false;
  };
  const showImport = () => {
    $('importPanel').hidden = false;
    $('readyPanel').hidden = true;
  };
  if (manifest) showReady(manifest); else $('readyPanel').hidden = false;

  const runImport = async (items) => {
    $('importBusy').hidden = false;
    $('message').hidden = true;
    try {
      if (navigator.storage && navigator.storage.persist) await navigator.storage.persist();
      const m = await importGame(items, (f, label) => {
        $('importBar').style.width = Math.round(f * 100) + '%';
        $('importLabel').textContent = label === 'done' ? 'Done' : 'Storing ' + label;
      });
      showReady(m);
    } catch (e) {
      ui.message(e.message, true);
    } finally {
      $('importBusy').hidden = true;
    }
  };

  $('folder').addEventListener('change', (e) => { if (e.target.files.length) runImport(filesFromInput(e.target.files)); });
  const drop = $('drop');
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', async (e) => {
    e.preventDefault();
    drop.classList.remove('over');
    runImport(await filesFromDrop(e.dataTransfer));
  });

  $('reimport').addEventListener('click', showImport);
  $('cancelImport').addEventListener('click', () => {
    if (hostedManifest) showReady(hostedManifest);
    else { $('importPanel').hidden = true; $('readyPanel').hidden = false; }
  });
  $('play').addEventListener('click', async () => {
    $('play').disabled = true;
    $('loadPanel').hidden = false;
    $('readyPanel').hidden = true;
    $('message').hidden = true;
    ui.progress(0);
    try {
      await bootGame(manifest, ui);
    } catch (e) {
      ui.message(e.message, true);
      $('play').disabled = false;
      $('loadPanel').hidden = true;
      $('readyPanel').hidden = false;
    }
  });

  // Flight controls want the mouse captured; Esc releases it (browser rule).
  const canvas = $('canvas');
  canvas.addEventListener('click', () => {
    if (document.pointerLockElement !== canvas && canvas.requestPointerLock) canvas.requestPointerLock();
  });
  $('fullscreen').addEventListener('click', async () => {
    const stage = $('stage');
    if (!document.fullscreenElement) {
      await stage.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
      // In fullscreen Chrome/Edge can hand every key to the game (Esc, Ctrl+W…); hold Esc to leave
      if (navigator.keyboard && navigator.keyboard.lock) navigator.keyboard.lock().catch(() => {});
      canvas.requestPointerLock && canvas.requestPointerLock();
    } else {
      document.exitFullscreen();
    }
  });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && navigator.keyboard && navigator.keyboard.unlock) navigator.keyboard.unlock();
  });
}

main();
