"use strict";
// Reuse the original movie archives by reading only overlapping gzip parcels.
function astraMovieLibrary(readParcel) {
  let indexReady, lastFile, lastChunk;
  const ready = () => indexReady ||= script("payload/movie-index24.js").catch(error => {
    indexReady = null;
    throw error;
  });
  return async function loadMovie(requested) {
    const name = requested.toLowerCase();
    if (!/^[a-z0-9_-]+\.mve$/.test(name)) return false;
    await ready();
    const {movies, offsets, files} = window.astraMovieIndex;
    const entry = movies[name];
    if (!entry) return false;
    const path = "/mine/" + name.toUpperCase();
    const fs = Module.FS;
    if (fs.analyzePath(path).exists) return true;
    const [start, size] = entry, end = start + size;
    const first = offsets.findIndex((offset, i) => offset <= start && offsets[i + 1] > start);
    if (first < 0 || end > offsets.at(-1)) throw Error("Invalid movie range for " + name);
    const result = new Uint8Array(size);
    let written = 0;
    window.astraTerminal?.loading(true);
    try {
      for (let i = first; offsets[i] < end; i++) {
        $("status").textContent = "Loading cinematic · " + Math.floor(100 * written / size) + "%";
        if (lastChunk?.i !== i) {
          const zipped = await readParcel(files[i]);
          const stream = zipped.pipeThrough(new DecompressionStream("gzip"));
          const data = new Uint8Array(await new Response(stream).arrayBuffer());
          if (data.length !== offsets[i + 1] - offsets[i]) throw Error("Incomplete movie parcel");
          lastChunk = {i, data};
        }
        const lo = Math.max(start - offsets[i], 0);
        const hi = Math.min(end - offsets[i], lastChunk.data.length);
        result.set(lastChunk.data.subarray(lo, hi), written);
        written += hi - lo;
      }
      if (written !== size) throw Error("Incomplete cinematic " + name);
      fs.writeFile(path, result, {canOwn: true});
      if (lastFile && lastFile !== path && fs.analyzePath(lastFile).exists) fs.unlink(lastFile);
      lastFile = path;
      return true;
    } finally {
      window.astraTerminal?.loading(false);
    }
  };
}

// Each pair contains the existing color and normal PNGs, byte for byte.
// Keep one backing buffer for all the Descent names that use the same image.
function astraMaterialLibrary(catalog) {
  const groups = new Map(), aliases = new Map(), families = new Map();
  const loaded = new Set(), pending = new Map();
  let generation = 0;
  for (const [group, entries] of Object.entries(catalog.materials)) {
    for (const [name] of entries) groups.set(name, group);
  }
  for (const [name, image] of Object.entries(window.astraAliases)) {
    if (!groups.has(image)) continue;
    if (!aliases.has(image)) aliases.set(image, []);
    aliases.get(image).push(name + ".png");
    const family = name.split("#")[0];
    if (!families.has(family)) families.set(family, new Set());
    families.get(family).add(groups.get(image));
  }
  function groupFor(name) {
    return groups.get(name) || groups.get(window.astraAliases[name.replace(/\.png$/, "")]);
  }
  async function install(group) {
    const response = await fetch("payload/stream24/" + group);
    if (!response.ok) throw Error("Could not load mine material " + group);
    const bytes = new Uint8Array(await response.arrayBuffer()), entries = catalog.materials[group];
    const length = entries.reduce((total, entry) => total + entry[1], 0);
    if (length !== bytes.length) throw Error("Incomplete mine material " + group);
    let offset = 0;
    for (const [name, size] of entries) {
      const image = bytes.subarray(offset, offset + size);
      Module.FS.writeFile("/mine/" + name, image, {canOwn: true});
      for (const alias of aliases.get(name) || []) {
        Module.FS.writeFile("/mine/" + alias, image, {canOwn: true});
      }
      offset += size;
    }
    loaded.add(group);
  }
  function load(group) {
    if (!group || loaded.has(group)) return Promise.resolve();
    if (!pending.has(group)) pending.set(group, install(group).finally(() => pending.delete(group)));
    return pending.get(group);
  }
  function batches(names) {
    const result = new Set();
    for (const name of names) {
      for (const group of families.get(name.split("#")[0]) || []) result.add(group);
    }
    return result;
  }
  function warmAfterFlight(names, version, firstFrame) {
    const groups = [...batches(names)].filter(group => !loaded.has(group));
    if (!groups.length) return;
    async function warm() {
      if (generation !== version) return;
      if ((Module.environmentFrames || 0) <= firstFrame && !window.astraPreview?.active) {
        setTimeout(warm, 250);
        return;
      }
      try {
        for (const group of groups) {
          if (generation !== version) return;
          await load(group);
        }
      } catch (error) { console.warn("Deferred robot material:", error.message); }
    }
    setTimeout(warm, 1000);
  }
  return {
    knows(name) { return !!groupFor(name); },
    async image(name) { await load(groupFor(name)); },
    async level(bitmapNames, robotNames) {
      const version = ++generation, firstFrame = Module.environmentFrames || 0;
      const wanted = batches(bitmapNames);
      wanted.add(groups.get("forge.png"));
      for (const name of ["m020.png","m006.png"]) wanted.add(groups.get(name));
      const queue = [...wanted].filter(group => group && !loaded.has(group));
      warmAfterFlight(robotNames, version, firstFrame);
      if (!queue.length) return;
      let next = 0, done = 0;
      window.astraTerminal?.loading(true);
      const progress = () => $("status").textContent = "Preparing this mine’s materials · " + done + " / " + queue.length;
      progress();
      async function worker() {
        while (next < queue.length) {
          await load(queue[next++]);
          done++; progress();
        }
      }
      try { await Promise.all(Array.from({length: Math.min(6, queue.length)}, worker)); }
      finally { window.astraTerminal?.loading(false); }
    }
  };
}
